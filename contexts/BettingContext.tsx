import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';
import { createBrowserClient } from '../lib/supabase';
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

const INITIAL_MOCK_EVENTS: WSEvent[] = [];

// 1. Veri Normalizasyonu (Adapter Pattern)
const normalizeEvent = (ev: any) => {
  if (!ev || !ev.data) return ev;
  const d = ev.data;
  
  if (d.sport && d.sport.name) {
    const sName = d.sport.name.toLowerCase();
    if (sName.includes('american') || sName.includes('amerikan')) {
      d.sport.name = 'Am. Futbolu';
    } else if (sName.includes('soccer') || sName.includes('football') || sName.includes('futbol')) {
      d.sport.name = 'Futbol';
    } else if (sName.includes('basket')) {
      d.sport.name = 'Basketbol';
    } else if (sName.includes('masa') || sName.includes('table tennis')) {
      d.sport.name = 'Masa Tenisi';
    } else if (sName.includes('tennis') || sName.includes('tenis')) {
      d.sport.name = 'Tenis';
    } else if (sName.includes('volley') || sName.includes('voley')) {
      d.sport.name = 'Voleybol';
    } else if (sName.includes('ice') || sName.includes('buz')) {
      d.sport.name = 'Buz Hokeyi';
    } else if (sName.includes('hand') || sName.includes('hent')) {
      d.sport.name = 'Hentbol';
    } else if (sName.includes('e-spor') || sName.includes('esports')) {
      d.sport.name = 'E-Spor';
    } else {
      d.sport.name = 'Diğer';
    }
  } else if (!d.sport) {
    d.sport = { name: 'Diğer' };
  }
  
  // Sychronize root level ev.sport with the translated d.sport.name
  ev.sport = d.sport.name;
  
  if (d.tournament && !d.tournament.name) {
    d.tournament.name = 'Diğer Ligler';
  } else if (!d.tournament) {
    d.tournament = { name: 'Diğer Ligler' };
  }
  
  return ev;
};

export const BettingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [events, setEvents] = useState<any[]>([]);
  const [scrapedMatches, setScrapedMatches] = useState<any[]>([]);
  const [globalLiveMatches, setGlobalLiveMatches] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Eski sistemin devasa JSON dosyalarını çekmesini durdurduk.
  // Yeni API gelene kadar sistem boş ve şimşek hızında çalışacak.
  const fetchScraped = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.from('sports_matches').select('*').eq('status', 'active');
      if (error || !data) return;

      const formattedMatches = data.map(dbMatch => {
        const m = {
          id: 'sb_' + dbMatch.id,
          isScraped: true,
          data: {
            sport: { name: dbMatch.sport_category },
            tournament: { name: dbMatch.league },
            participants: {
              home: dbMatch.team_home,
              away: dbMatch.team_away
            },
            start_time: dbMatch.match_date,
            status: dbMatch.is_live ? 'in_progress' : 'not_started',
            score: dbMatch.is_live ? `${dbMatch.score_home || 0}:${dbMatch.score_away || 0}` : undefined,
            match_minute: dbMatch.match_minute,
            stats: dbMatch.odds?.stats,
            group_markets: {
              "full_event|0": [
                `|1x2|!1~home~${dbMatch.odds?.['1'] || 1.1}!x~draw~${dbMatch.odds?.['X'] || 1.1}!2~away~${dbMatch.odds?.['2'] || 1.1}`,
                `|ou|2.5|!1~over~${dbMatch.odds?.['tU'] || 1.1}!2~under~${dbMatch.odds?.['tA'] || 1.1}`,
                `|Double_Chance|!1x~1X~${dbMatch.odds?.['cs1X'] || 1.1}!12~12~${dbMatch.odds?.['cs12'] || 1.1}!x2~X2~${dbMatch.odds?.['csX2'] || 1.1}`,
                `|gg|!1~var~${dbMatch.odds?.['1'] || 1.1}!2~yok~${dbMatch.odds?.['2'] || 1.1}`
              ]
            }
          }
        };
        return normalizeEvent(m);
      });
      const prevStr = sessionStorage.getItem('prevScrapedMatchesStr');
      const nextStr = JSON.stringify(formattedMatches);
      
      if (prevStr !== nextStr) {
        sessionStorage.setItem('prevScrapedMatchesStr', nextStr);
        setScrapedMatches(formattedMatches);
      }
    } catch (err) {
      console.error('Error fetching Supabase matches:', err);
    }
  };

  useEffect(() => {
    fetchScraped();
  }, []);

  // Supabase Realtime Broadcast Connection for Live Matches
  useEffect(() => {
    const supabase = createBrowserClient();
    const channel = supabase.channel('live-data');

    channel.on('broadcast', { event: 'live_matches_update' }, ({ payload }) => {
      setIsConnected(true);
      if (Array.isArray(payload)) {
        const formattedMatches = payload.map(dbMatch => {
          const m = {
            id: dbMatch.id,
            sport: dbMatch.sport_category,
            league: dbMatch.league,
            participants: {
              home: dbMatch.team_home,
              away: dbMatch.team_away
            },
            start_time: dbMatch.match_date,
            status: dbMatch.is_live ? 'in_progress' : 'not_started',
            score: dbMatch.is_live ? `${dbMatch.score_home || 0}:${dbMatch.score_away || 0}` : undefined,
            match_minute: dbMatch.match_minute,
            stats: dbMatch.odds?.stats,
            group_markets: {
              "full_event|0": [
                `|1x2|!1~home~${dbMatch.odds?.['1'] || 1.1}!x~draw~${dbMatch.odds?.['X'] || 1.1}!2~away~${dbMatch.odds?.['2'] || 1.1}`,
                `|ou|2.5|!1~over~${dbMatch.odds?.['tU'] || 1.1}!2~under~${dbMatch.odds?.['tA'] || 1.1}`,
                `|Double_Chance|!1x~1X~${dbMatch.odds?.['cs1X'] || 1.1}!12~12~${dbMatch.odds?.['cs12'] || 1.1}!x2~X2~${dbMatch.odds?.['csX2'] || 1.1}`,
                `|gg|!1~var~${dbMatch.odds?.['1'] || 1.1}!2~yok~${dbMatch.odds?.['2'] || 1.1}`
              ]
            }
          };
          return normalizeEvent(m);
        });

        setEvents(prev => {
          const mergedMap = new Map();
          prev.forEach(e => mergedMap.set(e.id, e));
          
          formattedMatches.forEach(ev => {
             mergedMap.set(ev.id, ev);
          });
          
          return Array.from(mergedMap.values());
        });
      }
    }).subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Subscribed to Supabase live-data channel');
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        setIsConnected(false);
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Synchronize events with language and scraped matches
  useEffect(() => {
    setEvents(prev => {
      const socketEvents = prev.filter(e => !e.isScraped && !e.id.toString().startsWith('pre_pl_') && !e.id.toString().startsWith('scraped_pl_') && !e.id.toString().startsWith('scraped_pre_') && !e.id.toString().startsWith('mock_'));
      
      // 2. Akıllı Birleştirme (Smart Deduplication)
      const mergedMap = new Map();
      
      // Base mock events removed
      // Prematch events (Scraped JSON)
      scrapedMatches.forEach(e => {
        mergedMap.set(e.id, e); // already normalized
      });
      
      // Live events (Socket) - Overwrites scraped if they have the same ID (prioritizes Live)
      socketEvents.forEach(e => {
        mergedMap.set(e.id, e);
      });
      
      return Array.from(mergedMap.values());
    });
  }, [language, scrapedMatches]);

  // Time Checker removed: Let real WebSocket handle live matches natively
  // Stage 1: Pre-Match Polling (Her 60 saniyede bir)
  // 404 hatalarını önlemek için bu API isteği kaldırıldı, prelive_matches.json zaten kullanılıyor.
  useEffect(() => {
    // const fetchPreMatchData = async () => { ... }
  }, [scrapedMatches]);


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
