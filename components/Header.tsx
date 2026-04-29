import React, { useState, useRef, useEffect } from 'react';
import {
  Settings, User, Pen, LogOut, ChevronDown, Search, Coins, Send, X,
  MessageSquare, Home, Ticket, BarChart3, Shield, Newspaper,
  Target, Spade, Trophy, TicketCheck, Gift, Tv
} from 'lucide-react';
import { SiteUser, UserLoyalty, MarqueeConfig, LiveOddsConfig } from '../types';
import { useTheme } from '../ThemeContext';

export interface NavVisibility {
  coupons: boolean;
  analysis: boolean;
  leagues: boolean;
  brands: boolean;
  news: boolean;
  pool: boolean;
  blackjack: boolean;
  loyalty: boolean;
  raffle: boolean;
  giveaway: boolean;
}

export const DEFAULT_NAV_VISIBILITY: NavVisibility = {
  coupons: true,
  analysis: true,
  leagues: true,
  brands: true,
  news: true,
  pool: false,
  blackjack: false,
  loyalty: false,
  raffle: false,
  giveaway: false,
};

interface HeaderProps {
  onAdminClick?: () => void;
  onViewChange?: (view: string) => void;
  activeView?: string;
  isAuthenticated?: boolean;
  userRole?: string | null;
  siteUser?: SiteUser | null;
  onMemberLoginClick?: () => void;
  onMemberLogout?: () => void;
  onSearchClick?: () => void;
  navVisibility?: NavVisibility;
  marqueeConfig?: MarqueeConfig;
  liveOddsConfig?: LiveOddsConfig;
  onSupportClick?: () => void;
}

function getUserLoyalty(userId: string): UserLoyalty {
  const stored = localStorage.getItem(`loyalty_${userId}`);
  if (stored) return JSON.parse(stored);
  return { userId, coins: 0, tickets: 0, pendingTickets: 0, totalEarned: 0, transactions: [], lastVolumeResetDate: '', dailyVolumeAccumulated: 0 };
}

/* ── Category definitions ── */
interface CategoryItem {
  key: string;
  view: string;
  label: string;
  icon: React.ReactNode;
  visKey?: keyof NavVisibility;
  scrollTo?: string; // if we should scroll to an element instead of switching view
  requireRole?: boolean;
}

const ICON_SIZE = 'w-5 h-5';

const Header: React.FC<HeaderProps> = ({
  onAdminClick,
  onViewChange,
  activeView = 'home',
  isAuthenticated = false,
  userRole = null,
  siteUser = null,
  onMemberLoginClick,
  onMemberLogout,
  onSearchClick,
  navVisibility,
  marqueeConfig,
  liveOddsConfig,
  onSupportClick,
}) => {
  const [logoHovered, setLogoHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Deposit Modal State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositUsername, setDepositUsername] = useState('');
  const [depositMsg, setDepositMsg] = useState({ type: '', text: '' });

  /* ── Category list ── */
  const categories: CategoryItem[] = [
    { key: 'home', view: 'home', label: 'Ana Sayfa', icon: <Home className={ICON_SIZE} /> },
    { key: 'coupons', view: 'coupons', label: 'Kuponlar', icon: <Ticket className={ICON_SIZE} />, visKey: 'coupons' },
    { key: 'analysis', view: 'analysis', label: 'Analizler', icon: <BarChart3 className={ICON_SIZE} />, visKey: 'analysis' },
    { key: 'brands', view: 'brands', label: 'Siteler', icon: <Shield className={ICON_SIZE} />, visKey: 'brands' },
    { key: 'news', view: 'news', label: 'Haberler', icon: <Newspaper className={ICON_SIZE} />, visKey: 'news' },
    { key: 'pool', view: 'pool', label: '724TOTO', icon: <Target className={ICON_SIZE} />, visKey: 'pool' },
    { key: 'blackjack', view: 'blackjack', label: 'Casino', icon: <Spade className={ICON_SIZE} />, visKey: 'blackjack' },
    { key: 'loyalty', view: 'loyalty', label: 'Görevler', icon: <Trophy className={ICON_SIZE} />, visKey: 'loyalty' },
    { key: 'raffle', view: 'raffle', label: 'Bilet', icon: <TicketCheck className={ICON_SIZE} />, visKey: 'raffle' },
    { key: 'giveaway', view: 'giveaway', label: 'Çekiliş', icon: <Gift className={ICON_SIZE} />, visKey: 'giveaway', requireRole: true },
    { key: '724tv', view: '724tv', label: '724TV', icon: <Tv className={ICON_SIZE} /> },
  ];

  const handleDepositSubmit = () => {
    if (!depositUsername.trim()) {
      setDepositMsg({ type: 'error', text: 'Lütfen kullanıcı adınızı girin.' });
      return;
    }
    if (!siteUser) return;

    try {
      const messages = JSON.parse(localStorage.getItem('site_messages') || '[]');
      const newMessage = {
        id: Date.now().toString(),
        userId: siteUser.id,
        username: siteUser.username,
        content: `724BAHİS.NET Yatırım Bildirimi:\n724BAHİS.NET Kullanıcı Adı: ${depositUsername}\n\nBu kullanıcı yatırım yaptığını bildiriyor.`,
        isRead: false,
        createdAt: Date.now()
      };

      localStorage.setItem('site_messages', JSON.stringify([...messages, newMessage]));

      setDepositMsg({ type: 'success', text: 'Bildirim başarıyla gönderildi!' });
      setTimeout(() => {
        setShowDepositModal(false);
        setDepositUsername('');
        setDepositMsg({ type: '', text: '' });
      }, 2000);
    } catch {
      setDepositMsg({ type: 'error', text: 'Bir hata oluştu.' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = userRole === 'admin';
  const isEditor = userRole && userRole !== 'admin';

  /* ── User status area (capsule buttons) ── */
  const renderUserStatus = () => {
    // Admin logged in
    if (isAdmin) {
      return (
        <button
          onClick={onAdminClick}
          className="header-capsule header-capsule--admin"
        >
          <span className="w-2 h-2 rounded-full bg-[#f0b90b] animate-pulse" />
          <Settings className="w-3.5 h-3.5" />
          YÖNETİCİ
        </button>
      );
    }

    // Editor logged in
    if (isEditor) {
      return (
        <button
          onClick={onAdminClick}
          className="header-capsule header-capsule--editor"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <Pen className="w-3.5 h-3.5" />
          EDİTÖR
        </button>
      );
    }

    // Site member logged in
    if (siteUser) {
      const loyalty = getUserLoyalty(siteUser.id);
      return (
        <div className="flex items-center gap-2">
          {/* Coin Balance */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer"
            onClick={() => onViewChange?.('loyalty')}
            title="Coin Bakiyesi"
            style={{ background: 'rgba(240, 185, 11, 0.12)', border: '1px solid rgba(240, 185, 11, 0.25)' }}
          >
            <Coins className="w-3.5 h-3.5 text-[#f0b90b]" />
            <span className="text-[#f0b90b] font-black text-xs tabular-nums">{loyalty.coins.toLocaleString('tr')}</span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="header-capsule header-capsule--member"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <User className="w-3.5 h-3.5" />
              <span className="max-w-[80px] truncate">{siteUser.username}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl py-2 z-50" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-modal)' }}>
                <div className="px-4 py-2 mb-1" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>Üye Hesabı</p>
                  <p className="text-sm font-black truncate" style={{ color: 'var(--text-primary)' }}>{siteUser.username}</p>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); setShowDepositModal(true); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-blue-500 hover:bg-blue-500/5 text-xs font-bold transition-colors border-b border-black/5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Yatırım Bildir
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); onMemberLogout?.(); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-500/5 text-xs font-bold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Guest - not logged in
    return (
      <button
        className="header-capsule header-capsule--login"
        onClick={onMemberLoginClick}
      >
        <User className="w-4 h-4" />
        Giriş Yap
      </button>
    );
  };

  /* ── Handle category click ── */
  const handleCategoryClick = (cat: CategoryItem) => {
    if (cat.scrollTo) {
      onViewChange?.(cat.view);
      const el = document.getElementById(cat.scrollTo!);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 15, behavior: 'auto' });
    } else {
      onViewChange?.(cat.view);
    }
  };

  /* ── Is this category active? ── */
  const isCategoryActive = (cat: CategoryItem) => {
    if (cat.key === 'coupons') return false; // scrollTo target, never "active"
    return activeView === cat.view;
  };

  return (
    <>
      <div className={`header-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        <style>{`
          @keyframes custom-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-custom-marquee {
            animation: custom-marquee var(--speed, 20s) linear infinite;
          }
          @keyframes logoShimmer {
            0%   { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          @keyframes logoGlow {
            0%, 100% { text-shadow: 0 0 10px rgba(240,185,11,0.3), 0 0 20px rgba(240,185,11,0.1); }
            50% { text-shadow: 0 0 15px rgba(240,185,11,0.5), 0 0 30px rgba(240,185,11,0.2), 0 0 45px rgba(240,185,11,0.1); }
          }
          .logo-text-724 {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 0;
            font-family: 'Inter', sans-serif;
            font-weight: 900;
            font-size: 22px;
            letter-spacing: -0.5px;
            cursor: pointer;
            padding: 6px 16px;
            border-radius: 12px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: transparent;
            border: 1px solid transparent;
            text-decoration: none;
            white-space: nowrap;
            overflow: hidden;
          }
          .logo-text-724 .logo-num {
            background: linear-gradient(135deg, #f0b90b, #ffdd57, #f0b90b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: logoGlow 3s ease-in-out infinite;
            filter: drop-shadow(0 0 8px rgba(240,185,11,0.4));
          }
          .logo-text-724 .logo-dot {
            color: #f0b90b;
            -webkit-text-fill-color: #f0b90b;
            font-weight: 900;
          }
          .logo-text-724 .logo-ext {
            background: linear-gradient(135deg, #ffffff, #cccccc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
            font-size: 20px;
          }
          .logo-text-724:hover {
            background: linear-gradient(135deg, rgba(240,185,11,0.1), rgba(255,215,0,0.04));
            border-color: rgba(240,185,11,0.2);
            box-shadow: 0 0 35px rgba(240,185,11,0.15), 0 0 70px rgba(240,185,11,0.05);
            transform: scale(1.04);
          }
          .logo-text-724::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.1) 50%, transparent 60%);
            background-size: 200% 100%;
            border-radius: inherit;
            pointer-events: none;
            opacity: 0;
          }
          .logo-text-724:hover::after {
            opacity: 1;
            animation: logoShimmer 2s ease-in-out infinite;
          }
          .header-wrapper {
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            display: flex;
            flex-direction: column;
          }
        `}</style>

        {/* ══════ TIER 1: Top Bar — Logo + Nav + Controls ══════ */}
        <div className="header-topbar">
          {/* Left: Logo Text */}
          <div
            className="logo-text-724 shrink-0"
            onClick={() => onViewChange?.('home')}
          >
            <span className="logo-num">724BAHİS</span>
            <span className="logo-dot">.</span>
            <span className="logo-ext">NET</span>
          </div>

          {/* Center: Navigation Items */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center', overflow: 'auto', scrollbarWidth: 'none' }}>
            {categories.map((cat) => {
              if (cat.visKey && navVisibility?.[cat.visKey] === false) return null;
              if (cat.requireRole && !userRole) return null;
              const active = isCategoryActive(cat);
              return (
                <button
                  key={cat.key}
                  className={`header-cat-item ${active ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                  style={{ padding: '8px 14px', flexDirection: 'row', gap: '6px' }}
                >
                  <span className="header-cat-icon">{cat.icon}</span>
                  <span className="header-cat-label" style={{ fontSize: '11px' }}>{cat.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Search + User */}
          <div className="header-topbar-right">
            <button
              onClick={onSearchClick}
              className="header-icon-btn"
              title="Maç Ara"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={onSupportClick}
              className="header-icon-btn"
              title="Canlı Destek"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            {renderUserStatus()}
          </div>
        </div>

        {/* ══════ TIER 2: Marquee Bar ══════ */}
        {marqueeConfig?.isActive && (
          <div className="header-categories" style={{ justifyContent: 'center', padding: '10px 16px', background: '#08080C' }}>
            <style>{`
              .marquee-container-hover-pause:hover .animate-custom-marquee {
                animation-play-state: paused;
              }
              .marquee-fade-wrapper {
                animation: marqueeFadeIn 0.8s ease forwards;
              }
              @keyframes marqueeFadeIn {
                from { opacity: 0; transform: translateY(4px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <div className="flex-1 overflow-hidden marquee-container-hover-pause" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
              <div key={marqueeConfig.text} className="marquee-fade-wrapper">
                <div 
                  className="whitespace-nowrap animate-custom-marquee inline-block"
                  style={{ 
                    color: '#FFF', 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    '--speed': `${marqueeConfig.speed ?? 30}s` 
                  } as React.CSSProperties}
                >
                  {/* 
                    Smart Separator Density: 
                    We use an EVEN number of loops (2 or 4) to ensure transform: translateX(-50%) is seamless.
                  */}
                  {(() => {
                    const text = marqueeConfig.text || '';
                    const separator = (
                      <span 
                        style={{ 
                          color: '#FFD700', 
                          margin: '0 30px', 
                          textShadow: '0 0 8px rgba(255,215,0,0.6)',
                          fontWeight: 900,
                          letterSpacing: '1px',
                          display: 'inline-block'
                        }}
                      >
                        724BAHİS.NET
                      </span>
                    );

                    const keyword = /724bahis\.net/gi;

                    // CASE 1: Manual Placement via '724bahis.net' keyword
                    if (text.match(keyword)) {
                      const parts = text.split(keyword);
                      return [...Array(2)].map((_, i) => (
                        <React.Fragment key={i}>
                          {parts.map((p, j) => (
                            <React.Fragment key={j}>
                              <span style={{ whiteSpace: 'pre' }}>{p}</span>
                              {j < parts.length - 1 && separator}
                            </React.Fragment>
                          ))}
                          {/* Ensure a separator between marquee repetitions */}
                          {separator}
                        </React.Fragment>
                      ));
                    }

                    // CASE 2: Fallback to Smart Density (for old or short text)
                    if (text.length < 150) {
                      return [...Array(4)].map((_, i) => (
                        <span key={i} className="inline-flex items-center">
                          <span>{text}</span>
                          {separator}
                        </span>
                      ));
                    }

                    const chunks = text.match(/.{1,180}(?:\s|$)/g) || [text];
                    return [...Array(2)].map((_, i) => ( 
                      <React.Fragment key={i}>
                        {chunks.map((chunk, j) => (
                          <span key={j} className="inline-flex items-center">
                            <span>{chunk.trim()}</span>
                            {separator}
                          </span>
                        ))}
                        {separator}
                      </React.Fragment>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════ TIER 3: Live Odds Ticker Bar ══════ */}
        {liveOddsConfig?.isActive && liveOddsConfig.matches.length > 0 && (
          <div className="header-categories" style={{ padding: '0', borderBottom: '1px solid rgba(255,255,255,0.04)', background: '#08080C' }}>
            <div className="w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 2%, black 98%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 2%, black 98%, transparent)' }}>
              <div className="flex items-center gap-0 animate-odds-scroll whitespace-nowrap" style={{ '--odds-count': liveOddsConfig.matches.length, '--odds-speed': `${liveOddsConfig.speed || 6}s` } as React.CSSProperties}>
                {[...liveOddsConfig.matches, ...liveOddsConfig.matches].map((match, idx) => (
                  <a
                    key={`odds-${idx}`}
                    href={match.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-5 py-2 border-r border-white/[0.04] hover:bg-white/[0.03] transition-all duration-200 group shrink-0"
                    style={{ textDecoration: 'none' }}
                  >
                    {/* Live badge */}
                    {match.isLive && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500/15 border border-red-500/30 rounded text-[9px] font-black text-red-400 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        Canlı
                      </span>
                    )}
                    {!match.isLive && (
                      <span className="text-[9px] font-bold text-zinc-500 min-w-[32px]">{match.matchTime}</span>
                    )}

                    {/* Teams */}
                    <span className="text-[11px] font-bold text-zinc-300 group-hover:text-white transition-colors">
                      {match.homeTeam} <span className="text-zinc-600 mx-0.5">vs</span> {match.awayTeam}
                    </span>

                    {/* Odds buttons */}
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-1 rounded text-[10px] font-black bg-[#f0b90b]/8 text-[#f0b90b] border border-[#f0b90b]/15 hover:bg-[#f0b90b]/20 hover:border-[#f0b90b]/40 transition-all cursor-pointer" title="1">
                        {match.odd1}
                      </span>
                      <span className="px-2 py-1 rounded text-[10px] font-black bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer" title="X">
                        {match.oddX}
                      </span>
                      <span className="px-2 py-1 rounded text-[10px] font-black bg-[#3b82f6]/8 text-[#60a5fa] border border-[#3b82f6]/15 hover:bg-[#3b82f6]/20 hover:border-[#3b82f6]/40 transition-all cursor-pointer" title="2">
                        {match.odd2}
                      </span>
                    </div>

                    {/* League badge */}
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-wider">{match.league}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DEPOSIT MODAL */}
      {showDepositModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div 
            className="rounded-3xl w-full max-w-sm overflow-hidden shadow-modal relative" 
            style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-card)' 
            }}
          >
            <button
              onClick={() => setShowDepositModal(false)}
              className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#1A1A1A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-blue-400" />
              </div>

              <h3 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Yatırım Bildirimi</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                724BAHİS.NET'e yaptığınız yatırımların onaylanması ve <strong>Coin / Bilet</strong> tanımlamalarınızın yapılması için 724BAHİS.NET kullanıcı adınızı bize iletin.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase ml-1 block mb-1" style={{ color: 'var(--text-dim)' }}>724BAHİS.NET Kullanıcı Adınız</label>
                  <input
                    type="text"
                    value={depositUsername}
                    onChange={(e) => setDepositUsername(e.target.value)}
                    placeholder="Kullanıcı adınızı girin"
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ 
                      background: 'var(--bg-elevated)', 
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                {depositMsg.text && (
                  <div className={`p-3 rounded-xl text-sm font-bold ${depositMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {depositMsg.text}
                  </div>
                )}

                <button
                  onClick={handleDepositSubmit}
                  className="w-full bg-blue-500 hover:bg-blue-400 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> BİLDİRİM GÖNDER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
