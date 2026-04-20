'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'

const METRICS_LIST = ['CTR', 'CPC', 'CPL', 'ROAS', 'Frequency', 'Spend', 'Conversions', 'ROAS_7d_delta', 'CTR_7d_delta']
const OPERATORS = ['>', '<', '>=', '<=', '=']
const ACTIONS = [
  'Flag Creative Fatigue',
  'Flag Audience Saturation',
  'Flag Budget Risk',
  'Auto-Diagnose + Notify',
  'Pause Campaign',
  'Increase Bid 10%',
  'Decrease Budget 20%',
  'Send Slack Alert',
  'Log to Airtable',
  'Generate Fix Recommendations',
]
const SEVERITIES = ['high', 'medium', 'low']

function RuleRow({ rule, onChange, onDelete, onToggle }) {
  return (
    <div className="logic-rule">
      {/* Active toggle */}
      <div
        onClick={() => onToggle(rule.id)}
        style={{
          width: 28, height: 16, borderRadius: 99, cursor: 'pointer',
          background: rule.active ? 'var(--green)' : 'var(--border-strong)',
          position: 'relative', flexShrink: 0, transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute', top: 2,
          left: rule.active ? 14 : 2,
          width: 12, height: 12, borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
        }} />
      </div>

      <span className="tag tag-if">IF</span>

      <select value={rule.metric} onChange={e => onChange(rule.id, 'metric', e.target.value)}
        style={{ width: 110, fontSize: 11, padding: '4px 6px' }}>
        {METRICS_LIST.map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      <select value={rule.operator} onChange={e => onChange(rule.id, 'operator', e.target.value)}
        style={{ width: 50, fontSize: 11, padding: '4px 6px', textAlign: 'center' }}>
        {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
      </select>

      <input type="number" value={rule.value} onChange={e => onChange(rule.id, 'value', e.target.value)}
        style={{ width: 60, fontSize: 11, padding: '4px 6px' }} />

      <span className="tag tag-then">THEN</span>

      <select value={rule.action} onChange={e => onChange(rule.id, 'action', e.target.value)}
        style={{ flex: 1, fontSize: 11, padding: '4px 6px', minWidth: 160 }}>
        {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
      </select>

      <select value={rule.severity} onChange={e => onChange(rule.id, 'severity', e.target.value)}
        style={{ width: 75, fontSize: 11, padding: '4px 6px' }}>
        {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <button onClick={() => onDelete(rule.id)}
        style={{
          width: 24, height: 24, borderRadius: 4, border: 'none',
          background: 'transparent', color: 'var(--red)', cursor: 'pointer',
          fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>✕</button>
    </div>
  )
}

export default function CustomLogicMaker() {
  const { logicRules, saveLogicRules, metrics } = useApp()
  const [testResult, setTestResult] = useState(null)
  const [saved, setSaved] = useState(false)

  function addRule() {
    const newRule = {
      id: Date.now().toString(),
      active: true,
      metric: 'Frequency',
      operator: '>',
      value: '4',
      action: 'Flag Creative Fatigue',
      severity: 'high',
    }
    saveLogicRules([...logicRules, newRule])
  }

  function updateRule(id, field, value) {
    saveLogicRules(logicRules.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  function deleteRule(id) {
    saveLogicRules(logicRules.filter(r => r.id !== id))
  }

  function toggleRule(id) {
    saveLogicRules(logicRules.map(r => r.id === id ? { ...r, active: !r.active } : r))
  }

  function testRules() {
    const metricMap = {
      CTR: metrics.ctr,
      CPC: metrics.cpc,
      CPL: metrics.cpl,
      ROAS: metrics.roas,
      Frequency: metrics.frequency,
      Spend: metrics.spend,
      Conversions: metrics.conversions,
    }
    const triggered = logicRules.filter(rule => {
      if (!rule.active) return false
      const val = metricMap[rule.metric]
      if (val === undefined) return false
      const threshold = parseFloat(rule.value)
      switch (rule.operator) {
        case '>':  return val > threshold
        case '<':  return val < threshold
        case '>=': return val >= threshold
        case '<=': return val <= threshold
        case '=':  return val === threshold
        default: return false
      }
    })
    setTestResult(triggered)
  }

  function saveRules() {
    saveLogicRules(logicRules)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const activeCount = logicRules.filter(r => r.active).length

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Custom Logic Maker</h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '3px 0 0' }}>
            Build IF/THEN rules that auto-trigger actions based on your campaign metrics.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-secondary" onClick={testRules} style={{ fontSize: 11 }}>
            ▶ Test Against Live Metrics
          </button>
          <button className="btn btn-secondary" onClick={addRule} style={{ fontSize: 11 }}>
            + Add Rule
          </button>
          <button className="btn btn-primary" onClick={saveRules} style={{ fontSize: 11 }}>
            {saved ? '✓ Saved' : 'Save Rules'}
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Total rules', value: logicRules.length },
          { label: 'Active', value: activeCount, color: 'var(--green)' },
          { label: 'Inactive', value: logicRules.length - activeCount, color: 'var(--text-muted)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8,
            padding: '7px 14px', display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: s.color || 'var(--text-primary)' }}>{s.value}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Column headers */}
      <div style={{ display: 'flex', gap: 8, padding: '0 12px', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        <span style={{ width: 28 }}></span>
        <span style={{ width: 32 }}></span>
        <span style={{ width: 110 }}>Metric</span>
        <span style={{ width: 50 }}>Op</span>
        <span style={{ width: 60 }}>Value</span>
        <span style={{ width: 40 }}></span>
        <span style={{ flex: 1 }}>Action</span>
        <span style={{ width: 75 }}>Severity</span>
        <span style={{ width: 24 }}></span>
      </div>

      {/* Rules */}
      <div className="panel" style={{ flex: 1, overflow: 'auto' }}>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {logicRules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 12 }}>
              No rules yet. Click "+ Add Rule" to build your first automation.
            </div>
          ) : (
            logicRules.map(rule => (
              <RuleRow key={rule.id} rule={rule} onChange={updateRule} onDelete={deleteRule} onToggle={toggleRule} />
            ))
          )}
        </div>
      </div>

      {/* Test result */}
      {testResult !== null && (
        <div className="panel animate-fade-in">
          <div className="panel-header">
            <span className="panel-title">Test Results — Current Metrics</span>
            <button onClick={() => setTestResult(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14 }}>✕</button>
          </div>
          <div className="panel-body">
            {testResult.length === 0 ? (
              <div style={{ color: 'var(--green)', fontSize: 12 }}>✓ No rules triggered. All metrics within thresholds.</div>
            ) : (
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <span style={{ color: 'var(--red)', fontWeight: 600 }}>{testResult.length} rule{testResult.length > 1 ? 's' : ''} triggered</span> against current metrics:
                </div>
                {testResult.map(rule => (
                  <div key={rule.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 6, padding: '7px 10px', marginBottom: 5,
                  }}>
                    <span className={`badge badge-${rule.severity === 'high' ? 'red' : rule.severity === 'medium' ? 'amber' : 'green'}`}>{rule.severity}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1 }}>
                      {rule.metric} {rule.operator} {rule.value} → <strong>{rule.action}</strong>
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      current: {({'CTR': metrics.ctr, 'CPC': metrics.cpc, 'Frequency': metrics.frequency, 'ROAS': metrics.roas, 'CPL': metrics.cpl})[rule.metric] ?? '—'}
                    </span>
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
