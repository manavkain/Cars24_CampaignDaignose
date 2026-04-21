'use client'
import { useApp } from './AppContext'

const NAV = [
  { id: 'dashboard',        icon: '⊞', label: 'Dashboard' },
  { id: 'ai-chat',          icon: '◎', label: 'AI Assistant' },
  { id: 'reports',          icon: '↗', label: 'Reports' },
  { id: 'connectors',       icon: '⬡', label: 'Connectors' },
  { id: 'custom-logic',     icon: '⚙', label: 'Logic Maker' },
  { id: 'custom-dashboard', icon: '⊟', label: 'Custom View' },
]
const NAV_BOTTOM = [
  { id: 'settings', icon: '⋯', label: 'Settings' },
]

export default function Sidebar({ view, setView }) {
  const { isContinuous, setIsContinuous, settings, runDiagnosis, pipelineStep } = useApp()
  const isLive = isContinuous

  return (
    <div style={{
      width: 'var(--sidebar-w)', flexShrink: 0,
      background: 'var(--bg)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 32, height: 32, background: 'var(--blue)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, color: '#fff', fontWeight: 700, flexShrink: 0,
          }}>↯</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.2 }}>Growth Operator</div>
            <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 1 }}>by Cars24</div>
          </div>
        </div>
      </div>

      {/* Live / Diagnose */}
      <div style={{ padding: '10px 10px 6px', borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={runDiagnosis}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: 12, marginBottom: 7 }}
          disabled={pipelineStep === 'diagnose'}
        >
          {pipelineStep === 'diagnose'
            ? <><span className="animate-spin">◌</span> Diagnosing...</>
            : <><span>↯</span> Run Diagnosis</>}
        </button>
        <div
          onClick={() => setIsContinuous(!isContinuous)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 9px', borderRadius: 7, cursor: 'pointer',
            background: isLive ? 'var(--green-bg)' : 'var(--bg-2)',
            border: `1px solid ${isLive ? 'var(--green-bd)' : 'var(--border)'}`,
            transition: 'all .2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span className={isLive ? 'dot dot-green' : 'dot'} style={{ background: isLive ? 'var(--green)' : 'var(--t4)' }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: isLive ? 'var(--green)' : 'var(--t3)' }}>
              {isLive ? 'Live mode' : 'Paused'}
            </span>
          </div>
          <div className={`toggle-track ${isLive ? 'on' : ''}`}><div className="toggle-thumb" /></div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.07em', padding: '6px 10px 4px' }}>Workspace</div>
        {NAV.map(n => (
          <button key={n.id} className={`nav-item ${view === n.id ? 'active' : ''}`} onClick={() => setView(n.id)}>
            <span style={{ fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
        {settings.connectors?.meta || settings.connectors?.google ? (
          <>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.07em', padding: '10px 10px 4px' }}>Connected Ads</div>
            {settings.connectors?.meta && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', fontSize: 12, color: 'var(--t2)' }}>
                <span className="dot dot-green" /><span>Meta Ads</span>
              </div>
            )}
            {settings.connectors?.google && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', fontSize: 12, color: 'var(--t2)' }}>
                <span className="dot dot-green" /><span>Google Ads</span>
              </div>
            )}
          </>
        ) : null}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '8px 8px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_BOTTOM.map(n => (
          <button key={n.id} className={`nav-item ${view === n.id ? 'active' : ''}`} onClick={() => setView(n.id)}>
            <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
        <div style={{ padding: '8px 10px 2px', fontSize: 11, color: 'var(--t4)' }}>
          {settings.geminiKey ? <span style={{ color: 'var(--green)' }}>● Gemini connected</span> : <span>● Demo mode</span>}
        </div>
      </div>
    </div>
  )
}
