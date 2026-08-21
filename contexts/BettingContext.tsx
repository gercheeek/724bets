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

  // Initial Mock Standalone Events (100% Frontend Standalone Data Engine)
  const INITIAL_MATCHES = [
    {
      id: 'm1',
      sport: 'Futbol',
      league: 'UEFA Şampiyonlar Ligi',
      home: 'Real Madrid',
      away: 'FC Barcelona',
      score: '2 - 1',
      minute: 68,
      isLive: true,
      time: "68'",
      odds: { '1': 1.95, 'X': 3.40, '2': 3.80, 'tU': 1.85, 'tA': 1.95, 'cs1X': 1.25, 'cs12': 1.30, 'csX2': 1.80, 'gg': 1.65, 'ng': 2.10 },
      markets: [
        { name: 'Maç Sonucu (1X2)', selections: [{ name: '1', odd: 1.95 }, { name: 'X', odd: 3.40 }, { name: '2', odd: 3.80 }] },
        { name: 'Toplam Gol 2.5', selections: [{ name: 'Üst', odd: 1.85 }, { name: 'Alt', odd: 1.95 }] },
        { name: 'Karşılıklı Gol', selections: [{ name: 'Var', odd: 1.65 }, { name: 'Yok', odd: 2.10 }] }
      ]
    },
    {
      id: 'm2',
      sport: 'Futbol',
      league: 'Trendyol Süper Lig',
      home: 'Galatasaray',
      away: 'Fenerbahçe',
      score: '1 - 1',
      minute: 42,
      isLive: true,
      time: "42'",
      odds: { '1': 2.10, 'X': 3.20, '2': 3.30, 'tU': 1.90, 'tA': 1.90, 'cs1X': 1.32, 'cs12': 1.35, 'csX2': 1.70, 'gg': 1.70, 'ng': 2.05 },
      markets: [
        { name: 'Maç Sonucu (1X2)', selections: [{ name: '1', odd: 2.10 }, { name: 'X', odd: 3.20 }, { name: '2', odd: 3.30 }] },
        { name: 'Toplam Gol 2.5', selections: [{ name: 'Üst', odd: 1.90 }, { name: 'Alt', odd: 1.90 }] }
      ]
    },
    {
      id: 'm3',
      sport: 'Futbol',
      league: 'İngiltere Premier Lig',
      home: 'Arsenal',
      away: 'Manchester City',
      score: '0 - 0',
      minute: 18,
      isLive: true,
      time: "18'",
      odds: { '1': 2.80, 'X': 3.30, '2': 2.45, 'tU': 2.00, 'tA': 1.80, 'cs1X': 1.55, 'cs12': 1.32, 'csX2': 1.42, 'gg': 1.75, 'ng': 1.95 },
      markets: [
        { name: 'Maç Sonucu (1X2)', selections: [{ name: '1', odd: 2.80 }, { name: 'X', odd: 3.30 }, { name: '2', odd: 2.45 }] }
      ]
    },
    {
      id: 'm4',
      sport: 'Basketbol',
      league: 'NBA',
      home: 'Los Angeles Lakers',
      away: 'Golden State Warriors',
      score: '84 - 82',
      minute: 34,
      isLive: true,
      time: '3. Çeyrek',
      odds: { '1': 1.75, 'X': 14.0, '2': 2.15, 'tU': 1.90, 'tA': 1.90 },
      markets: [
        { name: 'Maç Kazananı', selections: [{ name: '1', odd: 1.75 }, { name: '2', odd: 2.15 }] }
      ]
    },
    {
      id: 'm5',
      sport: 'Futbol',
      league: 'UEFA Şampiyonlar Ligi',
      home: 'Paris Saint-Germain',
      away: 'Bayern Münih',
      score: '0 - 0',
      minute: 0,
      isLive: false,
      time: 'Yarın 22:00',
      odds: { '1': 2.30, 'X': 3.50, '2': 2.90, 'tU': 2.10, 'tA': 1.72, 'cs1X': 1.40, 'cs12': 1.30, 'csX2': 1.60, 'gg': 1.55, 'ng': 2.30 },
      markets: [
        { name: 'Maç Sonucu (1X2)', selections: [{ name: '1', odd: 2.30 }, { name: 'X', odd: 3.50 }, { name: '2', odd: 2.90 }] }
      ]
    },
    {
      id: 'm6',
      sport: 'Futbol',
      league: 'İtalya Serie A',
      home: 'Inter',
      away: 'AC Milan',
      score: '0 - 0',
      minute: 0,
      isLive: false,
      time: 'Pazar 21:45',
      odds: { '1': 2.05, 'X': 3.30, '2': 3.60, 'tU': 1.85, 'tA': 1.95, 'cs1X': 1.30, 'cs12': 1.32, 'csX2': 1.75, 'gg': 1.72, 'ng': 2.00 },
      markets: [
        { name: 'Maç Sonucu (1X2)', selections: [{ name: '1', odd: 2.05 }, { name: 'X', odd: 3.30 }, { name: '2', odd: 3.60 }] }
      ]
    }
  ];

  const [events, setEvents] = useState<any[]>(INITIAL_MATCHES);
  const [scrapedMatches, setScrapedMatches] = useState<any[]>([]);
  const [globalLiveMatches, setGlobalLiveMatches] = useState<any[]>(INITIAL_MATCHES.filter(m => m.isLive));
  const [global1xBetMatches, setGlobal1xBetMatches] = useState<any[]>(INITIAL_MATCHES.filter(m => m.isLive));
  const [global1xBetPreMatches, setGlobal1xBetPreMatches] = useState<any[]>(INITIAL_MATCHES.filter(m => !m.isLive));
  const [outrights, setOutrights] = useState<any[]>([
    { id: 'o1', title: 'UEFA Şampiyonlar Ligi Şampiyonu 2026', sport: 'Futbol', selections: [{ name: 'Real Madrid', odd: 3.50 }, { name: 'Manchester City', odd: 3.75 }, { name: 'Arsenal', odd: 6.00 }] },
    { id: 'o2', title: 'Trendyol Süper Lig Şampiyonu 2026', sport: 'Futbol', selections: [{ name: 'Galatasaray', odd: 1.85 }, { name: 'Fenerbahçe', odd: 2.10 }, { name: 'Beşiktaş', odd: 12.0 }] }
  ]);
  const [isConnected, setIsConnected] = useState(true);

  // 100% Frontend Client-Side Dynamic Live Match Score & Minute Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => prev.map(m => {
        if (m.isLive && typeof m.minute === 'number' && m.minute < 90) {
          const nextMin = m.minute + 1;
          return {
            ...m,
            minute: nextMin,
            time: `${nextMin}'`
          };
        }
        return m;
      }));

      setGlobal1xBetMatches(prev => prev.map(m => {
        if (m.isLive && typeof m.minute === 'number' && m.minute < 90) {
          const nextMin = m.minute + 1;
          return {
            ...m,
            minute: nextMin,
            time: `${nextMin}'`
          };
        }
        return m;
      }));
    }, 10000); // Advance live minute every 10 seconds client-side

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
