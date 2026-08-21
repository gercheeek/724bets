import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Play, Filter, Grid2X2, Crown, MonitorPlay, Disc, Sparkles, Flame, Star, StarHalf, Shuffle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { VirtuosoGrid } from 'react-virtuoso';
import { CasinoLobbyGame } from '../types';
import { ALL_GAMES, DEMO_GAMES } from '../data/games';
import { useLanguage } from '../contexts/LanguageContext';
import { useGames } from '../contexts/GameContext';
import { getOriginalsData } from './OriginalsSlider';
import { PopularLiveWidget } from './PopularLiveWidget';
import { GamePlayView } from './GamePlayView';
import rawCasinoData from '../data/slotra_casino.json';

const LIVE_CASINO_GAMES = rawCasinoData.map((game: any, index: number) => ({
  id: `live-slotra-${index}`,
  name: game.name.replace('Game thumb - ', ''),
  img: game.image,
  category: 'live',
  provider: 'Live Casino'
}));
const TABS = [
  { id: 'all', label: 'Tümü', icon: <Grid2X2 size={16} /> },
  { id: 'live', label: 'Canlı Casino', icon: <MonitorPlay size={16} /> },
  { id: 'popular', label: 'Popüler', icon: <Star size={16} /> },
  { id: 'slots', label: 'Slotlar', icon: <Flame size={16} /> },
  { id: 'egt', label: 'EGT', icon: <Flame size={16} /> },
  { id: 'new', label: 'Yeni Eklenenler', icon: <Sparkles size={16} /> },
  { id: 'holdwin', label: 'Hold & Win', icon: <Crown size={16} /> },
  { id: 'megaways', label: 'Megaways', icon: <Flame size={16} /> },
  { id: 'bonusbuy', label: 'Bonus Satın Al', icon: <Star size={16} /> },
];

const BANNERS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=1200&auto=format&fit=crop', title: '5.000₺ Hoş Geldin Bonusu', sub: 'İlk yatırımınıza özel fırsatı kaçırmayın' },
  { id: 2, image: '/images/cashback_boss.jpg', title: 'Haftalık %20 Cashback', sub: 'Kayıplarınızı anında telafi edin' },
];


const BONUSBUY_GAMES: string[] = [];

// End of Mock Data

const getDemoUrl = (game: any): string | null => {
  if (!game) return null;
  
  const nameString = (game.name || game.img || game.image || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  let symbol = game.demoSymbol || 'vs20olympx'; // Fallback

  if (!game.demoSymbol) {
    if (nameString.includes('sweetbonanza1000')) symbol = 'vs20fruitswx';
    else if (nameString.includes('sweetbonanza')) symbol = 'vs20fruitsw';
    else if (nameString.includes('gatesofolympus1000')) symbol = 'vs20olympx';
    else if (nameString.includes('gatesofolympus')) symbol = 'vs20olympgate';
    else if (nameString.includes('sugarrush1000')) symbol = 'vs20sugarrushx';
    else if (nameString.includes('sugarrush')) symbol = 'vs20sugarrush';
    else if (nameString.includes('starlightprincess1000')) symbol = 'vs20starlightx';
    else if (nameString.includes('starlightprincess')) symbol = 'vs20starlight';
    else if (nameString.includes('bigbasssplash')) symbol = 'vs10txbigbass';
    else if (nameString.includes('bigbassbonanza')) symbol = 'vs10bbbonanza';
    else if (nameString.includes('zeus') || nameString.includes('hades')) symbol = 'vs20zeushades';
    else if (nameString.includes('doghouse')) symbol = 'vs20doghouse';
    else if (nameString.includes('fruitparty')) symbol = 'vs20fruitparty';
  }
  
  return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${symbol}&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&enviroment=PREPROD&m=1`;
};

const getDisplayGameName = (game: any) => {
  if (game.name && game.name !== 'Yeni Slot Oyunu' && game.name !== 'Yeni Canlı Masa' && game.name !== 'Yeni Spor') {
    return game.name;
  }
  // Try to extract from URL if name is default
  const url = game.img || game.image || '';
  if (url) {
    const match = url.match(/\/Games\/([^\/]+)\//i);
    if (match && match[1]) {
      return match[1].replace(/-/g, ' ').replace(/PragmaticPlay|Pragmatic Play/ig, '').trim();
    }
  }
  return game.name || 'Casino Slot';
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

import { BaseGameCard, GameCard, NewGameCard } from './GameCards';

const SectionHeader: React.FC<{ title: string, icon?: React.ReactNode, onViewAll?: () => void, onScrollLeft?: () => void, onScrollRight?: () => void }> = ({ title, icon, onViewAll, onScrollLeft, onScrollRight }) => (
  <div className="flex items-center justify-between mb-4 mt-8 px-1 md:px-0">
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center h-[10px] w-[10px] rounded-full bg-[#00E5FF]/20 border border-[#00E5FF]/50 shadow-[0_0_10px_rgba(0,229,255,0.6)]">
        <span className="h-[4px] w-[4px] rounded-full bg-[#00E5FF] shadow-[0_0_5px_#00E5FF]"></span>
      </div>
      <h2 className="text-white text-[12px] md:text-[14px] font-black tracking-wide uppercase">{title}</h2>
    </div>
    <div className="flex gap-2 items-center">
      {onViewAll && (
        <button className="btn-secondary-modern" onClick={onViewAll}>
          Tümünü gör
        </button>
      )}
      {(onScrollLeft || onScrollRight) && (
        <>
          <button onClick={onScrollLeft} className="btn-icon-modern">
            <ChevronLeft size={20} />
          </button>
          <button onClick={onScrollRight} className="btn-icon-modern">
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  </div>
);

const SliderSection: React.FC<{ title: string, icon?: React.ReactNode, games: any[], onSelect: (g: any) => void, onDemo: (g: any) => void }> = ({ title, icon, games, onSelect, onDemo }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <SectionHeader 
        title={title} 
        icon={icon} 
        onViewAll={() => {}} 
        onScrollLeft={() => scroll('left')} 
        onScrollRight={() => scroll('right')} 
      />
      
      <div ref={scrollRef} className="overflow-x-auto hide-scrollbar -mx-4 px-4 pb-6 pt-2" style={{ scrollSnapType: 'x mandatory' }}>
        <div className="flex gap-3 md:gap-4 min-w-max">
          {games.map((game, i) => (
            <div key={`${game.id}-${i}`} className="w-[110px] sm:w-[120px] md:w-[130px] lg:w-[140px] xl:w-[150px]" style={{ flexShrink: 0, scrollSnapAlign: 'start' }}>
              <GameCard game={game} onClick={() => onSelect(game)} onDemoClick={() => onDemo(game)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import GuestLanding from './GuestLanding';

export default function CasinoLobby({ 
  onNavigate, 
  customGames = [],
  isLoggedIn = false,
  initialTab
}: { 
  onNavigate: (view: string, gameData?: any) => void, 
  customGames?: any[],
  isLoggedIn?: boolean,
  initialTab?: string
}) {
  const { t } = useLanguage();
  const dynamicOriginals: any[] = [];

  const [activeTab, setActiveTab] = useState(initialTab || 'all');
  const [currentPath, setCurrentPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '');

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (initialTab && currentPath.includes(initialTab)) {
      setActiveTab(initialTab);
    } else if (currentPath) {
      if (currentPath.includes('/canli-casino')) {
        setActiveTab('live');
      } else if (currentPath.match(/\/casino\/([^\/]+)/)) {
        const match = currentPath.match(/\/casino\/([^\/]+)/);
        if (match && match[1]) {
           const tabId = match[1];
           if (TABS.find(t => t.id === tabId)) setActiveTab(tabId);
           else setActiveTab('all');
        }
      } else if (currentPath.endsWith('/casino')) {
        setActiveTab('all');
      }
    }
  }, [currentPath, initialTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const lang = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'tr';
    const langPrefix = ['tr', 'en', 'pt', 'es'].includes(lang) ? lang : 'tr';
    
    if (tabId === 'live') {
      window.history.pushState(null, '', `/${langPrefix}/canli-casino`);
    } else if (tabId === 'all') {
      window.history.pushState(null, '', `/${langPrefix}/casino`);
    } else {
      window.history.pushState(null, '', `/${langPrefix}/casino/${tabId}`);
    }
  };
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [displayLimit, setDisplayLimit] = useState(100);
  const [sortOption, setSortOption] = useState('popular');

  useEffect(() => {
    setDisplayLimit(100);
  }, [activeTab, searchQuery]);

  const [showProviders, setShowProviders] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showDemoIframe, setShowDemoIframe] = useState(false);

  const [shuffledAllGames, setShuffledAllGames] = useState<any[]>([]);
  const [dynamicNewGames, setDynamicNewGames] = useState<any[]>([]);
  const [dynamicPopularGames, setDynamicPopularGames] = useState<any[]>([]);
  const { games: oroGames, isLoading } = useGames();


  const shuffleGamesList = (gamesArray: any[]) => {
    const arr = [...gamesArray];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const allGames: any[] = oroGames.length > 0 ? (shuffledAllGames.length > 0 ? shuffledAllGames : oroGames) : [];

  const handleShuffle = () => {
    setShuffledAllGames(shuffleGamesList(allGames));
  };

  useEffect(() => {
    const newPool = allGames.filter(g => g.category === 'new' || g.isNew || (g.name || '').toLowerCase().includes('yeni'));
    
    // Sadece Popüler skorlamasına göre üstte yer alan oyunları al
    const popularPool = allGames.filter(g => getPopularityScore(g.name || '') > 0).sort((a, b) => getPopularityScore(b.name || '') - getPopularityScore(a.name || ''));
    
    setDynamicNewGames(shuffleGamesList(newPool).slice(0, 14));
    setDynamicPopularGames(popularPool.slice(0, 20));
  }, [allGames]);

  useEffect(() => {
    if (oroGames.length > 0) {
      setShuffledAllGames(oroGames);
    }
  }, [oroGames]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleGameSelect = (game: any) => {
    if (game.category === 'originals' || game.provider === 'Originals' || game.name === 'Plinko' || game.name === 'Chicken Run' || game.name === 'Mission Uncrossable') {
      let path = game.name.toLowerCase().replace(/\s+/g, '-');
      if (path === 'mission-uncrossable') path = 'chicken-run';
      if (onNavigate) {
        onNavigate(path);
      }
    } else {
      setSelectedGame(game);
      setShowDemoIframe(true);
    }
  };

  const handleAction = () => {
    if (isLoggedIn) {
      window.dispatchEvent(new Event('openDepositModal'));
    } else {
      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'login' }));
    }
  };

  const filteredGames = allGames.filter(game => {
    let matchesTab = false;
    const gameName = (game.name || '').toLowerCase();
    
    if (activeTab === 'all') {
      matchesTab = true;
    } else if (activeTab === 'popular') {
      // Custom logic for popular (Kesin isimler kullanarak varyasyonları filtrele)
      const premiumExactNames = [
        'gates of olympus 1000', 'gates of olympus super scatter', 'sweet bonanza', 'sweet bonanza 1000', 
        'le bandit', 'sweet bonanza 2500', 'sugar rush 1000', 'big bass bonanza 1000', 'gates of olympus', 
        'starlight princess super scatter', 'sweet bonanza dice', 'skull fiesta', 'sweet bonanza xmas', 
        'duck hunters: happy hour', 'starlight princess 1000', 'le santa', 'big bass splash 1000', 
        'big bass vegas double down deluxe', 'big bass bonanza', 'sugar rush super scatter', 
        'bigger bass bonanza', 'shining dice', 'gates of olympus xmas 1000', 'flaming hot extreme bell link', 
        'clover gold', 'big bass halloween', 'sweet rush bonanza', 'mythical treasure', 
        'sweet bonanza super scatter', 'big bass splash', 'gold party', '7 clovers of fortune', 
        'better barn house bonanza', 'big bass secrets of the golden lake', 'wisdom of athena 1000 xmas', 
        'the dog house megaways 1000', 'christmas big bass bonanza', 'big bass christmas – frozen lake', 
        'fortune of olympus', 'wisdom of athena 1000', 'wild wild riches', 'big bass - hold & spinner', 
        '777 wheel blitz', 'epic ze zeus', '40 super hot bell link', '40 burning hot bell link', 
        'tanked', 'lobster house', 'dork unit', '40 shining crown bell link', 'queenie', 'seker bey bell link', 
        'shining crown', 'duck hunters', 'wild wild riches megaways', 'monkey warrior', 'aztec treasure', 
        'vampires vs wolves', 'hot chilli', 'tree of riches', 'john hunter and the tomb of the scarab queen', 
        'super joker', 'fire strike', 'hercules and pegasus', 'greek gods', 'money mouse', 'buffalo king', 
        'magic journey', 'release the kraken', 'super 7s', 'master joker', 'lucky dragons', 'journey to the west', 
        'jurassic giants', '888 dragons', '3 genie wishes', 'hercules son of zeus', 'dragon kingdom', 
        'ancient egypt classic', 'triple dragons', 'dwarven gold deluxe', 'romeo and juliet', 
        'hockey league wild match'
      ];
      
      const normGameName = gameName.trim().replace(/[^a-z0-9 ]/g, "");
      const hitIndex = premiumExactNames.findIndex(name => {
        const normName = name.replace(/[^a-z0-9 ]/g, "");
        return normName === normGameName || normName.includes(normGameName) || normGameName.includes(normName);
      });
      matchesTab = hitIndex !== -1;
    } else if (activeTab === 'slots') {
      matchesTab = game.category === 'slots';
    } else if (activeTab === 'live') {
      matchesTab = game.category === 'live';
    } else if (activeTab === 'new' || activeTab === 'yeni') {
      matchesTab = game.category === 'new' || game.isNew || gameName.includes('yeni') || gameName.includes('new');
    } else if (activeTab === 'megaways') {
      matchesTab = gameName.includes('megaways');
    } else if (activeTab === 'bonusbuy' || activeTab === 'bonus') {
      matchesTab = gameName.includes('bonus') || gameName.includes('buy');
    } else if (activeTab === 'egt') {
      matchesTab = (game.provider || '').toLowerCase().includes('egt') || (game.provider || '').toLowerCase().includes('amuso') || gameName.includes('hot');
    } else if (activeTab === 'holdwin') {
      matchesTab = gameName.includes('hold') || gameName.includes('win');
    } else if (activeTab === 'originals') {
      matchesTab = game.category === 'originals' || game.provider === 'Originals';
    } else {
      matchesTab = true;
    }
    const matchesSearch = !searchQuery || 
      (game.name && game.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (game.provider && game.provider.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  }).sort((a, b) => {
    if (sortOption === 'az') return (a.name || '').localeCompare(b.name || '');
    if (sortOption === 'za') return (b.name || '').localeCompare(a.name || '');
    
    // Popularity weighting for 'popular' sorting or default
    const popA = getPopularityScore(a.name || '');
    const popB = getPopularityScore(b.name || '');
    if (popA !== popB) return popB - popA; // Higher score comes first

    return 0;
  });

  function getPopularityScore(name: string) {
    const n = name.toLowerCase();
    if (n.includes('sweet bonanza 1000')) return 100;
    if (n.includes('gates of olympus 1000')) return 99;
    if (n.includes('sugar rush 1000')) return 98;
    if (n.includes('starlight princess 1000')) return 97;
    if (n.includes('sweet bonanza')) return 96;
    if (n.includes('gates of olympus')) return 95;
    if (n.includes('sugar rush')) return 94;
    if (n.includes('starlight princess')) return 93;
    if (n.includes('big bass')) return 90;
    if (n.includes('dog house')) return 85;
    if (n.includes('fruit party')) return 80;
    if (n.includes('megaways')) return 70;
    return 0;
  }

  // Group games for the 'all' view
  const popularGames = allGames.filter(g => getPopularityScore(g.name || '') > 0).sort((a, b) => getPopularityScore(b.name || '') - getPopularityScore(a.name || '')).slice(0, 18);
  const liveGames = allGames.filter(g => g.category === 'live').slice(0, 12);
  const newGames = allGames.filter(g => g.category === 'new' || g.isNew).slice(0, 12);

  const handleGameClick = (game: any) => {
    const gameName = (game.name || '').toLowerCase();
    
    // Always route our Originals to their native views, regardless of provider string
    if (gameName.includes('blackjack')) {
      onNavigate && onNavigate('blackjack-pro');
      return;
    }
    if (gameName.includes('plinko')) {
      onNavigate && onNavigate('plinko');
      return;
    }
    if (gameName.includes('limbo')) {
      onNavigate && onNavigate('limbo');
      return;
    }

    if (game.provider === 'Originals') {
      setSelectedGame(game);
      setShowDemoIframe(true);
      return;
    }
    
    setSelectedGame(game);
    setShowDemoIframe(true);
  };

  // Handle global close games event
  useEffect(() => {
    const handleCloseGames = () => {
      setShowDemoIframe(false);
      setSelectedGame(null);
    };
    window.addEventListener('closeAllGames', handleCloseGames);
    return () => window.removeEventListener('closeAllGames', handleCloseGames);
  }, []);

  const handleDemoClick = (game: any) => {
    const gameName = (game.name || '').toLowerCase();
    if (game.provider === 'Originals' || gameName.includes('blackjack') || gameName.includes('plinko') || gameName.includes('limbo')) {
      handleGameSelect(game);
      return;
    }
    setSelectedGame(game);
    setShowDemoIframe(true);
  };

  if (selectedGame && showDemoIframe) {
    return (
      <GamePlayView 
        game={selectedGame}
        demoUrl={getDemoUrl(selectedGame) || ''}
        onClose={() => { setShowDemoIframe(false); setSelectedGame(null); }}
        onViewChange={onNavigate}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-transparent text-white min-w-0 pb-[70px] lg:pb-0">
      {/* 1. TOP NAVBAR (Neon Stake Style) */}
      <div className="sticky top-0 z-40 bg-[#0A0C10]/90 backdrop-blur-xl border-b border-white/5 py-3 shadow-md">
        <div className="max-w-[1720px] mx-auto flex items-center justify-start gap-2 md:gap-3 overflow-x-auto hide-scrollbar px-4 md:px-8 xl:px-12">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === tab.id ? 'bg-[#1A1F2D] text-white shadow-md' : 'text-[#848B9D] hover:bg-[#1A1F2D]/50 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* 2. SEARCH AND SORTING FRAME */}
      <div className="max-w-[1720px] mx-auto w-full px-4 md:px-8 xl:px-12 mt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-[#111317]/80 rounded-xl border border-white/5 shadow-sm">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Oyun veya sağlayıcı ara..."
              className="w-full bg-[#1A1F2D] text-white text-sm font-semibold pl-10 pr-4 py-2.5 rounded-lg border border-white/10 outline-none focus:border-[#00E5FF]/50 focus:ring-1 focus:ring-[#00E5FF]/50 transition-all placeholder-gray-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* SORTING */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-gray-400 mr-2">
              <Filter size={18} />
              <span className="text-sm font-semibold hidden sm:inline">Sıralama:</span>
            </div>
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-[#1A1F2D] text-white text-sm font-semibold px-4 py-2.5 rounded-lg border border-white/10 outline-none hover:border-white/20 focus:border-[#00E5FF]/50 transition-all cursor-pointer min-w-[140px]"
            >
              <option value="popular">En Popülerler</option>
              <option value="az">A'dan Z'ye</option>
              <option value="za">Z'den A'ya</option>
              <option value="rtp">En Yüksek RTP</option>
              <option value="newest">En Yeniler</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1720px] mx-auto px-4 md:px-8 xl:px-12 pt-6 min-w-0">
        {/* Slider removed as requested */}

        {/* Filters and search removed as requested */}

        {/* 4. GAME GRIDS */}
        <div>
          {activeTab === 'all' && !searchQuery && dynamicPopularGames.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4 px-1 md:px-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-[10px] w-[10px] rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/50 shadow-[0_0_10px_rgba(245,158,11,0.6)]">
                    <span className="h-[4px] w-[4px] rounded-full bg-[#F59E0B] shadow-[0_0_5px_#F59E0B]"></span>
                  </div>
                  <h2 className="text-white text-[12px] md:text-[14px] font-black tracking-wide uppercase">Popüler Oyunlar</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-[11px] md:text-xs font-black text-white hover:text-white transition-all flex items-center gap-1 group cursor-pointer border border-[#00E5FF]/30 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.2)] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] uppercase tracking-wider">
                    <span>Tümünü Gör</span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform text-[#00E5FF] drop-shadow-[0_0_3px_#00E5FF]" />
                  </button>
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <button className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3 w-full animate-fade-in relative px-1 md:px-0">
                {dynamicPopularGames.map((game) => (
                  <div key={game.id} className="animate-in fade-in duration-500">
                    <GameCard game={game} onClick={() => handleGameSelect(game)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'all' && !searchQuery && dynamicNewGames.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4 px-1 md:px-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-[10px] w-[10px] rounded-full bg-[#00E5FF]/20 border border-[#00E5FF]/50 shadow-[0_0_10px_rgba(0,229,255,0.6)]">
                    <span className="h-[4px] w-[4px] rounded-full bg-[#00E5FF] shadow-[0_0_5px_#00E5FF]"></span>
                  </div>
                  <h2 className="text-white text-[12px] md:text-[14px] font-black tracking-wide uppercase">Yeni</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-[11px] md:text-xs font-black text-white hover:text-white transition-all flex items-center gap-1 group cursor-pointer border border-[#00E5FF]/30 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.2)] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] uppercase tracking-wider">
                    <span>Tümünü Gör</span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform text-[#00E5FF] drop-shadow-[0_0_3px_#00E5FF]" />
                  </button>
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <button className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3 w-full animate-fade-in relative px-1 md:px-0">
                {dynamicNewGames.map((game) => (
                  <div key={game.id} className="animate-in fade-in duration-500">
                    <GameCard game={game} onClick={() => handleGameSelect(game)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <SectionHeader title={searchQuery ? 'Arama Sonuçları' : (activeTab === 'all' ? 'Tüm Oyunlar' : (TABS.find(t => t.id === activeTab)?.label || 'Oyunlar'))} />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 w-full px-1 md:px-0">
            {filteredGames.slice(0, displayLimit).map((game) => (
              <GameCard key={game.id} game={game} onClick={() => handleGameSelect(game)} />
            ))}
          </div>
          
          {filteredGames.length > displayLimit && (
            <div className="flex justify-center mt-8 mb-12">
              <button 
                onClick={() => setDisplayLimit(prev => prev + 100)}
                className="px-8 py-3 bg-[#1A1F2D] hover:bg-[#00E5FF]/20 text-[#00E5FF] font-black rounded-lg transition-all border border-[#00E5FF]/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]"
              >
                Daha Fazla Oyun Göster ({filteredGames.length - displayLimit})
              </button>
            </div>
          )}
          
          {filteredGames.length === 0 && (
            <div className="w-full py-20 flex flex-col items-center justify-center text-[#848B9D]">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Oyun bulunamadı</p>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

