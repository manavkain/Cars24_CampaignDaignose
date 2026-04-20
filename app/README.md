# AI Growth Operator

Post-launch campaign intelligence. Diagnose → Fix → Track.

## Deploy in 5 minutes

### Option A — Vercel (recommended)

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Framework: Next.js (auto-detected)
4. Deploy → get your live URL

### Option B — Local dev

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Setup after deploy

1. Open the app → click **⚙ Settings**
2. Add your Gemini API key (free at aistudio.google.com)
3. Optionally add Make.com webhook URL for Airtable export
4. Optionally paste a Google Sheets URL with campaign data

## Google Sheets format

Make the sheet public (Share → Anyone with link → Viewer), then paste the URL in Settings.

Row 1 headers (exact):
```
CTR,CPC,CPL,ROAS,Frequency,Spend,Conversions,Impressions,Clicks,Campaign,Platform,Objective,Audience,Placement,Format
```

Row 2 = your values:
```
1.8,42,380,2.4,4.7,45000,118,512000,9216,Cars24 Q2,Meta,Lead Generation,Auto-intenders 25-45,Feed + Stories,Single Image
```

## Pages

| Page | What it does |
|---|---|
| Dashboard | 3-col live view: Pulse + Fix Generator + Diagnosis + Log |
| Reports | Health score, issues summary, fix performance stats |
| Logic Maker | IF/THEN rules that auto-trigger on metric thresholds |
| Custom View | Configure which widgets appear and in what layout |
| AI Tools | Chat with AI about your campaign + copy generator |
| Settings | API keys, thresholds, intervals |

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Gemini 2.0 Flash (free API)
- Google Sheets (public CSV export — no API key needed)
- localStorage for persistence
- Make.com webhook → Airtable (optional)

## Demo mode

Works without any API keys — uses mock Cars24 campaign data so you can demo immediately.
