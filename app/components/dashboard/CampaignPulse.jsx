'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'
import { fetchFromSheets } from '../../lib/sheets'
import { diagnoseCampaign } from '../../lib/gemini'
import { mockDiagnosis } from '../../lib/mockData'

const METRICS = [
  { key: 'ctr', label: 'CTR', unit: '%', format: v => v.toFixed(1) },
  { key: 'cpc', label: 'CPC', unit: '₹', format: v => `₹${v}` },
  { key: 'cpl', label: 'CPL', unit: '₹', format: v => `₹${v}` },
  { key: 'roas', label: 'ROAS', unit: 'x', format: v => `${v.toFixed(1)}x` },
  { key: 'frequency', label: 'Freq', unit: '', format: v => v.toFixed(1) },
  { key: 'conversions', label: 'Conv', unit: '', format: v => v },
]

function MetricCard({ metricKey, value, delta, health }) {
  const m = METRICS.find(x => x.key === metricKey)
  const deltaPositive = delta > 0
  const healthColor = health === 'green' ? 'var(--green)' : health === 'amber' ? 'var(--amber)' : health === 'red' ? 'var(--red)' : 'var(--text-muted)'
  const healthBg = health === 'green' ? 'var(--green-bg)' : health === 'amber' ? 'var(--amber-bg)' : health === 'red' ? 'var(--red-bg)' : 'var(--bg-elevated)'

  return (
    <div className="metric-card" style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m?.label}</span>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: healthColor, display: 'inline-block', marginTop: 2 }} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 3px' }}>
        {m ? m.format(value) : value}
      </div>
      {delta !== undefined && (
        <div style={{ fontSize: 10, color: healthColor, fontWeight: 500 }}>
          {deltaPositive ? '↑' : '↓'} {Math.abs(delta)}{m?.unit || ''} vs D-7
        </div>
      )}
    </div>
  )
}

export default function CampaignPulse({ onDiagnosisComplete }) {
  const { metrics, setMetrics, deltas, setDeltas, settings, setDiagnosis, getHealth, log } = useApp()
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [sheetsUrl, setSheetsUrl] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(metrics)

  async function handleDiagnose() {
    setLoading(true)
    setLoadingMsg('Analyzing campaign metrics...')
    try {
      if (settings.geminiKey) {
        setLoadingMsg('Calling Gemini AI...')
        const result = await diagnoseCampaign(metrics, deltas, log, settings.geminiKey)
        setDiagnosis(result)
      } else {
        await new Promise(r => setTimeout(r, 1200))
        setDiagnosis(mockDiagnosis)
      }
      if (onDiagnosisComplete) onDiagnosisComplete()
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLoadSheets() {
    if (!sheetsUrl) return
    setLoading(true)
    setLoadingMsg('Fetching from Google Sheets...')
    try {
      const data = await fetchFromSheets(sheetsUrl)
      setMetrics(data)
      setForm(data)
      alert('Metrics loaded from Google Sheets!')
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    setMetrics({ ...metrics, ...form })
    setShowForm(false)
  }

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="dot-green" />
          <span className="panel-title">Campaign Pulse</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{metrics.campaign}</span>
          <span className="badge badge-indigo">{metrics.platform}</span>
        </div>
      </div>

      <div className="panel-body" style={{ flex: 1 }}>
        {/* Metric grid */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {METRICS.map(m => (
            <MetricCard
              key={m.key}
              metricKey={m.key}
              value={metrics[m.key]}
              delta={deltas[m.key]}
              health={getHealth(m.key, metrics[m.key])}
            />
          ))}
        </div>

        {/* Input row */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
          <button className="btn btn-secondary" style={{ fontSize: 11 }} onClick={() => setShowForm(!showForm)}>
            ✏ Manual Input
          </button>
          <div style={{ flex: 1, display: 'flex', gap: 5 }}>
            <input
              style={{ fontSize: 11, padding: '5px 8px' }}
              placeholder="Paste Google Sheets URL..."
              value={sheetsUrl}
              onChange={e => setSheetsUrl(e.target.value)}
            />
            <button className="btn btn-secondary" style={{ fontSize: 11, whiteSpace: 'nowrap' }} onClick={handleLoadSheets}>
              Load
            </button>
          </div>
        </div>

        {/* Manual form */}
        {showForm && (
          <form onSubmit={handleFormSubmit} style={{
            background: 'var(--bg-elevated)', borderRadius: 8,
            border: '1px solid var(--border)', padding: 12, marginBottom: 8,
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
          }}>
            {METRICS.map(m => (
              <div key={m.key}>
                <label>{m.label}</label>
                <input
                  type="number"
                  step="any"
                  value={form[m.key] ?? ''}
                  onChange={e => setForm(f => ({ ...f, [m.key]: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            ))}
            <div style={{ gridColumn: 'span 3', display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Apply</button>
            </div>
          </form>
        )}

        {/* Diagnose button */}
        <button
          className="btn btn-primary"
          onClick={handleDiagnose}
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}
        >
          {loading ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: 12 }}>◌</span>
              {loadingMsg}
            </>
          ) : '↯ Run Diagnosis'}
        </button>
      </div>
    </div>
  )
}
