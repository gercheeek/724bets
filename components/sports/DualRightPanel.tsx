import React, { useState } from 'react';
import { ChevronDown, X, MessageCircle, Trash2, RefreshCcw, Home, Gamepad2, Flag, FileText, Search, ChevronRight, Share2, Target, CheckCircle2, Zap } from 'lucide-react';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { useUser } from '../../contexts/UserContext';
import { triggerGlobalToast } from '../GlobalToaster';
import ModernChat from '../ModernChat';
import { useTranslation } from 'react-i18next';
import { MiniGamesSidebar, GamepadIcon } from '../MiniGamesSidebar';
import { supabase } from '../../utils/supabase';

const MyBetsPanel = ({ siteUser, onShare }: { siteUser: any, onShare: (msg: string) => void }) => {
  const [activeBets, setActiveBets] = useState<any[]>([]);
  const [isCashingOut, setIsCashingOut] = useState<string | null>(null);

  const fetchBets = async () => {
    if (!siteUser) return;
    try {
        const { data: betsData, error } = await supabase
          .from('sports_bets')
          .select('*')
          .eq('user_id', siteUser.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (betsData) {
            // Only show PENDING bets in active sidebar
            const pendingBets = betsData.filter((b: any) => b.status?.toLowerCase() === 'pending');
            const formatted = pendingBets.map((b: any) => {
                const selections = Array.isArray(b.selections) ? b.selections : [];
                return {
                  id: b.id,
                  type: selections.length > 1 ? 'KOMBİNE BAHİS' : 'TEKLİ BAHİS',
                  title: selections.length > 1 ? 'Kombine Kupon' : (selections[0] ? `${selections[0].teamHome || selections[0].homeTeam} vs. ${selections[0].teamAway || selections[0].awayTeam}` : 'Bahis'),
                  picks: selections.map((i: any) => ({ text: i.selection || i.selectionName, detail: `${i.teamHome || i.homeTeam} - ${i.teamAway || i.awayTeam}` })),
                  odds: Number(b.odd).toFixed(2),
                  stake: `${Number(b.bet_amount).toFixed(2)} ₺`,
                  potentialWin: `${Number(b.potential_win).toFixed(2)} ₺`,
                  cashoutValue: `${(Number(b.bet_amount) * 0.95).toFixed(2)} ₺`,
                  rawAmount: Number(b.bet_amount),
                  isLive: false,
                  score: '',
                  minute: ''
                };
            });
            setActiveBets(formatted);
        }
    } catch (e) {
        console.error("Fetch bets failed", e);
    }
  };

  React.useEffect(() => {
      fetchBets();
  }, [siteUser]);

  const handleCashout = async (betId: string) => {
      alert("Bu özellik şu an bakımda.");
  };

  if (activeBets.length === 0) {
      return (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] text-center p-6 gap-3">
              <Target className="w-12 h-12 text-zinc-700 mb-2" />
              <h3 className="text-white font-bold text-sm">Aktif Bahsiniz Yok</h3>
              <p className="text-zinc-500 text-xs">Mevcut devam eden bir kuponunuz bulunmamaktadır.</p>
          </div>
      );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-black flex flex-col p-3 gap-4">
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[color:var(--theme-accent)] rounded-full flex items-center justify-center shadow-[0_0_10px_#06b6d4]">
            <Target className="w-3 h-3 text-black" />
          </div>
          <h3 className="text-white font-bold text-sm">Aktif Bahislerim</h3>
        </div>
        <span className="text-[10px] text-zinc-400 font-bold bg-white/5 px-2 py-1 rounded">{activeBets.length} KUPON</span>
      </div>

      {activeBets.map((bet) => (
        <div key={bet.id} className="relative bg-[#0d1017] border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-[color:var(--theme-accent)]/30 transition-colors">
          {/* Header */}
          <div className="p-3 pb-2 flex items-center justify-between border-b border-white/5 bg-[#12161e]">
            <span className="text-[color:var(--theme-accent)] text-[10px] uppercase font-black tracking-wider">
              {bet.type}
            </span>
            {bet.isLive && (
              <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold text-red-500">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                CANLI {bet.minute}
              </div>
            )}
          </div>

          {/* Title & Live Score */}
          <div className="p-3 flex items-center justify-between gap-2">
            <h4 className="text-white font-bold text-[13px] leading-tight flex-1">{bet.title}</h4>
            {bet.isLive && (
              <div className="text-[#10b981] font-black text-lg bg-[#10b981]/10 px-3 py-1 rounded-md border border-[#10b981]/20">
                {bet.score}
              </div>
            )}
          </div>

          {/* Picks */}
          <div className="px-3 pb-3 flex flex-col gap-2">
            {bet.picks.map((pick: any, i: number) => (
              <div key={i} className="flex flex-col relative pl-2 border-l-2 border-[color:var(--theme-accent)]">
                <span className="text-white text-[12px] font-bold">{pick.text}</span>
                <span className="text-zinc-500 text-[11px] font-medium">{pick.detail}</span>
              </div>
            ))}
          </div>

          {/* Odds Footer & Actions */}
          <div className="bg-[#151a24] p-3 flex flex-col gap-3 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-xs font-medium">Toplam Oran:</span>
              <span className="text-white font-black text-sm">{bet.odds}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-xs font-medium">Bahis Miktarı:</span>
              <span className="text-white font-bold text-sm">{bet.stake}</span>
            </div>
            <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5 mb-1">
              <span className="text-zinc-400 text-xs font-medium">Olası Kazanç:</span>
              <span className="text-[#10b981] font-black text-base">{bet.potentialWin}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-1">
                {/* Admin/Test Settle Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={async () => {
                      try {
                        const { data, error } = await supabase.rpc('settle_sports_bet', { p_bet_id: bet.id, p_status: 'won' });
                        if (error) throw error;
                        triggerGlobalToast({ type: 'success', message: 'Kupon Kazandı Olarak İşaretlendi!' });
                        fetchBets();
                      } catch(e) {
                        triggerGlobalToast({ type: 'warning', message: 'Sonuçlandırma hatası.' });
                      }
                    }}
                    className="flex-1 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white font-bold rounded text-xs border border-green-500/30 transition-colors"
                  >KAZAN</button>
                  <button 
                    onClick={async () => {
                      try {
                        const { data, error } = await supabase.rpc('settle_sports_bet', { p_bet_id: bet.id, p_status: 'lost' });
                        if (error) throw error;
                        triggerGlobalToast({ type: 'warning', message: 'Kupon Kaybetti Olarak İşaretlendi!' });
                        fetchBets();
                      } catch(e) {
                        triggerGlobalToast({ type: 'warning', message: 'Sonuçlandırma hatası.' });
                      }
                    }}
                    className="flex-1 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded text-xs border border-red-500/30 transition-colors"
                  >KAYBET</button>
                </div>
                
                <div className="flex gap-2">
                <button 
                  onClick={() => {
                    if (window.confirm(`Bahis bozdurma işlemini onaylıyor musunuz?`)) {
                        handleCashout(bet.id);
                    }
                  }}
                  disabled={isCashingOut === bet.id}
                  className="flex-1 py-2.5 bg-[color:var(--theme-accent)] hover:bg-[#33FFB5] text-black font-black uppercase tracking-wide text-[11px] rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,255,163,0.15)] hover:shadow-[0_0_20px_rgba(0,255,163,0.3)] disabled:opacity-50"
                >
                  <RefreshCcw className={`w-3.5 h-3.5 ${isCashingOut === bet.id ? 'animate-spin' : ''}`} />
                  <span>{isCashingOut === bet.id ? 'BOZDURULUYOR...' : `BAHİS BOZDUR`}</span>
                </button>
              <button 
                onClick={() => {
                  const payload = {
                    id: bet.id,
                    type: bet.type,
                    title: bet.title,
                    picks: bet.picks,
                    odds: bet.odds,
                    stake: bet.stake,
                    win: bet.potentialWin,
                    isLive: bet.isLive,
                    score: bet.score,
                    minute: bet.minute
                  };
                  onShare(`[BET_SHARE:${JSON.stringify(payload)}]`);
                }}
                className="w-10 flex items-center justify-center bg-[#1A212D] border border-white/5 hover:border-[color:var(--theme-accent)]/50 hover:bg-[#202836] text-white rounded-lg transition-colors group"
                title="Kuponu Sohbette Paylaş"
              >
                <Share2 className="w-4 h-4 text-zinc-400 group-hover:text-[color:var(--theme-accent)] transition-colors" />
              </button>
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
  currentView?: string;
  userRole?: 'admin' | 'moderator' | 'user' | null;
}> = ({ language, isOpenMobile, onCloseMobile, currentView, userRole }) => {
  const { t } = useTranslation();
  const { betSlip, betAmount, setBetAmount, removeSelection, clearBetSlip, totalOdds, potentialPayout, accumulatorBoost, betType, setBetType, isLocked, isTurboMode, setIsTurboMode } = useBetSlip();
  const { siteUser, placeBet } = useUser();
  const [activePanel, setActivePanel] = useState<'coupon' | 'chat' | 'mybets' | 'minigames'>('chat');
  const [showStamp, setShowStamp] = useState(false);
  const [isConfirmingBet, setIsConfirmingBet] = useState(false);

  const isSports = ['sports', 'spor724', 'canli-bahis', 'gercek', 'spor', 'upcomingMatches'].includes(currentView || 'sports');

  React.useEffect(() => {
    setIsConfirmingBet(false);
  }, [betSlip, betAmount]);

  React.useEffect(() => {
    if (isTurboMode) {
      document.body.classList.add('turbo-mode-active');
    } else {
      document.body.classList.remove('turbo-mode-active');
    }
    return () => document.body.classList.remove('turbo-mode-active');
  }, [isTurboMode]);

  React.useEffect(() => {
    if (!isSports) {
      setActivePanel('chat');
    }
  }, [isSports]);

  const prevBetSlipLen = React.useRef(betSlip.length);
  React.useEffect(() => {
    if (prevBetSlipLen.current === 0 && betSlip.length > 0) {
      setActivePanel('coupon');
    } else if (prevBetSlipLen.current > 0 && betSlip.length === 0) {
      setActivePanel('chat');
    }
    prevBetSlipLen.current = betSlip.length;
  }, [betSlip.length]);

  React.useEffect(() => {
    const handleSetChat = () => setActivePanel('chat');
    const handleSetCoupon = () => setActivePanel('coupon');
    const handleSetMyBets = () => setActivePanel('mybets');
    window.addEventListener('setRightPanelToChat', handleSetChat);
    window.addEventListener('openBetSlip', handleSetCoupon);
    window.addEventListener('open-betslip', handleSetCoupon);
    window.addEventListener('setRightPanelToMyBets', handleSetMyBets);
    return () => {
      window.removeEventListener('setRightPanelToChat', handleSetChat);
      window.removeEventListener('openBetSlip', handleSetCoupon);
      window.removeEventListener('open-betslip', handleSetCoupon);
      window.removeEventListener('setRightPanelToMyBets', handleSetMyBets);
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
        // Event for opening my bets is triggered inside UserContext.tsx upon success
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
    
    <div className={`fixed xl:static top-0 right-0 h-full z-50 flex flex-col shrink-0 ${isSports ? 'bg-[#0a0e17]/90 backdrop-blur-2xl border-l border-white/5 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]' : 'bg-[#050505]/90 backdrop-blur-2xl border-l border-white/5 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]'} transition-all duration-300 ${isOpenMobile ? 'translate-x-0 w-[350px]' : 'translate-x-full xl:translate-x-0'} xl:w-full w-[350px]`}>
      
      {/* ── Desktop Tab & Chat/BetSlip Content ── */}
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden bg-transparent">
        {activePanel === 'coupon' ? (
          <>
            {/* PREMIUM BET SLIP HEADER */}
            <div className="bg-transparent border-b border-white/5 px-2 py-1.5 flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5 cursor-pointer group flex-1" onClick={() => { if (onCloseMobile) onCloseMobile(); }}>
                <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                  <FileText className="w-4 h-4 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]" />
                  <span className="text-white font-extrabold text-[12px] tracking-wide ml-1">{t('bet_slip.title')}</span>
                </div>
                {betSlip.length > 0 && (
                    <span className="w-4 h-4 bg-white text-black text-[8px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      {betSlip.length}
                    </span>
                  )}
                <ChevronDown className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
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

                  <div className="flex items-center gap-1.5 cursor-pointer px-2 py-1.5 rounded-full hover:bg-white/5 transition-all group/turbo" onClick={() => setIsTurboMode(!isTurboMode)}>
                    <span className={`font-black text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 ${isTurboMode ? 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'text-zinc-500 group-hover/turbo:text-white'}`}>
                      <Zap className={`w-3 h-3 ${isTurboMode ? 'text-red-500 fill-red-500 animate-pulse' : 'text-zinc-500'}`} />
                      TURBO
                    </span>
                    <div className={`w-8 h-4 rounded-full p-[2px] transition-colors relative shadow-inner ${isTurboMode ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] border-red-400' : 'bg-[#1a1a1a] border border-white/10'}`}>
                      <div className={`w-3 h-3 rounded-full transition-transform duration-300 ${isTurboMode ? 'translate-x-4 bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]' : 'translate-x-0 bg-zinc-400'}`}></div>
                    </div>
                  </div>
              </div>
            </div>

            {/* TABS (Premium Segmented Control) */}
            <div className="px-3 py-3 bg-transparent">
              <div className="flex items-center p-1 bg-[#131823] rounded-xl border border-white/5 relative shadow-inner h-[46px]">
                <div 
                  className="absolute top-1 bottom-1 w-[calc(33.333%-4px)] bg-[#1e2638] rounded-lg shadow-md transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" 
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
                    className={`flex-1 h-full text-[11px] uppercase tracking-wider font-extrabold rounded-lg transition-all duration-300 relative z-10 ${betType === type ? 'text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]' : 'text-zinc-500'} ${isLocked && betType !== type ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
                    disabled={isLocked && betType !== type}
                  >
                    {t(`bet_slip.types.${type}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* ACCUMULATOR BOOST PROGRESS BAR */}
            {betSlip.length > 0 && betType === 'kombine' && (
              <div className="px-1.5 py-1 bg-gradient-to-b from-[#111]/80 to-[#0A0D14] backdrop-blur border-b border-white/5 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[7px] text-zinc-400 font-bold tracking-wide uppercase">{t('bet_slip.combo_bonus')}</span>
                  </div>
                  <span className="text-[9px] font-black text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">+{Math.round(accumulatorBoost * 100)}%</span>
                </div>
                <div className="w-full bg-[#161920] h-1 rounded-full overflow-hidden flex relative border border-white/5">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00E5FF]/40 via-[#00E5FF] to-[#00E5FF] transition-all duration-500 shadow-[0_0_10px_#00E5FF]" style={{ width: `${Math.min(100, (betSlip.length / 5) * 100)}%` }}>
                     <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,0)_100%)] animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <div className="flex justify-between text-[7px] text-zinc-600 font-black px-1 mt-px">
                  <span className={`transition-colors ${betSlip.length >= 3 ? 'text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]' : ''}`}>{t('bet_slip.matches_3')}</span>
                  <span className={`transition-colors ${betSlip.length >= 4 ? 'text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]' : ''}`}>{t('bet_slip.matches_4')}</span>
                  <span className={`transition-colors ${betSlip.length >= 5 ? 'text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]' : ''}`}>{t('bet_slip.matches_5')}</span>
                </div>
              </div>
            )}

            {/* BET LIST */}
            {betSlip.length === 0 ? (
              <div className="flex-1 relative flex flex-col items-center justify-center text-center bg-[#050505] overflow-hidden">
                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <div className="text-[150px] font-black italic tracking-tighter mix-blend-overlay">724</div>
                </div>
                
                {/* Glowing Center Icon */}
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#00E5FF]/10 to-transparent flex items-center justify-center mb-6 border border-[#00E5FF]/20 shadow-[0_0_40px_rgba(0,229,255,0.1)] group">
                  <div className="absolute inset-0 rounded-full border border-[#00E5FF]/30 blur-sm animate-pulse"></div>
                  <Target className="w-10 h-10 text-[#00E5FF]/80 drop-shadow-[0_0_15px_rgba(0,229,255,0.8)] group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-white font-black text-[16px] tracking-wide mb-2 uppercase z-10">
                  {t('bet_slip.empty_title')}
                </h3>
                <p className="text-zinc-500 font-medium text-[13px] max-w-[220px] leading-relaxed z-10">
                  Oranların üzerine tıklayarak bahislerinizi kupona ekleyebilirsiniz.
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
                <div className="shrink-0 flex flex-col bg-transparent border-t border-white/10 shadow-[0_-5px_15px_rgba(0,0,0,0.5)] z-20 p-3 md:p-4 gap-3">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-zinc-400 text-[10px] md:text-[11px] font-bold uppercase">{t('bet_slip.total_odds')}</span>
                      <span className="text-white font-black text-[15px] md:text-[16px]">{totalOdds.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#00E5FF] text-[10px] md:text-[11px] font-bold uppercase drop-shadow-[0_0_3px_rgba(0,229,255,0.4)]">{t('bet_slip.potential_win')}</span>
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
                     {!isConfirmingBet ? (
                       <>
                         <button 
                            onClick={() => clearBetSlip()}
                            className="w-10 h-10 md:w-12 md:h-12 bg-[#161920] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 transition-all shrink-0 group"
                            title="Kuponu Temizle"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button 
                            onClick={() => siteUser ? setIsConfirmingBet(true) : handlePlaceBet()}
                            className="flex-1 h-10 md:h-12 bg-gradient-to-r from-[#10B981] to-[#059669] text-black font-black text-[13px] md:text-[15px] rounded-lg tracking-widest uppercase flex items-center justify-center hover:from-[#00FFFF] hover:to-[#00b3e6] transition-all gap-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_0_30px_rgba(16,185,129,0.6)] active:scale-[0.98] relative overflow-hidden group/btn border border-white/20"
                          >
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:animate-[shine-sweep_2s_ease-in-out_infinite]" />
                            <span className="relative z-10 flex items-center gap-1">
                              {!siteUser ? t('bet_slip.login_to_bet') : t('bet_slip.place_bet')}
                              {siteUser && <ChevronRight className="w-4 h-4 text-black" />}
                            </span>
                          </button>
                       </>
                     ) : (
                       <div className="w-full flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                         <button 
                            onClick={() => setIsConfirmingBet(false)}
                            className="flex-1 h-10 md:h-12 bg-[#161920] border border-white/10 hover:border-white/20 text-white font-bold text-[13px] rounded-lg transition-all"
                          >
                            İptal
                          </button>
                          <button 
                            onClick={() => {
                              setIsConfirmingBet(false);
                              handlePlaceBet();
                            }}
                            className="flex-[2] h-10 md:h-12 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-black text-[13px] md:text-[15px] rounded-lg tracking-widest uppercase flex items-center justify-center hover:brightness-110 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] active:scale-[0.98] gap-1"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Onayla
                          </button>
                       </div>
                     )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : activePanel === 'mybets' ? (
          <MyBetsPanel 
            siteUser={siteUser}
            onShare={(msg) => {
              setActivePanel('chat');
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('shareBetEvent', { detail: { message: msg } }));
              }, 150);
            }} 
          />
        ) : activePanel === 'minigames' ? (
          <MiniGamesSidebar />
        ) : (
          <ModernChat 
            open={true}
            onClose={() => {
              if (onCloseMobile) onCloseMobile();
            }}
            siteUser={siteUser}
            userRole={userRole}
            isMobile={isOpenMobile || false}
            botsConfig={[]}
          />
        )}
      </div>

      {/* ═══════════ STICKY BOTTOM TOGGLE BAR (SPORTS ONLY) ═══════════ */}
      {isSports && (
        <div className={`shrink-0 ${isSports ? 'bg-transparent backdrop-blur-md' : 'bg-transparent backdrop-blur-md'} border-t border-white/5 relative z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden h-[70px] p-3 opacity-100`}>
          <div className="flex items-center justify-between w-full h-full bg-white/5 p-1 rounded-xl border-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            
            <button 
              onClick={() => setActivePanel('chat')}
              className={`flex items-center justify-center gap-2 flex-1 h-full rounded-lg transition-all ${activePanel === 'chat' ? 'bg-[color:var(--theme-accent)]/15 text-[color:var(--theme-accent)] shadow-[inset_0_0_15px_var(--theme-accent-glow)] font-bold border-none' : 'text-zinc-500 hover:text-white hover:bg-white/5 font-medium'}`}
            >
              <MessageCircle className={`w-[18px] h-[18px] ${activePanel === 'chat' ? 'text-[color:var(--theme-accent)]' : ''}`} />
              <span className="text-[12px] tracking-wide hidden sm:block md:hidden 2xl:block">Sohbet</span>
            </button>
            
            <button 
              onClick={() => setActivePanel('coupon')}
              className={`flex items-center justify-center gap-2 flex-1 h-full rounded-lg transition-all relative ${activePanel === 'coupon' ? 'bg-[#10b981]/15 text-[#10b981] shadow-[inset_0_0_15px_rgba(16,185,129,0.2)] font-bold border-none' : 'text-zinc-500 hover:text-white hover:bg-white/5 font-medium'}`}
            >
              <div className="relative">
                <FileText className={`w-[18px] h-[18px] ${activePanel === 'coupon' ? 'text-[#10b981]' : ''}`} />
                {betSlip.length > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-3.5 h-3.5 bg-[#10b981] text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                    {betSlip.length}
                  </span>
                )}
              </div>
              <span className="text-[12px] tracking-wide hidden sm:block md:hidden 2xl:block">{t('nav.bet_slip', 'Kupon')}</span>
            </button>
            
          </div>
        </div>
      )}
    </div>
    </>
  );
};
