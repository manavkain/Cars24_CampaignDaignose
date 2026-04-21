'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'
import CampaignPulse from '../dashboard/CampaignPulse'
import DiagnosisFeed from '../dashboard/DiagnosisFeed'
import FixGenerator from '../dashboard/FixGenerator'
import ImprovementLog from '../dashboard/ImprovementLog'

const WIDGETS = [
  { id: 'pulse',     label: 'Campaign Pulse',  desc: 'Live metric cards + input',       color: 'var(--blue)' },
  { id: 'diagnosis', label: 'Diagnosis Feed',  desc: 'AI issues ranked by severity',    color: 'var(--red)' },
  { id: 'fix',       label: 'Fix Generator',   desc: 'Copy + audience + bidding recs',  color: 'var(--green)' },
  { id: 'log',       label: 'Improvement Log', desc: 'Before/after tracking table',     color: 'var(--amber)' },
]

const LAYOUTS = [
  { id: '1col', label: '1 Column', cols: 1 },
  { id: '2col', label: '2 Column', cols: 2 },
  { id: '3col', label: '3 Column', cols: 3 },
]

function renderWidget(id) {
  switch (id) {
    case 'pulse':     return <CampaignPulse />
    case 'diagnosis': return <DiagnosisFeed />
    case 'fix':       return <FixGenerator />
    case 'log':       return <ImprovementLog />
  }
}

export default function CustomDashboard() {
  const { settings, saveSettings } = useApp()
  const [layout, setLayout] = useState(settings.dashboardLayout || ['pulse','diagnosis','fix','log'])
  const [cols, setCols] = useState(2)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggle(id) {
    setLayout(prev => prev.includes(id) ? prev.length > 1 ? prev.filter(w => w !== id) : prev : [...prev, id])
  }
  function move(id, dir) {
    const i = layout.indexOf(id); if (i < 0) return
    const n = [...layout]
    const j = dir === 'up' ? i - 1 : i + 1
    if (j < 0 || j >= n.length) return
    ;[n[i], n[j]] = [n[j], n[i]]
    setLayout(n)
  }
  function save() { saveSettings({ dashboardLayout: layout }); setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', margin: 0 }}>Custom Dashboard</h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>Configure which panels appear and how they're arranged.</p>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {saved && <span style={{ fontSize: 12, color: 'var(--green)' }}>✓ Saved</span>}
          <button className={`btn btn-sm ${editing ? 'btn-blue' : 'btn-ghost'}`} onClick={() => setEditing(!editing)}>{editing ? '✓ Done' : '⚙ Configure'}</button>
          <button className="btn btn-primary btn-sm" onClick={save}>Apply Layout</button>
        </div>
      </div>

      {editing ? (
        <div style={{ display: 'flex', gap: 12, flex: 1, overflow: 'hidden', minHeight: 0 }}>
          {/* Widget picker */}
          <div className="card" style={{ width: 210, flexShrink: 0, overflow: 'auto' }}>
            <div className="card-header"><span className="card-title">Widgets</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {WIDGETS.map(w => {
                const on = layout.includes(w.id)
                return (
                  <div key={w.id} onClick={() => toggle(w.id)} style={{ padding: '9px 10px', borderRadius: 8, cursor: 'pointer', border: `1px solid ${on ? 'var(--blue-mid)' : 'var(--border)'}`, background: on ? 'var(--blue-light)' : 'var(--bg)', transition: 'all .15s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: on ? 'var(--blue)' : 'var(--t2)' }}>{w.label}</span>
                      <span style={{ fontSize: 12, color: on ? 'var(--green)' : 'var(--t4)' }}>{on ? '✓' : '+'}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{w.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Layout + order */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden', minHeight: 0 }}>
            {/* Column picker */}
            <div className="card" style={{ flexShrink: 0 }}>
              <div className="card-header"><span className="card-title">Layout</span></div>
              <div className="card-body" style={{ display: 'flex', gap: 8 }}>
                {LAYOUTS.map(l => (
                  <div key={l.id} onClick={() => setCols(l.cols)} style={{ flex: 1, padding: 10, borderRadius: 8, cursor: 'pointer', textAlign: 'center', border: `1px solid ${cols === l.cols ? 'var(--blue)' : 'var(--border)'}`, background: cols === l.cols ? 'var(--blue-light)' : 'transparent', fontSize: 12, fontWeight: cols === l.cols ? 600 : 400, color: cols === l.cols ? 'var(--blue)' : 'var(--t2)', transition: 'all .15s' }}>
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Order */}
            <div className="card" style={{ flex: 1, overflow: 'auto' }}>
              <div className="card-header"><span className="card-title">Order</span><span style={{ fontSize: 11, color: 'var(--t4)' }}>Use arrows to reorder</span></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {layout.map((id, idx) => {
                  const w = WIDGETS.find(x => x.id === id)
                  return (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--t4)', width: 20, textAlign: 'center', fontWeight: 600 }}>{idx + 1}</span>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: w?.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--t1)' }}>{w?.label}</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => move(id,'up')} style={{ padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', fontSize: 10, color: 'var(--t2)' }}>▲</button>
                        <button onClick={() => move(id,'dn')} style={{ padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', fontSize: 10, color: 'var(--t2)' }}>▼</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10, overflow: 'auto', alignContent: 'start' }}>
          {layout.map(id => <div key={id} style={{ minHeight: 280 }}>{renderWidget(id)}</div>)}
        </div>
      )}
    </div>
  )
}
