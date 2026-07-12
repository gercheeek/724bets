import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Play, X, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { CasinoLobbyGame } from '../types';

// Helper to map game names to Pragmatic Play demo symbols
const getDemoUrl = (game: any): string | null => {
  if (!game) return null;
  const nameString = (game.name || game.img || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  let symbol = '';
  
  // Maps
  if (nameString.includes('sweetbonanza')) symbol = 'vs20sweetbonanza';
  else if (nameString.includes('gatesofolympus')) symbol = 'vs20olympgate';
  else if (nameString.includes('sugarrush')) symbol = 'vs20sugarrush';
  else if (nameString.includes('starlightprincess')) symbol = 'vs20starlight';
  else if (nameString.includes('bigbass')) symbol = 'vs10bbbonanza';
  else if (nameString.includes('fruitparty')) symbol = 'vs20fruitparty';
  else if (nameString.includes('doghouse')) symbol = 'vs20doghouse';
  else return null; // Default to null if no demo found

  return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${symbol}&jurisdiction=99&lobbyUrl=https://724bahis.net`;
};

const PROVIDERS = [
  { id: 'pragmatic', name: 'Pragmatic Play', icon: 'https://cdn.bahisbey1438.com/plat/prd//ProviderImages/Pragmatic/Favicon_20251117112756861.webp' },
  { id: 'egtdigital', name: 'EGT Digital', icon: 'https://cdn.bahisbey1438.com/plat/prd//ProviderImages/EGT%20Digital/Favicon_20251117125448105.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
  { id: 'amusnet', name: 'Amusnet', icon: 'https://cdn.bahisbey1438.com/plat/prd//ProviderImages/Amusnet/Favicon_20260624202653148.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
  { id: 'playson', name: 'Playson', icon: 'https://cdn.bahisbey1438.com/plat/prd//ProviderImages/Playson/Favicon_20251114155644459.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
  { id: '3oaks', name: '3Oaks', icon: 'https://cdn.bahisbey1438.com/plat/prd//ProviderImages/3OAKs/Favicon_20260606153019588.webp' },
  { id: 'wazdan', name: 'Wazdan', icon: 'https://cdn.bahisbey1438.com/plat/prd//ProviderImages/Wazdan/Favicon_20251225162751345.webp' },
  { id: 'betsoft', name: 'BetSoft', icon: 'https://cdn.bahisbey1438.com/plat/prd//ProviderImages/BetSoft/Favicon_20251125125828310.webp' },
  { id: 'egypt', name: 'Egypt Quest', icon: 'https://cdn.bahisbey1438.com/plat/prd//ProviderImages/EGT_EQ/Favicon_20251117130118522.webp', badge: 'PİYANGO', badgeColor: 'bg-blue-500' },
  { id: 'galaxsys', name: 'Galaxsys', icon: 'https://cdn.bahisbey1438.com/plat/prd//ProviderImages/Galaxsys/Favicon_20251114160103112.webp' },
  { id: 'pateplay', name: 'PatePlay', icon: 'https://cdn.bahisbey1438.com/plat/prd//ProviderImages/PatePlay/Favicon_20260507192704724.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
  { id: 'yggdrasil', name: 'Yggdrasil', icon: 'https://cdn.bahisbey1438.com/plat/prd//ProviderImages/Yggdrasil/Favicon_20251114162117718.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
  { id: 'aviatrix', name: 'Aviatrix', icon: 'https://cdn.bahisbey1438.com/plat/prd//ProviderImages/Aviatrix/Favicon_20251126171740131.webp' }
];

const DEFAULT_GAMES = {
  popular: [
    { id: 1, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Gates-of-Olympus-PragmaticPlay/Vertical/GatesofOlympus_20250328152430427.webp', badge: 'EN İYİ', badgeColor: 'bg-purple-600' },
    { id: 2, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Sweet-Bonanza-PragmaticPlay/VerticalSweetBonanza_20251014122142773.webp', badge: 'PİYANGO', badgeColor: 'bg-blue-500' },
    { id: 3, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Starlight-Princess-1000-Pragmatic-Play/Vertical/StarlightPrincess1000_20250312174636784.webp', badge: 'EN İYİ', badgeColor: 'bg-purple-600' },
    { id: 4, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Sugar-Rush-1000-Pragmatic/Vertical/SugarRush1000_20250328152633077.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
    { id: 5, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/Vertical/40BurningHotBellLink.webp', badge: 'PİYANGO', badgeColor: 'bg-blue-500' },
    { id: 6, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Big-Bass-Splash-Pragmatic/Vertical/BigBassSplash_20250312175247779.webp', badge: 'EN İYİ', badgeColor: 'bg-purple-600' },
    { id: 7, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/Vertical/40ShiningCrownBellLink.webp' },
    { id: 8, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/Vertical/40SuperHotBellLink.webp', badge: 'PİYANGO', badgeColor: 'bg-blue-500' },
  ],
  pragmatic: [
    { id: 1, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Gates-of-Olympus-1000-Pragmatic/Vertical/GatesofOlympus1000_20250328152450882.webp', badge: 'EN İYİ', badgeColor: 'bg-purple-600' },
    { id: 2, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Sweet-Bonanza-1000-Pragmatic/Vertical/SweetBonanza1000_20250328152800162.webp', badge: 'PİYANGO', badgeColor: 'bg-blue-500' },
    { id: 3, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Sugar-Rush-Pragmatic/Vertical/SugarRush_20250328152608905.webp' },
    { id: 4, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Gates-of-Hades-Pragmatic-Play/Vertical/GatesofHades_20260702172543247.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
    { id: 5, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Sweet-Bonanza-Xmas-PragmaticPlay/Vertical/SweetBonanzaXmas.webp' },
    { id: 6, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Pragmatic/Vertical/SweetBonanzaDice.webp' },
    { id: 7, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Wild-Wild-Riches-Megaways-Pragmatic/Vertical/WildWildRichesMegaways_20250131120736369.webp' },
  ],
  jackpots: [
    { id: 1, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/40BurningHotBellLink.webp', badge: 'PİYANGO', badgeColor: 'bg-blue-500' },
    { id: 2, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/40ShiningCrownBellLink.webp', badge: 'PİYANGO', badgeColor: 'bg-blue-500' },
    { id: 3, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/FlamingHotExtremeBellLink.webp', badge: 'PİYANGO', badgeColor: 'bg-blue-500' },
    { id: 4, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/40SuperHotBellLink.webp', badge: 'PİYANGO', badgeColor: 'bg-blue-500' },
  ],
  amusnet: [
    { id: 1, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Fruits-Kingdom-EGT/FruitsKingdom_20250219182409618.webp' },
    { id: 2, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Game-of-Luck-EGT/GameofLuck_20250219182420042.webp' },
    { id: 3, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Grace-of-Cleopatra-EGT/GraceofCleopatra_20250219182439200.webp' },
    { id: 4, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Great-27-EGT/Great27_20250219182449089.webp' },
    { id: 5, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Halloween-EGT/Halloween_20250219182929022.webp' },
    { id: 6, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Hot-Cash-EGT/HotCash_20250219182939367.webp' },
  ],
  egtBannerGames: [
    { id: 1, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/20SuperHotBellLink.webp', badge: 'PİYANGO', badgeColor: 'bg-blue-500' },
    { id: 2, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/VampireNightBellLink.webp', badge: 'EN İYİ', badgeColor: 'bg-purple-600' },
    { id: 3, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/5DazzlingHotBellLink.webp' },
    { id: 4, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/FlamingHotBellLink.webp' },
    { id: 5, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/ShiningCrownBellLink.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
  ],
  amusnetBannerGames: [
    { id: 1, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Amazing-Amazonia-EGT/AmazingAmazonia_20250219190939987.webp' },
    { id: 2, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Amazons-Battle-EGT/AmazonsBattle_20250219190949601.webp' },
    { id: 3, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Dragon-Hot-EGT/DragonHot_20250116165238119.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
    { id: 4, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Flaming-Hot-6-Reel-EGT/FlamingHot6Reel_20250219194906479.webp' },
    { id: 5, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Hot-Deco-Egt/HotDeco_20250219191018834.webp' },
  ],
  yeni: [
    { id: 1, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/12-Coins-Grand-Gold-Edition-Santas-Jackpots-Wazdan/Vertical/12CoinsGrandGoldEditionSantasJackpots.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
    { id: 2, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/30-Coins-Santas-Jackpots-Wazdan/Vertical/30CoinsSantasJackpots.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
    { id: 3, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/16-Coins-Grand-Gold-Edition-Santas-Jackpots-Wazdan/Vertical/16CoinsGrandGoldEditionSantasJackpots.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
    { id: 4, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/20-Coins-Grand-Gold-Edition-Wazdan/Vertical/20CoinsGrandGoldEdition.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
    { id: 5, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Super-Santa-Link-RUNNING-WINS-Fugaso/Vertical/SuperSantaLinkRUNNINGWINS.webp', badge: 'YENİ', badgeColor: 'bg-red-500' },
  ],
  hizli: [
    { id: 1, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Playson/RoyalJokerHoldandWin.webp' },
    { id: 2, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Playson/RoyalFortunatorHoldandWin.webp' },
    { id: 3, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Coin-Strike-XXL-Hold-and-Win-Playson/Vertical/CoinStrikeXXLHoldandWin_20260129125612110.webp' },
  ],
  galaxsys: [
    { id: 1, img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Gangsta-Piggy-Hold-and-Win-Galaxsys/GangstaPiggy_20260211175949323.webp', badge: 'YENİ', badgeColor: 'bg-blue-500' },
  ],
};

const WINNERS = [
  { id: 1, user: 'S***4', img: 'https://placehold.co/50x50/111/fff?text=S4', amount: '9,564 TRY', date: '10 Tem, 2026 22:32' },
  { id: 2, user: 'M***9', img: 'https://placehold.co/50x50/111/fff?text=M9', amount: '9,514.2 TRY', date: '11 Tem, 2026 00:25' },
  { id: 3, user: 'K***2', img: 'https://placehold.co/50x50/111/fff?text=K2', amount: '9,512.5 TRY', date: '11 Tem, 2026 00:29' },
  { id: 4, user: 'A***7', img: 'https://placehold.co/50x50/111/fff?text=A7', amount: '9,291 TRY', date: '11 Tem, 2026 03:11' },
  { id: 5, user: 'B***1', img: 'https://placehold.co/50x50/111/fff?text=B1', amount: '8,856.75 TRY', date: '10 Tem, 2026 22:09' },
  { id: 6, user: 'T***5', img: 'https://placehold.co/50x50/111/fff?text=T5', amount: '8,755.5 TRY', date: '11 Tem, 2026 00:46' },
];

const GameCard: React.FC<{ game: any, aspectRatio?: string, className?: string, onClick?: () => void }> = ({ game, aspectRatio = "aspect-[2/3]", className = "", onClick }) => {
  return (
    <div onClick={onClick} className={`relative group rounded-xl overflow-hidden cursor-pointer ${aspectRatio} bg-[#1A1C24] shrink-0 transition-transform hover:scale-105 ${className}`}>
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

const CasinoLobby: React.FC<{ customGames?: CasinoLobbyGame[], isLoggedIn?: boolean }> = ({ customGames = [], isLoggedIn = false }) => {
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showDemoIframe, setShowDemoIframe] = useState<boolean>(false);

  const handleAction = () => {
    if (isLoggedIn) {
      window.dispatchEvent(new Event('openDepositModal'));
    } else {
      window.dispatchEvent(new CustomEvent('open-auth-modal'));
    }
  };

  const getGamesForCategory = (category: string, fallback: any[]) => {
    const matched = customGames.filter(g => g.lobbyCategory === category && g.isActive);
    if (matched.length > 0) {
      return matched.sort((a, b) => (a.order || 0) - (b.order || 0)).map(g => ({
        id: g.id,
        img: g.image,
        badge: g.badgeText,
        badgeColor: g.badgeColor
      }));
    }
    return fallback;
  };

  const GAMES = {
    popular: getGamesForCategory('popular', DEFAULT_GAMES.popular),
    pragmatic: getGamesForCategory('pragmatic', DEFAULT_GAMES.pragmatic),
    jackpots: getGamesForCategory('jackpots', DEFAULT_GAMES.jackpots),
    amusnet: getGamesForCategory('amusnet', DEFAULT_GAMES.amusnet),
    egtBannerGames: getGamesForCategory('egtBannerGames', DEFAULT_GAMES.egtBannerGames),
    amusnetBannerGames: getGamesForCategory('amusnetBannerGames', DEFAULT_GAMES.amusnetBannerGames),
    yeni: getGamesForCategory('yeni', DEFAULT_GAMES.yeni),
    hizli: getGamesForCategory('hizli', DEFAULT_GAMES.hizli),
    galaxsys: getGamesForCategory('galaxsys', DEFAULT_GAMES.galaxsys),
  };

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
          {GAMES.popular.map(game => <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} className="w-32 md:w-40" />)}
        </div>

        {/* PRAGMATIC GAMES */}
        <SectionHeader title="Pragmatic" />
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {GAMES.pragmatic.map(game => <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} className="w-32 md:w-40" />)}
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
          {GAMES.jackpots.map(game => <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} aspectRatio="aspect-video" className="w-full" />)}
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
             {GAMES.amusnet.map(game => <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} className="w-24 md:w-28 shrink-0" />)}
             <button className="absolute right-2 z-20 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 hidden md:flex"><ChevronRight size={14}/></button>
          </div>
        </div>

        {/* EGT / AMUSNET BANNERS WITH GAMES UNDERNEATH */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          
          {/* EGT Section */}
          <div className="flex flex-col gap-2">
            <div className="relative rounded-xl overflow-hidden h-40 bg-[#0F2027] border border-[#2C2F3D] flex items-center justify-between p-6 group cursor-pointer">
               <img src="https://cdn.bahisbey1438.com/plat/prd//WidgetBasedHompageImages/1217/EGT%20Digital%20Banner%20Desktop_20260324154457473.webp" className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700" alt="EGT Banner" />
               <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
               <h3 className="text-white font-black text-2xl z-20 drop-shadow-md">EGT Digital Oyunları</h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
               {GAMES.egtBannerGames.map(game => <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} className="w-full" />)}
            </div>
          </div>

          {/* Amusnet Section */}
          <div className="flex flex-col gap-2">
            <div className="relative rounded-xl overflow-hidden h-40 bg-[#16222A] border border-[#2C2F3D] flex items-center justify-between p-6 group cursor-pointer">
               <img src="https://cdn.bahisbey1438.com/plat/prd//WidgetBasedHompageImages/1217/Amusnet%20Banner%20Desktop_20260324150630846.webp" className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700" alt="Amusnet Banner" />
               <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
               <h3 className="text-white font-black text-2xl z-20 drop-shadow-md">Amusnet Oyunları</h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
               {GAMES.amusnetBannerGames.map(game => <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} className="w-full" />)}
            </div>
          </div>

        </div>

        {/* YENI GAMES */}
        <SectionHeader title="Yeni" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
          {GAMES.yeni.map(game => <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} aspectRatio="aspect-[4/3]" className="w-full" />)}
        </div>

        {/* HIZLI OYUNLAR */}
        <SectionHeader title="Hızlı oyunlar" />
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {GAMES.hizli.map(game => <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} className="w-24 md:w-32 shrink-0" />)}
        </div>

        {/* GALAXSYS OYUNLARI */}
        <div className="mt-8 rounded-xl bg-[#0a1128] border border-[#1e2a4f] overflow-hidden flex flex-col md:flex-row relative">
           <div className="absolute top-4 left-4 z-20">
             <span className="text-blue-500 font-bold text-xs uppercase tracking-widest">GALAXSYS</span>
             <h2 className="text-white font-black text-2xl mt-1">Galaxsys Oyunları</h2>
           </div>
           
           <div className="w-full md:w-1/3 relative min-h-[300px] overflow-hidden group">
             <img src="https://cdn.bahisbey1438.com/plat/prd/CMS/1217/Web_Content/Banners/web%20tr_20250418101957697.jpg" className="absolute inset-0 w-full h-full object-cover object-left opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Galaxsys" />
             <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a1128] via-transparent to-transparent" />
           </div>

           <div className="w-full md:w-2/3 p-4 md:p-8 flex items-center justify-end z-10">
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto">
                 <button className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 shrink-0"><ChevronLeft size={16}/></button>
                 {GAMES.galaxsys.map(game => <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} className="w-32 md:w-40 shrink-0 shadow-2xl border-white/10" />)}
                 <button className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 shrink-0"><ChevronRight size={16}/></button>
              </div>
           </div>
        </div>

      {selectedGame && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedGame(null);
              setShowDemoIframe(false);
            }
          }}
        >
          {showDemoIframe && getDemoUrl(selectedGame) ? (
            <div className="relative m-auto z-10 w-full max-w-4xl h-[70vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-fade-in flex flex-col">
              <div className="flex items-center justify-between p-3 bg-[#0F1115] border-b border-white/10">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
                   <span className="text-white font-bold text-sm">{selectedGame.name || 'Demo Oyun'}</span>
                   <span className="bg-[#00FFA3]/20 text-[#00FFA3] text-[10px] px-2 py-0.5 rounded font-black tracking-widest uppercase ml-2">Sanal Bakiye</span>
                </div>
                <button onClick={() => setShowDemoIframe(false)} className="w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-white hover:text-black rounded-full text-white/70 transition-all">✕</button>
              </div>
              <div className="flex-1 w-full bg-black relative">
                <iframe 
                  src={getDemoUrl(selectedGame)!}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  title={selectedGame.name || 'Demo Game'}
                />
              </div>
            </div>
          ) : (
            <div className="relative m-auto z-10 bg-[#0F1115] rounded-3xl border border-white/5 w-full max-w-[380px] shadow-2xl shadow-black/50 overflow-hidden animate-fade-in">
              {/* Close Button */}
              <button onClick={() => { setSelectedGame(null); setShowDemoIframe(false); }} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-white hover:text-black rounded-full text-white/70 transition-all z-20">✕</button>
              
              {/* Top Image Section */}
              <div className="relative h-48 w-full flex flex-col items-center justify-center pt-8">
                <div className="absolute inset-0 bg-black">
                  <img src={selectedGame.img} className="w-full h-full object-cover opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/80 to-transparent" />
                </div>
                
                {/* Game Icon Center */}
                <div className="relative z-10 w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 shadow-[0_0_30px_rgba(0,255,163,0.15)] transition-all">
                  <img src={selectedGame.img} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Content Section */}
              <div className="relative z-10 px-6 pb-8 pt-2 text-center flex flex-col items-center">
                <h3 className="text-2xl font-black text-white mb-1 tracking-tight">{selectedGame.name || 'Pragmatic Play Slot'}</h3>
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-6 font-bold">{getDemoUrl(selectedGame) ? 'Gerçek veya Sanal Oyna' : 'Gerçek Parayla Oyna'}</p>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                <h4 className="text-lg font-bold text-white mb-2">{isLoggedIn ? 'Şansını Dene!' : 'Maceraya Katıl!'}</h4>
                <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                  {isLoggedIn 
                    ? 'Kaldığın yerden devam et ve kazanmaya başla.'
                    : 'Gerçek heyecan için hemen aramıza katıl!'}
                </p>

                <div className="w-full flex flex-col gap-3">
                  <button 
                     onClick={() => {
                       setSelectedGame(null);
                       setShowDemoIframe(false);
                       handleAction();
                     }}
                     className={`w-full py-3.5 rounded-xl font-black text-sm transition-all shadow-lg relative z-10 ${
                       isLoggedIn 
                         ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                         : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]'
                     }`}
                   >
                     Gerçek Parayla Oyna
                   </button>

                  {getDemoUrl(selectedGame) && (
                    <button 
                       onClick={() => setShowDemoIframe(true)}
                       className="w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg relative z-10 bg-[#2A2D3A] text-white hover:bg-[#3A3D4A] border border-white/5 hover:border-white/20 flex items-center justify-center gap-2"
                     >
                       <Play size={16} className="text-[#00FFA3]" fill="currentColor" />
                       Demo Oyna (Sanal Bakiye)
                     </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}

      </div>
    </div>
  );
};

export default CasinoLobby;
