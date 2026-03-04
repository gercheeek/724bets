import React, { useState, useEffect, useMemo } from 'react';
import { PoolConfig, PoolEntry, PoolMatch } from '../types';
import { Trophy, Users, CheckCircle2, XCircle, Clock, Zap, ChevronDown, ChevronUp, Lock, Coins } from 'lucide-react';

const POOL_STORAGE_KEY = 'site_pool_config';

function loadPool(): PoolConfig | null {
    try { const d = localStorage.getItem(POOL_STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}
function savePool(p: PoolConfig) { localStorage.setItem(POOL_STORAGE_KEY, JSON.stringify(p)); }

function loadUserCoins(userId: string): number {
    try { const d = localStorage.getItem(`loyalty_${userId}`); return d ? JSON.parse(d).coins || 0 : 0; } catch { return 0; }
}
function spendCoins(userId: string, amount: number): boolean {
    try {
        const key = `loyalty_${userId}`;
        const d = JSON.parse(localStorage.getItem(key) || '{}');
        if ((d.coins || 0) < amount) return false;
        d.coins = (d.coins || 0) - amount;
        d.transactions = d.transactions || [];
        d.transactions.unshift({ id: `tx-${Date.now()}`, userId, type: 'spend', amount, reason: '724TOTO katılım ücreti', timestamp: Date.now() });
        localStorage.setItem(key, JSON.stringify(d));
        return true;
    } catch { return false; }
}

interface PoolGameProps {
    userId: string;
    username: string;
    isLoggedIn: boolean;
    onLoginRequired: () => void;
}

const PoolGame: React.FC<PoolGameProps> = ({ userId, username, isLoggedIn, onLoginRequired }) => {
    const [pool, setPool] = useState<PoolConfig | null>(null);
    const [selections, setSelections] = useState<Record<number, '1' | 'X' | '2'>>({});
    const [submitted, setSubmitted] = useState(false);
    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const [tab, setTab] = useState<'play' | 'leaderboard' | 'pool'>('play');

    useEffect(() => {
        const p = loadPool();
        setPool(p);
        if (p) {
            const existing = p.entries.find(e => e.userId === userId);
            if (existing) setSubmitted(true);
        }
    }, [userId]);

    // Calculate leaderboard
    const leaderboard = useMemo(() => {
        if (!pool) return [];
        if (pool.status !== 'completed') return pool.entries;
        return pool.entries.map(e => {
            let correct = 0;
            pool.matches.forEach((m, i) => { if (m.result && e.predictions[i] === m.result) correct++; });
            return { ...e, correctCount: correct };
        }).sort((a, b) => (b.correctCount || 0) - (a.correctCount || 0));
    }, [pool]);

    // Prize distribution
    const prizeInfo = useMemo(() => {
        if (!pool || pool.status !== 'completed') return null;
        const w15 = leaderboard.filter(e => e.correctCount === 15).length;
        const w14 = leaderboard.filter(e => e.correctCount === 14).length;
        const w13 = leaderboard.filter(e => e.correctCount === 13).length;
        return {
            winners15: w15, share15: w15 > 0 ? (pool.prize15 / w15) : 0,
            winners14: w14, share14: w14 > 0 ? (pool.prize14 / w14) : 0,
            winners13: w13, share13: w13 > 0 ? (pool.prize13 / w13) : 0,
        };
    }, [pool, leaderboard]);

    if (!pool || pool.matches.length === 0) {
        return (
            <div id="pool-section" className="flex flex-col items-center justify-center gap-6 py-24 bg-[#0B0B0F] relative overflow-hidden">
                <div className="text-7xl">⚽</div>
                <h2 className="text-white font-black text-3xl uppercase tracking-tight text-center">724TOTO</h2>
                <p className="text-zinc-500 font-bold text-sm text-center max-w-md">
                    Şu anda aktif bir 15 maçlık havuz bulunmuyor. Admin yeni bir havuz oluşturduğunda burada görünecektir.
                </p>
            </div>
        );
    }

    const isFreeAvailable = !pool.freeEntryUsed[userId];
    const userEntry = pool.entries.find(e => e.userId === userId);
    const allSelected = Object.keys(selections).length === 15;

    const handleSelect = (matchIdx: number, pick: '1' | 'X' | '2') => {
        if (submitted || pool.status !== 'open') return;
        setSelections(prev => ({ ...prev, [matchIdx]: pick }));
    };

    const handleSubmit = () => {
        if (!isLoggedIn) { onLoginRequired(); return; }
        if (!allSelected || submitted) return;

        const preds = pool.matches.map((_, i) => selections[i]);
        if (preds.some(p => !p)) return;

        if (!isFreeAvailable) {
            const coins = loadUserCoins(userId);
            if (coins < 1000) {
                alert('Yetersiz Coin bakiyesi! 1000 Coin gereklidir.');
                return;
            }
            if (!spendCoins(userId, 1000)) {
                alert('Coin harcama hatası.');
                return;
            }
        }

        const entry: PoolEntry = {
            userId,
            username,
            predictions: preds as ('1' | 'X' | '2')[],
            submittedAt: Date.now(),
            isFreeEntry: isFreeAvailable,
        };

        const updated = { ...pool };
        updated.entries = [...updated.entries, entry];
        if (isFreeAvailable) updated.freeEntryUsed = { ...updated.freeEntryUsed, [userId]: true };
        savePool(updated);
        setPool(updated);
        setSubmitted(true);
    };

    return (
        <section id="pool-section" className="w-full bg-[#0B0B0F] px-4 md:px-8 py-24 relative overflow-hidden">
            <div className="absolute inset-0 premium-bg-grid opacity-10" />
            <div className="max-w-[1240px] mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-10 animate-text-reveal">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">
                        724<span className="text-[#f0b90b]">TOTO</span>
                    </h1>
                    <p className="text-zinc-500 font-bold text-sm">15 maçı doğru tahmin et, büyük ödülü kazan!</p>
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${pool.status === 'open' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : pool.status === 'live' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                            {pool.status === 'open' ? '🟢 TAHMİNLER AÇIK' : pool.status === 'live' ? '🔴 CANLI' : '✅ TAMAMLANDI'}
                        </span>
                        <span className="text-zinc-600 text-xs font-bold">{pool.entries.length} Katılımcı</span>
                    </div>
                </div>

                {/* Prize Pool Banner */}
                <div className="bg-gradient-to-r from-[#0a0800] to-[#120d00] border border-[#f0b90b]/30 rounded-2xl p-6 mb-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f0b90b]/5 to-transparent pointer-events-none" />
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1 relative z-10">TOPLAM ÖDÜL HAVUZU</p>
                    <p className="text-4xl font-black text-[#f0b90b] relative z-10">{pool.prizePool.toLocaleString('tr-TR')} ₺</p>
                    <div className="flex items-center justify-center gap-6 mt-3 relative z-10">
                        <span className="text-xs text-zinc-400 font-bold">15 Bilen: <span className="text-[#f0b90b]">{pool.prize15.toLocaleString('tr-TR')} ₺</span></span>
                        <span className="text-xs text-zinc-400 font-bold">14 Bilen: <span className="text-white">{pool.prize14.toLocaleString('tr-TR')} ₺</span></span>
                        <span className="text-xs text-zinc-400 font-bold">13 Bilen: <span className="text-zinc-300">{pool.prize13.toLocaleString('tr-TR')} ₺</span></span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {(['play', 'leaderboard', 'pool'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-[#f0b90b] text-black' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:bg-zinc-800'}`}>
                            {t === 'play' ? '🎯 TAHMİN YAP' : t === 'leaderboard' ? '🏆 SIRALAMA' : '👁 ŞEFFAF HAVUZ'}
                        </button>
                    ))}
                </div>

                {/* PLAY TAB */}
                {tab === 'play' && (
                    <div className="space-y-1.5">
                        {!isFreeAvailable && !submitted && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 flex items-center gap-3 mb-4">
                                <Coins className="w-5 h-5 text-yellow-400 shrink-0" />
                                <p className="text-yellow-400 text-xs font-bold">Ücretsiz hakkınızı kullandınız. Bu katılım <span className="text-white">1000 Coin</span> ücretlidir.</p>
                            </div>
                        )}

                        {pool.matches.map((match, idx) => (
                            <div key={match.id} className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-2.5 flex items-center gap-3 hover:bg-zinc-900/60 transition-colors">
                                <span className="text-zinc-600 text-[11px] font-black w-6 text-center shrink-0">{idx + 1}</span>
                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between pr-4">
                                    <p className="text-white font-black text-[13px] leading-tight">
                                        {match.homeTeam} <span className="text-zinc-600 mx-1 font-bold text-[11px]">vs</span> {match.awayTeam}
                                    </p>
                                    <p className="text-zinc-500 text-[10px] font-bold mt-0.5 sm:mt-0">{match.league} · {match.matchDate}</p>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                    {(['1', 'X', '2'] as const).map(pick => {
                                        const isSelected = selections[idx] === pick;
                                        const isResult = pool.status === 'completed' && match.result === pick;
                                        const userPick = userEntry?.predictions[idx];
                                        const isUserPick = userPick === pick;
                                        return (
                                            <button
                                                key={pick}
                                                onClick={() => handleSelect(idx, pick)}
                                                disabled={submitted || pool.status !== 'open'}
                                                className={`w-10 h-8 rounded-lg text-sm font-black border transition-all ${isResult ? 'bg-green-500/20 border-green-500 text-green-400' :
                                                    isSelected ? 'bg-[#f0b90b]/20 border-[#f0b90b] text-[#f0b90b]' :
                                                        isUserPick && pool.status !== 'open' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                                                            'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-600'
                                                    } ${submitted || pool.status !== 'open' ? 'cursor-default' : 'cursor-pointer'}`}
                                            >
                                                {pick}
                                            </button>
                                        );
                                    })}
                                </div>
                                {pool.status === 'completed' && match.result && userEntry && (
                                    <div className="w-5 shrink-0 flex justify-end">
                                        {userEntry.predictions[idx] === match.result
                                            ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            : <XCircle className="w-4 h-4 text-red-500" />}
                                    </div>
                                )}
                            </div>
                        ))}

                        {!submitted && pool.status === 'open' && (
                            <button
                                onClick={handleSubmit}
                                disabled={!allSelected}
                                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${allSelected ? 'bg-[#f0b90b] text-black hover:shadow-[0_0_30px_rgba(240,185,11,0.4)]' : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'}`}
                            >
                                {allSelected ? (isFreeAvailable ? '🎯 ÜCRETSİZ GÖNDER' : '🎯 1000 COİN İLE GÖNDER') : `${Object.keys(selections).length}/15 MAÇ SEÇİLDİ`}
                            </button>
                        )}

                        {submitted && (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
                                <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
                                <p className="text-green-400 font-black text-lg uppercase">Tahmininiz Kaydedildi!</p>
                                <p className="text-zinc-500 text-xs font-bold mt-1">Maçlar başladığında Şeffaf Havuz sekmesinden tüm tahminleri görebilirsiniz.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* LEADERBOARD TAB */}
                {tab === 'leaderboard' && (
                    <div className="space-y-2">
                        {pool.status !== 'completed' ? (
                            <div className="text-center py-16">
                                <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                <p className="text-zinc-500 font-bold">Sıralama, tüm maçlar tamamlandığında görünecektir.</p>
                            </div>
                        ) : (
                            <>
                                {prizeInfo && (
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                                            <p className="text-[10px] text-zinc-500 font-black uppercase">15 Bilen</p>
                                            <p className="text-xl font-black text-[#f0b90b]">{prizeInfo.winners15} kişi</p>
                                            <p className="text-xs text-zinc-400 font-bold mt-1">Kişi başı: {prizeInfo.share15.toLocaleString('tr-TR')} ₺</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                            <p className="text-[10px] text-zinc-500 font-black uppercase">14 Bilen</p>
                                            <p className="text-xl font-black text-white">{prizeInfo.winners14} kişi</p>
                                            <p className="text-xs text-zinc-400 font-bold mt-1">Kişi başı: {prizeInfo.share14.toLocaleString('tr-TR')} ₺</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                            <p className="text-[10px] text-zinc-500 font-black uppercase">13 Bilen</p>
                                            <p className="text-xl font-black text-zinc-300">{prizeInfo.winners13} kişi</p>
                                            <p className="text-xs text-zinc-400 font-bold mt-1">Kişi başı: {prizeInfo.share13.toLocaleString('tr-TR')} ₺</p>
                                        </div>
                                    </div>
                                )}
                                {leaderboard.map((entry, idx) => (
                                    <div key={entry.userId} className="gradient-border-card p-4">
                                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedUser(expandedUser === entry.userId ? null : entry.userId)}>
                                            <div className="flex items-center gap-3">
                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${idx < 3 ? 'bg-[#f0b90b]/20 text-[#f0b90b]' : 'bg-zinc-900 text-zinc-500'}`}>{idx + 1}</span>
                                                <span className="text-white font-bold text-sm">{entry.username}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`font-black text-lg ${(entry.correctCount || 0) >= 13 ? 'text-green-400' : 'text-zinc-400'}`}>
                                                    {entry.correctCount || 0}/15
                                                </span>
                                                {expandedUser === entry.userId ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                                            </div>
                                        </div>
                                        {expandedUser === entry.userId && (
                                            <div className="mt-4 space-y-1.5 border-t border-zinc-800 pt-4">
                                                {pool.matches.map((m, i) => {
                                                    const isCorrect = m.result === entry.predictions[i];
                                                    return (
                                                        <div key={m.id} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                                            <span className="text-zinc-300 font-bold">{m.homeTeam} vs {m.awayTeam}</span>
                                                            <div className="flex items-center gap-3">
                                                                <span className={`font-black ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>Tahmin: {entry.predictions[i]}</span>
                                                                <span className="text-zinc-500 font-bold">Sonuç: {m.result}</span>
                                                                {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}

                {/* TRANSPARENT POOL TAB */}
                {tab === 'pool' && (
                    <div className="space-y-2">
                        {pool.status === 'open' ? (
                            <div className="text-center py-16">
                                <Lock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                <p className="text-zinc-500 font-bold">Tahminler, maçlar başladıktan sonra şeffaf havuzda görünecektir.</p>
                            </div>
                        ) : (
                            pool.entries.length === 0 ? (
                                <div className="text-center py-16">
                                    <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                    <p className="text-zinc-500 font-bold">Henüz katılımcı yok.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b border-zinc-800">
                                                    <th className="text-left py-3 px-2 text-zinc-500 font-black uppercase tracking-widest">Kullanıcı</th>
                                                    {pool.matches.map((m, i) => (
                                                        <th key={i} className="py-3 px-1 text-zinc-600 font-bold text-center min-w-[36px]" title={`${m.homeTeam} vs ${m.awayTeam}`}>{i + 1}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pool.entries.map(entry => (
                                                    <tr key={entry.userId} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                                                        <td className="py-2 px-2 text-white font-bold">{entry.username}</td>
                                                        {entry.predictions.map((pred, i) => {
                                                            const m = pool.matches[i];
                                                            const isCorrect = pool.status === 'completed' && m.result === pred;
                                                            const isWrong = pool.status === 'completed' && m.result && m.result !== pred;
                                                            return (
                                                                <td key={i} className={`py-2 px-1 text-center font-black ${isCorrect ? 'text-green-400 bg-green-500/10' : isWrong ? 'text-red-400 bg-red-500/10' : 'text-zinc-400'}`}>
                                                                    {pred}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PoolGame;
