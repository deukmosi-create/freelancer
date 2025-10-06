// src/pages/NotificationsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { CheckCircleIcon, ExclamationCircleIcon, BellIcon, ClockIcon } from '@heroicons/react/24/outline';

const NOTIFICATION_TYPES = {
  payment: { icon: CheckCircleIcon, color: 'text-green-500', bg: 'bg-green-100' },
  task: { icon: BellIcon, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  alert: { icon: ExclamationCircleIcon, color: 'text-red-500', bg: 'bg-red-100' },
  system: { icon: ClockIcon, color: 'text-cyan-500', bg: 'bg-cyan-100' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'payment', 'task', 'alert', 'system'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/api/notifications/');
        setNotifications(res.data.map(n => ({ ...n, dismissed: false })));
      } catch (err) {
        console.error('Failed to load notifications');
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.post(`/api/notifications/${id}/read/`); // You may need to add this endpoint
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, dismissed: true } : n));
    // Optional: call API to delete
  };

  const clearAll = async () => {
    try {
      await api.delete('/api/notifications/clear/');
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear notifications');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (n.dismissed) return false;
    if (filter === 'unread') return !n.is_read;
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'payment', label: 'Payments' },
    { key: 'task', label: 'Tasks' },
    { key: 'alert', label: 'Alerts' },
    { key: 'system', label: 'System' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FA] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#2C3E50] mb-6">Notifications</h1>

        {/* Filter Pills */}
        <div className="flex overflow-x-auto pb-4 space-x-3 mb-6 hide-scrollbar">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === f.key
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-700 border border-teal-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-500">No notifications</p>
            </div>
          ) : (
            filteredNotifications.map(notification => {
              const typeConfig = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.system;
              const Icon = typeConfig.icon;
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm p-4 md:p-5 transition-all duration-200 ${
                    !notification.is_read ? 'bg-[#E6F7F7] border-l-4 border-teal-400' : ''
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="flex items-start">
                      <div className={`${typeConfig.bg} p-2 rounded-lg`}>
                        <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-[#2C3E50]">{notification.message}</h3>
                        <p className="text-gray-600 mt-1 text-sm">
                          {notification.description || ''}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
                      aria-label="Dismiss"
                    >
                      <span className="text-xl">×</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Clear All Button */}
        {notifications.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={clearAll}
              className="px-6 py-2 border-2 border-teal-500 text-teal-600 font-medium rounded-full hover:bg-teal-50 hover:border-teal-600 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}