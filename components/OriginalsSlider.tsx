import React, { useRef, useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { GameDetailModal, GameData } from './GameDetailModal';
import { useLanguage } from '../contexts/LanguageContext';

export const ORIGINALS_DATA: GameData[] = [
    {
        id: 'plinko',
        name: 'Plinko',
        desc: 'Fizik tabanlı çarpan eğlencesi.',
        color: 'from-purple-600 to-purple-900',
        image: '/images/rainbet-plinko.jpg',
        path: 'plinko',
        icon: '🎯',
        players: 569,
        rtp: '%99.0',
        maxWin: '1000x',
        volatility: 'Yüksek'
    },
    {
        id: 'keno',
        name: 'Keno',
        desc: 'Şansını sayılarla dene.',
        color: 'from-orange-500 to-orange-800',
        image: '/images/rainbet-keno.jpg',
        path: 'keno',
        icon: '🎱',
        players: 318,
        rtp: '%98.5',
        maxWin: '500x',
        volatility: 'Orta'
    },
    {
        id: 'dice',
        name: 'Dice',
        desc: 'Hızlı, adil ve kazançlı zar oyunu.',
        color: 'from-blue-600 to-blue-900',
        image: '/images/rainbet-dice.jpg',
        path: 'dice',
        icon: '🎲',
        players: 482,
        rtp: '%99.0',
        maxWin: '9900x',
        volatility: 'Çok Yüksek'
    },
    {
        id: 'mines',
        name: 'Mines',
        desc: 'Mayınlara basmadan elmasları topla.',
        color: 'from-red-600 to-red-900',
        image: '/images/rainbet-mines.jpg',
        path: 'mines',
        icon: '💣',
        players: 356,
        rtp: '%99.0',
        maxWin: '5.1M x',
        volatility: 'Yüksek'
    },
    {
        id: 'war',
        name: 'War',
        desc: 'Savaş! Kimin kartı daha yüksek?',
        color: 'from-red-600 to-red-900',
        image: '/images/rainbet-war.jpg',
        path: 'war',
        icon: '⚔️',
        players: 481,
        rtp: '%98.0',
        maxWin: '2x',
        volatility: 'Düşük'
    },
    {
        id: 'hilo',
        name: 'HiLo',
        desc: 'Bir sonraki kart yüksek mi düşük mü?',
        color: 'from-pink-600 to-pink-900',
        image: '/images/rainbet-hilo.jpg',
        path: 'hilo',
        icon: '🃏',
        players: 517,
        rtp: '%99.0',
        maxWin: 'Sınırsız',
        volatility: 'Değişken'
    },
    {
        id: 'blackjack',
        name: 'Blackjack',
        desc: 'Klasik casino deneyimi, premium kalite.',
        color: 'from-emerald-600 to-emerald-900',
        image: '/images/rainbet-blackjack.jpg',
        path: 'blackjack-pro',
        icon: '♠️',
        players: 215,
        rtp: '%99.5',
        maxWin: '2.5x',
        volatility: 'Düşük'
    },
    {
        id: 'roulette',
        name: 'Roulette',
        desc: 'Orijinal 724Bets Rulet heyecanı.',
        color: 'from-emerald-600 to-emerald-900',
        image: '/images/rainbet-roulette.jpg',
        path: 'roulette',
        icon: '🎡',
        players: 352,
        rtp: '%97.3',
        maxWin: '35x',
        volatility: 'Orta'
    },
    {
        id: 'chicken-cross',
        name: 'Chicken Cross',
        desc: 'Tavuk karşıya geçebilecek mi?',
        color: 'from-emerald-600 to-emerald-900',
        image: '/images/rainbet-chickencross.jpg',
        path: 'chicken-cross',
        icon: '🐔',
        players: 219,
        rtp: '%98.0',
        maxWin: '1000x',
        volatility: 'Orta'
    },
    {
        id: 'limbo',
        name: 'Limbo',
        desc: 'Sınırları zorla, devasa çarpanları yakala.',
        color: 'from-red-600 to-red-900',
        image: '/images/rainbet-limbo.jpg',
        path: 'limbo',
        icon: '🚀',
        players: 325,
        rtp: '%99.0',
        maxWin: '1M x',
        volatility: 'Maksimum'
    }
];

export default function OriginalsSlider({ onNavigate }: { onNavigate: (v: string) => void }) {
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
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-0 my-2 md:my-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    Orijinal Oyunlar
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

            {/* Slider container with padding for shadows */}
            <div 
                className="relative w-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Horizontal Scroll Area */}
                <div 
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-8 pt-2 px-2 snap-x snap-mandatory scrollbar-hide" 
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {ORIGINALS_DATA.map((game) => (
                        <div key={game.id} className="shrink-0 snap-start flex flex-col items-center group">
                            {/* Card Body - Portrait */}
                            <div 
                                onClick={() => setSelectedGame(game)}
                                className="w-[140px] h-[190px] md:w-[160px] md:h-[220px] relative rounded-2xl overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_40px_rgba(0,255,163,0.25)] transition-all duration-500 transform group-hover:-translate-y-2 border border-white/5 hover:border-[#10B981]/40"
                            >
                                <img src={game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Play button appears on hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <Play className="w-5 h-5 text-white fill-current ml-1" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* External Player Count */}
                            <div className="mt-3 flex items-center gap-1.5 px-2">
                                <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse"></div>
                                <span className="text-zinc-400 text-xs font-bold font-sans">
                                    <span className="text-white">{game.players}</span> Oyuncular
                                </span>
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
