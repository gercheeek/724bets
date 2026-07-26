import React, { useState } from 'react';
import { ChevronDown, X, MessageCircle, Trash2, RefreshCcw, Home, Gamepad2, Flag, FileText, Search, ChevronRight, Share2, Target, CheckCircle2 } from 'lucide-react';
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
  const { betSlip, betAmount, setBetAmount, removeSelection, clearBetSlip, totalOdds, potentialPayout, accumulatorBoost } = useBetSlip();
  const { siteUser, placeBet } = useUser();
  const [activePanel, setActivePanel] = useState<'coupon' | 'chat'>('coupon');
  const [betType, setBetType] = useState<'tekli' | 'kombine' | 'sistem'>('kombine');
  const [quickBet, setQuickBet] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [targetWin, setTargetWin] = useState<number | ''>('');

  React.useEffect(() => {
    const handleSetChat = () => {
      setActivePanel('chat');
    };
    const handleSetCoupon = () => {
      setActivePanel('coupon');
    };
    window.addEventListener('setRightPanelToChat', handleSetChat);
    window.addEventListener('openBetSlip', handleSetCoupon);
    return () => {
      window.removeEventListener('setRightPanelToChat', handleSetChat);
      window.removeEventListener('openBetSlip', handleSetCoupon);
    };
  }, []);

  const handlePlaceBet = async () => {
    if (!siteUser) {
      window.dispatchEvent(new CustomEvent('openLoginModal'));
      return;
    }

    try {
      await placeBet(parseFloat(betAmount.toString()) || 0, betSlip, totalOdds);
      setShowStamp(true);
      setTimeout(() => {
        setShowStamp(false);
        clearBetSlip();
        if (onCloseMobile) onCloseMobile();
        triggerGlobalToast({ type: 'success', message: 'Bahis başarıyla oynandı!' });
      }, 1500);
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
            <div className="bg-[#0A0D14] border-b border-white/5 px-2 py-1.5 flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5 cursor-pointer group flex-1">
                <div className="relative">
                  <div className="w-6 h-6 bg-[#161920] rounded-md border border-white/10 flex flex-col items-center justify-center relative group-hover:border-white/30 transition-colors">
                    <div className="w-2.5 h-[2px] bg-white rounded-full mb-0.5"></div>
                    <div className="w-2.5 h-[2px] bg-white/50 rounded-full"></div>
                  </div>
                  {betSlip.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-[8px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      {betSlip.length}
                    </span>
                  )}
                </div>
                <span className="text-white font-black text-[11px] tracking-wide">{language === 'tr' ? 'Bahis Kuponu' : 'Bet Slip'}</span>
                <ChevronDown className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div 
                  className="flex items-center justify-center p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerGlobalToast({ type: 'success', message: 'Kupon kodu kopyalandı: KPN-' + Math.random().toString(36).substring(2, 6).toUpperCase() });
                  }}
                  title="Kuponu Paylaş"
                >
                  <Share2 className="w-3.5 h-3.5 text-zinc-400 hover:text-white transition-colors" />
                </div>

                <div className="flex items-center gap-1.5 cursor-pointer bg-[#161920] px-2 py-1 rounded-full hover:bg-white/10 transition-all border border-white/5" onClick={() => setQuickBet(!quickBet)}>
                  <span className="text-zinc-300 font-bold text-[9px] uppercase tracking-wider">{language === 'tr' ? 'Hızlı' : 'Fast'}</span>
                  <div className={`w-6 h-3 rounded-full p-0.5 transition-colors border ${quickBet ? 'bg-[#10b981] border-[#10b981]' : 'bg-[#1a1a1a] border-white/10'}`}>
                    <div className={`w-2 h-2 rounded-full bg-white transition-transform ${quickBet ? 'translate-x-3' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* TABS (Premium Segmented Control) */}
            <div className="px-2 py-2 bg-[#0A0D14] border-b border-white/5">
              <div className="flex items-center p-1 bg-[#0f1118] rounded-xl border border-white/5 relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] h-[44px]">
                <div 
                  className="absolute top-1 bottom-1 w-[calc(33.333%-4px)] bg-[#10b981] rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" 
                  style={{
                    transform: `translateX(${betType === 'tekli' ? '4px' : betType === 'kombine' ? 'calc(100% + 6px)' : 'calc(200% + 8px)'})`
                  }}
                />
                {['tekli', 'kombine', 'sistem'].map(type => (
                  <button 
                    key={type}
                    onClick={() => setBetType(type as any)}
                    className={`flex-1 h-full text-[11px] uppercase tracking-wider font-extrabold rounded-lg transition-all duration-300 relative z-10 ${betType === type ? 'text-black' : 'text-zinc-500 hover:text-white'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* ACCUMULATOR BOOST PROGRESS BAR */}
            {betSlip.length > 0 && betType === 'kombine' && (
              <div className="px-1.5 py-1 bg-gradient-to-b from-[#111] to-[#0A0D14] border-b border-white/5 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[7px] text-zinc-400 font-bold tracking-wide uppercase">Kombine Bonusu</span>
                  </div>
                  <span className="text-[9px] font-black text-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">+{Math.round(accumulatorBoost * 100)}%</span>
                </div>
                <div className="w-full bg-[#161920] h-1 rounded-full overflow-hidden flex relative border border-white/5">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-[#10b981] transition-all duration-500" style={{ width: `${Math.min(100, (betSlip.length / 5) * 100)}%` }}>
                     <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.3)_50%,rgba(255,255,255,0)_100%)] animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <div className="flex justify-between text-[7px] text-zinc-600 font-black px-1 mt-px">
                  <span className={`transition-colors ${betSlip.length >= 3 ? 'text-[#10b981]' : ''}`}>3 Maç (%5)</span>
                  <span className={`transition-colors ${betSlip.length >= 4 ? 'text-[#10b981]' : ''}`}>4 Maç (%10)</span>
                  <span className={`transition-colors ${betSlip.length >= 5 ? 'text-[#10b981]' : ''}`}>5+ Maç (%15)</span>
                </div>
              </div>
            )}

            {/* BET LIST */}
            {betSlip.length === 0 ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-transparent">
                <div className="w-20 h-20 rounded-2xl bg-[#13161f] flex items-center justify-center mb-5 border border-white/5 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]">
                  <FileText className="w-8 h-8 text-zinc-600/50" strokeWidth={1.5} />
                </div>
                <h3 className="text-white font-bold text-[15px] mb-1">
                  {language === 'tr' ? 'Kuponunuz Boş' : 'Bet Slip Empty'}
                </h3>
                <p className="text-zinc-500 font-medium text-[12px] max-w-[200px]">
                  {language === 'tr' ? 'Bahis yapmak için oranlara tıklayarak seçim ekleyin.' : 'Click on odds to add selections to your bet slip.'}
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 bg-transparent">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-0.5 space-y-px">
                  {betSlip.map((bet) => (
                    <div key={bet.id} className="relative bg-[#161920] rounded-[4px] border border-white/5 p-1 group hover:border-white/10 hover:bg-[#1a1e27] transition-all overflow-hidden flex flex-col gap-0.5">
                      
                      {/* Left color bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>

                      <div className="flex justify-between items-center pl-1.5">
                        <div className="flex items-center gap-1 pr-5 w-full">
                           <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)] shrink-0" />
                           <div className="text-white font-bold text-[9px] leading-tight truncate flex-1">
                             {bet.matchName.replace(' vs ', ' - ')}
                           </div>
                        </div>
                        
                        {/* Delete button (Top Right) */}
                        <button 
                          onClick={() => removeSelection(bet.id)}
                          className="absolute right-0.5 top-1 w-3.5 h-3.5 rounded bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pl-1.5 pt-0.5 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                           <span className="text-zinc-500 text-[7px] font-semibold uppercase tracking-wider">Seçim:</span>
                           <span className="text-white font-bold text-[9px]">{bet.selectionName}</span>
                        </div>
                        <div className="bg-[#10b981]/10 px-1 py-px rounded border border-[#10b981]/20">
                           <span className="text-[#10b981] font-black text-[9px]">{bet.odd.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BOTTOM SUMMARY & ACTIONS */}
                <div className="shrink-0 flex flex-col bg-[#0A0D14] border-t border-white/10 shadow-[0_-5px_15px_rgba(0,0,0,0.5)] z-20 p-1.5 gap-1.5">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-zinc-400 text-[8px] font-bold uppercase">{language === 'tr' ? 'Toplam Oran' : 'Total odds'}</span>
                      <span className="text-white font-black text-[12px]">{totalOdds.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[#10b981] text-[8px] font-bold uppercase">{language === 'tr' ? 'Olası Kazanç' : 'Potential Win'}</span>
                      <span className="text-[#10b981] font-black text-[12px]">{potentialPayout.toFixed(2)} ₺</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 relative">
                     {/* Stamp Animation Overlay */}
                     {showStamp && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md rounded">
                          <div className="transform -rotate-12 scale-110 animate-pulse">
                            <div className="border-[2px] border-[#10b981] rounded px-2 py-0.5 bg-[#10b981]/10 flex flex-col items-center">
                              <CheckCircle2 className="w-4 h-4 text-[#10b981] mb-0.5" />
                              <span className="text-[#10b981] font-black text-[10px] uppercase">ONAYLANDI</span>
                            </div>
                          </div>
                        </div>
                      )}

                     <div className="flex-1 bg-[#161920] border border-white/10 rounded overflow-hidden flex h-7 shadow-inner">
                        <div className="relative flex-1">
                           <div className="absolute left-1.5 top-1/2 -translate-y-1/2 text-white font-black text-[10px]">₺</div>
                           <input 
                             type="number"
                             value={betAmount || ''}
                             onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                             placeholder="0"
                             className="w-full h-full bg-transparent pl-4 pr-1.5 text-white font-black text-[11px] outline-none"
                           />
                        </div>
                        <div className="flex items-center">
                          <button onClick={() => handleQuickAmount(50)} className="h-full px-1.5 bg-[#1a1e27] hover:bg-[#10b981]/15 border-l border-white/5 text-zinc-300 font-bold text-[9px] transition-all">+50</button>
                          <button onClick={() => handleQuickAmount(200)} className="h-full px-1.5 bg-[#1a1e27] hover:bg-[#10b981]/15 border-l border-white/5 text-zinc-300 font-bold text-[9px] transition-all">+200</button>
                          <button onClick={() => handleQuickAmount(500)} className="h-full px-1.5 bg-[#1a1e27] hover:bg-[#10b981]/15 border-l border-white/5 text-zinc-300 font-bold text-[9px] transition-all">MAX</button>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-1.5">
                     <button 
                        onClick={() => clearBetSlip()}
                        className="w-8 h-8 bg-[#161920] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded flex items-center justify-center text-zinc-500 hover:text-red-400 transition-all shrink-0 group"
                        title="Kuponu Temizle"
                      >
                        <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={handlePlaceBet}
                        className="flex-1 h-8 bg-[#10b981] text-black font-black text-[11px] rounded tracking-widest uppercase flex items-center justify-center hover:bg-[#0ea5e9] transition-colors gap-1 shadow-[0_3px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_5px_20px_rgba(16,185,129,0.5)] active:scale-[0.98]"
                      >
                        {!siteUser ? (language === 'tr' ? 'Giriş Yap' : 'Login') : (language === 'tr' ? 'Bahis Yap' : 'Place Bet')}
                        {siteUser && <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
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
      <div className="shrink-0 bg-[#0A0D14] border-t border-white/5 p-3 relative z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        {activePanel === 'coupon' ? (
          <button onClick={() => setActivePanel('chat')} className="w-full h-[46px] bg-[#10b981] hover:bg-[#0ea5e9] border border-transparent rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_20px_rgba(14,165,233,0.4)] group">
            <MessageCircle className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
            <span className="text-black text-[14px] font-extrabold tracking-wide uppercase">Sohbete Geç</span>
          </button>
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
