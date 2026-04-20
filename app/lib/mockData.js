export const mockMetrics = {
  ctr: 1.8,
  cpc: 42,
  cpl: 380,
  roas: 2.4,
  frequency: 4.7,
  spend: 45000,
  conversions: 118,
  impressions: 512000,
  clicks: 9216,
  campaign: 'Cars24 — New Cars Q2',
  platform: 'Meta',
  objective: 'Lead Generation',
  audience: 'Auto-intenders 25-45, Metro India',
  placement: 'Feed + Stories',
  format: 'Single Image + Carousel',
}

export const mockDeltas = {
  ctr: -0.6,
  cpc: 8,
  cpl: 45,
  roas: -0.8,
  frequency: 1.2,
  spend: 3200,
  conversions: -12,
}

export const mockDiagnosis = {
  issues: [
    {
      id: '1',
      type: 'creative_fatigue',
      severity: 'high',
      evidence: 'Frequency hit 4.7 (+1.2 vs D-7), CTR dropped 25% week-on-week. Creative is burning out.',
      confidence: 92,
    },
    {
      id: '2',
      type: 'audience_saturation',
      severity: 'medium',
      evidence: 'CPL increased ₹45 (+13%) with no bid changes. Reach flattening in primary segments.',
      confidence: 78,
    },
    {
      id: '3',
      type: 'budget_pacing',
      severity: 'medium',
      evidence: 'Spend front-loaded: 68% budget consumed by day 18 of 30. Will exhaust early.',
      confidence: 85,
    },
  ],
  fixes: {
    creative: [
      { label: 'Urgency', headline: 'Last chance: Book your Cars24 car today', body: 'Don't miss out — certified pre-owned cars in your city, instant delivery available. Limited stock.' },
      { label: 'Social Proof', headline: '50,000+ happy Cars24 buyers can't be wrong', body: 'Join India's most trusted car marketplace. Test drive today, drive home tomorrow.' },
      { label: 'Value', headline: 'Get ₹25,000 more for your old car this week only', body: 'Switch to your dream car. Best-in-class exchange value guaranteed. Book your free evaluation now.' },
    ],
    audience: {
      brief: 'Lookalike of converters from last 90 days, 1-2% LAL, exclude existing converters and anyone who saw 3+ ads',
      exclusions: 'Converted users last 90d, frequency >5 users, existing customers',
      lookalike_seed: 'Purchase event last 90 days — high-intent converters',
    },
    bidding: {
      recommendation: 'Raise tCPA by 12% to ₹427 to unlock new inventory and break frequency cap ceiling',
      delta_pct: 12,
      risk: 'low',
    },
    budget: {
      reallocation_map: 'Reduce daily cap from ₹1,500 to ₹1,200 for D19–D25, hold ₹5,400 in reserve for D26–D30 peak',
    },
  },
  summary: 'Creative fatigue is the primary driver — frequency 4.7 is above the 3.5 alert threshold and correlates directly with the CTR decline.',
}

export const mockLog = [
  { id: '1', date: '2026-04-18', issue: 'Creative fatigue', fixType: 'Creative', fixSummary: 'Deployed Variant B — Social Proof headline', before: 'CTR 1.8%', after: 'CTR 2.3%', result: 'up', notes: 'Strong lift within 48h' },
  { id: '2', date: '2026-04-15', issue: 'Audience saturation', fixType: 'Audience', fixSummary: 'Switched to 2% LAL of converters, excluded freq >5', before: 'CPL ₹380', after: 'CPL ₹318', result: 'up', notes: 'Best performing audience change' },
  { id: '3', date: '2026-04-10', issue: 'Budget pacing', fixType: 'Budget', fixSummary: 'Reduced daily cap D12–D20, held reserve for end of month', before: 'ROAS 2.1x', after: 'ROAS 2.4x', result: 'up', notes: '' },
  { id: '4', date: '2026-04-05', issue: 'Bid floor', fixType: 'Bidding', fixSummary: 'Raised tCPA by 8% to ₹392', before: 'Impressions 420k', after: 'Impressions 512k', result: 'up', notes: 'Unlocked new inventory tier' },
  { id: '5', date: '2026-03-28', issue: 'Creative fatigue', fixType: 'Creative', fixSummary: 'Deployed Variant A — Urgency', before: 'CTR 1.4%', after: 'CTR 1.6%', result: 'up', notes: 'Modest lift, ran 6 days' },
]

export const mockNodes = [
  { id: '1', name: 'Campaign Input', type: 'input', status: 'active', connected: true },
  { id: '2', name: 'Gemini Diagnosis', type: 'ai', status: 'active', connected: true },
  { id: '3', name: 'Fix Generator', type: 'ai', status: 'active', connected: true },
  { id: '4', name: 'Airtable Log', type: 'output', status: 'active', connected: false },
  { id: '5', name: 'Slack Alert', type: 'output', status: 'inactive', connected: false },
  { id: '6', name: 'Google Sheets', type: 'input', status: 'active', connected: true },
]

export const mockLogicRules = [
  { id: '1', active: true, metric: 'Frequency', operator: '>', value: '4', action: 'Flag Creative Fatigue', severity: 'high' },
  { id: '2', active: true, metric: 'CTR', operator: '<', value: '1', action: 'Auto-Diagnose + Notify', severity: 'high' },
  { id: '3', active: true, metric: 'ROAS', operator: '<', value: '2', action: 'Flag Budget Risk', severity: 'medium' },
  { id: '4', active: false, metric: 'CPC', operator: '>', value: '60', action: 'Pause Campaign', severity: 'high' },
]
