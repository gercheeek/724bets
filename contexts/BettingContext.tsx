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
  const [outrights, setOutrights] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Eski sistemin devasa JSON dosyalarını çekmesini durdurduk.
  // Artık sadece kendi Socket.io sunucumuz üzerinden veri alıyoruz.
  const fetchScraped = async () => {
    // Disabled old Supabase integration
  };

  useEffect(() => {
    // Disabled
  }, []);

  // SİSTEM YENİ API ADRESİ İLE TEKRAR AKTİF EDİLDİ
  useEffect(() => {
    let socket;
    try {
        const isProd = window.location.hostname !== 'localhost';
        const socketUrl = isProd ? 'https://724bahis.net' : 'http://localhost:3001';
        socket = io(socketUrl); // Node.js server portumuz
        
        socket.on('connect', () => {
            console.log('✅ Connected to local Socket.io Server (V2 Data Engine)');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('❌ Disconnected from Socket.io Server');
            setIsConnected(false);
        });

        socket.on('matches_update', (payload) => {
            if (Array.isArray(payload)) {
                // Initial load: Socket.io'dan gelen formaplanmış veriyi direkt al
                const formattedMatches = payload.map(m => normalizeEvent(m));

                setEvents(prev => {
                    const mergedMap = new Map();
                    // Önceki verileri koru
                    prev.forEach(e => mergedMap.set(e.id, e));
                    
                    // Yeni gelenleri üstüne yaz (Canlı + PreMatch)
                    formattedMatches.forEach(ev => {
                        mergedMap.set(ev.id, ev);
                    });
                    
                    return Array.from(mergedMap.values());
                });

                // Ayrıca global canlı maçları ayrıca kaydet (Sidebar vb. için)
                setGlobalLiveMatches(formattedMatches.filter(m => m.isLive));
            }
        });

        socket.on('outrights_update', (payload) => {
            if (Array.isArray(payload)) {
                setOutrights(payload);
            }
        });

        socket.on('1xbetLiveMatches', (payload) => {
            if (Array.isArray(payload)) {
                const now = Date.now();
                setGlobal1xBetMatches(prev => {
                    const mergedMap = new Map();
                    // Mevcut maçları haritaya ekle (Eğer son 60 saniye içinde güncellenmişse tut)
                    prev.forEach(m => {
                        const lastSeen = m.lastSeen || now;
                        if (now - lastSeen < 60000) {
                            let newTime = m.time;
                            const minVal = parseInt(String(m.time).replace(/\D/g, '')) || 0;
                            // Eğer maç 90 dk veya üzerindeyse ve feed'den düştüyse "Bitti" olarak kabul et
                            if (minVal >= 90 || m.time === 'Bitti') {
                                newTime = 'Bitti';
                            }
                            mergedMap.set(m.id, { 
                                ...m, 
                                isSuspended: true,
                                time: newTime,
                                odds: { "1": "-", "X": "-", "2": "-", "tU": "-", "tA": "-", "cs1X": "-", "cs12": "-", "csX2": "-", "gg": "-", "ng": "-" } // Oranları kitle
                            });
                        }
                    });
                    
                    // Yeni gelen canlı maçları üzerine yaz (Aktif ve güncel)
                    payload.forEach(m => {
                        mergedMap.set(m.id, { ...m, isSuspended: false, lastSeen: now });
                    });
                    
                    return Array.from(mergedMap.values());
                });
            }
        });

        socket.on('1xbetPreMatches', (payload) => {
            if (Array.isArray(payload)) {
                setGlobal1xBetPreMatches(payload);
            }
        });

        // DELTA SOCKETS: Yalnızca değişen veriyi alarak performansı 100x artırıyoruz
        socket.on('matches_delta', (delta) => {
            if (delta && (delta.updated || delta.removed)) {
                setEvents(prev => {
                    const newMap = new Map();
                    prev.forEach(e => newMap.set(e.id, e));

                    if (delta.removed) {
                        delta.removed.forEach(id => newMap.delete(id));
                    }
                    if (delta.updated) {
                        delta.updated.forEach(match => {
                            newMap.set(match.id, normalizeEvent(match));
                        });
                    }
                    
                    return Array.from(newMap.values());
                });
            }
        });

        socket.on('time_sync', (syncPayload) => {
            if (Array.isArray(syncPayload)) {
                setEvents(prev => {
                    let hasChanges = false;
                    const next = prev.map(match => {
                        const syncData = syncPayload.find(s => s.id === match.id);
                        if (syncData && (match.minute !== syncData.minute || match.last_update_ts !== Date.now())) {
                            hasChanges = true;
                            // Update minute directly and refresh last_update_ts to keep live local ticker synced
                            return { ...match, minute: syncData.minute, last_update_ts: Date.now() };
                        }
                        return match;
                    });
                    return hasChanges ? next : prev;
                });
            }
        });
    } catch (e) {
        console.error("Socket.io client loading error:", e);
    }

    return () => {
        if (socket) socket.disconnect();
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
