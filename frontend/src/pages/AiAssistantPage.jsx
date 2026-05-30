import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { aiApi } from '../services/api'
import Button from '../components/ui/Button'

const SUGGESTIONS = [
  'What should I focus on today?',
  'How am I doing with my tasks?',
  'I have too many tasks, help me prioritize.',
  'Show me my overdue tasks.',
  'Give me a weekly plan.',
]

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: 10,
      alignItems: 'flex-start',
      animation: 'fadeIn 0.25s ease',
    }}>
      {/* Avatar */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: isUser
          ? 'linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)'
          : 'var(--bg-elevated)',
        border: isUser ? 'none' : '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {isUser
          ? <User size={15} color="#fff" />
          : <Bot size={15} color="var(--accent-light)" />}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '72%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
        background: isUser ? 'var(--accent)' : 'var(--bg-elevated)',
        border: isUser ? 'none' : '1px solid var(--border)',
        fontSize: 14,
        lineHeight: 1.6,
        color: isUser ? '#fff' : 'var(--text-primary)',
        whiteSpace: 'pre-wrap',
      }}>
        {msg.content}
        {!msg.aiPowered && !isUser && msg.model && (
          <div style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: '1px solid var(--border)',
            fontSize: 11,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <Zap size={10} />
            Smart Assistant (mock mode)
          </div>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Bot size={15} color="var(--accent-light)" />
      </div>
      <div style={{
        padding: '12px 18px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: '4px 18px 18px 18px',
        display: 'flex', gap: 4, alignItems: 'center',
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--text-muted)',
            animation: `pulse 1.2s ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

export default function AiAssistantPage() {
  const { user }    = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your Smart Life Assistant.\n\nI have full context of your tasks, priorities, and deadlines. Ask me anything about managing your workload, what to focus on, or how to better organize your time.`,
    }
  ])
  const [input, setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return

    const userMsg = { id: Date.now(), role: 'user', content: q }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await aiApi.suggest({ userId: user.id, question: q })
      setMessages((m) => [...m, {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.answer,
        aiPowered: res.aiPowered,
        model: res.model,
      }])
    } catch (err) {
      setMessages((m) => [...m, {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={styles.page}>
      {/* Header bar */}
      <div style={styles.chatHeader}>
        <div style={styles.chatHeaderLeft}>
          <div style={styles.botAvatar}>
            <Sparkles size={16} color="var(--accent-light)" />
          </div>
          <div>
            <div style={styles.botName}>Life Assistant</div>
            <div style={styles.botStatus}>
              <span style={styles.statusDot} />
              Context-aware · Knows your tasks
            </div>
          </div>
        </div>
        <div style={{
          fontSize: 12,
          color: 'var(--text-muted)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 99,
          padding: '4px 12px',
        }}>
          Smart Mock Mode
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((msg) => (
          <ChatBubble key={msg.id} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={styles.suggestions}>
          <p style={styles.suggestLabel}>Try asking:</p>
          <div style={styles.suggestRow}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                style={styles.suggestChip}
                onClick={() => sendMessage(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={styles.inputRow}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask me anything about your tasks…"
          rows={1}
          style={styles.textarea}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            ...styles.sendBtn,
            ...((!input.trim() || loading) ? styles.sendBtnDisabled : {}),
          }}
        >
          <Send size={16} />
        </button>
      </div>
      <p style={styles.hint}>Press Enter to send · Shift+Enter for new line</p>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-surface)',
    flexShrink: 0,
  },
  chatHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    background: 'var(--accent-glow)',
    border: '1px solid rgba(99,102,241,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botName: {
    fontFamily: 'var(--font-display)',
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  botStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--success)',
    boxShadow: '0 0 4px var(--success)',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  suggestions: {
    padding: '0 32px 16px',
    flexShrink: 0,
  },
  suggestLabel: {
    fontSize: 12,
    color: 'var(--text-muted)',
    marginBottom: 8,
  },
  suggestRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestChip: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 99,
    color: 'var(--text-secondary)',
    fontSize: 12,
    padding: '6px 12px',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'all 0.15s',
  },
  inputRow: {
    display: 'flex',
    gap: 10,
    padding: '12px 32px',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-surface)',
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  textarea: {
    flex: 1,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    outline: 'none',
    resize: 'none',
    lineHeight: 1.5,
    maxHeight: 120,
    overflow: 'auto',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: 'var(--accent)',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s',
    flexShrink: 0,
  },
  sendBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  hint: {
    textAlign: 'center',
    fontSize: 11,
    color: 'var(--text-muted)',
    padding: '4px 32px 12px',
    flexShrink: 0,
  },
}
