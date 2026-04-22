'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'

const METRICS_LIST = ['CTR','CPC','CPL','ROAS','Frequency','Spend','Conversions','Impressions']
const OPS = ['>','<','>=','<=','=']
const ACTIONS = ['Flag Creative Fatigue','Flag Audience Saturation','Flag Budget Risk','Auto-Diagnose + Notify','Pause Campaign','Increase Bid 10%','Decrease Budget 20%','Send Alert','Log to Airtable','Generate Fix Recommendations']

function RuleRow({ rule, onChange, onDelete, onToggle }) {
  return (
    <div className="logic-rule animate-fade-in" style={{background: rule.active ? 'var(--surface-white)' : 'var(--surface-low)', opacity: rule.active ? 1 : 0.7, transition: 'all .2s', padding: '12px 16px', borderRadius: 12, border: rule.active ? '1px solid rgba(0,88,148,0.15)' : '1px solid rgba(192,199,211,0.2)'}}>
      <div className={`toggle-track ${rule.active ? 'on' : ''}`} onClick={() => onToggle(rule.id)} style={{ cursor: 'pointer' }}>
        <div className="toggle-thumb" />
      </div>
      <span className="tag tag-if" style={{marginLeft: 8}}>IF</span>
      <select value={rule.metric} onChange={e => onChange(rule.id,'metric',e.target.value)} style={{ width: 120, fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>
        {METRICS_LIST.map(m => <option key={m}>{m}</option>)}
      </select>
      <select value={rule.operator} onChange={e => onChange(rule.id,'operator',e.target.value)} style={{ width: 60, fontSize: 13, fontWeight: 700, color: 'var(--primary)', textAlign: 'center' }}>
        {OPS.map(o => <option key={o}>{o}</option>)}
      </select>
      <input type="number" value={rule.value} onChange={e => onChange(rule.id,'value',e.target.value)} style={{ width: 80, fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }} />
      <span className="tag tag-then">THEN</span>
      <select value={rule.action} onChange={e => onChange(rule.id,'action',e.target.value)} style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', minWidth: 180 }}>
        {ACTIONS.map(a => <option key={a}>{a}</option>)}
      </select>
      <select value={rule.severity} onChange={e => onChange(rule.id,'severity',e.target.value)} style={{ width: 95, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>
        <option value="high">Critical</option>
        <option value="medium">Warning</option>
        <option value="low">Notice</option>
      </select>
      <button className="btn btn-ghost" onClick={() => onDelete(rule.id)} style={{ width: 32, height: 32, padding: 0, justifyContent: 'center', border: 'none', background: 'var(--surface-high)', color: 'var(--error)' }}>
         <span className="material-symbols-outlined" style={{fontSize: 18}}>delete</span>
      </button>
    </div>
  )
}

export default function CustomLogicMaker() {
  const { logicRules, saveLogicRules, metrics } = useApp()
  const [testResult, setTestResult] = useState(null)
  const [saved, setSaved] = useState(false)

  function add() {
    saveLogicRules([...logicRules, { id: Date.now().toString(), active: true, metric: 'Frequency', operator: '>', value: '4', action: 'Flag Creative Fatigue', severity: 'high' }])
  }
  function upd(id, f, v) { saveLogicRules(logicRules.map(r => r.id === id ? { ...r, [f]: v } : r)) }
  function del(id) { saveLogicRules(logicRules.filter(r => r.id !== id)) }
  function tog(id) { saveLogicRules(logicRules.map(r => r.id === id ? { ...r, active: !r.active } : r)) }

  function test() {
    const map = { CTR: metrics.ctr, CPC: metrics.cpc, CPL: metrics.cpl, ROAS: metrics.roas, Frequency: metrics.frequency, Spend: metrics.spend, Conversions: metrics.conversions }
    const triggered = logicRules.filter(r => {
      if (!r.active) return false
      const val = map[r.metric]; if (val === undefined) return false
      const t = parseFloat(r.value)
      return r.operator === '>' ? val > t : r.operator === '<' ? val < t : r.operator === '>=' ? val >= t : r.operator === '<=' ? val <= t : val === t
    })
    setTestResult(triggered)
  }

  function save() {
    saveLogicRules(logicRules)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const active = logicRules.filter(r => r.active).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontFamily: 'Manrope,sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--on-surface)', margin: 0, letterSpacing: '-0.02em' }}>Logic Maker</h2>
          <p style={{ fontSize: 15, color: 'var(--on-surface-v)', marginTop: 8 }}>Build custom IF/THEN protocols to automate campaign anomaly detection.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={test}>
            <span className="material-symbols-outlined" style={{fontSize: 18}}>play_circle</span> Test against Live
          </button>
          <button className="btn btn-ghost" onClick={add}>
             <span className="material-symbols-outlined" style={{fontSize: 18}}>add_circle</span> New Rule
          </button>
          <button className="btn btn-primary" onClick={save} style={{padding: '10px 24px'}}>
             {saved ? '✓ Policy Saved' : 'Deploy Rules'}
          </button>
        </div>
      </div>

      {/* Stats - Stitch style */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { l: 'Active Rules', v: active, c: '#16a34a' },
          { l: 'Paused', v: logicRules.length - active, c: 'var(--outline)' },
          { l: 'Total Nodes', v: logicRules.length, c: 'var(--primary)' }
        ].map(s => (
          <div key={s.l} style={{ background: 'var(--surface-white)', border: '1px solid rgba(192,199,211,0.15)', borderRadius: 12, padding: '12px 20px', display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: s.c, fontFamily: 'Manrope,sans-serif' }}>{s.v}</span>
            <span style={{ fontSize: 11, color: 'var(--outline)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.l}</span>
          </div>
        ))}
      </div>

      {/* Rule grid */}
      <div className="card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="card-header" style={{background: 'var(--surface-low)', padding: '12px 20px'}}>
           <div style={{ display: 'flex', gap: 8, width: '100%', fontSize: 10, color: 'var(--outline)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>
            <span style={{ width: 44 }}></span><span style={{ width: 120 }}>Metric Parameter</span><span style={{ width: 60, textAlign: 'center' }}>Op</span><span style={{ width: 80 }}>Value</span><span style={{ width: 48 }}></span><span style={{ flex: 1 }}>Automated Action</span><span style={{ width: 95 }}>Severity</span><span style={{ width: 32 }}></span>
          </div>
        </div>
        <div className="card-body" style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--surface-cont)' }}>
          {logicRules.length === 0
            ? <div className="empty-state">
                <span className="material-symbols-outlined" style={{fontSize: 48, opacity: .3, color: 'var(--primary)'}}>rule</span>
                <div className="title">No rules established</div>
                <div className="sub">Click "+ New Rule" to define your first automation protocol.</div>
              </div>
            : logicRules.map(r => <RuleRow key={r.id} rule={r} onChange={upd} onDelete={del} onToggle={tog} />)}
        </div>
      </div>

      {testResult !== null && (
        <div className="card animate-slide-up" style={{ position: 'fixed', bottom: 24, right: 24, width: 480, boxShadow: '0 20px 50px rgba(0,0,0,0.15)', zIndex: 100, border: '1px solid var(--primary-c)' }}>
          <div className="card-header" style={{background: 'var(--primary-c)', color: '#fff'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <span className="material-symbols-outlined" style={{fontSize: 20}}>biotech</span>
              <span className="card-title" style={{color: '#fff'}}>Live Policy Audit</span>
            </div>
            <button onClick={() => setTestResult(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>✕</button>
          </div>
          <div className="card-body" style={{maxHeight: 400, overflow: 'auto'}}>
            {testResult.length === 0
              ? <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#16a34a', fontSize: 14, fontWeight: 600 }}>
                  <span className="material-symbols-outlined">check_circle</span>
                  Compliance Verified. No policies triggered.
                </div>
              : <div>
                  <div style={{ fontSize: 13, color: 'var(--on-surface-v)', marginBottom: 12, fontWeight: 500 }}>
                    <span style={{ color: 'var(--error)', fontWeight: 800 }}>{testResult.length} Policies Triggered</span> against current campaign telemetry:
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                    {testResult.map(r => {
                      const val = { CTR: metrics.ctr, CPC: metrics.cpc, Frequency: metrics.frequency, ROAS: metrics.roas, CPL: metrics.cpl, Spend: metrics.spend, Conversions: metrics.conversions }[r.metric]
                      return (
                        <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-low)', border: '1px solid rgba(186,26,26,0.1)', borderRadius: 10, padding: '10px 14px' }}>
                          <span className={`badge ${r.severity === 'high' ? 'badge-red' : 'badge-amber'}`} style={{fontSize: 9}}>{r.severity}</span>
                          <div style={{ fontSize: 13, color: 'var(--on-surface)', flex: 1, fontWeight: 500 }}>
                             {r.metric} <span style={{color: 'var(--primary)', fontWeight: 800}}>{r.operator}</span> {r.value} → <span style={{fontWeight: 800}}>{r.action}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                             <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--on-surface)' }}>{val ?? '—'}</div>
                             <div style={{ fontSize: 9, color: 'var(--outline)', textTransform: 'uppercase' }}>Current</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>}
          </div>
        </div>
      )}
    </div>
  )
}
