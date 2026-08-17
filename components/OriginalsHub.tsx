import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, ShieldCheck, MonitorPlay, Gift, Flame, Trophy, Users, ChevronRight, Zap, Crown, Star } from 'lucide-react';
import { GamificationPanel } from './GamificationPanel';
import { GameDetailModal, GameData } from './GameDetailModal';
import VIPHeroBanner from './VIPHeroBanner';
import GamesHeroBanner from './GamesHeroBanner';
import HowItWorksCards from './HowItWorksCards';

import PlinkoView from './PlinkoView';
import LimboView from './LimboView';
import RouletteView from './RouletteView';
import BlackjackProView from './BlackjackProView';
import KenoView from './KenoView';
import ChickenRunView from './ChickenRunView';
import DiceView from './DiceView';
import MinesView from './MinesView';
import WarView from './WarView';
import HiLoView from './HiLoView';
import CrashTurboView from './CrashTurboView';
import TurboMinesView from './TurboMinesView';

import { useLanguage } from '../contexts/LanguageContext';
import { getOriginalsData } from './OriginalsSlider';

export default function OriginalsHub({ onNavigate, isLoggedIn, siteUser, setSiteUser, onAuthRequired }: any) {
    const { t } = useLanguage();
    const ORIGINALS = getOriginalsData(t);
    const [mounted, setMounted] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
    const handleInternalPlay = (path: string) => {
        onNavigate(path);
    };
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const hubRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!hubRef.current) return;
        const rect = hubRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });
    };

    return (
        <div 
            ref={hubRef}
            onMouseMove={handleMouseMove}
            className="w-full min-h-[calc(100vh-60px)] bg-[#0A0C10] p-4 md:p-8 relative overflow-hidden font-sans flex flex-col items-center selection:bg-fuchsia-500/30"
        >
            {/* Global Cursor Spotlight (Flashlight Effect) */}
            <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
                style={{
                  background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 255, 0.05), transparent 50%)`
                }}
            ></div>
            
            {/* Extremely dark ambient neon backgrounds */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020202]">
                 {/* Subtle magenta glow top right */}
                 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d946ef]/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
                 <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="w-full max-w-6xl relative z-10 flex flex-col gap-6">
                
                {/* VIP Dashboard & Hero Banner */}
                <div className="w-full my-4">
                   <div className="mt-8 relative z-[100] transition-all duration-500 animate-fade-in">
                      <GamesHeroBanner onNavigate={handleInternalPlay} isLoggedIn={isLoggedIn} onAuthRequired={onAuthRequired} setSiteUser={setSiteUser} />
                   </div>
                </div>

                {/* Modern Header */}
                <div className="flex items-center justify-between mt-6 mb-4 relative">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                            PREMİUM <span className="text-[#00ff88]">OYUNLAR</span>
                        </h2>
                    </div>
                </div>

                {/* Modern Premium Game Cards */}
                <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {ORIGINALS.map((game, i) => (
                        <div key={game.id} className="shrink-0 snap-start">
                            <div 
                                onClick={() => handleInternalPlay(game.path)}
                                className="group w-[150px] md:w-[170px] bg-[#15171e] border border-white/5 rounded-xl overflow-hidden cursor-pointer hover:border-[#00ff88]/30 hover:shadow-[0_0_20px_rgba(0,255,136,0.15)] transition-all"
                            >
                                <div className="h-[140px] md:h-[160px] w-full overflow-hidden relative">
                                    <img src={game.image} alt={game.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                       <div className="w-12 h-12 rounded-full bg-[#00ff88] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,136,0.5)] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-black border-b-[8px] border-b-transparent ml-1"></div>
                                       </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-[#15171e]">
                                    <h3 className="text-sm font-bold text-white truncate group-hover:text-[#00ff88] transition-colors">{game.name}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2-Column Grid: Modern Live Feed and Quests */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-4">
                    {/* Live Feed Panel */}
                    <div className="bg-[#15171e] border border-white/5 rounded-xl overflow-hidden relative group">
                        <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                            <span className="text-sm font-semibold text-white/80">Canlı Feed</span>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-[#00E5FF]/50"></div>
                                <div className="w-2 h-2 rounded-full bg-[#00E5FF]/70"></div>
                                <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></div>
                            </div>
                        </div>
                        <div className="p-4 h-[200px] overflow-hidden relative">
                            {/* Fade out top and bottom */}
                            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#15171e] to-transparent z-10"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#15171e] to-transparent z-10"></div>
                            
                            <div className="animate-[feed-scroll_15s_linear_infinite] flex flex-col gap-3">
                                <p className="text-sm"><span className="text-[#00E5FF] font-medium">@Ahmet34</span> 'Casino Noir' oyununda <span className="text-white font-bold">12.500₺</span> KAZANDI!</p>
                                <p className="text-sm"><span className="text-[#a855f7] font-medium animate-pulse flex items-center gap-1 inline-flex"><Zap size={14}/> BÜYÜK KASA</span> @Vip_Memo'ya VURDU!</p>
                                <p className="text-sm"><span className="text-[#00E5FF] font-medium">@Kral77</span> 'Galactic Spin' ile <span className="text-[#00ff88] font-bold">500x</span> çarpan yakaladı.</p>
                                <p className="text-sm"><span className="text-[#00E5FF] font-medium">@Mehmet_88</span> 'Seka Çark' <span className="text-white font-bold">1.000₺</span> KAZANDI!</p>
                                <p className="text-sm"><span className="text-zinc-300 font-medium flex items-center gap-1 inline-flex"><Crown size={14}/> VIP</span> @Deli_Dolu VIP Club'a Katıldı!</p>
                            </div>
                        </div>
                    </div>

                    {/* Premium Contracts (Daily Quests) */}
                    <div className="bg-[#15171e] border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-[#a855f7]/30 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#a855f7]/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-[#a855f7]/20 transition-all"></div>
                        
                        <div className="text-sm font-semibold text-white/80 mb-5 flex items-center gap-2">
                            <Star size={16} className="text-[#a855f7]" />
                            GÜNLÜK GÖREVLER
                        </div>
                        
                        <div className="bg-black/30 border border-white/5 p-4 rounded-lg relative z-10">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-white">Görev: Galactic Spin</span>
                                <span className="text-xs font-bold text-[#00ff88] bg-[#00ff88]/10 px-2 py-1 rounded">+500₺</span>
                            </div>
                            <div className="w-full h-2 bg-[#0A0C10] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#00ff88] to-emerald-400" style={{ width: '60%' }}></div>
                            </div>
                            <div className="text-right text-[10px] mt-1.5 text-white/50">60/100 Döndürme</div>
                        </div>

                        <div className="bg-black/30 border border-white/5 p-4 rounded-lg mt-3 relative z-10">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-white">Görev: Casino Noir</span>
                                <span className="text-xs font-bold text-[#a855f7] bg-[#a855f7]/10 px-2 py-1 rounded">+10 FreeSpin</span>
                            </div>
                            <div className="w-full h-2 bg-[#0A0C10] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#a855f7] to-purple-400" style={{ width: '30%' }}></div>
                            </div>
                            <div className="text-right text-[10px] mt-1.5 text-white/50">3/10 Kazanç</div>
                        </div>
                    </div>
                </div>

                <div className="w-full my-4">
                   <HowItWorksCards />
                </div>

                {/* TV Banner - Retro Arcade Style */}
                <div 
                    onClick={() => onNavigate('724tv')}
                    className="retro-tv-banner w-full mt-4 cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
                >
                    {/* Animated scanlines inside the TV banner */}
                    <div className="absolute inset-0 tv-scanlines pointer-events-none z-0"></div>
                    
                    <div className="flex items-center gap-5 relative z-10 w-full sm:w-auto">
                        <div className="retro-tv-icon-container">
                            <div className="retro-tv-icon"></div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="retro-badge animate-pulse">CANLI</span>
                                <h3 className="arcade-header text-[color:var(--theme-accent)]" style={{ textShadow: '2px 2px 0 #005555', fontSize: '14px' }}>
                                    724BETS <span className="text-white">TV</span>
                                </h3>
                            </div>
                            <p className="retro-tv-text">Tüm maçları kesintisiz HD izle.</p>
                        </div>
                    </div>
                    
                    <button className="retro-btn relative z-10 w-full sm:w-auto justify-center">
                        <span className="retro-btn-icon"></span> HEMEN İZLE
                    </button>
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
                
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

                .retro-tv-banner {
                    background-color: #001111;
                    border: 4px solid #005555;
                    box-shadow: inset 0 0 20px rgba(6,182,212,0.2), 0 10px 0 #000;
                    border-radius: 8px;
                    padding: 24px;
                    transition: all 0.2s;
                }
                .retro-tv-banner:hover {
                    border-color: #06b6d4;
                    box-shadow: inset 0 0 30px rgba(6,182,212,0.4), 0 5px 0 #000;
                    transform: translateY(5px);
                }
                .retro-tv-banner:active {
                    box-shadow: inset 0 0 30px rgba(6,182,212,0.6), 0 0 0 #000;
                    transform: translateY(10px);
                }
                .tv-scanlines {
                    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px);
                }
                .retro-tv-icon-container {
                    width: 50px;
                    height: 50px;
                    border: 3px solid #06b6d4;
                    background: rgba(6,182,212,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: inset 0 0 10px rgba(6,182,212,0.5), 0 0 10px rgba(6,182,212,0.5);
                }
                .retro-tv-icon {
                    width: 24px; height: 18px;
                    border: 3px solid #06b6d4;
                    border-radius: 4px;
                    position: relative;
                }
                .retro-tv-icon::after {
                    content: '';
                    position: absolute;
                    bottom: -8px; left: 50%;
                    transform: translateX(-50%);
                    width: 10px; height: 3px;
                    background: #06b6d4;
                }
                .retro-badge {
                    background: #06b6d4;
                    color: #000;
                    font-family: 'Press Start 2P', monospace;
                    font-size: 8px;
                    padding: 4px 6px;
                    box-shadow: 2px 2px 0 #005555;
                }
                .retro-tv-text {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 14px;
                    color: #06b6d4;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .retro-tv-banner:hover .retro-tv-text {
                    color: #fff;
                    text-shadow: 0 0 8px #06b6d4;
                }
                .retro-btn {
                    font-family: 'Press Start 2P', monospace;
                    font-size: 10px;
                    background: #000;
                    color: #06b6d4;
                    border: 3px solid #06b6d4;
                    padding: 14px 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: inset 0 0 10px rgba(6,182,212,0.3);
                    transition: all 0.2s;
                }
                .retro-tv-banner:hover .retro-btn {
                    background: #06b6d4;
                    color: #000;
                    box-shadow: 0 0 15px #06b6d4;
                }
                .retro-btn-icon {
                    width: 0; height: 0;
                    border-top: 6px solid transparent;
                    border-left: 10px solid #06b6d4;
                    border-bottom: 6px solid transparent;
                }
                .retro-tv-banner:hover .retro-btn-icon {
                    border-left-color: #000;
                }

                .arcade-header {
                    font-family: 'Press Start 2P', monospace;
                    font-size: 15px;
                    color: #fff;
                    text-shadow: 3px 3px 0 #005555;
                }

                .retro-game-card {
                    background: #111;
                    border: 4px solid #222;
                    box-shadow: 0 10px 0 #000, inset 0 0 10px rgba(0,0,0,0.8);
                    transition: transform 0.1s, box-shadow 0.1s, border-color 0.1s;
                    border-radius: 12px;
                }

                .retro-game-card:hover {
                    transform: translateY(4px);
                    box-shadow: 0 6px 0 #000, 0 15px 30px rgba(0,255,255,0.2), inset 0 0 15px rgba(0,255,255,0.1);
                    border-color: #00ffff;
                }
                
                .retro-game-card:active {
                    transform: translateY(10px);
                    box-shadow: 0 0 0 #000;
                }
                
                .retro-game-card:hover .hover-play-overlay {
                    opacity: 1;
                }
                
                .retro-game-card:hover img {
                    transform: scale(1.1);
                }
                
                .retro-game-title {
                    font-family: 'Press Start 2P', monospace;
                    font-size: 9px;
                    color: #aaa;
                    text-align: center;
                    margin-top: 14px;
                    text-transform: uppercase;
                    line-height: 1.4;
                }

                .retro-game-card:hover .retro-game-title {
                    color: #00ffff;
                    text-shadow: 0 0 5px #00ffff;
                }
                
                .retro-game-img-wrapper {
                    border-bottom: 4px solid #222;
                    position: relative;
                }
                
                .retro-game-card:hover .retro-game-img-wrapper {
                    border-bottom-color: #00ffff;
                }
                
                .retro-game-img-wrapper::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,255,255,0.03) 2px, rgba(0,0,0,0.15) 4px);
                    pointer-events: none;
                }

                .arcade-cursor-global, .arcade-cursor-global * {
                    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%2300ffff' d='M11 0h2v11h11v2H13v11h-2V13H0v-2h11V0z'/%3E%3C/svg%3E") 12 12, crosshair !important;
                }

                @keyframes feed-scroll {
                    0% { transform: translateY(200px); }
                    100% { transform: translateY(-300px); }
                }
            `}</style>
        </div>
    );
}
