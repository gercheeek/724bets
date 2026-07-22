import React, { useState } from 'react';
import { Trophy, ChevronRight, ChevronUp, X, Flame, MessageCircle } from 'lucide-react';
import { MatchInfo } from './types';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { useUser } from '../../contexts/UserContext';
import { triggerGlobalToast } from '../GlobalToaster';
import ModernChat from '../ModernChat';

export const DualRightPanel: React.FC<{
  popularMatches: MatchInfo[];
  language: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}> = ({ popularMatches, language, isOpenMobile, onCloseMobile }) => {
  const { betSlip, betAmount, setBetAmount, removeSelection, clearBetSlip, totalOdds, potentialPayout } = useBetSlip();
  const { siteUser, placeBet } = useUser();
  const [activePanel, setActivePanel] = useState<'coupon' | 'chat'>('coupon');

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

  return (
    <>
    {/* Mobile Overlay */}
    {isOpenMobile && (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden animate-fade-in"
        onClick={onCloseMobile}
      />
    )}
    
    <div className={`fixed xl:static top-0 right-0 h-full z-50 flex flex-col w-[320px] shrink-0 bg-[#000000] border-l border-white/[0.02] transition-transform duration-300 ${isOpenMobile ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}`}>
      
      {/* ═══════════ MAIN CONTENT AREA (FLEX-1) ═══════════ */}
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden bg-[#000000]">
        {activePanel === 'coupon' ? (
          <>
            {/* POPÜLER LİGLER (Top Half) */}
            <div className="flex-1 flex flex-col min-h-0 border-b border-white/[0.02]">
              <div className="p-4 border-b border-white/[0.02] flex items-center gap-2 bg-[#000000]">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-zinc-100 font-bold tracking-widest uppercase text-sm">
                  {language === 'tr' ? 'Popüler Canlı' : 'Popular Live'}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
                {popularMatches.slice(0, 5).map(match => (
                  <div key={`pop-side-${match.id}`} className="bg-[#050505] rounded-xl border border-white/[0.02] p-3 hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden group hover:shadow-lg cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="space-y-2 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-white truncate flex-1 pr-2">{match.home}</span>
                        {match.isLive && <span className="text-[12px] font-black text-emerald-400 tabular-nums drop-shadow-sm">{match.score.split('-')[0] || '0'}</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-white truncate flex-1 pr-2">{match.away}</span>
                        {match.isLive && <span className="text-[12px] font-black text-emerald-400 tabular-nums drop-shadow-sm">{match.score.split('-')[1] || '0'}</span>}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/[0.02] flex items-center justify-between relative z-10">
                      <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">{match.league}</span>
                      <span className="text-[10px] text-emerald-400 font-bold tabular-nums">{match.minute}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BET SLIP (Bottom Half) */}
            <div className="flex-[1.2] flex flex-col min-h-0 bg-[#000000] relative">
              <div className="p-4 border-b border-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <span className="text-white font-black tracking-widest uppercase text-sm">
                      {language === 'tr' ? 'Kupon' : 'Bet Slip'}
                    </span>
                    {betSlip.length > 0 && (
                      <span className="absolute -top-2 -right-3 w-4 h-4 bg-emerald-500 text-[#000000] text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                        {betSlip.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {betSlip.length === 0 ? (
                <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#050505] flex items-center justify-center mb-4 border border-white/[0.02]">
                    <Trophy className="w-8 h-8 text-zinc-700" />
                  </div>
                  <p className="text-zinc-400 font-medium text-sm">
                    {language === 'tr' ? 'Kuponunuz boş.' : 'Your bet slip is empty.'}
                  </p>
                  <p className="text-zinc-600 text-xs mt-2">
                    {language === 'tr' ? 'Oynamak için oranlara tıklayın.' : 'Click on odds to place a bet.'}
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {betSlip.map(bet => (
                      <div key={bet.id} className="bg-[#050505] rounded-xl p-3 border border-white/[0.02] relative group hover:border-white/10 transition-colors shadow-sm">
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-emerald-400 font-bold text-[11px] uppercase tracking-wide">{bet.selectionName}</span>
                          <button 
                            onClick={() => removeSelection(bet.id)}
                            className="text-zinc-500 hover:text-red-400 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-black/50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-white font-semibold text-xs mb-1 line-clamp-1">{bet.matchName}</div>
                        <div className="flex justify-between items-end mt-2 pt-2 border-t border-white/[0.02]">
                          <span className="text-zinc-500 text-[10px]">Maç Sonucu</span>
                          <span className="text-white font-black tabular-nums text-sm drop-shadow-sm">{bet.odd.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-[#000000] border-t border-white/[0.02]">
                    <div className="flex justify-between items-center mb-4 bg-[#050505] rounded-lg p-3 border border-white/[0.02]">
                      <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{language === 'tr' ? 'Toplam Oran' : 'Total Odds'}</span>
                      <span className="text-emerald-400 font-black text-lg tabular-nums drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">{totalOdds.toFixed(2)}</span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold group-focus-within:text-emerald-500 transition-colors">₺</span>
                        <input 
                          type="number"
                          value={betAmount || ''}
                          onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                          placeholder={language === 'tr' ? 'Miktar' : 'Amount'}
                          className="w-full bg-[#050505] border border-white/[0.02] rounded-xl py-3.5 pl-8 pr-4 text-white text-sm font-bold outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600 shadow-inner hover:border-white/10"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-5 px-1">
                      <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{language === 'tr' ? 'Kazanılacak' : 'To Win'}</span>
                      <span className="text-white font-black text-xl tabular-nums tracking-tight">{potentialPayout.toFixed(2)} <span className="text-zinc-500 text-sm">₺</span></span>
                    </div>

                    <button 
                      onClick={handlePlaceBet}
                      className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 font-black py-4 rounded-xl transition-all duration-300 active:scale-[0.98] text-[13px] uppercase tracking-[0.2em] border border-emerald-500/40"
                    >
                      {language === 'tr' ? 'Bahis Yap' : 'Place Bet'}
                    </button>
                  </div>
                </div>
              )}
            </div>
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

      {/* ═══════════ STICKY BOTTOM TOGGLE BAR ═══════════ */}
      <div className="shrink-0 bg-[#000000] border-t border-white/[0.02] text-white flex items-center justify-between px-4 h-[56px] relative z-50 cursor-pointer shadow-lg">
        {activePanel === 'coupon' ? (
          <div onClick={() => setActivePanel('chat')} className="flex items-center justify-between w-full h-full">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-[15px] font-bold tracking-wide text-zinc-100">Sohbet</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
        ) : (
          <div onClick={() => setActivePanel('coupon')} className="flex items-center justify-between w-full h-full">
            <div className="flex items-center gap-2">
              <div className="bg-[#050505] p-1 rounded border border-white/5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </div>
              <span className="text-[15px] font-bold tracking-wide text-zinc-100">Kupon</span>
              <div className="ml-1 bg-[#050505] p-0.5 rounded-full border border-white/5">
                <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              {betSlip.length > 0 && (
                <span className="ml-1 bg-emerald-500 text-black w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shadow-sm">
                  {betSlip.length}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">HIZLI BAHİS</span>
              <div className="w-10 h-6 bg-[#050505] border border-white/5 rounded-full p-1 flex items-center cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-md flex items-center justify-center transform translate-x-4 transition-transform">
                  <Flame className="w-2.5 h-2.5 text-black" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};
