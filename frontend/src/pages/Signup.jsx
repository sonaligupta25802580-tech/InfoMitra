import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import LanguageToggle from '../components/LanguageToggle'
import { API_URL } from '../config'

const Signup = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, token } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [token, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, formData)
      login(response.data.access_token)
      navigate('/onboarding')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:text-orange-500 hover:border-orange-400 hover:shadow-lg transition-all duration-200 group"
        aria-label="Back to Home"
      >
        <svg className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <div className="bg-white rounded shadow-lg border-2 border-gray-300 p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/logo.png"
            alt="InfoMitra Logo"
            className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-orange-400"
          />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">{t('welcome')}</h1>
        <p className="text-center text-gray-600 mb-6">{t('tagline')}</p>
        <div className="border-l-4 border-orange-500 pl-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{t('signup')}</h2>
        </div>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded border border-red-300 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')} (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
                name="phone"
                value={formData.phone}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')} *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition font-semibold border-2 border-orange-600"
          >
            {t('submit')}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
