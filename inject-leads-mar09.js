// ============================================================
// ARIA LEAD INJECTOR — KaloData Batch (March 9, 2026)
// Revenue period: Feb 06 – Mar 07, 2026
// 100 shops | Paste into browser console while ARIA is open
// ============================================================

(function () {
  const today = '2026-03-09';
  const day3  = '2026-03-12';
  const day7  = '2026-03-16';

  function makeFollowUps() {
    return [
      { day: 3,  action: 'Send Day 3 follow-up DM',         status: 'pending', scheduledDate: day3 },
      { day: 7,  action: 'Send Day 7 follow-up if no reply', status: 'pending', scheduledDate: day7 },
    ];
  }

  function score(rp, bf, ec, pm) {
    const overall = Math.round((rp * 0.35 + bf * 0.25 + ec * 0.20 + pm * 0.20) * 10) / 10;
    return { revenuePotential: rp, brandFit: bf, easeOfClosing: ec, productMargins: pm, overall };
  }

  function brief(type, growth, items, avgPrice, category, pitchAngle) {
    const growthStr = growth === '>999.9%' ? '>999.9%' : growth + '%';
    let fitAnalysis, pitch;
    const g = growth === '>999.9%' ? 1000 : parseFloat(growth);
    if (g >= 100) {
      fitAnalysis = 'Strong upward momentum — brand is scaling fast and likely open to agency support to sustain growth.';
      pitch = pitchAngle || 'Lead with LIVE selling as the engine to sustain and amplify current growth trajectory.';
    } else if (g >= 20) {
      fitAnalysis = 'Consistent upward trend. Brand has traction and could benefit from a dedicated LIVE channel.';
      pitch = pitchAngle || 'Pitch LIVE selling as a revenue accelerator to push past the current plateau.';
    } else if (g >= 0) {
      fitAnalysis = 'Flat or minimal growth. Brand needs a new channel to break through.';
      pitch = pitchAngle || 'Position LIVE selling as the missing growth lever to move the needle.';
    } else {
      fitAnalysis = 'Declining revenue. Needs a turnaround strategy — LIVE selling can be a fresh channel.';
      pitch = pitchAngle || 'Position LIVE selling as a turnaround lever — fresh channel to reverse the declining trend.';
    }
    return {
      brandOverview: `${type} with ${growthStr} revenue growth (Feb 06 – Mar 07). ${items} items sold, avg unit price $${avgPrice}.`,
      fitAnalysis,
      recommendedPitchAngle: pitch,
      followUpSchedule: makeFollowUps(),
    };
  }

  const ts = Date.now();

  const newLeads = [
    // ── 1 ──────────────────────────────────────────────────
    {
      brandName: 'Power Super toolbox',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'home', productType: 'Brand',
      estimatedMonthlyGmv: 10000, kaloDataGmv: 10000, commissionRate: 10,
      status: 'new', score: score(6, 7, 5, 6),
      brief: brief('Brand', '47.8', 222, '45.05', 'home'),
      notes: 'KaloData: 47.8% growth, 222 items sold, $45.05 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 2 ──────────────────────────────────────────────────
    {
      brandName: 'TheWizardOfPrinting',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10000, kaloDataGmv: 10000, commissionRate: 10,
      status: 'new', score: score(5, 7, 5, 5),
      brief: brief('Brand', '1.4', 630, '15.88', 'other'),
      notes: 'KaloData: 1.4% growth, 630 items sold, $15.88 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 3 ──────────────────────────────────────────────────
    {
      brandName: 'Clear Edge Optics',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10000, kaloDataGmv: 10000, commissionRate: 10,
      status: 'new', score: score(6, 7, 5, 4),
      brief: brief('Brand', '34.3', 1180, '8.49', 'other'),
      notes: 'KaloData: 34.3% growth, 1.18k items sold, $8.49 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 4 ──────────────────────────────────────────────────
    {
      brandName: 'Miracle View Ultrasound',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'health', productType: 'Brand',
      estimatedMonthlyGmv: 10000, kaloDataGmv: 10000, commissionRate: 10,
      status: 'new', score: score(5, 7, 5, 5),
      brief: brief('Brand', '22.5', 475, '21.06', 'health', 'Demonstrate ultrasound features LIVE — visual demos drive trust and conversions for health devices.'),
      notes: 'KaloData: 22.5% growth, 475 items sold, $21.06 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 5 ──────────────────────────────────────────────────
    {
      brandName: 'Ctop pre-owned luxury',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Retailer',
      estimatedMonthlyGmv: 10000, kaloDataGmv: 10000, commissionRate: 10,
      status: 'new', score: score(9, 5, 6, 10),
      brief: brief('Retailer', '441.8', 12, '833.75', 'fashion', 'Pre-owned luxury sells on exclusivity. LIVE creates urgency — "one-of-a-kind" items in real time.'),
      notes: 'KaloData: 441.8% growth, 12 items sold, $833.75 avg price (Feb 06 – Mar 07 2026). High AOV luxury retailer.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 6 ──────────────────────────────────────────────────
    {
      brandName: 'Soft Shell Research Institute',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10010, kaloDataGmv: 10010, commissionRate: 10,
      status: 'new', score: score(8, 7, 6, 4),
      brief: brief('Brand', '141.8', 1370, '7.32', 'other'),
      notes: 'KaloData: 141.8% growth, 1.37k items sold, $7.32 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 7 ──────────────────────────────────────────────────
    {
      brandName: 'Lissy Skincare',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Brand',
      estimatedMonthlyGmv: 10010, kaloDataGmv: 10010, commissionRate: 10,
      status: 'new', score: score(6, 7, 5, 7),
      brief: brief('Brand', '35.9', 172, '58.18', 'beauty', 'Skincare is perfect for LIVE demos — before/after, texture reveals, routine walkthroughs drive impulse buys.'),
      notes: 'KaloData: 35.9% growth, 172 items sold, $58.18 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 8 ──────────────────────────────────────────────────
    {
      brandName: 'Fashion Baby Station',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Brand',
      estimatedMonthlyGmv: 10010, kaloDataGmv: 10010, commissionRate: 10,
      status: 'new', score: score(5, 7, 5, 5),
      brief: brief('Brand', '15.2', 434, '23.06', 'fashion', 'Baby/kids fashion sells through storytelling. LIVE try-ons and styling sessions build emotional connection.'),
      notes: 'KaloData: 15.2% growth, 434 items sold, $23.06 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 9 ──────────────────────────────────────────────────
    {
      brandName: 'Melanin and Moon Minerals',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Brand',
      estimatedMonthlyGmv: 10010, kaloDataGmv: 10010, commissionRate: 10,
      status: 'new', score: score(3, 7, 4, 5),
      brief: brief('Brand', '-50.3', 475, '21.07', 'beauty', 'LIVE selling can rebuild brand visibility. Melanin beauty community is highly engaged on TikTok.'),
      notes: 'KaloData: -50.3% growth, 475 items sold, $21.07 avg price (Feb 06 – Mar 07 2026). Declining — needs turnaround.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 10 ──────────────────────────────────────────────────
    {
      brandName: 'Womens season',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Brand',
      estimatedMonthlyGmv: 10010, kaloDataGmv: 10010, commissionRate: 10,
      status: 'new', score: score(6, 7, 5, 5),
      brief: brief('Brand', '49.4', 764, '13.10', 'fashion', 'Seasonal fashion collections are highly LIVE-friendly — hauls, styling, and flash sales.'),
      notes: 'KaloData: 49.4% growth, 764 items sold, $13.10 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 11 ──────────────────────────────────────────────────
    {
      brandName: 'AromaPro',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Brand',
      estimatedMonthlyGmv: 10010, kaloDataGmv: 10010, commissionRate: 10,
      status: 'new', score: score(5, 7, 4, 6),
      brief: brief('Brand', '-4', 230, '43.52', 'beauty', 'Fragrance/aroma products sell well through sensory storytelling on LIVE. Highlight ingredients and benefits.'),
      notes: 'KaloData: -4% growth, 230 items sold, $43.52 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 12 ──────────────────────────────────────────────────
    {
      brandName: 'Eclat Collection',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Brand',
      estimatedMonthlyGmv: 10010, kaloDataGmv: 10010, commissionRate: 10,
      status: 'new', score: score(9, 7, 6, 6),
      brief: brief('Brand', '439.5', 296, '33.82', 'fashion', 'Explosive growth brand. LIVE selling can scale this even faster — showcase collection drops and limited items.'),
      notes: 'KaloData: 439.5% growth, 296 items sold, $33.82 avg price (Feb 06 – Mar 07 2026). High-priority outreach.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 13 ──────────────────────────────────────────────────
    {
      brandName: 'Makeup Production Plant',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Brand',
      estimatedMonthlyGmv: 10010, kaloDataGmv: 10010, commissionRate: 10,
      status: 'new', score: score(6, 7, 5, 4),
      brief: brief('Brand', '25', 995, '10.06', 'beauty', 'Makeup performs extremely well in LIVE — color reveals, tutorials, and bundle deals drive high volume.'),
      notes: 'KaloData: 25% growth, 995 items sold, $10.06 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 14 ──────────────────────────────────────────────────
    {
      brandName: 'lovingtreehealth',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'health', productType: 'Retailer',
      estimatedMonthlyGmv: 10010, kaloDataGmv: 10010, commissionRate: 10,
      status: 'new', score: score(8, 5, 6, 5),
      brief: brief('Retailer', '102.9', 599, '16.71', 'health', 'Health & wellness products thrive in LIVE through education. Build credibility with ingredient deep-dives.'),
      notes: 'KaloData: 102.9% growth, 599 items sold, $16.71 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 15 ──────────────────────────────────────────────────
    {
      brandName: 'LUMICHARGE',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'electronics', productType: 'Brand',
      estimatedMonthlyGmv: 10010, kaloDataGmv: 10010, commissionRate: 10,
      status: 'new', score: score(3, 7, 4, 6),
      brief: brief('Brand', '-30.1', 330, '30.34', 'electronics', 'LIVE demos of charging tech can reverse decline — showcase features, speed tests, and compatibility live.'),
      notes: 'KaloData: -30.1% growth, 330 items sold, $30.34 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 16 ──────────────────────────────────────────────────
    {
      brandName: "Root'd Shop",
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'health', productType: 'Retailer',
      estimatedMonthlyGmv: 10010, kaloDataGmv: 10010, commissionRate: 10,
      status: 'new', score: score(5, 5, 4, 5),
      brief: brief('Retailer', '-7.7', 421, '23.78', 'health'),
      notes: 'KaloData: -7.7% growth, 421 items sold, $23.78 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 17 ──────────────────────────────────────────────────
    {
      brandName: 'Ueki Technology',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'electronics', productType: 'Retailer',
      estimatedMonthlyGmv: 10010, kaloDataGmv: 10010, commissionRate: 10,
      status: 'new', score: score(3, 5, 4, 5),
      brief: brief('Retailer', '-26.2', 409, '24.48', 'electronics'),
      notes: 'KaloData: -26.2% growth, 409 items sold, $24.48 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 18 ──────────────────────────────────────────────────
    {
      brandName: 'BIAT',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10010, kaloDataGmv: 10010, commissionRate: 10,
      status: 'new', score: score(5, 7, 5, 5),
      brief: brief('Brand', '2.4', 732, '13.68', 'other'),
      notes: 'KaloData: 2.4% growth, 732 items sold, $13.68 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 19 ──────────────────────────────────────────────────
    {
      brandName: 'Trendy Resin Toys',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10020, kaloDataGmv: 10020, commissionRate: 10,
      status: 'new', score: score(7, 5, 6, 4),
      brief: brief('Retailer', '92.2', 2110, '4.74', 'other', 'Resin toys/crafts have strong niche communities on TikTok. LIVE unboxing and custom reveals drive impulse buys.'),
      notes: 'KaloData: 92.2% growth, 2.11k items sold, $4.74 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 20 ──────────────────────────────────────────────────
    {
      brandName: 'Xien Underwear Store',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Retailer',
      estimatedMonthlyGmv: 10020, kaloDataGmv: 10020, commissionRate: 10,
      status: 'new', score: score(6, 5, 5, 4),
      brief: brief('Retailer', '43.3', 1120, '8.97', 'fashion'),
      notes: 'KaloData: 43.3% growth, 1.12k items sold, $8.97 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 21 ── TIER 1 HOT ───────────────────────────────────
    {
      brandName: 'Amada NatureVibe',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'health', productType: 'Brand',
      estimatedMonthlyGmv: 10020, kaloDataGmv: 10020, commissionRate: 10,
      status: 'new', score: score(9, 7, 6, 9),
      brief: brief('Brand', '237', 72, '139.12', 'health', 'Premium wellness brand with explosive growth. High AOV + 237% growth = ideal LIVE candidate. Pitch creator program + LIVE combo.'),
      notes: 'KaloData: 237% growth, 72 items sold, $139.12 avg price (Feb 06 – Mar 07 2026). TIER 1 — contact immediately.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 22 ──────────────────────────────────────────────────
    {
      brandName: 'Code Luxe',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Brand',
      estimatedMonthlyGmv: 10020, kaloDataGmv: 10020, commissionRate: 10,
      status: 'new', score: score(3, 7, 4, 5),
      brief: brief('Brand', '-28.8', 837, '11.97', 'fashion'),
      notes: 'KaloData: -28.8% growth, 837 items sold, $11.97 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 23 ── TIER 1 HOT ───────────────────────────────────
    {
      brandName: 'ScootHop US',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'electronics', productType: 'Brand',
      estimatedMonthlyGmv: 10020, kaloDataGmv: 10020, commissionRate: 10,
      status: 'new', score: score(8, 7, 6, 10),
      brief: brief('Brand', '160.4', 23, '435.65', 'electronics', 'High-ticket mobility product (scooters/e-bikes). LIVE product demos with test rides and feature showcases create massive urgency.'),
      notes: 'KaloData: 160.4% growth, 23 items sold, $435.65 avg price (Feb 06 – Mar 07 2026). TIER 1 — high AOV + strong growth.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 24 ──────────────────────────────────────────────────
    {
      brandName: 'Potty Training Underwear',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10020, kaloDataGmv: 10020, commissionRate: 10,
      status: 'new', score: score(7, 7, 6, 6),
      brief: brief('Brand', '83.5', 286, '35.04', 'other', 'Baby/toddler products sell through parent community trust. LIVE Q&A and product demos work well for this category.'),
      notes: 'KaloData: 83.5% growth, 286 items sold, $35.04 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 25 ──────────────────────────────────────────────────
    {
      brandName: 'Cashmere Grove blanket',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'home', productType: 'Retailer',
      estimatedMonthlyGmv: 10020, kaloDataGmv: 10020, commissionRate: 10,
      status: 'new', score: score(5, 5, 5, 5),
      brief: brief('Retailer', '15.5', 732, '13.69', 'home'),
      notes: 'KaloData: 15.5% growth, 732 items sold, $13.69 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 26 ── TIER 2 ────────────────────────────────────────
    {
      brandName: 'Prime Pick US',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10020, kaloDataGmv: 10020, commissionRate: 10,
      status: 'new', score: score(9, 7, 6, 5),
      brief: brief('Brand', '385.8', 660, '15.19', 'other', 'Nearly 4x growth — brand is on a serious upward trajectory. LIVE selling can be the next big accelerant.'),
      notes: 'KaloData: 385.8% growth, 660 items sold, $15.19 avg price (Feb 06 – Mar 07 2026). Tier 2 priority.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 27 ──────────────────────────────────────────────────
    {
      brandName: 'Veeloim Shop',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10020, kaloDataGmv: 10020, commissionRate: 10,
      status: 'new', score: score(3, 5, 4, 5),
      brief: brief('Retailer', '-34.2', 898, '11.16', 'other'),
      notes: 'KaloData: -34.2% growth, 898 items sold, $11.16 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 28 ──────────────────────────────────────────────────
    {
      brandName: 'Honey Rue WHITTEDS',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10020, kaloDataGmv: 10020, commissionRate: 10,
      status: 'new', score: score(7, 5, 6, 5),
      brief: brief('Retailer', '81.7', 374, '26.80', 'other'),
      notes: 'KaloData: 81.7% growth, 374 items sold, $26.80 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 29 ──────────────────────────────────────────────────
    {
      brandName: 'New leaves',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'health', productType: 'Brand',
      estimatedMonthlyGmv: 10020, kaloDataGmv: 10020, commissionRate: 10,
      status: 'new', score: score(4, 7, 4, 5),
      brief: brief('Brand', '-16', 386, '25.97', 'health'),
      notes: 'KaloData: -16% growth, 386 items sold, $25.97 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 30 ──────────────────────────────────────────────────
    {
      brandName: 'Fresharel',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Retailer',
      estimatedMonthlyGmv: 10030, kaloDataGmv: 10030, commissionRate: 10,
      status: 'new', score: score(4, 5, 4, 5),
      brief: brief('Retailer', '-11.3', 567, '17.68', 'fashion'),
      notes: 'KaloData: -11.3% growth, 567 items sold, $17.68 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 31 ──────────────────────────────────────────────────
    {
      brandName: 'cwia',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10030, kaloDataGmv: 10030, commissionRate: 10,
      status: 'new', score: score(5, 5, 5, 5),
      brief: brief('Retailer', '8.4', 891, '11.25', 'other'),
      notes: 'KaloData: 8.4% growth, 891 items sold, $11.25 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 32 ──────────────────────────────────────────────────
    {
      brandName: 'Electactic',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'electronics', productType: 'Brand',
      estimatedMonthlyGmv: 10030, kaloDataGmv: 10030, commissionRate: 10,
      status: 'new', score: score(5, 7, 5, 7),
      brief: brief('Brand', '10', 135, '74.27', 'electronics', 'Electronics in the $50–100 range demo well on LIVE. Showcase features side-by-side with competitors.'),
      notes: 'KaloData: 10% growth, 135 items sold, $74.27 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 33 ──────────────────────────────────────────────────
    {
      brandName: 'Sip Serene',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'food', productType: 'Brand',
      estimatedMonthlyGmv: 10030, kaloDataGmv: 10030, commissionRate: 10,
      status: 'new', score: score(6, 7, 5, 4),
      brief: brief('Brand', '27.5', 2130, '4.70', 'food', 'Wellness beverages sell through taste reveals and lifestyle storytelling. High-volume LIVE bundles work well.'),
      notes: 'KaloData: 27.5% growth, 2.13k items sold, $4.70 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 34 ── TIER 3 ────────────────────────────────────────
    {
      brandName: 'houseofdubai',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Retailer',
      estimatedMonthlyGmv: 10030, kaloDataGmv: 10030, commissionRate: 10,
      status: 'new', score: score(7, 5, 6, 9),
      brief: brief('Retailer', '99.1', 65, '154.29', 'fashion', 'Luxury Middle Eastern fashion with near-100% growth. High AOV means even a few LIVE sales = significant GMV.'),
      notes: 'KaloData: 99.1% growth, 65 items sold, $154.29 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 35 ──────────────────────────────────────────────────
    {
      brandName: 'w-kingaudio',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'electronics', productType: 'Retailer',
      estimatedMonthlyGmv: 10030, kaloDataGmv: 10030, commissionRate: 10,
      status: 'new', score: score(5, 5, 5, 9),
      brief: brief('Retailer', '16.4', 67, '149.72', 'electronics', 'Premium audio products sell through sound demos — LIVE listening sessions and comparison reviews.'),
      notes: 'KaloData: 16.4% growth, 67 items sold, $149.72 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 36 ── TIER 3 ────────────────────────────────────────
    {
      brandName: 'Trapped Out Apparel',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Retailer',
      estimatedMonthlyGmv: 10030, kaloDataGmv: 10030, commissionRate: 10,
      status: 'new', score: score(8, 5, 6, 7),
      brief: brief('Retailer', '141.8', 147, '68.24', 'fashion', 'Streetwear brand with 142% growth and mid-high AOV. LIVE drops and limited releases work perfectly here.'),
      notes: 'KaloData: 141.8% growth, 147 items sold, $68.24 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 37 ──────────────────────────────────────────────────
    {
      brandName: 'Auto parts mall',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10030, kaloDataGmv: 10030, commissionRate: 10,
      status: 'new', score: score(3, 7, 4, 4),
      brief: brief('Brand', '-26.2', 1560, '6.43', 'other'),
      notes: 'KaloData: -26.2% growth, 1.56k items sold, $6.43 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 38 ──────────────────────────────────────────────────
    {
      brandName: 'Handexer',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'health', productType: 'Brand',
      estimatedMonthlyGmv: 10030, kaloDataGmv: 10030, commissionRate: 10,
      status: 'new', score: score(5, 7, 5, 6),
      brief: brief('Brand', '7.6', 315, '31.85', 'health', 'Hand exercise/grip training products work well in fitness LIVE demos — challenge formats drive engagement.'),
      notes: 'KaloData: 7.6% growth, 315 items sold, $31.85 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 39 ──────────────────────────────────────────────────
    {
      brandName: 'Shine -On',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Brand',
      estimatedMonthlyGmv: 10030, kaloDataGmv: 10030, commissionRate: 10,
      status: 'new', score: score(5, 7, 5, 4),
      brief: brief('Brand', '12.6', 2090, '4.79', 'fashion', 'Jewelry/accessories brand with high volume sales. LIVE styling sessions can significantly boost AOV through bundling.'),
      notes: 'KaloData: 12.6% growth, 2.09k items sold, $4.79 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 40 ──────────────────────────────────────────────────
    {
      brandName: 'Yimeiqi Fashion Swimsuit',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Retailer',
      estimatedMonthlyGmv: 10030, kaloDataGmv: 10030, commissionRate: 10,
      status: 'new', score: score(8, 5, 6, 4),
      brief: brief('Retailer', '105.1', 988, '10.16', 'fashion', 'Swimwear with 105% growth — seasonal momentum. LIVE try-on hauls and styling are perfect for this category.'),
      notes: 'KaloData: 105.1% growth, 988 items sold, $10.16 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 41 ──────────────────────────────────────────────────
    {
      brandName: 'NutsWinner Jewelry',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Brand',
      estimatedMonthlyGmv: 10030, kaloDataGmv: 10030, commissionRate: 10,
      status: 'new', score: score(4, 7, 4, 5),
      brief: brief('Brand', '-23.3', 452, '22.20', 'fashion', 'Jewelry brand in decline. LIVE unboxing and styling reveals can create a comeback moment.'),
      notes: 'KaloData: -23.3% growth, 452 items sold, $22.20 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 42 ──────────────────────────────────────────────────
    {
      brandName: 'LettieKilnArt',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10040, kaloDataGmv: 10040, commissionRate: 10,
      status: 'new', score: score(5, 5, 5, 7),
      brief: brief('Retailer', '17.8', 197, '50.94', 'other', 'Handmade/kiln art products shine through process LIVE streams — craft communities are highly engaged buyers.'),
      notes: 'KaloData: 17.8% growth, 197 items sold, $50.94 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 43 ──────────────────────────────────────────────────
    {
      brandName: 'Tsuki250621',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10040, kaloDataGmv: 10040, commissionRate: 10,
      status: 'new', score: score(4, 5, 4, 5),
      brief: brief('Retailer', '-15.6', 427, '23.50', 'other'),
      notes: 'KaloData: -15.6% growth, 427 items sold, $23.50 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 44 ──────────────────────────────────────────────────
    {
      brandName: 'Tidy Habit',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'home', productType: 'Retailer',
      estimatedMonthlyGmv: 10040, kaloDataGmv: 10040, commissionRate: 10,
      status: 'new', score: score(5, 5, 5, 5),
      brief: brief('Retailer', '5.4', 886, '11.33', 'home', 'Home organization products sell through satisfying LIVE demos — "before and after" transformations go viral.'),
      notes: 'KaloData: 5.4% growth, 886 items sold, $11.33 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 45 ──────────────────────────────────────────────────
    {
      brandName: 'VukGripz',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10040, kaloDataGmv: 10040, commissionRate: 10,
      status: 'new', score: score(4, 7, 4, 6),
      brief: brief('Brand', '-13.1', 279, '35.99', 'other'),
      notes: 'KaloData: -13.1% growth, 279 items sold, $35.99 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 46 ──────────────────────────────────────────────────
    {
      brandName: 'GOGOlove',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Retailer',
      estimatedMonthlyGmv: 10040, kaloDataGmv: 10040, commissionRate: 10,
      status: 'new', score: score(5, 5, 5, 5),
      brief: brief('Retailer', '2.8', 680, '14.77', 'fashion'),
      notes: 'KaloData: 2.8% growth, 680 items sold, $14.77 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 47 ──────────────────────────────────────────────────
    {
      brandName: 'Scale Boutique',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Brand',
      estimatedMonthlyGmv: 10040, kaloDataGmv: 10040, commissionRate: 10,
      status: 'new', score: score(5, 7, 5, 5),
      brief: brief('Brand', '3.4', 762, '13.18', 'fashion'),
      notes: 'KaloData: 3.4% growth, 762 items sold, $13.18 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 48 ──────────────────────────────────────────────────
    {
      brandName: 'Fragile Club.',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10050, kaloDataGmv: 10050, commissionRate: 10,
      status: 'new', score: score(3, 5, 4, 5),
      brief: brief('Retailer', '-32.1', 561, '17.91', 'other'),
      notes: 'KaloData: -32.1% growth, 561 items sold, $17.91 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 49 ──────────────────────────────────────────────────
    {
      brandName: 'KISTVO Official',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10050, kaloDataGmv: 10050, commissionRate: 10,
      status: 'new', score: score(5, 7, 5, 5),
      brief: brief('Brand', '16.2', 529, '18.99', 'other'),
      notes: 'KaloData: 16.2% growth, 529 items sold, $18.99 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 50 ──────────────────────────────────────────────────
    {
      brandName: 'AR Barber Supply',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Brand',
      estimatedMonthlyGmv: 10050, kaloDataGmv: 10050, commissionRate: 10,
      status: 'new', score: score(2, 7, 3, 6),
      brief: brief('Brand', '-74.3', 240, '41.87', 'beauty', 'Professional barber supplies LIVE — technique demos and bundle deals can revive sales with the right host.'),
      notes: 'KaloData: -74.3% growth, 240 items sold, $41.87 avg price (Feb 06 – Mar 07 2026). Severe decline — lower priority.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 51 ── TIER 2 ────────────────────────────────────────
    {
      brandName: 'For the People 2026',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10050, kaloDataGmv: 10050, commissionRate: 10,
      status: 'new', score: score(7, 7, 6, 10),
      brief: brief('Brand', '88.4', 43, '233.70', 'other', 'High-AOV brand with strong growth. Political/cause-driven merchandise sells through community storytelling and LIVE.'),
      notes: 'KaloData: 88.4% growth, 43 items sold, $233.70 avg price (Feb 06 – Mar 07 2026). High AOV + strong growth.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 52 ──────────────────────────────────────────────────
    {
      brandName: 'SAGEWOLF TOOLS',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'home', productType: 'Brand',
      estimatedMonthlyGmv: 10050, kaloDataGmv: 10050, commissionRate: 10,
      status: 'new', score: score(3, 7, 4, 7),
      brief: brief('Brand', '-41.3', 179, '56.16', 'home', 'Tool brands recover through LIVE demos — show the product in action to build confidence and trust.'),
      notes: 'KaloData: -41.3% growth, 179 items sold, $56.16 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 53 ──────────────────────────────────────────────────
    {
      brandName: 'Wild Paw Co.',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10050, kaloDataGmv: 10050, commissionRate: 10,
      status: 'new', score: score(2, 5, 3, 4),
      brief: brief('Retailer', '-70.2', 938, '10.72', 'other'),
      notes: 'KaloData: -70.2% growth, 938 items sold, $10.72 avg price (Feb 06 – Mar 07 2026). Significant decline — low priority.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 54 ──────────────────────────────────────────────────
    {
      brandName: 'monicacrimmins',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Retailer',
      estimatedMonthlyGmv: 10060, kaloDataGmv: 10060, commissionRate: 10,
      status: 'new', score: score(2, 5, 3, 5),
      brief: brief('Retailer', '-58.7', 387, '25.99', 'fashion'),
      notes: 'KaloData: -58.7% growth, 387 items sold, $25.99 avg price (Feb 06 – Mar 07 2026). Steep decline — low priority.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 55 ── TIER 3 ────────────────────────────────────────
    {
      brandName: 'DONTSLEEPSPORTCARDS',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10060, kaloDataGmv: 10060, commissionRate: 10,
      status: 'new', score: score(8, 5, 6, 7),
      brief: brief('Retailer', '134.6', 161, '62.48', 'other', 'Sports cards are one of the hottest LIVE categories on TikTok — pack breaks, reveals, and auctions are massive.'),
      notes: 'KaloData: 134.6% growth, 161 items sold, $62.48 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 56 ──────────────────────────────────────────────────
    {
      brandName: 'Hafmall',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10060, kaloDataGmv: 10060, commissionRate: 10,
      status: 'new', score: score(7, 7, 6, 5),
      brief: brief('Brand', '66.8', 360, '27.94', 'other'),
      notes: 'KaloData: 66.8% growth, 360 items sold, $27.94 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 57 ── TIER 1 HOT ───────────────────────────────────
    {
      brandName: 'Zlike Hair',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Brand',
      estimatedMonthlyGmv: 10060, kaloDataGmv: 10060, commissionRate: 10,
      status: 'new', score: score(9, 7, 6, 9),
      brief: brief('Brand', '189.3', 76, '132.37', 'beauty', 'Premium hair brand with explosive growth and high AOV. LIVE install demos and before/afters are proven revenue drivers in this niche.'),
      notes: 'KaloData: 189.3% growth, 76 items sold, $132.37 avg price (Feb 06 – Mar 07 2026). TIER 1 — contact immediately.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 58 ── TIER 2 ────────────────────────────────────────
    {
      brandName: 'Danielle Wynn Jerod',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10060, kaloDataGmv: 10060, commissionRate: 10,
      status: 'new', score: score(10, 7, 7, 4),
      brief: brief('Brand', '>999.9%', 2330, '4.32', 'other', 'Explosive >999% growth — brand went viral. Strike NOW while momentum is hot. LIVE is the perfect next step.'),
      notes: 'KaloData: >999.9% growth, 2.33k items sold, $4.32 avg price (Feb 06 – Mar 07 2026). Viral momentum — urgent outreach.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 59 ──────────────────────────────────────────────────
    {
      brandName: 'Toni Crafter',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10060, kaloDataGmv: 10060, commissionRate: 10,
      status: 'new', score: score(6, 7, 5, 5),
      brief: brief('Brand', '42.9', 682, '14.75', 'other', 'Craft brands thrive in LIVE — tutorials, process reveals, and bundle deals work well with engaged audiences.'),
      notes: 'KaloData: 42.9% growth, 682 items sold, $14.75 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 60 ──────────────────────────────────────────────────
    {
      brandName: 'Optify',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10060, kaloDataGmv: 10060, commissionRate: 10,
      status: 'new', score: score(6, 7, 5, 5),
      brief: brief('Brand', '35.3', 359, '28.03', 'other'),
      notes: 'KaloData: 35.3% growth, 359 items sold, $28.03 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 61 ──────────────────────────────────────────────────
    {
      brandName: 'VibeBeam',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'electronics', productType: 'Retailer',
      estimatedMonthlyGmv: 10060, kaloDataGmv: 10060, commissionRate: 10,
      status: 'new', score: score(4, 5, 4, 5),
      brief: brief('Retailer', '-22.3', 687, '14.65', 'electronics'),
      notes: 'KaloData: -22.3% growth, 687 items sold, $14.65 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 62 ──────────────────────────────────────────────────
    {
      brandName: 'Beauty Hub',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Retailer',
      estimatedMonthlyGmv: 10060, kaloDataGmv: 10060, commissionRate: 10,
      status: 'new', score: score(4, 5, 4, 5),
      brief: brief('Retailer', '-11.9', 869, '11.58', 'beauty', 'Beauty retailer in slight decline — LIVE can bring fresh visibility and community engagement.'),
      notes: 'KaloData: -11.9% growth, 869 items sold, $11.58 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 63 ──────────────────────────────────────────────────
    {
      brandName: 'Great Words',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10070, kaloDataGmv: 10070, commissionRate: 10,
      status: 'new', score: score(6, 7, 5, 4),
      brief: brief('Brand', '44.8', 1330, '7.59', 'other'),
      notes: 'KaloData: 44.8% growth, 1.33k items sold, $7.59 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 64 ──────────────────────────────────────────────────
    {
      brandName: 'Layered Blankets',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'home', productType: 'Retailer',
      estimatedMonthlyGmv: 10070, kaloDataGmv: 10070, commissionRate: 10,
      status: 'new', score: score(5, 5, 5, 6),
      brief: brief('Retailer', '15.8', 230, '43.77', 'home', 'Blankets and textiles are highly LIVE-friendly — texture demos, layering tips, and cozy aesthetics convert well.'),
      notes: 'KaloData: 15.8% growth, 230 items sold, $43.77 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 65 ──────────────────────────────────────────────────
    {
      brandName: 'TeeGalaxy1',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Retailer',
      estimatedMonthlyGmv: 10070, kaloDataGmv: 10070, commissionRate: 10,
      status: 'new', score: score(2, 5, 3, 5),
      brief: brief('Retailer', '-82', 864, '11.65', 'fashion'),
      notes: 'KaloData: -82% growth, 864 items sold, $11.65 avg price (Feb 06 – Mar 07 2026). Severe decline — low priority.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 66 ──────────────────────────────────────────────────
    {
      brandName: 'Sansku',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10070, kaloDataGmv: 10070, commissionRate: 10,
      status: 'new', score: score(3, 5, 4, 5),
      brief: brief('Retailer', '-37.1', 744, '13.53', 'other'),
      notes: 'KaloData: -37.1% growth, 744 items sold, $13.53 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 67 ──────────────────────────────────────────────────
    {
      brandName: 'CribCulture',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10070, kaloDataGmv: 10070, commissionRate: 10,
      status: 'new', score: score(5, 5, 4, 4),
      brief: brief('Retailer', '-4', 1510, '6.68', 'other'),
      notes: 'KaloData: -4% growth, 1.51k items sold, $6.68 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 68 ──────────────────────────────────────────────────
    {
      brandName: 'COOLWEN',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10070, kaloDataGmv: 10070, commissionRate: 10,
      status: 'new', score: score(5, 5, 5, 4),
      brief: brief('Retailer', '23.2', 967, '10.41', 'other'),
      notes: 'KaloData: 23.2% growth, 967 items sold, $10.41 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 69 ──────────────────────────────────────────────────
    {
      brandName: 'Skinetry',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Brand',
      estimatedMonthlyGmv: 10070, kaloDataGmv: 10070, commissionRate: 10,
      status: 'new', score: score(5, 7, 4, 5),
      brief: brief('Brand', '-0.4', 812, '12.40', 'beauty', 'Skincare brand nearly flat — LIVE routine demos can re-engage audience and drive consistent reorder revenue.'),
      notes: 'KaloData: -0.4% growth, 812 items sold, $12.40 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 70 ──────────────────────────────────────────────────
    {
      brandName: 'Cunkore',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10070, kaloDataGmv: 10070, commissionRate: 10,
      status: 'new', score: score(4, 7, 4, 5),
      brief: brief('Brand', '-19.6', 733, '13.74', 'other'),
      notes: 'KaloData: -19.6% growth, 733 items sold, $13.74 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 71 ──────────────────────────────────────────────────
    {
      brandName: 'FH HAIR.',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Retailer',
      estimatedMonthlyGmv: 10070, kaloDataGmv: 10070, commissionRate: 10,
      status: 'new', score: score(2, 5, 3, 5),
      brief: brief('Retailer', '-75.6', 694, '14.51', 'beauty'),
      notes: 'KaloData: -75.6% growth, 694 items sold, $14.51 avg price (Feb 06 – Mar 07 2026). Significant decline — low priority.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 72 ──────────────────────────────────────────────────
    {
      brandName: 'HBJB Shop',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10070, kaloDataGmv: 10070, commissionRate: 10,
      status: 'new', score: score(5, 5, 5, 4),
      brief: brief('Retailer', '6.9', 1980, '5.09', 'other'),
      notes: 'KaloData: 6.9% growth, 1.98k items sold, $5.09 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 73 ──────────────────────────────────────────────────
    {
      brandName: 'AUXDIO',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'electronics', productType: 'Brand',
      estimatedMonthlyGmv: 10070, kaloDataGmv: 10070, commissionRate: 10,
      status: 'new', score: score(3, 7, 4, 5),
      brief: brief('Brand', '-38.8', 519, '19.41', 'electronics'),
      notes: 'KaloData: -38.8% growth, 519 items sold, $19.41 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 74 ──────────────────────────────────────────────────
    {
      brandName: 'tree field',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'home', productType: 'Retailer',
      estimatedMonthlyGmv: 10070, kaloDataGmv: 10070, commissionRate: 10,
      status: 'new', score: score(6, 5, 5, 4),
      brief: brief('Retailer', '41.3', 986, '10.22', 'home'),
      notes: 'KaloData: 41.3% growth, 986 items sold, $10.22 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 75 ──────────────────────────────────────────────────
    {
      brandName: 'Aurawave SKincare',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Retailer',
      estimatedMonthlyGmv: 10080, kaloDataGmv: 10080, commissionRate: 10,
      status: 'new', score: score(3, 5, 4, 6),
      brief: brief('Retailer', '-37.9', 205, '49.17', 'beauty'),
      notes: 'KaloData: -37.9% growth, 205 items sold, $49.17 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 76 ── TIER 3 ────────────────────────────────────────
    {
      brandName: 'ChicPeakBLOOM',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Retailer',
      estimatedMonthlyGmv: 10080, kaloDataGmv: 10080, commissionRate: 10,
      status: 'new', score: score(9, 5, 6, 5),
      brief: brief('Retailer', '201.2', 878, '11.48', 'fashion', 'Fashion retailer with 201% growth. LIVE hauls and flash sales can capitalize on this momentum.'),
      notes: 'KaloData: 201.2% growth, 878 items sold, $11.48 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 77 ──────────────────────────────────────────────────
    {
      brandName: 'Aethera',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10080, kaloDataGmv: 10080, commissionRate: 10,
      status: 'new', score: score(9, 5, 6, 4),
      brief: brief('Retailer', '352.9', 941, '10.71', 'other', 'Nearly 4x growth signals strong viral potential. Research the product category and pitch LIVE as the next growth driver.'),
      notes: 'KaloData: 352.9% growth, 941 items sold, $10.71 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 78 ──────────────────────────────────────────────────
    {
      brandName: 'Hperpetual',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10080, kaloDataGmv: 10080, commissionRate: 10,
      status: 'new', score: score(8, 5, 6, 4),
      brief: brief('Retailer', '169', 1400, '7.21', 'other'),
      notes: 'KaloData: 169% growth, 1.4k items sold, $7.21 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 79 ──────────────────────────────────────────────────
    {
      brandName: 'Lamasini Brand',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Brand',
      estimatedMonthlyGmv: 10080, kaloDataGmv: 10080, commissionRate: 10,
      status: 'new', score: score(6, 7, 5, 8),
      brief: brief('Brand', '27.6', 121, '83.34', 'fashion', 'Premium fashion brand with solid growth. High AOV items demo well in LIVE — styling and exclusivity storytelling.'),
      notes: 'KaloData: 27.6% growth, 121 items sold, $83.34 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 80 ── TIER 1 HOT ───────────────────────────────────
    {
      brandName: 'Mirline&Lamarllc',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Retailer',
      estimatedMonthlyGmv: 10080, kaloDataGmv: 10080, commissionRate: 10,
      status: 'new', score: score(9, 5, 6, 9),
      brief: brief('Retailer', '216.1', 50, '201.68', 'fashion', 'Ultra-high AOV fashion ($202 avg) with 216% growth. LIVE drops of luxury items create massive urgency and exclusivity.'),
      notes: 'KaloData: 216.1% growth, 50 items sold, $201.68 avg price (Feb 06 – Mar 07 2026). TIER 1 — high AOV luxury fashion.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 81 ──────────────────────────────────────────────────
    {
      brandName: 'Jujaa Direct',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10080, kaloDataGmv: 10080, commissionRate: 10,
      status: 'new', score: score(6, 5, 5, 3),
      brief: brief('Retailer', '28.1', 2890, '3.49', 'other'),
      notes: 'KaloData: 28.1% growth, 2.89k items sold, $3.49 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 82 ──────────────────────────────────────────────────
    {
      brandName: 'Chic Nail Art',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Brand',
      estimatedMonthlyGmv: 10080, kaloDataGmv: 10080, commissionRate: 10,
      status: 'new', score: score(6, 7, 5, 3),
      brief: brief('Brand', '41.3', 2560, '3.94', 'beauty', 'Nail art is one of TikTok\'s most viral beauty niches. LIVE application demos and nail art tutorials drive massive engagement.'),
      notes: 'KaloData: 41.3% growth, 2.56k items sold, $3.94 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 83 ──────────────────────────────────────────────────
    {
      brandName: 'HEY SERY',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10080, kaloDataGmv: 10080, commissionRate: 10,
      status: 'new', score: score(5, 5, 5, 5),
      brief: brief('Retailer', '5.9', 761, '13.25', 'other'),
      notes: 'KaloData: 5.9% growth, 761 items sold, $13.25 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 84 ── TIER 2 ────────────────────────────────────────
    {
      brandName: 'Verve Carry Studio',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(8, 7, 6, 6),
      brief: brief('Brand', '112.1', 317, '31.82', 'other', 'Accessories brand over 100% growth. LIVE styling showcases and "what fits in my bag" content is highly engaging.'),
      notes: 'KaloData: 112.1% growth, 317 items sold, $31.82 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 85 ──────────────────────────────────────────────────
    {
      brandName: 'Garden-Wall',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'home', productType: 'Retailer',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(1, 5, 2, 7),
      brief: brief('Retailer', '-97.1', 139, '72.57', 'home'),
      notes: 'KaloData: -97.1% growth, 139 items sold, $72.57 avg price (Feb 06 – Mar 07 2026). Near-total collapse — do not prioritize.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 86 ──────────────────────────────────────────────────
    {
      brandName: 'MEDIHEAL Global',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Brand',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(5, 7, 5, 5),
      brief: brief('Brand', '15.9', 429, '23.51', 'beauty', 'Korean skincare brand (sheet masks, etc.). K-beauty LIVE content is extremely popular — ritual demos convert well.'),
      notes: 'KaloData: 15.9% growth, 429 items sold, $23.51 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 87 ──────────────────────────────────────────────────
    {
      brandName: 'Cowhide and Conchos',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Brand',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(6, 7, 5, 6),
      brief: brief('Brand', '32.3', 289, '34.91', 'fashion', 'Western-style accessories have a strong niche community. LIVE styling sessions with authentic storytelling convert well.'),
      notes: 'KaloData: 32.3% growth, 289 items sold, $34.91 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 88 ── TIER 3 ────────────────────────────────────────
    {
      brandName: 'Like Air Puffcorn',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'food', productType: 'Brand',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(8, 7, 6, 5),
      brief: brief('Brand', '142', 435, '23.19', 'food', 'Snack foods are made for TikTok LIVE — taste tests, crunch ASMR, and bundle deals perform extremely well.'),
      notes: 'KaloData: 142% growth, 435 items sold, $23.19 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 89 ──────────────────────────────────────────────────
    {
      brandName: 'Dirty Book Store',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(6, 7, 5, 5),
      brief: brief('Brand', '34.1', 523, '19.29', 'other', 'BookTok is one of TikTok\'s largest communities. LIVE book hauls, reviews, and recommendations drive strong sales.'),
      notes: 'KaloData: 34.1% growth, 523 items sold, $19.29 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 90 ── TIER 3 ────────────────────────────────────────
    {
      brandName: 'Creative Painting',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(8, 7, 6, 4),
      brief: brief('Brand', '108.4', 973, '10.37', 'other', 'Art supplies sell through LIVE process videos — watch-me-paint streams are a top-performing format on TikTok.'),
      notes: 'KaloData: 108.4% growth, 973 items sold, $10.37 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 91 ── TIER 2 ────────────────────────────────────────
    {
      brandName: 'SHELTER Trending Outfits',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Retailer',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(10, 5, 7, 4),
      brief: brief('Retailer', '>999.9%', 944, '10.69', 'fashion', 'Viral fashion retailer — >999% growth signals a major trend moment. Reach out immediately to ride this wave with LIVE.'),
      notes: 'KaloData: >999.9% growth, 944 items sold, $10.69 avg price (Feb 06 – Mar 07 2026). Viral momentum — urgent outreach.',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 92 ──────────────────────────────────────────────────
    {
      brandName: 'TrendyTees Shirt',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'fashion', productType: 'Retailer',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(5, 5, 4, 4),
      brief: brief('Retailer', '-1.1', 1080, '9.34', 'fashion'),
      notes: 'KaloData: -1.1% growth, 1.08k items sold, $9.34 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 93 ──────────────────────────────────────────────────
    {
      brandName: 'Rosegalette',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Brand',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(7, 7, 6, 5),
      brief: brief('Brand', '83.6', 561, '17.99', 'beauty', 'Beauty brand with strong growth. French-inspired aesthetic translates well to aspirational LIVE content.'),
      notes: 'KaloData: 83.6% growth, 561 items sold, $17.99 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 94 ──────────────────────────────────────────────────
    {
      brandName: 'Aura-Beauty',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Retailer',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(5, 5, 5, 4),
      brief: brief('Retailer', '7.7', 1370, '7.35', 'beauty'),
      notes: 'KaloData: 7.7% growth, 1.37k items sold, $7.35 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 95 ──────────────────────────────────────────────────
    {
      brandName: 'Solar Siren',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(6, 5, 5, 5),
      brief: brief('Retailer', '41.3', 793, '12.73', 'other'),
      notes: 'KaloData: 41.3% growth, 793 items sold, $12.73 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 96 ──────────────────────────────────────────────────
    {
      brandName: 'TrendyTech US',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'electronics', productType: 'Retailer',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(5, 5, 5, 4),
      brief: brief('Retailer', '5.8', 1330, '7.62', 'electronics'),
      notes: 'KaloData: 5.8% growth, 1.33k items sold, $7.62 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 97 ──────────────────────────────────────────────────
    {
      brandName: 'Chic Beauty Market',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Brand',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(4, 7, 4, 9),
      brief: brief('Brand', '-23.5', 83, '121.62', 'beauty', 'High-ticket beauty brand. Despite decline, premium beauty does well in LIVE through luxury unboxing and skin transformation demos.'),
      notes: 'KaloData: -23.5% growth, 83 items sold, $121.62 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 98 ──────────────────────────────────────────────────
    {
      brandName: 'PAUL MORENOA',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Retailer',
      estimatedMonthlyGmv: 10090, kaloDataGmv: 10090, commissionRate: 10,
      status: 'new', score: score(5, 5, 5, 5),
      brief: brief('Retailer', '15.6', 738, '13.68', 'other'),
      notes: 'KaloData: 15.6% growth, 738 items sold, $13.68 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 99 ── TIER 3 ────────────────────────────────────────
    {
      brandName: 'SEESE ACO',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'beauty', productType: 'Brand',
      estimatedMonthlyGmv: 10100, kaloDataGmv: 10100, commissionRate: 10,
      status: 'new', score: score(8, 7, 6, 5),
      brief: brief('Brand', '119.2', 352, '28.68', 'beauty', 'Beauty brand over 100% growth. LIVE skincare and eco-beauty demos are highly engaging — pitch the growth acceleration angle.'),
      notes: 'KaloData: 119.2% growth, 352 items sold, $28.68 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
    // ── 100 ──────────────────────────────────────────────────
    {
      brandName: 'Jovi-mindly & Notchies',
      contactName: '', contactRole: '', email: '', phone: '',
      tiktokHandle: '', website: '',
      productCategory: 'other', productType: 'Brand',
      estimatedMonthlyGmv: 10100, kaloDataGmv: 10100, commissionRate: 10,
      status: 'new', score: score(3, 7, 4, 5),
      brief: brief('Brand', '-50.4', 357, '28.28', 'other'),
      notes: 'KaloData: -50.4% growth, 357 items sold, $28.28 avg price (Feb 06 – Mar 07 2026)',
      source: 'KaloData', tiktokShopUrl: '', createdAt: today, updatedAt: today,
    },
  ];

  // ── Inject into Zustand localStorage ──────────────────────
  const STORAGE_KEY = 'aria-leads';
  const raw = localStorage.getItem(STORAGE_KEY);
  let existing = [];
  try {
    const parsed = JSON.parse(raw);
    existing = parsed?.state?.leads ?? [];
  } catch (e) {
    console.warn('ARIA: Could not parse existing leads. Starting fresh injection.');
  }

  const injected = newLeads.map((lead, i) => ({
    id: `mar09-${i + 1}-${ts}`,
    ...lead,
  }));

  const merged = [...existing, ...injected];

  const newState = { state: { leads: merged }, version: 0 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

  console.log(`✅ ARIA: Injected ${injected.length} leads from KaloData (Mar 09, 2026 batch).`);
  console.log(`📊 Total leads in store: ${merged.length}`);
  console.log('🔄 Refresh the page to see them in the dashboard.');
  console.log('');
  console.log('⭐ TIER 1 HOT LEADS (score ≥ 7.5):');
  console.log('   #21 Amada NatureVibe (7.9) — health, 237% growth, $139 AOV');
  console.log('   #23 ScootHop US (7.8) — electronics, 160% growth, $436 AOV');
  console.log('   #57 Zlike Hair (7.9) — beauty, 189% growth, $132 AOV');
  console.log('   #5  Ctop pre-owned luxury (7.6) — fashion, 442% growth, $834 AOV');
  console.log('   #80 Mirline&Lamarllc (7.4) — fashion, 216% growth, $202 AOV');
})();
