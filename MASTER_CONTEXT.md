# MASTER CONTEXT — Cars24 AI Growth Operator
**Last updated:** 22 April 2026  
**Live URL:** https://ai-growth-operator-app.vercel.app  
**Repo:** https://github.com/manavkain/Cars24_CampaignDaignose  
**Stack:** Next.js 14 · Tailwind · Gemini 2.0 Flash API · Make.com · Google Sheets

---

## WHAT THIS APP IS
An AI campaign diagnosis operator for Cars24 marketing team.
Core flow: **Detect → Diagnose → Act**
Not a dashboard. Not a suggestion tool. An operator that initiates, diagnoses, and routes fixes without human triggering.

---

## WHAT IS BUILT (DO NOT REBUILD)

| File | What it does | Status |
|---|---|---|
| `lib/gemini.js` | 3 Gemini functions: diagnoseCampaign, chatWithAI, generateCopy | ✅ Done |
| `lib/mockData.js` | Mock metrics, deltas, log, diagnosis, logic rules | ✅ Done |
| `components/AppContext.jsx` | Global state, polling loop, runDiagnosis, exportToAirtable | ✅ Done |
| `app/api/sheets/route.js` | Fetches ALL campaigns from public Google Sheet as array | ✅ Done |
| `app/api/webhook/route.js` | POSTs payload to Make.com webhook URL | ✅ Done |
| `components/dashboard/CampaignPulse.jsx` | Metrics display + Sheet loader + campaign pill selector | ✅ Done |
| `components/dashboard/DiagnosisFeed.jsx` | Shows issues with confidence scores | ✅ Done |
| `components/dashboard/FixGenerator.jsx` | 4 fix tabs: Creative / Audience / Bidding / Budget | ✅ Done |
| `components/dashboard/ImprovementLog.jsx` | Before/after log with edit | ✅ Done |
| `components/pages/Settings.jsx` | Gemini key + webhook URL + thresholds | ✅ Done |
| `components/pages/AIChat.jsx` | Chat with Gemini about campaign | ✅ Done |
| `components/pages/CustomLogicMaker.jsx` | Threshold rules that trigger flags | ✅ Done |

---

## WHAT IS BEING BUILT NEXT

### Priority 1 — Core flow fixes (do these first)
- [ ] **Nav restructure** → rename to: Detect / Diagnose / Act / Intel / Launch / Log / Settings
  - File: `components/Sidebar.jsx`
- [ ] **Approve button** → replace Export in FixGenerator with Approve → fires webhook → log auto-updates to "deployed"
  - Files: `components/dashboard/FixGenerator.jsx` + `components/AppContext.jsx`
- [ ] **Benchmark layer** → add India auto-sector benchmarks to diagnoseCampaign prompt
  - File: `lib/gemini.js`

### Priority 2 — New features
- [ ] **Intel page** — Competitor Creative Tracker using Meta Ad Library API
  - New file: `components/pages/Intel.jsx` + `app/api/adlibrary/route.js`
- [ ] **Launch page** — Campaign Launchpad: brief → Gemini → full campaign structure
  - New file: `components/pages/Launch.jsx`
- [ ] **Auto-pause simulation** — Logic rule fires Make webhook → approval email
  - File: `components/pages/CustomLogicMaker.jsx`

### Priority 3 — Make.com (no code, done in Make UI)
- [ ] Scenario 1: Diagnosis alert → formatted Gmail with Approve button
- [ ] Scenario 2: Auto-pause → Gmail confirmation email
- [ ] Scenario 3: Weekly report → scheduled Monday 9AM Gmail

---

## GOOGLE SHEET STRUCTURE
Sheet ID: [PASTE YOUR SHEET ID HERE]
Columns: name, CTR, CPC, spend, impressions, audience, creative, status, cpl, roas, frequency, conversions, clicks, platform, objective

Sample row:
```
Summer Sale Push, 0.8%, ₹42, ₹18500, 230000, 25-34 Urban Males, Video_SS_01, underperforming, ₹380, 2.1, 4.7, 118, 9216, Meta, Lead Generation
```

---

## GEMINI PROMPT (CURRENT — in lib/gemini.js)
System baked into prompt. Returns JSON with: issues[], fixes{creative, audience, bidding, budget}, summary.

Benchmark upgrade to add:
```
India auto-sector benchmarks:
- CTR: 1.5–2.5% (below 1% = critical)
- CPC: ₹25–45 (above ₹60 = critical)
- ROAS: 2.5–4x (below 2x = critical)
- Frequency: 2–3.5 (above 4.5 = fatigue risk)
- CPL: ₹200–320 (above ₹400 = critical)
Compare metrics against these in the evidence field.
```

---

## MAKE.COM
Webhook URL: [PASTE YOUR MAKE WEBHOOK URL HERE]
Currently wired to: Gmail (test confirmed working)
Payload received: array of log entries with id, timestamp, campaign, platform, fixType, description, result

---

## RULES FOR AGENTS WORKING ON THIS REPO

1. **Never rewrite a whole file** unless asked. Edit only the specific function/component mentioned.
2. **Always paste the current file content** at the start of your task prompt.
3. **Return only the updated file** — no explanations, no summaries.
4. **Never touch these files** unless specifically tasked: `globals.css`, `layout.js`, `mockData.js`
5. **Test imports** — if you add a new component, make sure it's imported in `Sidebar.jsx` and `page.js`
6. **No new dependencies** — use only what's already in `package.json`

---

## AGENT TASK TEMPLATE
Paste this before every Antigravity task:

```
CONTEXT: Cars24 AI Growth Operator — Next.js app
Live URL: https://ai-growth-operator-app.vercel.app
Repo: github.com/manavkain/Cars24_CampaignDaignose

CURRENT FILE CONTENT:
[paste full file content here]

TASK:
[describe exactly what to change]

RULES:
- Edit only what's needed, don't rewrite the whole file
- Return only the updated file, no explanation
- Don't add new npm dependencies
```

---

## FILE OWNERSHIP MAP (who edits what)
| Task | File to edit | Safe to parallel? |
|---|---|---|
| Nav rename | Sidebar.jsx | ✅ yes |
| Approve button | FixGenerator.jsx | ✅ yes |
| Log auto-update | AppContext.jsx | ⚠️ no — touches global state |
| Benchmark prompt | lib/gemini.js | ✅ yes |
| Intel page | Intel.jsx (new) | ✅ yes |
| Launch page | Launch.jsx (new) | ✅ yes |
| Auto-pause | CustomLogicMaker.jsx | ✅ yes |

**Never run two agents on the same file simultaneously.**

---

## DEFINITION OF DONE
- [ ] Nav = Detect / Diagnose / Act / Intel / Launch / Log / Settings
- [ ] Approve fires webhook → Gmail → log flips to deployed
- [ ] Benchmarks in Gemini diagnosis
- [ ] Intel page live (Meta Ad Library or mock fallback)
- [ ] Launch page live
- [ ] Auto-pause simulation in Logic Maker
- [ ] Local tested → single git push → Vercel deploys once
- [ ] Loom recorded on live URL
- [ ] Email sent to aihiring@cars24.com with live URL leading
