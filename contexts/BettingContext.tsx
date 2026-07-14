import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

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

  // WebSocket Connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ Connected to Local Proxy. Sending LiveEvents subscribe...');
      setIsConnected(true);
      ws.send('42["subscribe-LiveEvents",{"locale":"tr_TR"}]');
    };

    ws.onmessage = (event) => {
      const msg = event.data.toString();
      if (msg.startsWith('42[')) {
        try {
          const parsed = JSON.parse(msg.substring(2));
          const payload = parsed[1];
          let newEventsData = null;
          
          if (payload && payload.events) {
            newEventsData = payload.events;
          } else if (payload && payload.data && payload.data.events) {
            newEventsData = payload.data.events;
          } else if (payload && Array.isArray(payload)) {
            newEventsData = payload;
          }

          if (newEventsData && Array.isArray(newEventsData)) {
            setEvents(prev => {
              let newEvents = [...prev];
              newEventsData.forEach((ev: any) => {
                if (!ev.data) return;
                const idx = newEvents.findIndex(e => e.id === ev.id);
                if (idx >= 0) {
                  const prevData = newEvents[idx].data || {};
                  const nextData = ev.data || {};
                  
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
              return newEvents;
            });
          }
        } catch (e) {
          console.error("Error parsing WS message", e);
        }
      }
    };

    ws.onclose = () => setIsConnected(false);

    return () => {
      ws.close();
    };
  }, []);

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
