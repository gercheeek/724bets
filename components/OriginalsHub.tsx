import React from 'react';
import { Play, Sparkles, ShieldCheck } from 'lucide-react';

const ORIGINALS = [
    {
        id: 'blackjack-pro',
        name: 'Blackjack PRO',
        desc: 'Klasik casino deneyimi, premium kalite.',
        color: 'from-emerald-600 to-emerald-900',
        path: 'blackjack-pro',
        icon: '♠️',
        popular: true
    },
    {
        id: 'plinko-pro',
        name: 'Plinko PRO',
        desc: 'Fizik tabanlı çarpan eğlencesi.',
        color: 'from-purple-600 to-purple-900',
        path: 'plinko',
        icon: '🎯',
        popular: true
    },
    {
        id: 'dice',
        name: 'Dice',
        desc: 'Hızlı, adil ve kazançlı zar oyunu.',
        color: 'from-blue-600 to-blue-900',
        path: 'dice',
        icon: '🎲'
    },
    {
        id: 'limbo',
        name: 'Limbo',
        desc: 'Sınırları zorla, devasa çarpanları yakala.',
        color: 'from-red-600 to-red-900',
        path: 'limbo',
        icon: '🚀'
    },
    {
        id: 'keno',
        name: 'Keno',
        desc: 'Şansını sayılarla dene.',
        color: 'from-orange-500 to-orange-800',
        path: 'keno',
        icon: '🎱'
    },
    {
        id: 'hilo',
        name: 'HiLo',
        desc: 'Bir sonraki kart yüksek mi düşük mü?',
        color: 'from-pink-600 to-pink-900',
        path: 'hilo',
        icon: '🃏'
    }
];

export default function OriginalsHub({ onNavigate }: { onNavigate: (v: string) => void }) {
    return (
        <div className="w-full min-h-[calc(100vh-60px)] bg-[#050505] p-6 md:p-12 relative overflow-hidden font-sans">
            
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none z-0">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#ffd700]/10 blur-[150px] rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="flex items-center gap-2 mb-4 bg-white/5 border border-[#ffd700]/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-[#ffd700]" />
                        <span className="text-[#ffd700] text-xs font-bold uppercase tracking-widest">724BETS Exclusive</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-lg">
                        724BETS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#b8860b]">ORIGINALS</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-sm md:text-base">
                        Sadece 724BETS'e özel, Provably Fair altyapısıyla geliştirilmiş, piyasanın en yüksek RTP (Geri Ödeme) oranlarına sahip premium oyun serisi.
                    </p>
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ORIGINALS.map((game) => (
                        <div 
                            key={game.id}
                            onClick={() => onNavigate(game.path)}
                            className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-[#ffd700]/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] transform hover:-translate-y-2"
                        >
                            {/* Card Background (Gradient + Noise) */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                            <div className="absolute inset-0 opacity-[0.15]" 
                                 style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
                            </div>

                            {/* Inner Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div className="text-5xl drop-shadow-lg filter group-hover:scale-110 transition-transform">
                                        {game.icon}
                                    </div>
                                    {game.popular && (
                                        <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/30">
                                            Popüler
                                        </span>
                                    )}
                                </div>
                                
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight mb-1 group-hover:text-[#ffd700] transition-colors">{game.name}</h3>
                                    <p className="text-white/70 text-sm">{game.desc}</p>
                                </div>
                            </div>

                            {/* Play Overlay */}
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                <div className="w-16 h-16 rounded-full bg-[#ffd700] flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.6)] transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                    <Play className="w-6 h-6 text-black fill-current ml-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Security Badge */}
                <div className="mt-16 flex justify-center">
                    <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase tracking-widest">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        Tüm Originals Oyunları %100 Adil (Provably Fair) Sertifikalıdır
                    </div>
                </div>

            </div>
        </div>
    );
}
