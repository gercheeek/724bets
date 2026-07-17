import React, { useState, useEffect } from 'react';
import { Search, Trophy, Shield, Target, ChevronRight, Info, Crown, Star, Play, X, ArrowRight, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import LiveWinsTicker from './LiveWinsTicker';
import LiveGamesSlider from './LiveGamesSlider';
import LiveBetsTable from './LiveBetsTable';
import RacesAndGiveaways from './RacesAndGiveaways';

import { CasinoLobbyGame, SiteUser } from '../types';
import GameLobbyGrid from './GameLobbyGrid';
import WorldCupTeaser from './WorldCupTeaser';
import OriginalsSlider from './OriginalsSlider';
import LimitedTimePromo from './LimitedTimePromo';
import { useLanguage } from '../contexts/LanguageContext';
import { GameDetailModal, GameData } from './GameDetailModal';
import { NewGamesSlider2 } from './NewGamesSlider2';

const getDemoUrl = (game: any): string | null => {
  if (!game) return null;
  if (game.customDemoUrl) return game.customDemoUrl;
  if (game.demoSymbol) {
    return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${game.demoSymbol}&jurisdiction=99&lobbyUrl=https://724bahis.net`;
  }
  return null;
};

const ActivePlayersCounter = ({ type }: { type: 'casino' | 'sports' }) => {
  const { t } = useLanguage();
  const [players, setPlayers] = useState(0);

  useEffect(() => {
    const seed = type === 'casino' ? 1 : 2;
    const calculateBase = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const minute = now.getMinutes();
      
      const isWeekend = day === 0 || day === 6;
      const min = isWeekend ? 9000 : 7000;
      const max = isWeekend ? 14000 : 9950;
      
      // Peak at 21:00 (0.875 of day), trough at 09:00 (0.375 of day)
      const timeProgress = (hour * 60 + minute) / (24 * 60);
      const wave = Math.cos((timeProgress - 21/24) * 2 * Math.PI); 
      const normalizedWave = (wave + 1) / 2; // 0 to 1
      
      // Hourly noise (slow changes)
      const noise = Math.sin((minute + seed * 10) * Math.PI / 30) * (isWeekend ? 800 : 400);
      
      let val = min + (max - min) * normalizedWave + noise;
      if (!isWeekend && val > 9999) val = 9950;
      if (val < min) val = min;
      
      return Math.floor(val);
    };

    setPlayers(calculateBase());

    const interval = setInterval(() => {
      setPlayers(prev => {
        if (Math.random() > 0.8) return calculateBase();
        const diff = Math.floor(Math.random() * 31) - 15;
        let next = prev + diff;
        const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
        if (!isWeekend && next > 9999) next = 9999;
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [type]);

  const formatted = players.toLocaleString('tr-TR');

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]"></span>
      <span className="text-gray-200 text-sm sm:text-base lg:text-lg font-medium tracking-wide whitespace-nowrap">
        {formatted} {t('playing') || 'Oynuyor'}
      </span>
    </div>
  );
};

interface GuestLandingProps {
  siteUser?: SiteUser | null;
  onSearchClick: () => void;
  onViewChange: (view: string) => void;
  onMemberLoginClick: () => void;
  onMemberRegisterClick: () => void;
  customGames?: any[];
}

const GuestLanding: React.FC<GuestLandingProps> = ({
  siteUser,
  onSearchClick,
  onViewChange,
  onMemberLoginClick,
  onMemberRegisterClick,
  customGames = []
}) => {
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [showTeaser, setShowTeaser] = useState(true);
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [showDemoIframe, setShowDemoIframe] = useState(false);
  const [detailModalGame, setDetailModalGame] = useState<GameData | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const mainContainer = document.getElementById('main-scroll-container');
    if (!mainContainer) return;

    const handleScroll = () => {
      if (mainContainer.scrollTop > 1200) {
        setShowTeaser(false);
      }
    };

    mainContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainContainer.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoSlide(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const promoCards = [
    {
      title: t("promo_1_title"),
      subtitle: t("promo_1_sub"),
      textColor: "group-hover:text-yellow-400"
    },
    {
      title: t("promo_2_title"),
      subtitle: t("promo_2_sub"),
      textColor: "group-hover:text-purple-400"
    },
    {
      title: t("promo_3_title"),
      subtitle: t("promo_3_sub"),
      textColor: "group-hover:text-[#10B981]"
    }
  ];

  return (
    <div className="w-full h-full flex flex-col min-h-screen">
      
      {siteUser ? (
        // MEMBER VIEW: Promo Cards + VIP Dashboard
        <>
          {/* World Cup Teaser for Members */}
          {showTeaser && (
            <div className="w-full px-4 pt-0 -mt-4 pb-4">
              <WorldCupTeaser />
            </div>
          )}

          {/* 3 Top Promo Cards (Desktop Only) */}
          <div className="w-full px-4 pb-2 hidden md:block">
            <div className="grid grid-cols-3 gap-4">
              {promoCards.map((card, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-xl bg-[#0B0E14] border border-white/5 hover:border-[#10B981]/30 h-[130px] flex p-6 items-center shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,255,163,0.15)] group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                  {/* Premium Background */}
                  <div className="absolute inset-0 z-0 bg-[#111620] group-hover:bg-[#151b28] transition-colors duration-500">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.05),transparent_70%)] group-hover:bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.1),transparent_70%)] transition-colors duration-500"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
                  
                  <div className="flex flex-row items-center w-full relative z-10">
                    <div className="flex flex-col">
                      <span className="text-white font-black text-lg lg:text-xl tracking-tight leading-tight mb-1">{card.title}</span>
                      <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-wider transition-colors duration-500 text-zinc-400 ${card.textColor}`}>{card.subtitle}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Promo for Logged In Users */}
          <div className="w-full px-4">
            <LimitedTimePromo />
          </div>

          <div className="w-full px-4 pt-2 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Premium VIP Progress Card */}
          <div 
            onClick={() => onViewChange('originals')}
            className="relative rounded-xl border border-white/10 p-5 lg:p-6 flex flex-col justify-between h-auto min-h-[200px] lg:h-full shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(234,179,8,0.15)] hover:border-yellow-500/30 overflow-hidden group cursor-pointer bg-[#0A0D11] transition-all duration-500"
          >
            {/* Background Image / Gradients */}
            <div className="absolute inset-0 z-0">
              <img src="/images/vip_bg.jpg" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000" alt="" />
              <div className="absolute inset-0 bg-[#0A0D11]/50"></div>
            </div>
            
            {/* Crown watermark */}
            <div className="absolute -right-6 -top-6 opacity-[0.03] transform group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-700 z-0">
              <Crown className="w-48 h-48 text-white" />
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-0 pointer-events-none"></div>

            {/* Header Area */}
            <div className="relative z-10 flex justify-between items-start mb-6 lg:mb-0">
              <div className="flex flex-col gap-1">
                <h3 className="text-white font-black text-lg sm:text-xl tracking-wide drop-shadow-md flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  VIP KULÜBÜ
                </h3>
                <span className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Mevcut Seviye: Yok</span>
              </div>
              {/* Avatar / Username */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 rounded-full py-1.5 px-3 border border-white/5 backdrop-blur-sm group-hover:bg-black/60 transition-colors">
                <span className="text-gray-400 text-[10px] sm:text-xs font-medium mr-0.5">ÜYE:</span>
                <span className="text-white font-bold text-xs sm:text-sm">{siteUser.username}</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#10B981] ml-0.5" />
              </div>
            </div>

            {/* Progress Area */}
            <div className="relative z-10 flex flex-col gap-2.5 sm:gap-3 mt-4 lg:mt-auto">
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">İlerleme</span>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-black text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(0,255,163,0.3)]">%0.06</span>
                    <Info className="w-3.5 h-3.5 text-gray-500 hover:text-white transition-colors" />
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-[#CD7F32]" />
                  <span className="text-[#CD7F32] text-[10px] sm:text-xs font-bold uppercase tracking-wider">Hedef: Bronz</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 sm:h-2.5 bg-black/60 rounded-full overflow-hidden shadow-inner border border-white/5 relative">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#10B981]/50 to-[#10B981] rounded-full shadow-[0_0_15px_rgba(0,255,163,0.6)]" style={{ width: '0.06%' }}>
                  {/* Inner shine */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-full"></div>
                </div>
              </div>
              <p className="text-gray-500 text-[9px] sm:text-[10px] font-medium text-right mt-0.5">Bronz seviyesine ulaşmak için bahis yapmaya devam edin.</p>
            </div>
          </div>

          {/* Middle & Right Columns: Separated Casino & Sports Cards */}
          <div className="lg:col-span-2 w-full h-[240px] md:h-[220px] lg:h-full flex flex-col gap-3 md:gap-4">
            
            {/* Top Half: Casino */}
            <div onClick={() => onViewChange('blackjack')} className="relative flex-1 w-full rounded-[6px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0B0E14] cursor-pointer transition-all duration-300 hover:z-10 hover:shadow-[inset_0_0_0_1px_#10B981,0_0_20px_rgba(16,185,129,0.15)] group/casino">
                <img src="/images/casino_neon_banner.jpg" alt="Casino" className="absolute inset-0 w-full h-full object-cover object-[center] transform group-hover/casino:scale-[1.05] transition-all duration-700 ease-out opacity-80 group-hover/casino:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/80 to-transparent"></div>
                <div className="relative z-20 flex flex-col justify-start items-start pt-4 sm:pt-5 h-full px-5 lg:px-6">
                    <h3 className="text-[28px] sm:text-[32px] lg:text-[38px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-1 transform group-hover/casino:translate-x-1 transition-transform">Casino</h3>
                    <div className="block"><ActivePlayersCounter type="casino" /></div>
                </div>
            </div>

            {/* Bottom Half: Sports */}
            <div onClick={() => onViewChange('sports')} className="relative flex-1 w-full rounded-[6px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0B0E14] cursor-pointer transition-all duration-300 hover:z-10 hover:shadow-[inset_0_0_0_1px_#10B981,0_0_20px_rgba(16,185,129,0.15)] group/sports">
                <img src="/images/green_sports_card_left.jpg" alt="Sports Betting" className="absolute inset-0 w-full h-full object-cover object-[center] transform group-hover/sports:scale-[1.05] transition-all duration-700 ease-out opacity-80 group-hover/sports:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-l from-[#0B0E14] via-[#0B0E14]/80 to-transparent"></div>
                <div className="relative z-20 flex flex-col justify-end items-end pb-2 sm:pb-5 h-full pr-2 sm:pr-5 pl-5">
                    <h3 className="text-[28px] sm:text-[32px] lg:text-[38px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-1 transform group-hover/sports:-translate-x-1 transition-transform">Spor</h3>
                    <div className="block"><ActivePlayersCounter type="sports" /></div>
                </div>
            </div>

          </div>
          </div>

          {/* Yeni Eklenenler Slider (Member View) */}
          <NewGamesSlider2 onPlayGame={() => onViewChange('casino')} />

        </>
      ) : (
        // GUEST VIEW: Welcome, Search + Side-by-Side Hero Banner & Cards
        <>

            {/* Layout Column */}
            <div className="w-full flex flex-col gap-4 lg:gap-8 pb-4 md:pb-8 mb-2">
              <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-stretch py-4">
                
                {/* Left Side: Welcome & Auth */}
                <div className="w-full lg:w-[45%] flex flex-col justify-center px-4 lg:px-6 relative">
                  
                  {/* Background Glow */}
                  <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#10B981]/20 blur-[100px] rounded-full pointer-events-none"></div>

                  <div className="relative z-10">
                    {/* Premium Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5 md:mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                      <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse"></div>
                      <span className="text-zinc-300 text-[10px] md:text-xs font-bold tracking-widest uppercase">Premium Bahis Deneyimi</span>
                    </div>

                    <h1 className="text-[32px] sm:text-[42px] lg:text-[48px] font-black text-white tracking-tighter leading-[1.05] mb-4 drop-shadow-2xl font-['Outfit']">
                      <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60">{t('hero_title_1')}</span> <br className="hidden sm:block" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#10B981] to-[#047857]">{t('hero_title_2')}</span>
                    </h1>
                    <p className="text-zinc-400 text-base sm:text-lg font-medium mb-8 max-w-[420px] leading-relaxed">
                      {t('hero_subtitle')} Yüksek oranlar ve anında ödemelerle kazanmaya hemen başla.
                    </p>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <button 
                      onClick={onMemberRegisterClick}
                      className="bg-[#1475E1] hover:bg-[#0f60c0] text-white font-medium text-[16px] py-3.5 px-6 rounded-[8px] flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(20,117,225,0.3)]"
                    >
                      Kaydol <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    {/* Social Dropdown */}
                    <div className="relative group/social">
                      <button className="flex items-center gap-3 bg-[#212C3A] hover:bg-[#2C3B4E] px-4 py-3.5 rounded-[8px] border border-white/5 transition-colors h-[52px]">
                        <div className="flex items-center -space-x-2">
                          <div className="w-7 h-7 rounded-full bg-white border-2 border-[#212C3A] flex items-center justify-center relative z-40 overflow-hidden shadow-sm">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" alt="Steam" className="w-4 h-4 object-contain" />
                          </div>
                          <div className="w-7 h-7 rounded-full bg-white border-2 border-[#212C3A] flex items-center justify-center relative z-30 overflow-hidden shadow-sm">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="Metamask" className="w-4 h-4 object-contain" />
                          </div>
                          <div className="w-7 h-7 rounded-full bg-white border-2 border-[#212C3A] flex items-center justify-center relative z-20 overflow-hidden shadow-sm">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-4 h-4 object-contain" />
                          </div>
                          <div className="w-7 h-7 rounded-full bg-[#34A853] border-2 border-[#212C3A] flex items-center justify-center relative z-10 overflow-hidden shadow-sm">
                             <span className="text-white text-[10px] font-bold">B</span>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      {/* Dropdown menu */}
                      <div className="absolute top-full left-0 mt-2 w-48 bg-[#212C3A] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover/social:opacity-100 group-hover/social:visible transition-all z-50 py-2">
                        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer" onClick={onMemberRegisterClick}>
                          <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" className="w-4 h-4" />
                          </div>
                          <span className="text-white text-[15px] font-medium">Steam</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer" onClick={onMemberRegisterClick}>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" className="w-6 h-6" />
                          <span className="text-white text-[15px] font-medium">Metamask</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer" onClick={onMemberRegisterClick}>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" className="w-6 h-6" />
                          <span className="text-white text-[15px] font-medium">Google</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer" onClick={onMemberRegisterClick}>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" className="w-6 h-6" />
                          <span className="text-white text-[15px] font-medium">Telegram</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer" onClick={onMemberRegisterClick}>
                          <div className="w-6 h-6 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          </div>
                          <span className="text-white text-[15px] font-medium">X</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer" onClick={onMemberRegisterClick}>
                          <img src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png" className="w-6 h-6 object-contain" />
                          <span className="text-white text-[15px] font-medium">Solana</span>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Side: Separated Casino & Sports Cards */}
                <div className="w-full lg:w-[55%] flex-1 flex flex-col min-h-[220px] md:min-h-[300px] lg:min-h-[320px] gap-3 md:gap-4">
                  
                  {/* Top Half: Casino */}
                  <div onClick={() => onViewChange('blackjack')} className="relative flex-1 w-full rounded-[6px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0B0E14] cursor-pointer transition-all duration-300 hover:z-10 hover:shadow-[inset_0_0_0_1px_#10B981,0_0_20px_rgba(16,185,129,0.15)] group/casino">
                      <img src="/images/casino_neon_banner.jpg" alt="Casino" className="absolute inset-0 w-full h-full object-cover object-[center] transform group-hover/casino:scale-[1.05] transition-all duration-700 ease-out opacity-80 group-hover/casino:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/80 to-transparent"></div>
                      <div className="relative z-20 flex flex-col justify-start items-start pt-4 sm:pt-5 h-full px-5 lg:px-6">
                          <h3 className="text-[28px] sm:text-[36px] lg:text-[42px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-1 transform group-hover/casino:translate-x-1 transition-transform">Casino</h3>
                          <div className="block"><ActivePlayersCounter type="casino" /></div>
                      </div>
                  </div>

                  {/* Bottom Half: Sports */}
                  <div onClick={() => onViewChange('sports')} className="relative flex-1 w-full rounded-[6px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0B0E14] cursor-pointer transition-all duration-300 hover:z-10 hover:shadow-[inset_0_0_0_1px_#10B981,0_0_20px_rgba(16,185,129,0.15)] group/sports">
                      <img src="/images/green_sports_card_left.jpg" alt="Sports Betting" className="absolute inset-0 w-full h-full object-cover object-[center] transform group-hover/sports:scale-[1.05] transition-all duration-700 ease-out opacity-80 group-hover/sports:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-l from-[#0B0E14] via-[#0B0E14]/80 to-transparent"></div>
                      <div className="relative z-20 flex flex-col justify-end items-end pb-2 sm:pb-5 h-full pr-2 sm:pr-5 pl-5">
                          <h3 className="text-[28px] sm:text-[36px] lg:text-[42px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-1 transform group-hover/sports:-translate-x-1 transition-transform">Spor</h3>
                          <div className="block"><ActivePlayersCounter type="sports" /></div>
                      </div>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Yeni Eklenenler Slider (Guest View) */}
            <NewGamesSlider2 onPlayGame={(game) => setDetailModalGame({
              id: game.id,
              name: game.name,
              provider: game.provider,
              img: game.img,
              demoUrl: getDemoUrl(game),
              fullDesc: `${game.name}, ${game.provider} tarafından sunulan popüler ve kazançlı bir slottur. Yüksek RTP ve devasa çarpan potansiyeliyle hemen oynamaya başlayın.`
            })} />

        </>
      )}



      {/* Live Wins Ticker */}
      <div className="w-full mb-4 mt-2">
        <LiveWinsTicker />
      </div>

      <div className="w-full">
        <GameLobbyGrid customGames={[]} />
      </div>

      {/* Originals Slider */}
      <div className="w-full">
        <OriginalsSlider onNavigate={onViewChange} />
      </div>

      <GameDetailModal 
        game={detailModalGame} 
        isOpen={!!detailModalGame} 
        onClose={() => setDetailModalGame(null)} 
        onPlay={() => {
          setDetailModalGame(null);
          onMemberRegisterClick();
        }} 
      />

      {/* Live Games Slider */}
      <div className="w-full">
        <LiveGamesSlider />
      </div>

      {/* Live Bets and Leaderboards */}
      <div className="w-full pb-8">
        <RacesAndGiveaways />
        <LiveBetsTable />
      </div>

      {/* Demo Iframe Modal */}
      {selectedGame && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedGame(null);
              setShowDemoIframe(false);
            }
          }}
        >
          {showDemoIframe && getDemoUrl(selectedGame) ? (
            <div className="relative w-full max-w-[1600px] w-[95vw] h-[90vh] bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col border border-white/5 m-auto">
               <div className="h-12 md:h-14 bg-[#0B0E14] flex items-center justify-between px-4 md:px-6 border-b border-white/5 flex-shrink-0">
                  <div className="flex items-center gap-3">
                     <span className="text-white font-bold text-sm md:text-base tracking-wide uppercase">{selectedGame.name} <span className="text-[#10B981] font-black text-[10px] md:text-xs ml-2 border border-[#10B981]/30 bg-[#10B981]/10 px-2 py-0.5 rounded-full">DEMO</span></span>
                  </div>
                  <button onClick={() => { setShowDemoIframe(false); setSelectedGame(null); }} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               <div className="flex-1 w-full relative bg-[#05070A]">
                  <iframe 
                    src={getDemoUrl(selectedGame) || ''}
                    className="absolute inset-0 w-full h-full border-none"
                    allowFullScreen
                    allow="autoplay; fullscreen"
                  ></iframe>
               </div>
            </div>
          ) : null}
        </div>,
        document.body
      )}

      {/* Spacer to allow scrolling past bottom bar on mobile */}
      <div className="h-[80px] md:h-0 w-full flex-shrink-0" />
    </div>
  );
};

export default GuestLanding;
