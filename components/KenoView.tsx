import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { ShieldCheck, Target, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/SoundEngine';

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

export default function KenoView({ siteUser, onAuthRequired }: any) {
    const { playInstantGame } = useUser();
    const [betAmount, setBetAmount] = useState<number>(0);
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [winAmount, setWinAmount] = useState<number | null>(null);

    const hits = drawnNumbers.filter(n => selectedNumbers.includes(n)).length;

    const handleNumberClick = (num: number) => {
        if (isPlaying) return;
        if (selectedNumbers.includes(num)) {
            soundEngine.init();
            soundEngine.playPopSound();
            setSelectedNumbers(prev => prev.filter(n => n !== num));
        } else {
            if (selectedNumbers.length < 10) {
                soundEngine.init();
                soundEngine.playPopSound();
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

    const handlePlay = async () => {
        if (!siteUser) return onAuthRequired();
        if (selectedNumbers.length === 0) {
            alert("Lütfen en az 1 numara seçin.");
            return;
        }

        soundEngine.init();
        soundEngine.playBetSound();
        setIsPlaying(true);
        setDrawnNumbers([]);
        setWinAmount(null);

        try {
            const data = await playInstantGame(betAmount, 'Keno', 0, 'none', { numbers: selectedNumbers });
            const serverDrawn = data.result.drawn;
            const payout = data.win_amount;

            let currentDrawIndex = 0;
            const drawInterval = setInterval(() => {
                if (currentDrawIndex < 10) {
                    const drawnNum = serverDrawn[currentDrawIndex];
                    setDrawnNumbers(prev => [...prev, drawnNum]);
                    if (selectedNumbers.includes(drawnNum)) {
                        soundEngine.playSuccessSound();
                    } else {
                        soundEngine.playPopSound();
                    }
                    currentDrawIndex++;
                } else {
                    clearInterval(drawInterval);
                    finishGame(payout);
                }
            }, 400); // Slower, more suspenseful

        } catch (e: any) {
            alert(e.message || 'Hata oluştu');
            setIsPlaying(false);
        }
    };

    const finishGame = (payout: number) => {
        setWinAmount(payout);
        setTimeout(() => setIsPlaying(false), 500);
    };

    const activePayouts = selectedNumbers.length > 0 ? PAYOUTS[selectedNumbers.length] : [];

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-72px)] lg:h-[calc(100vh-72px)] bg-[#0B0E14] text-white font-sans overflow-y-auto lg:overflow-hidden relative">
        
        {/* ── LEFT SIDEBAR (Controls) ── */}
        <div className="w-full lg:w-[320px] bg-[#131620] border-r border-[#1E2336] p-4 md:p-5 flex flex-col shrink-0 z-20 lg:h-full overflow-y-auto order-2 lg:order-1 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
            
            {/* Tabs */}
            <div className="flex bg-[#0B0E14] rounded-full p-1 mb-6 border border-[#1E2336]">
                <button className="flex-1 bg-[#1E2336] text-white rounded-full py-1.5 text-[13px] font-bold shadow-md">Manual</button>
                <button className="flex-1 text-zinc-500 rounded-full py-1.5 text-[13px] font-bold hover:text-white transition-colors">Auto</button>
            </div>

            <div className="px-1 flex flex-col gap-4 mb-4">
                {/* Bet Amount */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-[12px] text-zinc-400 font-bold block">Bet amount</label>
                    </div>
                    <div className="flex bg-[#0B0E14] border border-[#1E2336] rounded-md overflow-hidden h-11 focus-within:border-[#00E5FF]/50 focus-within:shadow-[0_0_10px_rgba(0,229,255,0.1)] transition-all">
                        <input 
                            type="number" 
                            value={betAmount || ''}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            disabled={isPlaying}
                            placeholder="0.00"
                            className="flex-1 bg-transparent px-3 text-sm text-white outline-none font-medium disabled:opacity-50"
                        />
                        <div className="flex items-center border-l border-[#1E2336]">
                            <span className="text-zinc-500 text-xs font-bold px-2">EUR</span>
                            <div className="flex h-full border-l border-[#1E2336]">
                                <button className="px-3 hover:bg-white/5 text-zinc-400 text-xs font-bold transition-colors" onClick={() => setBetAmount(betAmount / 2)}>½</button>
                                <div className="w-[1px] h-full bg-[#1E2336]"></div>
                                <button className="px-3 hover:bg-white/5 text-zinc-400 text-xs font-bold transition-colors" onClick={() => setBetAmount(betAmount * 2)}>2x</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Number Selection Actions */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                     <button 
                         onClick={() => setSelectedNumbers([])}
                         disabled={isPlaying}
                         className="py-3 rounded-md bg-[#0B0E14] text-zinc-300 font-bold text-[12px] uppercase hover:bg-white/5 transition-colors border border-[#1E2336]"
                     >
                         Clear
                     </button>
                     <button 
                         onClick={handleAutoPick}
                         disabled={isPlaying}
                         className="py-3 rounded-md bg-[#0B0E14] text-zinc-300 font-bold text-[12px] uppercase hover:bg-white/5 transition-colors border border-[#1E2336]"
                     >
                         Random
                     </button>
                </div>

                {/* Payout Table */}
                {selectedNumbers.length > 0 && (
                    <div className="mb-2 bg-[#0B0E14] p-3 rounded-md border border-[#1E2336]">
                        <span className="text-[12px] font-bold text-zinc-400 mb-2 block">Payout Table ({selectedNumbers.length} Picks)</span>
                        <div className="grid grid-cols-2 gap-y-1">
                            {activePayouts.map((mult, i) => (
                                <div key={i} className={`flex justify-between items-center px-2 py-1.5 rounded ${
                                    drawnNumbers.length === 10 && hits === i ? 'bg-[#c6ff00] text-black' : 'text-zinc-400'
                                }`}>
                                    <span className="text-xs font-bold">{i} Hits</span>
                                    <span className={`text-xs font-bold ${drawnNumbers.length === 10 && hits === i ? 'text-black' : 'text-white'}`}>{mult.toFixed(2)}x</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <button 
                    onClick={handlePlay}
                    disabled={isPlaying || selectedNumbers.length === 0}
                    className={`w-full py-3.5 rounded-md font-black text-[14px] tracking-wide transition-all uppercase relative overflow-hidden mt-4 ${
                        isPlaying || selectedNumbers.length === 0 ? 'bg-[#1E2336] text-zinc-500 cursor-not-allowed' : 'bg-[#c6ff00] hover:bg-[#a6d900] text-black shadow-[0_0_15px_rgba(198,255,0,0.3)]'
                    }`}
                >
                    {isPlaying ? 'Drawing...' : 'Bet'}
                </button>
            </div>
        </div>

        {/* ── RIGHT MAIN AREA ── */}
        <div className="flex-1 flex flex-col relative bg-[#0B0E14] order-1 lg:order-2 min-h-[350px] lg:min-h-0 border-b lg:border-b-0 border-[#1E2336]">
            

            {/* Main Graph Area */}
            <div className="flex-1 relative w-full overflow-hidden bg-gradient-to-b from-[#131620] to-[#0b0e14] flex flex-col items-center justify-center p-6 md:p-12">
                
                {/* Top Balance Bar */}
                <div className="absolute top-6 left-6 z-20">
                    <div className="bg-[#131620] text-white text-xs font-semibold px-4 py-2 rounded-full border border-[#1E2336]">
                        {siteUser ? siteUser.balance.toFixed(2) : '10000.00'} EUR
                    </div>
                </div>

                {/* Keno Grid Container */}
                <div className="w-full max-w-[600px] bg-gradient-to-b from-[#181a25] to-[#13151f] p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] border border-[#2a2d3e] z-10 relative overflow-hidden">
                    {/* Decorative inner pattern */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="grid grid-cols-8 gap-2 sm:gap-3">
                        {Array.from({ length: GRID_SIZE }, (_, i) => i + 1).map(num => {
                            const isSelected = selectedNumbers.includes(num);
                            const isDrawn = drawnNumbers.includes(num);
                            const isHit = isSelected && isDrawn;
                            
                            return (
                                <div 
                                    key={num}
                                    onClick={() => handleNumberClick(num)}
                                    className={`aspect-square rounded-full flex items-center justify-center font-black text-sm sm:text-lg transition-all duration-300 transform cursor-pointer relative overflow-hidden group ${
                                        isHit ? 'bg-gradient-to-b from-[#e0ff66] to-[#aacc00] text-black scale-110 shadow-[0_0_20px_rgba(204,255,0,0.8),inset_0_-4px_10px_rgba(0,0,0,0.3)] z-30 ring-2 ring-white/50' :
                                        isDrawn ? 'bg-gradient-to-b from-gray-200 to-gray-400 text-black scale-105 shadow-[0_5px_15px_rgba(0,0,0,0.5),inset_0_-3px_8px_rgba(0,0,0,0.3)] z-20' :
                                        isSelected ? 'bg-gradient-to-b from-[#6366f1] to-[#4338ca] text-white scale-105 shadow-[0_5px_15px_rgba(99,102,241,0.5),inset_0_-4px_10px_rgba(0,0,0,0.4)] ring-1 ring-[#6366f1]/50 z-20' :
                                        'bg-gradient-to-b from-[#2a2d3e] to-[#1e202e] text-gray-400 shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_-2px_5px_rgba(0,0,0,0.5)] border border-white/5 hover:bg-[#3b3f54] hover:text-white hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.4)] z-10'
                                    }`}
                                >
                                    {/* Glassy Top Highlight for 3D effect */}
                                    <div className="absolute top-0 left-1/4 right-1/4 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-full pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity"></div>
                                    <span className="relative z-10 drop-shadow-md">{num}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Result Banner */}
                {winAmount !== null && winAmount > 0 && (
                    <div className="absolute top-6 right-6 z-50 animate-fade-in-up">
                        <div className="flex flex-col items-end">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-0.5">KAZANÇ</span>
                            <span className="text-[#ccff00] font-black text-2xl">+{winAmount.toFixed(2)} EUR</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Footer bar */}
            <div className="h-12 border-t border-[#1E2336] bg-[#0B0E14] flex items-center justify-between px-4 md:px-6 z-30 shrink-0">
                <button className="flex items-center justify-center w-8 h-8 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-colors group">
                    <Target className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                </button>
                
                <div className="text-zinc-700 font-black text-lg md:text-xl tracking-tighter opacity-30 absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none" style={{ fontFamily: 'Arial, sans-serif' }}>
                    724<span className="font-light text-[10px] md:text-xs tracking-widest mt-0.5">ORIGINALS</span>
                </div>

                <div className="flex gap-2">
                    <span className="text-zinc-500 text-[10px] md:text-xs font-bold mr-4 self-center">Fairness</span>
                    <div className="w-8 h-8 rounded-full bg-[#00E5FF] text-black font-black flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.3)] text-[10px] cursor-pointer hover:bg-[#33edff] transition-colors">
                        CHAT
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}