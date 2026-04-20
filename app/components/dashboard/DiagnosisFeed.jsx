'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'
import { mockDiagnosis } from '../../lib/mockData'

const TYPE_LABELS = {
  creative_fatigue: 'Creative Fatigue',
  audience_saturation: 'Audience Saturation',
  bid_floor: 'Bid Floor Issue',
  budget_pacing: 'Budget Pacing',
  landing_page: 'Landing Page Drop-off',
}

function IssueCard({ issue, isExpanded, onToggle, onViewFix }) {
  const sev = issue.severity
  const badgeClass = sev === 'high' ? 'badge-red' : sev === 'medium' ? 'badge-amber' : 'badge-green'
  const sevLabel = sev === 'high' ? 'Act Now' : sev === 'medium' ? 'Watch' : 'Monitor'

  return (
    <div
      className="animate-fade-in"
      style={{
        background: 'var(--bg-elevated)',
        border: `1px solid ${sev === 'high' ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
        borderRadius: 8,
        marginBottom: 6,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <div
        style={{ padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        onClick={onToggle}
      >
        <span className={`badge ${badgeClass}`}>{sevLabel}</span>
        <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
          {TYPE_LABELS[issue.type] || issue.type}
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{issue.confidence}% conf.</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{isExpanded ? '▲' : '▼'}</span>
      </div>

      {isExpanded && (
        <div style={{ padding: '0 12px 12px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '8px 0 10px', lineHeight: 1.6 }}>
            {issue.evidence}
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{
              flex: 1, background: 'var(--bg-card)', borderRadius: 6,
              padding: '4px 8px', fontSize: 11, color: 'var(--text-muted)',
            }}>
              Confidence: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{issue.confidence}%</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ fontSize: 11, padding: '4px 10px' }}
              onClick={() => onViewFix(issue.id)}
            >
              See Fix →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DiagnosisFeed({ onViewFix }) {
  const { diagnosis } = useApp()
  const [expandedId, setExpandedId] = useState('1')
  const data = diagnosis || mockDiagnosis

  const sortedIssues = [...(data.issues || [])].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.severity] - order[b.severity]
  })

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {sortedIssues.some(i => i.severity === 'high') && <span className="dot-red" />}
          <span className="panel-title">Diagnosis Feed</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {sortedIssues.filter(i => i.severity === 'high').length > 0 && (
            <span className="badge badge-red">{sortedIssues.filter(i => i.severity === 'high').length} high</span>
          )}
          {sortedIssues.filter(i => i.severity === 'medium').length > 0 && (
            <span className="badge badge-amber">{sortedIssues.filter(i => i.severity === 'medium').length} watch</span>
          )}
        </div>
      </div>

      <div className="panel-body" style={{ flex: 1, overflow: 'auto' }}>
        {data.summary && (
          <div style={{
            background: 'var(--bg-elevated)', borderRadius: 6,
            padding: '7px 10px', marginBottom: 10,
            fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5,
            borderLeft: '3px solid var(--accent)',
          }}>
            {data.summary}
          </div>
        )}

        {sortedIssues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 12 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
            No issues detected. Campaign looks healthy.
          </div>
        ) : (
          sortedIssues.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              isExpanded={expandedId === issue.id}
              onToggle={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
              onViewFix={onViewFix}
            />
          ))
        )}
      </div>
    </div>
  )
}
