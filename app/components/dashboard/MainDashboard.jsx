'use client'
import { useState } from 'react'
import CampaignPulse from '../dashboard/CampaignPulse'
import DiagnosisFeed from '../dashboard/DiagnosisFeed'
import FixGenerator from '../dashboard/FixGenerator'
import ImprovementLog from '../dashboard/ImprovementLog'

export default function MainDashboard() {
  const [selectedIssueId, setSelectedIssueId] = useState('1')

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1.2fr',
      gridTemplateRows: 'auto auto',
      gap: 10,
      height: '100%',
    }}>
      {/* Col 1: Campaign Pulse (top) + Improvement Log (bottom) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, gridRow: 'span 2' }}>
        <div style={{ flex: '0 0 auto' }}>
          <CampaignPulse onDiagnosisComplete={() => {}} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ImprovementLog />
        </div>
      </div>

      {/* Col 2: Fix Generator */}
      <div style={{ gridRow: 'span 2' }}>
        <FixGenerator selectedIssueId={selectedIssueId} />
      </div>

      {/* Col 3: Diagnosis Feed (top) */}
      <div>
        <DiagnosisFeed onViewFix={(id) => setSelectedIssueId(id)} />
      </div>

      {/* Col 3 bottom: Mini nodes panel */}
      <NodesPanel />
    </div>
  )
}

function NodesPanel() {
  const nodes = [
    { id: '1', name: 'Campaign Input', type: 'input', connected: true },
    { id: '2', name: 'Gemini AI', type: 'ai', connected: true },
    { id: '3', name: 'Fix Generator', type: 'ai', connected: true },
    { id: '4', name: 'Airtable Log', type: 'output', connected: false },
    { id: '5', name: 'Google Sheets', type: 'input', connected: true },
  ]
  const typeColors = { input: '#6366f1', ai: '#22c55e', output: '#f59e0b' }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Connected Nodes</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          {nodes.filter(n => n.connected).length}/{nodes.length} active
        </span>
      </div>
      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {nodes.map(node => (
          <div key={node.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 8px', borderRadius: 6,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: node.connected ? typeColors[node.type] : 'var(--text-muted)',
              animation: node.connected ? 'pulse 2s infinite' : 'none',
            }} />
            <span style={{ flex: 1, fontSize: 11, color: node.connected ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {node.name}
            </span>
            <span style={{
              fontSize: 9, padding: '1px 5px', borderRadius: 3,
              background: 'var(--bg-card)', color: 'var(--text-muted)',
            }}>{node.type}</span>
            <span style={{ fontSize: 10, color: node.connected ? 'var(--green)' : 'var(--red)' }}>
              {node.connected ? '●' : '○'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
