import React, { useState, useRef, useEffect } from 'react';
import {
  Settings, User, Pen, LogOut, ChevronDown, ChevronUp, Search, Coins, Send, X,
  MessageSquare, Home, Ticket, BarChart3, Shield, Menu, Gamepad2,
  Target, Spade, Trophy, TicketCheck, Gift, Tv, Diamond, Wallet, Club,
  Bell, Users, ShieldCheck, Lock, Link, FileText, Clover
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
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showClover, setShowClover] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const walletDropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const [depositUsername, setDepositUsername] = useState('');
  const [depositMsg, setDepositMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const interval = setInterval(() => {
      setShowClover(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
            onClick={() => onViewChange?.('home')}
            className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-all duration-500 ml-0 lg:ml-2 w-[120px]"
          >
            {showClover ? (
              <Clover className="w-8 h-8 text-[#00FFA3] animate-in zoom-in duration-500 drop-shadow-[0_0_12px_rgba(0,255,163,0.8)]" />
            ) : (
              <span className="animate-in fade-in duration-500" style={{
                fontSize: '24px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 900,
                color: '#fff',
              }}>
                <span className="slot-text">724</span>
                <span className="neon-text text-[#00FFA3] ml-[1px]">BETS</span>
              </span>
            )}
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
              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-transparent hover:border-[#00FFA3]/50 transition-colors cursor-pointer overflow-hidden flex-shrink-0"
                >
                  <img 
                    src={(siteUser as any).avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${siteUser.username}`} 
                    className="w-full h-full object-cover bg-[#1F232B]" 
                    alt="avatar" 
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#1A1D24] border border-white/5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden flex flex-col py-2 animate-fade-in">
                    <button onClick={() => { setIsProfileOpen(false); onViewChange?.('profile'); }} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <User className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">Profil</span>
                    </button>
                    
                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <Bell className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">Gelen Kutusu</span>
                    </button>

                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <Users className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">İştirakler</span>
                    </button>

                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <ShieldCheck className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">Doğrulamalar</span>
                    </button>

                    <button onClick={() => { setIsProfileOpen(false); onViewChange?.('profile'); }} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <Settings className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">Ayarlar</span>
                    </button>

                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <Lock className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">Gizlilik</span>
                    </button>

                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <Link className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">Bağlantılar</span>
                    </button>

                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left text-zinc-300 hover:text-white group">
                      <FileText className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-semibold text-sm">İşlemler</span>
                    </button>

                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        localStorage.removeItem('site_current_member');
                        localStorage.removeItem('site_member');
                        localStorage.removeItem('site_user_role');
                        window.location.reload();
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors w-full text-left text-zinc-300 hover:text-red-400 group border-t border-white/5 mt-1"
                    >
                      <LogOut className="w-5 h-5 text-zinc-400 group-hover:text-red-400" />
                      <span className="font-semibold text-sm">Çıkış yap</span>
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




      </div>
    </>
  );
};

export default Header;
