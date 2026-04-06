import { MatchAnalysis, PoolConfig } from './types';
import { demoAnalyses, demoCoupons } from './demoData';

const SEED_FLAG = 'ecosystem_seeded_v2'; // Bumped to v2 to force re-seed including Mar 31 matches

export function seedEcosystemData() {
    if (localStorage.getItem(SEED_FLAG)) return; // already seeded

    // ─── 1. SEED ANALYSES ──────────────────────────────────────────────────────
    try {
        const existingAnalysesStr = localStorage.getItem('site_analyses');
        
        // Only seed if the key doesn't exist at all (null)
        if (existingAnalysesStr === null) {
            localStorage.setItem('site_analyses', JSON.stringify(demoAnalyses));
        } else {
            // Optional: If you want to merge NEW demo analyses into existing list without overwriting, 
            // you can keep the ID-check logic, but ONLY if they are NOT empty.
            // For now, let's respect the user's decision to empty it.
        }
    } catch (e) {
        console.error('Seed Analyses Error:', e);
    }

    // ─── 2. SEED COUPONS ───────────────────────────────────────────────────────
    try {
        const existingCouponsStr = localStorage.getItem('site_coupons');
        
        // Only seed if the key doesn't exist at all (null)
        if (existingCouponsStr === null) {
            localStorage.setItem('site_coupons', JSON.stringify(demoCoupons));
        }
    } catch (e) {
        console.error('Seed Coupons Error:', e);
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
