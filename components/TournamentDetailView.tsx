import React, { useState } from 'react';
import { ArrowLeft, Info, ChevronDown, ChevronUp, User, Users, DollarSign, Calendar as CalendarIcon, X } from 'lucide-react';

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

interface TournamentDetailViewProps {
  tournament: Tournament;
  onBack: () => void;
}

const mockLeaderboard = [
  { rank: 1, name: 'cesurk', status: 'aktif 7 saat önce', points: 500, prize: '$97.83' },
  { rank: 2, name: 'ferman-34', status: 'Gates of Olympus Super Scatter oyununda oyna', points: 19 },
  { rank: 3, name: 'mediator#774398', status: 'aktif bir saat önce', points: 15 },
  { rank: 4, name: 'beybaba66', status: 'aktif 6 saat önce', points: 7 },
  { rank: 5, name: 'azat4141', status: 'aktif 16 saat önce', points: 6 },
  { rank: 6, name: 'salimzz', status: 'aktif 9 saat önce', points: 6 },
  { rank: 7, name: 'nilayykacar', status: 'aktif 6 saat önce', points: 6 },
  { rank: 8, name: 'hanifi61', status: 'aktif 10 saat önce', points: 5 },
];

const mockGames = [
  { id: 1, name: 'Gates of Olympus', provider: 'PRAGMATIC PLAY', image: '/images/slots/gates-of-olympus.webp' },
];

const mockDates = [
  '23.07.2026', '16.07.2026', '09.07.2026', '02.07.2026', '25.06.2026',
  '18.06.2026', '11.06.2026', '04.06.2026', '28.05.2026', '21.05.2026',
  '14.05.2026', '07.05.2026', '30.04.2026', '23.04.2026', '16.04.2026',
  '09.04.2026', '02.04.2026', '26.03.2026', '19.03.2026', '12.03.2026'
];

export default function TournamentDetailView({ tournament, onBack }: TournamentDetailViewProps) {
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 font-sans pb-32 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 group"
      >
        <div className="p-2 bg-white/5 rounded-full group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">Turnuvalara Dön</span>
      </button>

      {/* Hero Banner */}
      <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-6 bg-[#2B3544] flex border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E2633] via-[#1E2633]/80 to-transparent z-10" />
        
        <div className="relative z-20 w-1/2 p-6 md:p-10 flex flex-col justify-center h-full">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
            {tournament.title}
          </h1>
        </div>
        
        <div className="absolute top-0 right-0 w-3/4 h-full z-0">
           <img 
             src={tournament.image} 
             alt="Promo" 
             className="w-full h-full object-cover object-right-top opacity-90 mix-blend-screen"
           />
           <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#1E2633]/50 to-[#1E2633] pointer-events-none" />
        </div>
      </div>

      {/* Info Notice */}
      <div className="flex items-center gap-3 bg-[#1B2735] border border-blue-500/20 text-blue-400 p-4 rounded-xl mb-6 shadow-lg">
        <Info className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">Katılmıyorum</span>
      </div>

      {/* Prize and Countdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1B2735] p-5 rounded-xl border border-white/5 shadow-md">
          <div className="text-xs text-zinc-400 mb-2 font-medium">Ana ödül</div>
          <div className="bg-[#131C26] px-4 py-3 rounded-lg border border-white/5 text-2xl font-bold text-white shadow-inner">
            {tournament.prize}
          </div>
        </div>
        
        <div className="bg-[#1B2735] p-5 rounded-xl border border-white/5 shadow-md">
          <div className="text-xs text-zinc-400 mb-2 font-medium">Bitiş tarihi</div>
          <div className="flex items-center justify-between bg-[#131C26] px-4 py-3 rounded-lg border border-white/5 shadow-inner">
            <span className="text-2xl font-mono font-bold text-white tracking-wider">05</span>
            <span className="text-zinc-500 text-lg font-black">/</span>
            <span className="text-2xl font-mono font-bold text-white tracking-wider">19</span>
            <span className="text-zinc-500 text-lg font-black">:</span>
            <span className="text-2xl font-mono font-bold text-white tracking-wider">26</span>
            <span className="text-zinc-500 text-lg font-black">:</span>
            <span className="text-2xl font-mono font-bold text-white tracking-wider">46</span>
          </div>
        </div>
      </div>

      {/* Details List */}
      <div className="bg-[#1B2735] rounded-xl border border-white/5 mb-6 overflow-hidden shadow-md">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <DollarSign className="w-4 h-4 text-zinc-400" />
          <span className="text-sm text-zinc-300">Minimum Bahis: <strong className="text-white ml-1">$0,20</strong></span>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <Users className="w-4 h-4 text-zinc-400" />
          <span className="text-sm text-zinc-300">Oyuncular: <strong className="text-white ml-1">{tournament.participants || 276}</strong></span>
        </div>
      </div>

      {/* Mechanics Banner */}
      <div className="flex items-center gap-3 bg-[#1B2735] border border-white/5 text-zinc-300 p-4 rounded-xl mb-6 shadow-md">
        <div className="p-1.5 bg-white/5 rounded-md">
          <X className="w-4 h-4 text-zinc-400" />
        </div>
        <span className="text-sm">Kazanç çarpanı - kazanç çarpanınız ne kadar yüksek olursa o kadar çok puan kazanırsınız.</span>
      </div>

      {/* Rules Accordion */}
      <button 
        onClick={() => setRulesOpen(!rulesOpen)}
        className="w-full flex items-center justify-between bg-[#1B2735] hover:bg-[#202E3F] transition-colors border border-white/5 p-4 rounded-xl mb-8 shadow-md"
      >
        <span className="font-semibold text-white">Turnuva kuralları</span>
        {rulesOpen ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
      </button>

      {rulesOpen && (
        <div className="bg-[#1B2735] border border-white/5 p-6 rounded-xl mb-8 text-sm text-zinc-300 leading-relaxed shadow-inner">
          <p>Turnuva kuralları buraya gelecektir. Bu alanda turnuvanın işleyişi, puanlama sistemi ve diğer önemli detaylar yer alabilir.</p>
        </div>
      )}

      {/* Leaderboard */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Liderler Tablosu</h2>
        <div className="bg-[#1B2735] rounded-xl border border-white/5 overflow-hidden shadow-md">
          <div className="flex flex-col">
            {mockLeaderboard.map((user, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between px-5 py-3 ${idx !== mockLeaderboard.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-6 text-zinc-500 font-mono text-sm">{user.rank}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">{user.name}</div>
                    <div className="text-xs text-zinc-500">{user.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{user.points}</div>
                  {user.prize && <div className="text-xs text-emerald-400">{user.prize}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tournament Games */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          Turnuva oyunları
          <div className="flex items-center gap-1 ml-auto">
            <button className="w-6 h-6 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-4 h-4 text-zinc-400" />
            </button>
            <button className="w-6 h-6 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {mockGames.map(game => (
            <div key={game.id} className="min-w-[140px] md:min-w-[160px] bg-[#1B2735] rounded-xl overflow-hidden group cursor-pointer border border-white/5 hover:border-blue-500/30 transition-colors">
              <div className="aspect-[3/4] relative">
                <img src={game.image} alt={game.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <div className="text-xs text-zinc-500 mb-1">{game.provider}</div>
                <div className="text-sm font-medium text-white truncate">{game.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Rounds */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Önceki turlar</h2>
        <div className="flex flex-wrap gap-2">
          {mockDates.map((date, idx) => (
            <button 
              key={idx}
              className="px-4 py-2 bg-[#1B2735] hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 border border-white/5 rounded-lg text-xs font-medium text-zinc-400 transition-all"
            >
              {date}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

// Needed icons for Tournament Games section
function ChevronLeft(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
}
function ChevronRight(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
}
