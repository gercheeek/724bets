import re

filename = 'components/Sidebar.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Define old and new sections
old_buttons_regex = r'\{\/\* CUSTOM PROMO BUTTONS \(METASPINS STYLE\) \*\/\}.*?\{\/\* Main Menu Items or Sports Content \*\/\}'

new_buttons = """{/* CUSTOM PROMO BUTTONS (METASPINS STYLE) */}
        {!isSportsView && !isPredictionsView && (
          <div className={`flex flex-col gap-3.5 px-3 mb-5 transition-all duration-400 ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
             
             {/* Promo 1: Leaderboard */}
             <div onClick={() => onViewChange('tahminler')} className="relative cursor-pointer h-[76px] w-full group hover:scale-[1.02] transition-all duration-300 z-10">
                {/* Background & Overlays (Hidden Overflow) */}
                <div className="absolute inset-0 rounded-[14px] bg-gradient-to-r from-[#2c1e4a] via-[#52257d] to-[#7a2fb0] overflow-hidden border border-white/5 border-t-white/15 shadow-[0_8px_20px_rgba(0,0,0,0.5)] group-hover:brightness-110 transition-all">
                  <div className="absolute right-0 top-0 bottom-0 w-32 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-white/30 to-transparent blur-md z-0" />
                </div>
                
                {/* Content */}
                <div className="relative flex items-center justify-between pl-4 pr-0 h-full z-10">
                  <div className="flex items-center gap-3.5">
                     <Trophy className="w-5 h-5 text-white/90 drop-shadow-sm" strokeWidth={2.5} />
                     <span className="text-white font-extrabold text-[15px] tracking-wide drop-shadow-md">100K Liderlik</span>
                  </div>
                </div>
                
                {/* Bursting Image */}
                <img src="/assets/avatars/crown_3d.png" className="absolute right-[-14px] top-1/2 -translate-y-1/2 h-[90px] w-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] group-hover:scale-[1.1] group-hover:rotate-[-4deg] transition-all duration-300 z-20 pointer-events-none" alt="Crown" />
             </div>

             {/* Promo 2: Daily Lootboxes */}
             <div onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))} className="relative cursor-pointer h-[76px] w-full group hover:scale-[1.02] transition-all duration-300 z-10">
                {/* Background & Overlays */}
                <div className="absolute inset-0 rounded-[14px] bg-gradient-to-r from-[#163222] via-[#1a542d] to-[#1d763a] overflow-hidden border border-white/5 border-t-white/15 shadow-[0_8px_20px_rgba(0,0,0,0.5)] group-hover:brightness-110 transition-all">
                  <div className="absolute right-0 top-0 bottom-0 w-32 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-[#00ff87]/25 to-transparent blur-md z-0" />
                </div>
                
                {/* Content */}
                <div className="relative flex items-center justify-between pl-4 pr-0 h-full z-10">
                  <div className="flex items-center gap-3.5">
                     <Gift className="w-5 h-5 text-white/90 drop-shadow-sm" strokeWidth={2.5} />
                     <div className="flex flex-col">
                       <span className="text-white font-extrabold text-[15px] tracking-wide drop-shadow-md leading-tight">Günlük Ödüller</span>
                       <span className="text-[#00ff87] text-[10.5px] font-black uppercase tracking-widest mt-0.5 drop-shadow-sm">Kayıt Ol</span>
                     </div>
                  </div>
                </div>
                
                {/* Bursting Image */}
                <img src="/images/welcome-chest.webp" className="absolute right-[-6px] top-1/2 -translate-y-[45%] h-[80px] w-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] group-hover:scale-[1.1] group-hover:rotate-[-4deg] transition-all duration-300 z-20 pointer-events-none" alt="Chest" />
             </div>

             {/* Promo 3: Rewards / VIP */}
             <div onClick={() => onViewChange('vip-club')} className="relative cursor-pointer h-[76px] w-full group hover:scale-[1.02] transition-all duration-300 z-10">
                {/* Background & Overlays */}
                <div className="absolute inset-0 rounded-[14px] bg-gradient-to-r from-[#182245] via-[#1f3772] to-[#274e9f] overflow-hidden border border-white/5 border-t-white/15 shadow-[0_8px_20px_rgba(0,0,0,0.5)] group-hover:brightness-110 transition-all">
                  <div className="absolute right-0 top-0 bottom-0 w-32 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-md z-0" />
                </div>
                
                {/* Content */}
                <div className="relative flex items-center justify-between pl-4 pr-0 h-full z-10">
                  <div className="flex items-center gap-3.5">
                     <Award className="w-5 h-5 text-white/90 drop-shadow-sm" strokeWidth={2.5} />
                     <div className="flex flex-col">
                       <span className="text-white font-extrabold text-[15px] tracking-wide drop-shadow-md leading-tight">VIP Ödülleri</span>
                       <span className="text-[#00ff87] text-[10.5px] font-black uppercase tracking-widest mt-0.5 drop-shadow-sm">Kayıt Ol</span>
                     </div>
                  </div>
                </div>
                
                {/* Bursting Image */}
                <img src="/assets/avatars/money_bag_3d.png" className="absolute right-[-10px] top-1/2 -translate-y-1/2 h-[90px] w-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] group-hover:scale-[1.1] group-hover:rotate-[-4deg] transition-all duration-300 z-20 pointer-events-none" alt="Money Bag" />
             </div>
          </div>
        )}

        {/* Main Menu Items or Sports Content */}"""

content = re.sub(old_buttons_regex, new_buttons, content, flags=re.DOTALL)

with open(filename, 'w') as f:
    f.write(content)

print("Applied bursting images and refined gradients to Sidebar.")
