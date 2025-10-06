import { useNavigate } from 'react-router-dom';
import api from '../api'; // ✅ Use centralized API client

export default function ActivateAccount() {
  const navigate = useNavigate();

  const handleActivate = async () => {
    try {
      await api.post('/api/activate/'); // ✅ Now calls https://freelancer-8m9p.onrender.com/api/activate/
      navigate('/dashboard');
    } catch (err) {
      console.error('Activation error:', err);
      alert('Activation failed. Please try again.');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Activate Your Account</h2>
        <p className="text-gray-600 mb-6">
          Pay a small fee of <span className="font-bold">KES 300</span> to unlock full access to tasks and start earning.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleActivate}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold transition"
          >
            Activate Now – KES 300
          </button>
          
          <button
            onClick={handleSkip}
            className="w-full text-gray-600 hover:text-gray-800 py-3 rounded font-semibold transition"
          >
            Skip Activation (View Dashboard Only)
          </button>
        </div>
        
        <p className="mt-6 text-sm text-gray-500">
          Note: You can activate later from your dashboard.
        </p>
      </div>
    </div>
  );
}