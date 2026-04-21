'use client'
import { useApp } from './AppContext'

const NAV=[
  {id:'dashboard',       icon:'dashboard',       label:'Dashboard'},
  {id:'ai-chat',         icon:'forum',            label:'AI Assistant'},
  {id:'reports',         icon:'analytics',        label:'Reports'},
  {id:'connectors',      icon:'hub',              label:'Connectors'},
  {id:'custom-logic',    icon:'rule',             label:'Logic Maker'},
  {id:'custom-dashboard',icon:'view_quilt',       label:'Custom View'},
]
const NAV_BOT=[{id:'settings',icon:'settings',label:'Settings'}]

export default function Sidebar({view,setView,isCollapsed,setIsCollapsed}){
  const {isContinuous,setIsContinuous,settings,runDiagnosis,pipelineStep}=useApp()
  
  const width = isCollapsed ? 68 : 256

  return (
    <div style={{
      width,
      flexShrink:0,
      background:'var(--surface-low)',
      display:'flex',
      flexDirection:'column',
      height:'100vh',
      position:'sticky',
      top:0,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      borderRight: '1px solid rgba(192,199,211,0.15)'
    }}>
      {/* Brand Logo & Collapse Toggle */}
      <div style={{padding: isCollapsed ? '20px 14px' : '24px 20px 20px', display:'flex', alignItems:'center', justifyContent: isCollapsed ? 'center' : 'space-between'}}>
        {!isCollapsed && (
          <div style={{display:'flex',alignItems:'center',gap:12, overflow:'hidden'}}>
            <div style={{width:40,height:40,background:'linear-gradient(135deg,#005894,#0071bc)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 14px rgba(0,88,148,0.3)',flexShrink:0}}>
              <span className="material-symbols-outlined" style={{color:'#fff',fontSize:22,fontVariationSettings:"'FILL' 1"}}>directions_car</span>
            </div>
            <div style={{whiteSpace:'nowrap'}}>
              <div style={{fontFamily:'Manrope,sans-serif',fontSize:18,fontWeight:800,color:'var(--on-surface)',letterSpacing:'-0.02em',lineHeight:1.2}}>Cars24</div>
              <div style={{fontSize:10,fontWeight:700,color:'var(--outline)',textTransform:'uppercase',letterSpacing:'.1em',marginTop:2}}>Precision Architect</div>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div style={{width:40,height:40,background:'linear-gradient(135deg,#005894,#0071bc)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 14px rgba(0,88,148,0.3)',flexShrink:0}}>
            <span className="material-symbols-outlined" style={{color:'#fff',fontSize:22,fontVariationSettings:"'FILL' 1"}}>directions_car</span>
          </div>
        )}
      </div>
      
      {/* Collapse Button - Floating or integrated */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          margin: isCollapsed ? '0 auto 16px' : '0 20px 16px',
          width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(192,199,211,0.3)',
          background: 'var(--surface-white)', color: 'var(--outline)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
        onMouseOut={e => e.currentTarget.style.color = 'var(--outline)'}
      >
        <span className="material-symbols-outlined" style={{fontSize: 18}}>
          {isCollapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>

      {/* Actions — Run Diagnosis + Continuous Toggle */}
      <div style={{padding: isCollapsed ? '0 10px 16px' : '0 14px 16px'}}>
        <button className="btn btn-primary" 
          style={{
            width:'100%',
            justifyContent: isCollapsed ? 'center' : 'center',
            fontSize: 13,
            padding: isCollapsed ? '11px 0' : '11px 16px',
            minWidth: 0,
            overflow: 'hidden'
          }} 
          onClick={runDiagnosis} 
          disabled={pipelineStep==='diagnose'}
        >
          <span className="material-symbols-outlined" style={{fontSize:18,fontVariationSettings:pipelineStep==='diagnose'?"'FILL' 0":"'FILL' 1"}}>{pipelineStep==='diagnose'?'hourglass_empty':'play_arrow'}</span>
          {!isCollapsed && <span style={{marginLeft: 8}}>{pipelineStep==='diagnose'?'Diagnosing...':'Run Diagnosis'}</span>}
        </button>
        
        {!isCollapsed && (
          <div onClick={()=>setIsContinuous(!isContinuous)} style={{marginTop:10,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 12px',borderRadius:8,cursor:'pointer',background:isContinuous?'rgba(21,87,36,0.08)':'rgba(255,255,255,0.5)',transition:'all .2s',border:'1px solid '+(isContinuous?'rgba(21,87,36,0.15)':'transparent')}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span className="dot" style={{background:isContinuous?'#16a34a':'var(--outline-v)',animation:isContinuous?'pulsedot 2s infinite':'none'}}/>
              <span style={{fontFamily:'Inter,sans-serif',fontSize:12,fontWeight:500,color:isContinuous?'#15512a':'var(--outline)'}}>{isContinuous?'Live mode on':'Paused'}</span>
            </div>
            <div className={`toggle-track ${isContinuous?'on':''}`}><div className="toggle-thumb"/></div>
          </div>
        )}
        {isCollapsed && (
          <div onClick={()=>setIsContinuous(!isContinuous)} style={{marginTop:10, display:'flex', justifyContent:'center', padding:'8px 0', cursor:'pointer'}}>
             <span className="dot" style={{background:isContinuous?'#16a34a':'var(--outline-v)', width: 8, height: 8, animation:isContinuous?'pulsedot 2s infinite':'none'}}/>
          </div>
        )}
      </div>

      {/* Navigation — Stitch: tonal hover, active with right-border */}
      <nav style={{flex:1,padding:'4px 10px',display:'flex',flexDirection:'column',gap:2,overflowY:'auto', overflowX:'hidden'}}>
        {!isCollapsed && <div style={{fontSize:10,fontWeight:700,color:'var(--outline-v)',textTransform:'uppercase',letterSpacing:'.08em',padding:'6px 10px 8px'}}>Workspace</div>}
        {NAV.map(n=>(
          <button key={n.id} className={`nav-item ${view===n.id?'active':''}`} onClick={()=>setView(n.id)} style={{justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '10px 0' : '10px 12px'}}>
            <span className="material-symbols-outlined" style={{fontSize:18,color:view===n.id?'var(--primary-c)':'var(--outline)',fontVariationSettings:view===n.id?"'FILL' 1":"'FILL' 0",transition:'color .2s'}}>{n.icon}</span>
            {!isCollapsed && <span style={{marginLeft: 12, whiteSpace: 'nowrap'}}>{n.label}</span>}
          </button>
        ))}
        {!isCollapsed && (settings.connectors?.meta||settings.connectors?.google) && (
          <>
            <div style={{fontSize:10,fontWeight:700,color:'var(--outline-v)',textTransform:'uppercase',letterSpacing:'.08em',padding:'12px 10px 6px'}}>Live Feeds</div>
            {settings.connectors?.meta&&<div style={{display:'flex',alignItems:'center',gap:9,padding:'7px 12px',fontSize:12,color:'#155724',fontWeight:500}}><span className="dot dot-green"/>Meta Ads</div>}
            {settings.connectors?.google&&<div style={{display:'flex',alignItems:'center',gap:9,padding:'7px 12px',fontSize:12,color:'#155724',fontWeight:500}}><span className="dot dot-green"/>Google Ads</div>}
          </>
        )}
      </nav>

      {/* Bottom — Settings + Status */}
      <div style={{padding:'10px 10px 16px',borderTop:'1px solid rgba(192,199,211,0.15)',display:'flex',flexDirection:'column',gap:2, overflow:'hidden'}}>
        {NAV_BOT.map(n=>(
          <button key={n.id} className={`nav-item ${view===n.id?'active':''}`} onClick={()=>setView(n.id)} style={{justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '10px 0' : '10px 12px'}}>
            <span className="material-symbols-outlined" style={{fontSize:18,color:view===n.id?'var(--primary-c)':'var(--outline)',fontVariationSettings:view===n.id?"'FILL' 1":"'FILL' 0"}}>{n.icon}</span>
            {!isCollapsed && <span style={{marginLeft: 12, whiteSpace: 'nowrap'}}>{n.label}</span>}
          </button>
        ))}
        {!isCollapsed && (
          <div style={{padding:'8px 12px',fontSize:11,color:settings.geminiKey?'#15512a':'var(--outline)',display:'flex',alignItems:'center',gap:7, whiteSpace:'nowrap'}}>
            <span className="dot" style={{background:settings.geminiKey?'#16a34a':'var(--outline-v)',animation:settings.geminiKey?'pulsedot 2s infinite':'none'}}/>
            {settings.geminiKey?'Gemini connected':'Demo mode'}
          </div>
        )}
        {isCollapsed && (
          <div style={{display:'flex', justifyContent:'center', padding:'8px 0'}}>
             <span className="dot" style={{background:settings.geminiKey?'#16a34a':'var(--outline-v)', width: 8, height: 8, animation:settings.geminiKey?'pulsedot 2s infinite':'none'}}/>
          </div>
        )}
      </div>
    </div>
  )
}
