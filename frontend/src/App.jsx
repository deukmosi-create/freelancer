// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import ProfileSetup from './pages/ProfileSetup';
import PaymentDetails from './pages/PaymentDetails';
import ActivateAccount from './pages/ActivateAccount';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import NotificationsPage from './pages/NotificationsPage'; // ✅ Added missing import
import Wallet from './pages/Wallet'; // ✅ NEW: Import Wallet page
import DashboardLayout from './components/DashboardLayout';

// Wrapper for public (non-auth) pages
function PublicLayout({ children }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes — wrapped in gray background */}
      <Route path="/" element={<PublicLayout><Homepage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/profile-setup" element={<PublicLayout><ProfileSetup /></PublicLayout>} />
      <Route path="/payment" element={<PublicLayout><PaymentDetails /></PublicLayout>} />
      <Route path="/activate" element={<PublicLayout><ActivateAccount /></PublicLayout>} />

      {/* Protected routes — NO WRAPPER. DashboardLayout handles layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/wallet" element={<Wallet />} /> {/* ✅ NEW: Wallet route */}
      </Route>
    </Routes>
  );
}