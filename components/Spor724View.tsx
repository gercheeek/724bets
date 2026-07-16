import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Search, ChevronLeft, ChevronRight, ChevronDown, 
  Megaphone, Target, Gift, Shield, Gamepad2, Trophy, 
  Activity, Star, Lock, Flame, Clock, PlayCircle, Calendar
} from 'lucide-react';
import maclarData from '../maclar.json';

interface Spor724ViewProps {
  onNavigate: (view: string) => void;
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

export default function Spor724View({ onNavigate }: Spor724ViewProps) {
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
                       <span className="text-white/80">{boost.title || 'FIFA Dünya Kupası'}</span>
                       <span className="mx-1 opacity-50">•</span>
                       <Clock className="w-3 h-3" />
                       <span>5 saat içinde başlıyor</span>
                    </div>
                    <Activity className="w-3.5 h-3.5" />
                  </div>

                  {/* Teams */}
                  <div className="flex flex-col gap-2.5 mb-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-3 rounded-[2px] bg-blue-600 overflow-hidden flex"><div className="w-1/3 h-full bg-white"></div><div className="w-1/3 h-full bg-red-500"></div></div>
                           <span className="text-sm font-medium text-white/90">{boost.pick1}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                           <span>Bugün</span>
                           <Calendar className="w-3.5 h-3.5" />
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-3 rounded-[2px] bg-red-600 overflow-hidden flex flex-col"><div className="h-1/3 w-full bg-yellow-400"></div></div>
                           <span className="text-sm font-medium text-white/90">İspanya</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                           <span>22:00</span>
                           <Clock className="w-3.5 h-3.5" />
                        </div>
                     </div>
                  </div>

                  {/* Odds Buttons */}
                  <div className="flex items-center gap-2 mt-auto">
                     <button className="flex-1 flex items-center justify-between bg-[#111317] hover:bg-[#2a3038] px-3 py-2.5 rounded-md transition-colors">
                        <span className="text-xs text-[#94a3b8] font-medium">1</span>
                        <span className="text-xs text-white font-bold">2.42</span>
                     </button>
                     <button className="flex-1 flex items-center justify-between bg-[#111317] hover:bg-[#2a3038] px-3 py-2.5 rounded-md transition-colors">
                        <span className="text-xs text-[#94a3b8] font-medium">X</span>
                        <span className="text-xs text-white font-bold">3.25</span>
                     </button>
                     <button className="flex-1 flex items-center justify-between bg-[#111317] hover:bg-[#2a3038] px-3 py-2.5 rounded-md transition-colors">
                        <span className="text-xs text-[#94a3b8] font-medium">2</span>
                        <span className="text-xs text-white font-bold">3.35</span>
                     </button>
                  </div>
                </div>
              ))}
            </div>

            {/* UPCOMING MATCHES (EXACT CLONE) */}
            <div className="flex flex-col mb-8 w-full bg-[#0b0e14] rounded-lg overflow-hidden border border-[#1f232b]">
               
               {/* Column Headers */}
               <div className="flex items-center justify-end px-4 py-2 border-b border-[#1f232b]">
                 <div className="flex items-center w-[250px] md:w-[300px] pr-2">
                   <div className="flex-1 text-center text-[10px] font-bold text-[#5c677d] tracking-widest">1</div>
                   <div className="flex-1 text-center text-[10px] font-bold text-[#5c677d] tracking-widest">X</div>
                   <div className="flex-1 text-center text-[10px] font-bold text-[#5c677d] tracking-widest">2</div>
                   <div className="w-[50px]"></div>
                 </div>
               </div>

               {/* Match Rows */}
               {upcomingMatchesToUse.map((match, index) => (
                  <div key={match.id} className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3 bg-[#0b0e14] border-b border-[#1f232b] hover:bg-[#12161f] transition-colors cursor-pointer group gap-4 md:gap-0">
                     
                     {/* Left side: Teams */}
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-2">
                           <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0 opacity-70">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px] text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                           </div>
                           <span className="text-[12px] text-[#d1d5db] font-medium group-hover:text-white transition-colors tracking-wide">{match.home}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0 opacity-80">
                              <div className="w-3 h-3 rounded bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-[6px] font-black text-white">V</div>
                           </div>
                           <span className="text-[12px] text-[#d1d5db] font-medium group-hover:text-white transition-colors tracking-wide">{match.away}</span>
                        </div>
                     </div>

                     {/* Middle side: Date/Time/Stats */}
                     <div className="hidden md:flex items-center gap-5 pr-6 border-r border-[#1f232b]/50 mr-4 h-10 opacity-60 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col items-center gap-1">
                           <Calendar className="w-[13px] h-[13px] text-[#a0a5b5]" />
                           <span className="text-[9px] font-medium text-[#a0a5b5] tracking-wide">{match.date}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                           <Clock className="w-[13px] h-[13px] text-[#a0a5b5]" />
                           <span className="text-[9px] font-medium text-[#a0a5b5] tracking-wide">{match.time}</span>
                        </div>
                        <div className="flex items-center justify-center h-full ml-1">
                           <svg viewBox="0 0 24 24" fill="currentColor" className="w-[13px] h-[13px] text-[#a0a5b5]"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                        </div>
                     </div>

                     {/* Right side: Odds */}
                     <div className="flex items-center gap-2 w-full md:w-[300px] shrink-0">
                        {match.odds.slice(0, 3).map((odd, idx) => (
                           <button key={idx} className="flex-1 h-[38px] flex items-center justify-center rounded-[4px] bg-[#1a1e26] hover:bg-[#252a35] transition-colors border border-transparent hover:border-white/5">
                              <span className="text-[12px] font-bold text-[#f8f9fa]">{odd.value}</span>
                           </button>
                        ))}
                        <button className="w-[45px] h-[38px] flex items-center justify-center rounded-[4px] bg-[#1a1e26] hover:bg-[#252a35] transition-colors border border-transparent hover:border-white/5 shrink-0 ml-1">
                           <span className="text-[11px] font-bold text-[#f8f9fa]">{match.odds[3].value}</span>
                        </button>
                     </div>
                  </div>
               ))}
            </div>

            {/* LIVE MATCHES (EXACT CLONE) */}
            <div className="flex flex-col mb-8 w-full bg-[#0b0e14] rounded-lg overflow-hidden border border-[#1f232b]">
               
               {/* Column Headers */}
               <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f232b]">
                 <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase animate-pulse">CANLI</span>
                 </div>
                 <div className="flex items-center w-[250px] md:w-[300px] pr-2">
                   <div className="flex-1 text-center text-[10px] font-bold text-[#5c677d] tracking-widest">1</div>
                   <div className="flex-1 text-center text-[10px] font-bold text-[#5c677d] tracking-widest">X</div>
                   <div className="flex-1 text-center text-[10px] font-bold text-[#5c677d] tracking-widest">2</div>
                   <div className="w-[50px]"></div>
                 </div>
               </div>

               {/* Match Rows */}
               {mockLiveMatches.map((match, index) => (
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
                           <span className="text-[13px] font-black text-[#00FFA3] block md:hidden">{match.homeScore}</span>
                        </div>
                        <div className="flex items-center justify-between pr-4 md:pr-0">
                           <div className="flex items-center gap-2">
                              <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0 opacity-80">
                                 <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[6px] font-black text-white">V</div>
                              </div>
                              <span className="text-[12px] text-[#d1d5db] font-medium group-hover:text-white transition-colors tracking-wide">{match.away}</span>
                           </div>
                           <span className="text-[13px] font-black text-[#00FFA3] block md:hidden">{match.awayScore}</span>
                        </div>
                     </div>

                     {/* Middle side: Live Time & Scores (Desktop) */}
                     <div className="hidden md:flex items-center gap-6 pr-6 border-r border-[#1f232b]/50 mr-4 h-10">
                        <div className="flex flex-col items-center gap-1 w-10">
                           <span className="text-[10px] font-black text-[#00FFA3] animate-pulse">{match.minute}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 w-6">
                           <span className="text-[12px] font-black text-[#00FFA3]">{match.homeScore}</span>
                           <span className="text-[12px] font-black text-[#00FFA3]">{match.awayScore}</span>
                        </div>
                        <div className="flex items-center justify-center h-full ml-1 opacity-60">
                           <svg viewBox="0 0 24 24" fill="currentColor" className="w-[13px] h-[13px] text-[#a0a5b5]"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                        </div>
                     </div>

                     {/* Right side: Odds */}
                     <div className="flex items-center gap-2 w-full md:w-[300px] shrink-0">
                        {match.odds.slice(0, 3).map((odd, idx) => (
                           <button key={idx} className="flex-1 h-[38px] flex items-center justify-center rounded-[4px] bg-[#1a1e26] hover:bg-[#252a35] transition-colors border border-transparent hover:border-white/5">
                              <span className="text-[12px] font-bold text-[#f8f9fa]">{odd.value}</span>
                           </button>
                        ))}
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
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center min-w-[300px]">
          <div className="w-16 h-16 rounded-full bg-white/[0.02] border-white/[0.05] flex items-center justify-center mb-5 border">
            <Trophy className={`w-6 h-6 ${theme.betSlipMuted}`} />
          </div>
          <h3 className={`${theme.betSlipText} font-medium text-sm mb-1`}>Kuponunuz Boş</h3>
          <p className={`text-[11px] ${theme.betSlipMuted} leading-relaxed max-w-[180px]`}>
            Bahis yapmak için listeden dilediğiniz oranlara tıklayın.
          </p>
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
            <div className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">0</div>
          </div>
        </button>
      )}

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
