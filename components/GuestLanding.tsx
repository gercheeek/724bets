import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Trophy, Shield, Target, ChevronRight, Info, Crown, Star, Play, X, ArrowRight, ChevronDown, Gift } from 'lucide-react';
import { createPortal } from 'react-dom';
import LiveGamesSlider from './LiveGamesSlider';
import LiveBetsTable from './LiveBetsTable';
import RacesAndGiveaways from './RacesAndGiveaways';
import GamePromos from './GamePromos';

import { CasinoLobbyGame, SiteUser } from '../types';
import GameLobbyGrid from './GameLobbyGrid';
import OriginalsSlider from './OriginalsSlider';
import SportsBanners from './SportsBanners';

import LimitedTimePromo from './LimitedTimePromo';
import { useLanguage } from '../contexts/LanguageContext';
import { GameDetailModal, GameData } from './GameDetailModal';
import { GamePlayView } from './GamePlayView';
import AnimatedCyberBackground from './AnimatedCyberBackground';
import LiveWinsTicker from './LiveWinsTicker';
import DynamicNewGames from './DynamicNewGames';
import DynamicPopularGames from './DynamicPopularGames';
import DynamicSlotsGames from './DynamicSlotsGames';
import EmptySectionX from './EmptySectionX';
import { PopularLiveWidget } from './PopularLiveWidget';
import HeroWelcomeBanner from './HeroWelcomeBanner';
import LiveWinsMarquee from './LiveWinsMarquee';

import FeaturedCombos from './sports/FeaturedCombos';
import SportsPromoSlider from './sports/SportsPromoSlider';
import { UpcomingTournamentsWidget } from './UpcomingTournamentsWidget';
import { TopMatchesWidget } from './sports/TopMatchesWidget';
import { useBetting } from '../contexts/BettingContext';

const getDemoUrl = (game: any): string | null => {
  if (!game) return null;
  if (game.demoSymbol) {
    return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${game.demoSymbol}&jurisdiction=99&lobbyUrl=https://724bets.net`;
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
      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80] animate-pulse"></span>
      <span className="text-gray-300 text-xs sm:text-sm font-bold tracking-widest uppercase whitespace-nowrap">
        {formatted} CANLI
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

const heroSlides = [
    {
        image: "/images/haluk_slider_final.webp",
        characterImg: "/images/haluk_fixed.webp",
        badge: "Trustpilot",
        title: <>#1 KRİPTO CASİNO<br/>& SPOR BAHİSLERİ</>,
        subtitle: "2500$'a kadar Hoş Geldin Paketi",
        buttonText: "Şimdi etkinleştir"
    },
    {
        image: "/images/haluk_slider_final.webp",
        characterImg: "/images/haluk_fixed.webp",
        badge: "iPhone 17 Pro Max Çekilişi",
        title: <>DEV ÇEKİLİŞ<br/>BAŞLADI!</>,
        subtitle: "724bets güvencesiyle büyük ödül seni bekliyor.",
        buttonText: "Çekilişe Katıl"
    },
    {
        image: "/images/haluk_slider_final.webp",
        characterImg: "/images/haluk_fixed.webp",
        badge: "VIP Kulübü",
        title: <>ÖZEL<br/>AYRICALIKLAR</>,
        subtitle: "Size özel bonuslar ve daha fazlası.",
        buttonText: "VIP Ol"
    }
];

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
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const { t } = useLanguage();
  const { events, global1xBetPreMatches, globalLiveMatches } = useBetting();
  
  // Widgetlara göndereceğimiz veriyi zenginleştirelim. Eğer "events" sadece canlı maçları içeriyorsa,
  // Yaklaşan maçlar widget'ları kaybolur. O yüzden pre-match verilerini ekliyoruz.
  const allMatches = [...(events || []), ...(global1xBetPreMatches || []), ...(globalLiveMatches || [])];
  // Tekrarlayanları (ID'ye göre) filtrele
  const matchesMap = new Map();
  allMatches.forEach(m => { if (m.id) matchesMap.set(m.id, m); });
  const matches = Array.from(matchesMap.values());
  
  const setSelectedMatch = (m: any) => {};
    useEffect(() => {
        const timer = setInterval(() => {
            setHeroImageIndex((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

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

  // Handle global close games event
  useEffect(() => {
    const handleCloseGames = () => {
      setShowDemoIframe(false);
      setSelectedGame(null);
    };
    window.addEventListener('closeAllGames', handleCloseGames);
    return () => window.removeEventListener('closeAllGames', handleCloseGames);
  }, []);

  const promoCards = [
    {
      title: t("promo_1_title"),
      subtitle: t("promo_1_sub"),
      textColor: "group-hover:text-zinc-300"
    },
    {
      title: t("promo_2_title"),
      subtitle: t("promo_2_sub"),
      textColor: "group-hover:text-purple-400"
    },
    {
      title: t("promo_3_title"),
      subtitle: t("promo_3_sub"),
      textColor: "group-hover:text-[color:var(--theme-accent)]"
    }
  ];

  if (selectedGame && showDemoIframe) {
    return (
      <GamePlayView 
        game={selectedGame}
        demoUrl={getDemoUrl(selectedGame) || ''}
        onClose={() => { setShowDemoIframe(false); setSelectedGame(null); }}
        onViewChange={onViewChange}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col min-h-screen pb-[70px] lg:pb-0">
      
      {siteUser ? (
        // MEMBER VIEW: Promo Cards + VIP Dashboard
        <>




          {/* Special Promo for Logged In Users */}
          <div className="w-full px-4">
            <LimitedTimePromo />
          </div>

          <div className="w-full px-4 pt-2 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Premium VIP Progress Card */}
          <div 
            onClick={() => onViewChange('originals')}
            className="relative rounded-xl border border-white/5 p-5 lg:p-6 flex flex-col justify-between h-auto min-h-[200px] lg:h-full shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(234,179,8,0.15)] hover:border-yellow-500/30 overflow-hidden group cursor-pointer bg-[#0A0C10] transition-all duration-500"
          >
            {/* Background Image / Gradients */}
            <div className="absolute inset-0 z-0">
              <img src="/images/vip_bg.jpg" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000" alt="" />
              <div className="absolute inset-0 bg-[#0A0C10]/50"></div>
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
                  <Star className="w-4 h-4 text-zinc-300 fill-yellow-500" />
                  VIP KULÜBÜ
                </h3>
                <span className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Mevcut Seviye: Yok</span>
              </div>
              {/* Avatar / Username */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 rounded-full py-1.5 px-3 border border-white/5 backdrop-blur-sm group-hover:bg-black/60 transition-colors">
                <span className="text-gray-400 text-[10px] sm:text-xs font-medium mr-0.5">ÜYE:</span>
                <span className="text-white font-bold text-xs sm:text-sm">{siteUser.username}</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-[color:var(--theme-accent)] ml-0.5" />
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
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[color:var(--theme-accent)]/50 to-[color:var(--theme-accent)] rounded-full shadow-[0_0_15px_rgba(0,255,163,0.6)]" style={{ width: '0.06%' }}>
                  {/* Inner shine */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-full"></div>
                </div>
              </div>
              <p className="text-gray-500 text-[9px] sm:text-[10px] font-medium text-right mt-0.5">Bronz seviyesine ulaşmak için bahis yapmaya devam edin.</p>
            </div>
          </div>

          {/* Middle & Right Columns: Separated Casino & Sports Cards */}
          <div className="lg:col-span-2 w-full grid grid-cols-2 lg:flex lg:flex-col gap-3 md:gap-4">
            
            {/* Top Third: Originals */}
            <div onClick={() => onViewChange('originals')} className="col-span-2 lg:col-span-1 relative flex-1 w-full h-[90px] md:min-h-[120px] rounded-xl border border-white/5 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#0A0C10] cursor-pointer transition-all duration-300 hover:z-10 hover:shadow-[inset_0_0_0_1px_#06b6d4,0_0_20px_rgba(16,185,129,0.3)] group/orig">
                <div className="absolute inset-0 z-0 flex justify-end">
                  <div className="w-[100%] sm:w-[80%] h-full relative">
                    <img src="/images/ai-generated/originals_card.webp" alt="Originals" className="w-full h-full object-cover object-[center] transform group-hover/orig:scale-[1.05] transition-all duration-700 ease-out opacity-60 group-hover/orig:opacity-100" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent w-full"></div>
                </div>
                <div className="relative z-20 flex flex-col justify-center lg:justify-start items-start pt-0 lg:pt-5 h-full px-4 lg:px-6">
                    <h3 className="text-[22px] sm:text-[28px] lg:text-[38px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-1 transform group-hover/orig:translate-x-1 transition-transform flex flex-wrap items-center gap-1 sm:gap-2">
                        <span className="text-[color:var(--theme-accent)] lowercase">724games</span> Orijinal
                        <span className="bg-[#10b981] text-black text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse shrink-0 tracking-normal uppercase ml-1 mr-auto">
                            %99.2 RTP
                        </span>
                    </h3>
                    <div className="block"><ActivePlayersCounter type="casino" /></div>
                </div>
            </div>

            {/* Middle Third: Casino */}
            <div onClick={() => onViewChange('blackjack')} className="col-span-1 relative flex-1 w-full h-[85px] md:min-h-[120px] rounded-2xl border border-white/5 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.6)] bg-gradient-to-br from-[#111115] to-[#050505] cursor-pointer transition-all duration-500 hover:z-10 hover:border-[color:var(--theme-accent)]/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group/casino">
                {/* Premium Background Image */}
                <div className="absolute inset-0 z-0 flex justify-end">
                  <div className="w-[100%] sm:w-[80%] h-full relative">
                    <img src="/images/premium_casino_dark.jpg" alt="Casino" className="w-full h-full object-cover object-[center] transform group-hover/casino:scale-[1.05] transition-all duration-700 ease-out opacity-60 group-hover/casino:opacity-100" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#111115] via-[#111115]/80 to-transparent w-full"></div>
                </div>

                {/* Subtle Glow Background */}
                {/* Ambient glow removed to prevent smudge effect */}
                
                {/* Top Highlight Line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"></div>

                <div className="relative z-20 flex flex-col justify-center lg:justify-start items-start pt-0 lg:pt-5 h-full px-4 lg:px-8">
                    <h3 className="text-[24px] md:text-[32px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-[0.1em] uppercase pb-0.5 lg:pb-1 transform group-hover/casino:translate-x-2 transition-transform duration-500 drop-shadow-md">CASINO</h3>
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 inline-flex items-center shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                      <ActivePlayersCounter type="casino" />
                    </div>
                </div>
            </div>

            {/* Bottom Third: Sports */}
              <div onClick={() => { window.dispatchEvent(new CustomEvent('reset-sports-view')); onViewChange('spor724'); }} className="col-span-1 relative flex-1 w-full h-[85px] md:min-h-[120px] rounded-2xl border border-white/5 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.6)] bg-gradient-to-br from-[#111115] to-[#050505] cursor-pointer transition-all duration-500 hover:z-10 hover:border-[#f59e0b]/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] group/sports">
                  {/* Premium Background Image */}
                  <div className="absolute inset-0 z-0 flex justify-end">
                  <div className="w-[100%] sm:w-[80%] h-full relative">
                    <img src="/images/premium_sports_dark.jpg" alt="Sports" className="w-full h-full object-cover object-[center] transform group-hover/sports:scale-[1.05] transition-all duration-700 ease-out opacity-60 group-hover/sports:opacity-100" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#111115] via-[#111115]/80 to-transparent w-full"></div>
                </div>

                {/* Subtle Glow Background */}
                {/* Ambient glow removed to prevent smudge effect */}
                
                {/* Top Highlight Line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"></div>

                <div className="relative z-20 flex flex-col justify-center lg:justify-start items-start pt-0 lg:pt-5 h-full px-4 lg:px-8">
                    <h3 className="text-[24px] md:text-[32px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-[0.1em] uppercase pb-0.5 lg:pb-1 transform group-hover/sports:translate-x-2 transition-transform duration-500 drop-shadow-md">SPOR</h3>
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 inline-flex items-center shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                      <ActivePlayersCounter type="sports" />
                    </div>
                </div>
            </div>

          </div>
          </div>



          {/* Yeni Eklenenler Slider (Member View) Removed */}
          <div className="w-full mt-6 mb-4 flex flex-col gap-10">
            <LiveWinsTicker />
            <DynamicPopularGames onGameSelect={(game) => {
              setSelectedGame({
                ...game,
                img: game.image || game.img,
                category: game.category || 'slots',
                players: game.players,
                demoSymbol: game.demoSymbol
              } as any);
              setShowDemoIframe(true);
            }} onViewChange={onViewChange} />
            
            <OriginalsSlider onNavigate={onViewChange} />
            
            <DynamicNewGames onGameSelect={(game) => {
              // Same handling as other games in GuestLanding
              setSelectedGame({
                ...game,
                img: game.image || game.img,
                category: game.category || 'slots',
                players: game.players,
                demoSymbol: game.demoSymbol
              } as any);
              setShowDemoIframe(true);
            }} />
            

            <div className="w-full px-4 lg:px-6">
              <SportsPromoSlider 
                matches={matches} 
                compact={false} 
                onSelectMatch={(m) => {
                  setSelectedMatch(m);
                  onViewChange('sports');
                }} 
              />
            </div>
            
            <div className="px-4 lg:px-6">
            </div>
          </div>
        </>
      ) : (
        // GUEST VIEW (NEW DESIGN - Matches reference)
        <div className="w-full max-w-[1400px] mx-auto px-2 md:px-4 xl:px-4 pt-5 pb-6 flex flex-col gap-2">
            <HeroWelcomeBanner onRegisterClick={onMemberRegisterClick} />
            
            {/* Quick Access Banners for Guest View */}
            <div className="w-full flex flex-row gap-2 md:gap-4 mt-2 mb-2">
              {/* Casino Banner */}
              <div onClick={() => onViewChange('blackjack')} className="relative flex-1 w-full h-[80px] sm:h-[90px] md:h-[120px] rounded-xl md:rounded-2xl border border-white/5 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.6)] bg-gradient-to-br from-[#111115] to-[#050505] cursor-pointer transition-all duration-500 hover:z-10 hover:border-[color:var(--theme-accent)]/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group/casino">
                  {/* Premium Background Image */}
                  <div className="absolute inset-0 z-0 flex justify-end">
                    <div className="w-[100%] sm:w-[80%] h-full relative">
                      <img src="/images/premium_casino_dark.jpg" alt="Casino" className="w-full h-full object-cover object-[center] transform group-hover/casino:scale-[1.05] transition-all duration-700 ease-out opacity-60 group-hover/casino:opacity-100" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#111115] via-[#111115]/80 to-transparent w-full"></div>
                  </div>

                  {/* Subtle Glow Background */}
                  {/* Ambient glow removed to prevent smudge effect */}
                  
                  {/* Top Highlight Line */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"></div>

                  <div className="relative z-20 flex flex-col justify-center items-start h-full px-3 sm:px-4 lg:px-10">
                      <h3 className="text-[20px] sm:text-[24px] md:text-[36px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-[0.05em] md:tracking-[0.1em] uppercase mb-0.5 md:mb-1.5 transform group-hover/casino:translate-x-2 transition-transform duration-500 drop-shadow-md leading-none">CASINO</h3>
                      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 inline-flex items-center shadow-[0_0_10px_rgba(255,255,255,0.05)] scale-90 sm:scale-100 origin-left">
                        <ActivePlayersCounter type="casino" />
                      </div>
                  </div>
              </div>

              {/* Sports Banner */}
              <div onClick={() => { window.dispatchEvent(new CustomEvent('reset-sports-view')); onViewChange('spor724'); }} className="relative flex-1 w-full h-[80px] sm:h-[90px] md:h-[120px] rounded-xl md:rounded-2xl border border-white/5 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.6)] bg-gradient-to-br from-[#111115] to-[#050505] cursor-pointer transition-all duration-500 hover:z-10 hover:border-[#f59e0b]/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] group/sports">
                  {/* Premium Background Image */}
                  <div className="absolute inset-0 z-0 flex justify-end">
                    <div className="w-[100%] sm:w-[80%] h-full relative">
                      <img src="/images/premium_sports_dark.jpg" alt="Sports" className="w-full h-full object-cover object-[center] transform group-hover/sports:scale-[1.05] transition-all duration-700 ease-out opacity-60 group-hover/sports:opacity-100" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#111115] via-[#111115]/80 to-transparent w-full"></div>
                  </div>

                  {/* Subtle Glow Background */}
                  {/* Ambient glow removed to prevent smudge effect */}
                  
                  {/* Top Highlight Line */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"></div>

                  <div className="relative z-20 flex flex-col justify-center items-start h-full px-3 sm:px-4 lg:px-10">
                      <h3 className="text-[20px] sm:text-[24px] md:text-[36px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-[0.05em] md:tracking-[0.1em] uppercase mb-0.5 md:mb-1.5 transform group-hover/sports:translate-x-2 transition-transform duration-500 drop-shadow-md leading-none">SPOR</h3>
                      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 inline-flex items-center shadow-[0_0_10px_rgba(255,255,255,0.05)] scale-90 sm:scale-100 origin-left">
                        <ActivePlayersCounter type="sports" />
                      </div>
                  </div>
              </div>
            </div>
            
            {/* Live Wins moved under Casino/Sports Banners */}
            <div className="mt-8 mb-4 rounded-2xl overflow-hidden border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <LiveWinsMarquee />
            </div>
            
            <div className="w-full mt-4 mb-6 sm:mt-6 sm:mb-8 flex flex-col gap-10">
              <LiveWinsTicker />
              <OriginalsSlider onNavigate={onViewChange} />

              
              <DynamicPopularGames onGameSelect={(game) => {
                setSelectedGame({
                  ...game,
                  img: game.image || game.img,
                  category: game.category || 'slots',
                  players: game.players,
                  demoSymbol: game.demoSymbol
                } as any);
                setShowDemoIframe(true);
              }} onViewChange={onViewChange} />
              
              <DynamicSlotsGames onGameSelect={(game) => {
                setSelectedGame({
                  ...game,
                  img: game.image || game.img,
                  category: game.category || 'slots',
                  players: game.players,
                  demoSymbol: game.demoSymbol
                } as any);
                setShowDemoIframe(true);
              }} onViewChange={onViewChange} />
              
              <DynamicNewGames onGameSelect={(game) => {
                setSelectedGame({
                  ...game,
                  img: game.image || game.img,
                  category: game.category || 'slots',
                  players: game.players,
                  demoSymbol: game.demoSymbol
                } as any);
                setShowDemoIframe(true);
              }} />
              

              <div className="w-full">
                <SportsPromoSlider 
                  matches={matches} 
                  compact={false} 
                  onSelectMatch={(m) => {
                    setSelectedMatch(m);
                    onViewChange('sports');
                  }} 
                />
              </div>
              
              <div className="w-full">
                <TopMatchesWidget 
                  title="Yaklaşan En İyi Maçlar"
                  matches={matches}
                  onSelectMatch={(m) => {
                    setSelectedMatch(m);
                    onViewChange('sports');
                  }}
                />
              </div>
              

              
              <div className="w-full">
                <LiveBetsTable />
              </div>
            </div>


            {/* Sliders removed as requested */}
            {/* Live Bets and Leaderboards */}
            {/* Feature / Promo Cards (Removed) */}

        </div>
      )}

      <GameDetailModal 
        game={detailModalGame} 
        isOpen={!!detailModalGame} 
        onClose={() => setDetailModalGame(null)} 
        onPlay={() => {
          setDetailModalGame(null);
          onMemberRegisterClick();
        }} 
      />


      {/* Spacer to allow scrolling past bottom bar on mobile */}
      <div className="h-[60px] md:h-0 w-full flex-shrink-0" />
    </div>
  );
};

export default GuestLanding;
