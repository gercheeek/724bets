
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './ThemeContext';
import Header from './components/Header';
import { Crown } from 'lucide-react';
import Hero from './components/Hero';
import DashboardHero from './components/DashboardHero';
import AppLoader from './components/AppLoader';
import DailyCoupons from './components/DailyCoupons';
import BrandCard from './components/BrandCard';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import AnalysisView from './components/AnalysisView';
import BlackjackGame from './components/BlackjackGame';
import PromoPopup from './components/PromoPopup';
import MaintenanceScreen from './components/MaintenanceScreen';
import DynamicCTA from './components/DynamicCTA';
import ChatBot from './components/ChatBot';
import NewsDetailView from './components/NewsDetailView';
import PromoWheel from './components/PromoWheel';
import GiveawayView, { DEFAULT_GIVEAWAY_CONFIG } from './components/GiveawayView';
import BrandSidePanel from './components/BrandSidePanel';
import SearchModal from './components/SearchModal';
import LoyaltyPanel, { DEFAULT_LOYALTY_CONFIG } from './components/LoyaltyPanel';
import RaffleView from './components/RaffleView';
import PoolGame from './components/PoolGame';
import { seedEcosystemData } from './seedEcosystem';
import { getGlobalConfig, updateGlobalConfig } from './utils/supabase';
import NewsSection from './components/NewsSection';
import HomeNewsWidget from './components/HomeNewsWidget';
import NewsView from './components/NewsView';
import HomeAnalyses from './components/HomeAnalyses';
import { NavVisibility, DEFAULT_NAV_VISIBILITY } from './components/Header';
import { BRANDS as INITIAL_BRANDS } from './constants';
import { Brand, Coupon, BlackjackConfig, WheelConfig, WheelReward, SiteUser, LoyaltyConfig, PromoWheelConfig, GiveawayConfig, MarqueeConfig, WelcomePopupConfig, LiveOddsConfig, MatchAnalysis, SiteStatusConfig } from './types';
import { DEFAULT_MARQUEE_CONFIG, DEFAULT_WELCOME_POPUP_CONFIG, DEFAULT_LIVE_ODDS_CONFIG, DEFAULT_WHEEL_CONFIG, DEFAULT_SITE_STATUS_CONFIG } from './constants';
import { demoAnalyses } from './demoData';

// Portal Components
import PortalSidebar from './components/PortalSidebar';
import PortalTicker from './components/PortalTicker';
import PortalHero from './components/PortalHero';
import PortalMatchList from './components/PortalMatchList';
import BestPicks from './components/BestPicks';
import PortalMobileNav from './components/PortalMobileNav';


const App: React.FC = () => {
  const [appStage, setAppStage] = useState<'loading' | 'popup' | 'ready'>('loading');
  const [view, setView] = useState<'home' | 'admin' | 'login' | 'brands' | 'analysis' | 'blackjack' | 'loyalty' | 'raffle' | 'pool' | 'news' | 'news-detail' | 'wheel' | 'giveaway'>('home');

  // Promo Wheel Config
  const [promoWheelConfig, setPromoWheelConfig] = useState<PromoWheelConfig>(() => {
    const stored = localStorage.getItem('site_featured_wheel') || localStorage.getItem('site_betlivo_wheel');
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

  const [selectedArticleId, setSelectedArticleId] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [portalLeague, setPortalLeague] = useState<string>('Tümü');
  const [siteUser, setSiteUser] = useState<SiteUser | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'member' | 'admin' | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

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
      !a.league.includes('Porto Dragao')
    );
    if (parsed.length !== beforeCount) needsUpdate = true;

    if (needsUpdate) {
      localStorage.setItem('site_analyses', JSON.stringify(parsed));
      setAnalyses(parsed);
      window.dispatchEvent(new Event('storage'));
    }

    // 3. Branding Migration for Marquee & Popup
    const storedMarquee = localStorage.getItem('site_marquee_config');
    if (storedMarquee && /betlivo/i.test(storedMarquee)) {
      const parsedMarquee = JSON.parse(storedMarquee.replace(/betlivo/gi, '724BAHİS.NET'));
      localStorage.setItem('site_marquee_config', JSON.stringify(parsedMarquee));
      setMarqueeConfig(parsedMarquee);
    }

    const storedWelcome = localStorage.getItem('site_welcome_popup');
    if (storedWelcome && /betlivo/i.test(storedWelcome)) {
      const parsedWelcome = JSON.parse(storedWelcome.replace(/betlivo/gi, '724BAHİS.NET'));
      // Also catch the 'BETLIVOX' variant if it exists
      const cleanedWelcome = JSON.parse(JSON.stringify(parsedWelcome).replace(/724BAHİS.NETX/gi, '724BAHİS.NET'));
      localStorage.setItem('site_welcome_popup', JSON.stringify(cleanedWelcome));
      setWelcomePopupConfig(cleanedWelcome);
    }
  }, []);
  const [themeColor, setThemeColor] = useState('#eab308');
  const [hashtags, setHashtags] = useState('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showWelcomePopup, setShowWelcomePopup] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loyaltyConfig, setLoyaltyConfig] = useState<LoyaltyConfig>(() => {
    const stored = localStorage.getItem('site_loyalty_config');
    return stored ? JSON.parse(stored) : DEFAULT_LOYALTY_CONFIG;
  });

  const [analyses, setAnalyses] = useState<MatchAnalysis[]>([]);
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

  // Live Odds Config
  const [liveOddsConfig, setLiveOddsConfig] = useState<LiveOddsConfig>(() => {
    const stored = localStorage.getItem('site_live_odds');
    return stored ? JSON.parse(stored) : DEFAULT_LIVE_ODDS_CONFIG;
  });

  const handleLiveOddsConfigChange = (cfg: LiveOddsConfig) => {
    setLiveOddsConfig(cfg);
    localStorage.setItem('site_live_odds', JSON.stringify(cfg));
    updateGlobalConfig('site_live_odds', cfg);
  };

  const [bjConfig, setBjConfig] = useState<BlackjackConfig>({
    rewards: [],
    cooldownHours: 4,
    dealerHitSoft17: true,
    lastPlayTime: 0,
  });

  // 3-Stage App Flow: Loader -> Action Popup -> Ready
  useEffect(() => {
    // Stage 1: Loader runs for 4 seconds
    const loaderTimer = setTimeout(() => {
      // Stage 2: Show popup if active, else skip to ready
      if (welcomePopupConfig.isActive) {
        setAppStage('popup');
        setShowWelcomePopup(true);
      } else {
        setAppStage('ready');
      }
    }, 4000); // 4 Seconds Load Time

    return () => clearTimeout(loaderTimer);
  }, [welcomePopupConfig.isActive]);

  const handleCloseWelcomePopup = () => {
    setShowWelcomePopup(false);
    setAppStage('ready'); // Stage 3: Unblock the site
  };

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
        if (savedCoupons) setCoupons(JSON.parse(savedCoupons));
        if (savedAnalyses) {
          const parsed = JSON.parse(savedAnalyses);
          const cleaned = parsed.filter((a: any) => 
            a.homeTeam && a.awayTeam && a.homeTeam !== 'A' && a.awayTeam !== 'A' &&
            a.league && a.league.length < 80 && 
            a.matchDate >= '2026-04-09' && // START FRESH
            !a.league.includes('Boluspor orta sıralarda') &&
            !a.league.includes('Porto Dragao')
          );
          setAnalyses(cleaned);
        }
        if (savedBj) setBjConfig(JSON.parse(savedBj));
        if (savedColor && savedColor.startsWith('#')) setThemeColor(savedColor);
        if (savedRole) setUserRole(savedRole as string);
        if (savedMember) setSiteUser(JSON.parse(savedMember));

        // 3. Load Global Data from Supabase (Overrides Local)
        const globalAnalyses = await getGlobalConfig('site_analyses');
        if (!isMounted) return;
        if (globalAnalyses && Array.isArray(globalAnalyses) && globalAnalyses.length > 0) {
          const cleaned = globalAnalyses.filter((a: any) => 
            a.homeTeam && a.awayTeam && a.homeTeam !== 'A' && a.awayTeam !== 'A' &&
            a.league && a.league.length < 80 && 
            a.matchDate >= '2026-04-09' && // START FRESH
            !a.league.includes('Boluspor orta sıralarda') &&
            !a.league.includes('Porto Dragao')
          );
          setAnalyses(cleaned);
        }

        const globalCoupons = await getGlobalConfig('site_coupons');
        if (globalCoupons && Array.isArray(globalCoupons) && globalCoupons.length > 0) setCoupons(globalCoupons);

        const globalBrands = await getGlobalConfig('site_brands');
        if (globalBrands) setBrands(globalBrands);

        const globalHero = await getGlobalConfig('site_hero');
        if (globalHero) setHero(globalHero);

        const globalHashtags = await getGlobalConfig('site_hashtags');
        if (globalHashtags) setHashtags(globalHashtags);

        const globalColor = await getGlobalConfig('site_primary_color');
        if (globalColor) setThemeColor(globalColor);

        const globalBj = await getGlobalConfig('site_bj_config');
        if (globalBj) setBjConfig(globalBj);

        const globalLoyalty = await getGlobalConfig('site_loyalty_config');
        if (globalLoyalty) setLoyaltyConfig(globalLoyalty);

        const globalGiveaway = await getGlobalConfig('site_giveaway_config');
        if (globalGiveaway) setGiveawayConfig(globalGiveaway);

        const globalMarquee = await getGlobalConfig('site_marquee_config');
        if (globalMarquee) {
          const cleaned = JSON.parse(JSON.stringify(globalMarquee).replace(/betlivo/gi, '724BAHİS.NET'));
          setMarqueeConfig(cleaned);
        }

        const globalNav = await getGlobalConfig('site_nav_visibility');
        if (globalNav) setNavVisibility(globalNav);

        const globalWheel = await getGlobalConfig('site_casino_wheel');
        if (globalWheel) setWheelConfig(globalWheel);

        const globalWelcome = await getGlobalConfig('site_welcome_popup');
        if (globalWelcome) {
          const cleaned = JSON.parse(JSON.stringify(globalWelcome).replace(/betlivo/gi, '724BAHİS.NET').replace(/724BAHİS.NETX/gi, '724BAHİS.NET'));
          setWelcomePopupConfig(cleaned);
        }

        const globalSiteStatus = await getGlobalConfig('site_status');
        if (globalSiteStatus) setSiteStatusConfig(globalSiteStatus);

        const globalLiveOdds = await getGlobalConfig('site_live_odds');
        if (globalLiveOdds) setLiveOddsConfig(globalLiveOdds);

        const globalPromoWheel = await getGlobalConfig('site_featured_wheel') || await getGlobalConfig('site_betlivo_wheel');
        if (globalPromoWheel) setPromoWheelConfig(globalPromoWheel);

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

  if (view === 'admin') return (
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
        setUserRole(null);
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
      liveOddsConfig={liveOddsConfig}
      onSaveLiveOddsConfig={handleLiveOddsConfigChange}
      siteStatusConfig={siteStatusConfig}
      onSaveSiteStatusConfig={handleSiteStatusConfigChange}
    />
  );

  // Scroll to brands section
  const scrollToBrands = () => {
    const brandsEl = document.getElementById('brands-section');
    if (brandsEl) {
      const y = brandsEl.getBoundingClientRect().top + window.scrollY - 15;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleViewChange = (v: string) => {
    // Lucky Wheel is members-only
    if (v === 'wheel' && !siteUser && !userRole) {
      setAuthModalMode('member');
      return;
    }
    if (v === 'brands') {
      setView('home');
      setTimeout(scrollToBrands, 100);
    } else if (v === 'home') {
      setView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setView(v as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isMaintenanceActive = siteStatusConfig.isMaintenanceMode && userRole !== 'admin' && userRole !== 'editor';

  return (
    <ThemeProvider>
      {isMaintenanceActive && view !== 'admin' ? (
        <MaintenanceScreen 
          message={siteStatusConfig.maintenanceMessage} 
          onAdminLogin={() => setAuthModalMode('admin')}
        />
      ) : (
        <div style={{
          maxHeight: appStage === 'loading' ? '100vh' : 'auto',
          overflow: appStage === 'loading' ? 'hidden' : 'visible',
          minHeight: '100vh',
          background: 'var(--bg-main)',
          color: 'var(--text-primary)',
          overflowX: 'hidden',
          position: 'relative'
        }}>

      {appStage === 'loading' && <AppLoader />}

      {/* Auth Modal Overlay */}
      {authModalMode && (
        <AuthModal
          mode={authModalMode}
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
            setAuthModalMode(null);
            setView('admin');
          }}
          onClose={() => setAuthModalMode(null)}
        />
      )}

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
        onMemberLogout={() => {
          setSiteUser(null);
          setUserRole(null);
          localStorage.removeItem('site_current_member');
          localStorage.removeItem('site_user_role');
          if (view === 'admin') setView('home');
        }}
        onSearchClick={() => setShowSearch(true)}
        navVisibility={navVisibility}
        marqueeConfig={marqueeConfig}
        liveOddsConfig={liveOddsConfig}
      />

      <main style={{ position: 'relative', zIndex: 10, paddingTop: '130px', filter: appStage === 'popup' ? 'blur(10px)' : 'none', pointerEvents: appStage === 'popup' ? 'none' : 'auto', transition: 'filter 0.5s' }}>
        <div style={{ visibility: appStage !== 'loading' ? 'visible' : 'hidden', height: appStage === 'loading' ? '100vh' : 'auto', overflow: appStage === 'loading' ? 'hidden' : 'visible' }}>
          {view === 'home' && (
            <>
              {/* ═══ PORTAL TICKER ═══ */}
              <PortalTicker analyses={analyses} liveOddsConfig={liveOddsConfig} />

              {/* ═══ PORTAL BODY (Sidebar + Content) ═══ */}
              <div className="portal-body">
                {/* Left Sidebar */}
                <PortalSidebar
                  analyses={analyses}
                  coupons={coupons}
                  selectedLeague={portalLeague}
                  onLeagueSelect={setPortalLeague}
                  onNavigate={handleViewChange}
                />

                {/* Main Content: Match List */}
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <PortalMatchList
                    analyses={analyses}
                    selectedLeague={portalLeague}
                    onNavigate={handleViewChange}
                  />
                </div>

                {/* Right Sidebar: News + Coupons */}
                <div className="portal-right-sidebar">
                  {/* News Widget ("Gündem") */}
                  <div style={{ padding: '24px 20px 20px' }}>
                    <div className="portal-section-heading">
                      🔥 GÜNDEM & HABERLER
                    </div>
                    <HomeNewsWidget
                      onViewChange={handleViewChange}
                      onArticleClick={(id) => { setSelectedArticleId(id); setView('news-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    />
                  </div>

                  {/* Daily Coupons Section */}
                  <div style={{ padding: '0 20px 24px' }}>
                    <div className="portal-section-heading" style={{ marginTop: 8 }}>
                      🎫 GÜNÜN KUPONLARI
                    </div>
                    <DailyCoupons
                      coupons={coupons}
                      isLoggedIn={!!(siteUser || userRole)}
                      onLoginRequired={() => setAuthModalMode('member')}
                    />
                  </div>
                </div>
              </div>

              {/* ═══ BEST PICKS FULL WIDTH ═══ */}
              <BestPicks analyses={analyses} onNavigate={handleViewChange} />

              {/* ═══ BRANDS SECTION ═══ */}
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

              {/* ═══ PORTAL FOOTER ═══ */}
              <div className="portal-footer">
                <span className="portal-footer-copy">© 2026 724BAHİS.NET · Tüm hakları saklıdır.</span>
                <div className="portal-footer-links">
                  <a href="#" onClick={(e) => e.preventDefault()}>Hakkımızda</a>
                  <a href="#" onClick={(e) => e.preventDefault()}>İletişim</a>
                  <a href="#" onClick={(e) => e.preventDefault()}>Gizlilik</a>
                  <a href="#" onClick={(e) => e.preventDefault()}>Kullanım Koşulları</a>
                </div>
              </div>

              {/* ═══ MOBILE BOTTOM NAV ═══ */}
              <PortalMobileNav activeView={view} onViewChange={handleViewChange} />
            </>
          )}

        {view === 'analysis' && (
          <AnalysisView
            onNavigate={handleViewChange}
            analyses={analyses}
            coupons={coupons}
            siteUser={siteUser}
            isLoggedIn={!!(siteUser || userRole)}
            onLoginRequired={() => setAuthModalMode('member')}
          />
        )}

        {view === 'blackjack' && (
          <BlackjackGame
            config={bjConfig}
            onGameComplete={handleGameComplete}
            isLoggedIn={!!(siteUser || userRole)}
            onLoginRequired={() => setAuthModalMode('member')}
          />
        )}

        {view === 'loyalty' && (
          (siteUser || userRole) ? (
            <LoyaltyPanel
              config={loyaltyConfig}
              userId={siteUser?.id || userRole || 'guest'}
              onClose={() => setView('home')}
              onNavigate={handleViewChange}
            />
          ) : (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#0e0e0e]">
              <div className="text-7xl">🎯</div>
              <h2 className="text-white font-black text-3xl uppercase tracking-tight">Günlük Görevler</h2>
              <p className="text-zinc-500 font-bold text-sm">Coin kazanmak ve marketi kullanmak için üye girişi gereklidir.</p>
              <button onClick={() => setAuthModalMode('member')}
                className="px-8 py-4 bg-[#f0b90b] text-black font-black text-sm rounded-2xl uppercase tracking-widest hover:bg-[#f0b90b]/90 transition-all shadow-[0_0_25px_rgba(240,185,11,0.4)]">
                🔑 Üye Ol / Giriş Yap
              </button>
            </div>
          )
        )}

        {view === 'raffle' && (
          (siteUser || userRole) ? (
            <RaffleView
              loyaltyConfig={loyaltyConfig}
              userId={siteUser?.id || userRole || 'guest'}
              onNavigate={(v: string) => setView(v as any)}
            />
          ) : (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#0e0e0e]">
              <div className="text-7xl">🎟️</div>
              <h2 className="text-white font-black text-3xl uppercase tracking-tight">Bilet Etkinliği</h2>
              <p className="text-zinc-500 font-bold text-sm">Çekilişe katılmak için üye girişi gereklidir.</p>
              <button onClick={() => setAuthModalMode('member')}
                className="px-8 py-4 bg-[#f0b90b] text-black font-black text-sm rounded-2xl uppercase tracking-widest hover:bg-[#f0b90b]/90 transition-all shadow-[0_0_25px_rgba(240,185,11,0.4)]">
                🔑 Üye Ol / Giriş Yap
              </button>
            </div>
          )
        )}

        {view === 'pool' && (
          <PoolGame
            userId={siteUser?.id || userRole || 'guest'}
            username={siteUser?.username || 'Misafir'}
            isLoggedIn={!!(siteUser || userRole)}
            onLoginRequired={() => setAuthModalMode('member')}
          />
        )}

        {view === 'news' && (
          <NewsView
            onViewChange={handleViewChange}
            onArticleClick={(id) => { setSelectedArticleId(id); setView('news-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}

        {view === 'news-detail' && selectedArticleId && (
          <NewsDetailView
            articleId={selectedArticleId}
            onViewChange={handleViewChange}
            onArticleClick={(id) => { setSelectedArticleId(id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}

        {view === 'wheel' && (
          <PromoWheel
            config={promoWheelConfig}
            onConfigChange={handlePromoWheelConfigChange}
            isAdmin={!!userRole}
          />
        )}

        {view === 'giveaway' && (
          <GiveawayView
            config={giveawayConfig}
            onConfigChange={handleGiveawayConfigChange}
            isAdmin={!!userRole}
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

      {/* ── 724BAHİS Welcome Popup (once per session) ── */}
      {showWelcomePopup && (
        <PromoPopup
          onClose={handleCloseWelcomePopup}
          config={welcomePopupConfig}
        />
      )}

      {/* ── Match Search Modal ── */}
      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          coupons={coupons}
          onNavigate={handleViewChange}
        />
      )}

      {/* ── AI Chat Assistant ── */}
      <ChatBot />

    </div>
    )}
    </ThemeProvider>
  );
};

export default App;
