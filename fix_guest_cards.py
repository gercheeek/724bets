import re

with open("components/GuestLanding.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# We will replace the whole CATEGORY CARDS section from 
# {/* CATEGORY CARDS */}
# down to
# </motion.div>
# </div>
# which is right before <div className="w-full mt-8 mb-8">

start_str = "{/* CATEGORY CARDS */}"
end_str = "            <div className=\"w-full mt-8 mb-8\">"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx == -1 or end_idx == -1:
    print("Could not find boundaries")
    exit(1)

new_cards = """{/* CATEGORY CARDS */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-5 mb-5 perspective-[1000px]">
                
                {/* Casino - Premium */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0.3, filter: 'brightness(0.8)' }}
                    whileInView={{ scale: 1.05, opacity: 1, filter: 'brightness(1)' }}
                    viewport={{ amount: "some", margin: "-40% 0px -40% 0px" }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full flex"
                >
                <div onClick={() => onViewChange('blackjack')} className="group relative w-full h-[160px] md:h-[130px] bg-[#050505] cursor-pointer transition-all duration-[500ms] hover:-translate-y-2 rounded-xl overflow-hidden border border-white/10 hover:border-[#06b6d4]/70 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                    <div className="absolute inset-0 bg-[#05070a] flex flex-col z-10 overflow-hidden">
                        
                        <img src="/images/ai-generated/casino_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-100 z-0" alt="Casino" />
                        
                        {/* Stronger Dark Gradient for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="absolute inset-x-0 bottom-0 p-4 xl:p-5 flex flex-col justify-end z-30">
                            <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg truncate font-extrabold font-['Outfit'] uppercase tracking-[0.05em] mb-1 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#67e8f9_40%,#06b6d4_50%,#67e8f9_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">
                                CASINO
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-2">
                                <div className="text-[11px] lg:text-[13px] font-bold text-gray-200 group-hover:text-white transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                    Klasik Masa Oyunları
                                </div>

                                <div className="relative w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-[#06b6d4]/80 transition-colors duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)]"></div>
                                    <div className="absolute inset-[4px] bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center group-hover:bg-[#06b6d4]/30 group-hover:border-[#06b6d4] shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.9)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white group-hover:text-white ml-0.5 transition-colors drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </motion.div>

                {/* Slotlar - Premium */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0.3, filter: 'brightness(0.8)' }}
                    whileInView={{ scale: 1.05, opacity: 1, filter: 'brightness(1)' }}
                    viewport={{ amount: "some", margin: "-40% 0px -40% 0px" }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full flex"
                >
                <div onClick={() => onViewChange('slots')} className="group relative w-full h-[160px] md:h-[130px] bg-[#050505] cursor-pointer transition-all duration-[500ms] hover:-translate-y-2 rounded-xl overflow-hidden border border-white/10 hover:border-[#d946ef]/70 hover:shadow-[0_0_40px_rgba(217,70,239,0.4)]">
                    <div className="absolute inset-0 bg-[#05070a] flex flex-col z-10 overflow-hidden">
                        
                        <img src="/images/ai-generated/slot_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-100 z-0" alt="Slotlar" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="absolute inset-x-0 bottom-0 p-4 xl:p-5 flex flex-col justify-end z-30">
                            <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg truncate font-extrabold font-['Outfit'] uppercase tracking-[0.05em] mb-1 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#e879f9_40%,#d946ef_50%,#e879f9_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">
                                SLOTLAR
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-2">
                                <div className="text-[11px] lg:text-[13px] font-bold text-gray-200 group-hover:text-white transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                    Binlerce Oyun
                                </div>

                                <div className="relative w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-[#d946ef]/80 transition-colors duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)]"></div>
                                    <div className="absolute inset-[4px] bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center group-hover:bg-[#d946ef]/30 group-hover:border-[#d946ef] shadow-[0_0_20px_rgba(217,70,239,0.3)] group-hover:shadow-[0_0_30px_rgba(217,70,239,0.9)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white group-hover:text-white ml-0.5 transition-colors drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </motion.div>

                {/* Spor - Premium */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0.3, filter: 'brightness(0.8)' }}
                    whileInView={{ scale: 1.05, opacity: 1, filter: 'brightness(1)' }}
                    viewport={{ amount: "some", margin: "-40% 0px -40% 0px" }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full flex"
                >
                <div onClick={() => onViewChange('sports')} className="group relative w-full h-[160px] md:h-[130px] bg-[#050505] cursor-pointer transition-all duration-[500ms] hover:-translate-y-2 rounded-xl overflow-hidden border border-white/10 hover:border-[#10b981]/70 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                    <div className="absolute inset-0 bg-[#05070a] flex flex-col z-10 overflow-hidden">
                        
                        <img src="/images/ai-generated/sports_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-100 z-0" alt="Spor" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none"></div>

                        <div className="absolute inset-x-0 bottom-0 p-4 xl:p-5 flex flex-col justify-end z-30">
                            <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg truncate font-extrabold font-['Outfit'] uppercase tracking-[0.05em] mb-1 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#6ee7b7_40%,#10b981_50%,#6ee7b7_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">
                                SPOR
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-2">
                                <div className="text-[11px] lg:text-[13px] font-bold text-gray-200 group-hover:text-white transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                    Canlı Bahisler
                                </div>

                                <div className="relative w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-[#10b981]/80 transition-colors duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)]"></div>
                                    <div className="absolute inset-[4px] bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center group-hover:bg-[#10b981]/30 group-hover:border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.9)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white group-hover:text-white ml-0.5 transition-colors drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </motion.div>

                {/* 724Orijinal - Premium */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0.3, filter: 'brightness(0.8)' }}
                    whileInView={{ scale: 1.05, opacity: 1, filter: 'brightness(1)' }}
                    viewport={{ amount: "some", margin: "-40% 0px -40% 0px" }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full flex"
                >
                <div onClick={() => onViewChange('originals')} className="group relative w-full h-[160px] md:h-[130px] bg-[#050505] cursor-pointer transition-all duration-[500ms] hover:-translate-y-2 rounded-xl overflow-hidden border border-white/10 hover:border-[#eab308]/70 hover:shadow-[0_0_40px_rgba(234,179,8,0.4)]">
                    <div className="absolute inset-0 bg-[#05070a] flex flex-col z-10 overflow-hidden">
                        
                        <img src="/images/ai-generated/originals_card.jpg" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out opacity-100 z-0" alt="724Orijinal" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none"></div>

                        <div className="absolute inset-x-0 bottom-0 p-4 xl:p-5 flex flex-col justify-end z-30">
                            <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg truncate font-extrabold font-['Outfit'] uppercase tracking-[0.05em] mb-1 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(to_bottom,#ffffff_0%,#fde047_40%,#eab308_50%,#fde047_60%,#ffffff_100%)] transition-all duration-[800ms] drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">
                                724<br/>ORIGINALS
                            </h3>
                            
                            <div className="flex items-center justify-between w-full mt-2">
                                <div className="text-[11px] lg:text-[13px] font-bold text-gray-200 group-hover:text-white transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                    %99.2 RTP Özel
                                </div>

                                <div className="relative w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-[#eab308]/80 transition-colors duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)]"></div>
                                    <div className="absolute inset-[4px] bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center group-hover:bg-[#eab308]/30 group-hover:border-[#eab308] shadow-[0_0_20px_rgba(234,179,8,0.3)] group-hover:shadow-[0_0_30px_rgba(234,179,8,0.9)] transition-all duration-500 cursor-pointer group-hover:scale-110">
                                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white group-hover:text-white ml-0.5 transition-colors drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </motion.div>
            </div>

"""

new_content = content[:start_idx] + new_cards + content[end_idx:]

with open("components/GuestLanding.tsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Replacement successful")
