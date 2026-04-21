'use client'
import { useApp } from './AppContext'

const STEPS=[{id:'input',label:'Input'},{id:'diagnose',label:'Diagnose'},{id:'fix',label:'Fix'},{id:'deploy',label:'Deploy'},{id:'track',label:'Track'}]
const ORDER=['input','diagnose','fix','deploy','track']

export default function TopBar({title,subtitle,actions,activeTab,setActiveTab}){
  const {pipelineStep,metrics}=useApp()
  const si=ORDER.indexOf(pipelineStep)
  return (
    <div style={{background:'rgba(255,255,255,0.8)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderBottom:'none',padding:'0 28px',flexShrink:0,position:'sticky',top:0,zIndex:40}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:60}}>
        {/* Left: Title + Tab Navigation */}
        <div style={{display:'flex',alignItems:'center',gap:24}}>
          <div style={{fontFamily:'Manrope,sans-serif',fontSize:17,fontWeight:800,color:'var(--primary-c)',letterSpacing:'-0.02em'}}>Campaign Diagnosis</div>
          <nav style={{display:'flex',gap:2}}>
            {['Overview','Metrics','Insights'].map((tab)=>(
              <span key={tab} 
                onClick={()=>setActiveTab&&setActiveTab(tab)}
                style={{
                  padding:'6px 14px',
                  fontSize:13,
                  fontWeight:activeTab===tab?700:500,
                  color:activeTab===tab?'var(--primary-c)':'var(--outline)',
                  cursor:'pointer',
                  borderBottom:activeTab===tab?'2px solid var(--primary-c)':'2px solid transparent',
                  transition:'all .2s',
                  fontFamily:'Inter,sans-serif'
                }}>{tab}</span>
            ))}
          </nav>
        </div>
        {/* Right: Actions */}
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <span style={{fontSize:11,color:'var(--outline)',background:'var(--surface-white)',padding:'4px 12px',borderRadius:99,border:'1px solid rgba(192,199,211,0.3)',fontWeight:500}}>{metrics.campaign}</span>
          <span className="chip-ai">{metrics.platform}</span>
          <button className="btn btn-ghost btn-sm" style={{padding:'6px 8px',borderRadius:'50%',border:'none',background:'transparent'}}>
            <span className="material-symbols-outlined" style={{fontSize:20,color:'var(--outline)'}}>notifications</span>
          </button>
          <div style={{width:32,height:32,borderRadius:'50%',background:'var(--surface-high)',border:'1px solid rgba(192,199,211,0.2)',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
            <span className="material-symbols-outlined" style={{fontSize:18,color:'var(--on-surface-v)'}}>person</span>
          </div>
          {actions}
        </div>
      </div>
      {/* Pipeline Steps */}
      <div style={{display:'flex',alignItems:'center',gap:5,paddingBottom:10}}>
        {STEPS.map((step,i)=>{
          const isDone=i<si; const isAct=step.id===pipelineStep
          const cls=isDone?'done':isAct?'active':'pending'
          return (
            <span key={step.id} style={{display:'flex',alignItems:'center',gap:5}}>
              <span className={`pipe-step ${cls}`}>
                {isDone&&<span className="material-symbols-outlined" style={{fontSize:12}}>check</span>}
                {isAct&&<span className="dot dot-blue" style={{width:5,height:5}}/>}
                {step.label}
              </span>
              {i<STEPS.length-1&&<span style={{color:'var(--outline-v)',fontSize:10}}>—</span>}
            </span>
          )
        })}
      </div>
    </div>
  )
}
