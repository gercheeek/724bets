import React, { useState, useRef, useEffect } from 'react';
import { Zap, Settings, User, Shield, Pen, LogOut, ChevronDown, Search, Coins, Send, X, MessageSquare } from 'lucide-react';
import { SiteUser, UserLoyalty } from '../types';

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
}

function getUserLoyalty(userId: string): UserLoyalty {
  const stored = localStorage.getItem(`loyalty_${userId}`);
  if (stored) return JSON.parse(stored);
  return { userId, coins: 0, tickets: 0, pendingTickets: 0, totalEarned: 0, transactions: [], lastVolumeResetDate: '', dailyVolumeAccumulated: 0 };
}

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
}) => {
  const [logoHovered, setLogoHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Deposit Modal State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositUsername, setDepositUsername] = useState('');
  const [depositMsg, setDepositMsg] = useState({ type: '', text: '' });

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

  const isAdmin = userRole === 'admin';
  const isEditor = userRole && userRole !== 'admin';

  const renderUserStatus = () => {
    // Admin logged in
    if (isAdmin) {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={onAdminClick}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-black rounded-full text-xs tracking-widest uppercase hover:bg-orange-500/20 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <Settings className="w-3.5 h-3.5" />
            YÖNETİCİ
          </button>
        </div>
      );
    }

    // Editor logged in
    if (isEditor) {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={onAdminClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-black rounded-full text-xs tracking-widest uppercase hover:bg-blue-500/20 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <Pen className="w-3.5 h-3.5" />
            EDİTÖR
          </button>
        </div>
      );
    }

    // Site member logged in
    if (siteUser) {
      const loyalty = getUserLoyalty(siteUser.id);
      return (
        <div className="flex items-center gap-2">
          {/* Coin Balance */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#f0b90b]/10 border border-[#f0b90b]/20 rounded-full cursor-pointer hover:bg-[#f0b90b]/20 transition-all"
            onClick={() => onViewChange?.('loyalty')}
            title="Coin Bakiyesi">
            <Coins className="w-3.5 h-3.5 text-[#f0b90b]" />
            <span className="text-[#f0b90b] font-black text-xs tabular-nums">{loyalty.coins.toLocaleString('tr')}</span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black rounded-full text-xs uppercase hover:bg-emerald-500/20 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <User className="w-3.5 h-3.5" />
              <span className="max-w-[80px] truncate">{siteUser.username}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-[#0a0a0a] border border-zinc-800 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-zinc-800/60 mb-1">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Üye Hesabı</p>
                  <p className="text-sm font-black text-white truncate">{siteUser.username}</p>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); setShowDepositModal(true); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-blue-400 hover:bg-blue-500/10 text-xs font-bold transition-colors border-b border-zinc-800/60"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Yatırım Bildir
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); onMemberLogout?.(); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-colors"
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
        className="btn-login"
        onClick={onMemberLoginClick}
      >
        Giriş Yap
      </button>
    );
  };

  return (
    <>
      <header className="site-header">
        <div
          className="header-logo flex items-center gap-2 cursor-pointer transition-transform duration-300"
          onClick={() => onViewChange?.('home')}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          style={{ transform: logoHovered ? 'scale(1.02)' : 'scale(1)' }}
        >
          <div className="flex items-center gap-0.5 relative">
            {logoHovered && (
              <div className="absolute inset-0 bg-[#f0b90b] blur-[20px] opacity-20 rounded-full transition-opacity duration-300" />
            )}
            <span className="text-3xl font-black tracking-tighter text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              7<span className="text-[#f0b90b]">24</span>
            </span>
            <span className="text-xl font-bold tracking-tight text-zinc-100 ml-0.5" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              bets
            </span>
            <span className="text-lg font-bold tracking-tight text-[#f0b90b] ml-0.5" style={{ textShadow: '0 0 10px rgba(240,185,11,0.5)' }}>
              .net
            </span>
          </div>
        </div>

        <nav className="header-nav">
          <a
            href="#"
            className={activeView === 'home' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onViewChange?.('home'); }}
          >
            Ana Sayfa
          </a>
          <a
            href="#daily-coupons"
            onClick={(e) => {
              e.preventDefault();
              if (activeView === 'home') {
                const el = document.getElementById('daily-coupons');
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
              } else {
                onViewChange?.('home');
                setTimeout(() => {
                  const el = document.getElementById('daily-coupons');
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
                }, 100);
              }
            }}
          >
            Günün Kuponları
          </a>
          <a
            href="#"
            className={activeView === 'analysis' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onViewChange?.('analysis'); }}
          >
            Analizler
          </a>
          <a
            href="#popular-leagues-section"
            onClick={(e) => {
              e.preventDefault();
              if (activeView === 'home') {
                const el = document.getElementById('popular-leagues-section');
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
              } else {
                onViewChange?.('home');
                setTimeout(() => {
                  const el = document.getElementById('popular-leagues-section');
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
                }, 100);
              }
            }}
          >
            Ligler
          </a>
          <a
            href="#"
            className={activeView === 'brands' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onViewChange?.('brands'); }}
          >
            Güvenilir Siteler
          </a>
          <a
            href="#"
            className={activeView === 'news' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onViewChange?.('news'); }}
          >
            📰 Haberler
          </a>

          {/* Separator - Removed to eliminate white lines */}

          <a
            href="#"
            className={activeView === 'pool' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onViewChange?.('pool'); }}
          >
            🎱 724TOTO
          </a>
          <a
            href="#"
            className={activeView === 'blackjack' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onViewChange?.('blackjack'); }}
          >
            🎴 Casino
          </a>
          <a
            href="#"
            className={activeView === 'loyalty' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onViewChange?.('loyalty'); }}
          >
            🎯 Görevler
          </a>
          <a
            href="#"
            className={activeView === 'raffle' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onViewChange?.('raffle'); }}
          >
            🎟️ Bilet
          </a>
        </nav>

        <div className="header-right" style={{ gap: '8px' }}>
          {/* Search button */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-3 py-2 rounded-full transition-all hover:bg-white/[0.07] group"
            title="Maç Ara"
          >
            <Search className="w-4 h-4 text-zinc-400 group-hover:text-[#f0b90b] transition-colors" />
            <span className="hidden sm:block text-zinc-500 group-hover:text-zinc-300 text-xs font-bold transition-colors">Ara</span>
          </button>
          {renderUserStatus()}
        </div>
      </header>

      {/* DEPOSIT MODAL */}
      {showDepositModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setShowDepositModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-blue-400" />
              </div>

              <h3 className="text-xl font-black text-white mb-2">Yatırım Bildirimi</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Betlivo'ya yaptığınız yatırımların onaylanması ve <strong>Coin / Bilet</strong> tanımlamalarınızın yapılması için Betlivo kullanıcı adınızı bize iletin.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase ml-1 block mb-1">Betlivo Kullanıcı Adınız</label>
                  <input
                    type="text"
                    value={depositUsername}
                    onChange={(e) => setDepositUsername(e.target.value)}
                    placeholder="Kullanıcı adınızı girin"
                    className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
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
