import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import LanguageToggle from '../components/LanguageToggle'
import BackButton from '../components/BackButton'
import { API_URL } from '../config'

const AdminDashboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)
  const [stats, setStats] = useState({ total_users: 0, total_schemes: 0 })
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    checkAdmin()
    fetchStats()
  }, [])

  const checkAdmin = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/check`)
      if (!response.data.is_admin) {
        navigate('/dashboard')
      }
    } catch (error) {
      navigate('/dashboard')
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`)
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/logo.png"
                alt="InfoMitra Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-md border-2 border-orange-400"
              />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800">{t('adminPanelTitle')}</h1>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <LanguageToggle />
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition border border-blue-700 text-sm"
              >
                {t('userDashboard')}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition border border-red-700 text-sm"
              >
                {t('logout')}
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-800 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col gap-3">
                <LanguageToggle />
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition border border-blue-700 w-full text-left"
                >
                  {t('userDashboard')}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition border border-red-700 w-full text-left"
                >
                  {t('logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      <BackButton />

      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white border-l-4 border-orange-500 p-6 mb-8 shadow">
          <h2 className="text-3xl font-bold text-gray-800">{t('administrationDashboard')}</h2>
          <p className="text-gray-600 mt-2">{t('manageUsersAndSchemes')}</p>
        </div>

        {loading ? (
          <div className="text-gray-800 text-center bg-white p-8 rounded shadow">{t('loading')}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => navigate('/admin/users')}
                className="bg-white border-2 border-gray-300 text-gray-800 p-8 rounded shadow-md hover:shadow-lg hover:border-blue-500 transition text-left"
              >
                <div className="text-5xl mb-4 text-blue-600">👤</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{t('manageUsers')}</h3>
                <p className="text-sm text-gray-600">{t('viewManageUsers')}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-3xl font-bold text-blue-600">{stats.total_users}</span>
                  <span className="text-sm text-gray-500 font-medium">{t('registeredUsers')}</span>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/schemes')}
                className="bg-white border-2 border-gray-300 text-gray-800 p-8 rounded shadow-md hover:shadow-lg hover:border-orange-500 transition text-left"
              >
                <div className="text-5xl mb-4 text-orange-600">📝</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{t('manageSchemes')}</h3>
                <p className="text-sm text-gray-600">{t('createEditDeleteSchemes')}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-3xl font-bold text-orange-600">{stats.total_schemes}</span>
                  <span className="text-sm text-gray-500 font-medium">{t('governmentSchemes')}</span>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/marquee')}
                className="bg-white border-2 border-gray-300 text-gray-800 p-8 rounded shadow-md hover:shadow-lg hover:border-teal-500 transition text-left"
              >
                <div className="text-5xl mb-4 text-teal-600">📢</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{t('marqueeSettings')}</h3>
                <p className="text-sm text-gray-600">{t('marqueeSettingsDesc')}</p>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
