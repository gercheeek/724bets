import React, { useState } from 'react';
import { ShieldCheck, Dice5 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function DiceView({ siteUser, onAuthRequired }: any) {
    const { playInstantGame } = useUser();
    const [betAmount, setBetAmount] = useState<number>(0);
    const [target, setTarget] = useState<number>(50);
    const [condition, setCondition] = useState<'over' | 'under'>('over');
    const [isPlaying, setIsPlaying] = useState(false);
    const [rollResult, setRollResult] = useState<number>(50);
    const [winAmount, setWinAmount] = useState<number | null>(null);
    const [history, setHistory] = useState<{ roll: number; won: boolean }[]>([]);

    // Calculations (House edge ~ 1%)
    const winChance = condition === 'over' ? 100 - target : target;
    const multiplier = winChance > 0 ? (99 / winChance) : 0;

    const handlePlay = async () => {
        if (!siteUser) return onAuthRequired();
        
        setIsPlaying(true);
        setWinAmount(null);
        setIsRolling(true);
        
        try {
            const data = await playInstantGame(betAmount, 'Dice', target, condition);
            const serverRoll = data.roll;
            const payout = data.win_amount;
            
            // Wait for visual animation
            setTimeout(() => {
                setRollResult(serverRoll);
                setWinAmount(payout);
                const won = payout > 0;
                setHistory(prev => [{ roll: serverRoll, won }, ...prev].slice(0, 10));
                setIsRolling(false);
                setIsPlaying(false);
            }, 800);
            
        } catch (e: any) {
            alert(e.message || 'Bakiye yetersiz veya bir hata oluştu.');
            setIsRolling(false);
            setIsPlaying(false);
            return;
        }
    };

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
                        <span className="text-xs text-[#ffd700] font-mono font-bold">₺{siteUser ? siteUser.balance.toFixed(2) : '0.00'}</span>
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

                {/* Game Specific Controls */}
                <div className="mb-4 bg-[#151D24] p-3 rounded-md border border-[#2A3744]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Kazanma Şansı</span>
                        <span className="text-sm font-bold text-white">%{winChance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Çarpan</span>
                        <span className="text-sm font-bold text-emerald-400">{multiplier.toFixed(2)}x</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6">
                     <button 
                         onClick={() => setCondition('under')}
                         className={`py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${condition === 'under' ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-[#151D24] text-gray-400 border border-[#2A3744] hover:border-[#3D82F6]'}`}
                     >
                         Altında
                     </button>
                     <button 
                         onClick={() => setCondition('over')}
                         className={`py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${condition === 'over' ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-[#151D24] text-gray-400 border border-[#2A3744] hover:border-[#3D82F6]'}`}
                     >
                         Üstünde
                     </button>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                    <button 
                        onClick={handlePlay}
                        disabled={isPlaying}
                        className={`w-full font-bold py-3.5 rounded-md transition-colors shadow-lg ${
                            isPlaying ? 'bg-[#324555] text-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                    >
                        {isPlaying ? 'Zar Atılıyor...' : 'Bahis (Zar At)'}
                    </button>
                </div>

                {/* Profit */}
                {winAmount !== null && (
                    <div className={`mt-4 bg-[#151D24] rounded-md border px-3 py-3 flex items-center justify-between transition-colors ${winAmount > 0 ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}>
                        <span className="text-gray-400 text-xs font-bold uppercase">{winAmount > 0 ? 'Kazanç' : 'Kayıp'}</span>
                        <span className={`font-mono text-sm font-bold ${winAmount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {winAmount > 0 ? `+₺${winAmount.toFixed(2)}` : `-₺${betAmount.toFixed(2)}`}
                        </span>
                    </div>
                )}
            </div>

            {/* ── RIGHT MAIN AREA (Centered Game Frame) ── */}
            <div className="flex-1 bg-[#10171E] relative overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-12 order-1 md:order-2 min-h-[400px] md:min-h-0">
                
                {/* History Ticker */}
                <div className="absolute top-4 right-4 flex gap-2 z-30">
                    {history.map((h, idx) => (
                        <div key={idx} className={`px-3 py-1 rounded-full text-xs font-mono font-bold shadow-md ${
                            h.won ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                            {h.roll.toFixed(2)}
                        </div>
                    ))}
                </div>

                {/* ── CENTERED GAME CONTAINER ── */}
                <div className="w-full max-w-5xl h-full max-h-[700px] bg-[#151C23] relative rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-center border-[6px] border-[#1C252D]">
                    
                    {/* Top Info Badges */}
                    <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
                        <Dice5 className="w-5 h-5 text-gray-500" />
                        <span className="text-white font-bold tracking-widest text-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#3D82F6]"></div>
                            Dice
                        </span>
                    </div>
                    
                    <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#111111] px-3 py-1.5 rounded-full border border-white/5 z-20">
                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 font-semibold text-xs">Adil Oyun</span>
                    </div>

                    {/* Massive Result Text */}
                    <div className="flex flex-col items-center justify-center mb-16 relative z-10">
                         <div className={`text-[120px] md:text-[160px] font-black font-mono leading-none tracking-tighter transition-all duration-300 ${
                             isPlaying ? 'blur-sm text-white/50' : winAmount !== null ? (winAmount > 0 ? 'text-emerald-400 drop-shadow-[0_0_40px_rgba(52,211,153,0.6)]' : 'text-red-500 drop-shadow-[0_0_40px_rgba(239,68,68,0.6)]') : 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                         }`}>
                             {rollResult.toFixed(2)}
                         </div>
                         <div className="text-gray-500 font-bold uppercase tracking-[0.5em] mt-2">
                             Target: {condition === 'over' ? '>' : '<'} {target.toFixed(2)}
                         </div>
                    </div>

                    {/* The Interactive Slider */}
                    <div className="px-12 md:px-24 w-full relative z-10">
                        
                        {/* Custom Slider Track */}
                        <div className="relative h-6 bg-[#1A242D] rounded-full border border-[#2A3744] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer"
                             onClick={(e) => {
                                 if (isPlaying) return;
                                 const rect = e.currentTarget.getBoundingClientRect();
                                 const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                                 const newTarget = (x / rect.width) * 100;
                                 setTarget(Math.max(2, Math.min(newTarget, 98))); // Keep between 2 and 98
                             }}>
                             
                             {/* Fill Range */}
                             <div className={`absolute top-0 bottom-0 rounded-full transition-all duration-100 ${condition === 'over' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}
                                  style={{
                                      left: condition === 'over' ? `${target}%` : '0%',
                                      right: condition === 'over' ? '0%' : `${100 - target}%`
                                  }}>
                             </div>

                             {/* Target Handle */}
                             <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-12 bg-white rounded-md shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-[#151C23] flex items-center justify-center transition-all duration-100 pointer-events-none"
                                  style={{ left: `${target}%` }}>
                                  <div className="w-1 h-6 bg-[#151C23] rounded-full opacity-30"></div>
                             </div>

                             {/* Result Indicator (The Diamond) */}
                             {!isPlaying && (
                                 <div className={`absolute -top-10 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] transition-all duration-[600ms] cubic-bezier(0.4, 0, 0.2, 1) ${
                                     winAmount !== null && winAmount > 0 ? 'border-t-emerald-400 drop-shadow-[0_-5px_10px_rgba(52,211,153,0.8)]' : 
                                     winAmount !== null && winAmount === 0 ? 'border-t-red-500 drop-shadow-[0_-5px_10px_rgba(239,68,68,0.8)]' : 
                                     'border-t-white opacity-0'
                                 }`} style={{ left: `${rollResult}%` }}>
                                     <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 rounded border font-mono text-xs font-bold ${
                                         winAmount !== null && winAmount > 0 ? 'text-emerald-400 border-emerald-500/50' : 'text-red-500 border-red-500/50'
                                     }`}>
                                         {rollResult.toFixed(2)}
                                     </div>
                                 </div>
                             )}
                        </div>

                        {/* Slider Labels */}
                        <div className="flex justify-between mt-4 text-gray-500 font-mono text-sm font-bold">
                            <span>0</span>
                            <span>25</span>
                            <span>50</span>
                            <span>75</span>
                            <span>100</span>
                        </div>
                    </div>

                    {/* Logo Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] z-0">
                        <h1 className="text-[120px] md:text-[180px] font-black italic tracking-tighter select-none">DICE</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
