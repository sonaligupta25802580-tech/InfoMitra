import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import LanguageToggle from '../components/LanguageToggle'
import { API_URL } from '../config'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, token } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    identifier: '',
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
      // Detect if identifier is email or phone
      const isEmail = formData.identifier.includes('@')
      const payload = {
        password: formData.password,
        ...(isEmail ? { email: formData.identifier } : { phone: formData.identifier })
      }
      const response = await axios.post(`${API_URL}/auth/login`, payload)
      login(response.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
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
        <div className="border-l-4 border-blue-600 pl-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{t('login')}</h2>
        </div>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded border border-red-300 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('phoneOrEmail')}</label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              placeholder="10-digit phone or email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
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
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-semibold border-2 border-blue-700"
          >
            {t('submit')}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-orange-500 hover:underline font-semibold">
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
