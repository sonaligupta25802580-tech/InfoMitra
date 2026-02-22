import React, { useState, useEffect } from 'react'

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if running in standalone mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      window.navigator.standalone === true

    setIsStandalone(standalone)

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(ios)

    // Debug logging
    console.log('PWA Install Prompt - Standalone:', standalone)
    console.log('PWA Install Prompt - iOS:', ios)
    console.log('PWA Install Prompt - User Agent:', navigator.userAgent)

    // Don't show install prompt if already installed
    if (standalone) {
      console.log('PWA Install Prompt - App already installed')
      return
    }

    // Handle beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA Install Prompt - beforeinstallprompt event fired')
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Check if user has dismissed the prompt before
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      if (!dismissed) {
        console.log('PWA Install Prompt - Showing install prompt')
        setShowInstall(true)
      } else {
        console.log('PWA Install Prompt - User previously dismissed')
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // For iOS, show install instructions if not installed
    if (ios && !standalone) {
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      if (!dismissed) {
        console.log('PWA Install Prompt - Showing iOS instructions')
        setShowInstall(true)
      }
    }

    // Debug: Check if manifest is accessible
    const manifestLink = document.querySelector('link[rel="manifest"]')
    if (manifestLink) {
      console.log('PWA Install Prompt - Manifest link found:', manifestLink.href)
    } else {
      console.warn('PWA Install Prompt - Manifest link NOT found in HTML')
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.warn('PWA Install Prompt - No deferred prompt available')
      return
    }

    try {
      console.log('PWA Install Prompt - Showing install prompt')
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      console.log('PWA Install Prompt - User choice:', outcome)
      if (outcome === 'accepted') {
        console.log('PWA Install Prompt - User accepted the install')
      } else {
        console.log('PWA Install Prompt - User dismissed the install')
      }
      
      setDeferredPrompt(null)
      setShowInstall(false)
    } catch (error) {
      console.error('PWA Install Prompt - Error during installation:', error)
    }
  }

  const handleDismiss = () => {
    console.log('PWA Install Prompt - User dismissed prompt')
    setShowInstall(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!showInstall || isStandalone) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl p-4 border-2 border-orange-500">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg 
                className="w-7 h-7 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              Install InfoMitra
            </h3>
            
            {isIOS ? (
              <div className="text-sm text-gray-600 mb-3">
                <p className="mb-2">Install this app on your iPhone:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Tap the Share button <span className="inline-block">📤</span></li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" in the top right corner</li>
                </ol>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-3">
                Install InfoMitra for quick access and offline support. Get personalized scheme recommendations anytime!
              </p>
            )}
            
            <div className="flex gap-2">
              {!isIOS && deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors duration-200 shadow-sm"
                >
                  Install App
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                {isIOS ? 'Got it' : 'Not now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt
