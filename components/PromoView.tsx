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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {tournaments.map((tournament) => (
          <div 
            key={tournament.id}
            className={`flex flex-col bg-[#0F1627] rounded-2xl relative overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.4)] ring-1 ring-white/5 hover:ring-blue-500/50 transition-all duration-300 ${tournament.status === 'ended' ? 'opacity-60 grayscale-[30%]' : ''}`}
          >
            {/* Image Banner Header */}
            <div className="w-full h-32 sm:h-40 relative overflow-hidden">
               <img 
                 src={tournament.image} 
                 alt={tournament.title} 
                 className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
               />
               
               {/* Gradient overlay for text readability */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#0F1627] via-[#0F1627]/40 to-transparent" />
               
               {/* Premium Inner Glow on the image wrapper */}
               <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] rounded-t-2xl pointer-events-none" />

               {/* Small overlay badge for active */}
               {tournament.status === 'active' && (
                 <div className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30 backdrop-blur-md shadow-[0_0_10px_rgba(52,211,153,0.3)] flex items-center gap-1.5 uppercase tracking-wider">
                   <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                   Aktif
                 </div>
               )}
            </div>

            {/* Content Body */}
            <div className="flex flex-col flex-1 px-4 pb-4 pt-1 relative z-10 -mt-6">
              <h3 className="text-white font-bold text-base sm:text-lg leading-tight mb-1 line-clamp-2 drop-shadow-md">
                {tournament.title}
              </h3>
              <p className="text-zinc-400 text-xs mb-3 line-clamp-2">{tournament.desc}</p>
              
              <div className="mt-auto">
                <div className="text-[10px] font-semibold text-zinc-500 mb-0.5 uppercase tracking-wider">Ödül Havuzu</div>
                <div className="text-blue-400 font-black text-xl sm:text-2xl mb-3 drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]">
                  {tournament.prize}
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-[10px] font-bold bg-[#1C2646] text-zinc-300 px-2 py-1 rounded-md border border-white/5">
                    {tournament.status === 'active' && <Timer className="w-3 h-3 text-emerald-400" />}
                    {tournament.status === 'upcoming' && <Calendar className="w-3 h-3 text-amber-400" />}
                    {tournament.status === 'ended' && <Calendar className="w-3 h-3 text-zinc-500" />}
                    {tournament.timeInfo}
                  </div>
                  
                  {tournament.participants !== undefined && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-black/20 px-2 py-1 rounded-md">
                      <Users className="w-3 h-3" /> {tournament.participants}
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
