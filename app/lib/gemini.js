const MODEL = 'gemini-2.0-flash'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

async function callGemini(prompt, apiKey) {
  if (!apiKey) throw new Error('No Gemini API key. Add it in Settings.')
  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error?.message || `Gemini error ${res.status}`)
  }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

function cleanJSON(raw) {
  return raw.replace(/```json|```/g, '').trim()
}

export async function diagnoseCampaign(metrics, deltas, deployedFixes, apiKey) {
  const prompt = `You are a performance marketing AI analyst for Cars24, India's largest used car marketplace.
Diagnose this campaign and return ONLY valid JSON — no markdown, no explanation.

Metrics: ${JSON.stringify(metrics)}
7-day deltas: ${JSON.stringify(deltas)}
Previously deployed fixes: ${JSON.stringify(deployedFixes)}

Return exactly this shape:
{
  "issues": [
    { "id": "1", "type": "creative_fatigue|audience_saturation|bid_floor|budget_pacing|landing_page", "severity": "high|medium|low", "evidence": "specific metric that proves this in 1-2 sentences", "confidence": 0-100 }
  ],
  "fixes": {
    "creative": [
      { "label": "tone name", "headline": "ad headline under 8 words", "body": "ad body copy 1-2 sentences" },
      { "label": "tone name", "headline": "...", "body": "..." },
      { "label": "tone name", "headline": "...", "body": "..." }
    ],
    "audience": { "brief": "who to target", "exclusions": "who to exclude", "lookalike_seed": "seed audience" },
    "bidding": { "recommendation": "what to change and why", "delta_pct": 0, "risk": "low|medium|high" },
    "budget": { "reallocation_map": "how to redistribute spend" }
  },
  "summary": "one sentence overall diagnosis"
}`
  const raw = await callGemini(prompt, apiKey)
  return JSON.parse(cleanJSON(raw))
}

export async function chatWithAI(messages, campaignContext, apiKey) {
  const contextStr = campaignContext
    ? `\nCurrent campaign context: ${JSON.stringify(campaignContext)}\n`
    : ''

  const history = messages.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n')

  const prompt = `You are an expert performance marketing AI assistant for Cars24.${contextStr}
You help diagnose campaign issues, write ad copy, and optimize Meta/Google campaigns.
Be concise, specific, and actionable. Use bullet points for lists. Reference actual metrics when available.

Conversation:
${history}
AI:`

  return await callGemini(prompt, apiKey)
}

export async function generateCopy(brief, apiKey) {
  const prompt = `Write 3 Facebook ad copy variants for Cars24 (India's largest used car marketplace).
Brief: ${brief}

Return ONLY valid JSON:
{
  "variants": [
    { "label": "tone", "headline": "headline under 8 words", "body": "1-2 sentence ad copy" },
    { "label": "tone", "headline": "...", "body": "..." },
    { "label": "tone", "headline": "...", "body": "..." }
  ]
}`
  const raw = await callGemini(prompt, apiKey)
  return JSON.parse(cleanJSON(raw))
}
