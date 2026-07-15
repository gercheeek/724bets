import React, { useState, useEffect } from 'react';
import { Info, ShieldCheck, Settings, BarChart2, Volume2, Coins } from 'lucide-react';
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
const CasinoChip: React.FC<{ amount: number }> = ({ amount }) => {
    // Generate stacked chips effect
    const numChips = Math.min(Math.max(Math.floor(amount / 10), 1), 6);
    
    // Choose chip color based on amount
    const color = amount >= 1000 ? '#8b5cf6' : 
                  amount >= 500 ? '#f59e0b' : 
                  amount >= 100 ? '#10b981' : 
                  amount >= 50 ? '#ef4444' : '#3b82f6';
                  
    return (
        <div className="relative w-16 h-16 flex items-center justify-center transform hover:scale-105 transition-transform cursor-default">
            {Array.from({ length: numChips }).map((_, i) => (
                <div 
                    key={i}
                    className="absolute rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center border-4 border-dashed"
                    style={{ 
                        width: '100%', height: '100%', 
                        bottom: `${i * 4}px`,
                        backgroundColor: color,
                        borderColor: 'rgba(255,255,255,0.8)',
                        zIndex: i
                    }}
                >
                    <div className="w-[75%] h-[75%] rounded-full bg-white flex items-center justify-center border-2 border-dashed border-gray-300">
                        <span className="font-black text-[10px] text-gray-800 tracking-tighter">724</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

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
            <div className="relative flex-shrink-0 -ml-12 first:ml-0 shadow-2xl" style={{ width: '90px', height: '130px' }}>
                <div className="w-full h-full rounded-lg flex flex-col items-center justify-center border-4 border-white shadow-[0_10px_25px_rgba(0,0,0,0.6)] overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative">
                    {/* Card Back Pattern */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '10px 10px' }}></div>
                    <div className="text-xl font-black text-white italic tracking-tighter z-10 filter drop-shadow-md transform -rotate-12">724</div>
                    <div className="text-xs font-bold text-white tracking-widest z-10 filter drop-shadow-md">BETS</div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative flex-shrink-0 -ml-12 first:ml-0"
            style={{
                width: '90px', height: '130px',
                transform: show ? 'translateY(0) rotateY(0) scale(1)' : 'translateY(-60px) rotateY(90deg) scale(1.1)',
                opacity: show ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
        >
            <div className="w-full h-full rounded-lg flex flex-col justify-between p-2 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-gray-300">
                <div className="flex flex-col items-start leading-none">
                    <span className="font-black text-xl leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.rank}</span>
                    <span className="text-base leading-none mt-1" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.suit}</span>
                </div>
                <div className="text-center text-5xl leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" style={{ color: isRed ? '#dc2626' : '#111' }}>
                    {card.suit}
                </div>
                <div className="flex flex-col items-end leading-none rotate-180">
                    <span className="font-black text-xl leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.rank}</span>
                    <span className="text-base leading-none mt-1" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.suit}</span>
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

        if (isBlackjack(pHand)) {
            const dealerHasBJ = isBlackjack(dHand);
            if (dealerHasBJ) {
                dHand[1].hidden = false;
                setDealerHand([...dHand]);
                setTimeout(() => settleGame(amt, 'push', newBalance + amt), 800);
            } else {
                dHand[1].hidden = false;
                setDealerHand([...dHand]);
                const win = amt * 2.5;
                setTimeout(() => settleGame(win, 'blackjack', newBalance + win), 800);
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

        const amt = parseFloat(betAmount);
        const pTotal = handTotal(playerHand);

        setTimeout(() => {
            if (isBust(dHand)) {
                const win = amt * 2;
                settleGame(win, 'win', siteUser.balance + win);
            } else if (dTotal > pTotal) {
                settleGame(0, 'lose', siteUser.balance);
            } else if (pTotal > dTotal) {
                const win = amt * 2;
                settleGame(win, 'win', siteUser.balance + win);
            } else {
                settleGame(amt, 'push', siteUser.balance + amt);
            }
        }, 1000);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-60px)] bg-[#0F121A] text-gray-200 font-sans">
            {/* Left Sidebar (Bet Controls) */}
            <div className="w-full lg:w-[320px] bg-[#1A1D29] border-r border-[#262A36] flex flex-col p-6 z-30 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Bahis Miktarı</label>
                        <span className="text-emerald-500 text-xs font-black bg-emerald-500/10 px-2 py-1 rounded">
                            {siteUser ? `$${siteUser.balance.toFixed(2)}` : '$0.00'}
                        </span>
                    </div>
                    <div className="flex bg-[#12141C] rounded-lg border border-[#262A36] overflow-hidden focus-within:border-emerald-500/50 transition-colors shadow-inner">
                        <div className="pl-4 pr-3 py-3 flex items-center justify-center border-r border-[#262A36]">
                            <Coins className="w-4 h-4 text-emerald-500" />
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
                            className="px-4 hover:bg-white/5 transition-colors text-gray-400 text-xs font-bold border-l border-[#262A36] disabled:opacity-50"
                        >
                            1/2
                        </button>
                        <button 
                            disabled={gameState === 'playing' || gameState === 'dealerTurn'}
                            onClick={() => setBetAmount((parseFloat(betAmount)*2).toFixed(2))}
                            className="px-4 hover:bg-white/5 transition-colors text-gray-400 text-xs font-bold border-l border-[#262A36] disabled:opacity-50"
                        >
                            2x
                        </button>
                    </div>
                </div>

                {gameState === 'idle' || gameState === 'ended' ? (
                    <button 
                        onClick={handleDeal}
                        className="w-full bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-black font-black py-4 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all uppercase tracking-widest text-sm mb-4 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1"
                    >
                        DAĞIT (DEAL)
                    </button>
                ) : (
                    <div className="flex gap-3 mb-4">
                        <button 
                            onClick={handleHit}
                            disabled={gameState !== 'playing'}
                            className="flex-1 bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 text-white font-black py-4 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all uppercase tracking-widest text-sm disabled:opacity-50 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1"
                        >
                            VUR
                        </button>
                        <button 
                            onClick={handleStand}
                            disabled={gameState !== 'playing'}
                            className="flex-1 bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white font-black py-4 rounded-lg shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-all uppercase tracking-widest text-sm disabled:opacity-50 border-b-4 border-rose-800 active:border-b-0 active:translate-y-1"
                        >
                            DUR
                        </button>
                    </div>
                )}

                <div className="mt-auto pt-6 flex justify-between items-center text-gray-500 px-2 border-t border-white/5">
                    <div className="flex gap-5">
                        <Settings className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <BarChart2 className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Volume2 className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    </div>
                </div>
            </div>

            {/* Right Area (Game Table) */}
            <div className="flex-1 relative flex flex-col items-center justify-between p-8 overflow-hidden">
                
                {/* ── REALISTIC FELT BACKGROUND ── */}
                <div className="absolute inset-0 bg-[#0d3b23] z-0">
                    <div className="absolute inset-0 opacity-[0.15]" 
                         style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
                    </div>
                    {/* Shadow gradient for depth */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]"></div>
                </div>

                {/* ── 724BETS WATERMARK ── */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-[0.04] pointer-events-none flex flex-col items-center justify-center w-full">
                     <h1 className="text-[120px] md:text-[180px] font-black italic tracking-tighter text-[#ffd700] drop-shadow-lg">724BETS</h1>
                     <p className="text-2xl md:text-4xl text-[#ffd700] font-black tracking-[1em] uppercase mt-4">Blackjack</p>
                </div>

                {/* Table Markings (Card guidelines) */}
                <div className="absolute inset-0 z-0 pointer-events-none flex flex-col items-center justify-center opacity-30 gap-[160px]">
                     {/* Dealer Frame */}
                     <div className="w-[180px] h-[140px] border-2 border-dashed border-[#ffd700] rounded-xl flex items-center justify-center">
                         <span className="text-[#ffd700] font-bold text-sm tracking-widest uppercase">Dealer Must Draw to 16</span>
                     </div>
                     {/* Player Frame & Betting Circle */}
                     <div className="flex flex-col items-center gap-6">
                         <div className="w-[180px] h-[140px] border-2 border-dashed border-[#ffd700] rounded-xl"></div>
                         <div className="w-24 h-24 rounded-full border border-dashed border-[#ffd700] flex flex-col items-center justify-center text-center p-2 bg-[#ffd700]/5 shadow-[inset_0_0_20px_rgba(255,215,0,0.1)]">
                             <span className="text-[#ffd700] text-[10px] uppercase font-bold opacity-70 tracking-widest">Place Bet</span>
                         </div>
                     </div>
                </div>

                {/* Top Headers */}
                <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
                    <Info className="w-5 h-5 text-emerald-400" />
                    <span className="text-white font-black tracking-widest text-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Blackjack PRO
                    </span>
                </div>
                
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 z-10 shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-gray-200 font-bold text-xs uppercase tracking-wider">Adil Oyun</span>
                </div>

                {/* ── GAME ELEMENTS (Z-10) ── */}
                <div className="z-10 w-full h-full flex flex-col justify-between pt-16 pb-12 relative">
                    
                    {/* Dealer Area */}
                    <div className="flex flex-col items-center w-full">
                        <div className="flex justify-center min-h-[140px] relative">
                            {dealerHand.map((card, i) => (
                                <CardUI key={card.id} card={card} delay={i * 150} />
                            ))}
                        </div>
                        <div className="mt-4 bg-black/60 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10 shadow-xl flex items-center gap-3 transition-all duration-300 transform">
                            <span className="text-gray-400 font-semibold text-xs uppercase tracking-widest">Dealer</span>
                            {dealerHand.length > 0 && !dealerHand[1]?.hidden && (
                                <span className="text-white font-black text-xl">{handTotal(dealerHand)}</span>
                            )}
                        </div>
                    </div>

                    {/* Betting Area (Chips) */}
                    <div className="flex justify-center my-4 h-24">
                        {gameState !== 'idle' && (
                            <div className="animate-fade-in-up">
                                <CasinoChip amount={parseFloat(betAmount)} />
                            </div>
                        )}
                    </div>

                    {/* Player Area */}
                    <div className="flex flex-col items-center w-full">
                        <div className="mb-4 bg-black/60 backdrop-blur-sm px-6 py-2 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center gap-3">
                            <span className="text-emerald-400 font-semibold text-xs uppercase tracking-widest">Eliniz</span>
                            {playerHand.length > 0 && (
                                <span className="text-white font-black text-xl">{handTotal(playerHand)}</span>
                            )}
                        </div>
                        <div className="flex justify-center min-h-[140px] relative">
                            {playerHand.map((card, i) => (
                                <CardUI key={card.id} card={card} delay={i * 150} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── CINEMATIC RESULT BANNER ── */}
                {gameState === 'ended' && result && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-fade-in">
                        <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] border-y-4 border-[#ffd700] w-full py-10 shadow-[0_0_100px_rgba(255,215,0,0.2)] relative overflow-hidden flex flex-col items-center justify-center">
                            
                            {/* Confetti effect if win */}
                            {(result === 'win' || result === 'blackjack') && (
                                <div className="absolute inset-0 opacity-50 flex justify-around pointer-events-none">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className="w-2 h-8 bg-emerald-500 absolute top-[-50px]" 
                                             style={{ left: `${Math.random()*100}%`, animation: `confetti-fall ${1 + Math.random()}s linear infinite` }}></div>
                                    ))}
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className="w-3 h-3 rounded-full bg-[#ffd700] absolute top-[-50px]" 
                                             style={{ left: `${Math.random()*100}%`, animation: `confetti-fall ${1.5 + Math.random()}s linear infinite` }}></div>
                                    ))}
                                </div>
                            )}

                            <h2 className={`text-6xl md:text-8xl font-black uppercase tracking-tighter mb-2 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] ${
                                result === 'win' || result === 'blackjack' ? 'text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#b8860b]' : 
                                result === 'push' ? 'text-gray-300' : 'text-transparent bg-clip-text bg-gradient-to-b from-rose-500 to-rose-800'
                            }`}>
                                {result === 'win' ? 'KAZANDIN!' : 
                                 result === 'blackjack' ? 'BLACKJACK!' :
                                 result === 'push' ? 'BERABERE' :
                                 result === 'bust' ? 'BUST' : 'KAYBETTİN'}
                            </h2>
                            
                            {payout > 0 && (
                                <div className="text-3xl md:text-4xl text-emerald-400 font-black tracking-widest mt-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                    +{payout.toFixed(2)} $
                                </div>
                            )}

                            <button onClick={() => setGameState('idle')} className="mt-8 px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full hover:bg-gray-200 transition-colors">
                                Yeni El Oyna
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
