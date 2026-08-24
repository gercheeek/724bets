import React from 'react';
import { useRainEvent } from '../../hooks/useRainEvent';
import ClaimSlider from './ClaimSlider';
import { Sparkles, Users, Clock } from 'lucide-react';

const RainEventBanner: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const { activeEvent, timeLeft, participantsCount, hasClaimed, claimRain } = useRainEvent(currentUserId);

  if (!activeEvent || timeLeft === null) return null;

  // Format Time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleClaim = async () => {
    try {
      await claimRain(currentUserId);
      if (navigator.vibrate) navigator.vibrate(50);
    } catch (err: any) {
      alert(err.message || 'Bir hata oluştu.');
    }
  };

  return (
    <div className="sticky top-0 z-[60] mx-2 mt-2 mb-4">
      {/* Glow Effect Background */}
      <div className="absolute inset-0 bg-[#10B981]/10 blur-2xl rounded-full pointer-events-none"></div>
      
      {/* Glassmorphism Container */}
      <div className="relative bg-gradient-to-br from-[#1A2436]/90 to-[#101623]/90 backdrop-blur-xl border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden p-4 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-500">
        
        {/* Header / Info Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 flex items-center justify-center border border-[#10B981]/30 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-5 h-5 text-[#10B981] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ödül Havuzu</span>
              <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                ₺{activeEvent.total_amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1"><Users className="w-3 h-3" /> Katılım</span>
              <span className="text-xs font-bold text-white">{participantsCount} Kişi</span>
            </div>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex flex-col items-end min-w-[45px]">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1"><Clock className="w-3 h-3" /> Süre</span>
              <span className={`text-xs font-black ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="relative z-10 w-full">
          {hasClaimed ? (
            <div className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-[#10B981]/10 via-[#34D399]/20 to-[#10B981]/10 border border-[#10B981]/30 rounded-2xl shadow-[inset_0_0_15px_rgba(16,185,129,0.1),0_0_10px_rgba(16,185,129,0.2)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
              <Sparkles className="w-4 h-4 text-[#34D399] animate-pulse" />
              <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#10B981] tracking-widest drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                KATILDINIZ
              </span>
            </div>
          ) : (
            <ClaimSlider onClaim={handleClaim} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RainEventBanner;
