import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './ThemeContext';
import Header from './components/Header';
import { Crown, Trophy, Calendar, TrendingUp, Clock, ArrowRight, Shield } from 'lucide-react';
import { getFlagUrl } from './components/MatchResultsWidget';
import AppLoader from './components/AppLoader';
import BrandCard from './components/BrandCard';
import AdminPanel from './components/AdminPanel';
import ErrorBoundary from './components/ErrorBoundary';
import AuthModal from './components/AuthModal';
import AnalysisView from './components/AnalysisView';
import BlackjackGame from './components/BlackjackGame';
import PromoPopup from './components/PromoPopup';
import MaintenanceScreen from './components/MaintenanceScreen';
import ChatBot from './components/ChatBot';
import ModernChat from './components/ModernChat';
import PromoWheel from './components/PromoWheel';
import GiveawayView, { DEFAULT_GIVEAWAY_CONFIG } from './components/GiveawayView';
import SearchModal from './components/SearchModal';
import LoyaltyPanel, { DEFAULT_LOYALTY_CONFIG } from './components/LoyaltyPanel';
import RaffleView from './components/RaffleView';
import CekilisCenterView from './components/CekilisCenterView';
import PoolGame from './components/PoolGame';
import EnhancedBetting from './components/EnhancedBetting';
import { seedEcosystemData } from './seedEcosystem';
import { getGlobalConfig, updateGlobalConfig, supabase } from './utils/supabase';
import { NavVisibility, DEFAULT_NAV_VISIBILITY } from './components/Header';
import { BRANDS as INITIAL_BRANDS } from './constants';
import { Brand, Coupon, BlackjackConfig, WheelConfig, SiteUser, LoyaltyConfig, PromoWheelConfig, GiveawayConfig, MarqueeConfig, WelcomePopupConfig, MatchAnalysis, SiteStatusConfig, HeroSliderConfig, DailyKuponConfig, RaffleConfig, PopularBetsConfig, TVConfig, LoaderConfig, TrustedCompany } from './types';
import { DEFAULT_MARQUEE_CONFIG, DEFAULT_WELCOME_POPUP_CONFIG, DEFAULT_WHEEL_CONFIG, DEFAULT_SITE_STATUS_CONFIG, DEFAULT_RAFFLE_CONFIG, DEFAULT_POPULAR_BETS_CONFIG, DEFAULT_TV_CONFIG, DEFAULT_LOADER_CONFIG } from './constants';
import { demoAnalyses, demoCoupons } from './demoData';
import TrustedSitesView from './components/TrustedSitesView';
import TrustedDetailView from './components/TrustedDetailView';
import { initTrustedEngine, loadTrustedCompanies, processDripComments, processAutoReplies } from './utils/trustedEngine';

// Portal Components
import CouponsView from './components/CouponsView';
import HeroSection from './components/HeroSection';
import PopularBets from './components/PopularBets';
import GameLobbyTeaser from './components/GameLobbyTeaser';
import TV724View from './components/TV724View';
import LiveMatches from './components/LiveMatches';

import MatchResultsWidget from './components/MatchResultsWidget';
import { PromoSlider } from './components/PromoSlider';
import Sidebar from './components/Sidebar';
const SITE_CACHE_VERSION = "2026.06.25_v1";

const MatchCountdown: React.FC<{ dateStr: string; timeStr: string }> = ({ dateStr, timeStr }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    const target = new Date(`${dateStr}T${timeStr}:00+03:00`);
    const update = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setText('CANLI');
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      if (days > 0) {
        setText(`${days}g ${hours}s ${mins}d`);
      } else if (hours > 0) {
        setText(`${hours}s ${mins}d ${secs}sn`);
      } else {
        setText(`${mins}d ${secs}sn`);
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [dateStr, timeStr]);

  if (text === 'CANLI') {
    return <span className="font-black" style={{ color: '#00E676', animation: 'pulse 1.5s infinite' }}>CANLI</span>;
  }

  return <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#f2a900' }}>{text}</span>;
};

const App: React.FC = () => {
  const [appStage, setAppStage] = useState<'loading' | 'popup' | 'ready'>('ready');
  const [ipBlocked, setIpBlocked] = useState(false);
  const [fadeOutLoader, setFadeOutLoader] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [view, setView] = useState<'home' | 'admin' | 'login' | 'brands' | 'analysis' | 'blackjack' | 'loyalty' | 'raffle' | 'cekilis' | 'pool' | 'wheel' | 'giveaway' | 'coupons' | '724tv' | 'trusted-sites' | 'trusted-detail'>('home');
  const [activeCasinoGame, setActiveCasinoGame] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Responsive sidebar state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth < 1280;
      setIsMobile(mobile);
      if (tablet) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer as any);
  }, []);

  // Cache Version Control
  useEffect(() => {
    const currentVersion = localStorage.getItem('site_cache_version');
    if (currentVersion !== SITE_CACHE_VERSION) {
      // Clear critical content caches to force fresh load
      const keysToClear = [
        'site_hero_slider',
        'site_daily_kupon',
        'site_live_odds',
        'site_popular_bets',
        'site_tv_config',
        'site_analyses'
      ];
      keysToClear.forEach(key => localStorage.removeItem(key));
      localStorage.setItem('site_cache_version', SITE_CACHE_VERSION);
    }
  }, []);

  // IP Families & Security Check
  useEffect(() => {
    async function checkIpAccess() {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        if (!res.ok) return;
        const data = await res.json();
        const userIp = data.ip;
        
        if (!userIp) return;

        // Fetch IP rules from Supabase
        const { data: rules, error } = await supabase.from('ip_rules').select('*');
        if (error || !rules) return;

        for (const rule of rules) {
          if (rule.is_blocked === true && rule.ip_pattern) {
            // Support exact match or prefix match (e.g. 192.168.1. for family)
            if (userIp === rule.ip_pattern || userIp.startsWith(rule.ip_pattern)) {
              setIpBlocked(true);
              return;
            }
          }
        }
      } catch (e) {
        console.error('IP Access Check Error:', e);
      }
    }
    
    checkIpAccess();
  }, []);

  // Promo Wheel Config
  const [promoWheelConfig, setPromoWheelConfig] = useState<PromoWheelConfig>(() => {
    const stored = localStorage.getItem('site_featured_wheel') || localStorage.getItem('site_21com_wheel');
    return stored ? JSON.parse(stored) : {
      participants: [],
      prizes: [
        { id: '1', name: '100 Free Spin', emoji: '🎰', stock: 10 },
        { id: '2', name: '50 TL Nakit', emoji: '💰', stock: 5 },
        { id: '3', name: '200 TL Freebet', emoji: '⚽', stock: 3 },
      ],
      history: [],
      riggedWinner: null,
      featuredTrigger: false,
      transparentBg: false,
    };
  });

  const handlePromoWheelConfigChange = (cfg: PromoWheelConfig) => {
    setPromoWheelConfig(cfg);
    localStorage.setItem('site_featured_wheel', JSON.stringify(cfg));
    updateGlobalConfig('site_featured_wheel', cfg);
  };
  // Giveaway Config
  const [giveawayConfig, setGiveawayConfig] = useState<GiveawayConfig>(() => {
    const stored = localStorage.getItem('site_giveaway_config');
    return stored ? JSON.parse(stored) : DEFAULT_GIVEAWAY_CONFIG;
  });

  const handleGiveawayConfigChange = (cfg: GiveawayConfig) => {
    setGiveawayConfig(cfg);
    localStorage.setItem('site_giveaway_config', JSON.stringify(cfg));
    updateGlobalConfig('site_giveaway_config', cfg);
  };

  // Marquee Config
  const [marqueeConfig, setMarqueeConfig] = useState<MarqueeConfig>(() => {
    const stored = localStorage.getItem('site_marquee_config');
    return stored ? JSON.parse(stored) : DEFAULT_MARQUEE_CONFIG;
  });

  const handleMarqueeConfigChange = (cfg: MarqueeConfig) => {
    setMarqueeConfig(cfg);
    localStorage.setItem('site_marquee_config', JSON.stringify(cfg));
    updateGlobalConfig('site_marquee_config', cfg);
  };

  // Nav Visibility
  const [navVisibility, setNavVisibility] = useState<NavVisibility>(() => {
    const stored = localStorage.getItem('site_nav_visibility');
    return stored ? JSON.parse(stored) : DEFAULT_NAV_VISIBILITY;
  });

  const handleNavVisibilityChange = (vis: NavVisibility) => {
    setNavVisibility(vis);
    localStorage.setItem('site_nav_visibility', JSON.stringify(vis));
    updateGlobalConfig('site_nav_visibility', vis);
  };

  // Site Status (Maintenance) Config
  const [siteStatusConfig, setSiteStatusConfig] = useState<SiteStatusConfig>(() => {
    const stored = localStorage.getItem('site_status');
    return stored ? JSON.parse(stored) : DEFAULT_SITE_STATUS_CONFIG;
  });

  const handleSiteStatusConfigChange = (cfg: SiteStatusConfig) => {
    setSiteStatusConfig(cfg);
    localStorage.setItem('site_status', JSON.stringify(cfg));
    updateGlobalConfig('site_status', cfg);
  };

  // Hero Slider Config - Safe Initialization (No Storage Flash)
  const [heroSliderConfig, setHeroSliderConfig] = useState<HeroSliderConfig>({ isActive: true, autoPlayInterval: 5000, slides: [] });

  const handleHeroSliderConfigChange = (cfg: HeroSliderConfig) => {
    setHeroSliderConfig(cfg);
    localStorage.setItem('site_hero_slider', JSON.stringify(cfg));
    updateGlobalConfig('site_hero_slider', cfg);
  };

  // Daily Kupon Config - Safe Initialization (No Storage Flash)
  const [dailyKuponConfig, setDailyKuponConfig] = useState<DailyKuponConfig>({ isActive: true, title: 'GÜNÜN BANKO KUPONU', matches: [] });

  const handleDailyKuponConfigChange = (cfg: DailyKuponConfig) => {
    setDailyKuponConfig(cfg);
    localStorage.setItem('site_daily_kupon', JSON.stringify(cfg));
    updateGlobalConfig('site_daily_kupon', cfg);
  };

  // Raffle Config
  const [raffleConfig, setRaffleConfig] = useState<RaffleConfig>(() => {
    const stored = localStorage.getItem('site_raffle_config');
    return stored ? JSON.parse(stored) : DEFAULT_RAFFLE_CONFIG;
  });

  const handleRaffleConfigChange = (cfg: RaffleConfig) => {
    setRaffleConfig(cfg);
    localStorage.setItem('site_raffle_config', JSON.stringify(cfg));
    updateGlobalConfig('site_raffle_config', cfg);
  };

  // Popular Bets Config - Safe Initialization (No Storage Flash)
  const [popularBetsConfig, setPopularBetsConfig] = useState<PopularBetsConfig>(DEFAULT_POPULAR_BETS_CONFIG);

  const handlePopularBetsConfigChange = (cfg: PopularBetsConfig) => {
    setPopularBetsConfig(cfg);
    localStorage.setItem('site_popular_bets', JSON.stringify(cfg));
    updateGlobalConfig('site_popular_bets', cfg);
  };



  // 724TV Config - Safe Initialization (No Storage Flash)
  const [tvConfig, setTvConfig] = useState<TVConfig>(DEFAULT_TV_CONFIG);

  const handleTvConfigChange = (cfg: TVConfig) => {
    setTvConfig(cfg);
    localStorage.setItem('site_tv_config', JSON.stringify(cfg));
    updateGlobalConfig('site_tv_config', cfg);
  };

  // Loader (Splash Screen) Config
  const [loaderConfig, setLoaderConfig] = useState<LoaderConfig>(() => {
    const stored = localStorage.getItem('site_loader_config');
    return stored ? JSON.parse(stored) : DEFAULT_LOADER_CONFIG;
  });

  const handleLoaderConfigChange = (cfg: LoaderConfig) => {
    setLoaderConfig(cfg);
    localStorage.setItem('site_loader_config', JSON.stringify(cfg));
    updateGlobalConfig('site_loader_config', cfg);
  };

  const [selectedArticleId, setSelectedArticleId] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [siteUser, setSiteUser] = useState<SiteUser | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'member' | 'admin' | 'register' | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

  // ── Trusted Sites State ──────────────────────────────────────────────────────
  const [trustedCompanies, setTrustedCompanies] = useState<TrustedCompany[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  // Init trusted engine on mount + 60s cron
  useEffect(() => {
    initTrustedEngine();
    setTrustedCompanies(loadTrustedCompanies());
    const cronId = setInterval(() => {
      const changed1 = processDripComments();
      const changed2 = processAutoReplies();
      if (changed1 || changed2) {
        setTrustedCompanies(loadTrustedCompanies());
      }
    }, 60000);
    return () => clearInterval(cronId);
  }, []);

  // Typo Migration & Clean-up effect
  useEffect(() => {
    const stored = localStorage.getItem('site_analyses');
    if (!stored) return;

    let parsed = JSON.parse(stored);
    let needsUpdate = false;

    // 1. Fix Sürpriz typo
    if (stored.includes('Süpriz')) {
      parsed = JSON.parse(stored.replace(/Süpriz/g, 'Sürpriz'));
      needsUpdate = true;
    }

    // 2. Remove Corrupted/Legacy entries (Clean Slate 9 April 2026)
    const beforeCount = parsed.length;
    parsed = parsed.filter((a: any) => 
      a.league && 
      a.league.length < 80 && 
      a.matchDate >= '2026-04-09' && // START FRESH FROM TODAY
      !a.league.includes('Boluspor orta sıralarda') &&
      !a.league.includes('Porto Dragao') &&
      !(a.homeTeam && a.homeTeam.includes('Hollanda')) &&
      !(a.awayTeam && a.awayTeam.includes('Hollanda')) &&
      !(a.homeTeam && a.homeTeam.includes('Fas')) &&
      !(a.awayTeam && a.awayTeam.includes('Fas'))
    );
    if (parsed.length !== beforeCount) needsUpdate = true;

    if (needsUpdate) {
      localStorage.setItem('site_analyses', JSON.stringify(parsed));
      setAnalyses(parsed);
      window.dispatchEvent(new Event('storage'));
    }

    // 3. Branding Migration for Marquee & Popup
    const storedMarquee = localStorage.getItem('site_marquee_config');
    if (storedMarquee && (/betlivo/i.test(storedMarquee) || /724bahis/i.test(storedMarquee))) {
      const parsedMarquee = JSON.parse(storedMarquee.replace(/betlivo/gi, '724FUTBOL.COM').replace(/724bahis\.net/gi, '724FUTBOL.COM'));
      localStorage.setItem('site_marquee_config', JSON.stringify(parsedMarquee));
      setMarqueeConfig(parsedMarquee);
    }

    const storedWelcome = localStorage.getItem('site_welcome_popup');
    if (storedWelcome && (/betlivo/i.test(storedWelcome) || /724bahis/i.test(storedWelcome))) {
      const parsedWelcome = JSON.parse(storedWelcome.replace(/betlivo/gi, '724FUTBOL.COM').replace(/724bahis\.net/gi, '724FUTBOL.COM'));
      // Also catch the 'BETLIVOX' variant if it exists
      const cleanedWelcome = JSON.parse(JSON.stringify(parsedWelcome).replace(/724BAHİS.NETX/gi, '724FUTBOL.COM').replace(/724FUTBOL.COMX/gi, '724FUTBOL.COM'));
      localStorage.setItem('site_welcome_popup', JSON.stringify(cleanedWelcome));
      setWelcomePopupConfig(cleanedWelcome);
    }
  }, []);
  const [themeColor, setThemeColor] = useState('#eab308');
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState('');
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const stored = localStorage.getItem('site_coupons');
    return stored ? JSON.parse(stored) : demoCoupons;
  });
  const [showWelcomePopup, setShowWelcomePopup] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [globalTvPip, setGlobalTvPip] = useState(false);
  const [loyaltyConfig, setLoyaltyConfig] = useState<LoyaltyConfig>(() => {
    const stored = localStorage.getItem('site_loyalty_config');
    return stored ? JSON.parse(stored) : DEFAULT_LOYALTY_CONFIG;
  });

  const [analyses, setAnalyses] = useState<MatchAnalysis[]>(() => {
    const stored = localStorage.getItem('site_analyses');
    if (!stored) return demoAnalyses;
    const parsed = JSON.parse(stored);
    return parsed.length > 0 ? parsed : demoAnalyses;
  });
  const [wheelConfig, setWheelConfig] = useState<WheelConfig>(() => {
    const stored = localStorage.getItem('site_casino_wheel');
    return stored ? JSON.parse(stored) : DEFAULT_WHEEL_CONFIG;
  });

  // Welcome Popup Config
  const [welcomePopupConfig, setWelcomePopupConfig] = useState<WelcomePopupConfig>(() => {
    const stored = localStorage.getItem('site_welcome_popup');
    return stored ? JSON.parse(stored) : DEFAULT_WELCOME_POPUP_CONFIG;
  });

  const handleWelcomePopupConfigChange = (cfg: WelcomePopupConfig) => {
    setWelcomePopupConfig(cfg);
    localStorage.setItem('site_welcome_popup', JSON.stringify(cfg));
    updateGlobalConfig('site_welcome_popup', cfg);
  };

  const [bjConfig, setBjConfig] = useState<BlackjackConfig>({
    rewards: [],
    cooldownHours: 4,
    dealerHitSoft17: true,
    lastPlayTime: 0,
  });


  // App Flow: Skip loader splash screen completely as requested by the user
  useEffect(() => {
    setAppStage('ready');
    setShowLoader(false);
  }, []);

  // --- UNIFIED INITIALIZATION (Seed -> Local -> Supabase) ---
  useEffect(() => {
    let isMounted = true;

    async function initData() {
      try {
        // 1. Seed Demo Data (Only runs once, won't overwrite Supabase now)
        await seedEcosystemData();

        // 2. Load Local Data (Fallback UI before network finishes)
        if (!isMounted) return;
        const savedBrands = localStorage.getItem('site_brands');
        const savedColor = localStorage.getItem('site_primary_color');
        const savedHashtags = localStorage.getItem('site_hashtags');
        const savedCoupons = localStorage.getItem('site_coupons');
        const savedAnalyses = localStorage.getItem('site_analyses');
        const savedBj = localStorage.getItem('site_bj_config');
        const savedRole = localStorage.getItem('site_user_role');
        const savedMember = localStorage.getItem('site_current_member');

        setBrands(savedBrands ? JSON.parse(savedBrands) : INITIAL_BRANDS);
        if (savedHashtags) setHashtags(savedHashtags);
        if (savedCoupons) {
          const parsed = JSON.parse(savedCoupons);
          setCoupons(parsed.length > 0 ? parsed : demoCoupons);
        }
        if (savedAnalyses) {
          const parsed = JSON.parse(savedAnalyses);
          const cleaned = parsed.filter((a: any) => 
            a.homeTeam && a.awayTeam && a.homeTeam !== 'A' && a.awayTeam !== 'A' &&
            a.league && a.league.length < 80 && 
            a.matchDate >= '2026-04-09' && // START FRESH
            !a.league.includes('Boluspor orta sıralarda') &&
            !a.league.includes('Porto Dragao')
          );
          setAnalyses(cleaned.length > 0 ? cleaned : demoAnalyses);
        }
        if (savedBj) setBjConfig(JSON.parse(savedBj));
        if (savedColor && savedColor.startsWith('#')) setThemeColor(savedColor);
        if (savedRole) setUserRole(savedRole as string);
        if (savedMember) setSiteUser(JSON.parse(savedMember));


        // 3. Load Global Data from Supabase (Overrides Local) - PARALLEL FETCH
        const [
          globalAnalyses, globalCoupons, globalBrands, globalHero, globalHashtags,
          globalColor, globalBj, globalLoyalty, globalGiveaway, globalMarquee,
          globalNav, globalWheel, globalWelcome, globalSiteStatus,
          globalPromoWheel, globalHeroSlider, globalDailyKupon, globalRaffle,
          globalPopularBets, globalTvConfig, globalLoaderConfig
        ] = await Promise.all([
          getGlobalConfig('site_analyses'),
          getGlobalConfig('site_coupons'),
          getGlobalConfig('site_brands'),
          getGlobalConfig('site_hero'),
          getGlobalConfig('site_hashtags'),
          getGlobalConfig('site_primary_color'),
          getGlobalConfig('site_bj_config'),
          getGlobalConfig('site_loyalty_config'),
          getGlobalConfig('site_giveaway_config'),
          getGlobalConfig('site_marquee_config'),
          getGlobalConfig('site_nav_visibility'),
          getGlobalConfig('site_casino_wheel'),
          getGlobalConfig('site_welcome_popup'),
          getGlobalConfig('site_status'),
          Promise.all([getGlobalConfig('site_featured_wheel'), getGlobalConfig('site_21com_wheel')]),
          getGlobalConfig('site_hero_slider'),
          getGlobalConfig('site_daily_kupon'),
          getGlobalConfig('site_raffle_config'),
          getGlobalConfig('site_popular_bets'),
          getGlobalConfig('site_tv_config'),
          getGlobalConfig('site_loader_config')
        ]);

        if (!isMounted) return;

        if (globalAnalyses && Array.isArray(globalAnalyses)) {
          const cleaned = globalAnalyses.filter((a: any) => 
            a.homeTeam && a.awayTeam && a.homeTeam !== 'A' && a.awayTeam !== 'A' &&
            a.league && a.league.length < 80 && 
            a.matchDate >= '2026-04-09' && // START FRESH
            !a.league.includes('Boluspor orta sıralarda') &&
            !a.league.includes('Porto Dragao')
          );
          setAnalyses(cleaned.length > 0 ? cleaned : demoAnalyses);
        }

        if (globalCoupons && Array.isArray(globalCoupons)) {
          setCoupons(globalCoupons.length > 0 ? globalCoupons : demoCoupons);
        }
        if (globalBrands) setBrands(globalBrands);
        if (globalHero) setHero(globalHero);
        if (globalHashtags) setHashtags(globalHashtags);
        if (globalColor) setThemeColor(globalColor);
        if (globalBj) setBjConfig(globalBj);
        if (globalLoyalty) setLoyaltyConfig(globalLoyalty);
        if (globalGiveaway) setGiveawayConfig(globalGiveaway);
        
        if (globalMarquee) {
          const cleaned = JSON.parse(JSON.stringify(globalMarquee).replace(/betlivo/gi, '724FUTBOL.COM').replace(/724bahis\.net/gi, '724FUTBOL.COM'));
          setMarqueeConfig(cleaned);
        }
        
        if (globalNav) setNavVisibility(globalNav);
        if (globalWheel) setWheelConfig(globalWheel);
        
        if (globalWelcome) {
          const cleaned = JSON.parse(JSON.stringify(globalWelcome).replace(/betlivo/gi, '724FUTBOL.COM').replace(/724bahis\.net/gi, '724FUTBOL.COM').replace(/724BAHİS.NETX/gi, '724FUTBOL.COM').replace(/724FUTBOL.COMX/gi, '724FUTBOL.COM'));
          setWelcomePopupConfig(cleaned);
        }
        
        if (globalSiteStatus) setSiteStatusConfig(globalSiteStatus);
        
        const resolvedPromoWheel = globalPromoWheel[0] || globalPromoWheel[1];
        if (resolvedPromoWheel) setPromoWheelConfig(resolvedPromoWheel);
        
        if (globalHeroSlider) setHeroSliderConfig(globalHeroSlider);
        if (globalDailyKupon) setDailyKuponConfig(globalDailyKupon);
        if (globalRaffle) setRaffleConfig(globalRaffle);
        if (globalPopularBets) setPopularBetsConfig(globalPopularBets);
        if (globalTvConfig) {
          setTvConfig(globalTvConfig);
        }
        if (globalLoaderConfig) setLoaderConfig(globalLoaderConfig);


      } catch (err) {
        console.error('Initialization error:', err);
      }
    }

    initData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Global theme handling
  useEffect(() => {
    if (themeColor.startsWith('#')) {
      document.documentElement.style.setProperty('--primary', themeColor);
      const r = parseInt(themeColor.slice(1, 3), 16);
      const g = parseInt(themeColor.slice(3, 5), 16);
      const b = parseInt(themeColor.slice(5, 7), 16);
      document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
      localStorage.setItem('site_primary_color', themeColor);
      updateGlobalConfig('site_primary_color', themeColor);
    }
  }, [themeColor]);

  useEffect(() => {
    const seoDiv = document.getElementById('seo-hashtags');
    if (seoDiv) seoDiv.innerText = hashtags;
    localStorage.setItem('site_hashtags', hashtags);
    updateGlobalConfig('site_hashtags', hashtags);
  }, [hashtags]);

  const saveBrands = (newBrands: Brand[]) => {
    setBrands(newBrands);
    localStorage.setItem('site_brands', JSON.stringify(newBrands));
    updateGlobalConfig('site_brands', newBrands);
  };

  const saveAnalyses = (newAnalyses: MatchAnalysis[]) => {
    setAnalyses(newAnalyses);
    localStorage.setItem('site_analyses', JSON.stringify(newAnalyses));
    updateGlobalConfig('site_analyses', newAnalyses);
  };

  const saveCoupons = (newCoupons: Coupon[]) => {
    setCoupons(newCoupons);
    localStorage.setItem('site_coupons', JSON.stringify(newCoupons));
    updateGlobalConfig('site_coupons', newCoupons);
  };

  const saveWheelConfig = (cfg: WheelConfig) => {
    setWheelConfig(cfg);
    localStorage.setItem('site_casino_wheel', JSON.stringify(cfg));
    updateGlobalConfig('site_casino_wheel', cfg);
  };

  // Hero brand for admin (keep backward compatibility)
  const heroDefault: Brand = {
    id: '724bahis', name: '724BAHİS', subtitle: 'CASINO & CANLI BAHİS',
    offerMain: '%280', offerSub: 'HOŞGELDİN BONUSU !!!',
    logo: 'https://picsum.photos/seed/724bahis/400/400', link: 'https://724bahis.net', isSponsor: true,
  };
  const [hero, setHero] = useState<Brand>(heroDefault);

  useEffect(() => {
    const savedHero = localStorage.getItem('site_hero');
    if (savedHero) setHero(JSON.parse(savedHero));
  }, []);

  const handleGameComplete = (lastPlayTime: number) => {
    const newConfig = { ...bjConfig, lastPlayTime };
    setBjConfig(newConfig);
    localStorage.setItem('site_bj_config', JSON.stringify(newConfig));
  };

  const saveHero = (newHero: Brand) => {
    setHero(newHero);
    localStorage.setItem('site_hero', JSON.stringify(newHero));
    updateGlobalConfig('site_hero', newHero);
  };

  // URL path synchronization
  useEffect(() => {
    const syncViewWithUrl = () => {
      const path = window.location.pathname;
      const cleanPath = path.replace(/\/$/, '') || '/';
      if (cleanPath === '/raffles') {
        setView('cekilis');
      } else if (cleanPath === '/bilet') {
        setView('raffle');
      } else if (cleanPath === '/admin') {
        setView('admin');
      } else if (cleanPath === '/') {
        setView('home');
      } else if (cleanPath === '/brands') {
        setView('trusted-sites');
      } else if (cleanPath === '/analysis') {
        setView('analysis');
      } else if (cleanPath === '/coupons') {
        setView('coupons');
      } else if (cleanPath === '/724tv') {
        setView('724tv');
      } else if (cleanPath === '/trusted-sites') {
        setView('trusted-sites');
      } else if (cleanPath === '/trusted-detail') {
        setView('trusted-detail');
      } else {
        const viewName = cleanPath.substring(1);
        const validViews = ['blackjack', 'loyalty', 'pool', 'wheel', 'giveaway'];
        if (validViews.includes(viewName)) {
          setView(viewName as any);
        } else {
          setView('home');
        }
      }
    };

    window.addEventListener('popstate', syncViewWithUrl);
    syncViewWithUrl(); // Run once on mount

    return () => window.removeEventListener('popstate', syncViewWithUrl);
  }, []);

  if (ipBlocked) {
    return (
      <div style={{ width: '100vw', height: '100dvh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <Shield style={{ width: 40, height: 40, color: '#ef4444' }} />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ef4444', marginBottom: '16px', letterSpacing: '-1px' }}>Erişim Engellendi</h1>
        <p style={{ color: '#9ca3af', fontSize: '15px', maxWidth: '400px', textAlign: 'center', lineHeight: 1.6 }}>
          Güvenlik kuralları gereği IP adresinizin sisteme erişimi kısıtlanmıştır.
        </p>
      </div>
    );
  }

  if (view === 'admin') return (
    <ErrorBoundary>
      <AdminPanel
        brands={brands}
        hero={hero}
        role={userRole || 'admin'}
        wheelConfig={wheelConfig}
        bjConfig={bjConfig}
        loyaltyConfig={loyaltyConfig}
        analyses={analyses}
        coupons={coupons}
        onSaveBrands={saveBrands}
        onSaveHero={saveHero}
        onSaveAnalyses={saveAnalyses}
        onSaveCoupons={saveCoupons}
        onSaveWheelConfig={saveWheelConfig}
        onSaveBjConfig={(cfg) => {
          setBjConfig(cfg);
          localStorage.setItem('site_bj_config', JSON.stringify(cfg));
          updateGlobalConfig('site_bj_config', cfg);
        }}
        onSaveLoyaltyConfig={(cfg) => {
          setLoyaltyConfig(cfg);
          localStorage.setItem('site_loyalty_config', JSON.stringify(cfg));
          updateGlobalConfig('site_loyalty_config', cfg);
        }}
        onHashtagsChange={setHashtags}

        themeColor={themeColor}
        onThemeChange={setThemeColor}
        hashtags={hashtags || ''}
        onLogout={() => {
          setSiteUser(null);
          setUserRole(null);
          localStorage.removeItem('site_current_member');
          localStorage.removeItem('site_user_role');
          setView('home');
        }}
        onNavigateHome={() => {
          setView('home');
          window.scrollTo({ top: 0, behavior: 'auto' });
        }}
        giveawayConfig={giveawayConfig}
        onSaveGiveawayConfig={handleGiveawayConfigChange}
        navVisibility={navVisibility}
        onSaveNavVisibility={handleNavVisibilityChange}
        marqueeConfig={marqueeConfig}
        onSaveMarqueeConfig={handleMarqueeConfigChange}
        welcomePopupConfig={welcomePopupConfig}
        onSaveWelcomePopupConfig={handleWelcomePopupConfigChange}
        siteStatusConfig={siteStatusConfig}
        onSaveSiteStatusConfig={handleSiteStatusConfigChange}
        heroSliderConfig={heroSliderConfig}
        onSaveHeroSliderConfig={handleHeroSliderConfigChange}
        dailyKuponConfig={dailyKuponConfig}
        onSaveDailyKuponConfig={handleDailyKuponConfigChange}
        raffleConfig={raffleConfig}
        onSaveRaffleConfig={handleRaffleConfigChange}
        popularBetsConfig={popularBetsConfig}
        onSavePopularBetsConfig={handlePopularBetsConfigChange}
        tvConfig={tvConfig}
        onSaveTvConfig={handleTvConfigChange}
        loaderConfig={loaderConfig}
        onSaveLoaderConfig={handleLoaderConfigChange}
      />
    </ErrorBoundary>
  );

  const handleViewChange = (v: string) => {
    if (v !== 'analysis') {
      setActiveAnalysisId(null);
    }
    if (v !== 'blackjack') {
      setActiveCasinoGame(null);
    }
    // Lucky Wheel is members-only
    if (v === 'wheel' && !siteUser && !userRole) {
      setAuthModalMode('member');
      return;
    }

    // Push new history state
    let path = '/';
    if (v === 'home') {
      path = '/';
    } else if (v === 'raffle') {
      path = '/bilet';
    } else if (v === 'cekilis') {
      path = '/raffles';
    } else if (v === 'admin') {
      path = '/admin';
    } else if (v === 'brands') {
      path = '/trusted-sites';
    } else if (v === 'analysis') {
      path = '/analysis';
    } else if (v === 'coupons') {
      path = '/coupons';
    } else if (v === '724tv') {
      path = '/724tv';
    } else if (v === 'trusted-sites') {
      path = '/trusted-sites';
    } else if (v === 'trusted-detail') {
      path = '/trusted-detail';
    } else {
      path = `/${v}`;
    }

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }

    if (v === 'trusted-sites' || v === 'brands') {
      // Refresh company list from localStorage on navigate
      setTrustedCompanies(loadTrustedCompanies());
      setView('trusted-sites');
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else if (v === 'home') {
      setView('home');
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      setView(v as any);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const isMaintenanceActive = siteStatusConfig.isMaintenanceMode && userRole !== 'admin' && userRole !== 'editor';

  const getNextThreeAnalyses = () => {
    const combined = analyses.length > 0 ? analyses : demoAnalyses;
    
    const now = currentTime;
    
    // Filter for future matches
    let upcoming = combined.filter(a => {
      try {
        const matchTime = a.matchTime || "00:00";
        const matchDateTime = new Date(`${a.matchDate}T${matchTime}:00+03:00`);
        return matchDateTime.getTime() >= now.getTime();
      } catch (e) {
        return false;
      }
    });

    // Sort ascending chronologically
    upcoming.sort((a, b) => {
      if (a.matchDate !== b.matchDate) return a.matchDate.localeCompare(b.matchDate);
      return a.matchTime.localeCompare(b.matchTime);
    });

    // Fallback if less than 3 matches found
    if (upcoming.length < 3) {
      const sortedAll = [...combined].sort((a, b) => {
        if (a.matchDate !== b.matchDate) return a.matchDate.localeCompare(b.matchDate);
        return a.matchTime.localeCompare(b.matchTime);
      });
      // Add remaining matches from sortedAll that aren't already in upcoming
      for (const match of sortedAll) {
        if (upcoming.length >= 3) break;
        if (!upcoming.some(m => m.id === match.id)) {
          upcoming.push(match);
        }
      }
    }

    return upcoming.slice(0, 3);
  };

  const nextThreeAnalyses = getNextThreeAnalyses();

  const formatDateShort = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const day = parts[2];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        return `${day} ${months[monthIndex]}`;
      }
    } catch (e) {}
    return dateStr;
  };

  const parseTeamFlagAndName = (teamName: string) => {
    if (!teamName) return { flag: null, name: '' };
    // Regex to match regional indicator flag emojis at start
    const flagRegex = /^([\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF])\s*(.*)$/;
    const match = teamName.match(flagRegex);
    if (match) {
      return { flag: match[1], name: match[2].trim() };
    }
    // Also support any general emoji/symbol at start
    const generalEmojiRegex = /^([\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF])\s*(.*)$/;
    const generalMatch = teamName.match(generalEmojiRegex);
    if (generalMatch) {
      return { flag: generalMatch[1], name: generalMatch[2].trim() };
    }
    return { flag: null, name: teamName.trim() };
  };

  return (
    <ThemeProvider>
      {/* Auth Modal Overlay */}
      {authModalMode && (
        <AuthModal
          mode={authModalMode === 'register' ? 'member' : authModalMode}
          initialMemberMode={authModalMode === 'register' ? 'register' : 'login'}
          onMemberLogin={(user) => {
            setSiteUser(user);
            localStorage.setItem('site_current_member', JSON.stringify(user));
            // Eğer üyenin atanmış bir yetkisi varsa (admin, editor, author), bunu global role olarak ata
            if (user.role && user.role !== 'member') {
              setUserRole(user.role);
              localStorage.setItem('site_user_role', user.role);
            }
            setAuthModalMode(null);
          }}
          onAdminLogin={(role) => {
            setUserRole(role);
            localStorage.setItem('site_user_role', role);
            
            const adminUser: SiteUser = {
              id: 'admin-session',
              username: 'Yönetici',
              password: '',
              email: 'admin@724bahis.net',
              phone: '',
              createdAt: Date.now(),
              role: role as any
            };
            setSiteUser(adminUser);
            localStorage.setItem('site_current_member', JSON.stringify(adminUser));

            setAuthModalMode(null);
            setView('admin');
          }}
          onClose={() => setAuthModalMode(null)}
          hideMemberLogin={isMaintenanceActive && authModalMode === 'admin'}
        />
      )}

      {isMaintenanceActive && view !== 'admin' ? (
        <MaintenanceScreen 
          message={siteStatusConfig.maintenanceMessage} 
          onAdminLogin={() => setAuthModalMode('admin')}
        />
      ) : (
        <div className="app-grid-layout" style={{
          visibility: (appStage === 'ready' || appStage === 'popup' || showLoader) ? 'visible' : 'hidden',
          height: (appStage === 'ready' || appStage === 'popup') ? 'auto' : '100dvh',
          minHeight: '100dvh',
          background: 'var(--bg-main)',
          color: 'var(--text-primary)',
          position: 'relative',
          overflow: (appStage === 'ready' || appStage === 'popup') ? 'visible' : 'hidden',
           '--sidebar-width': !isMobile && isSidebarOpen ? '260px' : (!isMobile && !isSidebarOpen ? '72px' : '0px'),
          '--chat-width': (view === 'admin') ? '0px' : '380px'
        } as React.CSSProperties}>
          {showLoader && <AppLoader fadeOut={fadeOutLoader} />}
          
          <div className="sidebar-wrapper" style={{ height: '100%', position: 'relative' }}>
            <Sidebar
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              activeView={view}
              onViewChange={handleViewChange}
              userRole={userRole}
              navVisibility={navVisibility}
            />
          </div>

          <div className={appStage !== 'loading' ? 'app-reveal-mask' : 'app-hidden-initial'} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0px', minWidth: 0, width: '100%', overflowX: 'hidden', minHeight: '100dvh', position: 'relative' }}>
      <Header
        onAdminClick={() => {
          if (userRole) {
            setView('admin');
          } else {
            setAuthModalMode('admin');
          }
        }}
        onViewChange={handleViewChange}
        activeView={view}
        isAuthenticated={!!userRole}
        userRole={userRole}
        siteUser={siteUser}
        onMemberLoginClick={() => setAuthModalMode('member')}
        onMemberRegisterClick={() => setAuthModalMode('register')}
        onMemberLogout={() => {
          setSiteUser(null);
          setUserRole(null);
          localStorage.removeItem('site_current_member');
          localStorage.removeItem('site_user_role');
          if (view === 'admin') setView('home');
        }}
        onSearchClick={() => setShowSearch(true)}
        onSupportClick={() => setIsChatOpen(!isChatOpen)}
        navVisibility={navVisibility}
        marqueeConfig={marqueeConfig}
        isChatOpen={isChatOpen}
        isSidebarOpen={isSidebarOpen}
      />

      <main 
        className={`site-main-content ${view === 'admin' ? 'admin-layout' : ''}`}
        style={{ 
          position: 'relative', 
          zIndex: 10, 
          filter: appStage === 'popup' ? 'blur(10px)' : 'none', 
          pointerEvents: appStage === 'popup' ? 'none' : 'auto',
          paddingTop: '0px',
          transition: 'margin-right 0.3s ease-in-out, width 0.3s ease-in-out'
        } as React.CSSProperties}
      >
        <div style={{ visibility: appStage === 'ready' ? 'visible' : 'hidden', height: appStage === 'ready' ? 'auto' : '100dvh' }}>
          {view === 'home' && (
            <div className="animate-fade-in">
              {/* ═══ PORTAL BODY ═══ */}
              <div className="portal-body">
                
                {/* ── World Cup 2026 Special Analysis Banner ── */}
                <div 
                  onClick={() => handleViewChange('analysis')}
                  className="mb-6 rounded-2xl overflow-hidden relative cursor-pointer group" 
                  style={{ 
                    border: '1px solid rgba(242, 169, 0, 0.4)',
                    boxShadow: '0 0 40px rgba(242, 169, 0, 0.15), inset 0 1px 0 rgba(242, 169, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    backgroundImage: 'url("https://images.unsplash.com/photo-1518605368461-1e1e38ce7058?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Thematic Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/95" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(242,169,0,0.25)_0%,transparent_60%)] pointer-events-none" />
                  
                  {/* Neon glow background rings */}
                  <div style={{ position: 'absolute', top: '-30px', right: '10%', width: '140px', height: '140px', borderRadius: '50%', border: '2px solid rgba(242, 169, 0, 0.2)', boxShadow: '0 0 30px rgba(242, 169, 0, 0.2)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', top: '-10px', right: '12%', width: '90px', height: '90px', borderRadius: '50%', border: '1px solid rgba(242, 169, 0, 0.4)', boxShadow: '0 0 20px rgba(242, 169, 0, 0.3)', pointerEvents: 'none' }} />
                  
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative" style={{ zIndex: 10 }}>
                    <div className="flex items-center gap-4">
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(242, 169, 0, 0.15)', border: '1px solid rgba(242, 169, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(242, 169, 0, 0.2)', backdropFilter: 'blur(5px)' }}>
                        <Trophy className="w-6 h-6" style={{ color: '#f2a900' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(242, 169, 0, 0.9)', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>🏆 ÖZEL ANALİZLER</div>
                        <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-1px', margin: 0, lineHeight: 1 }}>
                          <span style={{ color: '#f2a900', textShadow: '0 0 20px rgba(242, 169, 0, 0.6), 0 0 40px rgba(242, 169, 0, 0.3)' }}>WORLD CUP </span>
                          <span style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>2026</span>
                        </h2>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 justify-between sm:justify-end">
                      <div className="text-left sm:text-right" style={{ flexShrink: 0 }}>
                        <p style={{ fontSize: '9px', fontWeight: 700, color: '#ccc', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2px' }}>En Yüksek Kazanç Oranları</p>
                        <p style={{ fontSize: '12px', fontWeight: 900, color: '#f2a900', textShadow: '0 0 15px rgba(242, 169, 0, 0.5)' }}>%88 Başarı Oranı</p>
                      </div>
                      <button className="group-hover:scale-105" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'linear-gradient(90deg, #f2a900, #ffc107)', color: '#000', fontWeight: 900, fontSize: '12px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s', boxShadow: '0 0 20px rgba(242, 169, 0, 0.4)', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        <span>ANALİZLERE GİT</span>
                        <span className="group-hover:translate-x-1 transition-transform" style={{ display: 'inline-block' }}>→</span>
                      </button>
                    </div>
                  </div>
                </div>

                <HeroSection heroSliderConfig={heroSliderConfig} dailyKuponConfig={dailyKuponConfig} />
                {/* ── Promosyonlar Section ── */}
                <PromoSlider />

                {/* ── Enhanced Betting Section ── */}
                <EnhancedBetting />

              </div>

              {/* ═══ PORTAL FOOTER ═══ */}
              <div className="portal-footer">
                <span className="portal-footer-copy">© 2026 724FUTBOL.COM · Tüm hakları saklıdır.</span>
                <div className="portal-footer-links">
                  <a href="#" onClick={(e) => e.preventDefault()}>Hakkımızda</a>
                  <a href="#" onClick={(e) => e.preventDefault()}>İletişim</a>
                  <a href="#" onClick={(e) => e.preventDefault()}>Gizlilik</a>
                  <a href="#" onClick={(e) => e.preventDefault()}>Kullanım Koşulları</a>
                </div>
              </div>

            </div>
          )}

        {view === 'brands' && (
          <div className="animate-fade-in" style={{ padding: '40px 0 100px' }}>
            <section id="brands-section" className="brands-section relative z-10">
              <div className="brands-header mb-12 animate-fade-in-up">
                <h2 className="text-[40px] md:text-[48px] font-black italic uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                  GÜVENİLİR <span className="text-[#FFC107]">FİRMALAR</span>
                </h2>
                <div className="h-1 w-20 bg-[#FFC107] mx-auto mt-4 mb-6 shadow-[0_0_15px_rgba(255,193,7,0.4)]" />
                <p className="font-bold uppercase text-[11px] tracking-[0.3em]" style={{ color: 'var(--text-muted)' }}>
                  Sizin için test ettiğimiz, ödemesini yapan lisanslı siteler.
                </p>
              </div>

              <div className="brands-grid">
                {brands.map((brand, index) => (
                  <BrandCard key={brand.id} brand={brand} index={index} />
                ))}
              </div>
            </section>
          </div>
        )}

        {view === 'analysis' && (
          <div className="animate-fade-in">
            <AnalysisView
              onNavigate={handleViewChange}
              analyses={analyses}
              coupons={coupons}
              siteUser={siteUser}
              isLoggedIn={!!(siteUser || userRole)}
              onLoginRequired={() => setAuthModalMode('member')}
              initialExpandedId={activeAnalysisId}
            />
          </div>
        )}

        {view === 'blackjack' && (
          <div className="animate-fade-in">
            {activeCasinoGame === 'blackjack' ? (
              <div className="portal-body">
                <button
                  onClick={() => setActiveCasinoGame(null)}
                  className="mb-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-xs font-black uppercase tracking-wider w-fit"
                >
                  ← Lobiye Dön
                </button>
                <BlackjackGame
                  config={bjConfig}
                  onGameComplete={handleGameComplete}
                  isLoggedIn={!!(siteUser || userRole)}
                  onLoginRequired={() => setAuthModalMode('member')}
                  userRole={userRole}
                />
              </div>
            ) : (
              <div className="portal-body animate-fade-in">
                <GameLobbyTeaser
                  onViewChange={handleViewChange}
                  onPlayGame={(gameId) => setActiveCasinoGame(gameId)}
                />
              </div>
            )}
          </div>
        )}

        {view === 'loyalty' && (
          <div className="animate-fade-in">
            {(siteUser || userRole) ? (
              <LoyaltyPanel
                config={loyaltyConfig}
                userId={siteUser?.id || userRole || 'guest'}
                onClose={() => setView('home')}
                onNavigate={handleViewChange}
              />
            ) : (
              <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black">
                <div className="text-7xl">🎯</div>
                <h2 className="text-white font-black text-3xl uppercase tracking-tight">Günlük Görevler</h2>
                <p className="text-zinc-500 font-bold text-sm">Coin kazanmak ve marketi kullanmak için üye girişi gereklidir.</p>
                <button onClick={() => setAuthModalMode('member')}
                  className="px-8 py-4 bg-[#f0b90b] text-black font-black text-sm rounded-2xl uppercase tracking-widest hover:bg-[#f0b90b]/90 transition-all shadow-[0_0_25px_rgba(240,185,11,0.4)]">
                  🔑 Üye Ol / Giriş Yap
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'raffle' && (
          <div className="animate-fade-in">
            {(siteUser || userRole) ? (
              <RaffleView
                config={raffleConfig}
                loyaltyConfig={loyaltyConfig}
                userId={siteUser?.id || userRole || 'guest'}
                onNavigate={(v: string) => setView(v as any)}
              />
            ) : (
              <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black">
                <div className="text-7xl">🎟️</div>
                <h2 className="text-white font-black text-3xl uppercase tracking-tight">Bilet Etkinliği</h2>
                <p className="text-zinc-500 font-bold text-sm">Çekilişe katılmak için üye girişi gereklidir.</p>
                <button onClick={() => setAuthModalMode('member')}
                  className="px-8 py-4 bg-[#f0b90b] text-black font-black text-sm rounded-2xl uppercase tracking-widest hover:bg-[#f0b90b]/90 transition-all shadow-[0_0_25px_rgba(240,185,11,0.4)]">
                  🔑 Üye Ol / Giriş Yap
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'cekilis' && (
          <div className="animate-fade-in">
            {(siteUser || userRole) ? (
              <CekilisCenterView
                userId={siteUser?.id || userRole || 'guest'}
                onNavigate={(v: string) => setView(v as any)}
              />
            ) : (
              <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black">
                <div className="text-7xl">🎟️</div>
                <h2 className="text-white font-black text-3xl uppercase tracking-tight">Çekiliş Merkezi</h2>
                <p className="text-zinc-500 font-bold text-sm">Çekilişe katılmak için üye girişi gereklidir.</p>
                <button onClick={() => setAuthModalMode('member')}
                  className="px-8 py-4 bg-[#f0b90b] text-black font-black text-sm rounded-2xl uppercase tracking-widest hover:bg-[#f0b90b]/90 transition-all shadow-[0_0_25px_rgba(240,185,11,0.4)]">
                  🔑 Üye Ol / Giriş Yap
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'pool' && (
          <div className="animate-fade-in">
            <PoolGame
              userId={siteUser?.id || userRole || 'guest'}
              username={siteUser?.username || 'Misafir'}
              isLoggedIn={!!(siteUser || userRole)}
              onLoginRequired={() => setAuthModalMode('member')}
              userRole={userRole}
            />
          </div>
        )}

        {view === 'wheel' && (
          <div className="animate-fade-in">
            <PromoWheel
              config={promoWheelConfig}
              onConfigChange={handlePromoWheelConfigChange}
              isAdmin={!!userRole}
            />
          </div>
        )}

        {view === 'giveaway' && (
          <div className="animate-fade-in">
            <GiveawayView
              config={giveawayConfig}
              onConfigChange={handleGiveawayConfigChange}
              isAdmin={!!userRole}
            />
          </div>
        )}

        {view === 'coupons' && (
          <div className="animate-fade-in">
            <CouponsView
              coupons={coupons}
              siteUser={siteUser}
              userRole={userRole}
              setAuthModalMode={setAuthModalMode}
              onNavigate={handleViewChange}
              statusConfig={siteStatusConfig}
            />
          </div>
        )}

        {view === 'trusted-sites' && (
          <div className="animate-fade-in">
            <TrustedSitesView
              companies={trustedCompanies}
              onSelectCompany={(id) => {
                setSelectedCompanyId(id);
                setView('trusted-detail');
                window.scrollTo({ top: 0, behavior: 'auto' });
              }}
            />
          </div>
        )}

        {view === 'trusted-detail' && selectedCompanyId && (() => {
          const company = trustedCompanies.find(c => c.id === selectedCompanyId);
          if (!company) return null;
          return (
            <div className="animate-fade-in">
              <TrustedDetailView
                company={company}
                onBack={() => {
                  setView('trusted-sites');
                  window.scrollTo({ top: 0, behavior: 'auto' });
                }}
              />
            </div>
          );
        })()}
        {view === '724tv' && (
          <TV724View
            config={tvConfig}
            siteUser={siteUser}
            userRole={userRole}
            onBack={() => handleViewChange('home')}
            onLoginRequired={() => setAuthModalMode('member')}
            activeView={view}
          />
        )}
      </div>
      </main>

      <footer className="site-footer">
        <div className="footer-badges">
          <img src="https://picsum.photos/seed/18/40/40" alt="18+" style={{ height: '32px', borderRadius: '4px' }} />
          <img src="https://picsum.photos/seed/gaming/100/40" alt="Gaming Commission" style={{ height: '32px', borderRadius: '4px' }} />
          <img src="https://picsum.photos/seed/visa/60/40" alt="Visa" style={{ height: '24px' }} />
          <img src="https://picsum.photos/seed/master/60/40" alt="Mastercard" style={{ height: '24px' }} />
        </div>
        <p className="footer-text">
          Bu web sitesi yalnızca bilgilendirme amaçlıdır. Lütfen sorumlu bir şekilde oynayın.
          Kumar bağımlılık yapabilir ve ciddi mali kayıplara neden olabilir. 18 yaşından küçüklerin kumar oynaması yasaktır.
        </p>
        <div className="footer-hashtags">
          {(hashtags || '').split(',').map((tag, i) => tag.trim() ? <span key={i}>{tag.trim()}</span> : null)}
        </div>
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => setAuthModalMode('admin')}
            className="text-zinc-800 hover:text-amber-500 transition-all duration-300 transform hover:scale-125"
            title="Sistem Girişi"
          >
            <Crown size={20} />
          </button>
        </div>
      </footer>
      {/* PortalMobileNav is removed as requested by the user to move it to the top */}
          </div>





      {/* ── Match Search Modal ── */}
      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          coupons={coupons}
          onNavigate={handleViewChange}
        />
      )}

      {/* ── Modern Chat Widget ── */}
      {view !== 'admin' && (
        <div 
          style={{ 
            overflow: 'hidden', 
            position: 'fixed', 
            right: 0, top: 0, zIndex: 9999, height: '100dvh',
            width: isMobile ? '100%' : '380px',
            transform: 'translateX(0)',
            visibility: 'visible',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s'
          }}
        >
          <ModernChat
            open={true}
            onClose={() => {}}
            siteUser={siteUser}
            userRole={userRole}
            isMobile={isMobile}
          />
        </div>
      )}

    </div>
    )}
    </ThemeProvider>
  );
};

export default App;
