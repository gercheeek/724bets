import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Play, Star, TrendingUp, Zap, Trophy, Gift } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'Tümü', icon: '🎰' },
  { id: 'new', name: 'Yeni', icon: '🔥' },
  { id: 'popular', name: 'Popüler', icon: '⭐' },
  { id: 'drops', name: 'Drops & Wins', icon: '💧' },
  { id: 'freespin', name: 'Freespin Satın Al', icon: '🛒' },
  { id: 'jackpot', name: 'Jackpotlar', icon: '💰' },
  { id: 'megaways', name: 'Megaways', icon: '🎲' },
  { id: 'masa', name: 'Masa Oyunları', icon: '🃏' },
  { id: 'vip', name: 'VIP Slot Salon', icon: '👑' },
  { id: 'baskin', name: 'BASKIN YERİ', icon: '🚨' }
];

const PROVIDERS = [
  { id: 'pragmatic', name: 'Pragmatic Play', color: 'bg-orange-500/10 text-orange-500 border-orange-500/30' },
  { id: 'egtdigital', name: 'EGT Digital', color: 'bg-red-500/10 text-red-500 border-red-500/30', badge: 'YENİ' },
  { id: 'amusnet', name: 'Amusnet', color: 'bg-green-500/10 text-green-500 border-green-500/30', badge: 'YENİ' },
  { id: 'playson', name: 'Playson', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  { id: '3oaks', name: '3Oaks (Booongo)', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
  { id: 'yggdrasil', name: 'Yggdrasil', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30', badge: 'YENİ' },
  { id: 'wazdan', name: 'Wazdan', color: 'bg-sky-500/10 text-sky-500 border-sky-500/30' },
  { id: 'betsoft', name: 'BetSoft', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30' }
];

const POPULAR_GAMES = [
  { id: 1, name: 'Black Lounge Bell', img: 'https://placehold.co/400x550/1a1a2e/fff?text=Black+Lounge', badge: 'YENİ' },
  { id: 2, name: 'Gates of Olympus', img: 'https://placehold.co/400x550/2a1b38/fff?text=Gates+of+Olympus', badge: 'EN İYİ' },
  { id: 3, name: 'Sweet Bonanza', img: 'https://placehold.co/400x550/ff6b6b/fff?text=Sweet+Bonanza', badge: 'SICAK' },
  { id: 4, name: 'Sweet Bonanza 1000', img: 'https://placehold.co/400x550/ff4757/fff?text=Sweet+1000', badge: 'YENİ' },
  { id: 5, name: 'Starlight Princess', img: 'https://placehold.co/400x550/ff7f50/fff?text=Starlight', badge: 'YENİ' },
  { id: 6, name: '40 Shining Crown', img: 'https://placehold.co/400x550/1e90ff/fff?text=40+Shining', badge: 'SICAK' },
  { id: 7, name: 'Sugar Rush', img: 'https://placehold.co/400x550/ff69b4/fff?text=Sugar+Rush', badge: 'YENİ' },
  { id: 8, name: 'Flaming Hot', img: 'https://placehold.co/400x550/e67e22/fff?text=Flaming+Hot', badge: 'EN İYİ' }
];

const PRAGMATIC_GAMES = [
  { id: 11, name: 'Gates of Olympus 1000', img: 'https://placehold.co/400x550/4a235a/fff?text=Olympus+1000', badge: 'YENİ' },
  { id: 12, name: 'Big Bass Splash', img: 'https://placehold.co/400x550/154360/fff?text=Big+Bass', badge: 'SICAK' },
  { id: 13, name: 'Sugar Rush 1000', img: 'https://placehold.co/400x550/900c3f/fff?text=Sugar+1000', badge: 'EN İYİ' },
  { id: 14, name: 'The Dog House', img: 'https://placehold.co/400x550/0b5345/fff?text=Dog+House', badge: 'SICAK' },
  { id: 15, name: 'Zeus vs Hades', img: 'https://placehold.co/400x550/641e16/fff?text=Zeus+vs+Hades', badge: 'YENİ' },
  { id: 16, name: 'Fruit Party', img: 'https://placehold.co/400x550/f39c12/fff?text=Fruit+Party', badge: 'SICAK' },
  { id: 17, name: 'Madame Destiny', img: 'https://placehold.co/400x550/1b4f72/fff?text=Madame+Destiny', badge: 'YENİ' },
  { id: 18, name: 'Wild West Gold', img: 'https://placehold.co/400x550/9a7d0a/fff?text=Wild+West', badge: 'SICAK' }
];

const JACKPOT_GAMES = [
  { id: 21, name: 'Fruity Wilds', img: 'https://placehold.co/400x300/c0392b/fff?text=Fruity+Wilds', badge: 'JACKPOT' },
  { id: 22, name: '40 Super Hot', img: 'https://placehold.co/400x300/d35400/fff?text=40+Super+Hot', badge: 'JACKPOT' },
  { id: 23, name: 'Shining Crown', img: 'https://placehold.co/400x300/f39c12/fff?text=Shining+Crown', badge: 'JACKPOT' },
  { id: 24, name: 'Burning Hot', img: 'https://placehold.co/400x300/27ae60/fff?text=Burning+Hot', badge: 'JACKPOT' },
  { id: 25, name: 'Supreme Hot', img: 'https://placehold.co/400x300/8e44ad/fff?text=Supreme+Hot', badge: 'JACKPOT' },
  { id: 26, name: 'Zodiac Wheel', img: 'https://placehold.co/400x300/2980b9/fff?text=Zodiac+Wheel', badge: 'JACKPOT' }
];

const FAST_GAMES = [
  { id: 31, name: 'Aviator', img: 'https://placehold.co/300x400/8b0000/fff?text=Aviator', badge: 'YENİ' },
  { id: 32, name: 'Spaceman', img: 'https://placehold.co/300x400/4b0082/fff?text=Spaceman', badge: 'SICAK' },
  { id: 33, name: 'Plinko', img: 'https://placehold.co/300x400/006400/fff?text=Plinko', badge: 'YENİ' },
  { id: 34, name: 'Mines', img: 'https://placehold.co/300x400/00008b/fff?text=Mines', badge: 'SICAK' },
  { id: 35, name: 'Keno', img: 'https://placehold.co/300x400/8b4500/fff?text=Keno', badge: 'EN İYİ' },
  { id: 36, name: 'HiLo', img: 'https://placehold.co/300x400/2f4f4f/fff?text=HiLo', badge: 'YENİ' },
  { id: 37, name: 'Dice', img: 'https://placehold.co/300x400/483d8b/fff?text=Dice', badge: 'SICAK' },
  { id: 38, name: 'Goal', img: 'https://placehold.co/300x400/228b22/fff?text=Goal', badge: 'YENİ' }
];

const TOP_WINNERS = [
  { id: 1, user: 'Bekir42', game: 'Lightning Roulette', amount: '₺13,450' },
  { id: 2, user: 'Ahmet_Pro', game: 'Sweet Bonanza', amount: '₺25,000' },
  { id: 3, user: 'ZeynepK', game: 'Gates of Olympus', amount: '₺8,900' },
  { id: 4, user: 'Caner_34', game: 'Aviator', amount: '₺42,100' },
  { id: 5, user: 'Ruzzojona', game: 'Crazy Time', amount: '₺18,750' },
  { id: 6, user: 'Kuba', game: 'Big Bass Splash', amount: '₺5,400' },
  { id: 7, user: 'GamerTurk', game: 'Sugar Rush', amount: '₺33,200' },
];

const GameCard: React.FC<{ game: any, aspectRatio?: string }> = ({ game, aspectRatio = "aspect-[3/4]" }) => {
  return (
    <div className={`relative group rounded-xl overflow-hidden cursor-pointer ${aspectRatio} bg-[#1A1C24] border border-[#2C2F3D] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:border-[#4C5270]`}>
      <img src={game.img} alt={game.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      
      {game.badge && (
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black tracking-wider text-white shadow-md z-10 
          ${game.badge === 'YENİ' ? 'bg-blue-500' : game.badge === 'SICAK' ? 'bg-orange-500' : game.badge === 'JACKPOT' ? 'bg-amber-500 text-black' : 'bg-rose-500'}`}>
          {game.badge}
        </div>
      )}
      
      {/* Play Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-20">
        <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.6)]">
          <Play fill="currentColor" className="w-5 h-5 ml-1" />
        </button>
        <span className="text-white font-bold text-sm px-2 text-center drop-shadow-md">{game.name}</span>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-between mb-4 mt-8">
    <h2 className="text-white font-black text-xl md:text-2xl tracking-tight flex items-center gap-2">
      {title}
    </h2>
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#A0A5BB] font-bold cursor-pointer hover:text-white transition-colors hidden sm:block">Tümünü Görüntüle</span>
      <div className="flex gap-1">
        <button className="w-7 h-7 rounded bg-[#1A1C24] border border-[#2C2F3D] flex items-center justify-center text-[#A0A5BB] hover:bg-[#2C2F3D] hover:text-white transition-colors">
          <ChevronLeft size={16} />
        </button>
        <button className="w-7 h-7 rounded bg-[#1A1C24] border border-[#2C2F3D] flex items-center justify-center text-[#A0A5BB] hover:bg-[#2C2F3D] hover:text-white transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
);

const CasinoLobby: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#0F172A] font-sans pb-20 overflow-y-auto" style={{ maxHeight: 'calc(100vh - var(--header-height, 60px))' }}>
      
      {/* HERO BANNER */}
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-b-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-b border-[#2C2F3D]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x600/1E293B/fff?text=Gates+of+Bahisbey')] bg-cover bg-center mix-blend-overlay z-0 opacity-50" />
        
        <div className="relative z-20 w-full h-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col justify-center items-start">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Pragmatic_Play_logo.svg/1024px-Pragmatic_Play_logo.svg.png" alt="Pragmatic" className="w-32 md:w-48 mb-6 brightness-0 invert opacity-90" />
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-8 drop-shadow-2xl uppercase" style={{ textShadow: '0 0 50px rgba(56,189,248,0.6)' }}>
            GATES OF <span className="text-sky-400">BAHİSBEY!</span>
          </h1>
          <button className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-black text-xl md:text-2xl italic uppercase tracking-widest rounded-full shadow-[0_0_40px_rgba(52,211,153,0.6)] hover:scale-105 active:scale-95 transition-all hover:shadow-[0_0_60px_rgba(52,211,153,0.8)] border-b-4 border-emerald-600">
            HEMEN OYNA!
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* SEARCH & FILTERS */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-[#1A1D24] p-3 rounded-2xl border border-[#2C2F3D] shadow-xl">
          <div className="relative w-full xl:w-96 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A5BB]" />
            <input 
              type="text" 
              placeholder="Oyun veya sağlayıcı ara..." 
              className="w-full bg-[#12141A] border border-[#2C2F3D] text-white text-sm rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-sky-500 transition-colors shadow-inner"
            />
          </div>
          
          <div className="flex w-full overflow-x-auto hide-scrollbar items-center gap-2 pb-2 xl:pb-0">
            {CATEGORIES.map(cat => (
              <button key={cat.id} className={`whitespace-nowrap flex items-center gap-2 px-4 py-3 rounded-xl bg-[#12141A] border border-[#2C2F3D] text-[#A0A5BB] text-xs font-bold hover:bg-[#2C2F3D] hover:text-white transition-all shadow-sm ${cat.id === 'all' ? 'bg-[#2C2F3D] text-white border-zinc-600' : ''}`}>
                <span className="text-base">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* PROVIDERS */}
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar mt-6 pb-2 px-1">
          {PROVIDERS.map(prov => (
            <button key={prov.id} className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl border bg-[#1A1D24] ${prov.color.replace('bg-', 'hover:bg-').split(' ')[1]} border-[#2C2F3D] whitespace-nowrap text-xs font-black shrink-0 hover:scale-105 transition-all shadow-md group`}>
              <span className={`text-[#A0A5BB] group-hover:${prov.color.split(' ')[1]} transition-colors`}>{prov.name}</span>
              {prov.badge && (
                <span className="absolute -top-2.5 -right-2 bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-md font-black shadow-lg border border-rose-600">
                  {prov.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* POPULAR GAMES */}
        <SectionHeader title="Popüler" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
          {POPULAR_GAMES.map(game => <GameCard key={game.id} game={game} />)}
        </div>

        {/* PRAGMATIC GAMES */}
        <SectionHeader title="Pragmatic" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
          {PRAGMATIC_GAMES.map(game => <GameCard key={game.id} game={game} />)}
        </div>

        {/* EN COK KAZANDIRANLAR (TOP WINNERS MARQUEE) */}
        <div className="mt-12 mb-6 relative bg-[#1A1D24] border border-[#2C2F3D] rounded-2xl p-4 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3 shrink-0 ml-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse border border-emerald-500/50">
                <Trophy className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-xs md:text-sm tracking-widest uppercase">En Çok Kazandıranlar</span>
                <span className="text-emerald-400 font-bold text-[10px]">CANLI AKIŞ</span>
              </div>
            </div>
            
            <div className="w-[1px] h-10 bg-[#2C2F3D] hidden md:block" />
            
            <div className="flex-1 flex gap-3 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
              {TOP_WINNERS.map(winner => (
                <div key={winner.id} className="flex items-center gap-3 bg-[#12141A] border border-[#2C2F3D] rounded-xl px-4 py-2 shrink-0 shadow-inner min-w-[200px]">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden border border-zinc-700">
                    <img src="https://placehold.co/100x100/1E293B/fff?text=SLOT" alt="Slot" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300 text-[10px] font-bold">{winner.user}</span>
                      <span className="text-zinc-500 text-[9px] truncate max-w-[80px]">{winner.game}</span>
                    </div>
                    <span className="text-emerald-400 font-black text-sm mt-0.5">{winner.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* JACKPOT GAMES */}
        <SectionHeader title="Jackpotlar" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {JACKPOT_GAMES.map(game => <GameCard key={game.id} game={game} aspectRatio="aspect-video" />)}
        </div>

        {/* AMUSNET WIDGET */}
        <div className="mt-12 w-full bg-[#111] border border-emerald-900/50 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="p-6 border-b border-emerald-900/30 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#022c22] via-black to-[#022c22]">
            <div className="flex items-center gap-4">
               <img src="https://cdn-icons-png.flaticon.com/512/732/732230.png" alt="Amusnet" className="w-12 h-12 opacity-80 invert filter drop-shadow-md" />
               <div>
                  <h3 className="text-emerald-500 font-black text-2xl uppercase tracking-tighter">AMUSNET JACKPOT</h3>
                  <p className="text-emerald-500/50 text-[10px] font-bold uppercase tracking-widest">Global Havuz</p>
               </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 w-full md:w-auto">
              <div className="flex flex-col items-center bg-black/50 px-6 py-2 rounded-xl border border-emerald-900/50">
                <span className="text-zinc-400 text-[10px] font-black tracking-widest flex items-center gap-1"><span className="text-emerald-500">♠</span> MEGA</span>
                <span className="text-emerald-400 font-black text-xl md:text-3xl font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">TRY 82,747.62</span>
              </div>
              <div className="flex flex-col items-center bg-black/50 px-6 py-2 rounded-xl border border-yellow-900/50 hidden sm:flex">
                <span className="text-zinc-400 text-[10px] font-black tracking-widest flex items-center gap-1"><span className="text-yellow-500">♥</span> MAJOR</span>
                <span className="text-yellow-500 font-black text-xl md:text-2xl font-mono tracking-tighter">TRY 56,408.86</span>
              </div>
              <div className="flex flex-col items-center bg-black/50 px-6 py-2 rounded-xl border border-blue-900/50 hidden md:flex">
                <span className="text-zinc-400 text-[10px] font-black tracking-widest flex items-center gap-1"><span className="text-blue-500">♦</span> MINOR</span>
                <span className="text-blue-400 font-black text-xl md:text-2xl font-mono tracking-tighter">TRY 25,028.72</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-b from-[#111] to-[#050505]">
             <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-32 md:w-40 shrink-0 relative rounded-xl overflow-hidden border border-zinc-800 shadow-xl group cursor-pointer hover:border-emerald-500/50 transition-colors">
                    <img src={`https://placehold.co/300x400/1E293B/fff?text=EGT+${i+1}`} className="w-full aspect-[3/4] object-cover group-hover:scale-110 transition-transform duration-500" alt="EGT" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <Play className="text-white w-10 h-10 drop-shadow-lg" />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* BANNERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <div className="relative rounded-3xl overflow-hidden h-48 md:h-64 group cursor-pointer border border-[#2C2F3D] shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-transparent z-10" />
            <img src="https://placehold.co/800x400/3a0ca3/fff?text=EGT+Digital" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="EGT" />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
              <h3 className="text-white font-black text-3xl md:text-4xl drop-shadow-xl mb-2">EGT Digital Oyunları</h3>
              <p className="text-white/80 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                Hemen Keşfet <ChevronRight className="w-4 h-4" />
              </p>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden h-48 md:h-64 group cursor-pointer border border-[#2C2F3D] shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-transparent z-10" />
            <img src="https://placehold.co/800x400/1a5f7a/fff?text=Amusnet" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Amusnet" />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
              <h3 className="text-white font-black text-3xl md:text-4xl drop-shadow-xl mb-2">Amusnet Oyunları</h3>
              <p className="text-white/80 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                Turnuvalara Katıl <ChevronRight className="w-4 h-4" />
              </p>
            </div>
          </div>
        </div>

        {/* YENI GAMES */}
        <SectionHeader title="Yeni Eklenenler" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
          {PRAGMATIC_GAMES.map(game => <GameCard key={game.id} game={{...game, badge: 'YENİ'}} />)}
        </div>

        {/* HIZLI OYUNLAR */}
        <SectionHeader title="Hızlı oyunlar" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
          {FAST_GAMES.map(game => <GameCard key={game.id} game={game} />)}
        </div>

        {/* GALAXSYS OYUNLARI */}
        <div className="flex items-center gap-3 mt-12 mb-4">
           <Zap className="w-6 h-6 text-sky-400" />
           <h2 className="text-white font-black text-xl md:text-2xl tracking-tight">Galaxsys Oyunları</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4 pb-20">
          {FAST_GAMES.slice(0,6).map(game => <GameCard key={game.id} game={{...game, badge: ''}} />)}
        </div>

      </div>
    </div>
  );
};

export default CasinoLobby;
