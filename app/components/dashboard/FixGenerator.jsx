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
  const { diagnosis, addLogEntry, setPipelineStep } = useApp()
  const [activeTab, setActiveTab] = useState('Creative')
  const [localSelected, setLocalSelected] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  
  const issues = diagnosis?.issues || []
  
  useEffect(() => {
    if (selectedId) setLocalSelected(selectedId)
    else if (issues.length > 0 && !localSelected) setLocalSelected(issues[0].id)
  }, [selectedId, issues])

  const currentIssue = issues.find(i => i.id === localSelected) || issues[0]

  function deploy(variant) {
    addLogEntry({
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      campaign: 'Cars24 - New Cars Q2',
      platform: 'Meta',
      fixType: activeTab,
      description: `Deployed ${variant}: ${currentIssue?.type}`,
      result: 'pending'
    })
    setPipelineStep('track')
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
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>build_circle</span>
          <span className="card-title">Fix Generator</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Issues Sidebar */}
        <div style={{ 
          width: 140, 
          background: 'var(--surface-low)', 
          borderRight: '1px solid rgba(192,199,211,0.1)', 
          display: 'flex', 
          flexDirection: 'column',
          flexShrink: 0
        }}>
          <div style={{ padding: '12px 16px', fontSize: 10, fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Issues</div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {issues.map(issue => (
              <button key={issue.id} 
                onClick={() => setLocalSelected(issue.id)}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  background: localSelected === issue.id ? 'var(--surface-white)' : 'transparent',
                  border: 'none',
                  borderLeft: `5px solid ${localSelected === issue.id ? (issue.severity === 'high' ? 'var(--error)' : 'var(--orange)') : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all .2s',
                  position: 'relative',
                  zIndex: localSelected === issue.id ? 2 : 1
                }}>
                <div style={{ fontSize: 13, fontWeight: localSelected === issue.id ? 700 : 500, color: localSelected === issue.id ? 'var(--on-surface)' : 'var(--on-surface-v)', lineHeight: 1.3 }}>
                  {issue.type.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                </div>
                <div style={{ fontSize: 10, color: 'var(--outline)', marginTop: 4 }}>{issue.severity === 'high' ? 'Critical Impact' : 'Moderate Impact'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--surface-white)' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(192,199,211,0.1)', padding: '0 16px', flexShrink: 0 }}>
            {['Creative', 'Audience', 'Bidding'].map(tab => (
              <button key={tab} 
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '14px 16px',
                  fontSize: 13,
                  fontWeight: activeTab === tab ? 700 : 500,
                  color: activeTab === tab ? 'var(--primary-c)' : 'var(--outline)',
                  border: 'none',
                  background: 'transparent',
                  borderBottom: `2px solid ${activeTab === tab ? 'var(--primary-c)' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all .2s'
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6 }}>
                  {tab === 'Creative' ? 'edit' : tab === 'Audience' ? 'groups' : 'payments'}
                </span>
                {tab}
              </button>
            ))}
          </div>

          {/* Variants Grid */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
             {variants.map(v => (
               <div key={v.id} className="variant-card animate-fade-in" style={{ 
                 background: 'var(--surface-low)', 
                 borderRadius: 16, 
                 padding: 20, 
                 border: '1px solid rgba(192,199,211,0.1)',
                 display: 'flex',
                 flexDirection: 'column',
                 gap: 12,
                 position: 'relative'
               }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                     <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-fixed)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'var(--primary)' }}>
                       <div style={{ fontSize: 9 }}>{activeTab === 'Audience' ? 'SEGMENT' : activeTab === 'Bidding' ? 'POLICY' : 'VARIANT'}</div>
                       <div style={{ fontSize: 14 }}>{v.id}</div>
                     </div>
                     <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                       <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span> AI Recommended
                     </span>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--on-surface)', fontFamily: 'Manrope,sans-serif' }}>{v.confidence}%</div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Confidence</div>
                   </div>
                 </div>
                 
                 <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 4 }}>{v.headline}</div>
                    <div style={{ fontSize: 13, color: 'var(--on-surface-v)', lineHeight: 1.5 }}>{v.body}</div>
                 </div>
                 
                 <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => handleCopy(v)}>
                      {copiedId === v.id ? '✓ Copied' : 'Copy Info'}
                    </button>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1.5 }} onClick={() => deploy(v.title)}>Deploy {v.id}</button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  )
}
