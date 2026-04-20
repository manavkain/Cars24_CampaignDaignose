'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'
import { SHEETS_TEMPLATE_HEADERS, SHEETS_TEMPLATE_EXAMPLE } from '../../lib/sheets'

export default function Settings() {
  const { settings, saveSettings, saveLogicRules, log } = useApp()
  const [form, setForm] = useState({ ...settings })
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    saveSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function updateThreshold(metric, bound, value) {
    setForm(f => ({
      ...f,
      thresholds: {
        ...f.thresholds,
        [metric]: { ...f.thresholds[metric], [bound]: parseFloat(value) || 0 }
      }
    }))
  }

  const thresholdRows = [
    { key: 'ctr',       label: 'CTR',       unit: '%',  hint: 'Higher is better' },
    { key: 'cpc',       label: 'CPC',       unit: '₹',  hint: 'Lower is better' },
    { key: 'cpl',       label: 'CPL',       unit: '₹',  hint: 'Lower is better' },
    { key: 'roas',      label: 'ROAS',      unit: 'x',  hint: 'Higher is better' },
    { key: 'frequency', label: 'Frequency', unit: '',   hint: 'Lower is better' },
  ]

  return (
    <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* API Config */}
      <div className="panel">
        <div className="panel-header"><span className="panel-title">API Configuration</span></div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label>Gemini API Key</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={form.geminiKey}
                onChange={e => setForm(f => ({ ...f, geminiKey: e.target.value }))}
                placeholder="AIza..."
              />
              <button className="btn btn-secondary" style={{ fontSize: 11, whiteSpace: 'nowrap' }} onClick={() => setShowKey(!showKey)}>
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
              Get free key at → aistudio.google.com · Stored locally, never sent to our servers
            </span>
          </div>
          <div>
            <label>Make.com Webhook URL</label>
            <input
              value={form.webhookUrl}
              onChange={e => setForm(f => ({ ...f, webhookUrl: e.target.value }))}
              placeholder="https://hook.make.com/..."
            />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
              Used to export Improvement Log → Airtable
            </span>
          </div>
          <div>
            <label>Google Sheets URL</label>
            <input
              value={form.sheetsUrl}
              onChange={e => setForm(f => ({ ...f, sheetsUrl: e.target.value }))}
              placeholder="https://docs.google.com/spreadsheets/d/..."
            />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
              Sheet must be public (Anyone with link → Viewer)
            </span>
          </div>
        </div>
      </div>

      {/* Sheets template */}
      <div className="panel">
        <div className="panel-header"><span className="panel-title">Google Sheets Format</span></div>
        <div className="panel-body">
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
            Row 1 = headers (copy exactly), Row 2+ = your data.
          </p>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 6, padding: 10, fontFamily: 'monospace', fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.6, overflowX: 'auto' }}>
            <div style={{ color: 'var(--text-muted)' }}># Row 1 — Headers</div>
            <div>{SHEETS_TEMPLATE_HEADERS}</div>
            <div style={{ color: 'var(--text-muted)', marginTop: 6 }}># Row 2 — Your values</div>
            <div>{SHEETS_TEMPLATE_EXAMPLE}</div>
          </div>
          <button className="btn btn-secondary" style={{ fontSize: 10 }}
            onClick={() => navigator.clipboard.writeText(`${SHEETS_TEMPLATE_HEADERS}\n${SHEETS_TEMPLATE_EXAMPLE}`)}>
            ⎘ Copy Template
          </button>
        </div>
      </div>

      {/* Metric thresholds */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Health Thresholds</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Controls red/amber/green on Campaign Pulse</span>
        </div>
        <div className="panel-body">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr>
                {['Metric', 'Green threshold', 'Amber threshold', 'Note'].map(h => (
                  <th key={h} style={{ padding: '5px 8px', textAlign: 'left', color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {thresholdRows.map(row => (
                <tr key={row.key} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px', fontWeight: 500, color: 'var(--text-primary)' }}>{row.label} {row.unit}</td>
                  <td style={{ padding: '8px' }}>
                    <input type="number" step="any" value={form.thresholds[row.key]?.green ?? ''}
                      onChange={e => updateThreshold(row.key, 'green', e.target.value)}
                      style={{ width: 80, fontSize: 12 }} />
                  </td>
                  <td style={{ padding: '8px' }}>
                    <input type="number" step="any" value={form.thresholds[row.key]?.amber ?? ''}
                      onChange={e => updateThreshold(row.key, 'amber', e.target.value)}
                      style={{ width: 80, fontSize: 12 }} />
                  </td>
                  <td style={{ padding: '8px', fontSize: 10, color: 'var(--text-muted)' }}>{row.hint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Continuous mode */}
      <div className="panel">
        <div className="panel-header"><span className="panel-title">Continuous Mode</span></div>
        <div className="panel-body">
          <label>Re-diagnose interval</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[5, 15, 30, 60].map(min => (
              <button key={min}
                onClick={() => setForm(f => ({ ...f, refreshInterval: min }))}
                style={{
                  padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11,
                  background: form.refreshInterval === min ? 'var(--accent)' : 'var(--bg-elevated)',
                  color: form.refreshInterval === min ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${form.refreshInterval === min ? 'var(--accent)' : 'var(--border)'}`,
                }}>
                {min < 60 ? `${min}m` : '1h'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="panel" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
        <div className="panel-header" style={{ background: 'rgba(239,68,68,0.05)' }}>
          <span className="panel-title" style={{ color: 'var(--red)' }}>Danger Zone</span>
        </div>
        <div className="panel-body" style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary"
            onClick={() => { if (confirm('Clear all improvement log entries?')) { localStorage.removeItem('ago_log'); location.reload() } }}
            style={{ fontSize: 11, color: 'var(--red)', borderColor: 'rgba(239,68,68,0.3)' }}>
            Clear Log ({log.length} entries)
          </button>
          <button className="btn btn-secondary"
            onClick={() => { if (confirm('Reset all settings to defaults?')) { localStorage.clear(); location.reload() } }}
            style={{ fontSize: 11, color: 'var(--red)', borderColor: 'rgba(239,68,68,0.3)' }}>
            Reset All Settings
          </button>
        </div>
      </div>

      {/* Save */}
      <button className="btn btn-primary" onClick={handleSave} style={{ alignSelf: 'flex-start', fontSize: 12 }}>
        {saved ? '✓ Settings Saved' : 'Save Settings'}
      </button>
    </div>
  )
}
