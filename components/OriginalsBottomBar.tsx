import React from 'react';
import { Maximize, Monitor, Star, BarChart2, Settings } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface OriginalsBottomBarProps {
  gameName: string;
  provider?: string;
  siteUser?: any;
  onAuthRequired?: () => void;
  onDepositRequired?: () => void;
  onFullscreen?: () => void;
  onTheaterMode?: () => void;
  onFavorite?: () => void;
  onStats?: () => void;
}

const OriginalsBottomBar: React.FC<OriginalsBottomBarProps> = ({ 
  gameName, 
  provider = '724bets Originals',
  siteUser,
  onAuthRequired,
  onDepositRequired,
  onFullscreen,
  onTheaterMode,
  onFavorite,
  onStats,
}) => {
  const { isFunMode, setIsFunMode } = useUser();
  const isRealMoney = !isFunMode;

  const handleToggle = () => {
    if (isRealMoney) {
      // Gerçek paradan demo'ya geç — her zaman serbest
      setIsFunMode(true);
      return;
    }

    // Demo'dan gerçek paraya geçmek isteniyor
    if (!siteUser) {
      // Giriş yapılmamış → login modal
      onAuthRequired?.();
      return;
    }

    // Giriş yapılmış ama bakiye yetersiz → para yatır sayfası
    if ((siteUser.balance ?? 0) <= 0) {
      onDepositRequired?.();
      return;
    }

    // Bakiye var → geç
    setIsFunMode(false);
  };

  return (
    <div className="w-full h-16 md:h-20 bg-[#121620] border-t border-white/5 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
      
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex font-black text-2xl tracking-tight text-white select-none">
          724<span className="text-[#00E5FF]">bets</span>
        </div>
        <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm md:text-base leading-tight">{gameName}</span>
          <span className="text-zinc-500 font-semibold text-[11px] md:text-xs">{provider}</span>
        </div>
      </div>

      {/* Right: Controls & Mode Toggle */}
      <div className="flex items-center gap-4 md:gap-8">
        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-game-rules'))}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mr-2"
          >
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="text-[11px] font-bold uppercase tracking-wider hidden lg:inline">Kurallar</span>
          </button>
          
          <button onClick={onTheaterMode} className="w-9 h-9 rounded-full bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-colors">
            <Monitor size={16} />
          </button>
          <button onClick={onFullscreen} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors shadow-inner">
            <Maximize size={16} />
          </button>
          <button onClick={onFavorite} className="w-9 h-9 rounded-full bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-colors">
            <Star size={16} />
          </button>
          <button onClick={onStats} className="w-9 h-9 rounded-full bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-colors">
            <BarChart2 size={16} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-3">
          <span className={`text-[11px] md:text-xs font-bold transition-colors ${!isRealMoney ? 'text-[#00E5FF]' : 'text-zinc-600'}`}>
            Eğlence Modu
          </span>
          
          <button 
            onClick={handleToggle}
            className={`w-12 h-6 md:w-14 md:h-7 rounded-full relative transition-all duration-300 ${isRealMoney ? 'bg-[#10b981]' : 'bg-[#00E5FF]'}`}
          >
            <div className={`absolute top-[2px] w-5 h-5 md:w-6 md:h-6 bg-white rounded-full transition-all duration-300 shadow-md ${isRealMoney ? 'left-[calc(100%-2px)] -translate-x-full' : 'left-[2px]'}`}></div>
          </button>

          <span className={`text-[11px] md:text-xs font-bold transition-colors ${isRealMoney ? 'text-[#10b981]' : 'text-zinc-500'}`}>
            Gerçek Oyun
          </span>
        </div>
      </div>
    </div>
  );
};

export default OriginalsBottomBar;
