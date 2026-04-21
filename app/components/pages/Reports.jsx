'use client'
import { useApp } from '../AppContext'

export default function Reports() {
  const { metrics, diagnosis, log } = useApp()
  const deployed = log.length
  const positive = log.filter(l => l.result === 'up').length
  const winRate = deployed > 0 ? Math.round(positive / deployed * 100) : 0
  const issues = diagnosis?.issues || []

  const score = (() => {
    let s = 0
    if (metrics.ctr >= 2) s += 20; else if (metrics.ctr >= 1) s += 10
    if (metrics.roas >= 3) s += 25; else if (metrics.roas >= 2) s += 12
    if (metrics.frequency <= 3) s += 20; else if (metrics.frequency <= 5) s += 10
    if (metrics.cpl <= 250) s += 20; else if (metrics.cpl <= 400) s += 10
    if (metrics.cpc <= 30) s += 15; else if (metrics.cpc <= 60) s += 7
    return s
  })()

  const scoreColor = score >= 70 ? '#16a34a' : score >= 40 ? 'var(--orange)' : 'var(--error)'
  const scoreLabel = score >= 70 ? 'Healthy' : score >= 40 ? 'At Risk' : 'Critical'

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: 'Manrope,sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--on-surface)', margin: 0, letterSpacing: '-0.02em' }}>Performance Analytics</h2>
          <p style={{ fontSize: 13, color: 'var(--on-surface-v)', marginTop: 2 }}>Surgical audit of campaign health and optimization impact.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-xs">Download PDF</button>
          <button className="btn btn-primary btn-xs">Generate Insights</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, flex: 1, minHeight: 0 }}>
        {/* Main report area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', paddingRight: 4 }}>
          {/* Health index card - integrated design */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #fff, #f8f9fa)', border: '1px solid rgba(0,88,148,0.1)' }}>
            <div className="card-body" style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 24 }}>
              <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                 <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                   <circle cx="45" cy="45" r="40" fill="none" stroke="var(--surface-high)" strokeWidth="8" />
                   <circle cx="45" cy="45" r="40" fill="none" stroke={scoreColor} strokeWidth="8" 
                     strokeDasharray={`${2 * Math.PI * 40}`} 
                     strokeDashoffset={`${2 * Math.PI * 40 * (1 - score/100)}`} 
                     strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                 </svg>
                 <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                   <span style={{ fontSize: 22, fontWeight: 900, color: scoreColor, fontFamily: 'Manrope,sans-serif', lineHeight: 1 }}>{score}</span>
                   <span style={{ fontSize: 9, color: 'var(--outline)', fontWeight: 700 }}>SCORE</span>
                 </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--on-surface)', fontFamily: 'Manrope,sans-serif' }}>Campaign Integrity: {scoreLabel}</div>
                  <span className={`badge ${score >= 70 ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: 10 }}>{score >= 70 ? 'Optimal' : 'Needs Tuning'}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--on-surface-v)', lineHeight: 1.5, fontWeight: 500 }}>
                  Current metrics show {score >= 70 ? 'strong' : 'marginal'} performance across critical KPIs. {score < 70 ? 'Immediate optimization recommended for CPC and Frequency.' : 'Maintaining steady-state with minimal drift.'}
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
             {[
               { l: 'CTR Efficiency', v: `${metrics.ctr}%`, s: metrics.ctr >= 1.5 ? 'up' : 'down', d: '+0.2%' },
               { l: 'ROAS Impact', v: `${metrics.roas}x`, s: metrics.roas >= 2.5 ? 'up' : 'down', d: '+12%' },
               { l: 'Avg CPC', v: `₹${metrics.cpc}`, s: metrics.cpc <= 45 ? 'up' : 'down', d: '-₹4' },
             ].map((s, i) => (
               <div key={i} className="card" style={{ padding: 16 }}>
                 <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', marginBottom: 8 }}>{s.l}</div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--on-surface)', fontFamily: 'Manrope,sans-serif' }}>{s.v}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: s.s === 'up' ? '#16a34a' : 'var(--error)', display: 'flex', alignItems: 'center', gap: 2 }}>
                       <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{s.s === 'up' ? 'trending_up' : 'trending_down'}</span> {s.d}
                    </div>
                 </div>
               </div>
             ))}
          </div>

          {/* Impact list */}
          <div className="card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="card-header" style={{ padding: '10px 16px' }}>
              <span className="card-title">Diagnostic Audit Stream</span>
            </div>
            <div className="card-body" style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {issues.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--outline)' }}>No diagnostic issues detected in latest report.</div>
              ) : (
                issues.map(issue => (
                  <div key={issue.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px', background: 'var(--surface-low)', borderRadius: 12, border: '1px solid rgba(192,199,211,0.1)' }}>
                     <div style={{ width: 32, height: 32, borderRadius: 8, background: issue.severity === 'high' ? 'var(--error-c)' : '#ffeee2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ color: issue.severity === 'high' ? 'var(--error)' : 'var(--orange)', fontSize: 18 }}>{issue.severity === 'high' ? 'warning' : 'info'}</span>
                     </div>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--on-surface)', fontFamily: 'Manrope,sans-serif' }}>{issue.type.replace(/_/g,' ')}</div>
                        <div style={{ fontSize: 11, color: 'var(--on-surface-v)', marginTop: 2, lineHeight: 1.4, fontWeight: 500 }}>{issue.evidence}</div>
                     </div>
                     <span className="chip-ai" style={{ fontSize: 9 }}>{issue.confidence}% conf.</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar report area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
           <div className="card">
             <div className="card-header"><span className="card-title">Optimization Log</span></div>
             <div className="card-body" style={{ padding: 16 }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                 <div style={{ background: 'var(--surface-low)', padding: 12, borderRadius: 10, textAlign: 'center' }}>
                   <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--primary)', fontFamily: 'Manrope,sans-serif' }}>{deployed}</div>
                   <div style={{ fontSize: 8, fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase', marginTop: 2 }}>Deployed</div>
                 </div>
                 <div style={{ background: 'var(--surface-low)', padding: 12, borderRadius: 10, textAlign: 'center' }}>
                   <div style={{ fontSize: 20, fontWeight: 900, color: '#16a34a', fontFamily: 'Manrope,sans-serif' }}>{winRate}%</div>
                   <div style={{ fontSize: 8, fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase', marginTop: 2 }}>Win Rate</div>
                 </div>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                 {['Creative', 'Audience', 'Bidding'].map(type => {
                   const count = log.filter(l => l.fixType === type).length
                   const wins = log.filter(l => l.fixType === type && l.result === 'up').length
                   const pct = count > 0 ? Math.round(wins/count*100) : 0
                   return (
                     <div key={type} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700 }}>
                          <span style={{ color: 'var(--on-surface-v)' }}>{type} Fixes</span>
                          <span style={{ color: 'var(--outline)' }}>{wins}/{count} wins</span>
                       </div>
                       <div className="progress-bar" style={{ height: 3 }}><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                     </div>
                   )
                 })}
               </div>
             </div>
           </div>

           <div className="card" style={{ flex: 1, minHeight: 0 }}>
             <div className="card-header"><span className="card-title">Insight Feed</span></div>
             <div className="card-body" style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {log.slice(0, 5).map((l, i) => (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(192,199,211,0.1)', background: 'var(--surface-white)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>{l.platform}</span>
                      <span style={{ fontSize: 9, color: 'var(--outline)' }}>{l.timestamp}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--on-surface)', fontWeight: 600, lineHeight: 1.3 }}>{l.description}</div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
