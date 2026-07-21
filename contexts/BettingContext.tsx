import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';
import { calculateMarketCount } from '../utils/marketUtils';

// Bet Slip Item Structure
export interface BetSelection {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  marketName: string;
  selectionName: string;
  odd: number;
}

// WebSocket Event Structure
export interface WSEvent {
  id: string;
  data: any;
}

interface BettingContextType {
  events: any[];
  isConnected: boolean;
  globalLiveMatches: any[];
  
  // Filters
  activeSport: string;
  setActiveSport: (sport: string) => void;
  activeLeague: string | null;
  setActiveLeague: (league: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Bet Slip
  betTab: string;
  setBetTab: (tab: string) => void;
  betSelections: BetSelection[];
  toggleBetSelection: (match: any, marketName: string, selectionName: string, odd: number) => void;
  removeBetSelection: (id: string) => void;
  clearBetSelections: () => void;
  
  // Modal
  selectedMatch: any | null;
  setSelectedMatch: (match: any | null) => void;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

const INITIAL_MOCK_EVENTS: WSEvent[] = [
  // --- CLUB FRIENDLIES (Hazırlık Maçları) ---
  {
    id: 'friendly_1',
    data: {
      status: 'in_progress',
      minute: 24,
      sport: { name: 'Soccer' },
      tournament: { name: 'Club Friendlies' },
      country: { name: 'World' },
      participants: { home: 'Real Madrid', away: 'AC Milan' },
      score: '1 - 0',
      start_time: new Date(Date.now() - 24 * 60000).toISOString(),
      group_markets: {
        'full_event|0': ['|1x2|~home~1.85!~draw~3.60!~away~4.20']
      }
    }
  },
  {
    id: 'friendly_2',
    data: {
      status: 'in_progress',
      minute: 68,
      sport: { name: 'Soccer' },
      tournament: { name: 'Club Friendlies' },
      country: { name: 'World' },
      participants: { home: 'Galatasaray', away: 'Parma' },
      score: '2 - 1',
      start_time: new Date(Date.now() - 68 * 60000).toISOString(),
      group_markets: {
        'full_event|0': ['|1x2|~home~1.45!~draw~4.10!~away~6.50']
      }
    }
  },
  {
    id: 'friendly_3',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Club Friendlies' },
      country: { name: 'World' },
      participants: { home: 'Fenerbahçe', away: 'Strasbourg' },
      start_time: new Date(Date.now() + 3600000).toISOString(),
      group_markets: {
        'full_event|0': ['|1x2|~home~1.60!~draw~3.80!~away~4.80']
      }
    }
  },
  {
    id: 'friendly_4',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Club Friendlies' },
      country: { name: 'World' },
      participants: { home: 'Bayern Munich', away: 'Tottenham' },
      start_time: new Date(Date.now() + 7200000).toISOString(),
      group_markets: {
        'full_event|0': ['|1x2|~home~1.95!~draw~3.50!~away~3.60']
      }
    }
  },
  {
    id: 'friendly_5',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Club Friendlies' },
      country: { name: 'World' },
      participants: { home: 'PSG', away: 'Inter' },
      start_time: new Date(Date.now() + 86400000).toISOString(),
      group_markets: {
        'full_event|0': ['|1x2|~home~2.20!~draw~3.40!~away~3.10']
      }
    }
  },
  {
    id: 'friendly_6',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Club Friendlies' },
      country: { name: 'World' },
      participants: { home: 'Barcelona', away: 'Juventus' },
      start_time: new Date(Date.now() + 86400000 * 2).toISOString(),
      group_markets: {
        'full_event|0': ['|1x2|~home~2.10!~draw~3.50!~away~3.20']
      }
    }
  },
  {
    id: 'friendly_7',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Club Friendlies' },
      country: { name: 'World' },
      participants: { home: 'Arsenal', away: 'Bayer Leverkusen' },
      start_time: new Date(Date.now() + 86400000 * 2).toISOString(),
      group_markets: {
        'full_event|0': ['|1x2|~home~1.85!~draw~3.70!~away~3.90']
      }
    }
  },
  {
    id: 'friendly_8',
    data: {
      status: 'in_progress',
      minute: 12,
      sport: { name: 'Soccer' },
      tournament: { name: 'Club Friendlies' },
      country: { name: 'World' },
      participants: { home: 'Chelsea', away: 'Celtic' },
      score: '0 - 0',
      start_time: new Date(Date.now() - 12 * 60000).toISOString(),
      group_markets: {
        'full_event|0': ['|1x2|~home~1.55!~draw~4.00!~away~5.50']
      }
    }
  },
  {
    id: 'friendly_9',
    data: {
      status: 'in_progress',
      minute: 85,
      sport: { name: 'Soccer' },
      tournament: { name: 'Club Friendlies' },
      country: { name: 'World' },
      participants: { home: 'Manchester City', away: 'AC Milan' },
      score: '2 - 2',
      start_time: new Date(Date.now() - 85 * 60000).toISOString(),
      group_markets: {
        'full_event|0': ['|1x2|~home~2.40!~draw~1.90!~away~4.10']
      }
    }
  },
  {
    id: 'friendly_10',
    data: {
      status: 'finished',
      sport: { name: 'Soccer' },
      tournament: { name: 'Club Friendlies' },
      country: { name: 'World' },
      participants: { home: 'Liverpool', away: 'Sevilla' },
      score: '4 - 1',
      start_time: new Date(Date.now() - 86400000).toISOString(),
      group_markets: {
        'full_event|0': ['|1x2|~home~1.40!~draw~4.50!~away~6.50']
      }
    }
  },
  // Premier League Prelive Matches (From Screenshot)
  {
    id: 'pre_pl_1',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Arsenal', away: 'Coventry City' },
      start_time: '2026-08-21T19:00:00.000Z', // 22:00 TR time
      group_markets: {
        'full_event|0': ['|1x2|~home~1.17!~draw~8.10!~away~19.50']
      }
    }
  },
  {
    id: 'pre_pl_2',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Hull City', away: 'Manchester United' },
      start_time: '2026-08-22T11:30:00.000Z', // 14:30 TR time
      group_markets: {
        'full_event|0': ['|1x2|~home~7.30!~draw~4.55!~away~1.48']
      }
    }
  },
  {
    id: 'pre_pl_3',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Nottingham Forest', away: 'Leeds' },
      start_time: '2026-08-22T14:00:00.000Z', // 17:00 TR time
      group_markets: {
        'full_event|0': ['|1x2|~home~2.28!~draw~3.44!~away~3.30']
      }
    }
  },
  {
    id: 'pre_pl_4',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Ipswich', away: 'Sunderland' },
      start_time: '2026-08-22T14:00:00.000Z', // 17:00 TR time
      group_markets: {
        'full_event|0': ['|1x2|~home~2.79!~draw~3.38!~away~2.65']
      }
    }
  },
  {
    id: 'pre_pl_5',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Everton', away: 'Crystal Palace' },
      start_time: '2026-08-22T14:00:00.000Z', // 17:00 TR time
      group_markets: {
        'full_event|0': ['|1x2|~home~2.18!~draw~3.48!~away~3.50']
      }
    }
  },
  {
    id: 'pre_pl_6',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Brentford', away: 'Tottenham' },
      start_time: '2026-08-22T16:30:00.000Z', // 19:30 TR time
      group_markets: {
        'full_event|0': ['|1x2|~home~2.31!~draw~3.86!~away~2.94']
      }
    }
  },
  {
    id: 'pre_pl_7',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Brighton', away: 'Aston Villa' },
      start_time: '2026-08-23T13:00:00.000Z', // 16:00 TR time
      group_markets: {
        'full_event|0': ['|1x2|~home~2.30!~draw~3.70!~away~3.06']
      }
    }
  },
  {
    id: 'pre_pl_8',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Manchester City', away: 'Bournemouth' },
      start_time: '2026-08-23T13:00:00.000Z', // 16:00 TR time
      group_markets: {
        'full_event|0': ['|1x2|~home~1.47!~draw~5.15!~away~6.35']
      }
    }
  },
  {
    id: 'pre_pl_9',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Newcastle', away: 'Liverpool' },
      start_time: '2026-08-23T15:30:00.000Z', // 18:30 TR time
      group_markets: {
        'full_event|0': ['|1x2|~home~3.02!~draw~3.90!~away~2.25']
      }
    }
  },
  {
    id: 'pre_pl_10',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Fulham', away: 'Chelsea' },
      start_time: '2026-08-24T19:00:00.000Z', // 22:00 TR time
      group_markets: {
        'full_event|0': ['|1x2|~home~3.08!~draw~3.72!~away~2.28']
      }
    }
  }
,

  {
    id: 'pop_9001',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Süper Lig' },
      country: { name: 'Turkey' },
      participants: { home: 'Galatasaray', away: 'Fenerbahçe' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.89!~draw~4.47!~away~3.31']
      }
    }
  },
  {
    id: 'pop_9002',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Süper Lig' },
      country: { name: 'Turkey' },
      participants: { home: 'Beşiktaş', away: 'Trabzonspor' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.51!~draw~2.64!~away~2.45']
      }
    }
  },
  {
    id: 'pop_9003',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Süper Lig' },
      country: { name: 'Turkey' },
      participants: { home: 'Başakşehir', away: 'Adana Demirspor' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.81!~draw~3.38!~away~1.53']
      }
    }
  },
  {
    id: 'pop_9004',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Süper Lig' },
      country: { name: 'Turkey' },
      participants: { home: 'Kasımpaşa', away: 'Konyaspor' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.45!~draw~4.19!~away~2.38']
      }
    }
  },
  {
    id: 'pop_9005',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Süper Lig' },
      country: { name: 'Turkey' },
      participants: { home: 'Sivasspor', away: 'Antalyaspor' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.88!~draw~3.41!~away~2.33']
      }
    }
  },
  {
    id: 'pop_9006',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Arsenal', away: 'Chelsea' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.53!~draw~3.57!~away~1.71']
      }
    }
  },
  {
    id: 'pop_9007',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Man City', away: 'Liverpool' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.52!~draw~2.89!~away~3.32']
      }
    }
  },
  {
    id: 'pop_9008',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Man United', away: 'Tottenham' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.53!~draw~3.88!~away~1.99']
      }
    }
  },
  {
    id: 'pop_9009',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Newcastle', away: 'Aston Villa' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.60!~draw~3.97!~away~2.81']
      }
    }
  },
  {
    id: 'pop_9010',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Premier League' },
      country: { name: 'England' },
      participants: { home: 'Brighton', away: 'West Ham' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.99!~draw~4.26!~away~3.55']
      }
    }
  },
  {
    id: 'pop_9011',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'La Liga' },
      country: { name: 'Spain' },
      participants: { home: 'Real Madrid', away: 'Barcelona' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.18!~draw~4.30!~away~3.02']
      }
    }
  },
  {
    id: 'pop_9012',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'La Liga' },
      country: { name: 'Spain' },
      participants: { home: 'Atletico Madrid', away: 'Sevilla' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.39!~draw~3.00!~away~1.70']
      }
    }
  },
  {
    id: 'pop_9013',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'La Liga' },
      country: { name: 'Spain' },
      participants: { home: 'Valencia', away: 'Villarreal' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.68!~draw~3.63!~away~3.29']
      }
    }
  },
  {
    id: 'pop_9014',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'La Liga' },
      country: { name: 'Spain' },
      participants: { home: 'Real Sociedad', away: 'Athletic Bilbao' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.45!~draw~4.45!~away~2.93']
      }
    }
  },
  {
    id: 'pop_9015',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'La Liga' },
      country: { name: 'Spain' },
      participants: { home: 'Real Betis', away: 'Celta Vigo' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~3.10!~draw~3.50!~away~2.14']
      }
    }
  },
  {
    id: 'pop_9016',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Bundesliga' },
      country: { name: 'Germany' },
      participants: { home: 'Bayern Munich', away: 'Dortmund' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.04!~draw~3.23!~away~3.22']
      }
    }
  },
  {
    id: 'pop_9017',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Bundesliga' },
      country: { name: 'Germany' },
      participants: { home: 'Bayer Leverkusen', away: 'RB Leipzig' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.38!~draw~3.38!~away~1.51']
      }
    }
  },
  {
    id: 'pop_9018',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Bundesliga' },
      country: { name: 'Germany' },
      participants: { home: 'Stuttgart', away: 'Eintracht Frankfurt' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.45!~draw~3.59!~away~1.75']
      }
    }
  },
  {
    id: 'pop_9019',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Bundesliga' },
      country: { name: 'Germany' },
      participants: { home: 'Wolfsburg', away: 'Werder Bremen' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.22!~draw~3.55!~away~3.53']
      }
    }
  },
  {
    id: 'pop_9020',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Bundesliga' },
      country: { name: 'Germany' },
      participants: { home: "Borussia M'gladbach", away: 'Freiburg' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~3.15!~draw~3.65!~away~2.54']
      }
    }
  },
  {
    id: 'pop_9021',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Serie A' },
      country: { name: 'Italy' },
      participants: { home: 'Inter', away: 'AC Milan' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.39!~draw~2.85!~away~2.54']
      }
    }
  },
  {
    id: 'pop_9022',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Serie A' },
      country: { name: 'Italy' },
      participants: { home: 'Juventus', away: 'AS Roma' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.58!~draw~3.43!~away~4.10']
      }
    }
  },
  {
    id: 'pop_9023',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Serie A' },
      country: { name: 'Italy' },
      participants: { home: 'Napoli', away: 'Lazio' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.75!~draw~2.67!~away~2.93']
      }
    }
  },
  {
    id: 'pop_9024',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Serie A' },
      country: { name: 'Italy' },
      participants: { home: 'Atalanta', away: 'Fiorentina' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.36!~draw~4.02!~away~1.68']
      }
    }
  },
  {
    id: 'pop_9025',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Serie A' },
      country: { name: 'Italy' },
      participants: { home: 'Torino', away: 'Bologna' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.59!~draw~3.24!~away~3.93']
      }
    }
  },
  {
    id: 'pop_9026',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Ligue 1' },
      country: { name: 'France' },
      participants: { home: 'PSG', away: 'Marseille' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.02!~draw~4.46!~away~3.99']
      }
    }
  },
  {
    id: 'pop_9027',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Ligue 1' },
      country: { name: 'France' },
      participants: { home: 'Monaco', away: 'Lyon' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.59!~draw~3.56!~away~2.09']
      }
    }
  },
  {
    id: 'pop_9028',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Ligue 1' },
      country: { name: 'France' },
      participants: { home: 'Lille', away: 'Lens' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.48!~draw~4.16!~away~3.89']
      }
    }
  },
  {
    id: 'pop_9029',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Ligue 1' },
      country: { name: 'France' },
      participants: { home: 'Rennes', away: 'Nice' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.53!~draw~4.38!~away~3.95']
      }
    }
  },
  {
    id: 'pop_9030',
    data: {
      status: 'not_started',
      sport: { name: 'Soccer' },
      tournament: { name: 'Ligue 1' },
      country: { name: 'France' },
      participants: { home: 'Montpellier', away: 'Nantes' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.99!~draw~3.49!~away~3.99']
      }
    }
  },
  {
    id: 'pop_9031',
    data: {
      status: 'not_started',
      sport: { name: 'Basketball' },
      tournament: { name: 'NBA' },
      country: { name: 'USA' },
      participants: { home: 'Lakers', away: 'Warriors' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.50!~draw~4.29!~away~3.43']
      }
    }
  },
  {
    id: 'pop_9032',
    data: {
      status: 'not_started',
      sport: { name: 'Basketball' },
      tournament: { name: 'NBA' },
      country: { name: 'USA' },
      participants: { home: 'Celtics', away: 'Heat' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.90!~draw~4.44!~away~3.13']
      }
    }
  },
  {
    id: 'pop_9033',
    data: {
      status: 'not_started',
      sport: { name: 'Basketball' },
      tournament: { name: 'NBA' },
      country: { name: 'USA' },
      participants: { home: 'Nuggets', away: 'Suns' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~1.58!~draw~3.40!~away~3.65']
      }
    }
  },
  {
    id: 'pop_9034',
    data: {
      status: 'not_started',
      sport: { name: 'Basketball' },
      tournament: { name: 'NBA' },
      country: { name: 'USA' },
      participants: { home: 'Bucks', away: '76ers' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.52!~draw~3.20!~away~4.28']
      }
    }
  },
  {
    id: 'pop_9035',
    data: {
      status: 'not_started',
      sport: { name: 'Basketball' },
      tournament: { name: 'NBA' },
      country: { name: 'USA' },
      participants: { home: 'Mavericks', away: 'Clippers' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~2.80!~draw~3.17!~away~1.68']
      }
    }
  }

];

export const BettingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [events, setEvents] = useState<any[]>(INITIAL_MOCK_EVENTS);
  const [scrapedMatches, setScrapedMatches] = useState<any[]>([]);
  const [globalLiveMatches, setGlobalLiveMatches] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch scraped pre-live matches on mount
  useEffect(() => {
    const fetchScraped = async () => {
      try {
        const res = await fetch('/prelive_matches.json?v=' + new Date().getTime());
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formattedMatches = data.map((item: any) => {
              const d = item.data;
              const date = new Date(d.start_time);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              const hours = String(date.getHours()).padStart(2, '0');
              const mins = String(date.getMinutes()).padStart(2, '0');
              const minute = `${day}.${month}.${year} ${hours}:${mins}`;

              const markets = d.group_markets['full_event|0'] || [];
              let homeOdd = '-';
              let drawOdd = '-';
              let awayOdd = '-';

              for (const market of markets) {
                const is1x2 = market.includes('|12|') || market.includes('|1x2|') || market.includes('|match_winner|');
                if (is1x2 && (market.includes('~home~') || market.includes('~away~'))) {
                  const parts = market.split('|');
                  const sp = parts.find((p: string) => p.includes('~home~') || p.includes('~away~'));
                  if (sp) {
                    sp.split('!').forEach((sel: string) => {
                      const s = sel.split('~');
                      if (s.length > 2) {
                        const type = s[1].toLowerCase();
                        const odd = parseFloat(s[2]);
                        if (!isNaN(odd)) {
                          if (type === 'home' || type === '1') homeOdd = odd.toFixed(2);
                          if (type === 'draw' || type === 'x') drawOdd = odd.toFixed(2);
                          if (type === 'away' || type === '2') awayOdd = odd.toFixed(2);
                        }
                      }
                    });
                  }
                }
              }

              const now = new Date();
              const isLive = now >= date;

              return {
                id: item.id,
                home: d.participants?.home || 'Ev Sahibi',
                away: d.participants?.away || 'Deplasman',
                isLive: isLive,
                isFinished: false,
                isScraped: true,
                score: isLive ? '0 - 0' : '-',
                minute: isLive ? "1'" : minute,
                league: `${d.country?.name || ''} - ${d.tournament?.name || ''}`,
                sport: d.sport?.name || 'Futbol',
                country: d.country?.name || '',
                homeOdd,
                drawOdd,
                awayOdd,
                homeId: `h_${item.id}`,
                drawId: `d_${item.id}`,
                awayId: `a_${item.id}`,
                homeLogo: d.participants?.home_id ? `https://stb-images.betconstruct.com/team-logo/${d.participants.home_id}.png` : '',
                awayLogo: d.participants?.away_id ? `https://stb-images.betconstruct.com/team-logo/${d.participants.away_id}.png` : '',
                marketsCount: calculateMarketCount(item)
              };
            });
            setScrapedMatches(formattedMatches);
            console.log(`🤖 [CONTEXT] Loaded and formatted ${formattedMatches.length} scraped matches dynamically.`);
          }
        }
      } catch (e) {
        console.warn("Failed to load scraped matches", e);
      }
    };
    fetchScraped();
  }, []);

  // Synchronize events with language and scraped matches
  useEffect(() => {
    const baseEvents = INITIAL_MOCK_EVENTS;
    setEvents(prev => {
      const socketEvents = prev.filter(e => !e.isScraped && !e.id.startsWith('pre_pl_') && !e.id.startsWith('scraped_pl_') && !e.id.startsWith('scraped_pre_') && !e.id.startsWith('mock_'));
      return [...socketEvents, ...baseEvents, ...scrapedMatches];
    });
  }, [language, scrapedMatches]);

  // Time Checker: Auto-transition pre-live matches to live status
  useEffect(() => {
    const checkMatches = () => {
      const now = new Date();
      setScrapedMatches(prev => {
        let changed = false;
        const updated = prev.map(match => {
          if (match.minute && !match.isLive && match.isScraped && !match.isFinished) {
            const [datePart, timePart] = match.minute.split(' ');
            if (datePart && timePart) {
              const [day, month, year] = datePart.split('.').map(Number);
              const [hours, mins] = timePart.split(':').map(Number);
              const matchTime = new Date(year, month - 1, day, hours, mins);
              if (now >= matchTime) {
                changed = true;
                return {
                  ...match,
                  isLive: true,
                  score: '0 - 0',
                  minute: '1\''
                };
              }
            }
          }
          return match;
        });
        return changed ? updated : prev;
      });
    };

    const checker = setInterval(checkMatches, 10000); // 10 saniyede bir daha sıkı kontrol et
    checkMatches(); // Component render edildiği an bir kez kontrol et
    
    return () => clearInterval(checker);
  }, []);

  // Stage 1: Pre-Match Polling (Her 60 saniyede bir)
  useEffect(() => {
    const fetchPreMatchData = async () => {
      const upcomingMatches = scrapedMatches.filter(m => !m.isLive && !m.isFinished && m.isScraped);
      if (upcomingMatches.length === 0) return;

      const ids = upcomingMatches.map(m => m.id).join(',');
      try {
        const res = await fetch(`/api/pre-match-data?ids=${ids}`);
        if (!res.ok) return;
        const data = await res.json();
        
        setScrapedMatches(prev => {
          let hasChanges = false;
          const updated = prev.map(match => {
            if (!match.isLive && !match.isFinished && match.isScraped) {
              const update = data[match.id];
              if (update && update.odds) {
                hasChanges = true;
                return {
                  ...match,
                  homeOdd: update.odds.home || match.homeOdd,
                  drawOdd: update.odds.draw || match.drawOdd,
                  awayOdd: update.odds.away || match.awayOdd,
                };
              }
            }
            return match;
          });
          return hasChanges ? updated : prev;
        });
      } catch (error) {
        // Sessizce hatayı yoksay
      }
    };

    const interval = setInterval(fetchPreMatchData, 60000);
    return () => clearInterval(interval);
  }, [scrapedMatches]);

  // Stage 2 & 3: Global Live Matches Polling (Bot Backend) - REMOVED
  // The user wants to pull everything directly from the WebSocket instead.

  const wsRef = useRef<WebSocket | null>(null);

  const [activeSport, setActiveSport] = useState('Futbol');
  const [activeLeague, setActiveLeague] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Tümü');

  const [betTab, setBetTab] = useState('Tekil');
  const [betSelections, setBetSelections] = useState<BetSelection[]>([]);
  
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

  // Function to toggle bets in slip
  const toggleBetSelection = (match: any, marketName: string, selectionName: string, odd: number) => {
    setBetSelections(prev => {
      const existingIdx = prev.findIndex(b => b.matchId === match.id && b.marketName === marketName && b.selectionName === selectionName);
      if (existingIdx >= 0) {
        return prev.filter((_, i) => i !== existingIdx);
      }
      // Single selection per match policy
      const filtered = prev.filter(b => b.matchId !== match.id);
      return [...filtered, {
        id: Math.random().toString(36).substr(2, 9),
        matchId: match.id,
        homeTeam: match.data?.tournament?.competitors?.home?.name || 'Ev Sahibi',
        awayTeam: match.data?.tournament?.competitors?.away?.name || 'Deplasman',
        marketName,
        selectionName,
        odd
      }];
    });
  };

  const removeBetSelection = (id: string) => {
    setBetSelections(prev => prev.filter(b => b.id !== id));
  };

  const clearBetSelections = () => setBetSelections([]);

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const messageBufferRef = useRef<any[]>([]);
  const processBufferIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket Connection
  useEffect(() => {
      // VITE_WS_URL ortam değişkeni varsa onu kullan, yoksa yerel sunucuya bağlan
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:4000';
      const ws = new WebSocket(`${wsUrl}/?lang=${language}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ Connected to Local Proxy. Sending LiveEvents subscribe...');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        
        // Remove fake live matches when connected (pre_, pop_, mock_)
        setEvents(prev => prev.filter(e => !e.id.toString().startsWith('mock_') && !e.id.toString().startsWith('pre_') && !e.id.toString().startsWith('pop_')));
        
        let loc = language === 'tr' ? 'tur' : 'en'; // Send tur for Turkish, en for English, etc to BetConstruct
        ws.send(`42["subscribe-LiveEvents",{"locale":"${loc}"}]`);
      };

      ws.onmessage = (event) => {
        const msg = event.data.toString();
        if (msg.startsWith('42[')) {
          try {
            const parsed = JSON.parse(msg.substring(2));
            const payload = parsed[1];
            
            if (payload && payload.events) {
              messageBufferRef.current.push(payload.events);
            } else if (payload && payload.data && payload.data.events) {
              messageBufferRef.current.push(payload.data.events);
            } else if (payload && Array.isArray(payload)) {
              messageBufferRef.current.push(payload);
            }
          } catch (e) {
            console.error("Error parsing WS message", e);
          }
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('❌ Disconnected from Local Proxy');
        
        // Auto-reconnect with exponential backoff (max 5 seconds)
        const timeout = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 5000);
        reconnectAttemptsRef.current += 1;
        
        reconnectTimeoutRef.current = setTimeout(() => {
           connectWs();
        }, timeout);
      };

      ws.onerror = (err) => {
        console.error('WebSocket Error:', err);
        ws.close();
      };
    };

    connectWs();


    // Process Buffer every 500ms to prevent UI freezing
    processBufferIntervalRef.current = setInterval(() => {
      if (messageBufferRef.current.length === 0) return;
      
      const payloads = [...messageBufferRef.current];
      messageBufferRef.current = [];
      
      setEvents(prev => {
        // Filter out fake matches since we are connected and receiving socket data
        let newEvents = prev.filter(e => !e.id.toString().startsWith('mock_') && !e.id.toString().startsWith('pre_') && !e.id.toString().startsWith('pop_'));
        let hasChanges = false;

        // Build O(1) fast lookup index map
        const eventIndexMap = new Map<string | number, number>();
        newEvents.forEach((item, index) => {
          eventIndexMap.set(item.id, index);
        });
        
        payloads.forEach(newEventsData => {
          if (!Array.isArray(newEventsData)) return;
          
          newEventsData.forEach((ev: any) => {
            if (!ev.data) return;
            const idx = eventIndexMap.get(ev.id);
            hasChanges = true;
            
            if (idx !== undefined && idx >= 0) {
              const prevData = newEvents[idx].data || {};
              const nextData = ev.data || {};
              
              const mergedGroupMarkets = { ...prevData.group_markets };
              if (ev.group_markets) {
                for (const groupName in ev.group_markets) {
                  const newMarkets = ev.group_markets[groupName];
                  if (!mergedGroupMarkets[groupName]) {
                    mergedGroupMarkets[groupName] = [...newMarkets];
                  } else {
                    const existingMarkets = [...mergedGroupMarkets[groupName]];
                    for (const newMStr of newMarkets) {
                      const newMId = newMStr.split('|')[0];
                      const mIdx = existingMarkets.findIndex((mStr: string) => mStr.startsWith(newMId + '|'));
                      if (mIdx >= 0) existingMarkets[mIdx] = newMStr;
                      else existingMarkets.push(newMStr);
                    }
                    mergedGroupMarkets[groupName] = existingMarkets;
                  }
                }
              }
              
              const removedMarkets = ev.removed_markets || nextData.removed_markets;
              if (removedMarkets && Array.isArray(removedMarkets)) {
                const removedIds = new Set(removedMarkets);
                for (const groupName in mergedGroupMarkets) {
                  mergedGroupMarkets[groupName] = mergedGroupMarkets[groupName].filter((mStr: string) => {
                    const mId = mStr.split('|')[0];
                    return !removedIds.has(mId);
                  });
                }
              }

              newEvents[idx] = {
                ...newEvents[idx],
                ...ev,
                data: {
                  ...prevData,
                  ...nextData,
                  group_markets: mergedGroupMarkets
                }
              };
            } else if (ev.data?.sport) {
              eventIndexMap.set(ev.id, newEvents.length);
              newEvents.push(ev);
            }
          });
        });
        
        return hasChanges ? newEvents : prev;
      });
    }, 500);

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (processBufferIntervalRef.current) clearInterval(processBufferIntervalRef.current);
    };
  }, [language]);

  return (
    <BettingContext.Provider value={{
      events,
      globalLiveMatches,
      isConnected,
      activeSport,
      setActiveSport,
      activeLeague,
      setActiveLeague,
      activeTab,
      setActiveTab,
      betTab,
      setBetTab,
      betSelections,
      toggleBetSelection,
      removeBetSelection,
      clearBetSelections,
      selectedMatch,
      setSelectedMatch
    }}>
      {children}
    </BettingContext.Provider>
  );
};

export const useBetting = () => {
  const context = useContext(BettingContext);
  if (context === undefined) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
};
