import React, { useState, useEffect } from 'react';
import { Search, Trophy, Shield, Target, ChevronRight } from 'lucide-react';
import { CasinoLobbyGame, SiteUser } from '../types';
import GameLobbyGrid from './GameLobbyGrid';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoSlide(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const promoCards = [
    {
      title: "$500k Bankada!",
      subtitle: "Liderlik tablosunda yerini al",
      icon: <Trophy className="w-32 h-32 text-yellow-500/40 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
    },
    {
      title: <>Yeniden tasarlandı.<br/>Daha hızlı.</>,
      subtitle: "Yepyeni bir deneyim",
      icon: <Shield className="w-32 h-32 text-red-500/30 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
    },
    {
      title: "Piyasadaki En İyi Oranlar",
      subtitle: "Kazancını Katla",
      icon: <Target className="w-32 h-32 text-[#00FFA3]/30 drop-shadow-[0_0_15px_rgba(0,255,163,0.5)]" />
    }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0b0e] min-h-screen">
      
      {/* 3 Top Promo Cards */}
      <div className="w-full px-4 pt-6 pb-4">
        
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          {promoCards.map((card, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#181d29] to-[#0a0b0e] border border-white/5 h-[140px] flex p-6 items-center shadow-lg group cursor-pointer transition-transform hover:-translate-y-1">
              <div className="flex flex-col z-10 w-2/3">
                <span className="text-white font-black text-xl lg:text-2xl tracking-tight leading-none mb-1">{card.title}</span>
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{card.subtitle}</span>
              </div>
              <div className="absolute right-[-10px] top-1/2 transform -translate-y-1/2 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden relative h-[140px] w-full">
          {promoCards.map((card, idx) => (
            <div 
              key={idx} 
              className={`absolute inset-0 w-full transition-opacity duration-700 ${currentPromoSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#181d29] to-[#0a0b0e] border border-white/5 h-[140px] flex p-6 items-center shadow-lg cursor-pointer">
                <div className="flex flex-col z-10 w-2/3">
                  <span className="text-white font-black text-xl tracking-tight leading-none mb-1">{card.title}</span>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{card.subtitle}</span>
                </div>
                <div className="absolute right-[-10px] top-1/2 transform -translate-y-1/2 opacity-80">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Welcome & Search Bar Inline */}
      <div className="w-full px-4 py-4 flex flex-col md:flex-row justify-between items-center mb-2">
        <h2 className="text-2xl md:text-[28px] font-black text-white tracking-tight mb-4 md:mb-0">
          Tekrar hoş geldiniz, <span className="text-[#00FFA3]">724bahisnet!</span>
        </h2>
        <div 
          onClick={onSearchClick}
          className="flex items-center bg-[#151821] rounded-md px-4 py-3 w-full md:w-[320px] cursor-pointer hover:bg-[#1a1e29] transition-colors border border-white/5"
        >
          <Search className="w-4 h-4 text-gray-400 mr-3" />
          <span className="text-gray-400 text-sm font-medium">Oyunları ara...</span>
        </div>
      </div>

      {/* 2 Big Cards: Casino & Sports */}
      <div className="w-full px-4 pb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kumarhane Card */}
        <div 
          onClick={() => onViewChange('blackjack')}
          className="relative w-full h-[260px] md:h-[300px] rounded-xl overflow-hidden cursor-pointer group shadow-[0_8px_30px_rgb(0,0,0,0.4)] bg-[#111317] flex flex-col"
        >
          <div className="w-full h-[75%] relative overflow-hidden">
             <img 
               src="/images/purple_casino_card.jpg" 
               alt="Casino" 
               className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
             />
          </div>
          {/* Solid Bottom Band */}
          <div className="w-full h-[25%] bg-gradient-to-r from-[#811850] to-[#59103a] p-4 md:px-6 flex items-center justify-between z-20 border-t border-white/10">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Kumarhane
            </h3>
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-4 py-2 text-sm rounded transition-colors">
              Ziyaret et Casino
            </button>
          </div>
        </div>

        {/* Spor Bahisleri Card */}
        <div 
          onClick={() => onViewChange('sports')}
          className="relative w-full h-[260px] md:h-[300px] rounded-xl overflow-hidden cursor-pointer group shadow-[0_8px_30px_rgb(0,0,0,0.4)] bg-[#111317] flex flex-col"
        >
          <div className="w-full h-[75%] relative overflow-hidden">
            <img 
              src="/images/green_sports_card.jpg" 
              alt="Sports Betting" 
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Solid Bottom Band */}
          <div className="w-full h-[25%] bg-gradient-to-r from-[#216115] to-[#15420d] p-4 md:px-6 flex items-center justify-between z-20 border-t border-white/10">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Spor Bahisleri
            </h3>
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-4 py-2 text-sm rounded transition-colors">
              Ziyaret et Sports
            </button>
          </div>
        </div>
      </div>

      {/* Gamdom Originals / Game Grid */}
      <div className="w-full px-4 pb-4">
        <div className="flex items-center gap-2 mb-4">
           <img src="/icons/gamdom-icon.png" alt="" className="w-6 h-6 hidden" /> 
           <h3 className="text-white text-xl font-bold">Gamdom Originals</h3>
        </div>
        <GameLobbyGrid 
          customGames={customGames}
        />
      </div>

    </div>
  );
};

export default GuestLanding;
