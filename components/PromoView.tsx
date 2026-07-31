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
    image: '/images/promos/gates_of_olympus_promo_1785470699172.jpg',
  },
  {
    id: '2',
    title: 'Le Serisi Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$222,52',
    status: 'active',
    timeInfo: 'Bitiş tarihi: 05d 20h 01m',
    participants: 36,
    image: '/images/promos/sweet_bonanza_promo_1785470716975.jpg',
  },
  {
    id: '3',
    title: 'HAFTASONU ÇARPAN TURNUVASI 5.000 EURO',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$5.754,71',
    status: 'upcoming',
    timeInfo: '.. içinde başlar: 17h 01m',
    image: '/images/promos/weekend_multiplier_promo_1785470757275.jpg',
  },
  {
    id: '4',
    title: 'Hacksaw Turnuvası',
    desc: 'Bahislerin toplamına göre puanlar,...',
    prize: '$644,79',
    status: 'upcoming',
    timeInfo: '.. içinde başlar: 17h 32m',
    image: '/images/promos/hacksaw_promo_1785470736175.jpg',
  },
  {
    id: '5',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$97,83',
    status: 'upcoming',
    timeInfo: '.. içinde başlar: 06d 03h 02m',
    image: '/images/promos/gates_of_olympus_promo_1785470699172.jpg',
  },
  {
    id: '6',
    title: 'Le Serisi Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$222,52',
    status: 'upcoming',
    timeInfo: '.. içinde başlar: 06d 05h 32m',
    image: '/images/promos/sweet_bonanza_promo_1785470716975.jpg',
  },
  {
    id: '7',
    title: 'HAFTASONU ÇARPAN TURNUVASI 5.000 EURO',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$5.687,98',
    status: 'ended',
    timeInfo: 'Bitti: 2026.07.26',
    image: '/images/promos/weekend_multiplier_promo_1785470757275.jpg',
  },
  {
    id: '8',
    title: 'Hacksaw Turnuvası',
    desc: 'Bahislerin toplamına göre puanlar,...',
    prize: '$642,51',
    status: 'ended',
    timeInfo: 'Bitti: 2026.07.30',
    image: '/images/promos/hacksaw_promo_1785470736175.jpg',
  },
  {
    id: '9',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$96,81',
    status: 'ended',
    timeInfo: 'Bitti: 2026.07.29',
    image: '/images/promos/gates_of_olympus_promo_1785470699172.jpg',
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
            className={`flex flex-col bg-[#131B31] border border-white/5 hover:border-emerald-500/30 transition-all rounded-2xl relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.2)] ${tournament.status === 'ended' ? 'opacity-60 grayscale-[30%]' : ''}`}
          >
            {/* Image Banner Header */}
            <div className="w-full h-48 sm:h-56 relative overflow-hidden border-b border-white/5">
               <img 
                 src={tournament.image} 
                 alt={tournament.title} 
                 className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
               />
               
               {/* Gradient overlay for text readability */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#131B31] via-[#131B31]/40 to-transparent" />
               
               {/* Small overlay badge for active */}
               {tournament.status === 'active' && (
                 <div className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(52,211,153,0.4)] flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                   AKTİF
                 </div>
               )}
            </div>

            {/* Content Body */}
            <div className="flex flex-col flex-1 p-5 relative z-10 -mt-8">
              <h3 className="text-white font-black text-lg sm:text-xl leading-snug mb-1.5 line-clamp-2 drop-shadow-md">
                {tournament.title}
              </h3>
              <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{tournament.desc}</p>
              
              <div className="mt-auto">
                <div className="text-sm font-semibold text-zinc-500 mb-1 uppercase tracking-wider">Ödül Havuzu</div>
                <div className="text-blue-400 font-black text-2xl sm:text-3xl mb-4 drop-shadow-[0_0_12px_rgba(96,165,250,0.5)]">
                  {tournament.prize}
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs font-bold bg-[#1C2646] text-zinc-300 px-3 py-1.5 rounded-lg border border-white/5">
                    {tournament.status === 'active' && <Timer className="w-3.5 h-3.5 text-emerald-400" />}
                    {tournament.status === 'upcoming' && <Calendar className="w-3.5 h-3.5 text-amber-400" />}
                    {tournament.status === 'ended' && <Calendar className="w-3.5 h-3.5 text-zinc-500" />}
                    {tournament.timeInfo}
                  </div>
                  
                  {tournament.participants !== undefined && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 bg-black/20 px-3 py-1.5 rounded-lg">
                      <Users className="w-3.5 h-3.5" /> {tournament.participants}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
