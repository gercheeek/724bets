import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { Rocket, Flame, Target } from 'lucide-react';
import { soundEngine } from '../utils/SoundEngine';

// Simple Rocket SVG
const RocketIcon = ({ isPlaying, crashed }: { isPlaying: boolean; crashed: boolean }) => (
    <div className="relative z-10 flex flex-col items-center justify-center">
        <div className={`relative transition-all duration-700 ${isPlaying && !crashed ? 'animate-[bounce_2s_infinite]' : ''}`}>
            <Rocket className={`w-16 h-16 md:w-20 md:h-20 transition-all duration-500 ${
                isPlaying && !crashed ? 'text-[#00E5FF] drop-shadow-[0_0_30px_rgba(0,229,255,1)] scale-110' : 
                crashed ? 'text-red-500 scale-125 rotate-180 drop-shadow-[0_0_30px_rgba(239,68,68,0.9)] grayscale-0' : 
                'text-[#00E5FF] opacity-30 drop-shadow-[0_0_10px_rgba(0,229,255,0.2)]'
            }`} />
            {isPlaying && !crashed && (
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <Flame className="w-10 h-10 text-orange-500 animate-pulse drop-shadow-[0_0_20px_rgba(249,115,22,1)]" />
                    <Flame className="w-6 h-6 text-yellow-300 animate-ping delay-75 -mt-6 drop-shadow-[0_0_15px_rgba(253,224,71,1)]" />
                </div>
            )}
        </div>
    </div>
);

export default function LimboView({ siteUser, onAuthRequired }: any) {
    const { playInstantGame } = useUser();
    const [betAmount, setBetAmount] = useState<number>(0);
    const [targetMultiplier, setTargetMultiplier] = useState<number>(2.00);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
    const [crashed, setCrashed] = useState(false);
    const [winAmount, setWinAmount] = useState<number | null>(null);
    const [history, setHistory] = useState<number[]>([]);
    const reqRef = useRef<number>();

    const startAnimation = (target: number) => {
        let start = Date.now();
        const duration = 2000 + (Math.random() * 2000); // 2-4 seconds

        const animate = () => {
            const now = Date.now();
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Exponential curve for multiplier
            const current = 1 + (target - 1) * Math.pow(progress, 3);
            setCurrentMultiplier(current);

            if (progress < 1) {
                reqRef.current = requestAnimationFrame(animate);
            } else {
                finishGame(target);
            }
        };
        reqRef.current = requestAnimationFrame(animate);
    };

    const finishGame = (crashPoint: number) => {
        setIsPlaying(false);
        setCrashed(true);
        setCurrentMultiplier(crashPoint);
        setHistory(prev => [crashPoint, ...prev].slice(0, 10));

        if (crashPoint >= targetMultiplier) {
            // Win
            const won = betAmount * targetMultiplier;
            setWinAmount(won);
            soundEngine.playSuccessSound();
        } else {
            // Lose
            setWinAmount(0);
            soundEngine.playCrashSound();
        }
    };

    const handlePlay = async () => {
        if (!siteUser) return onAuthRequired();

        soundEngine.init();
        soundEngine.playBetSound();
        setIsPlaying(true);
        setCrashed(false);
        setWinAmount(null);
        setCurrentMultiplier(1.00);

        try {
            const data = await playInstantGame(betAmount, 'Limbo', targetMultiplier);
            const crashPoint = data.result.crash;
            startAnimation(crashPoint);
        } catch (e: any) {
            alert(e.message || 'Hata oluştu');
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        return () => {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
        };
    }, []);

    const isWinner = crashed && currentMultiplier >= targetMultiplier;

    return (
        <div className="flex flex-col md:flex-row w-full h-full bg-[#0B0E14] text-white font-sans overflow-y-auto md:overflow-hidden">
            
            {/* ── LEFT SIDEBAR (Controls) ── */}
            <div className="w-full md:w-[320px] bg-[#131620] border-r border-[#1E2336] p-4 flex flex-col shrink-0 z-20 shadow-2xl order-2 md:order-1 h-auto md:h-full overflow-y-auto">
                
                {/* Tabs */}
                <div className="flex bg-[#0B0E14] rounded-full p-1 mb-6">
                    <button className="flex-1 bg-[#1E2336] text-white text-sm font-semibold rounded-full py-2 shadow-sm">Manuel</button>
                    <button className="flex-1 text-gray-400 hover:text-white text-sm font-semibold rounded-full py-2 transition-colors">Oto</button>
                </div>

                {/* Bet Amount */}
                <div className="mb-4 relative">
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs text-gray-400 font-semibold">Bahis Tutarı</label>
                        <span className="text-xs text-gray-300 font-mono">${siteUser ? siteUser.balance.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex bg-[#0B0E14] rounded-md border border-[#1E2336] overflow-hidden focus-within:border-[#00E5FF] transition-colors">
                        <div className="px-3 flex items-center justify-center text-gray-400">$</div>
                        <input 
                            type="number" 
                            value={betAmount || ''}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            disabled={isPlaying}
                            placeholder="0.00"
                            className="flex-1 bg-transparent text-white font-mono text-sm py-3 outline-none"
                        />
                        <div className="flex">
                            <button className="px-3 text-xs font-bold text-gray-300 hover:bg-[#2A3744] border-l border-[#1E2336] transition-colors" onClick={() => setBetAmount(betAmount / 2)}>½</button>
                            <button className="px-3 text-xs font-bold text-gray-300 hover:bg-[#2A3744] border-l border-[#1E2336] transition-colors" onClick={() => setBetAmount(betAmount * 2)}>2x</button>
                        </div>
                    </div>
                </div>

                {/* Target Multiplier */}
                <div className="mb-6 relative">
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs text-gray-400 font-semibold">Hedef Çarpan</label>
                    </div>
                    <div className="flex bg-[#0B0E14] rounded-md border border-[#1E2336] overflow-hidden focus-within:border-[#00E5FF] transition-colors">
                        <input 
                            type="number" 
                            step="0.01"
                            min="1.01"
                            value={targetMultiplier || ''}
                            onChange={(e) => setTargetMultiplier(Number(e.target.value))}
                            disabled={isPlaying}
                            className="flex-1 bg-transparent text-white font-mono text-sm py-3 px-3 outline-none"
                        />
                        <div className="px-3 flex items-center justify-center text-gray-400 font-bold">x</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                    <button 
                        onClick={handlePlay}
                        disabled={isPlaying}
                        className={`w-full font-bold py-3.5 rounded-md transition-colors shadow-lg ${
                            isPlaying ? 'bg-[#1E2336] text-gray-400 cursor-not-allowed' : 'bg-[#c6ff00] hover:bg-[#a6d900] text-black shadow-[0_0_15px_rgba(198,255,0,0.3)]'
                        }`}
                    >
                        {isPlaying ? 'Uçuyor...' : 'Bahis'}
                    </button>
                </div>

                {/* Total Profit */}
                <div className="mt-4 pt-4 border-t border-[#1E2336]">
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs text-gray-400 font-semibold">Kazanılacak Tutar</label>
                    </div>
                    <div className={`bg-[#0B0E14] rounded-md border px-3 py-3 flex items-center transition-colors ${isWinner ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-[#1E2336]'}`}>
                        <span className="text-gray-400 mr-2">$</span>
                        <span className={`font-mono text-sm ${isWinner ? 'text-[#00E5FF] font-bold' : 'text-white'}`}>
                            {winAmount !== null ? winAmount.toFixed(2) : (betAmount * targetMultiplier).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── RIGHT MAIN AREA (Centered Game Frame) ── */}
            <div className="flex-1 bg-[#0B0E14] relative overflow-hidden flex flex-col items-center justify-center p-2 md:p-8 lg:p-12">
                
                {/* History Ticker */}
                <div className="absolute top-4 right-4 flex gap-2 z-30">
                    {history.map((mult, idx) => (
                        <div key={idx} className={`px-3 py-1 rounded-full text-xs font-mono font-bold shadow-md ${
                            mult >= 2.0 ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-emerald-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                            {mult.toFixed(2)}x
                        </div>
                    ))}
                </div>

                {/* ── CENTERED GAME CONTAINER ── */}
                <div className="w-full max-w-5xl min-h-[350px] md:min-h-[500px] h-full max-h-[800px] bg-gradient-to-b from-[#0A101D] via-[#06080A] to-[#040507] relative rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_0_100px_rgba(0,229,255,0.05)] overflow-hidden flex flex-col items-center justify-center border border-white/5 ring-4 ring-[#1E2336]/50">
                    
                    {/* Sci-Fi Corners */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#00E5FF]/30 rounded-tl-[40px]"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#00E5FF]/30 rounded-tr-[40px]"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#00E5FF]/30 rounded-bl-[40px]"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#00E5FF]/30 rounded-br-[40px]"></div>

                    
                    {/* Advanced Radar Background */}
                    <div className="absolute inset-0 opacity-[0.15]"
                         style={{ backgroundImage: 'radial-gradient(circle at center, #00E5FF 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                    </div>
                    {/* Radar Rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <div className="w-[300px] h-[300px] rounded-full border border-[#00E5FF] animate-[ping_3s_linear_infinite]"></div>
                        <div className="absolute w-[500px] h-[500px] rounded-full border border-[#00E5FF] animate-[ping_4s_linear_infinite] delay-1000"></div>
                    </div>

                    {/* Central Reactor Glow */}
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-[80px] transition-all duration-700 ${
                        isWinner ? 'bg-[#c6ff00] opacity-40 scale-110' : crashed ? 'bg-red-500 opacity-40 scale-125' : isPlaying ? 'bg-[#00E5FF] opacity-30 animate-pulse' : 'bg-[#00E5FF] opacity-10'
                    }`} />

                    {/* Central Content */}
                    <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
                        
                        {/* Huge Circular Progress Ring */}
                        <div className="relative flex items-center justify-center w-[280px] h-[280px] md:w-[450px] md:h-[450px]">
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Track */}
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                                {/* Progress Indicator */}
                                <circle 
                                    cx="50" cy="50" r="45" fill="none" 
                                    stroke={isWinner ? '#c6ff00' : crashed ? '#ef4444' : '#00E5FF'} 
                                    strokeWidth="3" 
                                    strokeLinecap="round"
                                    strokeDasharray="283" 
                                    strokeDashoffset={Math.max(0, 283 - (Math.min(currentMultiplier / targetMultiplier, 1) * 283))}
                                    className="transition-all duration-100 ease-out"
                                    style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
                                />
                            </svg>

                            {/* Inner Content inside Ring */}
                            <div className="flex flex-col items-center justify-center mt-4">
                                <RocketIcon isPlaying={isPlaying} crashed={crashed} />
                                
                                <div className={`font-mono font-black text-6xl md:text-[100px] lg:text-[130px] tracking-tighter transition-colors duration-200 leading-none mt-2 ${
                                    isWinner ? 'text-[#c6ff00] drop-shadow-[0_0_50px_rgba(198,255,0,0.8)]' : 
                                    crashed ? 'text-red-500 drop-shadow-[0_0_50px_rgba(239,68,68,0.8)]' : 
                                    'text-white drop-shadow-[0_0_30px_rgba(0,229,255,0.5)]'
                                }`}>
                                    {currentMultiplier.toFixed(2)}<span className={`text-3xl md:text-5xl lg:text-6xl ml-1 md:ml-2 ${crashed && !isWinner ? 'text-red-500/70' : 'text-white/50'}`}>x</span>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-4 md:mt-8 bg-black/50 px-5 py-2.5 rounded-full border border-[#00E5FF]/20 backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                                    <Target className={`w-4 h-4 ${isWinner ? 'text-[#c6ff00]' : crashed ? 'text-red-500' : 'text-[#00E5FF]'}`} />
                                    <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-white/70">
                                        Hedef: <span className="text-white ml-1">{targetMultiplier.toFixed(2)}x</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
