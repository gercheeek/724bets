import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CrashGraph from './CrashGraph';
import { soundEngine } from '../utils/SoundEngine';
interface MockPlayer {
    name: string;
    multiplier: number | null;
    bet: number;
    avatar: string;
}

const generateMockPlayers = (crashPoint: number): MockPlayer[] => {
    const players: MockPlayer[] = [];
    const count = Math.floor(Math.random() * 15) + 5;
    for (let i = 0; i < count; i++) {
        const bet = Math.floor(Math.random() * 50) + 1;
        const willCashout = Math.random() < 0.7;
        let m = null;
        if (willCashout) {
            m = 1 + Math.random() * (crashPoint - 1.05);
            if (m >= crashPoint) m = null;
        }
        players.push({
            name: `User${Math.floor(Math.random() * 9000) + 1000}`,
            multiplier: m ? parseFloat(m.toFixed(2)) : null,
            bet,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
        });
    }
    return players.sort((a, b) => b.bet - a.bet);
};

export default function CrashGameView({ siteUser, setSiteUser, onAuthRequired, onNavigate }: any) {
    const { t } = useTranslation();
    const [betAmount, setBetAmount] = useState<string>('2.00');
    const [cashoutAt, setCashoutAt] = useState<string>('2.00');
    
    // Core engine states
    const [gameState, setGameState] = useState<'betting' | 'playing' | 'crashed'>('betting');
    const [multiplier, setMultiplier] = useState<number>(1.00);
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
    const [crashPoint, setCrashPoint] = useState<number>(1.00);
    const [countdown, setCountdown] = useState<number>(6);
    
    // User interaction states
    const [hasBet, setHasBet] = useState(false);
    const [nextRoundBet, setNextRoundBet] = useState(false);
    const [hasCashedOut, setHasCashedOut] = useState(false);
    const [winAmount, setWinAmount] = useState(0);

    const [mockPlayers, setMockPlayers] = useState<MockPlayer[]>([]);
    const [history, setHistory] = useState<number[]>([2.35, 1.62, 1.61, 1.36, 1.45, 6.86, 3.94, 2.96, 2.04, 2.38]);

    const reqRef = useRef<number | undefined>(undefined);
    const startTimeRef = useRef<number>(0);

    // Exponential math function for multiplier (Faster curve for more excitement)
    const calcMultiplier = (seconds: number) => {
        return Math.max(1, Math.exp(seconds / 10)); 
    };

    const startGame = () => {
        let placedBet = false;
        if (nextRoundBet) {
            const b = parseFloat(betAmount);
            if (!siteUser || (!siteUser || siteUser.balance >= b)) {
                if (siteUser && !String(siteUser.id).startsWith('guest_')) {
                    const newBal = siteUser.balance - b;
                    setSiteUser({ ...siteUser, balance: newBal });
                    supabase.from('members').update({ balance: newBal }).eq('id', siteUser.id).then();
                }
                placedBet = true;
            } else {
                alert("Yetersiz bakiye!");
            }
        }
        
        setHasBet(placedBet);
        setNextRoundBet(false);

        // Generate crash point
        const e = 2 ** 32;
        const h = Math.random() * e;
        let cPoint = Math.max(1.00, (100 * e - h) / (e - h) / 100);
        if (cPoint > 1000) cPoint = 1000;
        
        // Demo Mode - Insane Win Rates
        if (String(siteUser?.id).startsWith('guest_')) {
            if (Math.random() < 0.6) {
                // 60% chance for a solid win (2.5x - 7.5x)
                cPoint = Math.max(cPoint, 2.5 + Math.random() * 5);
            } else if (Math.random() < 0.8) {
                // 20% chance for big win (10x - 30x)
                cPoint = Math.max(cPoint, 10 + Math.random() * 20);
            }
        } else {
            if (Math.random() < 0.05) cPoint = 1.00;
        }

        setCrashPoint(cPoint);
        setMockPlayers(generateMockPlayers(cPoint));
        
        setGameState('playing');
        setMultiplier(1.00);
        setElapsedSeconds(0);
        setHasCashedOut(false);
        setWinAmount(0);
        startTimeRef.current = Date.now();
        soundEngine.startEngineSound();
    };

    useEffect(() => {
        if (gameState === 'playing') {
            const update = () => {
                const now = Date.now();
                // Avoid NaN or negative time
                const seconds = Math.max(0, (now - startTimeRef.current) / 1000);
                let currentMulti = calcMultiplier(seconds);
                
                if (currentMulti >= crashPoint) {
                    currentMulti = crashPoint;
                    setMultiplier(currentMulti);
                    setElapsedSeconds(Math.log(crashPoint) * 10); // Sync exact crash time
                    handleCrash(currentMulti);
                    return;
                }
                
                setMultiplier(currentMulti);
                setElapsedSeconds(seconds);
                soundEngine.updateEnginePitch(currentMulti);

                // Auto cashout check
                if (hasBet && !hasCashedOut) {
                    const coTarget = parseFloat(cashoutAt);
                    if (!isNaN(coTarget) && currentMulti >= coTarget) {
                        handleCashout(coTarget);
                    }
                }

                reqRef.current = requestAnimationFrame(update);
            };
            reqRef.current = requestAnimationFrame(update);
        }
        return () => {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
        };
    }, [gameState, crashPoint, hasBet, hasCashedOut, cashoutAt]);

    useEffect(() => {
        let timer: any;
        if (gameState === 'betting') {
            if (countdown > 0) {
                timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            } else {
                startGame();
            }
        }
        return () => clearTimeout(timer);
    }, [gameState, countdown]);

    const handleCrash = (finalMulti: number) => {
        setGameState('crashed');
        setHasBet(false);
        soundEngine.stopEngineSound();
        soundEngine.playCrashSound();
        
        setHistory(prev => [parseFloat(finalMulti.toFixed(2)), ...prev].slice(0, 10));

        setTimeout(() => {
            setGameState('betting');
            setMultiplier(1.00);
            setElapsedSeconds(0);
            setCountdown(6);
        }, 4000);
    };

    const handleCashout = (atMulti: number = multiplier) => {
        if (!hasBet || hasCashedOut || gameState !== 'playing') return;
        setHasCashedOut(true);
        soundEngine.playCashoutSound();
        const win = parseFloat(betAmount) * atMulti;
        setWinAmount(win);

        if (siteUser) {
            const newBal = siteUser.balance + win;
            setSiteUser({ ...siteUser, balance: newBal });
            if (!String(siteUser.id).startsWith('guest_')) {
                supabase.from('members').update({ balance: newBal }).eq('id', siteUser.id).then();
            }
        }
    };

    const handleBetClick = () => {
        soundEngine.init();
        soundEngine.playBetSound();
        
        if (gameState === 'playing') {
            if (hasBet && !hasCashedOut) {
                handleCashout(multiplier);
            } else {
                setNextRoundBet(!nextRoundBet);
            }
        } else if (gameState === 'betting') {
            setNextRoundBet(!nextRoundBet);
        } else if (gameState === 'crashed') {
            setNextRoundBet(!nextRoundBet);
        }
    };

    // Safe values for display
    const safeElapsed = isNaN(elapsedSeconds) ? 0 : Math.max(0, elapsedSeconds);
    const safeMulti = isNaN(multiplier) ? 1.0 : Math.max(1.0, multiplier);

    const getProfit = () => {
        if (hasCashedOut) return winAmount.toFixed(2);
        const ba = parseFloat(betAmount) || 0;
        const co = parseFloat(cashoutAt) || 0;
        return (ba * co).toFixed(2);
    };

    return (
        <div className="flex flex-col lg:flex-row w-full h-full bg-[#0B0E14] text-white font-sans overflow-y-auto lg:overflow-hidden relative">
            
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
                            <label className="text-[12px] text-zinc-400 font-bold block">{t('Bet amount', 'Bet amount')}</label>
                            <span className="text-[10px] text-zinc-500 font-bold">{siteUser ? siteUser.balance.toFixed(2) : '0.00'} EUR</span>
                        </div>
                        <div className="flex bg-[#0B0E14] border border-[#1E2336] rounded-md overflow-hidden h-11 focus-within:border-[#00E5FF]/50 focus-within:shadow-[0_0_10px_rgba(0,229,255,0.1)] transition-all">
                            <input 
                                type="text" 
                                value={betAmount}
                                onChange={(e) => setBetAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                                disabled={hasBet && gameState !== 'crashed' && gameState !== 'betting'}
                                className="flex-1 bg-transparent px-3 text-sm text-white outline-none font-medium disabled:opacity-50"
                            />
                            <div className="flex items-center border-l border-[#1E2336]">
                                <span className="text-zinc-500 text-xs font-bold px-2">EUR</span>
                                <div className="flex h-full border-l border-[#1E2336]">
                                    <button onClick={() => setBetAmount((parseFloat(betAmount)/2).toFixed(2))} className="px-3 hover:bg-white/5 text-zinc-400 text-xs font-bold transition-colors">½</button>
                                    <div className="w-[1px] h-full bg-[#1E2336]"></div>
                                    <button onClick={() => setBetAmount((parseFloat(betAmount)*2).toFixed(2))} className="px-3 hover:bg-white/5 text-zinc-400 text-xs font-bold transition-colors">2x</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cashout At */}
                    <div>
                        <label className="text-[12px] text-zinc-400 font-bold mb-1 block">{t('Cashout At', 'Cashout At')}</label>
                        <div className="flex bg-[#0B0E14] border border-[#1E2336] rounded-md overflow-hidden h-11 focus-within:border-[#00E5FF]/50 focus-within:shadow-[0_0_10px_rgba(0,229,255,0.1)] transition-all">
                            <input 
                                type="text" 
                                value={cashoutAt}
                                onChange={(e) => setCashoutAt(e.target.value.replace(/[^0-9.]/g, ''))}
                                className="flex-1 bg-transparent px-3 text-sm text-white outline-none font-medium"
                            />
                            <div className="flex flex-col border-l border-[#1E2336] w-8">
                                <button onClick={() => setCashoutAt((parseFloat(cashoutAt)+1).toFixed(2))} className="flex-1 hover:bg-white/5 flex items-center justify-center border-b border-[#1E2336]">
                                    <span className="text-zinc-400 text-[10px]">▲</span>
                                </button>
                                <button onClick={() => setCashoutAt(Math.max(1.01, parseFloat(cashoutAt)-1).toFixed(2))} className="flex-1 hover:bg-white/5 flex items-center justify-center">
                                    <span className="text-zinc-400 text-[10px]">▼</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Profit on Win */}
                    <div>
                        <label className="text-[12px] text-zinc-400 font-bold mb-1 block">{t('Profit on Win', 'Profit on Win')}</label>
                        <div className="flex bg-[#0B0E14] border border-[#1E2336] rounded-md overflow-hidden h-11">
                            <input 
                                type="text" 
                                value={getProfit()}
                                disabled
                                className="flex-1 bg-transparent px-3 text-sm text-zinc-300 outline-none font-medium opacity-70"
                            />
                            <div className="flex items-center px-3 border-l border-[#1E2336]">
                                <span className="text-zinc-500 text-xs font-bold">EUR</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={handleBetClick}
                        className={`w-full py-3.5 rounded-md font-black text-[14px] tracking-wide transition-all uppercase relative overflow-hidden
                            ${(gameState === 'playing' && hasBet && !hasCashedOut) ? 'bg-[#c6ff00] text-black hover:bg-[#a6d900] shadow-[0_0_20px_rgba(198,255,0,0.4)]' : 
                              (nextRoundBet ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-[#c6ff00] text-black hover:bg-[#a6d900] hover:shadow-[0_0_15px_rgba(198,255,0,0.3)]')}
                        `}
                    >
                        {gameState === 'playing' && hasBet && !hasCashedOut 
                            ? `Cashout ${(parseFloat(betAmount) * safeMulti).toFixed(2)}` 
                            : nextRoundBet 
                                ? 'Cancel Bet' 
                                : 'Bet (Next Round)'}
                    </button>
                </div>

                {/* Players List */}
                <div className="flex-1 flex flex-col mt-4 px-1">
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold mb-3 pb-2 border-b border-[#1E2336]">
                        <div className="flex items-center gap-1"><Settings className="w-3 h-3" /> {mockPlayers.length}</div>
                        <div>{mockPlayers.reduce((a,b)=>a+b.bet, 0).toFixed(2)} EUR</div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
                        {mockPlayers.map((p, i) => (
                            <div key={i} className={`flex items-center justify-between p-2 rounded-md transition-colors ${p.multiplier ? 'bg-[#00E5FF]/10 border border-[#00E5FF]/20' : 'bg-[#0B0E14] border border-transparent'}`}>
                                <div className="flex items-center gap-2">
                                    <img src={p.avatar} alt="avatar" className="w-5 h-5 rounded-full bg-zinc-800" />
                                    <span className="text-[11px] font-bold text-zinc-300">{p.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-[10px] font-bold">
                                        {p.multiplier ? (
                                            <span className="text-[#00E5FF] bg-[#00E5FF]/10 px-1.5 py-0.5 rounded">{p.multiplier.toFixed(2)}x</span>
                                        ) : (
                                            <span className="text-zinc-600 ml-1">-</span>
                                        )}
                                    </div>
                                    <div className={`font-bold text-[11px] w-16 text-right ${p.multiplier ? 'text-[#00E5FF]' : (gameState === 'crashed' ? 'text-zinc-600' : 'text-zinc-300')}`}>
                                        {p.multiplier ? (p.bet * p.multiplier).toFixed(2) : p.bet.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT MAIN AREA (Robust Absolute/Flex Layout) ── */}
            <div className="flex-1 flex flex-col relative bg-[#0B0E14] order-1 lg:order-2 min-h-[350px] lg:min-h-0 border-b lg:border-b-0 border-[#1E2336]">
                


                {/* Main Graph Area */}
                <div className="flex-1 relative w-full">
                    {/* Canvas-based graph — fills the entire area */}
                    <div className="absolute inset-0">
                        <CrashGraph
                            multiplier={multiplier}
                            elapsedSeconds={elapsedSeconds}
                            gameState={gameState}
                        />
                    </div>

                        {/* Absolute Center Content (Multiplier or Starting In) */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                            
                            {/* The giant multiplier text, perfectly centered AT ALL TIMES */}
                            <div className="relative flex flex-col items-center justify-center">
                                {gameState === 'playing' && (
                                    <div className="text-[64px] md:text-[80px] font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>
                                        {safeMulti.toFixed(2)}x
                                    </div>
                                )}

                                {gameState === 'crashed' && (
                                    <div className="flex flex-col items-center animate-fade-in">
                                        <div className="text-[64px] md:text-[80px] font-black text-[#F43F5E] drop-shadow-[0_5px_15px_rgba(244,63,94,0.3)] tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>
                                            {safeMulti.toFixed(2)}x
                                        </div>
                                        <div className="bg-[#2C3145] text-zinc-300 font-bold px-6 py-2 rounded-lg mt-[-10px] text-sm tracking-widest shadow-lg absolute -bottom-8">
                                            Crashed
                                        </div>
                                    </div>
                                )}

                                {gameState === 'betting' && (
                                    <div className="text-[64px] md:text-[80px] font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>
                                        1.00x
                                    </div>
                                )}

                                {/* Progress bar absolutely positioned below the text so it never shifts layout */}
                                {gameState === 'betting' && (
                                    <div className="absolute top-[100%] mt-2 w-64 max-w-full">
                                        <div className="w-full relative h-10 md:h-12 bg-[#131620] border border-[#1E2336] rounded-md overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                            {/* Animated Progress Fill */}
                                            <div 
                                                className="absolute left-0 top-0 bottom-0 bg-[#00E5FF] transition-all ease-linear"
                                                style={{ width: `${(countdown / 6) * 100}%`, transitionDuration: '1000ms' }}
                                            ></div>
                                            <span className="relative z-10 text-white font-bold tracking-wider text-sm md:text-base drop-shadow-md">
                                                Starting in {countdown}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Game Session ID (Serial) */}
                        <div className="absolute left-6 bottom-16 flex flex-col pointer-events-none z-30 opacity-30">
                            <span className="text-white text-[10px] font-mono tracking-widest">12321412431243242</span>
                        </div>

                        {/* Network Status / Info */}
                        <div className="absolute right-6 bottom-16 flex flex-col items-end pointer-events-none z-30">
                            <span className="text-zinc-400 text-[11px] font-bold mb-1">{t('Total', 'Total')} {Math.floor(safeElapsed)}s</span>
                            <div className="flex items-center gap-1">
                                <span className="text-zinc-500 text-[10px]">{t('Network Status', 'Network Status')}</span>
                                <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer bar */}

                </div>
            </div>
    );
}

