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
  const scoreBg = score >= 70 ? '#d4edda' : score >= 40 ? '#ffeee2' : 'var(--error-c)'
  const scoreLabel = score >= 70 ? 'Healthy' : score >= 40 ? 'At Risk' : 'Critical'

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
      <div style={{ flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'Manrope,sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--on-surface)', margin: 0, letterSpacing: '-0.02em' }}>Performance Analytics</h2>
        <p style={{ fontSize: 14, color: 'var(--on-surface-v)', marginTop: 4 }}>In-depth campaign health audit and optimization tracking.</p>
      </div>

      {/* Health score section - Compact Stitch Style */}
      <div className="card" style={{ flexShrink: 0 }}>
        <div className="card-header" style={{ padding: '10px 16px' }}>
          <span className="card-title">Campaign Health Index</span>
          <span style={{ fontSize: 10, color: 'var(--outline)', fontWeight: 600 }}>{metrics.campaign} • {metrics.platform}</span>
        </div>
        <div className="card-body" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', background: 'var(--surface-low)', padding: 16, borderRadius: 12 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', border: `5px solid ${scoreColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-white)', flexShrink: 0, boxShadow: `0 0 16px ${scoreColor}15` }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: scoreColor, lineHeight: 1, fontFamily: 'Manrope,sans-serif' }}>{score}</span>
              <span style={{ fontSize: 9, color: 'var(--outline)', fontWeight: 700 }}>/ 100</span>
            </div>
            <div style={{flex: 1}}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom: 4 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: scoreColor, fontFamily: 'Manrope,sans-serif' }}>{scoreLabel}</div>
                <span className={`badge`} style={{background: scoreBg, color: scoreColor, fontSize: 10, padding: '2px 8px'}}>{score >= 70 ? 'Optimal' : 'Needs Work'}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--on-surface-v)', lineHeight: 1.5, fontWeight: 500 }}>
                {diagnosis?.summary || 'No diagnostic data available. Run a diagnosis to generate a health score analysis.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, flex: 1, minHeight: 0}}>
        {/* Active issues */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ padding: '10px 16px' }}>
            <span className="card-title">Critical Anomalies</span>
            {issues.length > 0 && <span className="badge badge-red" style={{fontSize: 9, padding: '1px 6px'}}>{issues.length}</span>}
          </div>
          <div className="card-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
            {issues.length === 0 ? (
              <div style={{padding: '20px', textAlign: 'center', color: 'var(--outline)', fontSize: 13}}>No critical issues detected.</div>
            ) : (
              issues.map(issue => (
                <div key={issue.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--surface-low)', borderRadius: 10, border: '1px solid rgba(192,199,211,0.1)' }}>
                   <span className="material-symbols-outlined" style={{color: issue.severity === 'high' ? 'var(--error)' : 'var(--orange)', fontSize: 18}}>
                    {issue.severity === 'high' ? 'warning' : 'info'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', fontFamily: 'Manrope,sans-serif' }}>{issue.type.replace(/_/g,' ')}</div>
                    <div style={{ fontSize: 11, color: 'var(--on-surface-v)', marginTop: 2, lineHeight: 1.4 }}>{issue.evidence}</div>
                  </div>
                  <span className="chip-ai" style={{fontSize: 9}}>{issue.confidence}%</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fix performance summary */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ padding: '10px 16px' }}>
            <span className="card-title">Optimization Impact</span>
          </div>
          <div className="card-body" style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[{ l:'Total Deployed', v:deployed }, { l:'Win Rate', v:`${winRate}%`, c:winRate>=60?'#16a34a':'var(--orange)' }].map(s => (
                <div key={s.l} style={{ background:'var(--surface-low)', borderRadius:10, padding:12, textAlign:'center' }}>
                  <div style={{ fontSize:20, fontWeight:800, color:s.c||'var(--on-surface)', fontFamily: 'Manrope,sans-serif' }}>{s.v}</div>
                  <div style={{ fontSize:9, color:'var(--outline)', marginTop:2, fontWeight: 700, textTransform: 'uppercase' }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              {['Creative','Audience','Bidding','Budget'].map(type => {
                const count = log.filter(l => l.fixType === type).length
                const wins = log.filter(l => l.fixType === type && l.result === 'up').length
                const pct = count > 0 ? Math.round(wins/count*100) : 0
                return (
                  <div key={type} style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ width:60, fontSize:11, color:'var(--on-surface-v)', fontWeight:600 }}>{type}</span>
                    <div style={{ flex:1 }}>
                      <div className="progress-bar" style={{height: 3}}><div className="progress-fill" style={{ width:`${pct}%` }} /></div>
                    </div>
                    <span style={{ fontSize:10, color:'var(--outline)', width:70, textAlign:'right', fontWeight: 600 }}>{count>0?`${wins}/${count}`:'—'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
