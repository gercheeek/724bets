import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';

// Simple Rocket SVG
const RocketSVG = ({ isPlaying, crashed }: { isPlaying: boolean; crashed: boolean }) => (
    <svg viewBox="0 0 24 24" className={`w-24 h-24 transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] ${
        isPlaying && !crashed ? 'animate-bounce text-white' : crashed ? 'text-red-500 scale-150 rotate-[135deg] grayscale' : 'text-gray-400'
    }`} fill="currentColor">
        <path d="M12 2.5a.75.75 0 01.75.75v1.5a1 1 0 001 1h.5a3 3 0 013 3v4.5a5 5 0 001.35 3.42l.53.53a.75.75 0 01-.53 1.28H5.4a.75.75 0 01-.53-1.28l.53-.53A5 5 0 006.75 13.2V8.75a3 3 0 013-3h.5a1 1 0 001-1V3.25A.75.75 0 0112 2.5zm1.5 16.5h-3a1.5 1.5 0 003 0z" />
        {isPlaying && !crashed && (
            <path d="M10 20.5a.75.75 0 011.5 0v2a.75.75 0 01-1.5 0v-2zM7.5 19.5a.75.75 0 011.5 0v1a.75.75 0 01-1.5 0v-1zM13.5 19.5a.75.75 0 011.5 0v1a.75.75 0 01-1.5 0v-1z" className="text-orange-500 animate-pulse" />
        )}
    </svg>
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
        } else {
            // Lose
            setWinAmount(0);
        }
    };

    const handlePlay = async () => {
        if (!siteUser) return onAuthRequired();

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
        <div className="flex flex-col md:flex-row w-full h-full bg-[#10171E] text-white font-sans overflow-y-auto md:overflow-hidden">
            
            {/* ── LEFT SIDEBAR (Controls) ── */}
            <div className="w-full md:w-[320px] bg-[#222E3A] border-r border-[#151D24] p-4 flex flex-col shrink-0 z-20 shadow-2xl order-2 md:order-1 h-auto md:h-full overflow-y-auto">
                
                {/* Tabs */}
                <div className="flex bg-[#151D24] rounded-full p-1 mb-6">
                    <button className="flex-1 bg-[#324555] text-white text-sm font-semibold rounded-full py-2 shadow-sm">Manuel</button>
                    <button className="flex-1 text-gray-400 hover:text-white text-sm font-semibold rounded-full py-2 transition-colors">Oto</button>
                </div>

                {/* Bet Amount */}
                <div className="mb-4 relative">
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs text-gray-400 font-semibold">Bahis Tutarı</label>
                        <span className="text-xs text-gray-300 font-mono">₺{siteUser ? siteUser.balance.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex bg-[#151D24] rounded-md border border-[#2A3744] overflow-hidden focus-within:border-[#3D82F6] transition-colors">
                        <div className="px-3 flex items-center justify-center text-gray-400">₺</div>
                        <input 
                            type="number" 
                            value={betAmount || ''}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            disabled={isPlaying}
                            placeholder="0.00"
                            className="flex-1 bg-transparent text-white font-mono text-sm py-3 outline-none"
                        />
                        <div className="flex">
                            <button className="px-3 text-xs font-bold text-gray-300 hover:bg-[#2A3744] border-l border-[#2A3744] transition-colors" onClick={() => setBetAmount(betAmount / 2)}>½</button>
                            <button className="px-3 text-xs font-bold text-gray-300 hover:bg-[#2A3744] border-l border-[#2A3744] transition-colors" onClick={() => setBetAmount(betAmount * 2)}>2x</button>
                        </div>
                    </div>
                </div>

                {/* Target Multiplier */}
                <div className="mb-6 relative">
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs text-gray-400 font-semibold">Hedef Çarpan</label>
                    </div>
                    <div className="flex bg-[#151D24] rounded-md border border-[#2A3744] overflow-hidden focus-within:border-[#3D82F6] transition-colors">
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
                            isPlaying ? 'bg-[#324555] text-gray-400 cursor-not-allowed' : 'bg-[#3D82F6] hover:bg-[#2B6CE0] text-white'
                        }`}
                    >
                        {isPlaying ? 'Uçuyor...' : 'Bahis'}
                    </button>
                </div>

                {/* Total Profit */}
                <div className="mt-4 pt-4 border-t border-[#151D24]">
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs text-gray-400 font-semibold">Kazanılacak Tutar</label>
                    </div>
                    <div className={`bg-[#151D24] rounded-md border px-3 py-3 flex items-center transition-colors ${isWinner ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-[#2A3744]'}`}>
                        <span className="text-gray-400 mr-2">₺</span>
                        <span className={`font-mono text-sm ${isWinner ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                            {winAmount !== null ? winAmount.toFixed(2) : (betAmount * targetMultiplier).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── RIGHT MAIN AREA (Centered Game Frame) ── */}
            <div className="flex-1 bg-[#10171E] relative overflow-hidden flex flex-col items-center justify-center p-2 md:p-8 lg:p-12">
                
                {/* History Ticker */}
                <div className="absolute top-4 right-4 flex gap-2 z-30">
                    {history.map((mult, idx) => (
                        <div key={idx} className={`px-3 py-1 rounded-full text-xs font-mono font-bold shadow-md ${
                            mult >= 2.0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                            {mult.toFixed(2)}x
                        </div>
                    ))}
                </div>

                {/* ── CENTERED GAME CONTAINER ── */}
                <div className="w-full max-w-5xl min-h-[250px] md:min-h-[400px] h-full max-h-[700px] bg-[#151C23] relative rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center border-[6px] border-[#1C252D]">
                    
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-10"
                         style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                    </div>

                    {/* Central Glow */}
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-30 transition-colors duration-500 ${
                        isWinner ? 'bg-emerald-500' : crashed ? 'bg-red-500' : isPlaying ? 'bg-[#10b981]' : 'bg-[#3D82F6]'
                    }`} />

                    {/* Massive Multiplier Display */}
                    <div className="relative z-20 flex flex-col items-center">
                        <div className={`font-mono font-black text-5xl md:text-8xl lg:text-9xl tracking-tighter transition-colors duration-200 ${
                            isWinner ? 'text-emerald-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]' : 
                            crashed ? 'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]' : 
                            'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]'
                        }`}>
                            {currentMultiplier.toFixed(2)}<span className="text-2xl md:text-5xl lg:text-6xl text-gray-400 ml-1 md:ml-2">x</span>
                        </div>
                        <div className="text-gray-400 mt-2 text-sm font-semibold tracking-widest uppercase">
                            Hedef: {targetMultiplier.toFixed(2)}x
                        </div>
                    </div>

                    {/* Rocket / Explosion */}
                    <div className="absolute bottom-20 z-20 flex items-center justify-center">
                        <RocketSVG isPlaying={isPlaying} crashed={crashed} />
                    </div>
                </div>
            </div>
        </div>
    );
}
