import React, { useState, useEffect, useRef } from 'react';

import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LanguageTransition from './components/LanguageTransition';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Header from './components/Header';
import { Crown, Trophy, Calendar, TrendingUp, Clock, ArrowRight, Shield, CheckCircle2, Target, X, Dribbble, PlayCircle, Gamepad2, Diamond, Dices, PieChart, MonitorPlay, ChevronDown, Lock, ShieldCheck, Wallet, Club, Search } from 'lucide-react';
import { getFlagUrl } from './components/MatchResultsWidget';
import AppLoader from './components/AppLoader';
import BrandCard from './components/BrandCard';
import AdminPanel from './components/AdminPanel';
import ErrorBoundary from './components/ErrorBoundary';
import AuthModal from './components/AuthModal';
import OnboardingPopup from './components/OnboardingPopup';
import FakeBetModal from './components/FakeBetModal';
import MobileBottomNav from './components/MobileBottomNav';
import WalletModal from './components/WalletModal';
import AnalysisView from './components/AnalysisView';
import BlackjackGame from './components/BlackjackGame';
import GlobalToaster from './components/GlobalToaster';

import MaintenanceScreen from './components/MaintenanceScreen';
import ChatBot from './components/ChatBot';
import ModernChat from './components/ModernChat';
import PromoWheel from './components/PromoWheel';
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
import { Brand, Coupon, BlackjackConfig, WheelConfig, SiteUser, LoyaltyConfig, PromoWheelConfig, GiveawayConfig, MarqueeConfig, WelcomePopupConfig, MatchAnalysis, SiteStatusConfig, HeroSliderConfig, Slider2Config, DailyKuponConfig, RaffleConfig, PopularBetsConfig, TVConfig, LoaderConfig, TrustedCompany, ChatBotConfig, CasinoLobbyGame } from './types';
import { DEFAULT_MARQUEE_CONFIG, DEFAULT_WELCOME_POPUP_CONFIG, DEFAULT_WHEEL_CONFIG, DEFAULT_SITE_STATUS_CONFIG, DEFAULT_RAFFLE_CONFIG, DEFAULT_POPULAR_BETS_CONFIG, DEFAULT_TV_CONFIG, DEFAULT_LOADER_CONFIG } from './constants';
import { demoAnalyses, demoCoupons } from './demoData';
import TrustedSitesView from './components/TrustedSitesView';
import TrustedDetailView from './components/TrustedDetailView';
import { initTrustedEngine, loadTrustedCompanies, processDripComments, processAutoReplies } from './utils/trustedEngine';
import DemoGames from './components/DemoGames';
import MyBetsModal from './components/MyBetsModal';
import KralView from './components/KralView';
import WorldCupTeaser from './components/WorldCupTeaser';

import LiveBetsFeed from './components/LiveBetsFeed';
import CasinoLobby from './components/CasinoLobby';
// removed UserBets
// removed UserDashboard

// Portal Components
import CouponsView from './components/CouponsView';

import MobileQuickLinks from './components/MobileQuickLinks';
import Slider2 from './components/Slider2';
import PopularBets from './components/PopularBets';
import ProfileDashboard from './components/ProfileDashboard';
import GameLobbyTeaser from './components/GameLobbyTeaser';
import TV724View from './components/TV724View';
import LiveMatches from './components/LiveMatches';

import MatchResultsWidget from './components/MatchResultsWidget';
import { PromoSlider } from './components/PromoSlider';
import GameLobbyGrid from './components/GameLobbyGrid';
import Sidebar from './components/Sidebar';
import GuestLanding from './components/GuestLanding';
import HeroSection from './components/HeroSection';
import PromoCodeView from './components/PromoCodeView';
import ReferralView from './components/ReferralView';
const SITE_CACHE_VERSION = "2026.06.25_v1";

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

  return <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#00FFA3' }}>{text}</span>;
};

const App: React.FC = () => {
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
  const [view, setView] = useState<'home' | 'sports' | 'sports2' | 'sports3' | 'sports4' | 'sports5' | 'admin' | 'login' | 'brands' | 'analysis' | 'blackjack' | 'casino2' | 'loyalty' | 'raffle' | 'cekilis' | 'pool' | 'wheel' | 'giveaway' | 'coupons' | '724tv' | 'trusted-sites' | 'trusted-detail' | 'demo' | 'kral' | 'promo' | 'referral' | 'profile' | 'slotra' | 'slotra2'>('home');
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isContentReady, setIsContentReady] = useState(true);
  const [loadId, setLoadId] = useState(0);
  const [activeCasinoGame, setActiveCasinoGame] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Custom URL for Sports2 iframe (to handle custom header navigation)
  const [sports2Url, setSports2Url] = useState("https://bahisbey1438.com/tr/sport/sports/football/flt-1-1239-52530/?btag=59649488_330539");
  const [showAgeWarning, setShowAgeWarning] = useState(false);

  // Global Loader Logic (Initial Load & Transitions)
  useEffect(() => {
    setShowLoader(true);
    setFadeOutLoader(false);
    
    const timer1 = setTimeout(() => {
      setFadeOutLoader(true);
    }, 2500); // Start fading out at 2.5s
    
    const timer2 = setTimeout(() => {
      setShowLoader(false);
      setFadeOutLoader(false);
    }, 3000); // Completely hide at 3s
    
    return () => { 
      clearTimeout(timer1); 
      clearTimeout(timer2); 
    };
  }, [view]);

  useEffect(() => {
    const handleInternalNavigate = (e: CustomEvent<{ url: string }>) => {
      setIframeLoading(true);
      setSports2Url(e.detail.url);
      setView('sports2');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('internal-navigate', handleInternalNavigate as EventListener);
    
    const handleOpenSupportChat = () => {
      // Open mobile chat overlay for all screens when clicked from sidebar if !siteUser, else normal toggle
      const member = localStorage.getItem('site_current_member');
      if (!member) {
         setIsMobileChatOpen(true);
      } else {
         setIsChatOpen(prev => !prev);
      }
    };
    window.addEventListener('openSupportChat', handleOpenSupportChat);

    return () => {
      window.removeEventListener('internal-navigate', handleInternalNavigate as EventListener);
      window.removeEventListener('openSupportChat', handleOpenSupportChat);
    };
  }, []);
  
  // Responsive sidebar state - open by default on PC / TV (>= 1280px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1280);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);


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
    const parsed = stored ? JSON.parse(stored) : DEFAULT_SITE_STATUS_CONFIG;
    // Always default to false on mount to prevent flicker; DB will override if actually true
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [siteUser, setSiteUser] = useState<SiteUser | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'member' | 'admin' | 'register' | null>(null);

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

  // Automatically toggle sidebar when login state changes (for desktop)
  useEffect(() => {
    if (window.innerWidth >= 1280) {
      if (siteUser) {
        setIsSidebarOpen(false); // Close left menu when logged in
      } else {
        setIsSidebarOpen(true); // Open left menu when logged out
      }
    }
  }, [siteUser]);
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
    if (storedMarquee && (/betlivo/i.test(storedMarquee) || /724bahis/i.test(storedMarquee) || /724FUTBOL/i.test(storedMarquee))) {
      const parsedMarquee = JSON.parse(storedMarquee.replace(/betlivo/gi, '724BETS').replace(/724bahis\.net/gi, '724BETS').replace(/724FUTBOL\.COM/gi, '724BETS'));
      localStorage.setItem('site_marquee_config', JSON.stringify(parsedMarquee));
      setMarqueeConfig(parsedMarquee);
    }

    const storedWelcome = localStorage.getItem('site_welcome_popup');
    if (storedWelcome && (/betlivo/i.test(storedWelcome) || /724bahis/i.test(storedWelcome) || /724FUTBOL/i.test(storedWelcome))) {
      const parsedWelcome = JSON.parse(storedWelcome.replace(/betlivo/gi, '724BETS').replace(/724bahis\.net/gi, '724BETS').replace(/724FUTBOL\.COM/gi, '724BETS'));
      // Also catch the 'BETLIVOX' variant if it exists
      const cleanedWelcome = JSON.parse(JSON.stringify(parsedWelcome).replace(/724BAHİS.NETX/gi, '724BETS').replace(/724FUTBOL.COMX/gi, '724BETS'));
      localStorage.setItem('site_welcome_popup', JSON.stringify(cleanedWelcome));
      setWelcomePopupConfig(cleanedWelcome);
    }
  }, []);
  const [themeColor, setThemeColor] = useState('#00FFA3');
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
  const [isChatOpen, setIsChatOpen] = useState(window.innerWidth >= 1280);
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
            setCasinoLobbyGames(JSON.parse(savedCasinoLobby));
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
          const cleaned = JSON.parse(JSON.stringify(globalMarquee).replace(/betlivo/gi, '724BETS').replace(/724bahis\.net/gi, '724BETS'));
          setMarqueeConfig(cleaned);
        }
        
        if (globalNav) setNavVisibility(globalNav);
        if (globalWheel) setWheelConfig(globalWheel);
        
        if (globalWelcome) {
          const cleaned = JSON.parse(JSON.stringify(globalWelcome).replace(/betlivo/gi, '724BETS').replace(/724bahis\.net/gi, '724BETS').replace(/724BAHİS.NETX/gi, '724BETS').replace(/724FUTBOL\.COMX/gi, '724BETS'));
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
            setCasinoLobbyGames(globalCasinoLobby);
            localStorage.setItem('site_casino_lobby_games', JSON.stringify(globalCasinoLobby));
          }
        }

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
      } else {
        const viewName = cleanPath.substring(1);
        const validViews = ['blackjack', 'casino2', 'loyalty', 'pool', 'wheel', 'giveaway', 'sports', 'sports2', 'sports3', 'sports4', 'sports5', 'demo', 'kral', 'analysis'];
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

  // SEO noindex logic for demo view
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (view === 'demo') {
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'robots');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', 'noindex, nofollow');
    } else {
      if (meta) {
        meta.remove();
      }
    }
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
      />
    </ErrorBoundary>
  );

  const handleViewChange = (v: string) => {
    if (v === 'sports' || v === 'sports2' || v === 'sports3' || v === 'sports4' || v === 'sports5') {
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

  const isMaintenanceActive = siteStatusConfig.isMaintenanceMode && userRole !== 'admin' && userRole !== 'editor' && !userRole?.startsWith('guest_bypass');

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
    <LanguageProvider>
      <ThemeProvider>
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

      {isMaintenanceActive && view !== 'admin' ? (
        <MaintenanceScreen 
          message={siteStatusConfig.maintenanceMessage} 
          onAdminLogin={() => setAuthModalMode('admin')}
        />
      ) : (
        <div className="relative flex h-[100dvh] w-full bg-[#111317] text-white overflow-hidden" style={{
          visibility: (appStage === 'ready' || appStage === 'popup' || showLoader) ? 'visible' : 'hidden',
          '--header-height': '60px'
        } as React.CSSProperties}>
          {showLoader && <AppLoader fadeOut={fadeOutLoader} />}
          
          {/* 1. SOL MENÜ (Masaüstünde Açılır/Kapanır, Mobilde Gizli) */}
          {!(view === 'sports' || view === 'sports3' || view === 'sports4' || view === 'sports5' || view === 'giveaway') && siteUser && (
            <aside className={`hidden lg:flex flex-col bg-[#111317] h-full overflow-visible flex-shrink-0 relative z-20 transition-all duration-300 ${isSidebarOpen ? 'w-[250px]' : 'w-[72px]'}`}>
              <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
                activeView={view}
                onViewChange={handleViewChange}
                userRole={userRole}
                navVisibility={navVisibility}
                onStartTour={handleStartTour}
              />
            </aside>
          )}

          {/* MOBİL DRAWER - SOL MENÜ */}
          {isMobileMenuOpen && siteUser && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
              <aside className="w-[280px] bg-[#111317] border-r border-[#1A1D24] h-full shadow-[10px_0_30px_rgba(0,0,0,0.6)] flex-shrink-0 relative z-10 animate-slide-in-left">
                <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 -right-12 w-10 h-10 bg-[#111317] border border-[#1A1D24] rounded-r-xl flex items-center justify-center text-gray-400 hover:text-white shadow-[5px_0_15px_rgba(0,0,0,0.3)]"><X className="w-5 h-5"/></button>
                <Sidebar
                  isOpen={true}
                  onToggle={() => setIsMobileMenuOpen(false)}
                  activeView={view}
                  onViewChange={(v) => { handleViewChange(v); setIsMobileMenuOpen(false); }}
                  userRole={userRole}
                  navVisibility={navVisibility}
                  onStartTour={handleStartTour}
                />
              </aside>
            </div>
          )}

          {/* 2. ORTA ANA İÇERİK (Mobilde tam ekran, masaüstünde kalan alanı kaplar) */}
          <main 
            id="main-scroll-container"
            className={appStage !== 'loading' ? 'app-reveal-mask flex-1 w-full h-full overflow-y-auto overflow-x-hidden relative flex flex-col' : 'app-hidden-initial flex-1 w-full h-full overflow-y-auto overflow-x-hidden relative flex flex-col'}
            onScroll={(e) => {
              const currentScrollY = e.currentTarget.scrollTop;
              const mobileHeader = document.getElementById('mobile-top-header');
              if (mobileHeader) {
                if (currentScrollY > (window as any).lastMainScrollY && currentScrollY > 50) {
                  mobileHeader.style.transform = 'translateY(-100%)';
                } else {
                  mobileHeader.style.transform = 'translateY(0)';
                }
              }
              (window as any).lastMainScrollY = currentScrollY;
            }}
          >
            
            {/* SADECE MOBİLDE GÖRÜNEN ÜST BAR (Header) */}
            {view !== 'kral' && (
              <header 
                id="mobile-top-header"
                className="flex lg:hidden items-center justify-between p-2 px-3 bg-[#111317]/95 backdrop-blur-xl border-b border-white/5 shrink-0 sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden gap-1 transition-transform duration-300"
              >
                <div 
                  className="font-black text-xl tracking-tight flex items-center cursor-pointer select-none ml-1" 
                  onClick={() => setView('home')}
                  style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}
                >
                  <span className="text-white font-extrabold">724</span>
                  <span className="text-[#00FFA3] font-black">BETS</span>
                </div><div className="flex items-center shrink-0">
                  {siteUser ? (
                    <>
                      {/* 1. Gamdom Style Wallet (Pill) */}
                      <div 
                        className="flex items-center bg-[#1A1F29] rounded-lg p-1 pr-2 cursor-pointer border border-white/5 hover:bg-[#202632] transition-colors shadow-inner balance-intro-fade"
                        onClick={() => window.dispatchEvent(new Event('openDepositModal'))}
                      >
                        <div className="w-6 h-6 rounded bg-[#00FFA3] text-black flex items-center justify-center font-bold mr-2 shadow-[0_0_8px_rgba(0,255,163,0.4)]">
                          <span className="text-[13px]">$</span>
                        </div>
                        <span className="text-white font-bold text-[13px] tracking-tight mr-1.5">${siteUser.balance?.toFixed(2) || '0.00'}</span>
                        <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </div>
                      
                      {/* 2. Cüzdan Butonu (Sadece İkon) */}
                      <button 
                        onClick={() => window.dispatchEvent(new Event('openDepositModal'))}
                        className="flex items-center justify-center w-8 h-8 bg-[#00FFA3] hover:bg-[#00e693] rounded-lg transition-colors ml-1.5 shadow-[0_0_15px_rgba(0,255,163,0.2)] active:scale-95"
                      >
                        <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 7.5C21 5.567 19.433 4 17.5 4H6.5C4.567 4 3 5.567 3 7.5v9C3 18.433 4.567 20 6.5 20h11c1.933 0 3.5-1.567 3.5-3.5v-9zm-3.5 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                        </svg>
                      </button>
                      
                      {/* 3. Profil Avatarı */}
                      <button onClick={() => handleViewChange('profile')} className="w-8 h-8 rounded-full border border-white/10 bg-[#1A1D24] overflow-hidden shrink-0 hover:border-white/20 transition-colors ml-2 active:scale-95" title="Profile Git">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${siteUser.username}`} alt="Avatar" className="w-full h-full object-cover" />
                      </button>

                      {/* 4. Çıkış Yap (Mobile) */}
                      <button 
                        onClick={() => {
                          localStorage.removeItem('site_current_member');
                          localStorage.removeItem('site_member');
                          localStorage.removeItem('site_user_role');
                          window.location.reload();
                        }} 
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-red-500/10 text-red-500 border border-red-500/20 ml-1 active:scale-95"
                        title="Çıkış Yap"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Gamdom Style Mobile Auth Buttons */}
                      <button
                        onClick={() => setAuthModalMode('member')}
                        className="flex items-center justify-center h-[34px] bg-[#1A1D24] hover:bg-[#2A2E3D] text-white transition-colors px-3.5 rounded-[8px] font-bold text-[13px]"
                      >
                        Giriş yap
                      </button>
                      <button
                        onClick={() => setAuthModalMode('register')}
                        className="flex items-center justify-center h-[34px] bg-[#00FFA3] hover:bg-[#00E693] text-black transition-colors px-3.5 rounded-[8px] font-extrabold text-[13px] shadow-[0_0_10px_rgba(0,255,163,0.2)] ml-1"
                      >
                        Kaydolun
                      </button>
                    </>
                  )}
                </div>
              </header>
            )}

            {/* Masaüstü Header (Mobilde Gizli) */}
            {view !== 'kral' && (
              <div className="hidden lg:block shrink-0 sticky top-0 z-30">
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
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        showFakeBetButton={view === 'sports2'}
        onFakeBetClick={() => {
           if (!siteUser) setAuthModalMode('member');
           else setShowFakeBetModal(true);
        }}
        onMyBetsClick={() => setShowMyBetsModal(true)}
      />
              </div>
            )}

      <div 
        id="tour-main"
        className={`site-main-content ${view === 'admin' ? 'admin-layout' : ''} ${
          (view === 'sports' || view === 'sports2' || view === 'sports3' || view === 'sports4' || view === 'sports5') 
            ? 'p-0 w-full max-w-[1400px] mx-auto pb-[70px] md:pb-0' 
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

        {view === 'brands' && (
          <div className="animate-fade-in" style={{ padding: '40px 0 100px' }}>
            <section id="brands-section" className="brands-section relative z-10">
              <div className="brands-header mb-12 animate-fade-in-up">
                <h2 className="text-[40px] md:text-[48px] font-black italic uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                  GÜVENİLİR <span className="text-[#00FFA3]">FİRMALAR</span>
                </h2>
                <div className="h-1 w-20 bg-[#00FFA3] mx-auto mt-4 mb-6 shadow-[0_0_15px_rgba(0,255,163,0.4)]" />
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
          <div 
            className="animate-fade-in relative w-full bg-[#09090b] overflow-hidden" 
            style={{ 
              height: 'calc(100dvh - var(--header-height))',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Tam Responsif İframe Kapsayıcısı (Responsive Iframe Wrapper) */}
            <div className="w-full flex-1 relative overflow-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
              {iframeLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#09090b]">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#00FFA3] border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-[#00FFA3] font-bold text-sm animate-pulse tracking-wider">YÜKLENİYOR...</div>
                  </div>
                </div>
              )}
              <iframe 
                src="https://tarafbet977.com/tr/live/"
                onLoad={() => setIframeLoading(false)}
                className="absolute left-0 w-full border-none outline-none"
                style={{ 
                  top: '-135px', /* Üst menüyü (Tarafbet header'ını) kesmek için yukarı kaydır */
                  width: '100%', 
                  height: 'calc(100% + 935px)', /* 135px üst kırpma + 800px alt kırpma toplamı */
                  border: 'none',
                  margin: 0,
                  padding: 0,
                  zIndex: 10
                }}
                frameBorder="0"
                scrolling="yes"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {view === 'sports2' && (
          <div className="animate-fade-in w-full relative flex flex-col" style={{ height: 'calc(100vh - var(--header-height))' }}>
            
            {/* ── GAMDOM STYLE BANNER & MATCHES ── */}
            <div className="w-full shrink-0 px-4 md:px-8 max-w-[1400px] mx-auto">
              <WorldCupTeaser />
            </div>

            {/* Custom Sports2 Header */}
            <div className="w-full bg-[#161c28] rounded-t-2xl overflow-hidden shrink-0 shadow-lg relative z-20">
               {/* Top Menu */}
               <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide px-2 py-1">
                  {([
                    { label: 'SPOR', icon: <Dribbble size={18} />, url: 'https://bahisbey1438.com/tr/sport/?btag=59649488_330539' },
                    { label: 'CANLI BAHİS', icon: <PlayCircle size={18} />, url: 'https://bahisbey1438.com/tr/sport/live/football/?btag=59649488_330539' },
                    { label: 'E-SPOR', icon: <Gamepad2 size={18} />, url: 'https://bahisbey1438.com/tr/esport/?btag=59649488_330539' },
                    { label: '3D SLOT SALONU', icon: <Diamond size={18} />, url: 'https://bahisbey1438.com/tr/lobby/casino/?btag=59649488_330539' },
                    { label: 'CANLI CASINO', icon: <Dices size={18} />, url: 'https://bahisbey1438.com/tr/lobby/livecasino/?btag=59649488_330539' },
                    { label: 'SANAL SPORLAR', icon: <MonitorPlay size={18} />, url: 'https://bahisbey1438.com/tr/lobby/virtualsport/main/?btag=59649488_330539' }
                  ] as { label: string; icon: React.ReactNode; url: string; badge?: string }[]).map(item => (
                    <button 
                      key={item.label}
                      onClick={() => { setIframeLoading(true); setSports2Url(item.url); }}
                      className={`flex items-center gap-2 px-3 py-2 transition-colors rounded-lg group shrink-0 ${sports2Url.includes(item.url) ? 'bg-white/10 text-white' : 'text-zinc-300 hover:text-white hover:bg-white/5'}`}
                    >
                      <span className="text-emerald-500 group-hover:text-emerald-400">{item.icon}</span>
                      <span className="text-[13px] font-bold">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded ml-1 animate-pulse">{item.badge}</span>
                      )}
                    </button>
                  ))}
            </div>
          </div>

            {/* Iframe Container */}
            <div 
              ref={sports2ContainerRef}
              className="w-full flex-1 shadow-2xl bg-[#0F172A] relative rounded-b-2xl z-10"
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
              <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay bg-[#0F172A]/40" />
              <div className="absolute inset-0 z-10 pointer-events-none mix-blend-color bg-[#0F172A]/20" />
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
            <div className="w-full rounded-lg overflow-hidden shadow-2xl bg-[#0F172A] relative" style={{ height: 'calc(100vh - var(--header-height))' }}>
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
                className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay bg-[#0F172A]/40" 
                style={{ 
                  clipPath: isMobile 
                    ? 'polygon(0% 0%, 100% 0%, 100% calc(100% - 60px), 0% calc(100% - 60px))' 
                    : 'polygon(0% 0%, 100% 0%, 100% calc(100% - 70px), calc(100% - 300px) calc(100% - 70px), calc(100% - 300px) 100%, 0% 100%)' 
                }} 
              />
              <div 
                className="absolute inset-0 z-10 pointer-events-none mix-blend-color bg-[#0F172A]/20" 
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

        {view === 'blackjack' && (
          <div className="animate-fade-in w-full h-full relative z-[50]">
            <CasinoLobby customGames={casinoLobbyGames} isLoggedIn={!!(siteUser || userRole)} />
          </div>
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
                <h2 className="text-white font-black text-3xl uppercase tracking-tight">Günlük Görevler</h2>
                <p className="text-zinc-500 font-bold text-sm">Coin kazanmak ve marketi kullanmak için üye girişi gereklidir.</p>
                <button onClick={() => setAuthModalMode('member')}
                  className="px-8 py-4 bg-[#00FFA3] text-black font-black text-sm rounded-lg uppercase tracking-widest hover:bg-[#00FFA3]/90 transition-all shadow-[0_0_25px_rgba(0,255,163,0.4)]">
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


          </main>





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
            className="relative w-full max-w-5xl h-[85vh] bg-[#1a1e29] rounded-lg shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#12151e]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-white font-black text-xs uppercase tracking-widest italic">CANLI SKOR & SONUÇLAR</span>
              </div>
              <button 
                onClick={() => setShowLiveScoreModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            {/* Modal Content */}
            <div className="flex-1 w-full overflow-hidden bg-[#12151e] relative">
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

      {/* 3. SAĞ CANLI SOHBET (Geniş masaüstünde 350px sabit, alt çözünürlüklerde gizli) */}
      {view !== 'admin' && view !== 'sports' && !showLiveScoreModal && !isMobile && siteUser && (
        <>
          <aside className={`hidden xl:flex flex-col border-gray-800 bg-[#1A1D24] h-full flex-shrink-0 relative z-20 ${isChatOpen ? 'w-[350px] border-l' : 'w-0 border-l-0 overflow-hidden'} transition-all duration-300`}>
            <ModernChat
              open={isChatOpen}
              onOpen={() => setIsChatOpen(true)}
              onClose={() => setIsChatOpen(false)}
              siteUser={siteUser}
              userRole={userRole}
              isMobile={false} // Force desktop mode in this slot
            />
          </aside>

          {/* Gamdom-style Floating Action Buttons (Desktop Only) */}
          {!isChatOpen && siteUser && (
            <div className="hidden xl:flex fixed bottom-6 right-6 flex-col gap-2 z-50">
              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-11 h-11 rounded-full bg-[#1A1D24] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors shadow-lg group relative"
                title="Canlı Sohbet"
              >
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#111317] rounded-full"></div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-white transition-colors"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </button>
              <button 
                onClick={() => setShowSearch(true)}
                className="w-11 h-11 rounded-full bg-[#1A1D24] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors shadow-lg group"
                title="Arama"
              >
                <Search className="w-5 h-5 group-hover:text-white transition-colors" />
              </button>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-11 h-11 rounded-full bg-[#1A1D24] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors shadow-lg group"
                title="Canlı Destek"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-white transition-colors"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
              </button>
            </div>
          )}
        </>
      )}

      {/* Gamdom-style Floating Action Buttons (Mobile Only) */}
      {view !== 'admin' && !showLiveScoreModal && isMobile && !isMobileChatOpen && siteUser && (
        <div className="flex xl:hidden fixed bottom-20 right-4 flex-col gap-2 z-50">
          <button 
            onClick={() => setIsMobileChatOpen(true)}
            className="w-11 h-11 rounded-full bg-[#1A1D24] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors shadow-lg group relative"
            title="Canlı Sohbet"
          >
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#111317] rounded-full"></div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-white transition-colors"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </button>
          <button 
            onClick={() => setShowSearch(true)}
            className="w-11 h-11 rounded-full bg-[#1A1D24] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors shadow-lg group"
            title="Arama"
          >
            <Search className="w-5 h-5 group-hover:text-white transition-colors" />
          </button>
        </div>
      )}

      {/* MOBİL DRAWER - SOHBET */}
      {isMobileChatOpen && siteUser && (
        <div className="fixed inset-0 z-[110] flex xl:hidden justify-end">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={() => setIsMobileChatOpen(false)}></div>
          <aside className="w-[90%] sm:w-[380px] max-w-[420px] bg-[#111317] border-l border-[#1A1D24] h-full shadow-[-10px_0_30px_rgba(0,0,0,0.6)] flex-shrink-0 relative z-10 animate-slide-in-right">
             <button onClick={() => setIsMobileChatOpen(false)} className="absolute top-4 -left-12 w-10 h-10 bg-[#111317] border border-[#1A1D24] rounded-l-xl flex items-center justify-center text-gray-400 hover:text-white shadow-[-5px_0_15px_rgba(0,0,0,0.3)]"><X className="w-5 h-5"/></button>
            <ModernChat
              open={true}
              onOpen={() => {}}
              onClose={() => setIsMobileChatOpen(false)}
              siteUser={siteUser}
              userRole={userRole}
              isMobile={isMobile}
              botsConfig={botsConfig}
            />
          </aside>
        </div>
      )}

    </div>
    )}

      {/* 724BETS OVERLAY FOOTER */}
      {['sports', 'sports2', 'sports3', 'sports4', 'sports5'].includes(view) && (
        <div className="fixed bottom-16 md:bottom-0 left-0 w-full z-[90] bg-[#09090b] border-t border-zinc-800 shadow-[0_-10px_40px_rgba(0,0,0,0.9)] flex flex-col md:flex-row items-center justify-between px-4 py-3 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '20px', color: '#fff', letterSpacing: '-1px' }}>
              724bets
            </span>
            <div className="h-5 w-px bg-zinc-700 hidden md:block"></div>
            <span className="text-zinc-400 text-[11px] hidden md:block max-w-[450px] leading-snug">
              724bets, Curaçao yasalarına göre lisanslanmış profesyonel ve güvenilir bahis platformudur. Tüm hakları saklıdır.
            </span>
          </div>
          
          <div className="flex items-center gap-3 mt-2 md:mt-0">
             <div className="hidden lg:flex items-center gap-2 mr-2 opacity-80 overflow-x-auto max-w-[200px] md:max-w-none scrollbar-hide">
                <div className="h-6 px-2 bg-[#1A233A] rounded border border-zinc-700 flex items-center justify-center text-[9px] font-bold text-white">PAPARA</div>
                <div className="h-6 px-2 bg-[#1A233A] rounded border border-zinc-700 flex items-center justify-center text-[9px] font-bold text-white">HAVALE</div>
                <div className="h-6 px-2 bg-[#1A233A] rounded border border-zinc-700 flex items-center justify-center text-[9px] font-bold text-white">PAYCO</div>
                <div className="h-6 px-2 bg-[#1A233A] rounded border border-zinc-700 flex items-center justify-center text-[9px] font-bold text-white">MASTERCARD</div>
                <div className="h-6 px-2 bg-[#1A233A] rounded border border-zinc-700 flex items-center justify-center text-[9px] font-bold text-white">VISA</div>
                <div className="h-6 px-2 bg-[#1A233A] rounded border border-zinc-700 flex items-center justify-center text-[9px] font-bold text-white">BITCOIN</div>
                <div className="h-6 px-2 bg-[#1A233A] rounded border border-zinc-700 flex items-center justify-center text-[9px] font-bold text-white">TETHER</div>
             </div>
             <button 
               onClick={() => alert('Lisans belgeleri yakında eklenecek.')}
               className="px-3 py-1.5 bg-[#00FFA3]/10 border border-[#00FFA3]/30 text-[#00FFA3] rounded text-[10px] font-bold hover:bg-[#00FFA3]/20 transition-colors flex items-center gap-1.5 shrink-0"
             >
               <ShieldCheck className="w-3.5 h-3.5" />
               LİSANS BELGELERİ
             </button>
          </div>
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
      />
      <GlobalToaster />
      <LanguageTransition />
    </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
