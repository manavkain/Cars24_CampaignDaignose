'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'
import { mockDiagnosis } from '../../lib/mockData'

const TABS = ['Creative', 'Audience', 'Bidding', 'Budget']

const TYPE_LABELS = {
  creative_fatigue: 'Creative Fatigue',
  audience_saturation: 'Audience Saturation',
  bid_floor: 'Bid Floor',
  budget_pacing: 'Budget Pacing',
  landing_page: 'Landing Page',
}

function CopyVariant({ variant, index, onDeploy }) {
  const [copied, setCopied] = useState(false)
  function handleCopy(text) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 8, padding: 10, marginBottom: 6,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span className="badge badge-indigo">{variant.label}</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Variant {String.fromCharCode(65 + index)}</span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
        {variant.headline}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
        {variant.body}
      </div>
      <div style={{ display: 'flex', gap: 5 }}>
        <button className="btn btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }}
          onClick={() => handleCopy(`${variant.headline}\n\n${variant.body}`)}>
          {copied ? '✓ Copied' : '⎘ Copy'}
        </button>
        <button className="btn btn-primary" style={{ fontSize: 10, padding: '3px 8px' }}
          onClick={() => onDeploy(variant)}>
          ↗ Deploy
        </button>
      </div>
    </div>
  )
}

export default function FixGenerator({ selectedIssueId }) {
  const { diagnosis, addLogEntry, metrics } = useApp()
  const [activeTab, setActiveTab] = useState('Creative')
  const [activeIssueId, setActiveIssueId] = useState(selectedIssueId || '1')
  const [deployedMsg, setDeployedMsg] = useState('')

  const data = diagnosis || mockDiagnosis
  const issues = data.issues || []
  const fixes = data.fixes || {}
  const activeIssue = issues.find(i => i.id === activeIssueId) || issues[0]

  function handleDeploy(variant) {
    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      issue: TYPE_LABELS[activeIssue?.type] || activeIssue?.type,
      fixType: activeTab,
      fixSummary: `${activeTab}: ${variant.label || ''} — ${variant.headline || variant.recommendation || variant.brief || JSON.stringify(variant)}`.slice(0, 80),
      before: `CTR ${metrics.ctr}% / CPL ₹${metrics.cpl}`,
      after: '',
      result: 'pending',
      notes: '',
    }
    addLogEntry(entry)
    setDeployedMsg(`✓ Deployed & logged! Check Improvement Log.`)
    setTimeout(() => setDeployedMsg(''), 3000)
  }

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <span className="panel-title">Fix Generator</span>
        {deployedMsg && (
          <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 500 }}>{deployedMsg}</span>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Issue sidebar */}
        <div style={{
          width: 140, flexShrink: 0, borderRight: '1px solid var(--border)',
          padding: 8, overflow: 'auto', background: 'var(--bg-surface)',
        }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Issues</div>
          {issues.map(issue => {
            const isActive = issue.id === activeIssueId
            const color = issue.severity === 'high' ? 'var(--red)' : issue.severity === 'medium' ? 'var(--amber)' : 'var(--green)'
            return (
              <div
                key={issue.id}
                onClick={() => setActiveIssueId(issue.id)}
                style={{
                  padding: '7px 8px', borderRadius: 6, cursor: 'pointer', marginBottom: 3,
                  background: isActive ? 'var(--bg-elevated)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--border-strong)' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: isActive ? 500 : 400, lineHeight: 1.3 }}>
                    {TYPE_LABELS[issue.type] || issue.type}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Fix panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid var(--border)',
            padding: '0 10px', background: 'var(--bg-surface)',
          }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 10px', border: 'none', background: 'transparent',
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: 11, fontWeight: 500, cursor: 'pointer',
                  borderBottom: `2px solid ${activeTab === tab ? 'var(--accent)' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="panel-body" style={{ flex: 1, overflow: 'auto' }}>
            {activeTab === 'Creative' && (fixes.creative || []).map((v, i) => (
              <CopyVariant key={i} variant={v} index={i} onDeploy={handleDeploy} />
            ))}

            {activeTab === 'Audience' && fixes.audience && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Target Brief', value: fixes.audience.brief },
                  { label: 'Exclusions', value: fixes.audience.exclusions },
                  { label: 'Lookalike Seed', value: fixes.audience.lookalike_seed },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--bg-card)', borderRadius: 8, padding: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5 }}>{item.value}</div>
                    <button className="btn btn-secondary" style={{ fontSize: 10, padding: '3px 8px', marginTop: 7 }}
                      onClick={() => handleDeploy({ label: item.label, brief: item.value })}>
                      ↗ Deploy
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Bidding' && fixes.bidding && (
              <div>
                <div style={{ background: 'var(--bg-card)', borderRadius: 8, padding: 10, border: '1px solid var(--border)', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span className="badge badge-indigo">+{fixes.bidding.delta_pct}% tCPA</span>
                    <span className={`badge ${fixes.bidding.risk === 'low' ? 'badge-green' : fixes.bidding.risk === 'medium' ? 'badge-amber' : 'badge-red'}`}>
                      {fixes.bidding.risk} risk
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.6 }}>{fixes.bidding.recommendation}</div>
                </div>
                <button className="btn btn-primary" style={{ fontSize: 11 }} onClick={() => handleDeploy(fixes.bidding)}>
                  ↗ Mark as Deployed
                </button>
              </div>
            )}

            {activeTab === 'Budget' && fixes.budget && (
              <div>
                <div style={{ background: 'var(--bg-card)', borderRadius: 8, padding: 10, border: '1px solid var(--border)', marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.6 }}>{fixes.budget.reallocation_map}</div>
                </div>
                <button className="btn btn-primary" style={{ fontSize: 11 }} onClick={() => handleDeploy(fixes.budget)}>
                  ↗ Mark as Deployed
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
