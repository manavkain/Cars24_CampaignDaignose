export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query') || 'Spinny'

  // This is a mock implementation of the Meta Ad Library API
  // In a real scenario, you would fetch from:
  // https://graph.facebook.com/v19.0/ads_archive?access_token={token}&search_terms={query}&ad_reached_countries=['IN']&ad_active_status=ACTIVE
  
  const mockAds = [
    {
      id: '1',
      competitor: query,
      headline: 'Get the best price for your car in 10 mins',
      body: 'Instant payment. Free doorstep evaluation. Sell your car from the comfort of your home.',
      cta: 'Sell Now',
      platform: 'Meta',
      type: 'Video',
      imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=400',
      active_since: '2026-04-10'
    },
    {
      id: '2',
      competitor: query,
      headline: 'Certified used cars with 1-year warranty',
      body: 'Browse 5000+ high-quality cars. 5-day money-back guarantee. No questions asked.',
      cta: 'Browse Cars',
      platform: 'Instagram',
      type: 'Carousel',
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400',
      active_since: '2026-04-15'
    },
    {
      id: '3',
      competitor: query,
      headline: 'Zero downpayment on all SUVs this month',
      body: 'Drive home your dream SUV today. Lowest interest rates guaranteed. Limited period offer.',
      cta: 'Check Eligibility',
      platform: 'Meta',
      type: 'Single Image',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400',
      active_since: '2026-04-18'
    }
  ]

  return Response.json({ ads: mockAds })
}
