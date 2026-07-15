import React, { useState, useEffect } from 'react';
import { Play, Sparkles, ShieldCheck, MonitorPlay, Gift, Flame, Trophy, Users, ChevronRight } from 'lucide-react';
import LiveBetsTable from './LiveBetsTable';
import { GamificationPanel } from './GamificationPanel';

const ORIGINALS = [
    {
        id: 'blackjack-pro',
        name: 'Blackjack PRO',
        desc: 'Klasik casino deneyimi, premium kalite.',
        color: 'from-emerald-600 to-emerald-900',
        image: '/originals/blackjack_pro.jpg',
        path: 'blackjack-pro',
        icon: '♠️',
        popular: true,
        players: 1245
    },
    {
        id: 'plinko-pro',
        name: 'Plinko PRO',
        desc: 'Fizik tabanlı çarpan eğlencesi.',
        color: 'from-purple-600 to-purple-900',
        image: '/originals/plinko_pro.jpg',
        path: 'plinko',
        icon: '🎯',
        popular: true,
        players: 3892
    },
    {
        id: 'dice',
        name: 'Dice',
        desc: 'Hızlı, adil ve kazançlı zar oyunu.',
        color: 'from-blue-600 to-blue-900',
        image: '/originals/dice.jpg',
        path: 'dice',
        icon: '🎲',
        players: 843
    },
    {
        id: 'limbo',
        name: 'Limbo',
        desc: 'Sınırları zorla, devasa çarpanları yakala.',
        color: 'from-red-600 to-red-900',
        image: '/originals/limbo.jpg',
        path: 'limbo',
        icon: '🚀',
        players: 621
    },
    {
        id: 'keno',
        name: 'Keno',
        desc: 'Şansını sayılarla dene.',
        color: 'from-orange-500 to-orange-800',
        image: '/originals/keno.jpg',
        path: 'keno',
        icon: '🎱',
        players: 450
    },
    {
        id: 'hilo',
        name: 'HiLo',
        desc: 'Bir sonraki kart yüksek mi düşük mü?',
        color: 'from-pink-600 to-pink-900',
        image: '/originals/hilo.jpg',
        path: 'hilo',
        icon: '🃏',
        players: 320
    }
];

export default function OriginalsHub({ onNavigate }: { onNavigate: (v: string) => void }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <div className="w-full min-h-[calc(100vh-60px)] bg-[#0B0E14] p-4 md:p-8 relative overflow-hidden font-sans flex flex-col items-center">
            
            {/* Background elements - Neon theme */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00FFA3]/5 blur-[120px] rounded-[100%] opacity-60 mix-blend-screen"></div>
                 <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/5 blur-[150px] rounded-full mix-blend-screen"></div>
                 {/* Modern Grid Pattern instead of cubes */}
                 <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
            </div>

            <div className="w-full max-w-7xl relative z-10 flex flex-col gap-8">
                
                {/* Compact Header & Giveaways Strip */}
                <div className="flex flex-col lg:flex-row gap-6 mt-4">
                    {/* Hero Title - Compact */}
                    <div className="flex-1 bg-gradient-to-br from-[#131722] to-[#0A0D14] border border-white/5 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-[#00FFA3]/10 blur-[80px] rounded-full group-hover:bg-[#00FFA3]/20 transition-all duration-700"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4 bg-[#00FFA3]/10 border border-[#00FFA3]/30 px-3 py-1 rounded-full w-fit">
                                <Sparkles className="w-4 h-4 text-[#00FFA3]" />
                                <span className="text-[#00FFA3] text-xs font-bold uppercase tracking-widest">Premium Hub</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3">
                                724<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFA3] to-[#00b372]">GAMES</span>
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
                    <GamificationPanel className="w-full" />
                </div>

                {/* Slider Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Premium Oyunlar</h2>
                        <div className="hidden sm:block h-px w-32 bg-gradient-to-r from-[#00FFA3]/50 to-transparent"></div>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        <span>Kaydır</span>
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </div>

                {/* Horizontal Games Slider */}
                <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {ORIGINALS.map((game, i) => (
                        <div 
                            key={game.id}
                            onClick={() => onNavigate(game.path)}
                            className={`shrink-0 snap-start group relative rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-[#00FFA3]/50 transition-all duration-500 shadow-xl flex flex-col h-[320px] ${game.popular ? 'w-[300px] sm:w-[340px]' : 'w-[240px] sm:w-[260px]'}`}
                        >
                            <img src={game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-8 group-hover:translate-y-0 z-20 pointer-events-none">
                                <span className="text-[100px] drop-shadow-[0_0_30px_rgba(0,255,163,0.8)] filter brightness-125">{game.icon}</span>
                            </div>

                            <div className="absolute inset-0 p-5 flex flex-col justify-between z-30 transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-gray-300 group-hover:border-[#00FFA3]/30 group-hover:text-[#00FFA3] transition-colors">
                                        <Users className="w-3 h-3" />
                                        <span className="text-[10px] font-bold">{game.players.toLocaleString('tr-TR')} Oyuncu</span>
                                    </div>
                                    {game.popular && (
                                        <span className="bg-[#00FFA3] text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(0,255,163,0.5)]">
                                            Popüler
                                        </span>
                                    )}
                                </div>
                                
                                <div className="mt-auto flex justify-between items-end">
                                    <div>
                                        <h3 className="text-xl font-black text-white tracking-tight mb-1 group-hover:text-[#00FFA3] transition-colors leading-none">{game.name}</h3>
                                        <p className="text-gray-400 text-xs leading-snug max-w-[160px] group-hover:opacity-0 transition-opacity duration-300">{game.desc}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-[#00FFA3] group-hover:border-[#00FFA3] transition-all duration-300 shadow-lg transform group-hover:scale-110">
                                        <Play className="w-4 h-4 text-white group-hover:text-black fill-current ml-1" />
                                    </div>
                                </div>
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

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
