import React, { useState } from 'react';
import { ChevronDown, X, MessageCircle, Trash2, RefreshCcw, Home, Gamepad2, Flag, FileText, Search, ChevronRight } from 'lucide-react';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { useUser } from '../../contexts/UserContext';
import { triggerGlobalToast } from '../GlobalToaster';
import ModernChat from '../ModernChat';

export const DualRightPanel: React.FC<{
  popularMatches?: any[];
  language: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}> = ({ language, isOpenMobile, onCloseMobile }) => {
  const { betSlip, betAmount, setBetAmount, removeSelection, clearBetSlip, totalOdds, potentialPayout } = useBetSlip();
  const { siteUser, placeBet } = useUser();
  const [activePanel, setActivePanel] = useState<'coupon' | 'chat'>('coupon');
  const [betType, setBetType] = useState<'tekli' | 'kombine' | 'sistem'>('kombine');
  const [quickBet, setQuickBet] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  React.useEffect(() => {
    const handleSetChat = () => {
      setActivePanel('chat');
    };
    window.addEventListener('setRightPanelToChat', handleSetChat);
    return () => {
      window.removeEventListener('setRightPanelToChat', handleSetChat);
    };
  }, []);

  const handlePlaceBet = async () => {
    try {
      await placeBet(parseFloat(betAmount.toString()) || 0, betSlip, totalOdds);
      triggerGlobalToast({ type: 'success', message: 'Bahis başarıyla oynandı!' });
      clearBetSlip();
      if (onCloseMobile) onCloseMobile();
    } catch (error: any) {
      triggerGlobalToast({ type: 'warning', message: error.message || 'Bir hata oluştu.' });
    }
  };

  const handleQuickAmount = (amount: number) => {
    setBetAmount(amount);
  };

  return (
    <>
    {/* Mobile Overlay */}
    {isOpenMobile && (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden animate-fade-in"
        onClick={onCloseMobile}
      />
    )}
    
    <div className={`fixed xl:static top-0 right-0 h-full z-50 flex flex-col shrink-0 bg-[#0A0D14] transition-all duration-300 ${isOpenMobile ? 'translate-x-0 w-[350px]' : 'translate-x-full xl:translate-x-0'} xl:w-full w-[350px]`}>
      
      {/* ── Desktop Tab & Chat/BetSlip Content ── */}
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden bg-[#0A0D14]">
        {activePanel === 'coupon' ? (
          <>
            {/* PREMIUM BET SLIP HEADER */}
            <div className="bg-[#0A0D14] border-b border-white/5 px-5 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <div className="w-8 h-8 bg-[#111] rounded-lg border border-white/10 flex flex-col items-center justify-center relative group-hover:border-white/30 transition-colors">
                    <div className="w-3.5 h-[2px] bg-white rounded-full mb-1"></div>
                    <div className="w-3.5 h-[2px] bg-white/50 rounded-full"></div>
                  </div>
                  {betSlip.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      {betSlip.length}
                    </span>
                  )}
                </div>
                <span className="text-white font-black text-[16px] tracking-wide">{language === 'tr' ? 'Bahis Kuponu' : 'Bet Slip'}</span>
                <ChevronDown className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors ml-1" />
              </div>

              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setQuickBet(!quickBet)}>
                <span className="text-zinc-400 font-bold text-[13px]">{language === 'tr' ? 'Hızlı Bahis' : 'Fast Bet'}</span>
                <div className={`w-9 h-5 rounded-full p-0.5 transition-colors border ${quickBet ? 'bg-[#10b981] border-[#10b981]' : 'bg-[#1a1a1a] border-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${quickBet ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#0A0D14] border-b border-white/5">
              <button 
                onClick={() => setBetType('tekli')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${betType === 'tekli' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.15)]' : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'}`}
              >
                Tekli
              </button>
              <button 
                onClick={() => setBetType('kombine')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${betType === 'kombine' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.15)]' : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'}`}
              >
                Kombine
              </button>
              <button 
                onClick={() => setBetType('sistem')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${betType === 'sistem' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.15)]' : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'}`}
              >
                Sistem
              </button>
            </div>

            {/* BET LIST */}
            {betSlip.length === 0 ? (
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-transparent">
                <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6 border border-white/5 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]">
                  <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-zinc-400 font-medium text-sm">
                  {language === 'tr' ? 'Kuponunuz boş.' : 'Your bet slip is empty.'}
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 bg-transparent">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                  {betSlip.map(bet => (
                    <div key={bet.id} className="bg-[#1a1a1a] rounded-md border border-white/5 flex overflow-hidden group">
                      
                      {/* Left Delete Bar */}
                      <button 
                        onClick={() => removeSelection(bet.id)}
                        className="w-10 bg-[#1f222a] border-r border-white/5 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-[#252932] transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      {/* Bet Content */}
                      <div className="flex-1 p-3 pl-4">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#10b981] flex items-center justify-center shrink-0">
                               <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.87 13.52l-2.5-1.8v-1.1h3.33v-1.74h-3.32V9.1h3.76V7.48H9.37v1.62h3.6v1.78h-3.6v1.74h3.6v1.1l-2.48 1.8-1-1.37-1.37 1 3.52 4.85h1.72l2.67-3.7-1.18-1.08z"/></svg>
                            </div>
                            <span className="text-[#10b981] font-bold text-[13px]">{bet.matchName.split(' vs ')[0] || bet.matchName}</span>
                            <span className="bg-[#FF4D4D] text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase">{bet.selectionName}</span>
                          </div>
                          <span className="text-white font-black text-sm">{bet.odd.toFixed(2)}</span>
                        </div>
                        
                        <div className="text-zinc-400 text-xs mt-1 truncate">
                          {bet.matchName}
                        </div>
                        <div className="text-white font-semibold text-[13px] mt-1">
                          1x2
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BOTTOM SUMMARY & ACTIONS */}
                <div className="shrink-0 flex flex-col bg-transparent">
                  
                  {/* Total Odds row */}
                  <div className="flex justify-between items-center px-4 py-3 border-t border-white/5">
                    <span className="text-zinc-300 text-sm font-medium">{language === 'tr' ? 'Son oranlar' : 'Total odds'}</span>
                    <span className="text-[#10b981] font-black text-lg">{totalOdds.toFixed(2)}</span>
                  </div>

                  {/* Add outcome & increase odds */}
                  <div className="bg-[#111915] border-t border-b border-[#10b981]/20 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#15201a] transition-colors">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="w-4 h-4 text-[#10b981]" />
                      <span className="text-[#10b981] font-semibold text-xs tracking-wide">{language === 'tr' ? 'Sonuç ekle ve oranları artır' : 'Add outcome to boost odds'}</span>
                    </div>
                    <RefreshCcw className="w-4 h-4 text-[#10b981]" />
                  </div>

                  {/* Amount Input */}
                  <div className="p-4 bg-transparent">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#10b981] rounded-sm flex items-center justify-center text-black font-black text-[10px]">
                          $
                        </div>
                        <input 
                          type="number"
                          value={betAmount || ''}
                          onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-md py-3 pl-9 pr-3 text-white font-bold outline-none focus:border-[#10b981]/50 transition-colors"
                        />
                      </div>
                      <button onClick={() => handleQuickAmount(50)} className="w-12 py-3 bg-[#1a1a1a] hover:bg-[#252932] border border-white/5 rounded-md text-white font-bold text-sm transition-colors">50</button>
                      <button onClick={() => handleQuickAmount(200)} className="w-14 py-3 bg-[#1a1a1a] hover:bg-[#252932] border border-white/5 rounded-md text-white font-bold text-sm transition-colors">200</button>
                      <button onClick={() => handleQuickAmount(500)} className="w-14 py-3 bg-[#1a1a1a] hover:bg-[#252932] border border-white/5 rounded-md text-white font-bold text-sm transition-colors">MAKS</button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => clearBetSlip()}
                        className="w-12 h-12 bg-[#1a1a1a] hover:bg-[#252932] border border-white/5 rounded-md flex items-center justify-center text-zinc-400 hover:text-red-400 transition-colors shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={handlePlaceBet}
                        className="flex-1 h-12 bg-[#10b981] hover:bg-[#00c966] text-black font-black text-sm tracking-wide rounded-md shadow-md active:scale-[0.98] transition-all"
                      >
                        {language === 'tr' ? 'Giriş yapmak' : 'Place Bet'}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </>
        ) : (
          <ModernChat 
            open={true}
            onClose={() => {}}
            siteUser={siteUser}
            userRole={null}
            isMobile={true}
            botsConfig={[]}
          />
        )}
      </div>

      {/* ═══════════ STICKY BOTTOM TOGGLE BAR (Still needed to switch back to Chat!) ═══════════ */}
      <div className="shrink-0 bg-[#0A0D14] border-t border-white/5 text-white flex items-center justify-between px-4 h-[60px] relative z-50 cursor-pointer shadow-lg">
        {activePanel === 'coupon' ? (
          <div onClick={() => setActivePanel('chat')} className="flex items-center justify-center w-full h-full group">
             <div className="flex items-center gap-2 text-[#10b981] group-hover:text-[#00ff87] transition-colors">
               <MessageCircle className="w-4 h-4" />
               <span className="text-[13px] font-bold uppercase tracking-widest">Sohbete Geç</span>
             </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full h-full px-2">
            <button className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white transition-colors flex-1">
              <Home className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-medium tracking-wide">Lobi</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white transition-colors flex-1">
              <Gamepad2 className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-medium tracking-wide">E-Sporlar</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white transition-colors flex-1">
              <Flag className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-medium tracking-wide">Bahislerim</span>
            </button>
            <button 
              onClick={() => setActivePanel('coupon')}
              className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white transition-colors flex-1 relative group"
            >
              <div className="relative">
                <FileText className="w-[18px] h-[18px] group-hover:text-[#10b981] transition-colors" />
                {betSlip.length > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-3.5 h-3.5 bg-[#10b981] text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                    {betSlip.length}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium tracking-wide group-hover:text-[#10b981] transition-colors">Bahis kuponu</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white transition-colors flex-1">
              <Search className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-medium tracking-wide">Ara</span>
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};
