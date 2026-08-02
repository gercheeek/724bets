import React, { useRef, useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { GameDetailModal, GameData } from './GameDetailModal';
import { useLanguage } from '../contexts/LanguageContext';
import { BaseGameCard } from './GameCards';

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
                        <div key={game.id} className="w-[140px] md:w-[160px] shrink-0 snap-start group">
                            <BaseGameCard 
                                game={{
                                    name: game.name,
                                    img: game.image,
                                    path: game.path
                                }}
                                onClick={() => onNavigate(game.path)}
                                variant="gold"
                            />
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
