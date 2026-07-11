import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Play } from 'lucide-react';

const PROVIDERS = [
  { id: 'pragmatic', name: 'Pragmatic Play', icon: 'https://cdn-icons-png.flaticon.com/512/732/732230.png' },
  { id: 'egtdigital', name: 'EGT Digital', badge: 'YENİ', badgeColor: 'bg-red-500' },
  { id: 'amusnet', name: 'Amusnet', badge: 'YENİ', badgeColor: 'bg-red-500' },
  { id: 'playson', name: 'Playson', badge: 'YENİ', badgeColor: 'bg-red-500' },
  { id: '3oaks', name: '3Oaks (Booongo)' },
  { id: 'wazdan', name: 'Wazdan (Volient)' },
  { id: 'betsoft', name: 'BetSoft' },
  { id: 'egypt', name: 'Egypt Quest', badge: 'PİYANGO', badgeColor: 'bg-blue-500' },
  { id: 'galaxsys', name: 'Galaxsys' },
  { id: 'pateplay', name: 'PatePlay', badge: 'YENİ', badgeColor: 'bg-red-500' },
  { id: 'yggdrasil', name: 'Yggdrasil', badge: 'YENİ', badgeColor: 'bg-red-500' },
  { id: 'aviatrix', name: 'Aviatrix' }
];

const REAL_IMAGES = [
  'https://www.pragmaticplay.com/wp-content/uploads/2021/02/Gates-of-Olympus-200x200.jpg',
  'https://www.pragmaticplay.com/wp-content/uploads/2019/06/sweet-bonanza-200x200.png',
  'https://www.pragmaticplay.com/wp-content/uploads/2021/08/Starlight-Princess_Game_Thumb-200x200.png',
  'https://www.pragmaticplay.com/wp-content/uploads/2020/07/The-Dog-House-Megaways-200x200.png',
  'https://www.pragmaticplay.com/wp-content/uploads/2021/04/Big-Bass-Bonanza-200x200.png',
  'https://www.pragmaticplay.com/wp-content/uploads/2020/01/Release-the-Kraken-200x200.png',
  'https://www.pragmaticplay.com/wp-content/uploads/2021/03/Fruit-Party-200x200.png',
  'https://www.pragmaticplay.com/wp-content/uploads/2021/11/Bigger-Bass-Bonanza_200x200.png',
  'https://www.pragmaticplay.com/wp-content/uploads/2020/02/Aztec-Bonanza-200x200.png',
  'https://www.pragmaticplay.com/wp-content/uploads/2020/04/Great-Rhino-Megaways-200x200.png',
  'https://www.pragmaticplay.com/wp-content/uploads/2021/05/Gems-Bonanza-200x200.png',
  'https://www.pragmaticplay.com/wp-content/uploads/2022/01/Wild-West-Gold-Megaways-200x200.png',
  'https://www.pragmaticplay.com/wp-content/uploads/2021/02/Juicy-Fruits-200x200.png',
  'https://www.pragmaticplay.com/wp-content/uploads/2021/10/Day-of-Dead-200x200.png',
];

const GAMES = {
  popular: Array(14).fill(null).map((_, i) => ({ id: i, img: REAL_IMAGES[i % REAL_IMAGES.length], badge: i%2===0 ? 'PİYANGO' : 'EN İYİ', badgeColor: i%2===0 ? 'bg-blue-500' : 'bg-purple-600' })),
  pragmatic: Array(14).fill(null).map((_, i) => ({ id: i, img: REAL_IMAGES[(i + 3) % REAL_IMAGES.length], badge: 'EN İYİ', badgeColor: 'bg-purple-600' })),
  jackpots: Array(14).fill(null).map((_, i) => ({ id: i, img: `https://placehold.co/300x200/1e2d1e/fff?text=Jackpot+${i+1}`, badge: 'PİYANGO', badgeColor: 'bg-blue-500' })),
  amusnet: Array(12).fill(null).map((_, i) => ({ id: i, img: `https://placehold.co/200x300/203a43/fff?text=Amusnet+${i+1}`, badge: 'PİYANGO', badgeColor: 'bg-blue-500' })),
  egtBannerGames: Array(5).fill(null).map((_, i) => ({ id: i, img: `https://placehold.co/200x300/3a0ca3/fff?text=EGT+${i+1}`, badge: i%2===0 ? 'PİYANGO' : 'EN İYİ', badgeColor: i%2===0 ? 'bg-blue-500' : 'bg-purple-600' })),
  amusnetBannerGames: Array(5).fill(null).map((_, i) => ({ id: i, img: `https://placehold.co/200x300/1a5f7a/fff?text=Amusnet+${i+1}`, badge: 'PİYANGO', badgeColor: 'bg-blue-500' })),
  yeni: Array(14).fill(null).map((_, i) => ({ id: i, img: `https://placehold.co/300x200/4a235a/fff?text=Yeni+${i+1}`, badge: i===4?'YENİ':'PİYANGO', badgeColor: i===4?'bg-orange-500':'bg-blue-500' })),
  hizli: Array(14).fill(null).map((_, i) => ({ id: i, img: `https://placehold.co/200x300/154360/fff?text=Hizli+${i+1}` })),
  galaxsys: Array(4).fill(null).map((_, i) => ({ id: i, img: `https://placehold.co/200x300/000/fff?text=Galaxsys+${i+1}`, badge: 'YENİ', badgeColor: 'bg-blue-500' })),
};

const WINNERS = [
  { id: 1, user: 'S***4', img: 'https://placehold.co/50x50/111/fff?text=S4', amount: '9,564 TRY', date: '10 Tem, 2026 22:32' },
  { id: 2, user: 'M***9', img: 'https://placehold.co/50x50/111/fff?text=M9', amount: '9,514.2 TRY', date: '11 Tem, 2026 00:25' },
  { id: 3, user: 'K***2', img: 'https://placehold.co/50x50/111/fff?text=K2', amount: '9,512.5 TRY', date: '11 Tem, 2026 00:29' },
  { id: 4, user: 'A***7', img: 'https://placehold.co/50x50/111/fff?text=A7', amount: '9,291 TRY', date: '11 Tem, 2026 03:11' },
  { id: 5, user: 'B***1', img: 'https://placehold.co/50x50/111/fff?text=B1', amount: '8,856.75 TRY', date: '10 Tem, 2026 22:09' },
  { id: 6, user: 'T***5', img: 'https://placehold.co/50x50/111/fff?text=T5', amount: '8,755.5 TRY', date: '11 Tem, 2026 00:46' },
];

const GameCard: React.FC<{ game: any, aspectRatio?: string, className?: string }> = ({ game, aspectRatio = "aspect-[2/3]", className = "" }) => {
  return (
    <div className={`relative group rounded-xl overflow-hidden cursor-pointer ${aspectRatio} bg-[#1A1C24] shrink-0 transition-transform hover:scale-105 ${className}`}>
      <img src={game.img} alt="Game" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      {game.badge && (
        <div className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[8px] font-black tracking-widest text-white shadow-md z-10 ${game.badgeColor}`}>
          {game.badge}
        </div>
      )}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
        <button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white transform scale-75 group-hover:scale-100 transition-all shadow-[0_0_15px_rgba(34,197,94,0.6)]">
          <Play fill="currentColor" className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-between mb-3 mt-6">
    <h2 className="text-white font-bold text-sm tracking-wide">{title}</h2>
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-zinc-400 font-bold cursor-pointer hover:text-white transition-colors uppercase tracking-wider">Tümünü Görüntüle</span>
      <div className="flex gap-1">
        <button className="w-6 h-6 rounded bg-[#1C1F26] flex items-center justify-center text-zinc-400 hover:bg-[#2C2F3D] hover:text-white transition-colors">
          <ChevronLeft size={14} />
        </button>
        <button className="w-6 h-6 rounded bg-[#1C1F26] flex items-center justify-center text-zinc-400 hover:bg-[#2C2F3D] hover:text-white transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  </div>
);

const CasinoLobby: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#111319] font-sans pb-20 overflow-x-hidden">
      
      {/* PROVIDERS ROW */}
      <div className="w-full bg-[#1A1C24] border-b border-[#2C2F3D] py-2 px-4 flex items-center gap-2 overflow-x-auto hide-scrollbar">
        {PROVIDERS.map(prov => (
          <button key={prov.id} className="relative flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#222530] hover:bg-[#2C2F3D] border border-transparent hover:border-zinc-600 transition-colors shrink-0">
             {prov.icon && <img src={prov.icon} alt={prov.name} className="w-4 h-4 rounded-full" />}
             {!prov.icon && <div className="w-4 h-4 rounded-full bg-zinc-700 flex items-center justify-center text-[8px] font-bold text-white">{prov.name.charAt(0)}</div>}
             <span className="text-zinc-300 text-xs font-medium whitespace-nowrap">{prov.name}</span>
             {prov.badge && (
               <span className={`absolute -top-1.5 -right-1.5 ${prov.badgeColor} text-white text-[7px] px-1 rounded-sm font-black`}>
                 {prov.badge}
               </span>
             )}
          </button>
        ))}
      </div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        
        {/* POPULAR GAMES */}
        <SectionHeader title="Popüler" />
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {GAMES.popular.map(game => <GameCard key={game.id} game={game} className="w-32 md:w-40" />)}
        </div>

        {/* PRAGMATIC GAMES */}
        <SectionHeader title="Pragmatic" />
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {GAMES.pragmatic.map(game => <GameCard key={game.id} game={game} className="w-32 md:w-40" />)}
        </div>

        {/* EN COK KAZANANLAR ROW */}
        <div className="flex items-center gap-2 mt-6 mb-2 overflow-x-auto hide-scrollbar">
           <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shrink-0 transition-colors">
             En Çok Kazananlar
           </button>
           <button className="w-8 h-8 rounded-lg bg-[#1C1F26] flex items-center justify-center text-zinc-400 hover:bg-[#2C2F3D] hover:text-white shrink-0 transition-colors">
              <ChevronLeft size={16} />
           </button>
           
           <div className="flex gap-2 shrink-0">
             {WINNERS.map(winner => (
               <div key={winner.id} className="flex items-center gap-3 bg-[#1A1C24] rounded-lg p-2 border border-white/5 shrink-0 min-w-[200px]">
                 <img src={winner.img} className="w-10 h-10 rounded-md object-cover border border-zinc-700" alt="Game" />
                 <div className="flex flex-col justify-center">
                    <span className="text-zinc-400 text-[9px] flex items-center gap-1">
                      <span className="w-3 h-3 bg-zinc-700 rounded-full flex items-center justify-center text-[6px]">👤</span>
                      {winner.user}
                    </span>
                    <span className="text-white font-bold text-xs">{winner.amount}</span>
                    <span className="text-zinc-500 text-[8px]">{winner.date}</span>
                 </div>
               </div>
             ))}
           </div>
           
           <button className="w-8 h-8 rounded-lg bg-[#1C1F26] flex items-center justify-center text-zinc-400 hover:bg-[#2C2F3D] hover:text-white shrink-0 transition-colors">
              <ChevronRight size={16} />
           </button>
        </div>

        {/* JACKPOTLAR */}
        <SectionHeader title="Jackpotlar" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
          {GAMES.jackpots.map(game => <GameCard key={game.id} game={game} aspectRatio="aspect-video" className="w-full" />)}
        </div>

        {/* AMUSNET WIDGET */}
        <div className="mt-6 w-full bg-[#0A1612] border border-[#143026] rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#07130F] via-[#0D241C] to-[#07130F] opacity-50 pointer-events-none" />
          <div className="relative p-4 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex flex-col items-start gap-1">
                <img src="https://cdn-icons-png.flaticon.com/512/732/732230.png" alt="Amusnet" className="w-32 brightness-0 invert opacity-90 mb-2" />
             </div>
             
             <div className="flex flex-wrap justify-center gap-4 lg:gap-12 w-full md:w-auto">
                <div className="flex flex-col items-center">
                  <span className="text-zinc-400 text-[9px] font-bold tracking-widest flex items-center gap-1 uppercase"><span className="text-zinc-500">♠</span> MEGA</span>
                  <span className="text-white font-black text-xl lg:text-2xl tracking-tighter">TRY 82,747.62</span>
                  <span className="text-zinc-500 text-[8px] uppercase mt-1">Kazanan: 13</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-zinc-400 text-[9px] font-bold tracking-widest flex items-center gap-1 uppercase"><span className="text-red-500">♥</span> MAJOR</span>
                  <span className="text-white font-black text-xl lg:text-2xl tracking-tighter">TRY 25,028.72</span>
                  <span className="text-zinc-500 text-[8px] uppercase mt-1">Kazanan: 137</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-zinc-400 text-[9px] font-bold tracking-widest flex items-center gap-1 uppercase"><span className="text-green-500">♣</span> MINOR</span>
                  <span className="text-white font-black text-xl lg:text-2xl tracking-tighter">TRY 659.55</span>
                  <span className="text-zinc-500 text-[8px] uppercase mt-1">Kazanan: 2205</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-zinc-400 text-[9px] font-bold tracking-widest flex items-center gap-1 uppercase"><span className="text-blue-500">♦</span> MINI</span>
                  <span className="text-white font-black text-xl lg:text-2xl tracking-tighter">TRY 591.29</span>
                  <span className="text-zinc-500 text-[8px] uppercase mt-1">Kazanan: 4120</span>
                </div>
             </div>
          </div>
          
          <div className="relative pb-4 px-4 flex items-center gap-2 overflow-x-auto hide-scrollbar z-10">
             <button className="absolute left-2 z-20 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 hidden md:flex"><ChevronLeft size={14}/></button>
             {GAMES.amusnet.map(game => <GameCard key={game.id} game={game} className="w-24 md:w-28 shrink-0" />)}
             <button className="absolute right-2 z-20 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 hidden md:flex"><ChevronRight size={14}/></button>
          </div>
        </div>

        {/* EGT / AMUSNET BANNERS WITH GAMES UNDERNEATH */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          
          {/* EGT Section */}
          <div className="flex flex-col gap-2">
            <div className="relative rounded-xl overflow-hidden h-40 bg-[#0F2027] border border-[#2C2F3D] flex items-center justify-between p-6">
               <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 to-transparent z-0" />
               <h3 className="text-white font-black text-2xl z-10 drop-shadow-md">EGT Digital Oyunları</h3>
               <img src="https://placehold.co/200x200/transparent/fff?text=CROWN" className="h-full object-contain z-10 opacity-80" alt="Crown" />
            </div>
            <div className="grid grid-cols-5 gap-2">
               {GAMES.egtBannerGames.map(game => <GameCard key={game.id} game={game} className="w-full" />)}
            </div>
          </div>

          {/* Amusnet Section */}
          <div className="flex flex-col gap-2">
            <div className="relative rounded-xl overflow-hidden h-40 bg-[#16222A] border border-[#2C2F3D] flex items-center justify-between p-6">
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-transparent z-0" />
               <h3 className="text-white font-black text-2xl z-10 drop-shadow-md">Amusnet Oyunları</h3>
               <img src="https://placehold.co/200x200/transparent/fff?text=CLOVER" className="h-full object-contain z-10 opacity-80" alt="Clover" />
            </div>
            <div className="grid grid-cols-5 gap-2">
               {GAMES.amusnetBannerGames.map(game => <GameCard key={game.id} game={game} className="w-full" />)}
            </div>
          </div>

        </div>

        {/* YENI GAMES */}
        <SectionHeader title="Yeni" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
          {GAMES.yeni.map(game => <GameCard key={game.id} game={game} aspectRatio="aspect-[4/3]" className="w-full" />)}
        </div>

        {/* HIZLI OYUNLAR */}
        <SectionHeader title="Hızlı oyunlar" />
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {GAMES.hizli.map(game => <GameCard key={game.id} game={game} className="w-24 md:w-32 shrink-0" />)}
        </div>

        {/* GALAXSYS OYUNLARI */}
        <div className="mt-8 rounded-xl bg-[#0a1128] border border-[#1e2a4f] overflow-hidden flex flex-col md:flex-row relative">
           <div className="absolute top-4 left-4 z-20">
             <span className="text-blue-500 font-bold text-xs uppercase tracking-widest">GALAXSYS</span>
             <h2 className="text-white font-black text-2xl mt-1">Galaxsys Oyunları</h2>
           </div>
           
           <div className="w-full md:w-1/3 relative min-h-[300px]">
             <img src="https://placehold.co/600x800/0a1128/fff?text=Poseidon" className="absolute inset-0 w-full h-full object-cover object-left opacity-80 mix-blend-screen" alt="Galaxsys" />
             <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a1128] via-transparent to-transparent" />
           </div>

           <div className="w-full md:w-2/3 p-4 md:p-8 flex items-center justify-end z-10">
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto">
                 <button className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 shrink-0"><ChevronLeft size={16}/></button>
                 {GAMES.galaxsys.map(game => <GameCard key={game.id} game={game} className="w-32 md:w-40 shrink-0 shadow-2xl border-white/10" />)}
                 <button className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 shrink-0"><ChevronRight size={16}/></button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CasinoLobby;
