'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'

const TYPE_LABELS = {
  creative_fatigue: 'Creative Fatigue', audience_saturation: 'Audience Saturation',
  bid_floor: 'Bid Floor Issue', budget_pacing: 'Budget Pacing', landing_page: 'Landing Page Drop-off',
}

export default function DiagnosisFeed({ onViewFix }) {
  const { diagnosis } = useApp()
  const [expanded, setExpanded] = useState('1')
  const issues = [...(diagnosis?.issues || [])].sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity]))

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {issues.some(i => i.severity === 'high') && <span className="dot dot-red" />}
          <span className="card-title">Diagnosis Feed</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {issues.filter(i => i.severity === 'high').length > 0 && <span className="badge badge-red">{issues.filter(i => i.severity === 'high').length} high</span>}
          {issues.filter(i => i.severity === 'medium').length > 0 && <span className="badge badge-amber">{issues.filter(i => i.severity === 'medium').length} watch</span>}
        </div>
      </div>
      <div className="card-body" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {diagnosis?.summary && (
          <div style={{ background: 'var(--blue-light)', borderRadius: 7, padding: '8px 11px', marginBottom: 10, fontSize: 12, color: 'var(--blue)', lineHeight: 1.5, borderLeft: '3px solid var(--blue)' }}>
            {diagnosis.summary}
          </div>
        )}
        {issues.map(issue => {
          const sev = issue.severity
          const badgeCls = sev === 'high' ? 'badge-red' : sev === 'medium' ? 'badge-amber' : 'badge-green'
          const sevLabel = sev === 'high' ? 'Act Now' : sev === 'medium' ? 'Watch' : 'Monitor'
          const isExp = expanded === issue.id
          return (
            <div key={issue.id} className="animate-fade-in" style={{
              border: `1px solid ${sev === 'high' ? 'var(--red-bd)' : 'var(--border)'}`,
              borderRadius: 8, marginBottom: 6, overflow: 'hidden',
              background: sev === 'high' ? 'var(--red-bg)' : 'var(--bg)',
            }}>
              <div style={{ padding: '9px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setExpanded(isExp ? null : issue.id)}>
                <span className={`badge ${badgeCls}`}>{sevLabel}</span>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: 'var(--t1)' }}>{TYPE_LABELS[issue.type] || issue.type}</span>
                <span style={{ fontSize: 10, color: 'var(--t3)' }}>{issue.confidence}%</span>
                <span style={{ fontSize: 10, color: 'var(--t4)', marginLeft: 4 }}>{isExp ? '▲' : '▼'}</span>
              </div>
              {isExp && (
                <div style={{ padding: '0 12px 11px', borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 12, color: 'var(--t2)', margin: '8px 0 9px', lineHeight: 1.6 }}>{issue.evidence}</p>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 3 }}>Confidence</div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${issue.confidence}%` }} /></div>
                    </div>
                    <button className="btn btn-primary btn-xs" onClick={() => onViewFix && onViewFix(issue.id)}>See Fix →</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
