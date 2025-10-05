// src/pages/PaymentDetails.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline'

// Icons (unchanged)
const MpesaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="mr-2">
    <circle cx="8" cy="8" r="8" fill="#008000"/>
    <text x="8" y="11" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">M</text>
  </svg>
)

const AirtelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="mr-2">
    <rect width="16" height="16" fill="#E31837"/>
    <text x="8" y="11" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">A</text>
  </svg>
)

const PayPalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="mr-2">
    <path d="M11.5 4.5c-.3 0-.5.2-.5.5v1.5h-1V5c0-.3-.2-.5-.5-.5s-.5.2-.5.5v2c0 .3.2.5.5.5h1.5v1.5c0 .3.2.5.5.5s.5-.2.5-.5V7h1V8.5c0 .3.2.5.5.5s.5-.2.5-.5V6.5c0-.3-.2-.5-.5-.5h-1.5V4.5c0-.3-.2-.5-.5-.5z" fill="#003087"/>
    <path d="M4.5 7.5c-.3 0-.5.2-.5.5v1.5H3V8c0-.3-.2-.5-.5-.5S2 7.7 2 8v2c0 .3.2.5.5.5h1.5v1.5c0 .3.2.5.5.5s.5-.2.5-.5V10h1.5V11.5c0 .3.2.5.5.5s.5-.2.5-.5V9.5c0-.3-.2-.5-.5-.5H5.5V7.5c0-.3-.2-.5-.5-.5z" fill="#009CDE"/>
  </svg>
)

// Licensed Banks in Kenya (CBK-listed)
const KENYAN_BANKS = [
  "Absa Bank Kenya",
  "Bank of Africa Kenya",
  "Bank of Baroda Kenya",
  "Bank of India Kenya",
  "CFC Stanbic Bank (Stanbic Bank Kenya)",
  "Chase Bank Kenya (under receivership, but still listed for legacy)",
  "Citibank Kenya",
  "Commercial Bank of Africa (CBA) - now part of NCBA",
  "Co-operative Bank of Kenya",
  "Diamond Trust Bank Kenya",
  "Dubai Bank Kenya",
  "Equity Bank Kenya",
  "Family Bank",
  "Faulu Microfinance Bank",
  "First Community Bank",
  "Gulf African Bank",
  "Housing Finance Company of Kenya",
  "I&M Bank Kenya",
  "KCB Bank Kenya",
  "Mayfair Bank",
  "Middle East Bank Kenya",
  "NCBA Bank Kenya",
  "Paramount Universal Bank",
  "Prime Bank Kenya",
  "SBM Bank Kenya",
  "Sidian Bank",
  "Spire Bank",
  "Standard Chartered Bank Kenya",
  "Victoria Commercial Bank",
  "Consolidated Bank of Kenya"
].sort()

export default function PaymentDetails() {
  const [paymentMethod, setPaymentMethod] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    branchName: '' // renamed from swiftCode to branchName
  })
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false)
  const [bankSearch, setBankSearch] = useState('')
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsBankDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Load saved payment details
  useEffect(() => {
    const loadPayment = async () => {
      try {
        const res = await axios.get('/api/profile/')
        if (res.data.payment_method) {
          setPaymentMethod(res.data.payment_method)
          if (res.data.payment_method === 'bank') {
            const bankData = res.data.payment_identifier ? JSON.parse(res.data.payment_identifier) : {}
            setBankDetails({
              bankName: bankData.bankName || '',
              accountNumber: bankData.accountNumber || '',
              branchName: bankData.branchName || bankData.swiftCode || '' // fallback to swiftCode if needed
            })
          } else {
            setIdentifier(res.data.payment_identifier || '')
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadPayment()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let payload = { payment_method: paymentMethod }
      
      if (paymentMethod === 'bank') {
        // Save with branchName instead of swiftCode
        payload.payment_identifier = JSON.stringify({
          bankName: bankDetails.bankName,
          accountNumber: bankDetails.accountNumber,
          branchName: bankDetails.branchName
        })
      } else {
        payload.payment_identifier = identifier
      }

      await axios.post('/api/payment/save/', payload)
      navigate('/activate')
    } catch (err) {
      alert('Failed to save payment details')
    }
  }

  const renderIcon = (method) => {
    switch (method) {
      case 'mpesa': return <MpesaIcon />
      case 'airtel': return <AirtelIcon />
      case 'paypal': return <PayPalIcon />
      case 'bank': return <BuildingStorefrontIcon className="w-4 h-4 mr-2 text-gray-600" />
      default: return null
    }
  }

  const getLabel = (method) => {
    switch (method) {
      case 'mpesa': return 'M-Pesa'
      case 'airtel': return 'Airtel Money'
      case 'paypal': return 'PayPal'
      case 'bank': return 'Bank Transfer'
      default: return method
    }
  }

  // Filter banks based on search
  const filteredBanks = KENYAN_BANKS.filter(bank =>
    bank.toLowerCase().includes(bankSearch.toLowerCase())
  )

  // Handle bank selection
  const handleBankSelect = (bank) => {
    setBankDetails({ ...bankDetails, bankName: bank })
    setBankSearch(bank)
    setIsBankDropdownOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Payment Details</h2>
        <p className="text-gray-600 text-center mb-6">
          Choose how you'd like to receive payments
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            {['mpesa', 'airtel', 'paypal', 'bank'].map((method) => (
              <label 
                key={method} 
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
              >
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value)
                    if (e.target.value !== 'bank') {
                      setIdentifier('')
                    }
                  }}
                  className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500"
                  required
                />
                {renderIcon(method)}
                <span className="font-medium text-gray-800">
                  {getLabel(method)}
                </span>
              </label>
            ))}
          </div>

          {/* Non-bank input */}
          {paymentMethod && paymentMethod !== 'bank' && (
            <input
              type="text"
              placeholder={
                paymentMethod === 'mpesa' || paymentMethod === 'airtel'
                  ? '+254712345678'
                  : 'you@email.com'
              }
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          )}

          {/* Bank-Specific Form */}
          {paymentMethod === 'bank' && (
            <div className="space-y-4 mb-6">
              {/* Searchable Bank Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Bank
                </label>
                <div
                  onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                  className={`w-full px-4 py-3 text-left border ${
                    isBankDropdownOpen ? 'border-teal-500' : 'border-gray-300'
                  } rounded-lg bg-white cursor-pointer focus:outline-none`}
                >
                  {bankDetails.bankName || (
                    <span className="text-gray-400">Choose a bank...</span>
                  )}
                </div>

                {/* Dropdown */}
                <div
                  className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ease-in-out ${
                    isBankDropdownOpen ? 'opacity-100 max-h-60' : 'opacity-0 max-h-0 pointer-events-none'
                  }`}
                  style={{ transition: 'max-height 0.3s ease, opacity 0.2s ease' }}
                >
                  <input
                    type="text"
                    placeholder="Search banks..."
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    autoFocus
                  />
                  <div className="max-h-48 overflow-y-auto">
                    {filteredBanks.length > 0 ? (
                      filteredBanks.map((bank) => (
                        <div
                          key={bank}
                          onClick={() => handleBankSelect(bank)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                        >
                          {bank}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">No banks found</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Number */}
              {bankDetails.bankName && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  {/* Branch Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      value={bankDetails.branchName}
                      onChange={(e) => setBankDetails({ ...bankDetails, branchName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-full font-semibold transition shadow-sm"
          >
            Save & Continue to Activation
          </button>
        </form>
      </div>
    </div>
  )
}