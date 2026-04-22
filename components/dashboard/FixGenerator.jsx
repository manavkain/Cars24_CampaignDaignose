'use client'
import { useState, useEffect } from 'react'
import { useApp } from '../AppContext'

const TAB_VARIANTS = {
  Creative: [
    { id: 'A', confidence: 92, title: 'Variant A', headline: 'Last chance: Book your Cars24 car', body: 'India\'s most trusted marketplace. Certified cars, instant delivery.' },
    { id: 'B', confidence: 82, title: 'Variant B', headline: '50,000+ happy Cars24 buyers', body: 'Join India\'s largest community. Test drive today, home tomorrow.' },
    { id: 'C', confidence: 72, title: 'Variant C', headline: 'Get ₹25,000 more for your car', body: 'Best-in-class exchange value. Switch to your dream car this week.' },
  ],
  Audience: [
    { id: 'A', confidence: 88, title: 'Audience A', headline: 'Lookalike 1% (Purchasers)', body: 'Targeting users similar to your top 1% lifetime value customers.' },
    { id: 'B', confidence: 75, title: 'Audience B', headline: 'Retargeting (30D Visitors)', body: 'Re-engage users who browsed but didn\'t book a test drive.' },
  ],
  Bidding: [
    { id: 'A', confidence: 95, title: 'Bid Strategy A', headline: 'tCPA: ₹450 (Recommended)', body: 'Optimal balance for current inventory competition in the used car sector.' },
    { id: 'B', confidence: 68, title: 'Bid Strategy B', headline: 'Maximize Conversions', body: 'Aggressive budget capture for fast learning phase completion.' },
  ]
}

export default function FixGenerator({ selectedId }) {
  const { diagnosis, addLogEntry, setPipelineStep, exportToAirtable, log } = useApp()
  const [activeTab, setActiveTab] = useState('Creative')
  const [localSelected, setLocalSelected] = useState(null)
  const [approvingId, setApprovingId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  
  const issues = diagnosis?.issues || []
  
  useEffect(() => {
    if (selectedId) setLocalSelected(selectedId)
    else if (issues.length > 0 && !localSelected) setLocalSelected(issues[0].id)
  }, [selectedId, issues])

  const currentIssue = issues.find(i => i.id === localSelected) || issues[0]

  async function approve(v) {
    setApprovingId(v.id)
    try {
      const entry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleTimeString(),
        campaign: 'Cars24 - New Cars Q2',
        platform: 'Meta',
        fixType: activeTab,
        issue: currentIssue?.type.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
        fixSummary: `Approved ${v.title}: ${v.headline}`,
        before: '—',
        after: '',
        result: 'deployed',
        notes: 'Auto-deployed via Approval'
      }
      
      await addLogEntry(entry)
    } catch (e) {
      alert(`Approval failed: ${e.message}`)
    } finally {
      setApprovingId(null)
    }
  }

  function handleCopy(v) {
    navigator.clipboard.writeText(`${v.headline}\n${v.body}`)
    setCopiedId(v.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!currentIssue) return <div className="card" style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--outline)'}}>No active diagnosis to generate fixes.</div>

  const variants = TAB_VARIANTS[activeTab] || []

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="card-header" style={{ padding: '10px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>build_circle</span>
          <span className="card-title" style={{ fontSize: 10 }}>Fix Generator</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Issues Sidebar - Compact */}
        <div style={{ 
          width: 120, 
          background: 'var(--surface-low)', 
          borderRight: '1px solid rgba(192,199,211,0.1)', 
          display: 'flex', 
          flexDirection: 'column',
          flexShrink: 0
        }}>
          <div style={{ padding: '10px 14px', fontSize: 9, fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Anomalies</div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {issues.map(issue => (
              <button key={issue.id} 
                onClick={() => setLocalSelected(issue.id)}
                style={{
                  padding: '10px 14px',
                  textAlign: 'left',
                  background: localSelected === issue.id ? 'var(--surface-white)' : 'transparent',
                  border: 'none',
                  borderLeft: `4px solid ${localSelected === issue.id ? (issue.severity === 'high' ? 'var(--error)' : 'var(--orange)') : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all .2s',
                  position: 'relative'
                }}>
                <div style={{ fontSize: 12, fontWeight: localSelected === issue.id ? 700 : 500, color: localSelected === issue.id ? 'var(--on-surface)' : 'var(--on-surface-v)', lineHeight: 1.2 }}>
                  {issue.type.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                </div>
                <div style={{ fontSize: 9, color: 'var(--outline)', marginTop: 2 }}>{issue.severity === 'high' ? 'Critical' : 'Moderate'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--surface-white)' }}>
          {/* Tabs - Compact & Fitted */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(192,199,211,0.1)', padding: '0 8px', flexShrink: 0 }}>
            {['Creative', 'Audience', 'Bidding'].map(tab => (
              <button key={tab} 
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 10px',
                  fontSize: 11,
                  fontWeight: activeTab === tab ? 700 : 600,
                  color: activeTab === tab ? 'var(--primary-c)' : 'var(--outline)',
                  border: 'none',
                  background: 'transparent',
                  borderBottom: `2px solid ${activeTab === tab ? 'var(--primary-c)' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all .2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  {tab === 'Creative' ? 'edit' : tab === 'Audience' ? 'groups' : 'payments'}
                </span>
                {tab}
              </button>
            ))}
          </div>

          {/* Variants Grid - Fixed Padding & Spacing */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
             {variants.map(v => (
               <div key={v.id} className="variant-card animate-fade-in" style={{ 
                 background: 'var(--surface-low)', 
                 borderRadius: 14, 
                 padding: 16, 
                 border: '1px solid rgba(192,199,211,0.1)',
                 display: 'flex',
                 flexDirection: 'column',
                 gap: 10,
                 position: 'relative'
               }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                     <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-fixed)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: 'var(--primary)' }}>
                       <div>{v.id}</div>
                     </div>
                     <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                       <span className="material-symbols-outlined" style={{ fontSize: 12 }}>verified</span> Recommended
                     </span>
                   </div>
                   <div style={{ textAlign: 'right', background: 'var(--surface-white)', padding: '4px 10px', borderRadius: 99, border: '1px solid rgba(0,88,148,0.1)' }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--primary)', fontFamily: 'Manrope,sans-serif', lineHeight: 1 }}>{v.confidence}%</div>
                      <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', marginTop: 1 }}>Conf.</div>
                   </div>
                 </div>
                 
                 <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 2 }}>{v.headline}</div>
                    <div style={{ fontSize: 12, color: 'var(--on-surface-v)', lineHeight: 1.4, fontWeight: 500 }}>{v.body}</div>
                 </div>
                 
                 <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                    <button className="btn btn-ghost btn-xs" style={{ flex: 1, padding: '5px' }} onClick={() => handleCopy(v)}>
                      {copiedId === v.id ? '✓ Copied' : 'Copy'}
                    </button>
                    <button className="btn btn-primary btn-xs" style={{ flex: 1.5, padding: '5px' }} onClick={() => approve(v)} disabled={approvingId === v.id}>
                      {approvingId === v.id ? 'Approving...' : 'Approve'}
                    </button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  )
}
