'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'
import CampaignPulse from '../dashboard/CampaignPulse'
import DiagnosisFeed from '../dashboard/DiagnosisFeed'
import FixGenerator from '../dashboard/FixGenerator'
import ImprovementLog from '../dashboard/ImprovementLog'

const ALL_WIDGETS = [
  { id: 'pulse',     label: 'Campaign Pulse',    desc: 'Live metric cards + input' },
  { id: 'diagnosis', label: 'Diagnosis Feed',    desc: 'AI issue cards, ranked by severity' },
  { id: 'fix',       label: 'Fix Generator',     desc: 'Copy variants + audience + bidding' },
  { id: 'log',       label: 'Improvement Log',   desc: 'Before/after tracking table' },
]

const LAYOUTS = [
  { id: '2col', label: '2 Column', cols: 2 },
  { id: '3col', label: '3 Column', cols: 3 },
  { id: 'focus', label: 'Focus (1 col)', cols: 1 },
  { id: 'custom', label: 'Custom', cols: null },
]

function WidgetPreview({ id, label }) {
  const colors = { pulse: '#6366f1', diagnosis: '#ef4444', fix: '#22c55e', log: '#f59e0b' }
  const icons = { pulse: '↯', diagnosis: '⚠', fix: '✦', log: '◎' }
  return (
    <div style={{
      background: `${colors[id]}18`,
      border: `1px solid ${colors[id]}44`,
      borderRadius: 8, padding: '10px 12px',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ fontSize: 16, color: colors[id] }}>{icons[id]}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</span>
    </div>
  )
}

export default function CustomDashboard() {
  const { settings, saveSettings } = useApp()
  const [layout, setLayout] = useState(settings.dashboardLayout || ['pulse', 'diagnosis', 'fix', 'log'])
  const [activeLayout, setActiveLayout] = useState('2col')
  const [isEditing, setIsEditing] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  function toggleWidget(id) {
    if (layout.includes(id)) {
      if (layout.length === 1) return
      setLayout(layout.filter(w => w !== id))
    } else {
      setLayout([...layout, id])
    }
  }

  function moveUp(id) {
    const idx = layout.indexOf(id)
    if (idx <= 0) return
    const next = [...layout]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    setLayout(next)
  }

  function moveDown(id) {
    const idx = layout.indexOf(id)
    if (idx >= layout.length - 1) return
    const next = [...layout]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    setLayout(next)
  }

  function saveLayout() {
    saveSettings({ dashboardLayout: layout })
    setSavedMsg('✓ Layout saved!')
    setTimeout(() => setSavedMsg(''), 2000)
  }

  const activeCols = LAYOUTS.find(l => l.id === activeLayout)?.cols || 2

  function renderWidget(id) {
    switch (id) {
      case 'pulse':     return <CampaignPulse key={id} />
      case 'diagnosis': return <DiagnosisFeed key={id} />
      case 'fix':       return <FixGenerator key={id} />
      case 'log':       return <ImprovementLog key={id} />
      default: return null
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Custom Dashboard</h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '3px 0 0' }}>
            Configure which widgets appear and how they're arranged.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {savedMsg && <span style={{ fontSize: 11, color: 'var(--green)' }}>{savedMsg}</span>}
          <button className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsEditing(!isEditing)} style={{ fontSize: 11 }}>
            {isEditing ? '✓ Done' : '⚙ Configure'}
          </button>
          <button className="btn btn-primary" onClick={() => { saveLayout(); setIsLive(true) }} style={{ fontSize: 11 }}>
            {isLive ? '✓ Applied' : 'Apply Layout'}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div style={{ display: 'flex', gap: 12, flex: 1 }}>
          {/* Widget picker */}
          <div className="panel" style={{ width: 220, flexShrink: 0 }}>
            <div className="panel-header"><span className="panel-title">Widgets</span></div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ALL_WIDGETS.map(w => {
                const isActive = layout.includes(w.id)
                return (
                  <div key={w.id}
                    onClick={() => toggleWidget(w.id)}
                    style={{
                      background: isActive ? 'var(--bg-elevated)' : 'transparent',
                      border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 8, padding: '8px 10px', cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>{w.label}</span>
                      <span style={{ fontSize: 10, color: isActive ? 'var(--green)' : 'var(--text-muted)' }}>{isActive ? '✓' : '+'}</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{w.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Layout picker + order */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Layout options */}
            <div className="panel">
              <div className="panel-header"><span className="panel-title">Layout</span></div>
              <div className="panel-body" style={{ display: 'flex', gap: 8 }}>
                {LAYOUTS.map(l => (
                  <div key={l.id} onClick={() => setActiveLayout(l.id)}
                    style={{
                      flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                      border: `1px solid ${activeLayout === l.id ? 'var(--accent)' : 'var(--border)'}`,
                      background: activeLayout === l.id ? 'var(--bg-elevated)' : 'transparent',
                      fontSize: 11, color: activeLayout === l.id ? 'var(--text-primary)' : 'var(--text-muted)',
                      transition: 'all 0.15s',
                    }}>
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Widget order */}
            <div className="panel" style={{ flex: 1 }}>
              <div className="panel-header">
                <span className="panel-title">Order & Position</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Use arrows to reorder</span>
              </div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {layout.map((id, idx) => {
                  const w = ALL_WIDGETS.find(x => x.id === id)
                  return (
                    <div key={id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                      borderRadius: 8, padding: '8px 10px',
                    }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 20, textAlign: 'center' }}>{idx + 1}</span>
                      <WidgetPreview id={id} label={w?.label || id} />
                      <div style={{ flex: 1 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <button onClick={() => moveUp(id)}
                          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 3, padding: '2px 5px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 10 }}>▲</button>
                        <button onClick={() => moveDown(id)}
                          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 3, padding: '2px 5px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 10 }}>▼</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Live dashboard view */
        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: `repeat(${activeCols}, 1fr)`,
          gap: 10, overflow: 'auto',
        }}>
          {layout.map(id => (
            <div key={id} style={{ minHeight: 300 }}>
              {renderWidget(id)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
