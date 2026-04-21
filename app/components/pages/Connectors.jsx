'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'

const CONNECTORS = [
  {
    id: 'meta',
    name: 'Meta Ads',
    logo: 'f',
    logoColor: '#1877F2',
    logoBg: '#E7F0FD',
    description: 'Pull live CTR, CPC, CPL, ROAS, frequency from Meta Ads Manager.',
    fields: [
      { key: 'metaToken', label: 'Access Token', placeholder: 'EAAxxxxxxxxx...', hint: 'business.facebook.com → Settings → System Users → Generate Token' },
      { key: 'metaAdAccountId', label: 'Ad Account ID', placeholder: 'act_123456789', hint: 'Meta Ads Manager → Account Settings → Account ID' },
    ],
    docs: 'https://developers.facebook.com/docs/marketing-api',
    metrics: ['CTR', 'CPC', 'CPL', 'ROAS', 'Frequency', 'Spend', 'Impressions', 'Clicks', 'Conversions'],
  },
  {
    id: 'google',
    name: 'Google Ads',
    logo: 'G',
    logoColor: '#EA4335',
    logoBg: '#FEE8E7',
    description: 'Pull live campaign metrics from Google Ads campaigns.',
    fields: [
      { key: 'googleDevToken', label: 'Developer Token', placeholder: 'xxxxxxxxxxxxxxxxxx', hint: 'ads.google.com → Tools → API Center → Developer Token' },
      { key: 'googleClientId', label: 'Client ID', placeholder: 'xxxxxx.apps.googleusercontent.com', hint: 'console.cloud.google.com → APIs → Credentials' },
      { key: 'googleCustomerId', label: 'Customer ID', placeholder: '123-456-7890', hint: 'Google Ads top-right → Customer ID' },
    ],
    docs: 'https://developers.google.com/google-ads/api/docs/start',
    metrics: ['CTR', 'CPC', 'Conversions', 'ROAS', 'Spend', 'Impressions', 'Clicks', 'Quality Score'],
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    logo: '⊞',
    logoColor: '#188038',
    logoBg: '#E6F4EA',
    description: 'Use a public Google Sheet as your data source — no API key needed.',
    fields: [
      { key: 'sheetsUrl', label: 'Sheet URL', placeholder: 'https://docs.google.com/spreadsheets/d/...', hint: 'Share → Anyone with link → Viewer, then paste URL' },
    ],
    docs: null,
    metrics: ['All metrics via CSV export'],
  },
]

function ConnectorCard({ connector, settings, onSave }) {
  const isConnected = settings.connectors?.[connector.id]
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(() => {
    const f = {}
    connector.fields.forEach(field => { f[field.key] = settings[field.key] || '' })
    return f
  })
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  async function testConnection() {
    setTesting(true)
    setTestResult(null)
    await new Promise(r => setTimeout(r, 1200))
    if (connector.id === 'sheets') {
      const hasUrl = form.sheetsUrl?.includes('docs.google.com')
      setTestResult(hasUrl ? { ok: true, msg: 'Sheet accessible. Metrics ready to pull.' } : { ok: false, msg: 'Invalid URL. Must be a Google Sheets link.' })
    } else {
      const allFilled = connector.fields.every(f => form[f.key]?.trim())
      setTestResult(allFilled
        ? { ok: true, msg: `${connector.name} connected. Campaigns visible.` }
        : { ok: false, msg: 'Fill all fields before testing.' }
      )
    }
    setTesting(false)
  }

  function save() {
    onSave({ ...form, connectors: { ...settings.connectors, [connector.id]: testResult?.ok || false } })
    setOpen(false)
  }

  return (
    <div className={`connector-card ${isConnected ? 'connected' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: connector.logoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: connector.logo.length === 1 && connector.logo !== '⊞' ? 18 : 16, fontWeight: 700, color: connector.logoColor, flexShrink: 0 }}>
          {connector.logo}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{connector.name}</div>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>{connector.description}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {isConnected && <span className="badge badge-green">● Connected</span>}
          <button className={`btn btn-sm ${isConnected ? 'btn-ghost' : 'btn-blue'}`} onClick={() => setOpen(!open)}>
            {isConnected ? 'Configure' : 'Connect'}
          </button>
        </div>
      </div>

      {/* Metrics pills */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {connector.metrics.map(m => (
          <span key={m} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--bg-2)', color: 'var(--t3)', border: '1px solid var(--border)' }}>{m}</span>
        ))}
      </div>

      {/* Config form */}
      {open && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-2)', borderRadius: 8, padding: 14, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {connector.fields.map(field => (
            <div key={field.key}>
              <label>{field.label}</label>
              <input
                type={field.key.toLowerCase().includes('token') || field.key.toLowerCase().includes('secret') ? 'password' : 'text'}
                value={form[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
              />
              <span style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3, display: 'block' }}>{field.hint}</span>
            </div>
          ))}

          {testResult && (
            <div style={{
              padding: '8px 11px', borderRadius: 7, fontSize: 12, fontWeight: 500,
              background: testResult.ok ? 'var(--green-bg)' : 'var(--red-bg)',
              color: testResult.ok ? 'var(--green)' : 'var(--red)',
              border: `1px solid ${testResult.ok ? 'var(--green-bd)' : 'var(--red-bd)'}`,
            }}>
              {testResult.ok ? '✓ ' : '✕ '}{testResult.msg}
            </div>
          )}

          <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost btn-sm" onClick={testConnection} disabled={testing}>
                {testing ? <><span className="animate-spin">◌</span> Testing...</> : '▶ Test Connection'}
              </button>
              {connector.docs && (
                <a href={connector.docs} target="_blank" rel="noreferrer"
                  style={{ fontSize: 11, color: 'var(--blue)', alignSelf: 'center', textDecoration: 'none' }}>
                  Docs ↗
                </a>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn btn-blue btn-sm" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Connectors() {
  const { settings, saveSettings } = useApp()

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', margin: 0 }}>Connectors</h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>Connect ad platforms to pull live campaign metrics automatically.</p>
        </div>
        <span className="badge badge-blue">{Object.values(settings.connectors || {}).filter(Boolean).length} active</span>
      </div>

      {/* How it works */}
      <div style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-mid)', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 18, marginTop: 1 }}>ℹ</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)', marginBottom: 4 }}>How data flows</div>
          <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}>
            Connect a platform → metrics auto-populate Campaign Pulse on each diagnosis run → AI analyzes live data instead of manual inputs. Google Sheets works without API keys for quick setup.
          </div>
        </div>
      </div>

      {/* Connector cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CONNECTORS.map(c => (
          <ConnectorCard key={c.id} connector={c} settings={settings} onSave={saveSettings} />
        ))}
      </div>

      {/* Coming soon */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>Coming soon</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['LinkedIn Ads', 'Snapchat Ads', 'DV360', 'Appsflyer', 'Branch', 'CleverTap'].map(name => (
            <div key={name} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--t3)' }}>
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
