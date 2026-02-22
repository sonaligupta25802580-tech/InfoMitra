import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'

const LanguageToggle = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const languages = {
    en: 'English',
    hi: 'हिंदी',
    mr: 'मराठी'
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition"
      >
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-800 hidden sm:inline">
          {languages[i18n.language]}
        </span>
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg border-2 border-gray-200 z-50">
          <button
            onClick={() => changeLanguage('en')}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
              i18n.language === 'en' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'
            }`}
          >
            English
          </button>
          <button
            onClick={() => changeLanguage('hi')}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
              i18n.language === 'hi' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => changeLanguage('mr')}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
              i18n.language === 'mr' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'
            }`}
          >
            मराठी
          </button>
        </div>
      )}
    </div>
  )
}

export default LanguageToggle
