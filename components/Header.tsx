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
        content: `AHBAPBET Yatırım Bildirimi:\nAHBAPBET Kullanıcı Adı: ${depositUsername}\n\nBu kullanıcı yatırım yaptığını bildiriyor.`,
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

      <div className="header-topbar relative w-full h-[72px] bg-[#0B0E14] border-b border-transparent flex justify-center">
        <div className="w-full max-w-[1400px] px-2 md:px-4 h-full flex items-center justify-between">
            {/* Left: Hamburger & Logo & Desktop Tabs */}
            <div className="flex items-center justify-start flex-1 gap-1 md:gap-4 z-10">
              
              {!(activeView === 'sporx' || activeView === 'sports' || activeView === 'sports3' || activeView === 'sports4' || activeView === 'sports5' || activeView === 'giveaway') && (
                <button 
                  onClick={onToggleSidebar}
                  className="hidden lg:flex w-10 h-10 items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors mr-2"
                  title="Menüyü Aç/Kapat"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}

              <div 
                className="flex items-center cursor-pointer select-none ml-0 group"
                onClick={() => onViewChange?.('home')}
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}
              >
                <span className="font-extrabold text-2xl md:text-3xl tracking-tight lowercase">
                  <span className="text-white">ahbap</span>
                  <span className="text-[#10b981]">bet</span>
                </span>
                <div className="flex items-center justify-center w-4 h-4 md:w-4 md:h-4 rounded-full border-[2px] border-[#10b981] ml-1 -mt-4">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="text-[#10b981]">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>


            </div>

        {/* Center: Wallet Pill (Only if logged in) */}
        <div className="hidden md:flex items-center justify-center flex-[1.5] z-10">
          {siteUser && (
            <div className="relative flex items-center bg-[#14141a] rounded-lg md:rounded-xl pl-3 pr-0 py-0 border border-white/10 h-[36px] md:h-[44px] shadow-sm" ref={walletDropdownRef}>
              
              {/* Balance Section */}
              <div 
                className="flex items-center cursor-pointer hover:bg-[#1a1a22] transition-colors rounded-l-lg py-1 pr-3 h-full"
                onClick={() => setWalletDropdownOpen(prev => !prev)}
              >
                <span className="text-white font-bold text-[13px] md:text-[15px] tracking-tight mr-2 whitespace-nowrap">{(siteUser.balance || 0).toFixed(8)}</span>
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#26A17B] flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-white font-black text-[11px] md:text-xs">₮</span>
                </div>
                <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-zinc-400 transition-transform flex-shrink-0 ${walletDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Deposit Button attached to pill */}
              <button
                onClick={() => window.dispatchEvent(new Event('openDepositModal'))}
                className="bg-[#1475E1] hover:bg-[#0f60c0] text-white font-bold w-[32px] h-[36px] md:w-auto md:px-5 md:h-[44px] rounded-r-lg text-[14px] md:text-[15px] transition-colors flex items-center justify-center flex-shrink-0 border-l border-[#1475E1] shadow-[0_0_15px_rgba(20,117,225,0.3)]"
              >
                <Wallet className="w-4 h-4 md:hidden" />
                <span className="hidden md:block whitespace-nowrap">{t('wallet_cuzdan')}</span>
              </button>

              {walletDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:right-0 md:left-auto top-[calc(100%+8px)] w-72 rounded-lg py-0 z-50 bg-[#0B0E14] border border-white/10 shadow-2xl text-left overflow-hidden">
                  
                  {/* Search bar */}
                  <div className="p-3 border-b border-white/10">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text" 
                        value={walletSearch}
                        onChange={(e) => setWalletSearch(e.target.value)}
                        placeholder={t("wallet_ara")} 
                        className="w-full bg-[#14141a] border border-white/10 rounded-md py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-[#1A7BF2] transition-colors placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Crypto List */}
                  <div className="flex flex-col max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#2B3544] scrollbar-track-transparent">
                    {[
                      { sym: 'USDT', icon: '₮', bg: '#26A17B' },
                      { sym: 'BTC', icon: '₿', bg: '#F7931A' },
                      { sym: 'ETH', icon: 'Ξ', bg: '#627EEA' },
                      { sym: 'LTC', icon: 'Ł', bg: '#BFBBBB' },
                      { sym: 'SOL', icon: 'S', bg: 'linear-gradient(45deg, #06b6d4, #03E1FF)' },
                      { sym: 'DOGE', icon: 'Ð', bg: '#C2A633' },
                      { sym: 'BCH', icon: '₿', bg: '#8DC351' },
                      { sym: 'XRP', icon: '✕', bg: '#23292F' },
                      { sym: 'TRX', icon: '💎', bg: '#FF0013' }
                    ].filter(c => c.sym.toLowerCase().includes(walletSearch.toLowerCase())).map((crypto, idx) => (
                      <div key={crypto.sym} className="flex items-center justify-between px-4 py-2.5 hover:bg-[#14141a] cursor-pointer transition-colors group">
                        <span className="text-white font-bold text-[14px] md:text-[15px] font-mono tracking-tight group-hover:text-white/90">{(crypto.sym === 'USDT' ? (siteUser.balance || 0) : 0).toFixed(8)}</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-sm"
                            style={{ background: crypto.bg }}
                          >
                            {crypto.icon}
                          </div>
                          <span className="text-white font-bold text-sm tracking-wide">{crypto.sym}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Button */}
                  <button className="w-full flex items-center justify-center gap-2 py-3.5 text-white bg-[#14141a] hover:bg-[#1a1a22] font-bold text-sm transition-colors border-t border-white/10">
                    <Briefcase className="w-4 h-4 text-zinc-400" />
                    {t('wallet_ayarlar')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Controls (Profile, Chat, Notifications) */}
        <div id="tour-user-panel" className="flex items-center justify-end flex-1 gap-1 md:gap-3 z-10">
          
          {/* Theme Switcher */}
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 transition-colors text-zinc-300 hover:text-white mr-1"
            title={theme === 'light' ? 'Koyu Tema' : 'Açık Tema'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
          </button>

          {/* Language Switcher */}
          <div className="relative hidden sm:block" ref={langRef}>
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-zinc-300 hover:text-white"
            >
              <span className="text-sm font-bold uppercase">{language}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-[#0B0E14] border border-white/5 rounded-xl shadow-2xl z-50 overflow-hidden py-2 animate-fade-in">
                <button onClick={() => { setLanguage('tr'); setLangDropdownOpen(false); }} className={`flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors w-full text-left ${language === 'tr' ? 'text-white bg-white/5' : 'text-zinc-400'}`}>
                  <span className="text-base">🇹🇷</span>
                  <span className="font-semibold text-sm">TR</span>
                </button>
                <button onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }} className={`flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors w-full text-left ${language === 'en' ? 'text-white bg-white/5' : 'text-zinc-400'}`}>
                  <span className="text-base">🇬🇧</span>
                  <span className="font-semibold text-sm">EN</span>
                </button>
                <button onClick={() => { setLanguage('es'); setLangDropdownOpen(false); }} className={`flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors w-full text-left ${language === 'es' ? 'text-white bg-white/5' : 'text-zinc-400'}`}>
                  <span className="text-base">🇪🇸</span>
                  <span className="font-semibold text-sm">ES</span>
                </button>
                <button onClick={() => { setLanguage('pt'); setLangDropdownOpen(false); }} className={`flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors w-full text-left ${language === 'pt' ? 'text-white bg-white/5' : 'text-zinc-400'}`}>
                  <span className="text-base">🇧🇷</span>
                  <span className="font-semibold text-sm">PT</span>
                </button>
              </div>
            )}
          </div>

          {siteUser ? (
            <>
              {/* Profile Dropdown */}
              <div className="relative hidden md:block" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-transparent hover:border-[#10b981]/50 transition-colors cursor-pointer overflow-hidden flex-shrink-0"
                >
                  <img 
                    src={(siteUser as any).avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${siteUser.username}`} 
                    className="w-full h-full object-cover bg-[#14141a]" 
                    alt="avatar" 
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#0B0E14] border border-white/5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden flex flex-col py-2 animate-fade-in">
                    <button onClick={() => { setIsProfileOpen(false); onViewChange?.('profile'); }} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <User className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">{t('profile_profil')}</span>
                    </button>
                    
                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <Bell className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">{t('profile_gelenkutusu')}</span>
                    </button>

                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <Users className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">{t('profile_istirakler')}</span>
                    </button>

                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <ShieldCheck className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">{t('profile_dogrulamalar')}</span>
                    </button>

                    <button onClick={() => { setIsProfileOpen(false); onViewChange?.('profile'); }} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <Settings className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">{t('profile_ayarlar')}</span>
                    </button>

                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <Lock className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">{t('profile_gizlilik')}</span>
                    </button>

                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <Link className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">{t('profile_baglantilar')}</span>
                    </button>

                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <FileText className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">{t('profile_islemler')}</span>
                    </button>

                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        onMemberLogout?.();
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors w-full text-left text-zinc-300 hover:text-red-400 group border-t border-white/5 mt-1"
                    >
                      <LogOut className="w-5 h-5 text-zinc-400 group-hover:text-red-400" />
                      <span className="font-semibold text-sm">{t('profile_cikis')}</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
              <>
                <div className="flex items-center rounded-lg border border-white/10 h-[42px] overflow-hidden shadow-sm backdrop-blur-sm bg-white/5 p-1 gap-1">
                  <button
                    onClick={onMemberLoginClick}
                    className="flex items-center justify-center bg-transparent hover:bg-white/10 text-white border border-transparent hover:border-white/20 rounded-md font-bold text-[13px] h-full px-4 md:px-5 transition-all duration-300 whitespace-nowrap"
                  >
                    {t('login')}
                  </button>
                  <button
                    id="tour-register-btn"
                    onClick={onMemberRegisterClick}
                    className="flex items-center justify-center bg-[#10b981] hover:bg-[#00E676] text-black rounded-md font-extrabold text-[13px] h-full px-4 md:px-5 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,163,0.3)] whitespace-nowrap"
                  >
                    {t('register')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>




        </div>
      </div>
    </>
  );
};

export default Header;
