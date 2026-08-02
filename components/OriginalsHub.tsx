import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, ShieldCheck, MonitorPlay, Gift, Flame, Trophy, Users, ChevronRight } from 'lucide-react';
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
            className="w-full min-h-[calc(100vh-60px)] bg-[#050505] p-4 md:p-8 relative overflow-hidden font-sans flex flex-col items-center selection:bg-fuchsia-500/30 arcade-cursor-global"
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

                {/* Arcade Header */}
                <div className="flex items-center justify-between mt-4 mb-2 relative">
                    <div className="flex items-center gap-4">
                        <h2 className="arcade-header">PREMİUM OYUNLAR</h2>
                        <div className="hidden sm:block h-[4px] w-32 bg-[repeating-linear-gradient(90deg,#ff00ff_0,#ff00ff_10px,transparent_10px,transparent_20px)] opacity-50 shadow-[0_0_10px_#ff00ff]"></div>
                    </div>
                </div>

                {/* Retro Arcade Game Cards */}
                <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide w-full pt-2 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {ORIGINALS.map((game, i) => (
                        <div key={game.id} className="shrink-0 snap-start flex flex-col items-center">
                            <div 
                                onClick={() => handleInternalPlay(game.path)}
                                className="retro-game-card w-[150px] md:w-[170px] cursor-pointer flex flex-col overflow-hidden pb-4"
                            >
                                <div className="retro-game-img-wrapper h-[140px] md:h-[160px] w-full overflow-hidden bg-black flex items-center justify-center">
                                    <img src={game.image} alt={game.name} className="w-full h-full object-cover opacity-90 transition-transform duration-500" style={{ imageRendering: 'pixelated' }} />
                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-opacity hover-play-overlay">
                                       <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-[#00ffff] border-b-[12px] border-b-transparent drop-shadow-[0_0_10px_#00ffff] ml-2"></div>
                                    </div>
                                </div>
                                <h3 className="retro-game-title px-2 truncate w-full">{game.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2-Column Grid: Terminal and Quests */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-4">
                    {/* Live Feed Terminal */}
                    <div className="retro-terminal">
                        <div className="terminal-header">
                            <span>root@724bets:~/live_feed$ ./start_feed.sh</span>
                        </div>
                        <div className="terminal-body">
                            <div className="terminal-scroller">
                                <p><span className="text-[#00ffff]">[SİSTEM]</span> @Ahmet34 'Casino Noir' oyununda 12.500₺ KAZANDI!</p>
                                <p><span className="text-[#ff00ff] font-bold animate-pulse">[JACKPOT]</span> @Vip_Memo BÜYÜK KASA'YA ULAŞTI!</p>
                                <p><span className="text-[#00ffff]">[SİSTEM]</span> @Kral77 'Galactic Spin' ile 500x çarpan yakaladı.</p>
                                <p><span className="text-[#00ffff]">[SİSTEM]</span> @Mehmet_88 'Seka Çark' 1.000₺ KAZANDI!</p>
                                <p><span className="text-[#ff00ff] font-bold animate-pulse">[JACKPOT]</span> @Deli_Dolu VIP Club'a Katıldı!</p>
                            </div>
                        </div>
                    </div>

                    {/* Cyber Contracts (Daily Quests) */}
                    <div className="cyber-contracts">
                        <div className="contracts-header">SİBER KONTRATLAR</div>
                        
                        <div className="contract-card">
                            <div className="flex justify-between items-center mb-3">
                                <span className="contract-title">Görev: Galactic Spin</span>
                                <span className="contract-reward">+500₺</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: '60%' }}></div>
                            </div>
                            <div className="text-right text-[9px] mt-2 text-[#00ffff] font-mono">60/100 Döndürme</div>
                        </div>

                        <div className="contract-card mt-4">
                            <div className="flex justify-between items-center mb-3">
                                <span className="contract-title">Görev: Casino Noir</span>
                                <span className="contract-reward">+10 FreeSpin</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]" style={{ width: '30%' }}></div>
                            </div>
                            <div className="text-right text-[9px] mt-2 text-[#ff00ff] font-mono">3/10 Kazanç</div>
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
                                <h3 className="arcade-header text-[#06b6d4]" style={{ textShadow: '2px 2px 0 #005555', fontSize: '14px' }}>
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

                .retro-terminal {
                    background: #020205;
                    border: 4px solid #333;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 10px 0 #000, inset 0 0 20px rgba(0,255,255,0.05);
                }
                .terminal-header {
                    background: #222;
                    padding: 8px 12px;
                    font-family: monospace;
                    font-size: 12px;
                    color: #aaa;
                    border-bottom: 2px solid #444;
                }
                .terminal-body {
                    padding: 16px;
                    height: 200px;
                    overflow: hidden;
                    position: relative;
                }
                .terminal-body::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(to bottom, transparent 0px, rgba(0,255,255,0.02) 1px, transparent 2px);
                    pointer-events: none;
                }
                .terminal-scroller {
                    animation: terminal-scroll 15s linear infinite;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .terminal-scroller p {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 13px;
                    color: #88cc88;
                    margin: 0;
                    text-shadow: 0 0 3px rgba(136,204,136,0.5);
                }
                @keyframes terminal-scroll {
                    0% { transform: translateY(200px); }
                    100% { transform: translateY(-300px); }
                }

                .cyber-contracts {
                    background: #050510;
                    border: 4px solid #880088;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: inset 0 0 20px rgba(255,0,255,0.1), 0 10px 0 #000;
                }
                .contracts-header {
                    font-family: 'Press Start 2P', monospace;
                    font-size: 12px;
                    color: #ff00ff;
                    text-shadow: 2px 2px 0 #550055;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .contract-card {
                    background: rgba(255,0,255,0.05);
                    border: 2px solid #ff00ff;
                    padding: 12px;
                    border-radius: 6px;
                }
                .contract-title {
                    font-family: monospace;
                    font-size: 14px;
                    color: #fff;
                    font-weight: bold;
                }
                .contract-reward {
                    font-family: 'Press Start 2P', monospace;
                    font-size: 8px;
                    color: #00ffff;
                    background: rgba(0,255,255,0.1);
                    padding: 4px 6px;
                    border: 1px solid #00ffff;
                }
                .progress-bar-bg {
                    width: 100%;
                    height: 12px;
                    background: #111;
                    border: 2px solid #333;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: #00ffff;
                    box-shadow: 0 0 10px #00ffff;
                }
            `}</style>
        </div>
    );
}
