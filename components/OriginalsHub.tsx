import React, { useState, useEffect } from 'react';
import { Play, Sparkles, ShieldCheck, MonitorPlay, Gift, Flame, Trophy, Users, ChevronRight } from 'lucide-react';
import LiveBetsTable from './LiveBetsTable';
import { GamificationPanel } from './GamificationPanel';
import { GameDetailModal, GameData } from './GameDetailModal';

import { useLanguage } from '../contexts/LanguageContext';
import { getOriginalsData } from './OriginalsSlider';

export default function OriginalsHub({ onNavigate, isLoggedIn }: { onNavigate: (v: string) => void, isLoggedIn?: boolean }) {
    const { t } = useLanguage();
    const ORIGINALS = getOriginalsData(t);
    const [mounted, setMounted] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GameData | null>(null);

    useEffect(() => setMounted(true), []);

    return (
        <div className="w-full min-h-[calc(100vh-60px)] bg-[#050505] p-4 md:p-8 relative overflow-hidden font-sans flex flex-col items-center selection:bg-fuchsia-500/30">
            
            {/* Extremely dark ambient neon backgrounds */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020202]">
                 {/* Subtle magenta glow top right */}
                 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d946ef]/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
                 <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="w-full max-w-6xl relative z-10 flex flex-col gap-6">
                
                {/* 1. HERO CAROUSEL: Slot Oyna & Kazan */}
                <div className="w-full rounded-[24px] border border-[#d946ef]/40 bg-[#050505] overflow-hidden relative group flex flex-col md:flex-row h-auto md:h-[280px] shadow-[0_0_30px_rgba(217,70,239,0.05)]">
                    {/* Deep magenta gradient on the right side */}
                    <div className="absolute top-0 right-0 bottom-0 w-full md:w-2/3 bg-gradient-to-l from-[#d946ef]/30 via-[#d946ef]/5 to-transparent mix-blend-screen pointer-events-none"></div>
                    
                    {/* Abstract slot machine / neon art placeholder for the right side */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block opacity-60 mix-blend-screen"
                         style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', backgroundSize: '60px' }}>
                         <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-64 border-2 border-[#d946ef]/30 rounded-2xl bg-black/50 shadow-[0_0_40px_rgba(217,70,239,0.3)] flex flex-col items-center justify-center gap-4 rotate-12 group-hover:rotate-6 transition-transform duration-700">
                            <div className="text-[#d946ef] font-black text-2xl tracking-widest drop-shadow-[0_0_10px_rgba(217,70,239,0.8)] border-b-2 border-dashed border-[#d946ef]/50 pb-2">MEGA WIN</div>
                            <div className="flex gap-2">
                                <div className="w-10 h-10 border border-[#d946ef] rounded flex items-center justify-center text-white font-bold">7</div>
                                <div className="w-10 h-10 border border-[#d946ef] rounded flex items-center justify-center text-white font-bold">7</div>
                                <div className="w-10 h-10 border border-[#d946ef] rounded flex items-center justify-center text-white font-bold">7</div>
                            </div>
                         </div>
                    </div>

                    <div className="relative z-10 flex flex-col items-start justify-center p-8 md:p-12 w-full md:w-3/5">
                        <h1 className="text-4xl md:text-[54px] leading-none font-black text-white mb-4 tracking-tighter drop-shadow-md">
                            <span className="text-[#d946ef] drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">Slot Oyna</span> <span className="opacity-90">& Kazan</span>
                        </h1>
                        <p className="text-zinc-300 text-sm md:text-base mb-8 font-medium">Tüm yatırım yöntemleri geçerli. Hemen Al!</p>
                        
                        <button 
                          onClick={() => !isLoggedIn && onNavigate('login')}
                          className="px-8 py-3.5 rounded-xl border border-[#d946ef] bg-[#000000] text-white font-black tracking-[0.2em] text-xs hover:bg-[#d946ef]/15 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all duration-300"
                        >
                            KAYIT OL
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            <div className="w-6 h-1.5 rounded-full bg-white"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                        </div>
                    </div>
                </div>

                {/* 2. THREE CARDS GRID */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                    
                    {/* Orijinal Card (Full Width Span) */}
                    <div onClick={() => {}} className="md:col-span-2 rounded-[20px] border border-white/5 bg-[#0a0a0a] overflow-hidden relative group cursor-pointer h-40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
                        
                        {/* Sci-fi abstract background */}
                        <div className="absolute right-0 top-0 bottom-0 w-2/3 opacity-40 group-hover:opacity-70 transition-opacity duration-700 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTEwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBzdHJva2U9InJnYmEoNiwgMTgyLCAyMTIsIDAuMikiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] bg-repeat z-0">
                            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-32 h-32 bg-[#06b6d4]/10 blur-[40px] rounded-full"></div>
                            <div className="absolute right-32 top-1/2 -translate-y-1/2 w-24 h-24 bg-[#d946ef]/10 blur-[40px] rounded-full"></div>
                        </div>

                        <div className="relative z-20 p-8 flex flex-col justify-center h-full">
                            <div className="flex items-center gap-4 mb-3 flex-wrap">
                                <h2 className="text-[32px] md:text-[40px] font-black text-white tracking-tighter drop-shadow-lg leading-none">
                                   <span className="text-[#06b6d4] drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">724games</span> <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Orijinal</span>
                                </h2>
                                <span className="bg-[#00b372] text-[#050505] text-[11px] font-black px-3 py-1 rounded-full tracking-wider shadow-[0_0_10px_rgba(0,179,114,0.4)]">%99.2 RTP</span>
                                
                                {/* Seka Çark Button */}
                                <button
                                  onClick={(e) => { e.stopPropagation(); onNavigate('luckywheel'); }}
                                  className="relative group flex items-center justify-center px-4 py-2 ml-auto rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-[#0ea5e9]/50 hover:border-[#38bdf8] shadow-[0_0_15px_rgba(14,165,233,0.35)] hover:shadow-[0_0_25px_rgba(14,165,233,0.7)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer z-50"
                                  title="Çarkıfelek Oyunu"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="relative w-6 h-6 flex items-center justify-center">
                                      <div className="absolute inset-0 bg-[#0ea5e9] blur-sm rounded-full animate-pulse opacity-80"></div>
                                      <svg className="w-5 h-5 text-white animate-[spin_8s_linear_infinite] relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="9" stroke="#38bdf8" strokeWidth="2" fill="none" />
                                        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" stroke="#0ea5e9" strokeWidth="1.5" />
                                        <circle cx="12" cy="12" r="2.5" fill="#38bdf8" />
                                      </svg>
                                    </div>
                                    <span className="font-black text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[#7dd3fc] to-[#0ea5e9] drop-shadow-[0_0_8px_rgba(14,165,233,0.6)] uppercase">
                                      Seka Çark
                                    </span>
                                  </div>
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm mt-1">
                                <div className="w-2.5 h-2.5 bg-[#4ade80] rounded-full shadow-[0_0_8px_#4ade80] animate-pulse"></div>
                                <span className="opacity-90">8.149 playing</span>
                            </div>
                        </div>
                    </div>

                    {/* Casino Card */}
                    <div onClick={() => onNavigate('casino')} className="rounded-[20px] border border-white/5 bg-[#0a0a0a] overflow-hidden relative group cursor-pointer h-36 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-full opacity-30 group-hover:opacity-50 transition-opacity duration-700 bg-[radial-gradient(circle_at_right,_rgba(217,70,239,0.2),_transparent_60%)] z-0"></div>
                        <div className="relative z-20 p-8 flex flex-col justify-center h-full">
                            <h2 className="text-3xl md:text-[34px] font-black text-white tracking-tighter mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                Casino
                            </h2>
                            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
                                <div className="w-2.5 h-2.5 bg-[#4ade80] rounded-full shadow-[0_0_8px_#4ade80] animate-pulse"></div>
                                <span className="opacity-90">8.123 playing</span>
                            </div>
                        </div>
                    </div>

                    {/* Spor Card */}
                    <div onClick={() => onNavigate('sports')} className="rounded-[20px] border border-white/5 bg-[#0a0a0a] overflow-hidden relative group cursor-pointer h-36 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-full opacity-30 group-hover:opacity-50 transition-opacity duration-700 bg-[radial-gradient(circle_at_right,_rgba(6,182,212,0.2),_transparent_60%)] z-0"></div>
                        <div className="relative z-20 p-8 flex flex-col justify-center h-full">
                            <h2 className="text-3xl md:text-[34px] font-black text-white tracking-tighter mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                Spor
                            </h2>
                            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
                                <div className="w-2.5 h-2.5 bg-[#4ade80] rounded-full shadow-[0_0_8px_#4ade80] animate-pulse"></div>
                                <span className="opacity-90">7.802 playing</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Gamification Panel Section */}
                <div className="w-full mt-4">
                    <GamificationPanel 
                      className="w-full bg-[#0a0a0a] border border-white/5" 
                      isLoggedIn={isLoggedIn} 
                      onLoginClick={() => onNavigate('login')} 
                      onAdventureClick={() => onNavigate('adventure')}
                    />
                </div>

                {/* Slider Header */}
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-black text-white tracking-tight uppercase">Premium Oyunlar</h2>
                        <div className="hidden sm:block h-px w-24 bg-gradient-to-r from-[#d946ef]/50 to-transparent"></div>
                    </div>
                </div>

                {/* Horizontal Games Slider */}
                <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {ORIGINALS.map((game, i) => (
                        <div key={game.id} className="shrink-0 snap-start flex flex-col items-center group">
                            <div 
                                onClick={() => onNavigate(game.path)}
                                className="w-[140px] h-[190px] md:w-[160px] md:h-[220px] relative rounded-[20px] overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(217,70,239,0.2)] transition-all duration-300 transform group-hover:-translate-y-2 border border-white/5 group-hover:border-[#d946ef]/40 bg-[#0a0a0a]"
                            >
                                <img src={game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 mix-blend-lighten" />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center border border-[#d946ef]/50 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                                        <Play className="w-5 h-5 text-[#d946ef] fill-current ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TV Banner - Neon Style */}
                <div 
                    onClick={() => onNavigate('724tv')}
                    className="w-full bg-[#050505] border border-[#06b6d4]/30 rounded-[20px] p-6 cursor-pointer group hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
                >
                    <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-[#06b6d4]/10 to-transparent pointer-events-none"></div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-14 h-14 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/40 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 relative shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            <MonitorPlay className="w-6 h-6 text-[#06b6d4]" />
                            <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_#ef4444]"></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-[#06b6d4] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-sm">CANLI</span>
                                <h3 className="text-xl font-black text-white tracking-tight"><span className="text-[#06b6d4]">724bets</span> TV</h3>
                            </div>
                            <p className="text-zinc-400 text-sm font-medium">Tüm maçları HD izle.</p>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-[#000000] border border-[#06b6d4] text-white hover:bg-[#06b6d4]/10 font-bold uppercase text-xs rounded-xl transition-colors flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center relative z-10 tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <Play className="w-4 h-4 fill-current text-[#06b6d4]" /> Hemen İzle
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
            `}</style>
        </div>
    );
}
