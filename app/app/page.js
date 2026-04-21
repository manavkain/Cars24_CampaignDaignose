'use client'
import { useState } from 'react'
import { AppProvider } from '../components/AppContext'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import MainDashboard from '../components/dashboard/MainDashboard'
import AIChat from '../components/pages/AIChat'
import Reports from '../components/pages/Reports'
import Connectors from '../components/pages/Connectors'
import CustomLogicMaker from '../components/pages/CustomLogicMaker'
import CustomDashboard from '../components/pages/CustomDashboard'
import Settings from '../components/pages/Settings'

const PAGE_META = {
  dashboard:        { title: 'Dashboard',        sub: 'Live campaign intelligence' },
  'ai-chat':        { title: 'AI Assistant',     sub: 'Chat with your campaign data' },
  reports:          { title: 'Reports',           sub: 'Health score & fix performance' },
  connectors:       { title: 'Connectors',        sub: 'Ad platform integrations' },
  'custom-logic':   { title: 'Logic Maker',       sub: 'IF/THEN automation rules' },
  'custom-dashboard':{ title: 'Custom View',      sub: 'Configure your dashboard layout' },
  settings:         { title: 'Settings',          sub: 'API keys, thresholds & config' },
}

function AppContent() {
  const [view, setView] = useState('dashboard')
  const meta = PAGE_META[view] || { title: view, sub: '' }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar view={view} setView={setView} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar title={meta.title} subtitle={meta.sub} />
        <main style={{ flex: 1, overflow: 'auto', padding: 14 }}>
          {view === 'dashboard'         && <MainDashboard />}
          {view === 'ai-chat'           && <AIChat />}
          {view === 'reports'           && <Reports />}
          {view === 'connectors'        && <Connectors />}
          {view === 'custom-logic'      && <CustomLogicMaker />}
          {view === 'custom-dashboard'  && <CustomDashboard />}
          {view === 'settings'          && <Settings />}
        </main>
      </div>
    </div>
  )
}

export default function Page() {
  return <AppProvider><AppContent /></AppProvider>
}
