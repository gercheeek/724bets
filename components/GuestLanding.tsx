import React from 'react';
import { Search, ChevronRight, Target } from 'lucide-react';
import { CasinoLobbyGame, SiteUser } from '../types';
import GameLobbyGrid from './GameLobbyGrid';
import LiveBetsFeed from './LiveBetsFeed';

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
  return (
    <div className="w-full h-full flex flex-col bg-[#111317]">
      {/* 3 Top Banners */}
      <div className="w-full px-4 pt-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Banner 1: Red/Orange */}
        <div className="relative overflow-hidden rounded-xl bg-[#1f0d36] p-6 h-[160px] md:h-[200px] shadow-lg group cursor-pointer transition-transform hover:-translate-y-1">
          <div className="absolute right-0 bottom-0 w-32 h-32 opacity-50 z-0">
             <img src="/images/guest_casino_card.jpg" className="w-full h-full object-cover rounded-tl-xl" />
          </div>
          <div className="relative z-20 flex flex-col justify-between h-full">
            <div className="text-white/60 font-bold text-xs uppercase tracking-wider">
              Hoş Geldiniz Bonusu
            </div>
            <div className="text-white font-bold text-xl md:text-2xl mt-auto w-3/4">
              100% Para Yatırma Bonusu
            </div>
          </div>
        </div>

        {/* Banner 2: Yellow/Gold */}
        <div className="relative overflow-hidden rounded-xl bg-[#0d2a15] p-6 h-[160px] md:h-[200px] shadow-lg group cursor-pointer transition-transform hover:-translate-y-1">
          <div className="absolute right-0 bottom-0 w-32 h-32 opacity-50 z-0">
             <img src="/images/guest_sports_card.jpg" className="w-full h-full object-cover rounded-tl-xl" />
          </div>
          <div className="relative z-20 flex flex-col justify-between h-full">
            <div className="text-white/60 font-bold text-xs uppercase tracking-wider">
              Spor Bahisleri
            </div>
            <div className="text-white font-bold text-xl md:text-2xl mt-auto w-3/4">
              En Yüksek Oranlarla Kazan
            </div>
          </div>
        </div>

        {/* Banner 3: Purple/Blue */}
        <div className="relative overflow-hidden rounded-xl bg-[#3c2a05] p-6 h-[160px] md:h-[200px] shadow-lg group cursor-pointer transition-transform hover:-translate-y-1">
          <div className="absolute right-0 bottom-0 w-32 h-32 opacity-50 z-0">
             <img src="/images/guest_banner_image.jpg" className="w-full h-full object-cover rounded-tl-xl" />
          </div>
          <div className="relative z-20 flex flex-col justify-between h-full">
            <div className="text-white/60 font-bold text-xs uppercase tracking-wider">
              VIP Kulübü
            </div>
            <div className="text-white font-bold text-xl md:text-2xl mt-auto w-3/4">
              Özel Avantajları Keşfet
            </div>
          </div>
        </div>
      </div>

      {/* Welcome & Search Bar */}
      <div className="w-full px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-white flex flex-wrap gap-2 items-center">
          {siteUser ? (
             <>Tekrar hoş geldiniz, <span className="text-[#00FFA3]">{siteUser.username}!</span></>
          ) : (
             <>Hoş geldiniz, <span className="text-[#00FFA3]">724bahisnet'e!</span></>
          )}
        </h1>
        
        <div 
          onClick={onSearchClick}
          className="flex items-center bg-[#1A1D24] border border-white/5 rounded-md px-4 py-3 w-full md:w-[350px] cursor-pointer hover:bg-[#222730] transition-colors"
        >
          <Search className="w-4 h-4 text-gray-500 mr-3" />
          <span className="text-gray-500 text-sm font-medium">8082 oyunları ara</span>
        </div>
      </div>

      {/* 2 Big Cards: Casino & Sports */}
      <div className="w-full px-4 pb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kumarhane Card */}
        <div 
          onClick={() => onViewChange('blackjack')}
          className="relative w-full h-[220px] md:h-[280px] rounded-xl overflow-hidden cursor-pointer group shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#c11394] via-[#9214a8] to-[#5b0a82] z-0" />
          <img 
            src="/images/guest_casino_card.jpg" 
            alt="Casino" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-70 transform group-hover:scale-105 transition-transform duration-700 z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between z-20">
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Kumarhane
            </h3>
            <button className="bg-fuchsia-900/40 hover:bg-fuchsia-800/60 backdrop-blur-md border border-white/10 text-white font-bold px-4 py-2 text-sm rounded-lg transition-colors shadow-lg">
              Ziyaret et Casino
            </button>
          </div>
        </div>

        {/* Spor Bahisleri Card */}
        <div 
          onClick={() => onViewChange('sports')}
          className="relative w-full h-[220px] md:h-[280px] rounded-xl overflow-hidden cursor-pointer group shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#12a317] via-[#0c8a11] to-[#044f06] z-0" />
          <img 
            src="/images/guest_sports_card.jpg" 
            alt="Sports Betting" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-70 transform group-hover:scale-105 transition-transform duration-700 z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between z-20">
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Spor Bahisleri
            </h3>
            <button className="bg-green-900/40 hover:bg-green-800/60 backdrop-blur-md border border-white/10 text-white font-bold px-4 py-2 text-sm rounded-lg transition-colors shadow-lg">
              Ziyaret et Sports
            </button>
          </div>
        </div>
      </div>

      {/* Gamdom Originals / Game Grid */}
      <div className="w-full px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#00FFA3] rounded flex items-center justify-center font-bold text-black text-xs">7</div>
                <h2 className="text-white font-bold text-xl">724bets Originals</h2>
            </div>
            <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-[#222730] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2A303C] transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <button className="w-8 h-8 rounded-full bg-[#222730] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2A303C] transition-colors">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
        <GameLobbyGrid 
          games={customGames}
          onGameClick={(g) => onViewChange('blackjack')} 
        />
      </div>

      {/* Live Bets Feed Component */}
      <LiveBetsFeed />

    </div>
  );
};

export default GuestLanding;
