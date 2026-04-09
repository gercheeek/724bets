import { supabase } from './utils/supabase';
import { MatchAnalysis, PoolConfig } from './types';
import { demoAnalyses, demoCoupons } from './demoData';

const SEED_FLAG = 'ecosystem_seeded_v4'; // Bumped to v4 for 9 April Clean Slate reset

export async function seedEcosystemData() {
    if (localStorage.getItem(SEED_FLAG)) return;

    console.log('🚀 Starting ecosystem synchronization...');

    // ─── 1. SEED ANALYSES ──────────────────────────────────────────────────────
    try {
        const stored = localStorage.getItem('site_analyses');
        if (!stored) {
            localStorage.setItem('site_analyses', JSON.stringify(demoAnalyses));
        }
    } catch (e) {
        console.warn('Local Sync (Analyses) failed:', e);
    }

    // ─── 2. SEED COUPONS ───────────────────────────────────────────────────────
    try {
        const stored = localStorage.getItem('site_coupons');
        if (!stored) {
            localStorage.setItem('site_coupons', JSON.stringify(demoCoupons));
        }
    } catch (e) {
        console.warn('Local Sync (Coupons) failed:', e);
    }

    // ─── 3. SEED POOL (724TOTO) ────────────────────────────────────────────────
    try {
        const stored = localStorage.getItem('site_pool_config');
        if (!stored) {
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
