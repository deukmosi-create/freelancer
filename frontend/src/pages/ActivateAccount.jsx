// src/pages/ActivateAccount.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ActivateAccount() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Digits only
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError('');
    }
  };

  const isValid = phoneNumber.length === 10;

  const handleActivate = async () => {
    if (!isValid) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const fullPhoneNumber = phoneNumber.startsWith('0') 
        ? '254' + phoneNumber.slice(1) 
        : phoneNumber;

      // Step 1: Initiate M-Pesa payment
      const res = await axios.post(
        'https://freelancer-8m9p.onrender.com/api/mpesa/initiate/',
        { phone_number: fullPhoneNumber },
        { headers: { Authorization: `Token ${token}` } }
      );

      if (res.data.CheckoutRequestID) {
        // Step 2: Poll for activation status (every 3 seconds, up to 60s)
        let attempts = 0;
        const pollActivation = async () => {
          attempts++;
          if (attempts > 20) {
            throw new Error('Payment confirmation timeout');
          }

          try {
            const statusRes = await axios.get(
              'https://freelancer-8m9p.onrender.com/api/check-activation/',
              { headers: { Authorization: `Token ${token}` } }
            );

            if (statusRes.data.is_activated) {
              navigate('/dashboard');
              return;
            }
          } catch (err) {
            console.warn('Poll error:', err);
          }

          setTimeout(pollActivation, 3000);
        };

        pollActivation();
      } else {
        throw new Error('Failed to initiate payment');
      }
    } catch (err) {
      setIsSubmitting(false);
      const btn = document.getElementById('activate-btn');
      if (btn) {
        btn.style.backgroundColor = '#E74C3C';
        btn.textContent = 'Payment Failed';
        setTimeout(() => {
          if (btn) {
            btn.style.backgroundColor = '#00B894';
            btn.textContent = 'Activate Now – Pay KES 300';
          }
        }, 1500);
      }
      setError('Payment failed. Please try again.');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Activate Your Account
        </h1>
        
        <p className="text-[#2C3E50] text-center mb-6">
          Pay a small fee of KES 300 to unlock full access to tasks and start earning. This amount is used to activate your account and will be paid together with your earnings in your next payout.
        </p>

        {/* Phone Number Input */}
        <div className="mb-4">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="e.g., 0712345678"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8A9] focus:border-[#00B8A9] transition"
            maxLength={10}
          />
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500">
              {phoneNumber.length}/10 digits
            </span>
            {error && <span className="text-sm text-[#E74C3C]">{error}</span>}
          </div>
        </div>

        {/* Primary Button */}
        <button
          id="activate-btn"
          onClick={handleActivate}
          disabled={!isValid || isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-300 mb-4 ${
            isSubmitting
              ? 'bg-[#F1C40F] text-gray-900'
              : isValid
              ? 'bg-[#00B894] hover:bg-[#00a085]'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Confirming Payment…' : 'Activate Now – Pay KES 300'}
        </button>

        {/* Secondary Button */}
        <button
          onClick={handleSkip}
          className="w-full py-2 px-4 border border-[#00B8A9] text-[#00B8A9] bg-white rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Skip to Dashboard
        </button>

        {/* Warning Note */}
        <p className="mt-4 text-center text-sm text-[#E74C3C] font-medium">
          ⚠ You cannot access the Tasks page until your account is activated.
        </p>
      </div>
    </div>
  );
}