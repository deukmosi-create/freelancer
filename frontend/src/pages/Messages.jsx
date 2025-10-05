import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, messagesRes] = await Promise.all([
          axios.get('/api/profile/'),
          axios.get('/api/messages/')
        ])
        setUser(profileRes.data)
        setMessages(messagesRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    loadData()
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    try {
      // For demo: send to admin (user ID 1)
      const res = await axios.post('/api/messages/', {
        receiver: 1,
        content: newMessage
      })
      setMessages([...messages, res.data])
      setNewMessage('')
    } catch (err) {
      alert('Failed to send message')
    }
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <UserCircleIcon className="h-16 w-16 mb-4" />
              <p className="text-lg">No messages yet</p>
              <p className="mt-2">Start a conversation with a client or support team.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-4 ${msg.sender === user?.id ? 'text-right' : 'text-left'}`}
              >
                <div className={`inline-block max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  msg.sender === user?.id 
                    ? 'bg-green-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
                <div className={`text-xs mt-1 text-gray-500 ${msg.sender === user?.id ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={handleSend} className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-3 rounded-lg transition-colors"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}