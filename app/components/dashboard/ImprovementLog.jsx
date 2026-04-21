'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'

const RS = { up: { l: '↑ Up', c: 'var(--green)', bg: 'var(--green-bg)', bd: 'var(--green-bd)' }, down: { l: '↓ Down', c: 'var(--red)', bg: 'var(--red-bg)', bd: 'var(--red-bd)' }, flat: { l: '→ Flat', c: 'var(--t3)', bg: 'var(--bg-3)', bd: 'var(--border)' }, pending: { l: '⏳ Pending', c: 'var(--amber)', bg: 'var(--amber-bg)', bd: 'var(--amber-bd)' } }

export default function ImprovementLog() {
  const { log, updateLogEntry, exportToAirtable } = useApp()
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [exporting, setExporting] = useState(false)
  const deployed = log.length
  const positive = log.filter(l => l.result === 'up').length
  const winRate = deployed > 0 ? Math.round(positive / deployed * 100) : 0

  async function doExport() {
    setExporting(true)
    try { await exportToAirtable(); alert('Exported!') } catch (e) { alert(e.message) }
    finally { setExporting(false) }
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <span className="card-title">Improvement Log</span>
        <button className="btn btn-ghost btn-xs" onClick={doExport} disabled={exporting}>
          {exporting ? <span className="animate-spin">◌</span> : '↗'} Airtable
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        {[{ l: 'Deployed', v: deployed }, { l: 'Positive', v: positive, c: 'var(--green)' }, { l: 'Win Rate', v: `${winRate}%`, c: winRate >= 60 ? 'var(--green)' : 'var(--amber)' }, { l: 'Pending', v: log.filter(l => l.result === 'pending').length, c: 'var(--amber)' }].map(s => (
          <div key={s.l} style={{ flex: 1, background: 'var(--bg)', borderRadius: 8, padding: '8px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: s.c || 'var(--t1)' }}>{s.v}</div>
            <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 1 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {log.length === 0 ? (
          <div className="empty-state"><div className="icon">◎</div><div className="title">No fixes deployed</div><div className="sub">Deploy a fix from Fix Generator to start tracking.</div></div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Date</th><th>Issue</th><th>Fix</th><th>Before</th><th>After</th><th>Result</th><th></th></tr></thead>
            <tbody>
              {log.map(entry => {
                const rs = RS[entry.result] || RS.pending
                const isEd = editId === entry.id
                return (
                  <tr key={entry.id}>
                    <td style={{ color: 'var(--t3)', whiteSpace: 'nowrap', fontSize: 11 }}>{entry.date}</td>
                    <td style={{ color: 'var(--t2)', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.issue}</td>
                    <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--t1)' }}>{entry.fixSummary}</td>
                    <td style={{ color: 'var(--t3)', whiteSpace: 'nowrap' }}>{entry.before}</td>
                    <td>{isEd ? <input value={editForm.after} onChange={e => setEditForm(f => ({ ...f, after: e.target.value }))} style={{ width: 90, fontSize: 11, padding: '3px 6px' }} /> : <span style={{ color: entry.after ? 'var(--t1)' : 'var(--t4)' }}>{entry.after || '—'}</span>}</td>
                    <td>
                      {isEd
                        ? <select value={editForm.result} onChange={e => setEditForm(f => ({ ...f, result: e.target.value }))} style={{ width: 90, fontSize: 11, padding: '3px 5px' }}>{Object.keys(RS).map(k => <option key={k} value={k}>{k}</option>)}</select>
                        : <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: rs.bg, color: rs.c, border: `1px solid ${rs.bd}` }}>{rs.l}</span>}
                    </td>
                    <td>
                      {isEd
                        ? <button className="btn btn-blue btn-xs" onClick={() => { updateLogEntry(entry.id, editForm); setEditId(null) }}>Save</button>
                        : <button className="btn btn-ghost btn-xs" onClick={() => { setEditId(entry.id); setEditForm({ after: entry.after, result: entry.result }) }}>Edit</button>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
