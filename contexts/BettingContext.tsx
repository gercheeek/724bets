import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
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
  global1xBetMatches: any[];
  global1xBetPreMatches: any[];
  outrights: any[];
  
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
  
  // Sidebar Canlı Sayacı için isLive propertysini zorla ekle
  ev.isLive = d.status === 'in_progress' || d.status === 'playing' || d.status === 'started' || d.status === 'halftime';
  return ev;
};

export const BettingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();

  const [events, setEvents] = useState<any[]>([]);
  const [scrapedMatches, setScrapedMatches] = useState<any[]>([]);
  const [globalLiveMatches, setGlobalLiveMatches] = useState<any[]>([]);
  const [global1xBetMatches, setGlobal1xBetMatches] = useState<any[]>([]);
  const [global1xBetPreMatches, setGlobal1xBetPreMatches] = useState<any[]>([]);
  const [outrights, setOutrights] = useState<any[]>([
    { id: 'o1', title: 'UEFA Şampiyonlar Ligi Şampiyonu 2026', sport: 'Futbol', selections: [{ name: 'Real Madrid', odd: 3.50 }, { name: 'Manchester City', odd: 3.75 }, { name: 'Arsenal', odd: 6.00 }] },
    { id: 'o2', title: 'Trendyol Süper Lig Şampiyonu 2026', sport: 'Futbol', selections: [{ name: 'Galatasaray', odd: 1.85 }, { name: 'Fenerbahçe', odd: 2.10 }, { name: 'Beşiktaş', odd: 12.0 }] }
  ]);
  const [isConnected, setIsConnected] = useState(true);

  // Live 1xBet Feed Fetcher via VPS Proxy (/api/sports/matches)
  useEffect(() => {
    async function fetchLiveMatches() {
      try {
        const res = await fetch('/api/sports/matches');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.live) && data.live.length > 0) {
            const normalized = data.live.map((m: any) => ({
              ...m,
              home: m.homeTeam || m.home || 'Ev Sahibi',
              away: m.awayTeam || m.away || 'Deplasman',
              homeOdd: m.odds?.['1'] !== '-' && m.odds?.['1'] !== undefined ? String(m.odds?.['1']) : '1.90',
              drawOdd: m.odds?.['X'] !== '-' && m.odds?.['X'] !== undefined ? String(m.odds?.['X']) : '3.30',
              awayOdd: m.odds?.['2'] !== '-' && m.odds?.['2'] !== undefined ? String(m.odds?.['2']) : '3.50',
              markets: [
                {
                  name: 'Maç Sonucu (1X2)',
                  selections: [
                    { name: '1', odd: m.odds?.['1'] || 1.90 },
                    { name: 'X', odd: m.odds?.['X'] || 3.30 },
                    { name: '2', odd: m.odds?.['2'] || 3.50 }
                  ]
                }
              ]
            }));

            setEvents(normalized);
            setGlobal1xBetMatches(normalized);
            setGlobalLiveMatches(normalized);
            if (Array.isArray(data.prematch)) {
              setGlobal1xBetPreMatches(data.prematch);
            }
            return;
          }
        }
      } catch (e) {
        console.error("Error fetching live matches from /api/sports/matches:", e);
      }
    }

    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 5000);
    return () => clearInterval(interval);
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
        homeTeam: match.home || match.homeTeam || match.data?.tournament?.competitors?.home?.name || 'Ev Sahibi',
        awayTeam: match.away || match.awayTeam || match.data?.tournament?.competitors?.away?.name || 'Deplasman',
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
      global1xBetMatches,
      global1xBetPreMatches,
      outrights,
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
