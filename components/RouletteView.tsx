import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { Coins } from 'lucide-react';

type BetColor = 'red' | 'green' | 'black';
type GameState = 'betting' | 'spinning' | 'result';

interface PlacedBet {
    type: BetColor;
    amount: number;
}

const BRICK_WIDTH = 100;
const TOTAL_BRICKS = 100;

const ASSETS = {
    btnGrey: 'https://gamdom.com/build/button_grey.d7429b7c0b343420ecdf.svg',
    btnGreen: 'https://gamdom.com/build/button_green.b6e9423030cfd2900b9f.svg',
    btnRed: 'https://gamdom.com/build/button_red.110dc09da36213520a99.svg',
    brickGreen: 'https://gamdom.com/build/brick_green.633d32a97d.500.webp',
    brickGrey: 'https://gamdom.com/build/brick_grey.613ecdb6fc.500.webp',
    brickRed: 'https://gamdom.com/build/brick_red.c0aaf93b01.500.webp',
    tanzanite: 'https://gamdom.com/static/img/tanzanite.svg',
    chest: 'https://gamdom.com/static/img/chest.png', // Fallback or placeholder for the chest
};

interface BrickData {
    color: BetColor;
    number: number;
    id: string;
}

// Generate an alternating reel according to Gamdom pattern
const generateReel = (): BrickData[] => {
    const reel: BrickData[] = [];
    let redCounter = 1;
    let blackCounter = 99;

    for (let i = 0; i < TOTAL_BRICKS; i++) {
        let color: BetColor = 'black';
        let num = 0;

        // Force a green every once in a while, e.g. at index 50, but usually alternate
        if (i === 50 || (Math.random() < 0.01 && i > 10 && i < 80)) {
            color = 'green';
            num = 0;
        } else if (i % 2 === 0) {
            color = 'red';
            num = redCounter;
            redCounter = (redCounter % 50) + 1;
        } else {
            color = 'black';
            num = blackCounter;
            blackCounter = blackCounter === 51 ? 99 : blackCounter - 1;
        }

        reel.push({ color, number: num, id: `brick_${i}_${Math.random()}` });
    }
    return reel;
};

// Mock history
const INITIAL_HISTORY: BetColor[] = ['black', 'red', 'black', 'black', 'black', 'red', 'red', 'black', 'red', 'black'];

export default function RouletteView({ siteUser, onAuthRequired }: any) {
    const { playInstantGame, isFunMode, demoBalance, setDemoBalance } = useUser();
    const [betAmount, setBetAmount] = useState<number>(1);
    const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);
    
    // Global Loop State
    const [gameState, setGameState] = useState<GameState>('betting');
    const [timeLeft, setTimeLeft] = useState<number>(15000); // 15s betting phase
    const [isSpinning, setIsSpinning] = useState(false);
    
    const [reel, setReel] = useState<BrickData[]>(generateReel());
    const [slideOffset, setSlideOffset] = useState<number>(-550);
    const [winningColor, setWinningColor] = useState<BetColor | null>(null);
    const [winAmount, setWinAmount] = useState<number | null>(null);

    const [history, setHistory] = useState<BetColor[]>(INITIAL_HISTORY);

    const totalBetAmount = placedBets.reduce((sum, bet) => sum + bet.amount, 0);

    // -- TIMER LOOP --
    useEffect(() => {
        if (gameState !== 'betting') return;
        
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 100) {
                    clearInterval(interval);
                    setGameState('spinning');
                    return 0;
                }
                return prev - 100;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [gameState]);

    // -- PHASE HANDLER --
    useEffect(() => {
        if (gameState === 'spinning') {
            runGameLogic();
        }
    }, [gameState]);

    const handleAddBet = (type: BetColor) => {
        if (gameState !== 'betting') return alert('Bahis süresi doldu!');
        if (!isFunMode && !siteUser) {
            onAuthRequired();
            return;
        }
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
        if (gameState !== 'betting') return;
        setPlacedBets([]);
    };

    const getBetAmount = (type: BetColor) => {
        const bet = placedBets.find(b => b.type === type);
        return bet ? bet.amount : 0;
    };

    const runGameLogic = async () => {
        const currentBets = [...placedBets];
        const betTotal = currentBets.reduce((sum, bet) => sum + bet.amount, 0);
        
        setWinningColor(null);
        setWinAmount(null);
        const newReel = generateReel();

        try {
            let winResult: BetColor = 'black';
            let totalPayout: number = 0;

            if (isFunMode) {
                if (betTotal > 0) setDemoBalance(prev => prev - betTotal);
                
                const rand = Math.random();
                if (rand < 0.05) winResult = 'green';
                else if (rand < 0.525) winResult = 'red';
                else winResult = 'black';
                
                if (betTotal > 0) {
                    currentBets.forEach(bet => {
                        if (bet.type === winResult) {
                            if (winResult === 'green') totalPayout += bet.amount * 100;
                            else totalPayout += bet.amount * 2;
                        }
                    });
                }
            } else {
                if (betTotal > 0) {
                    const betPayloads = currentBets.map(bet => ({ type: 'color', value: bet.type, amount: bet.amount }));
                    const data = await playInstantGame(betTotal, 'Roulette', 0, 'none', { bets: betPayloads });
                    winResult = data.result.color || (data.result.number === 0 ? 'green' : (data.result.number % 2 === 0 ? 'black' : 'red'));
                    totalPayout = data.win_amount;
                } else {
                    const rand = Math.random();
                    if (rand < 0.05) winResult = 'green';
                    else if (rand < 0.525) winResult = 'red';
                    else winResult = 'black';
                }
            }

            // Target brick position
            newReel[90] = { color: winResult, number: winResult === 'green' ? 0 : (winResult === 'red' ? Math.floor(Math.random() * 50) + 1 : Math.floor(Math.random() * 49) + 51), id: 'winning_brick' };
            setReel(newReel);

            const itemWidth = BRICK_WIDTH;
            const targetIndex = 90;
            const startIndex = 5;
            
            const randomOffset = Math.floor(Math.random() * (itemWidth - 20)) - (itemWidth - 20)/2;
            const stopPosition = - (targetIndex * itemWidth) - (itemWidth / 2) + randomOffset;
            const startPosition = - (startIndex * itemWidth) - (itemWidth / 2);
            
            // Reset to start instantly
            setIsSpinning(false);
            setSlideOffset(startPosition);
            
            setTimeout(() => {
                // Spin to target
                setIsSpinning(true);
                setSlideOffset(stopPosition);
            }, 50);

            // Wait for 7s animation to finish
            setTimeout(() => {
                setGameState('result');
                setWinningColor(winResult);
                
                // Add to history
                setHistory(prev => {
                    const newHistory = [...prev, winResult];
                    if (newHistory.length > 10) newHistory.shift();
                    return newHistory;
                });

                if (betTotal > 0) {
                    setWinAmount(totalPayout);
                    if (isFunMode && totalPayout > 0) {
                        setDemoBalance(prev => prev + totalPayout);
                    }
                }

                // Show result for 4 seconds, then restart
                setTimeout(() => {
                    setGameState('betting');
                    setTimeLeft(15000);
                    setPlacedBets([]);
                    // Silently reset the slider back to start
                    setIsSpinning(false);
                    setSlideOffset(startPosition);
                }, 4000);
                
            }, 7050);
            
        } catch (e: any) {
            console.error("Game error:", e);
            // If error, just restart the loop safely
            setGameState('betting');
            setTimeLeft(15000);
            setPlacedBets([]);
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-[#111419] text-white font-sans overflow-y-auto">
            
            {/* Top Bar removed as requested */}

            <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto p-4 md:p-8">
                
                {/* ── HISTORY & STATS BAR ── */}
                <div className="w-full flex justify-between items-center mb-6">
                    {/* Left: Chest / Bonus */}
                    <div className="flex items-center gap-2 bg-[#171a21] border border-white/10 px-3 py-1.5 rounded-full shadow-lg">
                        <span className="text-xl">🎁</span>
                        <span className="font-bold text-sm text-white">$5,763.43</span>
                    </div>
                    
                    {/* Center: History Hexagons */}
                    <div className="flex items-center gap-1.5 bg-[#0a0c10]/50 p-2 rounded-full border border-white/5">
                        {history.map((color, i) => (
                            <div 
                                key={i} 
                                className={`w-5 h-5 rounded-full shadow-inner ${color === 'red' ? 'bg-red-500' : (color === 'green' ? 'bg-green-500' : 'bg-gray-500')}`}
                            ></div>
                        ))}
                    </div>

                    {/* Right: Last 100 Stats */}
                    <div className="flex items-center gap-4 bg-[#171a21] border border-white/10 px-4 py-1.5 rounded-full shadow-lg text-sm font-bold">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500"></div>48</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-green-500"></div>2</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-gray-500"></div>50</div>
                    </div>
                </div>

                {/* ── REEL CONTAINER ── */}
                <div className="w-full relative h-[180px] bg-[#0a0c10] rounded-xl overflow-hidden border border-white/5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] mb-4 flex items-center justify-center">
                    
                    {/* Dark gradient edges */}
                    <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#0a0c10] to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#0a0c10] to-transparent z-10 pointer-events-none"></div>

                    {/* The Center Line indicator */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white z-30 shadow-[0_0_15px_white]"></div>

                    {/* The sliding track */}
                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 h-[120px] w-[5000px] pointer-events-none">
                        <div 
                            className="absolute top-0 left-0 h-full flex items-center"
                            style={{
                                transform: `translateX(${slideOffset}px)`,
                                transition: isSpinning ? 'transform 7s cubic-bezier(0.1, 0.9, 0.2, 1)' : 'none',
                                willChange: 'transform'
                            }}
                        >
                            {reel.map((brick, idx) => (
                                <div key={brick.id} className="absolute top-0 flex items-center justify-center h-full" style={{ width: `${BRICK_WIDTH}px`, left: `${idx * BRICK_WIDTH}px` }}>
                                    <div className="relative group w-full h-full flex items-center justify-center">
                                        <img 
                                            src={brick.color === 'red' ? ASSETS.brickRed : (brick.color === 'green' ? ASSETS.brickGreen : ASSETS.brickGrey)} 
                                            alt={brick.color} 
                                            className={`w-[85px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] ${gameState === 'result' && idx !== 90 ? 'opacity-30' : ''} transition-opacity duration-500`} 
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white/90 drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)]">
                                            {brick.number}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── PROGRESS BAR (Gamdom style) ── */}
                <div className="w-full h-6 flex items-center justify-center mb-10 relative">
                    <div className="w-full h-1 bg-[#222730] rounded-full overflow-hidden relative">
                        {gameState === 'betting' ? (
                            <div 
                                className="h-full bg-red-500" 
                                style={{ width: `${(timeLeft / 15000) * 100}%`, transition: 'width 0.1s linear' }}
                            ></div>
                        ) : (
                            <div className="h-full bg-[#222730]"></div>
                        )}
                    </div>
                    {/* Floating pill in center */}
                    <div className="absolute bg-[#2a303c] border border-white/10 px-6 py-1.5 rounded-full shadow-lg text-[10px] font-black text-gray-300 tracking-wider">
                        {gameState === 'betting' && `${(timeLeft / 1000).toFixed(2)} SANİYE`}
                        {gameState === 'spinning' && `DÖNÜYOR`}
                        {gameState === 'result' && `SONUÇ`}
                    </div>
                </div>

                {/* ── BET CONTROLS ── */}
                <div className={`w-full mb-8 flex flex-col items-center transition-opacity duration-300 ${gameState !== 'betting' ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="flex flex-wrap items-center gap-3 bg-[#171a21] p-3 rounded-xl border border-white/5 w-full shadow-xl">
                        
                        <div className="flex-1 flex bg-[#0f1215] rounded-lg border border-white/10 overflow-hidden min-w-[200px]">
                            <div className="px-4 flex items-center justify-center bg-white/5"><img src={ASSETS.tanzanite} alt="$" className="h-4" /></div>
                            <input 
                                type="number" 
                                value={betAmount}
                                onChange={(e) => setBetAmount(Number(e.target.value))}
                                placeholder="Tutar..."
                                className="flex-1 bg-transparent text-white font-bold text-sm py-3 px-2 outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2 shrink-0">
                            <button className="px-4 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#222730] shadow-inner" onClick={() => handleClearBets()}>Temizle</button>
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#222730] shadow-inner" onClick={() => setBetAmount(prev => prev + 10)}>+$10</button>
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#222730] shadow-inner" onClick={() => setBetAmount(prev => prev + 50)}>+$50</button>
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#222730] shadow-inner" onClick={() => setBetAmount(prev => prev + 100)}>+$100</button>
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#222730] shadow-inner" onClick={() => setBetAmount(prev => Math.max(1, prev / 2))}>1/2</button>
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#222730] shadow-inner" onClick={() => setBetAmount(prev => prev * 2)}>x2</button>
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#222730] shadow-inner" onClick={() => setBetAmount(isFunMode ? demoBalance : (siteUser?.balance || 0))}>Max</button>
                            <button className="px-4 py-3 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 rounded-lg transition-colors border border-emerald-500/20 ml-2">
                                + Otomatik bahis
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── BETTING BUTTONS ── */}
                <div className="w-full flex flex-col md:flex-row gap-6 mb-12 items-stretch max-w-6xl mx-auto">
                    
                    {/* RED BUTTON */}
                    <div className="flex-1 flex flex-col group cursor-pointer" onClick={() => handleAddBet('red')}>
                        <div 
                            className={`relative w-full h-20 sm:h-24 mb-4 transition-all flex items-center justify-between px-6 sm:px-10 overflow-hidden rounded-xl shadow-lg ${gameState !== 'betting' ? 'opacity-50' : 'hover:-translate-y-1 active:translate-y-0'}`}
                            style={{ backgroundImage: `url(${ASSETS.btnRed})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            <span className="text-white font-black text-2xl drop-shadow-md">Kırmızı</span>
                            <span className="text-white/60 font-bold text-lg drop-shadow-md bg-black/20 px-4 py-1 rounded-full">X2</span>
                        </div>
                        
                        <div className="bg-[#171a21] border border-white/5 rounded-xl p-4 min-h-[120px] shadow-inner">
                            <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-500 uppercase">
                                <span>Toplam Bahisler</span>
                                <div className="flex items-center gap-1 text-white bg-[#0f1215] px-2 py-1 rounded-md">
                                    <img src={ASSETS.tanzanite} alt="Coin" className="h-3" />
                                    <span>{getBetAmount('red').toFixed(2)}</span>
                                </div>
                            </div>
                            {getBetAmount('red') > 0 ? (
                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#0f1215] rounded flex items-center justify-center border border-red-500/30 text-white font-bold text-[10px]">Sen</div>
                                    </div>
                                    <span className="text-sm font-bold text-emerald-400">${getBetAmount('red').toFixed(2)}</span>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-600 text-center py-4">Henüz bahis yok</div>
                            )}
                        </div>
                    </div>

                    {/* GREEN BUTTON */}
                    <div className="flex-1 flex flex-col group cursor-pointer" onClick={() => handleAddBet('green')}>
                        <div 
                            className={`relative w-full h-20 sm:h-24 mb-4 transition-all flex items-center justify-between px-6 sm:px-10 overflow-hidden rounded-xl shadow-lg ${gameState !== 'betting' ? 'opacity-50' : 'hover:-translate-y-1 active:translate-y-0'}`}
                            style={{ backgroundImage: `url(${ASSETS.btnGreen})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            <span className="text-white font-black text-2xl drop-shadow-md">Yeşil</span>
                            <span className="text-white/60 font-bold text-lg drop-shadow-md bg-black/20 px-4 py-1 rounded-full">X100</span>
                        </div>
                        
                        <div className="bg-[#171a21] border border-white/5 rounded-xl p-4 min-h-[120px] shadow-inner">
                            <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-500 uppercase">
                                <span>Toplam Bahisler</span>
                                <div className="flex items-center gap-1 text-white bg-[#0f1215] px-2 py-1 rounded-md">
                                    <img src={ASSETS.tanzanite} alt="Coin" className="h-3" />
                                    <span>{getBetAmount('green').toFixed(2)}</span>
                                </div>
                            </div>
                            {getBetAmount('green') > 0 ? (
                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#0f1215] rounded flex items-center justify-center border border-green-500/30 text-white font-bold text-[10px]">Sen</div>
                                    </div>
                                    <span className="text-sm font-bold text-emerald-400">${getBetAmount('green').toFixed(2)}</span>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-600 text-center py-4">Henüz bahis yok</div>
                            )}
                        </div>
                    </div>

                    {/* BLACK (GREY) BUTTON */}
                    <div className="flex-1 flex flex-col group cursor-pointer" onClick={() => handleAddBet('black')}>
                        <div 
                            className={`relative w-full h-20 sm:h-24 mb-4 transition-all flex items-center justify-between px-6 sm:px-10 overflow-hidden rounded-xl shadow-lg ${gameState !== 'betting' ? 'opacity-50' : 'hover:-translate-y-1 active:translate-y-0'}`}
                            style={{ backgroundImage: `url(${ASSETS.btnGrey})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            <span className="text-white font-black text-2xl drop-shadow-md">Siyah</span>
                            <span className="text-white/60 font-bold text-lg drop-shadow-md bg-black/20 px-4 py-1 rounded-full">X2</span>
                        </div>
                        
                        <div className="bg-[#171a21] border border-white/5 rounded-xl p-4 min-h-[120px] shadow-inner">
                            <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-500 uppercase">
                                <span>Toplam Bahisler</span>
                                <div className="flex items-center gap-1 text-white bg-[#0f1215] px-2 py-1 rounded-md">
                                    <img src={ASSETS.tanzanite} alt="Coin" className="h-3" />
                                    <span>{getBetAmount('black').toFixed(2)}</span>
                                </div>
                            </div>
                            {getBetAmount('black') > 0 ? (
                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#0f1215] rounded flex items-center justify-center border border-gray-500/30 text-white font-bold text-[10px]">Sen</div>
                                    </div>
                                    <span className="text-sm font-bold text-emerald-400">${getBetAmount('black').toFixed(2)}</span>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-600 text-center py-4">Henüz bahis yok</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── GAMECHECK & TRUSTPILOT BOTTOM AREA ── */}
                <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 mt-12 py-8 border-t border-white/5">
                    <div className="flex items-center gap-2 px-6 py-2 rounded-full border border-green-900/50 bg-[#0a0c10] opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center">
                            <span className="text-green-500 font-bold text-xl">✓</span>
                        </div>
                        <span className="font-black text-gray-400 tracking-wider text-sm">GAME<span className="text-gray-600">CHECK</span></span>
                    </div>
                    <div className="flex items-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                        <img src="https://gamdom.com/static/img/trustpilot-logo.svg" alt="Trustpilot" className="h-6" />
                    </div>
                </div>

                {/* WIN/LOSS Overlay */}
                {gameState === 'result' && winAmount !== null && (
                    <div className="fixed top-[30%] left-1/2 -translate-x-1/2 z-50 animate-pop-in pointer-events-none">
                        {winAmount > 0 ? (
                            <div className="bg-[#0f1215]/95 text-emerald-400 font-black px-16 py-8 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] border-2 border-emerald-500/50 text-center flex flex-col items-center backdrop-blur-sm">
                                <span className="text-sm uppercase tracking-[0.2em] mb-2 text-gray-400">Kazandın</span>
                                <span className="text-6xl drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">+${winAmount.toFixed(2)}</span>
                            </div>
                        ) : (
                            <div className="bg-[#0f1215]/95 text-rose-500 font-black px-16 py-8 rounded-2xl shadow-[0_20px_50px_rgba(225,29,72,0.3)] border-2 border-rose-500/50 text-center flex flex-col items-center backdrop-blur-sm">
                                <span className="text-sm uppercase tracking-[0.2em] mb-2 text-gray-400">Kaybettin</span>
                                <span className="text-2xl uppercase">Sonuç: {winningColor === 'red' ? 'Kırmızı' : winningColor === 'green' ? 'Yeşil' : 'Siyah'}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
