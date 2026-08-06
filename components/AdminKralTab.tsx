import React, { useState } from 'react';
import { Crown, Star, ChevronRight, Info, Disc, Trophy, Eye, Zap, Crosshair, Users, Activity, Target } from 'lucide-react';
import KralChatModal from './KralChatModal';

export default function AdminKralTab() {
  const [isKralChatOpen, setIsKralChatOpen] = useState(false);

  return (
    <div className="w-full min-h-full p-4 lg:p-6 bg-[#050608] text-white flex flex-col gap-6 pb-24">
      <KralChatModal isOpen={isKralChatOpen} onClose={() => setIsKralChatOpen(false)} />
      
      {/* --- TOP ROW: VIP & GAMES --- */}
      <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 shrink-0">
          {/* Left VIP Panel */}
          <div className="w-full xl:w-[340px] rounded-2xl bg-[#0b0e14] border border-[#1b2230] flex flex-col p-4 md:p-6 shadow-2xl relative overflow-hidden group">
            
            {/* Background effect */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-yellow-600/30 blur-[60px] rounded-full"></div>
              {/* Crown background placeholder for missing asset */}
              <Crown className="absolute -bottom-10 -right-10 w-[200px] h-[200px] text-zinc-300/10 -rotate-12" />
            </div>

            {/* Top bar inside VIP */}
            <div className="flex items-start justify-between relative z-10 mb-8 md:mb-20">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-zinc-300 fill-yellow-500" />
                  <h2 className="text-[24px] md:text-[28px] font-black tracking-widest text-white leading-[1.1]">
                    VIP<br/>KULÜBÜ
                  </h2>
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-4 md:mt-6">
                  Mevcut Seviye:<br/>
                  <span className="text-gray-500 mt-1 block">YOK</span>
                </div>
              </div>
              
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors shrink-0">
                 <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">ÜYE:</span>
                 <span className="text-xs font-bold text-white">Yönetici</span>
                 <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

            {/* Bottom Progress */}
            <div className="mt-6 md:mt-auto space-y-4 relative z-10">
               <div className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-2">İLERLEME</div>
               <div className="flex items-end justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <span className="text-[32px] font-black tracking-tight leading-none">%0.06</span>
                     <Info className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 text-yellow-600 mb-1">
                     <Trophy className="w-4 h-4" />
                     <span className="text-[10px] font-black tracking-widest uppercase">HEDEF: BRONZ</span>
                  </div>
               </div>
               
               <div className="w-full h-3 bg-[#0A0C10] rounded-full overflow-hidden mb-4 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-yellow-700 to-yellow-500 w-[6%] rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
               </div>
               
               <p className="text-[11px] text-gray-500 leading-relaxed max-w-[85%] font-medium">
                 Bronz seviyesine ulaşmak için bahis yapmaya devam edin.
               </p>
            </div>
          </div>

          {/* Right Banners Panel */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Banner 1: 724games Orijinal */}
            <div className="w-full rounded-2xl h-[120px] xl:h-[150px] relative overflow-hidden group cursor-pointer border border-[#00E5FF]/20 hover:border-[#00E5FF]/40 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]">
               {/* Fake 724games BG */}
               <div className="absolute inset-0 bg-[#001217]"></div>
               <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-screen grayscale-[50%] group-hover:grayscale-0 transition-all duration-500"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-[#001217] via-[#001217]/90 to-transparent"></div>
               
               <div className="absolute inset-0 p-5 lg:p-6 flex flex-col justify-center z-10">
                  <div className="flex items-center gap-2 mb-1">
                     <h2 className="text-xl lg:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-blue-400 drop-shadow-[0_2px_10px_rgba(0,229,255,0.3)]">
                        724games
                     </h2>
                     <span className="text-white text-lg lg:text-2xl font-black tracking-tighter">Orijinal</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                     <div className="w-3 h-3 rounded-full bg-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"></div>
                     <span className="text-[13px] font-medium text-gray-200">9.599 playing</span>
                  </div>
               </div>
            </div>

            {/* Banner 2: Casino */}
            <div className="w-full rounded-2xl h-[120px] xl:h-[150px] relative overflow-hidden group cursor-pointer border border-pink-500/20 hover:border-pink-500/40 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]">
               {/* Fake Casino BG */}
               <div className="absolute inset-0 bg-[#0f0418]"></div>
               <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-[url('https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-screen"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-[#0f0418] via-[#0f0418]/80 to-transparent"></div>
               
               <div className="absolute inset-0 p-5 lg:p-6 flex flex-col justify-center z-10">
                  <h2 className="text-2xl lg:text-4xl font-black tracking-tight text-white mb-2 drop-shadow-md">
                     Casino
                  </h2>
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"></div>
                     <span className="text-[13px] font-medium text-gray-200">9.590 playing</span>
                  </div>
               </div>
            </div>

            {/* Banner 3: Spor */}
            <div className="w-full rounded-2xl h-[120px] xl:h-[150px] relative overflow-hidden group cursor-pointer border border-emerald-500/20 hover:border-emerald-500/40 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
               {/* Fake Spor BG */}
               <div className="absolute inset-0 bg-[#020a06]"></div>
               <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-[url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-screen grayscale-[50%]"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-[#020a06] via-[#020a06]/90 to-transparent"></div>
               
               <div className="absolute inset-0 p-5 lg:p-6 flex flex-col justify-center z-10">
                  <h2 className="text-2xl lg:text-4xl font-black tracking-tight text-white mb-2 lg:mb-4 drop-shadow-md">
                     Spor
                  </h2>
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"></div>
                     <span className="text-[13px] font-medium text-gray-200">9.551 playing</span>
                  </div>
               </div>
            </div>

            {/* Banner 4: Kral Sohbet */}
            <div className="w-full rounded-2xl h-[120px] xl:h-[150px] relative overflow-hidden group cursor-pointer border border-[#FFD700]/30 hover:border-[#FFD700]/60 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                 onClick={() => setIsKralChatOpen(true)}>
               {/* Fake VIP BG */}
               <div className="absolute inset-0 bg-[#0d0a00]"></div>
               <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-[url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-screen"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-[#0d0a00] via-[#0d0a00]/90 to-transparent"></div>
               
               <div className="absolute inset-0 p-5 lg:p-6 flex flex-col justify-center z-10">
                  <h2 className="text-xl lg:text-3xl font-black tracking-tight text-white mb-1 drop-shadow-md flex items-center gap-2">
                     KRAL SOHBET
                     <Crown className="w-6 h-6 text-white" />
                  </h2>
                  <p className="text-[10px] lg:text-[11px] text-zinc-300/80 font-bold uppercase tracking-widest max-w-[200px] leading-tight">
                     Krala Özel Yönetim ve Sohbet Odası
                  </p>
               </div>
            </div>
          </div>
      </div>
    </div>
  );
}
