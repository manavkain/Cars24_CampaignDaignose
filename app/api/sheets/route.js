export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'No sheet ID' }, { status: 400 })
  try {
    const url = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=0`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Sheet fetch failed. Make sure sheet is public.')
    const csv = await res.text()
    const lines = csv.trim().split('\n').map(line => {
      const result = []
      let current = ''
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') inQuotes = !inQuotes
        else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result.map(v => v.replace(/^"|"$/g, ''))
    })

    if (lines.length < 2) throw new Error('Sheet needs header row + data rows')
    const headers = lines[0].map(h => h.toLowerCase().replace(/\s+/g, '_'))

    const campaigns = lines.slice(1).filter(l => l.some(v => v)).map(values => {
      const row = {}
      headers.forEach((h, i) => { row[h] = values[i] || '' })
      
      const cleanNum = (v) => {
        if (!v) return 0
        const n = parseFloat(v.toString().replace(/[₹,%\s]/g, ''))
        return isNaN(n) ? 0 : n
      }

      return {
        campaign: row.name || row.campaign || 'Unnamed',
        platform: row.platform || 'Meta',
        audience: row.audience || '',
        creative: row.creative || '',
        status: row.status || 'unknown',
        objective: row.objective || '',
        ctr: cleanNum(row.ctr),
        cpc: cleanNum(row.cpc),
        spend: cleanNum(row.spend),
        impressions: cleanNum(row.impressions),
        cpl: cleanNum(row.cpl),
        roas: cleanNum(row.roas),
        frequency: cleanNum(row.frequency),
        conversions: cleanNum(row.conversions),
        clicks: cleanNum(row.clicks),
      }
    })

    return Response.json({ campaigns })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
