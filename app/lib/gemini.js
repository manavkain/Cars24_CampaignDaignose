const MODEL = 'gemini-2.0-flash'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

async function call(prompt, apiKey) {
  if (!apiKey) throw new Error('No Gemini API key. Add it in Settings.')
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

export async function diagnoseCampaign(metrics, deltas, log, apiKey) {
  const prompt = `You are a performance marketing AI for Cars24 India. Diagnose this campaign. Return ONLY valid JSON, no markdown.

Metrics: ${JSON.stringify(metrics)}
7d deltas: ${JSON.stringify(deltas)}
Previous fixes: ${JSON.stringify(log?.slice(0, 3))}

Return exactly:
{"issues":[{"id":"1","type":"creative_fatigue|audience_saturation|bid_floor|budget_pacing|landing_page","severity":"high|medium|low","evidence":"1-2 sentences with specific metrics","confidence":0}],"fixes":{"creative":[{"label":"tone","headline":"under 8 words","body":"1-2 sentences"},{"label":"tone","headline":"...","body":"..."},{"label":"tone","headline":"...","body":"..."}],"audience":{"brief":"","exclusions":"","lookalike_seed":""},"bidding":{"recommendation":"","delta_pct":0,"risk":"low|medium|high"},"budget":{"reallocation_map":""}},"summary":"one sentence"}`
  return JSON.parse(clean(await call(prompt, apiKey)))
}

export async function chatWithAI(history, context, apiKey) {
  const ctx = context ? `Campaign context: ${JSON.stringify(context)}\n\n` : ''
  const hist = history.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n')
  const prompt = `You are an expert performance marketing AI assistant for Cars24 India. Be concise, specific, actionable. Use bullet points for lists. Reference actual metrics when available.\n\n${ctx}${hist}\nAI:`
  return await call(prompt, apiKey)
}

export async function generateCopy(brief, apiKey) {
  const prompt = `Write 3 Facebook ad copy variants for Cars24 India.\nBrief: ${brief}\nReturn ONLY JSON: {"variants":[{"label":"tone","headline":"under 8 words","body":"1-2 sentences"},{"label":"tone","headline":"...","body":"..."},{"label":"tone","headline":"...","body":"..."}]}`
  return JSON.parse(clean(await call(prompt, apiKey)))
}
