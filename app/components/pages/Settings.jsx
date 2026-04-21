'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'

export default function Settings() {
  const { settings, saveSettings, setLog, setLogicRules, setMetrics } = useApp()
  const [form, setForm] = useState(settings)
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  function save() {
    saveSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function resetAll() {
    if (!confirm('Are you sure you want to reset all data? This will clear logs and settings.')) return
    localStorage.clear()
    window.location.reload()
  }

  function clearLog() {
    if (!confirm('Clear all improvement logs?')) return
    setLog([])
    localStorage.setItem('ago_log', JSON.stringify([]))
  }

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
      <div style={{ flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'Manrope,sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--on-surface)', margin: 0, letterSpacing: '-0.02em' }}>Platform Configuration</h2>
        <p style={{ fontSize: 14, color: 'var(--on-surface-v)', marginTop: 4 }}>Manage your curator profile, fine-tune notification thresholds, and configure external data pipelines.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', paddingRight: 4 }}>
          {/* API Keys */}
          <div className="card">
            <div className="card-header"><span className="card-title">API Configuration</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label>Gemini API Key</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type={showKey ? 'text' : 'password'} value={form.geminiKey} onChange={e => setForm({ ...form, geminiKey: e.target.value })} placeholder="Enter Gemini key..." style={{ flex: 1 }} />
                  <button className="btn btn-ghost" onClick={() => setShowKey(!showKey)} style={{ width: 60, padding: 0, justifyContent: 'center' }}>{showKey ? 'Hide' : 'Show'}</button>
                </div>
                <p style={{ fontSize: 11, color: 'var(--outline)', marginTop: 6 }}>Free key at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>aistudio.google.com</a> • Stored locally only.</p>
              </div>
              <div>
                <label>Make.com Webhook URL</label>
                <input value={form.webhookUrl} onChange={e => setForm({ ...form, webhookUrl: e.target.value })} placeholder="https://hook.make.com/..." />
                <p style={{ fontSize: 11, color: 'var(--outline)', marginTop: 6 }}>Used to export Improvement Log → Airtable.</p>
              </div>
            </div>
          </div>

          {/* Thresholds */}
          <div className="card">
            <div className="card-header"><span className="card-title">Alert Thresholds</span></div>
            <div className="card-body">
               <div style={{display:'grid', gridTemplateColumns:'1fr 80px 80px 100px', gap:10, alignItems:'center', marginBottom:12}}>
                  <div style={{fontSize:10, fontWeight:800, color:'var(--outline)', textTransform:'uppercase'}}>Metric</div>
                  <div style={{fontSize:10, fontWeight:800, color:'var(--outline)', textTransform:'uppercase'}}>Green</div>
                  <div style={{fontSize:10, fontWeight:800, color:'var(--outline)', textTransform:'uppercase'}}>Amber</div>
                  <div style={{fontSize:10, fontWeight:800, color:'var(--outline)', textTransform:'uppercase'}}>Note</div>
               </div>
               {Object.entries(form.thresholds).map(([key, val]) => (
                 <div key={key} style={{display:'grid', gridTemplateColumns:'1fr 80px 80px 100px', gap:10, alignItems:'center', marginBottom:8, background:'var(--surface-low)', padding:'6px 10px', borderRadius:8}}>
                    <span style={{fontSize:13, fontWeight:700, color:'var(--on-surface)', textTransform:'uppercase'}}>{key}%</span>
                    <input type="number" value={val.green} onChange={e => setForm({...form, thresholds:{...form.thresholds, [key]:{...val, green:parseFloat(e.target.value)}}})} style={{padding:'4px 8px', fontSize:12}} />
                    <input type="number" value={val.amber} onChange={e => setForm({...form, thresholds:{...form.thresholds, [key]:{...val, amber:parseFloat(e.target.value)}}})} style={{padding:'4px 8px', fontSize:12}} />
                    <span style={{fontSize:11, color:'var(--outline)'}}>{key==='ctr'||key==='roas'?'Higher=Better':'Lower=Better'}</span>
                 </div>
               ))}
            </div>
          </div>

          <button className="btn btn-primary" onClick={save} style={{ width: 'fit-content', padding: '10px 32px' }}>
            {saved ? '✓ Saved' : 'Save Configuration'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
           {/* Sheets help */}
           <div className="card">
             <div className="card-header"><span className="card-title">Data Format Guide</span></div>
             <div className="card-body">
               <div style={{ background: 'var(--surface-low)', padding: 12, borderRadius: 8, fontSize: 11, fontFamily: 'monospace', color: 'var(--on-surface-v)', lineHeight: 1.5 }}>
                 # Row 1: Headers<br/>
                 CTR,CPC,CPL,ROAS,Spend,Conv...<br/><br/>
                 # Row 2: Values<br/>
                 1.8,42,380,2.4,45000,118...
               </div>
               <button className="btn btn-ghost btn-xs" style={{marginTop:12, width:'100%', justifyContent:'center'}} onClick={() => navigator.clipboard.writeText("CTR,CPC,CPL,ROAS,Frequency,Spend,Conversions,Impressions,Clicks,Campaign,Platform\n1.8,42,380,2.4,4.7,45000,118,512000,9216,New Cars Q2,Meta")}>Copy Template</button>
             </div>
           </div>

           {/* Danger zone */}
           <div className="card" style={{ border: '1px solid rgba(186,26,26,0.15)' }}>
              <div className="card-header" style={{ background: 'rgba(186,26,26,0.03)' }}><span className="card-title" style={{ color: 'var(--error)' }}>Danger Zone</span></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontSize: 12, color: 'var(--on-surface-v)', lineHeight: 1.4 }}>Critical actions that cannot be undone.</p>
                <button className="btn btn-ghost btn-xs" style={{ color: 'var(--error)', width: '100%', justifyContent: 'center' }} onClick={clearLog}>Clear Improvement Log</button>
                <button className="btn btn-ghost btn-xs" style={{ color: 'var(--error)', width: '100%', justifyContent: 'center' }} onClick={resetAll}>Reset All Data</button>
              </div>
           </div>

           {/* Stats */}
           <div className="card">
              <div className="card-header"><span className="card-title">System Telemetry</span></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { l:'Platform Version', v:'v2.4.1-beta' },
                  { l:'AI Engine', v:'Curator-X9' },
                  { l:'Region', v:'us-east-1' },
                  { l:'Gemini', v: settings.geminiKey ? 'Connected' : 'Mock Mode', c: settings.geminiKey ? '#16a34a' : 'var(--orange)' }
                ].map(s => (
                  <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--outline)', fontWeight: 600 }}>{s.l}</span>
                    <span style={{ color: s.c || 'var(--on-surface)', fontWeight: 700 }}>{s.v}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
