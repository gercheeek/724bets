import React, { useState, useEffect } from 'react';
import { Trophy, Star, Target, CheckCircle2, Medal, X, Zap, Crown, Flame, Sparkles } from 'lucide-react';

interface GamificationPanelProps {
  className?: string;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
}

export const GamificationPanel: React.FC<GamificationPanelProps> = ({ className = '', isLoggedIn = false, onLoginClick }) => {
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
      {isLoggedIn ? (
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
            <div className="h-3 w-full bg-[#0A0D14] rounded-full overflow-hidden relative z-10 p-0.5 border border-white/5 shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 relative"
                style={{ width: '90%' }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
              </div>
            </div>
            <div className="mt-2 text-center text-[11px] text-zinc-500 font-medium">Seviye 43 için 500 XP daha kazanmalısın!</div>
          </div>

          {/* Daily Quests */}
          <div className="bg-[#131722] rounded-2xl p-5 border border-white/5 flex flex-col group relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#00FFA3]/5 rounded-full blur-3xl group-hover:bg-[#00FFA3]/10 transition-colors duration-500"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#00FFA3]" />
                <h3 className="text-white font-bold text-base">Günlük Görevler</h3>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 bg-[#0A0D14] px-2 py-1 rounded-md border border-white/5">Yenilenme: 14s 23d</span>
            </div>
            
            <div className="flex-1 flex flex-col gap-3 relative z-10">
              {/* Task 1 - Completed */}
              <div className="bg-[#0A0D14] rounded-xl p-3 border border-[#00FFA3]/20 flex items-center justify-between relative overflow-hidden group/task hover:border-[#00FFA3]/40 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00FFA3]/5 to-transparent opacity-0 group-hover/task:opacity-100 transition-opacity" />
                <div className="flex-1 mr-3 relative z-10">
                  <div className="text-sm text-white font-bold mb-2 group-hover/task:text-[#00FFA3] transition-colors">Blackjack'te 3 Kez 21 Yap</div>
                  <div className="h-1.5 w-full bg-[#131722] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00FFA3] w-full shadow-[0_0_10px_rgba(0,255,163,0.5)]"></div>
                  </div>
                </div>
                <button className="relative z-10 px-4 py-1.5 bg-[#00FFA3] text-black font-black text-xs rounded-lg uppercase tracking-wider hover:bg-white hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,163,0.4)] transition-all active:scale-95">
                  AL
                </button>
              </div>

              {/* Task 2 - In Progress */}
              <div className="bg-[#0A0D14] rounded-xl p-3 border border-white/5 flex items-center justify-between group/task hover:border-violet-500/30 transition-colors">
                <div className="flex-1 mr-3">
                  <div className="text-sm text-white font-bold mb-2 group-hover/task:text-violet-400 transition-colors">Spor'da 50 USDT Bahis Yap</div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-[#131722] rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 w-[40%] shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500">20/50</span>
                  </div>
                </div>
                <div className="text-xs font-black text-violet-400 bg-violet-500/10 px-2 py-1 rounded border border-violet-500/20">50 XP</div>
              </div>

              {/* Task 3 - New */}
              <div className="bg-[#0A0D14] rounded-xl p-3 border border-white/5 flex items-center justify-between group/task hover:border-fuchsia-500/30 transition-colors">
                <div className="flex-1 mr-3">
                  <div className="text-sm text-white font-bold mb-2 group-hover/task:text-fuchsia-400 transition-colors">Üst Üste 5 El Kazan</div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-[#131722] rounded-full overflow-hidden">
                      <div className="h-full bg-fuchsia-500 w-[20%] shadow-[0_0_10px_rgba(217,70,239,0.5)]"></div>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500">1/5</span>
                  </div>
                </div>
                <div className="text-xs font-black text-fuchsia-400 bg-fuchsia-500/10 px-2 py-1 rounded border border-fuchsia-500/20">100 XP</div>
              </div>
            </div>
          </div>

          {/* Achievements/Badges */}
          <div className="bg-[#131722] rounded-2xl p-5 border border-white/5 flex flex-col group relative overflow-hidden">
             <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#f0b90b]/5 rounded-full blur-3xl group-hover:bg-[#f0b90b]/10 transition-colors duration-500"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#f0b90b]" />
                <h3 className="text-white font-bold text-base">Rozetler & Başarımlar</h3>
              </div>
              <button className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 hover:text-white transition-colors">Tümünü Gör</button>
            </div>
            
            <div className="flex-1 grid grid-cols-3 gap-3 relative z-10">
              <div className="bg-gradient-to-b from-[#f0b90b]/10 to-[#0A0D14] rounded-xl p-3 border border-[#f0b90b]/20 flex flex-col items-center justify-center gap-2 text-center group/badge hover:-translate-y-1 transition-transform cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#f0b90b]/20 flex items-center justify-center border border-[#f0b90b]/40 shadow-[0_0_15px_rgba(240,185,11,0.2)] group-hover/badge:shadow-[0_0_20px_rgba(240,185,11,0.4)] transition-shadow">
                  <Flame className="w-5 h-5 text-[#f0b90b]" />
                </div>
                <span className="text-[10px] font-bold text-[#f0b90b] leading-tight">Kusursuz Seri</span>
              </div>

              <div className="bg-gradient-to-b from-blue-500/10 to-[#0A0D14] rounded-xl p-3 border border-blue-500/20 flex flex-col items-center justify-center gap-2 text-center group/badge hover:-translate-y-1 transition-transform cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover/badge:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-shadow">
                  <Trophy className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-[10px] font-bold text-blue-400 leading-tight">Spor Kurdu</span>
              </div>

              <div className="bg-[#0A0D14] rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center gap-2 text-center opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Zap className="w-5 h-5 text-zinc-500" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 leading-tight">Jackpot Avcısı</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 md:p-12 relative overflow-hidden">
          {/* Decorative background elements for CTA */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00FFA3]/5 rounded-full blur-[80px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
                <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-wider">Özel Ödül Sistemi</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight font-['Outfit']">
                Oynadıkça Kazan, <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFA3] to-[#00B8FF]">Seviye Atla!</span>
              </h3>
              <p className="text-zinc-400 text-sm md:text-base mb-8 max-w-lg mx-auto md:mx-0">
                724Bets Görevler ve Kariyer sistemine katılarak günlük görevleri tamamlayın, 
                XP toplayın ve seviye atladıkça nakit ödüller, bedava dönüşler ve VIP ayrıcalıklarının kilidini açın.
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <button 
                  onClick={onLoginClick}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all active:scale-95 flex items-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Kariyerine Başla
                </button>
                <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00FFA3]" />
                    <span>Günlük Ödüller</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00FFA3]" />
                    <span>Özel Rozetler</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual Teaser */}
            <div className="w-full max-w-xs relative perspective-1000">
              <div className="relative transform rotate-y-[-15deg] rotate-x-[10deg] group hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-xl" />
                <div className="bg-[#131722] border border-white/10 rounded-2xl p-5 relative z-10 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-bold text-zinc-400">Örnek Görev</div>
                    <div className="text-xs font-black text-[#00FFA3] bg-[#00FFA3]/10 px-2 py-1 rounded">200 XP</div>
                  </div>
                  <div className="text-sm text-white font-bold mb-4">Bugün 3 Farklı Slot Oyunu Dene</div>
                  <div className="h-2 w-full bg-[#0A0D14] rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-[#00FFA3] to-[#00B8FF] w-[66%] relative">
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] font-bold text-zinc-500">2 / 3 Tamamlandı</div>
                  
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/40">
                      <Flame className="w-5 h-5 text-fuchsia-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Rozet Kazan</div>
                      <div className="text-[10px] text-zinc-500">Yeni başarı kilidi</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
