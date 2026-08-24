import re

filename = 'components/Sidebar.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_buttons = """        {/* CUSTOM PROMO BUTTONS (METASPINS STYLE) */}
        {!isSportsView && !isPredictionsView && (
          <div className={`flex flex-col gap-3 px-3 mb-4 transition-all duration-400 ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
             {/* Promo 1: Leaderboard */}
             <div onClick={() => onViewChange('tahminler')} className="relative cursor-pointer h-[72px] w-full rounded-2xl bg-gradient-to-r from-[#201538] via-[#351a66] to-[#6a25b5] flex items-center justify-between pl-4 pr-0 overflow-hidden border-none group shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_6px_15px_rgba(0,0,0,0.4)] hover:brightness-110 transition-all">
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white/10 to-transparent blur-xl z-0" />
                <div className="flex items-center gap-3.5 z-10">
                   <Trophy className="w-5 h-5 text-white/90 drop-shadow-md" strokeWidth={2} />
                   <span className="text-white font-black text-[15px] tracking-[0.02em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">100K Liderlik</span>
                </div>
                <img src="/assets/avatars/crown_3d.png" className="absolute right-[-10px] top-1/2 -translate-y-1/2 h-[75px] w-auto drop-shadow-[0_8px_15px_rgba(0,0,0,0.5)] group-hover:scale-[1.08] transition-transform duration-300 z-10" alt="Crown" />
             </div>

             {/* Promo 2: Daily Lootboxes */}
             <div onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))} className="relative cursor-pointer h-[72px] w-full rounded-2xl bg-gradient-to-r from-[#112419] via-[#144225] to-[#1b7a3e] flex items-center justify-between pl-4 pr-0 overflow-hidden border-none group shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_6px_15px_rgba(0,0,0,0.4)] hover:brightness-110 transition-all">
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#00E5FF]/10 to-transparent blur-xl z-0" />
                <div className="flex items-center gap-3.5 z-10">
                   <Gift className="w-5 h-5 text-white/90 drop-shadow-md" strokeWidth={2} />
                   <div className="flex flex-col">
                     <span className="text-white font-black text-[15px] tracking-[0.02em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">Günlük Ödüller</span>
                     <span className="text-[#00FF87] text-[11px] font-bold mt-0.5 tracking-wide drop-shadow-md">Kayıt Ol</span>
                   </div>
                </div>
                <img src="/images/welcome-chest.webp" className="absolute right-[-5px] top-1/2 -translate-y-[45%] h-[60px] w-auto drop-shadow-[0_8px_15px_rgba(0,0,0,0.5)] group-hover:scale-[1.08] transition-transform duration-300 z-10" alt="Chest" />
             </div>

             {/* Promo 3: Rewards / VIP */}
             <div onClick={() => onViewChange('vip-club')} className="relative cursor-pointer h-[72px] w-full rounded-2xl bg-gradient-to-r from-[#121b33] via-[#14285e] to-[#1c4ca8] flex items-center justify-between pl-4 pr-0 overflow-hidden border-none group shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_6px_15px_rgba(0,0,0,0.4)] hover:brightness-110 transition-all">
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#00E5FF]/15 to-transparent blur-xl z-0" />
                <div className="flex items-center gap-3.5 z-10">
                   <Award className="w-5 h-5 text-white/90 drop-shadow-md" strokeWidth={2} />
                   <div className="flex flex-col">
                     <span className="text-white font-black text-[15px] tracking-[0.02em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">VIP Ayrıcalıkları</span>
                     <span className="text-[#00E5FF] text-[11px] font-bold mt-0.5 tracking-wide drop-shadow-md">Kayıt Ol</span>
                   </div>
                </div>
                <img src="/assets/avatars/money_bag_3d.png" className="absolute right-[-10px] top-1/2 -translate-y-1/2 h-[75px] w-auto drop-shadow-[0_8px_15px_rgba(0,0,0,0.5)] group-hover:scale-[1.08] transition-transform duration-300 z-10" alt="Money Bag" />
             </div>
          </div>
        )}"""

new_buttons = """        {/* CUSTOM PROMO BUTTONS (METASPINS STYLE) */}
        {!isSportsView && !isPredictionsView && (
          <div className={`flex flex-col gap-3 px-3 mb-4 transition-all duration-400 ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
             {/* Promo 1: Leaderboard */}
             <div onClick={() => onViewChange('tahminler')} className="relative cursor-pointer h-[76px] w-full rounded-[14px] bg-gradient-to-r from-[#29174f] to-[#7f34d1] flex items-center justify-between pl-4 pr-0 overflow-hidden border-none group shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_20px_rgba(0,0,0,0.5)] hover:scale-[1.02] hover:brightness-110 transition-all duration-300 z-10">
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-white/30 to-transparent blur-md z-0" />
                <div className="flex items-center gap-3.5 z-10">
                   <Trophy className="w-5 h-5 text-white drop-shadow-md" strokeWidth={2.5} />
                   <span className="text-white font-extrabold text-[15.5px] tracking-wide drop-shadow-lg">100K Liderlik</span>
                </div>
                <img src="/assets/avatars/crown_3d.png" className="absolute right-[-12px] top-1/2 -translate-y-1/2 h-[82px] w-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] group-hover:scale-[1.1] group-hover:rotate-[-2deg] transition-all duration-300 z-10" alt="Crown" />
             </div>

             {/* Promo 2: Daily Lootboxes */}
             <div onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))} className="relative cursor-pointer h-[76px] w-full rounded-[14px] bg-gradient-to-r from-[#0d321d] to-[#1a6839] flex items-center justify-between pl-4 pr-0 overflow-hidden border-none group shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_20px_rgba(0,0,0,0.5)] hover:scale-[1.02] hover:brightness-110 transition-all duration-300 z-10">
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-[#00ff87]/30 to-transparent blur-md z-0" />
                <div className="flex items-center gap-3.5 z-10 mt-1">
                   <Gift className="w-5 h-5 text-white drop-shadow-md" strokeWidth={2.5} />
                   <div className="flex flex-col">
                     <span className="text-white font-extrabold text-[15.5px] tracking-wide drop-shadow-lg leading-tight">Günlük Ödüller</span>
                     <span className="text-[#00ff87] text-[12px] font-black mt-0.5 tracking-wider drop-shadow-md">Kayıt Ol</span>
                   </div>
                </div>
                <img src="/images/welcome-chest.webp" className="absolute right-[-8px] top-1/2 -translate-y-[45%] h-[72px] w-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] group-hover:scale-[1.1] group-hover:rotate-[-2deg] transition-all duration-300 z-10" alt="Chest" />
             </div>

             {/* Promo 3: Rewards / VIP */}
             <div onClick={() => onViewChange('vip-club')} className="relative cursor-pointer h-[76px] w-full rounded-[14px] bg-gradient-to-r from-[#141f42] to-[#244ba3] flex items-center justify-between pl-4 pr-0 overflow-hidden border-none group shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_20px_rgba(0,0,0,0.5)] hover:scale-[1.02] hover:brightness-110 transition-all duration-300 z-10">
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-white/20 to-transparent blur-md z-0" />
                <div className="flex items-center gap-3.5 z-10 mt-1">
                   <Award className="w-5 h-5 text-white drop-shadow-md" strokeWidth={2.5} />
                   <div className="flex flex-col">
                     <span className="text-white font-extrabold text-[15.5px] tracking-wide drop-shadow-lg leading-tight">VIP Ödülleri</span>
                     <span className="text-[#00ff87] text-[12px] font-black mt-0.5 tracking-wider drop-shadow-md">Kayıt Ol</span>
                   </div>
                </div>
                <img src="/assets/avatars/money_bag_3d.png" className="absolute right-[-12px] top-1/2 -translate-y-1/2 h-[82px] w-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] group-hover:scale-[1.1] group-hover:rotate-[-2deg] transition-all duration-300 z-10" alt="Money Bag" />
             </div>
          </div>
        )}"""

content = content.replace(old_buttons, new_buttons)

with open(filename, 'w') as f:
    f.write(content)

print("Visual enhancements EXACT MATCH to Metaspins applied")
