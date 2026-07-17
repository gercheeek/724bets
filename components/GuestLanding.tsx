import React, { useState, useEffect } from 'react';
import { Search, Trophy, Shield, Target, ChevronRight, Info, Crown, Star, Play, X } from 'lucide-react';
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

const NEW_ADDED_GAMES = [
  { id: 115, name: '12 Coins', provider: 'Wazdan', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/12-Coins-Grand-Gold-Edition-Santas-Jackpots-Wazdan/Vertical/12CoinsGrandGoldEditionSantasJackpots.webp', category: 'new', rtp: '96.15%', players: 204 },
  { id: 1160, name: 'Out of the Woods', provider: 'Pragmatic Play', img: '/images/slots/outofthewoods.jpg', category: 'new', rtp: '96.50%', demoSymbol: 'vs25bstackwild', players: 278 },
  { id: 1161, name: 'Legion Gold And The Throne Of Dead', provider: 'Play\'n GO', img: '/images/slots/legiongold.jpg', category: 'new', rtp: '96.20%', customDemoUrl: 'https://acccw.playngonetwork.com/casino/ContainerLauncher?pid=1857&brand=b2b_anj&gid=throneofdead&practice=1&lang=en_GB&div=gameWrapper&embedmode=iframe&channel=mobile&origin=https%3A%2F%2Fslotra.com', players: 335 },
  { id: 1162, name: 'Big Bass Blast', provider: 'Pragmatic Play', img: '/images/slots/bigbass.jpg', category: 'new', rtp: '96.71%', demoSymbol: 'vs10bbasblitz', players: 190 },
  { id: 1163, name: 'The Dog House Megaways 1000', provider: 'Pragmatic Play', img: '/images/slots/doghouse.jpg', category: 'new', rtp: '96.55%', demoSymbol: 'vswaysdh1000', players: 371 },
  { id: 1164, name: 'Arena of Iron', provider: 'Hacksaw Gaming', img: '/images/slots/arena.jpg', category: 'new', rtp: '96.30%', customDemoUrl: 'https://d2sx83al1f82za.cloudfront.net/2309/1.4.4/index.html?language=en&channel=mobile&gameid=2309&mode=2&token=123token&partner=slotra&env=https://d2sx83al1f82za.cloudfront.net/demo/api&realmoneyenv=https://d2sx83al1f82za.cloudfront.net/api&alwaysredirect=true', players: 449 }
];

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

          {/* Middle & Right Columns: Casino & Sports Cards */}
          <div className="lg:col-span-2 w-full h-[240px] md:h-[220px] lg:h-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Casino Card */}
            <div onClick={() => onViewChange('blackjack')} className="relative w-full h-full cursor-pointer group flex flex-col rounded-[6px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0B0E14] hover:border-[#10B981]/30 transition-all duration-300 hover:-translate-y-1">
              <div className="relative w-full h-[65%] overflow-hidden">
                <img src="/images/casino_neon_banner.jpg" alt="Casino" className="absolute inset-0 w-full h-full object-cover object-[center] transform group-hover:scale-[1.05] transition-all duration-700 ease-out opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] to-transparent"></div>
              </div>
              <div className="relative z-20 flex flex-col items-start gap-1 px-5 lg:px-6 pb-5 lg:pb-6 pt-1 bg-[#0B0E14] flex-1 w-full justify-end">
                <h3 className="text-[32px] sm:text-[36px] lg:text-[42px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-0.5">Casino</h3>
                <div className="block"><ActivePlayersCounter type="casino" /></div>
              </div>
            </div>

            {/* Sports Card */}
            <div onClick={() => onViewChange('sports')} className="relative w-full h-full cursor-pointer group flex flex-col rounded-[6px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0B0E14] hover:border-[#10B981]/30 transition-all duration-300 hover:-translate-y-1">
              <div className="relative w-full h-[65%] overflow-hidden">
                <img src="/images/green_sports_card_left.jpg" alt="Sports Betting" className="absolute inset-0 w-full h-full object-cover object-[center] transform group-hover:scale-[1.05] transition-all duration-700 ease-out opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] to-transparent"></div>
              </div>
              <div className="relative z-20 flex flex-col items-start gap-1 px-5 lg:px-6 pb-5 lg:pb-6 pt-1 bg-[#0B0E14] flex-1 w-full justify-end">
                <h3 className="text-[32px] sm:text-[36px] lg:text-[42px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-0.5">Spor</h3>
                <div className="block"><ActivePlayersCounter type="sports" /></div>
              </div>
            </div>
            
          </div>

          {/* Yeni Eklenenler Grid for Members */}
          <div className="w-full mt-8 mb-4">
            <div className="flex items-center gap-2 mb-4 px-2">
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Yeni Eklenenler</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 px-2">
              {NEW_ADDED_GAMES.map(game => (
                <div key={game.id} className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg border border-white/5 bg-[#11141D] transition-transform duration-300 hover:-translate-y-1" onClick={() => onViewChange('casino')}>
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <img src={game.img} alt={game.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-transparent opacity-80"></div>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-30 backdrop-blur-[2px]">
                    <button className="w-12 h-12 bg-[#10B981] hover:bg-[#0da070] rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                      <Play className="w-5 h-5 text-black ml-1" fill="currentColor" />
                    </button>
                    {(game.demoSymbol || game.customDemoUrl) && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedGame(game); setShowDemoIframe(true); }}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-1.5 px-4 rounded-full border border-white/20 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                      >
                        Demo Oyna
                      </button>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-300 drop-shadow-md">{game.players} Oyuncular</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
        </>
      ) : (
        // GUEST VIEW: Welcome, Search + Side-by-Side Hero Banner & Cards
        <>

            {/* Layout Column */}
            <div className="w-full flex flex-col gap-4 lg:gap-8 pb-4 md:pb-8 mb-2">
              <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-stretch py-4">
                
                {/* Left Side: Welcome & Auth */}
                <div className="w-full lg:w-[45%] flex flex-col justify-center px-4 lg:px-6">
                  <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-black text-white tracking-tighter leading-[1.05] mb-6 drop-shadow-lg font-['Outfit']">
                    Dünyanın En Büyük Çevrim içi Casino ve Spor Bahisleri Platformu
                  </h1>
                  
                  <button 
                    onClick={onMemberRegisterClick}
                    className="bg-[#1475E1] hover:bg-[#0f60c0] text-white font-bold text-[15px] py-3.5 px-8 rounded-sm w-fit transition-colors mb-8 shadow-lg shadow-blue-500/20"
                  >
                    Kayıt Ol
                  </button>
                  
                  <div className="flex flex-col gap-3">
                    <span className="text-gray-400 text-[13px] font-semibold">Veya diğer seçeneklerle kaydolun</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button className="flex items-center gap-2 bg-[#212C3A] hover:bg-[#2C3B4E] px-4 py-2.5 rounded-sm text-gray-200 hover:text-white font-bold text-[13px] transition-colors">
                        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Google
                      </button>
                      <button className="flex items-center gap-2 bg-[#212C3A] hover:bg-[#2C3B4E] px-4 py-2.5 rounded-sm text-gray-200 hover:text-white font-bold text-[13px] transition-colors">
                        <svg className="w-[18px] h-[18px]" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        Facebook
                      </button>
                      <button className="flex items-center gap-2 bg-[#212C3A] hover:bg-[#2C3B4E] px-4 py-2.5 rounded-sm text-gray-200 hover:text-white font-bold text-[13px] transition-colors">
                        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14h-3v-2h-2v2H8V8h3.5v3h2V8h2v8z" fill="#58E027"/></svg>
                        Kick
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Right Side: 2 Big Cards */}
                <div className="w-full lg:w-[55%] flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 min-h-[300px] lg:min-h-[320px] px-2 lg:px-0">
                  
                  {/* Casino Card */}
                  <div onClick={() => onViewChange('blackjack')} className="relative w-full h-full cursor-pointer group flex flex-col rounded-[6px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0B0E14] hover:border-[#10B981]/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="relative w-full h-[65%] overflow-hidden">
                      <img src="/images/casino_neon_banner.jpg" alt="Casino" className="absolute inset-0 w-full h-full object-cover object-[center] transform group-hover:scale-[1.05] transition-all duration-700 ease-out opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] to-transparent"></div>
                    </div>
                    <div className="relative z-20 flex flex-col items-start gap-1 px-5 lg:px-6 pb-5 lg:pb-6 pt-1 bg-[#0B0E14] flex-1 w-full justify-end">
                      <h3 className="text-[32px] sm:text-[36px] lg:text-[42px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-0.5">Casino</h3>
                      <div className="block"><ActivePlayersCounter type="casino" /></div>
                    </div>
                  </div>

                  {/* Sports Card */}
                  <div onClick={() => onViewChange('sports')} className="relative w-full h-full cursor-pointer group flex flex-col rounded-[6px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0B0E14] hover:border-[#10B981]/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="relative w-full h-[65%] overflow-hidden">
                      <img src="/images/green_sports_card_left.jpg" alt="Sports Betting" className="absolute inset-0 w-full h-full object-cover object-[center] transform group-hover:scale-[1.05] transition-all duration-700 ease-out opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] to-transparent"></div>
                    </div>
                    <div className="relative z-20 flex flex-col items-start gap-1 px-5 lg:px-6 pb-5 lg:pb-6 pt-1 bg-[#0B0E14] flex-1 w-full justify-end">
                      <h3 className="text-[32px] sm:text-[36px] lg:text-[42px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-0.5">Spor</h3>
                      <div className="block"><ActivePlayersCounter type="sports" /></div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Yeni Eklenenler Grid for Guests */}
            <div className="w-full mt-8 mb-4">
              <div className="flex items-center gap-2 mb-4 px-2">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Yeni Eklenenler</h2>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4 px-2">
                {NEW_ADDED_GAMES.map(game => (
                  <div key={game.id} className="flex flex-col items-center group">
                    <div 
                      onClick={() => setDetailModalGame({
                        id: game.id.toString(),
                        name: game.name,
                        desc: `${game.provider} sağlayıcısından yepyeni bir deneyim.`,
                        color: 'from-emerald-600 to-emerald-900',
                        image: game.img,
                        path: 'slots', 
                        icon: '🎰',
                        players: game.players,
                        fullDesc: `${game.name}, ${game.provider} tarafından sunulan popüler ve kazançlı bir slottur. Yüksek RTP ve devasa çarpan potansiyeliyle hemen oynamaya başlayın.`
                      })}
                      className="w-[140px] h-[190px] md:w-[160px] md:h-[220px] relative rounded-2xl overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_40px_rgba(0,255,163,0.25)] transition-all duration-500 transform group-hover:-translate-y-2 border border-white/5 hover:border-[#10B981]/40"
                    >
                      <img src={game.img} alt={game.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Play Button appears on hover */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 backdrop-blur-[2px] bg-black/40">
                        <button className="w-12 h-12 bg-[#10B981] hover:bg-[#0da070] rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-white/20">
                          <Play className="w-5 h-5 text-black ml-1 fill-current" />
                        </button>
                      </div>
                    </div>
                    {/* External Player Count */}
                    <div className="mt-3 flex items-center gap-1.5 px-2">
                      <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse"></div>
                      <span className="text-zinc-400 text-[11px] font-bold font-sans">
                        <span className="text-white">{game.players}</span> Oyuncular
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
