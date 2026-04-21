export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'No sheet ID' }, { status: 400 })
  try {
    const url = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=0`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Sheet fetch failed. Make sure sheet is public.')
    const csv = await res.text()
    const lines = csv.trim().split('\n').map(l => l.split(',').map(v => v.trim().replace(/"/g, '')))
    if (lines.length < 2) throw new Error('Sheet needs header row + data row')
    const headers = lines[0].map(h => h.toLowerCase().replace(/\s+/g, '_'))
    const values = lines[1]
    const row = {}
    headers.forEach((h, i) => { row[h] = values[i] || '' })
    const data = {
      ctr: parseFloat(row.ctr) || 0,
      cpc: parseFloat(row.cpc) || 0,
      cpl: parseFloat(row.cpl) || 0,
      roas: parseFloat(row.roas) || 0,
      frequency: parseFloat(row.frequency) || 0,
      spend: parseFloat(row.spend) || 0,
      conversions: parseInt(row.conversions) || 0,
      impressions: parseInt(row.impressions) || 0,
      clicks: parseInt(row.clicks) || 0,
      campaign: row.campaign || 'Unnamed',
      platform: row.platform || 'Meta',
      objective: row.objective || '',
      audience: row.audience || '',
    }
    return Response.json(data)
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
