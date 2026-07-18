import React from 'react';
import { Activity, Target, Trophy, Gamepad2, Dribbble, Swords, Globe, ChevronDown } from 'lucide-react';

export const PopularBetsPreview = () => {
  const handleOpenAuth = () => {
    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'register' } }));
  };

  const previewMatches = [
    { id: 'p1', league: 'Uluslararası • Dünya Kupası', time: 'Yarın, 00:00', t1: 'Fransa', f1: '🇫🇷', t2: 'İngiltere', f2: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', odds: [{l:'1',v:'1.87',s:'Fransa'}, {l:'beraberlik',v:'3.90',s:'Beraberlik'}, {l:'2',v:'3.80',s:'İngiltere'}] },
    { id: 'p2', league: 'Uluslararası • Seçkin Kulüp Hazırlık Maçları', time: 'Bugün, 16:30', t1: 'FC Basel 1893', f1: '🇨🇭', t2: 'Juventus', f2: '🇮🇹', odds: [{l:'1',v:'4.20',s:'FC Basel'}, {l:'beraberlik',v:'3.65',s:'Beraberlik'}, {l:'2',v:'1.81',s:'Juventus'}] },
  ];

  return (
    <div className="w-full mb-8 relative">
      <div className="flex items-center gap-2 mb-4 px-2">
         <span className="text-yellow-500 text-xl">👑</span>
         <h2 className="text-lg font-bold text-white tracking-wide">Popüler</h2>
      </div>
      
      <div className="flex items-center overflow-x-auto gap-2 scrollbar-hide px-2 pb-2 mb-2">
         <button className="bg-[#10b981] text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-[#10b981]/90 rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors pointer-events-none">
            <Activity size={14} /> Futbol
         </button>
         <button className="bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#10b981]/50 hover:bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors pointer-events-none">
            <Target size={14} /> Beyzbol
         </button>
         <button className="bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#10b981]/50 hover:bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors pointer-events-none">
            <Trophy size={14} /> Tenis
         </button>
         <button className="bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#10b981]/50 hover:bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors pointer-events-none">
            <Gamepad2 size={14} /> eFutbol
         </button>
         <button className="bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#10b981]/50 hover:bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors pointer-events-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> Dota 2
         </button>
         <button className="bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#10b981]/50 hover:bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors pointer-events-none">
            <Dribbble size={14} /> Basketbol
         </button>
         <button className="bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#10b981]/50 hover:bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shrink-0 transition-colors pointer-events-none">
            <Swords size={14} /> Counter-Strike
         </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
         {previewMatches.map((match) => (
            <div key={match.id} onClick={handleOpenAuth} className="bg-[#1e1c24]/60 backdrop-blur-md rounded-xl p-4 flex flex-col justify-between border border-white/10 hover:border-[#10b981]/50 transition-colors shadow-lg group cursor-pointer relative overflow-hidden">
               <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                     <Globe size={12} />
                     <span className="truncate max-w-[200px]">{match.league}</span>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-500 shrink-0">{match.time}</div>
               </div>
               <div className="flex flex-col gap-2 mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                     <span className="text-xl w-6 text-center">{match.f1}</span>
                     <span className="text-sm font-black text-white truncate tracking-wide">{match.t1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-xl w-6 text-center">{match.f2}</span>
                     <span className="text-sm font-black text-white truncate tracking-wide">{match.t2}</span>
                  </div>
               </div>
               <div className="flex items-center gap-2 mt-auto relative z-10">
                  <div className="text-[10px] font-bold text-[#94a3b8] w-6 shrink-0">1x2</div>
                  <div className="flex flex-1 gap-1.5">
                     {match.odds.map((btn, idx) => (
                        <button 
                           key={idx}
                           onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAuth();
                           }}
                           className="flex-1 py-1.5 px-1.5 sm:px-3 rounded flex flex-col sm:flex-row items-center justify-center sm:justify-between text-[10px] sm:text-[11px] transition-colors border border-white/5 bg-[#2a3040]/50 hover:bg-[#343b4f] text-[#cbd5e1]"
                        >
                           <span className="text-zinc-500 hidden sm:block truncate max-w-[50px]">{btn.l}</span>
                           <span className="font-bold">{btn.v}</span>
                        </button>
                     ))}
                  </div>
               </div>
               

            </div>
         ))}
      </div>


    </div>
  );
};
