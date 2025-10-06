import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // ✅ Use centralized API client

const ProtectedRoute = ({ children, requiredStep }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // ✅ api.js automatically attaches token — no need to set headers manually

        // Check activation status
        const activationRes = await api.get('/api/check-activation/'); // ✅
        const { is_activated } = activationRes.data;

        // Get user profile to check completion
        const profileRes = await api.get('/api/profile/'); // ✅
        const user = profileRes.data;

        // Enforce step-by-step flow
        if (requiredStep === 'profile') {
          if (!user.phone_number || user.skills.length === 0) {
            navigate('/profile-setup');
            return;
          }
        }

        if (requiredStep === 'payment') {
          if (!user.payment_method || !user.payment_identifier) {
            navigate('/payment');
            return;
          }
        }

        if (requiredStep === 'activated' && !is_activated) {
          navigate('/activate');
          return;
        }

      } catch (err) {
        console.error('Protected route error:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    checkAccess();
  }, [navigate, requiredStep]);

  return children;
};

export default ProtectedRoute;