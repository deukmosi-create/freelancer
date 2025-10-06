from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied  # ← ADDED
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import User, Task, Application, Bookmark, Message, Notification
from .serializers import (
    RegisterSerializer, UserSerializer, ProfileUpdateSerializer,
    PaymentDetailsSerializer, TaskSerializer, ApplicationSerializer,
    BookmarkSerializer, MessageSerializer, NotificationSerializer
)

# ------------------ AUTH ------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(username=email, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def firebase_login(request):
    """
    Firebase ID token login.
    Expects: { "idToken": "ey..." }
    """
    id_token = request.data.get('idToken')
    if not id_token:
        return Response({'error': 'idToken is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        import firebase_admin
        from firebase_admin import auth as firebase_auth
        decoded_token = firebase_auth.verify_id_token(id_token)
        firebase_uid = decoded_token['uid']
        email = decoded_token.get('email')
        name = decoded_token.get('name', '')
        first_name = ''
        last_name = ''

        if name:
            name_parts = name.split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''

        if not email:
            return Response({'error': 'Email not provided by provider'}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'oauth_provider': 'firebase',
            }
        )

        if not created and not user.oauth_provider:
            user.oauth_provider = 'firebase'
            user.save()

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })

    except Exception as e:
        print(f"Firebase login error: {str(e)}")
        return Response({'error': 'Authentication failed'}, status=status.HTTP_400_BAD_REQUEST)

# ------------------ PROFILE ------------------
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    if request.method == 'GET':
        return Response(UserSerializer(user).data)
    elif request.method == 'PATCH':
        serializer = ProfileUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ------------------ PAYMENT ------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_payment_details(request):
    user = request.user
    serializer = PaymentDetailsSerializer(user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ------------------ ACTIVATION ------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def activate_account(request):
    user = request.user
    if not user.payment_method or not user.payment_identifier:
        return Response(
            {'error': 'Payment details required before activation'},
            status=status.HTTP_400_BAD_REQUEST
        )
    user.is_activated = True
    user.save()
    return Response({'message': 'Account activated successfully', 'is_activated': True})

# ------------------ DASHBOARD ------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    user = request.user
    applications = Application.objects.filter(freelancer=user).count()
    return Response({
        'profile': UserSerializer(user).data,
        'earnings': 0,
        'applications_count': applications,
        'is_activated': user.is_activated
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications_view(request):
    notifications = request.user.notifications.filter(is_read=False)
    return Response(NotificationSerializer(notifications, many=True).data)

# ------------------ TASKS ------------------
class TaskListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_activated:
            raise PermissionDenied("Account not activated")  # ← FIXED: Now raises 403
        return Task.objects.all()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):
    if not request.user.is_activated:
        return Response({'error': 'Account not activated'}, status=status.HTTP_403_FORBIDDEN)
    task = get_object_or_404(Task, pk=pk)
    return Response(TaskSerializer(task).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_to_task(request, task_id):
    if not request.user.is_activated:
        return Response({'error': 'Account not activated'}, status=status.HTTP_403_FORBIDDEN)
    task = get_object_or_404(Task, pk=task_id)
    Application.objects.get_or_create(freelancer=request.user, task=task)
    return Response({'status': 'Applied'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bookmark_task(request, task_id):
    task = get_object_or_404(Task, pk=task_id)
    Bookmark.objects.get_or_create(user=request.user, task=task)
    return Response({'status': 'Bookmarked'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bookmarked_tasks(request):
    bookmarks = Bookmark.objects.filter(user=request.user).select_related('task')
    tasks = [b.task for b in bookmarks]
    return Response(TaskSerializer(tasks, many=True).data)

# ------------------ MESSAGING ------------------
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def messages_view(request):
    if request.method == 'GET':
        messages = Message.objects.filter(
            Q(sender=request.user) | Q(receiver=request.user)
        ).order_by('timestamp')
        return Response(MessageSerializer(messages, many=True).data)
    elif request.method == 'POST':
        data = request.data.copy()
        data['sender'] = request.user.id
        serializer = MessageSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ------------------ UTILITIES ------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_activation(request):
    return Response({'is_activated': request.user.is_activated})