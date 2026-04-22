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

  function save() {
    onSave({ ...form, connectors: { ...settings.connectors, [connector.id]: true } })
    setOpen(false)
  }

  return (
    <div className={`connector-card ${isConnected ? 'connected' : ''}`} style={{background: 'var(--surface-white)', border: '1px solid rgba(192,199,211,0.12)', borderRadius: 16, padding: 20, transition: 'all .2s'}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: connector.logoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: connector.logoColor, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          {connector.logo}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--on-surface)', fontFamily: 'Manrope,sans-serif' }}>{connector.name}</div>
            {isConnected && <span className="badge badge-green" style={{fontSize: 9, padding: '1px 8px', borderRadius: 6}}>LIVE</span>}
          </div>
          <div style={{ fontSize: 13, color: 'var(--on-surface-v)', lineHeight: 1.4, marginTop: 2, fontWeight: 500 }}>{connector.description}</div>
        </div>
        <button className={`btn ${isConnected ? 'btn-ghost' : 'btn-primary'}`} onClick={() => setOpen(!open)} style={{padding: '8px 20px', borderRadius: 10}}>
          {isConnected ? 'Configuration' : 'Initialize'}
        </button>
      </div>

      {open && (
        <div className="animate-fade-in" style={{ background: 'var(--surface-low)', borderRadius: 12, padding: 20, border: '1px solid rgba(192,199,211,0.1)', display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: connector.fields.length > 1 ? '1fr 1fr' : '1fr', gap: 16 }}>
            {connector.fields.map(field => (
              <div key={field.key}>
                <label style={{fontSize: 10, fontWeight: 700, color: 'var(--outline)', marginBottom: 6, display: 'block', textTransform: 'uppercase'}}>{field.label}</label>
                <input
                  type={field.key.toLowerCase().includes('token') ? 'password' : 'text'}
                  value={form[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={{borderRadius: 8, padding: '10px 14px', fontSize: 13, background: 'var(--surface-white)'}}
                />
                <span style={{ fontSize: 10, color: 'var(--outline)', marginTop: 6, display: 'block', fontWeight: 500 }}>{field.hint}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 16 }}>
            <div style={{ display: 'flex', gap: 16 }}>
               <button className="btn btn-ghost btn-xs" style={{ border: 'none', background: 'transparent', color: 'var(--primary)', fontWeight: 800, padding: 0 }} onClick={() => { setTesting(true); setTimeout(() => setTesting(false), 1000) }}>
                 {testing ? '◌ Testing Pipeline...' : 'Verify Connectivity'}
               </button>
               {connector.docs && <a href={connector.docs} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--outline)', textDecoration: 'none', fontWeight: 700, alignSelf: 'center' }}>Documentation ↗</a>}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={save}>Save Pipeline</button>
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
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontFamily: 'Manrope,sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--on-surface)', margin: 0, letterSpacing: '-0.02em' }}>Diagnostic Pipelines</h2>
          <p style={{ fontSize: 13, color: 'var(--on-surface-v)', marginTop: 2 }}>Secure telemetry synchronization with global advertising platforms.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
           <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--primary)', fontFamily: 'Manrope,sans-serif', lineHeight: 1 }}>{Object.values(settings.connectors || {}).filter(Boolean).length}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', marginTop: 1 }}>Active</div>
           </div>
           <div style={{ width: 1, height: 24, background: 'rgba(0,0,0,0.1)' }} />
           <button className="btn btn-ghost btn-sm" onClick={() => saveSettings({ connectors: { meta: false, google: false, sheets: false } })}>Reset All</button>
        </div>
      </div>

      <div className="card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="card-header" style={{ padding: '12px 20px' }}>
          <span className="card-title">Synchronized Streams</span>
        </div>
        <div className="card-body" style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CONNECTORS.map(c => (
            <ConnectorCard key={c.id} connector={c} settings={settings} onSave={saveSettings} />
          ))}
          
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: 8 }}>In-Development Adapters</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {['LinkedIn Marketing API', 'Snapchat Ads Manager', 'DV360 Real-time Feed', 'Appsflyer S2S', 'CleverTap Events'].map(name => (
                <div key={name} style={{ padding: '14px', borderRadius: 12, background: 'var(--surface-low)', border: '1px solid rgba(192,199,211,0.15)', fontSize: 12, color: 'var(--outline)', fontWeight: 700, textAlign: 'center', transition: 'all .2s' }}>
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
