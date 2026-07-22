import React, { useState, useRef, useEffect } from 'react';
import {
  Settings, User, Pen, LogOut, ChevronDown, ChevronUp, Search, Coins, Send, X,
  MessageSquare, Home, Ticket, BarChart3, Shield, Menu, Gamepad2,
  Target, Spade, Trophy, TicketCheck, Gift, Tv, Diamond, Wallet, Club,
  Bell, Users, ShieldCheck, Lock, Link, FileText, Clover, Activity, Briefcase, Sun, Moon
} from 'lucide-react';
import { SiteUser, UserLoyalty, MarqueeConfig } from '../types';
import { useTheme } from '../ThemeContext';
import { useLanguage, LanguageCode } from '../contexts/LanguageContext';
import SlotText from './SlotText';

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
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [walletSearch, setWalletSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const walletDropdownRef = useRef<HTMLDivElement>(null);
  const [logoHoverCount, setLogoHoverCount] = useState(0);
  const { theme, toggleTheme } = useTheme();

  const [depositUsername, setDepositUsername] = useState('');
  const [depositMsg, setDepositMsg] = useState({ type: '', text: '' });

  /* ── Category list ── */
    const categories: CategoryItem[] = [
    { key: 'spor724', view: 'spor724', label: t('header_spor724'), icon: <Target className={ICON_SIZE} /> },
    { key: 'slotra', view: 'slotra', label: t('header_gercek'), icon: <Target className={ICON_SIZE} /> },
    { key: 'mobile-bulletin', view: 'mobile-bulletin', label: t('header_mbulten'), icon: <Activity className={ICON_SIZE} /> },
    { key: 'coupons', view: 'coupons', label: t('header_kuponlar'), icon: <Ticket className={ICON_SIZE} />, visKey: 'coupons' },
    { key: 'brands', view: 'brands', label: t('header_siteler'), icon: <Shield className={ICON_SIZE} />, visKey: 'brands' },
    { key: 'trusted-sites', view: 'trusted-sites', label: t('header_guvenilir'), icon: <Shield className={ICON_SIZE} />, visKey: 'trustedSites' },
    { key: 'pool', view: 'pool', label: t('header_toto'), icon: <Target className={ICON_SIZE} />, visKey: 'pool' },
    { key: 'blackjack', view: 'blackjack', label: t('header_casino'), icon: <Spade className={ICON_SIZE} />, visKey: 'blackjack' },
    { key: 'loyalty', view: 'loyalty', label: t('header_gorevler'), icon: <Trophy className={ICON_SIZE} />, visKey: 'loyalty' },
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
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
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
          .perspective-1000 { perspective: 1000px; }
          .transform-style-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          .rotate-y-180 { transform: rotateY(180deg); }
          .group:hover .group-hover\:rotate-y-180 { transform: rotateY(180deg); }
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
            10%, 20%, 30% { opacity: 0.8; text-shadow: 0 0 10px #10b981, 0 0 20px #10b981; filter: brightness(1.5); }
            35%, 100% { opacity: 1; text-shadow: 0 0 5px rgba(0,255,163,0.5), 0 0 15px rgba(0,255,163,0.8); filter: brightness(1); }
          }
          .neon-text {
            display: inline-block;
            opacity: 0;
            animation: neonFlickerDelay 2s ease-out 1.2s forwards;
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
            background: linear-gradient(135deg, #10b981, #10b981, #10b981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: logoGlow 3s ease-in-out infinite;
            filter: drop-shadow(0 0 8px rgba(0,255,163,0.4));
          }
          .logo-text-724 .logo-dot {
            color: #10b981;
            -webkit-text-fill-color: #10b981;
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
            color: #10b981 !important;
          }
        `}</style>

      <div className="header-topbar relative w-full h-[72px] bg-[#0b0e14] flex justify-center">
        <div className="w-full max-w-[1400px] px-2 md:px-4 h-full flex items-center justify-between">
            {/* Left: Logo & Desktop Tabs */}
            <div className="flex items-center justify-start flex-1 gap-1 md:gap-4 z-10">
              
              <div 
                className="flex items-center cursor-pointer select-none ml-0 group"
                onClick={() => onViewChange?.('home')}
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}
              >
                <span className="font-extrabold text-2xl md:text-3xl tracking-tight lowercase">
                  <span className="text-white">724</span>
                  <span className="text-[#10b981]">bets</span>
                </span>
                <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 ml-1 -mt-4">
                  <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-[#10b981] drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">
                    {/* 3-leaf clover (Shamrock) */}
                    <path d="M 50,48 C 30,30 35,10 50,20 C 65,10 70,30 50,48 Z" />
                    <path d="M 46,52 C 30,35 10,40 20,55 C 10,70 30,75 46,52 Z" />
                    <path d="M 54,52 C 70,35 90,40 80,55 C 90,70 70,75 54,52 Z" />
                    <path d="M 50,52 Q 45,75 40,90 L 46,90 Q 51,75 50,52 Z" />
                  </svg>
                </div>
              </div>


            </div>

                {/* Right: User Controls */}
        <div id="tour-user-panel" className="flex items-center justify-end flex-[2] gap-1 md:gap-3 z-10">

          {siteUser ? (
            <div className="flex items-center gap-2 md:gap-3 ml-2">
              
              {/* Balance & Wallet Block */}
              <div className="flex items-center gap-2">
                <div className="relative" ref={walletDropdownRef}>
                  <div 
                    className="flex items-center bg-[#121721] hover:bg-[#181c2b] border border-[#1e2330] cursor-pointer transition-colors rounded-lg px-3 md:px-4 h-[38px] md:h-[42px]"
                    onClick={() => setWalletDropdownOpen(prev => !prev)}
                  >
                    <span className="text-white font-bold text-[13px] md:text-[14px] tracking-tight mr-2 whitespace-nowrap">${(siteUser.balance || 0).toFixed(2)}</span>
                    <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-zinc-400 transition-transform ${walletDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {walletDropdownOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:right-0 md:left-auto top-[calc(100%+8px)] w-72 rounded-lg py-0 z-50 bg-[#0b0e14] border border-[#1e2330] shadow-2xl text-left overflow-hidden">
                      <div className="p-3 border-b border-[#1e2330]">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input 
                            type="text" 
                            value={walletSearch}
                            onChange={(e) => setWalletSearch(e.target.value)}
                            placeholder={t("wallet_ara")} 
                            className="w-full bg-[#121721] border border-[#1e2330] rounded-md py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-[#10b981] transition-colors placeholder-zinc-400"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col max-h-[300px] overflow-y-auto">
                        {[
                          { sym: 'TRY', icon: '₺', bg: '#10B981', name: 'Türk Lirası' },
                          { sym: 'USDT', icon: '₮', bg: '#26A17B', name: 'Tether' }
                        ].map((crypto) => (
                          <div key={crypto.sym} className="flex items-center justify-between px-4 py-2.5 hover:bg-[#181c2b] cursor-pointer transition-colors group">
                            <span className="text-white font-bold text-[14px] font-mono">{(crypto.sym === 'TRY' ? (siteUser.balance || 0) : 0).toFixed(2)}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black" style={{ background: crypto.bg }}>{crypto.icon}</div>
                              <span className="text-white font-bold text-sm">{crypto.sym}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => window.dispatchEvent(new Event('openDepositModal'))}
                  className="bg-[#38b75e] hover:bg-[#2fa350] text-white font-bold h-[38px] md:h-[42px] px-3 md:px-5 rounded-lg text-[13px] md:text-[14px] transition-colors flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden md:block whitespace-nowrap">{t('wallet_cuzdan')}</span>
                </button>
              </div>

              {/* Divider / Spacer */}
              <div className="w-1 md:w-3"></div>

              {/* Icon Buttons Group */}
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-[48px] h-[38px] md:w-[56px] md:h-[42px] flex items-center justify-center gap-1.5 bg-[#121721] hover:bg-[#181c2b] border border-[#1e2330] rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-zinc-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#0b0e14] border border-[#1e2330] rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col py-2 animate-fade-in">
                      <button onClick={() => { setIsProfileOpen(false); onViewChange?.('profile'); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#181c2b] transition-colors w-full text-left text-zinc-300 hover:text-white group">
                        <User className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                        <span className="font-semibold text-sm">{t('profile_profil')}</span>
                      </button>
                      <button 
                        onClick={() => { setIsProfileOpen(false); onMemberLogout?.(); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors w-full text-left text-zinc-300 hover:text-red-400 group border-t border-[#1e2330] mt-1"
                      >
                        <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-red-400" />
                        <span className="font-semibold text-sm">{t('profile_cikis')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Button separated */}
              <div className="ml-1 md:ml-3">
                <button 
                  onClick={onSupportClick}
                  className={`w-[38px] h-[38px] md:w-[42px] md:h-[42px] flex items-center justify-center rounded-lg transition-colors ${isChatOpen ? 'bg-[#38b75e]/20 text-[#38b75e] border border-[#38b75e]/40' : 'bg-[#121721] hover:bg-[#181c2b] border border-[#1e2330] text-white'}`}
                >
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onMemberLoginClick}
                className="flex items-center justify-center bg-transparent hover:bg-white/5 text-white border border-transparent rounded-lg font-bold text-[13px] md:text-[14px] h-[38px] md:h-[42px] px-4 md:px-5 transition-all whitespace-nowrap"
              >
                {t('login')}
              </button>
              <button
                onClick={onMemberRegisterClick}
                className="flex items-center justify-center bg-[#38b75e] hover:bg-[#2fa350] text-white rounded-lg font-bold text-[13px] md:text-[14px] h-[38px] md:h-[42px] px-4 md:px-5 transition-all whitespace-nowrap"
              >
                {t('register')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default Header;
