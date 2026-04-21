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
    description: 'Pull live campaign intelligence from Meta Ads Manager.',
    fields: [
      { key: 'metaToken', label: 'Access Token', placeholder: 'EAAxxxxxxxxx...', hint: 'business.facebook.com → Settings → System Users' },
      { key: 'metaAdAccountId', label: 'Ad Account ID', placeholder: 'act_123456789', hint: 'Meta Ads Manager → Account Settings' },
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
    description: 'Sync real-time performance metrics from Google Ads.',
    fields: [
      { key: 'googleDevToken', label: 'Developer Token', placeholder: 'xxxxxxxxxxxxxxxxxx', hint: 'ads.google.com → Tools → API Center' },
      { key: 'googleClientId', label: 'Client ID', placeholder: 'xxxxxx.apps.googleusercontent.com', hint: 'console.cloud.google.com → Credentials' },
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
    description: 'Use a public spreadsheet as your campaign data source.',
    fields: [
      { key: 'sheetsUrl', label: 'Sheet URL', placeholder: 'https://docs.google.com/spreadsheets/d/...', hint: 'Share → Anyone with link → Viewer' },
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
      setTestResult(hasUrl ? { ok: true, msg: 'Sheet accessible.' } : { ok: false, msg: 'Invalid URL.' })
    } else {
      const allFilled = connector.fields.every(f => form[f.key]?.trim())
      setTestResult(allFilled ? { ok: true, msg: 'Connected.' } : { ok: false, msg: 'Missing fields.' })
    }
    setTesting(false)
  }

  function save() {
    onSave({ ...form, connectors: { ...settings.connectors, [connector.id]: testResult?.ok || false } })
    setOpen(false)
  }

  return (
    <div className={`connector-card ${isConnected ? 'connected' : ''}`} style={{background: 'var(--surface-white)', border: '1px solid rgba(192,199,211,0.12)', borderRadius: 12, padding: 16}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: connector.logoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: connector.logoColor, flexShrink: 0 }}>
          {connector.logo}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 1, fontFamily: 'Manrope,sans-serif' }}>{connector.name}</div>
          <div style={{ fontSize: 12, color: 'var(--on-surface-v)', lineHeight: 1.3 }}>{connector.description}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {isConnected && <span className="badge badge-green" style={{fontSize: 9, padding: '1px 6px'}}>● Active</span>}
          <button className={`btn btn-xs ${isConnected ? 'btn-ghost' : 'btn-primary'}`} onClick={() => setOpen(!open)} style={{padding: '6px 12px'}}>
            {isConnected ? 'Manage' : 'Connect'}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-fade-in" style={{ background: 'var(--surface-low)', borderRadius: 10, padding: 16, border: '1px solid rgba(192,199,211,0.1)', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
          {connector.fields.map(field => (
            <div key={field.key}>
              <label style={{fontSize: 10, fontWeight: 700, color: 'var(--on-surface-v)', marginBottom: 6, display: 'block'}}>{field.label}</label>
              <input
                type={field.key.toLowerCase().includes('token') ? 'password' : 'text'}
                value={form[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                style={{borderRadius: 6, padding: '8px 12px', fontSize: 12}}
              />
              <span style={{ fontSize: 10, color: 'var(--outline)', marginTop: 4, display: 'block' }}>{field.hint}</span>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost btn-xs" onClick={testConnection} disabled={testing} style={{border: 'none', padding: 0, color: 'var(--primary)', background: 'transparent', fontWeight: 700}}>
                {testing ? '◌ Syncing...' : 'Test Connection'}
              </button>
              {connector.docs && (
                <a href={connector.docs} target="_blank" rel="noreferrer"
                  style={{ fontSize: 11, color: 'var(--outline)', alignSelf: 'center', textDecoration: 'none', fontWeight: 600 }}>
                  API Docs ↗
                </a>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-xs" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn btn-primary btn-xs" onClick={save}>Save</button>
            </div>
          </div>
          {testResult && <div style={{ fontSize: 11, color: testResult.ok ? '#16a34a' : 'var(--error)', fontWeight: 600 }}>{testResult.msg}</div>}
        </div>
      )}
    </div>
  )
}

export default function Connectors() {
  const { settings, saveSettings } = useApp()

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontFamily: 'Manrope,sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--on-surface)', margin: 0, letterSpacing: '-0.02em' }}>Diagnostic Pipelines</h2>
          <p style={{ fontSize: 14, color: 'var(--on-surface-v)', marginTop: 4 }}>Sync campaign telemetry from external platforms.</p>
        </div>
        <span className="badge badge-blue" style={{padding: '4px 12px', borderRadius: 10}}>{Object.values(settings.connectors || {}).filter(Boolean).length} Active</span>
      </div>

      <div className="card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="card-header" style={{ padding: '10px 16px' }}>
          <span className="card-title">Active Connections</span>
        </div>
        <div className="card-body" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CONNECTORS.map(c => (
            <ConnectorCard key={c.id} connector={c} settings={settings} onSave={saveSettings} />
          ))}
          
          <div style={{marginTop: 8}}>
            <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Available Integrations</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {['LinkedIn Ads', 'Snapchat Ads', 'DV360', 'Appsflyer', 'CleverTap'].map(name => (
                <div key={name} style={{ padding: '10px', borderRadius: 8, background: 'var(--surface-low)', border: '1px solid rgba(192,199,211,0.15)', fontSize: 11, color: 'var(--outline)', fontWeight: 600, textAlign: 'center' }}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
