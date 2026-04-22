'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'
import { generateWeeklyReport } from '../../lib/gemini'

const RS={
  up:    {l:'↑ Up',    icon:'trending_up',   c:'#155724', bg:'#d4edda'},
  down:  {l:'↓ Down',  icon:'trending_down',  c:'var(--on-error-c)', bg:'var(--error-c)'},
  flat:  {l:'→ Flat',  icon:'trending_flat',  c:'var(--outline)', bg:'var(--surface-high)'},
  pending:{l:'Pending', icon:'schedule',      c:'var(--orange-dark)', bg:'#ffeee2'},
  deployed:{l:'Deployed',icon:'verified',      c:'var(--primary)',     bg:'var(--primary-fixed)'},
}

export default function ImprovementLog(){
  const {log, updateLogEntry, exportToAirtable, settings} = useApp()
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [exporting, setExporting] = useState(false)
  const [reporting, setReporting] = useState(false)
  const [reportText, setReportText] = useState(null)

  const deployed = log.length
  const positive = log.filter(l => l.result === 'up').length
  const winRate = deployed > 0 ? Math.round(positive / deployed * 100) : 0

  async function doExport(){
    setExporting(true)
    try { await exportToAirtable(); alert('Exported!') }
    catch(e) { alert(e.message) }
    finally { setExporting(false) }
  }

  async function doWeeklyReport(){
    if (!settings.geminiKey) { alert('Add Gemini API key in Settings first.'); return }
    setReporting(true)
    setReportText(null)
    try {
      const narrative = await generateWeeklyReport(log, settings.geminiKey)
      setReportText(narrative)
      if (settings.webhookUrl) {
        await fetch('/api/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webhookUrl: settings.webhookUrl,
            payload: {
              type: 'weekly_report',
              report: narrative,
              generatedAt: new Date().toISOString(),
              stats: { deployed, positive, winRate }
            }
          })
        })
      }
    } catch(e) { alert(e.message) }
    finally { setReporting(false) }
  }

  return (
    <div className="card" style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div className="card-header">
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span className="material-symbols-outlined" style={{fontSize:16,color:'var(--secondary)',fontVariationSettings:"'FILL' 1"}}>history_edu</span>
          <span className="card-title">Improvement Log</span>
        </div>
        <div style={{display:'flex',gap:6}}>
          <button className="btn btn-ghost btn-xs" onClick={doWeeklyReport} disabled={reporting}>
            {reporting
              ? <span className="animate-spin">◌</span>
              : <span className="material-symbols-outlined" style={{fontSize:14}}>summarize</span>}
            Weekly Report
          </button>
          <button className="btn btn-ghost btn-xs" onClick={doExport} disabled={exporting}>
            {exporting ? <span className="animate-spin">◌</span> : <span className="material-symbols-outlined" style={{fontSize:14}}>upload</span>}
            Export
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{display:'flex',gap:0,borderBottom:'1px solid rgba(192,199,211,0.1)',background:'var(--surface-low)'}}>
        {[
          {l:'Deployed', v:deployed},
          {l:'Positive',  v:positive, c:'#155724'},
          {l:'Win Rate',  v:`${winRate}%`, c:winRate>=60?'#155724':'var(--orange-dark)'},
          {l:'Pending',   v:log.filter(l=>l.result==='pending').length, c:'var(--orange-dark)'},
        ].map((s,i)=>(
          <div key={s.l} style={{flex:1,padding:'12px 14px',textAlign:'center',borderRight:i<3?'1px solid rgba(192,199,211,0.1)':'none'}}>
            <div style={{fontFamily:'Manrope,sans-serif',fontSize:20,fontWeight:800,color:s.c||'var(--on-surface)',letterSpacing:'-0.02em'}}>{s.v}</div>
            <div style={{fontSize:10,color:'var(--outline)',marginTop:2,fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Weekly Report Output */}
      {reportText && (
        <div style={{
          margin:'12px 16px 0',
          padding:'14px 16px',
          background:'var(--surface-low)',
          borderRadius:10,
          border:'1px solid rgba(192,199,211,0.15)',
          fontSize:13,
          lineHeight:1.7,
          color:'var(--on-surface)',
          whiteSpace:'pre-wrap'
        }}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <span style={{fontSize:11,fontWeight:700,color:'var(--secondary)',textTransform:'uppercase',letterSpacing:'.08em'}}>
              Weekly AI Summary — {new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
            </span>
            <button className="btn btn-ghost btn-xs" onClick={()=>setReportText(null)}>✕</button>
          </div>
          {reportText}
          {settings.webhookUrl && (
            <div style={{marginTop:10,fontSize:11,color:'var(--outline)'}}>✅ Sent to webhook</div>
          )}
        </div>
      )}

      <div style={{flex:1,overflow:'auto'}}>
        {log.length===0?(
          <div className="empty-state">
            <span className="material-symbols-outlined" style={{fontSize:40,opacity:.3,color:'var(--primary)'}}>history_edu</span>
            <div className="title">No fixes deployed yet</div>
            <div className="sub">Deploy a fix to start tracking improvements.</div>
          </div>
        ):(
          <table className="data-table">
            <thead>
              <tr>
                {['Date','Issue','Fix Applied','Before','After','Impact',''].map(h=>(
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {log.map(entry=>{
                const rs = RS[entry.result] || RS.pending
                const isEd = editId === entry.id
                return (
                  <tr key={entry.id}>
                    <td style={{color:'var(--outline)',whiteSpace:'nowrap',fontSize:12,fontWeight:500}}>{entry.date}</td>
                    <td style={{maxWidth:100,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <span className="dot" style={{background:entry.fixType==='Creative'?'var(--primary)':entry.fixType==='Audience'?'#16a34a':'var(--orange)',flexShrink:0}}/>
                        <span style={{fontSize:12,color:'var(--on-surface)',fontWeight:500}}>{entry.issue}</span>
                      </div>
                    </td>
                    <td style={{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      <span style={{display:'inline-block',background:'rgba(194,220,255,0.4)',color:'var(--on-secondary-c)',padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:500}}>{entry.fixSummary}</span>
                    </td>
                    <td style={{color:'var(--outline)',fontSize:12,whiteSpace:'nowrap'}}>{entry.before}</td>
                    <td>
                      {isEd
                        ?<input value={editForm.after} onChange={e=>setEditForm(f=>({...f,after:e.target.value}))} style={{width:90,fontSize:11,padding:'4px 8px'}}/>
                        :<span style={{color:entry.after?'var(--on-surface)':'var(--outline)',fontSize:12}}>{entry.after||'—'}</span>}
                    </td>
                    <td>
                      {isEd
                        ?<select value={editForm.result} onChange={e=>setEditForm(f=>({...f,result:e.target.value}))} style={{width:95,fontSize:11,padding:'4px 6px'}}>{Object.keys(RS).map(k=><option key={k} value={k}>{k}</option>)}</select>
                        :<div style={{display:'flex',alignItems:'center',gap:5,background:rs.bg,padding:'3px 10px',borderRadius:99,width:'fit-content'}}>
                          <span className="material-symbols-outlined" style={{fontSize:12,color:rs.c}}>{rs.icon}</span>
                          <span style={{fontSize:11,fontWeight:700,color:rs.c}}>{rs.l}</span>
                        </div>}
                    </td>
                    <td>
                      {isEd
                        ?<button className="btn btn-primary btn-xs" onClick={()=>{updateLogEntry(entry.id,editForm);setEditId(null)}}>Save</button>
                        :<button className="btn btn-ghost btn-xs" onClick={()=>{setEditId(entry.id);setEditForm({after:entry.after,result:entry.result})}}>Edit</button>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
