import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/Header.tsx', 'r') as f:
    content = f.read()

# Replace the logo block
old_logo = """                   // STANDARD LOGO
                   <>
                    <span className="font-extrabold text-2xl md:text-3xl tracking-tight lowercase">
                      <span className="text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,0.3)]">724bets</span>
                    </span>
                    <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 ml-1 -mt-4">
                      <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-[#00ff88] drop-shadow-[0_0_10px_rgba(0,255,136,0.6)]">
                        {/* 3-leaf clover (Shamrock) */}
                        <path d="M49 88 C49 88, 48 65, 45 55 C45 55, 30 65, 20 60 C5 52, 10 30, 25 30 C35 30, 42 40, 48 45 C48 35, 40 20, 50 10 C60 20, 52 35, 52 45 C58 40, 65 30, 75 30 C90 30, 95 52, 80 60 C70 65, 55 55, 55 55 C52 65, 51 88, 51 88 Z" />
                      </svg>
                    </div>
                   </>"""

new_logo = """                   // NEW PREMIUM CYBER LOGO
                   <div className="flex items-center group cursor-pointer relative">
                    {/* Glow effect behind the logo */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#00ff88]/20 to-[#00ffff]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full pointer-events-none"></div>
                    
                    <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase italic flex items-center">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#00ff88] drop-shadow-[0_0_12px_rgba(0,255,136,0.4)]">
                        724
                      </span>
                      <span className="text-white tracking-normal ml-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        BETS
                      </span>
                    </span>
                    
                    <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 ml-1 -mt-5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                      {/* Modern Star/Sparkle Icon instead of clover */}
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#00ff88] drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]">
                        <path d="M12 1V7M12 17V23M1 12H7M17 12H23M4.22183 4.22183L8.46447 8.46447M15.5355 15.5355L19.7782 19.7782M4.22183 19.7782L8.46447 15.5355M15.5355 8.46447L19.7782 4.22183M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                   </div>"""

content = content.replace(old_logo, new_logo)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/Header.tsx', 'w') as f:
    f.write(content)
