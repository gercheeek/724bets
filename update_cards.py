import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# Define start and end of category cards
start_marker = "{/* CATEGORY CARDS */}"
end_marker = "{/* TICKER */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_cards = """{/* CATEGORY CARDS */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-6">
                
                {/* Casino */}
                <div onClick={() => onViewChange('blackjack')} className="group relative rounded-[2rem] h-[220px] md:h-[280px] cursor-pointer overflow-hidden bg-[#030303] border border-white/5 shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#06b6d4]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl z-0"></div>
                    <img src="/images/ai-generated/casino_card.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700 ease-out z-0" alt="Casino" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/70 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-60 z-10 pointer-events-none"></div>
                    <div className="absolute inset-0 border-[2px] border-transparent group-hover:border-[#06b6d4]/30 rounded-[2rem] transition-all duration-500 z-20 pointer-events-none"></div>

                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-20">
                        <div className="flex flex-col gap-2 transform group-hover:-translate-y-2 transition-transform duration-500">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md w-fit">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06b6d4] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06b6d4]"></span>
                                </span>
                                <span className="text-[#06b6d4] text-[10px] font-black uppercase tracking-[0.2em]">CANLI MASALAR</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-['Outfit'] drop-shadow-lg">Casino</h3>
                        </div>
                        
                        <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#0891b2] flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                            <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                </div>

                {/* Spor Bahisleri */}
                <div onClick={() => onViewChange('sports')} className="group relative rounded-[2rem] h-[220px] md:h-[280px] cursor-pointer overflow-hidden bg-[#030303] border border-white/5 shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl z-0"></div>
                    <img src="/images/ai-generated/sports_card.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700 ease-out z-0" alt="Spor Bahisleri" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/70 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-60 z-10 pointer-events-none"></div>
                    <div className="absolute inset-0 border-[2px] border-transparent group-hover:border-[#10b981]/30 rounded-[2rem] transition-all duration-500 z-20 pointer-events-none"></div>

                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-20">
                        <div className="flex flex-col gap-2 transform group-hover:-translate-y-2 transition-transform duration-500">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md w-fit">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                                </span>
                                <span className="text-[#10b981] text-[10px] font-black uppercase tracking-[0.2em]">YÜKSEK ORANLAR</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-['Outfit'] drop-shadow-lg">Spor Bahisleri</h3>
                        </div>
                        
                        <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                            <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                </div>

                {/* 724 Orijinal */}
                <div onClick={() => onViewChange('originals')} className="group relative rounded-[2rem] h-[220px] md:h-[280px] cursor-pointer overflow-hidden bg-[#030303] border border-white/5 shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(234,179,8,0.2)] hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl z-0"></div>
                    <img src="/images/ai-generated/originals_card.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700 ease-out z-0" alt="724 Orijinal" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/70 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-60 z-10 pointer-events-none"></div>
                    <div className="absolute inset-0 border-[2px] border-transparent group-hover:border-yellow-500/30 rounded-[2rem] transition-all duration-500 z-20 pointer-events-none"></div>

                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-20">
                        <div className="flex flex-col gap-2 transform group-hover:-translate-y-2 transition-transform duration-500">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md w-fit">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                </span>
                                <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em]">ÖZEL ÜRETİM</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-['Outfit'] drop-shadow-lg">724 Orijinal</h3>
                        </div>
                        
                        <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                            <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                </div>
            </div>

            """

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_cards + content[end_idx:]
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
        f.write(content)
