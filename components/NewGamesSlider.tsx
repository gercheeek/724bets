import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Gamepad2, Flame } from 'lucide-react';

const NEW_GAMES = [
    { id: '1', title: 'OUT OF THE WOODS', provider: 'HACKSAW GAMING', img: 'https://cdn2.softswiss.net/i/s4/hacksaw/OutOfTheWoods.png', color: 'from-[#E3358E]/90 to-[#E3358E]', players: 557 },
    { id: '2', title: 'LEGION GOLD\nAND THE\nTHRONE OF DEAD', provider: 'PLAY\'N GO', img: 'https://cdn2.softswiss.net/i/s4/playngo/LegionGoldAndTheThroneOfDead.png', color: 'from-[#BA3B2B]/90 to-[#BA3B2B]', players: 156 },
    { id: '3', title: 'BIG BASS\nBLAST', provider: 'PRAGMATIC PLAY', img: 'https://cdn2.softswiss.net/i/s4/pragmaticexternal/BigBassSplash.png', color: 'from-[#2F292A]/90 to-[#2F292A]', players: 355 },
    { id: '4', title: 'THE DOG HOUSE\nMEGAWAYS\n1000', provider: 'PRAGMATIC PLAY', img: 'https://cdn2.softswiss.net/i/s4/pragmaticexternal/TheDogHouseMegaways.png', color: 'from-[#A68822]/90 to-[#A68822]', players: 471 },
    { id: '5', title: 'SWEET BONANZA', provider: 'PRAGMATIC PLAY', img: 'https://cdn2.softswiss.net/i/s4/pragmaticexternal/SweetBonanza.png', color: 'from-[#E3358E]/90 to-[#E3358E]', players: 13781 },
    { id: '6', title: 'GATES OF OLYMPUS', provider: 'PRAGMATIC PLAY', img: 'https://cdn2.softswiss.net/i/s4/pragmaticexternal/GatesofOlympus1000.png', color: 'from-[#BA3B2B]/90 to-[#BA3B2B]', players: 14150 },
    { id: '7', title: 'SUGAR RUSH', provider: 'PRAGMATIC PLAY', img: 'https://cdn2.softswiss.net/i/s4/pragmaticexternal/SugarRush.png', color: 'from-[#E3358E]/90 to-[#E3358E]', players: 15295 },
    { id: '8', title: 'DEATH BECOMES YOU', provider: 'HACKSAW GAMING', img: 'https://cdn2.softswiss.net/i/s4/hacksaw/DeathBecomesYou.png', color: 'from-[#2F292A]/90 to-[#2F292A]', players: 12450 },
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
                        <div key={game.id} className="flex flex-col gap-2 snap-start">
                            <div className="relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] h-[190px] sm:h-[210px] md:h-[240px] rounded-xl overflow-hidden cursor-pointer group bg-[#11141D] border border-white/5 shadow-lg">
                                {/* Actual Image */}
                                <img src={game.img} alt={game.title} className="absolute top-0 left-0 w-full h-[65%] object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.currentTarget.src='https://via.placeholder.com/180x240/11141D/ffffff?text=Resim+Yok'; }} />
                                
                                {/* Bottom colored section for text matching the screenshot */}
                                <div className={`absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t ${game.color} flex flex-col justify-end p-2 pb-3 z-10 transition-opacity duration-300 group-hover:opacity-0`}>
                                    <h3 className="text-white font-black text-[12px] sm:text-[14px] leading-[1.1] uppercase tracking-tight text-center mb-1.5 whitespace-pre-line drop-shadow-md">
                                        {game.title}
                                    </h3>
                                    <div className="flex items-center justify-center gap-1.5">
                                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">{game.provider}</span>
                                    </div>
                                </div>
                                
                                {/* Hover Overlay with Buttons */}
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px] z-20">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handlePlay(); }}
                                        className="bg-[#10B981] hover:bg-[#00E693] text-black font-black w-[110px] py-2.5 rounded-sm flex items-center justify-center gap-1.5 transition-colors shadow-lg"
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
                            
                            {/* Players count below card */}
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                <span className="text-[11px] font-semibold text-zinc-400">
                                    <span className="text-white">{game.players}</span> Oyuncular
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
