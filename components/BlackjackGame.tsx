import React, { useState, useEffect, useCallback } from 'react';
import { BlackjackConfig, BlackjackReward } from '../types';

// ─────────────────────────── CARD ENGINE ────────────────────────────────────
type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card { suit: Suit; rank: Rank; hidden?: boolean; }

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RED_SUITS: Suit[] = ['♥', '♦'];

function buildDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of SUITS) for (const rank of RANKS) deck.push({ suit, rank });
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

// ─────────────────────────── TYPES ──────────────────────────────────────────
type GamePhase = 'waiting' | 'dealing' | 'player' | 'dealer' | 'result' | 'prize';
type GameResult = 'win' | 'blackjack' | 'push' | 'lose' | 'bust' | null;

interface BlackjackGameProps {
    config: BlackjackConfig;
    onGameComplete: (lastPlayTime: number) => void;
    isLoggedIn: boolean;
    onLoginRequired: () => void;
}

// ─────────────────────────── CARD COMPONENT ─────────────────────────────────
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
            <div className="relative flex-shrink-0" style={{ width: '64px', height: '96px' }}>
                <div className="w-full h-full rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f2740)', border: '2px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                    <div className="text-2xl opacity-30">🂠</div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative flex-shrink-0"
            style={{
                width: '64px', height: '96px',
                transform: show ? 'translateY(0) rotateY(0)' : 'translateY(-40px) rotateY(90deg)',
                opacity: show ? 1 : 0,
                transition: 'all 0.35s cubic-bezier(0.34,1.3,0.64,1)',
            }}
        >
            <div className="w-full h-full rounded-xl flex flex-col justify-between p-1.5"
                style={{ background: 'white', border: '2px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.4)' }}>
                <div className="flex flex-col items-start leading-none">
                    <span className="font-black text-sm leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.rank}</span>
                    <span className="text-xs leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.suit}</span>
                </div>
                <div className="text-center text-2xl leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.suit}</div>
                <div className="flex flex-col items-end leading-none rotate-180">
                    <span className="font-black text-sm leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.rank}</span>
                    <span className="text-xs leading-none" style={{ color: isRed ? '#dc2626' : '#111' }}>{card.suit}</span>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────── MONEY BAG ──────────────────────────────────────
const MoneyBag: React.FC<{ reward: BlackjackReward; onOpen: () => void; opened: boolean }> = ({ reward, onOpen, opened }) => {
    const [shaking, setShaking] = useState(true);
    useEffect(() => { const t = setTimeout(() => setShaking(false), 2000); return () => clearTimeout(t); }, []);

    if (opened) return (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="text-8xl" style={{ animation: 'prize-pop 0.6s cubic-bezier(0.34,1.8,0.64,1)', filter: 'drop-shadow(0 0 20px rgba(240,185,11,0.8))' }}>
                {reward.emoji}
            </div>
            <div className="text-center">
                <div className="text-[#f0b90b] font-black text-2xl mb-1">{reward.label}</div>
                <div className="text-zinc-400 text-sm font-bold">Ödülünüz hesabınıza tanımlandı! 🎊</div>
            </div>
            <div className="flex gap-2 mt-2">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full"
                        style={{ background: ['#f0b90b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#f59e0b'][i % 6], animation: `confetti-fall ${0.5 + Math.random() * 1}s ease-out ${Math.random() * 0.5}s forwards` }} />
                ))}
            </div>
        </div>
    );

    return (
        <button
            onClick={onOpen}
            className="flex flex-col items-center gap-3 group cursor-pointer select-none"
            style={{ animation: shaking ? 'bag-shake 0.4s ease-in-out infinite' : 'bag-float 2s ease-in-out infinite' }}
        >
            <div
                className="text-[100px] leading-none transition-transform group-hover:scale-110"
                style={{ filter: `drop-shadow(0 0 30px ${reward.color}88)`, textShadow: 'none' }}
            >
                💰
            </div>
            <div className="px-4 py-2 rounded-full font-black text-sm uppercase tracking-widest text-black animate-pulse"
                style={{ background: 'linear-gradient(90deg, #f0b90b, #ffd357)' }}>
                👆 Dokunarak Aç!
            </div>
        </button>
    );
};

// ─────────────────────────── MAIN GAME COMPONENT ────────────────────────────
const DEFAULT_REWARDS: BlackjackReward[] = [
    { id: '1', label: '50 TL Bonus', emoji: '🎁', weight: 30, color: '#10b981' },
    { id: '2', label: '100 TL Nakit', emoji: '💵', weight: 20, color: '#f0b90b' },
    { id: '3', label: '25 Freespin', emoji: '🎰', weight: 25, color: '#3b82f6' },
    { id: '4', label: '200 TL Bonus', emoji: '🏆', weight: 10, color: '#8b5cf6' },
    { id: '5', label: 'iPhone 15', emoji: '📱', weight: 2, color: '#ef4444' },
    { id: '6', label: '500 TL Jackpot', emoji: '👑', weight: 5, color: '#f59e0b' },
    { id: '7', label: 'Sürpriz Ödül', emoji: '🎊', weight: 8, color: '#ec4899' },
];

function pickReward(rewards: BlackjackReward[]): BlackjackReward {
    const pool = rewards.length ? rewards : DEFAULT_REWARDS;
    const total = pool.reduce((s, r) => s + r.weight, 0);
    let rand = Math.random() * total;
    for (const r of pool) { rand -= r.weight; if (rand <= 0) return r; }
    return pool[pool.length - 1];
}

const BlackjackGame: React.FC<BlackjackGameProps> = ({ config, onGameComplete, isLoggedIn, onLoginRequired }) => {
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [phase, setPhase] = useState<GamePhase>('waiting');
    const [result, setResult] = useState<GameResult>(null);
    const [reward, setReward] = useState<BlackjackReward | null>(null);
    const [bagOpened, setBagOpened] = useState(false);
    const [dealerMsg, setDealerMsg] = useState('Merhaba! Casino 724\'e hoş geldiniz. Oynamaya hazır mısınız?');
    const [cooldownLeft, setCooldownLeft] = useState(0); // ms remaining

    const cooldownHours = config.cooldownHours || 4;

    // Cooldown check
    useEffect(() => {
        const tick = () => {
            const last = Number(localStorage.getItem('blackjack_last_play') || 0);
            const diff = Date.now() - last;
            const cooldownMs = cooldownHours * 60 * 60 * 1000;
            if (diff < cooldownMs) {
                setCooldownLeft(cooldownMs - diff);
            } else {
                setCooldownLeft(0);
            }
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [cooldownHours]);

    const formatCooldown = (ms: number) => {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const startGame = useCallback(() => {
        if (!isLoggedIn) { onLoginRequired(); return; }
        if (cooldownLeft > 0) return;

        const freshDeck = shuffleDeck([...buildDeck(), ...buildDeck()]); // 2 decks
        const pHand: Card[] = [freshDeck[0], freshDeck[2]];
        const dHand: Card[] = [freshDeck[1], { ...freshDeck[3], hidden: true }];
        const remaining = freshDeck.slice(4);

        setDeck(remaining);
        setPlayerHand(pHand);
        setDealerHand(dHand);
        setPhase('player');
        setResult(null);
        setReward(null);
        setBagOpened(false);
        setDealerMsg('Kartlarınız dağıtıldı. İyi şanslar!');

        // Check player blackjack
        if (isBlackjack(pHand)) {
            setTimeout(() => endGame([...pHand], [...dHand], remaining, true), 600);
        }

        localStorage.setItem('blackjack_last_play', String(Date.now()));
        onGameComplete(Date.now());
    }, [isLoggedIn, cooldownLeft, onLoginRequired, onGameComplete]);

    const hit = () => {
        if (phase !== 'player') return;
        const newCard = deck[0];
        const newDeck = deck.slice(1);
        const newHand = [...playerHand, newCard];
        setDeck(newDeck);
        setPlayerHand(newHand);

        if (isBust(newHand)) {
            setDealerMsg('Battınız! 😬 Çok fazla çektiniz.');
            setPhase('result');
            setResult('bust');
            // Reveal dealer card
            setDealerHand(prev => prev.map(c => ({ ...c, hidden: false })));
        } else if (handTotal(newHand) === 21) {
            stand(newHand, newDeck);
        }
    };

    const stand = (currentHand?: Card[], currentDeck?: Card[]) => {
        if (phase !== 'player' && !currentHand) return;
        const pHand = currentHand || playerHand;
        const workDeck = currentDeck || deck;

        // Reveal dealer's hidden card
        let revealedDealer = dealerHand.map(c => ({ ...c, hidden: false }));
        setDealerHand(revealedDealer);
        setPhase('dealer');
        setDealerMsg('Krupiye açıyor...');

        // Dealer logic with timeout
        let dHand = [...revealedDealer];
        let dDeck = [...workDeck];

        const dealerPlay = (hand: Card[], d: Card[]) => {
            const total = handTotal(hand);
            const hitSoft17 = config.dealerHitSoft17 ?? true;
            const shouldHit = total < 17 || (hitSoft17 && total === 17 && hand.some(c => c.rank === 'A'));
            if (shouldHit) {
                const newCard = d[0];
                const nDeck = d.slice(1);
                const nHand = [...hand, newCard];
                setDealerHand(nHand);
                setTimeout(() => dealerPlay(nHand, nDeck), 600);
            } else {
                setTimeout(() => endGame(pHand, hand, d), 400);
            }
        };

        setTimeout(() => dealerPlay(dHand, dDeck), 700);
    };

    const endGame = (pHand: Card[], dHand: Card[], _deck: Card[], _bjCheck = false) => {
        const pTotal = handTotal(pHand);
        const dTotal = handTotal(dHand);
        const pBJ = isBlackjack(pHand);
        const dBJ = isBlackjack(dHand);

        let res: GameResult;
        if (pBJ && !dBJ) {
            res = 'blackjack';
        } else if (pBJ && dBJ) {
            res = 'push';
        } else if (dBJ) {
            res = 'lose';
        } else if (isBust(pHand)) {
            res = 'bust';
        } else if (isBust(dHand)) {
            res = 'win';
        } else if (pTotal > dTotal) {
            res = 'win';
        } else if (pTotal === dTotal) {
            res = 'push';
        } else {
            res = 'lose';
        }

        setResult(res);
        setPhase(res === 'win' || res === 'blackjack' ? 'prize' : 'result');

        if (res === 'blackjack') {
            setDealerMsg('BLACKJACK! 🎴 Mükemmel! Ödülünüzü kazandınız!');
            setReward(pickReward(config.rewards?.length ? config.rewards : DEFAULT_REWARDS));
        } else if (res === 'win') {
            setDealerMsg('Kazandınız! 🎉 Harikasınız! Kese sizin!');
            setReward(pickReward(config.rewards?.length ? config.rewards : DEFAULT_REWARDS));
        } else if (res === 'push') {
            setDealerMsg('Berabere! 🤝 Tekrar deneyin.');
        } else if (res === 'bust') {
            setDealerMsg('Battınız! 😬 Çok fazla çektiniz. Şansınız daha iyi olsun!');
        } else {
            setDealerMsg('Krupiye kazandı. 😤 Şansınız daha iyi olsun!');
        }
    };

    const playerTotal = handTotal(playerHand);
    const dealerTotal = handTotal(dealerHand.filter(c => !c.hidden));

    // ─── COOLDOWN SCREEN ────────────────────────────────────────────────
    if (phase === 'waiting' && cooldownLeft > 0 && isLoggedIn) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
                <div className="text-7xl">⏳</div>
                <div className="text-center">
                    <div className="text-[var(--text-primary)] font-black text-3xl mb-2 uppercase tracking-tight">Bir Sonraki El</div>
                    <div className="text-[#f0b90b] font-black text-5xl tabular-nums tracking-widest">{formatCooldown(cooldownLeft)}</div>
                    <div className="text-[var(--text-muted)] font-bold text-sm mt-3">Her {cooldownHours} saatte bir el oynama hakkınız var</div>
                </div>
            </div>
        );
    }

    // ─── TABLE SCREEN ────────────────────────────────────────────────────
    return (
        <div className="min-h-screen relative overflow-hidden transition-colors duration-500">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, var(--text-primary) 0, var(--text-primary) 1px, transparent 0, transparent 50%)',
                backgroundSize: '6px 6px',
            }} />

            <div className="relative z-10 max-w-3xl mx-auto px-4 py-6 mt-16">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-2xl">🎴</span>
                            <h1 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">
                                CASINO <span style={{ color: '#f0b90b' }}>724</span>
                            </h1>
                        </div>
                        <div className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">Blackjack · Profesyonel Masa</div>
                    </div>
                    {!isLoggedIn ? (
                        <button onClick={onLoginRequired}
                            className="px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest text-black transition-all hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)' }}>
                            🔑 Giriş Yap
                        </button>
                    ) : cooldownLeft > 0 ? (
                        <div className="text-right">
                            <div className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Sonraki El</div>
                            <div className="text-[#f0b90b] font-black tabular-nums">{formatCooldown(cooldownLeft)}</div>
                        </div>
                    ) : null}
                </div>

                {/* Casino Table */}
                <div className="relative rounded-[32px] overflow-hidden p-6"
                    style={{
                        background: 'linear-gradient(145deg, #0d3b17, #0a2e12, #062009)',
                        border: '3px solid rgba(240,185,11,0.25)',
                        boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 0 80px rgba(0,0,0,0.4), 0 0 30px rgba(10,60,25,0.3)',
                        minHeight: '520px',
                    }}>

                    {/* Table border glow */}
                    <div className="absolute inset-0 rounded-[32px] pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)' }} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px]"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(240,185,11,0.6), transparent)' }} />

                    {/* PRIZE PHASE */}
                    {(phase === 'prize') && reward && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[32px]"
                            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
                            <MoneyBag reward={reward} onOpen={() => setBagOpened(true)} opened={bagOpened} />
                            {bagOpened && (
                                <button
                                    onClick={() => { setPhase('waiting'); setResult(null); setBagOpened(false); setReward(null); setCooldownLeft(cooldownHours * 3600000); }}
                                    className="mt-8 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-black transition-all hover:scale-105"
                                    style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)', boxShadow: '0 0 20px rgba(240,185,11,0.4)' }}>
                                    Masaya Dön
                                </button>
                            )}
                        </div>
                    )}

                    {/* WAITING PHASE */}
                    {phase === 'waiting' && (
                        <div className="flex flex-col items-center justify-center h-full gap-8 py-16">
                            {/* Dealer Avatar */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                                    style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', border: '2px solid rgba(240,185,11,0.3)', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                                    🎩
                                </div>
                                <div className="text-center">
                                    <div className="text-[#f0b90b] font-black text-sm uppercase tracking-wider">Casino 724 Krupiyesi</div>
                                    <div className="text-white text-sm font-bold mt-1 max-w-xs text-center italic">"{dealerMsg}"</div>
                                </div>
                            </div>

                            {!isLoggedIn ? (
                                <button onClick={onLoginRequired}
                                    className="px-10 py-4 rounded-2xl font-black text-base uppercase tracking-widest text-black transition-all hover:scale-105 shadow-2xl"
                                    style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)', boxShadow: '0 0 30px rgba(240,185,11,0.4)' }}>
                                    🔑 Üye Ol & Oyna
                                </button>
                            ) : (
                                <button onClick={startGame}
                                    className="px-10 py-4 rounded-2xl font-black text-base uppercase tracking-widest text-black transition-all hover:scale-105 shadow-2xl"
                                    style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)', boxShadow: '0 0 30px rgba(240,185,11,0.4)' }}>
                                    🎴 El Oyna
                                </button>
                            )}
                            <div className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">
                                Her {cooldownHours} saatte bir el · Ücretsiz
                            </div>
                        </div>
                    )}

                    {/* ACTIVE GAME */}
                    {(phase === 'player' || phase === 'dealer' || phase === 'result') && (
                        <div className="flex flex-col gap-4">
                            {/* Dealer Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl">🎩</span>
                                    <div>
                                        <div className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Krupiye</div>
                                        <div className="text-white font-black text-sm">{phase !== 'player' ? `Toplam: ${handTotal(dealerHand)}` : `Görünen: ${dealerTotal}`}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-wrap min-h-[100px] items-center">
                                    {dealerHand.map((card, i) => (
                                        <CardUI key={i} card={card} delay={i * 200} animate={false} />
                                    ))}
                                </div>
                            </div>

                            {/* Dealer speech bubble */}
                            <div className="px-4 py-3 rounded-2xl text-center"
                                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <span className="text-zinc-300 text-sm font-bold italic">🎩 "{dealerMsg}"</span>
                            </div>

                            {/* Result banner */}
                            {phase === 'result' && result && (
                                <div className="flex items-center justify-center py-4 rounded-2xl font-black text-xl uppercase tracking-widest animate-fade-in"
                                    style={{
                                        background: result === 'bust' || result === 'lose' ? 'rgba(239,68,68,0.15)' : result === 'push' ? 'rgba(100,100,100,0.15)' : 'rgba(16,185,129,0.15)',
                                        border: `1px solid ${result === 'bust' || result === 'lose' ? 'rgba(239,68,68,0.3)' : result === 'push' ? 'rgba(100,100,100,0.3)' : 'rgba(16,185,129,0.3)'}`,
                                        color: result === 'bust' || result === 'lose' ? '#ef4444' : result === 'push' ? '#9ca3af' : '#10b981',
                                    }}>
                                    {result === 'blackjack' ? '🎴 BLACKJACK!' : result === 'win' ? '🏆 KAZANDINIZ!' : result === 'push' ? '🤝 BERABERE' : result === 'bust' ? '💥 BATTINIZ' : '😤 KRUPİYE KAZANDI'}
                                </div>
                            )}

                            {/* Player Section */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">🧑‍💼</span>
                                        <div>
                                            <div className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Sizin Elin</div>
                                            <div className={`font-black text-sm ${playerTotal > 21 ? 'text-red-400' : playerTotal === 21 ? 'text-[#f0b90b]' : 'text-white'}`}>
                                                Toplam: {playerTotal}{playerTotal === 21 ? ' 🌟' : playerTotal > 21 ? ' BUST' : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-wrap min-h-[100px] items-center">
                                    {playerHand.map((card, i) => (
                                        <CardUI key={i} card={card} delay={i === playerHand.length - 1 ? 0 : i * 200} />
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {phase === 'player' && (
                                <div className="flex gap-3 justify-center mt-2">
                                    <button onClick={hit}
                                        className="px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95"
                                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 15px rgba(16,185,129,0.3)' }}>
                                        🃏 Çek
                                    </button>
                                    <button onClick={() => stand()}
                                        className="px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95"
                                        style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)', boxShadow: '0 0 15px rgba(240,185,11,0.3)' }}>
                                        ✋ Dur
                                    </button>
                                </div>
                            )}

                            {phase === 'result' && (
                                <div className="flex justify-center mt-2">
                                    <button onClick={() => { setPhase('waiting'); setResult(null); }}
                                        className="px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-black transition-all hover:scale-105"
                                        style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)' }}>
                                        🔄 Tekrar Oyna
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Info strip */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                    {[
                        { label: 'Krupiye', value: 'Casino 724' },
                        { label: 'El Hakkı', value: `Her ${cooldownHours} Saat` },
                        { label: 'Mod', value: 'Ücretsiz Demo' },
                    ].map((item, i) => (
                        <div key={i} className="px-3 py-2.5 rounded-xl text-center bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                            <div className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest mb-0.5">{item.label}</div>
                            <div className="text-[var(--text-primary)] font-black text-xs">{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes bag-shake {
          0%,100%{transform:rotate(0deg)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)}
        }
        @keyframes bag-float {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)}
        }
        @keyframes prize-pop {
          0%{transform:scale(0) rotate(-20deg);opacity:0}
          60%{transform:scale(1.3) rotate(5deg)}
          100%{transform:scale(1) rotate(0);opacity:1}
        }
        @keyframes confetti-fall {
          0%{transform:translateY(0) rotate(0);opacity:1}
          100%{transform:translateY(60px) rotate(360deg);opacity:0}
        }
        @keyframes animate-fade-in {
          from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)}
        }
        .animate-fade-in { animation: animate-fade-in 0.4s ease forwards; }
      `}</style>
        </div>
    );
};

export default BlackjackGame;
