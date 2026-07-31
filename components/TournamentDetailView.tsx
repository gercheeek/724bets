import React, { useState } from 'react';
import { ArrowLeft, Info, ChevronDown, ChevronUp, User, Users, DollarSign, Calendar as CalendarIcon, X, Trophy, Timer, Sparkles, Medal } from 'lucide-react';

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
  { id: 2, name: 'Sweet Bonanza', provider: 'PRAGMATIC PLAY', image: '/images/slots/sweet-bonanza.webp' },
  { id: 3, name: 'Starlight Princess', provider: 'PRAGMATIC PLAY', image: '/images/slots/starlight.webp' },
];

const mockDates = [
  '23.07.2026', '16.07.2026', '09.07.2026', '02.07.2026', '25.06.2026',
  '18.06.2026', '11.06.2026', '04.06.2026', '28.05.2026', '21.05.2026'
];

export default function TournamentDetailView({ tournament, onBack }: TournamentDetailViewProps) {
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 font-sans pb-32 animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* Premium Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-3 text-zinc-400 hover:text-white transition-all duration-300 mb-8 group w-fit"
      >
        <div className="p-2.5 bg-[#0B0F19] rounded-xl border border-white/5 group-hover:border-blue-500/50 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <ArrowLeft className="w-4 h-4 relative z-10" />
        </div>
        <span className="text-sm font-semibold tracking-wide uppercase">Turnuvalara Dön</span>
      </button>

      {/* Hero Banner - Ultra Premium */}
      <div className="relative w-full h-[220px] md:h-[240px] rounded-[1.5rem] overflow-hidden mb-8 bg-[#06080D] flex border border-white/10 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)] group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent z-10 opacity-60" />
        
        {/* Glow Effects */}
        <div className="absolute -left-32 -top-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] z-20 pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] z-20 pointer-events-none" />

        <div className="relative z-30 w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-center h-full">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-blue-400 font-bold tracking-[0.25em] uppercase text-[10px]">Özel Turnuva</span>
          </div>
          <h1 className="text-3xl md:text-[2.75rem] font-black text-white leading-[1.1] drop-shadow-md mb-3 tracking-tight">
            {tournament.title}
          </h1>
          <p className="text-zinc-400 text-[13px] md:text-sm max-w-lg leading-relaxed line-clamp-2">
            {tournament.desc} En iyi oyunlarda yarışın, liderlik tablosuna tırmanın ve devasa ödül havuzundan payınızı alın.
          </p>
        </div>
        
        <div className="absolute top-0 right-0 w-full md:w-2/3 h-full z-0 overflow-hidden">
           <img 
             src={tournament.image} 
             alt="Promo" 
             className="w-full h-full object-cover object-right-top opacity-80 mix-blend-screen group-hover:scale-105 transition-transform duration-1000"
           />
           <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0B0F19]/60 to-[#0B0F19] pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Prize */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Status Badge */}
          <div className="flex items-center justify-between bg-[#0B0F19]/80 backdrop-blur-md border border-red-500/20 p-3.5 rounded-xl shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-1.5 bg-red-500/10 rounded-md">
                <Info className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-[13px] font-semibold text-red-400 tracking-wide">Şu an katılmıyorsunuz</span>
            </div>
          </div>

          {/* Prize Box - Compact */}
          <div className="bg-[#0B0F19]/80 backdrop-blur-md p-5 rounded-2xl border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] relative overflow-hidden group hover:border-blue-500/40 transition-colors">
            <div className="absolute -right-10 -top-10 w-24 h-24 bg-blue-500/20 rounded-full blur-[30px] pointer-events-none" />
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]" />
              <div className="text-[10px] font-bold text-blue-400/80 uppercase tracking-[0.15em]">Ana Ödül Havuzu</div>
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-200 to-blue-500 font-black text-3xl md:text-4xl tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.4)] relative z-10">
              {tournament.prize}
            </div>
          </div>
          
          {/* Countdown Box - Compact */}
          <div className="bg-[#0B0F19]/80 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Timer className="w-4 h-4 text-emerald-400" />
              <div className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-[0.15em]">Kalan Süre</div>
            </div>
            
            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#131B2B] rounded-lg border border-white/10 flex items-center justify-center text-xl font-mono font-bold text-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">05</div>
                <span className="text-[9px] text-zinc-500 mt-1.5 font-bold uppercase tracking-wider">Gün</span>
              </div>
              <span className="text-xl font-black text-zinc-600 mb-5">:</span>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#131B2B] rounded-lg border border-white/10 flex items-center justify-center text-xl font-mono font-bold text-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">19</div>
                <span className="text-[9px] text-zinc-500 mt-1.5 font-bold uppercase tracking-wider">Saat</span>
              </div>
              <span className="text-xl font-black text-zinc-600 mb-5">:</span>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#131B2B] rounded-lg border border-white/10 flex items-center justify-center text-xl font-mono font-bold text-emerald-400 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">26</div>
                <span className="text-[9px] text-zinc-500 mt-1.5 font-bold uppercase tracking-wider">Dakika</span>
              </div>
            </div>
          </div>

          {/* Quick Info Grid - Compact */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0B0F19]/80 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-1.5">
                <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Min Bahis</span>
              </div>
              <div className="text-base font-bold text-white">$0,20</div>
            </div>
            <div className="bg-[#0B0F19]/80 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Katılımcı</span>
              </div>
              <div className="text-base font-bold text-white">{tournament.participants || 276}</div>
            </div>
          </div>

          {/* Mechanics Banner - Compact */}
          <div className="flex items-start gap-3 bg-[#0B0F19] border border-amber-500/20 text-zinc-300 p-4 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-amber-500/5" />
            <div className="p-1.5 bg-amber-500/10 rounded-md relative z-10 shrink-0">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-[13px] leading-snug relative z-10">
              <strong className="text-amber-400 block mb-0.5 text-sm">Kazanç Çarpanı Sistemi</strong>
              Kazanç çarpanınız ne kadar yüksek olursa o kadar çok puan kazanırsınız. Liderliğe giden yol yüksek oranlardan geçiyor.
            </p>
          </div>
        </div>

        {/* Right Column: Leaderboard & Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Leaderboard */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Medal className="w-5 h-5 text-blue-400" />
                Liderler Tablosu
              </h2>
            </div>
            
            <div className="bg-[#0B0F19]/80 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
              <div className="flex flex-col">
                {mockLeaderboard.map((user, idx) => {
                  const isTop3 = idx < 3;
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between px-5 py-3 ${idx !== mockLeaderboard.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors relative group`}
                    >
                      {/* Rank Highlight Background for Top 3 */}
                      {idx === 0 && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
                      {idx === 1 && <div className="absolute inset-0 bg-gradient-to-r from-zinc-300/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
                      {idx === 2 && <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}

                      <div className="flex items-center gap-4 relative z-10">
                        {/* Rank Badge */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                          idx === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)]' :
                          idx === 1 ? 'bg-zinc-300/20 text-zinc-300 border border-zinc-300/30' :
                          idx === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          'bg-[#131B2B] text-zinc-500 border border-white/5'
                        }`}>
                          {user.rank}
                        </div>
                        
                        <div>
                          <div className={`text-sm font-bold ${isTop3 ? 'text-white' : 'text-zinc-300'}`}>{user.name}</div>
                          <div className="text-[11px] font-medium text-zinc-500 mt-0.5">{user.status}</div>
                        </div>
                      </div>
                      
                      <div className="text-right relative z-10">
                        <div className="text-lg font-black text-white">{user.points} <span className="text-xs text-zinc-500 font-medium">puan</span></div>
                        {user.prize && <div className="text-sm font-bold text-emerald-400 mt-0.5 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">{user.prize}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tournament Games & Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rules Accordion */}
            <div className="bg-[#0B0F19]/80 backdrop-blur-md border border-white/5 p-1 rounded-2xl">
              <button 
                onClick={() => setRulesOpen(!rulesOpen)}
                className="w-full flex items-center justify-between bg-transparent hover:bg-white/5 transition-colors p-4 rounded-xl"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg">
                    <Info className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="font-bold text-white text-base">Turnuva Kuralları</span>
                </div>
                {rulesOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>

              {rulesOpen && (
                <div className="p-6 pt-2 text-sm text-zinc-400 leading-relaxed font-medium">
                  <p className="mb-3">1. Turnuvaya katılmak için belirtilen minimum bahis tutarında oynamanız gerekmektedir.</p>
                  <p className="mb-3">2. Puanlar, kazanç çarpanınıza göre hesaplanır. Ne kadar yüksek çarpan, o kadar yüksek puan.</p>
                  <p>3. Nakit ödüller turnuva bitiminden hemen sonra hesaplara otomatik olarak yatırılacaktır.</p>
                </div>
              )}
            </div>

            {/* Previous Rounds */}
            <div className="bg-[#0B0F19]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <CalendarIcon className="w-5 h-5 text-zinc-400" />
                 Önceki Turlar
               </h3>
               <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 scrollbar-hide">
                 {mockDates.map((date, idx) => (
                   <button 
                     key={idx}
                     className="px-3 py-1.5 bg-[#131B2B] hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 border border-white/5 rounded-lg text-xs font-semibold text-zinc-400 transition-all"
                   >
                     {date}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          {/* Tournament Games Gallery */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Turnuva Oyunları</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mockGames.map(game => (
                <div key={game.id} className="bg-[#0B0F19] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-blue-500/50 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.4)] transition-all duration-300">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-80" />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                       <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_20px_#3b82f6]">
                          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                       </div>
                    </div>
                  </div>
                  <div className="p-4 relative z-10 bg-[#0B0F19]">
                    <div className="text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wider">{game.provider}</div>
                    <div className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">{game.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
