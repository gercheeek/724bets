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
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${colorClass} shadow-[0_10px_20px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)] border-[2px] border-[#a0aec0] flex items-center justify-center relative cursor-pointer ${isSelected ? 'ring-2 ring-[#ffd700] ring-offset-2 ring-offset-transparent transform -translate-y-2' : ''} transition-all`}>
            <div className="absolute inset-1 rounded-full border-[1px] border-solid border-[#e2e8f0]/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"></div>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-inner">
                <span className="text-white font-black font-mono text-[10px] md:text-xs drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{value}</span>
            </div>
        </div>
    );

    if (stacked) {
        const numChips = Math.min(Math.max(Math.floor(value / 10), 1), 6);
        return (
            <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                {Array.from({ length: numChips }).map((_, i) => (
                    <div key={i} className="absolute" style={{ bottom: `${i * 5}px`, zIndex: i }}>
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${colorClass} shadow-[0_4px_10px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)] border-[2px] border-[#a0aec0] flex items-center justify-center relative`}>
                            <div className="absolute inset-1 rounded-full border-[1px] border-solid border-[#e2e8f0]/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"></div>
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-inner">
                                <span className="text-white font-black font-mono text-[10px] md:text-xs drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{value}</span>
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
interface PlayerHand {
    id: number;
    cards: Card[];
    bet: number;
    status: 'waiting' | 'playing' | 'stand' | 'bust' | 'blackjack' | 'settled';
    result: 'win' | 'lose' | 'push' | 'blackjack' | 'bust' | null;
    payout: number;
}

export default function BlackjackProView({ siteUser, setSiteUser, onAuthRequired, onNavigate }: any) {
    const [selectedChip, setSelectedChip] = useState<number>(10);
    const [deck, setDeck] = useState<Card[]>([]);
    
    const initialHands: PlayerHand[] = [
        { id: 0, cards: [], bet: 0, status: 'waiting', result: null, payout: 0 },
        { id: 1, cards: [], bet: 0, status: 'waiting', result: null, payout: 0 },
        { id: 2, cards: [], bet: 0, status: 'waiting', result: null, payout: 0 }
    ];
    const [hands, setHands] = useState<PlayerHand[]>(initialHands);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    
    const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'ended'>('betting');
    const [activeHandIndex, setActiveHandIndex] = useState<number>(-1);
    
    // Derived total bet
    const totalBet = hands.reduce((sum, h) => sum + h.bet, 0);
    const totalPayout = hands.reduce((sum, h) => sum + h.payout, 0);

    useEffect(() => { setDeck(shuffleDeck(buildDeck())); }, []);

    const handleNewGame = () => {
        setGameState('betting');
        setHands(hands.map(h => ({ ...h, cards: [], status: 'waiting', result: null, payout: 0 })));
        setDealerHand([]);
        setActiveHandIndex(-1);
    };

    const handleClearBets = () => {
        if (gameState !== 'betting') return;
        setHands(initialHands);
    };

    const handleAddBetToSeat = (seatIndex: number) => {
        if (!siteUser) return onAuthRequired();
        if (gameState !== 'betting') return;
        
        if (siteUser.balance < selectedChip) { alert("Yetersiz bakiye!"); return; }

        setHands(prev => {
            const newHands = [...prev];
            newHands[seatIndex].bet += selectedChip;
            return newHands;
        });
    };

    const handleDeal = () => {
        if (!siteUser) return onAuthRequired();
        if (totalBet <= 0) return;
        
        // Deduct total bet
        if (siteUser.balance < totalBet) { alert("Yetersiz bakiye!"); return; }
        const newBalance = siteUser.balance - totalBet;
        setSiteUser({ ...siteUser, balance: newBalance });
        if (!siteUser.id.toString().startsWith('guest_')) {
            supabase.from('members').update({ balance: newBalance }).eq('id', siteUser.id).then();
        }

        let currentDeck = [...deck];
        if (currentDeck.length < 30) currentDeck = shuffleDeck(buildDeck());

        // Deal cards to active hands
        const newHands = [...hands];
        for (let i = 0; i < 2; i++) {
            newHands.forEach(h => {
                if (h.bet > 0) h.cards.push(currentDeck.pop()!);
            });
        }
        
        // Deal to dealer
        const dHand = [currentDeck.pop()!, { ...currentDeck.pop()!, hidden: true }];

        setDeck(currentDeck);
        setDealerHand(dHand);
        setGameState('playing');

        // Check for immediate blackjacks and set initial statuses
        let firstActive = -1;
        let anyPlaying = false;
        let instantWinBalance = newBalance;

        newHands.forEach((h, i) => {
            if (h.bet > 0) {
                if (isBlackjack(h.cards)) {
                    h.status = 'blackjack';
                    // We don't settle immediately if dealer might have blackjack, but for simplicity here we assume standard US rules without insurance.
                    // Actually, let's wait to settle until dealer turn to check for push.
                } else {
                    h.status = 'playing';
                    if (firstActive === -1) firstActive = i;
                    anyPlaying = true;
                }
            }
        });

        setHands(newHands);

        if (anyPlaying) {
            setActiveHandIndex(firstActive);
        } else {
            // All active hands got blackjack
            setTimeout(() => processDealerTurn(currentDeck, newHands, dHand, newBalance), 1000);
        }
    };

    const advanceHand = (currentHands: PlayerHand[], currDeck: Card[]) => {
        let next = -1;
        for (let i = activeHandIndex + 1; i < currentHands.length; i++) {
            if (currentHands[i].status === 'playing') {
                next = i;
                break;
            }
        }
        if (next !== -1) {
            setActiveHandIndex(next);
        } else {
            setActiveHandIndex(-1);
            setGameState('dealerTurn');
            setTimeout(() => processDealerTurn(currDeck, currentHands, dealerHand, siteUser.balance), 500);
        }
    };

    const handleHit = () => {
        if (gameState !== 'playing' || activeHandIndex === -1) return;
        
        let currentDeck = [...deck];
        const newHands = [...hands];
        const activeHand = newHands[activeHandIndex];
        
        activeHand.cards.push(currentDeck.pop()!);
        setDeck(currentDeck);

        if (isBust(activeHand.cards)) {
            activeHand.status = 'bust';
            setHands(newHands);
            setTimeout(() => advanceHand(newHands, currentDeck), 600);
        } else {
            setHands(newHands);
        }
    };

    const handleStand = () => {
        if (gameState !== 'playing' || activeHandIndex === -1) return;
        const newHands = [...hands];
        newHands[activeHandIndex].status = 'stand';
        setHands(newHands);
        advanceHand(newHands, deck);
    };

    const processDealerTurn = (currDeck: Card[], currHands: PlayerHand[], dHand: Card[], currentBalance: number) => {
        setGameState('dealerTurn');
        dHand[1].hidden = false;
        
        // Only draw if there's at least one hand that didn't bust and isn't blackjack
        const needsDraw = currHands.some(h => h.bet > 0 && h.status === 'stand');
        
        let dTotal = handTotal(dHand);
        if (needsDraw) {
            while (dTotal < 17) {
                dHand.push(currDeck.pop()!);
                dTotal = handTotal(dHand);
            }
        }
        
        setDeck(currDeck);
        setDealerHand([...dHand]);

        const dealerBusted = isBust(dHand);
        const dealerBJ = isBlackjack(dHand);
        
        let totalWin = 0;

        currHands.forEach(h => {
            if (h.bet === 0) return;
            
            h.status = 'settled';
            const pTotal = handTotal(h.cards);
            const pBJ = isBlackjack(h.cards);

            if (h.cards.length > 0 && isBust(h.cards)) {
                h.result = 'bust';
                h.payout = 0;
            } else if (pBJ) {
                if (dealerBJ) {
                    h.result = 'push';
                    h.payout = h.bet;
                } else {
                    h.result = 'blackjack';
                    h.payout = h.bet * 2.5;
                }
            } else if (dealerBJ) {
                h.result = 'lose';
                h.payout = 0;
            } else if (dealerBusted) {
                h.result = 'win';
                h.payout = h.bet * 2;
            } else {
                if (pTotal > dTotal) {
                    h.result = 'win';
                    h.payout = h.bet * 2;
                } else if (pTotal < dTotal) {
                    h.result = 'lose';
                    h.payout = 0;
                } else {
                    h.result = 'push';
                    h.payout = h.bet;
                }
            }
            totalWin += h.payout;
        });

        setHands([...currHands]);
        setGameState('ended');
        
        if (siteUser) {
            const finalBalance = currentBalance + totalWin;
            setSiteUser({ ...siteUser, balance: finalBalance });
            if (!siteUser.id.toString().startsWith('guest_')) {
                supabase.from('members').update({ balance: finalBalance }).eq('id', siteUser.id).then();
            }
        }
    };

    const leftControls = (
        <div className="flex flex-col items-center md:items-start gap-1 justify-center w-full">
            <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-1 text-center md:text-left w-full">Çip Seç & Masaya Tıkla</span>
            <div className="flex items-center gap-2 justify-center md:justify-start w-full">
                {[10, 50, 100].map(val => (
                    <CasinoChip 
                        key={val} 
                        value={val} 
                        isSelected={selectedChip === val}
                        onClick={() => setSelectedChip(val)} 
                    />
                ))}
                
                {(gameState === 'betting') && totalBet > 0 && (
                    <button onClick={handleClearBets} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 font-black text-[10px] md:text-xs border border-red-500/50 transition-colors flex items-center justify-center ml-1 md:ml-2">
                        X
                    </button>
                )}
            </div>
        </div>
    );

    const centerControls = (
        <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4 justify-center shrink-0">
            {gameState === 'betting' || gameState === 'ended' ? (
                <button 
                    disabled={totalBet === 0 && gameState === 'betting'}
                    onClick={gameState === 'ended' ? handleNewGame : handleDeal}
                    className={`w-[70px] h-[70px] md:w-[80px] md:h-[80px] rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-lg border-2 z-10 ${
                        (totalBet > 0 || gameState === 'ended')
                        ? 'bg-[#10B981]/20 border-[#10B981] hover:bg-[#10B981]/30 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 text-[#10B981]' 
                        : 'bg-gray-800/50 border-gray-600/50 opacity-50 cursor-not-allowed text-gray-400'
                    }`}
                >
                    <span className="text-xl md:text-2xl font-black uppercase tracking-wider">{gameState === 'ended' ? 'New' : 'Deal'}</span>
                </button>
            ) : (
                <>
                    <button 
                        disabled={gameState !== 'playing' || activeHandIndex === -1}
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
                        disabled={gameState !== 'playing' || activeHandIndex === -1}
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
                </>
            )}
        </div>
    );

    const rightControls = (
        <div className="flex flex-col items-end flex-1 justify-center w-full">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Bakiye</span>
            <div className="bg-black/80 px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-[#ffd700]/30 shadow-inner flex items-center gap-2">
                <span className="text-[#ffd700] font-black text-sm md:text-lg">
                    ${siteUser ? siteUser.balance.toFixed(2) : '0.00'}
                </span>
            </div>
            {totalBet > 0 && (
                <span className="text-white text-[10px] font-bold mt-2 bg-white/10 px-2 py-0.5 rounded-full">
                    Total Bet: ${totalBet.toFixed(2)}
                </span>
            )}
        </div>
    );

    return (
        <OriginalGameContainer 
            title="Blackjack PRO Multi-hand" 
            siteUser={siteUser}
            onNavigate={onNavigate}
            leftControls={leftControls}
            centerControls={centerControls}
            rightControls={rightControls}
        >
            
            {/* Dealer Area */}
            <div className="w-full flex flex-col items-center mb-8 relative">
                <ScoreBadge score={handTotal(dealerHand)} show={dealerHand.length > 0 && !dealerHand[1]?.hidden} />
                <div className="flex justify-center min-h-[140px] relative pl-14">
                    {dealerHand.map((card, i) => (
                        <CardUI key={card.id} card={card} index={i} />
                    ))}
                </div>
            </div>

            {/* Player Multi-hand Area */}
            <div className="w-full flex justify-center gap-4 md:gap-12 relative px-2">
                {hands.map((hand, i) => (
                    <div key={hand.id} className={`flex flex-col items-center relative transition-all duration-300 ${activeHandIndex === i ? 'scale-110 z-20' : 'scale-90 opacity-80 z-10'}`}>
                        
                        {/* Highlight for Active Hand */}
                        {activeHandIndex === i && (
                            <div className="absolute -inset-4 border-2 border-[#ffd700]/50 rounded-3xl bg-[#ffd700]/5 animate-pulse -z-10"></div>
                        )}

                        {/* Hand Score */}
                        <div className="mb-2 h-6">
                            {hand.cards.length > 0 && (
                                <div className="bg-black/80 border border-white/20 text-white font-black text-xs px-2 py-0.5 rounded shadow-lg backdrop-blur-sm">
                                    {handTotal(hand.cards)}
                                </div>
                            )}
                        </div>

                        {/* Hand Cards */}
                        <div className="flex justify-center min-h-[120px] md:min-h-[140px] relative pl-8 md:pl-14 z-10 w-full mb-4">
                            {hand.cards.map((card, idx) => (
                                <CardUI key={card.id} card={card} index={idx} />
                            ))}
                        </div>

                        {/* Betting Circle */}
                        <div 
                            className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full border-[2px] ${hand.bet > 0 ? 'border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-solid border-white/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]'} flex items-center justify-center bg-black/40 z-0 cursor-pointer transition-all`}
                            onClick={() => handleAddBetToSeat(i)}
                        >
                            {hand.bet === 0 && <span className="text-white/30 text-[8px] md:text-[10px] uppercase font-bold tracking-widest text-center px-2">Place<br/>Bet</span>}
                            {hand.bet > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center animate-fade-in-up pointer-events-none mt-2">
                                    <CasinoChip value={hand.bet} stacked={true} />
                                </div>
                            )}
                        </div>
                        
                        {/* Result Badge */}
                        <div className="h-8 mt-2 flex items-center justify-center">
                            {hand.result && (
                                <div className={`px-3 py-1 rounded border text-[10px] md:text-xs font-black uppercase tracking-widest ${
                                    hand.result === 'win' || hand.result === 'blackjack' ? 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/50' :
                                    hand.result === 'push' ? 'bg-gray-500/20 text-gray-300 border-gray-500/50' :
                                    'bg-red-500/20 text-red-400 border-red-500/50'
                                }`}>
                                    {hand.result}
                                    {hand.payout > 0 && <span className="ml-1">+${hand.payout}</span>}
                                </div>
                            )}
                        </div>
                        
                    </div>
                ))}
            </div>

            {/* Cinematic Banner for Big Wins */}
            {gameState === 'ended' && totalPayout > totalBet && (
                <div 
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[4px] animate-fade-in pointer-events-none"
                >
                    <div className="px-16 py-10 rounded-[2rem] border-2 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center bg-black/60 border-[#ffd700]/50 shadow-[#ffd700]/20">
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

                        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-1 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#b8860b]">
                            YOU WIN
                        </h2>
                        
                        <div className="text-3xl md:text-5xl text-emerald-400 font-black tracking-widest mt-2 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]">
                            +${totalPayout.toFixed(2)}
                        </div>
                    </div>
                </div>
            )}
        </OriginalGameContainer>
    );
}
