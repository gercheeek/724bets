/**
 * 724Bets - Odds Engine Configuration
 * This file acts as the central skeleton for all procedural odds generation,
 * team prioritization (VIP lists), and market suspension rules.
 */

export const ODDS_ENGINE_CONFIG = {
    version: "2.0.1",
    lastUpdated: new Date().toISOString(),
    
    // --- VIP TEAMS (Tier 1) ---
    // These teams get priority sorting, UI highlights, and guaranteed full market generation.
    vipTeams: [
        'real madrid', 'manchester united', 'barcelona', 'liverpool', 'manchester city',
        'bayern münih', 'bayern munich', 'paris saint-germain', 'psg', 'arsenal', 'tottenham hotspur', 'tottenham', 'chelsea',
        'juventus', 'borussia dortmund', 'atlético madrid', 'atletico madrid', 'ac milan', 'milan', 'inter milan', 'inter',
        'west ham united', 'newcastle united', 'aston villa', 'roma', 'napoli',
        'bayer leverkusen', 'rb leipzig', 'benfica', 'porto', 'sporting cp', 'sporting',
        'ajax', 'psv eindhoven', 'psv', 'feyenoord', 'lazio', 'atalanta', 'fiorentina',
        'sevilla', 'real sociedad', 'real betis', 'villarreal', 'athletic bilbao',
        'everton', 'brighton & hove albion', 'brighton', 'brentford', 'fulham', 'crystal palace',
        'nottingham forest', 'wolverhampton wanderers', 'wolves', 'wolverhampton', 'bournemouth',
        'olympique de marseille', 'marseille', 'olympique lyonnais', 'lyon', 'monaco', 'lille', 'lens', 'rennes',
        'eintracht frankfurt', 'borussia mönchengladbach', 'vfb stuttgart', 'stuttgart', 'sc freiburg', 'wolfsburg',
        'galatasaray', 'fenerbahçe', 'fenerbahce', 'beşiktaş', 'besiktas', 'trabzonspor',
        'celtic', 'rangers', 'club brugge', 'anderlecht', 'red bull salzburg', 'salzburg',
        'shakhtar donetsk', 'dinamo zagreb', 'olympiakos', 'panathinaikos', 'aek', 'aek athens', 'paok', 'kopenhag', 'copenhagen',
        'boca juniors', 'river plate', 'flamengo', 'palmeiras', 'são paulo', 'sao paulo', 'corinthians',
        'fluminense', 'santos', 'gremio', 'atletico mineiro', 'atlético mineiro',
        'cruz azul', 'club américa', 'club america', 'monterrey', 'tigres',
        'los angeles fc', 'lafc', 'inter miami', 'la galaxy', 'seattle sounders',
        'al hilal', 'al nassr', 'al-nassr', 'al ittihad', 'al ahli',
        'nacional', 'peñarol', 'penarol', 'colo-colo', 'universidad de chile',
        'al ahly', 'wydad ac'
    ],

    // --- GENERATOR RULES ---
    rules: {
        // Time Decay
        timeDecayEnabled: true,
        timeDecayStartMinute: 1, // When to start reducing probabilities
        maxMinuteThreshold: 90, // When to drastically cut probabilities

        // Totals & Corners
        goalBaseMargin: 0.5, // e.g., if 3 goals, base line is 3.5
        goalProb1More: 0.85, // Base probability for scoring at least 1 more goal
        goalProb2MoreMultiplier: 0.65, // Multiplier for 2nd goal
        goalProb3MoreMultiplier: 0.50, // Multiplier for 3rd goal
        goalProb4MoreMultiplier: 0.35, // Multiplier for 4th goal

        cornerBaseMargin: 9.5, // Initial expected corners
        cornerTimeFractionMax: 90, // Minute at which no more corners are expected

        // Margins & Vig
        houseEdgePercentage: 0.06, // 6% theoretical house edge (vig)

        // Lock / Suspension
        lockKeywords: ['FT', 'MS', 'Bitti', 'Canceled'],
        suspendStatuses: ['finished', 'suspended']
    }
};

export const getOddsEngineConfig = () => {
    if (typeof window !== 'undefined') {
        try {
            const stored = localStorage.getItem('odds_engine_config');
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with default to ensure no missing keys if schema updates
                return {
                    ...ODDS_ENGINE_CONFIG,
                    ...parsed,
                    rules: {
                        ...ODDS_ENGINE_CONFIG.rules,
                        ...(parsed.rules || {})
                    }
                };
            }
        } catch (e) {
            console.error('Failed to parse odds_engine_config from localStorage', e);
        }
    }
    return ODDS_ENGINE_CONFIG;
};

export const saveOddsEngineConfig = (config: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('odds_engine_config', JSON.stringify(config));
    }
};
