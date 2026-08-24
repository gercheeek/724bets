import re

filename = 'components/LiveWinsMarquee.tsx'
with open(filename, 'r') as f:
    content = f.read()

# I want to completely replace everything from 'return (' to the end of the file.
start_idx = content.find('    return (')
if start_idx != -1:
    before = content[:start_idx]
    
    new_return = """    return (
        <>
            <div className="w-full bg-[#151A24] py-3 relative overflow-hidden border-y border-white/5 select-none">
                {/* Live Indicator Badge (Overlay) */}
                <div className="absolute top-2 left-4 z-20 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 flex items-center gap-2 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-white text-[10px] font-black tracking-widest uppercase">Canlı Kazançlar</span>
                </div>

                {/* Left & Right Fade Gradients */}
                <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#151A24] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#151A24] to-transparent z-10 pointer-events-none"></div>

                <motion.div 
                    className="flex flex-row w-max"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 400 }}
                    whileHover={{ animationPlayState: 'paused' }}
                >
                    {[...wins, ...wins].map((win, idx) => (
                        <div 
                            key={`${win.id}-${idx}`} 
                            className="flex-shrink-0 flex flex-col gap-2 w-[85px] mx-1 transition-transform hover:scale-105 cursor-pointer"
                            onClick={() => setSelectedWin(win)}
                        >
                            {/* Card Image Wrapper */}
                            <div className="w-[85px] h-[114px] rounded-xl overflow-hidden relative shadow-md">
                                {win.image.startsWith('linear-gradient') ? (
                                    <div 
                                        className="w-full h-full flex flex-col items-center justify-center p-2"
                                        style={{ background: win.image }}
                                    >
                                        <h4 className="text-white font-black text-[14px] tracking-wide leading-tight text-center drop-shadow-md">{win.gameName}</h4>
                                        <span className="text-white/70 text-[9px] font-semibold mt-1 tracking-widest uppercase">{win.provider}</span>
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0"></div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full relative">
                                        <img src={win.image} alt={win.gameName} className="w-full h-full object-cover" />
                                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-1.5">
                                            <span className="text-white/80 text-[8px] font-bold tracking-widest uppercase">{win.provider}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Win Info Below Card */}
                            <div className="flex flex-col items-center gap-0.5 mt-0.5">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-[#d6a863]/20 flex items-center justify-center rounded-[2px] rotate-45 border border-[#d6a863]/50">
                                        <span className="-rotate-45 text-[6px] text-[#d6a863]">♦</span>
                                    </div>
                                    <span className="text-zinc-400 text-[10px] font-black truncate max-w-[60px]">{win.username}</span>
                                </div>
                                <span className="text-emerald-400 text-[10px] font-black tracking-wide">
                                    ${win.amount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
            {selectedWin && <LiveWinModal win={selectedWin} onClose={() => setSelectedWin(null)} />}
        </>
    );
};

export default LiveWinsMarquee;
"""
    with open(filename, 'w') as f:
        f.write(before + new_return)
    print("Rewritten successfully")
