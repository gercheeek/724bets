import React from 'react';
import { Trophy, Timer, Users, Swords, Calendar } from 'lucide-react';

interface Tournament {
  id: string;
  title: string;
  desc: string;
  prize: string;
  status: 'active' | 'upcoming' | 'ended';
  timeInfo: string;
  participants?: number;
}

const TournamentImage = ({ title }: { title: string }) => {
  if (title.includes('Olympus')) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-yellow-500/10 to-amber-600/20 flex items-center justify-center relative overflow-hidden rounded-lg border border-yellow-500/20 group-hover:border-yellow-400/50 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.3),transparent_70%)]"></div>
        {/* Lightning Bolt */}
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] relative z-10 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
    );
  }
  if (title.includes('Le Serisi')) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-pink-500/10 to-rose-600/20 flex items-center justify-center relative overflow-hidden rounded-lg border border-pink-500/20 group-hover:border-pink-400/50 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.3),transparent_70%)]"></div>
        {/* Heart/Candy */}
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-pink-400 drop-shadow-[0_0_12px_rgba(244,114,182,0.8)] relative z-10 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    );
  }
  if (title.includes('Hacksaw')) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-orange-500/10 to-red-600/20 flex items-center justify-center relative overflow-hidden rounded-lg border border-orange-500/20 group-hover:border-orange-400/50 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.3),transparent_70%)]"></div>
        {/* Skull/Wanted */}
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.8)] relative z-10 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor">
          <path d="M12 2a8 8 0 0 0-8 8c0 2.2.9 4.2 2.3 5.6L5 22l3.5-1.5L12 22l3.5-1.5L19 22l-1.3-6.4A8 8 0 0 0 20 10a8 8 0 0 0-8-8zm-2.5 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
        </svg>
      </div>
    );
  }
  
  // HAFTASONU ÇARPAN vs (Default)
  return (
    <div className="w-full h-full bg-gradient-to-br from-cyan-500/10 to-blue-600/20 flex items-center justify-center relative overflow-hidden rounded-lg border border-cyan-500/20 group-hover:border-cyan-400/50 transition-colors">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.3),transparent_70%)]"></div>
      <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300 flex flex-col items-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] mb-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        <div className="text-xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] tracking-tighter leading-none">
          x500
        </div>
      </div>
    </div>
  );
};

const tournaments: Tournament[] = [
  {
    id: '1',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$97,83',
    status: 'active',
    timeInfo: 'Bitiş tarihi: 05d 20h 01m',
    participants: 273,
  },
  {
    id: '2',
    title: 'Le Serisi Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$222,52',
    status: 'active',
    timeInfo: 'Bitiş tarihi: 05d 20h 01m',
    participants: 36,
  },
  {
    id: '3',
    title: 'HAFTASONU ÇARPAN TURNUVASI 5.000 EURO',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$5.754,71',
    status: 'upcoming',
    timeInfo: '.. içinde başlar: 17h 01m',
  },
  {
    id: '4',
    title: 'Hacksaw Turnuvası',
    desc: 'Bahislerin toplamına göre puanlar,...',
    prize: '$644,79',
    status: 'upcoming',
    timeInfo: '.. içinde başlar: 17h 32m',
  },
  {
    id: '5',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$97,83',
    status: 'upcoming',
    timeInfo: '.. içinde başlar: 06d 03h 02m',
  },
  {
    id: '6',
    title: 'Le Serisi Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$222,52',
    status: 'upcoming',
    timeInfo: '.. içinde başlar: 06d 05h 32m',
  },
  {
    id: '7',
    title: 'HAFTASONU ÇARPAN TURNUVASI 5.000 EURO',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$5.687,98',
    status: 'ended',
    timeInfo: 'Bitti: 2026.07.26',
  },
  {
    id: '8',
    title: 'Hacksaw Turnuvası',
    desc: 'Bahislerin toplamına göre puanlar,...',
    prize: '$642,51',
    status: 'ended',
    timeInfo: 'Bitti: 2026.07.30',
  },
  {
    id: '9',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$96,81',
    status: 'ended',
    timeInfo: 'Bitti: 2026.07.29',
  }
];

export default function PromoView() {
  return (
    <div className="flex-1 w-full min-h-screen bg-[#0B101E] text-white p-4 md:p-6 lg:p-8 font-sans pb-32">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            Turnuvalar
          </h1>
          <p className="text-zinc-400 mt-2 font-medium">Büyük ödül havuzlu turnuvalara katıl, skor tablosunda zirveye oyna!</p>
        </div>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tournaments.map((tournament) => (
          <div 
            key={tournament.id}
            className={`flex items-center gap-4 bg-[#131B31] border border-white/5 hover:border-emerald-500/30 transition-all p-4 rounded-2xl relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.2)] ${tournament.status === 'ended' ? 'opacity-60 grayscale-[50%]' : ''}`}
          >
            {/* Hover subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Left Graphic Wrapper */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#17213D] p-1 flex-shrink-0 border border-white/5 relative overflow-hidden">
               <TournamentImage title={tournament.title} />
               
               {/* Small overlay badge for active */}
               {tournament.status === 'active' && (
                 <div className="absolute top-2 right-2 z-20 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,1)] animate-pulse" />
               )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 py-1">
              <h3 className="text-white font-extrabold text-[15px] sm:text-[17px] leading-snug mb-1 line-clamp-2 pr-2">
                {tournament.title}
              </h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] mb-2 line-clamp-1">{tournament.desc}</p>
              
              <div className="text-blue-400 font-black text-lg sm:text-xl mb-3 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]">
                {tournament.prize}
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold bg-[#1C2646] text-zinc-300 px-2 py-1 rounded-md">
                  {tournament.status === 'active' && <Timer className="w-3 h-3 text-emerald-400" />}
                  {tournament.status === 'upcoming' && <Calendar className="w-3 h-3 text-amber-400" />}
                  {tournament.status === 'ended' && <Calendar className="w-3 h-3 text-zinc-500" />}
                  {tournament.timeInfo}
                </div>
                
                {tournament.participants !== undefined && (
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-zinc-400">
                    <Users className="w-3 h-3" /> {tournament.participants}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
