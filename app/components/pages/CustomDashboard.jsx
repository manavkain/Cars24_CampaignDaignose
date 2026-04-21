'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'
import CampaignPulse from '../dashboard/CampaignPulse'
import DiagnosisFeed from '../dashboard/DiagnosisFeed'
import FixGenerator from '../dashboard/FixGenerator'
import ImprovementLog from '../dashboard/ImprovementLog'

const WIDGETS = [
  { id: 'pulse', name: 'Campaign Pulse', component: CampaignPulse },
  { id: 'diagnosis', name: 'Diagnostic Stream', component: DiagnosisFeed },
  { id: 'fix', name: 'Fix Generator', component: FixGenerator },
  { id: 'log', name: 'Improvement Log', component: ImprovementLog },
]

export default function CustomDashboard() {
  const { settings, saveSettings } = useApp()
  const [layout, setLayout] = useState(settings.dashboardLayout || ['pulse', 'diagnosis', 'fix', 'log'])
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [saved, setSaved] = useState(false)

  function move(idx, dir) {
    const n = [...layout]; const target = idx + dir
    if (target < 0 || target >= n.length) return
    [n[idx], n[target]] = [n[target], n[idx]]
    setLayout(n)
  }

  function toggle(id) {
    if (layout.includes(id)) {
      if (layout.length === 1) return; setLayout(layout.filter(x => x !== id))
    } else {
      setLayout([...layout, id])
    }
  }

  function save() {
    saveSettings({ ...settings, dashboardLayout: layout })
    setSaved(true)
    setTimeout(() => { setSaved(false); setIsConfiguring(false) }, 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontFamily: 'Manrope,sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--on-surface)', margin: 0, letterSpacing: '-0.02em' }}>Dashboard Architect</h2>
          <p style={{ fontSize: 15, color: 'var(--on-surface-v)', marginTop: 8 }}>Customize your diagnostic cockpit. Rearrange and toggle visualization modules.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className={`btn ${isConfiguring ? 'btn-ghost' : 'btn-primary'}`} onClick={() => setIsConfiguring(!isConfiguring)}>
             <span className="material-symbols-outlined" style={{fontSize: 18}}>{isConfiguring ? 'visibility' : 'architecture'}</span>
             {isConfiguring ? 'Preview Mode' : 'Configure Layout'}
          </button>
          {isConfiguring && (
            <button className="btn btn-orange" onClick={save}>
               {saved ? '✓ Architecture Saved' : 'Apply Layout'}
            </button>
          )}
        </div>
      </div>

      {isConfiguring ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {WIDGETS.map((w, idx) => {
            const active = layout.includes(w.id)
            const lIdx = layout.indexOf(w.id)
            return (
              <div key={w.id} className="card animate-fade-in" style={{ border: active ? '1px solid var(--primary-c)' : '1px solid rgba(192,199,211,0.2)', opacity: active ? 1 : 0.6, background: active ? 'var(--surface-white)' : 'var(--surface-low)', transition: 'all .25s' }}>
                <div className="card-header" style={{background: active ? 'var(--primary-fixed)' : 'transparent', borderBottom: active ? '1px solid rgba(0,88,148,0.1)' : 'none'}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: active ? 'var(--surface-white)' : 'var(--surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <span className="material-symbols-outlined" style={{fontSize: 18, color: active ? 'var(--primary)' : 'var(--outline)'}}>widgets</span>
                    </div>
                    <span className="card-title" style={{color: active ? 'var(--primary)' : 'var(--outline)'}}>{w.name}</span>
                  </div>
                  <div className={`toggle-track ${active ? 'on' : ''}`} onClick={() => toggle(w.id)} style={{ cursor: 'pointer' }}>
                    <div className="toggle-thumb" />
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ fontSize: 13, color: 'var(--on-surface-v)', marginBottom: 20, lineHeight: 1.5 }}>
                    Module ID: <code style={{background: 'rgba(0,0,0,0.05)', padding: '2px 5px', borderRadius: 4}}>{w.id}</code><br/>
                    Status: {active ? <span style={{color: '#16a34a', fontWeight: 700}}>Active</span> : 'Hidden'}
                  </div>
                  {active && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="btn btn-ghost btn-sm" style={{flex: 1}} onClick={() => move(lIdx, -1)} disabled={lIdx === 0}>
                         <span className="material-symbols-outlined" style={{fontSize: 16}}>arrow_back</span> Move Left
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{flex: 1}} onClick={() => move(lIdx, 1)} disabled={lIdx === layout.length - 1}>
                         Move Right <span className="material-symbols-outlined" style={{fontSize: 16}}>arrow_forward</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, height: '100%', minHeight: 0, overflow: 'auto', paddingBottom: 40 }}>
          {layout.map(id => {
            const W = WIDGETS.find(w => w.id === id)?.component
            return W ? <div key={id} className="animate-fade-in" style={{minHeight: 350}}><W /></div> : null
          })}
        </div>
      )}
    </div>
  )
}
