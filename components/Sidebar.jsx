'use client'
import { useApp } from './AppContext'

const NAV=[
  {id:'detect',         icon:'visibility',       label:'Detect'},
  {id:'diagnose',       icon:'analytics',        label:'Diagnose'},
  {id:'act',            icon:'bolt',             label:'Act'},
  {id:'intel',          icon:'psychology',       label:'Intel'},
  {id:'launch',         icon:'rocket_launch',    label:'Launch'},
  {id:'log',            icon:'history',          label:'Log'},
]
const NAV_BOT=[{id:'settings',icon:'settings',label:'Settings'}]

export default function Sidebar({view,setView,isCollapsed,setIsCollapsed}){
  const {isContinuous,setIsContinuous,settings,runDiagnosis,pipelineStep}=useApp()
  
  const width = isCollapsed ? 68 : 240 // Reduced from 256 to give more dashboard space

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
      borderRight: '1px solid rgba(192,199,211,0.15)',
      zIndex: 100
    }}>
      {/* Brand Logo */}
      <div style={{padding: isCollapsed ? '20px 14px' : '24px 20px 12px', display:'flex', alignItems:'center', justifyContent: 'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:12, overflow:'hidden'}}>
          <div style={{
            width:40, height:40, 
            background:'#fff', 
            borderRadius:10, 
            display:'flex', alignItems:'center', justifyContent:'center', 
            boxShadow:'0 4px 14px rgba(78,73,242,0.15)', 
            flexShrink:0,
            border: '1px solid rgba(78,73,242,0.1)'
          }}>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAkFBMVEVHNv7///9JOP79/f9GNf5KOv48Kv4+LP78+/84Jv5EM/6jm/9BMP5PPv5RQf5ALv7u7f/08//r6f/k4f96bf7a1v+4sf+vqP9WR/5eT/5zZv7Auv/Hwv+ooP9wY//QzP/29v+flv/e2/9+cv9qW/+Eef+ro/9cTP6Og//U0f9sXv6Ge/+Tif+Xjv+6tP/c2f+xJRxjAAACIklEQVRYhe1W2ZKqMBBNmiwSQBYXwBV1Vr0z8/9/dyOEKHcSiUzV1H3wvFha9unT6RWhBx74zwEUiJAgiNIh1iT2Q4jG44gKnwmAO+1DRhe75SxL02S/Wh/GnN9DQQUrgwm+QjLfxLFzIMCKvJJWnufV1qPzh7d6YsRRBH9OlNUF8tsoIKELgwhfsDe6QMk4M24LhzAI3eKu83MsSsWk5L0axDjoIt+mGGuG1/4oiN8FE8XbXjPMqOgNgnYBSDC0q9q3nPcHYaBE/iJpGQ5sAAOi/jHVQZABBJLhuZXwdkOCaGByQdm8fkkPv9sVkKiBqVogLFOl4RibJUC8SWpUS1OqQEoY1RICZq5H6u+UyBdTlMCn6hG2tlIIl7ULjKfGXIsoa2LIIjMDgVlTcFVh+cPTosbRIkB7mNjKNeQ1YhvBOFWlArZEQYPhBLfRH0IPCHzdfsSeCHrTiETzhiy02F8KaW0sNVFMaxxKm0C+UDNwb+pY0N208y2jVUTtMjl9l3DVTBtLM0kfazX79t+L9aqdrTmSTirVL/m/EtwGCrC8keDhP34nXa4jTbxm7TL5YIK2FO5DlbKT3gCfhUw43DvWgeeaIQtKwpvF8qV/fO8rcyJWqhzP+3g2X9+92gSs1DL19I5t7wSn5QpC5FiJkJaX9e45rncEiJ+ya/86IMcD48aJg1y34k+PLGQ885zdKwYqayAefmg2HD85dR944HfxF5h5IaGc9BBOAAAAAElFTkSuQmCC" alt="Cars24" style={{width: 28, height: 28}} />
          </div>
          {!isCollapsed && (
            <div style={{whiteSpace:'nowrap', animation: 'fadeIn 0.3s'}}>
              <div style={{fontFamily:'Manrope,sans-serif',fontSize:18,fontWeight:800,color:'var(--on-surface)',letterSpacing:'-0.02em',lineHeight:1.2}}>Cars24</div>
              <div style={{fontSize:10,fontWeight:700,color:'var(--outline)',textTransform:'uppercase',letterSpacing:'.1em',marginTop:2}}>Growth Operator</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Consistent Toggle Button - Fixed Position */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, marginTop: 4 }}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
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
      </div>

      {/* Actions */}
      <div style={{padding: '0 14px 16px'}}>
        <button className="btn btn-primary" 
          style={{
            width:'100%',
            justifyContent: 'center',
            fontSize: 13,
            padding: isCollapsed ? '11px 0' : '11px 16px',
            minWidth: 0,
            overflow: 'hidden'
          }} 
          onClick={runDiagnosis} 
          disabled={pipelineStep==='diagnose'}
        >
          <span className="material-symbols-outlined" style={{fontSize:18,fontVariationSettings:pipelineStep==='diagnose'?"'FILL' 0":"'FILL' 1"}}>{pipelineStep==='diagnose'?'hourglass_empty':'play_arrow'}</span>
          {!isCollapsed && <span style={{marginLeft: 8, animation: 'fadeIn 0.3s'}}>Run Diagnosis</span>}
        </button>
        
        <div onClick={()=>setIsContinuous(!isContinuous)} style={{
          marginTop:10,
          display:'flex',
          alignItems:'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? '8px 0' : '9px 12px',
          borderRadius:8,
          cursor:'pointer',
          background:isContinuous?'rgba(21,87,36,0.08)':'rgba(255,255,255,0.5)',
          transition:'all .2s',
          border:'1px solid '+(isContinuous?'rgba(21,87,36,0.15)':'transparent')
        }}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span className="dot" style={{background:isContinuous?'#16a34a':'var(--outline-v)',width: isCollapsed?8:7, height: isCollapsed?8:7, animation:isContinuous?'pulsedot 2s infinite':'none'}}/>
            {!isCollapsed && <span style={{fontFamily:'Inter,sans-serif',fontSize:12,fontWeight:500,color:isContinuous?'#15512a':'var(--outline)', animation: 'fadeIn 0.3s'}}>{isContinuous?'Live mode':'Paused'}</span>}
          </div>
          {!isCollapsed && <div className={`toggle-track ${isContinuous?'on':''}`}><div className="toggle-thumb"/></div>}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{flex:1,padding:'4px 10px',display:'flex',flexDirection:'column',gap:2,overflowY:'auto', overflowX:'hidden'}}>
        {!isCollapsed && <div style={{fontSize:10,fontWeight:700,color:'var(--outline-v)',textTransform:'uppercase',letterSpacing:'.08em',padding:'6px 10px 8px', animation: 'fadeIn 0.3s'}}>Workspace</div>}
        {NAV.map(n=>(
          <button key={n.id} className={`nav-item ${view===n.id?'active':''}`} onClick={()=>setView(n.id)} style={{justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '10px 0' : '10px 12px'}}>
            <span className="material-symbols-outlined" style={{fontSize:18,color:view===n.id?'var(--primary-c)':'var(--outline)',fontVariationSettings:view===n.id?"'FILL' 1":"'FILL' 0",transition:'color .2s'}}>{n.icon}</span>
            {!isCollapsed && <span style={{marginLeft: 12, whiteSpace: 'nowrap', animation: 'fadeIn 0.3s'}}>{n.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{padding:'10px 10px 16px',borderTop:'1px solid rgba(192,199,211,0.15)',display:'flex',flexDirection:'column',gap:2, overflow:'hidden'}}>
        {NAV_BOT.map(n=>(
          <button key={n.id} className={`nav-item ${view===n.id?'active':''}`} onClick={()=>setView(n.id)} style={{justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '10px 0' : '10px 12px'}}>
            <span className="material-symbols-outlined" style={{fontSize:18,color:view===n.id?'var(--primary-c)':'var(--outline)',fontVariationSettings:view===n.id?"'FILL' 1":"'FILL' 0"}}>{n.icon}</span>
            {!isCollapsed && <span style={{marginLeft: 12, whiteSpace: 'nowrap', animation: 'fadeIn 0.3s'}}>{n.label}</span>}
          </button>
        ))}
        <div style={{padding:'8px 12px', display:'flex', justifyContent: isCollapsed ? 'center' : 'flex-start', alignItems:'center', gap:7}}>
          <span className="dot" style={{background:settings.apiKey?'#16a34a':'var(--outline-v)', width: 8, height: 8, animation:settings.apiKey?'pulsedot 2s infinite':'none'}}/>
          {!isCollapsed && <span style={{fontSize:11, color:settings.apiKey?'#15512a':'var(--outline)', animation: 'fadeIn 0.3s'}}>{settings.apiKey?`${settings.aiProvider.charAt(0).toUpperCase() + settings.aiProvider.slice(1)} connected`:'Demo mode'}</span>}
        </div>
      </div>
    </div>
  )
}
