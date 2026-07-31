import React, { useState, useEffect } from 'react';
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

const MOCK_NAMES = ["Al***92", "Kral***", "ProGamer", "Dark***X", "X-Bet", "Lucky***", "Can***11", "VegasKing"];

const TournamentCard = ({ tournament, onClick }: { tournament: Tournament, onClick: () => void }) => {
  // Mock live leaderboard state
  const [leaderboard, setLeaderboard] = useState(() =>
    Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      score: Math.floor(Math.random() * 10000) + 10000 - (i * 2000),
    }))
  );

  // Live simulation effect
  useEffect(() => {
    if (tournament.status !== 'active') return;
    
    // Randomize update interval between 3 to 6 seconds for varied, organic feel
    const interval = setInterval(() => {
      setLeaderboard(prev => {
        const newScores = prev.map(p => ({
          ...p,
          score: p.score + Math.floor(Math.random() * 500)
        })).sort((a, b) => b.score - a.score);
        return newScores;
      });
    }, 3000 + Math.random() * 3000);
    
    return () => clearInterval(interval);
  }, [tournament.status]);

  return (
    <div 
      onClick={onClick}
      className={`flex flex-col bg-[#0B0F19] rounded-2xl relative overflow-hidden group shadow-lg border border-white/5 hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] transition-all duration-500 cursor-pointer ${tournament.status === 'ended' ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}
    >
      {/* Image Header */}
      <div className="w-full h-40 relative overflow-hidden shrink-0">
        <img 
          src={tournament.image} 
          alt={tournament.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-5 relative z-10 bg-gradient-to-b from-[#0F1423] to-[#0B0F19]">
        <h3 className="text-gray-100 font-bold text-[1.05rem] leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
          {tournament.title}
        </h3>
        <p className="text-zinc-400 text-[13px] mb-4 line-clamp-2 leading-relaxed">{tournament.desc}</p>
        
        {/* Prize Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            <div className="text-[10px] font-bold text-blue-400/90 uppercase tracking-[0.2em]">Ödül Havuzu</div>
          </div>
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 font-black text-3xl tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            {tournament.prize}
          </div>
        </div>
        
        {/* Unified Status & Time Bar */}
        {tournament.status !== 'ended' && (
          <div className={`mt-auto mb-4 py-2 px-3 rounded-lg border flex items-center justify-between text-[11px] sm:text-xs font-bold ${
            tournament.status === 'active'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          }`}>
            <div className="flex items-center gap-1.5 shrink-0">
              {tournament.status === 'active' ? (
                 <><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_#34d399]" /> 🔥 ŞU AN AKTİF</>
              ) : (
                 <><span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_5px_#fbbf24]" /> ⏳ BAŞLIYOR</>
              )}
            </div>
            <span className="font-mono bg-black/20 px-2 py-0.5 rounded border border-white/5 whitespace-nowrap overflow-hidden text-ellipsis ml-2">Süre: {tournament.timeInfo}</span>
          </div>
        )}

        {tournament.status === 'ended' && (
          <div className="mt-auto mb-4 py-2 px-3 rounded-lg border border-white/5 bg-white/5 flex items-center justify-between text-[11px] font-bold text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> SONA ERDİ
            </div>
            <span className="font-mono">{tournament.timeInfo}</span>
          </div>
        )}

        {/* Mini Live Leaderboard */}
        {tournament.status !== 'ended' && (
          <div className="pt-3 border-t border-white/5 space-y-1.5">
            <div className="text-[9px] text-zinc-500 font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Trophy className="w-3 h-3 text-amber-500/70" /> Canlı Liderlik
            </div>
            {leaderboard.map((player, idx) => (
              <div key={player.id} className="flex items-center justify-between bg-black/20 rounded px-2.5 py-1 transition-all duration-300">
                 <div className="flex items-center gap-2">
                   <span className={`text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-amber-500/20 text-amber-500' : idx === 1 ? 'bg-zinc-300/20 text-zinc-300' : 'bg-orange-500/20 text-orange-500'}`}>{idx + 1}</span>
                   <span className="text-[11px] text-zinc-300 font-medium">{player.name}</span>
                 </div>
                 <span className="text-[11px] font-mono text-emerald-400/90">{player.score.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Ended Footer (Participants only) */}
        {tournament.status === 'ended' && tournament.participants !== undefined && (
          <div className="pt-3 border-t border-white/5 flex items-center justify-end">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 bg-black/20 px-2 py-1 rounded border border-white/5">
              <Users className="w-3 h-3" /> {tournament.participants} Katılımcı
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
            <TournamentCard 
              key={tournament.id} 
              tournament={tournament} 
              onClick={() => setSelectedTournament(tournament)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
