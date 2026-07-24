import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/Header.tsx', 'r') as f:
    content = f.read()

# I will replace the NEW PREMIUM CYBER LOGO block with a CASINO VEGAS LOGO

old_logo_pattern = r'// NEW PREMIUM CYBER LOGO.*?</div>\n                   </div>'

casino_logo = """                   // CASINO VEGAS LOGO
                   <div className="flex items-center group cursor-pointer relative overflow-hidden px-2 py-1 -mx-2">
                    {/* Vegas Sign Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 opacity-0 group-hover:opacity-100 animate-[pulse_2s_ease-in-out_infinite] transition-opacity duration-300 pointer-events-none blur-md rounded-full"></div>
                    
                    {/* The text */}
                    <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase flex items-center relative z-10">
                      
                      {/* Golden 724 with Shimmer */}
                      <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2A8] via-[#FFD700] to-[#B8860B] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] relative group-hover:animate-pulse">
                        724
                        {/* Shimmer line that sweeps across on hover */}
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none bg-clip-text text-transparent"></span>
                      </span>
                      
                      {/* Crisp White BETS with subtle red outline/glow */}
                      <span className="text-white tracking-widest ml-1 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] font-serif italic">
                        BETS
                      </span>
                    </span>
                    
                    {/* Casino Chip Icon */}
                    <div className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 ml-2 -mt-1 transition-transform duration-700 group-hover:rotate-180 relative z-10">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"/>
                        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1"/>
                        <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1"/>
                      </svg>
                    </div>
                   </div>"""

content = re.sub(old_logo_pattern, casino_logo, content, flags=re.DOTALL)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/Header.tsx', 'w') as f:
    f.write(content)
