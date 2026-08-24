import re

filename = 'components/Sidebar.tsx'
with open(filename, 'r') as f:
    content = f.read()

new_code = """      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pt-2 pb-4 relative z-[99999] pointer-events-auto">
        
        {/* Search Bar (Metaspins Style) */}
        {!isSportsView && !isPredictionsView && (
          <div className={`px-3 mb-3 transition-all duration-400 ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
            <div className="relative w-full h-11 bg-[#131823] rounded-xl flex items-center px-3 border border-white/5 transition-colors focus-within:border-white/10 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search" className="w-full h-full bg-transparent border-none outline-none text-white text-[15px] ml-2 placeholder-zinc-500 font-medium" />
            </div>
          </div>
        )}

        {/* CUSTOM PROMO BUTTONS (METASPINS STYLE) */}
        {!isSportsView && !isPredictionsView && (
          <div className={`flex flex-col gap-2.5 px-3 mb-3 transition-all duration-400 ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
             {/* Promo 1: Leaderboard */}
             <div onClick={() => onViewChange('tahminler')} className="relative cursor-pointer h-[72px] w-full rounded-2xl bg-gradient-to-r from-[#2a1353] to-[#4c1e86] flex items-center justify-between pl-4 pr-0 overflow-hidden border-none group shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:brightness-110 transition-all">
                <div className="flex items-center gap-3 z-10">
                   <Target className="w-[22px] h-[22px] text-white drop-shadow-md" strokeWidth={2.5} />
                   <span className="text-white font-black text-[15px] tracking-wide drop-shadow-md">100K Liderlik</span>
                </div>
                <img src="/assets/avatars/crown_3d.png" className="absolute right-[-15px] top-1/2 -translate-y-1/2 h-[80px] w-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-[1.12] transition-transform duration-300" alt="Crown" />
             </div>

             {/* Promo 2: Daily Lootboxes */}
             <div onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))} className="relative cursor-pointer h-[72px] w-full rounded-2xl bg-gradient-to-r from-[#0c311e] to-[#114b2d] flex items-center justify-between pl-4 pr-0 overflow-hidden border-none group shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:brightness-110 transition-all">
                <div className="flex items-center gap-3 z-10">
                   <Gift className="w-[22px] h-[22px] text-white drop-shadow-md" strokeWidth={2.5} />
                   <div className="flex flex-col">
                     <span className="text-white font-black text-[15px] tracking-wide drop-shadow-md">Günlük Ödüller</span>
                     <span className="text-[#00E5FF] text-[11px] font-bold mt-0.5">Kayıt Ol</span>
                   </div>
                </div>
                <img src="/images/welcome-chest.webp" className="absolute right-[-5px] top-1/2 -translate-y-[45%] h-[65px] w-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-[1.12] transition-transform duration-300" alt="Chest" />
             </div>

             {/* Promo 3: Rewards / VIP */}
             <div onClick={() => onViewChange('vip-club')} className="relative cursor-pointer h-[72px] w-full rounded-2xl bg-gradient-to-r from-[#0f1f41] to-[#122e6b] flex items-center justify-between pl-4 pr-0 overflow-hidden border-none group shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:brightness-110 transition-all">
                <div className="flex items-center gap-3 z-10">
                   <Diamond className="w-[22px] h-[22px] text-white drop-shadow-md" strokeWidth={2.5} />
                   <div className="flex flex-col">
                     <span className="text-white font-black text-[15px] tracking-wide drop-shadow-md">VIP Ayrıcalıkları</span>
                     <span className="text-[#00E5FF] text-[11px] font-bold mt-0.5">Kayıt Ol</span>
                   </div>
                </div>
                <img src="/assets/avatars/money_bag_3d.png" className="absolute right-[-10px] top-1/2 -translate-y-1/2 h-[80px] w-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-[1.12] transition-transform duration-300" alt="Money Bag" />
             </div>
          </div>
        )}

        {/* Main Menu Items or Sports Content */}"""

content = re.sub(r'<div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pt-2 pb-4 relative z-\[99999\] pointer-events-auto">.*?\{\/\* Main Menu Items or Sports Content \*\/\}', new_code, content, flags=re.DOTALL)

with open(filename, 'w') as f:
    f.write(content)
print("Updated Sidebar.tsx properly")
