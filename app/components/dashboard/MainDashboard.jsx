'use client'
import { useState } from 'react'
import CampaignPulse from '../dashboard/CampaignPulse'
import DiagnosisFeed from '../dashboard/DiagnosisFeed'
import FixGenerator from '../dashboard/FixGenerator'
import ImprovementLog from '../dashboard/ImprovementLog'

export default function MainDashboard() {
  const [selectedIssue, setSelectedIssue] = useState('1')
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', gridTemplateRows: 'auto 1fr', gap: 10, height: '100%', minHeight: 0 }}>
      {/* Col 1: Pulse + Log */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, gridRow: 'span 2', minHeight: 0 }}>
        <div style={{ flexShrink: 0 }}><CampaignPulse /></div>
        <div style={{ flex: 1, minHeight: 200, overflow: 'hidden' }}><ImprovementLog /></div>
      </div>
      {/* Col 2: Fix Generator (full height) */}
      <div style={{ gridRow: 'span 2', minHeight: 0 }}><FixGenerator selectedId={selectedIssue} /></div>
      {/* Col 3: Diagnosis + Nodes */}
      <div style={{ minHeight: 0 }}><DiagnosisFeed onViewFix={id => setSelectedIssue(id)} /></div>
      <div><NodesPanel /></div>
    </div>
  )
}

function NodesPanel() {
  const { useApp } = require('../AppContext')
  const { settings } = useApp()
  const nodes = [
    { id: '1', name: 'Campaign Input',  type: 'input',  connected: true },
    { id: '2', name: 'Gemini AI',       type: 'ai',     connected: !!settings.geminiKey || true },
    { id: '3', name: 'Fix Generator',   type: 'ai',     connected: true },
    { id: '4', name: 'Google Sheets',   type: 'input',  connected: !!settings.sheetsUrl },
    { id: '5', name: 'Meta Ads',        type: 'ads',    connected: !!settings.connectors?.meta },
    { id: '6', name: 'Google Ads',      type: 'ads',    connected: !!settings.connectors?.google },
    { id: '7', name: 'Airtable Log',    type: 'output', connected: !!settings.webhookUrl },
  ]
  const typeColor = { input: 'var(--blue)', ai: 'var(--green)', ads: 'var(--orange)', output: 'var(--amber)' }
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Connected Nodes</span>
        <span style={{ fontSize: 11, color: 'var(--t3)' }}>{nodes.filter(n => n.connected).length}/{nodes.length} active</span>
      </div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {nodes.map(n => (
          <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 7, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
            <span className="dot" style={{ background: n.connected ? typeColor[n.type] : 'var(--t4)', animation: n.connected ? 'pulsedot 2s infinite' : 'none' }} />
            <span style={{ flex: 1, fontSize: 12, color: n.connected ? 'var(--t1)' : 'var(--t4)' }}>{n.name}</span>
            <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: 'var(--bg-3)', color: 'var(--t3)' }}>{n.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
