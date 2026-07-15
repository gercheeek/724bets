import React, { useState, useEffect } from 'react';
import { Search, Trophy, Shield, Target, ChevronRight, Info } from 'lucide-react';
import LiveWinsTicker from './LiveWinsTicker';
import LiveGamesSlider from './LiveGamesSlider';
import LiveBetsTable from './LiveBetsTable';
import { CasinoLobbyGame, SiteUser } from '../types';
import GameLobbyGrid from './GameLobbyGrid';
import WorldCupTeaser from './WorldCupTeaser';
import OriginalsSlider from './OriginalsSlider';
import { useLanguage } from '../contexts/LanguageContext';

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
      icon: <Trophy strokeWidth={1.5} className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-44 h-44 text-yellow-600/20 group-hover:text-yellow-500/40 transition-all duration-700 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(202,138,4,0.15)]" />
    },
    {
      title: t("promo_2_title"),
      subtitle: t("promo_2_sub"),
      icon: <Shield strokeWidth={1.5} className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-44 h-44 text-red-600/20 group-hover:text-red-500/40 transition-all duration-700 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(220,38,38,0.15)]" />
    },
    {
      title: t("promo_3_title"),
      subtitle: t("promo_3_sub"),
      icon: <Target strokeWidth={1.5} className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-44 h-44 text-[#00FFA3]/20 group-hover:text-[#00FFA3]/40 transition-all duration-700 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(0,255,163,0.15)]" />
    }
  ];

  return (
    <div className="w-full h-full flex flex-col min-h-screen">
      
      {siteUser ? (
        // MEMBER VIEW: Promo Cards + VIP Dashboard
        <>
          {/* 3 Top Promo Cards (Desktop Only) */}
          <div className="w-full px-4 pt-0 -mt-4 pb-2 hidden md:block">
            <div className="grid grid-cols-3 gap-4">
              {promoCards.map((card, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-xl bg-[#12161E] border border-[#202532] hover:border-white/10 h-[140px] flex p-6 items-center shadow-2xl group cursor-pointer transition-all duration-300">
                  <div className="flex flex-col z-10 w-2/3">
                    <span className="text-white font-black text-xl lg:text-2xl tracking-tight leading-tight mb-2">{card.title}</span>
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{card.subtitle}</span>
                  </div>
                  {card.icon}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full px-4 pt-4 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: VIP Progress */}
          <div className="bg-[#111317] rounded-xl border border-white/5 p-5 flex flex-col justify-center h-auto min-h-[200px] shadow-lg">
            <h3 className="text-white text-[15px] font-bold mb-4 flex items-center">
              VIP İlerlemeniz
            </h3>
            <div className="border border-white/10 rounded-lg p-4 bg-[#151821] hover:bg-[#1a1d26] transition-colors cursor-pointer">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-bold text-sm flex items-center group">
                  {siteUser.username} <ChevronRight className="w-4 h-4 ml-1 text-gray-500 group-hover:text-white transition-colors" />
                </span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-white font-black text-[15px]">%0,06</span>
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="w-full h-1.5 bg-[#0f1115] rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[#00FFA3] rounded-full shadow-[0_0_10px_rgba(0,255,163,0.5)]" style={{ width: '0.06%' }}></div>
              </div>
              <div className="text-gray-400 text-xs font-semibold">
                Bir sonraki seviye: Bronz
              </div>
            </div>
          </div>

          {/* Middle & Right Columns: Seamless Casino & Sports Banner */}
          <div className="lg:col-span-2 w-full h-[220px] lg:h-full rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-white/10 relative bg-transparent flex flex-row">
            
            {/* Kumarhane Card */}
            <div 
              onClick={() => onViewChange('blackjack')}
              className="relative w-1/2 h-full cursor-pointer group bg-[#0B0E14] flex flex-col justify-end p-5 z-20 border-r border-white/5"
            >

              <div className="relative z-20 flex flex-col items-start gap-3 h-full justify-center transform group-hover:translate-x-3 transition-transform duration-500 max-w-[80%]">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-none font-['Outfit'] pb-1">
                  Casino
                </h3>
                <div className="mb-2">
                  <ActivePlayersCounter type="casino" />
                </div>
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-3 md:px-4 py-1.5 md:py-2 text-[10px] sm:text-xs md:text-sm rounded-lg transition-colors backdrop-blur-sm inline-block w-fit">
                  {t('visit_casino')}
                </button>
              </div>
            </div>

            {/* Spor Bahisleri Card */}
            <div 
              onClick={() => onViewChange('sports')}
              className="relative w-1/2 h-full cursor-pointer group bg-[#0B0E14] flex flex-col justify-end p-5 overflow-hidden z-10"
            >
              <img 
                src="/images/green_sports_card_left.jpg" 
                alt="Sports Betting" 
                className="absolute inset-0 w-full h-full object-cover object-[left_center] transform group-hover:scale-105 transition-all duration-700 ease-out opacity-100"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.5)_30%,rgba(0,0,0,0)_70%)] pointer-events-none group-hover:bg-[linear-gradient(to_left,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.3)_30%,rgba(0,0,0,0)_70%)] transition-all duration-500"></div>
              
              <div className="relative z-20 flex flex-col items-end gap-3 h-full justify-center self-end text-right transform group-hover:-translate-x-3 transition-transform duration-500 max-w-[80%] ml-auto">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-none font-['Outfit'] pb-1">
                  Spor
                </h3>
                <div className="mb-2">
                  <ActivePlayersCounter type="sports" />
                </div>
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-3 md:px-4 py-1.5 md:py-2 text-[10px] sm:text-xs md:text-sm rounded-lg transition-colors backdrop-blur-sm inline-block w-fit">
                  {t('visit_sports')}
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
      ) : (
        // GUEST VIEW: Promo Cards + Search + 2 Big Cards
        <>
          <div className="w-full mb-4">
             {showTeaser ? (
               <WorldCupTeaser>
                 <GuestLandingContent onSearchClick={onSearchClick} onViewChange={onViewChange} t={t} />
               </WorldCupTeaser>
             ) : (
               <GuestLandingContent onSearchClick={onSearchClick} onViewChange={onViewChange} t={t} />
             )}
          </div>
        </>
      )}

      {/* Gamdom Originals / Game Grid (Popüler Oyunlar Only) */}
      <div className="w-full">
        <GameLobbyGrid 
          customGames={customGames}
        />
      </div>

      {/* Originals Slider */}
      <div className="w-full">
        <OriginalsSlider onNavigate={onViewChange} />
      </div>

      {/* Live Wins Ticker */}
      <div className="w-full mb-4">
        <LiveWinsTicker />
      </div>


      {/* Live Games Slider */}
      <div className="w-full">
        <LiveGamesSlider />
      </div>

      {/* Live Bets and Leaderboards */}
      <div className="w-full pb-8">
        <LiveBetsTable />
      </div>

    </div>
  );
};

// Extracted inner content to avoid duplicating the huge block of code
const GuestLandingContent = ({ onSearchClick, onViewChange, t }: any) => (
  <>
    {/* Welcome & Search Bar Inline */}
    <div className="w-full py-2 flex justify-between items-center mb-2">
      <h2 className="text-xl sm:text-2xl md:text-2xl font-black text-white tracking-tight">
        Hoş geldiniz <span className="text-[#00FFA3]">724bets!</span>
      </h2>
      
      {/* Mobile Search Icon */}
      <button 
        onClick={onSearchClick} 
        className="md:hidden flex items-center justify-center w-10 h-10 bg-[#151821] rounded-lg border border-white/5 hover:bg-[#1a1e29] transition-colors"
      >
        <Search className="w-5 h-5 text-gray-400" />
      </button>

      {/* Desktop Search Bar */}
      <div 
        onClick={onSearchClick}
        className="hidden md:flex items-center bg-[#151821] rounded-lg px-4 py-3 w-[320px] cursor-pointer hover:bg-[#1a1e29] transition-colors border border-white/5"
      >
        <Search className="w-4 h-4 text-gray-400 mr-3" />
        <span className="text-gray-400 text-sm font-medium">{t('search')}</span>
      </div>
    </div>

    {/* 2 Big Cards: Casino & Sports (Split Screen on Mobile, Separate on Desktop) */}
    <div className="w-full pb-6 md:pb-6 mb-4 md:mb-0">
      <div className="w-full grid grid-cols-2 gap-0 h-[220px] sm:h-[300px] md:h-[240px] rounded-3xl md:rounded-none overflow-hidden md:overflow-visible shadow-[0_20px_60px_rgba(0,0,0,0.7)] md:shadow-none border border-white/10 md:border-none relative bg-transparent">
        
        {/* Kumarhane Card */}
        <div 
          onClick={() => onViewChange('blackjack')}
          className="relative w-full h-full cursor-pointer group bg-[#0B0E14] flex flex-col justify-end p-5 md:p-5 md:rounded-l-xl md:border-y md:border-l md:border-white/5 z-20"
        >
          <div className="relative z-20 flex flex-col items-start gap-3 h-full justify-center transform group-hover:translate-x-3 md:group-hover:translate-x-0 transition-transform duration-500 max-w-[60%] sm:max-w-[50%]">
            <h3 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,1)] md:drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-none font-['Outfit'] pb-1">
              Casino
            </h3>
            <div className="mb-2">
              <ActivePlayersCounter type="casino" />
            </div>
            
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-3 md:px-4 py-1.5 md:py-2 text-[10px] sm:text-xs md:text-sm rounded-lg transition-colors backdrop-blur-sm inline-block w-fit">
              {t('visit_casino')}
            </button>
          </div>
        </div>

        {/* Spor Bahisleri Card */}
        <div 
          onClick={() => onViewChange('sports')}
          className="relative w-full h-full cursor-pointer group bg-transparent md:bg-[#0B0E14] flex flex-col justify-end p-5 md:p-5 md:rounded-r-xl overflow-hidden md:shadow-[0_15px_50px_rgba(0,0,0,0.6)] md:border-y md:border-r md:border-white/5 z-10"
        >
          <img 
            src="/images/green_sports_card_left.jpg" 
            alt="Sports Betting" 
            className="absolute inset-0 w-full h-full object-cover object-[left_center] transform md:group-hover:scale-105 transition-all duration-700 ease-out opacity-100"
          />
          {/* Gradient overlay: Solid dark on right for text, completely transparent on the left seam */}
          <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.5)_30%,rgba(0,0,0,0)_70%)] pointer-events-none group-hover:bg-[linear-gradient(to_left,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.3)_30%,rgba(0,0,0,0)_70%)] transition-all duration-500"></div>
          
          <div className="relative z-20 flex flex-col items-end gap-3 h-full justify-center self-end text-right transform group-hover:-translate-x-3 md:group-hover:-translate-x-0 transition-transform duration-500 max-w-[60%] sm:max-w-[50%] ml-auto">
            <h3 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,1)] md:drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-none font-['Outfit'] pb-1">
              Spor
            </h3>
            <div className="mb-2">
              <ActivePlayersCounter type="sports" />
            </div>
            
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-3 md:px-4 py-1.5 md:py-2 text-[10px] sm:text-xs md:text-sm rounded-lg transition-colors backdrop-blur-sm inline-block w-fit">
              {t('visit_sports')}
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default GuestLanding;
