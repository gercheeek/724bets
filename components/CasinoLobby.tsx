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
import LiveWinsMarquee from './LiveWinsMarquee';


const TABS = [
  { id: 'all', label: 'Tümü', icon: <Grid2X2 size={16} /> },
  { id: 'pragmatic', label: 'Pragmatic Play', icon: <Flame size={16} /> },
  { id: 'blueprint', label: 'Blueprint', icon: <Crown size={16} /> },
  { id: 'egt-digital', label: 'EGT Digital', icon: <Flame size={16} /> },
  { id: 'egt-amusnet', label: 'EGT Amusnet', icon: <Flame size={16} /> },
  { id: 'novomatic', label: 'Novomatic', icon: <Star size={16} /> },
  { id: 'slots', label: 'Slotlar', icon: <Flame size={16} /> },
  { id: 'live', label: 'Canlı Casino', icon: <MonitorPlay size={16} /> },
  { id: 'popular', label: 'Popüler', icon: <Star size={16} /> },
  { id: 'new', label: 'Yeni Eklenenler', icon: <Sparkles size={16} /> },
  { id: 'megaways', label: 'Megaways', icon: <Flame size={16} /> },
  { id: 'bonusbuy', label: 'Bonus Satın Al', icon: <Star size={16} /> },
  { id: 'holdwin', label: 'Hold & Win', icon: <Crown size={16} /> },
];

const BANNERS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=1200&auto=format&fit=crop', title: '5.000₺ Hoş Geldin Bonusu', sub: 'İlk yatırımınıza özel fırsatı kaçırmayın' },
  { id: 2, image: '/images/cashback_boss.jpg', title: 'Haftalık %20 Cashback', sub: 'Kayıplarınızı anında telafi edin' },
];


import { getGameLaunchUrl } from '../utils/gameLauncher';

const BONUSBUY_GAMES: string[] = [];

// End of Mock Data

const getDemoUrl = (game: any): string | null => {
  if (!game) return null;
  return getGameLaunchUrl(game);
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

const SectionHeader: React.FC<{ title: string, iconColor?: string, onViewAll?: () => void, onScrollLeft?: () => void, onScrollRight?: () => void }> = ({ title, iconColor = '#00E5FF', onViewAll, onScrollLeft, onScrollRight }) => (
  <div className="flex items-center justify-between mb-4 mt-8 px-1 md:px-0">
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center h-[10px] w-[10px] rounded-full border shadow-md" style={{ borderColor: `${iconColor}80`, backgroundColor: `${iconColor}33`, boxShadow: `0 0 10px ${iconColor}99` }}>
        <span className="h-[4px] w-[4px] rounded-full" style={{ backgroundColor: iconColor, boxShadow: `0 0 5px ${iconColor}` }}></span>
      </div>
      <h2 className="text-white text-[12px] md:text-[14px] font-black tracking-wide uppercase">{title}</h2>
    </div>
    <div className="flex items-center gap-2">
      {onViewAll && (
        <button onClick={onViewAll} className="text-[11px] md:text-xs font-black text-white hover:text-white transition-all flex items-center gap-1 group cursor-pointer border border-[#00E5FF]/30 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.2)] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] uppercase tracking-wider">
          <span>Tümünü Gör</span>
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform text-[#00E5FF] drop-shadow-[0_0_3px_#00E5FF]" />
        </button>
      )}
      {(onScrollLeft || onScrollRight) && (
        <div className="flex items-center gap-1">
          <button onClick={onScrollLeft} className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={onScrollRight} className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  </div>
);

const SliderSection: React.FC<{ title: string, iconColor?: string, games: any[], onSelect: (g: any) => void, onViewAll?: () => void }> = ({ title, iconColor, games, onSelect, onViewAll }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (!games || games.length === 0) return null;

  return (
    <div className="mb-10">
      <SectionHeader 
        title={title} 
        iconColor={iconColor} 
        onViewAll={onViewAll} 
        onScrollLeft={() => scroll('left')} 
        onScrollRight={() => scroll('right')} 
      />
      
      <div ref={scrollRef} className="flex overflow-x-auto hide-scrollbar gap-2 md:gap-3 pb-4 px-1 md:px-0 relative" style={{ scrollSnapType: 'x mandatory' }}>
        {games.map((game, i) => (
          <div key={`${game.id}-${i}`} className="w-[120px] md:w-[140px] flex-shrink-0 animate-in fade-in duration-500" style={{ scrollSnapAlign: 'start' }}>
            <GameCard game={game} onClick={() => onSelect(game)} />
          </div>
        ))}
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
  const dynamicOriginals: any[] = getOriginalsData(t);

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
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  
  const [displayLimit, setDisplayLimit] = useState(120);
  const [sortOption, setSortOption] = useState('popular');

  useEffect(() => {
    setDisplayLimit(120);
  }, [activeTab, searchQuery, selectedProvider]);

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
    
    // Sadece Popüler skorlamasına göre üstte yer alan oyunları al ve benzer isimleri filtrele
    const popularPool = allGames.filter(g => getPopularityScore(g.name || '') > 0).sort((a, b) => getPopularityScore(b.name || '') - getPopularityScore(a.name || ''));
    
    const seenBases = new Set<string>();
    const deduplicatedPopular = popularPool.filter(g => {
      const base = (g.name || '').toLowerCase().replace(/1000|dice|super|scatter|megaways/g, '').trim();
      if (seenBases.has(base)) return false;
      seenBases.add(base);
      return true;
    });

    setDynamicNewGames(shuffleGamesList(newPool).slice(0, 14));
    setDynamicPopularGames((deduplicatedPopular.length >= 6 ? deduplicatedPopular : popularPool).slice(0, 18));
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
    const imageUrl = (game.img || game.image || '').toLowerCase();
    
    const isPlaceholder = imageUrl.includes('unsplash') || 
                          imageUrl.includes('picsum.photos') || 
                          imageUrl.includes('placehold') || 
                          imageUrl.includes('loremflickr') ||
                          imageUrl.includes('freepik') ||
                          imageUrl.includes('dummyimage') ||
                          imageUrl.includes('stock') ||
                          imageUrl.includes('mockup');

    if (isPlaceholder) return false;
    
    const providerLower = (game.provider || '').toLowerCase();
    
    if (activeTab === 'all') {
      matchesTab = true;
    } else if (activeTab === 'pragmatic') {
      matchesTab = providerLower.includes('pragmatic');
    } else if (activeTab === 'blueprint') {
      matchesTab = providerLower.includes('blueprint');
    } else if (activeTab === 'egt-digital') {
      matchesTab = providerLower.includes('egt digital');
    } else if (activeTab === 'egt-amusnet') {
      matchesTab = providerLower.includes('egt amusnet') || providerLower.includes('amusnet');
    } else if (activeTab === 'novomatic') {
      matchesTab = providerLower.includes('novomatic');
    } else if (activeTab === 'popular') {
      const popularKeywords = [
        'olympus', 'bonanza', 'sugar rush', 'starlight princess', 
        'bandit', 'bass splash', 'dog house', 'reactoonz', 'book of dead',
        'crazy time', 'lightning roulette', 'aviator', 'hades', 'zeus',
        'fruit party', 'le santa', 'shining crown', 'hot extreme', 'bulky fruits'
      ];
      matchesTab = popularKeywords.some(keyword => gameName.includes(keyword)) && !gameName.includes('dice') && !gameName.includes('candyland');
    } else if (activeTab === 'slots') {
      matchesTab = game.category === 'slots' || game.type !== 'live';
    } else if (activeTab === 'live') {
      matchesTab = game.category === 'live' || game.type === 'live';
    } else if (activeTab === 'new' || activeTab === 'yeni') {
      matchesTab = game.category === 'new' || game.isNew || gameName.includes('yeni') || gameName.includes('new');
    } else if (activeTab === 'megaways') {
      matchesTab = gameName.includes('megaways');
    } else if (activeTab === 'bonusbuy' || activeTab === 'bonus') {
      matchesTab = gameName.includes('bonus') || gameName.includes('buy');
    } else if (activeTab === 'egt') {
      matchesTab = providerLower.includes('egt') || providerLower.includes('amuso') || gameName.includes('hot');
    } else if (activeTab === 'holdwin') {
      matchesTab = gameName.includes('hold') || gameName.includes('win');
    } else if (activeTab === 'originals') {
      matchesTab = game.category === 'originals' || game.provider === 'Originals';
    } else {
      matchesTab = true;
    }

    let matchesProvider = true;
    if (selectedProvider !== 'all') {
      matchesProvider = providerLower === selectedProvider.toLowerCase();
    }

    const matchesSearch = !searchQuery || 
      (game.name && game.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (game.provider && game.provider.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesProvider && matchesSearch;
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
              placeholder="Oyun veya sağlayıcı ara (1.274+ oyun)..."
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
          
          <div className="flex flex-wrap items-center gap-3">
            {/* PROVIDER FILTER */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-gray-400 mr-1">
                <Disc size={18} />
                <span className="text-sm font-semibold hidden sm:inline">Sağlayıcı:</span>
              </div>
              <select 
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="bg-[#1A1F2D] text-white text-sm font-semibold px-4 py-2.5 rounded-lg border border-white/10 outline-none hover:border-white/20 focus:border-[#00E5FF]/50 transition-all cursor-pointer min-w-[150px]"
              >
                <option value="all">Tüm Sağlayıcılar ({allGames.length})</option>
                <option value="pragmatic play">Pragmatic Play ({allGames.filter(g => (g.provider||'').toLowerCase().includes('pragmatic')).length})</option>
                <option value="blueprint">Blueprint ({allGames.filter(g => (g.provider||'').toLowerCase().includes('blueprint')).length})</option>
                <option value="egt digital">EGT Digital ({allGames.filter(g => (g.provider||'').toLowerCase().includes('egt digital')).length})</option>
                <option value="egt amusnet">EGT Amusnet ({allGames.filter(g => (g.provider||'').toLowerCase().includes('amusnet')).length})</option>
                <option value="novomatic">Novomatic ({allGames.filter(g => (g.provider||'').toLowerCase().includes('novomatic')).length})</option>
              </select>
            </div>

            {/* SORTING */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-gray-400 mr-1">
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
      </div>

      <div className="w-full max-w-[1720px] mx-auto px-4 md:px-8 xl:px-12 pt-6 min-w-0">
        {/* 4. GAME GRIDS */}
        <div>
          {activeTab === 'all' && selectedProvider === 'all' && !searchQuery && (
            <>
              <SliderSection 
                title="Popüler Oyunlar" 
                iconColor="#F59E0B"
                games={dynamicPopularGames}
                onSelect={handleGameSelect}
                onViewAll={() => handleTabChange('popular')}
              />
              <SliderSection 
                title="Orijinal Oyunlar" 
                iconColor="#10B981"
                games={dynamicOriginals}
                onSelect={(g) => {
                  if (onNavigate) onNavigate(g.path || 'pool');
                }}
              />
              <SliderSection 
                title="Yeni Oyunlar" 
                iconColor="#00E5FF"
                games={dynamicNewGames}
                onSelect={handleGameSelect}
                onViewAll={() => handleTabChange('new')}
              />
            </>
          )}

          <SectionHeader 
            title={
              searchQuery 
                ? `Arama Sonuçları (${filteredGames.length} Oyun)` 
                : `${activeTab === 'all' ? (selectedProvider !== 'all' ? selectedProvider.toUpperCase() : 'Tüm Oyunlar') : (TABS.find(t => t.id === activeTab)?.label || 'Oyunlar')} (${filteredGames.length} Oyun)`
            } 
          />
          
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2 md:gap-4 w-full px-1 md:px-0">
            {filteredGames.slice(0, displayLimit).map((game) => (
              <GameCard key={game.id} game={game} onClick={() => handleGameSelect(game)} />
            ))}
          </div>
          
          {filteredGames.length > displayLimit && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8 mb-12">
              <button 
                onClick={() => setDisplayLimit(prev => prev + 120)}
                className="px-6 py-3 bg-[#1A1F2D] hover:bg-[#00E5FF]/20 text-[#00E5FF] font-black rounded-lg transition-all border border-[#00E5FF]/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer text-sm"
              >
                Daha Fazla Göster (+120)
              </button>
              <button 
                onClick={() => setDisplayLimit(filteredGames.length)}
                className="px-6 py-3 bg-gradient-to-r from-[#00E5FF]/20 to-purple-500/20 hover:from-[#00E5FF]/30 hover:to-purple-500/30 text-white font-black rounded-lg transition-all border border-white/10 hover:border-[#00E5FF]/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer text-sm"
              >
                Tümünü Göster ({filteredGames.length} Oyun)
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

