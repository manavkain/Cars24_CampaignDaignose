'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { mockMetrics, mockDeltas, mockLog, mockLogicRules, mockNodes } from '../lib/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [settings, setSettings] = useState({
    geminiKey: '',
    webhookUrl: '',
    sheetsUrl: '',
    refreshInterval: 15,
    thresholds: {
      ctr: { green: 2, amber: 1 },
      cpc: { green: 30, amber: 60 },
      roas: { green: 3, amber: 2 },
      frequency: { green: 3, amber: 5 },
      cpl: { green: 250, amber: 400 },
    },
    dashboardLayout: ['pulse', 'diagnosis', 'fix', 'log'],
  })

  const [metrics, setMetrics] = useState(mockMetrics)
  const [deltas, setDeltas] = useState(mockDeltas)
  const [diagnosis, setDiagnosis] = useState(null)
  const [log, setLog] = useState(mockLog)
  const [logicRules, setLogicRules] = useState(mockLogicRules)
  const [nodes, setNodes] = useState(mockNodes)
  const [isContinuous, setIsContinuous] = useState(false)

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ago_settings')
      if (saved) setSettings(prev => ({ ...prev, ...JSON.parse(saved) }))
      const savedLog = localStorage.getItem('ago_log')
      if (savedLog) setLog(JSON.parse(savedLog))
      const savedRules = localStorage.getItem('ago_rules')
      if (savedRules) setLogicRules(JSON.parse(savedRules))
    } catch {}
  }, [])

  function saveSettings(updates) {
    const next = { ...settings, ...updates }
    setSettings(next)
    localStorage.setItem('ago_settings', JSON.stringify(next))
  }

  function addLogEntry(entry) {
    const next = [entry, ...log]
    setLog(next)
    localStorage.setItem('ago_log', JSON.stringify(next))
  }

  function updateLogEntry(id, updates) {
    const next = log.map(l => l.id === id ? { ...l, ...updates } : l)
    setLog(next)
    localStorage.setItem('ago_log', JSON.stringify(next))
  }

  function saveLogicRules(rules) {
    setLogicRules(rules)
    localStorage.setItem('ago_rules', JSON.stringify(rules))
  }

  function getHealth(metric, value) {
    const t = settings.thresholds[metric]
    if (!t) return 'neutral'
    if (metric === 'ctr' || metric === 'roas') {
      if (value >= t.green) return 'green'
      if (value >= t.amber) return 'amber'
      return 'red'
    }
    // For cpc, cpl, frequency — lower is better
    if (value <= t.green) return 'green'
    if (value <= t.amber) return 'amber'
    return 'red'
  }

  return (
    <AppContext.Provider value={{
      settings, saveSettings,
      metrics, setMetrics,
      deltas, setDeltas,
      diagnosis, setDiagnosis,
      log, addLogEntry, updateLogEntry,
      logicRules, saveLogicRules,
      nodes, setNodes,
      isContinuous, setIsContinuous,
      getHealth,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
