
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import DailyCoupons from './components/DailyCoupons';
import BrandCard from './components/BrandCard';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import AnalysisView from './components/AnalysisView';
import BlackjackGame from './components/BlackjackGame';
import BetlivoPopup from './components/BetlivoPopup';
import DynamicCTA from './components/DynamicCTA';
import ChatBot from './components/ChatBot';
import SearchModal from './components/SearchModal';
import LoyaltyPanel, { DEFAULT_LOYALTY_CONFIG } from './components/LoyaltyPanel';
import RaffleView from './components/RaffleView';
import PoolGame from './components/PoolGame';
import { seedEcosystemData } from './seedEcosystem';
import NewsSection from './components/NewsSection';
import NewsView from './components/NewsView';
import NewsDetailView from './components/NewsDetailView';
import BetLivoWheel from './components/BetLivoWheel';
import GiveawayView, { DEFAULT_GIVEAWAY_CONFIG } from './components/GiveawayView';
import BetlivoSidePanel from './components/BetlivoSidePanel';
import { NavVisibility, DEFAULT_NAV_VISIBILITY } from './components/Header';
import { BRANDS as INITIAL_BRANDS } from './constants';
import { Brand, Coupon, BlackjackConfig, WheelConfig, WheelReward, SiteUser, LoyaltyConfig, BetLivoWheelConfig, GiveawayConfig, MarqueeConfig, WelcomePopupConfig, LiveOddsConfig } from './types';
import { DEFAULT_MARQUEE_CONFIG, DEFAULT_WELCOME_POPUP_CONFIG, DEFAULT_LIVE_ODDS_CONFIG } from './constants';


const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'admin' | 'login' | 'brands' | 'analysis' | 'blackjack' | 'loyalty' | 'raffle' | 'pool' | 'news' | 'news-detail' | 'wheel' | 'giveaway'>('home');

  // BetLivo Wheel Config
  const [wheelCarkConfig, setWheelCarkConfig] = useState<BetLivoWheelConfig>(() => {
    const stored = localStorage.getItem('site_betlivo_wheel');
    return stored ? JSON.parse(stored) : {
      participants: [],
      prizes: [
        { id: '1', name: '100 Free Spin', emoji: '🎰', stock: 10 },
        { id: '2', name: '50 TL Nakit', emoji: '💰', stock: 5 },
        { id: '3', name: '200 TL Freebet', emoji: '⚽', stock: 3 },
      ],
      history: [],
      riggedWinner: null,
      betlivoTrigger: false,
      transparentBg: false,
    };
  });

  const handleWheelCarkConfigChange = (cfg: BetLivoWheelConfig) => {
    setWheelCarkConfig(cfg);
    localStorage.setItem('site_betlivo_wheel', JSON.stringify(cfg));
  };
  // Giveaway Config
  const [giveawayConfig, setGiveawayConfig] = useState<GiveawayConfig>(() => {
    const stored = localStorage.getItem('site_giveaway_config');
    return stored ? JSON.parse(stored) : DEFAULT_GIVEAWAY_CONFIG;
  });

  const handleGiveawayConfigChange = (cfg: GiveawayConfig) => {
    setGiveawayConfig(cfg);
    localStorage.setItem('site_giveaway_config', JSON.stringify(cfg));
  };

  // Marquee Config
  const [marqueeConfig, setMarqueeConfig] = useState<MarqueeConfig>(() => {
    const stored = localStorage.getItem('site_marquee_config');
    return stored ? JSON.parse(stored) : DEFAULT_MARQUEE_CONFIG;
  });

  const handleMarqueeConfigChange = (cfg: MarqueeConfig) => {
    setMarqueeConfig(cfg);
    localStorage.setItem('site_marquee_config', JSON.stringify(cfg));
  };

  // Nav Visibility
  const [navVisibility, setNavVisibility] = useState<NavVisibility>(() => {
    const stored = localStorage.getItem('site_nav_visibility');
    return stored ? JSON.parse(stored) : DEFAULT_NAV_VISIBILITY;
  });

  const handleNavVisibilityChange = (vis: NavVisibility) => {
    setNavVisibility(vis);
    localStorage.setItem('site_nav_visibility', JSON.stringify(vis));
  };

  const [selectedArticleId, setSelectedArticleId] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [siteUser, setSiteUser] = useState<SiteUser | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'member' | 'admin' | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [themeColor, setThemeColor] = useState('#eab308');
  const [hashtags, setHashtags] = useState('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showBetlivoPopup, setShowBetlivoPopup] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loyaltyConfig, setLoyaltyConfig] = useState<LoyaltyConfig>(() => {
    const stored = localStorage.getItem('site_loyalty_config');
    return stored ? JSON.parse(stored) : DEFAULT_LOYALTY_CONFIG;
  });

  // Welcome Popup Config
  const [welcomePopupConfig, setWelcomePopupConfig] = useState<WelcomePopupConfig>(() => {
    const stored = localStorage.getItem('site_welcome_popup');
    return stored ? JSON.parse(stored) : DEFAULT_WELCOME_POPUP_CONFIG;
  });

  const handleWelcomePopupConfigChange = (cfg: WelcomePopupConfig) => {
    setWelcomePopupConfig(cfg);
    localStorage.setItem('site_welcome_popup', JSON.stringify(cfg));
  };

  // Live Odds Config
  const [liveOddsConfig, setLiveOddsConfig] = useState<LiveOddsConfig>(() => {
    const stored = localStorage.getItem('site_live_odds');
    return stored ? JSON.parse(stored) : DEFAULT_LIVE_ODDS_CONFIG;
  });

  const handleLiveOddsConfigChange = (cfg: LiveOddsConfig) => {
    setLiveOddsConfig(cfg);
    localStorage.setItem('site_live_odds', JSON.stringify(cfg));
  };

  const [bjConfig, setBjConfig] = useState<BlackjackConfig>({
    rewards: [],
    cooldownHours: 4,
    dealerHitSoft17: true,
    lastPlayTime: 0,
  });

  // Show Betlivo popup once per browser session
  useEffect(() => {
    if (!welcomePopupConfig.isActive) {
      setShowBetlivoPopup(false);
      return;
    }
    
    // Explicitly show it if it's active. If we want it only once per session, 
    // the sessionStorage check is fine, but for testing (toggling ON/OFF) we should probably clear it.
    const seen = sessionStorage.getItem('betlivo_popup_seen');
    if (!seen) {
      const t = setTimeout(() => setShowBetlivoPopup(true), 1200);
      return () => clearTimeout(t);
    } else {
       // If it is active but already seen, and it JUST became active (toggled on), 
       // we should probably show it again for admin testing.
       // The simplest way is to clear the flag when we want it to show.
       sessionStorage.removeItem('betlivo_popup_seen');
       const t = setTimeout(() => setShowBetlivoPopup(true), 1200);
       return () => clearTimeout(t);
    }
  }, [welcomePopupConfig.isActive]);

  const handleCloseBetlivoPopup = () => {
    setShowBetlivoPopup(false);
    sessionStorage.setItem('betlivo_popup_seen', '1');
  };

  // Seed ecosystem data on first load
  useEffect(() => {
    seedEcosystemData();
  }, []);

  // Load data from LocalStorage
  useEffect(() => {
    const savedBrands = localStorage.getItem('site_brands');
    const savedColor = localStorage.getItem('site_primary_color');
    const savedHashtags = localStorage.getItem('site_hashtags');
    const savedCoupons = localStorage.getItem('site_coupons');
    const savedWheel = localStorage.getItem('site_wheel_config');
    const savedRole = localStorage.getItem('site_user_role');
    const savedMember = localStorage.getItem('site_current_member');

    setBrands(savedBrands ? JSON.parse(savedBrands) : INITIAL_BRANDS);

    if (savedHashtags) setHashtags(savedHashtags);
    if (savedCoupons) setCoupons(JSON.parse(savedCoupons));
    if (savedWheel) setBjConfig(JSON.parse(savedWheel));
    if (savedColor && savedColor.startsWith('#')) setThemeColor(savedColor);
    if (savedRole) setUserRole(savedRole as string);
    if (savedMember) setSiteUser(JSON.parse(savedMember));
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
    }
  }, [themeColor]);

  useEffect(() => {
    const seoDiv = document.getElementById('seo-hashtags');
    if (seoDiv) seoDiv.innerText = hashtags;
    localStorage.setItem('site_hashtags', hashtags);
  }, [hashtags]);

  const saveBrands = (newBrands: Brand[]) => {
    setBrands(newBrands);
    localStorage.setItem('site_brands', JSON.stringify(newBrands));
  };

  // Hero brand for admin (keep backward compatibility)
  const heroDefault: Brand = {
    id: 'betlivo', name: 'BETLİVO', subtitle: 'CASINO & CANLI BAHİS',
    offerMain: '%280', offerSub: 'HOŞGELDİN BONUSU !!!',
    logo: 'https://picsum.photos/seed/betlivo/400/400', link: '#', isSponsor: true,
  };
  const [hero, setHero] = useState<Brand>(heroDefault);

  useEffect(() => {
    const savedHero = localStorage.getItem('site_hero');
    if (savedHero) setHero(JSON.parse(savedHero));
  }, []);

  const handleGameComplete = (lastPlayTime: number) => {
    const newConfig = { ...bjConfig, lastPlayTime };
    setBjConfig(newConfig);
    localStorage.setItem('site_wheel_config', JSON.stringify(newConfig));
  };

  const saveHero = (newHero: Brand) => {
    setHero(newHero);
    localStorage.setItem('site_hero', JSON.stringify(newHero));
  };

  if (view === 'admin') return (
    <AdminPanel
      brands={brands}
      hero={hero}
      role={userRole || 'admin'}
      wheelConfig={{ rewards: [], lastSpinTime: 0, spinCooldownHours: 6 }}
      bjConfig={bjConfig}
      loyaltyConfig={loyaltyConfig}
      onSaveBrands={saveBrands}
      onSaveHero={saveHero}
      onSaveWheelConfig={() => { }}
      onSaveBjConfig={(cfg) => {
        setBjConfig(cfg);
        localStorage.setItem('site_wheel_config', JSON.stringify(cfg));
      }}
      onSaveLoyaltyConfig={(cfg) => {
        setLoyaltyConfig(cfg);
        localStorage.setItem('site_loyalty_config', JSON.stringify(cfg));
      }}

      themeColor={themeColor}
      onThemeChange={setThemeColor}
      onLogout={() => {
        setUserRole(null);
        localStorage.removeItem('site_user_role');
        setView('home');
      }}
      onNavigateHome={() => setView('home')}
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

  return (
    <ThemeProvider>
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main)',
      color: 'var(--text-primary)',
      overflowX: 'hidden'
    }}>
      {/* Auth Modal Overlay */}
      {authModalMode && (
        <AuthModal
          mode={authModalMode}
          onMemberLogin={(user) => {
            setSiteUser(user);
            localStorage.setItem('site_current_member', JSON.stringify(user));
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
          localStorage.removeItem('site_current_member');
        }}
        onSearchClick={() => setShowSearch(true)}
        navVisibility={navVisibility}
        marqueeConfig={marqueeConfig}
        liveOddsConfig={liveOddsConfig}
      />

      <main style={{ position: 'relative', zIndex: 10, paddingTop: '130px' }}>
        {view === 'home' && (
          <>
            <Hero onNavigate={handleViewChange} />

            <div className="section-divider" />

            <DailyCoupons
              coupons={coupons}
              isLoggedIn={!!(siteUser || userRole)}
              onLoginRequired={() => setAuthModalMode('member')}
            />

            <div className="section-divider" />

            <DynamicCTA onNavigate={handleViewChange} />



            <div className="section-divider" />

            <NewsSection
              onViewChange={handleViewChange}
              onArticleClick={(id) => { setSelectedArticleId(id); setView('news-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />

            <div className="section-divider" />

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

              {/* ===== FEATURED SPONSOR BANNERS ===== */}
              <div className="flex flex-col gap-4 mb-14 animate-fade-in-up">

                {/* ═══════════════ BETLIVO – ANA SPONSOR ═══════════════ */}
                <a
                  href="https://betlivo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-card altin relative w-full flex flex-col md:flex-row items-center gap-6 md:gap-10 px-6 md:px-12 py-8 md:py-10 rounded-3xl overflow-hidden group cursor-pointer"
                  style={{ textDecoration: 'none' }}
                >
                  {/* Background animated glow orbs */}
                  <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#f0b90b]/5 blur-[80px] pointer-events-none group-hover:bg-[#f0b90b]/10 transition-all duration-700" />
                  <div className="absolute left-0 top-0 w-[200px] h-full bg-[#f0b90b]/3 blur-[60px] pointer-events-none" />
                  {/* Shimmer line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#f0b90b]/80 to-transparent group-hover:via-[#f0b90b] transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f0b90b]/30 to-transparent" />
                  {/* Moving shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f0b90b]/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 pointer-events-none" />

                  {/* Logo */}
                  <div className="relative z-10 flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)', boxShadow: '0 0 30px rgba(240,185,11,0.5)' }}>
                    <span className="text-black font-black text-sm md:text-base uppercase tracking-tighter leading-tight text-center">BET<br />LIVO</span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center gap-3 mb-2 justify-center md:justify-start">
                      <span className="font-black text-3xl md:text-4xl tracking-tighter uppercase leading-none" style={{ color: 'var(--text-primary)' }}>BETLIVO</span>
                      <span className="px-3 py-1 text-black font-black text-[10px] uppercase rounded-full tracking-widest" style={{ background: 'linear-gradient(90deg,#f0b90b,#ffd357)', animation: 'pulse 2s infinite' }}>🥇 ANA SPONSOR</span>
                      <span className="px-2 py-0.5 border border-green-500/50 text-green-400 font-black text-[9px] uppercase rounded-full tracking-widest">🟢 CANLI</span>
                    </div>
                    <p className="text-sm md:text-base font-bold mb-3" style={{ color: 'var(--text-muted)' }}>
                      🎁 %100 Hoşgeldin Bonusu &nbsp;·&nbsp; ⚡ Anında Ödeme &nbsp;·&nbsp; 🔒 Lisanslı &amp; Güvenli &nbsp;·&nbsp; 📞 7/24 Destek
                    </p>
                    <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest justify-center md:justify-start">
                      <span className="px-2.5 py-1 bg-[#f0b90b]/10 border border-[#f0b90b]/30 text-[#f0b90b] rounded-lg">Spor Bahsi</span>
                      <span className="px-2.5 py-1 bg-[#f0b90b]/10 border border-[#f0b90b]/30 text-[#f0b90b] rounded-lg">Canlı Bahis</span>
                      <span className="px-2.5 py-1 bg-[#f0b90b]/10 border border-[#f0b90b]/30 text-[#f0b90b] rounded-lg">Casino</span>
                      <span className="px-2.5 py-1 bg-[#f0b90b]/10 border border-[#f0b90b]/30 text-[#f0b90b] rounded-lg">e-Spor</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="relative z-10 flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-black group-hover:scale-105 transition-all duration-300 whitespace-nowrap"
                      style={{ background: 'linear-gradient(135deg, #f0b90b 0%, #ffd357 50%, #f0b90b 100%)', boxShadow: '0 0 25px rgba(240,185,11,0.5)', backgroundSize: '200% 100%' }}>
                      🚀 ŞİMDİ KAYIT OL
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Ücretsiz · 2 Dakika</span>
                  </div>
                </a>

                {/* ═══════════════ BETKOM – SPONSOR ═══════════════ */}
                <a
                  href="https://betkom.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-card gumus relative w-full flex flex-col md:flex-row items-center gap-5 md:gap-8 px-6 md:px-10 py-6 md:py-7 rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ textDecoration: 'none' }}
                >
                  {/* Background glow */}
                  <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-indigo-500/3 blur-[60px] pointer-events-none group-hover:bg-indigo-500/6 transition-all duration-500" />
                  <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent group-hover:via-indigo-400/60 transition-all duration-400" />
                  {/* Moving shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/[0.04] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-900 pointer-events-none" />

                  {/* Logo */}
                  <div className="relative z-10 flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-indigo-500/20"
                    style={{ background: 'linear-gradient(135deg, #E8E8F8, #D8D8F0)', boxShadow: '0 2px 10px rgba(99,102,241,0.1)' }}>
                    <span className="text-indigo-600 font-black text-[9px] uppercase tracking-tight leading-tight text-center">BET<br />KOM</span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center gap-2 mb-1 justify-center md:justify-start">
                      <span className="font-black text-xl md:text-2xl tracking-tighter uppercase" style={{ color: 'var(--text-primary)' }}>BETKOM</span>
                      <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 font-black text-[9px] uppercase rounded-full tracking-widest">SPONSOR</span>
                      <span className="px-2 py-0.5 border border-green-500/40 text-green-400 font-black text-[9px] uppercase rounded-full tracking-widest">🟢 AKTİF</span>
                    </div>
                    <p className="text-xs md:text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
                      🎯 %50 Spor Bonusu &nbsp;·&nbsp; 💳 Güvenli Ödeme &nbsp;·&nbsp; 🏆 Yüksek Oranlar
                    </p>
                    <div className="flex flex-wrap gap-1.5 text-[9px] font-black uppercase tracking-widest justify-center md:justify-start">
                      <span className="px-2 py-0.5 bg-indigo-500/8 border border-indigo-500/15 text-indigo-600 rounded-md">Futbol</span>
                      <span className="px-2 py-0.5 bg-indigo-500/8 border border-indigo-500/15 text-indigo-600 rounded-md">Basketbol</span>
                      <span className="px-2 py-0.5 bg-indigo-500/8 border border-indigo-500/15 text-indigo-600 rounded-md">Tenis</span>
                      <span className="px-2 py-0.5 bg-indigo-500/8 border border-indigo-500/15 text-indigo-600 rounded-md">Canlı</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="relative z-10 flex-shrink-0 flex flex-col items-center gap-1.5">
                    <div className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-white group-hover:scale-105 transition-all duration-300 whitespace-nowrap border border-indigo-500/40 group-hover:border-indigo-400"
                      style={{ background: 'linear-gradient(135deg, #3730a3, #4f46e5)', boxShadow: '0 0 15px rgba(99,102,241,0.25)' }}>
                      🎯 HEMEN İNCELE
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>Bonusu Kap</span>
                  </div>
                </a>
              </div>

              <div className="brands-grid">
                {brands.map((brand, index) => (
                  <BrandCard key={brand.id} brand={brand} index={index} />
                ))}
              </div>
            </section>
          </>
        )}

        {view === 'analysis' && (
          <AnalysisView
            onNavigate={handleViewChange}
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
          <BetLivoWheel
            config={wheelCarkConfig}
            onConfigChange={handleWheelCarkConfigChange}
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
          {hashtags.split(',').map((tag, i) => <span key={i}>{tag.trim()}</span>)}
        </div>
      </footer>

      {/* ── Betlivo Welcome Popup (once per session) ── */}
      {showBetlivoPopup && (
        <BetlivoPopup
          onClose={handleCloseBetlivoPopup}
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

      {/* ── Betlivo Side Panel ── */}
      <>
        <BetlivoSidePanel position="left" />
        <BetlivoSidePanel position="right" />
      </>
    </div>
    </ThemeProvider>
  );
};

export default App;
