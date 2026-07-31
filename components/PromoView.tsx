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
    <div className="flex-1 w-full min-h-screen bg-[#06080D] text-white p-4 md:p-6 lg:p-8 font-sans pb-32 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] bg-[#00E5FF]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 flex items-center gap-4 tracking-tight">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <Trophy className="w-6 h-6 text-black" />
              </div>
              Turnuvalar
            </h1>
            <p className="text-zinc-400 mt-3 text-sm md:text-base font-medium max-w-xl leading-relaxed">
              Büyük ödül havuzlu premium turnuvalara katıl, skor tablosunda zirveye oyna ve efsanevi ödülleri kazan!
            </p>
          </div>
        </div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tournaments.map((tournament) => (
            <div 
              key={tournament.id}
              className={`flex flex-col bg-[#0B0F19] rounded-2xl relative overflow-hidden group shadow-lg border border-white/5 hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] transition-all duration-500 ${tournament.status === 'ended' ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}
            >
              {/* Image Header - Clean, no text overlap */}
              <div className="w-full h-48 relative overflow-hidden">
                 <img 
                   src={tournament.image} 
                   alt={tournament.title} 
                   className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                 />
                 
                 {/* Subtle vignette over the image */}
                 <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />

                 {/* Status Badge */}
                 {tournament.status === 'active' && (
                   <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-[#0B0F19]/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20 shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
                     <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_5px_#34d399]" />
                     Aktif
                   </div>
                 )}
                 {tournament.status === 'upcoming' && (
                   <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-[#0B0F19]/80 backdrop-blur-md text-amber-400 text-[10px] font-bold rounded-lg border border-amber-500/20 flex items-center gap-1.5 uppercase tracking-wider">
                     Yakında
                   </div>
                 )}
              </div>

              {/* Content Body - Clean white space, refined typography */}
              <div className="flex flex-col flex-1 p-5 relative z-10 bg-gradient-to-b from-[#0F1423] to-[#0B0F19]">
                <h3 className="text-gray-100 font-semibold text-lg leading-tight mb-1.5 line-clamp-1 group-hover:text-blue-400 transition-colors duration-300">
                  {tournament.title}
                </h3>
                <p className="text-zinc-400 text-sm mb-5 line-clamp-2 leading-relaxed">{tournament.desc}</p>
                
                <div className="mt-auto">
                  {/* Prize Section - Elegant and breathable */}
                  <div className="mb-4">
                    <div className="text-[10px] font-medium text-zinc-500 mb-0.5 uppercase tracking-widest">Ödül Havuzu</div>
                    <div className="text-blue-400 font-bold text-2xl tracking-tight">
                      {tournament.prize}
                    </div>
                  </div>
                  
                  {/* Footer Stats */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                      {tournament.status === 'active' && <Timer className="w-3.5 h-3.5 text-emerald-500" />}
                      {tournament.status === 'upcoming' && <Calendar className="w-3.5 h-3.5 text-amber-500" />}
                      {tournament.status === 'ended' && <Calendar className="w-3.5 h-3.5 text-zinc-600" />}
                      <span className="truncate max-w-[140px]">{tournament.timeInfo}</span>
                    </div>
                    
                    {tournament.participants !== undefined && (
                      <div className="flex items-center gap-1 text-xs font-medium text-zinc-300 bg-white/5 px-2 py-1 rounded-md border border-white/[0.02]">
                        <Users className="w-3 h-3 text-zinc-400" /> {tournament.participants}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
