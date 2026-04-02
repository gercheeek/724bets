import { MatchAnalysis, PoolConfig } from './types';
import { demoAnalyses, demoCoupons } from './demoData';

const SEED_FLAG = 'ecosystem_seeded_v2'; // Bumped to v2 to force re-seed including Mar 31 matches

export function seedEcosystemData() {
    if (localStorage.getItem(SEED_FLAG)) return; // already seeded

    // ─── 1. SEED ANALYSES ──────────────────────────────────────────────────────
    try {
        const existingAnalysesStr = localStorage.getItem('site_analyses');
        const existingAnalyses = existingAnalysesStr ? JSON.parse(existingAnalysesStr) : [];
        
        // Only add demoAnalyses that don't exist yet (by ID) to avoid duplicates
        const existingIds = new Set(existingAnalyses.map((a: MatchAnalysis) => a.id));
        const newAnalyses = demoAnalyses.filter(a => !existingIds.has(a.id));
        
        if (newAnalyses.length > 0) {
            localStorage.setItem('site_analyses', JSON.stringify([...newAnalyses, ...existingAnalyses]));
        } else if (!existingAnalysesStr) {
            localStorage.setItem('site_analyses', JSON.stringify(demoAnalyses));
        }
    } catch (e) {
        console.error('Seed Analyses Error:', e);
        localStorage.setItem('site_analyses', JSON.stringify(demoAnalyses));
    }

    // ─── 2. SEED COUPONS ───────────────────────────────────────────────────────
    try {
        const existingCouponsStr = localStorage.getItem('site_coupons');
        const existingCoupons = existingCouponsStr ? JSON.parse(existingCouponsStr) : [];
        
        const existingCouponIds = new Set(existingCoupons.map((c: any) => c.id));
        const newCoupons = demoCoupons.filter(c => !existingCouponIds.has(c.id));

        if (newCoupons.length > 0) {
            localStorage.setItem('site_coupons', JSON.stringify([...newCoupons, ...existingCoupons]));
        } else if (!existingCouponsStr) {
            localStorage.setItem('site_coupons', JSON.stringify(demoCoupons));
        }
    } catch (e) {
        console.error('Seed Coupons Error:', e);
        localStorage.setItem('site_coupons', JSON.stringify(demoCoupons));
    }

    // ─── 3. SEED POOL (724TOTO) ────────────────────────────────────────────────
    if (!localStorage.getItem('site_pool_config')) {
        const poolConfig: PoolConfig = {
            id: 'pool-seed-1',
            matches: demoAnalyses.slice(0, 15).map((m, i) => ({
                id: `pm-${i}`,
                homeTeam: m.homeTeam,
                awayTeam: m.awayTeam,
                league: m.league,
                matchDate: `${m.matchDate} ${m.matchTime}`,
            })),
            entries: [],
            status: 'open',
            prizePool: 25000,
            prize15: 15000,
            prize14: 7000,
            prize13: 3000,
            freeEntryUsed: {},
            createdAt: Date.now(),
        };
        localStorage.setItem('site_pool_config', JSON.stringify(poolConfig));
    }

    localStorage.setItem(SEED_FLAG, 'true');
    console.log('✅ 724Bets ecosystem seeded v2: Synchronized with demoData.ts');
}
