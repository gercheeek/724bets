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
        <div className="flex items-center gap-2 text-[#1075fc] font-black text-xl mr-2 shrink-0">
           <Activity className="w-6 h-6 animate-pulse" />
           <span>CANLI</span>
        </div>
        
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full flex items-center gap-2 transition-all font-bold text-[13px] shrink-0 border ${
              activeCategory === cat.id 
                ? 'bg-[#1075fc] text-white border-transparent shadow-[0_0_15px_rgba(16,117,252,0.4)]' 
                : 'bg-[#151a25] text-zinc-300 border-white/5 hover:bg-[#1a2130] hover:text-white'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* MATCH GRID */}
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
        {displayMatches.map((match, idx) => (
          <div 
            key={match.id || idx}
            className="bg-[#161925] hover:bg-[#1a1d29] border border-white/5 hover:border-white/10 rounded-xl p-4 flex flex-col transition-all duration-300 shadow-md"
          >
            {/* League Info */}
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium tracking-wide mb-3">
               <div className="w-3.5 h-3.5 rounded-full border border-zinc-500 opacity-50 flex items-center justify-center">
                 <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
               </div>
               <span className="truncate">{match.league}</span>
            </div>

            {/* Time & Live */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-bold text-[#2b85fa] tracking-wide">
                {match.time} {match.period === 'Canlı' ? '' : match.period}
              </span>
              {match.isLive && (
                <div className="flex items-center justify-center">
                  <Radio className="w-4 h-4 text-red-500" />
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
            <div className="mt-auto">
              <div className="text-zinc-500 text-[10px] font-semibold mb-1.5 lowercase tracking-wider">1x2</div>
              <div className="flex gap-1.5 w-full">
                <button 
                  onClick={() => addSelection({ id: `grid-${match.id}_1`, matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: '1', odd: parseFloat(match.homeOdd?.replace(',', '.') || '1.00') })}
                  className="flex-1 bg-[#212634] hover:bg-[#2a3040] transition-colors rounded-md px-2.5 py-2 flex justify-between items-center group/odd shadow-sm"
                >
                  <span className="text-zinc-400 text-[11px] font-medium group-hover/odd:text-zinc-300">1</span>
                  <span className="text-white text-[12px] font-bold">{match.homeOdd || '-'}</span>
                </button>
                
                {match.drawOdd && match.drawOdd !== '-' && (
                  <button 
                    onClick={() => addSelection({ id: `grid-${match.id}_X`, matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'X', odd: parseFloat(match.drawOdd?.replace(',', '.') || '1.00') })}
                    className="flex-1 bg-[#212634] hover:bg-[#2a3040] transition-colors rounded-md px-2.5 py-2 flex justify-between items-center group/odd shadow-sm"
                  >
                    <span className="text-zinc-400 text-[11px] font-medium group-hover/odd:text-zinc-300">beraberlik</span>
                    <span className="text-white text-[12px] font-bold">{match.drawOdd}</span>
                  </button>
                )}
                
                <button 
                  onClick={() => addSelection({ id: `grid-${match.id}_2`, matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: '2', odd: parseFloat(match.awayOdd?.replace(',', '.') || '1.00') })}
                  className="flex-1 bg-[#212634] hover:bg-[#2a3040] transition-colors rounded-md px-2.5 py-2 flex justify-between items-center group/odd shadow-sm"
                >
                  <span className="text-zinc-400 text-[11px] font-medium group-hover/odd:text-zinc-300">2</span>
                  <span className="text-white text-[12px] font-bold">{match.awayOdd || '-'}</span>
                </button>

                
                <button className="bg-[#212634] hover:bg-[#2a3040] rounded-md w-8 flex justify-center items-center transition-colors group/btn shrink-0 shadow-sm">
                  <ChevronDown className="w-4 h-4 text-zinc-400 group-hover/btn:text-white" />
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
