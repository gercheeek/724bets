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
          @keyframes slotMachineDrop {
            0% { transform: translateY(-40px) scaleY(1.5); opacity: 0; filter: blur(4px); }
            60% { transform: translateY(10px) scaleY(0.9); opacity: 1; filter: blur(0); }
            80% { transform: translateY(-4px) scaleY(1.05); }
            100% { transform: translateY(0) scaleY(1); opacity: 1; }
          }
          .slot-text {
            display: inline-block;
            opacity: 0;
            animation: slotMachineDrop 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards;
          }

          @keyframes neonFlickerDelay {
            0%, 5%, 15%, 25% { opacity: 0; text-shadow: none; filter: brightness(0.2); }
            10%, 20%, 30% { opacity: 0.8; text-shadow: 0 0 10px #00FFA3, 0 0 20px #00FFA3; filter: brightness(1.5); }
            35%, 100% { opacity: 1; text-shadow: 0 0 5px rgba(0,255,163,0.5), 0 0 15px rgba(0,255,163,0.8); filter: brightness(1); }
          }
          .neon-text {
            display: inline-block;
            opacity: 0;
            animation: neonFlickerDelay 2s ease-out 1.2s forwards;
          }

          @keyframes cloverCasinoPulse {
            0%, 100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 5px rgba(0,255,163,0.3)); }
            50% { transform: scale(1.15) rotate(180deg); filter: drop-shadow(0 0 20px rgba(0,255,163,1)); }
          }
          .clover-casino {
            animation: cloverCasinoPulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
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

      <div className="header-topbar relative w-full h-[64px] bg-[#0F1219] px-2 md:px-4 border-b border-white/5 flex items-center justify-between">
        
        {/* Left: Hamburger & Logo & Desktop Tabs */}
        <div className="flex items-center justify-start flex-1 gap-1 md:gap-4 z-10">
          <button onClick={onToggleSidebar} className="text-zinc-400 hover:text-white transition-colors p-1 md:p-2 flex-shrink-0">
            <Menu className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <div
            id="tour-logo"
            className="hidden"
          >
          </div>

          <div className="hidden lg:flex bg-[#0F1219] rounded-md p-0.5 border border-white/5 shadow-inner ml-2">
            <button 
              onClick={() => onViewChange?.('home')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeView === 'home' || activeView === 'blackjack' ? 'bg-[#1C2028] text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Casino
            </button>
            <button 
              onClick={() => onViewChange?.('sports')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeView === 'sports' || activeView === 'sports2' ? 'bg-[#1C2028] text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Spor
            </button>
          </div>
        </div>

        {/* Center: Wallet Pill (Only if logged in) */}
        <div className="flex items-center justify-center flex-[1.5] z-10">
          {siteUser && (
            <div className="relative flex items-center bg-[#151921] rounded-lg md:rounded-xl pl-1 pr-0.5 py-0.5 border border-white/5 h-[36px] md:h-[44px] shadow-inner" ref={walletDropdownRef}>
              
              {/* Balance Section */}
              <div 
                className="flex items-center cursor-pointer hover:bg-[#1C2028] transition-colors rounded-lg py-1 px-1 mr-1"
                onClick={() => setWalletDropdownOpen(prev => !prev)}
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded md:rounded-lg bg-[#00FFA3] flex items-center justify-center mr-1.5 md:mr-2 flex-shrink-0">
                  <span className="text-black font-black text-[12px] md:text-sm">$</span>
                </div>
                <span className="text-white font-bold text-[13px] md:text-[15px] tracking-tight mr-1 md:mr-3 whitespace-nowrap">{siteUser.balance?.toFixed(2) || '0.00'}</span>
                <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-zinc-500 mr-1 md:mr-2 transition-transform flex-shrink-0 ${walletDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Deposit Button attached to pill */}
              <button
                onClick={() => window.dispatchEvent(new Event('openDepositModal'))}
                className="bg-[#00FFA3] hover:bg-[#00e693] text-black font-black w-[32px] h-[32px] md:w-auto md:px-5 md:h-[36px] rounded-md md:rounded-lg text-[15px] transition-colors shadow-[0_0_10px_rgba(0,255,163,0.2)] flex items-center justify-center flex-shrink-0"
              >
                <Wallet className="w-4 h-4 md:hidden" />
                <span className="hidden md:block whitespace-nowrap">Cüzdan</span>
              </button>

              {walletDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:right-0 md:left-auto top-full mt-2 w-64 rounded-xl py-2 z-50 bg-[#1A1D24] border border-white/5 shadow-2xl text-left">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 hover:bg-[#1C2028] cursor-pointer transition-colors bg-[#1C2028]/50">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold bg-[#ef3434]">₺</div>
                        <span className="text-white font-bold text-sm">TRY</span>
                      </div>
                      <span className="text-white font-bold text-sm">{siteUser.balance?.toFixed(2)}</span>
                    </div>
                    <button className="w-full text-center py-4 text-zinc-400 hover:text-white font-bold text-sm transition-colors border-t border-white/5 mt-2">
                      Cüzdan Ayarları
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Controls (Profile, Chat, Notifications) */}
        <div id="tour-user-panel" className="flex items-center justify-end flex-1 gap-1 md:gap-3 z-10">
          {siteUser ? (
            <>
              {/* Profile Picture */}
              <button 
                onClick={() => onViewChange?.('profile')}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-transparent hover:border-[#00FFA3]/50 transition-colors cursor-pointer overflow-hidden flex-shrink-0"
              >
                <img 
                  src={(siteUser as any).avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${siteUser.username}`} 
                  className="w-full h-full object-cover bg-[#1F232B]" 
                  alt="avatar" 
                />
              </button>

              {/* Search Icon */}
              <button
                onClick={onSearchClick}
                className="text-zinc-400 hover:text-white transition-colors p-1 md:p-2 hidden sm:flex items-center justify-center flex-shrink-0"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications Icon */}
              <button className="text-zinc-400 hover:text-white transition-colors p-1 md:p-2 hidden sm:flex items-center justify-center relative flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef3434] rounded-full"></span>
              </button>

              {/* Chat Toggle Button */}
              <button
                onClick={onSupportClick}
                className="text-zinc-400 hover:text-white transition-colors p-1 md:p-2 flex items-center justify-center relative bg-[#0F1219] hover:bg-[#1C2028] border border-white/5 rounded-md shadow-inner flex-shrink-0"
                title="Canlı Sohbet"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#00FFA3] rounded-full animate-pulse"></span>
              </button>
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
