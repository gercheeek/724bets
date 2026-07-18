import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Search, ChevronLeft, ChevronRight, ChevronDown, 
  Megaphone, Target, Gift, Shield, Gamepad2, Trophy, 
  Activity, Star, Lock, Flame, Clock, PlayCircle, Calendar,
  Home, FileText, Crosshair, Flag, Swords, Dribbble, Globe
} from 'lucide-react';
import maclarData from '../maclar.json';
import WorldCupTeaser from './WorldCupTeaser';
import SportsBanners from './SportsBanners';
import { FloatingBetSlip } from './FloatingBetSlip';
import { useBetting } from '../contexts/BettingContext';

interface Spor724ViewProps {
  onNavigate: (view: string) => void;
  isLoggedIn?: boolean;
}

const mockUpcomingMatches = [
  {
    id: 'u1',
    date: 'Bugün',
    time: '18:00',
    home: 'Kuopion Palloseura',
    away: 'FK Vardar Üsküp',
    odds: [
      { label: '1', value: '1.50' },
      { label: 'X', value: '4.90' },
      { label: '2', value: '6.25' },
      { label: 'Diğer', value: '+92', isMarket: true }
    ]
  },
  {
    id: 'u2',
    date: 'Bugün',
    time: '19:00',
    home: 'Inter Club de Escaldes',
    away: 'Lincoln Red Imps',
    odds: [
      { label: '1', value: '1.75' },
      { label: 'X', value: '4.40' },
      { label: '2', value: '4.30' },
      { label: 'Diğer', value: '+85', isMarket: true }
    ]
  },
  {
    id: 'u3',
    date: 'Bugün',
    time: '20:00',
    home: 'Riga FC',
    away: 'FC Ararat-Armenia',
    odds: [
      { label: '1', value: '1.73' },
      { label: 'X', value: '4.00' },
      { label: '2', value: '5.00' },
      { label: 'Diğer', value: '+85', isMarket: true }
    ]
  },
  {
    id: 'u4',
    date: 'Bugün',
    time: '20:30',
    home: 'PFC Levski Sofya',
    away: 'FK Borac Banja Luka',
    odds: [
      { label: '1', value: '1.33' },
      { label: 'X', value: '5.25' },
      { label: '2', value: '11.00' },
      { label: 'Diğer', value: '+84', isMarket: true }
    ]
  },
  {
    id: 'u5',
    date: 'Bugün',
    time: '19:00',
    home: 'FC Iberia 1999',
    away: 'Flora Tallinn',
    odds: [
      { label: '1', value: '1.53' },
      { label: 'X', value: '4.90' },
      { label: '2', value: '5.75' },
      { label: 'Diğer', value: '+85', isMarket: true }
    ]
  }
];

const mockLiveMatches = [
  {
    id: 'l1',
    minute: '75:58',
    home: 'Zhejiang FC',
    away: 'Qingdao Hainiu FC',
    homeScore: '1',
    awayScore: '0',
    odds: [
      { label: '1', value: '1.12' },
      { label: 'X', value: '5.40' },
      { label: '2', value: '15.50' },
      { label: 'Diğer', value: '+32', isMarket: true }
    ]
  },
  {
    id: 'l2',
    minute: '42:15',
    home: 'Kashima Antlers',
    away: 'Urawa Reds',
    homeScore: '2',
    awayScore: '2',
    odds: [
      { label: '1', value: '2.45' },
      { label: 'X', value: '2.80' },
      { label: '2', value: '2.60' },
      { label: 'Diğer', value: '+45', isMarket: true }
    ]
  }
];

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

export default function Spor724View({ onNavigate, isLoggedIn = false }: Spor724ViewProps) {
  const { betSelections, toggleBetSelection } = useBetting();
  const [activeSport, setActiveSport] = useState('Futbol');
  const [activeMarket, setActiveMarket] = useState('Maç Sonucu 1x2');
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false);

  // Parse real data from maclar.json
  const parsedMatches = React.useMemo(() => {
    try {
      if (!Array.isArray(maclarData)) return [];
      return maclarData.slice(0, 15).map((ev: any) => {
        const m1x2 = ev.markets?.find((m: any) => m.Name === 'Maç Sonucu 1X2');
        if (!m1x2) return null;
        
        const homeSel = m1x2.Selections?.find((s: any) => s.OutcomeType?.trim() === 'Ev');
        const drawSel = m1x2.Selections?.find((s: any) => s.OutcomeType?.trim() === 'Berabere');
        const awaySel = m1x2.Selections?.find((s: any) => s.OutcomeType?.trim() === 'Deplasman');
        
        if (!homeSel || !awaySel) return null;
        
        return {
          id: ev.id,
          date: 'Bugün',
          time: '21:00', // Mocking time as API only returned markets here
          home: homeSel.Name || 'Ev Sahibi',
          away: awaySel.Name || 'Deplasman',
          odds: [
            { label: '1', value: homeSel.TrueOdds?.toFixed(2) || '1.10' },
            { label: 'X', value: drawSel?.TrueOdds?.toFixed(2) || '1.10' },
            { label: '2', value: awaySel.TrueOdds?.toFixed(2) || '1.10' },
            { label: 'Diğer', value: '+' + (ev.markets?.length || 15), isMarket: true }
          ]
        };
      }).filter(Boolean).slice(0, 5);
    } catch (e) {
      console.error(e);
      return [];
    }
  }, []);

  const upcomingMatchesToUse = parsedMatches.length > 0 ? parsedMatches : mockUpcomingMatches;

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

  // Theme helper classes (Dark Mode ONLY)
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
            
            {/* New Rainbet-style Sports Menu */}
            <div className={`w-full bg-[#1e2331] rounded-[4px] border border-[#2a3040] shadow-sm mb-4 ${!isLoggedIn ? 'hidden md:block' : ''}`}>
               <div className="flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide px-2 py-1.5 h-[52px]">
                  <button className="w-10 h-10 shrink-0 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"><Home size={18} /></button>
                  <button className="h-10 px-2 shrink-0 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors">
                     <div className="border border-current rounded-[3px] px-1.5 py-[2px] text-[10px] font-bold">CANLI</div>
                  </button>
                  <button className="w-10 h-10 shrink-0 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"><Star size={18} /></button>
                  <button className="w-10 h-10 shrink-0 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"><FileText size={18} /></button>
                  
                  <div className="w-px h-6 bg-[#2a3040] mx-1"></div>

                  <button className="w-10 h-10 shrink-0 flex items-center justify-center text-white transition-colors">
                     <div className="w-[22px] h-[22px] rounded-full bg-blue-500 flex items-center justify-center border-[2px] border-white">
                        <span className="text-[7px] font-black leading-none text-white">WC<br/>26</span>
                     </div>
                  </button>
                  <button className="w-10 h-10 shrink-0 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                  </button>
                  <button className="w-10 h-10 shrink-0 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"><Dribbble size={18} /></button>
                  <button className="h-10 px-2 shrink-0 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors">
                     <span className="text-[14px] font-black tracking-tighter border-y-2 border-current px-0.5">MMA</span>
                  </button>
                  
                  {[
                     { icon: <Target size={18} /> },
                     { icon: <Crosshair size={18} /> },
                     { icon: <Activity size={18} /> },
                     { icon: <Trophy size={18} /> },
                     { icon: <Flag size={18} /> },
                     { icon: <Swords size={18} /> },
                     { icon: <Gamepad2 size={18} /> }
                  ].map((item, i) => (
                     <button key={i} className="w-10 h-10 shrink-0 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors">
                        {item.icon}
                     </button>
                  ))}

                  <div className="flex-1 min-w-[20px]"></div>

                  <button className="w-10 h-10 shrink-0 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"><Search size={18} /></button>
               </div>
            </div>

            {/* Sub Pills */}
            <div className={`flex overflow-x-auto scrollbar-hide items-center gap-2 mb-4 w-full ${!isLoggedIn ? 'hidden md:flex' : ''}`}>
               <button className="shrink-0 bg-[#1e2331] hover:bg-[#2a3040] border border-[#2a3040] text-white text-xs font-bold px-4 py-2.5 rounded-[4px] flex items-center gap-2 transition-colors">
                  <div className="w-3 h-3 grid grid-cols-2 gap-[1px]">
                     <div className="bg-yellow-500 rounded-sm"></div><div className="bg-yellow-500 rounded-sm"></div>
                     <div className="bg-yellow-500 rounded-sm"></div><div className="bg-yellow-500 rounded-sm"></div>
                  </div>
                  ÖNE ÇIKANLAR
               </button>
               <button className="shrink-0 bg-[#1e2331] hover:bg-[#2a3040] border border-[#2a3040] text-[#94a3b8] hover:text-white text-xs font-bold px-4 py-2.5 rounded-[4px] flex items-center gap-2 transition-colors">
                  <Activity size={14} />
                  TAHMİNLER
               </button>
               <button className="shrink-0 bg-[#1e2331] hover:bg-[#2a3040] border border-[#2a3040] text-[#94a3b8] hover:text-white text-xs font-bold px-4 py-2.5 rounded-[4px] flex items-center gap-2 transition-colors">
                  <Calendar size={14} />
                  ETKİNLİK OLUŞTURUCU
               </button>
            </div>
            
            {/* World Cup Slider */}
            <div className="w-full h-[140px] md:h-[200px] mb-6">
               <WorldCupTeaser />
            </div>

            {/* Static 3-Column Banners */}
            <SportsBanners />

            {/* Matches Carousel */}
            <div className="mb-8 mt-2">
               {/* Pagination Dots above carousel */}
               <div className="flex items-center gap-1.5 mb-4 px-2">
                  <div className="h-1 w-6 bg-blue-500 rounded-full"></div>
                  <div className="h-1 w-2 bg-[#2a3040] rounded-full"></div>
                  <div className="h-1 w-2 bg-[#2a3040] rounded-full"></div>
                  <div className="h-1 w-2 bg-[#2a3040] rounded-full"></div>
                  <div className="h-1 w-2 bg-[#2a3040] rounded-full"></div>
                  <div className="h-1 w-2 bg-[#2a3040] rounded-full"></div>
                  <div className="h-1 w-2 bg-[#2a3040] rounded-full"></div>
               </div>

               <div className="flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory pb-4">
                  {/* Card 1 */}
                  <div className="min-w-[320px] max-w-[340px] bg-[#161c28] rounded-xl border border-[#2a3040] flex flex-col p-4 snap-center shrink-0">
                     <div className="flex items-center justify-between text-[11px] text-[#94a3b8] mb-4">
                        <div className="flex items-center gap-1.5">
                           <Globe size={14} />
                           <span>Uluslararası • Dünya Kupası</span>
                        </div>
                        <span>Yarın, 22:00</span>
                     </div>
                     <div className="flex items-center justify-between mb-6 relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-6xl font-black">
                           VS
                        </div>
                        <div className="flex flex-col items-center gap-2 z-10 w-20">
                           <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                              🇪🇸
                           </div>
                           <span className="text-white font-bold text-[11px] text-center w-full truncate">İspanya</span>
                        </div>
                        <div className="text-[10px] text-[#94a3b8] font-bold mt-4 z-10">1x2</div>
                        <div className="flex flex-col items-center gap-2 z-10 w-20">
                           <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                              🇦🇷
                           </div>
                           <span className="text-white font-bold text-[11px] text-center w-full truncate">Arjantin</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 mt-auto">
                        {[
                          { odd: '-0.781', sel: 'İspanya', label: '1' },
                          { odd: '-0.50', sel: 'Beraberlik', label: 'beraberli' },
                          { odd: '-0.392', sel: 'Arjantin', label: '2' }
                        ].map((btn, idx) => {
                          const isSel = betSelections.some(b => b.matchId === 'card1' && b.marketName === '1x2' && b.selectionName === btn.sel);
                          return (
                            <button 
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBetSelection({ id: 'card1' }, '1x2', btn.sel, parseFloat(btn.odd));
                              }}
                              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-between text-[10px] transition-colors border ${
                                isSel 
                                  ? 'bg-[#10B981] border-[#10B981] text-black shadow-[#10B981]/20'
                                  : 'bg-[#1e2331] hover:bg-[#2a3040] border-[#2a3040]'
                              }`}>
                               <span className={`font-medium ${isSel ? 'text-black/70' : 'text-[#94a3b8]'}`}>{btn.label}</span>
                               <span className={`font-bold ${isSel ? 'text-black' : 'text-white'}`}>{btn.odd}</span>
                            </button>
                          );
                        })}
                     </div>
                  </div>

                  {/* Card 2 */}
                  <div className="min-w-[320px] max-w-[340px] bg-[#161c28] rounded-xl border border-[#2a3040] flex flex-col p-4 snap-center shrink-0">
                     <div className="flex items-center justify-between text-[11px] text-[#94a3b8] mb-4">
                        <div className="flex items-center gap-1.5">
                           <Swords size={14} />
                           <span>Counter-Strike 2 A...</span>
                        </div>
                        <span>Bugün, 15:00</span>
                     </div>
                     <div className="flex items-center justify-between mb-6 relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-6xl font-black">
                           CS
                        </div>
                        <div className="flex flex-col items-center gap-2 z-10 w-24">
                           <div className="w-10 h-10 rounded-full overflow-hidden bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-xl font-black text-yellow-500">
                              NIP
                           </div>
                           <span className="text-white font-bold text-[11px] text-center w-full truncate">Ninjas in Pyjamas</span>
                        </div>
                        <div className="text-[10px] text-[#94a3b8] font-bold mt-4 z-10">Kazanan</div>
                        <div className="flex flex-col items-center gap-2 z-10 w-24">
                           <div className="w-10 h-10 rounded-full overflow-hidden bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl font-black text-red-500">
                              K27
                           </div>
                           <span className="text-white font-bold text-[11px] text-center w-full truncate">K27</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 mt-auto">
                        {[
                          { odd: '0.54', sel: 'Ninjas in Pyjamas', label: '1' },
                          { odd: '-0.704', sel: 'K27', label: '2' }
                        ].map((btn, idx) => {
                          const isSel = betSelections.some(b => b.matchId === 'card2' && b.marketName === 'Kazanan' && b.selectionName === btn.sel);
                          return (
                            <button 
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBetSelection({ id: 'card2' }, 'Kazanan', btn.sel, parseFloat(btn.odd));
                              }}
                              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-between text-xs transition-colors border ${
                                isSel 
                                  ? 'bg-[#10B981] border-[#10B981] text-black shadow-[#10B981]/20'
                                  : 'bg-[#1e2331] hover:bg-[#2a3040] border-[#2a3040]'
                              }`}>
                               <span className={`font-medium ${isSel ? 'text-black/70' : 'text-[#94a3b8]'}`}>{btn.label}</span>
                               <span className={`font-bold ${isSel ? 'text-black' : 'text-white'}`}>{btn.odd}</span>
                            </button>
                          );
                        })}
                     </div>
                  </div>

                  {/* Card 3 */}
                  <div className="min-w-[320px] max-w-[340px] bg-[#161c28] rounded-xl border border-[#2a3040] flex flex-col p-4 snap-center shrink-0">
                     <div className="flex items-center justify-between text-[11px] text-[#94a3b8] mb-4">
                        <div className="flex items-center gap-1.5">
                           <Target size={14} />
                           <span>Uluslararası • Boks</span>
                        </div>
                        <span>Bugün, 17:00</span>
                     </div>
                     <div className="flex items-center justify-between mb-6 relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-6xl font-black uppercase">
                           BOX
                        </div>
                        <div className="flex flex-col items-center gap-2 z-10 w-24">
                           <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                              🏴󠁧󠁢󠁥󠁮󠁧󠁿
                           </div>
                           <span className="text-white font-bold text-[11px] text-center w-full truncate">Harris, Matty</span>
                        </div>
                        <div className="text-[10px] text-[#94a3b8] font-bold mt-4 z-10">Kazanan</div>
                        <div className="flex flex-col items-center gap-2 z-10 w-24">
                           <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                              🏴󠁧󠁢󠁥󠁮󠁧󠁿
                           </div>
                           <span className="text-white font-bold text-[11px] text-center w-full truncate">Vickers, Ben</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 mt-auto">
                        {[
                          { odd: '0.04', sel: 'Harris, Matty', label: '1' },
                          { odd: '-0.132', sel: 'Vickers, Ben', label: '2' }
                        ].map((btn, idx) => {
                          const isSel = betSelections.some(b => b.matchId === 'card3' && b.marketName === 'Kazanan' && b.selectionName === btn.sel);
                          return (
                            <button 
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBetSelection({ id: 'card3' }, 'Kazanan', btn.sel, parseFloat(btn.odd));
                              }}
                              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-between text-xs transition-colors border ${
                                isSel 
                                  ? 'bg-[#10B981] border-[#10B981] text-black shadow-[#10B981]/20'
                                  : 'bg-[#1e2331] hover:bg-[#2a3040] border-[#2a3040]'
                              }`}>
                               <span className={`font-medium ${isSel ? 'text-black/70' : 'text-[#94a3b8]'}`}>{btn.label}</span>
                               <span className={`font-bold ${isSel ? 'text-black' : 'text-white'}`}>{btn.odd}</span>
                            </button>
                          );
                        })}
                     </div>
                  </div>
               </div>
            </div>

            {/* Popüler Section */}
            <div className="mb-6">
               <div className="flex items-center gap-2 mb-4 px-2">
                  <span className="text-yellow-500 text-xl">👑</span>
                  <h2 className="text-lg font-bold text-white tracking-wide">Popüler</h2>
               </div>
               
               <div className="flex items-center overflow-x-auto gap-2 scrollbar-hide px-2 pb-2">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors">
                     <Activity size={14} /> Futbol
                  </button>
                  <button className="bg-[#1e2331] hover:bg-[#2a3040] text-[#94a3b8] hover:text-white rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors">
                     <Target size={14} /> Beyzbol
                  </button>
                  <button className="bg-[#1e2331] hover:bg-[#2a3040] text-[#94a3b8] hover:text-white rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors">
                     <Trophy size={14} /> Tenis
                  </button>
                  <button className="bg-[#1e2331] hover:bg-[#2a3040] text-[#94a3b8] hover:text-white rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors">
                     <Gamepad2 size={14} /> eFutbol
                  </button>
                  <button className="bg-[#1e2331] hover:bg-[#2a3040] text-[#94a3b8] hover:text-white rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> Dota 2
                  </button>
                  <button className="bg-[#1e2331] hover:bg-[#2a3040] text-[#94a3b8] hover:text-white rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors">
                     <Dribbble size={14} /> Basketbol
                  </button>
                  <button className="bg-[#1e2331] hover:bg-[#2a3040] text-[#94a3b8] hover:text-white rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors">
                     <Swords size={14} /> Counter-Strike
                  </button>
                  <button className="bg-[#1e2331] hover:bg-[#2a3040] text-[#94a3b8] hover:text-white rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors">
                     <Activity size={14} /> Buz Hokeyi
                  </button>
               </div>
            </div>

            {/* Match Grid (Popüler) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full mb-10">
               {[
                  { id: 'p1', league: 'Uluslararası • Dünya Kupası', time: 'Yarın, 00:00', t1: 'Fransa', f1: '🇫🇷', t2: 'İngiltere', f2: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', odds: [{l:'1',v:'1.87',s:'Fransa'}, {l:'beraberlik',v:'3.90',s:'Beraberlik'}, {l:'2',v:'3.80',s:'İngiltere'}] },
                  { id: 'p2', league: 'Uluslararası • Seçkin Kulüp Hazırlık Maçları', time: 'Bugün, 16:30', t1: 'FC Basel 1893', f1: '🇨🇭', t2: 'Juventus', f2: '🇮🇹', odds: [{l:'1',v:'4.20',s:'FC Basel'}, {l:'beraberlik',v:'3.65',s:'Beraberlik'}, {l:'2',v:'1.81',s:'Juventus'}] },
                  { id: 'p3', league: 'Uluslararası • Seçkin Kulüp Hazırlık Maçları', time: 'Bugün, 17:00', t1: 'Celtic', f1: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', t2: 'Middlesbrough', f2: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', odds: [{l:'1',v:'2.18',s:'Celtic'}, {l:'beraberlik',v:'3.75',s:'Beraberlik'}, {l:'2',v:'2.98',s:'Middlesbrough'}] },
                  { id: 'p4', league: 'Uluslararası • Seçkin Kulüp Hazırlık Maçları', time: 'Bugün, 18:00', t1: 'Manchester United FC', f1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', t2: 'Wrexham', f2: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', odds: [{l:'1',v:'1.58',s:'Man Utd'}, {l:'beraberlik',v:'4.40',s:'Beraberlik'}, {l:'2',v:'4.80',s:'Wrexham'}] },
                  { id: 'p5', league: 'Uluslararası • Seçkin Kulüp Hazırlık Maçları', time: 'Bugün, 18:00', t1: 'RW Oberhausen', f1: '🇩🇪', t2: 'Borussia Dortmund', f2: '🇩🇪', odds: [{l:'1',v:'11.00',s:'Oberhausen'}, {l:'beraberlik',v:'9.00',s:'Beraberlik'}, {l:'2',v:'1.16',s:'Dortmund'}] },
                  { id: 'p6', league: 'Uluslararası • Seçkin Kulüp Hazırlık Maçları', time: 'Bugün, 20:00', t1: 'SK Rapid', f1: '🇦🇹', t2: 'Hamburger SV', f2: '🇩🇪', odds: [{l:'1',v:'2.54',s:'Rapid'}, {l:'beraberlik',v:'3.60',s:'Beraberlik'}, {l:'2',v:'2.54',s:'Hamburger'}] },
               ].map((match) => (
                  <div key={match.id} className="bg-[#161c28] rounded-xl p-4 flex flex-col justify-between border border-transparent hover:border-white/10 transition-colors">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
                           <Globe size={12} />
                           <span className="truncate max-w-[200px]">{match.league}</span>
                        </div>
                        <div className="text-[11px] text-[#94a3b8] shrink-0">{match.time}</div>
                     </div>
                     <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-3">
                           <span className="text-xl w-6 text-center">{match.f1}</span>
                           <span className="text-sm font-bold text-white truncate">{match.t1}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-xl w-6 text-center">{match.f2}</span>
                           <span className="text-sm font-bold text-white truncate">{match.t2}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 mt-auto">
                        <div className="text-[10px] font-bold text-[#94a3b8] w-6 shrink-0">1x2</div>
                        <div className="flex flex-1 gap-1.5">
                           {match.odds.map((btn, idx) => {
                              const isSel = betSelections.some(b => b.matchId === match.id && b.marketName === '1x2' && b.selectionName === btn.s);
                              return (
                                 <button 
                                    key={idx}
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       toggleBetSelection({ id: match.id }, '1x2', btn.s, parseFloat(btn.v));
                                    }}
                                    className={`flex-1 py-1.5 px-1.5 sm:px-3 rounded flex flex-col sm:flex-row items-center justify-center sm:justify-between text-[10px] sm:text-[11px] transition-colors border ${
                                       isSel 
                                          ? 'bg-[#10B981] border-[#10B981] text-black shadow-[#10B981]/20'
                                          : 'bg-[#1e2331] hover:bg-[#2a3040] border-transparent'
                                    }`}>
                                    <span className={`font-medium ${isSel ? 'text-black/70' : 'text-[#94a3b8]'}`}>{btn.l}</span>
                                    <span className={`font-bold ${isSel ? 'text-black' : 'text-white'}`}>{btn.v}</span>
                                 </button>
                              );
                           })}
                           <button className="w-8 flex items-center justify-center bg-[#1e2331] hover:bg-[#2a3040] rounded text-[#94a3b8]">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Turnuva Section */}
            <div className="mb-6">
               <div className="flex items-center gap-2 mb-4 px-2">
                  <span className="text-yellow-500 text-xl">🏆</span>
                  <h2 className="text-lg font-bold text-white tracking-wide">Turnuva</h2>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4">
                  {/* Promo Banner */}
                  <div className="relative rounded-xl overflow-hidden bg-[#161c28] min-h-[300px] flex flex-col items-center justify-center p-8 text-center group">
                     {/* Background Image */}
                     <div className="absolute inset-0 bg-[url('/football_macro_hero_1784349034576.jpg')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/80 to-transparent"></div>
                     
                     <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded cursor-pointer hover:bg-white/20 transition-colors z-10">
                        KURALLARI OKUYUN
                     </div>
                     
                     <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
                        <h3 className="text-3xl font-black text-white mb-6 leading-tight drop-shadow-xl">
                           World Cup 2026<br/>
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">$500,000 Tournament</span>
                        </h3>
                        
                        <div className="flex flex-col items-center gap-2 mb-8">
                           <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] mb-1 uppercase tracking-widest">
                              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
                              KALAN SÜRE
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center">
                                 <span className="text-3xl font-black text-white">01</span>
                                 <span className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-wider">GÜN</span>
                              </div>
                              <span className="text-2xl font-black text-[#475569] mb-4">:</span>
                              <div className="flex flex-col items-center">
                                 <span className="text-3xl font-black text-white">18</span>
                                 <span className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-wider">SAAT</span>
                              </div>
                              <span className="text-2xl font-black text-[#475569] mb-4">:</span>
                              <div className="flex flex-col items-center">
                                 <span className="text-3xl font-black text-white">08</span>
                                 <span className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-wider">DAKİKA</span>
                              </div>
                           </div>
                        </div>
                        
                        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105">
                           NASIL KATILIRIM
                        </button>
                     </div>
                  </div>

                  {/* Leaderboard Table */}
                  <div className="bg-[#161c28] rounded-xl overflow-hidden border border-[#2a3040] flex flex-col h-[380px] lg:h-auto">
                     <div className="p-4 border-b border-[#2a3040] text-center text-sm font-bold text-white flex items-center justify-center gap-2 bg-[#1a2130]/50">
                        🏆 Tam skor tablosu
                     </div>
                     <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse">
                           <thead className="sticky top-0 bg-[#1a2130] z-10">
                              <tr className="text-[9px] text-[#94a3b8] uppercase tracking-widest">
                                 <th className="py-2 px-4 font-bold">#</th>
                                 <th className="py-2 px-4 font-bold">OYUNCU</th>
                                 <th className="py-2 px-4 font-bold text-right">SKOR</th>
                                 <th className="py-2 px-4 font-bold text-right">ÖDÜL</th>
                              </tr>
                           </thead>
                           <tbody className="text-xs">
                              {[
                                 { name: 'Lit******', score: '2058463', prize: '$50,000' },
                                 { name: 'Maw******', score: '803206', prize: '$31,000' },
                                 { name: 'Sof******', score: '685055', prize: '$21,000' },
                                 { name: 'Lab******', score: '521676', prize: '$15,000' },
                                 { name: 'Dar******', score: '485232', prize: '$10,000' },
                                 { name: 'Xbo******', score: '451440', prize: '$8,000' },
                                 { name: 'Dat******', score: '390991', prize: '$7,000' },
                                 { name: 'Aap******', score: '374224', prize: '$6,500' },
                                 { name: 'ozh******', score: '289029', prize: '$6,250' },
                                 { name: 'Geo******', score: '282405', prize: '$6,000' },
                                 { name: 'Win******', score: '270100', prize: '$5,500' },
                                 { name: 'Max******', score: '260000', prize: '$5,000' },
                              ].map((row, i) => (
                                 <tr key={i} className={`border-b border-[#2a3040]/30 hover:bg-white/5 transition-colors ${i < 3 ? 'bg-[#1a2130]/30' : ''}`}>
                                    <td className="py-2 px-4">
                                       <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${
                                          i === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
                                          i === 1 ? 'bg-zinc-300/20 text-zinc-300' : 
                                          i === 2 ? 'bg-orange-400/20 text-orange-400' : 
                                          'text-[#94a3b8]'
                                       }`}>{i + 1}</span>
                                    </td>
                                    <td className="py-2 px-4 font-medium text-white/90">{row.name}</td>
                                    <td className="py-2 px-4 text-right font-mono text-[#94a3b8]">{row.score}</td>
                                    <td className="py-2 px-4 text-right font-bold text-white">{row.prize}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>

            {/* Bottom Dashboard Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
               
               {/* Panel 1: Kazandıran Kombine */}
               <div className="bg-[#161c28] rounded-xl border border-[#2a3040] p-4 flex flex-col relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                     <span className="text-red-500">🔥</span>
                     <h3 className="font-bold text-white text-sm">Kazandıran Kombine</h3>
                  </div>
                  
                  <div className="flex flex-col gap-2 mb-4 flex-1">
                     {[
                        { t1: 'Philadelphia 76ers', t2: 'Milwaukee Bucks vs Philadelphia 76ers', o: '2.08' },
                        { t1: 'Fransa', t2: 'Fransa vs İngiltere', o: '1.87' },
                        { t1: 'AC Goianiense GO', t2: 'AC Goianiense GO vs Athletic Club MG', o: '1.92' },
                        { t1: '2.5 üstü', t2: 'Maçta 2.5 golden fazla olur', o: '2.15' }
                     ].map((l, i) => (
                        <div key={i} className="flex justify-between items-center bg-[#1a2130] p-2.5 rounded-lg border border-[#2a3040]">
                           <div className="flex flex-col">
                              <span className="text-white text-xs font-bold">{l.t1}</span>
                              <span className="text-[#94a3b8] text-[10px] truncate max-w-[150px] sm:max-w-[180px]">{l.t2}</span>
                           </div>
                           <span className="text-white font-bold text-xs bg-white/5 px-2 py-1 rounded">{l.o}</span>
                        </div>
                     ))}
                     <div className="mt-2 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-2.5 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#10B981] text-black text-[8px] font-black px-2 py-0.5 rounded-bl">KOMBİNE ÖZEL</div>
                        <span className="text-[#10B981] text-xs font-bold mt-1">x1.15 Kombine Özel</span>
                     </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-[#2a3040]">
                     <div className="relative mb-3">
                        <input type="text" value="1" readOnly className="w-full bg-[#0b0e14] border border-[#2a3040] rounded-lg py-2.5 px-4 text-right text-white font-bold pr-8 outline-none" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] font-bold">$</span>
                     </div>
                     <div className="flex gap-2 mb-4">
                        {['1','10','25','100'].map(v => (
                           <button key={v} className="flex-1 bg-[#1a2130] hover:bg-[#2a3040] py-2 rounded text-white text-xs font-bold transition-colors">{v}</button>
                        ))}
                     </div>
                     <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="text-[#94a3b8]">Toplam Oran</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[#94a3b8] font-bold line-through">14.04</span>
                           <span className="text-[#10B981] font-bold text-sm">16.146</span>
                        </div>
                     </div>
                     <div className="flex justify-between items-center mb-4 text-xs">
                        <span className="text-[#94a3b8]">Muhtemel Kazanç</span>
                        <span className="text-white font-bold text-sm">16.15 $</span>
                     </div>
                     <button className="w-full bg-[#1e2331] hover:bg-[#2a3040] text-white/50 font-bold py-3 rounded-lg transition-colors cursor-not-allowed text-xs">
                        BAHİS YAP
                     </button>
                  </div>
               </div>

               {/* Panel 2: Önemli Maç */}
               <div className="bg-[#161c28] rounded-xl border border-[#2a3040] p-4 flex flex-col relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-6">
                     <span className="text-green-500">⚽</span>
                     <h3 className="font-bold text-white text-sm">Önemli Maç</h3>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-[#94a3b8] mb-4">
                     <div className="flex items-center gap-1.5">
                        <Globe size={12}/>
                        <span>Dünya Kupası</span>
                     </div>
                     <span>Yarın, 00:00</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 mb-8">
                     <span className="text-[10px] font-bold text-[#10B981] tracking-widest uppercase flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div> BAŞLANGIÇ ZAMANI
                     </span>
                     <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                           <span className="text-2xl font-black text-white">00</span>
                           <span className="text-[8px] text-[#94a3b8] font-bold">GÜN</span>
                        </div>
                        <span className="text-xl font-black text-[#475569] mb-3">:</span>
                        <div className="flex flex-col items-center">
                           <span className="text-2xl font-black text-white">15</span>
                           <span className="text-[8px] text-[#94a3b8] font-bold">SAAT</span>
                        </div>
                        <span className="text-xl font-black text-[#475569] mb-3">:</span>
                        <div className="flex flex-col items-center">
                           <span className="text-2xl font-black text-white">08</span>
                           <span className="text-[8px] text-[#94a3b8] font-bold">DAKİKA</span>
                        </div>
                        <span className="text-xl font-black text-[#475569] mb-3">:</span>
                        <div className="flex flex-col items-center">
                           <span className="text-2xl font-black text-white">54</span>
                           <span className="text-[8px] text-[#94a3b8] font-bold">SANİYE</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-between items-center px-6 mb-8">
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-lg">🇫🇷</div>
                        <span className="text-sm font-bold text-white">Fransa</span>
                     </div>
                     <span className="text-3xl font-black text-[#2a3040]">X</span>
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-lg">🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
                        <span className="text-sm font-bold text-white">İngiltere</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                     {[
                        { l: '1', v: '1.87', s: 'Fransa' },
                        { l: 'X', v: '3.90', s: 'Beraberlik' },
                        { l: '2', v: '3.80', s: 'İngiltere' }
                     ].map((btn, idx) => {
                        const isSel = betSelections.some(b => b.matchId === 'onemli_mac' && b.marketName === '1x2' && b.selectionName === btn.s);
                        return (
                           <button 
                              key={idx}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 toggleBetSelection({ id: 'onemli_mac' }, '1x2', btn.s, parseFloat(btn.v));
                              }}
                              className={`flex-1 py-3 rounded-lg border flex flex-col items-center justify-center transition-colors ${
                                 isSel 
                                    ? 'bg-[#10B981] border-[#10B981] text-black shadow-[#10B981]/20'
                                    : 'bg-[#1a2130] hover:bg-[#2a3040] border-[#2a3040]'
                              }`}>
                              <span className={`text-[10px] mb-0.5 ${isSel ? 'text-black/70' : 'text-[#94a3b8]'}`}>{btn.l}</span>
                              <span className={`font-bold text-sm ${isSel ? 'text-black' : 'text-white'}`}>{btn.v}</span>
                           </button>
                        );
                     })}
                  </div>

                  <div className="mt-auto">
                     <div className="relative mb-3">
                        <input type="text" value="1" readOnly className="w-full bg-[#0b0e14] border border-[#2a3040] rounded-lg py-2.5 px-4 text-right text-white font-bold pr-8 outline-none" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] font-bold">$</span>
                     </div>
                     <div className="flex gap-2 mb-4">
                        {['1','10','25','100'].map(v => (
                           <button key={v} className="flex-1 bg-[#1a2130] hover:bg-[#2a3040] py-2 rounded text-white text-xs font-bold transition-colors">{v}</button>
                        ))}
                     </div>
                     <button className="w-full bg-[#1e2331] hover:bg-[#2a3040] text-white/50 font-bold py-3 rounded-lg transition-colors cursor-not-allowed text-xs">
                        BAHİS YAP
                     </button>
                  </div>
               </div>

               {/* Panel 3: En iyi sonuçlar */}
               <div className="bg-[#161c28] rounded-xl border border-[#2a3040] p-4 flex flex-col relative overflow-hidden h-[630px] lg:h-auto">
                  <div className="flex items-center gap-2 mb-4">
                     <span className="text-purple-500">🗓️</span>
                     <h3 className="font-bold text-white text-sm">En iyi sonuçlar</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 mb-2">
                     <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shrink-0 shadow-lg shadow-blue-600/20">Futbol</button>
                     <button className="bg-[#1a2130] border border-[#2a3040] text-[#94a3b8] px-4 py-1.5 rounded-full text-xs font-bold shrink-0 hover:text-white transition-colors">Basketbol</button>
                     <button className="bg-[#1a2130] border border-[#2a3040] text-[#94a3b8] px-4 py-1.5 rounded-full text-xs font-bold shrink-0 hover:text-white transition-colors">Buz Hokeyi</button>
                     <button className="bg-[#1a2130] border border-[#2a3040] text-[#94a3b8] px-4 py-1.5 rounded-full text-xs font-bold shrink-0 hover:text-white transition-colors">Tenis</button>
                  </div>

                  <div className="flex flex-col items-center py-4 text-center border-b border-[#2a3040] mb-2">
                     <h4 className="text-white font-bold text-sm tracking-wide">Uluslararası Dünya Kupası</h4>
                     <span className="text-[#94a3b8] text-[11px] font-bold mt-1">Kazanan ve En Çok Gol Atan</span>
                     <span className="text-blue-400 text-[10px] mt-2 font-bold px-3 py-1 bg-blue-400/10 rounded-full">Kapanış: Yarın, 00:00</span>
                  </div>

                  <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide pr-1">
                     {[
                        { k: 'Spain & Lionel Messi', v: '2.70' },
                        { k: 'Argentina & Lionel Messi', v: '3.00' },
                        { k: 'Spain & Kylian Mbappe', v: '3.20' },
                        { k: 'Argentina & Kylian Mbappe', v: '4.50' },
                        { k: 'Spain & Harry Kane', v: '61.00' },
                        { k: 'Argentina & Harry Kane', v: '76.00' },
                        { k: 'Spain & Mikel Oyarzabal', v: '116.0' },
                     ].map((r, i) => (
                        <div key={i} className="flex justify-between items-center py-3.5 border-b border-[#2a3040]/30 last:border-0 hover:bg-white/5 px-2 rounded transition-colors cursor-pointer group">
                           <span className="text-xs text-[#94a3b8] font-bold group-hover:text-white transition-colors">{r.k}</span>
                           <span className="text-xs text-white font-bold bg-[#1a2130] px-3 py-1.5 rounded border border-[#2a3040] group-hover:border-[#3b82f6]/50 group-hover:bg-[#3b82f6]/10 transition-colors">{r.v}</span>
                        </div>
                     ))}
                  </div>
                  
                  <button className="mt-4 w-full py-2.5 flex items-center justify-center gap-1.5 text-xs text-[#94a3b8] font-bold hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-[#2a3040]">
                     Sonuçlara git <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* Removed the old right sidebar, using the new global FloatingBetSlip below */}
      <FloatingBetSlip />

    </div>
  );
}

const SidebarIcon = ({ icon, active }: { icon: React.ReactNode, active?: boolean }) => (
  <button className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors relative group ${
    active ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'
  }`}>
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#A3E635] rounded-r-md"></div>}
    {icon}
  </button>
);

const SportIcon = ({ name }: { name: string }) => {
  switch(name) {
    case 'Futbol': return <Activity className="w-6 h-6 mb-1 opacity-70" />;
    case 'Basketbol': return <Target className="w-6 h-6 mb-1 opacity-70" />;
    case 'Tenis': return <Trophy className="w-6 h-6 mb-1 opacity-70" />;
    case 'E-spor': return <Gamepad2 className="w-6 h-6 mb-1 opacity-70" />;
    case 'Beyzbol': return <Star className="w-6 h-6 mb-1 opacity-70" />;
    default: return <Lock className="w-6 h-6 mb-1 opacity-70" />;
  }
};
