import React, { useState, useEffect } from 'react';
import { X, Play, TrendingUp, ShieldCheck, Activity, Award, Star } from 'lucide-react';

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
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998] transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Modal Content */}
            <div 
                className={`fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-[800px] h-[85vh] md:h-[600px] bg-[#0A0D14] md:rounded-3xl z-[9999] shadow-[0_0_100px_rgba(0,0,0,0.8)] border-t md:border border-white/10 flex flex-col overflow-hidden transition-all duration-500 ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full md:translate-y-1/2 opacity-0 scale-95'}`}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Hero Background Image */}
                <div className="relative w-full h-[45%] md:h-[55%] shrink-0 overflow-hidden">
                    <img 
                        src={game.image} 
                        alt={game.name} 
                        className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110 opacity-50" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
                    
                    {/* Game Centerpiece */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transform translate-y-4">
                        <div className="w-24 h-32 md:w-32 md:h-40 mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] relative">
                             {/* Displaying actual card image as the hero instead of an icon */}
                             <img src={game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover rounded-xl border-2 border-white/20 shadow-2xl" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-xl uppercase">{game.name}</h1>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 bg-[#0A0D14] p-6 md:p-8 flex flex-col relative z-10 overflow-y-auto">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
                        <div className="bg-[#131722] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                            <Activity className="w-5 h-5 text-[#00FFA3] mb-2" />
                            <span className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">RTP</span>
                            <span className="text-white font-black text-lg md:text-xl">{game.rtp || '%98.5'}</span>
                        </div>
                        <div className="bg-[#131722] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                            <TrendingUp className="w-5 h-5 text-fuchsia-400 mb-2" />
                            <span className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Max Kazanç</span>
                            <span className="text-white font-black text-lg md:text-xl">{game.maxWin || '10,000x'}</span>
                        </div>
                        <div className="bg-[#131722] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                            <Award className="w-5 h-5 text-amber-400 mb-2" />
                            <span className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Volatilite</span>
                            <span className="text-white font-black text-lg md:text-xl">{game.volatility || 'Yüksek'}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-zinc-400" />
                            Oyun Hakkında
                        </h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            {game.fullDesc || `${game.desc} ${game.name} oyunu tamamen şeffaf ve %100 kanıtlanabilir adil (Provably Fair) altyapısıyla çalışmaktadır. Sonuçlar önceden belirlenir ve dışarıdan asla müdahale edilemez. Hemen oynamaya başla ve devasa çarpanları yakala.`}
                        </p>
                    </div>

                    {/* Play Button - Fixed at bottom of content */}
                    <div className="mt-auto pt-4">
                        <button 
                            onClick={() => onPlay(game.path)}
                            className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#00FFA3] to-[#00b372] hover:from-[#00ffbb] hover:to-[#00cc88] text-black font-black text-xl md:text-2xl tracking-wide flex items-center justify-center gap-4 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(0,255,163,0.3)] hover:shadow-[0_15px_40px_rgba(0,255,163,0.5)]"
                        >
                            <Play className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                            HEMEN OYNA
                        </button>
                        <p className="text-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-4">
                            Şu an <span className="text-[#00FFA3]">{game.players.toLocaleString('tr-TR')} oyuncu</span> aktif
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
};
