'use client'
import{useState,useRef,useEffect}from'react'
import{useApp}from'../AppContext'
import{chatWithAI,generateCopy}from'../../lib/gemini'

const QUICK=['Why did my CTR drop this week?','Write 3 ad variants for creative refresh','Analyze audience saturation risk','What bid strategy should I use?','Best budget pacing for end of month?']

function DemoReply(msg,m){
  const l=msg.toLowerCase()
  if(l.includes('ctr')||l.includes('drop'))
    return `Your CTR dropped to **${m.ctr}%** — down ~25% from last week.\n\n**Root cause:** Frequency at ${m.frequency} is the driver. Above 3.5, audiences tune out.\n\n**Fixes:**\n• Refresh creative — 3 new variants\n• Exclude users with 5+ impressions\n• Test new format (video or carousel)\n\nExpect CTR recovery in 48–72h.`
  if(l.includes('bid'))
    return `With ROAS **${m.roas}x** and CPL **₹${m.cpl}**:\n\n• Raise tCPA 10–15% → ~₹425 to unlock inventory\n• Current bid hitting a floor — losing auctions\n• Don't raise >15% at once — needs 24–48h to relearn`
  return `Metrics: CTR **${m.ctr}%** · CPC **₹${m.cpc}** · ROAS **${m.roas}x** · Freq **${m.frequency}**\n\nBiggest risk: frequency ${m.frequency} above 3.5 threshold. Combined with rising CPL = creative fatigue + audience saturation.\n\nWhat area do you want to dig into?`
}

export default function AIChat(){
  const{settings,metrics,diagnosis}=useApp()
  const[msgs,setMsgs]=useState([{role:'ai',content:`Campaign loaded: **${metrics.campaign}**\n\nCTR ${metrics.ctr}% · CPC ₹${metrics.cpc} · ROAS ${metrics.roas}x · Freq ${metrics.frequency}\n\nI've analyzed your metrics. Ask anything.`}])
  const[input,setInput]=useState('')
  const[loading,setLoading]=useState(false)
  const[mode,setMode]=useState('chat')
  const[copyBrief,setCopyBrief]=useState('')
  const[copyResults,setCopyResults]=useState(null)
  const[copyLoading,setCopyLoading]=useState(false)
  const bottomRef=useRef(null)
  const taRef=useRef(null)

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'})},[msgs])

  function resize(){const ta=taRef.current;if(!ta)return;ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,140)+'px'}

  async function send(text){
    const msg=(text||input).trim();if(!msg||loading)return
    setInput('');if(taRef.current)taRef.current.style.height='40px'
    const nm=[...msgs,{role:'user',content:msg}];setMsgs(nm);setLoading(true)
    try{
      let r
      if(settings.geminiKey){r=await chatWithAI(nm,{metrics,summary:diagnosis?.summary},settings.geminiKey)}
      else{await new Promise(x=>setTimeout(x,700+Math.random()*400));r=DemoReply(msg,metrics)}
      setMsgs(p=>[...p,{role:'ai',content:r}])
    }catch(e){setMsgs(p=>[...p,{role:'ai',content:`Error: ${e.message}`}])}
    finally{setLoading(false)}
  }

  async function genCopy(){
    if(!copyBrief.trim())return;setCopyLoading(true)
    try{
      let r
      if(settings.geminiKey){r=await generateCopy(copyBrief,settings.geminiKey)}
      else{
        await new Promise(x=>setTimeout(x,900))
        r={variants:[
          {label:'Urgency',headline:'Book your dream car today',body:"India's most trusted marketplace. Certified pre-owned, instant delivery."},
          {label:'Social Proof',headline:"50,000+ happy buyers can't be wrong",body:"Join India's largest car community. Test drive today, drive home tomorrow."},
          {label:'Value',headline:'Get ₹25,000 more for your old car',body:'Best-in-class exchange value. Switch to your dream car this week.'},
        ]}
      }
      setCopyResults(r.variants)
    }catch(e){alert(e.message)}finally{setCopyLoading(false)}
  }

  function render(text){
    return text.split('\n').map((line,i)=>(
      <span key={i} dangerouslySetInnerHTML={{__html:line.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}} style={{display:'block',lineHeight:line.startsWith('•')?1.75:1.65}}/>
    ))
  }

  return(
    <div style={{height:'100%',display:'flex',flexDirection:'column',gap:0}}>
      <div style={{display:'flex',gap:12,padding:'0 0 16px',alignItems:'center'}}>
        {[{id:'chat',icon:'forum',label:'AI Assistant'},{id:'copy',icon:'brush',label:'Copy Studio'}].map(m=>(
          <button key={m.id} onClick={()=>setMode(m.id)}
            className={`btn ${mode===m.id?'btn-primary':'btn-ghost'}`}
            style={{padding:'10px 18px',boxShadow:mode===m.id?'0 4px 12px rgba(0,88,148,0.25)':'none'}}>
            <span className="material-symbols-outlined" style={{fontSize:18,fontVariationSettings:mode===m.id?"'FILL' 1":"'FILL' 0"}}>{m.icon}</span>
            {m.label}
          </button>
        ))}
        <div style={{flex:1}}/>
        <span className={`badge ${settings.geminiKey?'badge-green':'badge-amber'}`} style={{padding:'6px 14px'}}>
          <span className="dot" style={{background:settings.geminiKey?'#16a34a':'var(--orange)', animation:settings.geminiKey?'pulsedot 2s infinite':'none'}}/>
          {settings.geminiKey?'Gemini Live':'Demo Mode'}
        </span>
      </div>

      {mode==='chat'&&(
        <div className="card" style={{flex:1,display:'flex',flexDirection:'column',minHeight:0, background:'var(--surface-white)'}}>
          <div style={{flex:1,overflow:'auto',padding:'24px 20px',display:'flex',flexDirection:'column',gap:16}}>
            {msgs.map((msg,i)=>(
              <div key={i} className="animate-fade-in" style={{display:'flex',justifyContent:msg.role==='user'?'flex-end':'flex-start',alignItems:'flex-end',gap:10}}>
                {msg.role==='ai'&&(
                  <div style={{width:34,height:34,background:'linear-gradient(135deg,#005894,#0071bc)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 12px rgba(0,88,148,0.25)'}}>
                    <span className="material-symbols-outlined" style={{color:'#fff',fontSize:18,fontVariationSettings:"'FILL' 1"}}>auto_awesome</span>
                  </div>
                )}
                <div className={msg.role==='user'?'bubble-user':'bubble-ai'}>{render(msg.content)}</div>
              </div>
            ))}
            {loading&&(
              <div style={{display:'flex',alignItems:'flex-end',gap:10}}>
                <div style={{width:34,height:34,background:'linear-gradient(135deg,#005894,#0071bc)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px rgba(0,88,148,0.25)'}}>
                  <span className="material-symbols-outlined" style={{color:'#fff',fontSize:18}}>auto_awesome</span>
                </div>
                <div className="bubble-ai" style={{color:'var(--outline)'}}><span className="animate-spin" style={{marginRight:8}}>progress_activity</span>Analyzing campaign intelligence...</div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>
          <div style={{padding:'10px 20px',display:'flex',gap:8,flexWrap:'wrap',borderTop:'1px solid rgba(192,199,211,0.12)',background:'var(--surface-low)'}}>
            {QUICK.map((p,i)=>(
              <button key={i} onClick={()=>send(p)}
                style={{fontSize:11,padding:'6px 12px',borderRadius:99,background:'var(--surface-white)',border:'1px solid rgba(192,199,211,0.3)',color:'var(--on-surface-v)',cursor:'pointer',fontFamily:'Inter,sans-serif',fontWeight:600,transition:'all .2s'}}
                onMouseOver={e=>{e.currentTarget.style.borderColor='var(--primary)';e.currentTarget.style.color='var(--primary)';e.currentTarget.style.transform='translateY(-1px)'}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(192,199,211,0.3)';e.currentTarget.style.color='var(--on-surface-v)';e.currentTarget.style.transform='none'}}
              >{p}</button>
            ))}
          </div>
          <div className="chat-input-wrap">
            <textarea ref={taRef} className="chat-textarea" rows={1} value={input}
              onChange={e=>{setInput(e.target.value);resize()}}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
              placeholder="Ask about your campaign metrics, audience or creative..."/>
            <button className="chat-send-btn" onClick={()=>send()} disabled={loading||!input.trim()}>
              <span className="material-symbols-outlined" style={{fontSize:20}}>send</span>
            </button>
          </div>
        </div>
      )}

      {mode==='copy'&&(
        <div className="card" style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
          <div className="card-header"><span className="card-title">Copy Generation Studio</span></div>
          <div className="card-body" style={{flex:1,overflow:'auto', display:'flex', flexDirection:'column', gap:16}}>
            <div>
              <label>Campaign Objective & Audience Brief</label>
              <textarea rows={4} value={copyBrief} onChange={e=>setCopyBrief(e.target.value)} placeholder="E.g. Cars24 used cars for young professionals in Mumbai, focus on trust and 1-hour home inspection..."/>
            </div>
            <button className="btn btn-orange" onClick={genCopy} disabled={copyLoading||!copyBrief.trim()} style={{alignSelf:'flex-start', padding:'12px 24px'}}>
              {copyLoading?<><span className="material-symbols-outlined animate-spin" style={{fontSize:18}}>progress_activity</span> Synthesizing...</>:<><span className="material-symbols-outlined" style={{fontSize:18,fontVariationSettings:"'FILL' 1"}}>auto_awesome</span> Generate AI Variants</>}
            </button>
            {copyResults&& (
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:12}}>
                {copyResults.map((v,i)=>(
                  <div key={i} style={{background:'var(--surface-white)',borderRadius:12,padding:18,border:'1px solid rgba(192,199,211,0.15)', boxShadow:'0 4px 12px rgba(0,0,0,0.03)', position:'relative'}}>
                    <span className="badge badge-blue" style={{marginBottom:10, textTransform:'uppercase', letterSpacing:'.05em'}}>{v.label}</span>
                    <div style={{fontFamily:'Manrope,sans-serif',fontSize:15,fontWeight:700,color:'var(--on-surface)',marginBottom:8, lineHeight:1.4}}>{v.headline}</div>
                    <div style={{fontSize:13,color:'var(--on-surface-v)',lineHeight:1.6,marginBottom:12}}>{v.body}</div>
                    <button className="btn btn-ghost btn-xs" onClick={()=>navigator.clipboard.writeText(`${v.headline}\n\n${v.body}`)} style={{width:'100%', justifyContent:'center'}}>
                      <span className="material-symbols-outlined" style={{fontSize:14}}>content_copy</span> Copy to Clipboard
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
