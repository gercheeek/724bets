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
      className={`flex flex-col bg-[#0c0c0c] rounded-[20px] relative overflow-hidden group shadow-2xl ring-1 ring-white/5 hover:ring-white/10 hover:-translate-y-1 hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,1)] transition-all duration-500 cursor-pointer ${tournament.status === 'ended' ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}
    >
      {/* Inner highlight for premium feel */}
      <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] pointer-events-none z-20" />

      {/* Image Header */}
      <div className="w-full h-[180px] relative overflow-hidden shrink-0">
        <img 
          src={tournament.image} 
          alt={tournament.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Smooth gradient fade into the card body */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0c0c0c] to-transparent pointer-events-none" />
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 px-5 pb-5 pt-1 relative z-10 bg-[#0c0c0c]">
        <h3 className="text-gray-100 font-semibold text-[1.1rem] leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors duration-300">
          {tournament.title}
        </h3>
        <p className="text-zinc-500 text-[13px] mb-5 line-clamp-2 leading-relaxed">{tournament.desc}</p>
        
        {/* Prize Section */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ödül Havuzu</div>
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 font-black text-3xl tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            {tournament.prize}
          </div>
        </div>
        


        {/* Mini Live Leaderboard */}
        {tournament.status !== 'ended' && (
          <div className="pt-3 mt-1 border-t border-white/5 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Canlı Liderlik
            </div>
            {leaderboard.map((player, idx) => (
              <div key={player.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.04] rounded-md px-3 py-2 transition-colors duration-300 gap-3">
                 <div className="flex items-center gap-2.5 min-w-0 flex-1">
                   <span className={`shrink-0 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm ${
                     idx === 0 ? 'bg-amber-500/20 text-amber-500 ring-1 ring-amber-500/30' : 
                     idx === 1 ? 'bg-zinc-300/20 text-zinc-300 ring-1 ring-zinc-300/30' : 
                     'bg-orange-900/40 text-orange-400 ring-1 ring-orange-500/30'
                   }`}>{idx + 1}</span>
                   <span className="text-[11.5px] text-zinc-200 font-semibold truncate">{player.name}</span>
                 </div>
                 <div className="text-[11px] font-mono font-bold text-emerald-400/90 whitespace-nowrap shrink-0 flex items-baseline gap-1">
                   <span>{player.score.toLocaleString()}</span>
                   <span className="text-[9px] text-emerald-500/70 uppercase tracking-wider font-sans">pts</span>
                 </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Ended Footer (Participants only) */}
        {tournament.status === 'ended' && tournament.participants !== undefined && (
          <div className="pt-4 border-t border-white/5 flex items-center justify-end">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 bg-black/20 px-2.5 py-1.5 rounded-md">
              <Users className="w-3.5 h-3.5" /> {tournament.participants} Katılımcı
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
        {/* Advanced Top Header (VIP / Affiliate Style) */}
        <div className="mb-6 relative flex flex-col items-center justify-center text-center py-6">
          {/* Subtle background glow for the header area */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
            {/* Minimalist Top Badge */}
            <div className="flex items-center gap-2 mb-4 opacity-90">
              <Trophy className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="text-[#00E5FF] text-[10px] font-bold tracking-[0.2em] uppercase">
                Milyonluk Turnuvalar
              </span>
            </div>
            
            {/* Aggressive Guest Typography - Shrunk down */}
            <h1 className="text-[20px] md:text-[28px] font-bold leading-snug tracking-tight text-white mb-3">
              Toplam <span className="text-emerald-400">25.000.000₺</span> Nakit Ödül! <br/>
              <span className="text-[#00E5FF]">ŞİMDİ PAYINI AL</span>
            </h1>
            
            <p className="text-zinc-400 text-xs md:text-sm font-medium leading-relaxed max-w-[500px] mt-2 mb-5">
              Her gün binlerce kullanıcı dev nakit ödüller ve bedava dönüşler kazanıyor. Hayatını değiştirecek o büyük ödülü sadece tek bir spinde sen kazan! Hemen üye ol, sınırsız nakit yağmuruna katıl.
            </p>

            {/* Minimalist Status Indicator */}
            <div className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-sm border border-white/5 px-4 py-1.5 rounded-full mt-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </div>
              <span className="text-[11px] font-medium text-white/90 tracking-wide">
                <span className="text-[#10B981] font-bold">3 Aktif</span> Turnuva Sizi Bekliyor
              </span>
            </div>
          </div>
          
          {/* Decorative Divider */}
          <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-8" />
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
