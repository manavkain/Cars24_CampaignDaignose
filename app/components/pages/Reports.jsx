'use client'
import { useApp } from '../AppContext'
import { mockDiagnosis } from '../../lib/mockData'

export default function Reports() {
  const { metrics, diagnosis, log } = useApp()
  const data = diagnosis || mockDiagnosis
  const deployed = log.length
  const positive = log.filter(l => l.result === 'up').length
  const winRate = deployed > 0 ? Math.round(positive / deployed * 100) : 0

  const healthScore = (() => {
    let score = 0
    if (metrics.ctr >= 2) score += 20
    else if (metrics.ctr >= 1) score += 10
    if (metrics.roas >= 3) score += 25
    else if (metrics.roas >= 2) score += 12
    if (metrics.frequency <= 3) score += 20
    else if (metrics.frequency <= 5) score += 10
    if (metrics.cpl <= 250) score += 20
    else if (metrics.cpl <= 400) score += 10
    if (metrics.cpc <= 30) score += 15
    else if (metrics.cpc <= 60) score += 7
    return score
  })()

  const healthColor = healthScore >= 70 ? 'var(--green)' : healthScore >= 40 ? 'var(--amber)' : 'var(--red)'
  const healthLabel = healthScore >= 70 ? 'Healthy' : healthScore >= 40 ? 'At Risk' : 'Critical'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 900 }}>
      {/* Campaign health score */}
      <div className="panel">
        <div className="panel-header"><span className="panel-title">Campaign Health Report</span></div>
        <div className="panel-body">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              border: `4px solid ${healthColor}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: `${healthColor}10`,
            }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: healthColor }}>{healthScore}</span>
              <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>/ 100</span>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: healthColor, marginBottom: 2 }}>{healthLabel}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{metrics.campaign} · {metrics.platform}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                {data.summary}
              </div>
            </div>
          </div>

          {/* Metric breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {[
              { label: 'CTR', value: `${metrics.ctr}%`, good: metrics.ctr >= 2 },
              { label: 'CPC', value: `₹${metrics.cpc}`, good: metrics.cpc <= 30 },
              { label: 'ROAS', value: `${metrics.roas}x`, good: metrics.roas >= 3 },
              { label: 'Frequency', value: metrics.frequency, good: metrics.frequency <= 3 },
              { label: 'CPL', value: `₹${metrics.cpl}`, good: metrics.cpl <= 250 },
            ].map(m => (
              <div key={m.label} style={{
                background: 'var(--bg-elevated)', borderRadius: 8, padding: '10px',
                border: `1px solid ${m.good ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: m.good ? 'var(--green)' : 'var(--amber)' }}>{m.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issues summary */}
      <div className="panel">
        <div className="panel-header"><span className="panel-title">Active Issues</span></div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(data.issues || []).map(issue => (
            <div key={issue.id} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '8px 10px', background: 'var(--bg-elevated)', borderRadius: 8,
              border: '1px solid var(--border)',
            }}>
              <span className={`badge ${issue.severity === 'high' ? 'badge-red' : issue.severity === 'medium' ? 'badge-amber' : 'badge-green'}`}>
                {issue.severity}
              </span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{issue.type.replace(/_/g, ' ')}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{issue.evidence}</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{issue.confidence}% conf.</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fix history stats */}
      <div className="panel">
        <div className="panel-header"><span className="panel-title">Fix Performance</span></div>
        <div className="panel-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Total Deployed', value: deployed },
              { label: 'Positive Result', value: positive, color: 'var(--green)' },
              { label: 'Win Rate', value: `${winRate}%`, color: winRate >= 60 ? 'var(--green)' : 'var(--amber)' },
              { label: 'Pending Review', value: log.filter(l => l.result === 'pending').length, color: 'var(--amber)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: s.color || 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Fix type breakdown */}
          {['Creative', 'Audience', 'Bidding', 'Budget'].map(type => {
            const count = log.filter(l => l.fixType === type).length
            const wins = log.filter(l => l.fixType === type && l.result === 'up').length
            const pct = count > 0 ? Math.round(wins / count * 100) : 0
            return (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ width: 65, fontSize: 11, color: 'var(--text-secondary)' }}>{type}</span>
                <div style={{ flex: 1, height: 6, background: 'var(--bg-elevated)', borderRadius: 99 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 99, transition: 'width 0.5s' }} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 55 }}>
                  {count > 0 ? `${wins}/${count} (${pct}%)` : '—'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
