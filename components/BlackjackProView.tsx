import React, { useState, useEffect, useCallback } from 'react';
import { Info, ShieldCheck, Settings, BarChart2, Volume2 } from 'lucide-react';
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
    for (let i = 0; i < 4; i++) { // 4 decks for true casino feel
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

// ─────────────────────────── CARD UI COMPONENT ──────────────────────────────
const CardUI: React.FC<{ card: Card; delay?: number; animate?: boolean }> = ({ card, delay = 0, animate = true }) => {
    const [show, setShow] = useState(!animate);
    
    useEffect(() => {
        if (!animate) { setShow(true); return; }
        const t = setTimeout(() => setShow(true), delay);
        return () => clearTimeout(t);
    }, [animate, delay]);

    const isRed = RED_SUITS.includes(card.suit);

    if (card.hidden) {
        return (
            <div className="relative flex-shrink-0 -ml-8 first:ml-0" style={{ width: '80px', height: '116px' }}>
                <div className="w-full h-full rounded-lg flex items-center justify-center bg-gradient-to-br from-[#1A1D29] to-[#0F121A] border-2 border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                    <div className="text-3xl opacity-20">🂠</div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative flex-shrink-0 -ml-8 first:ml-0"
            style={{
                width: '80px', height: '116px',
                transform: show ? 'translateY(0) rotateY(0)' : 'translateY(-40px) rotateY(90deg)',
                opacity: show ? 1 : 0,
                transition: 'all 0.35s cubic-bezier(0.34,1.3,0.64,1)',
            }}
        >
            <div className="w-full h-full rounded-lg flex flex-col justify-between p-2 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.4)] border border-gray-200">
                <div className="flex flex-col items-start leading-none">
                    <span className="font-black text-lg leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.rank}</span>
                    <span className="text-sm leading-none mt-1" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.suit}</span>
                </div>
                <div className="text-center text-4xl leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ color: isRed ? '#dc2626' : '#111' }}>
                    {card.suit}
                </div>
                <div className="flex flex-col items-end leading-none rotate-180">
                    <span className="font-black text-lg leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.rank}</span>
                    <span className="text-sm leading-none mt-1" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.suit}</span>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────── MAIN GAME VIEW ──────────────────────────────
export default function BlackjackProView({ siteUser, setSiteUser, onAuthRequired }: any) {
    const [betAmount, setBetAmount] = useState('10.00');
    
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'dealerTurn' | 'ended'>('idle');
    const [result, setResult] = useState<'win' | 'lose' | 'push' | 'blackjack' | 'bust' | null>(null);
    const [payout, setPayout] = useState(0);

    // Initial shuffle
    useEffect(() => {
        setDeck(shuffleDeck(buildDeck()));
    }, []);

    const logBet = (bet: number, win: number, resStr: string) => {
        try {
            const logs = JSON.parse(localStorage.getItem('site_blackjack_bets') || '[]');
            logs.push({
                id: Date.now().toString(),
                userId: siteUser.id,
                username: siteUser.username,
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
            logBet(parseFloat(betAmount), winAmount, finalResult);
        }
    };

    const handleDeal = () => {
        if (!siteUser) {
            if (onAuthRequired) onAuthRequired();
            return;
        }
        const amt = parseFloat(betAmount);
        if (isNaN(amt) || amt <= 0) return;
        if (siteUser.balance < amt) {
            alert("Yetersiz bakiye!");
            return;
        }

        // Deduct bet immediately
        const newBalance = siteUser.balance - amt;
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

        // Check immediate blackjack
        if (isBlackjack(pHand)) {
            const dealerHasBJ = isBlackjack(dHand); // Real dealer BJ check would peek, we just check full hand
            if (dealerHasBJ) {
                // Push
                dHand[1].hidden = false;
                setDealerHand([...dHand]);
                settleGame(amt, 'push', newBalance + amt);
            } else {
                // Win 2.5x (Blackjack pays 3:2, so 2.5x return of bet)
                dHand[1].hidden = false;
                setDealerHand([...dHand]);
                const win = amt * 2.5;
                settleGame(win, 'blackjack', newBalance + win);
            }
        }
    };

    const handleHit = () => {
        if (gameState !== 'playing') return;
        
        const currentDeck = [...deck];
        const newCard = currentDeck.pop()!;
        const newHand = [...playerHand, newCard];
        
        setDeck(currentDeck);
        setPlayerHand(newHand);

        if (isBust(newHand)) {
            // Player busts, loses immediately
            const dHand = [...dealerHand];
            dHand[1].hidden = false;
            setDealerHand(dHand);
            
            settleGame(0, 'bust', siteUser.balance);
        }
    };

    const handleStand = () => {
        if (gameState !== 'playing') return;
        setGameState('dealerTurn');

        // Play out dealer AI
        let currentDeck = [...deck];
        let dHand = [...dealerHand];
        dHand[1].hidden = false; // Reveal hidden card

        let dTotal = handTotal(dHand);
        while (dTotal < 17) {
            dHand.push(currentDeck.pop()!);
            dTotal = handTotal(dHand);
        }

        setDeck(currentDeck);
        setDealerHand(dHand);

        const amt = parseFloat(betAmount);
        const pTotal = handTotal(playerHand);

        if (isBust(dHand)) {
            // Dealer busts, Player wins 2x
            const win = amt * 2;
            settleGame(win, 'win', siteUser.balance + win);
        } else if (dTotal > pTotal) {
            // Dealer wins
            settleGame(0, 'lose', siteUser.balance);
        } else if (pTotal > dTotal) {
            // Player wins 2x
            const win = amt * 2;
            settleGame(win, 'win', siteUser.balance + win);
        } else {
            // Push
            settleGame(amt, 'push', siteUser.balance + amt);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-60px)] bg-[#0F121A] text-gray-200">
            {/* Left Sidebar (Bet Controls) */}
            <div className="w-full lg:w-[320px] bg-[#1A1D29] border-r border-[#262A36] flex flex-col p-4 z-10 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-gray-400 text-xs font-semibold">Bahis Miktarı</label>
                        <span className="text-gray-500 text-[10px] font-bold">
                            {siteUser ? `$${siteUser.balance.toFixed(2)}` : '$0.00'}
                        </span>
                    </div>
                    <div className="flex bg-[#12141C] rounded-lg border border-[#262A36] overflow-hidden focus-within:border-gray-500 transition-colors">
                        <div className="pl-3 pr-2 py-2.5 flex items-center justify-center border-r border-[#262A36]">
                            <span className="text-gray-500 text-sm font-bold">$</span>
                        </div>
                        <input 
                            type="number" 
                            value={betAmount} 
                            onChange={(e) => setBetAmount(e.target.value)}
                            step="1"
                            min="1"
                            disabled={gameState === 'playing' || gameState === 'dealerTurn'}
                            className="bg-transparent flex-1 text-white px-3 text-sm font-bold outline-none disabled:opacity-50"
                        />
                        <button 
                            disabled={gameState === 'playing' || gameState === 'dealerTurn'}
                            onClick={() => setBetAmount((parseFloat(betAmount)/2).toFixed(2))}
                            className="px-3 hover:bg-white/5 transition-colors text-gray-400 text-xs font-bold border-l border-[#262A36] disabled:opacity-50"
                        >
                            1/2
                        </button>
                        <button 
                            disabled={gameState === 'playing' || gameState === 'dealerTurn'}
                            onClick={() => setBetAmount((parseFloat(betAmount)*2).toFixed(2))}
                            className="px-3 hover:bg-white/5 transition-colors text-gray-400 text-xs font-bold border-l border-[#262A36] disabled:opacity-50"
                        >
                            2x
                        </button>
                    </div>
                </div>

                {gameState === 'idle' || gameState === 'ended' ? (
                    <button 
                        onClick={handleDeal}
                        className="w-full bg-[#2a8bf2] hover:bg-[#1258ef] text-white font-black py-4 rounded-lg shadow-[0_4px_15px_rgba(42,139,242,0.3)] transition-colors uppercase text-sm mb-4"
                    >
                        BAHİS YAP & DAĞIT
                    </button>
                ) : (
                    <div className="flex gap-2 mb-4">
                        <button 
                            onClick={handleHit}
                            disabled={gameState !== 'playing'}
                            className="flex-1 bg-[#27D26D] hover:bg-[#20b75a] text-[#0F121A] font-black py-4 rounded-lg shadow-[0_4px_15px_rgba(39,210,109,0.3)] transition-colors uppercase text-sm disabled:opacity-50"
                        >
                            KART İSTE (HIT)
                        </button>
                        <button 
                            onClick={handleStand}
                            disabled={gameState !== 'playing'}
                            className="flex-1 bg-[#EF4444] hover:bg-[#dc2626] text-white font-black py-4 rounded-lg shadow-[0_4px_15px_rgba(239,68,68,0.3)] transition-colors uppercase text-sm disabled:opacity-50"
                        >
                            DUR (STAND)
                        </button>
                    </div>
                )}

                <div className="mt-auto pt-4 flex justify-between items-center text-gray-500 px-2">
                    <div className="flex gap-4">
                        <Settings className="w-4 h-4 hover:text-gray-300 cursor-pointer transition-colors" />
                        <BarChart2 className="w-4 h-4 hover:text-gray-300 cursor-pointer transition-colors" />
                        <Volume2 className="w-4 h-4 hover:text-gray-300 cursor-pointer transition-colors" />
                    </div>
                </div>
            </div>

            {/* Right Area (Game Table) */}
            <div className="flex-1 relative flex flex-col items-center justify-between p-8 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#132e18] via-[#0b190f] to-[#0F121A]">
                
                {/* Top Info */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                    <Info className="w-5 h-5 text-gray-500" />
                    <span className="text-white font-bold tracking-widest text-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#2a8bf2]"></div>
                        Blackjack PRO
                    </span>
                </div>
                
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#1A1D29] px-3 py-1.5 rounded-full border border-white/5">
                    <ShieldCheck className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 font-semibold text-xs">Adil Oyun</span>
                </div>

                {/* Dealer Area */}
                <div className="flex flex-col items-center mt-12 w-full">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-black/40 px-4 py-1.5 rounded-full border border-white/10">
                            <span className="text-gray-400 font-semibold text-sm">Kasa (Dealer)</span>
                            {dealerHand.length > 0 && !dealerHand[1]?.hidden && (
                                <span className="ml-2 text-white font-black">{handTotal(dealerHand)}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center min-h-[140px]">
                        {dealerHand.map((card, i) => (
                            <CardUI key={card.id} card={card} delay={i * 200} />
                        ))}
                    </div>
                </div>

                {/* Center Result Info */}
                <div className="h-24 flex items-center justify-center my-4">
                    {gameState === 'ended' && result && (
                        <div className="animate-fade-in-up text-center">
                            <h2 className={`text-4xl font-black uppercase tracking-wider mb-2 ${
                                result === 'win' || result === 'blackjack' ? 'text-[#27D26D]' : 
                                result === 'push' ? 'text-gray-400' : 'text-red-500'
                            }`}>
                                {result === 'win' ? 'KAZANDIN!' : 
                                 result === 'blackjack' ? 'BLACKJACK!' :
                                 result === 'push' ? 'BERABERE (PUSH)' :
                                 result === 'bust' ? 'BUST OLDUN' : 'KAYBETTİN'}
                            </h2>
                            {payout > 0 && (
                                <div className="text-2xl text-white font-black">
                                    +{payout.toFixed(2)} $
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Player Area */}
                <div className="flex flex-col items-center mb-8 w-full">
                    <div className="flex justify-center min-h-[140px] mb-4">
                        {playerHand.map((card, i) => (
                            <CardUI key={card.id} card={card} delay={i * 200} />
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-black/40 px-4 py-1.5 rounded-full border border-[#2a8bf2]/30 shadow-[0_0_15px_rgba(42,139,242,0.1)]">
                            <span className="text-gray-400 font-semibold text-sm">Eliniz</span>
                            {playerHand.length > 0 && (
                                <span className="ml-2 text-white font-black">{handTotal(playerHand)}</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
