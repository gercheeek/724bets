import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { ShieldCheck, Target, Sparkles } from 'lucide-react';

const GRID_SIZE = 40;

// Simplified payout tables based on how many numbers picked (1-10)
const PAYOUTS: Record<number, number[]> = {
    1: [0, 3.8], // hits: 0, 1
    2: [0, 0, 15], 
    3: [0, 0, 2.5, 40],
    4: [0, 0, 1.5, 10, 80],
    5: [0, 0, 0, 2, 20, 200],
    6: [0, 0, 0, 1.5, 5, 50, 500],
    7: [0, 0, 0, 0.5, 2, 10, 100, 1000],
    8: [0, 0, 0, 0, 1.5, 5, 20, 250, 2500],
    9: [0, 0, 0, 0, 1, 3, 10, 50, 500, 5000],
    10: [0, 0, 0, 0, 0, 2, 5, 25, 100, 1000, 10000]
};

export default function KenoView({ siteUser, setSiteUser, onAuthRequired }: any) {
    const [betAmount, setBetAmount] = useState<number>(0);
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [winAmount, setWinAmount] = useState<number | null>(null);

    const hits = drawnNumbers.filter(n => selectedNumbers.includes(n)).length;

    const handleNumberClick = (num: number) => {
        if (isPlaying) return;
        if (selectedNumbers.includes(num)) {
            setSelectedNumbers(prev => prev.filter(n => n !== num));
        } else {
            if (selectedNumbers.length < 10) {
                setSelectedNumbers(prev => [...prev, num]);
            }
        }
    };

    const handleAutoPick = () => {
        if (isPlaying) return;
        const available = Array.from({ length: 40 }, (_, i) => i + 1);
        const picked: number[] = [];
        for (let i = 0; i < 10; i++) {
            const r = Math.floor(Math.random() * available.length);
            picked.push(available[r]);
            available.splice(r, 1);
        }
        setSelectedNumbers(picked);
    };

    const handlePlay = () => {
        if (!siteUser) return onAuthRequired();
        if (selectedNumbers.length === 0) {
            alert("Lütfen en az 1 numara seçin.");
            return;
        }
        if (siteUser.balance < betAmount) {
            alert('Yetersiz Bakiye');
            return;
        }

        const newBalance = siteUser.balance - betAmount;
        setSiteUser({ ...siteUser, balance: newBalance });
        supabase.from('site_users').update({ balance: newBalance }).eq('id', siteUser.id).then();

        setIsPlaying(true);
        setDrawnNumbers([]);
        setWinAmount(null);

        // Draw 10 numbers with a slight delay for animation
        const available = Array.from({ length: 40 }, (_, i) => i + 1);
        const drawn: number[] = [];
        for (let i = 0; i < 10; i++) {
            const r = Math.floor(Math.random() * available.length);
            drawn.push(available[r]);
            available.splice(r, 1);
        }

        let currentDrawIndex = 0;
        const drawInterval = setInterval(() => {
            if (currentDrawIndex < 10) {
                setDrawnNumbers(prev => [...prev, drawn[currentDrawIndex]]);
                currentDrawIndex++;
            } else {
                clearInterval(drawInterval);
                finishGame(drawn);
            }
        }, 150); // 150ms per number reveal
    };

    const finishGame = (finalDrawn: number[]) => {
        const finalHits = finalDrawn.filter(n => selectedNumbers.includes(n)).length;
        const payoutMult = PAYOUTS[selectedNumbers.length][finalHits] || 0;
        const payout = betAmount * payoutMult;
        
        setWinAmount(payout);
        if (payout > 0 && siteUser) {
            const updatedBalance = siteUser.balance - betAmount + payout;
            setSiteUser({ ...siteUser, balance: updatedBalance });
            supabase.from('site_users').update({ balance: updatedBalance }).eq('id', siteUser.id).then();
        }
        
        setTimeout(() => setIsPlaying(false), 500); // Small pause before unlocking
    };

    const activePayouts = selectedNumbers.length > 0 ? PAYOUTS[selectedNumbers.length] : [];

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

                {/* Number Selection Actions */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                     <button 
                         onClick={() => setSelectedNumbers([])}
                         disabled={isPlaying}
                         className="py-2 rounded-md bg-[#151D24] text-gray-400 font-bold text-xs uppercase hover:bg-white/5 transition-colors border border-[#2A3744]"
                     >
                         Temizle
                     </button>
                     <button 
                         onClick={handleAutoPick}
                         disabled={isPlaying}
                         className="py-2 rounded-md bg-[#151D24] text-gray-400 font-bold text-xs uppercase hover:bg-white/5 transition-colors border border-[#2A3744]"
                     >
                         Rastgele
                     </button>
                </div>

                {/* Payout Table */}
                {selectedNumbers.length > 0 && (
                    <div className="mb-6 bg-[#151D24] p-3 rounded-md border border-[#2A3744]">
                        <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">Çarpan Tablosu ({selectedNumbers.length} Sayı)</span>
                        <div className="grid grid-cols-2 gap-y-1">
                            {activePayouts.map((mult, i) => (
                                <div key={i} className={`flex justify-between items-center px-2 py-1 rounded ${
                                    drawnNumbers.length === 10 && hits === i ? 'bg-[#3D82F6] text-white' : 'text-gray-400'
                                }`}>
                                    <span className="text-xs font-bold">{i} İsabet</span>
                                    <span className={`text-xs font-bold ${drawnNumbers.length === 10 && hits === i ? 'text-white' : 'text-emerald-400'}`}>{mult.toFixed(2)}x</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                    <button 
                        onClick={handlePlay}
                        disabled={isPlaying || selectedNumbers.length === 0}
                        className={`w-full font-bold py-3.5 rounded-md transition-colors shadow-lg ${
                            isPlaying || selectedNumbers.length === 0 ? 'bg-[#324555] text-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                    >
                        {isPlaying ? 'Çekiliyor...' : 'Bahis'}
                    </button>
                </div>

                {/* Profit */}
                {winAmount !== null && (
                    <div className={`mt-4 bg-[#151D24] rounded-md border px-3 py-3 flex items-center justify-between transition-colors ${winAmount > 0 ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-[#2A3744]'}`}>
                        <span className="text-gray-400 text-xs font-bold uppercase">{winAmount > 0 ? 'Kazanç' : 'Kayıp'}</span>
                        <span className={`font-mono text-sm font-bold ${winAmount > 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
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
                        <Target className="w-5 h-5 text-gray-500" />
                        <span className="text-white font-bold tracking-widest text-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            Keno
                        </span>
                    </div>
                    
                    <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#1A1D29] px-3 py-1.5 rounded-full border border-white/5 z-20">
                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 font-semibold text-xs">Adil Oyun</span>
                    </div>

                    {/* Background Logo */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] z-0">
                        <h1 className="text-[120px] md:text-[180px] font-black italic tracking-tighter select-none">KENO</h1>
                    </div>

                    {/* Keno Grid */}
                    <div className="grid grid-cols-8 gap-2 md:gap-3 p-4 md:p-8 bg-[#1A242D] rounded-2xl border-4 border-[#212E3B] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
                        {Array.from({ length: GRID_SIZE }, (_, i) => i + 1).map(num => {
                            const isSelected = selectedNumbers.includes(num);
                            const isDrawn = drawnNumbers.includes(num);
                            const isHit = isSelected && isDrawn;
                            
                            return (
                                <div 
                                    key={num}
                                    onClick={() => handleNumberClick(num)}
                                    className={`w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center font-black text-lg transition-all duration-300 transform ${
                                        isHit ? 'bg-emerald-500 text-white border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.8)] scale-110 z-20 animate-pop-in' :
                                        isDrawn ? 'bg-white text-black border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.6)] scale-105 animate-pop-in' :
                                        isSelected ? 'bg-orange-500 text-white border-b-4 border-orange-700 hover:-translate-y-1' :
                                        'bg-[#2B3A4A] text-gray-400 hover:bg-[#3D5266] border-b-4 border-[#1E2933] hover:-translate-y-1 hover:text-white cursor-pointer'
                                    }`}
                                >
                                    {isHit && <Sparkles className="absolute inset-0 m-auto w-full h-full text-white/30 animate-ping pointer-events-none" />}
                                    <span className="relative z-10">{num}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Result Banner */}
                    {winAmount !== null && winAmount > 0 && (
                        <div className="absolute bottom-10 z-50 animate-fade-in-up">
                            <div className="bg-emerald-500/20 px-8 py-3 rounded-full border border-emerald-500/50 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-4">
                                <span className="text-white font-bold">{hits} İsabet!</span>
                                <span className="text-emerald-400 font-black text-2xl font-mono">+₺{winAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
