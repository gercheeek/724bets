import React, { useState, useEffect } from 'react';
import { Search, Trophy, Shield, Target, ChevronRight, Info } from 'lucide-react';
import LiveWinsTicker from './LiveWinsTicker';
import LiveGamesSlider from './LiveGamesSlider';
import { CasinoLobbyGame, SiteUser } from '../types';
import GameLobbyGrid from './GameLobbyGrid';
import WorldCupTeaser from './WorldCupTeaser';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();

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

          {/* Middle Column: Casino Card (Big Card Style) */}
          <div 
            onClick={() => onViewChange('blackjack')}
            className="relative w-full h-[220px] lg:h-[240px] rounded-xl overflow-hidden cursor-pointer group shadow-[0_8px_30px_rgb(0,0,0,0.4)] bg-[#111317] flex flex-col transition-transform hover:-translate-y-1"
          >
            <div className="w-full h-[75%] relative overflow-hidden">
               <img 
                 src="/images/purple_casino_card.jpg" 
                 alt="Casino" 
                 className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
               />
            </div>
            {/* Solid Bottom Band */}
            <div className="w-full h-[25%] bg-gradient-to-r from-[#811850] to-[#59103a] p-4 flex items-center justify-between z-20 border-t border-white/10">
              <h3 className="text-xl font-black text-white tracking-tight">
                Kumarhane
              </h3>
              <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-3 py-1.5 text-xs rounded transition-colors hidden sm:block lg:hidden xl:block">
                Ziyaret et
              </button>
            </div>
          </div>

          {/* Right Column: Sports Card (Big Card Style) */}
          <div 
            onClick={() => onViewChange('sports')}
            className="relative w-full h-[220px] lg:h-[240px] rounded-xl overflow-hidden cursor-pointer group shadow-[0_8px_30px_rgb(0,0,0,0.4)] bg-[#111317] flex flex-col transition-transform hover:-translate-y-1"
          >
            <div className="w-full h-[75%] relative overflow-hidden">
              <img 
                src="/images/green_sports_card.jpg" 
                alt="Sports Betting" 
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Solid Bottom Band */}
            <div className="w-full h-[25%] bg-gradient-to-r from-[#216115] to-[#15420d] p-4 flex items-center justify-between z-20 border-t border-white/10">
              <h3 className="text-xl font-black text-white tracking-tight">
                Spor Bahisleri
              </h3>
              <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-3 py-1.5 text-xs rounded transition-colors hidden sm:block lg:hidden xl:block">
                Ziyaret et
              </button>
            </div>
          </div>
        </div>
        </>
      ) : (
        // GUEST VIEW: Promo Cards + Search + 2 Big Cards
        <>

          <div className="w-full mb-4">
             <WorldCupTeaser>
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
               </div>               {/* 2 Big Cards: Casino & Sports (Split Screen on Mobile, Separate on Desktop) */}
               <div className="w-full pb-6 md:pb-6 mb-4 md:mb-0">
                 <div className="w-full grid grid-cols-2 gap-0 md:gap-4 h-[220px] sm:h-[300px] md:h-[240px] rounded-3xl md:rounded-none overflow-hidden md:overflow-visible shadow-[0_20px_60px_rgba(0,0,0,0.7)] md:shadow-none border border-white/10 md:border-none relative">
                   {/* Center Divider Line (Mobile Only) */}
                   <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent z-30 transform -translate-x-1/2 pointer-events-none md:hidden"></div>
                   
                   {/* Kumarhane Card */}
                   <div 
                     onClick={() => onViewChange('blackjack')}
                     className="relative w-full h-full cursor-pointer group bg-[#0B0E14] flex flex-col justify-end p-5 md:p-5 md:rounded-xl md:overflow-hidden md:shadow-[0_15px_50px_rgba(0,0,0,0.6)] md:border md:border-white/5"
                   >
                     <img 
                       src="/images/casino_neon_banner.jpg" 
                       alt="Casino" 
                       className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 md:group-hover:scale-105 transition-all duration-700 ease-out opacity-90 group-hover:opacity-100 md:opacity-100"
                     />
                     {/* Gradient overlay for readability */}
                     <div className="absolute inset-0 bg-gradient-to-r from-black/90 md:from-black/80 via-black/40 to-transparent pointer-events-none group-hover:from-black/80 transition-all duration-500"></div>
                     
                     <div className="relative z-20 flex flex-col items-start gap-2 h-full justify-center transform group-hover:translate-x-3 md:group-hover:translate-x-0 transition-transform duration-500">
                       <h3 className="text-3xl sm:text-4xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,1)] md:drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                         {t('casino')}
                       </h3>
                       <button className="bg-white/10 hover:bg-[#00FFA3] hover:text-black hover:border-transparent md:hover:bg-white/20 md:hover:text-white md:hover:border-white/10 backdrop-blur-md text-white font-extrabold md:font-bold px-5 py-2 md:px-5 md:py-2.5 text-xs sm:text-sm md:text-sm rounded-xl md:rounded-lg transition-all duration-300 border border-white/20 md:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:shadow-lg mt-2">
                         {t('visit_casino')}
                       </button>
                     </div>
                   </div>
  
                   {/* Spor Bahisleri Card */}
                   <div 
                     onClick={() => onViewChange('sports')}
                     className="relative w-full h-full cursor-pointer group bg-[#0B0E14] flex flex-col justify-end p-5 md:p-5 md:rounded-xl md:overflow-hidden md:shadow-[0_15px_50px_rgba(0,0,0,0.6)] md:border md:border-white/5"
                   >
                     <img 
                       src="/images/sports_neon_banner.jpg" 
                       alt="Sports Betting" 
                       className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 md:group-hover:scale-105 transition-all duration-700 ease-out opacity-90 group-hover:opacity-100 md:opacity-100"
                     />
                     {/* Gradient overlay for readability */}
                     <div className="absolute inset-0 bg-gradient-to-r from-black/90 md:from-black/80 via-black/40 to-transparent pointer-events-none group-hover:from-black/80 transition-all duration-500"></div>
                     
                     <div className="relative z-20 flex flex-col items-start gap-2 h-full justify-center transform group-hover:translate-x-3 md:group-hover:translate-x-0 transition-transform duration-500">
                       <h3 className="text-3xl sm:text-4xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,1)] md:drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                         {t('sports')}
                       </h3>
                       <button className="bg-white/10 hover:bg-[#00FFA3] hover:text-black hover:border-transparent md:hover:bg-white/20 md:hover:text-white md:hover:border-white/10 backdrop-blur-md text-white font-extrabold md:font-bold px-5 py-2 md:px-5 md:py-2.5 text-xs sm:text-sm md:text-sm rounded-xl md:rounded-lg transition-all duration-300 border border-white/20 md:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:shadow-lg mt-2">
                         {t('visit_sports')}
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             </WorldCupTeaser>
          </div>
          
          <div className="w-full mb-8">
            <LiveWinsTicker />
          </div>
        </>
      )}

      {/* Live Games Slider */}
      <div className="w-full">
        <LiveGamesSlider />
      </div>

      {/* Gamdom Originals / Game Grid */}
      <div className="w-full pb-4">
        <GameLobbyGrid 
          customGames={customGames}
        />
      </div>

    </div>
  );
};

export default GuestLanding;
