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

  // Fetch scraped pre-live matches
  const fetchScraped = async () => {
    try {
      const res = await fetch('/prelive_matches.json?v=' + new Date().getTime());
      if (res.ok) {
        const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formattedMatches = data.map((item: any) => {
              const rawData = item.data || item;
              
              // Extract timestamp properly
              let timestampStr = rawData.start_time || rawData.start_ts || item.start_time || item.start_ts;
              let matchTimestamp = 0;
              if (timestampStr) {
                  if (typeof timestampStr === 'number') {
                      matchTimestamp = timestampStr * 1000;
                  } else {
                      const d = new Date(timestampStr);
                      if (!isNaN(d.getTime())) matchTimestamp = d.getTime();
                  }
              }

              return normalizeEvent({
                ...item,
                home: item.participants?.home || item.data?.participants?.home || item.home,
                away: item.participants?.away || item.data?.participants?.away || item.away,
                isScraped: true,
                isLive: false,
                timestamp: matchTimestamp
              });
            });
            setScrapedMatches(formattedMatches);
            console.log(`🤖 [CONTEXT] Loaded and formatted ${formattedMatches.length} scraped matches dynamically.`);
        }
      }
    } catch (e) {
      console.warn("Failed to load scraped matches", e);
    }
  };

  useEffect(() => {
    fetchScraped();
    const interval = setInterval(fetchScraped, 5 * 60 * 1000); // Her 5 dakikada bir yenile
    return () => clearInterval(interval);
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

  // Local Proxy WebSocket Connection (for localhost)
  useEffect(() => {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return;
    }

    const reconnectAttemptsRef = { current: 0 };
    const reconnectTimeoutRef = { current: null as any };
    const messageBufferRef = { current: [] as any[] };
    const processBufferIntervalRef = { current: null as any };

    const connectWs = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//localhost:4000/?lang=${language}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ Connected to Local Proxy WebSocket (live-data). Sending LiveEvents subscribe...');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        const loc = language === 'tr' ? 'tur' : 'en';
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
        console.log('❌ Disconnected from Local Proxy WebSocket');
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

    processBufferIntervalRef.current = setInterval(() => {
      if (messageBufferRef.current.length === 0) return;
      const payloads = [...messageBufferRef.current];
      messageBufferRef.current = [];

      setEvents(prev => {
        let newEvents = [...prev];
        let hasChanges = false;
        
        payloads.forEach(newEventsData => {
          if (!Array.isArray(newEventsData)) return;
          newEventsData.forEach((ev: any) => {
            if (!ev.data) return;
            const idx = newEvents.findIndex(e => e.id === ev.id);
            hasChanges = true;
            
            const normalized = normalizeEvent(ev);

            if (idx >= 0) {
              const prevData = newEvents[idx].data || {};
              const nextData = normalized.data || {};
              const mergedGroupMarkets = { ...prevData.group_markets };
              
              if (nextData.group_markets) {
                for (const groupName in nextData.group_markets) {
                  const newMarkets = nextData.group_markets[groupName];
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

              const removedMarkets = normalized.removed_markets || nextData.removed_markets;
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
                ...normalized,
                data: {
                  ...prevData,
                  ...nextData,
                  group_markets: mergedGroupMarkets
                }
              };
            } else {
              newEvents.push(normalized);
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
