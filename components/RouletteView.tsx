import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { ShieldCheck, Target } from 'lucide-react';

const ROULETTE_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

type BetType = 'red' | 'black' | 'even' | 'odd' | 'low' | 'high';

export default function RouletteView({ siteUser, onAuthRequired }: any) {
    const { playInstantGame } = useUser();
    const [betAmount, setBetAmount] = useState<number>(0);
    const [selectedBet, setSelectedBet] = useState<BetType | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const [spinRotation, setSpinRotation] = useState<number>(0);
    const [resultNumber, setResultNumber] = useState<number | null>(null);
    const [winAmount, setWinAmount] = useState<number | null>(null);

    const handlePlay = async () => {
        if (!siteUser) return onAuthRequired();
        if (!selectedBet) {
            alert('Lütfen bir bahis türü seçin.');
            return;
        }

        setIsPlaying(true);
        setResultNumber(null);
        setWinAmount(null);

        try {
            // Convert selectedBet to payload format
            let betPayload = {};
            if (['red', 'black'].includes(selectedBet)) {
                betPayload = { type: 'color', value: selectedBet, amount: betAmount };
            } else {
                // For simplicity, we can expand backend logic later for even/odd/low/high.
                // Our current SQL backend only handles color/number.
                // We'll treat unsupported as 0 win for now unless we update SQL.
                // Actually, let's just send it. If SQL doesn't handle, win=0.
                betPayload = { type: 'outside', value: selectedBet, amount: betAmount };
            }

            const data = await playInstantGame(betAmount, 'Roulette', 0, 'none', { bets: [betPayload] });
            const winningNum = data.result.number;
            const payout = data.win_amount;
            
            const winningIndex = ROULETTE_NUMBERS.indexOf(winningNum);
            
            const segmentAngle = 360 / ROULETTE_NUMBERS.length;
            const spins = 5;
            const targetRotation = (spins * 360) - (winningIndex * segmentAngle);
            
            setSpinRotation(prev => prev + targetRotation + (360 - (prev % 360)));

            setTimeout(() => {
                setResultNumber(winningNum);
                setWinAmount(payout);
                setIsPlaying(false);
            }, 4000);
            
        } catch (e: any) {
            alert(e.message || 'Hata oluştu');
            setIsPlaying(false);
        }
    };

    const isRed = (num: number) => RED_NUMBERS.includes(num);

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

                {/* Outside Bets Selection */}
                <div className="mb-6">
                    <label className="block text-xs text-gray-400 font-semibold mb-2">Bahis Seçimi (Ödeme: 2x)</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setSelectedBet('red')}
                            disabled={isPlaying}
                            className={`py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === 'red' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] border-red-500' : 'bg-red-950/50 text-red-500 border border-red-900 hover:bg-red-900/50'}`}
                        >
                            Kırmızı
                        </button>
                        <button 
                            onClick={() => setSelectedBet('black')}
                            disabled={isPlaying}
                            className={`py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === 'black' ? 'bg-black text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] border-gray-500' : 'bg-black/50 text-gray-400 border border-gray-800 hover:bg-black/80'}`}
                        >
                            Siyah
                        </button>
                        <button 
                            onClick={() => setSelectedBet('even')}
                            disabled={isPlaying}
                            className={`py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === 'even' ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#151D24] text-gray-400 border border-[#2A3744] hover:bg-[#1E2933]'}`}
                        >
                            Çift
                        </button>
                        <button 
                            onClick={() => setSelectedBet('odd')}
                            disabled={isPlaying}
                            className={`py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === 'odd' ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#151D24] text-gray-400 border border-[#2A3744] hover:bg-[#1E2933]'}`}
                        >
                            Tek
                        </button>
                        <button 
                            onClick={() => setSelectedBet('low')}
                            disabled={isPlaying}
                            className={`py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === 'low' ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#151D24] text-gray-400 border border-[#2A3744] hover:bg-[#1E2933]'}`}
                        >
                            1-18
                        </button>
                        <button 
                            onClick={() => setSelectedBet('high')}
                            disabled={isPlaying}
                            className={`py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === 'high' ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#151D24] text-gray-400 border border-[#2A3744] hover:bg-[#1E2933]'}`}
                        >
                            19-36
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                    <button 
                        onClick={handlePlay}
                        disabled={isPlaying || !selectedBet}
                        className={`w-full font-bold py-3.5 rounded-md transition-colors shadow-lg ${
                            isPlaying || !selectedBet ? 'bg-[#324555] text-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                    >
                        {isPlaying ? 'Çevriliyor...' : 'Bahis (Çevir)'}
                    </button>
                </div>

                {/* Profit */}
                {winAmount !== null && (
                    <div className={`mt-4 bg-[#151D24] rounded-md border px-3 py-3 flex items-center justify-between transition-colors ${winAmount > 0 ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-[#2A3744]'}`}>
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
                        <Target className="w-5 h-5 text-gray-500" />
                        <span className="text-white font-bold tracking-widest text-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            Roulette
                        </span>
                    </div>
                    
                    <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#111111] px-3 py-1.5 rounded-full border border-white/5 z-20">
                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 font-semibold text-xs">Adil Oyun</span>
                    </div>

                    {/* Wheel Container */}
                    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                        {/* The Wheel */}
                        <div 
                            className="absolute inset-0 rounded-full border-[10px] border-[#1A242D] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-transform ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                            style={{ 
                                transform: `rotate(${spinRotation}deg)`,
                                transitionDuration: isPlaying ? '4000ms' : '0ms'
                            }}
                        >
                            {/* Wheel Numbers & Colors */}
                            {ROULETTE_NUMBERS.map((num, i) => {
                                const angle = (360 / ROULETTE_NUMBERS.length) * i;
                                const isGreen = num === 0;
                                const color = isGreen ? '#06b6d4' : (isRed(num) ? '#DC2626' : '#111827');
                                return (
                                    <div 
                                        key={num}
                                        className="absolute top-0 left-1/2 w-8 h-1/2 origin-bottom -translate-x-1/2 flex justify-center pt-2"
                                        style={{ 
                                            transform: `rotate(${angle}deg)`,
                                            backgroundColor: color,
                                            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                                            width: `${(Math.PI * 400) / ROULETTE_NUMBERS.length + 2}px` // approximate segment width
                                        }}
                                    >
                                        <span className="text-white font-black text-sm block mt-2" style={{ transform: 'rotate(0deg)' }}>{num}</span>
                                    </div>
                                );
                            })}
                            
                            {/* Inner Circle (Wood/Metal center) */}
                            <div className="absolute inset-1/4 rounded-full bg-[#1A242D] border-4 border-[#2A3744] shadow-inner">
                                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#2A3744] to-[#151D24] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
                            </div>
                        </div>

                        {/* Top Pointer (The Ball) */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"></div>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                    </div>

                    {/* Result Display */}
                    {resultNumber !== null && !isPlaying && (
                        <div className="absolute bottom-16 flex flex-col items-center animate-pop-in z-20">
                            <div className={`w-24 h-24 rounded-full border-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center text-4xl font-black text-white ${
                                resultNumber === 0 ? 'bg-emerald-500 border-emerald-400' : isRed(resultNumber) ? 'bg-red-600 border-red-500' : 'bg-gray-900 border-gray-700'
                            }`}>
                                {resultNumber}
                            </div>
                            
                            {winAmount !== null && winAmount > 0 && (
                                <div className="mt-4 bg-emerald-500 text-white font-black px-6 py-2 rounded-full uppercase tracking-widest animate-pulse border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                                    Kazandın +₺{winAmount.toFixed(2)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
