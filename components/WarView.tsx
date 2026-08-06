import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { ShieldCheck, Swords } from 'lucide-react';

type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

interface Card {
    suit: Suit;
    rank: Rank;
    value: number;
}

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];

function getRankString(val: number): Rank {
    if (val === 14) return 'A';
    if (val === 13) return 'K';
    if (val === 12) return 'Q';
    if (val === 11) return 'J';
    return val.toString() as Rank;
}

const CardUI = ({ card, hidden = false }: { card?: Card; hidden?: boolean }) => {
    if (hidden || !card) {
        return (
            <div className="w-24 h-36 md:w-32 md:h-48 rounded-xl border-2 border-white/20 bg-[repeating-linear-gradient(45deg,#1e293b_0,#1e293b_10px,#0f172a_10px,#0f172a_20px)] shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-white/10 flex items-center justify-center bg-white/5">
                    <span className="text-white/20 font-black text-2xl">724</span>
                </div>
            </div>
        );
    }

    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
        <div className="w-24 h-36 md:w-32 md:h-48 rounded-xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.3)] border border-gray-200 relative overflow-hidden flex flex-col justify-between p-2 animate-pop-in">
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

export default function WarView({ siteUser, onAuthRequired }: any) {
    const { playInstantGame } = useUser();
    const [betAmount, setBetAmount] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const [playerCard, setPlayerCard] = useState<Card | null>(null);
    const [dealerCard, setDealerCard] = useState<Card | null>(null);
    const [result, setResult] = useState<'win' | 'lose' | 'tie' | null>(null);
    const [winAmount, setWinAmount] = useState<number | null>(null);

    const handlePlay = async () => {
        if (!siteUser) return onAuthRequired();

        setIsPlaying(true);
        setPlayerCard(null);
        setDealerCard(null);
        setResult(null);
        setWinAmount(null);

        try {
            const data = await playInstantGame(betAmount, 'War');
            const pVal = data.result.player;
            const dVal = data.result.dealer;
            const payout = data.win_amount;
            
            // Randomly assign a suit just for visual since backend returned rank values
            const pSuit = SUITS[Math.floor(Math.random() * 4)];
            const dSuit = SUITS[Math.floor(Math.random() * 4)];
            
            const pCard: Card = { suit: pSuit, rank: getRankString(pVal), value: pVal };
            const dCard: Card = { suit: dSuit, rank: getRankString(dVal), value: dVal };

            setTimeout(() => {
                setPlayerCard(pCard);
                setDealerCard(dCard);
                
                let currentResult: 'win' | 'lose' | 'tie' = 'lose';
                if (pVal > dVal) currentResult = 'win';
                else if (pVal === dVal) currentResult = 'tie';
                else currentResult = 'lose';

                setResult(currentResult);
                setWinAmount(payout);
                setIsPlaying(false);
            }, 1000);
            
        } catch (e: any) {
            alert(e.message || 'Hata oluştu');
            setIsPlaying(false);
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
                <div className="mb-6 relative">
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

                {/* Info Panel */}
                <div className="mb-6 bg-[#151D24] p-4 rounded-md border border-[#2A3744]">
                    <h3 className="text-sm font-bold text-white mb-2">Kurallar</h3>
                    <ul className="text-xs text-gray-400 space-y-1">
                        <li>• Yüksek kart kazanır (As en yüksek)</li>
                        <li>• Kazanana 2x ödeme yapılır.</li>
                        <li>• Beraberlik (Savaş) durumunda bahis iade edilir.</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                    <button 
                        onClick={handlePlay}
                        disabled={isPlaying}
                        className={`w-full font-bold py-3.5 rounded-md transition-colors shadow-lg ${
                            isPlaying ? 'bg-[#324555] text-gray-400 cursor-not-allowed' : 'bg-[#00E5FF] hover:bg-emerald-600 text-white'
                        }`}
                    >
                        {isPlaying ? 'Kartlar Dağıtılıyor...' : 'Bahis'}
                    </button>
                </div>

                {/* Profit */}
                {winAmount !== null && (
                    <div className={`mt-4 bg-[#151D24] rounded-md border px-3 py-3 flex items-center justify-between transition-colors ${
                        result === 'win' ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 
                        result === 'tie' ? 'border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' :
                        'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                    }`}>
                        <span className="text-gray-400 text-xs font-bold uppercase">
                            {result === 'win' ? 'Kazanç' : result === 'tie' ? 'Beraberlik' : 'Kayıp'}
                        </span>
                        <span className={`font-mono text-sm font-bold ${
                            result === 'win' ? 'text-[#00E5FF]' : result === 'tie' ? 'text-orange-400' : 'text-red-400'
                        }`}>
                            {result === 'win' ? `+₺${winAmount.toFixed(2)}` : result === 'tie' ? '+₺0.00' : `-₺${betAmount.toFixed(2)}`}
                        </span>
                    </div>
                )}
            </div>

            {/* ── RIGHT MAIN AREA (Centered Game Frame) ── */}
            <div className="flex-1 bg-[#10171E] relative overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-12 order-1 md:order-2 min-h-[400px] md:min-h-0">
                
                {/* ── CENTERED GAME CONTAINER ── */}
                <div className="w-full max-w-5xl h-full max-h-[700px] relative rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between items-center border-[6px] border-[#1C252D] bg-[#0F2027]">
                    
                    {/* Felt Texture Overlay */}
                    <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, transparent 20%, #000 150%)', backgroundSize: '100% 100%' }}></div>
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'10\' viewBox=\'0 0 10 10\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h1v1H0z\' fill=\'%23fff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>

                    {/* Top Info Badges */}
                    <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
                        <Swords className="w-5 h-5 text-gray-400" />
                        <span className="text-white font-bold tracking-widest text-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            Casino War
                        </span>
                    </div>
                    
                    <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#0A0C10]/50 px-3 py-1.5 rounded-full border border-white/10 z-20">
                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 font-semibold text-xs">Adil Oyun</span>
                    </div>

                    {/* Table Markings */}
                    <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] border-2 border-white/5 rounded-full pointer-events-none flex items-center justify-center">
                        <div className="text-white/5 font-black text-2xl md:text-5xl tracking-[1em] uppercase whitespace-nowrap">
                            WAR
                        </div>
                    </div>

                    {/* Dealer Area */}
                    <div className="w-full flex flex-col items-center mt-16 relative z-10">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 border border-gray-700 bg-black/50 px-4 py-1 rounded-full">Kasa</span>
                        <div className="flex justify-center min-h-[140px] md:min-h-[200px]">
                            {isPlaying ? (
                                <CardUI hidden />
                            ) : (
                                dealerCard ? <CardUI card={dealerCard} /> : <div className="w-24 h-36 md:w-32 md:h-48 border-2 border-dashed border-white/20 rounded-xl"></div>
                            )}
                        </div>
                    </div>

                    {/* VS Text */}
                    <div className="my-4 z-10">
                        <span className="text-white/30 font-black italic text-4xl">VS</span>
                    </div>

                    {/* Player Area */}
                    <div className="w-full flex flex-col items-center mb-16 relative z-10">
                        <div className="flex justify-center min-h-[140px] md:min-h-[200px] mb-4">
                            {isPlaying ? (
                                <CardUI hidden />
                            ) : (
                                playerCard ? <CardUI card={playerCard} /> : <div className="w-24 h-36 md:w-32 md:h-48 border-2 border-dashed border-white/20 rounded-xl"></div>
                            )}
                        </div>
                        <span className="text-[#ffd700] text-xs font-bold uppercase tracking-widest border border-[#ffd700]/30 bg-black/50 px-4 py-1 rounded-full">Sen</span>
                    </div>

                    {/* Result Overlay */}
                    {result && (
                         <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm animate-fade-in">
                             {result === 'win' && (
                                 <div className="flex flex-col items-center">
                                     <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#b8860b] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                                         KAZANDIN
                                     </h2>
                                     <div className="text-4xl text-[#00E5FF] font-black tracking-widest drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]">
                                         +₺{winAmount?.toFixed(2)}
                                     </div>
                                 </div>
                             )}
                             {result === 'lose' && (
                                 <div className="flex flex-col items-center">
                                     <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-red-600 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                                         KAYBETTİN
                                     </h2>
                                 </div>
                             )}
                             {result === 'tie' && (
                                 <div className="flex flex-col items-center">
                                     <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-orange-500 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                                         SAVAŞ!
                                     </h2>
                                     <span className="text-white text-xl uppercase tracking-widest mt-2 bg-black/50 px-4 py-1 rounded-full">Beraberlik - Bahis İade Edildi</span>
                                 </div>
                             )}
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
}
