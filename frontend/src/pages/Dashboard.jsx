// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // ✅ Use centralized API client
import { 
  BriefcaseIcon, 
  ChatBubbleLeftRightIcon, 
  CurrencyDollarIcon, 
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ tasks: 0, messages: 0, payments: 0 });
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, tasksRes, messagesRes, notifRes] = await Promise.all([
          api.get('/api/profile/'),        // ✅
          api.get('/api/tasks/'),          // ✅
          api.get('/api/messages/'),       // ✅
          api.get('/api/notifications/')   // ✅
        ]);
        setUser(profileRes.data);
        setStats({
          tasks: tasksRes.data.length,
          messages: messagesRes.data.length,
          payments: 0
        });
        setNotifications(notifRes.data);
      } catch (err) {
        console.error('Dashboard load error:', err);
        localStorage.removeItem('token');
        // No need to delete axios.defaults — api.js handles auth automatically
        navigate('/login');
      }
    };
    loadData();
  }, [navigate]);

  if (!user) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="px-4 md:px-6 py-4 md:py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.first_name || 'Freelancer'}!</h1>
        <p className="text-gray-600 mt-1">Here’s an overview of your account today.</p>
      </div>

      {/* Account Status Card */}
      <div className={`mb-8 rounded-xl shadow p-6 ${user.is_activated ? 'border-l-4 border-green-500 bg-white' : 'border-l-4 border-teal-500 bg-white'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Account Status</h3>
            <p className="mt-1 text-gray-600">
              {user.is_activated 
                ? 'Your account is fully activated. You can browse and apply to tasks.' 
                : 'Your account is not activated. Activate to unlock full features.'}
            </p>
          </div>
          {user.is_activated ? (
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              <span className="font-medium">Active</span>
            </div>
          ) : (
            <button
              onClick={() => navigate('/activate')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Activate Now
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Tasks Available" 
          value={stats.tasks} 
          icon={BriefcaseIcon} 
          color="bg-orange-100 text-orange-700" 
          onClick={() => navigate('/tasks')}
        />
        <StatCard 
          title="Messages" 
          value={stats.messages} 
          icon={ChatBubbleLeftRightIcon} 
          color="bg-teal-100 text-teal-700" 
          onClick={() => navigate('/messages')}
        />
        <StatCard 
          title="Payments Pending" 
          value={stats.payments} 
          icon={CurrencyDollarIcon} 
          color="bg-blue-100 text-blue-700" 
          onClick={() => navigate('/payment')}
        />
      </div>

      {/* Recent Messages & Tasks Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Messages</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No recent messages</p>
          ) : (
            <div className="space-y-4">
              {notifications.slice(0, 2).map((notif, i) => (
                <div key={i} className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-700">C</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => navigate('/messages')}
                className="text-teal-600 hover:text-teal-800 text-sm font-medium mt-2"
              >
                View all messages →
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Latest Tasks</h3>
          {user.is_activated ? (
            <div className="space-y-4">
              <p className="text-gray-600">Browse the latest opportunities and start earning today.</p>
              <button 
                onClick={() => navigate('/tasks')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Browse More Tasks
              </button>
            </div>
          ) : (
            <div className="opacity-70">
              <p className="text-gray-600 mb-4">Activate your account to view and apply to tasks.</p>
              <button 
                onClick={() => navigate('/activate')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Activate to View Tasks
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 pt-6 border-t border-gray-200 text-gray-500 text-sm">
        &copy; All rights reserved. {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, onClick }) {
  return (
    <div 
      className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${color} p-3 rounded-lg`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}