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
  image: string;
}

const tournaments: Tournament[] = [
  {
    id: '1',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$97,83',
    status: 'active',
    timeInfo: 'Bitiş tarihi: 05d 20h 01m',
    participants: 273,
    image: '/images/slots/gates_of_olympus.webp',
  },
  {
    id: '2',
    title: 'Le Serisi Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$222,52',
    status: 'active',
    timeInfo: 'Bitiş tarihi: 05d 20h 01m',
    participants: 36,
    image: '/images/slots/sweet_bonanza.webp',
  },
  {
    id: '3',
    title: 'HAFTASONU ÇARPAN TURNUVASI 5.000 EURO',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$5.754,71',
    status: 'upcoming',
    timeInfo: '.. içinde başlar: 17h 01m',
    image: '/images/slots/sugar_rush.webp',
  },
  {
    id: '4',
    title: 'Hacksaw Turnuvası',
    desc: 'Bahislerin toplamına göre puanlar,...',
    prize: '$644,79',
    status: 'upcoming',
    timeInfo: '.. içinde başlar: 17h 32m',
    image: '/images/slots/wanted_dead.webp',
  },
  {
    id: '5',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$97,83',
    status: 'upcoming',
    timeInfo: '.. içinde başlar: 06d 03h 02m',
    image: '/images/slots/gates_of_olympus.webp',
  },
  {
    id: '6',
    title: 'Le Serisi Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$222,52',
    status: 'upcoming',
    timeInfo: '.. içinde başlar: 06d 05h 32m',
    image: '/images/slots/sweet_bonanza.webp',
  },
  {
    id: '7',
    title: 'HAFTASONU ÇARPAN TURNUVASI 5.000 EURO',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$5.687,98',
    status: 'ended',
    timeInfo: 'Bitti: 2026.07.26',
    image: '/images/slots/sugar_rush.webp',
  },
  {
    id: '8',
    title: 'Hacksaw Turnuvası',
    desc: 'Bahislerin toplamına göre puanlar,...',
    prize: '$642,51',
    status: 'ended',
    timeInfo: 'Bitti: 2026.07.30',
    image: '/images/slots/wanted_dead.webp',
  },
  {
    id: '9',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$96,81',
    status: 'ended',
    timeInfo: 'Bitti: 2026.07.29',
    image: '/images/slots/gates_of_olympus.webp',
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

            {/* Left Image Placeholder (Simulating the bull character) */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gradient-to-br from-[#1C2646] to-[#0F1627] p-1 flex-shrink-0 border border-white/10 relative overflow-hidden">
               {/* Decorative background circle */}
               <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-[20px] scale-150" />
               <img src={tournament.image} alt={tournament.title} className="w-full h-full object-cover rounded-lg relative z-10" onError={(e) => { e.currentTarget.src = '/images/slots/sweet_bonanza.webp' }} />
               {/* Small overlay badge for active */}
               {tournament.status === 'active' && (
                 <div className="absolute top-1 right-1 z-20 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,1)] animate-pulse" />
               )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 py-1">
              <h3 className="text-white font-bold text-sm sm:text-base leading-tight mb-1 line-clamp-2">
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
