'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'

const METRICS = [
  { key:'ctr',         label:'CTR',  fmt:v=>`${v.toFixed(1)}%`, icon:'touch_app',  span:2 },
  { key:'cpc',         label:'CPC',  fmt:v=>`₹${v}`,            icon:'payments',   span:2 },
  { key:'cpl',         label:'CPL',  fmt:v=>`₹${v}`,            icon:'group_add',  span:2 },
  { key:'roas',        label:'ROAS', fmt:v=>`${v.toFixed(1)}x`,  icon:'monitoring', span:2 },
  { key:'frequency',   label:'Freq', fmt:v=>v.toFixed(1),        icon:'repeat',     span:2 },
  { key:'conversions', label:'Conv', fmt:v=>v,                   icon:'how_to_reg', span:2 },
]

const STATUS_COLOR = { healthy: '#22c55e', underperforming: '#f59e0b', critical: '#ef4444', unknown: '#94a3b8' }

export default function CampaignPulse({ compact = false }) {
  const { metrics, setMetrics, deltas, settings, getHealth, runDiagnosis, pipelineStep } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [sheetsUrl, setSheetsUrl] = useState(settings.sheetsUrl || '')
  const [form, setForm] = useState(metrics)
  const [sheetsLoading, setSheetsLoading] = useState(false)
  const [campaigns, setCampaigns] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(0)

  async function loadSheets() {
    const m = sheetsUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    if (!m) { alert('Invalid Sheets URL'); return }
    setSheetsLoading(true)
    try {
      const res = await fetch(`/api/sheets?id=${m[1]}`)
      const d = await res.json()
      if (d.error) throw new Error(d.error)
      const list = d.campaigns || []
      if (!list.length) throw new Error('No campaigns found in sheet')
      setCampaigns(list)
      setSelectedIdx(0)
      setMetrics(list[0])
      setForm(list[0])
    } catch (e) { alert(e.message) }
    finally { setSheetsLoading(false) }
  }

  function selectCampaign(idx) {
    setSelectedIdx(idx)
    setMetrics(campaigns[idx])
    setForm(campaigns[idx])
  }

  function applyForm(e) {
    e.preventDefault()
    setMetrics({ ...metrics, ...form })
    setShowForm(false)
  }

  const hBadge = { green: 'badge-green', amber: 'badge-amber', red: 'badge-red', neutral: 'badge-blue' }

  return (
    <div className="card" style={{ flexShrink: 0 }}>
      <div className="card-header" style={{ padding: compact ? '8px 16px' : '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="dot dot-green" />
          <span className="card-title" style={{ fontSize: compact ? 10 : 11 }}>Campaign Pulse</span>
        </div>
        {!compact && <span style={{ fontSize: 11, color: 'var(--outline)', fontWeight: 500 }}>Real-time health check</span>}
      </div>

      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: compact ? 10 : 14, padding: compact ? '12px 16px' : '16px 20px' }}>

        {/* Sheets loader */}
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            placeholder="Google Sheets URL..."
            value={sheetsUrl}
            onChange={e => setSheetsUrl(e.target.value)}
            style={{ fontSize: 11, padding: '7px 10px' }}
          />
          <button className="btn btn-ghost btn-xs" onClick={loadSheets} disabled={sheetsLoading} style={{ flexShrink: 0 }}>
            {sheetsLoading ? <span className="animate-spin">◌</span> : 'Load'}
          </button>
        </div>

        {/* Campaign selector — only shows after sheet loads */}
        {campaigns.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {campaigns.map((c, i) => (
              <button
                key={i}
                onClick={() => selectCampaign(i)}
                style={{
                  fontSize: 10,
                  padding: '4px 10px',
                  borderRadius: 20,
                  border: `1.5px solid ${i === selectedIdx ? STATUS_COLOR[c.status] : 'rgba(192,199,211,0.2)'}`,
                  background: i === selectedIdx ? `${STATUS_COLOR[c.status]}18` : 'transparent',
                  color: i === selectedIdx ? STATUS_COLOR[c.status] : 'var(--on-surface-v)',
                  cursor: 'pointer',
                  fontWeight: i === selectedIdx ? 700 : 400,
                  transition: 'all .15s',
                }}
              >
                <span style={{
                  display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                  background: STATUS_COLOR[c.status], marginRight: 5, verticalAlign: 'middle'
                }} />
                {c.campaign}
              </button>
            ))}
          </div>
        )}

        {/* Metrics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: compact ? 8 : 10 }}>
          {METRICS.map(m => {
            const h = getHealth(m.key, metrics[m.key]); const d = deltas[m.key]
            return (
              <div key={m.key} className="metric-card" style={{
                gridColumn: `span ${m.span}`,
                padding: compact ? '12px 14px' : '20px',
                minHeight: compact ? 80 : 'auto'
              }}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: compact ? 8 : 14, opacity: .04, pointerEvents: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: compact ? 32 : 52, color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: compact ? 8 : 16 }}>
                  <span style={{ fontSize: compact ? 9 : 11, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: 'Inter,sans-serif' }}>{m.label}</span>
                  {d !== undefined && (
                    <span className={`badge ${hBadge[h]}`} style={{ fontSize: 9, padding: '1px 5px' }}>{Math.abs(d)}</span>
                  )}
                </div>
                <div style={{ fontFamily: 'Manrope,sans-serif', fontSize: compact ? 20 : 28, fontWeight: 900, color: 'var(--on-surface)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {m.fmt(metrics[m.key])}
                </div>
                {!compact && (
                  <div style={{ fontSize: 11, color: 'var(--outline)', marginTop: 6, fontWeight: 500 }}>
                    {h === 'green' ? 'On target' : h === 'red' ? 'Needs attention' : 'Watching'}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-xs" onClick={() => setShowForm(!showForm)} style={{ flex: 1, justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span> Manual
          </button>
          <button className="btn btn-orange btn-xs" style={{ flex: 1.5, justifyContent: 'center' }} onClick={runDiagnosis} disabled={pipelineStep === 'diagnose'}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            {pipelineStep === 'diagnose' ? 'Diagnosing...' : 'Run'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={applyForm} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, background: 'var(--surface-low)', borderRadius: 10, padding: 12, border: '1px solid rgba(192,199,211,0.15)' }}>
            {METRICS.map(m => (
              <div key={m.key}>
                <label style={{ fontSize: 9 }}>{m.label}</label>
                <input type="number" step="any" value={form[m.key] ?? ''} onChange={e => setForm(f => ({ ...f, [m.key]: parseFloat(e.target.value) || 0 }))} style={{ fontSize: 11, padding: '4px 6px' }} />
              </div>
            ))}
            <div style={{ gridColumn: 'span 3', display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" className="btn btn-ghost btn-xs" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-xs">Apply</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
