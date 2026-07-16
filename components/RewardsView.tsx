import React, { useState } from 'react';
import { Lock, Info, Calendar, Timer, Gem, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SiteUser } from '../types';

interface RewardsViewProps {
  siteUser: SiteUser | null;
}

export default function RewardsView({ siteUser }: RewardsViewProps) {
  const [activeTab, setActiveTab] = useState('rewards');

  return (
    <div className="flex-1 w-full min-h-screen bg-[#0B101E] text-white p-4 md:p-6 lg:p-8 font-sans pb-32">
      
      {/* Top Banner - 7 Day Bonus */}
      <div className="relative w-full rounded-2xl bg-gradient-to-r from-[#17213D] to-[#121930] border border-white/5 overflow-hidden flex flex-col md:flex-row items-center justify-between p-6 md:p-10 shadow-2xl mb-8">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col items-start gap-4 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            7 day Bonus <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">unlock schedule</span>
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="bg-[#1C2646] border border-white/10 rounded-xl py-3 px-5 flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 font-semibold mb-0.5 flex items-center gap-1"><Lock className="w-3 h-3" /> Unlock in 7 days</span>
                <span className="text-lg font-bold text-white">$200,44</span>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 font-semibold mb-0.5 flex items-center gap-1"><Timer className="w-3 h-3 text-emerald-400" /> 02:34:00</span>
                <span className="text-lg font-bold text-emerald-400">$200,44</span>
              </div>
            </div>
          </div>
          
          <button className="bg-[#00E676] hover:bg-[#00C853] text-black font-black px-8 py-3.5 rounded-lg mt-2 transition-all shadow-[0_0_20px_rgba(0,230,118,0.3)] hover:shadow-[0_0_30px_rgba(0,230,118,0.5)]">
            Sign up
          </button>
          
          <div className="flex items-center gap-1.5 text-zinc-400 text-sm font-medium mt-2 cursor-pointer hover:text-zinc-200 transition-colors">
            <Info className="w-4 h-4" />
            <span>How do vault rewards work?</span>
          </div>
        </div>
        
        <div className="relative z-10 mt-8 md:mt-0 w-full max-w-[400px] h-[300px] flex justify-center">
           <img src="/images/slots/big_chest_banner.jpg" alt="Treasure Chest" className="w-[80%] md:w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" onError={(e) => { e.currentTarget.style.display='none'; }} />
        </div>
      </div>

      {/* Unlock Schedule Row */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-zinc-300" />
          <h2 className="text-xl font-bold text-white">Unlock schedule</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Card */}
          <div className="bg-[#131B31] border border-emerald-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-[#1D294B] flex items-center justify-center">
                 <Calendar className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Thursday</h3>
                <span className="text-emerald-400 text-xs font-semibold">2/3 Claimed</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-[#1C2646] rounded-xl p-3 flex items-center justify-between">
                 <div className="flex flex-col">
                   <span className="text-xs text-zinc-400 flex items-center gap-1"><Timer className="w-3 h-3" /> 3h 39s</span>
                   <span className="text-sm font-bold text-white">$200,44 <span className="text-emerald-400">claimed</span></span>
                 </div>
                 <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="bg-[#1C2646] rounded-xl p-3 flex items-center justify-between opacity-50">
                 <div className="flex flex-col">
                   <span className="text-xs text-zinc-400 flex items-center gap-1"><Lock className="w-3 h-3" /> 5h 20m</span>
                   <span className="text-sm font-bold text-white">$22 <span className="text-zinc-400">unlocks in</span></span>
                 </div>
              </div>
              <div className="bg-[#1C2646] rounded-xl p-3 flex items-center justify-between border border-red-500/20">
                 <div className="flex flex-col">
                   <span className="text-xs text-red-400 flex items-center gap-1"><Timer className="w-3 h-3" /> Expires</span>
                   <span className="text-sm font-bold text-white">3h 3m Ago</span>
                 </div>
              </div>
            </div>
          </div>
          
          {/* Pending Cards */}
          {['Friday', 'Saturday', 'Sunday'].map((day) => (
             <div key={day} className="bg-[#131B31] border border-white/5 rounded-2xl p-5 relative overflow-hidden opacity-70">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-[#1D294B] flex items-center justify-center">
                   <Calendar className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{day}</h3>
                  <span className="text-zinc-500 text-xs font-semibold">$23.4 Pending</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-[#1C2646] rounded-xl p-3 flex items-center justify-between">
                   <div className="flex flex-col">
                     <span className="text-xs text-zinc-400 flex items-center gap-1"><Timer className="w-3 h-3" /> 3h 39s</span>
                     <span className="text-sm font-bold text-zinc-400">$200,44 unlocks in</span>
                   </div>
                </div>
                <div className="bg-[#1C2646] rounded-xl p-3 flex items-center justify-between">
                   <div className="flex flex-col">
                     <span className="text-xs text-zinc-400 flex items-center gap-1"><Lock className="w-3 h-3" /> 5h 20m</span>
                     <span className="text-sm font-bold text-zinc-400">$22 unlocks in</span>
                   </div>
                </div>
                <div className="bg-[#1C2646] rounded-xl p-3 flex items-center justify-between">
                   <div className="flex flex-col">
                     <span className="text-xs text-zinc-500 flex items-center gap-1"><Timer className="w-3 h-3" /> Expires</span>
                     <span className="text-sm font-bold text-zinc-500">3h 3m Ago</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Gem className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Rewards</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Instant Rakeback */}
          <div className="bg-gradient-to-b from-[#161F36] to-[#0F1627] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-full h-full bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-1.5 text-blue-400 font-bold text-sm mb-1 z-10"><Zap className="w-4 h-4" /> Instant</div>
            <h3 className="text-2xl font-black text-white mb-6 z-10">Rakeback</h3>
            <div className="w-32 h-32 mb-6 relative z-10">
              <img src="/images/slots/chest_instant.jpg" alt="Instant Chest" className="w-full h-full object-cover rounded-xl drop-shadow-[0_10px_20px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display='none'; }} />
            </div>
            <button className="w-full bg-[#00E676] hover:bg-[#00C853] text-black font-black py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,230,118,0.2)] z-10">
              Claim bonus
            </button>
          </div>

          {/* Daily Rakeback */}
          <div className="bg-gradient-to-b from-[#161F36] to-[#0F1627] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-orange-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-full h-full bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-1.5 text-orange-400 font-bold text-sm mb-1 z-10"><Zap className="w-4 h-4" /> Daily</div>
            <h3 className="text-2xl font-black text-white mb-6 z-10">Rakeback</h3>
            <div className="w-32 h-32 mb-6 relative z-10">
              <img src="/images/slots/chest_daily.jpg" alt="Daily Chest" className="w-full h-full object-cover rounded-xl drop-shadow-[0_10px_20px_rgba(249,115,22,0.3)] group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display='none'; }} />
            </div>
            <button className="w-full bg-[#1C2646] hover:bg-[#253258] text-white font-bold py-3.5 rounded-xl transition-all z-10 border border-white/5">
              Claim bonus
            </button>
          </div>
          
          {/* Monthly Rakeback */}
          <div className="bg-gradient-to-b from-[#161F36] to-[#0F1627] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-purple-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-full h-full bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-1.5 text-purple-400 font-bold text-sm mb-1 z-10"><Zap className="w-4 h-4" /> Monthly</div>
            <h3 className="text-2xl font-black text-white mb-6 z-10">Rakeback</h3>
            <div className="w-32 h-32 mb-6 relative z-10">
              <img src="/images/slots/chest_monthly.jpg" alt="Monthly Chest" className="w-full h-full object-cover rounded-xl drop-shadow-[0_10px_20px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display='none'; }} />
            </div>
            <button className="w-full bg-[#1C2646] hover:bg-[#253258] text-white font-bold py-3.5 rounded-xl transition-all z-10 border border-white/5">
              Claim bonus
            </button>
          </div>
          
          {/* Monthly Bonus */}
          <div className="bg-gradient-to-b from-[#161F36] to-[#0F1627] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-pink-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-full h-full bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-1.5 text-pink-400 font-bold text-sm mb-1 z-10"><Zap className="w-4 h-4" /> Monthly</div>
            <h3 className="text-2xl font-black text-white mb-6 z-10">Bonus</h3>
            <div className="w-32 h-32 mb-6 relative z-10">
              <img src="/images/slots/chest_monthly_bonus.jpg" alt="Monthly Bonus Chest" className="w-full h-full object-cover rounded-xl drop-shadow-[0_10px_20px_rgba(236,72,153,0.3)] group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display='none'; }} />
            </div>
            <button className="w-full bg-[#1C2646] hover:bg-[#253258] text-white font-bold py-3.5 rounded-xl transition-all z-10 border border-white/5">
              Claim bonus
            </button>
          </div>

        </div>
      </div>

      {/* Floating Level Progress (Desktop only in this layout, or inline for mobile) */}
      <div className="fixed bottom-6 right-6 z-40 hidden lg:block w-[350px]">
         <div className="bg-[#111827] rounded-3xl p-6 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex flex-col items-center text-center mb-6 relative z-10">
              <div className="w-20 h-20 mb-3 relative">
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
                <Star className="w-full h-full text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-[#111827]">2</span>
              </div>
              <span className="text-zinc-400 font-medium text-sm">Current level</span>
              <h4 className="text-2xl font-black text-white tracking-tight">Explorer</h4>
            </div>
            
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-400">$2,345.45</span>
                <span className="text-white">$3,225.00 <span className="text-zinc-500">Left to next level</span></span>
              </div>
              <div className="w-full h-2 bg-[#1F2937] rounded-full overflow-hidden">
                <div className="h-full bg-[#00E676] w-[40%] rounded-full shadow-[0_0_10px_rgba(0,230,118,0.5)]"></div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-zinc-400 font-medium text-sm">Your reward</span>
              <div className="flex items-center gap-1.5 font-bold text-white bg-[#1F2937] px-3 py-1.5 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-black">T</div>
                900.54
              </div>
            </div>
         </div>
      </div>

    </div>
  );
}

// Zap Icon Component fallback
function Zap(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  );
}
