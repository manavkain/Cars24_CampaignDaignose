'use client'
import { useApp } from './AppContext'

const STEPS = [
  { id: 'input',   label: 'Input' },
  { id: 'diagnose',label: 'Diagnose' },
  { id: 'fix',     label: 'Fix' },
  { id: 'deploy',  label: 'Deploy' },
  { id: 'track',   label: 'Track' },
]
const ORDER = ['input','diagnose','fix','deploy','track']

export default function TopBar({ title, subtitle, actions }) {
  const { pipelineStep, metrics } = useApp()
  const stepIdx = ORDER.indexOf(pipelineStep)

  return (
    <div style={{
      background: 'var(--bg)', borderBottom: '1px solid var(--border)',
      padding: '0 20px', flexShrink: 0,
    }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 1 }}>{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--t3)', background: 'var(--bg-2)', padding: '3px 8px', borderRadius: 5, border: '1px solid var(--border)' }}>
            {metrics.campaign}
          </span>
          <span className="badge badge-blue">{metrics.platform}</span>
          {actions}
        </div>
      </div>

      {/* Pipeline strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingBottom: 10 }}>
        {STEPS.map((step, i) => {
          const isDone   = i < stepIdx
          const isActive = step.id === pipelineStep
          const cls = isDone ? 'done' : isActive ? 'active' : 'pending'
          return (
            <span key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className={`pipe-step ${cls}`}>
                {isDone && <span>✓</span>}
                {isActive && <span className="dot dot-blue" style={{ width: 5, height: 5 }} />}
                {step.label}
              </span>
              {i < STEPS.length - 1 && (
                <span style={{ color: 'var(--t4)', fontSize: 10 }}>—</span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
