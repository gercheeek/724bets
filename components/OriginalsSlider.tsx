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
        image: '/images/keno_premium.jpg',
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
        image: '/images/roulette_premium.jpg',
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
        image: '/images/blackjack_premium.jpg',
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
        image: '/images/crash_premium.jpg',
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
        image: '/images/plinko_premium.jpg',
        path: 'plinko',
        icon: '🎯',
        players: 569,
        rtp: '%99.0',
        maxWin: '1000x',
        volatility: t('slider.volatility_high')
    },
    {
        id: 'chicken-run',
        name: 'Mission',
        desc: t("originals.desc_chicken"),
        color: 'from-[#1A1822] to-[#100E15]',
        image: '/images/mission_premium.jpg',
        path: 'chicken-run',
        icon: '🐔',
        players: 345,
        rtp: '%99.0',
        maxWin: '10000x',
        volatility: t('slider.volatility_medium')
    },
    {
        id: 'dice',
        name: 'Dice',
        desc: "Classic crypto dice game",
        color: 'from-[#ff00ff] to-[#880088]',
        image: '/images/dice_premium.jpg',
        path: 'dice',
        icon: '🎲',
        players: 1890,
        rtp: '%99.0',
        maxWin: '9900x',
        volatility: t('slider.volatility_low')
    },
    {
        id: 'mines',
        name: 'Mines',
        desc: "Find the gems",
        color: 'from-[#00ff88] to-[#00aa55]',
        image: '/images/mines_premium.jpg',
        path: 'mines',
        icon: '💣',
        players: 3120,
        rtp: '%99.0',
        maxWin: '10000x',
        volatility: t('slider.volatility_high')
    },
    {
        id: 'hilo',
        name: 'HiLo',
        desc: "Guess higher or lower",
        color: 'from-[#f2a900] to-[#b37a00]',
        image: '/images/hilo_premium.jpg',
        path: 'hilo',
        icon: '🃏',
        players: 745,
        rtp: '%99.0',
        maxWin: '1000x',
        volatility: t('slider.volatility_medium')
    }
];

// Custom Card just for Originals to mimic the BC Game style typography
const OriginalGameCard: React.FC<{ game: any, onClick: () => void }> = ({ game, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="group relative flex flex-col cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 border border-white/5 bg-[#1a1c22] shadow-[0_5px_15px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_30px_rgba(0,229,255,0.2)] hover:-translate-y-2 w-full hover:border-[#00E5FF]/30"
        >
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-[#0A0C10]">
                {/* Clean Flat Background Image */}
                <img 
                    src={game.image || game.img} 
                    alt={game.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                


                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#00E5FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-20 pointer-events-none"></div>
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-[#00E5FF]/50 rounded-2xl z-30 pointer-events-none transition-all duration-300"></div>
            </div>
        </div>
    );
};

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
            {/* Premium Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2.5">
                    {/* Glowing Static Dot */}
                    <div className="flex items-center justify-center h-3.5 w-3.5 rounded-full bg-[#00E5FF]/20 border border-[#00E5FF]/40">
                        <span className="h-2 w-2 rounded-full bg-[#00E5FF]"></span>
                    </div>
                    <h2 className="text-white text-[15px] md:text-base font-bold tracking-wide">
                        {t("original_games")}
                    </h2>
                </div>
                
                {/* Premium Navigation Controls */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="w-9 h-9 rounded-md bg-[#24262b] border border-white/10 flex items-center justify-center hover:bg-[#00E5FF]/10 hover:border-[#00E5FF]/40 hover:text-[#00E5FF] transition-all group"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#00E5FF]" />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="w-9 h-9 rounded-md bg-[#24262b] border border-white/10 flex items-center justify-center hover:bg-[#00E5FF]/10 hover:border-[#00E5FF]/40 hover:text-[#00E5FF] transition-all group"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#00E5FF]" />
                    </button>
                </div>
            </div>

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
                        <div key={game.id} className="w-[110px] md:w-[130px] shrink-0 snap-start group">
                            <OriginalGameCard 
                                game={game}
                                onClick={() => onNavigate(game.path)}
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
