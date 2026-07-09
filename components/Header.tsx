import React, { useState, useRef, useEffect } from 'react';
import {
  Settings, User, Pen, LogOut, ChevronDown, Search, Coins, Send, X,
  MessageSquare, Home, Ticket, BarChart3, Shield, Menu, Gamepad2,
  Target, Spade, Trophy, TicketCheck, Gift, Tv, Diamond
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
  trustedSites: boolean;
  cekilis: boolean;
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
  trustedSites: true,
  cekilis: true,
};

interface HeaderProps {
  onAdminClick?: () => void;
  onViewChange?: (view: string) => void;
  activeView?: string;
  isAuthenticated?: boolean;
  userRole?: string | null;
  siteUser?: SiteUser | null;
  onMemberLoginClick?: () => void;
  onMemberRegisterClick?: () => void;
  onMemberLogout?: () => void;
  onSearchClick?: () => void;
  navVisibility?: NavVisibility;
  marqueeConfig?: MarqueeConfig;
  onSupportClick?: () => void;
  isChatOpen?: boolean;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

function getUserLoyalty(userId: string): UserLoyalty {
  const defaultLoyalty: UserLoyalty = { userId, coins: 0, tickets: 0, pendingTickets: 0, totalEarned: 0, transactions: [], lastVolumeResetDate: '', dailyVolumeAccumulated: 0 };
  try {
    const stored = localStorage.getItem(`loyalty_${userId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        return {
          ...defaultLoyalty,
          ...parsed
        };
      }
    }
  } catch (e) {
    console.error("Error reading user loyalty:", e);
  }
  return defaultLoyalty;
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
  onMemberRegisterClick,
  onMemberLogout,
  onSearchClick,
  navVisibility,
  marqueeConfig,
  onSupportClick,
  isChatOpen = false,
  isSidebarOpen = false,
  onToggleSidebar,
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
    { key: 'trusted-sites', view: 'trusted-sites', label: 'Güvenilir', icon: <Shield className={ICON_SIZE} />, visKey: 'trustedSites' },
    { key: 'pool', view: 'pool', label: '724TOTO', icon: <Target className={ICON_SIZE} />, visKey: 'pool' },
    { key: 'blackjack', view: 'blackjack', label: 'Casino', icon: <Spade className={ICON_SIZE} />, visKey: 'blackjack' },
    { key: 'loyalty', view: 'loyalty', label: 'Görevler', icon: <Trophy className={ICON_SIZE} />, visKey: 'loyalty' },
    { key: 'raffle', view: 'raffle', label: 'Bilet', icon: <TicketCheck className={ICON_SIZE} />, visKey: 'raffle' },
    { key: 'cekilis', view: 'cekilis', label: 'Çekiliş', icon: <Gift className={ICON_SIZE} /> },
    {key: 'giveaway', view: 'giveaway', label: 'Çekiliş Yönetimi', icon: <Gift className={ICON_SIZE} />, visKey: 'giveaway', requireRole: true},
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = userRole === 'admin';
  const isEditor = userRole && userRole !== 'admin';



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
    return activeView === cat.view;
  };

  return (
    <>
      <div className={`header-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        <style>{`
          @media (max-width: 768px) {
            .header-topbar-right .header-icon-btn {
              display: none !important;
            }
          }
          @keyframes custom-marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .animate-custom-marquee {
            animation: custom-marquee var(--speed, 20s) linear infinite;
            will-change: transform;
            transform: translateZ(0);
            backface-visibility: hidden;
          }
          @keyframes logoShimmer {
            0%   { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          @keyframes logoGlow {
            0%, 100% { text-shadow: 0 0 10px rgba(245,166,35,0.3), 0 0 20px rgba(245,166,35,0.1); }
            50% { text-shadow: 0 0 15px rgba(245,166,35,0.5), 0 0 30px rgba(245,166,35,0.2), 0 0 45px rgba(245,166,35,0.1); }
          }
          .logo-text-724 {
            position: relative;
            z-index: 10000;
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
            background: linear-gradient(135deg, #F5A623, #FFD580, #F5A623);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: logoGlow 3s ease-in-out infinite;
            filter: drop-shadow(0 0 8px rgba(245,166,35,0.4));
          }
          .logo-text-724 .logo-dot {
            color: #F5A623;
            -webkit-text-fill-color: #F5A623;
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
            background: linear-gradient(135deg, rgba(245,166,35,0.1), rgba(255,215,0,0.04));
            border-color: rgba(245,166,35,0.2);
            box-shadow: 0 0 35px rgba(245,166,35,0.15), 0 0 70px rgba(245,166,35,0.05);
            transform: scale(1.04);
          }
          .logo-text-724::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(105deg, transparent 40%, rgba(245,166,35,0.1) 50%, transparent 60%);
            background-size: 200% 100%;
            border-radius: inherit;
            pointer-events: none;
            opacity: 0;
          }
          .logo-text-724:hover::after {
            opacity: 1;
            animation: logoShimmer 2s ease-in-out infinite;
          }
          .header-topbar {
            transition: padding-left 0.3s ease-in-out;
          }
          .header-icon-btn:hover {
            color: #F5A623 !important;
          }
        `}</style>

      {/* ══════ SINGLE TIER: Logo + Categories + Controls ══════ */}
      <div className="header-topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: '#0D1320', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', padding: '6px 24px', height: '60px' }}>
        
        {/* Left: Menu & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onToggleSidebar && (
            <button onClick={onToggleSidebar} className="text-white hover:text-amber-500 transition-colors hidden md:block">
              <Menu className="w-6 h-6" />
            </button>
          )}
          <div
            className="logo-text-724"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={() => onViewChange?.('home')}
          >
            <span style={{
              fontSize: '20px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              letterSpacing: '-1px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center'
            }}>
              724BAHİS
              <span style={{
                background: 'linear-gradient(135deg, #F5A623 0%, #D4900A 100%)',
                color: '#000',
                fontSize: '11px',
                fontWeight: 900,
                padding: '2px 6px',
                borderRadius: '4px',
                marginLeft: '4px',
                fontFamily: "'Inter', sans-serif",
                opacity: 0.95
              }}>.COM</span>
            </span>
          </div>
        </div>



        {/* Right: Controls */}
        <div className="header-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>


          {siteUser ? (
            <>
              {/* Bakiye Göstergesi */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-fade-in"
                title="Güncel Bakiyeniz"
              >
                <span className="text-[11px] font-black uppercase text-emerald-500 tracking-widest hidden sm:inline-block">BAKİYE</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {siteUser.balance?.toFixed(2) || '0.00'} <span className="text-emerald-500">₺</span>
                </span>
              </div>

              {/* Yatırım Button */}
              <button
                onClick={() => setShowDepositModal(true)}
                style={{
                  background: '#F5A623',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '13px',
                  padding: '0 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Inter, sans-serif'
                }}
                className="hover:scale-105 active:scale-95 transition-transform shadow-md"
              >
                Yatırım
              </button>

              {/* Profile Button with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="header-icon-btn hover:opacity-80 transition-opacity bg-slate-800 rounded-full w-9 h-9 flex items-center justify-center border border-white/5"
                >
                  <User className="w-4 h-4 text-slate-300" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 rounded-xl py-2 z-50" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-modal)' }}>
                    <div className="px-4 py-2 mb-1" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>
                        {userRole === 'admin' || userRole === 'editor' ? 'Yönetici Hesabı' : 'Üye Hesabı'}
                      </p>
                      <p className="text-sm font-black truncate" style={{ color: 'var(--text-primary)' }}>{siteUser.username}</p>
                    </div>

                    {(userRole === 'admin' || userRole === 'editor') && (
                      <button
                        onClick={() => { setDropdownOpen(false); onAdminClick?.(); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-amber-500 hover:bg-amber-500/5 text-xs font-bold transition-colors border-b border-black/5"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Yönetim Paneli
                      </button>
                    )}

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


            </>
          ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={onMemberLoginClick}
                    style={{
                      background: 'transparent',
                      color: '#0EA5E9',
                      border: '1px solid rgba(14, 165, 233, 0.5)',
                      padding: '0 16px',
                      height: '36px',
                      fontWeight: 800,
                      fontSize: '13px',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      whiteSpace: 'nowrap'
                    }}
                    className="hover:bg-sky-500/10 transition-colors"
                  >
                    Giriş yap
                  </button>
                  <button
                    onClick={onMemberRegisterClick}
                    style={{
                      background: '#F5A623',
                      color: '#000',
                      border: 'none',
                      padding: '0 16px',
                      height: '36px',
                      fontWeight: 900,
                      fontSize: '13px',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 8px rgba(245, 166, 35, 0.3)'
                    }}
                    className="hover:scale-105 active:scale-95 transition-transform"
                  >
                    Şimdi kayıt ol
                  </button>
                </div>
                
                <button
                  onClick={onSupportClick}
                  className="header-icon-btn hover:opacity-80 transition-opacity bg-slate-800 rounded-full w-9 h-9 flex items-center justify-center border border-white/5"
                  title="Sohbet"
                >
                  <MessageSquare className="w-4 h-4 text-slate-300" />
                </button>
                
                <button
                  onClick={onSearchClick}
                  className="header-icon-btn hover:opacity-80 transition-opacity bg-slate-800 rounded-full w-9 h-9 flex items-center justify-center border border-white/5"
                  title="Maç Ara"
                >
                  <Search className="w-4 h-4 text-slate-300" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* ══════ TIER 2: Marquee Bar ══════ */}
        {marqueeConfig?.isActive && (
          <div className="header-categories header-marquee-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', height: '36px', background: '#0D1320', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
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
                  {(() => {
                    const text = marqueeConfig.text || '';
                    const separator = (
                      <span 
                        style={{ 
                          color: '#F5A623', 
                          margin: '0 30px', 
                          fontWeight: 900,
                          letterSpacing: '1px',
                          display: 'inline-block'
                        }}
                      >
                        724FUTBOL.COM
                      </span>
                    );

                    const keyword = /724futbol\.com/gi;

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
                          {separator}
                        </React.Fragment>
                      ));
                    }

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
