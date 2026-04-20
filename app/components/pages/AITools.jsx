'use client'
import { useState, useRef, useEffect } from 'react'
import { useApp } from '../AppContext'
import { chatWithAI, generateCopy } from '../../lib/gemini'

export default function AITools() {
  const { settings, metrics, diagnosis } = useApp()
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Campaign context loaded. Ask me anything — diagnose issues, write copy, optimize bids, or explain what\'s happening with your metrics.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeMode, setActiveMode] = useState('chat')
  const [copyBrief, setCopyBrief] = useState('')
  const [copyResults, setCopyResults] = useState(null)
  const [copyLoading, setCopyLoading] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const QUICK_PROMPTS = [
    'Why did my CTR drop this week?',
    'Write 3 ad variants for creative refresh',
    'Should I increase or decrease my bid?',
    'Analyze my audience saturation risk',
    'What\'s the best budget pacing strategy?',
  ]

  async function sendMessage(text) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const context = { metrics, diagnosis: diagnosis?.summary }
      let response
      if (settings.geminiKey) {
        response = await chatWithAI(newMessages, context, settings.geminiKey)
      } else {
        await new Promise(r => setTimeout(r, 800))
        response = getDemoResponse(msg, metrics)
      }
      setMessages(prev => [...prev, { role: 'ai', content: response }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: `Error: ${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateCopy() {
    if (!copyBrief.trim()) return
    setCopyLoading(true)
    try {
      let result
      if (settings.geminiKey) {
        result = await generateCopy(copyBrief, settings.geminiKey)
      } else {
        await new Promise(r => setTimeout(r, 900))
        result = {
          variants: [
            { label: 'Urgency', headline: 'Book your dream car today', body: 'India\'s most trusted marketplace. Certified cars, instant delivery. Limited stock available.' },
            { label: 'Social Proof', headline: '50,000+ happy buyers can\'t be wrong', body: 'Join India\'s largest car community. Test drive today, drive home tomorrow.' },
            { label: 'Value', headline: 'Get ₹25,000 more for your old car', body: 'Best-in-class exchange value guaranteed. Switch to your dream car this week.' },
          ]
        }
      }
      setCopyResults(result.variants)
    } catch (e) {
      alert(e.message)
    } finally {
      setCopyLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { id: 'chat', label: '💬 AI Chat' },
          { id: 'copy', label: '✏ Copy Generator' },
        ].map(m => (
          <button key={m.id} onClick={() => setActiveMode(m.id)}
            style={{
              padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: activeMode === m.id ? 'var(--accent)' : 'var(--bg-elevated)',
              color: activeMode === m.id ? '#fff' : 'var(--text-secondary)',
              fontSize: 12, fontWeight: 500,
            }}>{m.label}</button>
        ))}
      </div>

      {activeMode === 'chat' && (
        <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>↯</span>
              <span className="panel-title">AI Campaign Assistant</span>
            </div>
            <span style={{ fontSize: 10, color: settings.geminiKey ? 'var(--green)' : 'var(--amber)' }}>
              {settings.geminiKey ? '● Gemini connected' : '● Demo mode'}
            </span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                  {msg.content.split('\n').map((line, j) => (
                    <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div className="chat-bubble-ai" style={{ color: 'var(--text-muted)' }}>
                  <span style={{ animation: 'pulse 1s infinite' }}>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div style={{ padding: '0 14px 8px', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} onClick={() => sendMessage(p)}
                style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 99,
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onMouseOver={e => e.target.style.borderColor = 'var(--accent)'}
                onMouseOut={e => e.target.style.borderColor = 'var(--border)'}
              >{p}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <textarea
              ref={textareaRef}
              rows={2}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your campaign... (Enter to send, Shift+Enter for newline)"
              style={{ flex: 1, resize: 'none', fontSize: 12, fontFamily: 'Inter, sans-serif' }}
            />
            <button className="btn btn-primary" onClick={() => sendMessage()} disabled={loading || !input.trim()}
              style={{ alignSelf: 'flex-end', padding: '8px 14px' }}>
              Send
            </button>
          </div>
        </div>
      )}

      {activeMode === 'copy' && (
        <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="panel-header">
            <span className="panel-title">Ad Copy Generator</span>
          </div>
          <div className="panel-body" style={{ flex: 1, overflow: 'auto' }}>
            <label>Campaign Brief</label>
            <textarea
              rows={4}
              value={copyBrief}
              onChange={e => setCopyBrief(e.target.value)}
              placeholder="Describe your campaign goal, target audience, and key message. E.g. 'Cars24 used cars for young professionals in Mumbai, focus on trust and easy process, budget ₹500/day'"
              style={{ marginBottom: 10 }}
            />
            <button className="btn btn-primary" onClick={handleGenerateCopy} disabled={copyLoading || !copyBrief.trim()}
              style={{ marginBottom: 16 }}>
              {copyLoading ? '◌ Generating...' : '✨ Generate 3 Variants'}
            </button>

            {copyResults && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Generated Variants
                </div>
                {copyResults.map((v, i) => (
                  <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)', padding: 12, marginBottom: 8 }}>
                    <span className="badge badge-indigo" style={{ marginBottom: 6 }}>{v.label}</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{v.headline}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>{v.body}</div>
                    <button className="btn btn-secondary" style={{ fontSize: 10 }}
                      onClick={() => navigator.clipboard.writeText(`${v.headline}\n\n${v.body}`)}>
                      ⎘ Copy
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function getDemoResponse(msg, metrics) {
  const m = msg.toLowerCase()
  if (m.includes('ctr') || m.includes('drop')) {
    return `Based on your metrics, CTR dropped to ${metrics.ctr}% (down from ~2.4% D-7).\n\nPrimary cause: Creative fatigue. Your frequency hit ${metrics.frequency} — anything above 3.5 starts burning audience. Users have seen the same ads too many times.\n\nFix:\n• Refresh creative immediately (3 new variants)\n• Exclude anyone who's seen 5+ impressions\n• Test a new format (video if you're on static, carousel if on single image)`
  }
  if (m.includes('bid')) {
    return `With ROAS at ${metrics.roas}x and CPL at ₹${metrics.cpl}, here's the bid strategy:\n\n• Raise tCPA by 10-15% (target ~₹425) to unlock new inventory\n• Your current bid is likely hitting a floor — you're losing auctions\n• Don't raise more than 15% at once — Meta needs 24-48h to re-learn`
  }
  return `Looking at your campaign data: CTR ${metrics.ctr}%, CPC ₹${metrics.cpc}, ROAS ${metrics.roas}x.\n\nThe biggest risk I see is frequency at ${metrics.frequency} — that's above the 3.5 threshold. Combined with the CPL increase, this points to audience saturation and creative fatigue working together.\n\nWhat specific aspect do you want to dive into?`
}
