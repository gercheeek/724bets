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
      <div className="w-full px-4 pt-6 pb-6">
        <div className="relative overflow-hidden rounded-xl bg-[#0d0d12] w-full h-[180px] md:h-[240px] shadow-2xl group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Banner" 
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 z-0"
          />
          {/* Overlay & Text */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-center z-20 pointer-events-none">
            <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-4 max-w-lg leading-tight">
              724Bets'e <span className="text-[#00FFA3]">Hoşgeldiniz!</span>
            </h2>
            <div className="flex items-center gap-3 pointer-events-auto">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onMemberRegisterClick();
                }}
                className="bg-[#00FFA3] hover:bg-[#00E690] text-black font-black px-6 py-2.5 rounded-md transition-colors shadow-lg text-sm"
              >
                Hemen Oyna
              </button>
              <button 
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-800/80 hover:bg-zinc-700/80 backdrop-blur-md border border-white/5 text-gray-300 font-bold px-4 py-2.5 rounded-md transition-colors text-sm shadow-lg"
              >
                12,405,853 Toplam Bahis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full px-4 py-2 flex justify-end mb-4">
        <div 
          onClick={onSearchClick}
          className="flex items-center bg-[#1A1D24] border border-white/5 rounded-md px-4 py-3 w-full md:w-[350px] cursor-pointer hover:bg-[#222730] transition-colors"
        >
          <Search className="w-4 h-4 text-gray-500 mr-3" />
          <span className="text-gray-500 text-sm font-medium">Search games...</span>
        </div>
      </div>

      {/* 2 Big Cards: Casino & Sports */}
      <div className="w-full px-4 pb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kumarhane Card */}
        <div 
          onClick={() => onViewChange('blackjack')}
          className="relative w-full h-[220px] md:h-[280px] rounded-xl overflow-hidden cursor-pointer group shadow-2xl bg-[#0d0d12]"
        >
          <img 
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop" 
            alt="Casino" 
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between z-20">
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Casino
            </h3>
            <button className="bg-fuchsia-900/60 hover:bg-fuchsia-800/80 backdrop-blur-md border border-white/20 text-white font-bold px-4 py-2 text-sm rounded-lg transition-colors shadow-lg">
              Visit Casino
            </button>
          </div>
        </div>

        {/* Spor Bahisleri Card */}
        <div 
          onClick={() => onViewChange('sports')}
          className="relative w-full h-[220px] md:h-[280px] rounded-xl overflow-hidden cursor-pointer group shadow-2xl bg-[#0d0d12]"
        >
          <img 
            src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2605&auto=format&fit=crop" 
            alt="Sports Betting" 
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between z-20">
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Sports Betting
            </h3>
            <button className="bg-green-900/60 hover:bg-green-800/80 backdrop-blur-md border border-white/20 text-white font-bold px-4 py-2 text-sm rounded-lg transition-colors shadow-lg">
              Visit Sports
            </button>
          </div>
        </div>
      </div>

      {/* Gamdom Originals / Game Grid */}
      <div className="w-full px-4 pb-4">
        <GameLobbyGrid 
          customGames={customGames}
        />
      </div>

      {/* Live Bets Feed Component */}
      <LiveBetsFeed />

    </div>
  );
};

export default GuestLanding;
