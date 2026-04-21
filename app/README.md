# AI Growth Operator v2

Post-launch campaign intelligence. SaaS UI. Cars24 brand.

## Deploy

```bash
# Push to GitHub, then:
# vercel.com → New Project → Import → Deploy
npm install && npm run dev   # local: localhost:3000
```

## Setup

1. Open app → **Settings** → add Gemini API key (free: aistudio.google.com)
2. **Connectors** → connect Meta Ads or Google Ads, or paste Sheets URL
3. Toggle **Live mode** in sidebar → auto-diagnoses on interval

## Brand
- 60% `#FFFFFF` neutral white
- 30% `#0071BC` Blue Bliss
- 10% `#F7931E` Overdrive Orange

## What's fixed vs v1
- CORS: Sheets + webhook moved to server-side API routes
- `@keyframes spin` added
- Continuous mode wired with real setInterval
- Sidebar replaces top nav → SaaS layout
- Pipeline strip in TopBar
- Full AI chat with avatar + auto-resize + quick prompts
- Connectors page: Meta Ads, Google Ads, Sheets
- Realistic mock data (not 100% win rate)
- Cars24 brand colors throughout
