import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { Coins, User, ChevronDown, X } from 'lucide-react';

type BetColor = 'red' | 'green' | 'black';
type GameState = 'betting' | 'spinning' | 'result';

interface PlacedBet {
    type: BetColor;
    amount: number;
}

interface FakeBet {
    id: string;
    name: string;
    amount: number;
    color: BetColor;
}

const BRICK_WIDTH = 100;
const TOTAL_BRICKS = 100;
const MAX_BET = 100;

const ASSETS = {
    btnGrey: 'https://gamdom.com/build/button_grey.d7429b7c0b343420ecdf.svg',
    btnGreen: 'https://gamdom.com/build/button_green.b6e9423030cfd2900b9f.svg',
    btnRed: 'https://gamdom.com/build/button_red.110dc09da36213520a99.svg',
    brickGreen: 'https://gamdom.com/build/brick_green.633d32a97d.500.webp',
    brickGrey: 'https://gamdom.com/build/brick_grey.613ecdb6fc.500.webp',
    brickRed: 'https://gamdom.com/build/brick_red.c0aaf93b01.500.webp',
    tanzanite: 'https://gamdom.com/static/img/tanzanite.svg',
    jackpotIcon: 'https://gamdom.com/static/img/jackpot-icon.png',
    amountPlaceholder: 'https://gamdom.com/build/amount_placeholder.c7bcbdbbf5.500.webp',
};

const FAKE_NAMES = ['tenshi 13', 'Hidden user', 'PrimeMinister', 'Alex99', 'CryptoKing', 'LuckyGuy', 'Anon', 'GamerX', 'BetMaster', 'Whale99'];

interface BrickData {
    color: BetColor;
    number: number;
    id: string;
}

const generateReel = (): BrickData[] => {
    const reel: BrickData[] = [];
    let redCounter = 1;
    let blackCounter = 99;

    for (let i = 0; i < TOTAL_BRICKS; i++) {
        let color: BetColor = 'black';
        let num = 0;

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

const INITIAL_HISTORY: BetColor[] = ['black', 'red', 'black', 'black', 'black', 'red', 'red', 'black', 'red', 'black'];

type ActionType = 'Return to Base' | 'Double';

export default function RouletteView({ siteUser, onAuthRequired }: any) {
    const { playInstantGame, isFunMode, demoBalance, setDemoBalance } = useUser();
    const [betAmount, setBetAmount] = useState<number>(1);
    const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);
    const [fakeBets, setFakeBets] = useState<FakeBet[]>([]);
    
    // Auto Bet UI State
    const [isAutoBetOpen, setIsAutoBetOpen] = useState(false);
    
    // --- AUTO BET LOGIC STATES ---
    const [autoBetIsActive, setAutoBetIsActive] = useState(false);
    const [autoBetBaseAmount, setAutoBetBaseAmount] = useState<number>(1);
    const [autoBetCurrentAmount, setAutoBetCurrentAmount] = useState<number>(1);
    const [autoBetRed, setAutoBetRed] = useState(false);
    const [autoBetGreen, setAutoBetGreen] = useState(false);
    const [autoBetBlack, setAutoBetBlack] = useState(false);
    const [autoBetOnWin, setAutoBetOnWin] = useState<ActionType>('Return to Base');
    const [autoBetOnLoss, setAutoBetOnLoss] = useState<ActionType>('Return to Base');
    const [autoBetStopBelow, setAutoBetStopBelow] = useState<string>('');
    const [autoBetStopAbove, setAutoBetStopAbove] = useState<string>('');
    
    // ADVANCED AUTO BET STATES
    const [advIsActive, setAdvIsActive] = useState(false);
    const [advOnlyColorBet, setAdvOnlyColorBet] = useState(true);
    const [advColorNotCome, setAdvColorNotCome] = useState<BetColor>('red');
    const [advConsecutiveGames, setAdvConsecutiveGames] = useState<number>(3);
    
    // GREEN HUNT STATES
    const [greenHuntIsActive, setGreenHuntIsActive] = useState(false);
    const [greenHuntAmount, setGreenHuntAmount] = useState<number>(10); // 10%
    const [greenHuntType, setGreenHuntType] = useState<'Percentage'>('Percentage');
    
    // Dropdown toggles
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Global Loop State
    const [gameState, setGameState] = useState<GameState>('betting');
    const [timeLeft, setTimeLeft] = useState<number>(15000);
    const [isSpinning, setIsSpinning] = useState(false);
    
    const [reel, setReel] = useState<BrickData[]>(generateReel());
    const [slideOffset, setSlideOffset] = useState<number>(-550);
    const [winningColor, setWinningColor] = useState<BetColor | null>(null);
    const [winAmount, setWinAmount] = useState<number | null>(null);
    
    const [jackpot, setJackpot] = useState<number>(1045.67);
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

    // -- FAKE PLAYERS & JACKPOT LOOP --
    useEffect(() => {
        if (gameState !== 'betting') return;
        
        const fakeBetInterval = setInterval(() => {
            if (Math.random() > 0.3) {
                const colors: BetColor[] = ['red', 'black', 'green', 'red', 'black'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const randomName = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
                const randomAmount = randomColor === 'green' ? Number((Math.random() * 5).toFixed(2)) : Number((Math.random() * 50 + 1).toFixed(2));
                
                setFakeBets(prev => [{ id: Math.random().toString(), name: randomName, amount: randomAmount, color: randomColor }, ...prev].slice(0, 50));
            }
            
            if (Math.random() > 0.8) {
                setJackpot(prev => prev + (Math.random() * 0.5));
            }
        }, 600);

        return () => clearInterval(fakeBetInterval);
    }, [gameState]);

    // -- PHASE HANDLER --
    useEffect(() => {
        if (gameState === 'spinning') {
            runGameLogic();
        }
    }, [gameState]);

    // -- AUTO BET EXECUTION --
    useEffect(() => {
        if (gameState !== 'betting') return;
        
        const executeAutoBets = () => {
            const currentBalance = isFunMode ? demoBalance : (siteUser?.balance || 0);
            const betsToPlace: { type: BetColor, amount: number }[] = [];
            let stopAutoBet = false;
            let stopReason = '';

            // Section 1: Regular Auto Bet
            if (autoBetIsActive) {
                if (autoBetStopBelow !== '' && currentBalance < Number(autoBetStopBelow)) {
                    stopAutoBet = true;
                    stopReason = `Bakiye limitin altına düştü ($${autoBetStopBelow})`;
                }
                if (autoBetStopAbove !== '' && currentBalance > Number(autoBetStopAbove)) {
                    stopAutoBet = true;
                    stopReason = `Bakiye limitin üstüne çıktı ($${autoBetStopAbove})`;
                }

                if (stopAutoBet) {
                    setAutoBetIsActive(false);
                    // Minimalist non-blocking alert
                    console.log(`Auto Bet Stopped: ${stopReason}`);
                } else {
                    if (autoBetRed) betsToPlace.push({ type: 'red', amount: autoBetCurrentAmount });
                    if (autoBetGreen) betsToPlace.push({ type: 'green', amount: autoBetCurrentAmount });
                    if (autoBetBlack) betsToPlace.push({ type: 'black', amount: autoBetCurrentAmount });
                }
            }

            // Section 2: Advanced Auto Bet
            if (advIsActive) {
                let notCameCount = 0;
                for (let i = history.length - 1; i >= 0; i--) {
                    if (history[i] === advColorNotCome) break;
                    notCameCount++;
                }
                
                if (notCameCount >= advConsecutiveGames) {
                    betsToPlace.push({ type: advColorNotCome, amount: autoBetBaseAmount });
                }
            }

            // Merge and apply
            const finalBets: Record<BetColor, number> = { red: 0, green: 0, black: 0 };
            betsToPlace.forEach(b => finalBets[b.type] += b.amount);
            
            Object.keys(finalBets).forEach(color => {
                const amount = finalBets[color as BetColor];
                if (amount > 0) {
                    handleAddBet(color as BetColor, amount, true);
                }
            });
        };
        
        // Execute slightly after phase start to let UI settle
        const timer = setTimeout(() => executeAutoBets(), 500);
        return () => clearTimeout(timer);
    }, [gameState]);


    const handleAddBet = (type: BetColor, amountOverride?: number, isAuto: boolean = false) => {
        if (gameState !== 'betting') return alert('Bahis süresi doldu!');
        if (!isFunMode && !siteUser) {
            onAuthRequired();
            return;
        }
        
        const amountToAdd = amountOverride || betAmount;
        if (amountToAdd <= 0) return alert('Geçerli bir bahis tutarı girin.');
        
        if (totalBetAmount + amountToAdd > MAX_BET) {
            if (!isAuto) alert(`Bir turda maksimum bahis tutarı $${MAX_BET} olabilir.`);
            return;
        }

        if (isFunMode && (totalBetAmount + amountToAdd) > demoBalance) {
            if (!isAuto) alert('Yetersiz demo bakiye.');
            return;
        }
        
        // Green Hunt calculation
        let greenHuntAddition = 0;
        if (greenHuntIsActive && (type === 'red' || type === 'black')) {
            greenHuntAddition = amountToAdd * (greenHuntAmount / 100);
        }
        
        setPlacedBets(prev => {
            const newBets = [...prev];
            
            // Add primary
            const existingIndex = newBets.findIndex(b => b.type === type);
            if (existingIndex >= 0) newBets[existingIndex].amount += amountToAdd;
            else newBets.push({ type, amount: amountToAdd });
            
            // Add Green Hunt
            if (greenHuntAddition > 0 && type !== 'green') {
                const gIndex = newBets.findIndex(b => b.type === 'green');
                if (gIndex >= 0) newBets[gIndex].amount += greenHuntAddition;
                else newBets.push({ type: 'green', amount: greenHuntAddition });
            }
            
            return newBets;
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

    const getColumnTotal = (type: BetColor) => {
        const userBet = getBetAmount(type);
        const fakeTotal = fakeBets.filter(b => b.color === type).reduce((sum, b) => sum + b.amount, 0);
        return userBet + fakeTotal;
    };

    const getColumnCount = (type: BetColor) => {
        const userBetCount = getBetAmount(type) > 0 ? 1 : 0;
        const fakeCount = fakeBets.filter(b => b.color === type).length;
        return userBetCount + fakeCount;
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
            
            // Remove random offset so it stops perfectly in the center
            const randomOffset = 0;
            const stopPosition = - (targetIndex * itemWidth) - (itemWidth / 2) + randomOffset;
            const startPosition = - (startIndex * itemWidth) - (itemWidth / 2);
            
            setIsSpinning(false);
            setSlideOffset(startPosition);
            
            setTimeout(() => {
                setIsSpinning(true);
                setSlideOffset(stopPosition);
            }, 50);

            setTimeout(() => {
                setGameState('result');
                setWinningColor(winResult);
                
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
                
                // MULTIPLIER LOGIC FOR AUTO BETS
                if (autoBetIsActive) {
                    const hitRed = autoBetRed && winResult === 'red';
                    const hitGreen = autoBetGreen && winResult === 'green';
                    const hitBlack = autoBetBlack && winResult === 'black';
                    const didWin = hitRed || hitGreen || hitBlack;
                    
                    if (didWin) {
                        if (autoBetOnWin === 'Double') setAutoBetCurrentAmount(prev => Math.min(prev * 2, MAX_BET));
                        else setAutoBetCurrentAmount(autoBetBaseAmount);
                    } else {
                        if (autoBetOnLoss === 'Double') setAutoBetCurrentAmount(prev => Math.min(prev * 2, MAX_BET));
                        else setAutoBetCurrentAmount(autoBetBaseAmount);
                    }
                }

                setTimeout(() => {
                    setGameState('betting');
                    setTimeLeft(15000);
                    setPlacedBets([]);
                    setFakeBets([]);
                    setIsSpinning(false);
                    setSlideOffset(startPosition);
                }, 4000);
                
            }, 7050);
            
        } catch (e: any) {
            console.error("Game error:", e);
            setGameState('betting');
            setTimeLeft(15000);
            setPlacedBets([]);
            setFakeBets([]);
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-[#111419] text-white font-sans overflow-y-auto">
            
            <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-4 md:p-8">
                
                {/* ── HISTORY & STATS BAR ── */}
                <div className="w-full flex justify-between items-center mb-6 pl-4">
                    {/* Left: Jackpot Chest */}
                    <div className="relative flex items-center h-10 min-w-[140px] cursor-pointer hover:brightness-110 transition-all group">
                        <div 
                            className="absolute right-0 h-[40px] w-full rounded-lg shadow-lg"
                            style={{ backgroundImage: `url(${ASSETS.amountPlaceholder})`, backgroundSize: '100% 100%', backgroundPosition: 'center' }}
                        ></div>
                        <div className="relative z-10 w-full text-center pl-6 pr-2 font-black text-white text-[15px] drop-shadow-md">
                            ${jackpot.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </div>
                        <img 
                            src={ASSETS.jackpotIcon} 
                            alt="Jackpot"
                            className="absolute left-[-20px] top-1/2 -translate-y-1/2 h-14 z-20 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" 
                        />
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
                    
                    <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#0a0c10] to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#0a0c10] to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white z-30 shadow-[0_0_15px_white]"></div>

                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 h-[120px] w-[10000px] pointer-events-none">
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

                {/* ── PROGRESS BAR ── */}
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
                    <div className="absolute bg-[#2a303c] border border-white/10 px-6 py-1.5 rounded-full shadow-lg text-[10px] font-black text-gray-300 tracking-wider">
                        {gameState === 'betting' && `${(timeLeft / 1000).toFixed(2)} SANİYE`}
                        {gameState === 'spinning' && `DÖNÜYOR`}
                        {gameState === 'result' && `SONUÇ`}
                    </div>
                </div>

                {/* ── BET CONTROLS ── */}
                <div className={`w-full mb-6 flex flex-col items-center transition-opacity duration-300 ${gameState !== 'betting' ? 'opacity-40 pointer-events-none' : ''}`}>
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
                            <button className="px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-[#222730] shadow-inner" onClick={() => {
                                const bal = isFunMode ? demoBalance : (siteUser?.balance || 0);
                                setBetAmount(Math.min(bal, MAX_BET));
                            }}>Max</button>
                            <button 
                                className={`px-4 py-3 text-xs font-bold rounded-lg transition-colors border ml-2 flex items-center gap-2 ${isAutoBetOpen ? 'text-gray-300 bg-[#222730] border-white/10 hover:bg-white/10' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:text-emerald-300'}`}
                                onClick={() => setIsAutoBetOpen(!isAutoBetOpen)}
                            >
                                <span>{isAutoBetOpen ? '-' : '+'}</span>
                                Otomatik bahis
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── AUTO BET PANEL ── */}
                {isAutoBetOpen && (
                    <div className="w-full flex flex-col md:flex-row gap-6 mb-8 animate-pop-in">
                        
                        {/* Section 1: Otomatik Rulet Bahsi */}
                        <div className="flex-1 bg-[#171a21] rounded-xl border border-white/5 p-5 shadow-lg flex flex-col relative z-20">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-sm text-white">Otomatik Rulet Bahsi</h3>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-md ${autoBetIsActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                                        {autoBetIsActive ? 'AKTİF' : 'AKTİF DEĞİL'}
                                    </span>
                                    <div 
                                        className={`w-8 h-4.5 rounded-full relative cursor-pointer ${autoBetIsActive ? 'bg-emerald-500' : 'bg-gray-600'}`}
                                        onClick={() => { setAutoBetIsActive(!autoBetIsActive); setAutoBetCurrentAmount(autoBetBaseAmount); }}
                                    >
                                        <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-all ${autoBetIsActive ? 'right-0.5' : 'left-0.5'}`}></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 mb-4">
                                <div className="flex-1 flex bg-[#0f1215] rounded-lg border border-white/10 overflow-hidden">
                                    <div className="px-3 flex items-center justify-center bg-white/5"><img src={ASSETS.tanzanite} alt="$" className="h-3" /></div>
                                    <input 
                                        type="number" 
                                        value={autoBetBaseAmount} 
                                        onChange={(e) => { setAutoBetBaseAmount(Number(e.target.value)); setAutoBetCurrentAmount(Number(e.target.value)); }}
                                        className="flex-1 bg-transparent text-white font-bold text-sm py-2 px-2 outline-none" 
                                    />
                                </div>
                                <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white bg-[#222730] rounded-lg border border-white/5" onClick={() => setAutoBetBaseAmount(1)}>Temizle</button>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-6">
                                <div className="flex items-center gap-2 bg-[#0f1215] px-3 py-2 rounded-lg border border-white/5 cursor-pointer hover:border-white/20" onClick={() => setAutoBetRed(!autoBetRed)}>
                                    <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                                    <span className="text-xs font-medium text-gray-300">Kırmızı</span>
                                    <div className={`ml-2 w-7 h-4 rounded-full relative ${autoBetRed ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${autoBetRed ? 'right-0.5' : 'left-0.5'}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-[#0f1215] px-3 py-2 rounded-lg border border-white/5 cursor-pointer hover:border-white/20" onClick={() => setAutoBetGreen(!autoBetGreen)}>
                                    <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                                    <span className="text-xs font-medium text-gray-300">Yeşil</span>
                                    <div className={`ml-2 w-7 h-4 rounded-full relative ${autoBetGreen ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${autoBetGreen ? 'right-0.5' : 'left-0.5'}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-[#0f1215] px-3 py-2 rounded-lg border border-white/5 cursor-pointer hover:border-white/20" onClick={() => setAutoBetBlack(!autoBetBlack)}>
                                    <div className="w-3 h-3 rounded-sm bg-gray-500"></div>
                                    <span className="text-xs font-medium text-gray-300">Siyah</span>
                                    <div className={`ml-2 w-7 h-4 rounded-full relative ${autoBetBlack ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${autoBetBlack ? 'right-0.5' : 'left-0.5'}`}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 flex-1">
                                <div className="relative">
                                    <label className="text-xs text-gray-500 font-bold mb-1 block">Kazanınca</label>
                                    <div 
                                        className="bg-[#0f1215] rounded-lg border border-white/5 p-2.5 flex justify-between items-center cursor-pointer"
                                        onClick={() => setOpenDropdown(openDropdown === 'win' ? null : 'win')}
                                    >
                                        <span className="text-xs font-bold text-gray-300">{autoBetOnWin}</span>
                                        <ChevronDown size={14} className="text-gray-500" />
                                    </div>
                                    {openDropdown === 'win' && (
                                        <div className="absolute top-full left-0 w-full bg-[#0f1215] border border-white/10 rounded-lg mt-1 z-50 overflow-hidden shadow-xl">
                                            <div className="px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 cursor-pointer" onClick={() => { setAutoBetOnWin('Return to Base'); setOpenDropdown(null); }}>Return to Base</div>
                                            <div className="px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 cursor-pointer" onClick={() => { setAutoBetOnWin('Double'); setOpenDropdown(null); }}>Double</div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <label className="text-xs text-gray-500 font-bold mb-1 block">Kaybedince</label>
                                    <div 
                                        className="bg-[#0f1215] rounded-lg border border-white/5 p-2.5 flex justify-between items-center cursor-pointer"
                                        onClick={() => setOpenDropdown(openDropdown === 'loss' ? null : 'loss')}
                                    >
                                        <span className="text-xs font-bold text-gray-300">{autoBetOnLoss}</span>
                                        <ChevronDown size={14} className="text-gray-500" />
                                    </div>
                                    {openDropdown === 'loss' && (
                                        <div className="absolute top-full left-0 w-full bg-[#0f1215] border border-white/10 rounded-lg mt-1 z-50 overflow-hidden shadow-xl">
                                            <div className="px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 cursor-pointer" onClick={() => { setAutoBetOnLoss('Return to Base'); setOpenDropdown(null); }}>Return to Base</div>
                                            <div className="px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 cursor-pointer" onClick={() => { setAutoBetOnLoss('Double'); setOpenDropdown(null); }}>Double</div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] text-gray-500 font-bold mb-1 block">Bakiye altındaysa dur</label>
                                        <div className="flex bg-[#0f1215] rounded-lg border border-white/5 overflow-hidden">
                                            <div className="px-2 flex items-center justify-center bg-white/5"><img src={ASSETS.tanzanite} alt="$" className="h-3" /></div>
                                            <input type="number" value={autoBetStopBelow} onChange={(e) => setAutoBetStopBelow(e.target.value)} placeholder="0.00" className="flex-1 bg-transparent text-white font-bold text-xs py-2 px-2 outline-none" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] text-gray-500 font-bold mb-1 block">Bakiye üstündeyse dur</label>
                                        <div className="flex bg-[#0f1215] rounded-lg border border-white/5 overflow-hidden">
                                            <div className="px-2 flex items-center justify-center bg-white/5"><img src={ASSETS.tanzanite} alt="$" className="h-3" /></div>
                                            <input type="number" value={autoBetStopAbove} onChange={(e) => setAutoBetStopAbove(e.target.value)} placeholder="0.00" className="flex-1 bg-transparent text-white font-bold text-xs py-2 px-2 outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: İleri seviye */}
                        <div className="flex-1 bg-[#171a21] rounded-xl border border-white/5 p-5 shadow-lg flex flex-col relative z-10">
                            <h3 className="font-bold text-sm text-white mb-6">İleri seviye</h3>
                            
                            <div className="flex justify-between items-center bg-[#0f1215] px-4 py-3 rounded-lg border border-white/5 mb-4">
                                <span className="text-xs font-bold text-gray-300">Sadece Renk Bahsi</span>
                                <div className={`w-8 h-4.5 rounded-full relative cursor-pointer ${advOnlyColorBet ? 'bg-emerald-500' : 'bg-gray-600'}`} onClick={() => setAdvOnlyColorBet(!advOnlyColorBet)}>
                                    <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-all ${advOnlyColorBet ? 'right-0.5' : 'left-0.5'}`}></div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="relative">
                                    <label className="text-[10px] text-gray-500 font-bold mb-1 block">Ne zaman</label>
                                    <div 
                                        className="bg-[#0f1215] rounded-lg border border-white/5 p-2.5 flex justify-between items-center cursor-pointer"
                                        onClick={() => setOpenDropdown(openDropdown === 'advColor' ? null : 'advColor')}
                                    >
                                        <span className="text-xs font-bold text-gray-300">{advColorNotCome === 'red' ? 'Kırmızı' : advColorNotCome === 'green' ? 'Yeşil' : 'Siyah'} Gelmedi</span>
                                        <ChevronDown size={14} className="text-gray-500" />
                                    </div>
                                    {openDropdown === 'advColor' && (
                                        <div className="absolute top-full left-0 w-full bg-[#0f1215] border border-white/10 rounded-lg mt-1 z-50 overflow-hidden shadow-xl">
                                            <div className="px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 cursor-pointer" onClick={() => { setAdvColorNotCome('red'); setOpenDropdown(null); }}>Kırmızı Gelmedi</div>
                                            <div className="px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 cursor-pointer" onClick={() => { setAdvColorNotCome('green'); setOpenDropdown(null); }}>Yeşil Gelmedi</div>
                                            <div className="px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 cursor-pointer" onClick={() => { setAdvColorNotCome('black'); setOpenDropdown(null); }}>Siyah Gelmedi</div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 font-bold mb-1 block">İçin</label>
                                    <div className="bg-[#0f1215] rounded-lg border border-white/5 p-2.5 flex justify-between items-center">
                                        <input type="number" value={advConsecutiveGames} onChange={e => setAdvConsecutiveGames(Number(e.target.value))} className="bg-transparent text-xs font-bold text-gray-300 outline-none w-16" />
                                        <span className="text-[10px] text-gray-500">Arka arkaya oyunlar</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                className={`mt-auto font-black text-xs py-3 px-6 rounded-lg self-start transition-colors shadow-lg ${advIsActive ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20' : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'}`}
                                onClick={() => setAdvIsActive(!advIsActive)}
                            >
                                {advIsActive ? 'Dur' : 'Otomatik Bahsi Başlat'}
                            </button>
                        </div>

                        {/* Section 3: Green Hunt */}
                        <div className="flex-1 bg-[#171a21] rounded-xl border border-white/5 p-5 shadow-lg flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-sm text-white">Green Hunt</h3>
                                <span className={`text-[10px] font-black px-2 py-1 rounded-md ${greenHuntIsActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                                    {greenHuntIsActive ? 'AKTİF' : 'AKTİF DEĞİL'}
                                </span>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-[10px] text-gray-500 font-bold mb-1 block">Otomatik Bahis (%)</label>
                                    <div className="bg-[#0f1215] rounded-lg border border-white/5 p-2.5 flex">
                                        <input type="number" value={greenHuntAmount} onChange={e => setGreenHuntAmount(Number(e.target.value))} className="bg-transparent text-xs font-bold text-gray-300 outline-none flex-1" />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="text-[10px] text-gray-500 font-bold mb-1 block">Ne zaman</label>
                                    <div className="bg-[#0f1215] rounded-lg border border-white/5 p-2.5 flex justify-between items-center cursor-pointer">
                                        <span className="text-xs font-bold text-gray-300">Bahsinizin yüzdesi</span>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-[11px] text-gray-500 font-medium mb-6 leading-relaxed">
                                Kırmızı veya Siyah üzerine bahis oynadığınızda (Otomatik veya Manuel) Yeşil üzerine belirtilen oranda bahis yapar.
                            </p>

                            <button 
                                className={`mt-auto font-black text-xs py-3 px-6 rounded-lg self-start transition-colors shadow-lg ${greenHuntIsActive ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20' : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'}`}
                                onClick={() => setGreenHuntIsActive(!greenHuntIsActive)}
                            >
                                {greenHuntIsActive ? 'Dur' : "Green Hunt'ı Başlat"}
                            </button>
                        </div>

                    </div>
                )}

                {/* ── BETTING BUTTONS & LISTS ── */}
                <div className="w-full flex flex-col md:flex-row gap-3 md:gap-4 mb-12 items-stretch">
                    
                    {/* RED SECTION */}
                    <div className="flex-1 flex flex-col">
                        <div 
                            className={`relative w-full h-14 sm:h-16 mb-3 transition-all flex items-center justify-between px-4 sm:px-6 overflow-hidden rounded-xl shadow-lg cursor-pointer ${gameState !== 'betting' ? 'opacity-50' : 'hover:-translate-y-1 active:translate-y-0'}`}
                            style={{ backgroundImage: `url(${ASSETS.btnRed})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            onClick={() => handleAddBet('red')}
                        >
                            <span className="text-white font-black text-lg sm:text-xl drop-shadow-md">Kırmızı</span>
                            <span className="text-white/80 font-bold text-xs sm:text-sm drop-shadow-md bg-black/20 px-3 py-1 rounded-full">X2</span>
                        </div>
                        
                        <div className="bg-[#171a21] border border-white/5 rounded-xl p-3 flex-1 shadow-inner overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center mb-2 text-[10px] font-bold text-gray-500 uppercase pb-2 border-b border-white/5">
                                <span>{getColumnCount('red')} Bahis</span>
                                <div className="flex items-center gap-1 text-white bg-[#0f1215] px-2 py-1 rounded-md">
                                    <img src={ASSETS.tanzanite} alt="Coin" className="h-2.5" />
                                    <span>{getColumnTotal('red').toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto pr-1 space-y-1 h-[140px] custom-scrollbar">
                                {/* User Bet */}
                                {getBetAmount('red') > 0 && (
                                    <div className="flex justify-between items-center py-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-[#0f1215] rounded flex items-center justify-center border border-red-500/30 text-white font-bold text-[10px]">Sen</div>
                                            <span className="text-sm text-gray-300 font-medium truncate max-w-[100px]">Sen</span>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-400">${getBetAmount('red').toFixed(2)}</span>
                                    </div>
                                )}
                                
                                {/* Fake Bets */}
                                {fakeBets.filter(b => b.color === 'red').map(b => (
                                    <div key={b.id} className="flex justify-between items-center py-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-[#0f1215] rounded flex items-center justify-center border border-white/5 text-gray-400">
                                                <User size={12} />
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium truncate max-w-[100px]">{b.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-400">${b.amount.toFixed(2)}</span>
                                    </div>
                                ))}

                                {getColumnCount('red') === 0 && (
                                    <div className="text-xs text-gray-600 text-center py-4">Henüz bahis yok</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* GREEN SECTION */}
                    <div className="flex-1 flex flex-col">
                        <div 
                            className={`relative w-full h-14 sm:h-16 mb-3 transition-all flex items-center justify-between px-4 sm:px-6 overflow-hidden rounded-xl shadow-lg cursor-pointer ${gameState !== 'betting' ? 'opacity-50' : 'hover:-translate-y-1 active:translate-y-0'}`}
                            style={{ backgroundImage: `url(${ASSETS.btnGreen})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            onClick={() => handleAddBet('green')}
                        >
                            <span className="text-white font-black text-lg sm:text-xl drop-shadow-md">Yeşil</span>
                            <span className="text-white/80 font-bold text-xs sm:text-sm drop-shadow-md bg-black/20 px-3 py-1 rounded-full">X100</span>
                        </div>
                        
                        <div className="bg-[#171a21] border border-white/5 rounded-xl p-3 flex-1 shadow-inner overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center mb-2 text-[10px] font-bold text-gray-500 uppercase pb-2 border-b border-white/5">
                                <span>{getColumnCount('green')} Bahis</span>
                                <div className="flex items-center gap-1 text-white bg-[#0f1215] px-2 py-1 rounded-md">
                                    <img src={ASSETS.tanzanite} alt="Coin" className="h-2.5" />
                                    <span>{getColumnTotal('green').toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto pr-1 space-y-1 h-[140px] custom-scrollbar">
                                {/* User Bet */}
                                {getBetAmount('green') > 0 && (
                                    <div className="flex justify-between items-center py-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-[#0f1215] rounded flex items-center justify-center border border-green-500/30 text-white font-bold text-[10px]">Sen</div>
                                            <span className="text-sm text-gray-300 font-medium truncate max-w-[100px]">Sen</span>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-400">${getBetAmount('green').toFixed(2)}</span>
                                    </div>
                                )}
                                
                                {/* Fake Bets */}
                                {fakeBets.filter(b => b.color === 'green').map(b => (
                                    <div key={b.id} className="flex justify-between items-center py-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-[#0f1215] rounded flex items-center justify-center border border-white/5 text-gray-400">
                                                <User size={12} />
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium truncate max-w-[100px]">{b.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-400">${b.amount.toFixed(2)}</span>
                                    </div>
                                ))}

                                {getColumnCount('green') === 0 && (
                                    <div className="text-xs text-gray-600 text-center py-4">Henüz bahis yok</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* BLACK (GREY) SECTION */}
                    <div className="flex-1 flex flex-col">
                        <div 
                            className={`relative w-full h-14 sm:h-16 mb-3 transition-all flex items-center justify-between px-4 sm:px-6 overflow-hidden rounded-xl shadow-lg cursor-pointer ${gameState !== 'betting' ? 'opacity-50' : 'hover:-translate-y-1 active:translate-y-0'}`}
                            style={{ backgroundImage: `url(${ASSETS.btnGrey})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            onClick={() => handleAddBet('black')}
                        >
                            <span className="text-white font-black text-lg sm:text-xl drop-shadow-md">Siyah</span>
                            <span className="text-white/80 font-bold text-xs sm:text-sm drop-shadow-md bg-black/20 px-3 py-1 rounded-full">X2</span>
                        </div>
                        
                        <div className="bg-[#171a21] border border-white/5 rounded-xl p-3 flex-1 shadow-inner overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center mb-2 text-[10px] font-bold text-gray-500 uppercase pb-2 border-b border-white/5">
                                <span>{getColumnCount('black')} Bahis</span>
                                <div className="flex items-center gap-1 text-white bg-[#0f1215] px-2 py-1 rounded-md">
                                    <img src={ASSETS.tanzanite} alt="Coin" className="h-2.5" />
                                    <span>{getColumnTotal('black').toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto pr-1 space-y-1 h-[140px] custom-scrollbar">
                                {/* User Bet */}
                                {getBetAmount('black') > 0 && (
                                    <div className="flex justify-between items-center py-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-[#0f1215] rounded flex items-center justify-center border border-gray-500/30 text-white font-bold text-[10px]">Sen</div>
                                            <span className="text-sm text-gray-300 font-medium truncate max-w-[100px]">Sen</span>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-400">${getBetAmount('black').toFixed(2)}</span>
                                    </div>
                                )}
                                
                                {/* Fake Bets */}
                                {fakeBets.filter(b => b.color === 'black').map(b => (
                                    <div key={b.id} className="flex justify-between items-center py-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-[#0f1215] rounded flex items-center justify-center border border-white/5 text-gray-400">
                                                <User size={12} />
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium truncate max-w-[100px]">{b.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-400">${b.amount.toFixed(2)}</span>
                                    </div>
                                ))}

                                {getColumnCount('black') === 0 && (
                                    <div className="text-xs text-gray-600 text-center py-4">Henüz bahis yok</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* WIN/LOSS Overlay */}
                {gameState === 'result' && winAmount !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto"></div>
                        {winAmount > 0 ? (
                            <div className="relative px-8 md:px-24 py-10 md:py-16 rounded-[2rem] border-t-2 border-emerald-400 shadow-[0_0_100px_rgba(16,185,129,0.5)] flex flex-col items-center backdrop-blur-2xl animate-pop-in z-10 overflow-hidden" style={{ background: 'radial-gradient(circle at top, rgba(16,185,129,0.3) 0%, rgba(15,18,21,0.95) 70%)' }}>
                                {/* Golden/Emerald Shine Sweep */}
                                <div className="absolute inset-0 animate-shine opacity-30"></div>
                                
                                <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]"></div>
                                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]"></div>
                                
                                <div className="flex items-center justify-center gap-4 mb-2 z-10 animate-bounce-scale">
                                    <img src={ASSETS.tanzanite} alt="Coin" className="h-10 md:h-14 drop-shadow-[0_0_20px_rgba(255,184,0,0.8)]" />
                                    <span className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600 drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] tracking-tighter">
                                        +${winAmount.toFixed(2)}
                                    </span>
                                </div>
                                
                                <div className="z-10 bg-emerald-500/20 text-emerald-400 text-sm md:text-base font-black px-6 py-2 rounded-full border border-emerald-500/40 uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(16,185,129,0.4)] mt-6">
                                    Kazandın
                                </div>
                            </div>
                        ) : (
                            <div className="relative px-8 md:px-24 py-10 md:py-16 rounded-[2rem] border-t-2 border-rose-500 shadow-[0_0_100px_rgba(225,29,72,0.2)] flex flex-col items-center backdrop-blur-2xl animate-pop-in z-10" style={{ background: 'radial-gradient(circle at top, rgba(225,29,72,0.15) 0%, rgba(15,18,21,0.95) 70%)' }}>
                                <div className="absolute -top-20 -left-20 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]"></div>
                                
                                <span className="text-sm md:text-base font-black uppercase tracking-[0.5em] mb-6 text-gray-500 z-10">Kaybettin</span>
                                
                                <div className="flex flex-col items-center gap-3 z-10">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gelen Renk</span>
                                    <div className="flex items-center gap-3 bg-black/40 px-8 py-4 rounded-2xl border border-white/5 shadow-inner">
                                        <div className={`w-6 h-6 rounded-full shadow-[0_0_20px_currentColor] ${winningColor === 'red' ? 'bg-red-500 text-red-500' : winningColor === 'green' ? 'bg-green-500 text-green-500' : 'bg-gray-500 text-gray-500'}`}></div>
                                        <span className="text-2xl md:text-3xl font-black text-white">{winningColor === 'red' ? 'Kırmızı' : winningColor === 'green' ? 'Yeşil' : 'Siyah'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                @keyframes pop-in {
                    0% { transform: scale(0.9) translateY(20px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                .animate-pop-in {
                    animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes shine {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .animate-shine {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    background-size: 200% auto;
                    animation: shine 3s linear infinite;
                }
                @keyframes bounce-scale {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animate-bounce-scale {
                    animation: bounce-scale 2s ease-in-out infinite;
                }
            `}} />
        </div>
    );
}
