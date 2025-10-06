// src/components/DashboardLayout.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import api from '../api'; // ✅ Use centralized API client
import { 
  HomeIcon, 
  BriefcaseIcon, 
  UserIcon, 
  ChatBubbleLeftRightIcon, 
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Tasks', href: '/tasks', icon: BriefcaseIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
];

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // mock data
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get('/api/profile/'); // ✅
        setUser(res.data);
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
        // No need to delete axios.defaults — api.js handles auth
        navigate('/login');
      }
    };
    loadUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-amber-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - ALWAYS fixed */}
      <div
        className={`fixed z-30 inset-y-0 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 w-64 bg-[#0b1a33] border-r border-gray-700/30 flex flex-col`}
      >
        {/* Brand */}
        <div className="flex items-center justify-center px-4 py-6 border-b border-gray-700/50">
          <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="ml-3 text-xl font-bold text-white">FreelancerKE</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ease-in-out
                  ${active 
                    ? 'bg-orange-500/30 text-white border-l-4 border-orange-500' 
                    : 'text-gray-300 hover:text-white hover:bg-blue-900/20 hover:border-l-4 hover:border-orange-500/50'}
                  hover:scale-[1.02]`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-orange-400' : 'text-teal-300'}`} />
                <span className="ml-3 font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* User Section - Clickable to /profile */}
        <div className="px-4 py-6 border-t border-gray-700/50">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center mb-4 w-full text-left focus:outline-none hover:bg-gray-800/30 rounded-lg p-2 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="font-medium text-gray-800">
                {user.first_name?.[0] || user.email[0]?.toUpperCase()}
              </span>
            </div>
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium text-white">{user.first_name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate max-w-[120px]">{user.email}</p>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-left text-gray-300 rounded-lg hover:bg-red-900/30 hover:text-red-200 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* FIXED TOP BAR — Icons aligned to far right */}
      <div 
        className="fixed top-0 right-0 left-64 z-20 bg-white shadow-sm h-14"
        style={{ borderBottom: '1px solid rgba(229, 231, 235, 1)' }}
      >
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
          {/* Left: only hamburger on mobile */}
          <div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-700 hover:text-teal-600 transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          {/* Right: all icons flush to the right */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => navigate('/notifications')}
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                <BellIcon className="h-6 w-6" />
              </button>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500"></span>
                </span>
              )}
            </div>

            {/* Messages */}
            <button
              onClick={() => navigate('/messages')}
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
            </button>

            {/* User Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="font-medium text-gray-700">
                    {user.first_name?.[0] || user.email[0]?.toUpperCase()}
                  </span>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-200">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 inline mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    <Cog6ToothIcon className="h-4 w-4 inline mr-2" />
                    Settings
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area — starts below top bar */}
      <div className="flex flex-col flex-1 ml-64 pt-14 border-l border-gray-700/20 overflow-y-auto">
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}