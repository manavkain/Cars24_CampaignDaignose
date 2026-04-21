'use client'
import { useApp } from '../AppContext'

export default function DiagnosisFeed({ onViewFix }) {
  const { diagnosis, pipelineStep } = useApp()
  const issues = diagnosis?.issues || []

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="dot dot-red" style={{ animation: pipelineStep === 'diagnose' ? 'pulsedot 1s infinite' : 'none' }} />
          <span className="card-title">Diagnostic Stream</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="badge badge-red" style={{ fontSize: 9 }}>{issues.filter(i => i.severity === 'high').length} critical</span>
          <span className="badge badge-amber" style={{ fontSize: 9 }}>{issues.filter(i => i.severity === 'medium').length} watch</span>
        </div>
      </div>
      
      <div className="card-body" style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', position: 'relative' }}>
        {/* The Timeline Line */}
        <div style={{ position: 'absolute', left: 28, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, transparent, rgba(192,199,211,0.2) 20px, rgba(192,199,211,0.2) 90%, transparent)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', zIndex: 1 }}>
          {/* AI Status Message */}
          <div style={{ 
            background: 'var(--primary-fixed)', 
            borderRadius: 16, 
            padding: '14px 18px', 
            marginLeft: 40,
            border: '1px solid rgba(0,88,148,0.05)',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', left: -22, top: 12, width: 14, height: 14, background: 'var(--primary-fixed)', transform: 'rotate(45deg)', borderLeft: '1px solid rgba(0,88,148,0.05)', borderBottom: '1px solid rgba(0,88,148,0.05)' }} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
               <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
               <div style={{ fontSize: 13, color: 'var(--on-surface-v)', fontWeight: 600, lineHeight: 1.4 }}>
                 {diagnosis?.summary || "Initializing telemetry sync... System ready for diagnosis."}
               </div>
            </div>
          </div>

          {issues.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--outline)', marginLeft: 40 }}>
              No active anomalies detected in current feed.
            </div>
          ) : (
            issues.map((issue, idx) => (
              <div key={issue.id} style={{ display: 'flex', gap: 16 }}>
                {/* Severity Pip */}
                <div style={{ 
                  width: 24, height: 24, borderRadius: '50%', 
                  background: 'var(--surface-white)', 
                  border: `1.5px solid ${issue.severity === 'high' ? 'var(--error)' : 'var(--orange)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, zIndex: 2, marginTop: 4,
                  boxShadow: `0 0 12px ${issue.severity === 'high' ? 'var(--error-c)' : 'var(--orange)'}20`
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: issue.severity === 'high' ? 'var(--error)' : 'var(--orange)', fontVariationSettings: "'FILL' 1" }}>
                    {issue.severity === 'high' ? 'warning' : 'trending_down'}
                  </span>
                </div>
                
                {/* Issue Card */}
                <div className="animate-slide-up" style={{ 
                  flex: 1, 
                  background: 'var(--surface-white)', 
                  border: '1px solid rgba(192,199,211,0.15)', 
                  borderRadius: 12, 
                  padding: 16,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  transition: 'transform .2s, box-shadow .2s',
                  cursor: 'pointer'
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)' }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)' }}
                onClick={() => onViewFix(issue.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                       <span className={`badge ${issue.severity === 'high' ? 'badge-red' : 'badge-amber'}`} style={{ textTransform: 'uppercase', fontSize: 9 }}>{issue.severity === 'high' ? 'Critical' : 'Warning'}</span>
                       <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--on-surface)', fontFamily: 'Manrope,sans-serif' }}>{issue.type.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="chip-ai" style={{ fontSize: 10 }}>{issue.confidence}% conf.</span>
                  </div>
                  
                  <div style={{ fontSize: 13, color: 'var(--on-surface-v)', lineHeight: 1.5, marginBottom: 14 }}>
                    {issue.evidence}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(192,199,211,0.1)', paddingTop: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--outline)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>AI Confidence</div>
                      <div className="progress-bar" style={{ width: 120 }}><div className="progress-fill" style={{ width: `${issue.confidence}%` }} /></div>
                    </div>
                    <button className="btn btn-orange btn-xs" style={{ padding: '6px 10px' }}>
                      Apply Fix <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
