'use client'
import { useState, useRef, useEffect } from 'react'
import { useApp } from '../AppContext'
import { chatWithAI, generateCopy } from '../../lib/gemini'

const QUICK = [
  'Why did my CTR drop this week?',
  'Write 3 ad variants for creative refresh',
  'Analyze my audience saturation risk',
  'What bid strategy should I use?',
  'Best budget pacing for end of month?',
  'Explain my ROAS decline',
]

function DemoReply(msg, m) {
  const l = msg.toLowerCase()
  if (l.includes('ctr') || l.includes('drop')) return `Your CTR dropped to ${m.ctr}% — down ~25% from last week.\n\n**Root cause:** Frequency at ${m.frequency} is the problem. Above 3.5, audiences start ignoring the ad. You're at 4.7.\n\n**Fix:**\n• Refresh creative immediately — 3 new variants\n• Exclude anyone who saw 5+ impressions\n• Test video if on static, carousel if on single image\n\nExpect CTR recovery in 48-72h after new creative goes live.`
  if (l.includes('bid')) return `With ROAS ${m.roas}x and CPL ₹${m.cpl}, bid strategy:\n\n• **Raise tCPA 10-15%** → target ~₹425 to unlock new inventory\n• Current bid hitting a floor — losing auctions\n• Don't raise >15% at once — Meta needs 24-48h to relearn\n\nAlso worth testing: switch from tCPA to Advantage+ budget for 3 days and compare CPL.`
  if (l.includes('audience') || l.includes('saturation')) return `Audience saturation signs in your data:\n\n• CPL up ₹45 (+13%) with no bid changes\n• Reach flattening across primary segments\n\n**Fix:**\n• Create 2% LAL of last 90-day converters\n• Exclude converted users + freq >5\n• Test new geo: if running Delhi/Mumbai, add Pune/Hyderabad\n\nExpected CPL improvement: ₹40-60 within 5 days.`
  return `Looking at your metrics: CTR ${m.ctr}%, CPC ₹${m.cpc}, ROAS ${m.roas}x, Frequency ${m.frequency}.\n\nBiggest risk: frequency at ${m.frequency} is above 3.5 threshold. This + rising CPL = creative fatigue + audience saturation working together.\n\nWhat specific area do you want to dig into?`
}

export default function AIChat() {
  const { settings, metrics, diagnosis } = useApp()
  const [msgs, setMsgs] = useState([
    { role: 'ai', content: `Campaign loaded: **${metrics.campaign}**\n\nCTR ${metrics.ctr}% · CPC ₹${metrics.cpc} · ROAS ${metrics.roas}x · Freq ${metrics.frequency}\n\nI've analyzed your metrics. Ask me anything — diagnose issues, write copy, optimize bids, or explain what's happening.` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('chat')
  const [copyBrief, setCopyBrief] = useState('')
  const [copyResults, setCopyResults] = useState(null)
  const [copyLoading, setCopyLoading] = useState(false)
  const bottomRef = useRef(null)
  const taRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  function autoResize() {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'
  }

  async function send(text) {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    if (taRef.current) taRef.current.style.height = '38px'
    const newMsgs = [...msgs, { role: 'user', content: msg }]
    setMsgs(newMsgs)
    setLoading(true)
    try {
      let reply
      if (settings.geminiKey) {
        reply = await chatWithAI(newMsgs, { metrics, summary: diagnosis?.summary }, settings.geminiKey)
      } else {
        await new Promise(r => setTimeout(r, 700 + Math.random() * 400))
        reply = DemoReply(msg, metrics)
      }
      setMsgs(p => [...p, { role: 'ai', content: reply }])
    } catch (e) {
      setMsgs(p => [...p, { role: 'ai', content: `Error: ${e.message}` }])
    } finally { setLoading(false) }
  }

  async function genCopy() {
    if (!copyBrief.trim()) return
    setCopyLoading(true)
    try {
      let r
      if (settings.geminiKey) { r = await generateCopy(copyBrief, settings.geminiKey) }
      else {
        await new Promise(res => setTimeout(res, 900))
        r = { variants: [
          { label: 'Urgency', headline: 'Book your dream car today', body: "India's most trusted marketplace. Certified cars, instant delivery. Limited stock." },
          { label: 'Social Proof', headline: "50,000+ happy buyers can't be wrong", body: "Join India's largest car community. Test drive today, drive home tomorrow." },
          { label: 'Value', headline: 'Get ₹25,000 more for your old car', body: 'Best-in-class exchange value guaranteed. Switch to your dream car this week.' },
        ]}
      }
      setCopyResults(r.variants)
    } catch (e) { alert(e.message) }
    finally { setCopyLoading(false) }
  }

  function renderContent(text) {
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return <span key={i} dangerouslySetInnerHTML={{ __html: bold }} style={{ display: 'block', lineHeight: line.startsWith('•') ? 1.7 : 1.65, paddingLeft: line.startsWith('•') ? 0 : 0 }} />
    })
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 6, padding: '0 0 12px' }}>
        {[{ id: 'chat', label: '◎ AI Chat' }, { id: 'copy', label: '✏ Copy Generator' }].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} className={`btn ${mode === m.id ? 'btn-blue' : 'btn-ghost'} btn-sm`}>{m.label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: settings.geminiKey ? 'var(--green)' : 'var(--amber)', alignSelf: 'center', padding: '4px 10px', background: settings.geminiKey ? 'var(--green-bg)' : 'var(--amber-bg)', borderRadius: 99, border: `1px solid ${settings.geminiKey ? 'var(--green-bd)' : 'var(--amber-bd)'}` }}>
          {settings.geminiKey ? '● Gemini live' : '● Demo mode'}
        </span>
      </div>

      {mode === 'chat' && (
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {msgs.map((msg, i) => (
              <div key={i} className="animate-fade-in" style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'ai' && (
                  <div style={{ width: 28, height: 28, background: 'var(--blue)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, marginRight: 8, flexShrink: 0, alignSelf: 'flex-end' }}>↯</div>
                )}
                <div className={msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}>
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <div style={{ width: 28, height: 28, background: 'var(--blue)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13 }}>↯</div>
                <div className="bubble-ai" style={{ color: 'var(--t4)' }}>
                  <span className="animate-spin" style={{ display: 'inline-block', marginRight: 6 }}>◌</span>Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div style={{ padding: '8px 14px 4px', display: 'flex', gap: 5, flexWrap: 'wrap', borderTop: '1px solid var(--border)', background: 'var(--bg-2)' }}>
            {QUICK.map((p, i) => (
              <button key={i} onClick={() => send(p)}
                style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--t2)', cursor: 'pointer', transition: 'border-color .15s', fontFamily: 'inherit' }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--blue)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >{p}</button>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input-wrap">
            <textarea
              ref={taRef}
              className="chat-textarea"
              rows={1}
              value={input}
              onChange={e => { setInput(e.target.value); autoResize() }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask about your campaign... (Enter to send)"
            />
            <button className="chat-send-btn" onClick={() => send()} disabled={loading || !input.trim()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}

      {mode === 'copy' && (
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="card-header"><span className="card-title">Ad Copy Generator</span></div>
          <div className="card-body" style={{ flex: 1, overflow: 'auto' }}>
            <label>Campaign Brief</label>
            <textarea rows={4} value={copyBrief} onChange={e => setCopyBrief(e.target.value)}
              placeholder="E.g. 'Cars24 used cars for young professionals in Mumbai, focus on trust and easy process, budget ₹500/day Meta'"
              style={{ marginBottom: 10 }} />
            <button className="btn btn-primary" onClick={genCopy} disabled={copyLoading || !copyBrief.trim()} style={{ marginBottom: 16 }}>
              {copyLoading ? <><span className="animate-spin">◌</span> Generating...</> : '✨ Generate 3 Variants'}
            </button>
            {copyResults && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Generated Variants</div>
                {copyResults.map((v, i) => (
                  <div key={i} style={{ background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--border)', padding: 12, marginBottom: 8 }}>
                    <span className="badge badge-blue" style={{ marginBottom: 7 }}>{v.label}</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 4 }}>{v.headline}</div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.55, marginBottom: 8 }}>{v.body}</div>
                    <button className="btn btn-ghost btn-xs" onClick={() => navigator.clipboard.writeText(`${v.headline}\n\n${v.body}`)}>⎘ Copy</button>
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
