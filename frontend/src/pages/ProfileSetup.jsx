// src/pages/ProfileSetup.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    bio: '',
    skills: [],
    profile_picture: ''
  })
  const [skillsInput, setSkillsInput] = useState('')
  const navigate = useNavigate()

  // Load current profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get('/api/profile/')
        setFormData(res.data)
        if (res.data.skills.length > 0) {
          setSkillsInput(res.data.skills.join(', '))
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSkillsChange = (e) => {
    const value = e.target.value
    setSkillsInput(value)
    const skillsArray = value
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '')
    setFormData({ ...formData, skills: skillsArray })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.patch('/api/profile/', formData)
      
      const profileRes = await axios.get('/api/profile/')
      const user = profileRes.data
      
      if (!user.payment_method || !user.payment_identifier) {
        navigate('/payment')
      } else if (!user.is_activated) {
        navigate('/activate')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      alert('Failed to save profile')
      console.error(err)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(to bottom right, #ffffff, #f0f9ff)' // white → pale teal
      }}
    >
      {/* Form Card */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-600">
            Help clients understand your expertise
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <InputField
            label="Phone Number"
            name="phone_number"
            type="tel"
            placeholder="+254712345678"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />

          {/* Bio */}
          <div>
            <label className="block text-gray-900 font-medium mb-2">
              Short Bio
            </label>
            <textarea
              name="bio"
              placeholder="e.g. Graphic designer with 5 years experience"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Briefly describe your skills and experience
            </p>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-gray-900 font-medium mb-2">
              Skills
            </label>
            <input
              type="text"
              placeholder="e.g. Design, Photoshop, Branding"
              value={skillsInput}
              onChange={handleSkillsChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter skills separated by commas
            </p>

            {/* Skill Chips */}
            {formData.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        const newSkills = formData.skills.filter((_, i) => i !== index)
                        setFormData({ ...formData, skills: newSkills })
                        setSkillsInput(newSkills.join(', '))
                      }}
                      className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-gray-900 font-medium mb-2">
              Profile Picture URL (optional)
            </label>
            <input
              type="url"
              name="profile_picture"
              placeholder="https://example.com/photo.jpg"
              value={formData.profile_picture}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full transition shadow-sm"
            >
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Reusable Input Component
function InputField({ label, name, type = 'text', placeholder, value, onChange, required = false }) {
  return (
    <div>
      <label className="block text-gray-900 font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
      />
    </div>
  )
}