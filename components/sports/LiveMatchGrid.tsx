import React, { useState } from 'react';
import { Play, Trophy, Flame, Dribbble, Crosshair, ChevronDown, Activity, ChevronRight, Radio } from 'lucide-react';
import { useBetSlip } from '../../contexts/BetSlipContext';

interface LiveMatchGridProps {
  matches: any[];
}

const categories = [
  { id: 'all', name: 'Tüm Sporlar', icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 'futbol', name: 'Futbol', icon: <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-current opacity-80" /> },
  { id: 'basketbol', name: 'Basketbol', icon: <Dribbble className="w-3.5 h-3.5 opacity-80" /> },
  { id: 'tenis', name: 'Tenis', icon: <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-current opacity-80" /> },
  { id: 'buz_hokeyi', name: 'Buz Hokeyi', icon: <Trophy className="w-3.5 h-3.5 opacity-80" /> },
  { id: 'mma', name: 'MMA', icon: <Crosshair className="w-3.5 h-3.5 opacity-80" /> },
  { id: 'boks', name: 'Boks', icon: <Flame className="w-3.5 h-3.5 opacity-80" /> },
];

export default function LiveMatchGrid({ matches }: LiveMatchGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const { addSelection } = useBetSlip();

  // Yalnızca geçerli oranları olan aktif gerçek maçları filtrele
  const validMatches = matches.filter(m => m.homeOdd && m.homeOdd !== '-');

  const displayMatches = activeCategory === 'all' 
    ? validMatches 
    : validMatches.filter(m => m.sport?.toLowerCase().includes(activeCategory));

  return (
    <div className="w-full mt-2 bg-[#0b0e14] p-4 rounded-xl border border-white/5">
      
      {/* HEADER: CANLI & Categories */}
      <div className="flex items-center gap-4 mb-5 overflow-x-auto custom-scrollbar hide-scrollbar-mobile pb-2">
        <div className="flex items-center gap-2 text-[#00E5FF] font-black text-xl mr-2 shrink-0 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
           <Activity className="w-6 h-6 animate-pulse" />
           <span>CANLI</span>
        </div>
        
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full flex items-center gap-2 transition-all font-bold text-[13px] shrink-0 border ${
              activeCategory === cat.id 
                ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                : 'bg-[#151a25]/80 backdrop-blur text-zinc-300 border-white/5 hover:bg-[#00E5FF]/5 hover:text-white hover:border-[#00E5FF]/20'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* MATCH GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {displayMatches.map((match, idx) => (
          <div 
            key={match.id || idx}
            className="group/card bg-[#0b0e14]/80 backdrop-blur-md border border-white/[0.04] border-l-[3px] border-l-transparent hover:border-l-[#00E5FF] rounded-xl p-4 flex flex-col transition-all duration-300 shadow-xl hover:shadow-[0_8px_30px_rgba(0,229,255,0.05)] relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/[0.02] to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

            {/* League Info */}
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium tracking-wide mb-3">
               <div className="w-3.5 h-3.5 rounded-full border border-zinc-500 opacity-50 flex items-center justify-center">
                 <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
               </div>
               <span className="truncate">{match.league}</span>
            </div>

            {/* Time & Live */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-[12px] font-bold text-[#00E5FF] tracking-wide drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]">
                {match.time} {match.period === 'Canlı' ? '' : match.period}
              </span>
              {match.isLive && (
                <div className="flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_8px_#00E5FF]"></span>
                </div>
              )}
            </div>

            {/* Teams & Scores */}
            <div className="flex flex-col gap-2.5 mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                   <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shadow-sm">
                     <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-zinc-500 opacity-60"></div>
                   </div>
                   <span className="text-white text-[13px] font-bold">{match.home}</span>
                </div>
                <div className="bg-[#0b0c10] border border-white/5 px-2.5 py-1 rounded-md text-white font-bold text-sm min-w-[32px] text-center shadow-inner">
                  {match.score ? (match.score.includes(':') ? match.score.split(':')[0] : match.score.includes('-') ? match.score.split('-')[0].trim() : '0') : '0'}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                   <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shadow-sm">
                     <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-zinc-500 opacity-60"></div>
                   </div>
                   <span className="text-white text-[13px] font-bold">{match.away}</span>
                </div>
                <div className="bg-[#0b0c10] border border-white/5 px-2.5 py-1 rounded-md text-white font-bold text-sm min-w-[32px] text-center shadow-inner">
                  {match.score ? (match.score.includes(':') ? match.score.split(':')[1] : match.score.includes('-') ? match.score.split('-')[1].trim() : '0') : '0'}
                </div>
              </div>
            </div>

            {/* Odds */}
            <div className="mt-auto relative z-10">
              <div className="text-zinc-500 text-[10px] font-semibold mb-1.5 lowercase tracking-wider">1x2</div>
              <div className="flex gap-1.5 w-full">
                <button 
                  onClick={() => addSelection({ id: `grid-${match.id}_1`, matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: '1', odd: parseFloat(match.homeOdd?.replace(',', '.') || '1.00') })}
                  className="flex-1 bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] transition-all rounded-md px-2.5 py-2 flex justify-between items-center group/odd active:scale-[0.98]"
                >
                  <span className="text-zinc-500 text-[11px] font-medium group-hover/odd:text-[#00E5FF] transition-colors">1</span>
                  <span className="text-white text-[12px] font-bold group-hover/odd:text-white">{match.homeOdd || '-'}</span>
                </button>
                
                {match.drawOdd && match.drawOdd !== '-' && (
                  <button 
                    onClick={() => addSelection({ id: `grid-${match.id}_X`, matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'X', odd: parseFloat(match.drawOdd?.replace(',', '.') || '1.00') })}
                    className="flex-1 bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] transition-all rounded-md px-2.5 py-2 flex justify-between items-center group/odd active:scale-[0.98]"
                  >
                    <span className="text-zinc-500 text-[11px] font-medium group-hover/odd:text-[#00E5FF] transition-colors">B</span>
                    <span className="text-white text-[12px] font-bold group-hover/odd:text-white">{match.drawOdd}</span>
                  </button>
                )}
                
                <button 
                  onClick={() => addSelection({ id: `grid-${match.id}_2`, matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: '2', odd: parseFloat(match.awayOdd?.replace(',', '.') || '1.00') })}
                  className="flex-1 bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] transition-all rounded-md px-2.5 py-2 flex justify-between items-center group/odd active:scale-[0.98]"
                >
                  <span className="text-zinc-500 text-[11px] font-medium group-hover/odd:text-[#00E5FF] transition-colors">2</span>
                  <span className="text-white text-[12px] font-bold group-hover/odd:text-white">{match.awayOdd || '-'}</span>
                </button>
                
                <button className="bg-gradient-to-b from-[#151a25] to-[#0d1017] border border-white/5 hover:border-[#00E5FF]/40 rounded-md w-8 flex justify-center items-center transition-all group/btn shrink-0 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.1)] active:scale-[0.98]">
                  <ChevronDown className="w-4 h-4 text-zinc-500 group-hover/btn:text-[#00E5FF]" />
                </button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
      
      {displayMatches.length === 0 && (
        <div className="py-12 text-center text-zinc-500 font-medium bg-[#121722] rounded-xl border border-white/5 mt-4">
          Şu anda bu kategoride oranları açık aktif bir maç bulunmuyor.
        </div>
      )}
      
    </div>
  );
}
