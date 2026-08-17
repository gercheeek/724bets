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
    <div className="w-full mt-2 bg-transparent p-4 rounded-sports-card">
      
      {/* HEADER: CANLI & Categories */}
      <div className="flex items-center gap-4 mb-5 overflow-x-auto custom-scrollbar hide-scrollbar-mobile pb-2">
        <div className="flex items-center gap-2 text-sports-accent font-black text-xl mr-2 shrink-0 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
           <Activity className="w-6 h-6 animate-pulse" />
           <span>CANLI</span>
        </div>
        
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full flex items-center gap-2 transition-all font-bold text-[13px] shrink-0 border relative overflow-hidden group/cat ${
              activeCategory === cat.id 
                ? 'bg-sports-accent/10 text-sports-accent border-sports-accent shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                : 'bg-[#151a25]/80 backdrop-blur-md text-zinc-400 border-white/5 hover:bg-white/10 hover:text-white shadow-sm'
            }`}
          >
            {activeCategory === cat.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-sports-accent/0 via-sports-accent/10 to-sports-accent/0 opacity-50"></div>
            )}
            <span className="relative z-10 flex items-center gap-2">
                {cat.icon}
                {cat.name}
            </span>
          </button>
        ))}
      </div>

      {/* MATCH GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {displayMatches.map((match, idx) => (
          <div 
            key={match.id || idx}
            className="group/card bg-gradient-to-b from-[#161c28] to-[#131824] border border-white/5 border-t-white/10 border-l-[3px] border-l-transparent hover:border-l-sports-accent hover:border-white/10 rounded-[14px] p-4 flex flex-col transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(0,229,255,0.1)] relative overflow-hidden transform-gpu"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sports-accent/5 rounded-full blur-[50px] pointer-events-none group-hover/card:bg-sports-accent/10 transition-colors duration-500"></div>

            {/* League Info */}
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium tracking-wide mb-3">
               <div className="w-3.5 h-3.5 rounded-full border border-zinc-500 opacity-50 flex items-center justify-center">
                 <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
               </div>
               <span className="truncate">{match.league}</span>
            </div>

            {/* Time & Live */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2 bg-sports-accent/10 border border-sports-accent/20 px-2.5 py-1 rounded-md shadow-[inset_0_0_10px_rgba(0,229,255,0.05)]">
                 {match.isLive && (
                   <span className="w-1.5 h-1.5 rounded-full bg-sports-accent animate-pulse shadow-[0_0_8px_#00E5FF]"></span>
                 )}
                 <span className="text-[12px] font-bold text-sports-accent tracking-wide drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]">
                   {match.time} {match.period === 'Canlı' ? '' : match.period}
                 </span>
              </div>
            </div>

            {/* Teams & Scores */}
            <div className="flex flex-col gap-3 mb-6 relative z-10">
              <div className="flex items-center justify-between group/team">
                <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-sm group-hover/team:border-sports-accent/30 transition-colors">
                     <div className="w-3 h-3 rounded-full border-[2px] border-zinc-400 opacity-80 group-hover/team:border-sports-accent/70 transition-colors"></div>
                   </div>
                    <span className="text-white text-[14px] font-bold tracking-tight group-hover/team:text-sports-accent transition-colors">{match.home}</span>
                </div>
                <div className="bg-[#0a0e17] border border-white/5 px-3 py-1.5 rounded-lg text-white font-black text-sm min-w-[36px] text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                  {match.score ? (match.score.includes(':') ? match.score.split(':')[0] : match.score.includes('-') ? match.score.split('-')[0].trim() : '0') : '0'}
                </div>
              </div>
              
              <div className="flex items-center justify-between group/team">
                <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-sm group-hover/team:border-sports-accent/30 transition-colors">
                     <div className="w-3 h-3 rounded-full border-[2px] border-zinc-400 opacity-80 group-hover/team:border-sports-accent/70 transition-colors"></div>
                   </div>
                   <span className="text-white text-[14px] font-bold tracking-tight group-hover/team:text-sports-accent transition-colors">{match.away}</span>
                </div>
                <div className="bg-[#0a0e17] border border-white/5 px-3 py-1.5 rounded-lg text-white font-black text-sm min-w-[36px] text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                  {match.score ? (match.score.includes(':') ? match.score.split(':')[1] : match.score.includes('-') ? match.score.split('-')[1].trim() : '0') : '0'}
                </div>
              </div>
            </div>

            {/* Odds */}
            <div className="mt-auto relative z-10">
              <div className="text-zinc-500 text-[10px] font-bold mb-2 uppercase tracking-widest">Taraf Bahsi</div>
              <div className="flex gap-2 w-full">
                <button 
                  onClick={() => addSelection({ id: `grid-${match.id}_1`, matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: '1', odd: parseFloat(match.homeOdd?.replace(',', '.') || '1.00') })}
                  className="flex-1 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-sports-accent hover:from-sports-accent/20 hover:to-sports-accent/5 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all rounded-xl px-3 py-2.5 flex justify-between items-center group/odd active:scale-[0.98]"
                >
                  <span className="text-zinc-400 text-[11px] font-bold group-hover/odd:text-sports-accent transition-colors">1</span>
                  <span className="text-white text-[13px] font-black group-hover/odd:text-white drop-shadow-sm">{match.homeOdd || '-'}</span>
                </button>
                
                {match.drawOdd && match.drawOdd !== '-' && (
                  <button 
                    onClick={() => addSelection({ id: `grid-${match.id}_X`, matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: 'X', odd: parseFloat(match.drawOdd?.replace(',', '.') || '1.00') })}
                    className="flex-1 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-sports-accent hover:from-sports-accent/20 hover:to-sports-accent/5 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all rounded-xl px-3 py-2.5 flex justify-between items-center group/odd active:scale-[0.98]"
                  >
                    <span className="text-zinc-400 text-[11px] font-bold group-hover/odd:text-sports-accent transition-colors">X</span>
                    <span className="text-white text-[13px] font-black group-hover/odd:text-white drop-shadow-sm">{match.drawOdd}</span>
                  </button>
                )}
                
                <button 
                  onClick={() => addSelection({ id: `grid-${match.id}_2`, matchId: match.id, matchName: `${match.home} vs ${match.away}`, selectionName: '2', odd: parseFloat(match.awayOdd?.replace(',', '.') || '1.00') })}
                  className="flex-1 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-sports-accent hover:from-sports-accent/20 hover:to-sports-accent/5 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all rounded-xl px-3 py-2.5 flex justify-between items-center group/odd active:scale-[0.98]"
                >
                  <span className="text-zinc-400 text-[11px] font-bold group-hover/odd:text-sports-accent transition-colors">2</span>
                  <span className="text-white text-[13px] font-black group-hover/odd:text-white drop-shadow-sm">{match.awayOdd || '-'}</span>
                </button>
                
                <button className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-sports-accent hover:bg-sports-accent/10 rounded-xl w-10 flex justify-center items-center transition-all group/btn shrink-0 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] active:scale-[0.98]">
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover/btn:text-sports-accent" />
                </button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
      
      {displayMatches.length === 0 && (
        <div className="py-12 text-center text-zinc-500 font-medium bg-sports-card rounded-sports-card border border-sports-subtle mt-4">
          Şu anda bu kategoride oranları açık aktif bir maç bulunmuyor.
        </div>
      )}
      
    </div>
  );
}
