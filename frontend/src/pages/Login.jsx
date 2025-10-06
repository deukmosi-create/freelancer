// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_BASE_URL = 'https://freelancer-8m9p.onrender.com';
      const url = isLogin 
        ? `${API_BASE_URL}/api/auth/login/` 
        : `${API_BASE_URL}/api/auth/register/`;
      
      const res = await axios.post(url, formData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Token ${res.data.token}`;
      
      const profile = res.data.user;
      if (!profile.phone_number || profile.skills.length === 0) {
        navigate('/profile-setup');
      } else if (!profile.payment_method || !profile.payment_identifier) {
        navigate('/payment');
      } else if (!profile.is_activated) {
        navigate('/activate');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  const handleFirebaseLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const API_BASE_URL = 'https://freelancer-8m9p.onrender.com';
      const res = await axios.post(`${API_BASE_URL}/api/auth/firebase/`, {
        idToken
      });

      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Token ${res.data.token}`;
      
      const profile = res.data.user;
      if (!profile.phone_number || profile.skills.length === 0) {
        navigate('/profile-setup');
      } else if (!profile.payment_method || !profile.payment_identifier) {
        navigate('/payment');
      } else if (!profile.is_activated) {
        navigate('/activate');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Firebase login error:', err);
      let message = 'Login failed. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'Login popup was closed.';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        message = 'An account with this email already exists. Please log in with your password.';
      }
      alert(message);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', first_name: '', last_name: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-gray-900 font-bold text-xl">FreelancerKE</div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isLogin ? 'Login to Your Account' : 'Create an Account'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.first_name}
                  onChange={handleChange}
                  required={!isLogin}
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.last_name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-6">
          <p className="text-center text-gray-500 mb-4">Or continue with</p>
          <div className="space-y-3">
            {/* Google Button - Improved */}
            <button
              onClick={() => handleFirebaseLogin(googleProvider)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.25 1.12-1.03 2.14-2.23 2.7V21h3.77c2.25-2.05 3.77-5.05 3.77-8.75z"
                  fill="#4285F4"
                />
                <path
                  d="M12 21c2.25 0 4.09-.87 5.34-2.29l-2.83-2.23c-1.02.65-2.25.98-3.51.98a6.01 6.01 0 01-3.51-1.03L7.83 16.9c1.02 1.02 2.55 1.67 4.17 1.67z"
                  fill="#34A853"
                />
                <path
                  d="M5.83 13.75a6.01 6.01 0 010-2.5L7.83 9.23c-.94-.94-2.18-1.48-3.51-1.48A6.01 6.01 0 002.5 9.23l2.83 2.23c.65 1.02 1.77 1.77 3.51 1.77z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 21c3.36 0 6.08-2.05 6.96-4.95H12V12h5.92c-.35-1.02-1.03-2.04-2.23-2.7V5.05H12v4.26h5.92c-.25 1.12-1.03 2.14-2.23 2.7V21z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>

            {/* Facebook Button */}
            <button 
              onClick={() => handleFirebaseLogin(facebookProvider)}
              className="w-full bg-[#1877F2] text-white py-2 px-4 rounded-lg hover:bg-[#166FE5] transition-colors flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.991 4.367 10.982 10.211 11.852v-8.384H7.028v-3.47h3.028V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.384C19.632 23.055 24 18.064 24 12.073z"
                  fill="currentColor"
                />
              </svg>
              Facebook
            </button>
          </div>
        </div>

        {/* Switch Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={toggleMode}
              className="text-teal-600 hover:text-teal-800 font-medium underline"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}