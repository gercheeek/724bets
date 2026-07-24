import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# Fix the grid columns first
content = content.replace(
    '<div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-10 mb-6 perspective-[1000px]">',
    '<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-10 mb-6 perspective-[1000px]">'
)

slot_card = """
                {/* Slot Oyunları - Minimal Premium (#d946ef) */}
                <div onClick={() => onViewChange('slots')} className="group relative w-full h-[320px] md:h-[380px] bg-[#020202] cursor-pointer transition-all duration-[800ms] hover:-translate-y-3 hover:rotate-y-[5deg] clip-tech drop-shadow-[0_0_20px_rgba(217,70,239,0.1)] hover:drop-shadow-[0_0_40px_rgba(217,70,239,0.4)]">
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#d946ef_360deg)] opacity-0 group-hover:opacity-60 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
                    <div className="absolute inset-[1px] bg-[#05070a] flex flex-col z-10 clip-tech-inner overflow-hidden">
                        
                        <img src="/images/ai-generated/slot_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-40 group-hover:opacity-80 mix-blend-luminosity group-hover:mix-blend-normal z-0" alt="Slotlar" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md border border-white/5 rounded-full px-4 py-2 flex items-center gap-2 z-30">
                            <div className="w-2 h-2 bg-[#d946ef] rounded-full shadow-[0_0_8px_#d946ef]"></div>
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">En Popüler</span>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-6 xl:p-8 flex flex-col justify-end z-30">
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-['Outfit'] uppercase tracking-[0.1em] mb-1 text-transparent bg-clip-text bg-[linear-gradient(to_bottom,#ffffff_0%,#e5e7eb_40%,#9ca3af_50%,#e5e7eb_60%,#ffffff_100%)] group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#e879f9_40%,#d946ef_50%,#e879f9_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_4px_rgba(0,0,0,1)] group-hover:drop-shadow-[0_0_30px_rgba(217,70,239,0.8)]">
                                SLOTLAR
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-4">
                                <div className="text-xs lg:text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                                    Binlerce Oyun
                                </div>

                                <div className="relative w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-[#d946ef]/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-[6px] bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#d946ef] shadow-lg group-hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white group-hover:text-black ml-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
"""

# Find where to insert it (after Casino block ends).
# The casino block ends right before "Spor - Minimal Premium"
spor_marker = "{/* Spor - Minimal Premium (#10b981) */}"
parts = content.split(spor_marker)
if len(parts) == 2:
    content = parts[0] + slot_card + "\n                " + spor_marker + parts[1]

# I also need to adjust the text sizes of existing cards to fit 4 columns gracefully
# text-4xl md:text-5xl -> text-3xl md:text-4xl lg:text-5xl
content = content.replace('text-4xl md:text-5xl font-extrabold', 'text-3xl md:text-4xl lg:text-5xl font-extrabold')
content = content.replace('p-8 flex flex-col', 'p-6 xl:p-8 flex flex-col')
content = content.replace('w-14 h-14', 'w-12 h-12 lg:w-14 lg:h-14')
content = content.replace('w-5 h-5 text-white group-hover:text-black', 'w-4 h-4 lg:w-5 lg:h-5 text-white group-hover:text-black')
content = content.replace('text-sm font-medium', 'text-xs lg:text-sm font-medium')


with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)
