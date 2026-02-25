import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [isOnboarded, setIsOnboarded] = useState(false)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`)
      setUser(response.data)
      setIsOnboarded(response.data.onboarded || false)
    } catch (error) {
      console.error('Failed to fetch profile', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const updateUser = (userData) => {
    setUser(userData)
    setIsOnboarded(userData.onboarded || false)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading, isOnboarded }}>
      {children}
    </AuthContext.Provider>
  )
}
