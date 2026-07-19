import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';

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
  events: WSEvent[];
  isConnected: boolean;
  
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

export const BettingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [events, setEvents] = useState<WSEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
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
    // Reset events when language changes so UI clears out old language matches
    setEvents([]);
    
    const connectWs = () => {
      const ws = new WebSocket(`ws://localhost:4000/?lang=${language}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ Connected to Local Proxy. Sending LiveEvents subscribe...');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        
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
        let newEvents = [...prev];
        let hasChanges = false;
        
        payloads.forEach(newEventsData => {
          if (!Array.isArray(newEventsData)) return;
          
          newEventsData.forEach((ev: any) => {
            if (!ev.data) return;
            const idx = newEvents.findIndex(e => e.id === ev.id);
            hasChanges = true;
            
            if (idx >= 0) {
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
