import React, { useState } from 'react';
import { ChevronDown, X, MessageCircle, Trash2, RefreshCcw, Home, Gamepad2, Flag, FileText, Search, ChevronRight, Share2, Target, CheckCircle2 } from 'lucide-react';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { useUser } from '../../contexts/UserContext';
import { triggerGlobalToast } from '../GlobalToaster';
import ModernChat from '../ModernChat';

const MOCK_MY_BETS = [
  {
    id: 1,
    type: 'Geliştirilmiş Bahis',
    title: 'GNK Dinamo Zagreb vs. FC Thun',
    picks: [
      { text: '+ Üstü 2.5', detail: 'Toplam gol' },
      { text: '+ GNK Dinamo Zagreb', detail: '1x2' },
      { text: '+ var', detail: 'İlk yarı - her iki takım da gol atar' }
    ],
    oldOdds: '4.71',
    newOdds: '5.64',
    players: '873'
  },
  {
    id: 2,
    type: 'Geliştirilmiş Bahis',
    title: 'Heart of Midlothian FC vs. Sturm Graz',
    picks: [
      { text: '+ Sturm Graz', detail: '1x2' },
      { text: '+ Üstü 0.5', detail: 'İlk Yarı - Toplam gol' },
      { text: '+ var', detail: 'Sturm Graz gol yemez' }
    ],
    oldOdds: '10.07',
    newOdds: '12.34',
    players: '975'
  }
];

const MyBetsPanel = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#050608] flex flex-col p-3 gap-4">
      <div className="flex items-center gap-2 px-1 mb-2">
        <div className="w-5 h-5 bg-[#00E5FF] rounded-full flex items-center justify-center shadow-[0_0_10px_#00E5FF]">
          <Target className="w-3 h-3 text-black" />
        </div>
        <h3 className="text-white font-bold text-sm">Bonuslu Bahisler</h3>
      </div>

      {MOCK_MY_BETS.map((bet) => (
        <div key={bet.id} className="relative bg-gradient-to-br from-[#0d1512] to-[#0A0D14] border border-[#00ff88]/20 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,255,136,0.05)]">
          {/* Header */}
          <div className="p-3 pb-2 flex items-center justify-between">
            <span className="text-[#00ff88] text-[10px] uppercase font-black tracking-wider drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]">
              {bet.type}
            </span>
            <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-[9px] font-bold text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_5px_#00ff88]"></span>
              {bet.players}
            </div>
          </div>

          {/* Title */}
          <div className="px-3 pb-3 border-b border-white/5 flex items-center gap-1.5">
            <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center shrink-0">
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
            <h4 className="text-white font-bold text-[12px] leading-tight">{bet.title}</h4>
          </div>

          {/* Picks */}
          <div className="p-3 flex flex-col gap-2">
            {bet.picks.map((pick, i) => (
              <div key={i} className="flex flex-col relative pl-2 border-l border-[#00ff88]/20">
                <span className="text-[#00ff88] text-[11px] font-bold">{pick.text} <span className="text-zinc-500 font-normal">| {pick.detail}</span></span>
              </div>
            ))}
          </div>

          {/* Odds Footer */}
          <div className="bg-[#11161d] p-3 flex items-center justify-between mt-2 border-t border-[#00ff88]/10">
            <div className="w-full h-9 bg-black/40 rounded-lg flex items-center justify-center gap-3">
              <span className="text-zinc-500 font-bold text-[12px]">{bet.oldOdds}</span>
              <div className="w-[45%] h-[80%] rounded-full border border-[#00ff88] bg-[#00ff88]/10 flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                <Target className="w-3 h-3 text-[#00ff88]" />
                <span className="text-white font-black text-[13px]">{bet.newOdds}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DualRightPanel: React.FC<{
  popularMatches?: any[];
  language: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}> = ({ language, isOpenMobile, onCloseMobile }) => {
  const { betSlip, betAmount, setBetAmount, removeSelection, clearBetSlip, totalOdds, potentialPayout, accumulatorBoost, betType, setBetType, isLocked } = useBetSlip();
  const { siteUser, placeBet } = useUser();
  const [activePanel, setActivePanel] = useState<'coupon' | 'chat' | 'mybets'>('coupon');
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

                  <div className="flex items-center gap-1.5 cursor-pointer bg-[#161920]/80 backdrop-blur px-2 py-1 rounded-full hover:bg-white/10 transition-all border border-[#00E5FF]/20" onClick={() => setQuickBet(!quickBet)}>
                  <span className="text-zinc-300 font-bold text-[9px] uppercase tracking-wider">{language === 'tr' ? 'Hızlı' : 'Fast'}</span>
                  <div className={`w-6 h-3 rounded-full p-0.5 transition-colors border ${quickBet ? 'bg-[#00E5FF]/20 border-[#00E5FF]' : 'bg-[#1a1a1a] border-white/10'}`}>
                    <div className={`w-2 h-2 rounded-full transition-transform ${quickBet ? 'translate-x-3 bg-[#00E5FF] shadow-[0_0_5px_#00E5FF]' : 'translate-x-0 bg-white'}`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* TABS (Premium Segmented Control) */}
            <div className="px-2 py-2 bg-[#0A0D14] border-b border-white/5">
              <div className="flex items-center p-1 bg-[#0f1118]/80 backdrop-blur rounded-xl border border-white/5 relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] h-[44px]">
                <div 
                  className="absolute top-1 bottom-1 w-[calc(33.333%-4px)] bg-gradient-to-b from-[#00E5FF]/30 to-[#00E5FF]/10 border border-[#00E5FF]/50 rounded-lg shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" 
                  style={{
                    transform: `translateX(${betType === 'tekli' ? '4px' : betType === 'kombine' ? 'calc(100% + 6px)' : 'calc(200% + 8px)'})`
                  }}
                />
                {['tekli', 'kombine', 'sistem'].map(type => (
                  <button 
                    key={type}
                    onClick={() => {
                      if (!isLocked) setBetType(type as any);
                    }}
                    className={`flex-1 h-full text-[11px] uppercase tracking-wider font-extrabold rounded-lg transition-all duration-300 relative z-10 ${betType === type ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-zinc-400'} ${isLocked && betType !== type ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
                    disabled={isLocked && betType !== type}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* ACCUMULATOR BOOST PROGRESS BAR */}
            {betSlip.length > 0 && betType === 'kombine' && (
              <div className="px-1.5 py-1 bg-gradient-to-b from-[#111]/80 to-[#0A0D14] backdrop-blur border-b border-white/5 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[7px] text-zinc-400 font-bold tracking-wide uppercase">Kombine Bonusu</span>
                  </div>
                  <span className="text-[9px] font-black text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">+{Math.round(accumulatorBoost * 100)}%</span>
                </div>
                <div className="w-full bg-[#161920] h-1 rounded-full overflow-hidden flex relative border border-white/5">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00E5FF]/40 via-[#00E5FF] to-[#00E5FF] transition-all duration-500 shadow-[0_0_10px_#00E5FF]" style={{ width: `${Math.min(100, (betSlip.length / 5) * 100)}%` }}>
                     <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,0)_100%)] animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <div className="flex justify-between text-[7px] text-zinc-600 font-black px-1 mt-px">
                  <span className={`transition-colors ${betSlip.length >= 3 ? 'text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]' : ''}`}>3 Maç (%5)</span>
                  <span className={`transition-colors ${betSlip.length >= 4 ? 'text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]' : ''}`}>4 Maç (%10)</span>
                  <span className={`transition-colors ${betSlip.length >= 5 ? 'text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]' : ''}`}>5+ Maç (%15)</span>
                </div>
              </div>
            )}

            {/* BET LIST */}
            {betSlip.length === 0 ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-transparent">
                <div className="w-20 h-20 rounded-2xl bg-[#0A0D14]/80 backdrop-blur flex items-center justify-center mb-5 border border-[#00E5FF]/20 shadow-[0_0_20px_rgba(0,229,255,0.05)] animate-pulse">
                  <FileText className="w-8 h-8 text-[#00E5FF]/60 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" strokeWidth={1.5} />
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
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2.5">
                  {betSlip.map((bet) => {
                    const isCompact = betSlip.length >= 5;
                    return (
                      <div key={bet.id} className={`relative backdrop-blur border group transition-all overflow-hidden flex flex-col justify-center ${isCompact ? 'p-1.5 min-h-[44px] gap-1 rounded-md shadow' : 'p-3 min-h-[76px] gap-2.5 rounded-xl shadow-lg'} ${bet.isSpecialCombo ? 'bg-gradient-to-br from-[#0b0e14] to-[#1a140a] border-[#f0b90b]/30 shadow-[0_0_20px_rgba(240,185,11,0.1)]' : 'bg-[#0b0e14]/80 border-white/5 hover:border-[#00E5FF]/20 hover:bg-[#1f2430]/60 hover:shadow-[0_0_15px_rgba(0,229,255,0.05)]'}`}>
                        
                        {/* Left color bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${bet.isSpecialCombo ? 'from-[#f0b90b] to-[#c79600] shadow-[0_0_10px_rgba(240,185,11,0.6)]' : 'from-[#00E5FF] to-[#00b3cc] shadow-[0_0_10px_rgba(0,229,255,0.6)]'}`}></div>

                        <div className={`flex justify-between items-start ${isCompact ? 'pl-1.5 pr-5' : 'pl-2 pr-6'}`}>
                          <div className={`flex items-start ${isCompact ? 'gap-1.5' : 'gap-2'} w-full mt-0.5`}>
                            <span className={`rounded-full ${bet.isSpecialCombo ? 'bg-[#f0b90b] shadow-[0_0_5px_rgba(240,185,11,0.8)]' : 'bg-[#00E5FF] shadow-[0_0_5px_rgba(0,229,255,0.8)]'} shrink-0 mt-[6px] ${isCompact ? 'w-1 h-1 mt-[5px]' : 'w-1.5 h-1.5'}`} />
                            <div className={`text-white font-bold leading-tight flex-1 flex flex-col gap-0.5 ${isCompact ? 'text-[11px] truncate' : 'text-[13px]'}`}>
                              {bet.isSpecialCombo && (
                                <span className="text-[9px] text-[#f0b90b] font-black tracking-widest uppercase flex items-center gap-1">
                                  <Target className="w-3 h-3" /> ÖZEL SİSTEM SEÇİMİ
                                </span>
                              )}
                              <span>{bet.matchName.replace(' vs ', ' - ')}</span>
                              
                              {/* Show Legs if special combo */}
                              {bet.isSpecialCombo && bet.legs && bet.legs.length > 0 && (
                                <div className="mt-2 flex flex-col gap-1.5 w-[95%]">
                                  {bet.legs.map((leg, idx) => (
                                    <div key={idx} className="bg-black/30 border border-white/5 rounded pl-1.5 pr-2 py-1.5 flex flex-col">
                                      <span className="text-[9px] text-zinc-500 font-bold mb-0.5 truncate">{leg.match.replace(' vs ', ' - ')}</span>
                                      <div className="flex justify-between items-center gap-2">
                                        <span className="text-[10px] text-white font-semibold truncate">{leg.selection}</span>
                                        <span className="text-[9px] text-[#00E5FF] font-black shrink-0">{leg.market}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Delete button (Top Right) */}
                          <button 
                            onClick={() => removeSelection(bet.id)}
                            className={`absolute rounded-md bg-black/20 hover:bg-red-500/20 flex items-center justify-center text-zinc-500 hover:text-red-500 border border-transparent hover:border-red-500/50 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all group/del ${isCompact ? 'right-1 top-1 w-4 h-4' : 'right-2 top-2 w-6 h-6'}`}
                          >
                            <X className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'} group-hover/del:scale-110 transition-transform`} />
                          </button>
                        </div>

                        <div className={`flex items-center justify-between border-t border-white/5 ${isCompact ? 'pl-1.5 pt-1.5' : 'pl-2 pt-2.5'}`}>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-zinc-500 font-semibold uppercase tracking-wider ${isCompact ? 'text-[8px]' : 'text-[10px]'}`}>Seçim:</span>
                            <span className={`text-white font-bold ${isCompact ? 'text-[11px]' : 'text-[13px] ml-0.5'}`}>{bet.selectionName}</span>
                          </div>
                          <div className={`bg-[#0b0e14] rounded border shadow-[0_0_12px_rgba(0,229,255,0.1)] flex items-center justify-center relative overflow-hidden transition-all ${isCompact ? 'px-1.5 py-0.5 min-w-[36px]' : 'px-2.5 py-1 min-w-[50px]'} ${bet.isSpecialCombo ? 'border-[#f0b90b]/40 group-hover:border-[#f0b90b]/80 shadow-[0_0_12px_rgba(240,185,11,0.1)] group-hover:shadow-[0_0_15px_rgba(240,185,11,0.3)]' : 'border-[#00E5FF]/40 group-hover:border-[#00E5FF]/80 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]'}`}>
                            <div className={`absolute inset-0 transition-colors ${bet.isSpecialCombo ? 'bg-[#f0b90b]/5 group-hover:bg-[#f0b90b]/10' : 'bg-[#00E5FF]/5 group-hover:bg-[#00E5FF]/10'}`} />
                            <span className={`font-black relative z-10 ${isCompact ? 'text-[11px]' : 'text-[14px]'} ${bet.isSpecialCombo ? 'text-[#f0b90b] drop-shadow-[0_0_5px_rgba(240,185,11,0.6)]' : 'text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.6)]'}`}>{bet.odd.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BOTTOM SUMMARY & ACTIONS */}
                <div className="shrink-0 flex flex-col bg-[#0A0D14] border-t border-white/10 shadow-[0_-5px_15px_rgba(0,0,0,0.5)] z-20 p-3 md:p-4 gap-3">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-zinc-400 text-[10px] md:text-[11px] font-bold uppercase">{language === 'tr' ? 'Toplam Oran' : 'Total odds'}</span>
                      <span className="text-white font-black text-[15px] md:text-[16px]">{totalOdds.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[#00E5FF] text-[10px] md:text-[11px] font-bold uppercase drop-shadow-[0_0_3px_rgba(0,229,255,0.4)]">{language === 'tr' ? 'Olası Kazanç' : 'Potential Win'}</span>
                      <span className="text-[#00E5FF] font-black text-[15px] md:text-[16px] drop-shadow-[0_0_5px_rgba(0,229,255,0.6)]">{potentialPayout.toFixed(2)} ₺</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 relative">
                     {/* Stamp Animation Overlay */}
                     {showStamp && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-lg">
                          <div className="transform -rotate-12 scale-110 animate-pulse">
                            <div className="border-[2px] border-[#00E5FF] rounded px-3 py-1 bg-[#00E5FF]/10 flex flex-col items-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                              <CheckCircle2 className="w-5 h-5 text-[#00E5FF] mb-1" />
                              <span className="text-[#00E5FF] font-black text-[12px] uppercase drop-shadow-[0_0_3px_rgba(0,229,255,0.5)]">ONAYLANDI</span>
                            </div>
                          </div>
                        </div>
                      )}

                     <div className="flex-1 bg-[#1a1e27]/80 backdrop-blur border border-white/10 rounded-lg overflow-hidden flex h-10 md:h-12 shadow-inner hover:border-white/20 transition-colors focus-within:border-[#00E5FF]/50 focus-within:shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                        <div className="relative flex-1">
                           <style>{`
                             input[type=number]::-webkit-inner-spin-button, 
                             input[type=number]::-webkit-outer-spin-button { 
                               -webkit-appearance: none; 
                               margin: 0; 
                             }
                             input[type=number] {
                               -moz-appearance: textfield;
                             }
                           `}</style>
                           <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00E5FF]/50 font-black text-[13px] md:text-[15px]">₺</div>
                           <input 
                             type="number"
                             value={betAmount || ''}
                             onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                             placeholder="0"
                             className="w-full h-full bg-transparent pl-8 pr-3 text-white font-black text-[15px] md:text-[17px] outline-none placeholder-[#00E5FF]/20"
                           />
                        </div>
                        <div className="flex items-center">
                          <button onClick={() => handleQuickAmount(50)} className="h-full px-3 md:px-4 bg-[#1a1e27] hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.2)] border-l border-white/5 text-zinc-400 font-bold text-[11px] md:text-[12px] transition-all">+50</button>
                          <button onClick={() => handleQuickAmount(200)} className="h-full px-3 md:px-4 bg-[#1a1e27] hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.2)] border-l border-white/5 text-zinc-400 font-bold text-[11px] md:text-[12px] transition-all">+200</button>
                          <button onClick={() => handleQuickAmount(500)} className="h-full px-3 md:px-4 bg-[#1a1e27] hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.2)] border-l border-white/5 text-zinc-400 font-bold text-[11px] md:text-[12px] transition-all">MAX</button>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-2">
                     <button 
                        onClick={() => clearBetSlip()}
                        className="w-10 h-10 md:w-12 md:h-12 bg-[#161920] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 transition-all shrink-0 group"
                        title="Kuponu Temizle"
                      >
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={handlePlaceBet}
                        className="flex-1 h-10 md:h-12 bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] text-[#0A0D14] font-black text-[13px] md:text-[15px] rounded-lg tracking-widest uppercase flex items-center justify-center hover:brightness-110 transition-all gap-1 shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] active:scale-[0.98] relative overflow-hidden group/btn"
                      >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:animate-[shine-sweep_2s_ease-in-out_infinite]" />
                        <span className="relative z-10 flex items-center gap-1">
                          {!siteUser ? (language === 'tr' ? 'Giriş Yap' : 'Login') : (language === 'tr' ? 'Bahis Yap' : 'Place Bet')}
                          {siteUser && <ChevronRight className="w-4 h-4 text-[#0A0D14]" />}
                        </span>
                      </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : activePanel === 'mybets' ? (
          <MyBetsPanel />
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
      <div className={`shrink-0 bg-[#0A0D14] border-t border-white/5 relative z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 overflow-hidden ${activePanel === 'coupon' && betSlip.length > 0 ? 'h-0 p-0 border-t-0 opacity-0' : 'h-[70px] p-3 opacity-100'}`}>
        {activePanel === 'coupon' ? (
          <button onClick={() => setActivePanel('chat')} className="w-full h-[46px] bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(0,229,255,0.4)] hover:shadow-[0_4px_25px_rgba(0,229,255,0.6)] group relative overflow-hidden active:scale-[0.98]">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <MessageCircle className="w-5 h-5 text-[#0A0D14] group-hover:scale-110 transition-transform relative z-10" />
            <span className="text-[#0A0D14] text-[14px] font-black tracking-wide uppercase relative z-10">Sohbete Geç</span>
          </button>
        ) : (
          <div className="flex items-center justify-between w-full h-full px-2 pb-2">
            <button className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white transition-colors flex-1">
              <Home className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-medium tracking-wide">Lobi</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white transition-colors flex-1">
              <Gamepad2 className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-medium tracking-wide">E-Sporlar</span>
            </button>
            <button 
              onClick={() => setActivePanel('mybets')}
              className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white transition-colors flex-1"
            >
              <Flag className={`w-[18px] h-[18px] ${activePanel === 'mybets' ? 'text-[#00E5FF]' : ''}`} />
              <span className={`text-[9px] font-medium tracking-wide ${activePanel === 'mybets' ? 'text-[#00E5FF]' : ''}`}>Bahislerim</span>
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
