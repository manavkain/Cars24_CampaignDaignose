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
      background: 'var(--surface-white)',
      borderBottom: '1px solid rgba(192,199,211,0.15)',
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
          width: 26, height: 26, background: 'var(--primary)',
          borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff',
        }}>↯</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>
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
            background: currentView === item.id ? 'var(--surface-cont)' : 'transparent',
            color: currentView === item.id ? 'var(--on-surface)' : 'var(--on-surface-v)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            borderBottom: currentView === item.id ? '2px solid var(--primary)' : '2px solid transparent',
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
          background: isContinuous ? 'rgba(22,163,74,0.1)' : 'var(--surface-low)',
          border: `1px solid ${isContinuous ? '#16a34a' : 'rgba(192,199,211,0.3)'}`,
          color: isContinuous ? '#15512a' : 'var(--on-surface-v)',
          fontSize: 11, fontWeight: 500, cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: isContinuous ? '#16a34a' : 'var(--on-surface-v)',
          animation: isContinuous ? 'pulsedot 2s infinite' : 'none',
        }} />
        {isContinuous ? 'Live' : 'Paused'}
      </button>

      {/* Diagnose CTA */}
      <button
        onClick={() => setView('dashboard')}
        className="btn btn-primary"
        style={{ fontSize: 11, padding: '5px 12px', marginLeft: 12 }}
      >
        ↯ Diagnose
      </button>

      {/* Settings icon */}
      <button
        onClick={() => setView('settings')}
        style={{
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: currentView === 'settings' ? 'var(--surface-cont)' : 'transparent',
          border: '1px solid ' + (currentView === 'settings' ? 'rgba(192,199,211,0.3)' : 'transparent'),
          borderRadius: 6, cursor: 'pointer', color: 'var(--on-surface-v)',
          fontSize: 14,
          marginLeft: 8,
        }}
      >⚙</button>
    </div>
  )
}
