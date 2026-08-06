import React, { useState, useEffect } from 'react';
import { Timer, Trophy, ChevronRight, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getUpcomingTournaments = (t: any) => [
  {
    id: '3',
    title: t('promo_view.weekend_title'),
    desc: t('promo_view.weekend_desc') || 'Daha yüksek kazanma çarpanı için turnuvaya katıl...',
    prize: '$5.754,71',
    timeInfo: '17s 01d',
    image: '/images/slots_banner_purple.webp',
  },
  {
    id: '4',
    title: t('promo_view.hacksaw_title'),
    desc: t('promo_view.hacksaw_desc') || 'Bahislerin toplamına göre puan kazan...',
    prize: '$644,79',
    timeInfo: '17s 32d',
    image: '/images/treasure_banner_teal.webp',
  },
  {
    id: '5',
    title: t('promo_view.gates_title'),
    desc: t('promo_view.gates_desc') || 'Daha yüksek kazanma çarpanı için...',
    prize: '$97,83',
    timeInfo: '06g 03s 02d',
    image: '/images/basketball_banner_blue.webp',
  }
];

const parseTimeInfo = (timeInfo: string, t: any) => {
  const parts = timeInfo.split(' ');
  const result = [];
  for (const part of parts) {
    if (part.endsWith('g')) result.push({ value: part.replace('g', ''), label: t('promo_view.day') || 'GÜN' });
    else if (part.endsWith('s')) result.push({ value: part.replace('s', ''), label: t('promo_view.hour') || 'SAAT' });
    else if (part.endsWith('d')) result.push({ value: part.replace('d', ''), label: t('promo_view.minute') || 'DAKİKA' });
  }
  return result;
};

export const UpcomingTournamentsWidget = ({ onViewChange }: { onViewChange?: (view: string) => void }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col mb-8 font-sans mt-4">
      <div className="flex items-center justify-between mb-5 px-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#00E5FF] rounded-full shadow-[0_0_10px_rgba(0,229,255,0.5)]"></div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            {t('home.tournaments_upcoming')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00b3cc]">{t('home.tournaments_title')}</span>
          </h2>
        </div>
        <button 
          onClick={() => onViewChange?.('promo')}
          className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors"
        >
          {t('home.tournaments_see_all')}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar pl-2 pr-4 -mx-2 w-[calc(100%+16px)]">
        {getUpcomingTournaments(t).map((tournament, idx) => {
          const parsedTime = parseTimeInfo(tournament.timeInfo, t);
          return (
            <div 
              key={tournament.id}
              onClick={() => onViewChange?.('promo')}
              className="snap-start shrink-0 w-[280px] md:w-[320px] flex flex-col bg-[#131823] rounded-2xl relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5 hover:border-[#00E5FF]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] pointer-events-none z-20" />
              
              {/* Abstract Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 rounded-full blur-3xl group-hover:bg-[#00E5FF]/10 transition-colors duration-500 pointer-events-none z-0" />
              
              <div className="w-full h-[140px] relative overflow-hidden shrink-0 z-10">
                <img 
                  src={tournament.image} 
                  alt={tournament.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#131823] to-transparent pointer-events-none" />
                
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded flex items-center gap-1.5 shadow-lg">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                   <span className="text-[9px] font-bold text-white uppercase tracking-wider">{t('home.tournaments_badge')}</span>
                </div>
              </div>

              <div className="flex flex-col flex-1 px-5 pb-5 pt-0 relative z-10">
                <h3 className="text-white font-bold text-[15px] leading-snug mb-1.5 line-clamp-1 group-hover:text-[#00E5FF] transition-colors">
                  {tournament.title}
                </h3>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <div className="text-white font-black text-xl tracking-tighter drop-shadow-md">
                    {tournament.prize}
                  </div>
                  <div className="text-[10px] font-semibold text-[#848B9D] uppercase tracking-wider">{t('home.tournaments_prize_pool')}</div>
                </div>

                <div className="mt-auto flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#848B9D] uppercase tracking-[0.1em]">
                    <Timer className="w-3 h-3 text-[#00E5FF]" />
                    {t('home.tournaments_time_left')}
                  </div>
                  <div className="flex gap-2 w-full">
                    {parsedTime.map((p, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-center rounded-lg py-1.5 bg-[#0A0C10] border border-white/5 shadow-inner">
                        <span className="font-mono text-[15px] font-black text-white tracking-wider">{p.value}</span>
                        <span className="text-[7px] font-bold mt-0.5 uppercase tracking-[0.15em] text-[#848B9D]">{p.label}</span>
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
