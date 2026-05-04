'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'
import { generateCampaignLaunchpad, scoreCampaignStrategy } from '../../lib/gemini'

export default function Launch() {
  const { settings } = useApp()
  const [brief, setBrief] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [launchpad, setLaunchpad] = useState(null)
  const [campaignScore, setCampaignScore] = useState(null)
  const [isScoring, setIsScoring] = useState(false)

  async function generateLaunchpad() {
    if (!brief) return
    
    setIsGenerating(true)
    setLaunchpad(null)
    setCampaignScore(null)
    try {
      const generated = await generateCampaignLaunchpad(brief, settings)
      setLaunchpad(generated)
      setIsGenerating(false)
      
      // Auto-score the generated campaign
      setIsScoring(true)
      const scoreResult = await scoreCampaignStrategy(generated, settings)
      setCampaignScore(scoreResult)
    } catch (e) {
      alert(e.message)
    } finally {
      setIsGenerating(false)
      setIsScoring(false)
    }
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 20, flex: 1, minHeight: 0 }}>
        
        {/* Left: Input Pane */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-fixed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--on-surface)' }}>Campaign Brief</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase' }}>Objective</label>
              <textarea 
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Example: Launch a monsoon safety campaign for used car owners in Mumbai. Focus on safety checks and SUV upgrades..."
                style={{ flex: 1, minHeight: 200, padding: 16, borderRadius: 12, border: '1px solid rgba(192,199,211,0.2)', fontSize: 14, lineHeight: 1.5, background: 'var(--surface-low)', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)' }}>Budget (Approx)</label>
                <input type="text" placeholder="e.g. 5 Lakhs" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(192,199,211,0.2)', fontSize: 12 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)' }}>Duration</label>
                <input type="text" placeholder="e.g. 30 Days" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(192,199,211,0.2)', fontSize: 12 }} />
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={generateLaunchpad} 
              disabled={isGenerating || !brief}
              style={{ marginTop: 'auto', padding: '14px' }}
            >
              {isGenerating ? <span className="animate-spin" style={{ marginRight: 8 }}>◌</span> : <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 8 }}>auto_awesome</span>}
              {isGenerating ? 'Architecting...' : 'Generate Campaign'}
            </button>
          </div>
        </div>

        {/* Right: Output Pane */}
        <div style={{ overflowY: 'auto', paddingRight: 4 }}>
          {launchpad ? (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Header Info */}
              <div className="card" style={{ background: 'var(--primary-fixed)', border: '1px solid rgba(0,88,148,0.1)', padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 4 }}>New Campaign Structure</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--on-surface)', fontFamily: 'Manrope,sans-serif' }}>{launchpad.name}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {launchpad.platforms.map(p => <span key={p} className="badge badge-blue">{p}</span>)}
                  </div>
                </div>
              </div>

              {/* Campaign Score */}
              {(isScoring || campaignScore) && (
                <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, background: 'var(--surface-low)' }}>
                  {isScoring ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--outline)' }}>
                      <span className="animate-spin material-symbols-outlined">refresh</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>AI is scoring this campaign strategy...</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: campaignScore.score >= 80 ? '#16a34a' : campaignScore.score >= 60 ? 'var(--orange)' : 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 900 }}>
                        {campaignScore.score}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--on-surface)' }}>Predicted Success Score</div>
                        <div style={{ fontSize: 11, color: 'var(--on-surface-v)', marginTop: 2 }}>{campaignScore.summary}</div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Audiences */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="card-header"><span className="card-title">Audience Segmentation</span></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {launchpad.audiences.map((a, i) => (
                      <div key={i} style={{ padding: 12, borderRadius: 10, background: 'var(--surface-low)', border: '1px solid rgba(192,199,211,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>{a.name}</span>
                          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)' }}>{a.weight}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--on-surface-v)', lineHeight: 1.4 }}>{a.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creatives */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="card-header"><span className="card-title">Creative Concepting</span></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {launchpad.creatives.map((c, i) => (
                      <div key={i} style={{ padding: 12, borderRadius: 10, background: 'var(--surface-low)', border: '1px solid rgba(192,199,211,0.05)' }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase', marginBottom: 6 }}>{c.title}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>{c.headline}</div>
                        <div style={{ fontSize: 11, color: 'var(--on-surface-v)', lineHeight: 1.4 }}>{c.body}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bidding & Budget */}
              <div className="card">
                <div className="card-header"><span className="card-title">Execution Controls</span></div>
                <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                   <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--orange)' }}>payments</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase' }}>Bid Recommendation</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--on-surface)' }}>{launchpad.bidding.recommendation}</div>
                        <div style={{ fontSize: 11, color: 'var(--on-surface-v)', marginTop: 4 }}>Strategy: {launchpad.bidding.strategy}</div>
                      </div>
                   </div>
                   <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <span className="material-symbols-outlined" style={{ color: '#16a34a' }}>account_balance_wallet</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase' }}>Budget Allocation</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--on-surface)' }}>{launchpad.budget.total}</div>
                        <div style={{ fontSize: 11, color: 'var(--on-surface-v)', marginTop: 4 }}>{launchpad.budget.daily} / day over {launchpad.budget.duration}</div>
                      </div>
                   </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                 <button className="btn btn-ghost">Export as PDF</button>
                 <button className="btn btn-primary" onClick={() => alert('Pushing to Meta Ads Manager...')}>Push to Ad Manager</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3, textAlign: 'center', padding: 40 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 64, marginBottom: 16 }}>architecture</span>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--on-surface)' }}>Launchpad Ready</div>
              <div style={{ fontSize: 14, maxWidth: 400, marginTop: 8 }}>Enter your campaign requirements on the left to architect a full, high-precision campaign structure.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
