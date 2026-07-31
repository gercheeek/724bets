import React, { useState } from 'react';
import { ArrowLeft, Info, ChevronDown, ChevronUp, User, Users, DollarSign, Calendar as CalendarIcon, X, Trophy, Timer, Sparkles, Medal, Play } from 'lucide-react';

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

const pragmaticGames = [
  { id: 1, name: 'Gates of Olympus', provider: 'PRAGMATIC PLAY', image: '/images/slots/gates-of-olympus.webp' },
  { id: 2, name: 'Sweet Bonanza', provider: 'PRAGMATIC PLAY', image: '/images/slots/sweet-bonanza.webp' },
  { id: 3, name: 'Starlight Princess', provider: 'PRAGMATIC PLAY', image: '/images/slots/starlight.webp' },
];

const hacksawGames = [
  { id: 4, name: 'Wanted Dead or a Wild', provider: 'HACKSAW GAMING', image: '/images/slots/wanted-dead-or-a-wild.webp' },
  { id: 5, name: 'RIP City', provider: 'HACKSAW GAMING', image: '/images/slots/rip-city.webp' },
  { id: 6, name: 'Hand of Anubis', provider: 'HACKSAW GAMING', image: '/images/slots/hand-of-anubis.webp' },
];

const leSeriesGames = [
  { id: 7, name: 'Le Bandit', provider: 'HACKSAW GAMING', image: '/images/slots/le-bandit.webp' },
  { id: 8, name: 'Le Pharaoh', provider: 'HACKSAW GAMING', image: '/images/slots/le-pharaoh.webp' },
];

const mockDates = [
  '23.07.2026', '16.07.2026', '09.07.2026', '02.07.2026', '25.06.2026',
  '18.06.2026', '11.06.2026', '04.06.2026', '28.05.2026', '21.05.2026'
];

export default function TournamentDetailView({ tournament, onBack }: TournamentDetailViewProps) {
  const [rulesOpen, setRulesOpen] = useState(false);

  let displayGames = pragmaticGames;
  if (tournament.title.includes('Le Serisi')) displayGames = leSeriesGames;
  else if (tournament.title.includes('Hacksaw')) displayGames = hacksawGames;


  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 font-sans pb-32 animate-in fade-in slide-in-from-bottom-8 duration-500 relative">
      
      {/* Premium Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-3 text-zinc-400 hover:text-white transition-all duration-300 mb-6 md:mb-8 group w-fit relative z-30"
      >
        <div className="p-2.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/5 group-hover:border-[#00E5FF]/40 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all relative overflow-hidden">
          <div className="absolute inset-0 bg-[#00E5FF]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <ArrowLeft className="w-4 h-4 relative z-10" />
        </div>
        <span className="text-[11px] font-bold tracking-widest uppercase">Turnuvalara Dön</span>
      </button>

      {/* Immersive Hero Banner */}
      <div className="relative w-full h-[220px] md:h-[320px] rounded-2xl md:rounded-[24px] overflow-hidden bg-black flex flex-col justify-end border border-white/5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] group">
        <img 
          src={tournament.image} 
          alt="Promo" 
          className="absolute inset-0 w-full h-full object-cover object-top opacity-70 group-hover:scale-105 transition-transform duration-[10000ms] ease-out"
        />
        {/* Gradients to blend image seamlessly */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080D] via-[#06080D]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080D]/90 via-[#06080D]/20 to-transparent" />
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 mix-blend-screen bg-gradient-to-br from-transparent to-black pointer-events-none" />

        {/* Status Badge floating at top left */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl border border-white/10 ${tournament.status === 'upcoming' ? 'bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'bg-[#00E5FF]/10 shadow-[0_0_20px_rgba(0,229,255,0.2)]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tournament.status === 'upcoming' ? 'bg-yellow-400' : 'bg-[#00E5FF] animate-pulse'}`} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${tournament.status === 'upcoming' ? 'text-yellow-400' : 'text-[#00E5FF]'}`}>
              {tournament.status === 'upcoming' ? 'Yaklaşan Turnuva' : 'Aktif Turnuva'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 p-5 md:p-8 md:pb-10 w-full md:max-w-3xl transform transition-transform duration-1000">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-2xl leading-[1.1]">
            {tournament.title}
          </h1>
          <p className="mt-3 md:mt-4 text-zinc-300 text-[11px] md:text-sm font-medium max-w-xl opacity-90 drop-shadow line-clamp-2 md:line-clamp-none">
            {tournament.desc || 'Devasa ödül havuzunda yerini al, oyunlarda çarpanları yakala ve liderlik tablosuna adını yazdır!'}
          </p>
        </div>
      </div>

      <div className="w-full space-y-4 md:space-y-6 mt-4 md:mt-6">
        
        {/* Premium Stat Cards */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Prize Card */}
          <div className="flex-1 bg-[#0a0a0a]/80 backdrop-blur-xl rounded-[20px] border border-white/10 p-6 md:p-8 flex flex-col justify-center relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-colors duration-500" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px]" />
            
            <div className="text-[10px] md:text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1 md:mb-2 relative z-10 flex items-center gap-2">
              Ana Ödül Havuzu
            </div>
            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 drop-shadow-sm relative z-10 tracking-tighter">
              {tournament.prize}
            </div>
          </div>

          {/* Countdown Card */}
          <div className="flex-1 bg-[#0a0a0a]/80 backdrop-blur-xl rounded-[20px] border border-white/10 p-6 md:p-8 flex flex-col justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="text-[10px] md:text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3 md:mb-4 relative z-10">
              {tournament.status === 'upcoming' ? 'Başlamasına Kalan Süre' : 'Bitiş Tarihi'}
            </div>
            
            {/* Premium Pill Timer Look-alike */}
            <div className="flex items-center gap-2 md:gap-3 p-1 md:p-1.5 pr-4 md:pr-6 rounded-full bg-black/60 border border-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)] w-fit relative z-10">
              <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ${tournament.status === 'upcoming' ? 'bg-[#FF9F1C]/20 shadow-[0_0_15px_rgba(255,159,28,0.4)]' : 'bg-[#00E5FF]/20 shadow-[0_0_15px_rgba(0,229,255,0.4)]'}`}>
                <Timer className={`w-4 h-4 md:w-5 md:h-5 ${tournament.status === 'upcoming' ? 'text-[#FF9F1C]' : 'text-[#00E5FF]'}`} />
              </div>
              <div className="flex gap-2 md:gap-3">
                 {[
                   {val: '00', lbl: 'G'},
                   {val: '15', lbl: 'S'},
                   {val: '47', lbl: 'D'},
                   {val: '10', lbl: 'S'}
                 ].map((p, i) => (
                    <div key={i} className="flex items-baseline gap-[1px]">
                       <span className="font-mono font-black text-white/95 text-[15px] md:text-[18px] tracking-tight">{p.val}</span>
                       <span className={`font-bold text-[8px] md:text-[9px] uppercase tracking-wider ${tournament.status === 'upcoming' ? 'text-[#FF9F1C]' : 'text-[#00E5FF]'} opacity-90 ml-0.5`}>{p.lbl}</span>
                    </div>
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* Elegance Mechanics Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-[#0a0a0a]/60 backdrop-blur-md rounded-[16px] border border-white/5 p-4 flex items-center gap-4 hover:border-white/10 hover:bg-white/[0.02] transition-colors shadow-lg group">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-shadow">
               <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Minimum Bahis</div>
              <div className="text-[13px] font-black text-white tracking-tight">$0,20</div>
            </div>
          </div>
          
          <div className="bg-[#0a0a0a]/60 backdrop-blur-md rounded-[16px] border border-white/5 p-4 flex items-center gap-4 hover:border-white/10 hover:bg-white/[0.02] transition-colors shadow-lg group">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-shadow">
               <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Aktif Oyuncular</div>
              <div className="text-[13px] font-black text-white tracking-tight">{tournament.participants || 276} Kişi</div>
            </div>
          </div>
          
          <div className="bg-[#0a0a0a]/60 backdrop-blur-md rounded-[16px] border border-white/5 p-4 flex items-center gap-4 hover:border-white/10 hover:bg-white/[0.02] transition-colors shadow-lg group">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-shadow">
               <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Puan Sistemi</div>
              <div className="text-[11px] font-semibold text-zinc-300 leading-tight">Yüksek Çarpan = Yüksek Puan</div>
            </div>
          </div>
        </div>

        {/* Premium Leaderboard */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-black text-white uppercase tracking-wider flex items-center gap-2 drop-shadow-sm">
              <Trophy className="w-4 h-4 text-amber-500" /> Liderler Tablosu
            </h2>
          </div>
          
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl rounded-[20px] border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex flex-col">
              {mockLeaderboard.map((user, idx) => {
                const isFirst = idx === 0;
                const isSecond = idx === 1;
                const isThird = idx === 2;
                
                let rankColor = 'text-zinc-400 bg-white/5 border border-white/5';
                if (isFirst) rankColor = 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.3)]';
                if (isSecond) rankColor = 'text-slate-300 bg-slate-300/10 border border-slate-300/30 shadow-[0_0_15px_rgba(203,213,225,0.2)]';
                if (isThird) rankColor = 'text-orange-400 bg-orange-500/10 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]';

                return (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between px-5 md:px-6 py-4 md:py-5 ${idx !== mockLeaderboard.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.03] transition-colors group relative overflow-hidden`}
                  >
                    <div className="absolute left-0 top-0 w-0.5 h-full bg-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-[11px] md:text-[13px] ${rankColor}`}>
                        {user.rank}
                      </div>
                      <div>
                        <div className={`text-[13px] md:text-[15px] font-bold ${isFirst ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'text-zinc-100'}`}>{user.name}</div>
                        <div className="text-[10px] md:text-[11px] text-zinc-500 mt-0.5 md:mt-1 font-medium truncate max-w-[200px] md:max-w-md">{user.status}</div>
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col items-end justify-center">
                      <div className="text-[14px] md:text-[16px] font-mono font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">
                        {user.points.toLocaleString()} <span className="text-[8px] md:text-[9px] text-emerald-500/60 uppercase tracking-widest ml-0.5">PTS</span>
                      </div>
                      {user.prize && <div className="text-[11px] md:text-[12px] font-black text-white mt-1 bg-white/10 px-2 rounded backdrop-blur-sm border border-white/10">{user.prize}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Premium Accordion Rules */}
        <div className="mt-8 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-[20px] shadow-2xl overflow-hidden">
          <button 
            onClick={() => setRulesOpen(!rulesOpen)}
            className="w-full flex items-center justify-between bg-transparent hover:bg-white/5 transition-colors p-5 md:p-6 group"
          >
            <span className="font-bold text-white text-[13px] md:text-[15px] tracking-wide uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] group-hover:shadow-[0_0_8px_rgba(0,229,255,0.8)] transition-shadow"></div>
              Turnuva Kuralları ve Puanlama
            </span>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
              {rulesOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
            </div>
          </button>

          {rulesOpen && (
            <div className="p-5 md:p-6 pt-2 text-[12px] md:text-[13px] text-zinc-300 leading-relaxed font-medium border-t border-white/5 bg-black/40">
              {/* Using generic styled rules for all to keep the UI premium and consistent */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00E5FF]" /> Puan Kazanımı
                  </h4>
                  <p className="text-zinc-400 mb-3">Seçili oyunlarda kazandığınız çarpanlar size puan olarak geri döner. Çarpan yakalamayı başardığınızda liderlik tablosunda tırmanırsınız.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[{m:'x50', p:'1'}, {m:'x100', p:'2'}, {m:'x500', p:'10'}, {m:'x1000', p:'500'}].map(item => (
                      <div key={item.m} className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:border-[#00E5FF]/30 transition-colors">
                        <span className="text-[#00E5FF] font-black text-lg">{item.m}</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.p} Puan</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-400" /> Şartlar
                  </h4>
                  <ul className="space-y-2 text-zinc-400">
                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/30" /> Minimum katılım bahsi <strong className="text-white">$0.20</strong> değerindedir.</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/30" /> Yalnızca "Turnuva Oyunları" bölümündeki slotlarda yapılan bahisler geçerlidir.</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/30" /> Liderlik tablosu her 3 saniyede bir güncellenir.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tournament Games Grid */}
        <div className="mt-8 pt-4">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-[16px] font-black text-white uppercase tracking-wider flex items-center gap-2 drop-shadow-sm">
              <Play className="w-4 h-4 text-[#FF9F1C]" /> Turnuva Oyunları
            </h2>
            <div className="flex items-center gap-2">
               <button className="p-2 bg-[#0a0a0a]/80 backdrop-blur-md rounded-lg text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
               <button className="p-2 bg-[#0a0a0a]/80 backdrop-blur-md rounded-lg text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
            {displayGames.map(game => (
              <div key={game.id} className="bg-black/40 border border-white/5 rounded-xl p-2 group cursor-pointer hover:border-white/20 transition-all hover:-translate-y-1 shadow-lg">
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                  <img src={game.image} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full bg-[#00E5FF] flex items-center justify-center pl-1 shadow-[0_0_20px_rgba(0,229,255,0.6)] transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-5 h-5 text-black fill-current" />
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-[10px] font-bold text-white truncate px-1">{game.name}</div>
                  <div className="text-[8px] font-semibold text-zinc-500 uppercase mt-0.5">{game.provider}</div>
                </div>
              </div>
            ))}
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
