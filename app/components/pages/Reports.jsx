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
  const scoreColor = score >= 70 ? 'var(--green)' : score >= 40 ? 'var(--amber)' : 'var(--red)'
  const scoreLabel = score >= 70 ? 'Healthy' : score >= 40 ? 'At Risk' : 'Critical'

  return (
    <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', margin: 0 }}>Reports</h2>
        <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>Campaign health overview and fix performance summary.</p>
      </div>

      {/* Health score */}
      <div className="card">
        <div className="card-header"><span className="card-title">Campaign Health Score</span><span style={{ fontSize: 11, color: 'var(--t3)' }}>{metrics.campaign} · {metrics.platform}</span></div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 18 }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', border: `5px solid ${scoreColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `${scoreColor}12`, flexShrink: 0 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 10, color: 'var(--t3)' }}>/ 100</span>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: scoreColor, marginBottom: 3 }}>{scoreLabel}</div>
              <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>{diagnosis?.summary || 'Run a diagnosis to get AI analysis.'}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
            {[
              { l: 'CTR', v: `${metrics.ctr}%`, ok: metrics.ctr >= 2 },
              { l: 'CPC', v: `₹${metrics.cpc}`, ok: metrics.cpc <= 30 },
              { l: 'ROAS', v: `${metrics.roas}x`, ok: metrics.roas >= 3 },
              { l: 'Freq', v: metrics.frequency, ok: metrics.frequency <= 3 },
              { l: 'CPL', v: `₹${metrics.cpl}`, ok: metrics.cpl <= 250 },
            ].map(m => (
              <div key={m.l} style={{ background: m.ok ? 'var(--green-bg)' : 'var(--amber-bg)', border: `1px solid ${m.ok ? 'var(--green-bd)' : 'var(--amber-bd)'}`, borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: m.ok ? 'var(--green)' : 'var(--amber)' }}>{m.v}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active issues */}
      {issues.length > 0 && (
        <div className="card">
          <div className="card-header"><span className="card-title">Active Issues</span><span className="badge badge-red">{issues.length}</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {issues.map(issue => (
              <div key={issue.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 11px', background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <span className={`badge ${issue.severity === 'high' ? 'badge-red' : issue.severity === 'medium' ? 'badge-amber' : 'badge-green'}`}>{issue.severity}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--t1)' }}>{issue.type.replace(/_/g,' ')}</div>
                  <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>{issue.evidence}</div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--t3)', whiteSpace: 'nowrap' }}>{issue.confidence}% conf.</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fix performance */}
      <div className="card">
        <div className="card-header"><span className="card-title">Fix Performance</span></div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
            {[{ l:'Total Deployed', v:deployed }, { l:'Positive Result', v:positive, c:'var(--green)' }, { l:'Win Rate', v:`${winRate}%`, c:winRate>=60?'var(--green)':'var(--amber)' }, { l:'Pending Review', v:log.filter(l=>l.result==='pending').length, c:'var(--amber)' }].map(s => (
              <div key={s.l} style={{ background:'var(--bg-2)', borderRadius:8, padding:12, textAlign:'center', border:'1px solid var(--border)' }}>
                <div style={{ fontSize:22, fontWeight:700, color:s.c||'var(--t1)' }}>{s.v}</div>
                <div style={{ fontSize:10, color:'var(--t3)', marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
          {['Creative','Audience','Bidding','Budget'].map(type => {
            const count = log.filter(l => l.fixType === type).length
            const wins = log.filter(l => l.fixType === type && l.result === 'up').length
            const pct = count > 0 ? Math.round(wins/count*100) : 0
            return (
              <div key={type} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                <span style={{ width:68, fontSize:12, color:'var(--t2)', fontWeight:500 }}>{type}</span>
                <div style={{ flex:1 }}>
                  <div className="progress-bar"><div className="progress-fill" style={{ width:`${pct}%` }} /></div>
                </div>
                <span style={{ fontSize:11, color:'var(--t3)', width:70, textAlign:'right' }}>{count>0?`${wins}/${count} (${pct}%)`:'No data'}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
