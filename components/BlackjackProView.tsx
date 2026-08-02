import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Zap, Hand, Copy, Coins, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { soundEngine } from '../utils/SoundEngine';

// ─────────────────────────── CARD ENGINE ────────────────────────────────────
type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card { suit: Suit; rank: Rank; hidden?: boolean; id: string; animating?: boolean; }

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RED_SUITS: Suit[] = ['♥', '♦'];

function buildShoe(numDecks: number = 6): Card[] {
    const deck: Card[] = [];
    for (let d = 0; d < numDecks; d++) {
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

function isSoft(hand: Card[]): boolean {
    let total = 0;
    let aces = 0;
    for (const card of hand) {
        if (card.hidden) continue;
        total += cardValue(card.rank);
        if (card.rank === 'A') aces++;
    }
    while (total > 21 && aces > 0) { total -= 10; aces--; }
    return aces > 0;
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

function handDisplayTotal(hand: Card[]): number | string {
    let total = 0;
    let aces = 0;
    for (const card of hand) {
        if (card.hidden || card.animating) continue;
        total += cardValue(card.rank);
        if (card.rank === 'A') aces++;
    }
    if (aces === 0) return total;
    
    let reducedTotal = total;
    let currentAces = aces;
    while (reducedTotal > 21 && currentAces > 0) { reducedTotal -= 10; currentAces--; }
    
    if (currentAces > 0 && reducedTotal !== 21) {
        return `${reducedTotal - 10} / ${reducedTotal}`;
    }
    return reducedTotal;
}

function isBust(hand: Card[]): boolean { return handTotal(hand) > 21; }
function isBlackjack(hand: Card[]): boolean {
    return hand.length === 2 && handTotal(hand) === 21;
}

// ─────────────────────────── CARD UI COMPONENT ──────────────────────────────
const CardBackDesign = () => (
    <div className="absolute inset-0 rounded-lg overflow-hidden bg-[#0A0D14] border-[1px] border-[#00E5FF]/20 shadow-[0_4px_12px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,1)] flex flex-col items-center justify-center">
        {/* Deep background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(198,255,0,0.06)_0%,_rgba(0,229,255,0.03)_40%,_transparent_70%)]"></div>
        
        {/* Glossy reflection (top half) */}
        <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent -rotate-12 pointer-events-none transform-gpu"></div>
        
        {/* Minimalist Centered Logo */}
        <div className="relative z-10 flex flex-col items-center justify-center scale-90 md:scale-100 mt-2">
            {/* The Green Clover */}
            <div className="w-12 h-12 md:w-16 md:h-16 mb-2">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-[#c6ff00] drop-shadow-[0_0_12px_rgba(198,255,0,0.5)]">
                    <path d="M 50,45 C 35,25 40,10 50,18 C 60,10 65,25 50,45 Z" />
                    <path d="M 47,48 C 25,35 15,45 25,55 C 15,65 25,75 47,48 Z" />
                    <path d="M 53,48 C 75,35 85,45 75,55 C 85,65 75,75 53,48 Z" />
                    <path d="M 50,50 C 45,65 40,75 35,70 C 45,70 50,60 50,50 Z" />
                </svg>
            </div>
            
            {/* The Text */}
            <div className="flex flex-col items-center justify-center leading-none drop-shadow-2xl">
                <div className="flex items-center text-[18px] md:text-[24px] font-black tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <span className="text-white drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">724</span>
                    <span className="text-[#00E5FF] ml-[1px] drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">bets</span>
                </div>
            </div>
        </div>
    </div>
);

const CardUI: React.FC<{ card: Card; index: number; animate?: boolean; delay?: number }> = ({ card, index, animate = true, delay = 0 }) => {
    const [show, setShow] = useState(!animate);
    
    useEffect(() => {
        if (!animate) { setShow(true); return; }
        const t = setTimeout(() => setShow(true), delay);
        return () => clearTimeout(t);
    }, [animate, delay]);

    const isRed = RED_SUITS.includes(card.suit);

    if (card.hidden) {
        return (
            <div className="relative flex-shrink-0 -ml-12 md:-ml-16 shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-all" style={{ width: 'clamp(80px, 18vw, 120px)', height: 'clamp(115px, 26vw, 175px)', zIndex: index }}>
                <CardBackDesign />
            </div>
        );
    }

    return (
        <div
            className="relative flex-shrink-0 -ml-12 md:-ml-16 transition-all"
            style={{
                width: 'clamp(80px, 18vw, 120px)', height: 'clamp(115px, 26vw, 175px)',
                transform: show ? `translate(0, 0) scale(1) rotate(0deg)` : 'translate(30vw, -40vh) scale(0.2) rotate(-180deg)',
                opacity: show ? 1 : 0,
                zIndex: index,
                transition: 'all 0.7s cubic-bezier(0.34, 1.1, 0.64, 1)',
            }}
        >
            <div className="w-full h-full rounded-lg flex flex-col justify-between p-1.5 md:p-2 bg-gradient-to-br from-white to-gray-100 shadow-[0_8px_20px_rgba(0,0,0,0.5)] border border-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.8)_0%,_transparent_60%)] pointer-events-none"></div>
                <div className="flex flex-col items-start leading-none relative z-10">
                    <span className="font-bold text-lg md:text-2xl leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.rank}</span>
                    <span className="text-sm md:text-xl leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.suit}</span>
                </div>
                <div className="text-center text-3xl md:text-5xl leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ color: isRed ? '#dc2626' : '#111' }}>
                    {card.suit}
                </div>
                <div className="flex flex-col items-end leading-none rotate-180">
                    <span className="font-bold text-lg md:text-2xl leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.rank}</span>
                    <span className="text-sm md:text-xl leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.suit}</span>
                </div>
            </div>
        </div>
    );
};

const ScoreBadge: React.FC<{ score: number | string; show: boolean; position?: 'top' | 'bottom' }> = ({ score, show, position = 'top' }) => {
    if (!show || score === 0) return null;
    const posClass = position === 'top' ? '-top-10' : '-bottom-10';
    return (
        <div className={`absolute ${posClass} left-1/2 -translate-x-1/2 bg-[#c6ff00] text-black font-black text-sm md:text-base px-3 py-1 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(198,255,0,0.5)] z-40 whitespace-nowrap min-w-[32px] border border-white/20`}>
            {score}
        </div>
    );
};

// ─────────────────────────── MAIN GAME VIEW ──────────────────────────────
interface PlayerHand {
    id: string;
    cards: Card[];
    bet: number;
    status: 'playing' | 'stand' | 'bust' | 'blackjack' | 'settled';
    result: 'win' | 'lose' | 'push' | 'blackjack' | 'bust' | null;
    payout: number;
    hasDoubled: boolean;
    isSplitAce: boolean;
}

export default function BlackjackProView({ siteUser, setSiteUser, onAuthRequired, onNavigate }: any) {
    const { t } = useTranslation();
    const [betAmountStr, setBetAmountStr] = useState<string>('2.00');
    const [deck, setDeck] = useState<Card[]>([]);
    
    const [playerHands, setPlayerHands] = useState<PlayerHand[]>([]);
    const [activeHandIndex, setActiveHandIndex] = useState<number>(0);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    
    const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'ended'>('betting');
    const [isDealing, setIsDealing] = useState(false);
    const [showRules, setShowRules] = useState(false);
    
    useEffect(() => { setDeck(shuffleDeck(buildShoe(6))); }, []);

    useEffect(() => {
        const handleOpenRules = () => setShowRules(true);
        window.addEventListener('open-game-rules', handleOpenRules);
        return () => window.removeEventListener('open-game-rules', handleOpenRules);
    }, []);

    // Active hand reference
    const activeHand = playerHands[activeHandIndex];

    const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9.]/g, '');
        setBetAmountStr(val);
    };

    const handleHalfBet = () => {
        const current = parseFloat(betAmountStr) || 0;
        setBetAmountStr(Math.max(0.1, current / 2).toFixed(2));
    };

    const handleDoubleBet = () => {
        const current = parseFloat(betAmountStr) || 0;
        setBetAmountStr((current * 2).toFixed(2));
    };

    const deductBalance = (betAmount: number): boolean => {
        if (siteUser && (siteUser && siteUser.balance < betAmount)) { alert("Yetersiz bakiye!"); return false; }
        if (siteUser && !String(siteUser.id).startsWith('guest_')) {
            const newBalance = siteUser.balance - betAmount;
            setSiteUser({ ...siteUser, balance: newBalance });
            supabase.from('members').update({ balance: newBalance }).eq('id', siteUser.id).then();
        }
        return true;
    };

    const addBalance = (amount: number) => {
        if (!siteUser || amount <= 0) return;
        const newBalance = siteUser.balance + amount;
        setSiteUser({ ...siteUser, balance: newBalance });
        if (!siteUser.id.toString().startsWith('guest_')) {
            supabase.from('members').update({ balance: newBalance }).eq('id', siteUser.id).then();
        }
    };

    const nextTurn = (hands: PlayerHand[], currentIndex: number, currDeck: Card[], dHand: Card[]) => {
        let nextIndex = currentIndex + 1;
        
        // Skip over finished hands (e.g., blackjack or bust)
        while (nextIndex < hands.length && hands[nextIndex].status !== 'playing') {
            nextIndex++;
        }

        if (nextIndex < hands.length) {
            setActiveHandIndex(nextIndex);
            setIsDealing(false);
        } else {
            // All player hands finished, Dealer Turn
            processDealerTurn(currDeck, hands, dHand);
        }
    };

    const handleDeal = () => {
        soundEngine.init();
        soundEngine.playBetSound();
        const betAmount = parseFloat(betAmountStr);
        if (isNaN(betAmount) || betAmount <= 0) return;
        if (!deductBalance(betAmount)) return;

        let currentDeck = [...deck];
        // If shoe is running low, reshuffle
        if (currentDeck.length < 52) currentDeck = shuffleDeck(buildShoe(6));

        // Deal initial cards
        let pCards = [currentDeck.pop()!, currentDeck.pop()!];
        let dCards = [currentDeck.pop()!, { ...currentDeck.pop()!, hidden: true }];

        // Demo Mode Rigging - High chance of getting Blackjack or 20
        if (String(siteUser?.id).startsWith('guest_') && Math.random() < 0.6) {
            const tenCard = { suit: '♠', rank: 'K', color: 'text-zinc-800' };
            const aceCard = { suit: '♥', rank: 'A', color: 'text-red-500' };
            const tenCard2 = { suit: '♦', rank: 'J', color: 'text-red-500' };
            
            if (Math.random() < 0.5) {
                pCards = [tenCard, aceCard]; // Blackjack!
            } else {
                pCards = [tenCard, tenCard2]; // 20!
            }
            dCards = [
                { suit: '♣', rank: '7', color: 'text-zinc-800' },
                { suit: '♦', rank: '8', color: 'text-red-500', hidden: true }
            ];
        }

        const newHand: PlayerHand = {
            id: Math.random().toString(),
            cards: pCards,
            bet: betAmount,
            status: 'playing',
            result: null,
            payout: 0,
            hasDoubled: false,
            isSplitAce: false
        };

        const hands = [newHand];
        setDeck(currentDeck);
        setDealerHand(dCards);
        setIsDealing(true);
        setActiveHandIndex(0);
        
        // Check initial blackjack
        if (isBlackjack(pCards)) {
            newHand.status = 'blackjack';
            setPlayerHands(hands);
            setGameState('playing');
            setTimeout(() => {
                processDealerTurn(currentDeck, hands, dCards);
            }, 1000);
        } else {
            setPlayerHands(hands);
            setGameState('playing');
            setTimeout(() => setIsDealing(false), 1500);
        }
    };

    const handleHit = () => {
        soundEngine.init();
        soundEngine.playPopSound();
        if (gameState !== 'playing' || isDealing || !activeHand) return;
        setIsDealing(true);
        
        let currentDeck = [...deck];
        const newCard = currentDeck.pop()!;
        const updatedHand = { ...activeHand, cards: [...activeHand.cards, newCard] };
        
        const newHands = [...playerHands];
        newHands[activeHandIndex] = updatedHand;

        setDeck(currentDeck);
        setPlayerHands(newHands);

        if (isBust(updatedHand.cards)) {
            updatedHand.status = 'bust';
            soundEngine.playCrashSound();
            setTimeout(() => {
                nextTurn(newHands, activeHandIndex, currentDeck, dealerHand);
            }, 1200);
        } else if (updatedHand.isSplitAce) {
            // Split aces only get 1 card
            updatedHand.status = 'stand';
            setTimeout(() => {
                nextTurn(newHands, activeHandIndex, currentDeck, dealerHand);
            }, 1200);
        } else {
            setTimeout(() => setIsDealing(false), 600);
        }
    };

    const handleStand = () => {
        if (gameState !== 'playing' || isDealing || !activeHand) return;
        setIsDealing(true);
        
        const updatedHand = { ...activeHand, status: 'stand' as const };
        const newHands = [...playerHands];
        newHands[activeHandIndex] = updatedHand;
        
        setPlayerHands(newHands);
        setTimeout(() => {
            nextTurn(newHands, activeHandIndex, deck, dealerHand);
        }, 500);
    };

    const handleDouble = async () => {
        if (gameState !== 'playing' || isDealing || !activeHand || activeHand.cards.length !== 2) return;
        if (!deductBalance(activeHand.bet)) return;

        setIsDealing(true);
        soundEngine.playPopSound();
        
        let currentDeck = [...deck];
        const newCard = currentDeck.pop()!;
        newCard.animating = true;
        
        const updatedHand = { 
            ...activeHand, 
            cards: [...activeHand.cards, newCard],
            bet: activeHand.bet * 2,
            hasDoubled: true,
            status: 'playing' as const // temporarily playing while animating
        };
        
        const newHands = [...playerHands];
        newHands[activeHandIndex] = updatedHand;

        setDeck(currentDeck);
        setPlayerHands([...newHands]);
        
        await new Promise(r => setTimeout(r, 600));
        
        newCard.animating = false;
        const finalStatus = isBust([...activeHand.cards, newCard]) ? 'bust' as const : 'stand' as const;
        updatedHand.status = finalStatus;
        setPlayerHands([...newHands]);
        
        if (finalStatus === 'bust') {
            soundEngine.playCrashSound();
        }

        setTimeout(() => {
            nextTurn(newHands, activeHandIndex, currentDeck, dealerHand);
        }, 1000);
    };

    const handleSplit = () => {
        if (gameState !== 'playing' || isDealing || !activeHand || activeHand.cards.length !== 2) return;
        if (cardValue(activeHand.cards[0].rank) !== cardValue(activeHand.cards[1].rank)) return;
        if (!deductBalance(activeHand.bet)) return;

        setIsDealing(true);

        let currentDeck = [...deck];
        
        const card1 = activeHand.cards[0];
        const card2 = activeHand.cards[1];
        const isAces = card1.rank === 'A';

        // Hand 1 gets 1 new card immediately
        const h1NewCard = currentDeck.pop()!;
        const hand1: PlayerHand = {
            ...activeHand,
            id: Math.random().toString(),
            cards: [card1, h1NewCard],
            isSplitAce: isAces,
            status: isAces ? 'stand' : 'playing'
        };

        // Hand 2 gets 1 new card immediately
        const h2NewCard = currentDeck.pop()!;
        const hand2: PlayerHand = {
            id: Math.random().toString(),
            cards: [card2, h2NewCard],
            bet: activeHand.bet,
            status: isAces ? 'stand' : 'playing',
            result: null,
            payout: 0,
            hasDoubled: false,
            isSplitAce: isAces
        };

        const newHands = [...playerHands];
        newHands.splice(activeHandIndex, 1, hand1, hand2);

        setDeck(currentDeck);
        setPlayerHands(newHands);

        setTimeout(() => {
            // Check if we need to advance immediately (if splitting aces)
            if (isAces) {
                nextTurn(newHands, activeHandIndex, currentDeck, dealerHand);
            } else {
                setIsDealing(false);
            }
        }, 1200);
    };

    const processDealerTurn = async (currDeck: Card[], pHands: PlayerHand[], dHand: Card[]) => {
        setGameState('dealerTurn');
        
        // Reveal dealer hidden card
        dHand[1].hidden = false;
        dHand[1].animating = true;
        setDealerHand([...dHand]);
        soundEngine.playPopSound();
        await new Promise(r => setTimeout(r, 600));
        
        dHand[1].animating = false;
        setDealerHand([...dHand]);
        await new Promise(r => setTimeout(r, 200));
        
        let dTotal = handTotal(dHand);
        
        // Only draw if at least one hand is not busted
        const needsToDraw = pHands.some(h => h.status !== 'bust' && h.status !== 'blackjack');
        
        if (needsToDraw) {
            while (dTotal < 17 || (dTotal === 17 && isSoft(dHand))) {
                const newCard = currDeck.pop()!;
                newCard.animating = true; // Hide from score temporarily
                dHand.push(newCard);
                setDealerHand([...dHand]);
                soundEngine.playPopSound();
                
                await new Promise(r => setTimeout(r, 700)); // Wait for animation
                
                newCard.animating = false; // Show in score
                setDealerHand([...dHand]);
                
                dTotal = handTotal(dHand);
                await new Promise(r => setTimeout(r, 300)); // Small pause before next draw
            }
        }
        
        setDeck(currDeck);
        setDealerHand([...dHand]);

        const dealerBusted = isBust(dHand);
        const dealerBJ = isBlackjack(dHand);
        
        let totalPayout = 0;
        let anyWin = false;
        let anyBust = false;

        const settledHands = pHands.map(pHand => {
            pHand.status = 'settled';
            const pTotal = handTotal(pHand.cards);
            const pBJ = isBlackjack(pHand.cards);

            if (pHand.result === 'bust' || isBust(pHand.cards)) {
                pHand.result = 'bust';
                pHand.payout = 0;
            } else if (pBJ) {
                if (dealerBJ) {
                    pHand.result = 'push';
                    pHand.payout = pHand.bet;
                } else {
                    pHand.result = 'blackjack';
                    pHand.payout = pHand.bet * 2.5; // 3:2 payout = initial bet (1x) + 1.5x profit
                }
            } else if (dealerBJ) {
                pHand.result = 'lose';
                pHand.payout = 0;
            } else if (dealerBusted) {
                pHand.result = 'win';
                pHand.payout = pHand.bet * 2;
            } else {
                if (pTotal > dTotal) {
                    pHand.result = 'win';
                    pHand.payout = pHand.bet * 2;
                } else if (pTotal < dTotal) {
                    pHand.result = 'lose';
                    pHand.payout = 0;
                } else {
                    pHand.result = 'push';
                    pHand.payout = pHand.bet;
                }
            }
            totalPayout += pHand.payout;
            return pHand;
        });
        const animationDelay = Math.max(1200, (dHand.length - 2) * 700 + 1200);

        setTimeout(() => {
            setPlayerHands(settledHands);
            setGameState('ended');
            setIsDealing(false);
            
            if (totalPayout > 0) {
                addBalance(totalPayout);
            }
        }, animationDelay);
    };

    const canSplit = activeHand?.cards.length === 2 && cardValue(activeHand.cards[0].rank) === cardValue(activeHand.cards[1].rank);
    const canDouble = activeHand?.cards.length === 2;

    return (
        <div className="flex flex-col lg:flex-row w-full h-full bg-[#05070A] text-white font-sans overflow-y-auto lg:overflow-hidden relative">
            
            {/* ── LEFT SIDEBAR (Controls) ── */}
            <div className="w-full lg:w-[320px] bg-[#0B0E14] border-r border-[#1E2336] p-4 md:p-5 flex flex-col shrink-0 z-20 order-2 lg:order-1 h-auto lg:h-full overflow-y-auto shadow-[10px_0_30px_rgba(0,0,0,0.8)]">
                
                {/* Bet Amount */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[13px] text-white font-bold tracking-wide">{t('Bet Amount', 'Bet Amount')}</label>
                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">EUR</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex bg-[#05070A] border-[2px] border-[#1E2336] rounded-lg overflow-hidden h-14 focus-within:border-[#c6ff00]/50 focus-within:shadow-[0_0_15px_rgba(198,255,0,0.1)] transition-all">
                            <input 
                                type="text" 
                                value={betAmountStr}
                                onChange={handleBetChange}
                                disabled={gameState === 'playing' || gameState === 'dealerTurn'}
                                className="flex-1 bg-transparent px-4 text-lg text-[#c6ff00] font-black outline-none disabled:opacity-50"
                            />
                        </div>
                        <div className="flex gap-2 h-10">
                            <button onClick={handleHalfBet} disabled={gameState === 'playing'} className="flex-1 bg-[#131620] hover:bg-[#1E2336] border border-[#1E2336] rounded-lg text-zinc-400 font-bold transition-colors disabled:opacity-50 active:scale-95">½</button>
                            <button onClick={handleDoubleBet} disabled={gameState === 'playing'} className="flex-1 bg-[#131620] hover:bg-[#1E2336] border border-[#1E2336] rounded-lg text-zinc-400 font-bold transition-colors disabled:opacity-50 active:scale-95">2x</button>
                        </div>
                    </div>
                </div>

                {/* Main Action Area */}
                {gameState === 'playing' ? (
                    <div className="flex flex-col gap-2 mb-6">
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                disabled={isDealing || !activeHand}
                                onClick={handleHit}
                                className="w-full bg-[#c6ff00] hover:bg-[#a6d900] disabled:opacity-50 text-black font-black text-sm md:text-base py-3 md:py-3.5 rounded-md transition-all shadow-[0_0_15px_rgba(198,255,0,0.3)] active:scale-95 uppercase tracking-wide flex items-center justify-center gap-2"
                            >
                                <span>Hit</span>
                                <div className="w-3 h-4 md:w-2.5 md:h-3 bg-black rounded-[1px] opacity-70"></div>
                            </button>
                            <button 
                                disabled={isDealing || !activeHand}
                                onClick={handleStand}
                                className="w-full bg-[#F43F5E] hover:bg-[#E11D48] disabled:opacity-50 text-white font-black text-sm md:text-base py-3 md:py-3.5 rounded-md transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-95 uppercase tracking-wide flex items-center justify-center gap-2"
                            >
                                <span>Stand</span>
                                <Hand className="w-5 h-5 md:w-4 md:h-4 text-white" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                disabled={isDealing || !canSplit}
                                onClick={handleSplit}
                                className="w-full bg-[#131620] hover:bg-[#1E2336] disabled:opacity-50 disabled:hover:bg-[#131620] border border-[#1E2336] text-zinc-300 font-bold text-sm py-3 rounded-md transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span>Split</span>
                                <Copy className="w-4 h-4 text-zinc-500" />
                            </button>
                            <button 
                                disabled={isDealing || !canDouble}
                                onClick={handleDouble}
                                className="w-full bg-[#131620] hover:bg-[#1E2336] disabled:opacity-50 disabled:hover:bg-[#131620] border border-[#1E2336] text-zinc-300 font-bold text-sm py-3 rounded-md transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span>Double</span>
                                <Coins className="w-4 h-4 text-zinc-500" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button 
                        disabled={gameState === 'dealerTurn' || isDealing}
                        onClick={gameState === 'ended' ? () => setGameState('betting') : handleDeal}
                        className="w-full bg-[#c6ff00] hover:bg-[#a6d900] disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-sm md:text-base py-3 md:py-3.5 rounded-md transition-all mb-6 shadow-[0_0_20px_rgba(198,255,0,0.3)] hover:shadow-[0_0_25px_rgba(198,255,0,0.5)] active:scale-95 uppercase tracking-wide relative overflow-hidden"
                    >
                        {gameState === 'ended' ? t('New Game', 'New Game') : t('Bet', 'Bet')}
                    </button>
                )}

                {/* Side Bets (Visual Only) */}
                <div>
                    <h3 className="text-white text-[13px] font-bold mb-3 uppercase tracking-wider">{t('Side Bets', 'Side Bets')}</h3>
                    
                    <div className="mb-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <label className="text-[12px] text-zinc-300 font-bold">Pairs</label>
                            <div className="w-3.5 h-3.5 rounded-full bg-zinc-700 text-[9px] flex items-center justify-center text-white cursor-help">i</div>
                        </div>
                        <div className="flex bg-[#05070A] border border-[#1E2336] rounded-md h-10 overflow-hidden">
                            <input type="text" placeholder="0.00" disabled className="flex-1 bg-transparent px-3 text-sm text-zinc-500 font-bold outline-none disabled:opacity-50" />
                            <div className="flex items-center">
                                <span className="text-zinc-600 text-[10px] font-bold mr-2">EUR</span>
                                <div className="flex h-full border-l border-[#1E2336]">
                                    <button disabled className="px-3 hover:bg-white/5 text-zinc-600 text-xs font-bold transition-colors">½</button>
                                    <div className="w-[1px] h-full bg-[#1E2336]"></div>
                                    <button disabled className="px-3 hover:bg-white/5 text-zinc-600 text-xs font-bold transition-colors">2x</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <label className="text-[12px] text-zinc-300 font-bold">Plus Three</label>
                            <div className="w-3.5 h-3.5 rounded-full bg-zinc-700 text-[9px] flex items-center justify-center text-white cursor-help">i</div>
                        </div>
                        <div className="flex bg-[#05070A] border border-[#1E2336] rounded-md h-10 overflow-hidden">
                            <input type="text" placeholder="0.00" disabled className="flex-1 bg-transparent px-3 text-sm text-zinc-500 font-bold outline-none disabled:opacity-50" />
                            <div className="flex items-center">
                                <span className="text-zinc-600 text-[10px] font-bold mr-2">EUR</span>
                                <div className="flex h-full border-l border-[#1E2336]">
                                    <button disabled className="px-3 hover:bg-white/5 text-zinc-600 text-xs font-bold transition-colors">½</button>
                                    <div className="w-[1px] h-full bg-[#1E2336]"></div>
                                    <button disabled className="px-3 hover:bg-white/5 text-zinc-600 text-xs font-bold transition-colors">2x</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT MAIN AREA (Centered Game Frame) ── */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-4 order-1 lg:order-2 h-[50vh] min-h-[450px] lg:h-full lg:min-h-0 overflow-hidden">
                {/* Rich radial gradient table background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#11212B] via-[#081017] to-[#05070A]"></div>
                
                {/* Subtle table arc/line */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[150%] h-[1000px] rounded-[100%] border-t-2 border-white/5 pointer-events-none"></div>

                {/* Floating Balance */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-[#131620]/80 backdrop-blur-md border border-[#1E2336] px-3 md:px-4 py-1.5 rounded-full z-10 shadow-md">
                    <span className="text-white text-[11px] md:text-xs font-bold">{siteUser ? siteUser.balance.toFixed(2) : '0.00'} EUR</span>
                </div>

                {/* Card Deck visual (Shoe) */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 drop-shadow-2xl">
                    <div className="relative w-[60px] h-[90px] md:w-[100px] md:h-[145px]">
                        {[0,1,2,3].map(i => (
                            <div key={i} className="absolute inset-0 rounded-md md:rounded-lg border-[1px] md:border-[2px] border-white/10 bg-[#0B0E14]" style={{ transform: `translate(${-i*2}px, ${-i*2}px)`, zIndex: -i }}></div>
                        ))}
                        <div className="absolute inset-0">
                            <CardBackDesign />
                        </div>
                    </div>
                </div>
                
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-30 pointer-events-none mt-0">
                    <div className="flex items-center gap-2 md:gap-4 scale-75 md:scale-100">
                        <div className="flex -space-x-2 md:-space-x-4 opacity-50 rotate-[-15deg]">
                            <div className="w-6 h-8 md:w-8 md:h-10 border border-white/20 rounded flex items-center justify-center"><span className="text-white text-[8px] md:text-[10px]">♦</span></div>
                            <div className="w-6 h-8 md:w-8 md:h-10 border border-white/20 rounded flex items-center justify-center"><span className="text-white text-[8px] md:text-[10px]">♣</span></div>
                        </div>
                        <div className="flex flex-col items-center px-2 gap-1">
                            <span className="text-[#00E5FF] font-black text-xl md:text-2xl tracking-[0.3em] whitespace-nowrap drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]">724BETS.NET</span>
                            <span className="text-white font-bold text-xs md:text-sm tracking-widest whitespace-nowrap">BLACKJACK PAYS 3 TO 2</span>
                            <span className="text-zinc-400 font-medium text-[10px] md:text-xs tracking-wider whitespace-nowrap">INSURANCE PAYS 2 TO 1</span>
                        </div>
                        <div className="flex -space-x-2 md:-space-x-4 opacity-50 rotate-[15deg]">
                            <div className="w-6 h-8 md:w-8 md:h-10 border border-white/20 rounded flex items-center justify-center"><span className="text-white text-[8px] md:text-[10px]">♥</span></div>
                            <div className="w-6 h-8 md:w-8 md:h-10 border border-white/20 rounded flex items-center justify-center"><span className="text-white text-[8px] md:text-[10px]">♠</span></div>
                        </div>
                    </div>
                </div>

                {/* GAME TABLE AREA - Flex Column for Dealer and Player */}
                <div className="flex flex-col justify-between items-center w-full max-w-4xl h-full py-16 md:py-24 z-10">
                    
                    {/* Dealer Area */}
                    <div className="flex justify-center w-full relative">
                        <div className="flex flex-row relative pl-12 md:pl-16 h-[clamp(100px,22vw,175px)] items-center">
                            {dealerHand.length > 0 && (!dealerHand[1]?.hidden && !dealerHand[1]?.animating) && (
                                <ScoreBadge score={handDisplayTotal(dealerHand)} show={true} position="top" />
                            )}
                            {dealerHand.map((card, i) => (
                                <div key={card.id + i} className="relative">
                                    <CardUI card={card} index={i} delay={i < 2 ? i * 600 + 300 : 100} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Result Messages (Centered space) */}
                    <div className="h-20 flex items-center justify-center w-full my-4">
                        {/* Empty spacer or global messages can go here */}
                    </div>

                    {/* Player Area (Multiple Hands for Split) */}
                    <div className="flex justify-center w-full gap-8 overflow-x-auto custom-scrollbar px-4 pb-4">
                        {playerHands.map((pHand, handIdx) => {
                            const isActive = gameState === 'playing' && handIdx === activeHandIndex;
                            const opacity = (gameState === 'playing' && !isActive && playerHands.length > 1) ? 'opacity-50' : 'opacity-100';
                            
                            return (
                                <div key={pHand.id} className={`flex flex-col items-center transition-opacity ${opacity} relative`}>
                                    
                                    {/* Arrow pointing to active hand */}
                                    {isActive && playerHands.length > 1 && (
                                        <div className="absolute -top-8 animate-bounce text-[#c6ff00]">▼</div>
                                    )}

                                    {/* Cards */}
                                    <div className="flex flex-row relative pl-12 md:pl-16 h-[clamp(100px,22vw,175px)] items-center">
                                        {pHand.cards.length > 0 && (
                                            <ScoreBadge score={handDisplayTotal(pHand.cards)} show={true} position="bottom" />
                                        )}
                                        {pHand.cards.map((card, i) => (
                                            <div key={card.id + i} className="relative">
                                                <CardUI card={card} index={i} delay={i < 2 ? i * 600 : 100} />
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Hand Info / Result */}
                                    <div className="mt-4 flex flex-col items-center min-h-[40px]">
                                        {pHand.hasDoubled && (
                                            <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded border border-amber-500/50 mb-1 uppercase tracking-wider font-bold">Doubled (x2)</span>
                                        )}
                                        {gameState === 'ended' && pHand.result && (
                                            <div className="flex flex-col items-center animate-fade-in-up bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-lg border border-white/5 shadow-xl">
                                                <span className={`text-sm md:text-lg font-black uppercase tracking-widest ${
                                                    pHand.result === 'win' || pHand.result === 'blackjack' ? 'text-[#c6ff00] drop-shadow-[0_0_8px_rgba(198,255,0,0.5)]' :
                                                    pHand.result === 'push' ? 'text-zinc-300' : 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                                                }`}>
                                                    {pHand.result === 'blackjack' ? 'BLACKJACK!' : 
                                                     pHand.result === 'win' ? 'WIN' : 
                                                     pHand.result === 'bust' ? 'BUST' : 
                                                     pHand.result === 'push' ? 'PUSH' : 'LOSE'}
                                                </span>
                                                {pHand.payout > 0 && (
                                                    <span className="text-[#c6ff00] font-bold text-xs md:text-sm mt-0.5">+{pHand.payout.toFixed(2)} EUR</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>



            {/* Rules Modal */}
            {showRules && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#1A1D29] border border-[#2C3145] rounded-2xl w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-[#2C3145] flex justify-between items-center bg-[#222637]">
                            <h2 className="text-xl font-black text-white uppercase tracking-widest">Oyun Kuralları</h2>
                            <button onClick={() => setShowRules(false)} className="text-zinc-500 hover:text-white text-2xl leading-none">&times;</button>
                        </div>
                        <div className="p-6 text-sm text-zinc-300 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div>
                                <h3 className="text-[#c6ff00] font-bold mb-1 uppercase tracking-wider">Temel Amaç</h3>
                                <p>Krupiyeyi (Dealer) 21 sayısına ondan daha fazla yaklaşarak yenmek. 21'i geçerseniz (Bust) oyunu kaybedersiniz.</p>
                            </div>
                            <div>
                                <h3 className="text-[#c6ff00] font-bold mb-1 uppercase tracking-wider">Özel Hamleler</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Double (İkiye Katla):</strong> İlk iki karttayken bahsinizi 2 katına çıkarıp sadece 1 kart daha çekebilirsiniz. Sonrasında sıra kasaya geçer.</li>
                                    <li><strong>Split (Bölme):</strong> Aynı değerli iki kartınız varsa (örn: iki adet 8), bahsiniz düşülerek eliniz ikiye bölünür. Her el bağımsız oynanır. Sadece <strong>iki As'ı (A)</strong> böldüğünüzde her ele sadece tek bir zorunlu kart çekilir.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-[#c6ff00] font-bold mb-1 uppercase tracking-wider">Ödemeler (Payouts)</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong>Blackjack:</strong> Bahsinizin 2.5 katını öder (3'e 2).</li>
                                    <li><strong>Normal Kazanç:</strong> Bahsinizin 2 katını öder (1'e 1).</li>
                                    <li><strong>Beraberlik (Push):</strong> Bahsiniz iade edilir.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-[#c6ff00] font-bold mb-1 uppercase tracking-wider">Krupiye Kuralları</h3>
                                <p>Krupiye toplam puanı 17 olana kadar zorunlu olarak kart çeker. 17 ve üzerinde ise beklemek (Stand) zorundadır.</p>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-[#2C3145] bg-[#222637]">
                            <button onClick={() => setShowRules(false)} className="w-full bg-[#c6ff00] hover:bg-[#a6d900] text-black font-bold py-3 rounded-md transition-colors uppercase tracking-wider">
                                Anladım
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
