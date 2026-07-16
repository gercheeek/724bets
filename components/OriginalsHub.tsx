import React, { useState, useEffect } from 'react';
import { Play, Sparkles, MonitorPlay, Gift, Maximize2, Users, Flame, Zap, Trophy, Shield } from 'lucide-react';
import LiveBetsTable from './LiveBetsTable';
import { GamificationPanel } from './GamificationPanel';
import { GameDetailModal, GameData } from './GameDetailModal';
import ModernChat from './ModernChat';
import { SiteUser } from '../types';
import { getGlobalConfig } from '../utils/supabase';

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
        id: 'blackjack',
        name: 'Blackjack PRO',
        desc: 'Klasik casino deneyimi, premium kalite.',
        color: 'from-emerald-600 to-emerald-900',
        image: '/images/rainbet-blackjack.jpg',
        path: 'blackjack-pro',
        icon: '♠️',
        players: 1215,
        rtp: '%99.5',
        maxWin: '2.5x',
        volatility: 'Düşük'
    },
    {
        id: 'roulette',
        name: 'Roulette VIP',
        desc: 'Orijinal 724Bets Rulet heyecanı.',
        color: 'from-emerald-600 to-emerald-900',
        image: '/images/rainbet-roulette.jpg',
        path: 'roulette',
        icon: '🎡',
        players: 852,
        rtp: '%97.3',
        maxWin: '35x',
        volatility: 'Orta'
    }
];

interface OriginalsHubProps {
    onNavigate: (v: string) => void;
    isLoggedIn?: boolean;
    siteUser?: SiteUser | null;
    userRole?: string | null;
}

export default function OriginalsHub({ onNavigate, isLoggedIn, siteUser, userRole }: OriginalsHubProps) {
    const [mounted, setMounted] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
    const [activeTab, setActiveTab] = useState<'kick' | '724tv' | 'none'>('kick');
    const [kickUrl, setKickUrl] = useState('https://player.kick.com/xqc');
    const [activeChannel, setActiveChannel] = useState('bein-sports-1');

    const TV_CHANNELS = [
        { id: 'bein-sports-1', name: 'beIN SPORTS 1', url: 'https://xslotlive2.xyz/channel?id=zirve', icon: '⚽' },
        { id: 'bein-sports-2', name: 'beIN SPORTS 2', url: 'https://xslotlive2.xyz/channel?id=b2', icon: '🏀' },
        { id: 'exxen', name: 'EXXEN SPOR', url: 'https://xslotlive2.xyz/channel?id=exxen', icon: '🏆' },
        { id: 's-sport', name: 'S SPORT', url: 'https://xslotlive2.xyz/channel?id=ssport', icon: '🏎️' }
    ];

    useEffect(() => {
        setMounted(true);
        // Load admin config
        getGlobalConfig('originals_config').then((config) => {
            if (config) {
                if (config.activeTab) setActiveTab(config.activeTab);
                if (config.kickUrl) setKickUrl(config.kickUrl);
            }
        });
    }, []);

    const renderStreamPlayer = () => {
        if (activeTab === 'none') return null;

        return (
            <div className="w-full flex flex-col gap-4 animate-fade-in-up">
                {/* PRO Interactive Cyberpunk Menu */}
                <div className="glass-panel flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl relative z-20">
                    <div className="flex items-center gap-2 p-1.5 bg-black/60 rounded-xl border border-white/5 shadow-inner">
                        <button 
                            onClick={() => setActiveTab('kick')}
                            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-black tracking-widest text-xs uppercase transition-all duration-500 ${activeTab === 'kick' ? 'bg-[#00FFA3] text-black shadow-[0_0_30px_rgba(0,255,163,0.5)] scale-105' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}
                        >
                            <Flame className={`w-4 h-4 ${activeTab === 'kick' ? 'text-black' : 'text-red-500'}`} />
                            Yayıncılar
                        </button>
                        <button 
                            onClick={() => setActiveTab('724tv')}
                            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-black tracking-widest text-xs uppercase transition-all duration-500 ${activeTab === '724tv' ? 'bg-[#00D4FF] text-black shadow-[0_0_30px_rgba(0,212,255,0.5)] scale-105' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}
                        >
                            <MonitorPlay className={`w-4 h-4 ${activeTab === '724tv' ? 'text-black' : 'text-[#00D4FF]'}`} />
                            724TV
                        </button>
                    </div>

                    {activeTab === '724tv' && (
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-2">
                            {TV_CHANNELS.map(ch => (
                                <button 
                                    key={ch.id}
                                    onClick={() => setActiveChannel(ch.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap font-bold text-xs uppercase transition-all border-2 ${activeChannel === ch.id ? 'bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.4)] scale-105' : 'bg-black/40 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white'}`}
                                >
                                    <span className="text-sm">{ch.icon}</span>
                                    {ch.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Video Player Container */}
                <div className="w-full rounded-[2rem] overflow-hidden cyber-border shadow-[0_30px_60px_rgba(0,0,0,0.8)] bg-black relative group aspect-video z-10">
                    {activeTab === 'kick' ? (
                         <iframe 
                            src={kickUrl} 
                            height="100%" 
                            width="100%" 
                            frameBorder="0" 
                            scrolling="no" 
                            allowFullScreen={true}
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                        ></iframe>
                    ) : (
                        <iframe 
                            src={TV_CHANNELS.find(c => c.id === activeChannel)?.url || ''} 
                            height="100%" 
                            width="100%" 
                            frameBorder="0" 
                            scrolling="no" 
                            allowFullScreen={true}
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                        ></iframe>
                    )}
                    
                    {/* Live Indicator overlay */}
                    <div className="absolute top-6 left-6 bg-red-600/90 backdrop-blur-md text-white text-xs font-black uppercase px-4 py-2 rounded-lg flex items-center gap-2 z-10 shadow-[0_0_25px_rgba(239,68,68,0.8)] pointer-events-none border border-red-400/30">
                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                        CANLI YAYIN
                    </div>

                    <div className="absolute inset-0 border-[4px] border-black/50 rounded-[2rem] pointer-events-none mix-blend-overlay"></div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-[calc(100vh-60px)] bg-[#05070A] relative overflow-hidden font-sans flex">
            
            {/* Deep Space / Cyberpunk Background Effects */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#00FFA3]/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/10 blur-[150px] rounded-full mix-blend-screen"></div>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            {/* Left/Main Area: Stream & Games */}
            <div className="flex-1 h-full overflow-y-auto custom-scrollbar relative z-10">
                <div className="w-full max-w-[1400px] mx-auto p-4 md:p-8 relative flex flex-col gap-10">
                    
                    {/* Premium Header Strip */}
                    <div className="glass-panel rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00FFA3]/0 via-[#00FFA3]/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FFA3] to-[#00D4FF] p-[2px] shadow-[0_0_30px_rgba(0,255,163,0.3)]">
                                <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                                    <Trophy className="w-8 h-8 text-[#00FFA3]" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-3">
                                    724<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFA3] to-[#00D4FF] neon-text-glow">ORIGINALS</span>
                                    <span className="bg-white text-black text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm font-bold -translate-y-3">PRO</span>
                                </h1>
                                <p className="text-zinc-400 text-sm mt-1 font-medium tracking-wide">Yeni Nesil Kripto Casino Deneyimi.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-xl border border-white/10 shadow-inner">
                                <Users className="w-5 h-5 text-[#00FFA3]" />
                                <span className="text-white font-black text-lg">24.5K <span className="text-zinc-500 font-bold text-xs uppercase ml-1">İzleyici</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Stream Area (Watch Party) */}
                    {!selectedGame && renderStreamPlayer()}

                    {/* Game Selected State (Stream goes PiP) */}
                    {selectedGame && (
                        <div className="w-full flex flex-col gap-4 animate-fade-in">
                            <div className="w-full glass-panel border border-[#00FFA3]/30 rounded-[2rem] p-12 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden shadow-[0_0_50px_rgba(0,255,163,0.1)]">
                                <img src={selectedGame.image} className="absolute inset-0 w-full h-full object-cover opacity-10 blur-xl scale-110" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-transparent to-[#05070A] z-0 opacity-80"></div>
                                
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-32 h-32 rounded-[2rem] overflow-hidden mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-[#00FFA3] transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                        <img src={selectedGame.image} className="w-full h-full object-cover scale-110" alt="" />
                                    </div>
                                    <h2 className="text-6xl font-black text-white mb-4 tracking-tighter neon-text-glow">{selectedGame.name}</h2>
                                    <p className="text-zinc-400 text-lg mb-10 max-w-lg leading-relaxed">{selectedGame.desc}</p>
                                    <div className="flex gap-6">
                                        <button 
                                            onClick={() => onNavigate(selectedGame.path)}
                                            className="px-12 py-5 bg-[#00FFA3] hover:bg-white text-black font-black text-lg uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-[0_0_40px_rgba(0,255,163,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] hover:-translate-y-2 flex items-center gap-3"
                                        >
                                            <Play className="w-6 h-6 fill-current" /> OYNA
                                        </button>
                                        <button 
                                            onClick={() => setSelectedGame(null)}
                                            className="px-8 py-5 bg-black/50 hover:bg-black text-white font-bold uppercase tracking-widest rounded-2xl transition-all duration-300 border border-white/10 hover:border-white/30 backdrop-blur-md"
                                        >
                                            Geri Dön
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <GamificationPanel className="w-full glass-panel rounded-3xl overflow-hidden border-white/5" isLoggedIn={isLoggedIn} onLoginClick={() => onNavigate('login')} />

                    {/* Pro Game Grid Divider */}
                    <div className="flex items-center justify-between mt-8 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-gradient-to-r from-[#00FFA3] to-transparent rounded-full"></div>
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                                <Shield className="w-8 h-8 text-[#00FFA3]" /> 
                                PRO <span className="text-zinc-600">SEÇKİSİ</span>
                            </h2>
                        </div>
                    </div>

                    {/* 3D Interactive Game Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 pb-12 w-full">
                        {ORIGINALS.map((game, i) => (
                            <div key={game.id} className="pro-card group cursor-pointer" onClick={() => setSelectedGame(game)}>
                                <div className="pro-card-inner relative w-full aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-[#1A1D24]">
                                    <div className="pro-card-glow"></div>
                                    <img src={game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-125 transition-transform duration-[1.5s] ease-out opacity-80 group-hover:opacity-100" />
                                    
                                    {/* Glass gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                                    
                                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <span className="text-3xl mb-2 block filter drop-shadow-lg">{game.icon}</span>
                                            <h3 className="text-white font-black text-xl tracking-tight mb-1">{game.name}</h3>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                <div className="w-2 h-2 rounded-full bg-[#00FFA3] shadow-[0_0_10px_#00FFA3] animate-pulse"></div>
                                                <span className="text-[#00FFA3] text-xs font-bold uppercase tracking-widest">{game.players} AKTİF</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20 backdrop-blur-[2px]">
                                        <div className="w-16 h-16 rounded-full bg-[#00FFA3] flex items-center justify-center shadow-[0_0_30px_#00FFA3] transform scale-50 group-hover:scale-100 transition-transform duration-500 delay-100">
                                            <Play className="w-8 h-8 text-black fill-current ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full pb-12">
                        <LiveBetsTable />
                    </div>
                </div>

                {/* PiP Stream Video */}
                {selectedGame && activeTab !== 'none' && (
                    <div className="fixed bottom-8 left-8 w-[380px] bg-black rounded-2xl border-2 border-[#00FFA3] shadow-[0_30px_60px_rgba(0,255,163,0.3)] z-50 group transition-all animate-fade-in-up overflow-hidden">
                        <div className="w-full aspect-video relative">
                           <div className="pointer-events-none w-full h-full">
                               {activeTab === 'kick' ? (
                                   <iframe src={kickUrl} height="100%" width="100%" frameBorder="0" scrolling="no" allowFullScreen={true}></iframe>
                               ) : (
                                   <iframe src={TV_CHANNELS.find(c => c.id === activeChannel)?.url || ''} height="100%" width="100%" frameBorder="0" scrolling="no" allowFullScreen={true}></iframe>
                               )}
                           </div>
                           <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-[60]">
                               <button 
                                   onClick={() => setSelectedGame(null)} 
                                   className="w-10 h-10 bg-black/80 rounded-xl flex items-center justify-center hover:bg-[#00FFA3] text-white hover:text-black backdrop-blur-md border border-white/20 transition-colors pointer-events-auto shadow-2xl"
                               >
                                   <Maximize2 className="w-5 h-5" />
                               </button>
                           </div>
                        </div>
                        <div className="bg-[#0B0E14] p-3 flex items-center justify-between border-t border-[#00FFA3]/30">
                            <span className="text-xs font-black text-[#00FFA3] uppercase tracking-widest flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#00FFA3] rounded-full animate-pulse"></div>
                                CANLI YAYIN
                            </span>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">724ORIGINALS PRO</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Area: Sticky Chat */}
            <div className="hidden lg:flex w-[380px] h-full flex-col bg-[#05070A]/90 backdrop-blur-2xl border-l border-white/5 relative z-20 shrink-0 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
                <ModernChat 
                    open={true} 
                    onClose={() => {}} 
                    siteUser={siteUser || null} 
                    userRole={userRole || null} 
                    isMobile={false} 
                />
            </div>
            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 163, 0.5); }
                .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}</style>
        </div>
    );
}
