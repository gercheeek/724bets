import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

// ─────────────────────────── CARD ENGINE ────────────────────────────────────
type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card { suit: Suit; rank: Rank; hidden?: boolean; id: string; }

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RED_SUITS: Suit[] = ['♥', '♦'];

function buildDeck(): Card[] {
    const deck: Card[] = [];
    for (let i = 0; i < 4; i++) {
        for (const suit of SUITS) {
            for (const rank of RANKS) {
                deck.push({ suit, rank, id: Math.random().toString() });
            }
        }
    }
    return deck;
}

function shuffleDeck(deck: Card[]): Card[] {
    const d = [...deck];
    for (let i = d.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [d[i], d[j]] = [d[j], d[i]];
    }
    return d;
}

function cardValue(rank: Rank): number {
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    if (rank === 'A') return 11;
    return parseInt(rank);
}

function handTotal(hand: Card[]): number {
    let total = 0;
    let aces = 0;
    for (const card of hand) {
        if (card.hidden) continue;
        total += cardValue(card.rank);
        if (card.rank === 'A') aces++;
    }
    while (total > 21 && aces > 0) { total -= 10; aces--; }
    return total;
}

function isBust(hand: Card[]): boolean { return handTotal(hand) > 21; }
function isBlackjack(hand: Card[]): boolean {
    return hand.length === 2 && handTotal(hand) === 21;
}

// ─────────────────────────── CASINO CHIP COMPONENT ──────────────────────────
const CasinoChip: React.FC<{ value: number; color?: string; onClick?: () => void; isSelected?: boolean; stacked?: boolean }> = ({ value, color, onClick, isSelected, stacked }) => {
    const bgColors = {
        blue: 'from-blue-600 to-blue-800',
        red: 'from-red-600 to-red-800',
        green: 'from-green-600 to-green-800',
        black: 'from-gray-800 to-black',
        gold: 'from-yellow-500 to-yellow-700'
    };
    
    const chipColor = color || (value >= 1000 ? 'gold' : value >= 100 ? 'black' : value >= 25 ? 'green' : value >= 5 ? 'red' : 'blue');
    const colorClass = bgColors[chipColor as keyof typeof bgColors];

    const chipBody = (
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colorClass} shadow-[0_5px_15px_rgba(0,0,0,0.5)] border-[3px] border-white/20 flex items-center justify-center relative cursor-pointer ${isSelected ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent transform -translate-y-2' : ''} transition-all`}>
            {/* Dashed edge */}
            <div className="absolute inset-1 rounded-full border-[3px] border-dashed border-white/40"></div>
            {/* Center label */}
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="text-white font-black text-xs drop-shadow-md">{value}</span>
            </div>
        </div>
    );

    if (stacked) {
        // Stacked look for the betting circle
        const numChips = Math.min(Math.max(Math.floor(value / 10), 1), 6);
        return (
            <div className="relative w-14 h-14 flex items-center justify-center">
                {Array.from({ length: numChips }).map((_, i) => (
                    <div key={i} className="absolute" style={{ bottom: `${i * 5}px`, zIndex: i }}>
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colorClass} shadow-[0_4px_5px_rgba(0,0,0,0.5)] border-[2px] border-white/20 flex items-center justify-center relative`}>
                            <div className="absolute inset-1 rounded-full border-[3px] border-dashed border-white/40"></div>
                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                <span className="text-white font-black text-xs drop-shadow-md">{value}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div onClick={onClick} className="transition-transform hover:scale-110">
            {chipBody}
        </div>
    );
};

// ─────────────────────────── CARD UI COMPONENT ──────────────────────────────
const CardUI: React.FC<{ card: Card; index: number; animate?: boolean }> = ({ card, index, animate = true }) => {
    const [show, setShow] = useState(!animate);
    
    useEffect(() => {
        if (!animate) { setShow(true); return; }
        const t = setTimeout(() => setShow(true), index * 150);
        return () => clearTimeout(t);
    }, [animate, index]);

    const isRed = RED_SUITS.includes(card.suit);

    // Subtle rotation based on index to look like cards thrown on a table
    const rot = (index % 2 === 0 ? -4 : 6) + (index * 2);

    if (card.hidden) {
        return (
            <div className="relative flex-shrink-0 -ml-14 shadow-[0_15px_35px_rgba(0,0,0,0.6)]" style={{ width: '90px', height: '135px', zIndex: index }}>
                <div className="w-full h-full rounded-md flex flex-col items-center justify-center border-4 border-white overflow-hidden bg-gradient-to-br from-red-800 to-red-900 relative">
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '8px 8px' }}></div>
                    <div className="w-12 h-12 border-2 border-white/50 rotate-45 flex items-center justify-center">
                        <div className="w-10 h-10 border border-white/30 flex items-center justify-center">
                            <span className="text-white/60 font-serif font-black -rotate-45 text-sm">724</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative flex-shrink-0 -ml-14"
            style={{
                width: '90px', height: '135px',
                transform: show ? `translateY(0) rotate(${rot}deg) scale(1)` : 'translateY(-100px) rotate(90deg) scale(1.2)',
                opacity: show ? 1 : 0,
                zIndex: index,
                transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
        >
            <div className="w-full h-full rounded-md flex flex-col justify-between p-1.5 bg-white shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-gray-300">
                <div className="flex flex-col items-start leading-none">
                    <span className="font-bold text-xl leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.rank}</span>
                    <span className="text-lg leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.suit}</span>
                </div>
                <div className="text-center text-5xl leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ color: isRed ? '#dc2626' : '#111' }}>
                    {card.suit}
                </div>
                <div className="flex flex-col items-end leading-none rotate-180">
                    <span className="font-bold text-xl leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.rank}</span>
                    <span className="text-lg leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.suit}</span>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────── SCORE BADGE ──────────────────────────────
const ScoreBadge: React.FC<{ score: number; show: boolean }> = ({ score, show }) => {
    if (!show || score === 0) return null;
    return (
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 bg-black/80 border border-white/20 text-white font-black text-sm px-2.5 py-1 rounded shadow-lg backdrop-blur-sm z-20">
            {score}
        </div>
    );
};

// ─────────────────────────── MAIN GAME VIEW ──────────────────────────────
export default function BlackjackProView({ siteUser, setSiteUser, onAuthRequired }: any) {
    const [betAmount, setBetAmount] = useState(0);
    
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'dealerTurn' | 'ended'>('idle');
    const [result, setResult] = useState<'win' | 'lose' | 'push' | 'blackjack' | 'bust' | null>(null);
    const [payout, setPayout] = useState(0);

    useEffect(() => {
        setDeck(shuffleDeck(buildDeck()));
    }, []);

    const logBet = (bet: number, win: number, resStr: string) => {
        try {
            const logs = JSON.parse(localStorage.getItem('site_blackjack_bets') || '[]');
            logs.push({
                id: Date.now().toString(),
                userId: siteUser?.id || 'guest',
                username: siteUser?.username || 'Guest',
                betAmount: bet,
                winAmount: win,
                profit: win - bet,
                result: resStr,
                time: new Date().toISOString()
            });
            if (logs.length > 500) logs.shift();
            localStorage.setItem('site_blackjack_bets', JSON.stringify(logs));
        } catch (e) { }
    };

    const settleGame = (winAmount: number, finalResult: any, finalBalance: number) => {
        setPayout(winAmount);
        setResult(finalResult);
        setGameState('ended');
        
        if (siteUser) {
            setSiteUser({ ...siteUser, balance: finalBalance });
            if (!siteUser.id.toString().startsWith('guest_')) {
                supabase.from('members').update({ balance: finalBalance }).eq('id', siteUser.id).then();
            }
            logBet(betAmount, winAmount, finalResult);
        }
    };

    const handleDeal = () => {
        if (!siteUser) {
            if (onAuthRequired) onAuthRequired();
            return;
        }
        if (betAmount <= 0) return;
        if (siteUser.balance < betAmount) {
            alert("Yetersiz bakiye!");
            return;
        }

        const newBalance = siteUser.balance - betAmount;
        setSiteUser({ ...siteUser, balance: newBalance });
        if (!siteUser.id.toString().startsWith('guest_')) {
            supabase.from('members').update({ balance: newBalance }).eq('id', siteUser.id).then();
        }

        let currentDeck = [...deck];
        if (currentDeck.length < 20) {
            currentDeck = shuffleDeck(buildDeck());
        }

        const pHand = [currentDeck.pop()!, currentDeck.pop()!];
        const dHand = [currentDeck.pop()!, { ...currentDeck.pop()!, hidden: true }];

        setDeck(currentDeck);
        setPlayerHand(pHand);
        setDealerHand(dHand);
        setGameState('playing');
        setResult(null);
        setPayout(0);

        if (isBlackjack(pHand)) {
            const dealerHasBJ = isBlackjack(dHand);
            if (dealerHasBJ) {
                dHand[1].hidden = false;
                setDealerHand([...dHand]);
                setTimeout(() => settleGame(betAmount, 'push', newBalance + betAmount), 1200);
            } else {
                dHand[1].hidden = false;
                setDealerHand([...dHand]);
                const win = betAmount * 2.5;
                setTimeout(() => settleGame(win, 'blackjack', newBalance + win), 1200);
            }
        }
    };

    const handleHit = () => {
        if (gameState !== 'playing') return;
        
        const currentDeck = [...deck];
        const newHand = [...playerHand, currentDeck.pop()!];
        
        setDeck(currentDeck);
        setPlayerHand(newHand);

        if (isBust(newHand)) {
            const dHand = [...dealerHand];
            dHand[1].hidden = false;
            setDealerHand(dHand);
            setTimeout(() => settleGame(0, 'bust', siteUser.balance), 800);
        }
    };

    const handleStand = () => {
        if (gameState !== 'playing') return;
        setGameState('dealerTurn');

        let currentDeck = [...deck];
        let dHand = [...dealerHand];
        dHand[1].hidden = false; 

        let dTotal = handTotal(dHand);
        while (dTotal < 17) {
            dHand.push(currentDeck.pop()!);
            dTotal = handTotal(dHand);
        }

        setDeck(currentDeck);
        setDealerHand(dHand);

        const pTotal = handTotal(playerHand);

        setTimeout(() => {
            if (isBust(dHand)) {
                const win = betAmount * 2;
                settleGame(win, 'win', siteUser.balance + win);
            } else if (dTotal > pTotal) {
                settleGame(0, 'lose', siteUser.balance);
            } else if (pTotal > dTotal) {
                const win = betAmount * 2;
                settleGame(win, 'win', siteUser.balance + win);
            } else {
                settleGame(betAmount, 'push', siteUser.balance + betAmount);
            }
        }, dHand.length * 200 + 500);
    };

    const handleNewGame = () => {
        setGameState('idle');
        setPlayerHand([]);
        setDealerHand([]);
        setResult(null);
        setPayout(0);
    };

    const handleAddBet = (amount: number) => {
        if (gameState !== 'idle' && gameState !== 'ended') return;
        if (gameState === 'ended') {
            handleNewGame();
            setBetAmount(amount);
        } else {
            setBetAmount(prev => prev + amount);
        }
    };

    const clearBet = () => {
        if (gameState === 'idle' || gameState === 'ended') {
            setBetAmount(0);
        }
    };

    return (
        <div className="w-full relative flex flex-col bg-[#112F1C] overflow-hidden" style={{ height: 'calc(100dvh - var(--header-height, 60px))' }}>
            
            {/* ── BACKGROUND FELT & LIGHTING ── */}
            <div className="absolute inset-0 z-0">
                {/* Felt Texture Noise */}
                <div className="absolute inset-0 opacity-[0.25]" 
                     style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
                </div>
                {/* Spotlight Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_rgba(0,0,0,0.85)_100%)] pointer-events-none"></div>
                {/* Center Glow */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/20 blur-[100px] rounded-[100%] pointer-events-none"></div>
            </div>

            {/* ── TOP ELEMENTS (Decorations) ── */}
            <div className="absolute top-0 w-full flex justify-between px-10 py-6 z-10 pointer-events-none">
                {/* Left: Discard Tray / Empty space */}
                <div className="w-32 h-20 border-2 border-white/10 rounded bg-black/20 transform -rotate-12 opacity-50 shadow-inner"></div>
                
                {/* Center: Chip Rack */}
                <div className="w-[300px] h-16 bg-gradient-to-b from-[#b8860b] to-[#8b6508] rounded shadow-[0_10px_20px_rgba(0,0,0,0.8)] border border-[#ffd700]/30 flex p-1.5 gap-1">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-1 bg-black/80 rounded-sm shadow-inner flex flex-col justify-end p-0.5 overflow-hidden">
                            {[...Array(8)].map((_, j) => (
                                <div key={j} className={`w-full h-1.5 mb-0.5 rounded-sm ${i%2===0 ? 'bg-red-700' : 'bg-blue-700'} border-x border-white/30`}></div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Right: Card Shoe */}
                <div className="w-24 h-32 bg-black/90 rounded-md border border-white/20 transform rotate-12 shadow-[15px_15px_30px_rgba(0,0,0,0.8)] relative">
                    <div className="absolute right-0 top-0 w-1/3 h-full bg-red-800/80 skew-x-[-15deg] transform -translate-x-2 border border-white/10 flex items-center justify-center overflow-hidden">
                         <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '4px 4px' }}></div>
                    </div>
                </div>
            </div>

            {/* ── TABLE CENTER (Logo & Cards) ── */}
            <div className="flex-1 w-full relative z-10 flex flex-col items-center justify-center pt-10">
                {/* 724BETS Glowing Logo */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] pointer-events-none text-center">
                    <h1 className="text-[100px] md:text-[140px] font-black italic tracking-tighter text-[#ffd700] opacity-[0.25] drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]">724BETS</h1>
                </div>

                {/* Dealer Area */}
                <div className="w-full flex flex-col items-center mb-16 relative">
                    <ScoreBadge score={handTotal(dealerHand)} show={dealerHand.length > 0 && !dealerHand[1]?.hidden} />
                    <div className="flex justify-center min-h-[140px] relative pl-14">
                        {dealerHand.map((card, i) => (
                            <CardUI key={card.id} card={card} index={i} />
                        ))}
                    </div>
                </div>

                {/* Player Area & Betting Circle */}
                <div className="w-full flex flex-col items-center relative">
                    {/* Betting Circle */}
                    <div className="absolute top-[-30px] w-24 h-24 rounded-full border border-dashed border-[#ffd700]/50 flex items-center justify-center bg-[#ffd700]/5 z-0">
                        <span className="text-[#ffd700]/50 text-[9px] uppercase font-bold tracking-widest absolute top-2">Place Bet</span>
                        
                        {/* Render Stacked Chips if betAmount > 0 */}
                        {betAmount > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center animate-fade-in-up pointer-events-none mt-4">
                                <CasinoChip value={betAmount} stacked={true} />
                            </div>
                        )}
                    </div>

                    <ScoreBadge score={handTotal(playerHand)} show={playerHand.length > 0} />
                    <div className="flex justify-center min-h-[140px] relative pl-14 z-10">
                        {playerHand.map((card, i) => (
                            <CardUI key={card.id} card={card} index={i} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── WOODEN TABLE BORDER ── */}
            <div className="absolute bottom-0 w-full h-[30%] pointer-events-none z-0 overflow-hidden">
                <div className="w-[150%] h-[200px] absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 bg-gradient-to-t from-[#3d1f00] to-[#5c3000] border-t-8 border-[#2e1700] rounded-[50%] shadow-[0_-15px_30px_rgba(0,0,0,0.8)]"></div>
            </div>

            {/* ── BOTTOM CONTROL PANEL (Glassmorphism FPS) ── */}
            <div className="w-full flex justify-center pb-6 z-30 px-4 mt-auto">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-4 flex flex-col md:flex-row items-center gap-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                    
                    {/* Left: Chip Selector */}
                    <div className="flex items-center gap-3 pr-8 md:border-r border-white/10">
                        <CasinoChip value={10} onClick={() => handleAddBet(10)} />
                        <CasinoChip value={50} onClick={() => handleAddBet(50)} />
                        <CasinoChip value={100} onClick={() => handleAddBet(100)} />
                        
                        {(gameState === 'idle' || gameState === 'ended') && betAmount > 0 && (
                            <button onClick={clearBet} className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 font-black text-xs border border-red-500/50 transition-colors flex items-center justify-center ml-2">
                                X
                            </button>
                        )}
                    </div>

                    {/* Middle: Action Buttons */}
                    <div className="flex items-center gap-4 px-4">
                        <button 
                            disabled={betAmount === 0 || (gameState !== 'idle' && gameState !== 'ended')}
                            onClick={handleDeal}
                            className={`w-[80px] h-[80px] rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-lg border-2 ${
                                betAmount > 0 && (gameState === 'idle' || gameState === 'ended') 
                                ? 'bg-gradient-to-b from-gray-300 to-gray-500 border-white hover:scale-105 active:scale-95' 
                                : 'bg-gray-800/50 border-gray-600/50 opacity-50 cursor-not-allowed'
                            }`}
                        >
                            <span className="text-3xl text-black">♠</span>
                            <span className="text-[10px] font-black text-black uppercase tracking-wider">Deal</span>
                        </button>

                        <button 
                            disabled={gameState !== 'playing'}
                            onClick={handleHit}
                            className={`w-[80px] h-[80px] rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-lg border-2 ${
                                gameState === 'playing' 
                                ? 'bg-gradient-to-b from-green-400 to-green-600 border-green-200 hover:scale-105 active:scale-95' 
                                : 'bg-gray-800/50 border-gray-600/50 opacity-50 cursor-not-allowed'
                            }`}
                        >
                            <span className="text-3xl text-white">✋</span>
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">Hit</span>
                        </button>

                        <button 
                            disabled={gameState !== 'playing'}
                            onClick={handleStand}
                            className={`w-[80px] h-[80px] rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-lg border-2 ${
                                gameState === 'playing' 
                                ? 'bg-gradient-to-b from-red-500 to-red-700 border-red-200 hover:scale-105 active:scale-95' 
                                : 'bg-gray-800/50 border-gray-600/50 opacity-50 cursor-not-allowed'
                            }`}
                        >
                            <span className="text-3xl text-white">🛑</span>
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">Stand</span>
                        </button>
                    </div>

                    {/* Right: Player Balance */}
                    <div className="pl-8 md:border-l border-white/10 flex flex-col items-center justify-center min-w-[150px]">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Player</span>
                        <div className="bg-black/60 px-4 py-2 rounded-full border border-[#ffd700]/30 shadow-inner">
                            <span className="text-[#ffd700] font-black text-lg">${siteUser ? siteUser.balance.toFixed(2) : '0.00'}</span>
                        </div>
                        {betAmount > 0 && (
                            <span className="text-white text-[10px] font-bold mt-2 bg-white/10 px-2 py-0.5 rounded-full">
                                Bet: ${betAmount.toFixed(2)}
                            </span>
                        )}
                    </div>

                </div>
            </div>

            {/* ── CINEMATIC RESULT BANNER ── */}
            {gameState === 'ended' && result && (
                <div 
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[4px] animate-fade-in cursor-pointer"
                    onClick={handleNewGame}
                >
                    <div className={`px-16 py-10 rounded-[2rem] border-2 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center transform transition-transform ${
                        result === 'win' || result === 'blackjack' ? 'bg-black/60 border-[#ffd700]/50 shadow-[#ffd700]/20' : 
                        result === 'push' ? 'bg-black/60 border-gray-400/50 shadow-gray-500/20' : 
                        'bg-black/80 border-red-500/50 shadow-red-500/20'
                    }`}>
                        
                        {/* Confetti */}
                        {(result === 'win' || result === 'blackjack') && (
                            <div className="absolute inset-0 opacity-80 pointer-events-none overflow-hidden rounded-[2rem]">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="absolute top-[-20%] w-3 h-8 bg-green-500" 
                                         style={{ left: `${Math.random()*100}%`, animation: `confetti-fall ${1 + Math.random()}s linear infinite` }}></div>
                                ))}
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="absolute top-[-20%] w-4 h-4 rounded-full bg-[#ffd700]" 
                                         style={{ left: `${Math.random()*100}%`, animation: `confetti-fall ${1.5 + Math.random()}s linear infinite` }}></div>
                                ))}
                            </div>
                        )}

                        <h2 className={`text-5xl md:text-8xl font-black uppercase tracking-tighter mb-1 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] ${
                            result === 'win' || result === 'blackjack' ? 'text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#b8860b]' : 
                            result === 'push' ? 'text-gray-300' : 'text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700'
                        }`}>
                            {result === 'win' ? 'YOU WIN' : 
                             result === 'blackjack' ? 'BLACKJACK' :
                             result === 'push' ? 'PUSH' :
                             result === 'bust' ? 'BUST' : 'DEALER WINS'}
                        </h2>
                        
                        {payout > 0 && (
                            <div className="text-3xl md:text-5xl text-green-400 font-black tracking-widest mt-2 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                                +${payout.toFixed(2)}
                            </div>
                        )}
                        
                        <div className="text-white/40 text-xs font-bold uppercase tracking-widest mt-8 animate-pulse">
                            Tap anywhere to continue
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
