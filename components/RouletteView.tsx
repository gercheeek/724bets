import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Coins } from 'lucide-react';

type BetColor = 'red' | 'green' | 'black';

interface PlacedBet {
    type: BetColor;
    amount: number;
}

const BRICK_WIDTH = 100; // pixels
const TOTAL_BRICKS = 60; // How many bricks in the slider

const ASSETS = {
    btnGrey: 'https://gamdom.com/build/button_grey.d7429b7c0b343420ecdf.svg',
    btnGreen: 'https://gamdom.com/build/button_green.b6e9423030cfd2900b9f.svg',
    btnRed: 'https://gamdom.com/build/button_red.110dc09da36213520a99.svg',
    brickGreen: 'https://gamdom.com/build/brick_green.633d32a97d.500.webp',
    brickGrey: 'https://gamdom.com/build/brick_grey.613ecdb6fc.500.webp',
    brickRed: 'https://gamdom.com/build/brick_red.c0aaf93b01.500.webp',
    tanzanite: 'https://gamdom.com/static/img/tanzanite.svg'
};

const generateReel = () => {
    const reel: BetColor[] = [];
    for (let i = 0; i < TOTAL_BRICKS; i++) {
        const rand = Math.random();
        if (rand < 0.05) reel.push('green');
        else if (rand < 0.525) reel.push('red');
        else reel.push('black');
    }
    return reel;
};

export default function RouletteView({ siteUser, onAuthRequired }: any) {
    const { playInstantGame, isFunMode, demoBalance, setDemoBalance } = useUser();
    const [betAmount, setBetAmount] = useState<number>(1);
    const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [reel, setReel] = useState<BetColor[]>(generateReel());
    const [slideOffset, setSlideOffset] = useState<number>(0);
    const [winningColor, setWinningColor] = useState<BetColor | null>(null);
    const [winAmount, setWinAmount] = useState<number | null>(null);

    useEffect(() => {
        setSlideOffset(0);
    }, []);

    const totalBetAmount = placedBets.reduce((sum, bet) => sum + bet.amount, 0);

    const handleAddBet = (type: BetColor) => {
        if (betAmount <= 0) return alert('Geçerli bir bahis tutarı girin.');
        if (isFunMode && (totalBetAmount + betAmount) > demoBalance) return alert('Yetersiz demo bakiye.');
        
        setPlacedBets(prev => {
            const existingIndex = prev.findIndex(b => b.type === type);
            if (existingIndex >= 0) {
                const newBets = [...prev];
                newBets[existingIndex].amount += betAmount;
                return newBets;
            }
            return [...prev, { type, amount: betAmount }];
        });
    };

    const handleClearBets = () => {
        if (isPlaying) return;
        setPlacedBets([]);
    };

    const getBetAmount = (type: BetColor) => {
        const bet = placedBets.find(b => b.type === type);
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
        setWinningColor(null);
        setWinAmount(null);
        
        const newReel = generateReel();

        try {
            let winResult: BetColor;
            let totalPayout: number = 0;

            if (isFunMode) {
                setDemoBalance(prev => prev - totalBetAmount);
                const rand = Math.random();
                if (rand < 0.05) winResult = 'green';
                else if (rand < 0.525) winResult = 'red';
                else winResult = 'black';
                
                placedBets.forEach(bet => {
                    if (bet.type === winResult) {
                        if (winResult === 'green') totalPayout += bet.amount * 100;
                        else totalPayout += bet.amount * 2;
                    }
                });
            } else {
                const betPayloads = placedBets.map(bet => ({ type: 'color', value: bet.type, amount: bet.amount }));
                const data = await playInstantGame(totalBetAmount, 'Roulette', 0, 'none', { bets: betPayloads });
                winResult = data.result.color || (data.result.number === 0 ? 'green' : (data.result.number % 2 === 0 ? 'black' : 'red'));
                totalPayout = data.win_amount;
            }

            // Target brick position
            newReel[50] = winResult;
            setReel(newReel);

            const targetIndex = 50;
            const itemWidth = BRICK_WIDTH;
            const randomOffset = Math.floor(Math.random() * (itemWidth - 20)) - (itemWidth - 20)/2;
            const stopPosition = - (targetIndex * itemWidth) + randomOffset;
            
            setSlideOffset(0);
            
            setTimeout(() => {
                setSlideOffset(stopPosition);
            }, 50);

            setTimeout(() => {
                setWinningColor(winResult);
                setWinAmount(totalPayout);
                if (isFunMode && totalPayout > 0) {
                    setDemoBalance(prev => prev + totalPayout);
                }
                setIsPlaying(false);
            }, 6050);
            
        } catch (e: any) {
            alert(e.message || 'Hata oluştu');
            setIsPlaying(false);
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-[#171a21] text-white font-sans overflow-y-auto">
            
            {/* Top Bar */}
            <div className="flex justify-between items-center px-6 py-4 bg-[#111419] border-b border-white/5">
                <div className="flex items-center gap-6">
                    <img src="https://gamdom.com/static/img/game-check.png" alt="Provably Fair" className="h-6 opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
                    <img src="https://gamdom.com/static/img/trustpilot-logo.svg" alt="Trustpilot" className="h-6 opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#171a21] px-4 py-1.5 rounded-full border border-white/10">
                        <img src={ASSETS.tanzanite} alt="Balance" className="h-4" />
                        <span className="font-bold text-sm text-emerald-400">
                            ${siteUser ? siteUser.balance.toFixed(2) : (isFunMode ? demoBalance.toFixed(2) : '0.00')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto p-4 md:p-8">
                
                {/* ── REEL CONTAINER ── */}
                <div className="w-full relative h-[180px] bg-[#111419] rounded-xl overflow-hidden border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-8 flex items-center justify-center">
                    
                    {/* Dark gradient edges */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#111419] to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#111419] to-transparent z-10 pointer-events-none"></div>

                    {/* The Center Line indicator */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white z-30 shadow-[0_0_10px_white]"></div>

                    {/* The sliding track */}
                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 h-[120px] w-[5000px] pointer-events-none">
                        <div 
                            className="absolute top-0 left-0 h-full flex items-center"
                            style={{
                                transform: `translateX(${slideOffset}px)`,
                                transition: isPlaying ? 'transform 6s cubic-bezier(0.1, 0.1, 0, 1)' : 'none',
                                willChange: 'transform'
                            }}
                        >
                            {reel.map((color, idx) => (
                                <div key={idx} className="absolute top-0 flex items-center justify-center h-full" style={{ width: `${BRICK_WIDTH}px`, left: `${idx * BRICK_WIDTH}px` }}>
                                    <div className="relative group w-full h-full flex items-center justify-center">
                                        <img 
                                            src={color === 'red' ? ASSETS.brickRed : (color === 'green' ? ASSETS.brickGreen : ASSETS.brickGrey)} 
                                            alt={color} 
                                            className="w-[85px] object-contain drop-shadow-xl" 
                                        />
                                        {/* Number overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                            {color === 'green' ? 0 : Math.floor(Math.random() * 99) + 1}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── BET CONTROLS ── */}
                <div className="w-full mb-8 flex flex-col items-center">
                    <div className="flex flex-wrap items-center gap-4 bg-[#111419] p-2 rounded-xl border border-white/5 w-full shadow-lg">
                        
                        <div className="flex-1 flex bg-[#171a21] rounded-lg border border-white/10 overflow-hidden min-w-[200px]">
                            <div className="px-4 flex items-center justify-center bg-white/5"><img src={ASSETS.tanzanite} alt="$" className="h-4" /></div>
                            <input 
                                type="number" 
                                value={betAmount}
                                onChange={(e) => setBetAmount(Number(e.target.value))}
                                disabled={isPlaying}
                                placeholder="Tutar..."
                                className="flex-1 bg-transparent text-white font-bold text-sm py-3 px-2 outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2 shrink-0">
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#1a1e24] border border-white/5" onClick={() => handleClearBets()}>Temizle</button>
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#1a1e24] border border-white/5" onClick={() => setBetAmount(prev => prev + 10)}>+10</button>
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#1a1e24] border border-white/5" onClick={() => setBetAmount(prev => prev + 50)}>+50</button>
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#1a1e24] border border-white/5" onClick={() => setBetAmount(prev => prev + 100)}>+100</button>
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#1a1e24] border border-white/5" onClick={() => setBetAmount(prev => Math.max(1, prev / 2))}>1/2</button>
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#1a1e24] border border-white/5" onClick={() => setBetAmount(prev => prev * 2)}>x2</button>
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#1a1e24] border border-white/5" onClick={() => setBetAmount(isFunMode ? demoBalance : (siteUser?.balance || 0))}>Max</button>
                        </div>
                    </div>
                </div>

                {/* ── BETTING BUTTONS ── */}
                <div className="w-full flex flex-col md:flex-row gap-6 mb-12 items-stretch max-w-6xl mx-auto">
                    
                    {/* RED BUTTON */}
                    <div className="flex-1 flex flex-col group cursor-pointer" onClick={() => !isPlaying && handleAddBet('red')}>
                        <div 
                            className={`relative w-full h-24 sm:h-28 mb-4 transition-all flex items-center justify-between px-6 sm:px-10 overflow-hidden rounded-[20px] shadow-lg ${isPlaying ? 'opacity-50' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                            style={{ backgroundImage: `url(${ASSETS.btnRed})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            <span className="text-white font-black text-2xl drop-shadow-md">Kırmızı</span>
                            <span className="text-white/60 font-bold text-lg drop-shadow-md bg-black/20 px-4 py-1 rounded-full">X2</span>
                        </div>
                        
                        <div className="bg-[#111419] border border-white/5 rounded-xl p-4 min-h-[120px] shadow-inner">
                            <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-500 uppercase">
                                <span>Toplam Bahisler</span>
                                <div className="flex items-center gap-1 text-white bg-[#1a1e24] px-2 py-1 rounded-md">
                                    <img src={ASSETS.tanzanite} alt="Coin" className="h-3" />
                                    <span>{getBetAmount('red').toFixed(2)}</span>
                                </div>
                            </div>
                            {getBetAmount('red') > 0 ? (
                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#1a1e24] rounded flex items-center justify-center border border-red-500/30 text-white font-bold text-[10px]">Sen</div>
                                    </div>
                                    <span className="text-sm font-bold text-emerald-400">${getBetAmount('red').toFixed(2)}</span>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-600 text-center py-4">Henüz bahis yok</div>
                            )}
                        </div>
                    </div>

                    {/* GREEN BUTTON */}
                    <div className="flex-1 flex flex-col group cursor-pointer" onClick={() => !isPlaying && handleAddBet('green')}>
                        <div 
                            className={`relative w-full h-24 sm:h-28 mb-4 transition-all flex items-center justify-between px-6 sm:px-10 overflow-hidden rounded-[20px] shadow-lg ${isPlaying ? 'opacity-50' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                            style={{ backgroundImage: `url(${ASSETS.btnGreen})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            <span className="text-white font-black text-2xl drop-shadow-md">Yeşil</span>
                            <span className="text-white/60 font-bold text-lg drop-shadow-md bg-black/20 px-4 py-1 rounded-full">X100</span>
                        </div>
                        
                        <div className="bg-[#111419] border border-white/5 rounded-xl p-4 min-h-[120px] shadow-inner">
                            <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-500 uppercase">
                                <span>Toplam Bahisler</span>
                                <div className="flex items-center gap-1 text-white bg-[#1a1e24] px-2 py-1 rounded-md">
                                    <img src={ASSETS.tanzanite} alt="Coin" className="h-3" />
                                    <span>{getBetAmount('green').toFixed(2)}</span>
                                </div>
                            </div>
                            {getBetAmount('green') > 0 ? (
                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#1a1e24] rounded flex items-center justify-center border border-green-500/30 text-white font-bold text-[10px]">Sen</div>
                                    </div>
                                    <span className="text-sm font-bold text-emerald-400">${getBetAmount('green').toFixed(2)}</span>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-600 text-center py-4">Henüz bahis yok</div>
                            )}
                        </div>
                    </div>

                    {/* BLACK (GREY) BUTTON */}
                    <div className="flex-1 flex flex-col group cursor-pointer" onClick={() => !isPlaying && handleAddBet('black')}>
                        <div 
                            className={`relative w-full h-24 sm:h-28 mb-4 transition-all flex items-center justify-between px-6 sm:px-10 overflow-hidden rounded-[20px] shadow-lg ${isPlaying ? 'opacity-50' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                            style={{ backgroundImage: `url(${ASSETS.btnGrey})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            <span className="text-white font-black text-2xl drop-shadow-md">Siyah</span>
                            <span className="text-white/60 font-bold text-lg drop-shadow-md bg-black/20 px-4 py-1 rounded-full">X2</span>
                        </div>
                        
                        <div className="bg-[#111419] border border-white/5 rounded-xl p-4 min-h-[120px] shadow-inner">
                            <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-500 uppercase">
                                <span>Toplam Bahisler</span>
                                <div className="flex items-center gap-1 text-white bg-[#1a1e24] px-2 py-1 rounded-md">
                                    <img src={ASSETS.tanzanite} alt="Coin" className="h-3" />
                                    <span>{getBetAmount('black').toFixed(2)}</span>
                                </div>
                            </div>
                            {getBetAmount('black') > 0 ? (
                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#1a1e24] rounded flex items-center justify-center border border-gray-500/30 text-white font-bold text-[10px]">Sen</div>
                                    </div>
                                    <span className="text-sm font-bold text-emerald-400">${getBetAmount('black').toFixed(2)}</span>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-600 text-center py-4">Henüz bahis yok</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* WIN/LOSS Overlay */}
                {winningColor && !isPlaying && (
                    <div className="fixed top-[30%] left-1/2 -translate-x-1/2 z-50 animate-pop-in pointer-events-none">
                        {winAmount !== null && winAmount > 0 ? (
                            <div className="bg-[#171a21]/95 text-emerald-400 font-black px-16 py-8 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.2)] border-2 border-emerald-500/50 text-center flex flex-col items-center backdrop-blur-sm">
                                <span className="text-sm uppercase tracking-[0.2em] mb-2 text-gray-400">Kazandın</span>
                                <span className="text-6xl drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">+${winAmount.toFixed(2)}</span>
                            </div>
                        ) : (
                            <div className="bg-[#171a21]/95 text-rose-500 font-black px-16 py-8 rounded-2xl shadow-[0_20px_50px_rgba(225,29,72,0.2)] border-2 border-rose-500/50 text-center flex flex-col items-center backdrop-blur-sm">
                                <span className="text-sm uppercase tracking-[0.2em] mb-2 text-gray-400">Kaybettin</span>
                                <span className="text-2xl uppercase">Sonuç: {winningColor === 'red' ? 'Kırmızı' : winningColor === 'green' ? 'Yeşil' : 'Siyah'}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Play Button fixed at bottom right */}
            {!isPlaying && (
                <div className="fixed bottom-8 right-8 z-40">
                    <button 
                        onClick={handlePlay}
                        className="bg-emerald-500 text-[#0f1215] font-black text-lg uppercase tracking-wider px-10 py-4 rounded-xl shadow-[0_5px_20px_rgba(16,185,129,0.4)] hover:-translate-y-1 hover:bg-emerald-400 active:translate-y-1 transition-all"
                    >
                        Bahis Yap
                    </button>
                </div>
            )}
        </div>
    );
}
