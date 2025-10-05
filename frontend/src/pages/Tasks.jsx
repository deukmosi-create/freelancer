import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { HeartIcon, BookmarkIcon, BriefcaseIcon, CurrencyDollarIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [bookmarked, setBookmarked] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const [tasksRes, bookmarksRes] = await Promise.all([
          axios.get('/api/tasks/'),
          axios.get('/api/tasks/bookmarked/')
        ])
        setTasks(tasksRes.data)
        setBookmarked(bookmarksRes.data.map(t => t.id))
      } catch (err) {
        console.error(err)
      }
    }
    loadTasks()
  }, [])

  const handleApply = async (taskId) => {
    try {
      await axios.post(`/api/tasks/${taskId}/apply/`)
      // Show success toast later
    } catch (err) {
      alert('Failed to apply')
    }
  }

  const handleBookmark = async (taskId) => {
    try {
      await axios.post(`/api/tasks/${taskId}/bookmark/`)
      setBookmarked(prev => [...prev, taskId])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Tasks</h1>
          <p className="text-gray-600 mt-1">Browse and apply to tasks that match your skills</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          ← Back to Dashboard
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks available</h3>
          <p className="mt-2 text-gray-500">Check back later or contact support to post tasks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task.id} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{task.title}</h3>
                  <button 
                    onClick={() => handleBookmark(task.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {bookmarked.includes(task.id) ? (
                      <HeartSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <p className="text-gray-600 mt-3 line-clamp-3">{task.description}</p>
                
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {task.location || 'Remote'}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    KES {task.budget}
                  </span>
                  <span className="text-sm text-gray-500">{task.category}</span>
                </div>
                
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {task.skills_required.slice(0, 3).map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {skill}
                      </span>
                    ))}
                    {task.skills_required.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{task.skills_required.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 border-t">
                <button
                  onClick={() => handleApply(task.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}