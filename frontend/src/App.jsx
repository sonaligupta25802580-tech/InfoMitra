import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext, AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import SchemeList from './pages/SchemeList'
import SchemeDetail from './pages/SchemeDetail'
import EditProfile from './pages/EditProfile'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminSchemes from './pages/AdminSchemes'
import AdminSchemeForm from './pages/AdminSchemeForm'
import AdminMarquee from './pages/AdminMarquee'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import PWAUpdateNotification from './components/PWAUpdateNotification'
import OfflineIndicator from './components/OfflineIndicator'
import FloatingChatbot from './components/FloatingChatbot'

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext)
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  
  return token ? children : <Navigate to="/login" />
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schemes/:type"
        element={
          <ProtectedRoute>
            <SchemeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scheme/:id"
        element={
          <ProtectedRoute>
            <SchemeDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/schemes"
        element={
          <ProtectedRoute>
            <AdminSchemes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/schemes/create"
        element={
          <ProtectedRoute>
            <AdminSchemeForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/schemes/edit/:id"
        element={
          <ProtectedRoute>
            <AdminSchemeForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/marquee"
        element={
          <ProtectedRoute>
            <AdminMarquee />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <PWAInstallPrompt />
        <PWAUpdateNotification />
        <OfflineIndicator />
        <FloatingChatbot />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
