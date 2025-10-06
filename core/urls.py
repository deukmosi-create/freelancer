from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.login_view),
    path('auth/register/', views.register_view),
    path('auth/firebase/', views.firebase_login),  # ← NEW
    path('profile/', views.profile_view),
    path('payment/save/', views.save_payment_details),
    path('activate/', views.activate_account),
    path('dashboard/', views.dashboard_view),
    path('notifications/', views.notifications_view),
    path('tasks/', views.TaskListView.as_view()),
    path('tasks/<int:pk>/', views.task_detail),
    path('tasks/<int:task_id>/apply/', views.apply_to_task),
    path('tasks/<int:task_id>/bookmark/', views.bookmark_task),
    path('tasks/bookmarked/', views.bookmarked_tasks),
    path('messages/', views.messages_view),
    path('check-activation/', views.check_activation),
    path('mpesa/initiate/', views.initiate_mpesa_payment),
    path('mpesa/confirmation/', views.mpesa_confirmation),  # Must be public
]
