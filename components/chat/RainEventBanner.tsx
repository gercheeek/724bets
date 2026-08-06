import React from 'react';
import { useRainEvent } from '../../hooks/useRainEvent';
import ClaimSlider from './ClaimSlider';
import { Sparkles, Users, Clock } from 'lucide-react';

const RainEventBanner: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const { activeEvent, timeLeft, participantsCount, hasClaimed, claimRain } = useRainEvent();

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
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-[#00E5FF]/20 to-emerald-500/20 blur-xl rounded-full"></div>
      
      {/* Glassmorphism Container */}
      <div className="relative bg-[#06080C]/80 backdrop-blur-xl border border-[#00E5FF]/30 shadow-[0_8px_32px_rgba(0,229,255,0.15)] rounded-2xl overflow-hidden p-3 flex flex-col gap-3 animate-in slide-in-from-top-4 duration-500">
        
        {/* Header / Info Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-[#00E5FF]/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Sparkles className="w-4 h-4 text-[#00E5FF] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ödül Havuzu</span>
              <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#00E5FF]">
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
            <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-black uppercase tracking-widest shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
              <Sparkles className="w-4 h-4" /> Başarıyla Toplandı
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
