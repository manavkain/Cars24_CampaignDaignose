'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'

const METRICS = [
  { key: 'ctr', label: 'CTR', fmt: v => `${v.toFixed(1)}%` },
  { key: 'cpc', label: 'CPC', fmt: v => `₹${v}` },
  { key: 'cpl', label: 'CPL', fmt: v => `₹${v}` },
  { key: 'roas', label: 'ROAS', fmt: v => `${v.toFixed(1)}x` },
  { key: 'frequency', label: 'Freq', fmt: v => v.toFixed(1) },
  { key: 'conversions', label: 'Conv', fmt: v => v },
]

export default function CampaignPulse() {
  const { metrics, setMetrics, deltas, settings, getHealth, runDiagnosis, pipelineStep } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [sheetsUrl, setSheetsUrl] = useState(settings.sheetsUrl || '')
  const [form, setForm] = useState(metrics)
  const [sheetsLoading, setSheetsLoading] = useState(false)

  async function loadSheets() {
    const m = sheetsUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    if (!m) { alert('Invalid Google Sheets URL'); return }
    setSheetsLoading(true)
    try {
      const res = await fetch(`/api/sheets?id=${m[1]}`)
      const d = await res.json()
      if (d.error) throw new Error(d.error)
      setMetrics(d); setForm(d)
    } catch (e) { alert(e.message) }
    finally { setSheetsLoading(false) }
  }

  function applyForm(e) {
    e.preventDefault()
    setMetrics({ ...metrics, ...form })
    setShowForm(false)
  }

  const healthColor = { green: 'var(--green)', amber: 'var(--amber)', red: 'var(--red)', neutral: 'var(--t4)' }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="dot dot-green" />
          <span className="card-title">Campaign Pulse</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--t3)' }}>Live monitoring</span>
      </div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Metric grid */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {METRICS.map(m => {
            const health = getHealth(m.key, metrics[m.key])
            const delta = deltas[m.key]
            const hc = healthColor[health]
            return (
              <div key={m.key} className="metric-card" style={{ minWidth: 72 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{m.label}</span>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: hc, display: 'inline-block', marginTop: 2 }} />
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)', lineHeight: 1 }}>{m.fmt(metrics[m.key])}</div>
                {delta !== undefined && (
                  <div style={{ fontSize: 10, color: hc, marginTop: 3, fontWeight: 500 }}>
                    {delta > 0 ? '↑' : '↓'} {Math.abs(delta)} D-7
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Sheets input */}
        <div style={{ display: 'flex', gap: 6 }}>
          <input style={{ fontSize: 12 }} placeholder="Google Sheets URL (public)..." value={sheetsUrl} onChange={e => setSheetsUrl(e.target.value)} />
          <button className="btn btn-ghost btn-sm" onClick={loadSheets} disabled={sheetsLoading}>
            {sheetsLoading ? <span className="animate-spin">◌</span> : 'Load'}
          </button>
        </div>

        {/* Manual form toggle */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(!showForm)}>
            ✏ Manual Input
          </button>
          <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}
            onClick={runDiagnosis} disabled={pipelineStep === 'diagnose'}>
            {pipelineStep === 'diagnose'
              ? <><span className="animate-spin">◌</span> Diagnosing...</>
              : '↯ Run Diagnosis'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={applyForm} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
            background: 'var(--bg-2)', borderRadius: 8, padding: 12,
            border: '1px solid var(--border)',
          }}>
            {METRICS.map(m => (
              <div key={m.key}>
                <label>{m.label}</label>
                <input type="number" step="any" value={form[m.key] ?? ''} onChange={e => setForm(f => ({ ...f, [m.key]: parseFloat(e.target.value) || 0 }))} />
              </div>
            ))}
            <div style={{ gridColumn: 'span 3', display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-blue btn-sm">Apply</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
