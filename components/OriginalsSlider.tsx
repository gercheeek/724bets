import React, { useRef, useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { GameDetailModal, GameData } from './GameDetailModal';
import { useLanguage } from '../contexts/LanguageContext';

export const getOriginalsData = (t: (key: string) => string): GameData[] => [
    {
        id: 'keno',
        name: 'Keno',
        desc: t("originals.desc_keno"),
        color: 'from-[#6E42E5] to-[#4F2AA8]',
        image: '/images/flat-keno.webp',
        path: 'keno',
        icon: '🎱',
        players: 415,
        rtp: '%99.0',
        maxWin: '1000x',
        volatility: t('slider.volatility_high')
    },
    {
        id: 'roulette',
        name: 'Roulette',
        desc: t("originals.desc_roulette"),
        color: 'from-[#201D2C] to-[#15131C]',
        image: '/images/flat-roulette.jpg',
        path: 'roulette',
        icon: '🎰',
        players: 890,
        rtp: '%97.3',
        maxWin: '36x',
        volatility: t('slider.volatility_medium')
    },
    {
        id: 'blackjack',
        name: 'Blackjack',
        desc: t("originals.desc_blackjack"),
        color: 'from-[#A158FF] to-[#6E30D6]',
        image: '/images/flat-blackjack.jpg',
        path: 'blackjack-pro',
        icon: '🃏',
        players: 1205,
        rtp: '%99.5',
        maxWin: '2.5x',
        volatility: t('slider.volatility_low')
    },
    {
        id: 'crash',
        name: 'Crash',
        desc: t("originals.desc_crash") || "Ride the multiplier",
        color: 'from-[#00E5FF] to-[#0088FF]',
        image: '/images/new-mission.webp',
        path: 'crash',
        icon: '📈',
        players: 4521,
        rtp: '%99.0',
        maxWin: '5000x',
        volatility: t('slider.volatility_high')
    },
    {
        id: 'plinko',
        name: 'Plinko',
        desc: t("originals.desc_plinko"),
        color: 'from-[#6E42E5] to-[#4F2AA8]',
        image: '/images/flat-plinko.jpg',
        path: 'plinko',
        icon: '🎯',
        players: 569,
        rtp: '%99.0',
        maxWin: '1000x',
        volatility: t('slider.volatility_high')
    },
    {
        id: 'chicken-run',
        name: 'Mission Uncrossable',
        desc: t("originals.desc_chicken"),
        color: 'from-[#1A1822] to-[#100E15]',
        image: '/images/flat-mission.jpg',
        path: 'chicken-run',
        icon: '🐔',
        players: 345,
        rtp: '%99.0',
        maxWin: '10000x',
        volatility: t('slider.volatility_medium')
    }
];

export default function OriginalsSlider({ onNavigate, guestTheme = "retro" }: { onNavigate: (v: string) => void, guestTheme?: "retro" | "luxury" }) {
  const { t } = useLanguage();
  const originalsData = getOriginalsData(t);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Auto scroll animation
    useEffect(() => {
        if (isHovered) return;
        
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                // If we hit the end, go back to start
                if (scrollRef.current.scrollLeft >= maxScrollLeft - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                }
            }
        }, 3500);

        return () => clearInterval(interval);
    }, [isHovered]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 400; // Roughly two cards
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-0 my-1 md:my-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 px-2">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    {t("original_games")}
                </h2>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="w-8 h-8 rounded-lg bg-[#151821] border border-white/5 flex items-center justify-center hover:bg-[#1a1e29] hover:border-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="w-8 h-8 rounded-lg bg-[#151821] border border-white/5 flex items-center justify-center hover:bg-[#1a1e29] hover:border-white/10 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes mobileShine {
                    0% { transform: translateX(-150%) skewX(-30deg); }
                    30% { transform: translateX(250%) skewX(-30deg); }
                    100% { transform: translateX(250%) skewX(-30deg); }
                }
                @media (max-width: 768px) {
                    .mobile-shine-anim {
                        animation: mobileShine 4s infinite ease-in-out;
                    }
                }
            `}</style>

            {/* Slider container with padding for shadows */}
            <div 
                className="relative w-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Horizontal Scroll Area */}
                <div 
                    ref={scrollRef}
                    className="flex gap-2 md:gap-4 overflow-x-auto pb-8 pt-2 px-2 snap-x snap-mandatory scrollbar-hide" 
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {originalsData.map((game) => (
                        <div key={game.id} className="shrink-0 snap-start flex flex-col items-center group">
                            {/* Card Body - Portrait */}
                            <div 
                                onClick={() => onNavigate(game.path)}
                                className="w-[140px] h-[175px] md:w-[160px] md:h-[200px] relative rounded-2xl overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_40px_rgba(0,255,163,0.25)] transition-all duration-500 transform group-hover:-translate-y-2 border border-white/10 hover:border-white/30 bg-black/40"
                            >
                                {/* Subtle Glass Highlight */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 z-10 pointer-events-none mix-blend-overlay"></div>
                                
                                <img src={game.image} alt={game.name} className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out z-0 ${guestTheme === "luxury" ? "opacity-90 saturate-75 group-hover:saturate-100 group-hover:opacity-100" : ""}`} />
                                
                                {/* Shine Effect */}
                                <div className="absolute top-0 left-[-150%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[30deg] group-hover:translate-x-[250%] transition-transform duration-[1.5s] ease-in-out z-20 pointer-events-none mobile-shine-anim"></div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>

                                {/* Play button appears on hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                                    <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <Play className="w-5 h-5 text-white fill-current ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Game Detail Modal */}
            <GameDetailModal 
                game={selectedGame} 
                isOpen={!!selectedGame} 
                onClose={() => setSelectedGame(null)} 
                onPlay={(path) => onNavigate(path)} 
            />
            
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
