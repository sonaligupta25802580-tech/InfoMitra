import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, useCallback } from 'react'
import LanguageToggle from '../components/LanguageToggle'
import MarqueeBanner from '../components/MarqueeBanner'

const heroImages = ['/hero1.png', '/hero2.png', '/hero3.png']

const Home = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [isTransitioning])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % heroImages.length)
  }, [currentSlide, goToSlide])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">InfoMitra</h1>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <LanguageToggle />
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-blue-600 px-4 lg:px-6 py-2 rounded font-semibold hover:bg-gray-100 transition border-2 border-blue-600 text-sm lg:text-base"
              >
                {t('login')}
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-orange-500 text-white px-4 lg:px-6 py-2 rounded font-semibold hover:bg-orange-600 transition border-2 border-orange-600 text-sm lg:text-base"
              >
                {t('signup')}
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-800 p-2"
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
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col gap-3">
                <LanguageToggle />
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition border-2 border-blue-600 w-full text-left"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-orange-500 text-white px-4 py-2 rounded font-semibold hover:bg-orange-600 transition border-2 border-orange-600 w-full text-left"
                >
                  {t('signup')}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <MarqueeBanner />

      {/* Hero Section */}
      <div className="relative w-full overflow-hidden" style={{ height: '420px' }}>
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={img} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>
        ))}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
            {t('welcome')}
          </h2>
          <p className="text-lg sm:text-xl text-orange-300 font-semibold mb-4 drop-shadow">
            {t('tagline')}
          </p>
          <p className="text-sm sm:text-base text-white max-w-2xl mb-6 opacity-90">
            {t('heroDescription')}
          </p>
          
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-orange-400 w-6' : 'bg-white bg-opacity-60'}`}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 sm:p-8 text-center shadow hover:shadow-md transition">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-orange-600 mb-2">{t('featurePersonalized')}</h4>
            <p className="text-sm text-gray-700">{t('featurePersonalizedDesc')}</p>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 sm:p-8 text-center shadow hover:shadow-md transition">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-blue-600 mb-2">{t('featureMultilingual')}</h4>
            <p className="text-sm text-gray-700">{t('featureMultilingualDesc')}</p>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 sm:p-8 text-center shadow hover:shadow-md transition">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-green-600 mb-2">{t('featureEasyAccess')}</h4>
            <p className="text-sm text-gray-700">{t('featureEasyAccessDesc')}</p>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-white border-t-2 border-b-2 border-gray-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('stepsTitle')}</h3>
            <p className="text-orange-500 font-semibold text-lg mt-1">{t('stepsSubtitle')}</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border border-gray-200 p-6 text-center shadow hover:shadow-md transition w-full md:w-64">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-orange-700 mb-2">{t('stepEnterDetails')}</h4>
              <p className="text-sm text-gray-700">{t('stepEnterDetailsDesc')}</p>
            </div>

            <div className="hidden md:flex justify-center px-4">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-gray-200 p-6 text-center shadow hover:shadow-md transition w-full md:w-64">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-green-700 mb-2">{t('stepSearch')}</h4>
              <p className="text-sm text-gray-700">{t('stepSearchDesc')}</p>
            </div>

            <div className="hidden md:flex justify-center px-4">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-gray-200 p-6 text-center shadow hover:shadow-md transition w-full md:w-64">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-green-700 mb-2">{t('stepSelectApply')}</h4>
              <p className="text-sm text-gray-700">{t('stepSelectApplyDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t-4 border-orange-500 mt-0 py-6 sm:py-8 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p className="font-semibold text-sm sm:text-base">{t('footerText')}</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
