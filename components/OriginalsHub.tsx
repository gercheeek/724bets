import React, { useState, useEffect } from 'react';
import { Play, Sparkles, ShieldCheck, MonitorPlay, Gift, Flame, Trophy, Users } from 'lucide-react';
import LiveBetsTable from './LiveBetsTable';

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
        players: 1245,
        span: 'col-span-2 md:col-span-2 row-span-2'
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
        players: 3892,
        span: 'col-span-2 md:col-span-2 row-span-2'
    },
    {
        id: 'dice',
        name: 'Dice',
        desc: 'Hızlı, adil ve kazançlı zar oyunu.',
        color: 'from-blue-600 to-blue-900',
        image: '/originals/dice.jpg',
        path: 'dice',
        icon: '🎲',
        players: 843,
        span: 'col-span-1 md:col-span-1 row-span-1'
    },
    {
        id: 'limbo',
        name: 'Limbo',
        desc: 'Sınırları zorla, devasa çarpanları yakala.',
        color: 'from-red-600 to-red-900',
        image: '/originals/limbo.jpg',
        path: 'limbo',
        icon: '🚀',
        players: 621,
        span: 'col-span-1 md:col-span-1 row-span-1'
    },
    {
        id: 'keno',
        name: 'Keno',
        desc: 'Şansını sayılarla dene.',
        color: 'from-orange-500 to-orange-800',
        image: '/originals/keno.jpg',
        path: 'keno',
        icon: '🎱',
        players: 450,
        span: 'col-span-1 md:col-span-1 row-span-1'
    },
    {
        id: 'hilo',
        name: 'HiLo',
        desc: 'Bir sonraki kart yüksek mi düşük mü?',
        color: 'from-pink-600 to-pink-900',
        image: '/originals/hilo.jpg',
        path: 'hilo',
        icon: '🃏',
        players: 320,
        span: 'col-span-1 md:col-span-1 row-span-1'
    }
];

export default function OriginalsHub({ onNavigate }: { onNavigate: (v: string) => void }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <div className="w-full min-h-[calc(100vh-60px)] bg-[#050505] p-4 md:p-10 relative overflow-hidden font-sans">
            
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                 {/* Fog / Glow */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#ffd700]/5 blur-[150px] rounded-[100%] opacity-80 mix-blend-screen"></div>
                 <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full mix-blend-screen"></div>
                 
                 {/* Premium Grid Pattern */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>

                 {/* Floating Particles for Gaming Atmosphere */}
                 {mounted && Array.from({ length: 30 }).map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-[#ffd700] animate-pulse"
                        style={{
                            width: Math.random() * 3 + 1 + 'px',
                            height: Math.random() * 3 + 1 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            opacity: Math.random() * 0.4 + 0.1,
                            animationDuration: Math.random() * 4 + 2 + 's',
                            animationDelay: Math.random() * 2 + 's',
                            boxShadow: '0 0 10px rgba(255,215,0,0.5)'
                        }}
                    ></div>
                 ))}
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-10 md:mb-12 text-center mt-4">
                    <div className="flex items-center gap-2 mb-4 bg-gradient-to-r from-[#ffd700]/20 to-[#b8860b]/20 border border-[#ffd700]/30 px-4 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(255,215,0,0.15)]">
                        <Sparkles className="w-4 h-4 text-[#ffd700]" />
                        <span className="text-[#ffd700] text-xs md:text-sm font-bold uppercase tracking-[0.2em]">Premium Hub</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                        724<span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#b8860b]">GAMES</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-sm md:text-base px-4 font-medium leading-relaxed">
                        Sadece 724BETS'e özel premium oyunlar, devasa çekilişler ve sınırsız bonuslar.
                    </p>
                </div>

                {/* Giveaways & Bonuses Section */}
                <div className="mb-12 md:mb-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Main Giveaway Banner */}
                    <div className="md:col-span-2 relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1c23] to-[#0a0a0a] border border-[#ffd700]/20 shadow-[0_10px_40px_rgba(255,215,0,0.1)] group cursor-pointer">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#ffd700]/10 blur-[80px] rounded-full group-hover:bg-[#ffd700]/20 transition-all duration-700"></div>
                        
                        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between h-full gap-6">
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                                    <span className="bg-red-500/20 text-red-500 border border-red-500/30 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                                        <Flame className="w-3 h-3" /> SON GÜNLER
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">50.000 TL<br/><span className="text-[#ffd700]">Haftalık Çekiliş</span></h2>
                                <p className="text-gray-400 text-xs md:text-sm mb-6 max-w-sm">
                                    724Games'de oynadığın her 100 TL için 1 bilet kazan, büyük ödüle ortak ol!
                                </p>
                                <button className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-[#ffd700] to-[#b8860b] hover:from-[#ffeb73] hover:to-[#daa520] text-black font-black uppercase tracking-wider text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transform group-hover:-translate-y-1">
                                    Hemen Katıl
                                </button>
                            </div>
                            <div className="hidden md:flex shrink-0 w-48 h-48 relative">
                                <div className="absolute inset-0 bg-[#ffd700]/20 blur-[40px] rounded-full animate-pulse"></div>
                                <Gift className="w-full h-full text-[#ffd700] drop-shadow-[0_10px_20px_rgba(255,215,0,0.5)] transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500" strokeWidth={1} />
                            </div>
                        </div>
                    </div>

                    {/* Active Bonus Card */}
                    <div className="md:col-span-1 relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-b from-[#151520] to-[#0a0a0f] border border-blue-500/20 shadow-[0_10px_30px_rgba(59,130,246,0.1)] group flex flex-col p-6 md:p-8 justify-center cursor-pointer">
                        <div className="absolute inset-0 bg-blue-500/5 blur-[50px] group-hover:bg-blue-500/10 transition-all duration-500"></div>
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <Trophy className="w-16 h-16 text-blue-400 mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                            <h3 className="text-xl md:text-2xl font-black text-white mb-2">Günün Bonusu</h3>
                            <p className="text-blue-200 text-sm font-bold mb-1">%100 Çevrimsiz</p>
                            <p className="text-gray-400 text-xs mb-6">Tüm 724Games oyunlarında geçerli limitsiz kayıp bonusu.</p>
                            <button className="w-full py-3 bg-blue-500/10 border border-blue-500/30 group-hover:bg-blue-500/20 text-blue-400 font-bold uppercase tracking-wider text-xs rounded-xl transition-all">
                                Bonusu Al
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section Title */}
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Premium Oyunlar</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>

                {/* Asymmetric Game Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                    {ORIGINALS.map((game, i) => (
                        <div 
                            key={game.id}
                            onClick={() => onNavigate(game.path)}
                            className={`group relative rounded-xl md:rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-[#ffd700]/50 transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(255,215,0,0.15)] flex flex-col ${game.span || 'col-span-1 md:col-span-1'} ${game.popular ? 'aspect-square md:aspect-auto md:min-h-[300px]' : 'aspect-square md:aspect-[4/5]'}`}
                        >
                            {/* Card Background Image */}
                            <img src={game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity duration-700 group-hover:scale-110" />
                            
                            {/* Card Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Noise */}
                            <div className="absolute inset-0 opacity-[0.15]" 
                                 style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
                            </div>

                            {/* 3D Floating Icon (Appears on Hover) */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-8 group-hover:translate-y-0 z-20 pointer-events-none">
                                <span className="text-[80px] md:text-[120px] drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] filter brightness-125">{game.icon}</span>
                            </div>

                            {/* Inner Content */}
                            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-30 transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-gray-300 group-hover:border-green-500/30 group-hover:text-green-400 transition-colors">
                                        <Users className="w-3 h-3" />
                                        <span className="text-[9px] md:text-[10px] font-bold">{game.players.toLocaleString('tr-TR')} Oyuncu</span>
                                    </div>
                                    {game.popular && (
                                        <span className="bg-gradient-to-r from-[#ffd700] to-[#b8860b] text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                                            Popüler
                                        </span>
                                    )}
                                </div>
                                
                                <div className="mt-auto flex justify-between items-end">
                                    <div>
                                        <h3 className="text-lg md:text-2xl font-black text-white tracking-tight mb-1 group-hover:text-[#ffd700] transition-colors leading-none drop-shadow-md">{game.name}</h3>
                                        <p className="text-gray-400 text-[10px] md:text-xs leading-snug max-w-[200px] group-hover:opacity-0 transition-opacity duration-300">{game.desc}</p>
                                    </div>
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-[#ffd700] group-hover:border-[#ffd700] transition-all duration-300 shadow-lg transform group-hover:scale-110">
                                        <Play className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-black fill-current ml-1 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 724TV Banner - Upgraded to match new style */}
                <div 
                    onClick={() => onNavigate('724tv')}
                    className="mt-12 relative w-full rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group border border-red-500/20 hover:border-red-500/50 transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(239,68,68,0.15)] transform hover:-translate-y-1"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#1a0f0f] to-[#0a0a0a] z-0"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay z-0"></div>
                    <div className="absolute -left-32 -top-32 w-96 h-96 bg-red-600/10 blur-[100px] rounded-full group-hover:bg-red-600/20 transition-all duration-700 z-0"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-10 gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center border border-red-500/30 group-hover:scale-110 transition-transform duration-500 relative shrink-0 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                                <MonitorPlay className="w-10 h-10 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 animate-ping"></div>
                                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#1a0f0f]"></div>
                            </div>
                            <div>
                                <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                    <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]">CANLI YAYIN</span>
                                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">724TV Özel Maç Yayınları</h3>
                                </div>
                                <p className="text-gray-400 text-sm font-medium">En popüler spor müsabakalarını HD kalitede, kesintisiz ve bedava izleyin.</p>
                            </div>
                        </div>
                        
                        <div className="w-full md:w-auto">
                            <button className="w-full md:w-auto px-10 py-4 bg-red-600/10 border border-red-500/30 group-hover:bg-red-500 group-hover:border-red-500 text-red-500 group-hover:text-white font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.2)] group-hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]">
                                <Play className="w-5 h-5 fill-current" />
                                <span>Hemen İzle</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Live Bets & Leaderboards */}
                <div className="mt-8 md:mt-12 w-full">
                    <LiveBetsTable />
                </div>

                {/* Footer Security Badge */}
                <div className="mt-8 flex justify-center pb-8">
                    <div className="flex items-center gap-3 text-gray-500/60 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/5">
                        <ShieldCheck className="w-4 h-4 text-green-500/70" />
                        Tüm 724GAMES Oyunları %100 Adil (Provably Fair) Sertifikalıdır
                    </div>
                </div>

            </div>
        </div>
    );
}
