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
                  className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition border-2 border-blue-600 w-full"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-orange-500 text-white px-4 py-2 rounded font-semibold hover:bg-orange-600 transition border-2 border-orange-600 w-full"
                >
                  {t('signup')}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <MarqueeBanner />

      {/* Hero Carousel Section */}
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(350px, 60vh, 600px)' }}>
        {/* Carousel Images */}
        {heroImages.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out"
            style={{
              opacity: currentSlide === index ? 1 : 0,
              transform: currentSlide === index ? 'scale(1)' : 'scale(1.08)',
              zIndex: currentSlide === index ? 1 : 0,
            }}
          >
            <img
              src={img}
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />
          </div>
        ))}

        {/* Hero Text Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl mx-auto">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-5 drop-shadow-lg"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}
            >
              {t('welcome')}
            </h2>
            <p
              className="text-lg sm:text-xl md:text-2xl text-orange-200 font-semibold mb-4 sm:mb-6 drop-shadow-md"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}
            >
              {t('tagline')}
            </p>
            <p
              className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}
            >
              Discover government schemes tailored to your profile. Get personalized recommendations based on your age, location, education, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-bold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-2 border-orange-400 w-full sm:w-auto"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-white/95 text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-2 border-white/60 backdrop-blur-sm w-full sm:w-auto"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-500 border-2 border-white/70 shadow-md ${
                currentSlide === index
                  ? 'w-8 h-3 bg-orange-400'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => goToSlide((currentSlide - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-300 border border-white/20"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => goToSlide((currentSlide + 1) % heroImages.length)}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-300 border border-white/20"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded border-2 border-blue-200 p-6 sm:p-8 text-center shadow-md hover:shadow-lg transition">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🎯</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Personalized</h3>
            <p className="text-gray-600">
              Get scheme recommendations based on your unique profile and eligibility criteria
            </p>
          </div>

          <div className="bg-white rounded border-2 border-green-200 p-6 sm:p-8 text-center shadow-md hover:shadow-lg transition">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🌐</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Multilingual</h3>
            <p className="text-gray-600">
              Access information in English, Hindi, and Marathi for better understanding
            </p>
          </div>

          <div className="bg-white rounded border-2 border-orange-200 p-6 sm:p-8 text-center shadow-md hover:shadow-lg transition sm:col-span-2 md:col-span-1">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">✓</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Easy Access</h3>
            <p className="text-gray-600">
              Simple interface to explore and apply for government schemes with direct links
            </p>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 md:mt-20">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Easy steps to apply
            </h3>
            <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              for Government Schemes
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-gray-200 p-6 text-center shadow hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-green-700 mb-2">Enter Details</h4>
              <p className="text-sm text-gray-700">
                Start by entering your <span className="font-bold">basic details!</span>
              </p>
            </div>

            <div className="hidden md:flex justify-center">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-gray-200 p-6 text-center shadow hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-green-700 mb-2">Search</h4>
              <p className="text-sm text-gray-700">
                Our search engine will <span className="font-bold">find the relevant schemes!</span>
              </p>
            </div>

            <div className="hidden md:flex justify-center">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-gray-200 p-6 text-center shadow hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-green-700 mb-2">Select & Apply</h4>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Select and apply</span> for the best suited scheme
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t-4 border-orange-500 mt-12 sm:mt-16 md:mt-20 py-6 sm:py-8 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p className="font-semibold text-sm sm:text-base">&copy; 2024 InfoMitra. Empowering citizens with information.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
