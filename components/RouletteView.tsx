import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { ShieldCheck, Target, Trash2, Trophy, Sparkles } from 'lucide-react';

const ROULETTE_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

type BetType = 'red' | 'black' | 'even' | 'odd' | 'low' | 'high' | '1st12' | '2nd12' | '3rd12' | 'number';

interface PlacedBet {
    type: BetType;
    amount: number;
    value?: number;
}

export default function RouletteView({ siteUser, onAuthRequired }: any) {
    const { playInstantGame, isFunMode, demoBalance, setDemoBalance } = useUser();
    const [betAmount, setBetAmount] = useState<number>(0);
    const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);
    const [selectedNumber, setSelectedNumber] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFastSpinning, setIsFastSpinning] = useState(false);
    
    const [spinRotation, setSpinRotation] = useState<number>(0);
    const [ballRotation, setBallRotation] = useState<number>(0);
    const [resultNumber, setResultNumber] = useState<number | null>(null);
    const [winAmount, setWinAmount] = useState<number | null>(null);
    const [resultDetails, setResultDetails] = useState<{label: string, won: boolean, amount: number}[]>([]);

    const totalBetAmount = placedBets.reduce((sum, bet) => sum + bet.amount, 0);

    const handleAddBet = (type: BetType, value?: number) => {
        if (betAmount <= 0) return alert('Geçerli bir bahis tutarı girin.');
        if (isFunMode && (totalBetAmount + betAmount) > demoBalance) return alert('Yetersiz demo bakiye.');
        
        setPlacedBets(prev => {
            const existingIndex = prev.findIndex(b => b.type === type && b.value === value);
            if (existingIndex >= 0) {
                const newBets = [...prev];
                newBets[existingIndex].amount += betAmount;
                return newBets;
            }
            return [...prev, { type, amount: betAmount, value }];
        });
    };

    const handleClearBets = () => {
        if (isPlaying) return;
        setPlacedBets([]);
    };

    const getBetAmount = (type: BetType, value?: number) => {
        const bet = placedBets.find(b => b.type === type && b.value === value);
        return bet ? bet.amount : 0;
    };

    const handlePlay = async () => {
        if (!isFunMode && !siteUser) return onAuthRequired();
        if (placedBets.length === 0) {
            alert('Lütfen en az bir bahis yapın.');
            return;
        }
        
        if (isFunMode && totalBetAmount > demoBalance) {
            alert('Yetersiz demo bakiye.');
            return;
        }

        setIsPlaying(true);
        setIsFastSpinning(true);
        setResultNumber(null);
        setWinAmount(null);
        setResultDetails([]);
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100]);

        try {
            let winningNum: number;
            let totalPayout: number = 0;

            if (isFunMode) {
                // --- DEMO (MOCK) LOGIC ---
                setDemoBalance(prev => prev - totalBetAmount);
                winningNum = Math.floor(Math.random() * 37);
                
                // Demo Payout Calculation
                placedBets.forEach(bet => {
                    let payout = 0;
                    if (['red', 'black'].includes(bet.type)) {
                        if (winningNum !== 0) {
                            const isRedResult = RED_NUMBERS.includes(winningNum);
                            if ((bet.type === 'red' && isRedResult) || (bet.type === 'black' && !isRedResult)) {
                                payout = bet.amount * 2;
                            }
                        }
                    } else if (['even', 'odd'].includes(bet.type)) {
                        if (winningNum !== 0) {
                            const isEven = winningNum % 2 === 0;
                            if ((bet.type === 'even' && isEven) || (bet.type === 'odd' && !isEven)) {
                                payout = bet.amount * 2;
                            }
                        }
                    } else if (['low', 'high'].includes(bet.type)) {
                        if (winningNum !== 0) {
                            const isLow = winningNum >= 1 && winningNum <= 18;
                            if ((bet.type === 'low' && isLow) || (bet.type === 'high' && !isLow)) {
                                payout = bet.amount * 2;
                            }
                        }
                    } else if (['1st12', '2nd12', '3rd12'].includes(bet.type)) {
                        if (winningNum !== 0) {
                            const is1st = winningNum >= 1 && winningNum <= 12;
                            const is2nd = winningNum >= 13 && winningNum <= 24;
                            const is3rd = winningNum >= 25 && winningNum <= 36;
                            if ((bet.type === '1st12' && is1st) || (bet.type === '2nd12' && is2nd) || (bet.type === '3rd12' && is3rd)) {
                                payout = bet.amount * 3;
                            }
                        }
                    } else if (bet.type === 'number') {
                        if (winningNum === bet.value) {
                            payout = bet.amount * 36;
                        }
                    }
                    totalPayout += payout;
                });
            } else {
                // --- REAL MONEY LOGIC ---
                const betPayloads = placedBets.map(bet => {
                    if (['red', 'black'].includes(bet.type)) {
                        return { type: 'color', value: bet.type, amount: bet.amount };
                    } else if (bet.type === 'number') {
                        return { type: 'number', value: bet.value, amount: bet.amount };
                    } else if (['1st12', '2nd12', '3rd12'].includes(bet.type)) {
                        return { type: 'dozen', value: bet.type, amount: bet.amount };
                    } else {
                        return { type: 'outside', value: bet.type, amount: bet.amount };
                    }
                });

                const data = await playInstantGame(totalBetAmount, 'Roulette', 0, 'none', { bets: betPayloads });
                winningNum = data.result.number;
                totalPayout = data.win_amount;
            }
            
            const winningIndex = ROULETTE_NUMBERS.indexOf(winningNum);
            const segmentAngle = 360 / ROULETTE_NUMBERS.length;
            const spins = 12;
            const targetRotation = (spins * 360) - (winningIndex * segmentAngle);
            
            setSpinRotation(prev => prev + targetRotation + (360 - (prev % 360)));
            setBallRotation(prev => prev - (15 * 360) - (prev % 360));

            const generateResultDetails = (winningNum: number) => {
                return placedBets.map(bet => {
                    let won = false;
                    if (['red', 'black'].includes(bet.type)) {
                        const isRedResult = RED_NUMBERS.includes(winningNum);
                        won = winningNum !== 0 && ((bet.type === 'red' && isRedResult) || (bet.type === 'black' && !isRedResult));
                    } else if (['even', 'odd'].includes(bet.type)) {
                        const isEven = winningNum % 2 === 0;
                        won = winningNum !== 0 && ((bet.type === 'even' && isEven) || (bet.type === 'odd' && !isEven));
                    } else if (['low', 'high'].includes(bet.type)) {
                        const isLow = winningNum >= 1 && winningNum <= 18;
                        won = winningNum !== 0 && ((bet.type === 'low' && isLow) || (bet.type === 'high' && !isLow));
                    } else if (['1st12', '2nd12', '3rd12'].includes(bet.type)) {
                        const is1st = winningNum >= 1 && winningNum <= 12;
                        const is2nd = winningNum >= 13 && winningNum <= 24;
                        const is3rd = winningNum >= 25 && winningNum <= 36;
                        won = winningNum !== 0 && ((bet.type === '1st12' && is1st) || (bet.type === '2nd12' && is2nd) || (bet.type === '3rd12' && is3rd));
                    } else if (bet.type === 'number') {
                        won = winningNum === bet.value;
                    }
                    
                    let label = bet.type;
                    if (bet.type === 'red') label = 'Kırmızı';
                    if (bet.type === 'black') label = 'Siyah';
                    if (bet.type === 'even') label = 'Çift';
                    if (bet.type === 'odd') label = 'Tek';
                    if (bet.type === 'low') label = '1-18';
                    if (bet.type === 'high') label = '19-36';
                    if (bet.type === '1st12') label = '1. Düzine';
                    if (bet.type === '2nd12') label = '2. Düzine';
                    if (bet.type === '3rd12') label = '3. Düzine';
                    if (bet.type === 'number') label = `${bet.value}`;

                    return { label, won, amount: bet.amount };
                });
            };

            setTimeout(() => {
                setIsFastSpinning(false);
            }, 5500);

            setTimeout(() => {
                setResultNumber(winningNum);
                setWinAmount(totalPayout);
                setResultDetails(generateResultDetails(winningNum));
                if (isFunMode && totalPayout > 0) {
                    setDemoBalance(prev => prev + totalPayout);
                }
                setIsPlaying(false);
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(totalPayout > 0 ? [200, 100, 200] : 200);
                }
            }, 8000);
            
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
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs text-gray-400 font-semibold">Bahis Seçimi (Ödeme: 2x)</label>
                        {totalBetAmount > 0 && (
                            <span className="text-xs text-[#00E5FF] font-bold">Toplam Bahis: ₺{totalBetAmount.toFixed(2)}</span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => handleAddBet('red')}
                            disabled={isPlaying}
                            className={`relative py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all border ${getBetAmount('red') > 0 ? 'bg-gradient-to-b from-red-500 to-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] border-red-500' : 'bg-[#1A1F26] text-red-500 border-[#2A3744] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] hover:bg-[#252D38]'}`}
                        >
                            Kırmızı
                            {getBetAmount('red') > 0 && <div className="absolute top-1 right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">₺{getBetAmount('red')}</div>}
                        </button>
                        <button 
                            onClick={() => handleAddBet('black')}
                            disabled={isPlaying}
                            className={`relative py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all border ${getBetAmount('black') > 0 ? 'bg-gradient-to-b from-gray-700 to-gray-900 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] border-gray-500' : 'bg-[#1A1F26] text-gray-400 border-[#2A3744] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] hover:bg-[#252D38]'}`}
                        >
                            Siyah
                            {getBetAmount('black') > 0 && <div className="absolute top-1 right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">₺{getBetAmount('black')}</div>}
                        </button>
                        <button 
                            onClick={() => handleAddBet('even')}
                            disabled={isPlaying}
                            className={`relative py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all border ${getBetAmount('even') > 0 ? 'bg-gradient-to-b from-[#3D82F6] to-[#2563EB] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#1A1F26] text-gray-400 border-[#2A3744] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] hover:bg-[#252D38]'}`}
                        >
                            Çift
                            {getBetAmount('even') > 0 && <div className="absolute top-1 right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">₺{getBetAmount('even')}</div>}
                        </button>
                        <button 
                            onClick={() => handleAddBet('odd')}
                            disabled={isPlaying}
                            className={`relative py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all border ${getBetAmount('odd') > 0 ? 'bg-gradient-to-b from-[#3D82F6] to-[#2563EB] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#1A1F26] text-gray-400 border-[#2A3744] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] hover:bg-[#252D38]'}`}
                        >
                            Tek
                            {getBetAmount('odd') > 0 && <div className="absolute top-1 right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">₺{getBetAmount('odd')}</div>}
                        </button>
                        <button 
                            onClick={() => handleAddBet('low')}
                            disabled={isPlaying}
                            className={`relative py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all border ${getBetAmount('low') > 0 ? 'bg-gradient-to-b from-[#3D82F6] to-[#2563EB] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#1A1F26] text-gray-400 border-[#2A3744] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] hover:bg-[#252D38]'}`}
                        >
                            1-18
                            {getBetAmount('low') > 0 && <div className="absolute top-1 right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">₺{getBetAmount('low')}</div>}
                        </button>
                        <button 
                            onClick={() => handleAddBet('high')}
                            disabled={isPlaying}
                            className={`relative py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all border ${getBetAmount('high') > 0 ? 'bg-gradient-to-b from-[#3D82F6] to-[#2563EB] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#1A1F26] text-gray-400 border-[#2A3744] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] hover:bg-[#252D38]'}`}
                        >
                            19-36
                            {getBetAmount('high') > 0 && <div className="absolute top-1 right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">₺{getBetAmount('high')}</div>}
                        </button>
                    </div>
                    
                    {/* Dozens */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <button 
                            onClick={() => handleAddBet('1st12')}
                            disabled={isPlaying}
                            className={`relative py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all border ${getBetAmount('1st12') > 0 ? 'bg-gradient-to-b from-[#3D82F6] to-[#2563EB] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#1A1F26] text-gray-400 border-[#2A3744] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] hover:bg-[#252D38]'}`}
                        >
                            1. Düzine
                            {getBetAmount('1st12') > 0 && <div className="absolute top-1 right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">₺{getBetAmount('1st12')}</div>}
                        </button>
                        <button 
                            onClick={() => handleAddBet('2nd12')}
                            disabled={isPlaying}
                            className={`relative py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all border ${getBetAmount('2nd12') > 0 ? 'bg-gradient-to-b from-[#3D82F6] to-[#2563EB] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#1A1F26] text-gray-400 border-[#2A3744] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] hover:bg-[#252D38]'}`}
                        >
                            2. Düzine
                            {getBetAmount('2nd12') > 0 && <div className="absolute top-1 right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">₺{getBetAmount('2nd12')}</div>}
                        </button>
                        <button 
                            onClick={() => handleAddBet('3rd12')}
                            disabled={isPlaying}
                            className={`relative py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all border ${getBetAmount('3rd12') > 0 ? 'bg-gradient-to-b from-[#3D82F6] to-[#2563EB] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#1A1F26] text-gray-400 border-[#2A3744] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] hover:bg-[#252D38]'}`}
                        >
                            3. Düzine
                            {getBetAmount('3rd12') > 0 && <div className="absolute top-1 right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">₺{getBetAmount('3rd12')}</div>}
                        </button>
                    </div>

                    {/* Specific Number */}
                    <div className="mt-4 p-3 bg-[#1A1F26] rounded-md border border-[#2A3744] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-gray-400 font-semibold flex items-center gap-2">
                                Belirli Sayı (Ödeme: 36x)
                            </label>
                            {getBetAmount('number', selectedNumber) > 0 && (
                                <span className="text-xs text-[#00E5FF] font-bold">₺{getBetAmount('number', selectedNumber)}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 opacity-100 transition-opacity mb-3">
                            <input 
                                type="range" 
                                min="0" 
                                max="36" 
                                value={selectedNumber}
                                onChange={(e) => setSelectedNumber(Number(e.target.value))}
                                disabled={isPlaying}
                                className="flex-1 accent-[#3D82F6]"
                            />
                            <div className="w-10 h-10 bg-[#0B0E14] rounded flex items-center justify-center font-black text-[#00E5FF] shadow-inner text-lg border border-[#00E5FF]/20">
                                {selectedNumber}
                            </div>
                        </div>
                        <button 
                            onClick={() => handleAddBet('number', selectedNumber)}
                            disabled={isPlaying}
                            className="w-full py-2 bg-[#3D82F6] hover:bg-[#2563EB] text-white font-bold text-xs rounded transition-colors"
                        >
                            {selectedNumber} Numarasına Bahis Ekle
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex gap-2">
                        <button 
                            onClick={handleClearBets}
                            disabled={isPlaying || placedBets.length === 0}
                            className={`px-4 font-bold rounded-md transition-colors flex items-center justify-center ${
                                isPlaying || placedBets.length === 0 ? 'bg-[#151D24] text-gray-600 cursor-not-allowed border border-[#2A3744]' : 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30'
                            }`}
                            title="Bahisleri Temizle"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={handlePlay}
                            disabled={isPlaying || placedBets.length === 0}
                            className={`flex-1 font-bold py-3.5 rounded-md transition-colors shadow-lg flex items-center justify-center gap-2 ${
                                isPlaying || placedBets.length === 0 ? 'bg-[#324555] text-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            }`}
                        >
                            {isPlaying ? 'Çevriliyor...' : (
                                <>
                                    Bahis (Çevir)
                                    {placedBets.length > 0 && (
                                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                                            {placedBets.length} Bahis
                                        </span>
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Profit */}
                {winAmount !== null && (
                    <div className={`mt-4 bg-[#151D24] rounded-md border px-3 py-3 flex items-center justify-between transition-colors ${winAmount > 0 ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-[#2A3744]'}`}>
                        <span className="text-gray-400 text-xs font-bold uppercase">{winAmount > 0 ? 'Kazanç' : 'Kayıp'}</span>
                        <span className={`font-mono text-sm font-bold ${winAmount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {winAmount > 0 ? `+₺${winAmount.toFixed(2)}` : `-₺${totalBetAmount.toFixed(2)}`}
                        </span>
                    </div>
                )}
            </div>

            {/* ── RIGHT MAIN AREA (Premium Game Frame) ── */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-12 order-1 md:order-2 min-h-[400px] md:min-h-0 bg-[#0B0E14]">
                
                {/* Ambient Casino Lighting */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>
                
                {/* ── CENTERED GAME CONTAINER ── */}
                <div className="w-full max-w-5xl h-full min-h-[700px] bg-gradient-to-b from-[#111620] to-[#0A0D14] relative rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col justify-center items-center border border-[#1E2738] py-12">
                    
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

                    {/* Premium 3D Wheel Container */}
                    <div 
                        className="relative w-[340px] h-[340px] md:w-[600px] md:h-[600px] mt-10 mb-12 flex-1 shrink-0 flex items-center justify-center"
                        style={{ perspective: '1500px' }}
                    >
                        {/* The 3D Tilted Base */}
                        <div 
                            className="relative w-full h-full"
                            style={{ 
                                transform: 'rotateX(55deg) translateY(-20px)', 
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {/* Table Cast Shadow */}
                            <div 
                                className="absolute inset-0 rounded-full bg-black blur-2xl" 
                                style={{ transform: 'translateZ(-60px) scale(1.05)' }} 
                            />
                            {/* 3D Cylinder Thickness (Under the wheel) */}
                            <div 
                                className="absolute inset-0 rounded-full bg-gradient-to-b from-[#3a1d0b] to-[#0d0501] shadow-[inset_0_-10px_30px_rgba(0,0,0,0.9)]" 
                                style={{ transform: 'translateZ(-40px)' }} 
                            />
                            <div 
                                className="absolute inset-0 rounded-full bg-[#1a0b02]" 
                                style={{ transform: 'translateZ(-20px)' }} 
                            />
                            
                            {/* The Actual Wheel SVG on top */}
                            <div className="absolute inset-0 rounded-full" style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
                                <svg width="100%" height="100%" viewBox="0 0 600 600" className="drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.9))' }}>
                            <defs>
                                <radialGradient id="wood-frame" cx="50%" cy="50%" r="50%">
                                    <stop offset="70%" stopColor="#2c1405" />
                                    <stop offset="95%" stopColor="#1a0b02" />
                                    <stop offset="100%" stopColor="#0d0501" />
                                </radialGradient>
                                <linearGradient id="metal-fret" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#facc15" />
                                    <stop offset="50%" stopColor="#ca8a04" />
                                    <stop offset="100%" stopColor="#713f12" />
                                </linearGradient>
                                <radialGradient id="ball-gradient" cx="30%" cy="30%" r="70%">
                                    <stop offset="0%" stopColor="#ffffff" />
                                    <stop offset="70%" stopColor="#d1d5db" />
                                    <stop offset="100%" stopColor="#4b5563" />
                                </radialGradient>
                                <radialGradient id="track-gradient" cx="50%" cy="50%" r="50%">
                                    <stop offset="70%" stopColor="#111827" />
                                    <stop offset="95%" stopColor="#1f2937" />
                                    <stop offset="100%" stopColor="#030712" />
                                </radialGradient>
                                <radialGradient id="metal-hub" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#2A3744" />
                                    <stop offset="70%" stopColor="#151D24" />
                                    <stop offset="100%" stopColor="#05070A" />
                                </radialGradient>
                                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FDE047" />
                                    <stop offset="50%" stopColor="#EAB308" />
                                    <stop offset="100%" stopColor="#713F12" />
                                </linearGradient>
                                <linearGradient id="red-slice" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#dc2626" />
                                    <stop offset="50%" stopColor="#991b1b" />
                                    <stop offset="100%" stopColor="#7f1d1d" />
                                </linearGradient>
                                <linearGradient id="black-slice" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#374151" />
                                    <stop offset="50%" stopColor="#111827" />
                                    <stop offset="100%" stopColor="#030712" />
                                </linearGradient>
                                <linearGradient id="green-slice" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#2dd4bf" />
                                    <stop offset="50%" stopColor="#0f766e" />
                                    <stop offset="100%" stopColor="#042f2e" />
                                </linearGradient>
                            </defs>

                            {/* STATIC OUTER Casing */}
                            <circle cx="300" cy="300" r="290" fill="url(#wood-frame)" stroke="#0d0501" strokeWidth="4" />
                            {/* Inner metal rim */}
                            <circle cx="300" cy="300" r="265" fill="url(#track-gradient)" stroke="url(#gold)" strokeWidth="6" />
                            
                            {/* Ball Track Base */}
                            <circle cx="300" cy="300" r="245" fill="none" stroke="#0f172a" strokeWidth="40" />

                            {/* Static Diamonds (Deflectors) on Track */}
                            <g>
                                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                                    <path key={`diamond-${i}`} transform={`rotate(${angle}, 300, 300) translate(300, 55)`} d="M 0 -10 L 8 0 L 0 10 L -8 0 Z" fill="url(#gold)" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.8))"/>
                                ))}
                            </g>

                            {/* ROTATING WHEEL AND NUMBERS */}
                            <g 
                                style={{ 
                                    transform: `rotate(${spinRotation}deg)`, 
                                    transformOrigin: '300px 300px',
                                    transition: isPlaying ? 'transform 8000ms cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
                                }}
                            >
                                {/* Sectors */}
                                {ROULETTE_NUMBERS.map((num, i) => {
                                    const angleStep = 360 / 37;
                                    const startAngle = -angleStep / 2;
                                    const endAngle = angleStep / 2;
                                    const isGreen = num === 0;
                                    const color = isGreen ? 'url(#green-slice)' : (isRed(num) ? 'url(#red-slice)' : 'url(#black-slice)');
                                    
                                    const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
                                        const rad = (angle - 90) * Math.PI / 180.0;
                                        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
                                    };
                                    const p1 = polarToCartesian(300, 300, 222, endAngle);
                                    const p2 = polarToCartesian(300, 300, 222, startAngle);
                                    const path = `M 300 300 L ${p1.x} ${p1.y} A 222 222 0 0 0 ${p2.x} ${p2.y} Z`;
                                    
                                    const fretP = polarToCartesian(300, 300, 222, endAngle);

                                    return (
                                        <g key={num} transform={`rotate(${i * angleStep}, 300, 300)`}>
                                            <path d={path} fill={color} />
                                            {/* Fret (Separator) */}
                                            <line x1="300" y1="300" x2={fretP.x} y2={fretP.y} stroke="url(#metal-fret)" strokeWidth="3" filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.5))" />
                                            
                                            {/* Number Text */}
                                            <text 
                                                x="300" 
                                                y="105" 
                                                textAnchor="middle" 
                                                dominantBaseline="middle"
                                                fill={isGreen ? '#0A0D14' : '#ffffff'}
                                                fontSize="18"
                                                fontWeight="900"
                                                fontFamily="serif"
                                                letterSpacing="-1"
                                                style={{ textShadow: isGreen ? '0 0 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.8)' }}
                                            >
                                                {num}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Center Turret (Spindle) */}
                                <circle cx="300" cy="300" r="140" fill="url(#metal-hub)" stroke="url(#gold)" strokeWidth="6" filter="drop-shadow(0 0 20px rgba(0,0,0,0.8))" />
                                <circle cx="300" cy="300" r="70" fill="url(#track-gradient)" stroke="url(#gold)" strokeWidth="4" />
                                <circle cx="300" cy="300" r="30" fill="url(#metal-hub)" stroke="url(#gold)" strokeWidth="2" />
                                
                                {/* Turret Spindle Arms */}
                                <path d="M 296 180 L 304 180 L 304 420 L 296 420 Z" fill="url(#gold)" filter="drop-shadow(0 5px 5px rgba(0,0,0,0.9))" />
                                <path d="M 180 296 L 420 296 L 420 304 L 180 304 Z" fill="url(#gold)" filter="drop-shadow(5px 0 5px rgba(0,0,0,0.9))" />
                                
                                {/* Nut */}
                                <circle cx="300" cy="300" r="15" fill="url(#gold)" filter="drop-shadow(0 0 10px rgba(0,0,0,0.9))" />
                            </g>

                            {/* ROTATING BALL */}
                            <g
                                style={{ 
                                    transform: `rotate(${ballRotation}deg)`, 
                                    transformOrigin: '300px 300px',
                                    transition: isPlaying ? 'transform 8000ms cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
                                }}
                            >
                                <circle 
                                    cx="300" 
                                    cy={isPlaying ? 60 : 105} 
                                    r={isPlaying ? 8 : 7}
                                    fill="url(#ball-gradient)" 
                                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))" 
                                    style={{ transition: isPlaying ? 'cy 0.1s, r 0.1s' : 'cy 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), r 0.4s ease-out' }}
                                />
                            </g>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Result Display */}
                    {resultNumber !== null && !isPlaying && (
                        <div className="absolute bottom-6 left-6 flex flex-col items-start animate-pop-in z-40">
                            {winAmount !== null && winAmount > 0 ? (
                                <div className="bg-emerald-500/20 backdrop-blur-md text-emerald-400 font-black pr-6 md:pr-8 py-2 md:py-3 rounded-2xl uppercase tracking-[0.1em] text-sm md:text-base animate-[pulse_2s_ease-in-out_infinite] border border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)] flex items-center gap-4">
                                    <div className={`w-14 h-14 md:w-16 md:h-16 ml-2 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center text-2xl font-black text-white ${
                                        resultNumber === 0 ? 'bg-gradient-to-b from-[#00E5FF] to-[#0099aa] border border-[#0A0D14]' : isRed(resultNumber) ? 'bg-gradient-to-b from-[#E11D48] to-[#9f1239] border border-[#0A0D14]' : 'bg-gradient-to-b from-[#1F2937] to-[#111827] border border-[#0A0D14]'
                                    }`}>
                                        {resultNumber}
                                    </div>
                                    <Trophy className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    <span>Kazandın +₺{winAmount.toFixed(2)}</span>
                                </div>
                            ) : (
                                <div className="bg-rose-500/20 backdrop-blur-md text-rose-400 font-black pr-6 md:pr-8 py-2 md:py-3 rounded-2xl uppercase tracking-[0.2em] text-sm md:text-base border border-rose-500/50 shadow-[0_0_40px_rgba(225,29,72,0.3)] flex items-center gap-4">
                                    <div className={`w-14 h-14 md:w-16 md:h-16 ml-2 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center text-2xl font-black text-white ${
                                        resultNumber === 0 ? 'bg-gradient-to-b from-[#00E5FF] to-[#0099aa] border border-[#0A0D14]' : isRed(resultNumber) ? 'bg-gradient-to-b from-[#E11D48] to-[#9f1239] border border-[#0A0D14]' : 'bg-gradient-to-b from-[#1F2937] to-[#111827] border border-[#0A0D14]'
                                    }`}>
                                        {resultNumber}
                                    </div>
                                    <Trash2 className="w-5 h-5 opacity-80" />
                                    Kaybettin
                                </div>
                            )}
                            
                            {resultDetails.length > 0 && (
                                <div className="mt-3 bg-[#0A0D14]/95 border border-white/10 rounded-xl p-3 backdrop-blur-md shadow-xl flex flex-wrap gap-2 max-w-[250px]">
                                    {resultDetails.map((det, idx) => (
                                        <div key={idx} className={`text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md ${det.won ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                                            {det.label} {det.won ? '✅' : '❌'}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
