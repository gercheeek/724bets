import re

def update_guest_landing():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
        content = f.read()

    # I'll replace the hero block. It starts at `div className="w-full xl:w-[45%] relative rounded-xl border border-white/10 p-6 flex flex-col items-start justify-center`
    # and ends after the Kick button.
    
    # We will search for the entire LEFT: GUEST HERO REGISTRATION BLOCK
    target_pattern = r'\{/\*\s*LEFT:\s*GUEST HERO REGISTRATION BLOCK[^\}]*\*/\}.*?\{/\*\s*Middle & Right Columns:\s*Separated Casino & Sports Cards\s*\*/\}'
    
    replacement = """{/* LEFT: GUEST HERO REGISTRATION BLOCK (Gamdom-Style Premium Design) */}
              <div className="w-full xl:w-[45%] relative rounded-2xl border border-white/5 p-8 sm:p-10 flex flex-col items-start justify-center text-left min-h-[300px] bg-[#0c101a] overflow-hidden group/hero shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-700 hover:border-white/10">
                 
                 {/* Premium Background Layers */}
                 <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0f172a] via-[#0b0f19] to-[#05080f]"></div>
                 
                 {/* Subtle Gamdom-style radial glows */}
                 <div className="absolute -top-32 -left-32 w-[350px] h-[350px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none group-hover/hero:bg-blue-500/20 transition-all duration-1000 z-0"></div>
                 <div className="absolute -bottom-32 -right-32 w-[350px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none group-hover/hero:bg-emerald-500/20 transition-all duration-1000 z-0"></div>
                 
                 {/* Grid pattern overlay (subtle) */}
                 <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                 
                 {/* Ambient reflection */}
                 <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 z-10"></div>
                 <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent z-10 pointer-events-none"></div>

                 {/* Content */}
                 <div className="relative z-20 w-full flex-1 flex flex-col justify-center">
                   <h1 className="text-[32px] sm:text-[40px] lg:text-[46px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 leading-[1.1] tracking-tight mb-4 font-['Inter',sans-serif] drop-shadow-2xl">
                     İlk Üyeliğe Özel <br /> Ekstra Fırsatları <br /> Şimdi Keşfet!
                   </h1>
                   
                   <p className="text-slate-400 text-sm sm:text-base font-medium mb-8 max-w-sm leading-relaxed">
                     Ayrıcalıklı dünyaya adım atın ve premium avantajlardan anında faydalanmaya başlayın.
                   </p>
                   
                   <button onClick={() => window.dispatchEvent(new Event('openRegisterModal'))} className="relative overflow-hidden bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-sm sm:text-base py-3.5 px-10 rounded-xl shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all duration-300 hover:-translate-y-1 w-fit group/btn">
                     <span className="relative z-10 flex items-center gap-2">
                        Bonusla Başla
                        <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                     </span>
                     {/* Button shine */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover/btn:translate-x-[150%] transition-transform duration-1000 ease-in-out z-0"></div>
                   </button>

                   <div className="w-full h-px bg-white/5 my-6"></div>
                   
                   <p className="text-slate-500 font-bold mb-4 text-[11px] uppercase tracking-widest flex items-center gap-4">
                     <span className="h-px flex-1 bg-white/5"></span>
                     Veya diğer seçenekler
                     <span className="h-px flex-1 bg-white/5"></span>
                   </p>
                   
                   <div className="flex flex-wrap items-center gap-3 w-full">
                      {/* Google */}
                      <button className="flex-1 flex justify-center items-center gap-2.5 px-0 py-3 bg-[#111622] hover:bg-[#1a2133] border border-white/5 hover:border-white/10 rounded-xl text-slate-300 hover:text-white font-bold text-xs transition-all shadow-sm group/social">
                        <svg className="w-4 h-4 group-hover/social:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Google
                      </button>

                      {/* Facebook */}
                      <button className="flex-1 flex justify-center items-center gap-2.5 px-0 py-3 bg-[#111622] hover:bg-[#1a2133] border border-white/5 hover:border-white/10 rounded-xl text-slate-300 hover:text-white font-bold text-xs transition-all shadow-sm group/social">
                        <svg className="w-4 h-4 group-hover/social:scale-110 transition-transform" fill="#1877F2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/>
                        </svg>
                        Facebook
                      </button>

                      {/* Kick */}
                      <button className="flex-1 flex justify-center items-center gap-2.5 px-0 py-3 bg-[#111622] hover:bg-[#1a2133] border border-white/5 hover:border-white/10 rounded-xl text-slate-300 hover:text-white font-bold text-xs transition-all shadow-sm group/social">
                        <svg className="w-4 h-4 group-hover/social:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.5 2H9.5V7H13.5V2H17.5V11.5H13.5V16.5H18.5V22H14.5V16.5H9.5V22H5.5V2Z" fill="#53FC18"/>
                        </svg>
                        Kick
                      </button>
                   </div>
                 </div>
              </div>
              
              {/* Middle & Right Columns: Separated Casino & Sports Cards */}"""
    
    content = re.sub(target_pattern, replacement, content, flags=re.DOTALL)
    
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
        f.write(content)

update_guest_landing()
print("GuestLanding updated")

