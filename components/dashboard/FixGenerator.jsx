'use client'
import { useState, useEffect } from 'react'
import { useApp } from '../AppContext'

export default function FixGenerator({ selectedId }) {
  const { diagnosis, metrics, addLogEntry, settings } = useApp()
  const [activeTab, setActiveTab] = useState('Creative')
  const [localSelected, setLocalSelected] = useState(null)
  const [approvingId, setApprovingId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [deployedIds, setDeployedIds] = useState([])

  const issues = diagnosis?.issues || []
  const fixes = diagnosis?.fixes || {}

  useEffect(() => {
    if (selectedId) setLocalSelected(selectedId)
    else if (issues.length > 0 && !localSelected) setLocalSelected(issues[0].id)
  }, [selectedId, issues])

  const currentIssue = issues.find(i => i.id === localSelected) || issues[0]

  // Build variants from real Gemini output
  const tabVariants = {
    Creative: (fixes.creative || []).map((v, i) => ({
      id: String(i + 1),
      confidence: 92 - i * 10,
      title: `Variant ${String.fromCharCode(65 + i)}`,
      headline: v.headline || v.label,
      body: v.body,
    })),
    Audience: fixes.audience ? [{
      id: '1',
      confidence: 85,
      title: 'Audience Brief',
      headline: fixes.audience.brief || 'Audience recommendation',
      body: `Lookalike seed: ${fixes.audience.lookalike_seed || '—'} | Exclusions: ${fixes.audience.exclusions || '—'}`,
    }] : [],
    Bidding: fixes.bidding ? [{
      id: '1',
      confidence: fixes.bidding.risk === 'low' ? 90 : fixes.bidding.risk === 'medium' ? 72 : 55,
      title: 'Bid Strategy',
      headline: fixes.bidding.recommendation || 'Bidding recommendation',
      body: `Adjust by ${fixes.bidding.delta_pct > 0 ? '+' : ''}${fixes.bidding.delta_pct}% | Risk: ${fixes.bidding.risk}`,
    }] : [],
    Budget: fixes.budget ? [{
      id: '1',
      confidence: 80,
      title: 'Budget Reallocation',
      headline: 'Reallocation Map',
      body: fixes.budget.reallocation_map || 'No reallocation data',
    }] : [],
  }

  async function approve(v) {
    if (deployedIds.includes(activeTab + v.id)) return
    setApprovingId(activeTab + v.id)
    try {
      const entry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleTimeString(),
        campaign: metrics?.campaign || 'Unknown Campaign',
        platform: metrics?.platform || 'Meta',
        fixType: activeTab,
        issue: currentIssue?.type?.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') || activeTab,
        fixSummary: `${v.title}: ${v.headline}`,
        before: `CTR ${metrics?.ctr}% | CPC ₹${metrics?.cpc}`,
        after: '',
        result: 'deployed',
        notes: 'Auto-deployed via Approve button'
      }

      await addLogEntry(entry, { triggerAlert: true })

      // Fire webhook
      if (settings?.webhookUrl) {
        await fetch('/api/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webhookUrl: settings.webhookUrl,
            payload: {
              type: 'diagnosis',
              campaign: entry.campaign,
              platform: entry.platform,
              issue: entry.issue,
              fix: entry.fixSummary,
              severity: currentIssue?.severity || 'medium',
              timestamp: new Date().toISOString()
            }
          })
        })
      }

      setDeployedIds(prev => [...prev, activeTab + v.id])
    } catch (e) {
      alert(`Approval failed: ${e.message}`)
    } finally {
      setApprovingId(null)
    }
  }

  function handleCopy(v) {
    navigator.clipboard.writeText(`${v.headline}\n${v.body}`)
    setCopiedId(activeTab + v.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!currentIssue) return (
    <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--outline)' }}>
      Run diagnosis first to generate fixes.
    </div>
  )

  const variants = tabVariants[activeTab] || []

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="card-header" style={{ padding: '10px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>build_circle</span>
          <span className="card-title" style={{ fontSize: 10 }}>Fix Generator</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--outline)' }}>{metrics?.campaign || '—'}</span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Issues Sidebar */}
        <div style={{ width: 120, background: 'var(--surface-low)', borderRight: '1px solid rgba(192,199,211,0.1)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '10px 14px', fontSize: 9, fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Anomalies</div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {issues.map(issue => (
              <button key={issue.id}
                onClick={() => setLocalSelected(issue.id)}
                style={{
                  padding: '10px 14px', textAlign: 'left',
                  background: localSelected === issue.id ? 'var(--surface-white)' : 'transparent',
                  border: 'none',
                  borderLeft: `4px solid ${localSelected === issue.id ? (issue.severity === 'high' ? 'var(--error)' : 'var(--orange)') : 'transparent'}`,
                  cursor: 'pointer', transition: 'all .2s',
                }}>
                <div style={{ fontSize: 12, fontWeight: localSelected === issue.id ? 700 : 500, color: localSelected === issue.id ? 'var(--on-surface)' : 'var(--on-surface-v)', lineHeight: 1.2 }}>
                  {issue.type.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                </div>
                <div style={{ fontSize: 9, color: 'var(--outline)', marginTop: 2 }}>{issue.severity === 'high' ? 'Critical' : 'Moderate'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--surface-white)' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(192,199,211,0.1)', padding: '0 8px', flexShrink: 0 }}>
            {['Creative', 'Audience', 'Bidding', 'Budget'].map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 10px', fontSize: 11,
                  fontWeight: activeTab === tab ? 700 : 600,
                  color: activeTab === tab ? 'var(--primary-c)' : 'var(--outline)',
                  border: 'none', background: 'transparent',
                  borderBottom: `2px solid ${activeTab === tab ? 'var(--primary-c)' : 'transparent'}`,
                  cursor: 'pointer', transition: 'all .2s',
                  display: 'flex', alignItems: 'center', gap: 4
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  {tab === 'Creative' ? 'edit' : tab === 'Audience' ? 'groups' : tab === 'Bidding' ? 'payments' : 'account_balance_wallet'}
                </span>
                {tab}
              </button>
            ))}
          </div>

          {/* Variants */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {variants.length === 0 ? (
              <div style={{ color: 'var(--outline)', fontSize: 12, padding: 20, textAlign: 'center' }}>No {activeTab} fixes generated.</div>
            ) : variants.map(v => {
              const key = activeTab + v.id
              const isDeployed = deployedIds.includes(key)
              const isApproving = approvingId === key
              return (
                <div key={v.id} style={{
                  background: 'var(--surface-low)', borderRadius: 14, padding: 16,
                  border: `1px solid ${isDeployed ? 'rgba(22,163,74,0.2)' : 'rgba(192,199,211,0.1)'}`,
                  display: 'flex', flexDirection: 'column', gap: 10
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-fixed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>
                        {v.id}
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>{v.title}</span>
                    </div>
                    <div style={{ background: 'var(--surface-white)', padding: '4px 10px', borderRadius: 99, border: '1px solid rgba(0,88,148,0.1)', textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--primary)', fontFamily: 'Manrope,sans-serif', lineHeight: 1 }}>{v.confidence}%</div>
                      <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase' }}>Conf.</div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 2 }}>{v.headline}</div>
                    <div style={{ fontSize: 12, color: 'var(--on-surface-v)', lineHeight: 1.4, fontWeight: 500 }}>{v.body}</div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-xs" style={{ flex: 1 }} onClick={() => handleCopy(v)}>
                      {copiedId === key ? '✓ Copied' : 'Copy'}
                    </button>
                    <button
                      className={`btn ${isDeployed ? 'btn-ghost' : 'btn-primary'} btn-xs`}
                      style={{
                        flex: 1.5,
                        background: isDeployed ? 'rgba(22,163,74,0.1)' : undefined,
                        color: isDeployed ? '#16a34a' : undefined,
                        borderColor: isDeployed ? 'rgba(22,163,74,0.2)' : undefined,
                      }}
                      onClick={() => approve(v)}
                      disabled={isApproving || isDeployed}
                    >
                      {isApproving ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span className="animate-spin" style={{ fontSize: 12 }}>◌</span> Deploying...
                        </span>
                      ) : isDeployed ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span> Deployed
                        </span>
                      ) : 'Approve & Deploy'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
