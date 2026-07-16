import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Gamepad2, Flame } from 'lucide-react';

const NEW_GAMES = [
    { id: '1', title: 'THE DOG HOUSE MEGAWAYS 1000', provider: 'PRAGMATIC PLAY', img: '/images/slots/doghouse.jpg', color: 'from-yellow-600/80 to-transparent' },
    { id: '2', title: 'OUT OF THE WOODS', provider: 'PRAGMATIC PLAY', img: '/images/slots/outofthewoods.jpg', color: 'from-pink-600/80 to-transparent' },
    { id: '3', title: 'LEGION GOLD', provider: 'PLAY\'N GO', img: '/images/slots/legiongold.jpg', color: 'from-red-600/80 to-transparent' },
    { id: '4', title: 'BIG BASS BLAST', provider: 'PRAGMATIC PLAY', img: '/images/slots/bigbass.jpg', color: 'from-blue-600/80 to-transparent' },
    { id: '5', title: 'GRUG MAKE FIRE', provider: 'HACKSAW GAMING', img: '/images/slots/grug.jpg', color: 'from-orange-600/80 to-transparent' },
    { id: '6', title: 'CRABBY\'S GOLD II', provider: 'PLAY\'N GO', img: '/images/slots/crabby.jpg', color: 'from-red-800/80 to-transparent' },
    { id: '7', title: 'FRUIT SHOP', provider: 'NETENT', img: '/images/slots/fruitshop.jpg', color: 'from-blue-500/80 to-transparent' },
    { id: '8', title: 'ARENA OF IRON', provider: 'HACKSAW GAMING', img: '/images/slots/arena.jpg', color: 'from-red-700/80 to-transparent' },
];

export default function NewGamesSlider() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -800 : 800;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handlePlay = () => {
        window.dispatchEvent(new Event('openDepositModal'));
    };

    const handleDemo = () => {
        alert("Demo oyun başlatılıyor...");
    };

    return (
        <div className="w-full flex flex-col pt-6 pb-2 relative z-10 px-4 md:px-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-white" fill="white" />
                    <h2 className="text-white text-lg font-black tracking-wider">YENİ</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm font-semibold cursor-pointer hover:text-white transition-colors mr-2">Tümünü gör</span>
                    <button onClick={() => scroll('left')} className="bg-[#1A1D24] hover:bg-white/10 text-white p-1.5 rounded-[4px] transition-colors shadow-sm">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => scroll('right')} className="bg-[#1A1D24] hover:bg-white/10 text-white p-1.5 rounded-[4px] transition-colors shadow-sm">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="relative group/slider">
                <div 
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {NEW_GAMES.map((game, i) => (
                        <div 
                            key={game.id} 
                            className="relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] h-[190px] sm:h-[210px] md:h-[240px] rounded-xl overflow-hidden cursor-pointer group snap-start bg-[#11141D] border border-white/5 shadow-lg"
                        >
                            {/* Placeholder Image (gradient for now until we have actual images) */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-20`}></div>
                            <img src={game.img} alt={game.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-30" onError={(e) => { e.currentTarget.style.display='none'; }} />
                            
                            {/* Text overlay - similar to the screenshot */}
                            <div className="absolute inset-0 flex flex-col justify-end p-3 transition-opacity duration-300 group-hover:opacity-0">
                                <h3 className="text-white font-black text-sm sm:text-base leading-tight uppercase tracking-tighter text-center mb-1 drop-shadow-md z-10">{game.title}</h3>
                                <div className="flex items-center justify-between mt-1 z-10">
                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{game.provider}</span>
                                    <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center text-[8px] text-white">i</div>
                                </div>
                            </div>
                            
                            {/* Hover Overlay with Buttons */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handlePlay(); }}
                                    className="bg-[#1475E1] hover:bg-[#0f60c0] text-white font-bold w-[110px] py-2.5 rounded-sm flex items-center justify-center gap-1.5 transition-colors shadow-lg"
                                >
                                    <Play className="w-3.5 h-3.5" fill="currentColor" />
                                    Oyna
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDemo(); }}
                                    className="bg-[#2A2E3D] hover:bg-[#3A3E4D] text-white font-bold w-[110px] py-2.5 rounded-sm flex items-center justify-center gap-1.5 transition-colors shadow-lg"
                                >
                                    <Gamepad2 className="w-3.5 h-3.5" />
                                    Demo
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
