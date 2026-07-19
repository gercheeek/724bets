import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Search, ChevronLeft, ChevronRight, ChevronDown, X,
  Activity, Star, Lock, Flame, Clock, Calendar, Trophy
} from 'lucide-react';

interface BetSelection {
  id: string;
  matchId: string;
  matchName: string;
  marketName: string;
  selectionName: string;
  odd: number;
}

interface Spor724ViewProps {
  onNavigate: (view: string) => void;
}

const mockMegaBoosts = [
  {
    id: 'b1',
    title: 'Fransa karşı İspanya',
    market: 'Maç Sonucu 1x2',
    pick1: 'Fransa',
    pick2: 'Karşılıklı Gol: Evet',
    pick3: 'Gol Atacak Oyuncu: Kylian Mbappe - Herhangi Bir Zaman..',
    oldOdd: '6.23',
    newOdd: '7.01'
  },
  {
    id: 'b2',
    title: 'İngiltere karşı Arjantin',
    market: 'Maç Sonucu 1x2',
    pick1: 'İngiltere',
    pick2: 'Toplam Gol: Üst 2.5',
    pick3: 'Gol Atacak Oyuncu: Harry Kane - Herhangi Bir Zamanda..',
    oldOdd: '6.17',
    newOdd: '6.94'
  },
  {
    id: 'b3',
    title: 'İngiltere karşı Arjantin',
    market: 'Maç Sonucu 1x2',
    pick1: 'Arjantin',
    pick2: 'Karşılıklı Gol: Evet',
    pick3: 'Gol Atacak Oyuncu: Lionel Messi - Herhangi Bir Zamanda..',
    oldOdd: '8.93',
    newOdd: '10.11'
  }
];

// Deep Merge for Swarm API Deltas
function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
function mergeDeep(target: any, ...sources: any[]): any {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
}

export default function Spor724View({ onNavigate }: Spor724ViewProps) {
  const [activeSport, setActiveSport] = useState('Futbol');
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false);
  const [betSlip, setBetSlip] = useState<BetSelection[]>([]);
  const [betAmount, setBetAmount] = useState<string>('');
  
  // Swarm State
  const [swarmData, setSwarmData] = useState<any>({});
  const [flashingOdds, setFlashingOdds] = useState<Record<string, 'up' | 'down'>>({});
  
  const swarmDataRef = useRef<any>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to our server.js proxy
    const ws = new WebSocket('ws://localhost:4000');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ [SWARM] Connected, sending request_session');
      ws.send(JSON.stringify({
        command: "request_session",
        params: { site_id: 1, language: "tur" },
        rid: "session"
      }));
    };

    ws.onmessage = (event) => {
      try {
        // Engine.IO pings are handled natively or ignored, we only care about JSON
        if (event.data === '2' || event.data === '3' || event.data.startsWith('0{') || event.data === '40') {
           // Skip if somehow the server is still sending socket.io frames (shouldn't happen with raw proxy)
           return;
        }

        const msg = JSON.parse(event.data);
        
        if (msg.rid === "session") {
          console.log('✅ [SWARM] Session established, subscribing to live football...');
          ws.send(JSON.stringify({
            command: "get",
            params: {
              source: "betting",
              what: {
                sport: ["id", "name", "alias"],
                region: ["id", "name", "alias"],
                competition: ["id", "name"],
                game: ["id", "start_ts", "team1_name", "team2_name", "type", "info", "markets_count"],
                market: ["id", "type", "name", "express_id"],
                event: ["id", "price", "type", "name", "order"]
              },
              where: {
                sport: { id: 1 },
                game: { type: 1 } // 1 = Live
              },
              subscribe: true
            },
            rid: "live_football"
          }));
        }

        // Handle full data or deltas
        if (msg.rid === "live_football" || (msg.data && msg.data.sport)) {
          const newData = msg.rid === "live_football" ? msg.data.data : msg.data;
          
          // Track odd changes for flashing
          const newFlashes: Record<string, 'up' | 'down'> = {};
          
          if (msg.rid !== "live_football" && newData.sport) {
             Object.values(newData.sport).forEach((sport: any) => {
               if(sport && sport.region) {
                 Object.values(sport.region).forEach((region: any) => {
                   if(region && region.competition) {
                     Object.values(region.competition).forEach((comp: any) => {
                       if(comp && comp.game) {
                         Object.values(comp.game).forEach((game: any) => {
                           if(game && game.market) {
                             Object.values(game.market).forEach((market: any) => {
                               if(market && market.event) {
                                 Object.values(market.event).forEach((ev: any) => {
                                   if(ev && ev.price !== undefined) {
                                      try {
                                        const oldPrice = swarmDataRef.current?.sport?.[sport.id || 1]?.region?.[region.id]?.competition?.[comp.id]?.game?.[game.id]?.market?.[market.id]?.event?.[ev.id]?.price;
                                        if (oldPrice !== undefined) {
                                           if (ev.price > oldPrice) newFlashes[ev.id] = 'up';
                                           else if (ev.price < oldPrice) newFlashes[ev.id] = 'down';
                                        }
                                      } catch(e) {}
                                   }
                                 });
                               }
                             });
                           }
                         });
                       }
                     });
                   }
                 });
               }
             });
          }

          if (Object.keys(newFlashes).length > 0) {
             setFlashingOdds(prev => ({...prev, ...newFlashes}));
             setTimeout(() => {
                setFlashingOdds(prev => {
                   const next = {...prev};
                   Object.keys(newFlashes).forEach(k => delete next[k]);
                   return next;
                });
             }, 2000); // clear flash after 2s
          }

          // Deep merge the incoming delta with our local state
          swarmDataRef.current = mergeDeep({...swarmDataRef.current}, newData);
          setSwarmData({...swarmDataRef.current});
        }
      } catch(e) {
         // Silently ignore non-JSON or weird frames
      }
    };

    return () => ws.close();
  }, []);

  // Parse mapped games for UI
  const liveMatches = React.useMemo(() => {
     if (!swarmData?.sport?.['1']?.region) return [];
     const gamesList: any[] = [];
     
     Object.values(swarmData.sport['1'].region).forEach((region: any) => {
        if (!region.competition) return;
        Object.values(region.competition).forEach((comp: any) => {
           if (!comp.game) return;
           Object.values(comp.game).forEach((game: any) => {
              if (game.type !== 1) return; // double check live
              
              // Find Match Result (1X2) market. Usually type "P1XP2"
              let mainMarket = null;
              if (game.market) {
                 mainMarket = Object.values(game.market).find((m: any) => m.type === 'P1XP2' || m.name?.includes('Maç Sonucu'));
              }

              let odds = [
                 { label: '1', value: '-', evId: null },
                 { label: 'X', value: '-', evId: null },
                 { label: '2', value: '-', evId: null },
                 { label: 'Diğer', value: `+${game.markets_count || 0}`, isMarket: true }
              ];

              if (mainMarket && mainMarket.event) {
                 const evs = Object.values(mainMarket.event) as any[];
                 const p1 = evs.find(e => e.type === 'P1' || e.name === 'W1');
                 const px = evs.find(e => e.type === 'X' || e.name === 'X');
                 const p2 = evs.find(e => e.type === 'P2' || e.name === 'W2');
                 if (p1) odds[0] = { label: '1', value: p1.price?.toFixed(2) || '-', evId: p1.id };
                 if (px) odds[1] = { label: 'X', value: px.price?.toFixed(2) || '-', evId: px.id };
                 if (p2) odds[2] = { label: '2', value: p2.price?.toFixed(2) || '-', evId: p2.id };
              }

              const info = game.info || {};
              let minute = info.current_game_time || '00:00';
              if (info.current_game_state === 'half-time') minute = 'IY';
              
              let homeScore = info.score1 || '0';
              let awayScore = info.score2 || '0';

              gamesList.push({
                 id: game.id,
                 minute,
                 home: game.team1_name,
                 away: game.team2_name,
                 homeScore,
                 awayScore,
                 odds
              });
           });
        });
     });

     return gamesList.slice(0, 30); // Limit to 30 matches
  }, [swarmData]);

  const toggleSelection = (match: any, odd: any) => {
    if (!odd.evId || odd.value === '-') return;

    setBetSlip(prev => {
      const exists = prev.find(s => s.id === odd.evId);
      if (exists) {
        return prev.filter(s => s.id !== odd.evId);
      }
      
      // Replace existing selection from the same match (single selection per match)
      const filtered = prev.filter(s => s.matchId !== match.id);
      
      return [...filtered, {
        id: odd.evId,
        matchId: match.id,
        matchName: `${match.home} - ${match.away}`,
        marketName: 'Maç Sonucu',
        selectionName: odd.label,
        odd: parseFloat(odd.value)
      }];
    });
    
    if (!isBetSlipOpen) setIsBetSlipOpen(true);
  };

  const megaBoostsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) return;

      const scrollContainer = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
          const { scrollLeft, scrollWidth, clientWidth } = ref.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            ref.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            ref.current.scrollBy({ left: 300, behavior: 'smooth' });
          }
        }
      };

      scrollContainer(megaBoostsRef);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Theme helper classes
  const theme = {
    bg: 'bg-transparent',
    text: 'text-white',
    scrollBg: 'bg-transparent',
    navBg: 'bg-[#1a1d24]',
    cardBg: 'bg-[#1a1d24]',
    cardHover: 'hover:bg-[#20252b]',
    textMuted: 'text-[#94a3b8]',
    textMain: 'text-white/90',
    textStrikethrough: 'text-zinc-600',
    btnBg: 'bg-[#20252b] hover:bg-[#2a3038]',
    betSlipBg: 'bg-[#0f1115] border-white/[0.03]',
    betSlipHeader: 'bg-[#1a1d24]',
    betSlipText: 'text-white/90',
    betSlipMuted: 'text-[#94a3b8]',
    megaBtn: 'bg-[#20252b] hover:bg-[#2a3038]',

    divider: 'border-white/[0.02]',
    brandText: 'text-[#A3E635]',
    badgeBg: 'bg-[#A3E635]',
    badgeBorder: 'border-[#A3E635]/30 bg-[#A3E635]/[0.05] text-[#A3E635]',
  };

  return (
    <div className={`flex h-full w-full ${theme.bg} ${theme.text} font-sans overflow-hidden font-medium transition-colors duration-500`}>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Scrollable Content */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b ${theme.scrollBg} relative transition-colors duration-500`}>
          
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-[#A3E635]/[0.02] rounded-full blur-[100px] pointer-events-none transition-colors duration-500"></div>

          <div className="p-4 md:p-6 w-full">
            
            {/* Hero Slider Banner */}
            <div className="relative w-full h-[200px] md:h-[280px] rounded-2xl overflow-hidden mb-6 bg-gradient-to-r from-[#1a1c23] to-[#0b0c10] border border-white/5 flex items-center group cursor-pointer shadow-xl">
              <div className="absolute inset-0 bg-[#A3E635]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <button className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center backdrop-blur z-20 hover:bg-[#A3E635] transition-colors"><ChevronLeft className="w-5 h-5"/></button>
              <button className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center backdrop-blur z-20 hover:bg-[#A3E635] transition-colors"><ChevronRight className="w-5 h-5"/></button>
              
              <div className="relative z-10 p-6 md:p-12 w-full md:w-2/3 flex flex-col items-start">
                <h2 className="text-2xl md:text-5xl font-black text-[#A3E635] uppercase tracking-tighter mb-1 md:mb-2 leading-none" style={{ textShadow: '0 0 20px rgba(163,230,53,0.3)' }}>GÜÇLÜ BAŞLAYIN</h2>
                <h3 className="text-xl md:text-4xl font-bold text-white mb-1 md:mb-2">500$'A KADAR</h3>
                <p className="text-sm md:text-lg text-zinc-300 font-medium mb-4 md:mb-6">Spor Bonusu Kazanın</p>
                <button className="bg-[#A3E635] hover:bg-[#86c429] text-black font-bold py-2 px-6 md:py-3 md:px-8 rounded-lg shadow-[0_0_20px_rgba(163,230,53,0.4)] transition-all hover:scale-105 active:scale-95 text-xs md:text-sm">ŞİMDİ YATIRIN</button>
              </div>
              
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none overflow-hidden">
                 <div className="absolute top-[-50px] right-[-50px] w-[200px] md:w-[300px] h-[200px] md:h-[300px] border border-[#A3E635] rounded-full blur-[2px]"></div>
                 <div className="absolute bottom-[-100px] right-[50px] w-[300px] md:w-[400px] h-[300px] md:h-[400px] border-2 border-[#A3E635] rounded-full blur-[4px]"></div>
              </div>
              <div className="absolute right-[5%] bottom-0 top-[10%] w-[40%] rounded-t-3xl border-2 border-[#A3E635]/20 bg-gradient-to-b from-[#A3E635]/10 to-transparent hidden md:block"></div>
            </div>

            {/* Öne Çıkanlar Header */}
            <div className={`flex items-center gap-2 mb-4 mt-6`}>
              <Flame className="w-5 h-5 text-orange-400" fill="currentColor" />
              <h2 className="text-lg font-bold text-white tracking-wide">Öne Çıkanlar</h2>
            </div>

            {/* Öne Çıkanlar Grid */}
            <div 
              ref={megaBoostsRef}
              className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 overflow-x-auto snap-x snap-mandatory custom-scrollbar pb-2"
            >
              {mockMegaBoosts.map(boost => (
                <div key={boost.id} className={`w-[85vw] min-w-[300px] max-w-[340px] md:w-auto md:min-w-0 md:max-w-none shrink-0 snap-center ${theme.cardBg} rounded-lg p-4 flex flex-col group transition-all ${theme.cardHover} cursor-pointer`}>
                  
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-4 text-[11px] font-medium text-[#94a3b8]">
                    <div className="flex items-center gap-1.5">
                       <Activity className="w-3.5 h-3.5" />
                       <span className="text-white/80">{boost.title}</span>
                       <span className="mx-1 opacity-50">•</span>
                       <Clock className="w-3 h-3" />
                       <span>Özel Oran</span>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="flex flex-col gap-2.5 mb-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-medium text-white/90">{boost.pick1}</span>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-medium text-white/90">{boost.pick2}</span>
                        </div>
                     </div>
                  </div>

                  {/* Odds Buttons */}
                  <div className="flex items-center gap-2 mt-auto">
                     <button className="flex-1 flex items-center justify-between bg-[#111317] hover:bg-[#2a3038] px-3 py-2.5 rounded-md transition-colors border border-[#A3E635]/20">
                        <span className="text-xs text-[#94a3b8] font-medium line-through">{boost.oldOdd}</span>
                        <span className="text-xs text-[#A3E635] font-bold">{boost.newOdd}</span>
                     </button>
                  </div>
                </div>
              ))}
            </div>

            {/* LIVE MATCHES (BETCONSTRUCT) */}
            <div className="flex flex-col mb-8 w-full bg-[#0b0e14] rounded-lg overflow-hidden border border-[#1f232b]">
               
               {/* Column Headers */}
               <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f232b]">
                 <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase animate-pulse">CANLI FUTBOL</span>
                    <span className="text-[#a0a5b5] text-[10px] ml-2">({liveMatches.length} maç)</span>
                 </div>
                 <div className="flex items-center w-[250px] md:w-[300px] pr-2">
                   <div className="flex-1 text-center text-[10px] font-bold text-[#5c677d] tracking-widest">1</div>
                   <div className="flex-1 text-center text-[10px] font-bold text-[#5c677d] tracking-widest">X</div>
                   <div className="flex-1 text-center text-[10px] font-bold text-[#5c677d] tracking-widest">2</div>
                   <div className="w-[50px]"></div>
                 </div>
               </div>

               {/* Match Rows */}
               {liveMatches.length === 0 && (
                  <div className="text-center py-8 text-zinc-500 text-sm">
                     Canlı maç verisi bekleniyor veya şu an canlı maç yok...
                  </div>
               )}
               {liveMatches.map((match: any) => (
                  <div key={match.id} className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3 bg-[#0b0e14] border-b border-[#1f232b] hover:bg-[#12161f] transition-colors cursor-pointer group gap-4 md:gap-0">
                     
                     {/* Left side: Teams & Scores */}
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center justify-between pr-4 md:pr-0">
                           <div className="flex items-center gap-2">
                              <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0 opacity-70">
                                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px] text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                              </div>
                              <span className="text-[12px] text-[#d1d5db] font-medium group-hover:text-white transition-colors tracking-wide">{match.home}</span>
                           </div>
                           <span className="text-[13px] font-black text-[#10B981] block md:hidden">{match.homeScore}</span>
                        </div>
                        <div className="flex items-center justify-between pr-4 md:pr-0">
                           <div className="flex items-center gap-2">
                              <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0 opacity-80">
                                 <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[6px] font-black text-white">V</div>
                              </div>
                              <span className="text-[12px] text-[#d1d5db] font-medium group-hover:text-white transition-colors tracking-wide">{match.away}</span>
                           </div>
                           <span className="text-[13px] font-black text-[#10B981] block md:hidden">{match.awayScore}</span>
                        </div>
                     </div>

                     {/* Middle side: Live Time & Scores (Desktop) */}
                     <div className="hidden md:flex items-center gap-6 pr-6 border-r border-[#1f232b]/50 mr-4 h-10">
                        <div className="flex flex-col items-center gap-1 w-10">
                           <span className="text-[10px] font-black text-[#10B981] animate-pulse">{match.minute}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 w-6">
                           <span className="text-[12px] font-black text-[#10B981]">{match.homeScore}</span>
                           <span className="text-[12px] font-black text-[#10B981]">{match.awayScore}</span>
                        </div>
                        <div className="flex items-center justify-center h-full ml-1 opacity-60">
                           <svg viewBox="0 0 24 24" fill="currentColor" className="w-[13px] h-[13px] text-[#a0a5b5]"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                        </div>
                     </div>

                     {/* Right side: Odds */}
                     <div className="flex items-center gap-2 w-full md:w-[300px] shrink-0">
                        {match.odds.slice(0, 3).map((odd: any, idx: number) => {
                           const isSelected = betSlip.some(s => s.id === odd.evId);
                           const flashState = odd.evId ? flashingOdds[odd.evId] : null;
                           
                           let flashClass = isSelected 
                              ? 'bg-[#A3E635] text-black border-[#A3E635]' 
                              : 'bg-[#1a1e26] border-transparent text-[#f8f9fa]';

                           if (!isSelected) {
                              if (flashState === 'up') flashClass = 'bg-green-500/20 border-green-500/50 text-green-400';
                              else if (flashState === 'down') flashClass = 'bg-red-500/20 border-red-500/50 text-red-400';
                           }

                           return (
                             <button 
                                key={idx} 
                                onClick={(e) => { e.stopPropagation(); toggleSelection(match, odd); }}
                                className={`flex-1 h-[38px] flex items-center justify-center rounded-[4px] transition-colors border ${flashClass} ${!isSelected && 'hover:bg-[#252a35]'}`}
                             >
                                <span className={`text-[12px] font-bold ${isSelected ? 'text-black' : ''}`}>{odd.value}</span>
                             </button>
                           );
                        })}
                        <button className="w-[45px] h-[38px] flex items-center justify-center rounded-[4px] bg-[#1a1e26] hover:bg-[#252a35] transition-colors border border-transparent hover:border-white/5 shrink-0 ml-1">
                           <span className="text-[11px] font-bold text-[#f8f9fa]">{match.odds[3].value}</span>
                        </button>
                     </div>
                  </div>
               ))}
            </div>

          </div>
        </div>
      </div>

      {/* 3. Right Sidebar - Bet Slip (Collapsible) */}
      <div className={`${theme.betSlipBg} flex flex-col flex-shrink-0 z-30 transition-all duration-300 ${isBetSlipOpen ? 'w-[300px]' : 'w-0 overflow-hidden'}`}>
        <div className={`h-[60px] px-6 flex items-center justify-between ${theme.betSlipHeader} min-w-[300px]`}>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#A3E635]" />
            <span className={`font-semibold ${theme.betSlipText} text-[13px] tracking-wide`}>BAHİS KUPONU</span>
          </div>
          <button 
            onClick={() => setIsBetSlipOpen(false)}
            className="w-7 h-7 rounded-full bg-white/[0.02] border-white/[0.05] hover:bg-white/10 flex items-center justify-center transition-colors border"
          >
            <ChevronRight className={`w-4 h-4 ${theme.betSlipMuted}`} />
          </button>
        </div>
        <div className="flex-1 flex flex-col min-w-[300px]">
          {betSlip.length === 0 ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/[0.02] border-white/[0.05] flex items-center justify-center mb-5 border">
                <Trophy className={`w-6 h-6 ${theme.betSlipMuted}`} />
              </div>
              <h3 className={`${theme.betSlipText} font-medium text-sm mb-1`}>Kuponunuz Boş</h3>
              <p className={`text-[11px] ${theme.betSlipMuted} leading-relaxed max-w-[180px]`}>
                Bahis yapmak için listeden dilediğiniz oranlara tıklayın.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {betSlip.map(selection => (
                  <div key={selection.id} className="bg-[#1a1d24] rounded-lg p-3 border border-white/5 relative group transition-colors hover:bg-[#20252b]">
                    <button 
                      onClick={() => setBetSlip(prev => prev.filter(s => s.id !== selection.id))}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-500 hover:text-red-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-[10px] text-[#94a3b8] mb-1.5 font-semibold">{selection.marketName}</div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="font-bold text-white text-[13px]">{selection.selectionName}</div>
                      <div className="font-black text-[#A3E635]">{selection.odd.toFixed(2)}</div>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-medium truncate pr-4">{selection.matchName}</div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-[#14161b] border-t border-white/[0.05] shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Toplam Oran</span>
                    <span className="font-black text-[#A3E635] text-xl">
                      {betSlip.reduce((acc, curr) => acc * curr.odd, 1).toFixed(2)}
                    </span>
                 </div>
                 <div className="relative mb-4">
                   <input 
                      type="number" 
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder="Miktar"
                      className="w-full bg-[#1a1d24] border border-white/10 rounded-lg py-3 px-4 text-white text-sm font-bold outline-none focus:border-[#A3E635]/50 transition-colors"
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">TL</span>
                 </div>
                 
                 <div className="flex justify-between items-center mb-4 px-1">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Olası Kazanç</span>
                    <span className="font-bold text-white text-sm">
                      {betAmount ? (parseFloat(betAmount) * betSlip.reduce((acc, curr) => acc * curr.odd, 1)).toFixed(2) : '0.00'} TL
                    </span>
                 </div>

                 <button className="w-full bg-[#A3E635] hover:bg-[#86c429] text-black font-black py-3.5 rounded-lg transition-transform active:scale-95 text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                    BAHİS YAP
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button for Bet Slip (Visible when closed) */}
      {!isBetSlipOpen && (
        <button 
          onClick={() => setIsBetSlipOpen(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#14161b] hover:bg-[#1a1c23] border-white/[0.05] border border-r-0 p-3 rounded-l-xl shadow-lg transition-colors z-40 group"
        >
          <div className="flex flex-col items-center gap-3">
            <Trophy className="w-5 h-5 text-[#A3E635] group-hover:scale-110 transition-transform" />
            <span className={`text-[11px] font-bold ${theme.textMuted} tracking-widest rotate-180 [writing-mode:vertical-rl]`}>KUPON</span>
            <div className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
              {betSlip.length}
            </div>
          </div>
        </button>
      )}

    </div>
  );
}
