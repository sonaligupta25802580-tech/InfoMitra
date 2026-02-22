import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import LanguageToggle from '../components/LanguageToggle'
import { API_URL } from '../config'

const EditProfile = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, updateUser, logout } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    gender: '',
    age: '',
    state: '',
    area: '',
    category: '',
    disability: 'no',
    disabilityPercent: '',
    student: '',
    education: '',
    preferred_language: 'en'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        name: user.profile.name || '',
        phone_number: user.profile.phone_number || '',
        gender: user.profile.gender || '',
        age: user.profile.age || '',
        state: user.profile.state || '',
        area: user.profile.area || '',
        category: user.profile.category || '',
        disability: user.profile.disability || 'no',
        disabilityPercent: user.profile.disabilityPercent || '',
        student: user.profile.student || '',
        education: user.profile.education || '',
        preferred_language: user.profile.preferred_language || 'en'
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await axios.put(`${API_URL}/auth/profile`, formData)
      const response = await axios.get(`${API_URL}/auth/profile`)
      updateUser(response.data)
      setMessage('Profile updated successfully!')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      setMessage('Failed to update profile')
      console.error('Profile update failed', err)
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
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition border-2 border-blue-700 text-sm"
              >
                {t('dashboard')}
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
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition border-2 border-blue-700 w-full text-left"
                >
                  {t('dashboard')}
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

      <div className="max-w-2xl mx-auto p-8 mt-8">
        <div className="bg-white rounded shadow-lg border-2 border-gray-300 p-8">
          <div className="border-l-4 border-orange-500 pl-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Edit Profile</h2>
          </div>
          
          {message && (
            <div className={`p-3 rounded mb-4 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')} *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')} *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l text-gray-600 font-medium text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                    placeholder="10-digit number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('gender')} *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Male">{t('male')}</option>
                  <option value="Female">{t('female')}</option>
                  <option value="Other">{t('other')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('age')} *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('state')} *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('area')} *</label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Urban">{t('urban')}</option>
                  <option value="Rural">{t('rural')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')} *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  <option value="General">{t('general')}</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('disability')} *</label>
                <select
                  name="disability"
                  value={formData.disability}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="no">{t('no')}</option>
                  <option value="yes">{t('yes')}</option>
                </select>
              </div>
              {formData.disability === 'yes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('disabilityPercent')}</label>
                  <input
                    type="number"
                    name="disabilityPercent"
                    value={formData.disabilityPercent}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('student')} *</label>
                <select
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  <option value="yes">{t('yes')}</option>
                  <option value="no">{t('no')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('education')} *</label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Below 10th">Below 10th</option>
                  <option value="10th">10th</option>
                  <option value="12th">12th</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post-Graduate">Post-Graduate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('preferredLanguage')} *</label>
                <select
                  name="preferred_language"
                  value={formData.preferred_language}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="mr">मराठी</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition font-semibold disabled:bg-gray-400 border-2 border-orange-600"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
