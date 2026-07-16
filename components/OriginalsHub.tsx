import React, { useState, useEffect } from 'react';
import { Play, Sparkles, ShieldCheck, MonitorPlay, Gift, Flame, Trophy, Users, ChevronRight } from 'lucide-react';
import LiveBetsTable from './LiveBetsTable';
import { GamificationPanel } from './GamificationPanel';
import { GameDetailModal, GameData } from './GameDetailModal';

const ORIGINALS: GameData[] = [
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

export default function OriginalsHub({ onNavigate, isLoggedIn }: { onNavigate: (v: string) => void, isLoggedIn?: boolean }) {
    const [mounted, setMounted] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GameData | null>(null);

    useEffect(() => setMounted(true), []);

    return (
        <div className="w-full min-h-[calc(100vh-60px)] bg-[#0B0E14] p-4 md:p-8 relative overflow-hidden font-sans flex flex-col items-center">
            
            {/* Background elements - Neon theme */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#10B981]/5 blur-[120px] rounded-[100%] opacity-60 mix-blend-screen"></div>
                 <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/5 blur-[150px] rounded-full mix-blend-screen"></div>
                 {/* Modern Grid Pattern instead of cubes */}
                 <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
            </div>

            <div className="w-full max-w-7xl relative z-10 flex flex-col gap-8">
                
                {/* Compact Header & Giveaways Strip */}
                <div className="flex flex-col lg:flex-row gap-6 mt-4">
                    {/* Hero Title - Compact */}
                    <div className="flex-1 bg-gradient-to-br from-[#131722] to-[#0A0D14] border border-white/5 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-[#10B981]/10 blur-[80px] rounded-full group-hover:bg-[#10B981]/20 transition-all duration-700"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4 bg-[#10B981]/10 border border-[#10B981]/30 px-3 py-1 rounded-full w-fit">
                                <Sparkles className="w-4 h-4 text-[#10B981]" />
                                <span className="text-[#10B981] text-xs font-bold uppercase tracking-widest">Premium Hub</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3">
                                724<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#00b372]">GAMES</span>
                            </h1>
                            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
                                Sadece 724BETS'e özel premium oyunlar ve devasa çekilişler.
                            </p>
                        </div>
                    </div>

                    {/* Giveaway Banner - Compact Strip */}
                    <div className="lg:w-[450px] bg-gradient-to-br from-fuchsia-900/40 to-[#0A0D14] border border-fuchsia-500/30 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center cursor-pointer group hover:border-fuchsia-500/50 transition-colors">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-fuchsia-500/20 blur-[50px] rounded-full group-hover:bg-fuchsia-500/30 transition-all"></div>
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center shrink-0">
                                <Gift className="w-8 h-8 text-fuchsia-400 group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-red-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">Son Gün</span>
                                </div>
                                <h2 className="text-2xl font-black text-white leading-none mb-1">50.000 TL</h2>
                                <p className="text-fuchsia-200/70 text-xs">Haftalık Büyük Çekiliş</p>
                            </div>
                            <div className="ml-auto">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-fuchsia-500 transition-colors">
                                    <ChevronRight className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gamification Panel Section */}
                <div className="w-full">
                    <GamificationPanel className="w-full" isLoggedIn={isLoggedIn} onLoginClick={() => onNavigate('login')} />
                </div>

                {/* Slider Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Premium Oyunlar</h2>
                        <div className="hidden sm:block h-px w-32 bg-gradient-to-r from-[#10B981]/50 to-transparent"></div>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        <span>Kaydır</span>
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </div>

                {/* Horizontal Games Slider - Portrait Cards */}
                <div className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {ORIGINALS.map((game, i) => (
                        <div key={game.id} className="shrink-0 snap-start flex flex-col items-center group">
                            {/* Card Body - Portrait */}
                            <div 
                                onClick={() => setSelectedGame(game)}
                                className="w-[150px] h-[200px] md:w-[180px] md:h-[240px] relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(0,255,163,0.3)] transition-all duration-300 transform group-hover:-translate-y-2 border border-white/5 group-hover:border-[#10B981]/50"
                            >
                                <img src={game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                
                                {/* Very subtle gradient just to make sure image pops if needed, no texts blocking image */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Play button appears on hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <Play className="w-5 h-5 text-white fill-current ml-1" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* External Player Count (Matches Screenshot) */}
                            <div className="mt-3 flex items-center gap-1.5 px-2">
                                <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]"></div>
                                <span className="text-zinc-300 text-xs font-bold font-sans">
                                    <span className="text-white">{game.players}</span> Oyuncular
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TV Banner - Compact */}
                <div 
                    onClick={() => onNavigate('724tv')}
                    className="w-full bg-gradient-to-r from-red-900/40 via-[#131722] to-[#0A0D14] border border-red-500/20 rounded-3xl p-6 cursor-pointer group hover:border-red-500/50 transition-colors flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 relative">
                            <MonitorPlay className="w-6 h-6 text-red-500" />
                            <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">CANLI</span>
                                <h3 className="text-xl font-black text-white">724TV Özel Yayın</h3>
                            </div>
                            <p className="text-zinc-400 text-sm">Tüm maçları kesintisiz HD izle.</p>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white font-bold uppercase text-xs rounded-xl transition-colors flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center">
                        <Play className="w-4 h-4 fill-current" /> Hemen İzle
                    </button>
                </div>

                {/* Live Bets */}
                <div className="w-full pb-8">
                    <LiveBetsTable />
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
