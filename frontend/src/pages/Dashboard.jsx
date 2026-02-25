import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import LanguageToggle from '../components/LanguageToggle'
import MarqueeBanner from '../components/MarqueeBanner'
import { API_URL } from '../config'

const Dashboard = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)
  const [isAdmin, setIsAdmin] = useState(false)
  const [recentSchemes, setRecentSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    checkAdmin()
    fetchRecentSchemes()
  }, [])

  const checkAdmin = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/check`)
      setIsAdmin(response.data.is_admin)
    } catch (error) {
      setIsAdmin(false)
    }
  }

  const fetchRecentSchemes = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/schemes/`)
      const sortedSchemes = response.data.slice(0, 6)
      setRecentSchemes(sortedSchemes)
    } catch (error) {
      console.error('Failed to fetch recent schemes', error)
    } finally {
      setLoading(false)
    }
  }

  const getSchemeText = (scheme, field) => {
    const lang = i18n.language
    return scheme[field]?.[lang] || scheme[field]?.en || ''
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/logo.png"
                alt="InfoMitra Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-md border-2 border-orange-400"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">InfoMitra</h1>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <LanguageToggle />
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-yellow-500 text-gray-900 px-3 py-2 rounded hover:bg-yellow-600 transition font-semibold border-2 border-yellow-600 text-sm"
                >
                  {t('adminPanel')}
                </button>
              )}
              <button
                onClick={() => navigate('/edit-profile')}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition border-2 border-blue-700 text-sm"
              >
                {t('editProfile')}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition border-2 border-red-600 text-sm"
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
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="bg-yellow-500 text-gray-900 px-4 py-2 rounded hover:bg-yellow-600 transition font-semibold border-2 border-yellow-600 w-full text-left"
                  >
                    {t('adminPanel')}
                  </button>
                )}
                <button
                  onClick={() => navigate('/edit-profile')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition border-2 border-blue-700 w-full text-left"
                >
                  {t('editProfile')}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition border-2 border-red-600 w-full text-left"
                >
                  {t('logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <MarqueeBanner />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 mt-6 sm:mt-8 md:mt-12">
        <div className="bg-white rounded shadow-lg border-2 border-gray-300 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="border-l-4 border-orange-500 pl-3 sm:pl-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
              {t('welcome')}, {user?.profile?.name || 'User'}!
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">{t('tagline')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <button
            onClick={() => navigate('/schemes/eligible')}
            className="bg-white border-2 border-green-500 text-gray-800 p-6 sm:p-8 rounded shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center justify-center"><img src="/eligible.png" className='w-32'/></div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-green-600">{t('exploreEligible')}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{t('viewEligibleDesc')}</p>
          </button>

          <button
            onClick={() => navigate('/schemes/all')}
            className="bg-white border-2 border-blue-500 text-gray-800 p-6 sm:p-8 rounded shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center justify-center"><img src="/cloud.png" className='w-32'/></div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-blue-600">{t('exploreAll')}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{t('viewAllDesc')}</p>
          </button>
        </div>

        <div className="bg-white rounded shadow-lg border-2 border-gray-300 p-4 sm:p-6 md:p-8">
          <div className="border-l-4 border-blue-500 pl-3 sm:pl-4 mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{t('recentSchemes')}</h3>
          </div>

          {loading ? (
          <div className="text-center text-gray-600 py-6 sm:py-8 text-sm sm:text-base">{t('loadingSchemes')}</div>
          ) : recentSchemes.length === 0 ? (
            <div className="text-center text-gray-600 py-6 sm:py-8 text-sm sm:text-base">{t('noSchemesAvailable')}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {recentSchemes.map((scheme) => (
                <div
                  key={scheme._id}
                  onClick={() => navigate(`/scheme/${scheme._id}`)}
                  className="bg-gray-50 border-2 border-gray-300 rounded p-3 sm:p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition"
                >
                  <h4 className="font-bold text-gray-800 mb-2 line-clamp-2 text-sm sm:text-base">
                    {getSchemeText(scheme, 'scheme_name')}
                  </h4>
                  <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold border border-orange-300 mb-2">
                    {scheme.category}
                  </span>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                    {getSchemeText(scheme, 'objective')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
