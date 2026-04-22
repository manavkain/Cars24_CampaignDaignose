'use client'
import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { mockMetrics, mockDeltas, mockLog, mockLogicRules, mockDiagnosis } from '../lib/mockData'
import { diagnoseCampaign } from '../lib/gemini'

const Ctx = createContext(null)

export function AppProvider({ children }) {
  const [settings, setSettings] = useState({
    geminiKey: '', webhookUrl: '', sheetsUrl: '',
    refreshInterval: 15,
    connectors: { meta: false, google: false },
    thresholds: {
      ctr: { green: 2, amber: 1 },
      cpc: { green: 30, amber: 60 },
      roas: { green: 3, amber: 2 },
      frequency: { green: 3, amber: 5 },
      cpl: { green: 250, amber: 400 },
    },
  })
  const [metrics, setMetrics] = useState(mockMetrics)
  const [deltas, setDeltas] = useState(mockDeltas)
  const [diagnosis, setDiagnosis] = useState(mockDiagnosis)
  const [log, setLog] = useState(mockLog)
  const [logicRules, setLogicRules] = useState(mockLogicRules)
  const [isContinuous, setIsContinuous] = useState(false)
  const [pipelineStep, setPipelineStep] = useState('input') // input|diagnose|fix|deploy|track
  const continuousRef = useRef(null)

  useEffect(() => {
    try {
      const s = localStorage.getItem('ago_settings'); if (s) setSettings(p => ({ ...p, ...JSON.parse(s) }))
      const l = localStorage.getItem('ago_log'); if (l) setLog(JSON.parse(l))
      const r = localStorage.getItem('ago_rules'); if (r) setLogicRules(JSON.parse(r))
    } catch {}
  }, [])

  const runDiagnosis = useCallback(async () => {
    setPipelineStep('diagnose')
    try {
      const result = settings.geminiKey
        ? await diagnoseCampaign(metrics, deltas, log, settings.geminiKey)
        : mockDiagnosis
      setDiagnosis(result)
      setPipelineStep('fix')
    } catch (e) {
      alert(e.message)
      setPipelineStep('input')
    }
  }, [metrics, deltas, log, settings.geminiKey])

  // Continuous mode
  useEffect(() => {
    if (isContinuous) {
      runDiagnosis()
      continuousRef.current = setInterval(runDiagnosis, settings.refreshInterval * 60 * 1000)
    } else {
      clearInterval(continuousRef.current)
    }
    return () => clearInterval(continuousRef.current)
  }, [isContinuous, settings.refreshInterval])

  function saveSettings(u) {
    const n = { ...settings, ...u }
    setSettings(n)
    localStorage.setItem('ago_settings', JSON.stringify(n))
  }

  function addLogEntry(e) {
    const n = [e, ...log]
    setLog(n)
    localStorage.setItem('ago_log', JSON.stringify(n))
    setPipelineStep('deploy')
  }

  function updateLogEntry(id, u) {
    const n = log.map(l => l.id === id ? { ...l, ...u } : l)
    setLog(n)
    localStorage.setItem('ago_log', JSON.stringify(n))
  }

  function saveLogicRules(r) {
    setLogicRules(r)
    localStorage.setItem('ago_rules', JSON.stringify(r))
  }

  async function exportToAirtable() {
    if (!settings.webhookUrl) throw new Error('Add Make.com webhook URL in Settings.')
    const res = await fetch('/api/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl: settings.webhookUrl, payload: { log } }),
    })
    const d = await res.json()
    if (!d.ok) throw new Error('Export failed')
  }

  function getHealth(metric, value) {
    const t = settings.thresholds[metric]
    if (!t) return 'neutral'
    if (metric === 'ctr' || metric === 'roas') {
      return value >= t.green ? 'green' : value >= t.amber ? 'amber' : 'red'
    }
    return value <= t.green ? 'green' : value <= t.amber ? 'amber' : 'red'
  }

  return (
    <Ctx.Provider value={{
      settings, saveSettings,
      metrics, setMetrics, deltas, setDeltas,
      diagnosis, setDiagnosis,
      log, addLogEntry, updateLogEntry, exportToAirtable,
      logicRules, saveLogicRules,
      isContinuous, setIsContinuous,
      pipelineStep, setPipelineStep,
      runDiagnosis, getHealth,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp outside AppProvider')
  return c
}
