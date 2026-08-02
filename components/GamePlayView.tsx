import React, { useState, useEffect, useRef } from 'react';
import { Maximize, Monitor, Star, BarChart2, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Gamepad2, X, Info, Wallet } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import OriginalsSlider from './OriginalsSlider';
import { usePragmaticSync } from '../hooks/usePragmaticSync';
import { useUser } from '../contexts/UserContext';

interface GamePlayViewProps {
  game: any;
  demoUrl: string;
  onClose: () => void;
  onViewChange?: (view: string) => void;
}

export const GamePlayView: React.FC<GamePlayViewProps> = ({ game, demoUrl, onClose, onViewChange }) => {
  const { t } = useLanguage();
  const { siteUser, setSiteUser } = useUser();
  const [activeTab, setActiveTab] = useState<'bigwins' | 'luckywins' | 'desc'>('bigwins');
  const [isRealMoney, setIsRealMoney] = useState(!!siteUser);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);
  
  const gameName = game.name || game.title || 'Slot Game';
  const provider = game.provider || 'Pragmatic Play';
  const imgUrl = game.img || game.image || game.icon;
  const rtp = game.rtp || '96.50%';

  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Use global user balance if available, fallback to 0
  const initialUserBalance = siteUser?.balance || 0; 
  
  const { balance, displayBalance, status } = usePragmaticSync({ 
    initialBalance: initialUserBalance, 
    iframeRef,
    onInsufficientFunds: () => {
      console.warn("Bakiye yetersiz!");
    },
    onBalanceChange: (newBalance) => {
      if (siteUser && setSiteUser) {
        setSiteUser({ ...siteUser, balance: newBalance });
      }
    }
  });

  const mockBigWins = [
    { rank: 1, user: 'Gizli', hidden: true, bet: '$120.000,00', mult: '10.10x', payout: '$1.211.968,00' },
    { rank: 2, user: 'Gizli', hidden: true, bet: '$120.000,00', mult: '6.79x', payout: '$814.240,00' },
    { rank: 3, user: 'Gizli', hidden: true, bet: '$120.000,00', mult: '6.65x', payout: '$798.064,00' },
    { rank: 4, user: 'Gizli', hidden: true, bet: '$54.000,00', mult: '11.11x', payout: '$599.994,00' },
    { rank: 5, user: 'Ugly...', hidden: false, bet: '$4.230,00', mult: '141.84x', payout: '$599.994,00' },
  ];

  const handleFullscreen = () => {
    const elem = document.getElementById('game-play-container');
    if (elem) {
      if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center animate-fade-in bg-[#0B0E14] min-h-screen">
      <style>{`
        @keyframes flash-win {
          0% { text-shadow: 0 0 0 transparent; color: #10b981; }
          50% { text-shadow: 0 0 20px #10b981, 0 0 40px #10b981; color: #34d399; transform: scale(1.05); }
          100% { text-shadow: 0 0 0 transparent; color: #10b981; transform: scale(1); }
        }
        @keyframes flash-loss {
          0% { text-shadow: 0 0 0 transparent; color: #10b981; }
          50% { text-shadow: 0 0 15px #ef4444; color: #f87171; }
          100% { text-shadow: 0 0 0 transparent; color: #10b981; }
        }
        .flash-win { animation: flash-win 1s cubic-bezier(0.4, 0, 0.2, 1); }
        .flash-loss { animation: flash-loss 0.5s ease-out; }
      `}</style>

      {/* Top Section: Game Iframe & Control Bar */}
      <div id="game-play-container" className="w-full bg-[#0B0E14] relative">
        <button onClick={onClose} className="absolute top-4 right-4 z-[60] w-10 h-10 bg-black/60 hover:bg-black/80 text-white/70 hover:text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm">
          <X size={20} />
        </button>

        {/* Game Iframe Wrapper */}
        <div className={`w-full relative ${isFullscreen ? 'h-screen' : 'h-[60vh] md:h-[70vh] lg:h-[75vh]'}`}>
          <iframe 
            ref={iframeRef}
            src={demoUrl} 
            className="w-full h-full border-0"
            allowFullScreen
          />

          {/* Global Game Session ID (Serial) */}
          <div className="absolute left-[108px] bottom-[3px] pointer-events-none z-20 opacity-50 flex items-end">
            <span className="text-white text-[9.5px] font-mono tracking-widest drop-shadow-md leading-none">12321412431243242</span>
          </div>

          {/* Insufficient Funds Modal Overlay */}
          {showInsufficientFunds && isRealMoney && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                <div className="bg-[#0B0B0B] border-2 border-[#1A1A1A] rounded-xl w-[90%] max-w-[320px] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
                    <div className="flex justify-between items-center p-3 relative">
                        <div className="w-full text-center">
                            <span className="text-[#EAB308] font-black text-sm tracking-wider uppercase">Mesaj</span>
                        </div>
                        <button onClick={() => setShowInsufficientFunds(false)} className="absolute right-3 top-3 text-zinc-400 hover:text-white transition-colors">
                            <X size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className="px-6 py-4 text-center">
                        <p className="text-white font-bold text-sm md:text-base leading-snug">
                            Bu bahsi koymak için yeterli bakiyeniz yok. Hesabınıza para yatırın veya bahis seviyesini düşürün.
                        </p>
                    </div>
                    <div className="p-4 pt-2">
                        <button onClick={() => setShowInsufficientFunds(false)} className="w-full bg-[#10b981] hover:bg-[#059669] text-black font-black py-3 rounded-lg text-sm transition-colors uppercase tracking-wider">
                            OK
                        </button>
                    </div>
                </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        {!isFullscreen && (
          <div className="w-full h-16 md:h-20 bg-[#121620] border-b border-white/5 flex items-center justify-between px-4 md:px-8">
            
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
                <button className="w-9 h-9 rounded-full bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-colors">
                  <Monitor size={16} />
                </button>
                <button onClick={handleFullscreen} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors shadow-inner">
                  <Maximize size={16} />
                </button>
                <button className="w-9 h-9 rounded-full bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-colors">
                  <Star size={16} />
                </button>
                <button className="w-9 h-9 rounded-full bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-colors">
                  <BarChart2 size={16} />
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-3">
                <span className={`text-[11px] md:text-xs font-bold transition-colors ${!isRealMoney ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Eğlence Modu
                </span>
                
                <button 
                  onClick={() => {
                    const nextMode = !isRealMoney;
                    setIsRealMoney(nextMode);
                    if (nextMode && (!siteUser || siteUser.balance <= 0)) {
                      setShowInsufficientFunds(true);
                    } else {
                      setShowInsufficientFunds(false);
                    }
                  }}
                  className={`w-12 h-6 md:w-14 md:h-7 rounded-full relative transition-colors ${isRealMoney ? 'bg-[#10b981]' : 'bg-[#00E5FF]'}`}
                >
                  <div className={`absolute top-[2px] w-5 h-5 md:w-6 md:h-6 bg-white rounded-full transition-transform shadow-md ${isRealMoney ? 'left-[calc(100%-2px)] -translate-x-full' : 'left-[2px]'}`}></div>
                </button>

                <span className={`text-[11px] md:text-xs font-bold transition-colors ${isRealMoney ? 'text-white' : 'text-zinc-500'}`}>
                  Gerçek Oyun
                </span>
                
                {/* Balance Display (Only visible in Real Money mode) */}
                {isRealMoney && (
                  <div className="ml-2 pl-4 border-l border-white/10 hidden sm:flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center transition-colors duration-300 ${status === 'win' ? 'bg-[#10b981]/40' : status === 'loss' ? 'bg-red-500/20' : ''}`}>
                      <Wallet size={14} className={`transition-colors duration-300 ${status === 'win' ? 'text-white' : status === 'loss' ? 'text-red-400' : 'text-[#10b981]'}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Bakiye</span>
                      <span className={`font-black text-sm tabular-nums transition-all ${status === 'win' ? 'flash-win' : status === 'loss' ? 'flash-loss' : 'text-[#10b981]'}`}>
                        ${displayBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Middle Section: Meta & Table */}
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          
          {/* Left Column: Game Card */}
          <div className="w-full lg:w-[280px] shrink-0">
            <div className="bg-[#121620] rounded-2xl p-4 md:p-5 border border-white/5 shadow-xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-2 text-[#00E5FF] font-bold text-xs uppercase tracking-wider">
                  <Gamepad2 size={14} />
                  <span>Slots</span>
                </div>
                <Star size={16} className="text-zinc-500 cursor-pointer hover:text-white transition-colors" />
              </div>
              
              <h2 className="text-white font-black text-xl mb-4 leading-tight relative z-10">{gameName}</h2>
              
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden mb-5 relative z-10 shadow-2xl">
                <img src={imgUrl} alt={gameName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">Bahisler</span>
                  <span className="text-white font-bold font-mono text-xs">14.283.106</span>
                </div>
                <div className="h-[1px] w-full bg-white/5"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">RTP</span>
                  <span className="text-white font-bold font-mono text-xs">{rtp}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Winnings Table */}
          <div className="flex-1 flex flex-col">
            <p className="text-zinc-400 text-sm md:text-base font-medium mb-4 md:mb-6">
              {provider} tarafından sunulan <span className="text-white font-bold">{gameName}</span> Oyununu Oyna
            </p>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <button 
                onClick={() => setActiveTab('bigwins')}
                className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-colors ${activeTab === 'bigwins' ? 'bg-[#0f7bff] text-white shadow-lg' : 'bg-[#1b2230] text-zinc-400 hover:text-white'}`}
              >
                Büyük Kazançlar
              </button>
              <button 
                onClick={() => setActiveTab('luckywins')}
                className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-colors ${activeTab === 'luckywins' ? 'bg-[#0f7bff] text-white shadow-lg' : 'bg-[#1b2230] text-zinc-400 hover:text-white'}`}
              >
                Şanslı Kazançlar
              </button>
              <button 
                onClick={() => setActiveTab('desc')}
                className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-colors ${activeTab === 'desc' ? 'bg-[#0f7bff] text-white shadow-lg' : 'bg-[#1b2230] text-zinc-400 hover:text-white'}`}
              >
                Açıklama
              </button>
            </div>

            {/* Table */}
            {activeTab !== 'desc' ? (
              <div className="w-full overflow-x-auto rounded-xl border border-white/5">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-zinc-500 text-[11px] uppercase tracking-wider font-bold border-b border-white/5 bg-[#121620]/50">
                      <th className="py-4 px-6">#</th>
                      <th className="py-4 px-6">Kullanıcı</th>
                      <th className="py-4 px-6">Bahis Miktarı</th>
                      <th className="py-4 px-6">Çarpan</th>
                      <th className="py-4 px-6 text-right">Ödeme</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#121620]/30">
                    {mockBigWins.map((win, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-6">
                          <div className={`w-6 h-6 flex items-center justify-center rounded text-xs font-black
                            ${win.rank === 1 ? 'text-amber-400' : win.rank === 2 ? 'text-zinc-300' : win.rank === 3 ? 'text-amber-700' : 'text-zinc-500'}`}
                          >
                            {win.rank}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                            <span className="text-white font-medium text-sm">{win.user}</span>
                            {win.hidden && <Info className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-white font-mono text-xs">{win.bet}</td>
                        <td className="py-4 px-6 text-zinc-400 font-mono text-xs">{win.mult}</td>
                        <td className="py-4 px-6 text-right text-white font-bold font-mono text-sm">{win.payout}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="w-full p-6 bg-[#121620] rounded-xl border border-white/5">
                <h3 className="text-white font-bold text-lg mb-4">{gameName} Hakkında</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Bu oyun {provider} tarafından geliştirilmiş, yüksek volatiliteli ve heyecan verici bonus turlarına sahip popüler bir slot oyunudur. Mükemmel grafikleri ve sürükleyici ses efektleriyle gerçek bir casino deneyimi yaşatır.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Originals Slider */}
      <div className="w-full max-w-[1400px] px-4 md:px-8 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/20 flex items-center justify-center">
              <span className="text-[#00E5FF] font-black italic">7</span>
            </div>
            <h2 className="text-white font-bold text-lg md:text-xl">Orijinal Oyunlarımız</h2>
            <button className="text-zinc-500 text-sm font-medium hover:text-white transition-colors ml-2 hidden sm:block">
              Tümünü Gör
            </button>
          </div>
        </div>
        
        {/* We reuse the OriginalsSlider component here */}
        <div className="w-full">
          <OriginalsSlider onNavigate={onViewChange || (() => {})} />
        </div>
      </div>

    </div>
  );
};
