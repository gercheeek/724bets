import React, { useState, useEffect } from 'react';
import { Timer, Trophy, ChevronRight } from 'lucide-react';

const mockUpcomingTournaments = [
  {
    id: '3',
    title: 'HAFTASONU ÇARPAN TURNUVASI',
    desc: 'Daha yüksek kazanma çarpanı için turnuvaya katıl...',
    prize: '$5.754,71',
    timeInfo: '17s 01d',
    image: '/images/promos/weekend_multiplier_promo_1785470757275.jpg',
  },
  {
    id: '4',
    title: 'Hacksaw Turnuvası',
    desc: 'Bahislerin toplamına göre puan kazan...',
    prize: '$644,79',
    timeInfo: '17s 32d',
    image: '/images/promos/hacksaw_promo_1785470736175.jpg',
  },
  {
    id: '5',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$97,83',
    timeInfo: '06g 03s 02d',
    image: '/images/promos/gates_of_olympus_promo_1785470699172.jpg',
  }
];

const parseTimeInfo = (timeInfo: string) => {
  const parts = timeInfo.split(' ');
  const result = [];
  for (const part of parts) {
    if (part.endsWith('g')) result.push({ value: part.replace('g', ''), label: 'GÜN' });
    else if (part.endsWith('s')) result.push({ value: part.replace('s', ''), label: 'SAAT' });
    else if (part.endsWith('d')) result.push({ value: part.replace('d', ''), label: 'DAKİKA' });
  }
  return result;
};

export const UpcomingTournamentsWidget = ({ onViewChange }: { onViewChange?: (view: string) => void }) => {
  return (
    <div className="w-full flex flex-col mb-8 font-sans">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Yaklaşan <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 drop-shadow-[0_0_12px_rgba(234,179,8,0.3)]">Turnuvalar</span>
          </h2>
        </div>
        <button 
          onClick={() => onViewChange?.('promo')}
          className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors"
        >
          Tümünü Gör
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar pl-2 pr-4 -mx-2 w-[calc(100%+16px)]">
        {mockUpcomingTournaments.map((t, idx) => {
          const parsedTime = parseTimeInfo(t.timeInfo);
          return (
            <div 
              key={t.id}
              onClick={() => onViewChange?.('promo')}
              className="snap-start shrink-0 w-[280px] md:w-[320px] flex flex-col bg-[#0c0c0c] rounded-[16px] relative overflow-hidden group shadow-xl ring-1 ring-white/5 hover:ring-yellow-500/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 rounded-[16px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] pointer-events-none z-20" />
              
              <div className="w-full h-[140px] relative overflow-hidden shrink-0">
                <img 
                  src={t.image} 
                  alt={t.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c0c0c] to-transparent pointer-events-none" />
                
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                   <span className="text-[9px] font-bold text-white uppercase tracking-wider">Yaklaşan</span>
                </div>
              </div>

              <div className="flex flex-col flex-1 px-4 pb-4 pt-1 relative z-10 bg-[#0c0c0c]">
                <h3 className="text-gray-100 font-bold text-[15px] leading-snug mb-1.5 line-clamp-1 group-hover:text-yellow-400 transition-colors">
                  {t.title}
                </h3>
                
                <div className="flex items-baseline gap-2 mb-3">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-100 to-yellow-500 font-black text-xl tracking-tighter drop-shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                    {t.prize}
                  </div>
                  <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Ödül Havuzu</div>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-yellow-500/80 uppercase tracking-[0.1em] drop-shadow-sm">
                    <Timer className="w-3 h-3" />
                    BAŞLAMASINA KALAN SÜRE
                  </div>
                  <div className="flex gap-1.5 w-full">
                    {parsedTime.map((p, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-center border rounded-lg py-1.5 bg-gradient-to-br from-yellow-500/[0.08] to-transparent border-yellow-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_2px_8px_rgba(0,0,0,0.2)]">
                        <span className="font-mono text-base font-black text-white tracking-wider drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">{p.value}</span>
                        <span className="text-[7px] font-bold mt-0.5 uppercase tracking-[0.15em] text-yellow-500/70">{p.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};
