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
import { NewGamesSlider2 } from './NewGamesSlider2';
import AnimatedCyberBackground from './AnimatedCyberBackground';
import LiveWinsTicker from './LiveWinsTicker';
import VIPHeroBanner from './VIPHeroBanner';
import { PopularLiveWidget } from './PopularLiveWidget';

const getDemoUrl = (game: any): string | null => {
  if (!game) return null;
  if (game.customDemoUrl) return game.customDemoUrl;
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

const heroSlides = [
    {
        image: "/images/haluk_slider_final.jpg",
        characterImg: "/images/haluk_fixed.png",
        badge: "Trustpilot",
        title: <>#1 KRİPTO CASİNO<br/>& SPOR BAHİSLERİ</>,
        subtitle: "2500$'a kadar Hoş Geldin Paketi",
        buttonText: "Şimdi etkinleştir"
    },
    {
        image: "/images/haluk_slider_final.jpg",
        characterImg: "/images/haluk_fixed.png",
        badge: "iPhone 17 Pro Max Çekilişi",
        title: <>DEV ÇEKİLİŞ<br/>BAŞLADI!</>,
        subtitle: "724bets güvencesiyle büyük ödül seni bekliyor.",
        buttonText: "Çekilişe Katıl"
    },
    {
        image: "/images/haluk_slider_final.jpg",
        characterImg: "/images/haluk_fixed.png",
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
      textColor: "group-hover:text-[#06b6d4]"
    }
  ];

  return (
    <div className="w-full h-full flex flex-col min-h-screen">
      
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
            className="relative rounded-xl border border-white/10 p-5 lg:p-6 flex flex-col justify-between h-auto min-h-[200px] lg:h-full shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(234,179,8,0.15)] hover:border-yellow-500/30 overflow-hidden group cursor-pointer bg-[#050505] transition-all duration-500"
          >
            {/* Background Image / Gradients */}
            <div className="absolute inset-0 z-0">
              <img src="/images/vip_bg.jpg" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000" alt="" />
              <div className="absolute inset-0 bg-[#050505]/50"></div>
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
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#06b6d4] ml-0.5" />
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
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#06b6d4]/50 to-[#06b6d4] rounded-full shadow-[0_0_15px_rgba(0,255,163,0.6)]" style={{ width: '0.06%' }}>
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
            <div onClick={() => onViewChange('originals')} className="col-span-2 lg:col-span-1 relative flex-1 w-full h-[90px] md:min-h-[120px] rounded-[6px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#050505] cursor-pointer transition-all duration-300 hover:z-10 hover:shadow-[inset_0_0_0_1px_#06b6d4,0_0_20px_rgba(16,185,129,0.3)] group/orig">
                <div className="absolute inset-0 z-0 flex justify-end">
                  <div className="w-[100%] sm:w-[80%] h-full relative">
                    <img src="/images/ai-generated/originals_card.jpg" alt="Originals" className="w-full h-full object-cover object-[center] transform group-hover/orig:scale-[1.05] transition-all duration-700 ease-out opacity-60 group-hover/orig:opacity-100" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent w-full"></div>
                </div>
                <div className="relative z-20 flex flex-col justify-center lg:justify-start items-start pt-0 lg:pt-5 h-full px-4 lg:px-6">
                    <h3 className="text-[22px] sm:text-[28px] lg:text-[38px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-1 transform group-hover/orig:translate-x-1 transition-transform flex flex-wrap items-center gap-1 sm:gap-2">
                        <span className="text-[#06b6d4] lowercase">724games</span> Orijinal
                        <span className="bg-[#10b981] text-black text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse shrink-0 tracking-normal uppercase ml-1 mr-auto">
                            %99.2 RTP
                        </span>
                        {/* Seka Çark Button inside GuestLanding */}
                        <button
                          onClick={(e) => { e.stopPropagation(); onViewChange('luckywheel'); }}
                          className="relative group/btn flex items-center justify-center px-3 py-1.5 ml-auto rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-[#0ea5e9]/50 hover:border-[#38bdf8] shadow-[0_0_15px_rgba(14,165,233,0.35)] hover:shadow-[0_0_25px_rgba(14,165,233,0.7)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer z-50"
                          title="Çarkıfelek Oyunu"
                        >
                          <div className="flex items-center gap-2">
                            <div className="relative w-5 h-5 flex items-center justify-center">
                              <div className="absolute inset-0 bg-[#0ea5e9] blur-sm rounded-full animate-pulse opacity-80"></div>
                              <svg className="w-4 h-4 text-white animate-[spin_8s_linear_infinite] relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="9" stroke="#38bdf8" strokeWidth="2" fill="none" />
                                <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" stroke="#0ea5e9" strokeWidth="1.5" />
                                <circle cx="12" cy="12" r="2.5" fill="#38bdf8" />
                              </svg>
                            </div>
                            <span className="font-black text-xs tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[#7dd3fc] to-[#0ea5e9] drop-shadow-[0_0_8px_rgba(14,165,233,0.6)] uppercase">
                              Seka Çark
                            </span>
                          </div>
                        </button>
                    </h3>
                    <div className="block"><ActivePlayersCounter type="casino" /></div>
                </div>
            </div>

            {/* Middle Third: Casino */}
            <div onClick={() => onViewChange('blackjack')} className="col-span-1 relative flex-1 w-full h-[85px] md:min-h-[120px] rounded-[6px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#050505] cursor-pointer transition-all duration-300 hover:z-10 hover:shadow-[inset_0_0_0_1px_#06b6d4,0_0_20px_rgba(16,185,129,0.15)] group/casino">
                <div className="absolute inset-0 z-0 flex justify-end">
                  <div className="w-[100%] sm:w-[80%] h-full relative">
                    <img src="/images/ai-generated/casino_card.jpg" alt="Casino" className="w-full h-full object-cover object-[center] transform group-hover/casino:scale-[1.05] transition-all duration-700 ease-out opacity-60 group-hover/casino:opacity-100" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent w-full"></div>
                </div>
                <div className="relative z-20 flex flex-col justify-center lg:justify-start items-start pt-0 lg:pt-5 h-full px-4 lg:px-6">
                    <h3 className="text-[20px] sm:text-[24px] lg:text-[38px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-0.5 lg:pb-1 transform group-hover/casino:translate-x-1 transition-transform">Casino</h3>
                    <div className="block"><ActivePlayersCounter type="casino" /></div>
                </div>
            </div>

            {/* Bottom Third: Sports */}
            <div onClick={() => onViewChange('sports')} className="col-span-1 relative flex-1 w-full h-[85px] md:min-h-[120px] rounded-[6px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#050505] cursor-pointer transition-all duration-300 hover:z-10 hover:shadow-[inset_0_0_0_1px_#06b6d4,0_0_20px_rgba(16,185,129,0.15)] group/sports">
                <div className="absolute inset-0 z-0 flex justify-end">
                  <div className="w-[100%] sm:w-[80%] h-full relative">
                    <img src="/images/ai-generated/sports_card.jpg" alt="Sports Betting" className="w-full h-full object-cover object-[center] transform group-hover/sports:scale-[1.05] transition-all duration-700 ease-out opacity-60 group-hover/sports:opacity-100" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent w-full"></div>
                </div>
                <div className="relative z-20 flex flex-col justify-center lg:justify-start items-start pt-0 lg:pt-5 h-full px-4 lg:px-6">
                    <h3 className="text-[20px] sm:text-[24px] lg:text-[38px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-0.5 lg:pb-1 transform group-hover/sports:translate-x-1 transition-transform">Spor</h3>
                    <div className="block"><ActivePlayersCounter type="sports" /></div>
                </div>
            </div>

          </div>
          </div>



          {/* Yeni Eklenenler Slider (Member View) */}
          <NewGamesSlider2 onPlayGame={(game) => {
            setSelectedGame({
              id: game.id,
              title: game.name,
              name: game.name,
              provider: game.provider,
              image: game.img,
              category: 'slots',
              players: game.players,
              customDemoUrl: game.customDemoUrl,
              demoUrl: game.customDemoUrl,
              demoSymbol: game.demoSymbol
            } as any);
            setShowDemoIframe(true);
          }} />

          <div className="w-full mt-4">

            <LiveWinsTicker />
            <OriginalsSlider onNavigate={onViewChange} />
          </div>
        </>
      ) : (
        // GUEST VIEW (NEW DESIGN - Matches reference)
        <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-6 pt-6 pb-16 flex flex-col items-center">
            {/* Static 3-Column Banners */}
            <SportsBanners />

                        {/* CATEGORY CARDS */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-10 mb-6 perspective-[1000px]">
                
                {/* Casino - Minimal Premium (#06b6d4) */}
                
                <motion.div
                    initial={{ scale: 0.95, opacity: 0.3, filter: 'brightness(0.8)' }}
                    whileInView={{ scale: 1.05, opacity: 1, filter: 'brightness(1)' }}
                    viewport={{ amount: "some", margin: "-40% 0px -40% 0px" }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full flex"
                >
                <div onClick={() => onViewChange('blackjack')} className="group relative w-full h-[200px] md:h-[240px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech">
                                        <div className="absolute inset-[1px] bg-[#05070a] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/casino_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-80 group-hover:opacity-100 z-0" alt="Casino" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="absolute inset-x-0 bottom-0 p-4 xl:p-5 flex flex-col justify-end z-30">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold font-['Outfit'] uppercase tracking-[0.05em] mb-1 text-transparent bg-clip-text bg-[linear-gradient(to_bottom,#ffffff_0%,#e5e7eb_40%,#9ca3af_50%,#e5e7eb_60%,#ffffff_100%)] group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#67e8f9_40%,#06b6d4_50%,#67e8f9_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_4px_rgba(0,0,0,1)] group-hover:drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]">
                                CASINO
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-4">
                                <div className="text-[10px] lg:text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                                    Klasik Masa Oyunları
                                </div>

                                <div className="relative w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-[#06b6d4]/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-[6px] bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#06b6d4] shadow-lg group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white group-hover:text-black ml-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                </motion.div>
                {/* Slot Oyunları - Minimal Premium (#d946ef) */}
                
                <motion.div
                    initial={{ scale: 0.95, opacity: 0.3, filter: 'brightness(0.8)' }}
                    whileInView={{ scale: 1.05, opacity: 1, filter: 'brightness(1)' }}
                    viewport={{ amount: "some", margin: "-40% 0px -40% 0px" }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full flex"
                >
                <div onClick={() => onViewChange('slots')} className="group relative w-full h-[200px] md:h-[240px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech">
                                        <div className="absolute inset-[1px] bg-[#05070a] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/slot_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-80 group-hover:opacity-100 z-0" alt="Slotlar" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="absolute inset-x-0 bottom-0 p-4 xl:p-5 flex flex-col justify-end z-30">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold font-['Outfit'] uppercase tracking-[0.05em] mb-1 text-transparent bg-clip-text bg-[linear-gradient(to_bottom,#ffffff_0%,#e5e7eb_40%,#9ca3af_50%,#e5e7eb_60%,#ffffff_100%)] group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#e879f9_40%,#d946ef_50%,#e879f9_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_4px_rgba(0,0,0,1)] group-hover:drop-shadow-[0_0_30px_rgba(217,70,239,0.8)]">
                                SLOTLAR
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-4">
                                <div className="text-[10px] lg:text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                                    Binlerce Oyun
                                </div>

                                <div className="relative w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-[#d946ef]/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-[6px] bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#d946ef] shadow-lg group-hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white group-hover:text-black ml-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                </motion.div>
                {/* Spor - Minimal Premium (#10b981) */}
                
                <motion.div
                    initial={{ scale: 0.95, opacity: 0.3, filter: 'brightness(0.8)' }}
                    whileInView={{ scale: 1.05, opacity: 1, filter: 'brightness(1)' }}
                    viewport={{ amount: "some", margin: "-40% 0px -40% 0px" }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full flex"
                >
                <div onClick={() => onViewChange('sports')} className="group relative w-full h-[200px] md:h-[240px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech">
                                        <div className="absolute inset-[1px] bg-[#05070a] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/sports_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-80 group-hover:opacity-100 z-0" alt="Spor" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent z-10 pointer-events-none"></div>

                        <div className="absolute inset-x-0 bottom-0 p-4 xl:p-5 flex flex-col justify-end z-30">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold font-['Outfit'] uppercase tracking-[0.05em] mb-1 text-transparent bg-clip-text bg-[linear-gradient(to_bottom,#ffffff_0%,#e5e7eb_40%,#9ca3af_50%,#e5e7eb_60%,#ffffff_100%)] group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#6ee7b7_40%,#10b981_50%,#6ee7b7_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_4px_rgba(0,0,0,1)] group-hover:drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]">
                                SPOR
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-4">
                                <div className="text-[10px] lg:text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                                    Canlı Bahisler
                                </div>

                                <div className="relative w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-[#10b981]/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-[6px] bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#10b981] shadow-lg group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white group-hover:text-black ml-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                </motion.div>
                {/* 724Orijinal - Minimal Premium (#eab308) */}
                
                <motion.div
                    initial={{ scale: 0.95, opacity: 0.3, filter: 'brightness(0.8)' }}
                    whileInView={{ scale: 1.05, opacity: 1, filter: 'brightness(1)' }}
                    viewport={{ amount: "some", margin: "-40% 0px -40% 0px" }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full flex"
                >
                <div onClick={() => onViewChange('originals')} className="group relative w-full h-[200px] md:h-[240px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech">
                                        <div className="absolute inset-[1px] bg-[#05070a] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/originals_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-80 group-hover:opacity-100 z-0" alt="724Orijinal" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent z-10 pointer-events-none"></div>

                        <div className="absolute inset-x-0 bottom-0 p-4 xl:p-5 flex flex-col justify-end z-30">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold font-['Outfit'] uppercase tracking-[0.05em] mb-1 text-transparent bg-clip-text bg-[linear-gradient(to_bottom,#ffffff_0%,#e5e7eb_40%,#9ca3af_50%,#e5e7eb_60%,#ffffff_100%)] group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#fde047_40%,#eab308_50%,#fde047_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_4px_rgba(0,0,0,1)] group-hover:drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]">
                                724ORİJİNAL
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-4">
                                <div className="text-[10px] lg:text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                                    %99.2 RTP Özel
                                </div>

                                <div className="relative w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-[#eab308]/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-[6px] bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#eab308] shadow-lg group-hover:shadow-[0_0_20px_rgba(234,179,8,0.6)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white group-hover:text-black ml-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </motion.div>
            </div>


            <div className="w-full mt-8 mb-8">
              <LiveWinsTicker />
              <OriginalsSlider onNavigate={onViewChange} />
            </div>


            {/* Yeni Eklenenler Slider (Guest View) */}
            <div className="w-full mt-4">
                <NewGamesSlider2 onPlayGame={(game) => setDetailModalGame({
                    id: game.id,
                    name: game.name,
                    provider: game.provider,
                    img: game.img,
                    demoUrl: getDemoUrl(game),
                    fullDesc: `${game.name}, ${game.provider} tarafından sunulan popüler ve kazançlı bir slottur.`
                })} />
                

            </div>

        </div>
      )}

      <div className="w-full mt-8">
        <GameLobbyGrid customGames={[]} />
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
        <LiveGamesSlider onPlayGame={(game) => { setSelectedGame(game); setShowDemoIframe(true); }} />
      </div>

      {/* Live Bets and Leaderboards */}
      <div className="w-full pb-8">
      </div>

      {/* Feature / Promo Cards (Moved to bottom) */}
      <div className="w-full px-4 pb-12 hidden md:block max-w-[1600px] mx-auto">
        <div className="grid grid-cols-3 gap-4">
          {promoCards.map((card, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-xl bg-[#050505] border border-white/5 hover:border-[#06b6d4]/30 h-[130px] flex p-6 items-center shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,255,163,0.15)] group cursor-pointer transition-all duration-300 hover:-translate-y-1">
              {/* Premium Background */}
              <div className="absolute inset-0 z-0 bg-[#111111] group-hover:bg-[#1a1a22] transition-colors duration-500">
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
          {selectedGame.title === 'VIP ROULETTE' ? (
             <div className="relative w-full h-[100dvh] md:max-w-[1200px] md:w-[95vw] md:h-[80vh] bg-black md:rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col m-auto animate-fade-in">
               <div className="flex-1 w-full relative bg-black">
                  <iframe 
                    src="https://www.youtube.com/embed/UC_DKcB38T0?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&fs=0"
                    className="absolute inset-0 w-full h-full border-none pointer-events-none"
                    allowFullScreen
                    allow="autoplay; fullscreen"
                  ></iframe>
               </div>
             </div>
          ) : showDemoIframe && getDemoUrl(selectedGame) ? (
            <div className="relative w-full h-[100dvh] md:max-w-[1600px] md:w-[95vw] md:h-[90vh] bg-black md:rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:border border-white/5 m-auto">
               <div className="h-12 md:h-14 bg-[#050505] flex items-center justify-between px-4 md:px-6 flex-shrink-0">
                  <div className="flex items-center gap-3">
                     <span className="text-white font-bold text-sm md:text-base tracking-wide uppercase">{selectedGame.name || selectedGame.title} <span className="text-[#06b6d4] font-black text-[10px] md:text-xs ml-2 border border-[#06b6d4]/30 bg-[#06b6d4]/10 px-2 py-0.5 rounded-full">DEMO</span></span>
                  </div>
                  <button onClick={() => { setShowDemoIframe(false); setSelectedGame(null); }} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               <div className="flex-1 w-full relative bg-[#000000]">
                  <iframe 
                    src={getDemoUrl(selectedGame) || ''}
                    className="absolute inset-0 w-full h-full border-none"
                    allowFullScreen
                    allow="autoplay; fullscreen"
                  ></iframe>
               </div>
            </div>
          ) : (
            <div className="relative w-full md:max-w-[500px] bg-[#050505] md:rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:border border-white/5 m-auto p-6 md:p-8 text-center animate-fade-in">
                <button onClick={() => { setShowDemoIframe(false); setSelectedGame(null); }} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
                <div className="w-[120px] h-[160px] md:w-[150px] md:h-[200px] shrink-0 mb-6 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] mx-auto relative group rounded-xl overflow-hidden border border-white/10">
                    <img src={selectedGame.image || selectedGame.img} alt={selectedGame.title || selectedGame.name} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white mb-2">{selectedGame.title || selectedGame.name}</h2>
                <p className="text-gray-400 mb-8 text-sm leading-relaxed">Bu oyun için demo versiyonu bulunmamaktadır. Gerçek parayla oynamak için lütfen hesabınıza bakiye yükleyin veya farklı bir oyun seçin.</p>
                <button onClick={() => { setShowDemoIframe(false); setSelectedGame(null); }} className="px-6 py-3 w-full bg-[#06b6d4] hover:bg-[#0da070] text-black rounded-lg font-bold transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    Geri Dön
                </button>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* Spacer to allow scrolling past bottom bar on mobile */}
      <div className="h-[80px] md:h-0 w-full flex-shrink-0" />
    </div>
  );
};

export default GuestLanding;
