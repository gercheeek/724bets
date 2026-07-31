import React, { useState } from 'react';
import { Trophy, Timer, Users, Swords, Calendar } from 'lucide-react';
import TournamentDetailView from './TournamentDetailView';

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
    timeInfo: '05g 20s 01d',
    participants: 273,
    image: '/images/promos/gates_of_olympus_promo_1785470699172.jpg',
  },
  {
    id: '2',
    title: 'Le Serisi Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$222,52',
    status: 'active',
    timeInfo: '05g 20s 01d',
    participants: 36,
    image: '/images/promos/sweet_bonanza_promo_1785470716975.jpg',
  },
  {
    id: '3',
    title: 'HAFTASONU ÇARPAN TURNUVASI 5.000 EURO',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$5.754,71',
    status: 'upcoming',
    timeInfo: '17s 01d',
    participants: 142,
    image: '/images/promos/weekend_multiplier_promo_1785470757275.jpg',
  },
  {
    id: '4',
    title: 'Hacksaw Turnuvası',
    desc: 'Bahislerin toplamına göre puanlar,...',
    prize: '$644,79',
    status: 'upcoming',
    timeInfo: '17s 32d',
    participants: 89,
    image: '/images/promos/hacksaw_promo_1785470736175.jpg',
  },
  {
    id: '5',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$97,83',
    status: 'upcoming',
    timeInfo: '06g 03s 02d',
    participants: 412,
    image: '/images/promos/gates_of_olympus_promo_1785470699172.jpg',
  },
  {
    id: '6',
    title: 'Le Serisi Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$222,52',
    status: 'upcoming',
    timeInfo: '06g 05s 32d',
    participants: 67,
    image: '/images/promos/sweet_bonanza_promo_1785470716975.jpg',
  },
  {
    id: '7',
    title: 'HAFTASONU ÇARPAN TURNUVASI 5.000 EURO',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$5.687,98',
    status: 'ended',
    timeInfo: '2026.07.26',
    participants: 843,
    image: '/images/promos/weekend_multiplier_promo_1785470757275.jpg',
  },
  {
    id: '8',
    title: 'Hacksaw Turnuvası',
    desc: 'Bahislerin toplamına göre puanlar,...',
    prize: '$642,51',
    status: 'ended',
    timeInfo: '2026.07.30',
    participants: 512,
    image: '/images/promos/hacksaw_promo_1785470736175.jpg',
  },
  {
    id: '9',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$96,81',
    status: 'ended',
    timeInfo: '2026.07.29',
    participants: 310,
    image: '/images/promos/gates_of_olympus_promo_1785470699172.jpg',
  }
];

export default function PromoView() {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  if (selectedTournament) {
    return <TournamentDetailView tournament={selectedTournament} onBack={() => setSelectedTournament(null)} />;
  }

  return (
    <div className="flex-1 w-full min-h-screen bg-[#06080D] text-white p-4 md:p-6 lg:p-8 font-sans pb-32 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] bg-[#00E5FF]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Advanced Top Header */}
        <div className="mb-10 relative">
          {/* Subtle background glow for the header area */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                {/* Premium Icon Container */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1A1F2E] to-[#0B0F19] border border-amber-500/30 flex items-center justify-center relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    <Trophy className="w-7 h-7 text-transparent fill-amber-400 stroke-amber-500 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] relative z-10" strokeWidth={1.5} />
                  </div>
                </div>
                
                {/* Advanced Typography */}
                <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400 tracking-tight leading-none drop-shadow-lg">
                  Turnuvalar
                </h1>
              </div>
              
              <p className="text-[#8b929b] text-base md:text-lg font-medium max-w-2xl leading-relaxed pl-1 sm:pl-[72px]">
                Büyük ödül havuzlu premium turnuvalara katıl, skor tablosunda zirveye oyna ve efsanevi ödülleri kazan!
              </p>
            </div>

            {/* Live Status Badge */}
            <div className="flex items-center gap-3 bg-[#0B0F19]/80 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl shadow-lg shrink-0 w-fit">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              </div>
              <span className="text-sm font-bold text-white tracking-wide">3 Aktif Turnuva</span>
            </div>
          </div>
          
          {/* Decorative Divider */}
          <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mt-8" />
        </div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tournaments.map((tournament) => (
            <div 
              key={tournament.id}
              onClick={() => setSelectedTournament(tournament)}
              className={`flex flex-col bg-[#0B0F19] rounded-2xl relative overflow-hidden group shadow-lg border border-white/5 hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] transition-all duration-500 cursor-pointer ${tournament.status === 'ended' ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}
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
                   <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-black/70 backdrop-blur-md text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/30 shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center gap-1.5 uppercase tracking-wider">
                     <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_5px_#34d399]" />
                     Aktif
                   </div>
                 )}
                 {tournament.status === 'upcoming' && (
                   <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-bold rounded-lg border border-amber-500/30 shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center gap-1.5 uppercase tracking-wider">
                     Yakında
                   </div>
                 )}
              </div>

              {/* Content Body - Clean white space, refined typography */}
              <div className="flex flex-col flex-1 p-6 relative z-10 bg-gradient-to-b from-[#0F1423] to-[#0B0F19]">
                <h3 className="text-gray-100 font-bold text-[1.05rem] leading-snug mb-2 line-clamp-3 group-hover:text-blue-400 transition-colors duration-300">
                  {tournament.title}
                </h3>
                <p className="text-zinc-400 text-sm mb-6 line-clamp-3 leading-relaxed">{tournament.desc}</p>
                
                <div className="mt-auto">
                  {/* Prize Section - Giant glowing text */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                      <div className="text-[10px] font-bold text-blue-400/90 uppercase tracking-[0.2em]">Ödül Havuzu</div>
                    </div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 font-black text-3xl sm:text-4xl tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                      {tournament.prize}
                    </div>
                  </div>
                  
                  {/* Footer Stats - Prominent countdowns */}
                  <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-2 text-sm font-bold whitespace-nowrap">
                      {tournament.status === 'active' && (
                        <>
                          <Timer className="w-4 h-4 text-emerald-400" />
                          <span className="font-mono text-emerald-400 tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">{tournament.timeInfo}</span>
                        </>
                      )}
                      {tournament.status === 'upcoming' && (
                        <>
                          <Calendar className="w-4 h-4 text-amber-400" />
                          <span className="font-mono text-amber-400 tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">{tournament.timeInfo}</span>
                        </>
                      )}
                      {tournament.status === 'ended' && (
                        <>
                          <Calendar className="w-4 h-4 text-zinc-500" />
                          <span className="font-mono text-zinc-400 tracking-wider bg-white/5 px-2.5 py-1 rounded-md border border-white/10">{tournament.timeInfo}</span>
                        </>
                      )}
                    </div>
                    
                    {tournament.participants !== undefined && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 bg-white/5 px-2.5 py-1.5 rounded-md border border-white/10 whitespace-nowrap hover:bg-white/10 transition-colors">
                        <Users className="w-3.5 h-3.5 text-zinc-400" /> {tournament.participants}
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
