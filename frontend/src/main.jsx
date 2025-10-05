import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import axios from 'axios'

// Set base URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

// 🔑 Restore token on app startup
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)