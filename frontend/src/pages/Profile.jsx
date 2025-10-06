import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // ✅ Use centralized API client
import { UserIcon, PhoneIcon, DocumentTextIcon, CreditCardIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/api/profile/'); // ✅
        setUser(res.data);
      } catch (err) {
        console.error('Profile load error:', err);
        // Optionally redirect to login if auth fails
        // navigate('/login');
      }
    };
    loadProfile();
  }, []);

  const handleEdit = () => {
    navigate('/profile-setup');
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'mpesa': return 'M-Pesa';
      case 'airtel': return 'Airtel Money';
      case 'paypal': return 'PayPal';
      case 'bank': return 'Bank Transfer';
      default: return 'Not set';
    }
  };

  if (!user) return null;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="bg-white border-4 border-white rounded-full w-24 h-24 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-20 h-20 flex items-center justify-center">
                <span className="text-gray-500 text-2xl font-bold">
                  {(user.first_name?.[0] || user.email[0]?.toUpperCase())}
                  {(user.last_name?.[0] || user.email[1]?.toUpperCase())}
                </span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-green-100">{user.email}</p>
              {user.phone_number && (
                <div className="flex items-center justify-center md:justify-start mt-2">
                  <PhoneIcon className="h-4 w-4 text-green-200 mr-1" />
                  <span className="text-green-100">{user.phone_number}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bio Section */}
            <div>
              <div className="flex items-center mb-4">
                <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Bio</h3>
              </div>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                {user.bio || 'No bio provided. Add a description to help clients understand your expertise.'}
              </p>
            </div>

            {/* Skills Section */}
            <div>
              <div className="flex items-center mb-4">
                <SparklesIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
              </div>
              {user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-2 bg-green-100 text-green-800 font-medium rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">
                  No skills added yet. Update your profile to showcase your expertise.
                </p>
              )}
            </div>

            {/* Payment Section */}
            <div>
              <div className="flex items-center mb-4">
                <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">
                  {getPaymentMethodLabel(user.payment_method)}
                </p>
                {user.payment_identifier && (
                  <p className="text-gray-600 mt-1">{user.payment_identifier}</p>
                )}
                {!user.payment_method && (
                  <p className="text-gray-500">Payment details not configured</p>
                )}
              </div>
            </div>

            {/* Status Section */}
            <div>
              <div className="flex items-center mb-4">
                <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
              </div>
              <div className={`p-4 rounded-lg ${user.is_activated ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${user.is_activated ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className={`font-medium ${user.is_activated ? 'text-green-800' : 'text-yellow-800'}`}>
                    {user.is_activated ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {!user.is_activated && (
                  <p className="text-yellow-700 mt-2 text-sm">
                    Pay KES 300 to unlock full access to tasks.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleEdit}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-6 rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </button>
            {!user.is_activated && (
              <button
                onClick={() => navigate('/activate')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
              >
                Activate Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}