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
        // Turkey
        'galatasaray', 'fenerbahçe', 'fenerbahce', 'beşiktaş', 'besiktas', 'trabzonspor', 'başakşehir', 'basaksehir',
        // England
        'manchester city', 'arsenal', 'liverpool', 'manchester united', 'chelsea', 'tottenham', 'newcastle', 'aston villa',
        'west ham united', 'brighton', 'everton', 'crystal palace', 'brentford',
        // Spain
        'real madrid', 'barcelona', 'atletico madrid', 'girona', 'athletic bilbao', 'real sociedad',
        'sevilla', 'valencia', 'villarreal', 'real betis',
        // Italy
        'inter', 'ac milan', 'milan', 'juventus', 'napoli', 'roma', 'lazio', 'atalanta',
        'fiorentina', 'bologna', 'torino',
        // Germany
        'bayern munich', 'bayern münih', 'bayer leverkusen', 'borussia dortmund', 'rb leipzig', 'stuttgart',
        'eintracht frankfurt', 'wolfsburg', 'borussia mönchengladbach', 'werder bremen',
        // France
        'psg', 'paris saint-germain', 'monaco', 'marseille', 'lille', 'lyon',
        'lens', 'rennes', 'nice',
        // South America
        'inter miami', 'boca juniors', 'river plate', 'flamengo',
        'palmeiras', 'são paulo', 'corinthians', 'fluminense', 'atletico mineiro', 'botafogo',
        'racing club', 'independiente',
        // Saudi Arabia
        'al nassr', 'al-nassr', 'al hilal',
        // Rest of Europe Elite
        'ajax', 'psv', 'feyenoord', 'benfica', 'sporting cp', 'porto', 'celtic', 'rangers',
        'braga', 'vitoria guimaraes', 'az alkmaar', 'fc twente', 'club brugge', 'anderlecht', 'genk', 'royal antwerp',
        'olympiacos', 'panathinaikos', 'aek athens', 'paok'
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
