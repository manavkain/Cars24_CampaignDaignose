'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'

const TYPE_LABELS = { creative_fatigue:'Creative Fatigue', audience_saturation:'Audience Saturation', bid_floor:'Bid Floor', budget_pacing:'Budget Pacing', landing_page:'Landing Page' }
const TABS = ['Creative','Audience','Bidding','Budget']

export default function FixGenerator({ selectedId }) {
  const { diagnosis, addLogEntry, metrics, setPipelineStep } = useApp()
  const [activeIssue, setActiveIssue] = useState(selectedId || '1')
  const [tab, setTab] = useState('Creative')
  const [toast, setToast] = useState('')

  const issues = diagnosis?.issues || []
  const fixes = diagnosis?.fixes || {}
  const issue = issues.find(i => i.id === activeIssue) || issues[0]

  function deploy(variant) {
    addLogEntry({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      issue: TYPE_LABELS[issue?.type] || issue?.type || 'Unknown',
      fixType: tab,
      fixSummary: `${tab}: ${variant.label || ''} — ${(variant.headline || variant.recommendation || variant.brief || '').slice(0, 60)}`,
      before: `CTR ${metrics.ctr}% / CPL ₹${metrics.cpl}`,
      after: '', result: 'pending', notes: '',
    })
    setToast('✓ Deployed & logged')
    setTimeout(() => setToast(''), 2500)
    setPipelineStep('track')
  }

  function copy(text) {
    navigator.clipboard.writeText(text)
    setToast('✓ Copied to clipboard')
    setTimeout(() => setToast(''), 1500)
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-header">
        <span className="card-title">Fix Generator</span>
        {toast && <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 500 }}>{toast}</span>}
      </div>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Issue sidebar */}
        <div style={{ width: 148, flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--bg-2)', padding: 8, overflow: 'auto' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.07em', padding: '2px 6px 8px' }}>Issues</div>
          {issues.map(iss => {
            const isAct = iss.id === activeIssue
            const dot = iss.severity === 'high' ? 'var(--red)' : iss.severity === 'medium' ? 'var(--amber)' : 'var(--green)'
            return (
              <div key={iss.id} onClick={() => setActiveIssue(iss.id)}
                style={{ padding: '7px 8px', borderRadius: 7, cursor: 'pointer', marginBottom: 3, background: isAct ? 'var(--bg)' : 'transparent', border: `1px solid ${isAct ? 'var(--blue-mid)' : 'transparent'}`, transition: 'all .15s', boxShadow: isAct ? 'var(--shadow)' : 'none' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <span className="dot" style={{ background: dot, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: isAct ? 'var(--blue)' : 'var(--t2)', fontWeight: isAct ? 600 : 400, lineHeight: 1.3 }}>{TYPE_LABELS[iss.type] || iss.type}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Fix panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg)', paddingLeft: 4 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '8px 12px', border: 'none', background: 'transparent',
                color: tab === t ? 'var(--blue)' : 'var(--t3)', fontSize: 12, fontWeight: tab === t ? 600 : 400,
                cursor: 'pointer', borderBottom: `2px solid ${tab === t ? 'var(--blue)' : 'transparent'}`, transition: 'all .15s', fontFamily: 'inherit',
              }}>{t}</button>
            ))}
          </div>

          <div className="card-body" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tab === 'Creative' && (fixes.creative || []).map((v, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--border)', padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="badge badge-blue">{v.label}</span>
                  <span style={{ fontSize: 10, color: 'var(--t3)' }}>Variant {String.fromCharCode(65+i)}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 5 }}>{v.headline}</div>
                <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.55, marginBottom: 9 }}>{v.body}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-ghost btn-xs" onClick={() => copy(`${v.headline}\n\n${v.body}`)}>⎘ Copy</button>
                  <button className="btn btn-primary btn-xs" onClick={() => deploy(v)}>↗ Deploy</button>
                </div>
              </div>
            ))}

            {tab === 'Audience' && fixes.audience && (
              [{ label: 'Target Brief', val: fixes.audience.brief }, { label: 'Exclusions', val: fixes.audience.exclusions }, { label: 'Lookalike Seed', val: fixes.audience.lookalike_seed }].map(item => (
                <div key={item.label} style={{ background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--border)', padding: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.55, marginBottom: 8 }}>{item.val}</div>
                  <button className="btn btn-primary btn-xs" onClick={() => deploy({ label: item.label, brief: item.val })}>↗ Deploy</button>
                </div>
              ))
            )}

            {tab === 'Bidding' && fixes.bidding && (
              <div>
                <div style={{ background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--border)', padding: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span className="badge badge-orange">+{fixes.bidding.delta_pct}% tCPA</span>
                    <span className={`badge ${fixes.bidding.risk === 'low' ? 'badge-green' : fixes.bidding.risk === 'medium' ? 'badge-amber' : 'badge-red'}`}>{fixes.bidding.risk} risk</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.6 }}>{fixes.bidding.recommendation}</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => deploy(fixes.bidding)}>↗ Mark Deployed</button>
              </div>
            )}

            {tab === 'Budget' && fixes.budget && (
              <div>
                <div style={{ background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--border)', padding: 12, marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.6 }}>{fixes.budget.reallocation_map}</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => deploy(fixes.budget)}>↗ Mark Deployed</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
