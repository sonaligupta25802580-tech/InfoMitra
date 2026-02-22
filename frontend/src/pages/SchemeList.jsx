import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import LanguageToggle from '../components/LanguageToggle'
import { API_URL } from '../config'

const SchemeList = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { type } = useParams()
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchemes()
  }, [type])

  const fetchSchemes = async () => {
    setLoading(true)
    try {
      const endpoint = type === 'eligible' 
        ? `${API_URL}/schemes/eligible`
        : `${API_URL}/schemes/`
      const response = await axios.get(endpoint)
      setSchemes(response.data)
    } catch (error) {
      console.error('Failed to fetch schemes', error)
    } finally {
      setLoading(false)
    }
  }

  const getSchemeText = (scheme, field) => {
    const lang = i18n.language
    return scheme[field]?.[lang] || scheme[field]?.en || ''
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/logo.png"
              alt="InfoMitra Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-md border-2 border-orange-400"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">InfoMitra</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageToggle />
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 transition border-2 border-blue-700 text-sm sm:text-base"
            >
              {t('dashboard')}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="border-l-4 border-orange-500 pl-3 sm:pl-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {type === 'eligible' ? t('exploreEligible') : t('exploreAll')}
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 text-base sm:text-xl">{t('loading')}</div>
        ) : schemes.length === 0 ? (
          <div className="bg-white rounded shadow-lg border-2 border-gray-300 p-6 sm:p-8 text-center">
            <p className="text-gray-600 text-base sm:text-lg">{t('noSchemes')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {schemes.map((scheme) => (
              <div
                key={scheme._id}
                onClick={() => navigate(`/scheme/${scheme._id}`)}
                className="bg-white rounded shadow-md border-2 border-gray-300 p-4 sm:p-6 cursor-pointer hover:shadow-lg hover:border-blue-500 transition"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-800">
                  {getSchemeText(scheme, 'scheme_name')}
                </h3>
                <div className="mb-2 sm:mb-3">
                  <span className="inline-block bg-orange-100 text-orange-800 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold border border-orange-300">
                    {scheme.category}
                  </span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-3">
                  {getSchemeText(scheme, 'objective')}
                </p>
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-2">
                  {scheme.tags?.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SchemeList
