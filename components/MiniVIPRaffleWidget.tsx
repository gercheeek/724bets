import React, { useState } from 'react';
import { X, Flame, Trophy, Star, Gift, Ticket, ChevronRight } from 'lucide-react';

interface MiniVIPRaffleWidgetProps {
  onViewChange: (view: string) => void;
}

const MiniVIPRaffleWidget: React.FC<MiniVIPRaffleWidgetProps> = ({ onViewChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* COMPACT MINI WIDGET (Sidebar) */}
      <div className="relative flex flex-col rounded-[14px] border border-white/5 hover:border-yellow-500/40 bg-black/90 p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] transition-all duration-500 overflow-hidden w-full group backdrop-blur-xl">
        
        {/* Animated Diagonal Shine */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine-sweep_2s_ease-in-out] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] pointer-events-none z-10"></div>

        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/15 blur-[30px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-orange-500/10 blur-[30px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>

        {/* Header Badge */}
        <div className="flex items-center gap-1.5 mb-2.5 relative z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">Yılın VIP Etkinliği</span>
        </div>

        {/* Title */}
        <h4 className="text-[15px] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 mb-3 drop-shadow-[0_2px_10px_rgba(234,179,8,0.3)] tracking-tight">
          20.000$ Ödül Havuzu
        </h4>

        {/* FOMO Progress Bar */}
        <div className="flex flex-col gap-1.5 mb-4 relative z-10">
          <div className="flex justify-between items-end">
            <span className="text-[11px] font-bold text-zinc-200">Son 85 Bilet!</span>
            <span className="text-[10px] font-bold text-zinc-500">415/500</span>
          </div>
          <div className="h-2 w-full bg-zinc-900/80 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] border border-white/5">
            <div className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 w-[83%] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] relative">
              <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay"></div>
            </div>
          </div>
        </div>

        {/* Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:brightness-110 hover:scale-[1.02] shadow-[0_5px_15px_rgba(234,179,8,0.25)] hover:shadow-[0_5px_20px_rgba(234,179,8,0.4)] transition-all duration-300 text-xs font-black flex items-center justify-center gap-1.5 group/btn relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-1">
            Detaylar & Katıl
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-[shine-sweep_1.5s_ease-in-out_infinite] skew-x-[-20deg]"></div>
        </button>
      </div>

      {/* CAMPAIGN MODAL (Pop-up) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
            
            {/* Modal Header Decoration */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
              
              {/* Modal Title Area */}
              <div className="text-center mb-8 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-500/20 blur-[50px] rounded-full pointer-events-none"></div>
                <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 drop-shadow-md mb-2 relative z-10">
                  $20.000 Ödül Havuzu
                </h2>
                <p className="text-zinc-300 font-bold text-sm md:text-base relative z-10">
                  Toplam 120 Kişi Kazanacak!
                </p>
              </div>

              {/* Packages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Standard Package */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center text-center hover:border-zinc-700 transition-colors">
                  <h3 className="text-lg font-bold text-zinc-100 mb-1">Şanslı Başlangıç</h3>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                    <span className="font-bold text-white">100$</span> Yatırım = <span className="font-bold text-white">1 Bilet</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
                    <Ticket className="w-6 h-6 text-zinc-400" />
                  </div>
                </div>

                {/* VIP Mega Advantage Package */}
                <div className="relative bg-zinc-900 border-2 border-yellow-500/80 rounded-xl p-5 flex flex-col items-center text-center shadow-[0_0_30px_rgba(234,179,8,0.15)] transform md:-translate-y-2">
                  <div className="absolute -top-3 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Flame className="w-3 h-3" /> En Popüler
                  </div>
                  
                  <h3 className="text-lg font-black text-yellow-400 mb-1 drop-shadow-sm">MEGA AVANTAJ</h3>
                  <div className="flex items-center gap-2 text-zinc-300 text-sm mb-4">
                    <span className="font-bold text-white">300$</span> Yatırım = 
                    <span className="font-black text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      5 Bilet
                    </span>
                  </div>
                  
                  <div className="text-xs font-bold text-zinc-400 mb-3">(3 Bilet + <span className="text-emerald-400">2 BEDAVA</span>)</div>
                  
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Prize Table */}
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 mb-6">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest text-center mb-4">Ödül Dağılımı</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <span className="flex items-center gap-2 font-bold text-yellow-500"><Trophy className="w-4 h-4" /> 1. Kişi</span>
                    <span className="font-black text-white">$5.000</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/50">
                    <span className="flex items-center gap-2 font-bold text-zinc-300">🥈 2. Kişi</span>
                    <span className="font-black text-white">$2.500</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/50">
                    <span className="flex items-center gap-2 font-bold text-zinc-400">🥉 3. Kişi</span>
                    <span className="font-black text-white">$1.500</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50">
                    <span className="flex items-center gap-2 font-semibold text-zinc-400">🏅 4-10. Kişi</span>
                    <span className="font-bold text-white">$500</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/30">
                    <span className="flex items-center gap-2 font-semibold text-zinc-500">🎟️ 11-50. Kişi</span>
                    <span className="font-bold text-zinc-300">$100</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/30">
                    <span className="flex items-center gap-2 font-semibold text-zinc-500">🎁 51-120. Kişi <span className="text-[10px] text-zinc-600">(Amorti)</span></span>
                    <span className="font-bold text-zinc-400">$50</span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-sm tracking-wide">
                    Her 4 biletten 1'i KAZANIYOR!
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  onViewChange('raffle');
                }}
                className="w-full relative overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-black py-4 rounded-xl text-lg uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transform hover:-translate-y-1"
              >
                <span className="relative z-10">HEMEN YATIRIM YAP VE BİLETLERİNİ AL</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MiniVIPRaffleWidget;
