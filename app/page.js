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
import Intel from '../components/pages/Intel'
import Launch from '../components/pages/Launch'

const PAGE_META = {
  detect:           { title: 'Detect',           sub: 'Live campaign pulse & detection' },
  diagnose:         { title: 'Diagnose',         sub: 'AI campaign analysis & insights' },
  act:              { title: 'Act',              sub: 'Execute fixes & automated logic' },
  intel:            { title: 'Intel',            sub: 'Competitor tracker & market intel' },
  launch:           { title: 'Launch',           sub: 'Campaign structure & launchpad' },
  log:              { title: 'Log',              sub: 'Improvement & action history' },
  settings:         { title: 'Settings',          sub: 'API keys, thresholds & config' },
}

function AppContent() {
  const [view, setView] = useState('detect')
  const [activeTab, setActiveTab] = useState('Overview')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const meta = PAGE_META[view] || { title: view, sub: '' }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--surface)' }}>
      <Sidebar 
        view={view} 
        setView={(v) => { setView(v); if(v !== 'detect') setActiveTab('Overview') }} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar 
          title={meta.title} 
          subtitle={meta.sub} 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setView('detect'); setActiveTab(tab); }} 
        />
        <main style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          {view === 'detect'    && <MainDashboard activeTab={activeTab} />}
          {view === 'diagnose'  && <AIChat />}
          {view === 'act'       && <CustomLogicMaker />}
          {view === 'intel'     && <Intel />}
          {view === 'launch'    && <Launch />}
          {view === 'log'       && <CustomDashboard />}
          {view === 'settings'  && <Settings />}
        </main>
      </div>
    </div>
  )
}

export default function Page() {
  return <AppProvider><AppContent /></AppProvider>
}
