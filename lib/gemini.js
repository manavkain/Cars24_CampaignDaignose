async function call(prompt, settings) {
  const { apiKey, aiProvider = 'gemini' } = settings
  if (!apiKey) throw new Error(`No ${aiProvider} API key. Add it in Settings.`)

  if (aiProvider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    })
    if (!res.ok) { const e = await res.json(); throw new Error(e?.error?.message || `OpenAI ${res.status}`) }
    const d = await res.json()
    return d.choices?.[0]?.message?.content ?? ''
  }

  if (aiProvider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true' // In a real app, this should be proxied
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    if (!res.ok) { const e = await res.json(); throw new Error(e?.error?.message || `Anthropic ${res.status}`) }
    const d = await res.json()
    return d.content?.[0]?.text ?? ''
  }

  // Default: Gemini
  const MODEL = 'gemini-2.0-flash'
  const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`
  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 2048 } }),
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e?.error?.message || `Gemini ${res.status}`) }
  const d = await res.json()
  return d.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

function clean(raw) { return raw.replace(/```json|```/g, '').trim() }

export async function diagnoseCampaign(metrics, deltas, log, settings) {
  const prompt = `You are a performance marketing AI for Cars24 India. Diagnose this campaign.

India auto-sector benchmarks:
- CTR: 1.5–2.5% (below 1% = critical)
- CPC: ₹25–45 (above ₹60 = critical)  
- ROAS: 2.5–4x (below 2x = critical)
- Frequency: 2–3.5 (above 4.5 = fatigue risk)
- CPL: ₹200–320 (above ₹400 = critical)

Compare metrics against these benchmarks in your evidence.
Return ONLY valid JSON, no markdown.

Metrics: ${JSON.stringify(metrics)}
7d deltas: ${JSON.stringify(deltas)}
Previous fixes: ${JSON.stringify(log?.slice(0, 3))}

Return exactly:
{"issues":[{"id":"1","type":"creative_fatigue|audience_saturation|bid_floor|budget_pacing|landing_page","severity":"high|medium|low","evidence":"1-2 sentences with specific metrics","confidence":0}],"fixes":{"creative":[{"label":"tone","headline":"under 8 words","body":"1-2 sentences"},{"label":"tone","headline":"...","body":"..."},{"label":"tone","headline":"...","body":"..."}],"audience":{"brief":"","exclusions":"","lookalike_seed":""},"bidding":{"recommendation":"","delta_pct":0,"risk":"low|medium|high"},"budget":{"reallocation_map":""}},"summary":"one sentence"}`
  return JSON.parse(clean(await call(prompt, settings)))
}

export async function chatWithAI(history, context, settings) {
  const ctx = context ? `Campaign context: ${JSON.stringify(context)}\n\n` : ''
  const hist = history.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n')
  const prompt = `You are an expert performance marketing AI assistant for Cars24 India. Be concise, specific, actionable. Use bullet points for lists. Reference actual metrics when available.\n\n${ctx}${hist}\nAI:`
  return await call(prompt, settings)
}

export async function generateCopy(brief, settings) {
  const prompt = `Write 3 Facebook ad copy variants for Cars24 India.\nBrief: ${brief}\nReturn ONLY JSON: {"variants":[{"label":"tone","headline":"under 8 words","body":"1-2 sentences"},{"label":"tone","headline":"...","body":"..."},{"label":"tone","headline":"...","body":"..."}]}`
  return JSON.parse(clean(await call(prompt, settings)))
}

export async function generateWeeklyReport(log, settings) {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const weekLog = log.filter(e => new Date(e.date) >= sevenDaysAgo)

  const prompt = `You are a performance marketing AI for Cars24 India. Write a concise weekly campaign performance narrative for the marketing team.

Based on this week's improvement log data:
${JSON.stringify(weekLog)}

Write a professional 150-200 word summary covering:
1. Overall week performance (wins, losses, pending)
2. Most impactful fix deployed
3. Key issue patterns detected
4. Recommendation for next week

Tone: direct, data-driven, no fluff. Written for a senior marketing manager.
Return plain text only — no JSON, no markdown, no bullet points. Pure narrative paragraphs.`

  return await call(prompt, settings)
}

export async function analyzeCompetitorStrategy(competitor, ads, settings) {
  const prompt = `Analyze this competitor's advertising strategy for Cars24 India based on their current active ads.
Competitor: ${competitor}
Ads: ${JSON.stringify(ads)}

Return ONLY JSON:
{"hook":"...","strategy":"...","recommendation":"...","confidence":0}`
  return JSON.parse(clean(await call(prompt, settings)))
}

export async function generateCampaignLaunchpad(brief, settings) {
  const prompt = `Architect a full campaign structure for Cars24 India based on this brief: ${brief}
Return ONLY JSON:
{"name":"...","objective":"...","platforms":["..."],"audiences":[{"name":"...","description":"...","weight":"..."}],"creatives":[{"title":"...","headline":"...","body":"..."}],"bidding":{"strategy":"...","recommendation":"...","logic":"..."},"budget":{"daily":"...","duration":"...","total":"..."}}`
  return JSON.parse(clean(await call(prompt, settings)))
}

export async function scoreCampaignStrategy(campaign, settings) {
  const prompt = `Audit this generated campaign structure for potential friction points and give it a predicted success score.
Campaign: ${JSON.stringify(campaign)}

Return ONLY JSON:
{"score":0,"friction_points":["..."],"fixes":["..."],"summary":"..."}`
  return JSON.parse(clean(await call(prompt, settings)))
}
