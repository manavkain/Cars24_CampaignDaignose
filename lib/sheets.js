/**
 * Fetch campaign metrics from a public Google Sheet.
 * Sheet format (Row 1 = headers, Row 2 = values):
 * CTR | CPC | CPL | ROAS | Frequency | Spend | Conversions | Impressions | Clicks | Campaign | Platform
 *
 * Make the sheet public: Share → Anyone with link → Viewer
 * Sheet URL format: https://docs.google.com/spreadsheets/d/{ID}/edit
 */

export async function fetchFromSheets(sheetUrl) {
  const idMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (!idMatch) throw new Error('Invalid Google Sheets URL')
  const id = idMatch[1]

  // Use public CSV export — no API key needed
  const csvUrl = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=0`
  const res = await fetch(csvUrl)
  if (!res.ok) throw new Error('Could not fetch sheet. Make sure it is public.')
  const csv = await res.text()
  return parseCSV(csv)
}

function parseCSV(csv) {
  const lines = csv.trim().split('\n').map(l => l.split(',').map(v => v.trim().replace(/"/g, '')))
  if (lines.length < 2) throw new Error('Sheet must have a header row and at least one data row.')

  const headers = lines[0].map(h => h.toLowerCase().replace(/\s+/g, '_'))
  const values = lines[1]

  const row = {}
  headers.forEach((h, i) => { row[h] = values[i] || '' })

  return {
    ctr: parseFloat(row.ctr) || 0,
    cpc: parseFloat(row.cpc) || 0,
    cpl: parseFloat(row.cpl) || 0,
    roas: parseFloat(row.roas) || 0,
    frequency: parseFloat(row.frequency) || 0,
    spend: parseFloat(row.spend) || 0,
    conversions: parseInt(row.conversions) || 0,
    impressions: parseInt(row.impressions) || 0,
    clicks: parseInt(row.clicks) || 0,
    campaign: row.campaign || 'Unnamed Campaign',
    platform: row.platform || 'Meta',
    objective: row.objective || '',
    audience: row.audience || '',
    placement: row.placement || '',
    format: row.format || '',
  }
}

// Template URL for test data sheet
export const SHEETS_TEMPLATE_HEADERS = 'CTR,CPC,CPL,ROAS,Frequency,Spend,Conversions,Impressions,Clicks,Campaign,Platform,Objective,Audience,Placement,Format'
export const SHEETS_TEMPLATE_EXAMPLE = '1.8,42,380,2.4,4.7,45000,118,512000,9216,Cars24 Q2,Meta,Lead Generation,Auto-intenders 25-45,Feed + Stories,Single Image'
