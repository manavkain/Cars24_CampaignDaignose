'use client'
import { useState, useEffect } from 'react'
import { useApp } from '../AppContext'
import { analyzeCompetitorStrategy } from '../../lib/gemini'

export default function Intel() {
  const { settings } = useApp()
  const [competitor, setCompetitor] = useState('Spinny')
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  const competitors = ['Spinny', 'OLX Autos', 'Droom', 'CarDekho', 'Orange Book Value']

  async function fetchAds(query) {
    setLoading(true)
    setAnalysis(null)
    try {
      const res = await fetch(`/api/adlibrary?query=${query}`)
      const data = await res.json()
      setAds(data.ads)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAds(competitor)
  }, [])

  async function analyzeStrategy() {
    if (!settings.apiKey) {
      alert('Add an API key in Settings to run AI analysis.')
      return
    }
    if (!ads || ads.length === 0) {
      alert('No ads available to analyze.')
      return
    }
    
    setAnalyzing(true)
    setAnalysis(null)
    try {
      const result = await analyzeCompetitorStrategy(competitor, ads, settings)
      setAnalysis(result)
    } catch (e) {
      alert(e.message)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflow: 'hidden', maxWidth: 1440, margin: '0 auto', width: '100%' }}>
      {/* Search Header */}
      <div className="card" style={{ padding: '16px 24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)', fontSize: 18 }}>search</span>
          <input 
            type="text" 
            value={competitor} 
            onChange={(e) => setCompetitor(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchAds(competitor)}
            placeholder="Search competitor..."
            style={{ padding: '10px 16px 10px 40px', borderRadius: 99, border: '1px solid rgba(192,199,211,0.2)', width: 240, maxWidth: '100%', fontSize: 13 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {competitors.slice(0, 3).map(c => (
            <button key={c} onClick={() => { setCompetitor(c); fetchAds(c); }} className={`btn btn-xs ${competitor === c ? 'btn-primary' : 'btn-ghost'}`}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, flex: 1, minHeight: 0 }}>
        {/* Ads Grid */}
        <div style={{ overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, paddingRight: 4 }}>
          {loading ? (
             Array(6).fill(0).map((_, i) => (
               <div key={i} className="card" style={{ height: 320, background: 'var(--surface-low)', animation: 'pulse 2s infinite' }} />
             ))
          ) : ads.length > 0 ? (
            ads.map(ad => (
              <div key={ad.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 160, position: 'relative' }}>
                  <img src={ad.imageUrl} alt="Ad Creative" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', borderRadius: 99, fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>{ad.platform}</div>
                </div>
                <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 8 }}>{ad.type} • Active {ad.active_since}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 6, lineHeight: 1.2 }}>{ad.headline}</div>
                  <div style={{ fontSize: 12, color: 'var(--on-surface-v)', lineHeight: 1.4, flex: 1 }}>{ad.body}</div>
                  <div style={{ marginTop: 12, padding: '8px 12px', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 8, textAlign: 'center', fontSize: 12, fontWeight: 700 }}>{ad.cta}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, opacity: 0.5 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48 }}>visibility_off</span>
              <div style={{ marginTop: 12, fontSize: 16, fontWeight: 600 }}>No ads found for {competitor}</div>
            </div>
          )}
        </div>

        {/* Intelligence Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-low)' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)', marginRight: 8, verticalAlign: 'middle' }}>insights</span>
                <span className="card-title" style={{ verticalAlign: 'middle' }}>Strategic Intel</span>
              </div>
              <button className="btn btn-primary btn-xs" onClick={analyzeStrategy} disabled={analyzing || loading}>
                {analyzing ? <span className="animate-spin" style={{ marginRight: 4 }}>◌</span> : <span className="material-symbols-outlined" style={{ fontSize: 14, marginRight: 4 }}>psychology</span>}
                Analyze Strategy
              </button>
            </div>
            <div className="card-body" style={{ flex: 1, overflow: 'auto' }}>
              {analysis ? (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                   <div>
                     <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase', marginBottom: 8 }}>Core Hook</div>
                     <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1.3 }}>{analysis.hook}</div>
                   </div>
                   <div>
                     <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase', marginBottom: 8 }}>Creative Strategy</div>
                     <div style={{ fontSize: 13, color: 'var(--on-surface-v)', lineHeight: 1.5 }}>{analysis.strategy}</div>
                   </div>
                   <div style={{ background: 'var(--primary-fixed)', padding: 16, borderRadius: 12, border: '1px solid rgba(0,88,148,0.1)' }}>
                     <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 8 }}>Recommendation</div>
                     <div style={{ fontSize: 13, color: 'var(--on-surface-v)', fontWeight: 600, lineHeight: 1.5 }}>{analysis.recommendation}</div>
                   </div>
                   <div style={{ textAlign: 'center', marginTop: 10 }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>{analysis.confidence}%</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase' }}>AI Confidence</div>
                   </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.4, textAlign: 'center', padding: 20 }}>
                   <span className="material-symbols-outlined" style={{ fontSize: 40, marginBottom: 12 }}>smart_toy</span>
                   <div style={{ fontSize: 13, fontWeight: 600 }}>Click "Analyze Strategy" to generate AI insights for {competitor}</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="card" style={{ background: 'var(--surface-white)', padding: 16 }}>
             <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 12 }}>Ad Library Stats</div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--outline)' }}>Active Ads</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>42</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--outline)' }}>Main Platform</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Meta (82%)</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--outline)' }}>Top Format</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Video</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
