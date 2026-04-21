# AI Growth Operator v3 — Stitch Design

Cars24 brand. "The Precision Architect" design system from Stitch.

## Deploy
```bash
# Push to GitHub → Vercel → New Project → Import → Deploy
npm install && npm run dev  # local: localhost:3000
```

## Design System (Stitch)
- Fonts: Manrope (headlines 800) + Inter (body) + Material Symbols icons
- Surfaces: Tonal hierarchy — no solid borders (surface → surface-low → surface-white)
- Primary buttons: gradient #005894 → #0071bc
- Orange CTA: surgical — only for final action (Run Diagnosis, Deploy)
- Metric cards: bento grid, 4xl font-black numbers, icon watermarks 8% opacity
- Diagnosis: vertical timeline with glowing severity pips
- Glass topbar: backdrop-blur(16px)
- AI chat: glassmorphism bubble, smart_toy avatar

## Setup
1. Settings → add Gemini API key (aistudio.google.com — free)
2. Connectors → connect Meta Ads / Google Ads / Sheets
3. Toggle Live mode → continuous diagnosis on interval

## What changed vs v2
- Full Stitch design system (Manrope + Material Symbols + tonal surfaces)
- No solid borders anywhere — surfaces only
- Bento metric grid with icon watermarks
- Vertical timeline diagnosis feed with glowing pips
- Gradient primary buttons + orange-only CTAs
- Glass topbar
- AI chat avatar (smart_toy icon)
