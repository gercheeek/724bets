import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { ShieldCheck, ArrowUpRight, ArrowDownRight, Equal } from 'lucide-react';

type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

interface Card {
    suit: Suit;
    rank: Rank;
    value: number;
}

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function getCardValue(rank: Rank): number {
    if (rank === 'A') return 14;
    if (rank === 'K') return 13;
    if (rank === 'Q') return 12;
    if (rank === 'J') return 11;
    return parseInt(rank);
}

function createDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({ suit, rank, value: getCardValue(rank) });
        }
    }
    return deck.sort(() => Math.random() - 0.5);
}

// Simple probability to calculate multiplier (house edge ~ 2%)
function getMultipliers(currentCard: Card): { high: number, low: number, tie: number } {
    const total = 51;
    let higherCount = 0;
    let lowerCount = 0;
    let tieCount = 3;

    for (const rank of RANKS) {
        const val = getCardValue(rank);
        if (val > currentCard.value) higherCount += 4;
        if (val < currentCard.value) lowerCount += 4;
    }

    const houseEdge = 0.98;
    return {
        high: higherCount > 0 ? (total / higherCount) * houseEdge : 0,
        low: lowerCount > 0 ? (total / lowerCount) * houseEdge : 0,
        tie: tieCount > 0 ? (total / tieCount) * houseEdge : 0,
    };
}

const CardUI = ({ card, hidden = false, className = '' }: { card?: Card; hidden?: boolean; className?: string }) => {
    if (hidden || !card) {
        return (
            <div className={`w-24 h-36 md:w-32 md:h-48 rounded-xl border-2 border-white/20 bg-[repeating-linear-gradient(45deg,#1e293b_0,#1e293b_10px,#0f172a_10px,#0f172a_20px)] shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center ${className}`}>
                <div className="w-12 h-12 rounded-full border-4 border-white/10 flex items-center justify-center bg-white/5">
                    <span className="text-white/20 font-black text-2xl">724</span>
                </div>
            </div>
        );
    }

    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
        <div className={`w-24 h-36 md:w-32 md:h-48 rounded-xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.3)] border border-gray-200 relative overflow-hidden flex flex-col justify-between p-2 animate-pop-in ${className}`}>
            <div className={`text-lg md:text-2xl font-black ${isRed ? 'text-red-600' : 'text-gray-900'} leading-none`}>
                {card.rank}<br />{card.suit}
            </div>
            
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-7xl opacity-20 ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
                {card.suit}
            </div>
            
            <div className={`text-lg md:text-2xl font-black ${isRed ? 'text-red-600' : 'text-gray-900'} leading-none text-right rotate-180`}>
                {card.rank}<br />{card.suit}
            </div>
        </div>
    );
};

export default function HiLoView({ siteUser, setSiteUser, onAuthRequired }: any) {
    const [betAmount, setBetAmount] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const [deck, setDeck] = useState<Card[]>([]);
    const [currentCard, setCurrentCard] = useState<Card | null>(null);
    const [history, setHistory] = useState<Card[]>([]);
    
    const [currentMultiplier, setCurrentMultiplier] = useState(1);
    const [winAmount, setWinAmount] = useState<number | null>(null);

    const multipliers = currentCard ? getMultipliers(currentCard) : { high: 0, low: 0, tie: 0 };

    const handlePlay = () => {
        if (!siteUser) return onAuthRequired();
        if (siteUser.balance < betAmount) {
            alert('Yetersiz Bakiye');
            return;
        }

        const newBalance = siteUser.balance - betAmount;
        setSiteUser({ ...siteUser, balance: newBalance });
        supabase.from('site_users').update({ balance: newBalance }).eq('id', siteUser.id).then();

        const newDeck = createDeck();
        const firstCard = newDeck.pop()!;
        
        setDeck(newDeck);
        setCurrentCard(firstCard);
        setHistory([firstCard]);
        setCurrentMultiplier(1);
        setIsPlaying(true);
        setWinAmount(null);
    };

    const handleGuess = (guess: 'high' | 'low' | 'tie') => {
        if (!isPlaying || !currentCard || deck.length === 0) return;

        const nextCard = deck.pop()!;
        const nextDeck = [...deck];
        
        let won = false;
        let stepMult = 0;

        if (guess === 'high' && nextCard.value > currentCard.value) {
            won = true;
            stepMult = multipliers.high;
        } else if (guess === 'low' && nextCard.value < currentCard.value) {
            won = true;
            stepMult = multipliers.low;
        } else if (guess === 'tie' && nextCard.value === currentCard.value) {
            won = true;
            stepMult = multipliers.tie;
        }

        setCurrentCard(nextCard);
        setHistory(prev => [nextCard, ...prev]);
        setDeck(nextDeck);

        if (won) {
            setCurrentMultiplier(prev => prev * stepMult);
        } else {
            // Bust
            setIsPlaying(false);
            setWinAmount(0);
        }
    };

    const handleCashOut = () => {
        if (!isPlaying) return;
        
        const payout = betAmount * currentMultiplier;
        setWinAmount(payout);
        setIsPlaying(false);
        
        if (siteUser) {
            const updatedBalance = siteUser.balance + payout;
            setSiteUser({ ...siteUser, balance: updatedBalance });
            supabase.from('site_users').update({ balance: updatedBalance }).eq('id', siteUser.id).then();
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full h-full bg-[#10171E] text-white font-sans overflow-y-auto md:overflow-hidden">
            
            {/* ── LEFT SIDEBAR (Controls) ── */}
            <div className="w-full md:w-[320px] bg-[#222E3A] border-r border-[#151D24] p-4 flex flex-col shrink-0 z-20 shadow-2xl order-2 md:order-1 h-auto md:h-full overflow-y-auto">
                
                {/* Tabs */}
                <div className="flex bg-[#151D24] rounded-full p-1 mb-6">
                    <button className="flex-1 bg-[#324555] text-white text-sm font-semibold rounded-full py-2 shadow-sm">Manuel</button>
                    <button className="flex-1 text-gray-400 hover:text-white text-sm font-semibold rounded-full py-2 transition-colors">Oto</button>
                </div>

                {/* Bet Amount */}
                <div className="mb-4 relative">
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs text-gray-400 font-semibold">Bahis Tutarı</label>
                        <span className="text-xs text-[#ffd700] font-mono font-bold">₺{siteUser ? siteUser.balance.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex bg-[#151D24] rounded-md border border-[#2A3744] overflow-hidden focus-within:border-[#3D82F6] transition-colors">
                        <div className="px-3 flex items-center justify-center text-gray-400">₺</div>
                        <input 
                            type="number" 
                            value={betAmount || ''}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            disabled={isPlaying}
                            placeholder="0.00"
                            className="flex-1 bg-transparent text-white font-mono text-sm py-3 outline-none"
                        />
                        <div className="flex">
                            <button className="px-3 text-xs font-bold text-gray-300 hover:bg-[#2A3744] border-l border-[#2A3744] transition-colors" onClick={() => setBetAmount(betAmount / 2)}>½</button>
                            <button className="px-3 text-xs font-bold text-gray-300 hover:bg-[#2A3744] border-l border-[#2A3744] transition-colors" onClick={() => setBetAmount(betAmount * 2)}>2x</button>
                        </div>
                    </div>
                </div>

                {/* Live Stats */}
                {isPlaying && (
                    <div className="mb-6 bg-[#151D24] p-3 rounded-md border border-[#2A3744] flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Toplam Çarpan</span>
                        <span className="text-xl font-bold text-emerald-400">{currentMultiplier.toFixed(2)}x</span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                    {!isPlaying ? (
                        <button 
                            onClick={handlePlay}
                            className="w-full bg-[#3D82F6] hover:bg-[#2B6CE0] text-white font-bold py-3.5 rounded-md transition-colors shadow-lg"
                        >
                            Bahis
                        </button>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                <button 
                                    onClick={() => handleGuess('high')}
                                    disabled={multipliers.high === 0}
                                    className="flex flex-col items-center justify-center bg-[#151D24] hover:bg-[#1E2933] border border-[#2A3744] hover:border-emerald-500 text-emerald-400 py-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowUpRight className="w-5 h-5 mb-1" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Yüksek</span>
                                    <span className="text-[10px] font-mono mt-1 text-white">{multipliers.high.toFixed(2)}x</span>
                                </button>
                                <button 
                                    onClick={() => handleGuess('tie')}
                                    className="flex flex-col items-center justify-center bg-[#151D24] hover:bg-[#1E2933] border border-[#2A3744] hover:border-orange-500 text-orange-400 py-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Equal className="w-5 h-5 mb-1" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Aynı</span>
                                    <span className="text-[10px] font-mono mt-1 text-white">{multipliers.tie.toFixed(2)}x</span>
                                </button>
                                <button 
                                    onClick={() => handleGuess('low')}
                                    disabled={multipliers.low === 0}
                                    className="flex flex-col items-center justify-center bg-[#151D24] hover:bg-[#1E2933] border border-[#2A3744] hover:border-red-500 text-red-500 py-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowDownRight className="w-5 h-5 mb-1" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Düşük</span>
                                    <span className="text-[10px] font-mono mt-1 text-white">{multipliers.low.toFixed(2)}x</span>
                                </button>
                            </div>
                            <button 
                                onClick={handleCashOut}
                                className="w-full font-bold py-3.5 rounded-md transition-colors shadow-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                                Bozdur (₺{(betAmount * currentMultiplier).toFixed(2)})
                            </button>
                        </>
                    )}
                </div>

                {/* Profit */}
                {winAmount !== null && (
                    <div className={`mt-4 bg-[#151D24] rounded-md border px-3 py-3 flex items-center justify-between transition-colors ${winAmount > 0 ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}>
                        <span className="text-gray-400 text-xs font-bold uppercase">{winAmount > 0 ? 'Kazanç' : 'Kayıp'}</span>
                        <span className={`font-mono text-sm font-bold ${winAmount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {winAmount > 0 ? `+₺${winAmount.toFixed(2)}` : `-₺${betAmount.toFixed(2)}`}
                        </span>
                    </div>
                )}
            </div>

            {/* ── RIGHT MAIN AREA (Centered Game Frame) ── */}
            <div className="flex-1 bg-[#10171E] relative overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-12 order-1 md:order-2 min-h-[400px] md:min-h-0">
                
                {/* ── CENTERED GAME CONTAINER ── */}
                <div className="w-full max-w-5xl h-full max-h-[700px] relative rounded-3xl shadow-2xl overflow-hidden border-[6px] border-[#1C252D] bg-[#2C1944]">
                    
                    {/* Abstract Background */}
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #4C1D95 0%, transparent 70%)' }}></div>
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>

                    {/* Top Info Badges */}
                    <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
                        <span className="text-white font-bold tracking-widest text-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                            HiLo
                        </span>
                    </div>
                    
                    <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#111111]/50 px-3 py-1.5 rounded-full border border-white/10 z-20">
                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 font-semibold text-xs">Adil Oyun</span>
                    </div>

                    {/* Main Layout: Deck + Current Card */}
                    <div className="absolute inset-0 flex items-center justify-center gap-12 z-10">
                        {/* Deck Stack */}
                        <div className="relative">
                            <CardUI hidden className="opacity-50 translate-x-4 translate-y-4 absolute" />
                            <CardUI hidden className="opacity-70 translate-x-2 translate-y-2 absolute" />
                            <CardUI hidden className="relative z-10 shadow-[20px_0_30px_rgba(0,0,0,0.5)]" />
                        </div>

                        {/* Current Card */}
                        <div className="relative">
                            {currentCard ? (
                                <CardUI card={currentCard} className="scale-125 z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)]" />
                            ) : (
                                <div className="w-24 h-36 md:w-32 md:h-48 border-2 border-dashed border-white/20 rounded-xl scale-125"></div>
                            )}
                        </div>
                    </div>

                    {/* History */}
                    {history.length > 1 && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-[-20px] z-10">
                            {history.slice(1, 6).map((card, idx) => (
                                <div key={idx} className="scale-50 -ml-12 opacity-80" style={{ zIndex: 5 - idx }}>
                                    <CardUI card={card} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Result Overlay */}
                    {winAmount !== null && (
                         <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm animate-fade-in">
                             {winAmount > 0 ? (
                                 <div className="flex flex-col items-center">
                                     <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-pink-400 to-purple-600 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                                         KAZANDIN
                                     </h2>
                                     <div className="text-4xl text-emerald-400 font-black tracking-widest drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]">
                                         +₺{winAmount.toFixed(2)}
                                     </div>
                                 </div>
                             ) : (
                                 <div className="flex flex-col items-center">
                                     <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-red-600 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                                         KAYBETTİN
                                     </h2>
                                 </div>
                             )}
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
}
