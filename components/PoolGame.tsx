import React, { useState, useEffect, useMemo } from 'react';
import { PoolConfig, PoolEntry, PoolMatch } from '../types';
import { Users, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Lock, Coins, AlertTriangle, MessageSquare, X, Activity } from 'lucide-react';

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

/* ─── Analysis Panel Sub-Component ─────────────────────────────────────────── */
const AnalysisPanel: React.FC<{ match: PoolMatch; onClose: () => void }> = ({ match, onClose }) => {
    const a = match.analysis;
    if (!a) return (
        <div className="pool-analysis-enter bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-b-[10px] px-4 py-4">
            <p className="text-[var(--text-muted)] text-xs font-bold text-center">Bu maç için analiz verisi bulunmuyor.</p>
        </div>
    );

    const FormDots: React.FC<{ form: ('W' | 'D' | 'L')[], label: string }> = ({ form, label }) => (
        <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-wider">{label}</span>
            <div className="flex gap-1">
                {form.map((r, i) => (
                    <div key={i} className={`pool-form-dot ${r === 'W' ? 'win' : r === 'D' ? 'draw' : 'loss'}`}>
                        {r === 'W' ? 'G' : r === 'D' ? 'B' : 'M'}
                    </div>
                ))}
            </div>
        </div>
    );

    const drawPct = 100 - a.homeWinPct - a.awayWinPct;

    return (
        <div className="pool-analysis-enter bg-[var(--bg-elevated)] border border-[var(--border-subtle)] border-t-0 rounded-b-[10px] px-4 py-4 space-y-4">
            {/* Form Status */}
            <div className="flex items-start justify-between gap-4">
                <FormDots form={a.homeForm} label={match.homeTeam} />
                <div className="flex flex-col items-center pt-4">
                    <span className="text-[8px] text-[var(--text-dim)] font-black uppercase tracking-widest">SON 5 MAÇ</span>
                </div>
                <FormDots form={a.awayForm} label={match.awayTeam} />
            </div>

            {/* Power Bar */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[var(--text-secondary)] font-bold">{match.homeTeam} <span className="text-[#ffcc00] font-black">%{a.homeWinPct}</span></span>
                    {drawPct > 0 && <span className="text-[9px] text-[var(--text-dim)] font-bold">Berabere %{drawPct}</span>}
                    <span className="text-[10px] text-[var(--text-secondary)] font-bold"><span className="text-[#ffcc00] font-black">%{a.awayWinPct}</span> {match.awayTeam}</span>
                </div>
                <div className="pool-power-bar">
                    <div className="flex h-full">
                        <div className="pool-power-fill bg-gradient-to-r from-[#ffcc00] to-[#f0b90b]" style={{ width: `${a.homeWinPct}%` }} />
                        {drawPct > 0 && <div className="pool-power-fill bg-zinc-700" style={{ width: `${drawPct}%` }} />}
                        <div className="pool-power-fill bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]" style={{ width: `${a.awayWinPct}%` }} />
                    </div>
                </div>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-start gap-2 bg-red-500/5 border border-red-500/10 rounded-lg p-2.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[9px] text-red-400 font-black uppercase tracking-wider mb-0.5">Eksik Oyuncular</p>
                        <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-snug">
                            <span className="text-[var(--text-primary)] font-bold">{match.homeTeam}:</span> {a.missingPlayers.home}
                        </p>
                        <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-snug mt-0.5">
                            <span className="text-[var(--text-primary)] font-bold">{match.awayTeam}:</span> {a.missingPlayers.away}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-2 bg-[#ffcc00]/5 border border-[#ffcc00]/10 rounded-lg p-2.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#ffcc00] shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[9px] text-[#ffcc00] font-black uppercase tracking-wider mb-0.5">Editör Yorumu</p>
                        <p className="text-[10px] text-[var(--text-primary)] font-medium leading-snug">{a.editorComment}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Mobile Bottom Sheet ──────────────────────────────────────────────────── */
const MobileAnalysisSheet: React.FC<{ match: PoolMatch; onClose: () => void }> = ({ match, onClose }) => {
    return (
        <div className="pool-bottom-sheet-overlay" onClick={onClose}>
            <div className="pool-bottom-sheet" onClick={e => e.stopPropagation()}>
                <div className="pool-bottom-sheet-handle" />
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-[var(--text-primary)] font-black text-sm">{match.homeTeam} <span className="text-[var(--text-muted)] text-xs">vs</span> {match.awayTeam}</p>
                        <p className="text-[var(--text-muted)] text-[10px] font-bold">{match.league} · {match.matchDate}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-[var(--bg-input)] flex items-center justify-center hover:bg-[var(--bg-card-hover)] transition-colors">
                        <X className="w-4 h-4 text-[var(--text-secondary)]" />
                    </button>
                </div>
                <AnalysisPanel match={match} onClose={onClose} />
            </div>
        </div>
    );
};

/* ─── Main PoolGame Component ──────────────────────────────────────────────── */
const PoolGame: React.FC<PoolGameProps> = ({ userId, username, isLoggedIn, onLoginRequired }) => {
    const [pool, setPool] = useState<PoolConfig | null>(null);
    const [selections, setSelections] = useState<Record<number, '1' | 'X' | '2'>>({});
    const [submitted, setSubmitted] = useState(false);
    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const [tab, setTab] = useState<'play' | 'leaderboard' | 'pool'>('play');
    const [expandedMatch, setExpandedMatch] = useState<number | null>(null);
    const [mobileSheetMatch, setMobileSheetMatch] = useState<PoolMatch | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const p = loadPool();
        setPool(p);
        if (p) {
            const existing = p.entries.find(e => e.userId === userId);
            if (existing) setSubmitted(true);
        }
    }, [userId]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

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
            <div id="pool-section" className="flex flex-col items-center justify-center gap-6 py-24 transition-colors duration-500 relative overflow-hidden">
                <div className="text-7xl">⚽</div>
                <h2 className="text-[var(--text-primary)] font-black text-3xl uppercase tracking-tight text-center">724TOTO</h2>
                <p className="text-[var(--text-muted)] font-bold text-sm text-center max-w-md">
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
            id: `entry-${Date.now()}`,
            userId,
            username,
            predictions: preds as ('1' | 'X' | '2')[],
            createdAt: Date.now(),
            isFreeEntry: isFreeAvailable,
        } as PoolEntry;

        const updated = { ...pool };
        updated.entries = [...updated.entries, entry];
        if (isFreeAvailable) updated.freeEntryUsed = { ...updated.freeEntryUsed, [userId]: true };
        savePool(updated);
        setPool(updated);
        setSubmitted(true);
    };

    const handleRowClick = (idx: number, match: PoolMatch) => {
        if (!match.analysis) return;
        if (isMobile) {
            setMobileSheetMatch(expandedMatch === idx ? null : match);
            setExpandedMatch(expandedMatch === idx ? null : idx);
        } else {
            setExpandedMatch(expandedMatch === idx ? null : idx);
        }
    };

    return (
        <section id="pool-section" className="w-full transition-colors duration-500 px-4 md:px-8 py-12 relative overflow-hidden">
            <div className="absolute inset-0 premium-bg-grid opacity-10" />
            <div className="max-w-[900px] mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-6 animate-text-reveal">
                    <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-1">
                        724<span className="text-[#f0b90b]">TOTO</span>
                    </h1>
                    <p className="text-[var(--text-muted)] font-bold text-[11px]">15 maçı doğru tahmin et, büyük ödülü kazan!</p>
                    <div className="flex items-center justify-center gap-3 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${pool.status === 'open' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : pool.status === 'live' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                            {pool.status === 'open' ? '🟢 TAHMİNLER AÇIK' : pool.status === 'live' ? '🔴 CANLI' : '✅ TAMAMLANDI'}
                        </span>
                        <span className="text-[var(--text-dim)] text-[10px] font-bold">{pool.entries.length} Katılımcı</span>
                    </div>
                </div>

                {/* Prize Pool Banner */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4 mb-5 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f0b90b]/5 to-transparent pointer-events-none" />
                    <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest mb-0.5 relative z-10">TOPLAM ÖDÜL HAVUZU</p>
                    <p className="text-2xl font-black text-[#f0b90b] relative z-10">{pool.prizePool.toLocaleString('tr-TR')} ₺</p>
                    <div className="flex items-center justify-center gap-4 mt-2 relative z-10">
                        <span className="text-[10px] text-[var(--text-secondary)] font-bold">15 Bilen: <span className="text-[#f0b90b]">{pool.prize15.toLocaleString('tr-TR')} ₺</span></span>
                        <span className="text-[10px] text-[var(--text-secondary)] font-bold">14 Bilen: <span className="text-[var(--text-primary)]">{pool.prize14.toLocaleString('tr-TR')} ₺</span></span>
                        <span className="text-[10px] text-[var(--text-secondary)] font-bold">13 Bilen: <span className="text-[var(--text-primary)]">{pool.prize13.toLocaleString('tr-TR')} ₺</span></span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1.5 mb-4">
                    {(['play', 'leaderboard', 'pool'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-[#f0b90b] text-black' : 'bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)]'}`}>
                            {t === 'play' ? '🎯 TAHMİN YAP' : t === 'leaderboard' ? '🏆 SIRALAMA' : '👁 ŞEFFAF HAVUZ'}
                        </button>
                    ))}
                </div>

                {/* PLAY TAB */}
                {tab === 'play' && (
                    <div className="flex flex-col" style={{ gap: '8px' }}>
                        {!isFreeAvailable && !submitted && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 flex items-center gap-2 mb-1">
                                <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
                                <p className="text-yellow-400 text-[10px] font-bold">Ücretsiz hakkınızı kullandınız. Bu katılım <span className="text-white">1000 Coin</span> ücretlidir.</p>
                            </div>
                        )}

                        {pool.matches.map((match, idx) => {
                            const hasSelection = !!selections[idx];
                            const isExpanded = expandedMatch === idx;
                            const hasAnalysis = !!match.analysis;

                            return (
                                <div key={match.id}>
                                    <div
                                        className={`pool-row bg-[var(--bg-card)] border border-[var(--border-subtle)] py-2 px-3 flex items-center gap-2 transition-all duration-300 ${hasSelection ? 'pool-row-selected' : ''} ${isExpanded ? 'rounded-t-[10px] rounded-b-none' : 'rounded-[10px]'}`}
                                        onClick={() => handleRowClick(idx, match)}
                                    >
                                        <span className="text-[var(--text-dim)] text-[10px] font-black w-5 text-center shrink-0">{idx + 1}</span>
                                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between pr-2 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-[var(--text-primary)] font-black text-[11px] leading-tight truncate">
                                                    {match.homeTeam} <span className="text-[var(--text-dim)] mx-0.5 font-bold text-[9px]">vs</span> {match.awayTeam}
                                                </p>
                                                {hasAnalysis && (
                                                    <Activity className="w-3 h-3 text-[#ffcc00]/60 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-[var(--text-muted)] text-[9px] font-bold shrink-0">{match.league} · {match.matchDate}</p>
                                        </div>
                                        <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
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
                                                        className={`w-7 h-6 rounded text-[11px] font-black border transition-all duration-300 ${isResult ? 'bg-green-500/20 border-green-500 text-green-400' :
                                                            isSelected ? 'bg-[#ffcc00]/20 border-[#ffcc00] text-[#ffcc00] pool-btn-glow' :
                                                                isUserPick && pool.status !== 'open' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                                                                    'bg-[var(--bg-input)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-hover)]'
                                                            } ${submitted || pool.status !== 'open' ? 'cursor-default' : 'cursor-pointer'}`}
                                                    >
                                                        {pick}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {pool.status === 'completed' && match.result && userEntry && (
                                            <div className="w-4 shrink-0 flex justify-end">
                                                {userEntry.predictions[idx] === match.result
                                                    ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                    : <XCircle className="w-3.5 h-3.5 text-red-500" />}
                                            </div>
                                        )}
                                        {hasAnalysis && (
                                            <div className="shrink-0">
                                                {isExpanded
                                                    ? <ChevronUp className="w-3.5 h-3.5 text-[#ffcc00]" />
                                                    : <ChevronDown className="w-3.5 h-3.5 text-[var(--text-dim)]" />}
                                            </div>
                                        )}
                                    </div>

                                    {/* Desktop Accordion Analysis */}
                                    {isExpanded && !isMobile && (
                                        <AnalysisPanel match={match} onClose={() => setExpandedMatch(null)} />
                                    )}
                                </div>
                            );
                        })}

                        {!submitted && pool.status === 'open' && (
                            <button
                                onClick={handleSubmit}
                                disabled={!allSelected}
                                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 mt-1 ${allSelected ? 'bg-[#f0b90b] text-black hover:shadow-[0_0_30px_rgba(240,185,11,0.4)]' : 'bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed'}`}
                            >
                                {allSelected ? (isFreeAvailable ? '🎯 ÜCRETSİZ GÖNDER' : '🎯 1000 COİN İLE GÖNDER') : `${Object.keys(selections).length}/15 MAÇ SEÇİLDİ`}
                            </button>
                        )}

                        {submitted && (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                                <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                <p className="text-green-400 font-black text-sm uppercase">Tahmininiz Kaydedildi!</p>
                                <p className="text-[var(--text-muted)] text-[10px] font-bold mt-1">Maçlar başladığında Şeffaf Havuz sekmesinden tüm tahminleri görebilirsiniz.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* LEADERBOARD TAB */}
                {tab === 'leaderboard' && (
                    <div className="space-y-2">
                        {pool.status !== 'completed' ? (
                            <div className="text-center py-16">
                                <Clock className="w-12 h-12 text-[var(--text-dim)] mx-auto mb-4" />
                                <p className="text-[var(--text-muted)] font-bold">Sıralama, tüm maçlar tamamlandığında görünecektir.</p>
                            </div>
                        ) : (
                            <>
                                {prizeInfo && (
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                                            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase">15 Bilen</p>
                                            <p className="text-xl font-black text-[#f0b90b]">{prizeInfo.winners15} kişi</p>
                                            <p className="text-xs text-[var(--text-secondary)] font-bold mt-1">Kişi başı: {prizeInfo.share15.toLocaleString('tr-TR')} ₺</p>
                                        </div>
                                        <div className="bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl p-4 text-center">
                                            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase">14 Bilen</p>
                                            <p className="text-xl font-black text-[var(--text-primary)]">{prizeInfo.winners14} kişi</p>
                                            <p className="text-xs text-[var(--text-secondary)] font-bold mt-1">Kişi başı: {prizeInfo.share14.toLocaleString('tr-TR')} ₺</p>
                                        </div>
                                        <div className="bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl p-4 text-center">
                                            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase">13 Bilen</p>
                                            <p className="text-xl font-black text-[var(--text-secondary)]">{prizeInfo.winners13} kişi</p>
                                            <p className="text-xs text-[var(--text-secondary)] font-bold mt-1">Kişi başı: {prizeInfo.share13.toLocaleString('tr-TR')} ₺</p>
                                        </div>
                                    </div>
                                )}
                                {leaderboard.map((entry, idx) => (
                                    <div key={entry.userId} className="gradient-border-card p-4">
                                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedUser(expandedUser === entry.userId ? null : entry.userId)}>
                                            <div className="flex items-center gap-3">
                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${idx < 3 ? 'bg-[#f0b90b]/20 text-[#f0b90b]' : 'bg-[var(--bg-input)] text-[var(--text-muted)]'}`}>{idx + 1}</span>
                                                <span className="text-[var(--text-primary)] font-bold text-sm">{entry.username}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`font-black text-lg ${(entry.correctCount || 0) >= 13 ? 'text-green-400' : 'text-[var(--text-secondary)]'}`}>
                                                    {entry.correctCount || 0}/15
                                                </span>
                                                {expandedUser === entry.userId ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
                                            </div>
                                        </div>
                                        {expandedUser === entry.userId && (
                                            <div className="mt-4 space-y-1.5 border-t border-[var(--border-subtle)] pt-4">
                                                {pool.matches.map((m, i) => {
                                                    const isCorrect = m.result === entry.predictions[i];
                                                    return (
                                                        <div key={m.id} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                                            <span className="text-[var(--text-primary)] font-bold">{m.homeTeam} vs {m.awayTeam}</span>
                                                            <div className="flex items-center gap-3">
                                                                <span className={`font-black ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>Tahmin: {entry.predictions[i]}</span>
                                                                <span className="text-[var(--text-muted)] font-bold">Sonuç: {m.result}</span>
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
                                <Lock className="w-12 h-12 text-[var(--text-dim)] mx-auto mb-4" />
                                <p className="text-[var(--text-muted)] font-bold">Tahminler, maçlar başladıktan sonra şeffaf havuzda görünecektir.</p>
                            </div>
                        ) : (
                            pool.entries.length === 0 ? (
                                <div className="text-center py-16">
                                    <Users className="w-12 h-12 text-[var(--text-dim)] mx-auto mb-4" />
                                    <p className="text-[var(--text-muted)] font-bold">Henüz katılımcı yok.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b border-[var(--border-subtle)]">
                                                    <th className="text-left py-3 px-2 text-[var(--text-muted)] font-black uppercase tracking-widest">Kullanıcı</th>
                                                    {pool.matches.map((m, i) => (
                                                        <th key={i} className="py-3 px-1 text-[var(--text-dim)] font-bold text-center min-w-[36px]" title={`${m.homeTeam} vs ${m.awayTeam}`}>{i + 1}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pool.entries.map(entry => (
                                                    <tr key={entry.userId} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)]">
                                                        <td className="py-2 px-2 text-[var(--text-primary)] font-bold">{entry.username}</td>
                                                        {entry.predictions.map((pred, i) => {
                                                            const m = pool.matches[i];
                                                            const isCorrect = pool.status === 'completed' && m.result === pred;
                                                            const isWrong = pool.status === 'completed' && m.result && m.result !== pred;
                                                            return (
                                                                <td key={i} className={`py-2 px-1 text-center font-black ${isCorrect ? 'text-green-400 bg-green-500/10' : isWrong ? 'text-red-400 bg-red-500/10' : 'text-[var(--text-secondary)]'}`}>
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

            {/* Mobile Bottom Sheet */}
            {isMobile && mobileSheetMatch && (
                <MobileAnalysisSheet match={mobileSheetMatch} onClose={() => { setMobileSheetMatch(null); setExpandedMatch(null); }} />
            )}
        </section>
    );
};

export default PoolGame;
