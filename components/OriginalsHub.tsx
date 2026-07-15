import React from 'react';
import { Play, Sparkles, ShieldCheck, MonitorPlay } from 'lucide-react';

const ORIGINALS = [
    {
        id: 'blackjack-pro',
        name: 'Blackjack PRO',
        desc: 'Klasik casino deneyimi, premium kalite.',
        color: 'from-emerald-600 to-emerald-900',
        image: '/originals/blackjack_pro.jpg',
        path: 'blackjack-pro',
        icon: '♠️',
        popular: true
    },
    {
        id: 'plinko-pro',
        name: 'Plinko PRO',
        desc: 'Fizik tabanlı çarpan eğlencesi.',
        color: 'from-purple-600 to-purple-900',
        image: '/originals/plinko_pro.jpg',
        path: 'plinko',
        icon: '🎯',
        popular: true
    },
    {
        id: 'dice',
        name: 'Dice',
        desc: 'Hızlı, adil ve kazançlı zar oyunu.',
        color: 'from-blue-600 to-blue-900',
        image: '/originals/dice.jpg',
        path: 'dice',
        icon: '🎲'
    },
    {
        id: 'limbo',
        name: 'Limbo',
        desc: 'Sınırları zorla, devasa çarpanları yakala.',
        color: 'from-red-600 to-red-900',
        image: '/originals/limbo.jpg',
        path: 'limbo',
        icon: '🚀'
    },
    {
        id: 'keno',
        name: 'Keno',
        desc: 'Şansını sayılarla dene.',
        color: 'from-orange-500 to-orange-800',
        image: '/originals/keno.jpg',
        path: 'keno',
        icon: '🎱'
    },
    {
        id: 'hilo',
        name: 'HiLo',
        desc: 'Bir sonraki kart yüksek mi düşük mü?',
        color: 'from-pink-600 to-pink-900',
        image: '/originals/hilo.jpg',
        path: 'hilo',
        icon: '🃏'
    }
];

export default function OriginalsHub({ onNavigate }: { onNavigate: (v: string) => void }) {
    return (
        <div className="w-full min-h-[calc(100vh-60px)] bg-[#050505] p-6 md:p-12 relative overflow-hidden font-sans">
            
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#ffd700]/10 blur-[150px] rounded-full"></div>
                 <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full mix-blend-screen"></div>
                 <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[150px] rounded-full mix-blend-screen"></div>
                 
                 {/* Floating Particles for Gaming Atmosphere */}
                 {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-[#ffd700] animate-pulse"
                        style={{
                            width: Math.random() * 4 + 1 + 'px',
                            height: Math.random() * 4 + 1 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            opacity: Math.random() * 0.5 + 0.1,
                            animationDuration: Math.random() * 3 + 2 + 's',
                            animationDelay: Math.random() * 2 + 's'
                        }}
                    ></div>
                 ))}
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-10 md:mb-16 text-center">
                    <div className="flex items-center gap-2 mb-3 bg-white/5 border border-[#ffd700]/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#ffd700]" />
                        <span className="text-[#ffd700] text-[10px] md:text-xs font-bold uppercase tracking-widest">724BETS Exclusive</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3 drop-shadow-lg">
                        724BETS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#b8860b]">ORIGINALS</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl text-xs md:text-sm px-4">
                        Sadece 724BETS'e özel, Provably Fair altyapısıyla geliştirilmiş, piyasanın en yüksek RTP (Geri Ödeme) oranlarına sahip premium oyun serisi.
                    </p>
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 px-2 md:px-0">
                    {ORIGINALS.map((game) => (
                        <div 
                            key={game.id}
                            onClick={() => onNavigate(game.path)}
                            className="group relative aspect-[4/5] md:aspect-video rounded-xl md:rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-[#ffd700]/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] transform hover:-translate-y-1 md:hover:-translate-y-2 flex flex-col"
                        >
                            {/* Card Background Image */}
                            <img src={game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105" />
                            
                            {/* Card Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                            
                            <div className="absolute inset-0 opacity-[0.15]" 
                                 style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
                            </div>

                            {/* Inner Content */}
                            <div className="absolute inset-0 p-3 md:p-5 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div className="text-3xl md:text-4xl drop-shadow-lg filter group-hover:scale-110 transition-transform">
                                        {game.icon}
                                    </div>
                                    {game.popular && (
                                        <span className="bg-white/20 backdrop-blur-sm text-white text-[8px] md:text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 md:px-2.5 md:py-1 rounded-full border border-white/30">
                                            Popüler
                                        </span>
                                    )}
                                </div>
                                
                                <div className="mt-auto">
                                    <h3 className="text-sm md:text-xl font-black text-white tracking-tight mb-0.5 md:mb-1 group-hover:text-[#ffd700] transition-colors leading-tight">{game.name}</h3>
                                    <p className="text-white/70 text-[9px] md:text-xs leading-snug hidden md:block">{game.desc}</p>
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

                {/* 724TV Banner */}
                <div 
                    onClick={() => onNavigate('724tv')}
                    className="mt-12 relative w-full rounded-2xl overflow-hidden cursor-pointer group border border-white/10 hover:border-[#ffd700]/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_40px_rgba(255,215,0,0.15)] transform hover:-translate-y-1"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] z-0"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-4 md:mb-0 text-center md:text-left">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30 group-hover:bg-red-500/20 transition-colors relative shrink-0">
                                <MonitorPlay className="w-8 h-8 text-red-500" />
                                <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                                <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500"></div>
                            </div>
                            <div>
                                <div className="flex flex-col md:flex-row items-center gap-2 mb-1">
                                    <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded animate-pulse">CANLI YAYIN</span>
                                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">724TV Özel Maç Yayınları</h3>
                                </div>
                                <p className="text-gray-400 text-xs md:text-sm">En popüler spor müsabakalarını HD kalitede, kesintisiz ve bedava izleyin.</p>
                            </div>
                        </div>
                        
                        <div className="w-full md:w-auto mt-2 md:mt-0">
                            <button className="w-full md:w-auto px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:border-[#ffd700]/30 group-hover:text-[#ffd700]">
                                <Play className="w-4 h-4" />
                                <span>Hemen İzle</span>
                            </button>
                        </div>
                    </div>
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
