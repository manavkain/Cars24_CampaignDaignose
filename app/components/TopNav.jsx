'use client'
import { useApp } from './AppContext'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'reports', label: 'Reports' },
  { id: 'custom-logic', label: 'Logic Maker' },
  { id: 'custom-dashboard', label: 'Custom View' },
  { id: 'ai-tools', label: 'AI Tools' },
  { id: 'admin', label: 'Admin' },
]

export default function TopNav({ currentView, setView }) {
  const { isContinuous, setIsContinuous, diagnosis } = useApp()

  return (
    <div style={{
      height: 52,
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 4,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16 }}>
        <div style={{
          width: 26, height: 26, background: 'var(--accent)',
          borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff',
        }}>↯</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
          Growth Operator
        </span>
      </div>

      {/* Nav items */}
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          style={{
            padding: '5px 11px',
            borderRadius: 6,
            border: 'none',
            background: currentView === item.id ? 'var(--bg-elevated)' : 'transparent',
            color: currentView === item.id ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            borderBottom: currentView === item.id ? '2px solid var(--accent)' : '2px solid transparent',
            transition: 'all 0.15s',
          }}
        >
          {item.label}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      {/* Continuous mode pill */}
      <button
        onClick={() => setIsContinuous(!isContinuous)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 99,
          background: isContinuous ? 'var(--green-bg)' : 'var(--bg-elevated)',
          border: `1px solid ${isContinuous ? 'var(--green)' : 'var(--border)'}`,
          color: isContinuous ? 'var(--green)' : 'var(--text-muted)',
          fontSize: 11, fontWeight: 500, cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: isContinuous ? 'var(--green)' : 'var(--text-muted)',
          animation: isContinuous ? 'pulse 1.5s infinite' : 'none',
        }} />
        {isContinuous ? 'Live' : 'Paused'}
      </button>

      {/* Diagnose CTA */}
      <button
        onClick={() => setView('dashboard')}
        className="btn btn-primary"
        style={{ fontSize: 11, padding: '5px 12px' }}
      >
        ↯ Diagnose
      </button>

      {/* Settings icon */}
      <button
        onClick={() => setView('settings')}
        style={{
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: currentView === 'settings' ? 'var(--bg-elevated)' : 'transparent',
          border: '1px solid ' + (currentView === 'settings' ? 'var(--border)' : 'transparent'),
          borderRadius: 6, cursor: 'pointer', color: 'var(--text-secondary)',
          fontSize: 14,
        }}
      >⚙</button>
    </div>
  )
}
