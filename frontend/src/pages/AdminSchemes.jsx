import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import LanguageToggle from '../components/LanguageToggle'
import { API_URL } from '../config'

const AdminSchemes = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchemes()
  }, [])

  const fetchSchemes = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/schemes`)
      setSchemes(response.data)
    } catch (error) {
      console.error('Failed to fetch schemes', error)
      if (error.response?.status === 403) {
        navigate('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (schemeId) => {
    if (!confirm('Are you sure you want to delete this scheme?')) {
      return
    }

    try {
      await axios.delete(`${API_URL}/admin/schemes/${schemeId}`)
      setSchemes(schemes.filter(scheme => scheme._id !== schemeId))
    } catch (error) {
      console.error('Failed to delete scheme', error)
      alert('Failed to delete scheme')
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
              onClick={() => navigate('/admin/schemes/create')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition border border-green-700"
            >
              + Create Scheme
            </button>
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
        <div className="bg-white border-l-4 border-orange-500 p-6 mb-6 shadow">
          <h2 className="text-3xl font-bold text-gray-800">Scheme Management</h2>
          <p className="text-gray-600 mt-2">Create, edit, and manage government schemes</p>
        </div>

        {loading ? (
          <div className="text-gray-800 text-center bg-white p-8 rounded shadow">{t('loading')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <div key={scheme._id} className="bg-white rounded border-2 border-gray-300 p-6 shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {scheme.scheme_name?.en || 'Untitled'}
                </h3>
                <div className="mb-3">
                  <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm font-semibold border border-orange-300">
                    {scheme.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {scheme.objective?.en || ''}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/schemes/edit/${scheme._id}`)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition border border-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(scheme._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition border border-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && schemes.length === 0 && (
          <div className="text-center py-12 bg-white rounded shadow border border-gray-300">
            <p className="text-xl mb-4 text-gray-800">No schemes found</p>
            <button
              onClick={() => navigate('/admin/schemes/create')}
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition border border-green-700"
            >
              Create First Scheme
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminSchemes
