import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

/* ─── Injected CSS ───────────────────────────────────────────────────────────── */
const CHATBOT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

  .im-chatbot * { font-family: 'Sora', sans-serif !important; }

  @keyframes im-slideUp {
    from { opacity: 0; transform: translateY(16px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes im-fabPulse {
    0%,100% { box-shadow: 0 8px 24px rgba(245,158,11,0.45), 0 0 0 0 rgba(245,158,11,0.4); }
    50%      { box-shadow: 0 8px 24px rgba(245,158,11,0.45), 0 0 0 14px rgba(245,158,11,0); }
  }
  @keyframes im-dot {
    0%,60%,100% { transform: translateY(0); opacity: 0.35; }
    30%          { transform: translateY(-6px); opacity: 1; }
  }
  @keyframes im-msgIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .im-window  { animation: im-slideUp 0.32s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .im-msg     { animation: im-msgIn 0.22s ease-out forwards; }
  .im-fab-pulse { animation: im-fabPulse 2.6s ease-in-out infinite; }

  .im-dot1 { animation: im-dot 1.3s ease-in-out infinite 0s; }
  .im-dot2 { animation: im-dot 1.3s ease-in-out infinite 0.18s; }
  .im-dot3 { animation: im-dot 1.3s ease-in-out infinite 0.36s; }

  .im-scroll::-webkit-scrollbar       { width: 3px; }
  .im-scroll::-webkit-scrollbar-track { background: transparent; }
  .im-scroll::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.25); border-radius: 2px; }
  .im-scroll::-webkit-scrollbar-thumb:hover { background: rgba(245,158,11,0.5); }

  .im-textarea {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.11);
    border-radius: 12px;
    padding: 10px 14px;
    color: #f3f4f6;
    font-size: 13px;
    resize: none;
    font-family: 'Sora', sans-serif;
    line-height: 1.55;
    max-height: 96px;
    overflow-y: auto;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
    box-sizing: border-box;
  }
  .im-textarea::placeholder { color: rgba(156,163,175,0.5); }
  .im-textarea:focus {
    outline: none;
    border-color: rgba(245,158,11,0.55);
    box-shadow: 0 0 0 3px rgba(245,158,11,0.1);
  }

  .im-send {
    width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(245,158,11,0.35);
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
  }
  .im-send:hover:not(:disabled) { transform: scale(1.08); box-shadow: 0 6px 18px rgba(245,158,11,0.5); }
  .im-send:disabled { opacity: 0.4; cursor: not-allowed; }

  .im-close-btn {
    background: rgba(255,255,255,0.07); border: none; border-radius: 8px;
    width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #9ca3af; transition: background 0.18s, color 0.18s; flex-shrink: 0;
  }
  .im-close-btn:hover { background: rgba(255,255,255,0.14); color: #f8f8f8; }

  .im-quick-btn {
    background: rgba(245,158,11,0.1);
    border: 1px solid rgba(245,158,11,0.28);
    border-radius: 20px;
    padding: 5px 12px;
    color: #fbbf24;
    font-size: 11.5px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.18s, border-color 0.18s;
    font-family: 'Sora', sans-serif;
  }
  .im-quick-btn:hover {
    background: rgba(245,158,11,0.2);
    border-color: rgba(245,158,11,0.55);
  }
`

/* ─── Constants ──────────────────────────────────────────────────────────────── */
const WELCOME_MSG = `👋 Hello! I'm **InfoMitra Assistant**.

I can help you:
• Discover government schemes you're eligible for
• Search schemes by category (Education, Agriculture, Housing…)
• Explain benefits, required documents & how to apply

What would you like to know?`

const QUICK_PROMPTS = [
  'Show all schemes',
  'Education schemes',
  'Schemes for SC category',
  'Schemes for women',
  'Disability schemes',
]

/* ─── Text Renderer (supports **bold** and newlines) ─────────────────────────── */
function RenderText({ text }) {
  return (
    <>
      {text.split('\n').map((line, i, arr) => {
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <span key={i}>
            {parts.map((p, j) =>
              j % 2 === 1
                ? <strong key={j} style={{ fontWeight: 600 }}>{p}</strong>
                : p
            )}
            {i < arr.length - 1 && <br />}
          </span>
        )
      })}
    </>
  )
}

/* ─── Bot Avatar ─────────────────────────────────────────────────────────────── */
function BotAvatar({ size = 26 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 ${size * 0.5}px rgba(245,158,11,0.35)`,
      border: '1.5px solid rgba(245,158,11,0.35)',
      overflow: 'hidden',
      padding: '3px',
    }}>
      <img
        src="/logo.png"
        alt="InfoMitra"
        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
      />
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export default function FloatingChatbot() {
  const [isOpen, setIsOpen]       = useState(false)
  const [messages, setMessages]   = useState([{ role: 'model', text: WELCOME_MSG }])
  const [input, setInput]         = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef(null)
  const textareaRef    = useRef(null)
  const stylesRef      = useRef(false)

  /* Inject CSS once */
  useEffect(() => {
    if (stylesRef.current) return
    stylesRef.current = true
    const tag = document.createElement('style')
    tag.id = 'im-chatbot-styles'
    tag.textContent = CHATBOT_STYLES
    document.head.appendChild(tag)
  }, [])

  /* Auto-scroll to latest message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  /* Focus textarea when chat opens */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 320)
    }
  }, [isOpen])

  /* ── Send message ── */
  const sendMessage = async (text) => {
    const userText = (text || input).trim()
    if (!userText || isLoading) return

    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    const newMessages = [...messages, { role: 'user', text: userText }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Build history: skip the initial welcome, exclude the just-added user msg
      const history = newMessages.slice(1, -1).map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        text: m.text,
      }))

      const res = await axios.post(`${API_URL}/chat/message`, {
        message: userText,
        history,
      })

      setMessages(prev => [...prev, { role: 'model', text: res.data.response }])
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Sorry, something went wrong. Please try again.'
      setMessages(prev => [...prev, { role: 'model', text: `⚠️ ${errMsg}` }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleTextareaInput = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'
  }

  /* ── Render ── */
  return (
    <div
      className="im-chatbot"
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}
    >
      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className="im-window"
          style={{
            position: 'absolute',
            bottom: '68px',
            right: '0',
            width: '360px',
            height: '530px',
            background: 'linear-gradient(180deg, #0d0d1a 0%, #111120 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(245,158,11,0.18)',
            boxShadow: '0 28px 72px rgba(0,0,0,0.65), 0 0 0 1px rgba(245,158,11,0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)',
            borderBottom: '1px solid rgba(245,158,11,0.2)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
            flexShrink: 0,
          }}>
            {/* Avatar */}
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 18px rgba(245,158,11,0.45)',
              border: '2px solid rgba(245,158,11,0.4)',
              overflow: 'hidden',
              padding: '4px',
            }}>
              <img
                src="/logo.png"
                alt="InfoMitra"
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#f9fafb', fontWeight: 600, fontSize: '14px', letterSpacing: '0.01em' }}>
                InfoMitra Assistant
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#22c55e', boxShadow: '0 0 6px #22c55e',
                }} />
                <span style={{ color: '#9ca3af', fontSize: '11px' }}>Online · Scheme Expert</span>
              </div>
            </div>

            <button
              className="im-close-btn"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            className="im-scroll"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="im-msg"
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: '7px',
                }}
              >
                {msg.role === 'model' && <BotAvatar size={26} />}

                <div style={{
                  maxWidth: '80%',
                  padding: '9px 13px',
                  borderRadius: msg.role === 'user'
                    ? '16px 16px 3px 16px'
                    : '16px 16px 16px 3px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                    : 'rgba(255,255,255,0.065)',
                  border: msg.role === 'user'
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.08)',
                  color: msg.role === 'user' ? '#0d0d1a' : '#e5e7eb',
                  fontSize: '13px',
                  lineHeight: '1.58',
                  fontWeight: msg.role === 'user' ? 500 : 400,
                  wordBreak: 'break-word',
                }}>
                  <RenderText text={msg.text} />
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="im-msg" style={{ display: 'flex', alignItems: 'flex-end', gap: '7px' }}>
                <BotAvatar size={26} />
                <div style={{
                  padding: '11px 15px',
                  borderRadius: '16px 16px 16px 3px',
                  background: 'rgba(255,255,255,0.065)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', gap: '5px', alignItems: 'center',
                }}>
                  <div className="im-dot1" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b' }} />
                  <div className="im-dot2" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b' }} />
                  <div className="im-dot3" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts (only show when just the welcome message is present) */}
          {messages.length === 1 && !isLoading && (
            <div style={{
              padding: '0 12px 10px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              flexShrink: 0,
            }}>
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  className="im-quick-btn"
                  onClick={() => sendMessage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div style={{
            padding: '10px 12px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.025)',
            display: 'flex',
            gap: '9px',
            alignItems: 'flex-end',
            flexShrink: 0,
          }}>
            <textarea
              ref={textareaRef}
              className="im-textarea"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleTextareaInput}
              placeholder="Ask about schemes… (Enter to send)"
              rows={1}
              disabled={isLoading}
            />
            <button
              className="im-send"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              title="Send"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Action Button ── */}
      <button
        className={!isOpen ? 'im-fab-pulse' : ''}
        onClick={() => setIsOpen(prev => !prev)}
        title={isOpen ? 'Close chat' : 'Chat with InfoMitra Assistant'}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: isOpen
            ? 'linear-gradient(135deg, #374151, #1f2937)'
            : 'linear-gradient(135deg, #f59e0b, #d97706)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isOpen
            ? '0 8px 24px rgba(0,0,0,0.45)'
            : '0 8px 24px rgba(245,158,11,0.45)',
          transition: 'background 0.3s, box-shadow 0.3s, transform 0.3s',
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          position: 'relative',
        }}
      >
        {/* Green online dot */}
        {!isOpen && (
          <div style={{
            position: 'absolute', top: '3px', right: '3px',
            width: '11px', height: '11px', borderRadius: '50%',
            background: '#22c55e',
            border: '2px solid #0d0d1a',
            boxShadow: '0 0 6px #22c55e',
          }} />
        )}

        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              fill="white"
              opacity="0.92"
            />
            <circle cx="9"  cy="10" r="1.3" fill="#f59e0b" />
            <circle cx="12" cy="10" r="1.3" fill="#f59e0b" />
            <circle cx="15" cy="10" r="1.3" fill="#f59e0b" />
          </svg>
        )}
      </button>
    </div>
  )
}
