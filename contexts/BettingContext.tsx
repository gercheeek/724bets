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
  
  if (d.tournament && !d.tournament.name) {
    d.tournament.name = 'Diğer Ligler';
  } else if (!d.tournament) {
    d.tournament = { name: 'Diğer Ligler' };
  }
  
  return ev;
};

export const BettingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [events, setEvents] = useState<any[]>(INITIAL_MOCK_EVENTS.map(normalizeEvent));
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
              return normalizeEvent({
                ...item,
                isScraped: true
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
    fetchScraped();
  }, []);

  // Synchronize events with language and scraped matches
  useEffect(() => {
    const baseEvents = INITIAL_MOCK_EVENTS.map(normalizeEvent);
    setEvents(prev => {
      const socketEvents = prev.filter(e => !e.isScraped && !e.id.toString().startsWith('pre_pl_') && !e.id.toString().startsWith('scraped_pl_') && !e.id.toString().startsWith('scraped_pre_') && !e.id.toString().startsWith('mock_'));
      
      // 2. Akıllı Birleştirme (Smart Deduplication)
      const mergedMap = new Map();
      
      // Base mock events
      baseEvents.forEach(e => mergedMap.set(e.id, e));
      
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
    const connectWs = () => {
      // VITE_WS_URL ortam değişkeni varsa onu kullan, yoksa yerel sunucuya bağlan
      const wsUrl = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:4000';
      const ws = new WebSocket(`${wsUrl}/?lang=${language}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ Connected to Local Proxy. Sending LiveEvents subscribe...');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        
        // Remove fake live matches when connected
        setEvents(prev => prev.filter(e => {
          const id = e.id.toString();
          return !id.startsWith('mock_') && !id.startsWith('pre_') && !id.startsWith('pop_') && !id.startsWith('friendly_') && !id.startsWith('cl_');
        }));
        
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
          
          newEventsData.forEach((rawEv: any) => {
            const ev = normalizeEvent(rawEv);
            if (!ev.data) return;
            const idx = eventIndexMap.get(ev.id);
            hasChanges = true;
            
            if (idx !== undefined && idx >= 0) {
              const prevData = newEvents[idx].data || {};
              const nextData = ev.data || {};
              
              // 3. Güvenli State Güncellemesi (Safe State Merge)
              const mergedData = { ...prevData, ...nextData };
              if (!nextData.sport && prevData.sport) mergedData.sport = prevData.sport;
              if (!nextData.tournament && prevData.tournament) mergedData.tournament = prevData.tournament;
              if (!nextData.participants && prevData.participants) mergedData.participants = prevData.participants;
              if (!nextData.country && prevData.country) mergedData.country = prevData.country;
              
              const mergedGroupMarkets = { ...prevData.group_markets };
              if (ev.group_markets) {
                for (const groupName in ev.group_markets) {
                  const newMarkets = ev.group_markets[groupName];
                  if (!mergedGroupMarkets[groupName]) {
                    mergedGroupMarkets[groupName] = [...newMarkets];
                  } else {
                    const existingMarkets = [...mergedGroupMarkets[groupName]];
                    for (const newMStr of newMarkets) {
                      if (!newMStr) continue;
                      const newMId = newMStr.split('|')[0];
                      const mIdx = existingMarkets.findIndex((mStr: string) => mStr && mStr.startsWith(newMId + '|'));
                      if (mIdx >= 0) existingMarkets[mIdx] = newMStr;
                      else existingMarkets.push(newMStr);
                    }
                    mergedGroupMarkets[groupName] = existingMarkets.filter(Boolean);
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
                  ...mergedData,
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
