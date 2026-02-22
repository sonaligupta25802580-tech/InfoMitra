import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import LanguageToggle from '../components/LanguageToggle'
import { API_URL } from '../config'

const AdminUsers = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`)
      setUsers(response.data)
    } catch (error) {
      console.error('Failed to fetch users', error)
      if (error.response?.status === 403) {
        navigate('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`)
      setUsers(users.filter(user => user._id !== userId))
    } catch (error) {
      console.error('Failed to delete user', error)
      alert('Failed to delete user')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="InfoMitra Logo"
              className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-orange-400"
            />
            <h1 className="text-2xl font-bold text-gray-800">InfoMitra Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <button
              onClick={() => navigate('/admin')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition border border-blue-700"
            >
              Back to Admin
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white border-l-4 border-blue-500 p-6 mb-6 shadow">
          <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-600 mt-2">View and manage registered users</p>
        </div>

        {loading ? (
          <div className="text-gray-800 text-center bg-white p-8 rounded shadow">{t('loading')}</div>
        ) : (
          <div className="bg-white rounded shadow-md overflow-hidden border border-gray-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {user.profile?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {user.phone ? `+91 ${user.phone}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {user.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {user.profile?.category || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {user.profile?.state || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition border border-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-600">No users found</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
