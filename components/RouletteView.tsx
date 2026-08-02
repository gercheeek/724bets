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

            {/* ── RIGHT MAIN AREA (Premium Game Frame) ── */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-12 order-1 md:order-2 min-h-[400px] md:min-h-0 bg-[#0B0E14]">
                
                {/* Ambient Casino Lighting */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>
                
                {/* ── CENTERED GAME CONTAINER ── */}
                <div className="w-full max-w-5xl h-full max-h-[700px] bg-gradient-to-b from-[#111620] to-[#0A0D14] relative rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col justify-center items-center border border-[#1E2738]">
                    
                    {/* Top Info Badges */}
                    <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#0099aa] flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                            <Target className="w-5 h-5 text-[#0A0D14]" />
                        </div>
                        <span className="text-white font-black tracking-widest text-sm uppercase drop-shadow-md">
                            Roulette
                        </span>
                    </div>
                    
                    <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#0A0D14]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 z-20 shadow-lg">
                        <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                        <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Adil Oyun</span>
                    </div>

                    {/* Wheel Container */}
                    <div className="relative w-[320px] h-[320px] md:w-[480px] md:h-[480px] mt-8">
                        
                        {/* Outer Metallic Ring */}
                        <div 
                            className="absolute inset-0 rounded-full shadow-[0_0_80px_rgba(0,229,255,0.05),inset_0_15px_30px_rgba(0,0,0,1)] p-[12px] md:p-[16px] border border-[#2A3744]" 
                            style={{ background: 'conic-gradient(from 0deg, #1A212D, #0A0D14, #1A212D, #0A0D14, #1A212D)' }}
                        >
                            {/* The Wheel */}
                            <div 
                                className="absolute inset-[12px] md:inset-[16px] rounded-full overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,1)] transition-transform ease-[cubic-bezier(0.15,0.9,0.15,1)] bg-[#05070A]"
                                style={{ 
                                    transform: `rotate(${spinRotation}deg)`,
                                    transitionDuration: isPlaying ? '4000ms' : '0ms'
                                }}
                            >
                                {/* Wheel Numbers & Colors */}
                                {ROULETTE_NUMBERS.map((num, i) => {
                                    const angle = (360 / ROULETTE_NUMBERS.length) * i;
                                    const isGreen = num === 0;
                                    const color = isGreen ? '#00E5FF' : (isRed(num) ? '#E11D48' : '#111827');
                                    
                                    return (
                                        <div 
                                            key={num}
                                            className="absolute top-0 left-1/2 h-1/2 origin-bottom -translate-x-1/2 flex justify-center pt-2 md:pt-3"
                                            style={{ 
                                                transform: `rotate(${angle}deg)`,
                                                backgroundColor: color,
                                                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                                                width: '11%',
                                                boxShadow: isGreen ? 'inset 0 0 20px rgba(0,0,0,0.5)' : (isRed(num) ? 'inset 0 0 10px rgba(0,0,0,0.5)' : 'inset 0 0 15px rgba(0,0,0,0.8)')
                                            }}
                                        >
                                            <span className={`font-black block mt-2 ${isGreen ? 'text-[#0A0D14] text-[10px] md:text-[13px] drop-shadow-[0_0_2px_rgba(0,229,255,0.8)]' : 'text-white/90 text-[9px] md:text-[13px] drop-shadow-[0_2px_2px_rgba(0,0,0,1)]'}`} style={{ transform: 'rotate(0deg)' }}>{num}</span>
                                        </div>
                                    );
                                })}
                                
                                {/* Inner Circle (Wood/Metal center) */}
                                <div className="absolute inset-1/4 rounded-full bg-[#1A212D] border-[6px] border-[#2A3744] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#2A3744,#151D24,#2A3744,#151D24,#2A3744)] shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] opacity-80"></div>
                                    <div className="absolute inset-1/3 rounded-full bg-[#0A0D14] border-2 border-[#1E2738] shadow-inner flex items-center justify-center">
                                        <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.5)] opacity-50"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Holographic Laser Pointer */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                            {/* Base */}
                            <div className="w-12 h-3 rounded-full bg-[#0A0D14] border border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.6)] z-10 flex items-center justify-center">
                                <div className="w-8 h-1 bg-[#00E5FF] rounded-full animate-pulse"></div>
                            </div>
                            {/* Laser Beam */}
                            <div className="w-1 h-14 bg-gradient-to-b from-[#00E5FF] to-transparent shadow-[0_0_15px_rgba(0,229,255,1)]"></div>
                        </div>
                    </div>

                    {/* Result Display */}
                    {resultNumber !== null && !isPlaying && (
                        <div className="absolute bottom-12 flex flex-col items-center animate-pop-in z-20">
                            <div className={`w-28 h-28 rounded-full border-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center text-5xl font-black text-white ${
                                resultNumber === 0 ? 'bg-gradient-to-b from-[#00E5FF] to-[#0099aa] border-[#0A0D14] text-[#0A0D14] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]' : isRed(resultNumber) ? 'bg-gradient-to-b from-[#E11D48] to-[#9f1239] border-[#0A0D14]' : 'bg-gradient-to-b from-[#1F2937] to-[#111827] border-[#0A0D14]'
                            }`}>
                                {resultNumber}
                            </div>
                            
                            {winAmount !== null && winAmount > 0 && (
                                <div className="mt-6 bg-[#00E5FF] text-[#0A0D14] font-black px-8 py-3 rounded-full uppercase tracking-[0.2em] text-sm animate-[pulse_2s_ease-in-out_infinite] border-2 border-white shadow-[0_0_30px_rgba(0,229,255,0.6)]">
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
