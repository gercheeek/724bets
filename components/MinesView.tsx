import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { ShieldCheck, Bomb, Diamond } from 'lucide-react';

const GRID_SIZE = 25;

// Mines Multiplier Math Helper
function calculateMultiplier(mines: number, hits: number): number {
    // Standard mines probability formula
    let multiplier = 1;
    for (let i = 0; i < hits; i++) {
        multiplier *= (25 - i) / (25 - mines - i);
    }
    // House edge ~ 1% applied
    return multiplier * 0.99;
}

export default function MinesView({ siteUser, setSiteUser, onAuthRequired }: any) {
    const [betAmount, setBetAmount] = useState<number>(0);
    const [minesCount, setMinesCount] = useState<number>(3);
    const [isPlaying, setIsPlaying] = useState(false);
    const [crashed, setCrashed] = useState(false);
    
    const [grid, setGrid] = useState<boolean[]>(Array(GRID_SIZE).fill(false)); // true if it has a mine
    const [revealed, setRevealed] = useState<boolean[]>(Array(GRID_SIZE).fill(false));
    
    const [hits, setHits] = useState(0);
    const [winAmount, setWinAmount] = useState<number | null>(null);

    const currentMultiplier = hits > 0 ? calculateMultiplier(minesCount, hits) : 1;
    const nextMultiplier = calculateMultiplier(minesCount, hits + 1);

    const handlePlay = () => {
        if (!siteUser) return onAuthRequired();
        if (siteUser.balance < betAmount) {
            alert('Yetersiz Bakiye');
            return;
        }

        const newBalance = siteUser.balance - betAmount;
        setSiteUser({ ...siteUser, balance: newBalance });
        supabase.from('site_users').update({ balance: newBalance }).eq('id', siteUser.id).then();

        // Generate mines
        const newGrid = Array(GRID_SIZE).fill(false);
        let placed = 0;
        while (placed < minesCount) {
            const r = Math.floor(Math.random() * GRID_SIZE);
            if (!newGrid[r]) {
                newGrid[r] = true;
                placed++;
            }
        }
        
        setGrid(newGrid);
        setRevealed(Array(GRID_SIZE).fill(false));
        setHits(0);
        setIsPlaying(true);
        setCrashed(false);
        setWinAmount(null);
    };

    const handleTileClick = (index: number) => {
        if (!isPlaying || crashed || revealed[index]) return;

        const newRevealed = [...revealed];
        newRevealed[index] = true;
        setRevealed(newRevealed);

        if (grid[index]) {
            // Hit a mine -> Bust
            setCrashed(true);
            setIsPlaying(false);
            setWinAmount(0);
            
            // Reveal all mines (others faded)
            setRevealed(Array(GRID_SIZE).fill(true));
        } else {
            // Safe -> Gem
            const newHits = hits + 1;
            setHits(newHits);

            // Auto cashout if all gems found
            if (newHits === 25 - minesCount) {
                const payout = betAmount * calculateMultiplier(minesCount, newHits);
                setWinAmount(payout);
                setIsPlaying(false);
                if (siteUser) {
                    const updatedBalance = siteUser.balance + payout;
                    setSiteUser({ ...siteUser, balance: updatedBalance });
                    supabase.from('site_users').update({ balance: updatedBalance }).eq('id', siteUser.id).then();
                }
                setRevealed(Array(GRID_SIZE).fill(true));
            }
        }
    };

    const handleCashOut = () => {
        if (!isPlaying || hits === 0) return;
        
        const payout = betAmount * currentMultiplier;
        setWinAmount(payout);
        setIsPlaying(false);
        
        if (siteUser) {
            const updatedBalance = siteUser.balance + payout;
            setSiteUser({ ...siteUser, balance: updatedBalance });
            supabase.from('site_users').update({ balance: updatedBalance }).eq('id', siteUser.id).then();
        }

        // Reveal the rest
        setRevealed(Array(GRID_SIZE).fill(true));
    };

    return (
        <div className="flex flex-col md:flex-row w-full h-full bg-[#10171E] text-white font-sans overflow-y-auto md:overflow-hidden" style={{ height: 'calc(100dvh - var(--header-height, 60px))' }}>
            
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

                {/* Mines Count */}
                <div className="mb-6">
                    <label className="block text-xs text-gray-400 font-semibold mb-2">Mayın Sayısı</label>
                    <div className="relative">
                        <select 
                            value={minesCount}
                            onChange={(e) => setMinesCount(Number(e.target.value))}
                            disabled={isPlaying}
                            className="w-full bg-[#151D24] text-white text-sm font-semibold py-3 px-4 rounded-md appearance-none border border-[#2A3744] outline-none focus:border-[#3D82F6]"
                        >
                            {[...Array(24)].map((_, i) => (
                                <option key={i+1} value={i+1}>{i+1}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <Bomb className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Live Stats */}
                {isPlaying && (
                    <div className="mb-4 bg-[#151D24] p-3 rounded-md border border-[#2A3744] flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase">Mevcut Çarpan</span>
                            <span className="text-sm font-bold text-emerald-400">{currentMultiplier.toFixed(2)}x</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase">Sonraki Çarpan</span>
                            <span className="text-sm font-bold text-white">{nextMultiplier.toFixed(2)}x</span>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                    {!isPlaying ? (
                        <button 
                            onClick={handlePlay}
                            className="w-full bg-[#3D82F6] hover:bg-[#2B6CE0] text-white font-bold py-3.5 rounded-md transition-colors shadow-lg"
                        >
                            Bahis
                        </button>
                    ) : (
                        <button 
                            onClick={handleCashOut}
                            disabled={hits === 0}
                            className={`w-full font-bold py-3.5 rounded-md transition-colors shadow-lg ${
                                hits > 0 ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-[#324555] text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Bozdur (₺{(betAmount * currentMultiplier).toFixed(2)})
                        </button>
                    )}
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
                
                {/* ── CENTERED GAME CONTAINER ── */}
                <div className="w-full max-w-5xl h-full max-h-[700px] bg-[#151C23] relative rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-center items-center border-[6px] border-[#1C252D]">
                    
                    {/* Top Info Badges */}
                    <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
                        <Bomb className="w-5 h-5 text-gray-500" />
                        <span className="text-white font-bold tracking-widest text-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            Mines
                        </span>
                    </div>
                    
                    <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#1A1D29] px-3 py-1.5 rounded-full border border-white/5 z-20">
                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 font-semibold text-xs">Adil Oyun</span>
                    </div>

                    {/* Background Logo */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] z-0">
                        <h1 className="text-[120px] md:text-[180px] font-black italic tracking-tighter select-none">MINES</h1>
                    </div>

                    {/* Mines Grid */}
                    <div className={`grid grid-cols-5 gap-2 md:gap-3 p-4 md:p-8 bg-[#1A242D] rounded-2xl border-4 border-[#212E3B] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 transition-all ${
                        crashed ? 'animate-shake' : ''
                    }`}>
                        {Array.from({ length: GRID_SIZE }).map((_, i) => (
                            <div 
                                key={i}
                                onClick={() => handleTileClick(i)}
                                className={`w-12 h-12 md:w-20 md:h-20 rounded-lg md:rounded-xl flex items-center justify-center relative cursor-pointer transition-all duration-300 transform ${
                                    !revealed[i] && isPlaying ? 'bg-[#2B3A4A] hover:bg-[#3D5266] hover:-translate-y-1 shadow-[0_6px_0_#151C23] hover:shadow-[0_8px_0_#151C23]' : 
                                    !revealed[i] && !isPlaying ? 'bg-[#2B3A4A]/50 shadow-[0_4px_0_#151C23]/50 pointer-events-none' :
                                    revealed[i] && grid[i] ? 'bg-red-500/20 border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-95' :
                                    revealed[i] && !grid[i] ? 'bg-[#1E2933] border-2 border-[#1E2933] scale-95' : 'bg-transparent'
                                }`}
                                style={{
                                    opacity: !isPlaying && revealed[i] && grid[i] && winAmount !== 0 ? 0.3 : 1 // Dim unselected bombs on cashout
                                }}
                            >
                                {/* Front Face details for unrevealed */}
                                {!revealed[i] && (
                                    <div className="absolute inset-1 rounded-md bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                )}

                                {/* Revealed Content */}
                                {revealed[i] && (
                                    <div className="absolute inset-0 flex items-center justify-center animate-pop-in">
                                        {grid[i] ? (
                                            <Bomb className={`w-6 h-6 md:w-10 md:h-10 ${winAmount === 0 ? 'text-red-500' : 'text-red-500/50'}`} />
                                        ) : (
                                            <Diamond className={`w-6 h-6 md:w-10 md:h-10 ${winAmount === 0 ? 'text-emerald-400/50' : 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]'}`} />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Result Overlay */}
                    {winAmount !== null && (
                         <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                             {winAmount > 0 ? (
                                 <div className="flex flex-col items-center bg-emerald-900/90 px-12 py-6 rounded-2xl border-2 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.5)] animate-fade-in-up">
                                     <span className="text-4xl font-black text-white mb-2">KAZANDIN!</span>
                                     <span className="text-emerald-400 text-5xl font-mono font-bold">+₺{winAmount.toFixed(2)}</span>
                                     <span className="text-emerald-300 text-sm font-bold mt-2 bg-emerald-800 px-3 py-1 rounded-full">{currentMultiplier.toFixed(2)}x Çarpan</span>
                                 </div>
                             ) : (
                                 <div className="flex flex-col items-center bg-red-900/90 px-12 py-6 rounded-2xl border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] animate-fade-in-up">
                                     <span className="text-4xl font-black text-white">MAYINA BASTIN</span>
                                 </div>
                             )}
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
}
