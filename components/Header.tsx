import React, { useState, useRef, useEffect } from 'react';
import {
  Settings, User, Pen, LogOut, ChevronDown, Search, Coins, Send, X,
  MessageSquare, Sun, Moon, Home, Ticket, BarChart3, Shield, Newspaper,
  Target, Spade, Trophy, TicketCheck, Gift
} from 'lucide-react';
import { SiteUser, UserLoyalty, MarqueeConfig } from '../types';
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
  pool: true,
  blackjack: true,
  loyalty: true,
  raffle: true,
  giveaway: true,
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
}) => {
  const [logoHovered, setLogoHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Deposit Modal State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositUsername, setDepositUsername] = useState('');
  const [depositMsg, setDepositMsg] = useState({ type: '', text: '' });

  /* ── Category list ── */
  const categories: CategoryItem[] = [
    { key: 'home', view: 'home', label: 'Ana Sayfa', icon: <Home className={ICON_SIZE} /> },
    { key: 'coupons', view: 'home', label: 'Kuponlar', icon: <Ticket className={ICON_SIZE} />, visKey: 'coupons', scrollTo: 'daily-coupons' },
    { key: 'analysis', view: 'analysis', label: 'Analizler', icon: <BarChart3 className={ICON_SIZE} />, visKey: 'analysis' },
    { key: 'brands', view: 'brands', label: 'Siteler', icon: <Shield className={ICON_SIZE} />, visKey: 'brands' },
    { key: 'news', view: 'news', label: 'Haberler', icon: <Newspaper className={ICON_SIZE} />, visKey: 'news' },
    { key: 'pool', view: 'pool', label: '724TOTO', icon: <Target className={ICON_SIZE} />, visKey: 'pool' },
    { key: 'blackjack', view: 'blackjack', label: 'Casino', icon: <Spade className={ICON_SIZE} />, visKey: 'blackjack' },
    { key: 'loyalty', view: 'loyalty', label: 'Görevler', icon: <Trophy className={ICON_SIZE} />, visKey: 'loyalty' },
    { key: 'raffle', view: 'raffle', label: 'Bilet', icon: <TicketCheck className={ICON_SIZE} />, visKey: 'raffle' },
    { key: 'giveaway', view: 'giveaway', label: 'Çekiliş', icon: <Gift className={ICON_SIZE} />, visKey: 'giveaway', requireRole: true },
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
        content: `Betlivo Yatırım Bildirimi:\nBetlivo Kullanıcı Adı: ${depositUsername}\n\nBu kullanıcı yatırım yaptığını bildiriyor.`,
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
      setTimeout(() => {
        const el = document.getElementById(cat.scrollTo!);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
      }, 100);
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
        `}</style>
        {/* ══════ TIER 1: Top Bar ══════ */}
        <div className="header-topbar">
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            {/* Logo */}
            <div
              className="header-logo shrink-0"
              onClick={() => onViewChange?.('home')}
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
              style={{ transform: logoHovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.3s ease' }}
            >
              <img 
                src="/logo.png" 
                alt="7/24Bets" 
                className="h-9 md:h-11 w-auto object-contain"
                style={{ 
                  filter: theme === 'light' && !isScrolled ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none'
                }}
              />
            </div>

          {/* Marquee (Kayan Yazı) */}
          {marqueeConfig?.isActive && (
            <div className="hidden md:flex flex-1 overflow-hidden ml-2 border-l border-white/10 pl-4 items-center h-8" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
              <div 
                className="whitespace-nowrap animate-custom-marquee inline-block"
                style={{ 
                  color: marqueeConfig.color, 
                  fontWeight: marqueeConfig.isBold ? 900 : 500,
                  '--speed': `${marqueeConfig.speed}s` 
                } as React.CSSProperties}
              >
                <span className="pr-12">{marqueeConfig.text}</span>
                <span className="pr-12">{marqueeConfig.text}</span>
                <span className="pr-12">{marqueeConfig.text}</span>
                <span className="pr-12">{marqueeConfig.text}</span>
                <span className="pr-12">{marqueeConfig.text}</span>
              </div>
            </div>
          )}
          </div>

          {/* Right side: theme + search + user */}
          <div className="header-topbar-right">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="header-icon-btn"
              title={theme === 'light' ? 'Karanlık Tema' : 'Aydınlık Tema'}
            >
              {theme === 'light'
                ? <Moon className="w-4 h-4" />
                : <Sun className="w-4 h-4" />}
            </button>
            {/* Search button */}
            <button
              onClick={onSearchClick}
              className="header-icon-btn"
              title="Maç Ara"
            >
              <Search className="w-4 h-4" />
            </button>
            {renderUserStatus()}
          </div>
        </div>

        {/* ══════ TIER 2: Category Bar ══════ */}
        <nav className="header-categories">
          {categories.map((cat) => {
            // Visibility check
            if (cat.visKey && navVisibility?.[cat.visKey] === false) return null;
            // Role check
            if (cat.requireRole && !userRole) return null;

            const active = isCategoryActive(cat);

            return (
              <button
                key={cat.key}
                className={`header-cat-item ${active ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                <span className="header-cat-icon">{cat.icon}</span>
                <span className="header-cat-label">{cat.label}</span>
              </button>
            );
          })}
        </nav>
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
                Betlivo'ya yaptığınız yatırımların onaylanması ve <strong>Coin / Bilet</strong> tanımlamalarınızın yapılması için Betlivo kullanıcı adınızı bize iletin.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase ml-1 block mb-1" style={{ color: 'var(--text-dim)' }}>Betlivo Kullanıcı Adınız</label>
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
