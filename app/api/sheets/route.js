export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'No sheet ID' }, { status: 400 })
  try {
    console.log('Fetching sheet:', id)
    const url = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!res.ok) {
      console.error('Sheet fetch failed:', res.status, res.statusText)
      throw new Error(`Sheet fetch failed (${res.status}). Make sure sheet is public ("Anyone with link can view").`)
    }
    
    const csv = await res.text()
    if (!csv || csv.length < 10) {
      throw new Error('Received empty or invalid CSV from Google Sheets.')
    }
    
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
