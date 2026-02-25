import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import LanguageToggle from '../components/LanguageToggle'
import BackButton from '../components/BackButton'
import { API_URL } from '../config'

const SchemeDetail = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const [scheme, setScheme] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScheme()
  }, [id])

  const fetchScheme = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/schemes/${id}`)
      setScheme(response.data)
    } catch (error) {
      console.error('Failed to fetch scheme', error)
    } finally {
      setLoading(false)
    }
  }

  const getSchemeText = (field) => {
    const lang = i18n.language
    return scheme[field]?.[lang] || scheme[field]?.en || ''
  }

  const getDocuments = () => {
    const lang = i18n.language
    return scheme.documents?.[lang] || scheme.documents?.en || []
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-800 text-lg sm:text-2xl px-4">{t('loading')}</div>
      </div>
    )
  }

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-800 text-lg sm:text-2xl px-4">{t('schemeNotFound')}</div>
      </div>
    )
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
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 transition border-2 border-blue-700 text-sm sm:text-base"
            >
              {t('backToSchemes')}
            </button>
          </div>
        </div>
      </nav>
      <BackButton />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded shadow-lg border-2 border-gray-300 p-4 sm:p-6 md:p-8">
          <div className="border-l-4 border-orange-500 pl-3 sm:pl-4 mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              {getSchemeText('scheme_name')}
            </h1>
          </div>
          
          <div className="mb-4 sm:mb-6">
            <span className="inline-block bg-orange-100 text-orange-800 px-3 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm font-semibold border border-orange-300">
              {scheme.category}
            </span>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="border-l-4 border-blue-500 pl-3 sm:pl-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-gray-800">{t('objective')}</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{getSchemeText('objective')}</p>
            </div>

            <div className="border-l-4 border-green-500 pl-3 sm:pl-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-gray-800">{t('eligibility')}</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{getSchemeText('eligibility')}</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-3 sm:pl-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-gray-800">{t('benefits')}</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{getSchemeText('benefits')}</p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-3 sm:pl-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-gray-800">{t('documents')}</h2>
              <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 space-y-1">
                {getDocuments().map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>

            <div className="border-l-4 border-red-500 pl-3 sm:pl-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-gray-800">{t('applyProcess')}</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{getSchemeText('apply_process')}</p>
            </div>

            {scheme.official_link && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 text-gray-800">{t('officialLink')}</h2>
                <a
                  href={scheme.official_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded hover:bg-orange-600 transition font-semibold border-2 border-orange-600 text-sm sm:text-base"
                >
                  {t('visitWebsite')}
                </a>
              </div>
            )}

            <div className="pt-3 sm:pt-4 border-t-2 border-gray-300">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {scheme.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm border border-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchemeDetail
