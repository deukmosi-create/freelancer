import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Wallet() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const withdrawalThreshold = 2000;
  const canWithdraw = balance >= withdrawalThreshold;
  const progress = Math.min(100, (balance / withdrawalThreshold) * 100);

  // Add auth token to axios requests
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const [balanceRes, txRes] = await Promise.all([
          axios.get('https://freelancer-8m9p.onrender.com/api/wallet/balance/'),
          axios.get('https://freelancer-8m9p.onrender.com/api/wallet/transactions/')
        ]);
        setBalance(parseFloat(balanceRes.data.balance));
        setTransactions(txRes.data);
        setError(null);
      } catch (err) {
        console.error('Failed to load wallet:', err);
        setError('Unable to load wallet data. Please try again.');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [navigate]);

  const handleWithdraw = async () => {
    if (!canWithdraw) return;

    try {
      const res = await axios.post('https://freelancer-8m9p.onrender.com/api/wallet/withdraw/');
      setBalance(parseFloat(res.data.new_balance));
      // Add the withdrawal to transaction list
      setTransactions(prev => [
        {
          id: Date.now(),
          type: 'debit',
          description: 'Withdrawal request',
          amount: balance - parseFloat(res.data.new_balance),
          date: new Date().toISOString().split('T')[0]
        },
        ...prev
      ]);
      alert('Withdrawal initiated successfully!');
    } catch (err) {
      console.error('Withdrawal failed:', err);
      const msg = err.response?.data?.error || 'Withdrawal failed. Please try again.';
      alert(msg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-gray-700">Loading wallet...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-red-600 text-center p-4">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-teal-600 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Balance Card */}
        <div className="relative bg-gradient-to-r from-blue-400 via-teal-400 to-teal-500 rounded-2xl shadow-lg p-6 mb-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-20 rounded-2xl"></div>
          <div className="relative z-10">
            <p className="text-gray-800 font-medium mb-2">Available Balance</p>
            <p className="text-4xl md:text-5xl font-bold text-gray-900">
              KES {balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress Bar + Withdraw Button */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="flex-1 w-full">
            <div className="text-sm text-gray-600 mb-2">
              {canWithdraw 
                ? "Ready to withdraw!" 
                : `KES ${(withdrawalThreshold - balance).toLocaleString()} to go`}
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={!canWithdraw}
            className={`flex items-center justify-center px-6 py-3 rounded-full font-semibold transition-all duration-300 transform ${
              canWithdraw
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 shadow-md'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canWithdraw ? (
              'Withdraw'
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Locked
              </>
            )}
          </button>
        </div>

        {/* Transaction Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center text-gray-500">
              No transactions yet.
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start"
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {tx.type === 'credit' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{tx.description}</p>
                    <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>

                  <div className={`font-bold ${
                    tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'} KES {parseFloat(tx.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}