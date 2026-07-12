import React, { useState, useRef, useEffect } from 'react';
import {
  Settings, User, Pen, LogOut, ChevronDown, ChevronUp, Search, Coins, Send, X,
  MessageSquare, Home, Ticket, BarChart3, Shield, Menu, Gamepad2,
  Target, Spade, Trophy, TicketCheck, Gift, Tv, Diamond, Wallet, Club
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
  href?: string;
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
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const walletDropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const [depositUsername, setDepositUsername] = useState('');
  const [depositMsg, setDepositMsg] = useState({ type: '', text: '' });

  /* ── Category list ── */
    const categories: CategoryItem[] = [
    { key: 'slotra', view: 'slotra', label: 'Gerçek', icon: <Target className={ICON_SIZE} /> },
    { key: 'coupons', view: 'coupons', label: 'Kuponlar', icon: <Ticket className={ICON_SIZE} />, visKey: 'coupons' },
    { key: 'brands', view: 'brands', label: 'Siteler', icon: <Shield className={ICON_SIZE} />, visKey: 'brands' },
    { key: 'trusted-sites', view: 'trusted-sites', label: 'Güvenilir', icon: <Shield className={ICON_SIZE} />, visKey: 'trustedSites' },
    { key: 'pool', view: 'pool', label: '724TOTO', icon: <Target className={ICON_SIZE} />, visKey: 'pool' },
    { key: 'blackjack', view: 'blackjack', label: 'Casino', icon: <Spade className={ICON_SIZE} />, visKey: 'blackjack' },
    { key: 'loyalty', view: 'loyalty', label: 'Görevler', icon: <Trophy className={ICON_SIZE} />, visKey: 'loyalty' },
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
        content: `724BETS Yatırım Bildirimi:\n724BETS Kullanıcı Adı: ${depositUsername}\n\nBu kullanıcı yatırım yaptığını bildiriyor.`,
        isRead: false,
        createdAt: Date.now()
      };

      localStorage.setItem('site_messages', JSON.stringify([...messages, newMessage]));

      setDepositMsg({ type: 'success', text: 'Bildirim başarıyla gönderildi!' });
      setTimeout(() => {
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
      if (walletDropdownRef.current && !walletDropdownRef.current.contains(e.target as Node)) {
        setWalletDropdownOpen(false);
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
    if (cat.href) {
      window.open(cat.href, '_blank');
      return;
    }
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
            0%, 100% { text-shadow: 0 0 10px rgba(0,255,163,0.3), 0 0 20px rgba(0,255,163,0.1); }
            50% { text-shadow: 0 0 15px rgba(0,255,163,0.5), 0 0 30px rgba(0,255,163,0.2), 0 0 45px rgba(0,255,163,0.1); }
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
            background: linear-gradient(135deg, #00FFA3, #00FFA3, #00FFA3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: logoGlow 3s ease-in-out infinite;
            filter: drop-shadow(0 0 8px rgba(0,255,163,0.4));
          }
          .logo-text-724 .logo-dot {
            color: #00FFA3;
            -webkit-text-fill-color: #00FFA3;
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
            background: linear-gradient(135deg, rgba(0,255,163,0.1), rgba(0,255,163,0.04));
            border-color: rgba(0,255,163,0.2);
            box-shadow: 0 0 35px rgba(0,255,163,0.15), 0 0 70px rgba(0,255,163,0.05);
            transform: scale(1.04);
          }
          .logo-text-724::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(105deg, transparent 40%, rgba(0,255,163,0.1) 50%, transparent 60%);
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
            color: #00FFA3 !important;
          }
        `}</style>

      {/* ══════ SINGLE TIER: Logo + Categories + Controls ══════ */}
      <div className="header-topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: '#0F1219', borderBottom: '1px solid rgba(255, 255, 255, 0.03)', padding: '6px 24px', height: '60px' }}>
        
        {/* Left: Logo & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>

          <div
            id="tour-logo"
            className="logo-text-724 group"
            style={{ 
              alignItems: 'center', 
              cursor: 'pointer',
              position: 'relative',
              display: 'flex'
            }}
            onClick={() => onViewChange?.('home')}
          >
            <Club className="w-7 h-7 text-[#00FFA3] mr-2 logo-clover-intro group-hover:rotate-[360deg] transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] drop-shadow-[0_0_10px_rgba(0,255,163,0.5)] group-hover:scale-110" strokeWidth={2.5} />
            <span className="logo-text-intro">
              <span style={{
                fontSize: '22px',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                letterSpacing: '-1.5px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s ease'
              }} className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#00FFA3]">
                724bets
                <span style={{
                  background: 'rgba(0, 255, 163, 0.08)',
                  color: '#00FFA3',
                  border: '1px solid rgba(0, 255, 163, 0.3)',
                  fontSize: '9px',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  padding: '2px 5px',
                  borderRadius: '12px',
                  marginLeft: '6px',
                  transform: 'translateY(-6px)',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.3s ease'
                }} className="group-hover:border-[#00FFA3] group-hover:shadow-[0_0_12px_rgba(0,255,163,0.3)]">BETA</span>
              </span>
            </span>
          </div>

          {/* Gamdom Style Main Menu (Desktop) - Removed */}
        </div>

        {/* Right: Controls */}
        <div id="tour-user-panel" className="header-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>


          {siteUser ? (
            <>
              <div className="flex items-center gap-2">
                {/* 21.com Style Balance Dropdown */}
                <div className="relative" ref={walletDropdownRef}>
                  <div 
                    className="flex items-center bg-[#1C2028] rounded-md pl-1 pr-3 py-1 cursor-pointer hover:bg-[#252A34] transition-colors border border-white/5"
                    onClick={() => setWalletDropdownOpen(prev => !prev)}
                  >
                    <div className="w-8 h-8 rounded bg-[#ef3434] text-white flex items-center justify-center mr-3 font-bold text-lg">
                      ₺
                    </div>
                    <span className="text-white font-black text-[15px] tracking-tight mr-2">₺{siteUser.balance?.toFixed(2) || '0.00'}</span>
                    <ChevronUp className={`w-4 h-4 text-[#00FFA3] transition-transform ${walletDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {walletDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-xl py-2 z-50 bg-[#161a22] border border-[#2A2E38] shadow-2xl">
                      <div className="flex flex-col">
                        {[
                          { symbol: '₺', code: 'TRY', name: 'Turkish Lira', color: 'bg-[#ef3434]' },
                          { symbol: '₿', code: 'BTC', name: 'Bitcoin', color: 'bg-[#f7931a]' },
                          { symbol: '♦', code: 'ETH', name: 'Ethereum', color: 'bg-[#627eea]' },
                          { symbol: 'Ł', code: 'LTC', name: 'Litecoin', color: 'bg-[#d3d3d3]' },
                          { symbol: 'T', code: 'TRX', name: 'Tron', color: 'bg-[#ef3434]' },
                          { symbol: '✕', code: 'XRP', name: 'Ripple', color: 'bg-[#23292f]' },
                          { symbol: 'Ð', code: 'DOGE', name: 'Dogecoin', color: 'bg-[#f8b245]' },
                        ].map(crypto => (
                          <div key={crypto.code} className="flex items-center justify-between px-4 py-3 hover:bg-[#1C2028] cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold ${crypto.color}`}>
                                {crypto.symbol}
                              </div>
                              <span className="text-zinc-300 font-bold text-sm">{crypto.code}</span>
                            </div>
                            <span className="text-zinc-400 font-bold text-sm">₺0.00</span>
                          </div>
                        ))}

                        <div className="flex items-center justify-between px-4 py-3 hover:bg-[#1C2028] cursor-pointer transition-colors bg-[#1C2028]/50">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold bg-[#14f195]">
                              ≡
                            </div>
                            <span className="text-white font-bold text-sm">SOL</span>
                          </div>
                          <span className="text-white font-bold text-sm">0.00000000</span>
                        </div>

                        <div className="flex items-center justify-between px-4 py-3 hover:bg-[#1C2028] cursor-pointer transition-colors border-b border-[#2A2E38]">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold bg-[#f3ba2f]">
                              ⬡
                            </div>
                            <span className="text-zinc-300 font-bold text-sm">BNB</span>
                          </div>
                          <span className="text-zinc-400 font-bold text-sm">₺0.00</span>
                        </div>

                        <button className="w-full text-center py-4 text-zinc-400 hover:text-white font-bold text-sm transition-colors">
                          Wallet settings
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 21.com Style Deposit Button (Cüzdan) */}
                <button
                  onClick={() => window.dispatchEvent(new Event('openDepositModal'))}
                  className="bg-[#00FFA3] hover:bg-[#00e693] text-black font-extrabold px-6 py-2 rounded-md text-[15px] transition-colors"
                >
                  Cüzdan
                </button>

                {/* Chat Toggle Button */}
                <button
                  onClick={onSupportClick}
                  className="bg-[#1C2028] hover:bg-[#252A34] text-white p-2 rounded-md transition-colors border border-white/5 flex items-center justify-center relative"
                  title="Canlı Sohbet"
                >
                  <MessageSquare className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#00FFA3] rounded-full animate-pulse"></span>
                </button>

                {/* 21.com Style Profile Button and Dropdown Container */}
                <div className="relative" ref={dropdownRef}>
                  {/* The Trigger Button */}
                  <div 
                    onClick={() => setDropdownOpen(prev => !prev)}
                    className="flex items-center gap-3 bg-[#1C2028] rounded-md p-1 pr-3 cursor-pointer border border-white/5 hover:bg-[#252A34] transition-colors"
                  >
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ecem" alt="Avatar" className="w-8 h-8 rounded" />
                    <div className="flex flex-col justify-center">
                      <span className="text-white font-bold text-[13px] leading-tight">{siteUser.username}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-[#D97706]">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                        <span className="text-[#D97706] text-[10px] font-black uppercase tracking-wider leading-none">BRONZ 2</span>
                      </div>
                    </div>
                    <div className="flex flex-col ml-1 opacity-50 justify-center gap-0.5">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white">
                        <path d="M18 15l-6-6-6 6"/>
                      </svg>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Mobile avatar fallback */}
                  <button
                    onClick={() => setDropdownOpen(prev => !prev)}
                    className="sm:hidden header-icon-btn hover:opacity-80 transition-opacity bg-slate-800 rounded-full w-9 h-9 flex items-center justify-center border border-white/5 absolute inset-0 opacity-0 z-10"
                  >
                    <span className="sr-only">Open Profile</span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg py-2 z-50 bg-[#1C2028] border border-[#2A2E38] shadow-2xl">
                      <div className="px-5 py-3 mb-1 border-b border-[#2A2E38]">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1">
                          {userRole === 'admin' || userRole === 'editor' ? 'YÖNETİCİ HESABI' : 'ÜYE HESABI'}
                        </p>
                        <p className="text-xl font-black text-white truncate">{siteUser.username}</p>
                      </div>

                      <button
                        onClick={() => { setDropdownOpen(false); onViewChange?.('profile'); }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-white hover:bg-[#252A34] text-sm font-bold transition-colors border-b border-[#2A2E38]"
                      >
                        <User className="w-4 h-4 text-zinc-400" />
                        Profil & Bakiye
                      </button>

                      {(userRole === 'admin' || userRole === 'editor') && (
                        <button
                          onClick={() => { setDropdownOpen(false); onAdminClick?.(); }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-[#00FFA3] hover:bg-[#252A34] text-sm font-bold transition-colors border-b border-[#2A2E38]"
                        >
                          <Shield className="w-4 h-4" />
                          Yönetim Paneli
                        </button>
                      )}

                      <button
                        onClick={() => { setDropdownOpen(false); onMemberLogout?.(); }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-[#EF4444] hover:bg-[#252A34] text-sm font-bold transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
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
                    onClick={onSupportClick}
                    className="bg-[#1C2028] hover:bg-[#252A34] text-white p-2 rounded-md transition-colors border border-white/5 flex items-center justify-center relative"
                    title="Canlı Sohbet"
                    style={{ height: '36px', width: '36px' }}
                  >
                    <MessageSquare className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  </button>

                  <button
                    id="tour-register-btn"
                    onClick={onMemberRegisterClick}
                    style={{
                      background: '#00FFA3',
                      color: '#000000',
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
                      boxShadow: '0 2px 8px rgba(0, 255, 163, 0.3)'
                    }}
                    className="hover:scale-105 active:scale-95 transition-transform"
                  >
                    Şimdi kayıt ol
                  </button>
                </div>

              </>
            )}
          </div>
        </div>

        {/* ══════ TIER 2: Marquee Bar ══════ */}
        {marqueeConfig?.isActive && (
          <div className="header-categories header-marquee-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', height: '36px', background: '#111317', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
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
                          color: '#00FFA3', 
                          margin: '0 30px', 
                          fontWeight: 900,
                          letterSpacing: '1px',
                          display: 'inline-block'
                        }}
                      >
                        724BETS
                      </span>
                    );

                    const keyword = /bahisbey/gi;

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
    </>
  );
};

export default Header;
