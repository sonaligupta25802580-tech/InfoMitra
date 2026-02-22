import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n'
import { registerSW } from 'virtual:pwa-register'

// Register service worker with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    // Dispatch custom event when update is available
    window.dispatchEvent(new CustomEvent('swUpdateAvailable', { detail: updateSW }))
  },
  onOfflineReady() {
    console.log('App ready to work offline')
    // Dispatch custom event when offline ready
    window.dispatchEvent(new CustomEvent('swOfflineReady'))
  },
  onRegistered(registration) {
    console.log('Service Worker registered:', registration)
  },
  onRegisterError(error) {
    console.error('Service Worker registration error:', error)
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
