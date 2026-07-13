import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Play, Filter, Grid2X2, Crown, MonitorPlay, Disc, Sparkles, Flame, Star, StarHalf } from 'lucide-react';
import { createPortal } from 'react-dom';
import { CasinoLobbyGame } from '../types';
import { ALL_GAMES } from '../data/games';

const TABS = [
  { id: 'all', label: 'Tümü', icon: <Grid2X2 size={16} /> },
  { id: 'originals', label: 'Orijinal Oyunlar', icon: <Crown size={16} /> },
  { id: 'slots', label: 'Slotlar', icon: <Flame size={16} /> },
  { id: 'live', label: 'Canlı Casino', icon: <MonitorPlay size={16} /> },
  { id: 'table', label: 'Masa Oyunları', icon: <Disc size={16} /> },
  { id: 'new', label: 'Yeni Eklenenler', icon: <Sparkles size={16} /> },
];

const BANNERS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=1200&auto=format&fit=crop', title: '5.000₺ Hoş Geldin Bonusu', sub: 'İlk yatırımınıza özel fırsatı kaçırmayın' },
  { id: 2, image: 'https://images.unsplash.com/photo-1606167668511-8785bbbe5761?q=80&w=1200&auto=format&fit=crop', title: 'Haftalık %20 Cashback', sub: 'Kayıplarınızı anında telafi edin' },
];

const DEMO_GAMES = [
  { id: 101, name: 'Gates of Olympus', provider: 'Pragmatic Play', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Gates-of-Olympus-PragmaticPlay/Vertical/GatesofOlympus_20250328152430427.webp', category: 'slots', rtp: '96.50%' },
  { id: 102, name: 'Sweet Bonanza', provider: 'Pragmatic Play', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Sweet-Bonanza-PragmaticPlay/VerticalSweetBonanza_20251014122142773.webp', category: 'slots', rtp: '96.48%' },
  { id: 103, name: 'Crazy Time', provider: 'Evolution', img: 'https://images.unsplash.com/photo-1606167668511-8785bbbe5761?w=500&q=80', category: 'live', rtp: '95.40%' },
  { id: 104, name: 'Lightning Roulette', provider: 'Evolution', img: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=500&q=80', category: 'live', rtp: '97.30%' },
  { id: 105, name: 'Sugar Rush 1000', provider: 'Pragmatic Play', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Sugar-Rush-1000-Pragmatic/Vertical/SugarRush1000_20250328152633077.webp', category: 'slots', rtp: '96.53%' },
  { id: 106, name: 'Big Bass Splash', provider: 'Pragmatic Play', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Big-Bass-Splash-Pragmatic/Vertical/BigBassSplash_20250312175247779.webp', category: 'slots', rtp: '96.71%' },
  { id: 107, name: 'Starlight Princess', provider: 'Pragmatic Play', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Starlight-Princess-1000-Pragmatic-Play/Vertical/StarlightPrincess1000_20250312174636784.webp', category: 'slots', rtp: '96.50%' },
  { id: 108, name: '40 Super Hot', provider: 'Amusnet', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/Vertical/40SuperHotBellLink.webp', category: 'slots', rtp: '95.81%' },
  { id: 109, name: 'XXXTreme Lightning', provider: 'Evolution', img: 'https://images.unsplash.com/photo-1517594422361-5e18d033339f?w=500&q=80', category: 'live', rtp: '97.30%' },
  { id: 110, name: 'Crash', provider: 'Originals', img: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=500&q=80', category: 'originals', rtp: '99.00%' },
  { id: 111, name: 'Blackjack', provider: 'Evolution', img: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=500&q=80', category: 'table', rtp: '99.29%' },
  { id: 112, name: 'Baccarat', provider: 'Evolution', img: 'https://images.unsplash.com/photo-1610486242698-c92336340f1a?w=500&q=80', category: 'table', rtp: '98.94%' },
  { id: 113, name: 'Dice', provider: 'Originals', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Playson/RoyalJokerHoldandWin.webp', category: 'originals', rtp: '99.00%' },
  { id: 114, name: 'Roulette', provider: 'Originals', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Playson/RoyalFortunatorHoldandWin.webp', category: 'originals', rtp: '97.30%' },
  { id: 115, name: '12 Coins', provider: 'Wazdan', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/12-Coins-Grand-Gold-Edition-Santas-Jackpots-Wazdan/Vertical/12CoinsGrandGoldEditionSantasJackpots.webp', category: 'new', rtp: '96.15%' },
  { id: 116, name: '30 Coins', provider: 'Wazdan', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/30-Coins-Santas-Jackpots-Wazdan/Vertical/30CoinsSantasJackpots.webp', category: 'new', rtp: '96.18%' },
  { id: 117, name: 'Flaming Hot', provider: 'EGT Digital', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/FlamingHotExtremeBellLink.webp', category: 'slots', rtp: '95.96%' },
];
// End of Mock Data

const getDemoUrl = (game: any): string | null => {
  if (!game) return null;
  if (game.demoSymbol) {
    return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${game.demoSymbol}&jurisdiction=99&lobbyUrl=https://724bahis.net`;
  }
  
  const nameString = (game.name || game.img || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  let symbol = null;
  
  if (nameString.includes('sweetbonanza')) symbol = 'vs20sweetbonanza';
  else if (nameString.includes('gatesofolympus')) symbol = 'vs20olympgate';
  else if (nameString.includes('sugarrush')) symbol = 'vs20sugarrush';
  else if (nameString.includes('starlightprincess')) symbol = 'vs20starlight';
  else if (nameString.includes('bigbass')) symbol = 'vs10bbbonanza';
  
  if (!symbol) return null;

  return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${symbol}&jurisdiction=99&lobbyUrl=https://724bahis.net`;
};

const getGameColor = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('sweet') || n.includes('sugar') || n.includes('candy') || n.includes('fruit')) return '#E91E63'; // Pink
  if (n.includes('zeus') || n.includes('olympus') || n.includes('thor') || n.includes('gods') || n.includes('kraken')) return '#2962FF'; // Blue
  if (n.includes('bass') || n.includes('splash') || n.includes('fisherman') || n.includes('catch')) return '#00C853'; // Green
  if (n.includes('party') || n.includes('fiesta') || n.includes('magic')) return '#AA00FF'; // Purple
  if (n.includes('gold') || n.includes('dog') || n.includes('rhino') || n.includes('buffalo') || n.includes('lion')) return '#FF6D00'; // Orange
  if (n.includes('gem') || n.includes('diamond') || n.includes('crystal')) return '#00B8D4'; // Cyan
  return '#1565C0'; // Default Blue
};

const GameCard: React.FC<{ game: any, onClick: () => void }> = ({ game, onClick }) => {
  const randomPlayers = React.useMemo(() => Math.floor(Math.random() * 500) + 100, []);
  const players = game.players || randomPlayers;
  
  return (
    <div className="flex flex-col">
      <div 
        className="group relative flex flex-col cursor-pointer rounded-xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.6)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:-translate-y-1" 
        onClick={onClick}
        style={{ aspectRatio: '3/4', backgroundColor: '#111' }}
      >
        {/* Full Image */}
        <img 
          src={game.img || game.image} 
          alt={game.name} 
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 z-10" 
        />

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 bg-black/40 backdrop-blur-[2px]">
          <div className="w-12 h-12 bg-[#f0b90b] rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(240,185,11,0.6)] transform scale-75 group-hover:scale-100 transition-all duration-300">
            <Play fill="currentColor" size={20} className="ml-1" />
          </div>
        </div>
      </div>

      {/* Player Count Below Card */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00e676] shadow-[0_0_5px_#00e676]"></div>
        <span className="text-[#848B9D] text-[10px] sm:text-[11px] font-medium tracking-wide">
          <strong className="text-white">{players}</strong> Oyuncular
        </span>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string, icon?: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center justify-between mb-4 mt-8">
    <div className="flex items-center gap-2">
      {icon && <div className="text-[#00FFA3]">{icon}</div>}
      <h2 className="text-white text-lg font-black tracking-tight">{title}</h2>
    </div>
    <div className="flex gap-2">
      <button className="w-8 h-8 rounded bg-[#1A1D29] hover:bg-[#2A2E3D] flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
        <ChevronLeft size={18} />
      </button>
      <button className="w-8 h-8 rounded bg-[#1A1D29] hover:bg-[#2A2E3D] flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
);

const SliderSection: React.FC<{ title: string, icon?: React.ReactNode, games: any[], onSelect: (g: any) => void }> = ({ title, icon, games, onSelect }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-2">
          {icon && <div className="text-[#00FFA3]">{icon}</div>}
          <h2 className="text-white text-lg font-black tracking-tight">{title}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="w-8 h-8 rounded bg-[#1A1D29] hover:bg-[#2A2E3D] flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button className="px-3 h-8 rounded bg-[#1A1D29] hover:bg-[#2A2E3D] flex items-center justify-center text-[#848B9D] hover:text-white transition-colors text-[13px] font-bold">
            Hepsi
          </button>
          <button onClick={() => scroll('right')} className="w-8 h-8 rounded bg-[#1A1D29] hover:bg-[#2A2E3D] flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <div ref={scrollRef} className="overflow-x-auto hide-scrollbar -mx-4 px-4 pb-4" style={{ scrollSnapType: 'x mandatory' }}>
        <div className="flex gap-4 min-w-max">
          {games.map((game) => (
            <div key={game.id} style={{ width: 'calc(100vw / 2.5 - 16px)', maxWidth: '170px', scrollSnapAlign: 'start' }}>
              <GameCard game={game} onClick={() => onSelect(game)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CasinoLobby: React.FC<{ customGames?: CasinoLobbyGame[], isLoggedIn?: boolean }> = ({ customGames = [], isLoggedIn = false }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showDemoIframe, setShowDemoIframe] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAction = () => {
    if (isLoggedIn) {
      window.dispatchEvent(new Event('openDepositModal'));
    } else {
      window.dispatchEvent(new CustomEvent('open-auth-modal'));
    }
  };

  // Combine ALL_GAMES with customGames
  const allGames = [...ALL_GAMES, ...customGames.map(cg => ({ ...cg, img: cg.image, category: cg.lobbyCategory || 'slots' }))];

  const filteredGames = allGames.filter(game => {
    const matchesTab = activeTab === 'all' || game.category === activeTab;
    const matchesSearch = !searchQuery || (game.name && game.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  // Group games for the 'all' view
  const popularGames = allGames.filter(g => g.isPopular || g.players > 2000).slice(0, 18);
  const liveGames = allGames.filter(g => g.category === 'live').slice(0, 12);
  const newGames = allGames.filter(g => g.category === 'new' || g.isNew).slice(0, 12);

  return (
    <div className="w-full min-h-screen bg-[#0F121A] font-sans pb-24">
      {/* 1. TOP NAVBAR (Gamdom Style) */}
      <div className="sticky top-0 z-40 bg-[#0F121A]/95 backdrop-blur-md border-b border-[#1A1D29] px-4 md:px-8 py-0">
        <div className="max-w-[1600px] mx-auto flex items-center gap-6 overflow-x-auto hide-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 py-4 px-2 whitespace-nowrap text-sm font-bold transition-colors ${
                activeTab === tab.id ? 'text-[#00FFA3]' : 'text-[#848B9D] hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#00FFA3] rounded-t-full shadow-[0_-2px_10px_rgba(0,255,163,0.5)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-6">
        {/* 2. HERO BANNER */}
        {activeTab === 'all' && !searchQuery && (
          <div className="relative w-full aspect-[21/9] md:aspect-[32/9] rounded-xl overflow-hidden mb-8 group bg-[#1A1D29]">
            {BANNERS.map((banner, idx) => (
              <div 
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ${currentBanner === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F121A] via-[#0F121A]/80 to-transparent" />
                
                <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-16 max-w-lg">
                  <h1 className="text-3xl md:text-5xl font-black text-white mb-2 md:mb-4 tracking-tight leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-[#848B9D] text-sm md:text-lg mb-6 font-medium">
                    {banner.sub}
                  </p>
                  <button className="bg-[#00FFA3] hover:bg-[#00E676] text-black px-8 py-3 rounded-lg font-black text-sm uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(0,255,163,0.3)]">
                    Hemen Katıl
                  </button>
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {BANNERS.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentBanner(idx)}
                  className={`h-1.5 rounded-full transition-all ${currentBanner === idx ? 'w-6 bg-[#00FFA3]' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. FILTERS AND SEARCH */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1D29] hover:bg-[#2A2E3D] border border-[#2A2E3D] rounded-lg text-white font-bold transition-colors">
            <Filter size={18} className="text-[#848B9D]" />
            Sağlayıcılar
          </button>

          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848B9D]" size={18} />
            <input 
              type="text" 
              placeholder="Oyun Ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1D29] border border-[#2A2E3D] rounded-lg py-3 pl-12 pr-4 text-white placeholder-[#848B9D] focus:outline-none focus:border-[#00FFA3] transition-colors font-medium"
            />
          </div>
        </div>

        {/* 4. GAME GRIDS */}
        {searchQuery || activeTab !== 'all' ? (
          <div>
            <SectionHeader title={searchQuery ? 'Arama Sonuçları' : TABS.find(t => t.id === activeTab)?.label || 'Oyunlar'} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} />
              ))}
            </div>
            {filteredGames.length === 0 && (
              <div className="w-full py-20 flex flex-col items-center justify-center text-[#848B9D]">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">Oyun bulunamadı</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            
            {/* NEW SLIDER SECTION: Gerçek Oyunlar */}
            <SliderSection 
              title="Gerçek Oyunlar" 
              icon={<Flame className="text-white" fill="white" />} 
              games={customGames.filter(g => g.isActive && g.type === 'slot').length > 0 
                ? customGames.filter(g => g.isActive && g.type === 'slot').map(cg => ({ ...cg, img: cg.image, category: 'slots' })) 
                : popularGames} 
              onSelect={setSelectedGame} 
            />

            <SectionHeader title="Popüler Slotlar" icon={<Flame />} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {popularGames.map(game => (
                <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} />
              ))}
            </div>

            <SectionHeader title="Canlı Casino" icon={<MonitorPlay />} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {liveGames.map(game => (
                <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} />
              ))}
            </div>

            <SectionHeader title="Çok Kazandıranlar" icon={<Flame className="text-[#f0b90b]" />} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {allGames
                .filter(g => g.type === 'slot' || g.category === 'slots')
                .sort((a, b) => b.players - a.players)
                .slice(12, 24)
                .map(game => (
                <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} />
              ))}
            </div>

            <SectionHeader title="Yeni Eklenenler" icon={<Sparkles />} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {newGames.map(game => (
                <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GAME MODAL (Kept similar structure but adapted style) */}
      {selectedGame && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedGame(null);
              setShowDemoIframe(false);
            }
          }}
        >
          {showDemoIframe && getDemoUrl(selectedGame) ? (
            <div className="relative m-auto z-10 w-full max-w-5xl h-[80vh] bg-[#0F121A] rounded-xl overflow-hidden shadow-2xl border border-[#2A2E3D] animate-fade-in flex flex-col">
              <div className="flex items-center justify-between p-4 bg-[#1A1D29] border-b border-[#2A2E3D]">
                <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#00FFA3] animate-pulse shadow-[0_0_10px_rgba(0,255,163,0.8)]" />
                   <span className="text-white font-bold">{selectedGame.name || 'Demo Oyunu'}</span>
                   <span className="bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20 text-[10px] px-2 py-0.5 rounded font-black tracking-widest uppercase ml-2">Eğlence Modu</span>
                </div>
                <button onClick={() => setShowDemoIframe(false)} className="w-8 h-8 flex items-center justify-center bg-[#2A2E3D] hover:bg-[#3A3F54] rounded-lg text-white transition-colors">✕</button>
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
            <div className="relative m-auto z-10 bg-[#1A1D29] rounded-2xl border border-[#2A2E3D] w-full max-w-[400px] shadow-2xl overflow-hidden animate-fade-in">
              <button onClick={() => { setSelectedGame(null); setShowDemoIframe(false); }} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full text-white transition-all z-20 backdrop-blur-sm">✕</button>
              
              <div className="relative aspect-video w-full flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-[#0F121A]">
                  <img src={selectedGame.img || selectedGame.image} className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D29] to-transparent" />
                </div>
                
                <div className="relative z-10 w-24 h-24 mt-8 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                  <img src={selectedGame.img || selectedGame.image} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="relative z-10 px-6 pb-8 pt-4 text-center flex flex-col items-center">
                <h3 className="text-2xl font-black text-white mb-1">{selectedGame.name || 'Casino Slot'}</h3>
                <p className="text-[#00FFA3] text-sm font-bold mb-6">{selectedGame.provider || 'Pragmatic Play'}</p>

                <div className="w-full grid grid-cols-2 gap-3 mb-6 bg-[#0F121A] p-3 rounded-lg border border-[#2A2E3D]">
                  <div className="flex flex-col items-center">
                    <span className="text-[#848B9D] text-xs font-medium mb-1">RTP</span>
                    <span className="text-white font-mono font-bold text-sm">{selectedGame.rtp || '96.50%'}</span>
                  </div>
                  <div className="flex flex-col items-center border-l border-[#2A2E3D]">
                    <span className="text-[#848B9D] text-xs font-medium mb-1">Volatilite</span>
                    <span className="text-white font-bold text-sm">Yüksek</span>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-3">
                  <button 
                     onClick={() => {
                       setSelectedGame(null);
                       setShowDemoIframe(false);
                       handleAction();
                     }}
                     className="w-full py-3.5 rounded-lg font-black text-sm transition-all bg-[#00FFA3] text-black hover:bg-[#00E676] shadow-[0_0_15px_rgba(0,255,163,0.3)]"
                   >
                     Gerçek Parayla Oyna
                   </button>

                  {getDemoUrl(selectedGame) && (
                    <button 
                       onClick={() => setShowDemoIframe(true)}
                       className="w-full py-3.5 rounded-lg font-bold text-sm transition-all bg-[#2A2E3D] text-white hover:bg-[#3A3F54] flex items-center justify-center gap-2"
                     >
                       <Play size={16} className="text-[#00FFA3]" fill="currentColor" />
                       Eğlencesine Oyna
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
  );
};

export default CasinoLobby;
