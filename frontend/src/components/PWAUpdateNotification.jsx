import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const PWAUpdateNotification = () => {
  const { t } = useTranslation()
  const [showUpdate, setShowUpdate] = useState(false)
  const [updateSW, setUpdateSW] = useState(null)

  useEffect(() => {
    const handleUpdateAvailable = (event) => {
      setUpdateSW(() => event.detail)
      setShowUpdate(true)
    }

    window.addEventListener('swUpdateAvailable', handleUpdateAvailable)

    return () => {
      window.removeEventListener('swUpdateAvailable', handleUpdateAvailable)
    }
  }, [])

  const handleUpdate = () => {
    if (updateSW) {
      updateSW(true) // Force update
    }
  }

  const handleDismiss = () => {
    setShowUpdate(false)
  }

  if (!showUpdate) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-2xl p-4 border border-orange-400">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{t('updateAvailable')}</h3>
            <p className="text-sm text-orange-50 mb-3">
              {t('updateDesc')}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-white text-orange-600 px-4 py-2 rounded-md font-medium hover:bg-orange-50 transition-colors duration-200 shadow-sm"
              >
                {t('updateNow')}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-md font-medium hover:bg-orange-700 transition-colors duration-200"
              >
                {t('later')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PWAUpdateNotification
