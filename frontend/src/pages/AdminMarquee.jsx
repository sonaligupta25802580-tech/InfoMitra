import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import LanguageToggle from '../components/LanguageToggle'
import BackButton from '../components/BackButton'
import { API_URL } from '../config'

const AdminMarquee = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' | 'error'
  const [settings, setSettings] = useState({
    custom_message: '',
    show_new_schemes: true,
    is_active: true
  })

  useEffect(() => {
    checkAdmin()
    fetchMarqueeSettings()
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

  const fetchMarqueeSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/marquee`)
      setSettings({
        custom_message: response.data.custom_message || '',
        show_new_schemes: response.data.show_new_schemes !== false,
        is_active: response.data.is_active !== false
      })
    } catch (error) {
      console.error('Failed to fetch marquee settings', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      await axios.put(`${API_URL}/admin/marquee`, settings)
      setMessage(t('settingsSaved'))
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Failed to save marquee settings', error)
      setMessage(t('failedSaveSettings'))
      setMessageType('error')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
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
            <h1 className="text-2xl font-bold text-gray-800">{t('adminPanelTitle')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <button
              onClick={() => navigate('/admin')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition border border-gray-700"
            >
              {t('backToAdmin')}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition border border-red-700"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </nav>
      <BackButton />

      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white border-l-4 border-orange-500 p-6 mb-8 shadow">
          <h2 className="text-3xl font-bold text-gray-800">{t('marqueeBannerSettings')}</h2>
          <p className="text-gray-600 mt-2">{t('marqueeBannerDesc')}</p>
        </div>

        {loading ? (
          <div className="text-gray-800 text-center bg-white p-8 rounded shadow">{t('loading')}</div>
        ) : (
          <div className="bg-white rounded shadow-lg border-2 border-gray-200 p-8">
            {message && (
              <div className={`mb-6 p-4 rounded border-2 ${
                messageType === 'success'
                  ? 'bg-green-50 border-green-300 text-green-800' 
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}>
                {message}
              </div>
            )}

            {/* Active Toggle */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{t('marqueeActive')}</h3>
                  <p className="text-sm text-gray-600">{t('marqueeActiveDesc')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.is_active}
                    onChange={(e) => setSettings({ ...settings, is_active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>

            {/* Custom Message */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-800 mb-2">
                {t('customMessage')}
              </label>
              <p className="text-sm text-gray-600 mb-3">
                {t('customMessageDesc')}
              </p>
              <textarea
                value={settings.custom_message}
                onChange={(e) => setSettings({ ...settings, custom_message: e.target.value })}
                placeholder="e.g., Welcome to InfoMitra! Check out our latest government schemes..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none text-gray-800"
              />
              <p className="text-xs text-gray-500 mt-2">
                {t('customMessageHint')}
              </p>
            </div>

            {/* Show New Schemes Toggle */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{t('showNewSchemes')}</h3>
                  <p className="text-sm text-gray-600">{t('showNewSchemesDesc')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.show_new_schemes}
                    onChange={(e) => setSettings({ ...settings, show_new_schemes: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>

            {/* Preview Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3">{t('preview')}</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-100">
                {!settings.is_active ? (
                  <p className="text-gray-500 text-center italic">{t('marqueeDisabled')}</p>
                ) : !settings.custom_message && !settings.show_new_schemes ? (
                  <p className="text-gray-500 text-center italic">{t('noMarqueeContent')}</p>
                ) : (
                  <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-4 py-3 rounded overflow-hidden">
                    <div className="flex items-center gap-4 text-sm">
                      {settings.custom_message && (
                        <span className="flex items-center gap-2">
                          <span className="text-yellow-300">★</span>
                          {settings.custom_message}
                        </span>
                      )}
                      {settings.custom_message && settings.show_new_schemes && (
                        <span className="text-orange-400">◆</span>
                      )}
                      {settings.show_new_schemes && (
                        <span className="flex items-center gap-2">
                          <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded">{t('newBadge')}</span>
                          <span>{t('latestSchemes')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition border-2 border-gray-300"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition border-2 border-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? t('saving') : t('saveSettings')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminMarquee
