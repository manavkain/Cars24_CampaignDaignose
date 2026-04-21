export async function POST(req) {
  const { webhookUrl, payload } = await req.json()
  if (!webhookUrl) return Response.json({ error: 'No webhook URL' }, { status: 400 })
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return Response.json({ ok: res.ok, status: res.status })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
