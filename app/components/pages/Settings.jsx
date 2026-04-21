'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'

export default function Settings() {
  const { settings, saveSettings, log } = useApp()
  const [form, setForm] = useState({ ...settings })
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  function save() { saveSettings(form); setSaved(true); setTimeout(() => setSaved(false), 2000) }
  function setT(metric, bound, v) {
    setForm(f => ({ ...f, thresholds: { ...f.thresholds, [metric]: { ...f.thresholds[metric], [bound]: parseFloat(v) || 0 } } }))
  }

  const tRows = [
    { k:'ctr',       l:'CTR',       u:'%', note:'Higher = better' },
    { k:'cpc',       l:'CPC',       u:'₹', note:'Lower = better' },
    { k:'cpl',       l:'CPL',       u:'₹', note:'Lower = better' },
    { k:'roas',      l:'ROAS',      u:'x', note:'Higher = better' },
    { k:'frequency', l:'Frequency', u:'',  note:'Lower = better' },
  ]

  return (
    <div style={{ maxWidth: 660, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', margin: 0 }}>Settings</h2>
        <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>API keys, thresholds, and app configuration.</p>
      </div>

      {/* API */}
      <div className="card">
        <div className="card-header"><span className="card-title">API Configuration</span></div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label>Gemini API Key</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type={showKey ? 'text' : 'password'} value={form.geminiKey} onChange={e => setForm(f => ({ ...f, geminiKey: e.target.value }))} placeholder="AIza..." />
              <button className="btn btn-ghost btn-sm" onClick={() => setShowKey(!showKey)} style={{ flexShrink: 0 }}>{showKey ? 'Hide' : 'Show'}</button>
            </div>
            <span style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3, display: 'block' }}>Free key at aistudio.google.com · Stored locally only</span>
          </div>
          <div>
            <label>Make.com Webhook URL</label>
            <input value={form.webhookUrl} onChange={e => setForm(f => ({ ...f, webhookUrl: e.target.value }))} placeholder="https://hook.make.com/..." />
            <span style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3, display: 'block' }}>Used to export Improvement Log → Airtable</span>
          </div>
        </div>
      </div>

      {/* Sheets template */}
      <div className="card">
        <div className="card-header"><span className="card-title">Google Sheets Format</span></div>
        <div className="card-body">
          <p style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 10 }}>Row 1 = headers (exact), Row 2 = your data. Sheet must be public.</p>
          <div style={{ background: 'var(--bg-2)', borderRadius: 7, padding: 10, fontFamily: 'monospace', fontSize: 10, color: 'var(--t2)', lineHeight: 1.7, overflowX: 'auto', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--t4)' }}># Row 1 — Headers</div>
            <div>CTR,CPC,CPL,ROAS,Frequency,Spend,Conversions,Impressions,Clicks,Campaign,Platform</div>
            <div style={{ color: 'var(--t4)', marginTop: 6 }}># Row 2 — Values</div>
            <div>1.8,42,380,2.4,4.7,45000,118,512000,9216,Cars24 Q2,Meta</div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}
            onClick={() => navigator.clipboard.writeText('CTR,CPC,CPL,ROAS,Frequency,Spend,Conversions,Impressions,Clicks,Campaign,Platform\n1.8,42,380,2.4,4.7,45000,118,512000,9216,Cars24 Q2,Meta')}>
            ⎘ Copy Template
          </button>
        </div>
      </div>

      {/* Thresholds */}
      <div className="card">
        <div className="card-header"><span className="card-title">Health Thresholds</span><span style={{ fontSize: 11, color: 'var(--t3)' }}>Controls metric card colors</span></div>
        <div className="card-body">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>{['Metric','Green (good)','Amber (watch)','Note'].map(h => (
                <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {tRows.map(row => (
                <tr key={row.k} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px', fontWeight: 500 }}>{row.l} {row.u}</td>
                  <td style={{ padding: '8px' }}><input type="number" step="any" value={form.thresholds[row.k]?.green ?? ''} onChange={e => setT(row.k,'green',e.target.value)} style={{ width: 72, fontSize: 12 }} /></td>
                  <td style={{ padding: '8px' }}><input type="number" step="any" value={form.thresholds[row.k]?.amber ?? ''} onChange={e => setT(row.k,'amber',e.target.value)} style={{ width: 72, fontSize: 12 }} /></td>
                  <td style={{ padding: '8px', fontSize: 11, color: 'var(--t3)' }}>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Continuous */}
      <div className="card">
        <div className="card-header"><span className="card-title">Continuous Mode</span></div>
        <div className="card-body">
          <label>Re-diagnose interval</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[5,15,30,60].map(m => (
              <button key={m} onClick={() => setForm(f => ({ ...f, refreshInterval: m }))}
                className={`btn btn-sm ${form.refreshInterval === m ? 'btn-blue' : 'btn-ghost'}`}>
                {m < 60 ? `${m}m` : '1h'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danger */}
      <div className="card" style={{ borderColor: 'var(--red-bd)' }}>
        <div className="card-header" style={{ background: 'var(--red-bg)' }}><span className="card-title" style={{ color: 'var(--red)' }}>Danger Zone</span></div>
        <div className="card-body" style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', borderColor: 'var(--red-bd)' }}
            onClick={() => { if (confirm(`Clear all ${log.length} log entries?`)) { localStorage.removeItem('ago_log'); location.reload() } }}>
            Clear Log ({log.length} entries)
          </button>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', borderColor: 'var(--red-bd)' }}
            onClick={() => { if (confirm('Reset all settings?')) { localStorage.clear(); location.reload() } }}>
            Reset All
          </button>
        </div>
      </div>

      <button className="btn btn-primary" onClick={save} style={{ alignSelf: 'flex-start' }}>
        {saved ? '✓ Saved' : 'Save Settings'}
      </button>
    </div>
  )
}
