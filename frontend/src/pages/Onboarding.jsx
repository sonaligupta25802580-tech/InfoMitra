import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import LanguageToggle from '../components/LanguageToggle'
import { API_URL } from '../config'

const Onboarding = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, updateUser } = useContext(AuthContext)
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

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        phone_number: user.phone || prev.phone_number
      }))
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${API_URL}/auth/profile`, formData)
      const response = await axios.get(`${API_URL}/auth/profile`)
      updateUser(response.data)
      navigate('/dashboard')
    } catch (err) {
      console.error('Profile update failed', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:text-orange-500 hover:border-orange-400 hover:shadow-lg transition-all duration-200 group z-10"
        aria-label="Go back"
      >
        <svg className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <div className="max-w-2xl mx-auto bg-white rounded shadow-lg border-2 border-gray-300 p-8 mt-8">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/logo.png"
            alt="InfoMitra Logo"
            className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-orange-400"
          />
        </div>
        <div className="border-l-4 border-orange-500 pl-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{t('completeProfile')}</h2>
        </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
              {user?.email ? (
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              ) : (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder={t('optional')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
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
                  disabled={!!user?.phone}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  placeholder={t('phonePlaceholder')}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${user?.phone ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
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
                <option value="">{t('select')}</option>
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
                <option value="">{t('select')}</option>
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
                <option value="">{t('select')}</option>
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
                <option value="">{t('select')}</option>
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
                <option value="">{t('select')}</option>
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
                <option value="">{t('select')}</option>
                <option value="Below 10th">{t('below10th')}</option>
                <option value="10th">{t('tenth')}</option>
                <option value="12th">{t('twelfth')}</option>
                <option value="Graduate">{t('graduate')}</option>
                <option value="Post-Graduate">{t('postGraduate')}</option>
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
            className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition font-semibold border-2 border-orange-600"
          >
            {t('submit')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Onboarding
