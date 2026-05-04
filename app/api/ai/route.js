const BASE_OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '' // Use environment variable for security
const DEFAULT_MODEL = 'tencent/hy3-preview:free'

export async function POST(req) {
  try {
    const { prompt, settings, type } = await req.json()
    let { apiKey, aiProvider = 'openrouter' } = settings

    // Aggressive fallback logic
    let useFallback = false;

    if (!apiKey || apiKey.trim() === '' || apiKey === 'undefined' || apiKey.includes('xxx')) {
       useFallback = true;
    } else {
       if (aiProvider === 'gemini' && !apiKey.startsWith('AIza')) useFallback = true;
       if (aiProvider === 'openai' && !apiKey.startsWith('sk-')) useFallback = true;
       if (aiProvider === 'anthropic' && !apiKey.startsWith('sk-ant-')) useFallback = true;
       if (aiProvider === 'openrouter' && !apiKey.startsWith('sk-or-')) useFallback = true;
    }

    if (useFallback) {
      apiKey = BASE_OPENROUTER_KEY
      aiProvider = 'openrouter'
    }

    if (!apiKey || apiKey.includes('xxx')) {
       return Response.json({ error: `No valid API key found. Please hardcode the OpenRouter key in app/api/ai/route.js or provide one in Settings.` }, { status: 400 })
    }

    if (type === 'test') {
      // Simple test to verify the key
      if (aiProvider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        })
        return Response.json({ ok: res.ok })
      }
      if (aiProvider === 'anthropic') {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({ model: 'claude-3-5-sonnet-20240620', max_tokens: 1, messages: [{ role: 'user', content: 'hi' }] })
        })
        return Response.json({ ok: res.ok })
      }
      if (aiProvider === 'openrouter') {
        const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        })
        return Response.json({ ok: res.ok })
      }
      // Gemini test
      const MODEL = 'gemini-2.0-flash'
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] }),
      })
      return Response.json({ ok: res.ok })
    }

    // Actual Call Logic
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
      const d = await res.json()
      if (!res.ok) return Response.json({ error: d?.error?.message || 'OpenAI Error' }, { status: res.status })
      return Response.json({ content: d.choices?.[0]?.message?.content ?? '' })
    }

    if (aiProvider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 2048,
          messages: [{ role: 'user', content: prompt }]
        })
      })
      const d = await res.json()
      if (!res.ok) return Response.json({ error: d?.error?.message || 'Anthropic Error' }, { status: res.status })
      return Response.json({ content: d.content?.[0]?.text ?? '' })
    }

    if (aiProvider === 'openrouter') {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://cars24.ai', 
          'X-Title': 'Cars24 AI Growth Operator'
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          reasoning: { enabled: true } // Enable reasoning as per your snippet
        })
      })
      const d = await res.json()
      if (!res.ok) return Response.json({ error: d?.error?.message || 'OpenRouter Error' }, { status: res.status })
      
      const message = d.choices?.[0]?.message ?? {}
      return Response.json({ 
        content: message.content ?? '',
        reasoning: message.reasoning_details ?? null // Capture reasoning details
      })
    }


    // Default: Gemini
    const MODEL = 'gemini-2.0-flash'
    const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`
    const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: prompt }] }], 
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 } 
      }),
    })
    const d = await res.json()
    if (!res.ok) return Response.json({ error: d?.error?.message || 'Gemini Error' }, { status: res.status })
    return Response.json({ content: d.candidates?.[0]?.content?.parts?.[0]?.text ?? '' })

  } catch (e) {
    console.error('AI Route Error:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}

