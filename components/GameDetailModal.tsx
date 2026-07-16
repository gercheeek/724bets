import React, { useState, useEffect } from 'react';
import { X, Play, ShieldCheck } from 'lucide-react';

export interface GameData {
    id: string;
    name: string;
    desc: string;
    color: string;
    image: string;
    path: string;
    icon: string;
    players: number;
    popular?: boolean;
    rtp?: string;
    maxWin?: string;
    volatility?: string;
    fullDesc?: string;
}

interface GameDetailModalProps {
    game: GameData | null;
    isOpen: boolean;
    onClose: () => void;
    onPlay: (path: string) => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, isOpen, onClose, onPlay }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !game) return null;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Modal Content - Perfectly centered on both desktop and mobile */}
            <div 
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[600px] lg:w-[650px] max-h-[90vh] bg-[#111317] rounded-3xl z-[9999] shadow-[0_30px_100px_rgba(0,0,0,0.9)] border border-white/5 flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-8 h-8 md:w-10 md:h-10 bg-black/40 hover:bg-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all border border-white/10 shadow-lg"
                >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                <div className="flex-1 overflow-y-auto hide-scrollbar p-6 md:p-10 flex flex-col items-center justify-start relative">
                    
                    {/* Game Card Centered */}
                    <div className="w-[120px] h-[160px] md:w-[150px] md:h-[200px] shrink-0 mt-2 mb-6 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] relative group cursor-pointer" onClick={() => onPlay(game.path)}>
                         <img src={game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover rounded-xl border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl"></div>
                    </div>

                    {/* Game Title */}
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-8 text-center drop-shadow-lg">
                        {game.name}
                    </h1>

                    {/* Content Section - Left Aligned */}
                    <div className="w-full mb-10 text-left">
                        <h3 className="text-white font-bold text-sm md:text-base mb-3 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-zinc-400" />
                            Oyun Hakkında
                        </h3>
                        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                            {game.fullDesc || `${game.desc} ${game.name} oyunu tamamen şeffaf ve %100 kanıtlanabilir adil (Provably Fair) altyapısıyla çalışmaktadır. Sonuçlar önceden belirlenir ve dışarıdan asla müdahale edilemez. Hemen oynamaya başla ve devasa çarpanları yakala.`}
                        </p>
                    </div>

                    {/* Play Button */}
                    <div className="w-full mt-auto">
                        <button 
                            onClick={() => onPlay(game.path)}
                            className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl bg-[#00FFA3] hover:bg-[#00e693] text-black font-black text-lg md:text-xl tracking-wide flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(0,255,163,0.3)] hover:shadow-[0_0_60px_rgba(0,255,163,0.5)]"
                        >
                            <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                            HEMEN OYNA
                        </button>
                        
                        <div className="flex items-center justify-center gap-2 mt-4 text-center">
                            <span className="text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                                ŞU AN <span className="text-[#00FFA3]">{game.players.toLocaleString('tr-TR')} OYUNCU</span> AKTİF
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
};
