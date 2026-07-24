import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

start_marker = "{/* CATEGORY CARDS */}"
end_marker = "{/* TICKER */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_cards = """{/* CATEGORY CARDS */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-10 mb-6">
                
                {/* Casino */}
                <div onClick={() => onViewChange('blackjack')} className="group relative w-full rounded-[32px] bg-[#07090D] border border-white/5 p-3 cursor-pointer overflow-hidden transition-all duration-500 hover:border-[#06b6d4]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:-translate-y-2">
                    {/* Animated background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-[#06b6d4]/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    {/* Image Section */}
                    <div className="relative w-full h-[180px] md:h-[220px] rounded-[24px] overflow-hidden">
                        <img src="/images/ai-generated/casino_card.jpg" className="absolute inset-0 w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-all duration-700 ease-out" alt="Casino" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-[#07090D]/40 to-transparent"></div>
                        
                        {/* Top Floating Badge */}
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg">
                            <span className="w-2 h-2 rounded-full bg-[#06b6d4] animate-ping absolute"></span>
                            <span className="w-2 h-2 rounded-full bg-[#06b6d4] relative z-10"></span>
                            <span className="text-[#06b6d4] text-[10px] font-black uppercase tracking-[0.2em] relative z-10">CANLI MASALAR</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-6 py-6 relative z-10 flex flex-col">
                        <h3 className="text-3xl font-black text-white mb-2 font-['Outfit'] tracking-tight group-hover:text-[#06b6d4] transition-colors duration-300">
                            Casino
                        </h3>
                        <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
                            Gerçek krupiyeler eşliğinde, yüksek limitli VIP masalarda elit ve kesintisiz canlı casino deneyimi.
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-[#06b6d4] font-bold text-sm tracking-wide opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                Lobiye Git
                            </span>
                            <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-[#06b6d4] group-hover:border-[#06b6d4] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300">
                                <svg className="w-5 h-5 text-white transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spor Bahisleri */}
                <div onClick={() => onViewChange('sports')} className="group relative w-full rounded-[32px] bg-[#07090D] border border-white/5 p-3 cursor-pointer overflow-hidden transition-all duration-500 hover:border-[#10b981]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:-translate-y-2">
                    {/* Animated background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-[#10b981]/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    {/* Image Section */}
                    <div className="relative w-full h-[180px] md:h-[220px] rounded-[24px] overflow-hidden">
                        <img src="/images/ai-generated/sports_card.jpg" className="absolute inset-0 w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-all duration-700 ease-out" alt="Spor Bahisleri" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-[#07090D]/40 to-transparent"></div>
                        
                        {/* Top Floating Badge */}
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg">
                            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping absolute"></span>
                            <span className="w-2 h-2 rounded-full bg-[#10b981] relative z-10"></span>
                            <span className="text-[#10b981] text-[10px] font-black uppercase tracking-[0.2em] relative z-10">YÜKSEK ORANLAR</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-6 py-6 relative z-10 flex flex-col">
                        <h3 className="text-3xl font-black text-white mb-2 font-['Outfit'] tracking-tight group-hover:text-[#10b981] transition-colors duration-300">
                            Spor Bahisleri
                        </h3>
                        <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
                            Dünyanın en büyük liglerinde eşsiz bahis çeşitliliği, en yüksek oranlar ve anlık canlı skorlar.
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-[#10b981] font-bold text-sm tracking-wide opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                Bahis Yap
                            </span>
                            <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-[#10b981] group-hover:border-[#10b981] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300">
                                <svg className="w-5 h-5 text-white transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 724 Orijinal */}
                <div onClick={() => onViewChange('originals')} className="group relative w-full rounded-[32px] bg-[#07090D] border border-white/5 p-3 cursor-pointer overflow-hidden transition-all duration-500 hover:border-yellow-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:-translate-y-2">
                    {/* Animated background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-yellow-500/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    {/* Image Section */}
                    <div className="relative w-full h-[180px] md:h-[220px] rounded-[24px] overflow-hidden">
                        <img src="/images/ai-generated/originals_card.jpg" className="absolute inset-0 w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-all duration-700 ease-out" alt="724 Orijinal" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-[#07090D]/40 to-transparent"></div>
                        
                        {/* Top Floating Badge */}
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg">
                            <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] relative z-10 flex items-center gap-1.5">
                                <svg className="w-3 h-3 fill-yellow-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                ÖZEL ÜRETİM
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-6 py-6 relative z-10 flex flex-col">
                        <h3 className="text-3xl font-black text-white mb-2 font-['Outfit'] tracking-tight group-hover:text-yellow-400 transition-colors duration-300">
                            724 Orijinal
                        </h3>
                        <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
                            Sadece bize özel olarak üretilen efsanevi orijinal oyunlar. Farklı heyecanlar, devasa kazançlar.
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-yellow-400 font-bold text-sm tracking-wide opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                Oyunları Keşfet
                            </span>
                            <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-yellow-500 group-hover:border-yellow-500 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300">
                                <svg className="w-5 h-5 text-white transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            """

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_cards + content[end_idx:]
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
        f.write(content)
