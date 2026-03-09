import type { OutreachTemplate } from '../types'

export const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  // ── COLD OUTREACH ──────────────────────────────────────────
  {
    id: 'cold_dm',
    name: 'Cold DM (TikTok)',
    subject: undefined,
    body: `Hi {{contactName}}! I came across {{brandName}} on TikTok and love what you're doing with {{productType}}. We're a TikTok Shop live selling agency that helps brands like yours drive serious GMV through engaging live sessions. We've helped similar brands in the {{productCategory}} space hit {{estimatedGmv}} in monthly sales through live selling alone. Would you be open to a quick chat about how we can help {{brandName}} scale on TikTok Shop?`,
    variables: ['contactName', 'brandName', 'productType', 'productCategory', 'estimatedGmv'],
  },
  {
    id: 'video_demo_dm',
    name: '🎥 Video Demo DM (Best Opener)',
    subject: undefined,
    body: `Hey {{contactName}}! 👋 I've been following {{brandName}} on TikTok Shop and I'm impressed with your {{productType}} lineup.\n\nI run a TikTok Shop management agency and I actually recorded a quick LIVE selling demo featuring a product similar to yours — just to show you what a session would look like for {{brandName}}.\n\n🎥 [Video attached]\n\nWe help US brands scale GMV through:\n• Daily hosted LIVE sessions (professional hosts + scripts)\n• Creator free sample programs\n• GMV Max ad optimization\n\nWould a quick 15-min call be worth your time this week? I can walk you through exactly what we'd do for {{brandName}}.\n\n— Orlie`,
    variables: ['contactName', 'brandName', 'productType'],
  },
  {
    id: 'cold_email',
    name: '📧 Cold Email',
    subject: 'Quick question about {{brandName}} + TikTok LIVE — demo video inside',
    body: `Hi {{contactName}},\n\nI came across {{brandName}} on TikTok Shop and noticed you're doing well in {{productCategory}} — your {{productType}} lineup looks solid.\n\nI run a TikTok Shop management agency, and I wanted to ask: are you currently running LIVE selling sessions?\n\nI actually recorded a quick demo of a LIVE session featuring a product similar to yours, so you can see exactly what it would look like for {{brandName}}: [video link]\n\nWe help US-based brands grow GMV through:\n• Daily hosted LIVE selling (professional hosts, scripts, scheduling)\n• Creator free sample program (recruit, vet, ship, manage)\n• GMV Max ad optimization\n• Full TikTok Shop management\n\nI've done a quick audit of your shop and have 2-3 specific ideas that could drive growth. Would a 15-min call be worth your time this week?\n\nBest,\nOrlie`,
    variables: ['contactName', 'brandName', 'productCategory', 'productType'],
  },
  {
    id: 'linkedin_outreach',
    name: '💼 LinkedIn Outreach',
    subject: undefined,
    body: `Hi {{contactName}},\n\nI came across {{brandName}} while researching top TikTok Shop sellers in the {{productCategory}} space — congrats on what you've built!\n\nI run a TikTok Shop management agency specializing in LIVE selling, creator programs, and GMV Max ads for US-based brands. I noticed a few growth opportunities for {{brandName}} that I think could meaningfully move the needle.\n\nI actually put together a quick LIVE selling demo featuring a product similar to your {{productType}} — happy to share it if you're curious what a session would look like.\n\nWould you be open to a 15-minute call this week? No pitch, just sharing what I've seen work in your space.\n\nBest,\nOrlie`,
    variables: ['contactName', 'brandName', 'productCategory', 'productType'],
  },

  // ── FOLLOW-UPS ─────────────────────────────────────────────
  {
    id: 'follow_up',
    name: 'Follow-up (Day 3)',
    subject: undefined,
    body: `Hey {{contactName}}, just following up on my message about helping {{brandName}} with live selling on TikTok Shop. I put together some ideas specific to your {{productType}} line that I think could drive real results. Our team has professional hosts ready to showcase your products to engaged buyers. When would work for a quick 15-minute call this week?`,
    variables: ['contactName', 'brandName', 'productType'],
  },
  {
    id: 'post_call_followup',
    name: '📞 Post-Call Follow-up',
    subject: 'Great chatting — next steps for {{brandName}}',
    body: `Hi {{contactName}},\n\nGreat speaking with you today! As discussed, here's a quick summary:\n\n✅ What we'll do for {{brandName}}:\n• {{service1}}\n• {{service2}}\n• {{service3}}\n\n💰 Investment: {{retainerFee}}/month (3-month minimum)\n📈 GMV target: {{gmvTarget}}/month\n🛡️ Performance guarantee: If we don't grow your GMV by 20% in 90 days, you get a free month extension\n\n📋 Next steps:\n1. You confirm and we send the agreement\n2. We start onboarding within 48 hours\n3. First LIVE session within 1 week\n\nLet me know if you have any questions. Looking forward to working with {{brandName}}!\n\nBest,\nOrlie`,
    variables: ['contactName', 'brandName', 'service1', 'service2', 'service3', 'retainerFee', 'gmvTarget'],
  },
  {
    id: 'breakup_email',
    name: '👋 Breakup / Last Chance',
    subject: 'Should I close your file?',
    body: `Hi {{contactName}},\n\nI've reached out a few times about helping {{brandName}} scale on TikTok Shop but haven't heard back. Totally understand if the timing isn't right.\n\nI'll go ahead and close your file on my end — but if things change and you want to explore TikTok LIVE selling, creator programs, or shop management, just reply to this and we'll pick it up.\n\nWishing {{brandName}} continued success!\n\nBest,\nOrlie`,
    variables: ['contactName', 'brandName'],
  },

  // ── SALES PROCESS ──────────────────────────────────────────
  {
    id: 'pitch_deck_intro',
    name: 'Pitch Deck Intro',
    subject: 'TikTok Shop Live Selling Partnership - {{brandName}}',
    body: `Hi {{contactName}}, thank you for your interest in exploring a TikTok Shop live selling partnership! I've attached our agency pitch deck that covers:\n\n- How our live selling model works\n- Case studies from brands in the {{productCategory}} space\n- Our pricing structure and expected ROI\n- Our team of trained live selling hosts\n\nI'd love to walk you through it and discuss how we can tailor our approach specifically for {{brandName}}. What day works best for a 30-minute call?`,
    variables: ['contactName', 'brandName', 'productCategory'],
  },
  {
    id: 'closing_proposal',
    name: 'Closing / Proposal',
    subject: 'Partnership Proposal - {{brandName}} x Our Agency',
    body: `Hi {{contactName}}, great chatting with you about {{brandName}}'s TikTok Shop goals! As discussed, here's our proposal:\n\n- Live selling schedule: {{liveSchedule}}\n- GMV target: {{gmvTarget}}/month\n- Commission rate: {{commissionRate}} of GMV\n- Monthly retainer: {{retainerFee}}\n- Start date: {{startDate}}\n- Minimum term: 3 months\n- Performance guarantee: 20% GMV growth in 90 days or 1 free month\n\nWe're confident we can help {{brandName}} hit these targets based on our experience with similar {{productCategory}} brands. Let me know if you have any questions or if you'd like to adjust anything. Looking forward to working together!`,
    variables: ['contactName', 'brandName', 'liveSchedule', 'gmvTarget', 'commissionRate', 'retainerFee', 'startDate', 'productCategory'],
  },
  {
    id: 'onboarding_welcome',
    name: 'Onboarding Welcome',
    subject: 'Welcome to the Team, {{brandName}}!',
    body: `Hi {{contactName}}, welcome aboard! We're thrilled to officially partner with {{brandName}} for TikTok Shop management.\n\nHere's what happens next:\n1. Product catalog review — please send us your top-selling products and any new launches\n2. TikTok Shop access — we'll need collaborator access to your seller center\n3. Host assignment — we'll match you with the best LIVE host for your brand\n4. Content planning — we'll create a live selling schedule and script framework\n5. Creator program setup — we'll begin recruiting creators for free samples\n6. Test stream — a practice session before we go live\n\nOur team will reach out within 24 hours to kick things off. If you have any questions in the meantime, feel free to reach out anytime.\n\nLet's make some sales! 🔥`,
    variables: ['contactName', 'brandName'],
  },

  // ── CREATOR RECRUITMENT ────────────────────────────────────
  {
    id: 'creator_recruit',
    name: '🎬 Creator Recruitment DM',
    subject: undefined,
    body: `Hey {{creatorName}}! 👋\n\nLoved your content on TikTok — your style would be perfect for {{brandName}}!\n\nWe manage their TikTok Shop and we're looking for creators to feature their {{productType}} through free samples + affiliate commissions.\n\n🎁 What you get:\n• Free products shipped to you\n• {{commissionRate}} commission on every sale\n• Ongoing partnership (not one-off)\n\nInterested? Just reply and I'll get a sample shipped out this week!\n\n— Orlie, {{brandName}} Creator Team`,
    variables: ['creatorName', 'brandName', 'productType', 'commissionRate'],
  },
]

export function renderTemplate(
  templateBody: string,
  variables: Record<string, string>
): string {
  let result = templateBody
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
  }
  return result
}

export function getUnfilledVariables(
  templateBody: string,
  variables: Record<string, string>
): string[] {
  const matches = templateBody.match(/\{\{(\w+)\}\}/g) || []
  const allVars = matches.map(m => m.replace(/\{\{|\}\}/g, ''))
  return [...new Set(allVars)].filter(v => !variables[v])
}
