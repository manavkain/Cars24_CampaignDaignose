'use client'
import{useState}from'react'
import CampaignPulse from'../dashboard/CampaignPulse'
import DiagnosisFeed from'../dashboard/DiagnosisFeed'
import FixGenerator from'../dashboard/FixGenerator'
import ImprovementLog from'../dashboard/ImprovementLog'
import { useApp } from '../AppContext'

export default function MainDashboard({ activeTab = 'Overview' }){
  const[selectedIssue,setSelectedIssue]=useState('1')
  const[layoutStyle, setLayoutStyle] = useState('grid')

  if (activeTab === 'Metrics') return <MetricsView />
  if (activeTab === 'Insights') return <InsightsView />

  return(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: 12,
      overflow: 'hidden'
    }} className="animate-fade-in">
      
      {/* Layout Toggle */}
      <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginBottom: 4}}>
        <button onClick={()=>setLayoutStyle('grid')} className={`btn btn-xs ${layoutStyle==='grid'?'btn-primary':'btn-ghost'}`}>
          <span className="material-symbols-outlined" style={{fontSize:14}}>grid_view</span> Grid
        </button>
        <button onClick={()=>setLayoutStyle('kanban')} className={`btn btn-xs ${layoutStyle==='kanban'?'btn-primary':'btn-ghost'}`}>
          <span className="material-symbols-outlined" style={{fontSize:14}}>view_column</span> Kanban
        </button>
      </div>

      {layoutStyle === 'grid' ? (
        <div style={{
          display:'grid',
          gridTemplateColumns:'minmax(280px, 0.9fr) minmax(320px, 1.2fr) minmax(280px, 0.9fr)',
          gap:14,
          flex: 1,
          minHeight: 0
        }}>
          {/* Column 1: Pulse (Top) + Log (Bottom) */}
          <div style={{display:'flex', flexDirection:'column', gap:14, minHeight:0}}>
            <div style={{flexShrink:0}}><CampaignPulse compact={true}/></div>
            <div style={{flex:1, minHeight:0}}><ImprovementLog/></div>
          </div>

          {/* Column 2: Fix Generator (Full Height) */}
          <div style={{minHeight:0}}><FixGenerator selectedId={selectedIssue}/></div>

          {/* Column 3: Diagnostic Stream (Top) + Nodes (Bottom) */}
          <div style={{display:'flex', flexDirection:'column', gap:14, minHeight:0}}>
            <div style={{flex:1, minHeight:0}}><DiagnosisFeed onViewFix={id=>setSelectedIssue(id)}/></div>
            <div style={{flexShrink:0}}><NodesPanel/></div>
          </div>
        </div>
      ) : (
        /* Kanban Layout */
        <div style={{
          display: 'flex',
          gap: 14,
          flex: 1,
          overflowX: 'auto',
          paddingBottom: 8,
          minHeight: 0
        }}>
          <div style={{minWidth: 300, flex: 1, display:'flex', flexDirection:'column', gap:12}}>
            <div style={{fontSize:10, fontWeight:800, color:'var(--outline)', textTransform:'uppercase', padding:'0 4px'}}>Pulse & Telemetry</div>
            <CampaignPulse compact={true}/>
            <div style={{flex:1, minHeight:0}}><ImprovementLog/></div>
          </div>
          <div style={{minWidth: 340, flex: 1.2, display:'flex', flexDirection:'column', gap:12}}>
            <div style={{fontSize:10, fontWeight:800, color:'var(--outline)', textTransform:'uppercase', padding:'0 4px'}}>Diagnostic Stream</div>
            <div style={{flex:1, minHeight:0}}><DiagnosisFeed onViewFix={id=>setSelectedIssue(id)}/></div>
          </div>
          <div style={{minWidth: 360, flex: 1.3, display:'flex', flexDirection:'column', gap:12}}>
            <div style={{fontSize:10, fontWeight:800, color:'var(--outline)', textTransform:'uppercase', padding:'0 4px'}}>Architecture Fixes</div>
            <div style={{flex:1, minHeight:0}}><FixGenerator selectedId={selectedIssue}/></div>
          </div>
          <div style={{minWidth: 280, flex: 0.9, display:'flex', flexDirection:'column', gap:12}}>
            <div style={{fontSize:10, fontWeight:800, color:'var(--outline)', textTransform:'uppercase', padding:'0 4px'}}>Network Nodes</div>
            <NodesPanel/>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricsView() {
  const { metrics, getHealth } = useApp()
  const items = [
    { k:'ctr', l:'Click-Through Rate', v:`${metrics.ctr}%`, desc:'Ad relevance score', icon:'ads_click' },
    { k:'cpc', l:'Cost Per Click', v:`₹${metrics.cpc}`, desc:'Auction efficiency', icon:'payments' },
    { k:'roas', l:'Return on Ad Spend', v:`${metrics.roas}x`, desc:'Revenue impact', icon:'trending_up' },
    { k:'cpl', l:'Cost Per Lead', v:`₹${metrics.cpl}`, desc:'Funnel efficiency', icon:'group_add' },
    { k:'frequency', l:'Ad Frequency', v:metrics.frequency, desc:'Audience fatigue', icon:'repeat' },
    { k:'spend', l:'Total Spend', v:`₹${metrics.spend}`, desc:'Budget utilization', icon:'account_balance_wallet' },
  ]

  return (
    <div className="animate-fade-in" style={{display:'flex', flexDirection:'column', gap:16, height:'100%', overflow:'hidden'}}>
       <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:12, flexShrink:0}}>
          {items.map(m => {
            const h = getHealth(m.k, metrics[m.k])
            return (
              <div key={m.k} className="card" style={{padding: '16px 20px', display:'flex', gap:16, alignItems:'center'}}>
                <div style={{width:42, height:42, borderRadius:10, background:'var(--surface-low)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                  <span className="material-symbols-outlined" style={{fontSize:22, color:'var(--primary)'}}>{m.icon}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontSize:10, fontWeight:700, color:'var(--outline)', textTransform:'uppercase'}}>{m.l}</span>
                    <span className={`badge ${h==='green'?'badge-green':h==='red'?'badge-red':'badge-amber'}`} style={{fontSize:9, padding:'1px 6px'}}>{h}</span>
                  </div>
                  <div style={{fontSize:20, fontWeight:800, color:'var(--on-surface)', fontFamily:'Manrope,sans-serif'}}>{m.v}</div>
                </div>
              </div>
            )
          })}
       </div>
       
       <div className="card" style={{flex:1, minHeight:0, display:'flex', flexDirection:'column'}}>
         <div className="card-header"><span className="card-title">Performance Trend</span></div>
         <div className="card-body" style={{flex:1, display:'flex', alignItems:'flex-end', gap:10, paddingBottom:40, minHeight:0}}>
            {[45, 60, 40, 75, 90, 65, 80, 55, 70, 85, 95, 100].map((h, i) => (
              <div key={i} style={{flex:1, background:i===11?'var(--primary)':'var(--surface-high)', height:`${h}%`, borderRadius:'4px 4px 0 0', position:'relative'}}>
                <div style={{position:'absolute', bottom:-25, left:0, width:'100%', textAlign:'center', fontSize:10, color:'var(--outline)'}}>{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</div>
              </div>
            ))}
         </div>
       </div>
    </div>
  )
}

function InsightsView() {
  const { diagnosis, metrics } = useApp()
  return (
    <div className="animate-fade-in" style={{display:'grid', gridTemplateColumns:'1fr 300px', gap:16, height:'100%', overflow:'hidden'}}>
      <div style={{display:'flex', flexDirection:'column', gap:16, minHeight:0}}>
        <div className="card" style={{background:'var(--primary-fixed)', border:'1px solid rgba(0,88,148,0.1)', flexShrink:0}}>
          <div className="card-body" style={{display:'flex', gap:20, alignItems:'center', padding:24}}>
             <div style={{width:54, height:54, borderRadius:'50%', background:'var(--surface-white)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 8px 24px rgba(0,88,148,0.1)'}}>
                <span className="material-symbols-outlined" style={{fontSize:28, color:'var(--primary)', fontVariationSettings:"'FILL' 1"}}>auto_awesome</span>
             </div>
             <div>
               <div style={{fontSize:16, fontWeight:800, color:'var(--primary)', fontFamily:'Manrope,sans-serif', marginBottom:4}}>AI Executive Summary</div>
               <div style={{fontSize:13, color:'var(--on-surface-v)', lineHeight:1.5, fontWeight:500}}>
                 {diagnosis?.summary || "Analyzing campaign patterns... Run a diagnosis to generate deep intelligence insights."}
               </div>
             </div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, flex:1, minHeight:0}}>
           <div className="card" style={{display:'flex', flexDirection:'column'}}>
             <div className="card-header"><span className="card-title">Audience Sentiment</span></div>
             <div className="card-body" style={{flex:1, overflow:'auto'}}>
               <div style={{fontSize:13, color:'var(--on-surface-v)', lineHeight:1.6, fontWeight:500}}>
                 Correlation between high frequency ({metrics.frequency}) and CTR decay ({metrics.ctr}%) suggests audience saturation in top-performing segments.
               </div>
               <div style={{marginTop:16, display:'flex', gap:8}}>
                 <span className="badge badge-amber">Saturation Risk</span>
                 <span className="badge badge-blue">Neutral</span>
               </div>
             </div>
           </div>
           <div className="card" style={{display:'flex', flexDirection:'column'}}>
             <div className="card-header"><span className="card-title">Auction Dynamics</span></div>
             <div className="card-body" style={{flex:1, overflow:'auto'}}>
               <div style={{fontSize:13, color:'var(--on-surface-v)', lineHeight:1.6, fontWeight:500}}>
                 CPC at ₹{metrics.cpc} is currently 12% below category average. Recommend raising bids on high-intent keywords to capture 18% more impression share.
               </div>
               <div style={{marginTop:16, display:'flex', gap:8}}>
                 <span className="badge badge-green">Bid Efficient</span>
                 <span className="badge badge-blue">IS: 64%</span>
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="card" style={{display:'flex', flexDirection:'column', minHeight:0}}>
        <div className="card-header"><span className="card-title">Historical Trends</span></div>
        <div className="card-body" style={{flex:1, overflow:'auto', display:'flex', flexDirection:'column', gap:14}}>
           {[
             {l:'Week 16', v:'+12%', s:'up', desc:'CTR boost post-refresh'},
             {l:'Week 15', v:'-4%', s:'down', desc:'Budget pacing lag'},
             {l:'Week 14', v:'+28%', s:'up', desc:'New audience launch'},
             {l:'Week 13', v:'+5%', s:'up', desc:'Bid strategy change'},
             {l:'Week 12', v:'+9%', s:'up', desc:'Copy optimization'},
           ].map((t,i)=>(
             <div key={i} style={{display:'flex', gap:12, alignItems:'flex-start', paddingBottom:12, borderBottom:i<4?'1px solid rgba(192,199,211,0.1)':'none'}}>
                <span className="material-symbols-outlined" style={{color:t.s==='up'?'#16a34a':'var(--error)', fontSize:18}}>
                  {t.s==='up'?'trending_up':'trending_down'}
                </span>
                <div style={{flex:1}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:2}}>
                    <span style={{fontSize:12, fontWeight:700, color:'var(--on-surface)'}}>{t.l}</span>
                    <span style={{fontSize:12, fontWeight:800, color:t.s==='up'?'#16a34a':'var(--error)'}}>{t.v}</span>
                  </div>
                  <div style={{fontSize:10, color:'var(--outline)'}}>{t.desc}</div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}

function NodesPanel(){
  const { useApp } = require('../AppContext')
  const { settings } = useApp()
  const nodes=[
    {id:'1',name:'Campaign Input', type:'input', connected:true},
    {id:'2',name:'Gemini AI',      type:'ai',    connected:true},
    {id:'3',name:'Fix Generator',  type:'ai',    connected:true},
    {id:'4',name:'Google Sheets',  type:'input', connected:!!settings.sheetsUrl},
    {id:'5',name:'Meta Ads',       type:'ads',   connected:!!settings.connectors?.meta},
    {id:'6',name:'Google Ads',     type:'ads',   connected:!!settings.connectors?.google},
    {id:'7',name:'Airtable Log',   type:'output',connected:!!settings.webhookUrl},
  ]
  const tc={input:'var(--primary)',ai:'#16a34a',ads:'var(--orange)',output:'var(--orange-dark)'}
  const icon={input:'upload',ai:'smart_toy',ads:'campaign',output:'hub'}

  return(
    <div className="card" style={{ height: 'auto' }}>
      <div className="card-header" style={{ padding: '8px 16px' }}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span className="material-symbols-outlined" style={{fontSize:14,color:'var(--secondary)',fontVariationSettings:"'FILL' 1"}}>hub</span>
          <span className="card-title" style={{ fontSize: 10 }}>Connected Nodes</span>
        </div>
        <span style={{fontSize:10,color:'var(--outline)',fontWeight:600}}>{nodes.filter(n=>n.connected).length}/{nodes.length}</span>
      </div>
      <div className="card-body" style={{display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap:8, padding: '12px 16px'}}>
        {nodes.map(n=>(
          <div key={n.id} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'8px 6px',borderRadius:8,background:'var(--surface-low)',transition:'background .2s', textAlign: 'center'}}
            onMouseOver={e=>e.currentTarget.style.background='var(--surface-cont)'}
            onMouseOut={e=>e.currentTarget.style.background='var(--surface-low)'}>
            <div style={{width:28,height:28,borderRadius:8,background:n.connected?`${tc[n.type]}15`:'var(--surface-high)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0, marginBottom: 2}}>
              <span className="material-symbols-outlined" style={{fontSize:14,color:n.connected?tc[n.type]:'var(--outline)',fontVariationSettings:"'FILL' 1"}}>{icon[n.type]}</span>
            </div>
            <span style={{fontSize:9,color:n.connected?'var(--on-surface)':'var(--outline)',fontWeight:n.connected?700:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', width: '100%'}}>{n.name}</span>
            <div className="dot" style={{background:n.connected?tc[n.type]:'var(--outline-v)', width: 4, height: 4}}/>
          </div>
        ))}
      </div>
    </div>
  )
}
