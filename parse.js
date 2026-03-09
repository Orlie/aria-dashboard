const fs = require('fs');

const text = fs.readFileSync('raw.txt', 'utf8');

const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');

const leads = [];
let i = 0;

function parseVal(s) {
    if (!s) return 0;
    let multiplier = 1;
    if (s.includes('k') || s.includes('K')) multiplier = 1000;
    if (s.includes('m') || s.includes('M')) multiplier = 1000000;
    let n = parseFloat(s.replace(/[^0-9.]/g, ''));
    if (isNaN(n)) return 0;
    return n * multiplier;
}

function score(rp, bf, ec, pm) {
    const overall = Math.round((rp * 0.35 + bf * 0.25 + ec * 0.20 + pm * 0.20) * 10) / 10;
    return { revenuePotential: rp, brandFit: bf, easeOfClosing: ec, productMargins: pm, overall };
}

while (i < lines.length) {
    if (lines[i].match(/^\d+$/)) { // Rank
        let rank = lines[i++];
        if (i >= lines.length) break;

        let brandName = lines[i++];
        let type = lines[i++]; // BRAND | RETAILER
        let revenueStr = lines[i++]; // $10.00k
        let growth = lines[i++]; // 56.8%
        let itemsAndPrice = lines[i++]; // 223 $44.85

        // Remove trailing tabs
        revenueStr = revenueStr.replace(/\t/g, '');
        growth = growth.replace(/\t/g, '');

        let parts = itemsAndPrice.split(/\s+/);
        let itemsSold = parts[0] ? parseVal(parts[0]) : 0;
        let avgPrice = parts[1] ? parseVal(parts[1]) : 0;

        let gmv = parseVal(revenueStr);

        leads.push({
            id: `kalo-${rank}-${Date.now()}`,
            brandName: brandName,
            contactName: '',
            contactRole: '',
            email: '',
            phone: '',
            tiktokHandle: '',
            website: '',
            productCategory: 'other', // Default to other, user can edit
            productType: type,
            estimatedMonthlyGmv: gmv,
            commissionRate: 10,
            status: 'new',
            score: score(6, 6, 5, 5), // Generic default score
            brief: {
                brandOverview: `${type} with ${growth} revenue growth. ${itemsSold} items sold, avg unit price $${avgPrice.toFixed(2)}.`,
                fitAnalysis: `Steady growth. Verify category before outreach.`,
                recommendedPitchAngle: `Pitch LIVE selling as a revenue accelerator.`,
                followUpSchedule: [
                    { day: 3, action: 'Send Day 3 follow-up DM', status: 'pending', scheduledDate: '2026-03-08' },
                    { day: 7, action: 'Send Day 7 follow-up if no reply', status: 'pending', scheduledDate: '2026-03-12' }
                ]
            },
            notes: `KaloData Import: ${growth} growth, ${itemsSold} items sold, $${avgPrice.toFixed(2)} avg price (Feb 03 - Mar 04).`,
            source: 'KaloData',
            createdAt: '2026-03-06',
            updatedAt: '2026-03-06'
        });
    } else {
        i++;
    }
}

// Generate TS file
const tsCode = `
import type { Lead } from '../types';

export const DEMO_LEADS: any[] = ${JSON.stringify(leads, null, 2)};
`;

fs.writeFileSync('./src/lib/demo-data.ts', tsCode.trim());
console.log('Successfully wrote', leads.length, 'leads to src/lib/demo-data.ts');
