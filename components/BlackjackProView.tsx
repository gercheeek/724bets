import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import OriginalGameContainer from './OriginalGameContainer';

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
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${colorClass} shadow-[0_5px_15px_rgba(0,0,0,0.5)] border-[3px] border-white/20 flex items-center justify-center relative cursor-pointer ${isSelected ? 'ring-2 ring-[#ffd700] ring-offset-2 ring-offset-transparent transform -translate-y-2' : ''} transition-all`}>
            <div className="absolute inset-1 rounded-full border-[2px] md:border-[3px] border-dashed border-white/40"></div>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="text-white font-black text-[10px] md:text-xs drop-shadow-md">{value}</span>
            </div>
        </div>
    );

    if (stacked) {
        const numChips = Math.min(Math.max(Math.floor(value / 10), 1), 6);
        return (
            <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                {Array.from({ length: numChips }).map((_, i) => (
                    <div key={i} className="absolute" style={{ bottom: `${i * 5}px`, zIndex: i }}>
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${colorClass} shadow-[0_4px_5px_rgba(0,0,0,0.5)] border-[2px] border-white/20 flex items-center justify-center relative`}>
                            <div className="absolute inset-1 rounded-full border-[3px] border-dashed border-white/40"></div>
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                <span className="text-white font-black text-[10px] md:text-xs drop-shadow-md">{value}</span>
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
    const rot = (index % 2 === 0 ? -4 : 6) + (index * 2);

    if (card.hidden) {
        return (
            <div className="relative flex-shrink-0 -ml-14 shadow-[0_15px_35px_rgba(0,0,0,0.6)]" style={{ width: '90px', height: '135px', zIndex: index }}>
                <div className="w-full h-full rounded-md flex flex-col items-center justify-center border-4 border-[#ffd700]/30 overflow-hidden bg-gradient-to-br from-[#111] to-black relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffd700 1px, transparent 0)', backgroundSize: '8px 8px' }}></div>
                    <div className="text-2xl font-black text-[#ffd700]/50 italic tracking-tighter z-10 filter drop-shadow-md transform -rotate-12">724</div>
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

const ScoreBadge: React.FC<{ score: number; show: boolean }> = ({ score, show }) => {
    if (!show || score === 0) return null;
    return (
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 bg-black/80 border border-white/20 text-white font-black text-sm px-2.5 py-1 rounded shadow-lg backdrop-blur-sm z-20">
            {score}
        </div>
    );
};

// ─────────────────────────── MAIN GAME VIEW ──────────────────────────────
export default function BlackjackProView({ siteUser, setSiteUser, onAuthRequired, onNavigate }: any) {
    const [betAmount, setBetAmount] = useState(0);
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'dealerTurn' | 'ended'>('idle');
    const [result, setResult] = useState<'win' | 'lose' | 'push' | 'blackjack' | 'bust' | null>(null);
    const [payout, setPayout] = useState(0);

    useEffect(() => { setDeck(shuffleDeck(buildDeck())); }, []);

    const handleNewGame = () => {
        setGameState('idle');
        setPlayerHand([]);
        setDealerHand([]);
        setResult(null);
        setPayout(0);
    };

    const handleAddBet = (amount: number) => {
        if (!siteUser) return onAuthRequired();
        if (gameState !== 'idle' && gameState !== 'ended') return;
        if (gameState === 'ended') {
            handleNewGame();
            setBetAmount(amount);
        } else {
            setBetAmount(prev => prev + amount);
        }
    };

    const handleDeal = () => {
        if (!siteUser) return onAuthRequired();
        if (betAmount <= 0) return;
        if (siteUser.balance < betAmount) { alert("Yetersiz bakiye!"); return; }

        const newBalance = siteUser.balance - betAmount;
        setSiteUser({ ...siteUser, balance: newBalance });
        if (!siteUser.id.toString().startsWith('guest_')) {
            supabase.from('members').update({ balance: newBalance }).eq('id', siteUser.id).then();
        }

        let currentDeck = [...deck];
        if (currentDeck.length < 20) currentDeck = shuffleDeck(buildDeck());

        const pHand = [currentDeck.pop()!, currentDeck.pop()!];
        const dHand = [currentDeck.pop()!, { ...currentDeck.pop()!, hidden: true }];

        setDeck(currentDeck);
        setPlayerHand(pHand);
        setDealerHand(dHand);
        setGameState('playing');
        setResult(null);
        setPayout(0);

        if (isBlackjack(pHand)) {
            if (isBlackjack(dHand)) {
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
            if (isBust(dHand)) settleGame(betAmount * 2, 'win', siteUser.balance + betAmount * 2);
            else if (dTotal > pTotal) settleGame(0, 'lose', siteUser.balance);
            else if (pTotal > dTotal) settleGame(betAmount * 2, 'win', siteUser.balance + betAmount * 2);
            else settleGame(betAmount, 'push', siteUser.balance + betAmount);
        }, dHand.length * 200 + 500);
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
        }
    };

    const leftControls = (
        <div className="flex items-center gap-2 md:gap-3 justify-center md:justify-start w-full">
            <CasinoChip value={10} onClick={() => handleAddBet(10)} />
            <CasinoChip value={50} onClick={() => handleAddBet(50)} />
            <CasinoChip value={100} onClick={() => handleAddBet(100)} />
            
            {(gameState === 'idle' || gameState === 'ended') && betAmount > 0 && (
                <button onClick={() => setBetAmount(0)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 font-black text-[10px] md:text-xs border border-red-500/50 transition-colors flex items-center justify-center ml-1 md:ml-2">
                    X
                </button>
            )}
        </div>
    );

    const centerControls = (
        <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4 justify-center shrink-0">
            <button 
                disabled={betAmount === 0 || (gameState !== 'idle' && gameState !== 'ended')}
                onClick={handleDeal}
                className={`w-[60px] h-[60px] md:w-[70px] md:h-[70px] rounded-full flex flex-col items-center justify-center gap-0.5 md:gap-1 transition-all shadow-lg border-2 ${
                    betAmount > 0 && (gameState === 'idle' || gameState === 'ended') 
                    ? 'bg-gradient-to-b from-gray-200 to-gray-400 border-white hover:scale-105 active:scale-95 text-black' 
                    : 'bg-gray-800/50 border-gray-600/50 opacity-50 cursor-not-allowed text-gray-400'
                }`}
            >
                <span className="text-xl md:text-2xl">♠</span>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider">Deal</span>
            </button>

            <button 
                disabled={gameState !== 'playing'}
                onClick={handleHit}
                className={`w-[60px] h-[60px] md:w-[70px] md:h-[70px] rounded-full flex flex-col items-center justify-center gap-0.5 md:gap-1 transition-all shadow-lg border-2 ${
                    gameState === 'playing' 
                    ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 border-emerald-300 hover:scale-105 active:scale-95 text-white' 
                    : 'bg-gray-800/50 border-gray-600/50 opacity-50 cursor-not-allowed text-gray-400'
                }`}
            >
                <span className="text-xl md:text-2xl">✋</span>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider">Hit</span>
            </button>

            <button 
                disabled={gameState !== 'playing'}
                onClick={handleStand}
                className={`w-[60px] h-[60px] md:w-[70px] md:h-[70px] rounded-full flex flex-col items-center justify-center gap-0.5 md:gap-1 transition-all shadow-lg border-2 ${
                    gameState === 'playing' 
                    ? 'bg-gradient-to-b from-rose-500 to-rose-700 border-rose-300 hover:scale-105 active:scale-95 text-white' 
                    : 'bg-gray-800/50 border-gray-600/50 opacity-50 cursor-not-allowed text-gray-400'
                }`}
            >
                <span className="text-xl md:text-2xl">🛑</span>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider">Stand</span>
            </button>
        </div>
    );

    const rightControls = (
        <div className="flex flex-col items-end flex-1 justify-end">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Bakiye</span>
            <div className="bg-black/80 px-5 py-2.5 rounded-full border border-[#ffd700]/30 shadow-inner flex items-center gap-2">
                <span className="text-[#ffd700] font-black text-lg">
                    ${siteUser ? siteUser.balance.toFixed(2) : '0.00'}
                </span>
            </div>
            {betAmount > 0 && (
                <span className="text-white text-[10px] font-bold mt-2 bg-white/10 px-2 py-0.5 rounded-full absolute -top-8 right-6">
                    Bet: ${betAmount.toFixed(2)}
                </span>
            )}
        </div>
    );

    return (
        <OriginalGameContainer 
            title="Blackjack PRO" 
            siteUser={siteUser}
            onNavigate={onNavigate}
            leftControls={leftControls}
            centerControls={centerControls}
            rightControls={rightControls}
        >
            
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
                <div className="absolute top-[-30px] w-24 h-24 rounded-full border border-dashed border-[#ffd700]/30 flex items-center justify-center bg-[#ffd700]/5 z-0">
                    <span className="text-[#ffd700]/30 text-[9px] uppercase font-bold tracking-widest absolute top-2">Place Bet</span>
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

            {/* Cinematic Banner */}
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
                            <div className="text-3xl md:text-5xl text-emerald-400 font-black tracking-widest mt-2 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]">
                                +${payout.toFixed(2)}
                            </div>
                        )}
                        <div className="text-white/40 text-xs font-bold uppercase tracking-widest mt-8 animate-pulse">
                            Tap anywhere to continue
                        </div>
                    </div>
                </div>
            )}
        </OriginalGameContainer>
    );
}
