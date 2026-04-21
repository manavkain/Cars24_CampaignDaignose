'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'

const METRICS_LIST = ['CTR','CPC','CPL','ROAS','Frequency','Spend','Conversions','Impressions']
const OPS = ['>','<','>=','<=','=']
const ACTIONS = ['Flag Creative Fatigue','Flag Audience Saturation','Flag Budget Risk','Auto-Diagnose + Notify','Pause Campaign','Increase Bid 10%','Decrease Budget 20%','Send Alert','Log to Airtable','Generate Fix Recommendations']

function RuleRow({ rule, onChange, onDelete, onToggle }) {
  const sev = rule.severity
  return (
    <div className="logic-rule animate-fade-in">
      <div className={`toggle-track ${rule.active ? 'on' : ''}`} onClick={() => onToggle(rule.id)} style={{ cursor: 'pointer' }}>
        <div className="toggle-thumb" />
      </div>
      <span className="tag tag-if">IF</span>
      <select value={rule.metric} onChange={e => onChange(rule.id,'metric',e.target.value)} style={{ width: 110, fontSize: 12, padding: '5px 7px' }}>
        {METRICS_LIST.map(m => <option key={m}>{m}</option>)}
      </select>
      <select value={rule.operator} onChange={e => onChange(rule.id,'operator',e.target.value)} style={{ width: 52, fontSize: 12, padding: '5px 6px', textAlign: 'center' }}>
        {OPS.map(o => <option key={o}>{o}</option>)}
      </select>
      <input type="number" value={rule.value} onChange={e => onChange(rule.id,'value',e.target.value)} style={{ width: 64, fontSize: 12, padding: '5px 7px' }} />
      <span className="tag tag-then">THEN</span>
      <select value={rule.action} onChange={e => onChange(rule.id,'action',e.target.value)} style={{ flex: 1, fontSize: 12, padding: '5px 7px', minWidth: 160 }}>
        {ACTIONS.map(a => <option key={a}>{a}</option>)}
      </select>
      <select value={rule.severity} onChange={e => onChange(rule.id,'severity',e.target.value)} style={{ width: 82, fontSize: 12, padding: '5px 7px' }}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button onClick={() => onDelete(rule.id)} style={{ width: 26, height: 26, borderRadius: 5, border: 'none', background: 'var(--red-bg)', color: 'var(--red)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', margin: 0 }}>Logic Maker</h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>IF/THEN rules that auto-trigger actions when metrics cross thresholds.</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={test}>▶ Test Against Live Metrics</button>
          <button className="btn btn-ghost btn-sm" onClick={add}>+ Add Rule</button>
          <button className="btn btn-blue btn-sm" onClick={save}>{saved ? '✓ Saved' : 'Save Rules'}</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[{ l: 'Total rules', v: logicRules.length }, { l: 'Active', v: active, c: 'var(--green)' }, { l: 'Inactive', v: logicRules.length - active, c: 'var(--t4)' }].map(s => (
          <div key={s.l} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: s.c || 'var(--t1)' }}>{s.v}</span>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>{s.l}</span>
          </div>
        ))}
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', gap: 8, padding: '0 12px', fontSize: 10, color: 'var(--t4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>
        <span style={{ width: 34 }}></span><span style={{ width: 28 }}></span><span style={{ width: 110 }}>Metric</span><span style={{ width: 52 }}>Op</span><span style={{ width: 64 }}>Value</span><span style={{ width: 36 }}></span><span style={{ flex: 1 }}>Action</span><span style={{ width: 82 }}>Severity</span><span style={{ width: 26 }}></span>
      </div>

      <div className="card" style={{ flex: 1, overflow: 'auto' }}>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {logicRules.length === 0
            ? <div className="empty-state"><div className="icon">⚙</div><div className="title">No rules yet</div><div className="sub">Click "+ Add Rule" to build your first automation.</div></div>
            : logicRules.map(r => <RuleRow key={r.id} rule={r} onChange={upd} onDelete={del} onToggle={tog} />)}
        </div>
      </div>

      {testResult !== null && (
        <div className="card animate-fade-in">
          <div className="card-header">
            <span className="card-title">Test Results — Current Metrics</span>
            <button onClick={() => setTestResult(null)} style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
          <div className="card-body">
            {testResult.length === 0
              ? <div style={{ color: 'var(--green)', fontSize: 13, fontWeight: 500 }}>✓ No rules triggered. All metrics within thresholds.</div>
              : <div>
                  <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 8 }}><span style={{ color: 'var(--red)', fontWeight: 600 }}>{testResult.length} rule{testResult.length > 1 ? 's' : ''} triggered</span> against current metrics:</div>
                  {testResult.map(r => {
                    const val = { CTR: metrics.ctr, CPC: metrics.cpc, Frequency: metrics.frequency, ROAS: metrics.roas, CPL: metrics.cpl }[r.metric]
                    return (
                      <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--red-bg)', border: '1px solid var(--red-bd)', borderRadius: 7, padding: '8px 11px', marginBottom: 5 }}>
                        <span className={`badge ${r.severity === 'high' ? 'badge-red' : r.severity === 'medium' ? 'badge-amber' : 'badge-green'}`}>{r.severity}</span>
                        <span style={{ fontSize: 12, color: 'var(--t1)', flex: 1 }}>{r.metric} {r.operator} {r.value} → <strong>{r.action}</strong></span>
                        <span style={{ fontSize: 11, color: 'var(--t3)' }}>current: {val ?? '—'}</span>
                      </div>
                    )
                  })}
                </div>}
          </div>
        </div>
      )}
    </div>
  )
}
