import React, { useState, useEffect, useRef } from 'react';

import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { BettingProvider } from './contexts/BettingContext';
import LanguageTransition from './components/LanguageTransition';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Header from './components/Header';
import { Crown, Trophy, Calendar, TrendingUp, Clock, ArrowRight, Shield, CheckCircle2, Target, X, Dribbble, PlayCircle, Gamepad2, Diamond, Dices, PieChart, MonitorPlay, ChevronDown, Lock, ShieldCheck, Wallet, Club, Search, Menu } from 'lucide-react';
import { getFlagUrl } from './components/MatchResultsWidget';
import AppLoader from './components/AppLoader';
import BrandCard from './components/BrandCard';
import AdminPanel from './components/AdminPanel';
import FinanceDashboard from './components/FinanceDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import AuthModal from './components/AuthModal';
import OnboardingPopup from './components/OnboardingPopup';
import FakeBetModal from './components/FakeBetModal';
import MobileBottomNav from './components/MobileBottomNav';
import WalletModal from './components/WalletModal';
import AnalysisView from './components/AnalysisView';
import BlackjackGame from './components/BlackjackGame';
import BlackjackProView from './components/BlackjackProView';
import MaintenanceScreen from './components/MaintenanceScreen';
import GlobalToaster from './components/GlobalToaster';

import LiveSupportModal from './components/LiveSupportModal';
// Import removed
import SlotText from './components/SlotText';
// Import removed
import PromoWheel from './components/PromoWheel';
import WheelDashboard from './components/WheelDashboard';
import LuckyWheelView from './components/LuckyWheelView';
import GiveawayView, { DEFAULT_GIVEAWAY_CONFIG } from './components/GiveawayView';
import SearchModal from './components/SearchModal';
import LoyaltyPanel, { DEFAULT_LOYALTY_CONFIG } from './components/LoyaltyPanel';
import RaffleView from './components/RaffleView';
import RaffleLanding from './components/RaffleLanding';
import CekilisCenterView from './components/CekilisCenterView';
import PoolGame from './components/PoolGame';
import { seedEcosystemData } from './seedEcosystem';
import { getGlobalConfig, updateGlobalConfig, supabase } from './utils/supabase';
import { NavVisibility, DEFAULT_NAV_VISIBILITY } from './components/Header';
import { BRANDS as INITIAL_BRANDS } from './constants';
import { LuckyWheelConfig, Brand, Coupon, BlackjackConfig, WheelConfig, SiteUser, LoyaltyConfig, PromoWheelConfig, GiveawayConfig, MarqueeConfig, WelcomePopupConfig, MatchAnalysis, SiteStatusConfig, HeroSliderConfig, Slider2Config, DailyKuponConfig, RaffleConfig, PopularBetsConfig, TVConfig, LoaderConfig, TrustedCompany, ChatBotConfig, CasinoLobbyGame } from './types';
import { DEFAULT_LUCKY_WHEEL_CONFIG, DEFAULT_MARQUEE_CONFIG, DEFAULT_WELCOME_POPUP_CONFIG, DEFAULT_WHEEL_CONFIG, DEFAULT_SITE_STATUS_CONFIG, DEFAULT_RAFFLE_CONFIG, DEFAULT_POPULAR_BETS_CONFIG, DEFAULT_TV_CONFIG, DEFAULT_LOADER_CONFIG } from './constants';
import { demoAnalyses, demoCoupons } from './demoData';
import TrustedSitesView from './components/TrustedSitesView';
import TrustedDetailView from './components/TrustedDetailView';
import { initTrustedEngine, loadTrustedCompanies, processDripComments, processAutoReplies } from './utils/trustedEngine';
import DemoGames from './components/DemoGames';
import MyBetsModal from './components/MyBetsModal';
import KralView from './components/KralView';
import WorldCupTeaser from './components/WorldCupTeaser';
import Footer from './components/Footer';
import RetroFooter from './components/RetroFooter';
import ModernChat from './components/ModernChat';
import { DualRightPanel } from './components/sports/DualRightPanel';

import LiveBetsFeed from './components/LiveBetsFeed';
import CasinoLobby from './components/CasinoLobby';
import { UserProvider } from './contexts/UserContext';
import { BetSlipProvider } from './contexts/BetSlipContext';

// Portal Components
import CouponsView from './components/CouponsView';

import MobileQuickLinks from './components/MobileQuickLinks';
import Slider2 from './components/Slider2';
import PopularBets from './components/PopularBets';
import ProfileDashboard from './components/ProfileDashboard';
import GameLobbyTeaser from './components/GameLobbyTeaser';
import TV724View from './components/TV724View';
import LiveMatches from './components/LiveMatches';
import OriginalsHub from './components/OriginalsHub';
import RetroLayout from './components/retro/RetroLayout';
import MatchResultsWidget from './components/MatchResultsWidget';
import { PromoSlider } from './components/PromoSlider';
import { WithdrawalHistory } from './components/WithdrawalHistory';
import { DepositHistory } from './components/DepositHistory';
import { LiveSportsBulletin } from './components/LiveSportsBulletin';
import MobileBulletinView from './components/MobileBulletinView';
import { UpcomingMatchesView } from './components/UpcomingMatchesView';
import GameLobbyGrid from './components/GameLobbyGrid';
import Sidebar from './components/Sidebar';
import GuestLanding from './components/GuestLanding';
import HeroSection from './components/HeroSection';
import PromoCodeView from './components/PromoCodeView';
import ReferralView from './components/ReferralView';
import Spor724View from './components/Spor724View';
import GercekView from './components/sports/GercekView';
import InGameLayout from './components/InGameLayout';
import ComingSoon from './components/ComingSoon';
import PlinkoView from './components/PlinkoView';
import LimboView from './components/LimboView';
import ChickenRunView from './components/ChickenRunView';
import DiceView from './components/DiceView';
import MinesView from './components/MinesView';
import KenoView from './components/KenoView';
import WarView from './components/WarView';
import HiLoView from './components/HiLoView';
import RewardsPage from './components/RewardsPage';
import RouletteView from './components/RouletteView';
import CrashTurboView from './components/CrashTurboView';
import TurboMinesView from './components/TurboMinesView';
import HacksawSlotView from './components/HacksawSlotView';
import RedTigerSlotView from './components/RedTigerSlotView';
import AdventureMap from './components/AdventureMap';
import SecretCurtain from './components/SecretCurtain';
const SITE_CACHE_VERSION = "2026.07.25_v2";

const formatDateTR = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} - ${days[d.getDay()]}`;
};

const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return { text: 'text-[#00E676]', bg: 'bg-[#00E676]/10', border: 'border-[#00E676]/30' };
    if (confidence >= 70) return { text: 'text-[#f2a900]', bg: 'bg-[#f2a900]/10', border: 'border-[#f2a900]/30' };
    return { text: 'text-[#ff3d00]', bg: 'bg-[#ff3d00]/10', border: 'border-[#ff3d00]/30' };
};

const getLeagueFlag = (league: string): string => {
    const l = league.toLowerCase();
    if (l.includes('premier') || l.includes('championship') || l.includes('ingiltere')) return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
    if (l.includes('la liga') || l.includes('ispanya')) return '🇪🇸';
    if (l.includes('serie a') || l.includes('italya')) return '🇮🇹';
    if (l.includes('bundesliga') || l.includes('almanya')) return '🇩🇪';
    if (l.includes('ligue 1') || l.includes('fransa')) return '🇫🇷';
    if (l.includes('süper lig') || l.includes('türkiye') || l.includes('1. lig')) return '🇹🇷';
    if (l.includes('eredivisie') || l.includes('hollanda')) return '🇳🇱';
    if (l.includes('primeira') || l.includes('portekiz')) return '🇵🇹';
    if (l.includes('mls') || l.includes('nba') || l.includes('abd')) return '🇺🇸';
    if (l.includes('brasileirao') || l.includes('brezilya')) return '🇧🇷';
    if (l.includes('şampiyonlar') || l.includes('avrupa ligi') || l.includes('konferans') || l.includes('euroleague') || l.includes('uefa')) return '🇪🇺';
    if (l.includes('nba') || l.includes('basket') || l.includes('euroleague')) return '🏀';
    if (l.includes('formula') || l.includes('f1')) return '🏎️';
    if (l.includes('motogp') || l.includes('superbike')) return '🏍️';
    if (l.includes('wimbledon') || l.includes('roland') || l.includes('tenis')) return '🎾';
    return '🌍';
};

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

  return <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#10B981' }}>{text}</span>;
};

export default function App() {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isFinancePanelOpen, setIsFinancePanelOpen] = useState(false);
  const [isDriverActive, setIsDriverActive] = useState(false);

  useEffect(() => {
    const handleOpenAdmin = () => {
      const role = localStorage.getItem('site_user_role');
      if (role === 'admin') {
        setIsAdminPanelOpen(true);
      } else {
        window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'admin' }));
      }
    };
    const handleOpenFinance = () => {
      const role = localStorage.getItem('site_user_role');
      if (role === 'admin') {
        setIsFinancePanelOpen(true);
      } else {
        window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'admin' }));
      }
    };
    window.addEventListener('open-admin', handleOpenAdmin);
    window.addEventListener('open-finance', handleOpenFinance);
    return () => {
      window.removeEventListener('open-admin', handleOpenAdmin);
      window.removeEventListener('open-finance', handleOpenFinance);
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <BettingProvider>
          <SecretCurtain />
          <div className="min-h-screen bg-theme-main text-theme-primary flex flex-col font-sans">
            <AppContent setIsAdminPanelOpen={setIsAdminPanelOpen} />
          </div>

          {isAdminPanelOpen && (
              <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />
          )}

          {isFinancePanelOpen && (
              <FinanceDashboard onClose={() => setIsFinancePanelOpen(false)} />
          )}
        </BettingProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

const AppContent: React.FC<{ setIsAdminPanelOpen: (val: boolean) => void }> = ({ setIsAdminPanelOpen }) => {
  const sports2ContainerRef = useRef<HTMLDivElement>(null);
  const sportsContainerRef = useRef<HTMLDivElement>(null);
  const sports3ContainerRef = useRef<HTMLDivElement>(null);
  const sports4ContainerRef = useRef<HTMLDivElement>(null);
  const sports5ContainerRef = useRef<HTMLDivElement>(null);
  const casino2ContainerRef = useRef<HTMLDivElement>(null);
  const demoContainerRef = useRef<HTMLDivElement>(null);
  const [appStage, setAppStage] = useState<'loading' | 'popup' | 'ready'>('ready');
  const [ipBlocked, setIpBlocked] = useState(false);
  const [fadeOutLoader, setFadeOutLoader] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [view, setView] = useState<'home' | 'sports' | 'sports2' | 'sports3' | 'sports4' | 'sports5' | 'admin' | 'login' | 'brands' | 'analysis' | 'blackjack' | 'blackjack-pro' | 'casino2' | 'loyalty' | 'raffle' | 'cekilis' | 'pool' | 'wheel' | 'luckywheel' | 'giveaway' | 'coupons' | '724tv' | 'trusted-sites' | 'trusted-detail' | 'demo' | 'kral' | 'promo' | 'referral' | 'profile' | 'slotra' | 'slotra2' | 'mobile-bulletin' | 'spor724' | 'plinko' | 'limbo' | 'chicken-run' | 'dice' | 'mines' | 'keno' | 'war' | 'hilo' | 'roulette' | 'crash-turbo' | 'turbo-mines' | 'hacksaw' | 'redtiger' | 'upcomingMatches' | 'rewards'>(window.location.pathname.startsWith('/spor') ? 'spor724' : window.location.pathname.includes('lucky') ? 'luckywheel' : 'home');
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isContentReady, setIsContentReady] = useState(true);
  const [loadId, setLoadId] = useState(0);
  const [activeCasinoGame, setActiveCasinoGame] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isChatOpen, setIsChatOpen] = useState(true);

  useEffect(() => {
    if (view === 'raffle' || view === 'cekilis') {
      setIsChatOpen(false);
    }
  }, [view]);
  
  // Custom URL for Sports2 iframe (to handle custom header navigation)
  const [sports2Url, setSports2Url] = useState("https://bahisbey1438.com/tr/sport/sports/football/flt-1-1239-52530/?btag=59649488_330539");
  const [showAgeWarning, setShowAgeWarning] = useState(false);

  const previousViewRef = useRef(view);

  // Global Loader Logic (Initial Load & Transitions)
  useEffect(() => {
    // Only use global loader for iframe-based sports views to hide iframe loading flashes
    const isSports = (v: string) => ['sports2', 'sports3', 'sports4', 'sports5'].includes(v);
    
    const isEnteringSports = isSports(view);
    const isLeavingSports = isSports(previousViewRef.current) && !isEnteringSports;
    
    // Yalnızca spor sayfasına girerken/çıkarken veya ilk yüklemede göster
    if (isEnteringSports || isLeavingSports || previousViewRef.current === view) {
      setShowLoader(true);
      setFadeOutLoader(false);
      
      // Fallback timer just in case
      const timer1 = setTimeout(() => {
        setFadeOutLoader(true);
      }, 5000); 
      
      const timer2 = setTimeout(() => {
        setShowLoader(false);
        setFadeOutLoader(false);
      }, 3000); // Completely hide at 3s
      
      previousViewRef.current = view;
      return () => { 
        clearTimeout(timer1); 
        clearTimeout(timer2); 
      };
    } else {
      previousViewRef.current = view;
    }
  }, [view]);

  useEffect(() => {
    const handleInternalNavigate = (e: CustomEvent<{ url: string }>) => {
      setIframeLoading(true);
      setSports2Url(e.detail.url);
      setView('sports2');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenSupportChat = () => {
      setView('spor724');
      setTimeout(() => {
        window.dispatchEvent(new Event('openMobileChatPanel'));
      }, 150);
    };

    window.addEventListener('internal-navigate', handleInternalNavigate as EventListener);
    window.addEventListener('openSupportChat', handleOpenSupportChat);
    return () => {
      window.removeEventListener('internal-navigate', handleInternalNavigate as EventListener);
      window.removeEventListener('openSupportChat', handleOpenSupportChat);
    };
  }, []);
  
  // Responsive sidebar state - open by default on PC / TV (>= 1280px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [isLogoSpinning, setIsLogoSpinning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// State removed

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth < 1280;
      setIsMobile(mobile);
      if (tablet) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Run on mount to ensure correct initial state
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-open sidebar and right chat when entering sports section
  useEffect(() => {
    const sportsViews = ['gercek', 'sports', 'spor724', 'slotra', 'spor'];
    if (sportsViews.includes(view)) {
      setIsSidebarOpen(true);
      setIsChatOpen(true);
    }
  }, [view]);

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

      // Unregister any active service workers to clear Safari PWAs/cached bundles
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (let registration of registrations) {
            registration.unregister();
          }
        });
      }

      // Force a hard reload to pick up new bundles immediately
      setTimeout(() => {
        window.location.reload();
      }, 200);
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
  
  const [luckyWheelConfig, setLuckyWheelConfig] = useState<LuckyWheelConfig>(() => {
    const saved = localStorage.getItem('luckyWheelConfig');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_LUCKY_WHEEL_CONFIG;
      }
    }
    return DEFAULT_LUCKY_WHEEL_CONFIG;
  });

  const handleLuckyWheelConfigChange = (cfg: LuckyWheelConfig) => {
    setLuckyWheelConfig(cfg);
    localStorage.setItem('luckyWheelConfig', JSON.stringify(cfg));
  };

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
    const parsed = stored ? JSON.parse(stored) : DEFAULT_SITE_STATUS_CONFIG;
    return { ...parsed, isMaintenanceMode: false };
  });

  const handleSiteStatusConfigChange = (cfg: SiteStatusConfig) => {
    setSiteStatusConfig(cfg);
    localStorage.setItem('site_status', JSON.stringify(cfg));
    updateGlobalConfig('site_status', cfg);
  };

  // Chat Bots Config
  const [botsConfig, setBotsConfig] = useState<ChatBotConfig[]>([]);

  const handleBotsConfigChange = (cfg: ChatBotConfig[]) => {
    setBotsConfig(cfg);
    localStorage.setItem('site_bots_config', JSON.stringify(cfg));
    updateGlobalConfig('site_bots_config', cfg);
  };

  // Hero Slider Config - Safe Initialization (No Storage Flash)
  const [heroSliderConfig, setHeroSliderConfig] = useState<HeroSliderConfig>({ isActive: true, autoPlayInterval: 5000, slides: [] });

  const handleHeroSliderConfigChange = (cfg: HeroSliderConfig) => {
    setHeroSliderConfig(cfg);
    localStorage.setItem('site_hero_slider', JSON.stringify(cfg));
    updateGlobalConfig('site_hero_slider', cfg);
  };

  // Slider 2 Config - Safe Initialization (No Storage Flash)
  const [slider2Config, setSlider2Config] = useState<Slider2Config>({ isActive: true, autoPlayInterval: 5000, slides: [] });

  const handleSlider2ConfigChange = (cfg: Slider2Config) => {
    setSlider2Config(cfg);
    localStorage.setItem('site_slider2_config', JSON.stringify(cfg));
    updateGlobalConfig('site_slider2_config', cfg);
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

  // Discord Config
  const [discordConfig, setDiscordConfig] = useState<any>(() => {
    const stored = localStorage.getItem('site_discord_config');
    return stored ? JSON.parse(stored) : { enabled: false, webhookUrl: '' };
  });

  const handleDiscordConfigChange = (cfg: any) => {
    setDiscordConfig(cfg);
    localStorage.setItem('site_discord_config', JSON.stringify(cfg));
    updateGlobalConfig('site_discord_config', cfg);
  };

  const [selectedArticleId, setSelectedArticleId] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(() => {
    try { return localStorage.getItem('site_user_role') || null; } catch { return null; }
  });
  const [siteUser, setSiteUser] = useState<SiteUser | null>(() => {
    try {
      const saved = localStorage.getItem('site_current_member') || localStorage.getItem('site_member');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalMode, setAuthModalMode] = useState<'member' | 'admin' | 'register' | null>(null);

  useEffect(() => {
    const handleOpenAuth = (e: any) => {
      if (!siteUser) {
        setAuthModalMode(e.detail || 'register');
      }
    };
    window.addEventListener('openAuthModal', handleOpenAuth);
    return () => window.removeEventListener('openAuthModal', handleOpenAuth);
  }, [siteUser]);

  const handleGlobalLogout = async () => {
    localStorage.removeItem('site_current_member');
    localStorage.removeItem('site_member');
    localStorage.removeItem('site_user_role');
    setSiteUser(null);
    setUserRole(null);
    if (view === 'admin') setView('home');
    try { supabase.auth.signOut(); } catch (e) {} // Removed await so it doesn't block reload
    window.location.reload();
  };

  const lastBalanceRef = useRef(siteUser?.balance);
  const broadcastChannelRef = useRef<any>(null);

  // Global Local Storage Sync for siteUser (Ensures games using setSiteUser directly don't lose balance)
  useEffect(() => {
    if (siteUser) {
      const stored = localStorage.getItem('site_member');
      const currentString = JSON.stringify(siteUser);
      if (stored !== currentString) {
        localStorage.setItem('site_member', currentString);
        localStorage.setItem('site_current_member', currentString);
      }
      
      // Broadcast if balance changed LOCALLY (prevent infinite loops)
      if (lastBalanceRef.current !== undefined && lastBalanceRef.current !== siteUser.balance) {
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.send({
            type: 'broadcast',
            event: 'balance_update',
            payload: { balance: siteUser.balance }
          }).catch(() => {});
        }
      }
      lastBalanceRef.current = siteUser.balance;
    }
  }, [siteUser]);

  // Real-time Database & Broadcast Sync (Cross-Profile / Cross-Device)
  useEffect(() => {
    if (!siteUser?.id) return;

    // 1. Listen for DB changes (Real members)
    const dbChannel = supabase.channel(`public:members:id=eq.${siteUser.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'members', filter: `id=eq.${siteUser.id}` }, (payload: any) => {
        const newBalance = payload.new.balance;
        setSiteUser(prev => {
          if (prev && prev.balance !== newBalance) {
            lastBalanceRef.current = newBalance; // Prevent echo
            return { ...prev, balance: newBalance };
          }
          return prev;
        });
      })
      .subscribe();

    // 2. Broadcast channel for Guest users & instant optimistic sync
    const broadcastChannel = supabase.channel(`user_sync_${siteUser.id}`)
      .on('broadcast', { event: 'balance_update' }, (payload: any) => {
        const newBalance = payload.payload.balance;
        setSiteUser(prev => {
          if (prev && prev.balance !== newBalance) {
            lastBalanceRef.current = newBalance; // Prevent echo
            return { ...prev, balance: newBalance };
          }
          return prev;
        });
      });
      
    broadcastChannel.subscribe();
    broadcastChannelRef.current = broadcastChannel;

    return () => {
      supabase.removeChannel(dbChannel);
      supabase.removeChannel(broadcastChannel);
      broadcastChannelRef.current = null;
    };
  }, [siteUser?.id]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // If site_member is removed by another tab, sync logout here
      if (e.key === 'site_member' && !e.newValue) {
        setSiteUser(null);
        setUserRole(null);
        window.location.reload();
      }
      if ((e.key === 'site_current_member' || e.key === 'site_member') && e.newValue) {
        try {
          const parsedUser = JSON.parse(e.newValue);
          setSiteUser((prev) => {
            if (!prev || prev.balance !== parsedUser.balance) {
              return parsedUser;
            }
            return prev;
          });
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = session.user;
        const { data: existingUser } = await supabase.from('members').select('*').ilike('email', u.email).maybeSingle();
        
        let finalUser;
        if (existingUser) {
           finalUser = {
                id: existingUser.id,
                username: existingUser.username,
                password: existingUser.password,
                email: existingUser.email || '',
                phone: existingUser.phone || '',
                createdAt: new Date(existingUser.created_at).getTime(),
                status: existingUser.status || 'active',
                notes: existingUser.notes || '',
                role: existingUser.role || 'member',
                balance: existingUser.balance || 0
            };
        } else {
           const usernameBase = u.user_metadata?.full_name?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || u.email?.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') || 'googleuser';
           const newUsername = usernameBase + Math.floor(Math.random() * 1000);
           
           let newUser = null;
           const { data: insertedUser, error: insertError } = await supabase.from('members').insert([{
                username: newUsername,
                email: u.email,
                phone: '05555555555',
                password: 'google_oauth_' + u.id,
                status: 'active'
           }]).select().single();
           
           newUser = insertedUser;
           
           if (insertError) {
             if (insertError.code === '23505') {
                 // Duplicate key error due to React Strict Mode double-firing. Re-fetch user safely.
                 const { data: doubleCheckUser } = await supabase.from('members').select('*').eq('email', u.email).single();
                 newUser = doubleCheckUser;
             } else {
                 console.error("Google login DB insert error:", insertError);
                 alert("Kayıt oluşturulurken veritabanı hatası: " + insertError.message);
             }
           }
           
           if (newUser) {
             if (!insertError) {
                 await supabase.from('loyalty').insert([{
                    user_id: newUser.id,
                    coins: 0,
                    tickets: 0,
                    pending_tickets: 0,
                    total_earned: 0,
                    transactions: [],
                    last_volume_reset_date: '',
                    daily_volume_accumulated: 0
                 }]);
             }
             finalUser = {
                id: newUser.id,
                username: newUser.username,
                password: newUser.password,
                email: newUser.email || '',
                phone: newUser.phone || '',
                createdAt: new Date(newUser.created_at).getTime(),
                status: newUser.status || 'active',
                notes: newUser.notes || '',
                role: newUser.role || 'member',
                balance: newUser.balance || 0
             };
           }
        }

        if (finalUser) {
          setSiteUser(finalUser);
          localStorage.setItem('site_member', JSON.stringify(finalUser));
          setAuthModalMode(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Automatically toggle chat when view or login state changes (for desktop)
  useEffect(() => {
    // Logic removed to keep sidebar collapsed by default
  }, [siteUser, view]);
  const [showDepositModal, setShowDepositModal] = useState(false);

  useEffect(() => {
    const handleOpenDeposit = () => setShowDepositModal(true);
    window.addEventListener('openDepositModal', handleOpenDeposit);
    return () => window.removeEventListener('openDepositModal', handleOpenDeposit);
  }, []);
  const [showFakeBetModal, setShowFakeBetModal] = useState(false);
  const [showLiveScoreModal, setShowLiveScoreModal] = useState(false);
  const [showMyBetsModal, setShowMyBetsModal] = useState(false);

  useEffect(() => {
    const handleOpenMyBets = () => setShowMyBetsModal(true);
    window.addEventListener('openMyBetsModal', handleOpenMyBets);
    return () => window.removeEventListener('openMyBetsModal', handleOpenMyBets);
  }, []);

  useEffect(() => {
    const handleOpenLogin = () => setAuthModalMode('member');
    window.addEventListener('openLoginModal', handleOpenLogin);
    return () => window.removeEventListener('openLoginModal', handleOpenLogin);
  }, []);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentPendingBet, setCurrentPendingBet] = useState<any>(null);

  const sendDiscordNotification = async (bet: any) => {
    let cfg = discordConfig;
    if (!cfg || !cfg.webhookUrl) {
      try {
        cfg = await getGlobalConfig('site_discord_config');
        if (cfg) {
          setDiscordConfig(cfg);
          localStorage.setItem('site_discord_config', JSON.stringify(cfg));
        }
      } catch (e) {
        console.error('Failed to load fallback discord config:', e);
      }
    }

    if (!cfg || !cfg.enabled || !cfg.webhookUrl) {
      return;
    }

    try {
      const selectionsText = bet.selections.map((sel: any, idx: number) => {
        return `${idx + 1}. 🏟️ **${sel.mac_adi}**\n   👉 Bahis: ${sel.bahis} | Oran: \`${sel.oran.toFixed(2)}\``;
      }).join('\n\n');

      const payload = {
        embeds: [
          {
            title: "🔔 YENİ KUPON YATIRILDI!",
            color: 16750848, // Orange (#FFA500)
            fields: [
              { name: "👤 Kullanıcı", value: siteUser?.username || 'Bilinmeyen Kullanıcı', inline: true },
              { name: "💵 Kupon Tutarı", value: `${bet.amount.toFixed(2)} ₺`, inline: true },
              { name: "📈 Toplam Oran", value: bet.totalOdds.toFixed(2), inline: true },
              { name: "💰 Olası Kazanç", value: `${bet.potentialPayout.toFixed(2)} ₺`, inline: true }
            ],
            description: `⚽ **Bahis Detayları:**\n\n${selectionsText}`,
            timestamp: new Date().toISOString(),
            footer: {
              text: "724BETS | Canlı Kupon Bildirim Sistemi"
            }
          }
        ]
      };

      await fetch('/api/send-discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: cfg.webhookUrl,
          payload: payload
        })
      });
      console.log('Discord notification proxy request sent.');
    } catch (err) {
      console.error('Error sending Discord notification:', err);
    }
  };

  const handleFakeBetSubmit = async (amount: number) => {
    if (!siteUser) throw new Error('Oturum kapalı.');
    const newBalance = (siteUser.balance || 0) - amount;
    
    if (siteUser.id !== 'admin-session') {
      const { error } = await supabase.from('members').update({ balance: newBalance }).eq('id', siteUser.id);
      if (error) throw new Error('Veritabanı bağlantı hatası: ' + error.message);
    }

    const totalOdds = currentPendingBet?.toplam_oran || 516.56;
    const selections = currentPendingBet?.secilen_maclar || [
      { mac_adi: "Apejes Academy 1 : 0 Elecsport Limbe", bahis: "Maç Sonucu : 1", oran: 1.15 },
      { mac_adi: "Drukpa 0 : 0 Thimphu FC", bahis: "Maç Sonucu : X", oran: 2.48 },
      { mac_adi: "Radnicki Kragujevas 2 : 0 Buducnost Podgorica", bahis: "Maç Sonucu : 1", oran: 1.15 },
      { mac_adi: "Hubei Istar U20 1 : 2 Henan Songshan Longmen U20", bahis: "Maç Sonucu : 1", oran: 25.00 }
    ];

    const newBet = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      amount: amount,
      selections: selections,
      totalOdds: totalOdds,
      potentialPayout: amount * totalOdds,
      status: 'PENDING'
    };

    const existingBets = JSON.parse(localStorage.getItem('site_my_bets') || '[]');
    localStorage.setItem('site_my_bets', JSON.stringify([newBet, ...existingBets]));
    setCurrentPendingBet(null);

    // Send Discord Notification asynchronously
    sendDiscordNotification(newBet);

    const updatedUser = { ...siteUser, balance: newBalance };
    setSiteUser(updatedUser);
    localStorage.setItem('site_current_member', JSON.stringify(updatedUser));
    localStorage.setItem('site_member', JSON.stringify(updatedUser));
  };

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
    if (storedMarquee && (/betlivo/i.test(storedMarquee) || /724bets/i.test(storedMarquee) || /724bets/i.test(storedMarquee) || /724FUTBOL/i.test(storedMarquee))) {
      const parsedMarquee = JSON.parse(storedMarquee.replace(/betlivo/gi, '724BETS').replace(/724bets/gi, '724BETS').replace(/724FUTBOL\.COM/gi, '724BETS'));
      localStorage.setItem('site_marquee_config', JSON.stringify(parsedMarquee));
      setMarqueeConfig(parsedMarquee);
    }

    const storedWelcome = localStorage.getItem('site_welcome_popup');
    if (storedWelcome && (/betlivo/i.test(storedWelcome) || /724bets/i.test(storedWelcome) || /724bets/i.test(storedWelcome) || /724FUTBOL/i.test(storedWelcome))) {
      const parsedWelcome = JSON.parse(storedWelcome.replace(/betlivo/gi, '724BETS').replace(/724bets/gi, '724BETS').replace(/724FUTBOL\.COM/gi, '724BETS'));
      // Also catch the 'BETLIVOX' variant if it exists
      const cleanedWelcome = JSON.parse(JSON.stringify(parsedWelcome).replace(/724BETS.NETX/gi, '724BETS').replace(/724FUTBOL.COMX/gi, '724BETS'));
      localStorage.setItem('site_welcome_popup', JSON.stringify(cleanedWelcome));
      setWelcomePopupConfig(cleanedWelcome);
    }
  }, []);
  const [themeColor, setThemeColor] = useState('#10B981');
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [welcomePopupConfig, setWelcomePopupConfig] = useState<WelcomePopupConfig>(() => {
    try {
      const stored = localStorage.getItem('site_welcome_popup');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_WELCOME_POPUP_CONFIG;
  });
  const [showWelcomePopup, setShowWelcomePopup] = useState<boolean>(false);
  const [showOnboardingPopup, setShowOnboardingPopup] = useState<boolean>(false);
  const [hashtags, setHashtags] = useState('');
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const stored = localStorage.getItem('site_coupons');
    return stored ? JSON.parse(stored) : demoCoupons;
  });
  const [showSearch, setShowSearch] = useState(false);
// State removed
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

// Effects removed

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

  const [casinoLobbyGames, setCasinoLobbyGames] = useState<CasinoLobbyGame[]>([]);

  const handleCasinoLobbyGamesChange = (games: CasinoLobbyGame[]) => {
    setCasinoLobbyGames(games);
    localStorage.setItem('site_casino_lobby_games', JSON.stringify(games));
    updateGlobalConfig('site_casino_lobby_games', games);
  };

  const handleStartTour = () => {
    localStorage.removeItem('tour_completed');
    const driverObj = driver({
      showProgress: true,
      nextBtnText: 'İleri',
      prevBtnText: 'Geri',
      doneBtnText: 'Bitti',
      progressText: '{{current}} / {{total}}',
      allowClose: true,
      onDestroyStarted: () => {
        if (!driverObj.hasNextStep() || window.confirm("Turu kapatmak istediğinize emin misiniz?")) {
          localStorage.setItem('tour_completed', 'true');
          driverObj.destroy();
        }
      },
      steps: [
        { popover: { title: "724bets'e Hoş Geldiniz! 🚀", description: 'Sitemizi daha yakından tanımak ve kazanmaya başlamak için kısa turumuzu inceleyin.', align: 'center' } },
        { element: '#tour-sidebar', popover: { title: 'Kategoriler & Spor Dalları', description: 'Buradan spor bahisleri, casino ve diğer popüler oyunlara tek tıkla ulaşabilirsiniz.', side: "right", align: 'start' }},
        { element: '#tour-user-panel', popover: { title: 'Bakiye & Kullanıcı İşlemleri', description: 'Güncel bakiyenizi takip edebilir, saniyeler içinde yatırım ve çekim yapabilirsiniz.', side: "bottom", align: 'center' }},
        { element: '#tour-chat', popover: { title: 'Canlı Sohbet', description: 'Sağ panelden diğer üyelerimizle sohbet edebilir, özel etkinlik kodlarını (gift) yakalayabilirsiniz!', side: "left", align: 'start' }},
        { element: '#tour-main', popover: { title: 'Oyun Vitrini (Orta Alan)', description: 'En güncel spor karşılaşmaları ve yüksek oranlı bahisler bu alanda listelenmektedir. Bol şanslar!', side: "top", align: 'center' }}
      ]
    });
    driverObj.drive();
  };

  // App Flow: Skip loader splash screen completely as requested by the user
  useEffect(() => {
    setAppStage('ready');
    setShowLoader(false);
  }, []);

  // Run Driver.js Product Tour if not completed, user is not logged in, and is on homepage
  useEffect(() => {
    if (appStage !== 'ready') return;
    
    const tourCompleted = localStorage.getItem('tour_completed');
    const isUserLoggedIn = !!(siteUser || userRole);

    if (!tourCompleted && !isUserLoggedIn && view === 'home') {
      const timer = setTimeout(() => {
        setShowOnboardingPopup(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [appStage, siteUser, userRole, view]);

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
        const savedCasinoLobby = localStorage.getItem('site_casino_lobby_games');

        setBrands(savedBrands ? JSON.parse(savedBrands) : INITIAL_BRANDS);
        if (savedHashtags) setHashtags(savedHashtags);
        if (savedCoupons) {
          const parsed = JSON.parse(savedCoupons);
          setCoupons(parsed.length > 0 ? parsed : demoCoupons);
        }
        
        // Check if old picsum images are in localStorage, if so, ignore and clear them to force defaults
        if (savedCasinoLobby) {
          if (savedCasinoLobby.includes('picsum.photos')) {
            localStorage.removeItem('site_casino_lobby_games');
          } else {
            const parsed = JSON.parse(savedCasinoLobby);
            const filtered = parsed.filter((g: any) => g.name !== 'Death Becomes You' && g.name !== 'Crazy Time' && g.name !== 'XXXTreme Lightning');
            setCasinoLobbyGames(filtered);
          }
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
        if (savedMember) {
          const parsedUser = JSON.parse(savedMember);
          setSiteUser(parsedUser); // Instantly restore UI state
          
          if (parsedUser.id !== 'admin-session') {
            // Fetch latest balance from DB in background
            const { data: latestUser } = await supabase.from('members').select('balance, role, status').eq('id', parsedUser.id).single();
            if (latestUser) {
              parsedUser.balance = latestUser.balance || 0;
              parsedUser.role = latestUser.role || parsedUser.role;
              parsedUser.status = latestUser.status || parsedUser.status;
              localStorage.setItem('site_current_member', JSON.stringify(parsedUser));
              setSiteUser({...parsedUser}); // Update UI with fresh data
            }
          }
        }

        // 3. Load Global Data from Supabase (Overrides Local) - PARALLEL FETCH
        const [
          globalAnalyses, globalCoupons, globalBrands, globalHero, globalHashtags,
          globalColor, globalBj, globalLoyalty, globalGiveaway, globalMarquee,
          globalNav, globalWheel, globalWelcome, globalSiteStatus,
          globalPromoWheel, globalHeroSlider, globalDailyKupon, globalRaffle,
          globalPopularBets, globalTvConfig, globalLoaderConfig, globalDiscordConfig,
          globalBotsConfig, globalCasinoLobby
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
          getGlobalConfig('site_loader_config'),
          getGlobalConfig('site_discord_config'),
          getGlobalConfig('site_bots_config'),
          getGlobalConfig('site_casino_lobby_games')
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
          const cleaned = JSON.parse(JSON.stringify(globalMarquee).replace(/betlivo/gi, '724BETS').replace(/724bets/gi, '724BETS').replace(/724bets/gi, '724BETS'));
          setMarqueeConfig(cleaned);
        }
        
        if (globalNav) setNavVisibility(globalNav);
        if (globalWheel) setWheelConfig(globalWheel);
        
        if (globalWelcome) {
          const cleaned = JSON.parse(JSON.stringify(globalWelcome).replace(/betlivo/gi, '724BETS').replace(/724bets/gi, '724BETS').replace(/724BETS.NETX/gi, '724BETS').replace(/724FUTBOL\.COMX/gi, '724BETS'));
          setWelcomePopupConfig(cleaned);
        }
        
        if (globalSiteStatus) setSiteStatusConfig(globalSiteStatus);
        
        const resolvedPromoWheel = globalPromoWheel[0] || globalPromoWheel[1];
        if (resolvedPromoWheel) setPromoWheelConfig(resolvedPromoWheel);
        
        if (globalHeroSlider) setHeroSliderConfig(globalHeroSlider);
        
        const globalSlider2Config = await getGlobalConfig('site_slider2_config');
        if (globalSlider2Config) setSlider2Config(globalSlider2Config);

        if (globalDailyKupon) setDailyKuponConfig(globalDailyKupon);
        if (globalRaffle) setRaffleConfig(globalRaffle);
        if (globalPopularBets) setPopularBetsConfig(globalPopularBets);
        if (globalTvConfig) {
          setTvConfig(globalTvConfig);
        }
        if (globalLoaderConfig) setLoaderConfig(globalLoaderConfig);
        if (globalDiscordConfig) {
          setDiscordConfig(globalDiscordConfig);
          localStorage.setItem('site_discord_config', JSON.stringify(globalDiscordConfig));
        }
        if (globalBotsConfig && Array.isArray(globalBotsConfig)) {
          setBotsConfig(globalBotsConfig);
          localStorage.setItem('site_bots_config', JSON.stringify(globalBotsConfig));
        }
        if (globalCasinoLobby && Array.isArray(globalCasinoLobby)) {
          const hasOldPicsum = globalCasinoLobby.some(g => g.image && g.image.includes('picsum.photos'));
          if (!hasOldPicsum) {
            const filtered = globalCasinoLobby.filter((g: any) => g.name !== 'Death Becomes You' && g.name !== 'Crazy Time' && g.name !== 'XXXTreme Lightning');
            setCasinoLobbyGames(filtered);
            localStorage.setItem('site_casino_lobby_games', JSON.stringify(filtered));
          }
        }

      } catch (err) {
        console.error('Initialization error:', err);
      }
    }

    initData();

    // Supabase Realtime Subscription for instant maintenance mode enforcement
    const channel = supabase.channel('site_configs_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_configs' }, (payload: any) => {
        if (payload.new && payload.new.key === 'site_status' && payload.new.value) {
          setSiteStatusConfig(payload.new.value);
        }
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
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
    id: '724bets', name: '724BETS', subtitle: 'CASINO & CANLI BAHİS',
    offerMain: '%280', offerSub: 'HOŞGELDİN BONUSU !!!',
    logo: 'https://picsum.photos/seed/bahisbey/400/400', link: 'https://bahisbey1438.com/?btag=59649488_330539', isSponsor: true,
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
      if (cleanPath === '/demo-oyunlar' || cleanPath === '/casino/demo' || cleanPath === '/demo') {
        setView('demo');
      } else if (cleanPath === '/raffles') {
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
      } else if (cleanPath === '/casino') {
        setView('blackjack');
      } else if (cleanPath === '/spor') {
        setView('sports');
      } else if (cleanPath === '/canli') {
        setView('sports');
      } else if (cleanPath === '/lucky-wheel' || cleanPath === '/luckywheel' || cleanPath === '/cark') {
        setView('luckywheel');
      } else {
        const viewName = cleanPath.substring(1);
        const validViews = ['adventure', 'blackjack', 'blackjack-pro', 'casino2', 'loyalty', 'pool', 'wheel', 'luckywheel', 'giveaway', 'sports', 'sports2', 'sports3', 'sports4', 'sports5', 'demo', 'kral', 'analysis', 'plinko', 'limbo', 'chicken-run', 'dice', 'mines', 'keno', 'war', 'hilo', 'roulette', 'crash-turbo', 'turbo-mines', 'hacksaw', 'redtiger', 'upcomingMatches'];
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

  // SEO dynamic title and meta logic
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (view === 'demo') {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else if (robotsMeta) {
      robotsMeta.setAttribute('content', 'index, follow');
    }

    let title = "724bets - Güvenilir Bahis ve Canlı Casino";
    let desc = "724bets ile en yüksek oranlarla spor bahisleri yapın, canlı casino oyunlarının keyfini çıkarın. Hemen üye olun, kazanmaya başlayın!";
    
    switch(view) {
      case 'upcomingMatches':
        title = "724bets | Günün Maçları";
        desc = "Günün en popüler maçlarını görüntüleyin.";
        break;
      case 'home':
      default:
        title = "724bets | Canlı Bahis, Casino ve Canlı Casino Seçenekleri";
        desc = "724bets ana sayfasında en güncel spor müsabakaları, popüler slot oyunları ve canlı casino masalarına hemen ulaşın.";
        break;
      case 'sports':
      case 'sports2':
      case 'sports3':
      case 'sports4':
      case 'sports5':
      case 'spor724':
      case 'mobile-bulletin':
        title = "724bets | Spor Bahisleri ve Yüksek Oranlı Canlı Bahis";
        desc = "Dünyanın her yerinden futbol, basketbol, tenis ve daha fazla spor dalına maç öncesi ve canlı bahis yapma fırsatı 724bets'te.";
        break;
      case 'blackjack':
      case 'blackjack-pro':
      case 'casino2':
      case 'slotra':
      case 'slotra2':
      case 'plinko':
      case 'limbo':
      case 'chicken-run':
      case 'pool':
        title = "724bets | Casino ve Canlı Casino Oyunları - Hızlı Kazanç";
        desc = "724bets güvencesiyle rulet, blackjack, poker, baccarat ve binlerce popüler slot oyunu ile eğlenerek kazanın.";
        break;
      case 'trusted-sites':
      case 'trusted-detail':
      case 'brands':
        title = "724bets | Güvenilir Bahis Siteleri ve Şirket İncelemeleri";
        desc = "Güvenilir bahis şirketleri listesi, detaylı incelemeler, oyuncu yorumları ve platform değerlendirmeleri 724bets kalitesiyle sizlerle.";
        break;
      case 'analysis':
        title = "724bets | Detaylı Maç Analizleri ve Banko Kuponlar";
        desc = "Uzman kadromuzdan en güncel maç istatistikleri, oran analizleri ve banko tahminler 724bets Analiz sayfasında.";
        break;
      case 'coupons':
        title = "724bets | Hazır Kuponlar ve Günün Kuponu";
        desc = "Kazanma oranı yüksek günün hazır kuponları ve popüler bahis kombinasyonlarını hemen inceleyin.";
        break;
      case '724tv':
        title = "724bets TV | Kesintisiz ve Şifresiz Canlı Maç İzle";
        desc = "724bets TV üzerinden tüm spor karşılaşmalarını şifresiz, donmadan, full HD kalitede bedava izleyin.";
        break;
      case 'raffle':
      case 'cekilis':
      case 'giveaway':
        title = "724bets | Çekilişler, Turnuvalar ve Büyük Ödüller";
        desc = "724bets'in düzenlediği muhteşem çekilişlere katılın, nakit ödüller, free spinler and dev hediyeler kazanma şansı yakalayın.";
        break;
      case 'loyalty':
        title = "724bets | VIP Sadakat Programı - Size Özel Ayrıcalıklar";
        desc = "Bahis yaptıkça puan toplayın, 724bets VIP ayrıcalıklarından ve sınırsız ödüllerden anında faydalanın.";
        break;
      case 'promo':
        title = "724bets | Güncel Promosyonlar, Bonus ve Deneme Bonusu Kodu";
        desc = "En güncel 724bets promosyon kodları, hoş geldin bonusları ve bedava bahis seçenekleri bu sayfada.";
        break;
    }

    document.title = title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);
    
  }, [view]);

  // Hook to handle Kuponu Onayla tracking for sports2 view
  useEffect(() => {
    if (view === 'sports2') {
      const timer = setTimeout(() => {
        const onayButonlari = Array.from(document.querySelectorAll('button, a, div'));
        const kuponOnayButonu = onayButonlari.find(el => el.textContent?.trim() === 'KUPONU ONAYLA' || el.textContent?.trim() === 'ONAYLA');

        if (kuponOnayButonu) {
          const handleOnayClick = () => {
            console.log('Kupon Onay Tetiklendi! Veriler toplanıyor...');

            const aktifSekme = document.querySelector('.active-tab')?.textContent?.trim() || 'Kombine';

            const kuponData = {
              kupon_turu: aktifSekme,
              secilen_maclar: [
                { mac_adi: "Apejes Academy 1 : 0 Elecsport Limbe", bahis: "Maç Sonucu : 1", oran: 1.15 },
                { mac_adi: "Drukpa 0 : 0 Thimphu FC", bahis: "Maç Sonucu : X", oran: 2.48 },
                { mac_adi: "Radnicki Kragujevas 2 : 0 Buducnost Podgorica", bahis: "Maç Sonucu : 1", oran: 1.15 },
                { mac_adi: "Hubei Istar U20 1 : 2 Henan Songshan Longmen U20", bahis: "Maç Sonucu : 1", oran: 25.00 }
              ],
              toplam_oran: 516.56,
              toplam_kazanc: 0.00
            };

            setCurrentPendingBet(kuponData);
            console.log('Yakalanan Kupon Verisi:', kuponData);

            fetch('/api/save-coupon', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(kuponData)
            })
            .then(res => res.json())
            .then(data => console.log('Kupon başarıyla kaydedildi:', data))
            .catch(err => console.error('Kupon kaydedilirken hata oluştu:', err));
          };

          kuponOnayButonu.addEventListener('click', handleOnayClick);

          return () => {
            kuponOnayButonu.removeEventListener('click', handleOnayClick);
          };
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [view]);

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

  if (view === 'admin') {
    if (userRole !== 'admin') {
      return (
        <div style={{ width: '100vw', height: '100dvh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ef4444', marginBottom: '16px' }}>Erişim Engellendi</h1>
          <p style={{ color: '#9ca3af', fontSize: '15px', maxWidth: '400px', textAlign: 'center', lineHeight: 1.6, marginBottom: '24px' }}>
            Bu sayfaya (Yönetim Paneli) erişim yetkiniz bulunmamaktadır.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => { setAuthModalMode('admin'); }} style={{ padding: '12px 24px', background: '#10b981', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>
              Yönetici Girişi Yap
            </button>
            <button onClick={() => { window.location.href = '/'; }} style={{ padding: '12px 24px', background: '#3b82f6', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      );
    }
    
    return (
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
        siteUser={siteUser}
        onUpdateUser={(updated) => {
          setSiteUser(updated);
          localStorage.setItem('site_current_member', JSON.stringify(updated));
        }}
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
        onLogout={handleGlobalLogout}
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
        slider2Config={slider2Config}
        onSaveSlider2Config={handleSlider2ConfigChange}
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
        discordConfig={discordConfig}
        onSaveDiscordConfig={handleDiscordConfigChange}
        botsConfig={botsConfig}
        onSaveBotsConfig={handleBotsConfigChange}
        casinoLobbyGames={casinoLobbyGames}
        onSaveCasinoLobbyGames={handleCasinoLobbyGamesChange}
        luckyWheelConfig={luckyWheelConfig}
        onSaveLuckyWheelConfig={handleLuckyWheelConfigChange}
      />
    </ErrorBoundary>
  );
}

  const handleViewChange = (v: string) => {
    // Update URL without reloading
    const newUrl = v === 'home' ? '/' : (v === 'spor724' || v === 'sports' ? '/spor' : `/${v}`);
    window.history.pushState(null, '', newUrl);

    const sportsViews = ['gercek', 'sports', 'spor724', 'slotra', 'spor'];
    if (sportsViews.includes(v)) {
      setIsChatOpen(true);
    }

    if (v === 'sports2' || v === 'sports3' || v === 'sports4' || v === 'sports5') {
      setShowLoader(true);
      setFadeOutLoader(false);
      setIframeLoading(true);
      setTimeout(() => {
        setFadeOutLoader(true);
        setIframeLoading(false);
        setTimeout(() => setShowLoader(false), 500);
      }, 2500);
    }
    if (v !== 'analysis') {
      setActiveAnalysisId(null);
    }
    if (v !== 'blackjack' && v !== 'blackjack-pro') {
      setActiveCasinoGame(null);
    }
    // Lucky Wheel is members-only
    // Disabled login block to allow instant preview of WheelDashboard

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
    } else if (v === 'blackjack') {
      path = '/casino';
    } else if (v === 'spor724') {
      path = '/spor';
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

  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const isMaintenanceActive = false; // Disabled by request

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

  if (isMaintenanceActive && view !== 'admin') {
    return (
      <UserProvider siteUser={siteUser} setSiteUser={setSiteUser}>
        <div className="relative w-full h-[100dvh] bg-[#050505] overflow-hidden">
          {authModalMode && (
            <AuthModal
              mode={authModalMode === 'register' ? 'member' : authModalMode}
              initialMemberMode={authModalMode === 'register' ? 'register' : 'login'}
              onMemberLogin={(user) => {
                setSiteUser(user);
                localStorage.setItem('site_current_member', JSON.stringify(user));
                if (user.role && user.role !== 'member') {
                  setUserRole(user.role);
                  localStorage.setItem('site_user_role', user.role);
                }
                setAuthModalMode(null);
              }}
              onAdminLogin={(role) => {
                setUserRole(role);
                localStorage.setItem('site_user_role', role);
                const isGuest = role.startsWith('guest_');
                const guestUsername = isGuest ? role.replace('guest_bypass_', '').replace('guest_', '') : '';
                const adminUser: SiteUser = {
                  id: isGuest ? `guest_${guestUsername}` : 'admin-session',
                  username: isGuest ? guestUsername : 'Yönetici',
                  password: '',
                  email: isGuest ? `guest@724bets.com` : 'admin@724bets.com',
                  createdAt: Date.now(),
                  status: 'active',
                  notes: isGuest ? 'Misafir Yöneticisi' : 'Ana Yönetici',
                  role: role as any,
                  balance: 1000
                };
                setSiteUser(adminUser);
                localStorage.setItem('site_current_member', JSON.stringify(adminUser));
                setAuthModalMode(null);
                if (isGuest) {
                  setView('home');
                } else {
                  setView('admin');
                }
              }}
              onClose={() => setAuthModalMode(null)}
              hideMemberLogin={true}
            />
          )}
          <MaintenanceScreen 
            message={siteStatusConfig.maintenanceMessage || "724bets.net ve 724bahis.net üzerinde sistem güncellemesi yapılmaktadır. Kısa süre sonra hizmetinizdeyiz."} 
            onAdminLogin={() => setAuthModalMode('admin')}
            onBypass={() => setMaintenanceBypass(true)}
          />
        </div>
      </UserProvider>
    );
  }

  return (
    <UserProvider siteUser={siteUser} setSiteUser={setSiteUser}>
      <BetSlipProvider>
        <>
          {/* Onboarding Popup Overlay */}
      {showOnboardingPopup && (
        <OnboardingPopup 
          onStartTour={() => {
            setShowOnboardingPopup(false);
            handleStartTour();
          }}
          onClose={() => {
            setShowOnboardingPopup(false);
            localStorage.setItem('tour_completed', 'true');
          }}
        />
      )}

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
            setIsSidebarOpen(true);

            setAuthModalMode(null);
          }}
          onAdminLogin={(role) => {
            setUserRole(role);
            localStorage.setItem('site_user_role', role);
            
            const savedMember = localStorage.getItem('site_current_member');
            let existingBalance = 10000;
            if (savedMember) {
              try {
                const parsed = JSON.parse(savedMember);
                if (parsed.username === 'Yönetici' && typeof parsed.balance === 'number') {
                  existingBalance = parsed.balance;
                }
              } catch (e) {}
            }

            const isGuest = role.startsWith('guest_bypass');
            const guestUsername = isGuest ? role.replace('guest_bypass_', '') || 'misafir' : '';

            const adminUser: SiteUser = {
              id: isGuest ? `guest_${guestUsername}` : 'admin-session',
              username: isGuest ? guestUsername : 'Yönetici',
              password: '',
              email: isGuest ? `guest@724bets.com` : 'admin@724bets.com',
              phone: '',
              createdAt: Date.now(),
              role: role as any,
              balance: isGuest ? 1000 : existingBalance
            };
            setSiteUser(adminUser);
            localStorage.setItem('site_current_member', JSON.stringify(adminUser));
            
            setIsSidebarOpen(true);

            setAuthModalMode(null);
            if (isGuest) {
              setView('home');
            } else {
              setView('admin');
            }
          }}
          onClose={() => setAuthModalMode(null)}
          hideMemberLogin={isMaintenanceActive && authModalMode === 'admin'}
        />
      )}

      {showDepositModal && (
        <WalletModal onClose={() => setShowDepositModal(false)} />
      )}

      {(['blackjack-pro', 'limbo', 'chicken-run', 'plinko', 'dice', 'mines', 'keno', 'war', 'hilo', 'roulette', 'crash-turbo', 'turbo-mines', 'hacksaw', 'redtiger'].includes(view)) ? (
        <InGameLayout 
          siteUser={siteUser} 
          onViewChange={handleViewChange} 
          gameTitle={
              view === 'limbo' ? 'Limbo' : 
              view === 'chicken-run' ? 'Chicken Run' : 
              view === 'plinko' ? 'Plinko' :
              view === 'dice' ? 'Dice' :
              view === 'mines' ? 'Mines' :
              view === 'keno' ? 'Keno' :
              view === 'war' ? 'Casino War' :
              view === 'hilo' ? 'HiLo' :
              view === 'roulette' ? 'Roulette' :
              view === 'crash-turbo' ? 'Crash' :
              view === 'turbo-mines' ? 'Turbo Mines' :
              view === 'hacksaw' ? 'Hacksaw Slot' :
              view === 'redtiger' ? 'Red Tiger Slot' :
              'Blackjack Pro'
          }
        >
           {view === 'blackjack-pro' && (
             <BlackjackProView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'limbo' && (
             <LimboView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'chicken-run' && (
             <ChickenRunView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'plinko' && (
             <PlinkoView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'dice' && (
             <DiceView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'mines' && (
             <MinesView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'keno' && (
             <KenoView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'war' && (
             <WarView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'hilo' && (
             <HiLoView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'roulette' && (
             <RouletteView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'crash-turbo' && (
             <CrashTurboView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'turbo-mines' && (
             <TurboMinesView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}

           {view === 'hacksaw' && (
             <HacksawSlotView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
           {view === 'redtiger' && (
             <RedTigerSlotView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
           )}
        </InGameLayout>
      ) : (
        <div 
          className="relative flex flex-col h-[100dvh] w-full bg-[#050505] text-white overflow-hidden" 
          onPointerDown={() => setIsLogoSpinning(true)}
          onPointerUp={() => setIsLogoSpinning(false)}
          onPointerCancel={() => setIsLogoSpinning(false)}
          style={{
            visibility: (appStage === 'ready' || appStage === 'popup' || showLoader) ? 'visible' : 'hidden',
            '--header-height': '60px'
          } as React.CSSProperties}
        >
          {showLoader && <AppLoader fadeOut={fadeOutLoader} onComplete={() => setFadeOutLoader(true)} isReady={!iframeLoading && isContentReady} />}
          
          {/* MASAÜSTÜ TAM GENİŞLİK HEADER */}
          {view !== 'kral' && (
            <div className="hidden lg:block shrink-0 z-50 relative w-full border-b border-white/5 bg-black shadow-lg">
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
                onMemberLogout={handleGlobalLogout}
                onSearchClick={() => setShowSearch(true)}
                onSupportClick={() => {
                  if (!isMobile && ['gercek', 'sports', 'spor724', 'slotra', 'spor'].includes(view)) return;
                  setIsChatOpen(prev => !prev);
                }}
                navVisibility={navVisibility}
                marqueeConfig={marqueeConfig}
                isChatOpen={isChatOpen || (!isMobile && ['gercek', 'sports', 'spor724', 'slotra', 'spor'].includes(view))}
                isSidebarOpen={isSidebarOpen || (!isMobile && ['gercek', 'sports', 'spor724', 'slotra', 'spor'].includes(view))}
                onToggleSidebar={() => {
                  if (!isMobile && ['gercek', 'sports', 'spor724', 'slotra', 'spor'].includes(view)) return;
                  setIsSidebarOpen(!isSidebarOpen);
                }}
                showFakeBetButton={view === 'sports2'}
                onFakeBetClick={() => {
                   if (!siteUser) setAuthModalMode('member');
                   else setShowFakeBetModal(true);
                }}
              />
            </div>
          )}

          {/* MAIN FLEX LAYOUT (Sidebar + Content + Chat) */}
          <div className="flex flex-1 w-full overflow-hidden relative">

            {/* 1. SOL MENÜ (Masaüstünde Açılır/Kapanır, Mobilde Gizli) */}
            {!(view === 'giveaway') && (
              <aside className={`hidden lg:flex flex-col bg-[#171e2e] shadow-[5px_0_15px_rgba(0,0,0,0.5)] h-full overflow-visible flex-shrink-0 relative z-20 transition-all duration-300 ${isSidebarOpen ? 'w-[280px]' : 'w-[78px]'}`}>
                  <Sidebar
                    isOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                    activeView={view}
                    onViewChange={handleViewChange}
                    userRole={userRole}
                    siteUser={siteUser}
                    navVisibility={navVisibility}
                    onStartTour={handleStartTour}
                  />
              </aside>
            )}

            {/* MOBİL DRAWER - SOL MENÜ */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-50 flex lg:hidden">
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
                <aside className="w-[280px] bg-[#171e2e] border-r border-white/5 h-full shadow-[20px_0_50px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.03)] flex-shrink-0 relative z-10 animate-slide-in-left">
                  <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 -right-12 w-10 h-10 bg-[#0A0D14] border border-[#111111] rounded-r-xl flex items-center justify-center text-gray-400 hover:text-white shadow-[5px_0_15px_rgba(0,0,0,0.3)]"><X className="w-5 h-5"/></button>
                  <Sidebar
                    isOpen={true}
                    onToggle={() => setIsMobileMenuOpen(false)}
                    activeView={view}
                    onViewChange={(v) => { handleViewChange(v); setIsMobileMenuOpen(false); }}
                    userRole={userRole}
                    siteUser={siteUser}
                    navVisibility={navVisibility}
                    onStartTour={handleStartTour}
                  />
                </aside>
              </div>
            )}

            {/* 2. ORTA İÇERİK */}
            <div className={appStage !== 'loading' ? `app-reveal-mask flex-1 flex flex-col min-w-0 bg-[#050505] relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,1)]` : `app-hidden-initial flex-1 flex flex-col min-w-0 bg-[#050505] relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,1)]`}>
             
             {/* Glossy overlay for the entire center */}
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTEwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none z-0 opacity-30 mix-blend-screen"></div>

            {/* SADECE MOBİLDE GÖRÜNEN ÜST BAR (Header) */}
            {view !== 'kral' && (
              <header 
                id="mobile-top-header"
                className="flex lg:hidden items-center justify-between p-3 px-4 bg-black/95 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-xl border-b border-white/10 shrink-0 sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden gap-1"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="flex items-center cursor-pointer select-none ml-2 group"
                    onClick={() => setView('home')}
                    style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}
                  >
                    <span className="text-[#10B981] font-extrabold text-2xl sm:text-3xl tracking-tight lowercase">
                      724bets
                    </span>
                    <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 ml-1 -mt-4">
                      <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-[#10B981] drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">
                        {/* 3-leaf clover (Shamrock) */}
                        <path d="M 50,48 C 30,30 35,10 50,20 C 65,10 70,30 50,48 Z" />
                        <path d="M 46,52 C 30,35 10,40 20,55 C 10,70 30,75 46,52 Z" />
                        <path d="M 54,52 C 70,35 90,40 80,55 C 90,70 70,75 54,52 Z" />
                        <path d="M 50,52 Q 45,75 40,90 L 46,90 Q 51,75 50,52 Z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center shrink-0">
                  {siteUser ? (
                    <>
                      {/* 1. Gamdom Style Wallet (Pill) */}
                      <div 
                        className="flex items-center bg-[#111111] rounded-lg p-1.5 pr-3 cursor-pointer border border-white/5 hover:bg-[#202632] transition-colors shadow-inner balance-intro-fade"
                        onClick={() => window.dispatchEvent(new Event('openDepositModal'))}
                      >
                        <div className="w-7 h-7 rounded bg-[#10B981] text-black flex items-center justify-center font-bold mr-2 shadow-[0_0_8px_rgba(0,255,163,0.4)]">
                          <span className="text-[14px]">₺</span>
                        </div>
                        <span className="text-white font-bold text-sm sm:text-base tracking-tight mr-1.5">₺{siteUser.balance?.toFixed(2) || '0.00'}</span>
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </div>
                      
                      {/* 2. Cüzdan Butonu (Sadece İkon) - HIDDEN ON MOBILE PER USER REQUEST */}
                      {/* 
                      <button 
                        onClick={() => window.dispatchEvent(new Event('openDepositModal'))}
                        className="flex items-center justify-center w-10 h-10 bg-[#10B981] hover:bg-[#00e693] rounded-lg transition-colors ml-2 shadow-[0_0_15px_rgba(0,255,163,0.2)] active:scale-95"
                      >
                        <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 7.5C21 5.567 19.433 4 17.5 4H6.5C4.567 4 3 5.567 3 7.5v9C3 18.433 4.567 20 6.5 20h11c1.933 0 3.5-1.567 3.5-3.5v-9zm-3.5 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                        </svg>
                      </button>
                      */}
                      
                      {/* 3. Profil Avatarı - HIDDEN ON MOBILE PER USER REQUEST */}
                      {/*
                      <button onClick={() => handleViewChange('profile')} className="w-10 h-10 rounded-full border border-white/10 bg-[#111111] overflow-hidden shrink-0 hover:border-white/20 transition-colors ml-2 active:scale-95" title="Profile Git">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${siteUser.username}`} alt="Avatar" className="w-full h-full object-cover" />
                      </button>
                      */}

                      {/* 4. Çıkış Yap (Mobile) */}
                      <button 
                        onClick={() => {
                          localStorage.removeItem('site_current_member');
                          localStorage.removeItem('site_member');
                          localStorage.removeItem('site_user_role');
                          window.location.reload();
                        }} 
                        className="w-10 h-10 flex items-center justify-center rounded-md bg-red-500/10 text-red-500 border border-red-500/20 ml-2 active:scale-95"
                        title="Çıkış Yap"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Gamdom Style Mobile Auth Buttons */}
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-1">
                        <button
                          onClick={() => setAuthModalMode('member')}
                          className="flex items-center justify-center h-[34px] md:h-[36px] bg-[#1b1e28] hover:bg-white/5 text-white border border-white/5 rounded-md font-bold text-[12px] sm:text-[13px] px-3 transition-colors whitespace-nowrap"
                        >
                          Giriş yap
                        </button>
                        <button
                          onClick={() => setAuthModalMode('register')}
                          className="flex items-center justify-center h-[34px] md:h-[36px] bg-[#10b981] hover:bg-[#00e693] text-black border border-transparent rounded-md font-extrabold text-[12px] sm:text-[13px] px-3 sm:px-4 transition-colors whitespace-nowrap"
                        >
                          Kaydolun
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </header>
            )}

            {/* Masaüstü Header'ı Yukarı Taşıdığımız İçin Buradaki Header'ı Kaldırdık */}
          {/* İÇERİK VE CHAT KISMI YANYANA */}
          <div className="flex flex-1 w-full overflow-hidden relative">
            <main 
              id="main-scroll-container"
              className="flex-1 min-w-0 h-full overflow-x-hidden relative flex flex-col overflow-y-auto"
            >
            {/* Gamdom Style Global Ambient Shading / Glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                
                
                
                {/* Global subtle radial gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(255,255,255,0.01),transparent_70%)]"></div>
            </div>

      <div 
        id="tour-main"
        className={`site-main-content ${view === 'admin' ? 'admin-layout' : ''} ${
          (view === 'gercek' || view === 'sports' || view === 'sports2' || view === 'sports3' || view === 'sports4' || view === 'sports5' || view === 'spor724' || view === 'upcomingMatches' || view === 'limbo' || view === 'chicken-run' || view === 'originals' || view === 'blackjack' || view === 'slots' || view === 'live-casino' || view === 'favorites' || view === '724tv' || view === 'luckywheel' || view === 'raffle' || view === 'cekilis') 
            ? 'p-0 w-full max-w-full mx-auto pb-[70px] md:pb-0' 
            : 'px-2 py-4 md:p-6 w-full max-w-[1400px] mx-auto pb-[80px] md:pb-6'
        }`}
        style={{ 
          position: 'relative', 
          zIndex: 10, 
          filter: appStage === 'popup' ? 'blur(10px)' : 'none', 
          pointerEvents: appStage === 'popup' ? 'none' : 'auto',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)'
        } as React.CSSProperties}
      >

        <div className={`orchestrator-content ${isContentReady ? 'content-ready' : ''}`} style={{ visibility: appStage === 'ready' ? 'visible' : 'hidden', height: appStage === 'ready' ? 'auto' : '100dvh' }}>

          {view === 'home' && (
          <div className="animate-fade-in w-full h-full min-h-screen">
            <GuestLanding
              siteUser={siteUser}
              onSearchClick={() => setShowSearch(true)}
              onViewChange={(v) => setView(v as any)}
              onMemberLoginClick={() => setAuthModalMode('member')}
              onMemberRegisterClick={() => setAuthModalMode('register')}
              customGames={casinoLobbyGames}
            />
          </div>
          )}

          {view === 'adventure' && (
            <div className="animate-fade-in w-full h-full">
              <AdventureMap />
            </div>
          )}

        {view === 'brands' && (
          <div className="animate-fade-in" style={{ padding: '40px 0 100px' }}>
            <section id="brands-section" className="brands-section relative z-10">
              <div className="brands-header mb-12 animate-fade-in-up">
                <h2 className="text-[40px] md:text-[48px] font-black italic uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                  GÜVENİLİR <span className="text-[#10B981]">FİRMALAR</span>
                </h2>
                <div className="h-1 w-20 bg-[#10B981] mx-auto mt-4 mb-6 shadow-[0_0_15px_rgba(0,255,163,0.4)]" />
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

        {view === 'sports' && (
          <GercekView onNavigate={handleViewChange} />
        )}

        {view === 'gercek' && (
          <GercekView onNavigate={handleViewChange} />
        )}

        {view === 'originals' && (
          <div className="animate-fade-in w-full h-full relative z-[50]">
            <OriginalsHub onNavigate={handleViewChange} isLoggedIn={!!(siteUser || userRole)} siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />
          </div>
        )}

        {view === 'retro-wheel' && (
          <div className="animate-fade-in w-full h-full relative z-[50]">
            <RetroLayout />
          </div>
        )}

        {view === 'rewards' && (
          <div className="animate-fade-in w-full h-full relative z-[50]">
            <RewardsPage onBack={() => handleViewChange('home')} siteUser={siteUser} />
          </div>
        )}

        {view === 'sports2' && (
          <div className="animate-fade-in w-full relative flex flex-col" style={{ height: 'calc(100vh - var(--header-height))' }}>
            
            {/* ── GAMDOM STYLE BANNER & MATCHES ── */}
            <div className="w-full shrink-0 px-4 md:px-8 max-w-[1400px] mx-auto hidden md:block">
              <WorldCupTeaser />
            </div>

            {/* Custom Sports2 Header Removed */}
            {/* Iframe Container */}
            <div 
              ref={sports2ContainerRef}
              className="w-full flex-1 shadow-2xl bg-[#050505] relative rounded-b-2xl z-10"
              style={{
                overflowX: isMobile ? 'auto' : 'hidden',
                overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div style={{ width: isMobile ? '768px' : '100%', height: '100%', position: 'relative' }}>
                {iframeLoading && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#09090b]">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      <div className="text-amber-500 font-bold text-lg animate-pulse tracking-wider">VERİLER YÜKLENİYOR...</div>
                    </div>
                  </div>
                )}
                <iframe 
                  src={sports2Url}
                  onLoad={() => {
                     setIframeLoading(false);
                     // Allow a slight delay for the iframe to render before setting scroll
                     if (isMobile && sports2ContainerRef.current) {
                        setTimeout(() => {
                          if (sports2ContainerRef.current) sports2ContainerRef.current.scrollLeft = 210;
                        }, 100);
                     }
                  }}
                  frameBorder="0"
                  allowFullScreen
                  title="Spor 2"
                  className="relative z-0"
                  style={{
                    position: 'absolute',
                    top: '-230px',
                    left: '0',
                    width: '100%',
                    height: 'calc(100% + 230px)'
                  }}
                />
                
              </div>

              {/* Site theme color overlay (tinting the grey background to slate) */}
              <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay bg-[#050505]/40" />
              <div className="absolute inset-0 z-10 pointer-events-none mix-blend-color bg-[#050505]/20" />
            </div>
          </div>
        )}

        {view === 'sports4' && (
          <div className="animate-fade-in w-full h-full relative">
            {iframeLoading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#09090b] rounded-lg" style={{ height: 'calc(100vh - var(--header-height))' }}>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-amber-500 font-bold text-lg animate-pulse tracking-wider">VERİLER YÜKLENİYOR...</div>
                </div>
              </div>
            )}
            <div className="w-full rounded-lg overflow-hidden shadow-2xl bg-[#050505] relative" style={{ height: 'calc(100vh - var(--header-height))' }}>
              <iframe 
                src="https://sport.megobocteb.com/SportsBook/Home"
                frameBorder="0"
                allowFullScreen
                title="Spor 4"
                className="relative z-0"
                style={{
                  position: 'absolute',
                  top: '-165px',
                  left: '0',
                  width: '100%',
                  height: 'calc(100% + 165px)'
                }}
              />

              {/* Site theme color overlay (tinting the grey background to slate) */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay bg-[#050505]/40" 
                style={{ 
                  clipPath: isMobile 
                    ? 'polygon(0% 0%, 100% 0%, 100% calc(100% - 60px), 0% calc(100% - 60px))' 
                    : 'polygon(0% 0%, 100% 0%, 100% calc(100% - 70px), calc(100% - 300px) calc(100% - 70px), calc(100% - 300px) 100%, 0% 100%)' 
                }} 
              />
              <div 
                className="absolute inset-0 z-10 pointer-events-none mix-blend-color bg-[#050505]/20" 
                style={{ 
                  clipPath: isMobile 
                    ? 'polygon(0% 0%, 100% 0%, 100% calc(100% - 60px), 0% calc(100% - 60px))' 
                    : 'polygon(0% 0%, 100% 0%, 100% calc(100% - 70px), calc(100% - 300px) calc(100% - 70px), calc(100% - 300px) 100%, 0% 100%)' 
                }} 
              />
            </div>
          </div>
        )}

        {view === 'sports5' && (
          <div className="animate-fade-in w-full h-full relative" style={{ height: 'calc(100vh - var(--header-height))', overflow: 'hidden' }}>
            {iframeLoading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#09090b]">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-amber-500 font-bold text-lg animate-pulse tracking-wider">VERİLER YÜKLENİYOR...</div>
                </div>
              </div>
            )}
            <div className="w-full h-full bg-black relative overflow-hidden flex flex-col items-center">
              <iframe 
                src="https://xslotlive2.xyz/"
                frameBorder="0"
                allowFullScreen
                scrolling={isMobile ? "yes" : "no"}
                title="Spor 5"
                style={{
                  position: 'absolute',
                  top: isMobile ? '-80px' : '-210px', // Hides the dark header and top banner completely
                  left: '0',
                  width: '100%', 
                  height: isMobile ? 'calc(100% + 80px)' : 'calc(100% + 210px)', // Locks player in place on desktop
                  border: 'none',
                  zIndex: 10
                }}
              />
              
              {/* Cinema Mode Black Mask Overlays & Click Blockers */}
              <div className="absolute inset-0 z-40 flex flex-col pointer-events-none items-center">
                
                {/* Top Mask - Hides anything above the video box */}
                <div className="w-full bg-black pointer-events-auto" style={{ height: isMobile ? '0px' : '30px' }}></div>
                
                {/* Center Row */}
                <div className="flex w-full justify-center" style={{ height: isMobile ? '100%' : '520px' }}>
                  {/* Left Mask - Blocks side banners & grey background */}
                  <div className="h-full bg-black pointer-events-auto flex-1"></div>
                  
                  {/* Transparent Center Hole (Video Box & Channel List only) */}
                  <div className="h-full bg-transparent pointer-events-none" style={{ width: '100%', maxWidth: '980px' }}></div>
                  
                  {/* Right Mask - Blocks side banners & grey background */}
                  <div className="h-full bg-black pointer-events-auto flex-1"></div>
                </div>
                
                {/* Bottom Mask - Hides everything below the video box (orange banners) */}
                {!isMobile && <div className="w-full bg-black pointer-events-auto flex-1"></div>}
              </div>
            </div>
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

        {(view === 'casino' || view === 'blackjack' || view === 'slots' || view === 'live-casino' || view === 'favorites') && (
          <div className="animate-fade-in w-full h-full relative z-[50] min-w-0">
            <CasinoLobby 
              customGames={casinoLobbyGames} 
              isLoggedIn={!!(siteUser || userRole)}
              onNavigate={handleViewChange}
              initialTab={view === 'slots' ? 'slots' : view === 'live-casino' ? 'live' : view === 'favorites' ? 'favorites' : 'all'}
            />
          </div>
        )}

        {view === 'slotra' && (
          <div className="w-full h-full flex flex-col bg-[#0a0a0a]">
            <Header onAdminClick={() => {}} onViewChange={() => {}} activeView="slotra" />
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-wider text-center">Gerçek Casino</h1>
              <div className="text-zinc-500 text-center max-w-xl mx-auto">Gerçek casino deneyimi çok yakında...</div>
            </div>
          </div>
        )}

        {(view === 'spor724' || view === 'upcomingMatches') && (
          <GercekView 
            onNavigate={handleViewChange} 
            initialTab={view === 'upcomingMatches' ? 'upcoming' : 'home'} 
          />
        )}

        {view === 'casino2' && (
          <div className="animate-fade-in w-full relative flex flex-col overflow-hidden" style={{ minHeight: 'calc(100vh - 85px)', height: 'calc(100vh - 85px)' }}>
            {iframeLoading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                  <div className="text-emerald-500 font-black text-sm uppercase tracking-widest animate-pulse">Lobi Yükleniyor...</div>
                </div>
              </div>
            )}
            <iframe 
              src="https://bahisbey1438.com/tr/lobby/casino/?btag=59649488_330539" 
              className="border-none max-w-none"
              style={{ 
                position: 'absolute',
                top: isMobile ? '-80px' : '-115px',
                left: '0',
                width: 'calc(100% + 45px)', 
                height: isMobile ? 'calc(100% + 80px)' : 'calc(100% + 115px)',
                zIndex: 10
              }}
              onLoad={() => setIframeLoading(false)}
            />
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
                <h2 className="text-black font-black text-3xl uppercase tracking-tight">Günlük Görevler</h2>
                <p className="text-zinc-500 font-bold text-sm">Coin kazanmak ve marketi kullanmak için üye girişi gereklidir.</p>
                <button onClick={() => setAuthModalMode('member')}
                  className="px-8 py-4 bg-[#10B981] text-black font-black text-sm rounded-lg uppercase tracking-widest hover:bg-[#10B981]/90 transition-all shadow-[0_0_25px_rgba(0,255,163,0.4)]">
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
              <RaffleLanding onLoginRequired={() => setAuthModalMode('member')} />
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
              <RaffleLanding onLoginRequired={() => setAuthModalMode('member')} />
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

        {(view === 'wheel' || view === 'luckywheel') && (
          <div className="animate-fade-in min-h-screen w-full">
            <LuckyWheelView
              config={luckyWheelConfig}
              siteUser={siteUser}
              onNavigate={handleViewChange}
              onUpdateUser={(updatedUser) => {
                setSiteUser(updatedUser);
                localStorage.setItem('site_current_member', JSON.stringify(updatedUser));
                localStorage.setItem('site_member', JSON.stringify(updatedUser));
              }}
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
          <div className="animate-fade-in" style={{ padding: '0', minHeight: '100vh' }}>
            <div className="text-white p-8">User Bets placeholder</div>
          </div>
        )}

        {view === 'profile' && siteUser && (
          <div className="animate-fade-in w-full max-w-6xl mx-auto px-4 py-8" style={{ minHeight: '100vh' }}>
            <ProfileDashboard siteUser={siteUser} setSiteUser={setSiteUser} />
          </div>
        )}

        {view === 'promo' && (
          <div className="animate-fade-in">
            <PromoCodeView siteUser={siteUser} onNavigate={handleViewChange} />
          </div>
        )}

        {view === 'referral' && (
          <div className="animate-fade-in">
            <ReferralView siteUser={siteUser} onNavigate={handleViewChange} />
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

        {view === 'demo' && (
          <div className="animate-fade-in">
            <DemoGames />
          </div>
        )}

        {view === 'mobile-bulletin' && (
          <MobileBulletinView onBack={() => setView('home')} />
        )}
        {view === 'slotra' && (
          <div className="animate-fade-in w-full h-full min-h-screen">
            <iframe 
              src="/api/proxy?url=https://slotra.com/sports/" 
              className="w-full h-full min-h-screen border-none"
              title="Gerçek Sports"
            />
          </div>
        )}

        {view === 'kral' && (
          <div className="animate-fade-in">
            <KralView 
              onBack={() => setView('home')} 
              onShowLiveScore={() => setShowLiveScoreModal(true)} 
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
      </div>
      </div>
      
      {view !== 'admin' && view !== 'sports' && (view === 'originals' ? <RetroFooter /> : <Footer />)}
          </main>

          {view !== 'admin' && !showLiveScoreModal && !isMobile && (
            <>
              {/* Floating Action Button for Chat */}
              {!isChatOpen && (
                <button 
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-[#10b981] to-[#00E676] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-110 hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] border border-white/20 transition-all group"
                >
                  <svg className="w-7 h-7 text-black group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </button>
              )}

              {/* Chat Sidebar (Pushes the layout instead of floating) */}
              <aside className={`hidden xl:flex flex-col bg-[#0A0D14] h-full flex-shrink-0 absolute right-0 top-0 2xl:relative z-40 transition-all duration-300 ease-in-out ${isChatOpen ? 'w-[350px] shadow-[-20px_0_50px_rgba(0,0,0,0.8)]' : 'w-0'}`}>
                {/* ── Toggle Button (Desktop Only) ── */}
                <button 
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="absolute -left-3 top-6 w-6 h-6 bg-[#0F141E] border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-[#1A2235] transition-all shadow-lg z-50"
                >
                  <svg className={`w-3 h-3 transition-transform duration-300 ${!isChatOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
                <div className={`flex-1 overflow-hidden relative transition-opacity duration-300 ${isChatOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                  {view === 'sports' || view === 'spor724' || view === 'gercek' || view === 'upcomingMatches' ? (
                    <DualRightPanel 
                      popularMatches={[]} 
                      language={'tr'} 
                      isOpenMobile={false} 
                      onCloseMobile={() => setIsChatOpen(false)} 
                    />
                  ) : (
                    <ModernChat
                      open={isChatOpen}
                      onOpen={() => setIsChatOpen(true)}
                      onClose={() => setIsChatOpen(false)}
                      siteUser={siteUser}
                      userRole={userRole}
                      isMobile={false}
                      activeView={view}
                    />
                  )}
                </div>
              </aside>
            </>
          )}
          </div>
          </div>
        </div>

      {/* ── Match Search Modal ── */}
      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          coupons={coupons}
          onNavigate={handleViewChange}
        />
      )}

      {/* Fake Bet Modal */}
      <FakeBetModal 
        isOpen={showFakeBetModal}
        onClose={() => setShowFakeBetModal(false)}
        userBalance={siteUser?.balance || 0}
        onSubmit={handleFakeBetSubmit}
      />

      <MyBetsModal
        isOpen={showMyBetsModal}
        onClose={() => setShowMyBetsModal(false)}
      />

      {/* ── Canlı Skor Modal ── */}
      {showLiveScoreModal && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-6"
          onClick={() => setShowLiveScoreModal(false)}
        >
          <div 
            className="relative w-full max-w-5xl h-[85vh] bg-[#111111] rounded-lg shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#050505]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-black font-black text-xs uppercase tracking-widest italic">CANLI SKOR & SONUÇLAR</span>
              </div>
              <button 
                onClick={() => setShowLiveScoreModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            {/* Modal Content */}
            <div className="flex-1 w-full overflow-hidden bg-[#050505] relative">
              <iframe 
                src="https://statsinfo.co/live?guid=a886190e-e01a-4155-85f4-e6daee231c8d&lg=en" 
                frameBorder="0" 
                title="Canlı Skor"
                style={{
                  position: 'absolute',
                  top: '-48px',
                  left: '0',
                  width: '100%',
                  height: 'calc(100% + 48px)'
                }}
              />
              {/* Invisible overlay to block clicks on the "i", jersey, camera and chevron buttons (right column) */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: 'clamp(80px, 18%, 140px)',
                  background: 'transparent',
                  zIndex: 20,
                  cursor: 'default'
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
    )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        activeView={view} 
        onViewChange={(v) => setView(v as any)} 
        siteUser={siteUser}
        onProfileClick={() => {
          if (!siteUser) {
            setAuthModalMode('member');
          } else {
            setShowMyBetsModal(true);
          }
        }}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />
      <GlobalToaster />
      <LanguageTransition />
        </>
      </BetSlipProvider>
    </UserProvider>
  );
};
