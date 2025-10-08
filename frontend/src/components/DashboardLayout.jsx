// src/components/DashboardLayout.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import api from '../api';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  UserIcon, 
  ChatBubbleLeftRightIcon, 
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  BanknotesIcon // ✅ NEW: Import wallet icon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Tasks', href: '/tasks', icon: BriefcaseIcon },
  { name: 'Wallet', href: '/wallet', icon: BanknotesIcon }, // ✅ NEW: Wallet nav item
  { name: 'Profile', href: '/profile', icon: UserIcon },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
];

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

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
        const res = await api.get('/api/profile/');
        setUser(res.data);
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
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
    <div className="flex min-h-screen bg-gray-50">
      {/* === SIDEBAR === */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#004D61] flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center justify-center px-4 py-6 border-b border-teal-700/30">
          <div className="bg-teal-400 w-10 h-10 rounded-full flex items-center justify-center">
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
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all
                  ${active 
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-white shadow-md' 
                    : 'text-teal-100 hover:text-white hover:bg-teal-700/30'}`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-teal-200'}`} />
                <span className="ml-3 font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="px-4 py-6 border-t border-teal-700/30">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center mb-4 w-full text-left focus:outline-none hover:bg-teal-800/40 rounded-lg p-2"
          >
            <div className="h-10 w-10 rounded-full bg-teal-200 flex items-center justify-center">
              <span className="font-medium text-teal-800">
                {user.first_name?.[0] || user.email[0]?.toUpperCase()}
              </span>
            </div>
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium text-white">{user.first_name || 'User'}</p>
              <p className="text-xs text-teal-200 truncate max-w-[120px]">{user.email}</p>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-left text-teal-200 rounded-lg hover:bg-red-900/30 hover:text-red-200"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* === FULL-WIDTH TOPBAR === */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow-sm h-14 border-b border-gray-200">
        <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto">
          {/* Hamburger (mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          {/* Spacer for desktop alignment */}
          <div className="hidden md:block w-64"></div>

          {/* Right Icons — ONLY Messages + Avatar */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/messages')}
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="font-medium text-teal-800">
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
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                  >
                    <UserIcon className="h-4 w-4 inline mr-2 text-teal-600" /> Profile
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4 inline mr-2 text-red-600" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === MAIN CONTENT AREA === */}
      <div className="flex flex-1 flex-col md:ml-64 pt-14">
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}