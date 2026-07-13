import { PoolConfig } from './types';
import { demoAnalyses, demoCoupons } from './demoData';
import { updateGlobalConfig } from './utils/supabase';

const SEED_FLAG = 'ecosystem_seeded_v11'; // Bumped to v11 to force fresh load of new World Cup 2026 analyses

export async function seedEcosystemData() {
    if (localStorage.getItem(SEED_FLAG)) return;

    console.log('🚀 Starting ecosystem synchronization v11 (15-day dynamic analyses)...');

    // ─── 1. SEED ANALYSES ──────────────────────────────────────────────────────
    try {
        localStorage.setItem('site_analyses', JSON.stringify(demoAnalyses));
        await updateGlobalConfig('site_analyses', demoAnalyses);
        console.log('✅ 15-day analyses successfully seeded in local storage and Supabase.');
    } catch (e) {
        console.warn('Local Sync (Analyses) failed:', e);
    }

    // ─── 2. SEED COUPONS ───────────────────────────────────────────────────────
    try {
        const stored = localStorage.getItem('site_coupons');
        if (!stored || JSON.parse(stored).length === 0) {
            localStorage.setItem('site_coupons', JSON.stringify(demoCoupons));
        }
    } catch (e) {
        console.warn('Local Sync (Coupons) failed:', e);
    }

    // ─── 3. SEED POOL (724TOTO) ────────────────────────────────────────────────
    try {
        const stored = localStorage.getItem('site_pool_config');
        if (!stored || (stored.startsWith('[') && JSON.parse(stored).length === 0)) {
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
    } catch (e) {
         console.warn('Local Sync (Pool) failed:', e);
    }

    localStorage.setItem(SEED_FLAG, 'true');
    console.log('✅ Ecosystem synchronization attempt finished.');
}
