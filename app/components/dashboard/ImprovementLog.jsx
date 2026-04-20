'use client'
import { useState } from 'react'
import { useApp } from '../AppContext'

const RESULT_STYLES = {
  up:      { label: '↑ Up',      color: 'var(--green)',  bg: 'var(--green-bg)' },
  down:    { label: '↓ Down',    color: 'var(--red)',    bg: 'var(--red-bg)' },
  flat:    { label: '→ Flat',    color: 'var(--text-muted)', bg: 'var(--bg-elevated)' },
  pending: { label: '⏳ Pending', color: 'var(--amber)',  bg: 'var(--amber-bg)' },
}

export default function ImprovementLog() {
  const { log, updateLogEntry, settings } = useApp()
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const deployed = log.length
  const positive = log.filter(l => l.result === 'up').length
  const pending = log.filter(l => l.result === 'pending').length

  async function exportToAirtable() {
    if (!settings.webhookUrl) {
      alert('Add your Make.com webhook URL in Settings first.')
      return
    }
    try {
      await fetch(settings.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log }),
      })
      alert('Exported to Airtable!')
    } catch (e) {
      alert('Export failed: ' + e.message)
    }
  }

  function startEdit(entry) {
    setEditingId(entry.id)
    setEditForm({ after: entry.after, result: entry.result, notes: entry.notes })
  }

  function saveEdit(id) {
    updateLogEntry(id, editForm)
    setEditingId(null)
  }

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <span className="panel-title">Improvement Log</span>
        <button className="btn btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={exportToAirtable}>
          ↗ Airtable
        </button>
      </div>

      {/* Stats strip */}
      <div style={{
        display: 'flex', gap: 6, padding: '8px 14px',
        borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)',
      }}>
        {[
          { label: 'Deployed', value: deployed },
          { label: 'Positive', value: positive, color: 'var(--green)' },
          { label: 'Pending', value: pending, color: 'var(--amber)' },
          { label: 'Win Rate', value: deployed > 0 ? `${Math.round(positive / deployed * 100)}%` : '—', color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: 'var(--bg-elevated)', borderRadius: 6,
            padding: '5px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: s.color || 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Log table */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {log.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 12 }}>
            No fixes deployed yet. Deploy a fix from Fix Generator to start tracking.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)' }}>
                {['Date', 'Issue', 'Fix', 'Before', 'After', 'Result', ''].map(h => (
                  <th key={h} style={{
                    padding: '6px 10px', textAlign: 'left',
                    color: 'var(--text-muted)', fontWeight: 600,
                    fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em',
                    borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {log.map((entry, i) => {
                const rs = RESULT_STYLES[entry.result] || RESULT_STYLES.pending
                const isEditing = editingId === entry.id
                return (
                  <tr key={entry.id} style={{
                    borderBottom: '1px solid var(--border)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}>
                    <td style={{ padding: '7px 10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{entry.date}</td>
                    <td style={{ padding: '7px 10px', color: 'var(--text-secondary)' }}>{entry.issue}</td>
                    <td style={{ padding: '7px 10px', color: 'var(--text-primary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.fixSummary}
                    </td>
                    <td style={{ padding: '7px 10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{entry.before}</td>
                    <td style={{ padding: '7px 10px' }}>
                      {isEditing ? (
                        <input value={editForm.after} onChange={e => setEditForm(f => ({ ...f, after: e.target.value }))}
                          style={{ fontSize: 11, padding: '2px 5px', width: 80 }} />
                      ) : (
                        <span style={{ color: entry.after ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {entry.after || '—'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '7px 10px' }}>
                      {isEditing ? (
                        <select value={editForm.result} onChange={e => setEditForm(f => ({ ...f, result: e.target.value }))}
                          style={{ fontSize: 10, padding: '2px 4px', width: 80 }}>
                          {Object.keys(RESULT_STYLES).map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                      ) : (
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 99,
                          background: rs.bg, color: rs.color,
                        }}>{rs.label}</span>
                      )}
                    </td>
                    <td style={{ padding: '7px 10px' }}>
                      {isEditing ? (
                        <button className="btn btn-primary" style={{ fontSize: 9, padding: '2px 7px' }} onClick={() => saveEdit(entry.id)}>Save</button>
                      ) : (
                        <button className="btn btn-secondary" style={{ fontSize: 9, padding: '2px 7px' }} onClick={() => startEdit(entry)}>Edit</button>
                      )}
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
