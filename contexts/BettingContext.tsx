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

  // Fetch scraped pre-live matches on mount
  useEffect(() => {
    const fetchScraped = async () => {
      try {
        const res = await fetch('/prelive_matches.json?v=' + new Date().getTime());
        if (res.ok) {
          const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              const formattedMatches = data.map((item: any, index: number) => {
                const isDemoLive = index < 15;
                
                return normalizeEvent({
                  ...item,
                  home: item.participants?.home || item.data?.participants?.home || item.home,
                  away: item.participants?.away || item.data?.participants?.away || item.away,
                  isScraped: true,
                  isLive: isDemoLive,
                  timeStr: isDemoLive ? `${Math.floor(Math.random() * 80) + 5}'` : item.timeStr
                });
              });
              setScrapedMatches(formattedMatches);
              console.log(`🤖 [CONTEXT] Loaded and formatted ${formattedMatches.length} scraped matches dynamically. (15 mapped as Live)`);
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
          // Pre-match data update logic is simplified as we expect WSEvent format now.
          return hasChanges ? prev : prev;
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

  // Auto-start matches whose time has passed (useful for demo/static data)
  useEffect(() => {
    const timeChecker = setInterval(() => {
      const now = Date.now();
      setScrapedMatches(prev => {
        let changed = false;
        const updated = prev.map(m => {
          if (!m.isLive && !m.isFinished && m.timestamp && now >= m.timestamp) {
            changed = true;
            // Generate a fake minute based on how much time has passed
            const diffMs = now - m.timestamp;
            const diffMins = Math.floor(diffMs / 60000);
            let minuteStr = "1'";
            if (diffMins > 0 && diffMins <= 45) minuteStr = `${diffMins}'`;
            else if (diffMins > 45 && diffMins <= 60) minuteStr = "HT";
            else if (diffMins > 60 && diffMins <= 105) minuteStr = `${diffMins - 15}'`;
            else if (diffMins > 105) minuteStr = "90+'";

            return {
              ...m,
              isLive: true,
              score: m.score && m.score !== '-' ? m.score : '0 - 0',
              minute: minuteStr
            };
          }
          return m;
        });
        return changed ? updated : prev;
      });
    }, 10000);
    return () => clearInterval(timeChecker);
  }, []);

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

  // Supabase Realtime Broadcast Connection for Live Matches
  useEffect(() => {
    const supabase = createBrowserClient();
    const channel = supabase.channel('live-data');

    channel.on('broadcast', { event: 'live_matches_update' }, ({ payload }) => {
      setIsConnected(true);
      // Backend bot sends the full parsed array of live matches
      if (Array.isArray(payload)) {
        const normalizedPayload = payload.map(ev => normalizeEvent(ev));
        
        setEvents(prevEvents => {
            // Keep the pre-match / scraped events
            const scrapedEvents = prevEvents.filter(e => e.isScraped || e.id.toString().startsWith('scraped_'));
            
            const mergedMap = new Map();
            scrapedEvents.forEach(e => mergedMap.set(e.id, e));
            
            // Overwrite with fresh live events
            normalizedPayload.forEach(e => mergedMap.set(e.id, e));
            
            return Array.from(mergedMap.values());
        });
      }
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Subscribed to Supabase Broadcast (live-data)');
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
