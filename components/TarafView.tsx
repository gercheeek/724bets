import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Star, ChevronDown, Activity, Clock, 
  Calendar, Trophy, PlayCircle, Filter, Settings, Bell, Circle, MonitorPlay, BarChart2, Lock, AlertTriangle
} from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import MatchDetailView from './MatchDetailView';

const OddButton = React.memo(({ label, value, isMore, isStale, onClick }: { label: string, value: string, isMore?: boolean, isStale?: boolean, onClick?: () => void }) => {
   const [trend, setTrend] = useState<'up' | 'down' | 'none'>('none');
   const prevValueRef = useRef(value);

   useEffect(() => {
      if (value && prevValueRef.current && value !== prevValueRef.current && value !== '-') {
         const oldVal = parseFloat(prevValueRef.current);
         const newVal = parseFloat(value);
         if (newVal > oldVal) setTrend('up');
         else if (newVal < oldVal) setTrend('down');
         
         const timer = setTimeout(() => setTrend('none'), 3000);
         prevValueRef.current = value;
         return () => clearTimeout(timer);
      }
   }, [value]);

   if (isMore) {
      return (
         <button onClick={onClick} className="flex-1 h-[40px] max-w-[45px] flex items-center justify-center rounded-[4px] border border-[#2c313c] bg-[#1a1d24] hover:bg-[#2c313c] transition-all">
            <span className="text-[11px] text-[#00E676] font-bold">{label}</span>
         </button>
      );
   }

   return (
      <button className={`relative group flex-1 h-10 ${isStale ? 'pointer-events-none' : ''} ${
         trend === 'up' ? 'bg-[#00E676]/10 border-[#00E676]' : 
         trend === 'down' ? 'bg-[#FF1744]/10 border-[#FF1744]' : 
         'bg-[#1a1d24] hover:bg-[#2c313c] border-[#2c313c]'
      } rounded-[4px] border transition-all overflow-hidden flex flex-col justify-center px-2`}>
         
         {isStale && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1a1d24]/60 backdrop-blur-[1px]">
               <Lock className="w-4 h-4 text-[#5c677d]" />
            </div>
         )}
         
         <div className={`flex items-center justify-between w-full ${isStale ? 'opacity-50' : 'opacity-100'}`}>
            <span className="text-[11px] font-bold text-[#a0a5b5]">{label}</span>
            <span className={`text-[12.5px] font-black ${
               trend === 'up' ? 'text-[#00E676]' : 
               trend === 'down' ? 'text-[#FF1744]' : 
               'text-[#f2a900]'
            }`}>{value || '-'}</span>
         </div>
      </button>
   );
});

const MemoizedMatchRow = React.memo(({ match, index, activeSport, isStale, toggleFavorite, setSelectedMatch }: any) => {
   return (
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between px-4 py-3 bg-[#12141a] hover:bg-[#1a1d24] border-[#1f232b] transition-all cursor-pointer group ${index !== 0 ? 'border-t' : ''}`}>
         <div className="flex items-center flex-1 gap-4">
            <div className="flex flex-col items-center justify-center w-[60px] shrink-0 border-r border-[#1f232b] pr-4">
               {match.status === 'live' ? (
                  <>
                     <span className="text-[11px] text-[#00E676] font-bold mb-0.5 tracking-wider">{match.minute}</span>
                     <span className="text-[10px] font-bold text-[#5c677d]">{match.halfScore}</span>
                  </>
               ) : (
                  <>
                     <span className="text-[10px] text-[#5c677d] font-bold uppercase tracking-wider mb-0.5">{match.date}</span>
                     <span className="text-[13px] font-black text-white">{match.time}</span>
                  </>
               )}
            </div>
            
            <div className="flex flex-col gap-2 flex-1 pr-4 lg:pr-6">
               <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                     <div className="w-3.5 h-3.5 rounded bg-gradient-to-br from-white/20 to-white/5 border border-white/10 shadow-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded bg-white/50"></div>
                     </div>
                     <span className="text-[13px] font-bold text-[#f1f5f9] group-hover:text-white transition-colors">{match.home}</span>
                  </div>
                  {match.status === 'live' && (
                     <div className="bg-[#1f232b] px-2 py-0.5 rounded border border-[#2c313c] text-[12px] font-black text-white min-w-[28px] text-center shadow-inner">
                        {match.score.split('-')[0]?.trim() || '0'}
                     </div>
                  )}
               </div>
               
               <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                     <div className="w-3.5 h-3.5 rounded bg-gradient-to-br from-[#e62020]/40 to-[#e62020]/10 border border-[#e62020]/20 shadow-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded bg-[#e62020]"></div>
                     </div>
                     <span className="text-[13px] font-bold text-[#f1f5f9] group-hover:text-white transition-colors">{match.away}</span>
                  </div>
                  {match.status === 'live' && (
                     <div className="bg-[#1f232b] px-2 py-0.5 rounded border border-[#2c313c] text-[12px] font-black text-white min-w-[28px] text-center shadow-inner">
                        {match.score.split('-')[1]?.trim() || '0'}
                     </div>
                  )}
               </div>
            </div>

            <div className="hidden lg:flex items-center gap-3 px-4 border-l border-[#1f232b] h-10 transition-opacity">
               <button 
                 onClick={(e) => toggleFavorite(e, String(match.id))}
                 className={`transition-colors ${match.isFavorite ? 'text-[#f2a900] opacity-100' : 'text-[#5c677d] hover:text-[#f2a900] opacity-50 group-hover:opacity-100'}`}
               >
                 <Star className="w-[14px] h-[14px]" fill={match.isFavorite ? "#f2a900" : "none"} />
               </button>
            </div>
         </div>
         
         <div className="flex items-center gap-1.5 w-full lg:w-[280px] xl:w-[320px] shrink-0 mt-3 lg:mt-0">
            {match.odds.map((odd: any, idx: number) => (
               <OddButton 
                 key={idx} 
                 label={odd.label} 
                 value={odd.value} 
                 isMore={odd.isMore} 
                 isStale={isStale}
                 onClick={odd.isMore ? () => setSelectedMatch(match) : undefined}
               />
            ))}
         </div>
      </div>
   );
}, (prevProps, nextProps) => {
   return (
     prevProps.match.id === nextProps.match.id &&
     prevProps.match.minute === nextProps.match.minute &&
     prevProps.match.score === nextProps.match.score &&
     prevProps.isStale === nextProps.isStale &&
     prevProps.match.isFavorite === nextProps.match.isFavorite &&
     JSON.stringify(prevProps.match.odds) === JSON.stringify(nextProps.match.odds)
   );
});

export default function TarafView() {
  const [activeTab, setActiveTab] = useState('live');
  const [activeSport, setActiveSport] = useState('Futbol');
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('taraf_favorites') || '[]'); } catch { return []; }
  });

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('taraf_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const [tarafSettings, setTarafSettings] = useState({ margin: 5, liveDelay: 8, minBet: 10, maxBet: 15000, isActive: true });
  const [tarafOverrides, setTarafOverrides] = useState<Record<string, any>>({});

  useEffect(() => {
     const loadSettings = () => {
        try {
           const settingsStr = localStorage.getItem('taraf_admin_settings');
           if (settingsStr) setTarafSettings(JSON.parse(settingsStr));
           
           const overridesStr = localStorage.getItem('taraf_manual_overrides');
           if (overridesStr) setTarafOverrides(JSON.parse(overridesStr));
        } catch (e) {}
     };
     
     loadSettings();
     const interval = setInterval(loadSettings, 2000); // Check overrides frequently
     return () => clearInterval(interval);
  }, []);

  const [isConnected, setIsConnected] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [visibleCount, setVisibleCount] = useState(15);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>();
  const processBufferIntervalRef = useRef<NodeJS.Timeout>();
  const lastMessageTimeRef = useRef<number>(Date.now());
  const reconnectAttemptsRef = useRef(0);
  const messageBufferRef = useRef<any[]>([]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 250) {
      setVisibleCount(prev => prev + 15);
    }
  };

  useEffect(() => {
    const connectWs = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) return;
      
      const ws = new WebSocket('ws://localhost:4000');
      wsRef.current = ws;
      
      ws.onopen = () => {
        setIsConnected(true);
        setIsStale(false);
        reconnectAttemptsRef.current = 0;
        lastMessageTimeRef.current = Date.now();
        console.log('Connected to local proxy!');
        ws.send('42["subscribe-LiveEvents",{"locale":"tr_TR"}]');
      };

      ws.onmessage = (event) => {
        lastMessageTimeRef.current = Date.now();
        if (isStale) setIsStale(false);
        
        const msg = event.data.toString();
        if (msg.startsWith('42[')) {
          try {
            const parsed = JSON.parse(msg.substring(2));
            const payload = parsed[1];
            
            if (payload && payload.events) {
              messageBufferRef.current.push(payload);
            }
          } catch (e) {
            console.error('Error parsing delta:', e);
          }
        }
      };

      ws.onclose = () => {
         setIsConnected(false);
         console.log('Disconnected from local proxy');
        
        const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
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

    heartbeatIntervalRef.current = setInterval(() => {
         const now = Date.now();
         if (now - lastMessageTimeRef.current > 90000) { 
            setIsStale(true);
         }
      }, 5000);

    processBufferIntervalRef.current = setInterval(() => {
      if (messageBufferRef.current.length === 0) return;
      
      const payloads = [...messageBufferRef.current];
      messageBufferRef.current = [];
      
      setLiveEvents(prevEvents => {
        const newEvents = [...prevEvents];
        let hasChanges = false;
        
        payloads.forEach(payload => {
          payload.events?.forEach((incomingEv: any) => {
            const existingIdx = newEvents.findIndex(e => e.id === incomingEv.id);
            hasChanges = true;
            if (existingIdx >= 0) {
              const existingEv = newEvents[existingIdx];
              newEvents[existingIdx] = {
                ...existingEv,
                ...incomingEv,
                data: {
                  ...existingEv.data,
                  ...incomingEv.data,
                  participants: incomingEv.data?.participants || existingEv.data?.participants
                },
                group_markets: {
                  ...existingEv.group_markets,
                  ...incomingEv.group_markets
                }
              };
            } else {
              newEvents.push(incomingEv);
            }
          });
        });
        
        return hasChanges ? newEvents : prevEvents;
      });
    }, 1000);

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      if (processBufferIntervalRef.current) clearInterval(processBufferIntervalRef.current);
      if (wsRef.current) {
         wsRef.current.close();
         wsRef.current = null;
      }
    };
  }, []);

  const sportMap: Record<string, string> = {
    'Futbol': 'Soccer',
    'Basketbol': 'Basketball',
    'Tenis': 'Tennis',
    'Voleybol': 'Volleyball',
    'Masa Tenisi': 'Table Tennis',
    'Buz Hokeyi': 'Ice Hockey'
  };

  const getSportCount = (sportLabel: string, mockCount: number) => {
    if (activeTab === 'live' && liveEvents.length > 0) {
       const englishName = sportMap[sportLabel] || sportLabel;
       return liveEvents.filter(ev => ev?.data?.sport?.name === englishName).length;
    }
    return activeTab === 'live' ? 0 : mockCount; 
  };

  let groupedMatches: Record<string, any[]> = {};
  
  if (activeTab === 'live' && liveEvents.length > 0) {
    const targetSport = sportMap[activeSport] || activeSport;
    
    const validEvents = liveEvents.filter(ev => {
      if (!ev || !ev.data || ev.data.sport?.name !== targetSport) return false;
      
      const ext = ev.data.extended_status?.toLowerCase() || '';
      if (ext.includes('finished') || ext.includes('ended') || ext === 'match_ended' || ext === 'game_finished') return false;
      
      return true;
    });
    
    validEvents.sort((a, b) => {
      const isFavA = favorites.includes(String(a.data?.id));
      const isFavB = favorites.includes(String(b.data?.id));
      if (isFavA && !isFavB) return -1;
      if (!isFavA && isFavB) return 1;

      const countryOrderA = a.data?.country?.o ? parseInt(a.data.country.o) : 9999;
      const countryOrderB = b.data?.country?.o ? parseInt(b.data.country.o) : 9999;
      if (countryOrderA !== countryOrderB) return countryOrderA - countryOrderB;
      
      const tourOrderA = a.data?.tournament?.o ? parseInt(a.data.tournament.o) : 9999;
      const tourOrderB = b.data?.tournament?.o ? parseInt(b.data.tournament.o) : 9999;
      if (tourOrderA !== tourOrderB) return tourOrderA - tourOrderB;
      
      const minA = a.data?.minute ? parseInt(a.data.minute) : 0;
      const minB = b.data?.minute ? parseInt(b.data.minute) : 0;
      if (minA !== minB) return minA - minB;
      
      const timeA = a.data?.time_ts ? parseInt(a.data.time_ts) : 0;
      const timeB = b.data?.time_ts ? parseInt(b.data.time_ts) : 0;
      return timeB - timeA;
    });
    
    validEvents.slice(0, visibleCount).forEach((ev, index) => {
      const sportName = activeSport;
      const countryName = ev.data?.country?.name || 'Uluslararası';
      const tourName = ev.data?.tournament?.name || 'Lig';
      const groupKey = `${sportName} • ${countryName} • ${tourName}`;

      if (!groupedMatches[groupKey]) {
        groupedMatches[groupKey] = [];
      }

      let homeName = ev.data?.participants?.home;
      let awayName = ev.data?.participants?.away;
      
      if (!homeName || !awayName) {
         if (ev.data?.name && ev.data.name.includes(' - ')) {
            const parts = ev.data.name.split(' - ');
            homeName = parts[0];
            awayName = parts[1];
         } else {
            homeName = homeName || 'Ev Sahibi';
            awayName = awayName || 'Deplasman';
         }
      }
      
      let minuteStr = ev.data?.minute ? String(ev.data.minute) : 'Canlı';
      let subTimeStr = '';
      
      const extStatus = ev.data?.extended_status || '';
      const status = ev.data?.status || '';

      if (status === 'half_time' || extStatus === 'half_time' || extStatus === 'halftime' || status === 'halftime') {
         minuteStr = 'Devre'; 
         subTimeStr = 'Arası';
      } else if (extStatus) {
         if (extStatus.includes('quarter_1')) subTimeStr = '1. Çeyrek';
         else if (extStatus.includes('quarter_2')) subTimeStr = '2. Çeyrek';
         else if (extStatus.includes('quarter_3')) subTimeStr = '3. Çeyrek';
         else if (extStatus.includes('quarter_4')) subTimeStr = '4. Çeyrek';
         else if (extStatus === 'first_half') subTimeStr = '1. Yarı';
         else if (extStatus === 'second_half') subTimeStr = '2. Yarı';
         else if (extStatus === 'timeout') subTimeStr = 'Mola';
      }
      
      // Add ' to minute if it's a number (not 'Canlı' or 'Devre')
      if (minuteStr !== 'Canlı' && minuteStr !== 'Devre' && !minuteStr.includes("'")) {
          minuteStr = `${minuteStr}'`;
      }
      
      if (minuteStr === 'Canlı' && subTimeStr !== '') {
         minuteStr = subTimeStr;
         subTimeStr = '';
      }
      
      let score = ev.data?.current_score ? ev.data.current_score.replace(':', ' - ') : '-';
      const isTwoWay = ['Basketbol', 'Tenis', 'Voleybol', 'Masa Tenisi'].includes(activeSport);
      
      const rawMarkets = ev.group_markets?.["full_event|0"];
      const markets = Array.isArray(rawMarkets) ? rawMarkets : [];
      const targetMarket = markets.find((m: string) => m.includes('|1x2|') || m.includes('|12|') || m.includes('|match_winner|'));
      
      let homeOdd = '-';
      let drawOdd = '-';
      let awayOdd = '-';
      let moreCount = '+99';
      
      const marginFactor = (100 - (tarafSettings.margin || 0)) / 100;
      
      const applyMargin = (val: number) => {
         return Math.max(1.01, val * marginFactor).toFixed(2);
      };

      const override = tarafOverrides[ev.id];

      if (override && override.isActive) {
         // USE MANUAL OVERRIDE (Simulated Odds)
         homeOdd = override.odds?.['1x2']?.home || '-';
         drawOdd = override.odds?.['1x2']?.draw || '-';
         awayOdd = override.odds?.['1x2']?.away || '-';
         score = override.score || score;
         minuteStr = `${override.minute}'` || minuteStr;
         subTimeStr = '';
      } else if (targetMarket) {
         const parts = targetMarket.split('|');
         const selectionsPart = parts.find((p: string) => p.includes('~home~') || p.includes('~away~'));
         
         if (selectionsPart) {
            const selections = selectionsPart.split('!');
            selections.forEach((sel: string) => {
               const selParts = sel.split('~');
               if (selParts.length > 2) {
                  const type = selParts[1];
                  const oddVal = parseFloat(selParts[2]);
                  if (!isNaN(oddVal)) {
                     if (type === 'home') homeOdd = applyMargin(oddVal);
                     if (type === 'draw') drawOdd = applyMargin(oddVal);
                     if (type === 'away') awayOdd = applyMargin(oddVal);
                  }
               }
            });
         }
      }
      
      let oddsObj = [];
      if (isTwoWay) {
         oddsObj = [
           { label: '1', value: homeOdd },
           { label: '2', value: awayOdd },
           { label: moreCount, value: '', isMore: true }
         ];
      } else {
         oddsObj = [
           { label: '1', value: homeOdd },
           { label: 'X', value: drawOdd },
           { label: '2', value: awayOdd },
           { label: moreCount, value: '', isMore: true }
         ];
      }

      groupedMatches[groupKey].push({
        id: ev.id || `live-${index}`,
        status: 'live',
        minute: minuteStr,
        home: homeName,
        away: awayName,
        score: score,
        halfScore: subTimeStr,
        odds: oddsObj,
        isFavorite: favorites.includes(String(ev.data?.id)),
        rawEvent: ev,
        override: override && override.isActive ? override : null
      });
    });
  }
  
  if (selectedMatch) {
    // Find the most up-to-date raw event from liveEvents
    const currentRawEvent = liveEvents.find(e => e.id === selectedMatch.rawEvent?.id) || selectedMatch.rawEvent;
    
    return (
      <div className="w-full h-full relative z-[100] bg-[#1e232b]">
        <MatchDetailView 
          match={{...selectedMatch, rawEvent: currentRawEvent}} 
          onBack={() => setSelectedMatch(null)} 
        />
      </div>
    );
  }

  const hasMatches = Object.keys(groupedMatches).length > 0 && Object.values(groupedMatches).some(arr => arr.length > 0);

  return (
    <div className="flex h-full w-full bg-[#0a0c10] text-[#a0a5b5] font-sans overflow-hidden">
      <div className="w-[260px] shrink-0 bg-[#12141a] flex flex-col border-r border-[#1f232b] h-full hidden md:flex shadow-xl z-10">
        <div className="p-4 border-b border-[#1f232b]">
           <div className="relative group">
              <input 
                type="text" 
                placeholder="Karşılaşma Ara..." 
                className="w-full bg-[#0a0c10] text-[13px] text-white placeholder-[#5c677d] rounded-md pl-10 pr-4 py-2.5 border border-[#1f232b] focus:outline-none focus:border-[#e62020] transition-colors shadow-inner"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c677d] group-focus-within:text-[#e62020] transition-colors" />
           </div>
        </div>
        <div className="flex items-center p-2 border-b border-[#1f232b] bg-[#161922]">
           <button className="flex-1 text-center py-2 text-[11px] font-bold text-[#e62020] bg-[#e62020]/10 rounded shadow-sm transition-colors">
              TÜMÜ
           </button>
           <button className="flex-1 text-center py-2 text-[11px] font-bold text-[#5c677d] hover:text-white transition-colors">
              YAKINDA
           </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
           <div className="mb-4">
              <div className="flex items-center justify-between mb-3 px-2">
                 <span className="text-[11px] font-bold text-[#5c677d] uppercase tracking-wider">Popüler Sporlar</span>
              </div>
              <div className="flex flex-col gap-1">
                 {[{ name: 'Futbol', count: 1245, color: 'text-green-500' }].map(sport => (
                    <button 
                      key={sport.name}
                      onClick={() => setActiveSport(sport.name)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-all ${
                         activeSport === sport.name 
                         ? 'bg-gradient-to-r from-[#e62020]/20 to-transparent border-l-2 border-[#e62020] text-white' 
                         : 'hover:bg-[#1f232b] text-[#a0a5b5]'
                      }`}
                    >
                       <div className="flex items-center gap-3">
                          <Circle className={`w-3.5 h-3.5 ${activeSport === sport.name ? 'text-[#e62020]' : sport.color}`} fill="currentColor" />
                          <span className="font-medium text-[13px]">{sport.name}</span>
                       </div>
                       <span className="text-[11px] font-bold text-[#5c677d] bg-[#12141a] px-2 py-0.5 rounded border border-[#2c313c]">
                          {getSportCount(sport.name, sport.count)}
                       </span>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0c10] relative">
        <div className="h-[60px] bg-[#12141a] shrink-0 border-b border-[#1f232b] flex items-center px-6 justify-between shadow-md z-10">
           <div className="flex items-center h-full gap-2">
              <button 
                onClick={() => setActiveTab('live')}
                className={`h-full px-4 flex items-center gap-2 border-b-2 transition-colors relative ${
                   activeTab === 'live' 
                   ? 'border-[#e62020] text-white' 
                   : 'border-transparent text-[#5c677d] hover:text-[#a0a5b5]'
                }`}
              >
                 <PlayCircle className={`w-4 h-4 ${activeTab === 'live' ? 'text-[#e62020]' : ''}`} />
                 <span className="text-[13px] font-bold tracking-wide">CANLI BAHİS</span>
                 {activeTab === 'live' && <div className="absolute top-1/2 -right-2 w-1.5 h-1.5 rounded-full bg-[#e62020] animate-pulse"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('pre')}
                className={`h-full px-4 flex items-center gap-2 border-b-2 transition-colors ${
                   activeTab === 'pre' 
                   ? 'border-[#e62020] text-white' 
                   : 'border-transparent text-[#5c677d] hover:text-[#a0a5b5]'
                }`}
              >
                 <Clock className={`w-4 h-4 ${activeTab === 'pre' ? 'text-[#e62020]' : ''}`} />
                 <span className="text-[13px] font-bold tracking-wide">SPOR BAHİSLERİ</span>
              </button>
           </div>
           <div className="flex items-center gap-4">
              {isStale && (
                 <div className="hidden md:flex items-center gap-2 bg-[#FF6D00]/10 border border-[#FF6D00]/20 px-3 py-1.5 rounded text-[#FF6D00]">
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                    <span className="text-[12px] font-bold">Veri Bekleniyor...</span>
                 </div>
              )}
              <div className="w-[1px] h-6 bg-[#1f232b] mx-2 hidden md:block"></div>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#2c313c] hover:bg-[#1a1d24] transition-colors">
                 <Filter className="w-4 h-4 text-[#a0a5b5]" />
              </button>
              <button className="w-8 h-8 rounded-full bg-[#1f232b] flex items-center justify-center text-[#a0a5b5] hover:text-white hover:bg-[#2c313c] transition-colors">
                 <Settings className="w-4 h-4" />
              </button>
           </div>
        </div>

        <div onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-[#0a0c10]">
           {!hasMatches ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#5c677d]">
                 {activeTab === 'live' && !isConnected ? (
                    <div className="w-8 h-8 border-4 border-[#1f232b] border-t-[#e62020] rounded-full animate-spin mb-4"></div>
                 ) : (
                    <Calendar className="w-12 h-12 mb-4 opacity-20" />
                 )}
                 <p className="text-[14px] font-medium">
                    {activeTab === 'live' && !isConnected 
                       ? 'Canlı veriler sunucudan bekleniyor...' 
                       : `${activeSport} branşında şu an karşılaşma bulunmamaktadır.`}
                 </p>
              </div>
           ) : (
              Object.entries(groupedMatches).map(([groupKey, matches]) => (
                 matches.length > 0 && (
                    <div key={groupKey} className="flex flex-col w-full bg-[#161922] rounded-lg overflow-hidden border border-[#1f232b] shadow-lg mb-4">
                       <div className="flex items-center justify-between px-4 py-3 bg-[#1c202a] border-b border-[#2c313c]">
                          <div className="flex items-center gap-3">
                             <div className="w-6 h-6 rounded bg-[#e62020] flex items-center justify-center shadow-inner relative">
                                {activeTab === 'live' && isConnected && (
                                   <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00E676] rounded-full border-2 border-[#1c202a] shadow-[0_0_8px_#00E676]"></div>
                                )}
                                <Trophy className="w-3.5 h-3.5 text-white" />
                             </div>
                             <h2 className="text-[13px] font-bold text-[#d1d5db] tracking-wide">
                                {groupKey}
                             </h2>
                          </div>
                          <div className="hidden lg:flex items-center w-[280px] xl:w-[320px] pr-2">
                             <div className="flex-1 text-center text-[11px] font-bold text-[#a0a5b5] tracking-widest">1</div>
                             {!['Basketbol', 'Tenis', 'Voleybol', 'Masa Tenisi'].includes(activeSport) && (
                                <div className="flex-1 text-center text-[11px] font-bold text-[#a0a5b5] tracking-widest">X</div>
                             )}
                             <div className="flex-1 text-center text-[11px] font-bold text-[#a0a5b5] tracking-widest">2</div>
                             <div className="w-[50px] text-center text-[11px] font-bold text-[#a0a5b5]">Diğer</div>
                          </div>
                       </div>
                       <div className="flex flex-col">
                          {matches.map((match, index) => (
                             <MemoizedMatchRow 
                               key={match.id} 
                               match={match} 
                               index={index} 
                               activeSport={activeSport} 
                               isStale={isStale} 
                               toggleFavorite={toggleFavorite} 
                               setSelectedMatch={setSelectedMatch} 
                             />
                          ))}
                       </div>
                    </div>
                 )
              ))
           )}
          </div>
      </div>

      {/* 3. RIGHT SIDEBAR (Bet Slip) */}
      <div className="w-[320px] shrink-0 bg-[#12141a] flex flex-col border-l border-[#1f232b] h-full hidden xl:flex shadow-xl z-10">
         <div className="h-[60px] bg-[#161922] shrink-0 border-b border-[#1f232b] flex items-center px-5 justify-between shadow-sm">
            <div className="flex items-center gap-2">
               <Trophy className="w-4 h-4 text-[#e62020]" />
               <h3 className="text-[13px] font-black text-white tracking-widest">KUPON</h3>
            </div>
            <span className="w-6 h-6 rounded bg-[#1a1d24] border border-[#2c313c] flex items-center justify-center text-[11px] font-bold text-[#5c677d]">0</span>
         </div>
         
         {/* Empty State */}
         <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#0a0c10]">
            <div className="w-20 h-20 rounded-full bg-[#161922] flex items-center justify-center mb-5 border border-[#1f232b] shadow-inner relative">
               <div className="absolute inset-0 rounded-full border border-[#e62020]/20 animate-ping opacity-20"></div>
               <Search className="w-8 h-8 text-[#2c313c]" />
            </div>
            <h4 className="text-[15px] font-bold text-white mb-2">Kuponunuz Boş</h4>
            <p className="text-[12px] text-[#5c677d] leading-relaxed">
               Lütfen bahis yapmak istediğiniz oranlara tıklayarak kuponunuza seçim ekleyin.
            </p>
         </div>
      </div>

    </div>
  );
}
