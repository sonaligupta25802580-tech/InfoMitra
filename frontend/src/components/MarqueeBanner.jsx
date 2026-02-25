import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { API_URL } from '../config'

const MarqueeBanner = () => {
  const { t, i18n } = useTranslation()
  const [marqueeData, setMarqueeData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMarqueeData()
  }, [])

  const fetchMarqueeData = async () => {
    try {
      const response = await fetch(`${API_URL}/schemes/marquee-data`)
      const data = await response.json()
      setMarqueeData(data)
    } catch (error) {
      console.error('Failed to fetch marquee data', error)
    } finally {
      setLoading(false)
    }
  }

  const getSchemeText = (scheme, field) => {
    const lang = i18n.language
    if (typeof scheme[field] === 'object') {
      return scheme[field]?.[lang] || scheme[field]?.en || ''
    }
    return scheme[field] || ''
  }

  if (loading || !marqueeData || !marqueeData.is_active) return null

  const hasMessage = marqueeData.custom_message && marqueeData.custom_message.trim() !== ''
  const hasSchemes = marqueeData.show_new_schemes && marqueeData.schemes && marqueeData.schemes.length > 0

  if (!hasMessage && !hasSchemes) return null

  // Build the scrolling content
  const buildContent = () => {
    const parts = []

    if (hasMessage) {
      parts.push(
        <span key="msg" className="marquee-item">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{marqueeData.custom_message}</span>
          </span>
        </span>
      )
    }

    if (hasSchemes) {
      if (hasMessage) {
        parts.push(
          <span key="sep-0" className="marquee-separator">
            ◆
          </span>
        )
      }

      parts.push(
        <span key="new-label" className="marquee-item">
          <span className="inline-flex items-center gap-2">
            <span className="bg-yellow-400 text-gray-900 text-xs font-black px-2 py-0.5 rounded-sm tracking-wider uppercase">{t('newBadge')}</span>
            <span className="font-semibold">{t('latestSchemesLabel')}</span>
          </span>
        </span>
      )

      marqueeData.schemes.forEach((scheme, index) => {
        if (index > 0) {
          parts.push(
            <span key={`sep-${index}`} className="marquee-separator">
              ●
            </span>
          )
        }
        parts.push(
          <span key={`scheme-${scheme._id}`} className="marquee-item">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-emerald-300">▸</span>
              <span>{getSchemeText(scheme, 'scheme_name')}</span>
            </span>
          </span>
        )
      })
    }

    return parts
  }

  const content = buildContent()

  return (
    <div className="marquee-banner">
      <div className="marquee-track">
        <div className="marquee-content">
          {content}
          {/* Duplicate for seamless loop */}
          <span className="marquee-separator">◆</span>
          {content}
        </div>
      </div>

      <style>{`
        .marquee-banner {
          background: linear-gradient(135deg, #1e3a5f 0%, #0f2439 40%, #1a3352 70%, #0d1f33 100%);
          border-bottom: 2px solid #f59e0b;
          overflow: hidden;
          position: relative;
          padding: 0;
        }

        .marquee-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 80px,
              rgba(245, 158, 11, 0.03) 80px,
              rgba(245, 158, 11, 0.03) 81px
            );
          pointer-events: none;
          z-index: 0;
        }

        .marquee-track {
          position: relative;
          z-index: 1;
          padding: 10px 0;
        }

        .marquee-content {
          display: inline-flex;
          align-items: center;
          gap: 24px;
          white-space: nowrap;
          animation: marqueeScroll 35s linear infinite;
          font-family: 'Segoe UI', 'Noto Sans', sans-serif;
          font-size: 0.9rem;
          color: #e2e8f0;
          letter-spacing: 0.02em;
        }

        .marquee-banner:hover .marquee-content {
          animation-play-state: paused;
        }

        .marquee-item {
          display: inline-flex;
          align-items: center;
        }

        .marquee-separator {
          color: #f59e0b;
          font-size: 0.6rem;
          opacity: 0.7;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 640px) {
          .marquee-content {
            font-size: 0.8rem;
            gap: 18px;
            animation-duration: 25s;
          }
          .marquee-track {
            padding: 8px 0;
          }
        }
      `}</style>
    </div>
  )
}

export default MarqueeBanner
