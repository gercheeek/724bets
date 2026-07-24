const fs = require('fs');

const path = '/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx';
let content = fs.readFileSync(path, 'utf8');

const rollbitHero = `            {/* FULL WIDTH HERO REGISTRATION BLOCK (Rollbit Style) */}`;
const rollbitEnd = `            {/* Static 3-Column Banners (Slot Oyna & Kazan vs) */}`;

if (content.includes(rollbitHero)) {
  const before = content.substring(0, content.indexOf(rollbitHero));
  const after = content.substring(content.indexOf(rollbitEnd));

  const oldHero = `            {/* TOP SPLIT ROW: HERO + CARDS */}
            <div className="w-full flex flex-col xl:flex-row gap-4 lg:gap-6 mb-8">
              
              {/* LEFT: GUEST HERO REGISTRATION BLOCK */}
              <div className="w-full xl:w-[65%] relative rounded-[20px] overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-8 md:p-12 flex flex-col items-start text-left shadow-2xl">
                 {/* Ambient Glows */}
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
                 <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
                 
                 <div className="relative z-10 w-full max-w-[850px] flex-1 flex flex-col justify-center">
                   <h1 className="text-[32px] sm:text-4xl lg:text-[46px] xl:text-[50px] font-black text-white leading-[1.15] tracking-tight mb-8 font-['Outfit']">
                     Dünyanın En Büyük Çevrim içi Casino ve Spor Bahisleri Platformu
                   </h1>
                   
                   <button onClick={() => window.dispatchEvent(new Event('openRegisterModal'))} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3.5 px-12 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 text-lg mb-10 hover:scale-[1.02] w-fit">
                     Kayıt
                   </button>

                   <p className="text-zinc-400 font-semibold mb-4 text-[13px]">Veya diğer seçeneklerle kaydolun</p>
                   
                   <div className="flex flex-wrap items-center gap-3">
                      {/* Google */}
                      <button className="flex items-center gap-2.5 px-6 py-3 bg-[#1e293b]/80 hover:bg-[#334155] border border-white/5 rounded-xl text-white font-bold text-sm transition-colors backdrop-blur-sm">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Google
                      </button>

                      {/* Facebook */}
                      <button className="flex items-center gap-2.5 px-6 py-3 bg-[#1e293b]/80 hover:bg-[#334155] border border-white/5 rounded-xl text-white font-bold text-sm transition-colors backdrop-blur-sm">
                        <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/>
                        </svg>
                        Facebook
                      </button>

                      {/* Kick */}
                      <button className="flex items-center gap-2.5 px-6 py-3 bg-[#1e293b]/80 hover:bg-[#334155] border border-white/5 rounded-xl text-white font-bold text-sm transition-colors backdrop-blur-sm">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.5 2H9.5V7H13.5V2H17.5V11.5H13.5V16.5H18.5V22H14.5V16.5H9.5V22H5.5V2Z" fill="#53FC18"/>
                        </svg>
                        Kick
                      </button>
                   </div>
                 </div>
              </div>

              {/* RIGHT: CASINO & SPOR (Merged into one frame without images) */}
              <div className="w-full xl:w-[35%] flex flex-col rounded-[20px] bg-gradient-to-b from-zinc-900 to-black border border-white/5 shadow-2xl p-2 sm:p-4">
                
                {/* Casino Section */}
                <div 
                  onClick={() => onViewChange('blackjack')} 
                  className="flex-1 flex flex-col justify-center items-start p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/[0.03] hover:scale-[1.01] group/casino border border-transparent hover:border-white/5 relative overflow-hidden min-h-[150px]"
                >
                  {/* Subtle hover glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full opacity-0 group-hover/casino:opacity-100 transition-opacity pointer-events-none"></div>
                  
                  <h3 className="text-[32px] sm:text-[40px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-1 transform group-hover/casino:translate-x-2 transition-transform duration-300 relative z-10">
                    Casino
                  </h3>
                  <div className="block mt-2 relative z-10 transform group-hover/casino:translate-x-1 transition-transform duration-300 delay-75">
                    <ActivePlayersCounter type="casino" />
                  </div>
                </div>

                {/* Divider */}
                <div className="w-[90%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto my-2"></div>

                {/* Sports Section */}
                <div 
                  onClick={() => onViewChange('sports')} 
                  className="flex-1 flex flex-col justify-center items-start p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/[0.03] hover:scale-[1.01] group/sports border border-transparent hover:border-white/5 relative overflow-hidden min-h-[150px]"
                >
                  {/* Subtle hover glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full opacity-0 group-hover/sports:opacity-100 transition-opacity pointer-events-none"></div>
                  
                  <h3 className="text-[32px] sm:text-[40px] font-black text-white tracking-tighter leading-none font-['Outfit'] pb-1 transform group-hover/sports:translate-x-2 transition-transform duration-300 relative z-10">
                    Spor
                  </h3>
                  <div className="block mt-2 relative z-10 transform group-hover/sports:translate-x-1 transition-transform duration-300 delay-75">
                    <ActivePlayersCounter type="sports" />
                  </div>
                </div>

              </div>
            </div>
            
`;

  fs.writeFileSync(path, before + oldHero + after);
  console.log("GuestLanding reverted.");
} else {
  console.log("Could not find rollbit marker in GuestLanding");
}
