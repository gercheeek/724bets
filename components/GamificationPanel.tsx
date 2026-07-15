import React, { useState, useEffect } from 'react';
import { Trophy, Star, Target, CheckCircle2, Medal, X, Zap, Crown, Flame } from 'lucide-react';

interface GamificationPanelProps {
  className?: string;
}

export const GamificationPanel: React.FC<GamificationPanelProps> = ({ className = '' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`w-full bg-[#0A0D14] rounded-2xl md:rounded-3xl border border-white/5 shadow-xl overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-5 md:p-6 bg-[#131722]/50 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-black text-xl leading-tight font-['Outfit']">Kariyer & Görevler</h2>
            <p className="text-zinc-400 text-sm font-semibold">VIP Silver Üye</p>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6 flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Level Progress */}
          <div className="bg-[#131722] rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex justify-between items-end mb-3 relative z-10">
              <div>
                <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Mevcut Seviye</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-['Outfit']">42</span>
                  <span className="text-sm text-fuchsia-400 font-bold">Yıldız Oyuncu</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-sm">4,500 <span className="text-zinc-500 text-xs">/ 5,000 XP</span></div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden relative z-10 p-0.5">
              <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full w-[90%] relative">
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <p className="text-zinc-500 text-xs font-medium mt-3 text-center relative z-10">Seviye 43 için 500 XP daha kazanmalısın!</p>
          </div>

          {/* Daily Quests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-black text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-[#00FFA3]" />
                Günlük Görevler
              </h3>
              <span className="text-zinc-500 text-xs font-bold bg-white/5 px-2 py-1 rounded-md">Yenilenme: 14s 23d</span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Quest 1 (Completed) */}
              <div className="bg-[#131722] p-4 rounded-xl border border-[#00FFA3]/20 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-[#00FFA3]/5 blur-3xl rounded-full" />
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm mb-1">Blackjack'te 3 Kez 21 Yap</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#00FFA3] w-full" />
                      </div>
                      <span className="text-[#00FFA3] text-xs font-bold whitespace-nowrap">3/3</span>
                    </div>
                  </div>
                  <button className="ml-4 bg-[#00FFA3] text-black font-black text-xs px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(0,255,163,0.3)] hover:scale-105 transition-transform animate-pulse">
                    AL
                  </button>
                </div>
              </div>

              {/* Quest 2 (In Progress) */}
              <div className="bg-[#131722] p-4 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm mb-1">Spor'da 50 USDT Bahis Yap</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 w-[40%]" />
                      </div>
                      <span className="text-zinc-400 text-xs font-bold whitespace-nowrap">20/50</span>
                    </div>
                  </div>
                  <div className="ml-4 text-xs font-bold text-zinc-500 px-3 py-1.5 bg-black/30 rounded-lg">
                    50 XP
                  </div>
                </div>
              </div>

              {/* Quest 3 (In Progress) */}
              <div className="bg-[#131722] p-4 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm mb-1">Üst Üste 5 El Kazan</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-fuchsia-500 w-[20%]" />
                      </div>
                      <span className="text-zinc-400 text-xs font-bold whitespace-nowrap">1/5</span>
                    </div>
                  </div>
                  <div className="ml-4 text-xs font-bold text-zinc-500 px-3 py-1.5 bg-black/30 rounded-lg">
                    100 XP
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges / Medals */}
          <div>
            <div className="flex items-center justify-between mb-4 mt-2">
              <h3 className="text-white font-black text-lg flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-400" />
                Rozetler & Başarımlar
              </h3>
              <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">Tümünü Gör</button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Badge 1 (Unlocked) */}
              <div className="bg-gradient-to-b from-[#1a1814] to-[#0A0D14] border border-amber-500/30 rounded-xl p-3 flex flex-col items-center justify-center text-center relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Flame className="w-6 h-6 text-amber-400" />
                </div>
                <span className="text-white text-xs font-bold leading-tight mt-1">Kusursuz<br/>Seri</span>
              </div>

              {/* Badge 2 (Unlocked) */}
              <div className="bg-gradient-to-b from-[#14151a] to-[#0A0D14] border border-blue-500/30 rounded-xl p-3 flex flex-col items-center justify-center text-center relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <Trophy className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-white text-xs font-bold leading-tight mt-1">Spor<br/>Kurdu</span>
              </div>

              {/* Badge 3 (Locked) */}
              <div className="bg-[#131722] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center relative group cursor-pointer opacity-50 grayscale hover:opacity-75 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-zinc-500" />
                </div>
                <span className="text-zinc-500 text-xs font-bold leading-tight mt-1">Jackpot<br/>Avcısı</span>
              </div>
            </div>
          </div>

      </div>
    </div>
  );
};
