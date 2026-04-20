'use client'
import { useState } from 'react'
import { AppProvider } from '../components/AppContext'
import TopNav from '../components/TopNav'
import MainDashboard from '../components/dashboard/MainDashboard'
import Reports from '../components/pages/Reports'
import CustomLogicMaker from '../components/pages/CustomLogicMaker'
import CustomDashboard from '../components/pages/CustomDashboard'
import AITools from '../components/pages/AITools'
import Settings from '../components/pages/Settings'

function AppContent() {
  const [view, setView] = useState('dashboard')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopNav currentView={view} setView={setView} />
      <main style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        {view === 'dashboard'        && <MainDashboard />}
        {view === 'reports'          && <Reports />}
        {view === 'custom-logic'     && <CustomLogicMaker />}
        {view === 'custom-dashboard' && <CustomDashboard />}
        {view === 'ai-tools'         && <AITools />}
        {view === 'admin'            && <AdminPlaceholder />}
        {view === 'settings'         && <Settings />}
      </main>
    </div>
  )
}

function AdminPlaceholder() {
  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Admin</h2>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
        Multi-campaign management, team access, and audit logs. Coming in v2.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {['Multi-campaign view', 'Team roles & access', 'Audit log', 'Export history', 'Webhook management', 'API usage stats'].map(item => (
          <div key={item} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '12px 14px',
            fontSize: 12, color: 'var(--text-secondary)',
          }}>
            <span style={{ marginRight: 6, opacity: 0.4 }}>○</span>{item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
