import React, { useState, useRef } from 'react';
import { Flame, Target, CalendarDays, ChevronLeft, ChevronRight, Activity, Zap, TrendingUp } from 'lucide-react';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { useBetting } from '../../contexts/BettingContext';
import teamLogosData from '../../utils/team_logos.json';

const teamLogos: Record<string, string> = teamLogosData;

/* ─── initials helper ─── */
function getInitials(name: string) {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/* ─── TeamAvatar: shows logo, falls back to initials circle ─── */
function TeamAvatar({ name, url, size = 64 }: { name: string; url?: string; size?: number }) {
    const norm = (n: string) => n ? n.toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '') : '';
    const resolvedUrl = (url && url !== '') ? url : (teamLogos[norm(name)] || teamLogos[name?.toLowerCase() ?? '']);
    const [showInitials, setShowInitials] = useState(!resolvedUrl);

    const sz = size === 64 ? 'w-16 h-16' : 'w-7 h-7';
    const textSz = size === 64 ? 'text-[17px]' : 'text-[9px]';

    return (
        <div className={`${sz} rounded-full bg-gradient-to-b from-[#253347] to-[#0f172a] border border-white/[0.12] flex items-center justify-center overflow-hidden relative shadow-[0_4px_16px_rgba(0,0,0,0.5),0_0_12px_rgba(255,255,255,0.03),inset_0_1px_2px_rgba(255,255,255,0.2)] shrink-0`}>
            {!showInitials && resolvedUrl ? (
                <img
                    src={resolvedUrl}
                    alt={name}
                    className="w-[65%] h-[65%] object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
                    onError={() => setShowInitials(true)}
                />
            ) : (
                <span className={`${textSz} font-black text-slate-300 drop-shadow-md select-none`}>{getInitials(name)}</span>
            )}
        </div>
    );
}

/* ─── Main Widget ─── */
export default function SportsDashboardWidget({ matches = [], onSelectMatch }: { matches?: any[]; onSelectMatch?: (m: any) => void }) {
    const { addSelection } = useBetSlip();
    const { outrights = [], global1xBetMatches = [], global1xBetPreMatches = [] } = useBetting();

    const allMatches = matches && matches.length > 0 ? matches : [...global1xBetMatches, ...global1xBetPreMatches];

    const [comboAmount, setComboAmount] = useState<number>(10);
    const [eventAmount, setEventAmount] = useState<number>(10);
    const amounts = [10, 50, 100];

    /* ── Hot Combos ── */
    const hotComboMatches = React.useMemo(() => {
        let pool = allMatches.length > 0 ? allMatches : [...global1xBetMatches, ...global1xBetPreMatches];
        let list = pool.filter(m => !m.isLive && m.homeOdd && m.homeOdd !== '-');
        if (list.length < 3) {
            pool = [...global1xBetMatches, ...global1xBetPreMatches];
            list = pool.filter(m => !m.isLive && m.homeOdd && m.homeOdd !== '-');
        }
        if (!list.length) return [];
        const sorted = [...list].sort((a, b) => parseFloat(a.homeOdd) - parseFloat(b.homeOdd));
        const ideal = sorted.filter(m => parseFloat(m.homeOdd) >= 1.3 && parseFloat(m.homeOdd) <= 2.5);
        return (ideal.length >= 3 ? ideal : sorted).slice(0, 3);
    }, [allMatches, global1xBetMatches, global1xBetPreMatches]);

    /* ── Top Event ── */
    const topEventMatch = React.useMemo(() => {
        let pool = allMatches.length > 0 ? allMatches : [...global1xBetMatches, ...global1xBetPreMatches];
        let valid = pool.filter(m => m.homeOdd && m.homeOdd !== '-' && m.drawOdd && m.drawOdd !== '-' && m.awayOdd && m.awayOdd !== '-');
        if (!valid.length) {
            pool = [...global1xBetMatches, ...global1xBetPreMatches];
            valid = pool.filter(m => m.homeOdd && m.homeOdd !== '-' && m.drawOdd && m.drawOdd !== '-' && m.awayOdd && m.awayOdd !== '-');
        }
        if (!valid.length) return null;
        const n = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '');
        const hasL = (s: string) => !!(teamLogos[n(s)] || teamLogos[(s || '').toLowerCase()]);
        const wL = valid.filter(m => (m.homeLogo && m.awayLogo) || (hasL(m.home) && hasL(m.away)));
        const isTR = (m: any) => {
            const c = (m.country || '').toLowerCase(), l = (m.league || '').toLowerCase();
            return ['turkey', 'türkiye', 'süper lig', 'trendyol süper lig', 'super lig', 'tff 1. lig', '1. lig'].some(x => c === x || l === x);
        };
        return wL.find(m => m.isLive && isTR(m)) || wL.find(m => !m.isLive && isTR(m)) ||
            wL.find(m => m.isLive) || wL.find(m => !m.isLive) ||
            valid.find(m => m.isLive && isTR(m)) || valid.find(m => !m.isLive && isTR(m)) ||
            valid.find(m => m.isLive) || valid.find(m => !m.isLive) || null;
    }, [allMatches, global1xBetMatches, global1xBetPreMatches]);

    /* ── Triple Combo ── */
    const tripleComboMatches = React.useMemo(() => {
        let pool = allMatches.length > 0 ? allMatches : [...global1xBetMatches, ...global1xBetPreMatches];
        let list = pool.filter(m => !m.isLive && m.homeOdd && m.homeOdd !== '-' && parseFloat(m.homeOdd) > 1.1 && parseFloat(m.homeOdd) <= 1.6);
        if (list.length < 3) {
            pool = [...global1xBetMatches, ...global1xBetPreMatches];
            list = pool.filter(m => !m.isLive && m.homeOdd && m.homeOdd !== '-' && parseFloat(m.homeOdd) > 1.1 && parseFloat(m.homeOdd) <= 1.6);
        }
        return [...list].sort((a, b) => parseFloat(a.homeOdd) - parseFloat(b.homeOdd)).slice(0, 3);
    }, [allMatches, global1xBetMatches, global1xBetPreMatches]);

    const rawOdd = hotComboMatches.reduce((a, m) => a * parseFloat(m.homeOdd), 1);
    const boostedOdd = rawOdd * 1.15;
    const tripleOdd = tripleComboMatches.reduce((a, m) => a * parseFloat(m.homeOdd), 1);

    const handlePlayHotCombo = () => {
        hotComboMatches.forEach((m, i) => addSelection({ id: m.id || `hc_${i}`, matchId: m.id || `hc_${i}`, matchName: `${m.home} vs ${m.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(m.homeOdd) }));
        window.dispatchEvent(new CustomEvent('open-betslip'));
    };
    const handlePlayTriple = () => {
        tripleComboMatches.forEach((m, i) => addSelection({ id: m.id || `tc_${i}`, matchId: m.id || `tc_${i}`, matchName: `${m.home} vs ${m.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(m.homeOdd) }));
        window.dispatchEvent(new CustomEvent('open-betslip'));
    };

    const [outrightIndex, setOutrightIndex] = useState(0);
    const outrightData = React.useMemo(() => outrights || [], [outrights]);
    const tabs = ['Futbol', 'Basketbol', 'Tenis', 'Buz Hokeyi'];
    const [activeTab, setActiveTab] = useState('Futbol');
    const currentOutright = outrightData[outrightIndex] || null;
    const nextOutright = () => { if (outrightData.length) setOutrightIndex(p => (p + 1) % outrightData.length); };
    const prevOutright = () => { if (outrightData.length) setOutrightIndex(p => (p - 1 + outrightData.length) % outrightData.length); };

    /* ── reusable class fragments ── */
    const card = 'bg-gradient-to-br from-[#1c2841] via-[#0d1525] to-[#060a12] border border-t-white/[0.12] border-x-white/[0.06] border-b-black/80 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_0_20px_rgba(255,255,255,0.01),0_12px_40px_rgba(0,0,0,0.8)]';
    const innerBox = 'bg-[#0a0f1a]/70 backdrop-blur-2xl border border-t-white/[0.1] border-x-white/[0.05] border-b-black/50 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.4)]';
    const ctaBtn = 'w-full h-10 rounded-xl font-black text-[13px] tracking-wide flex items-center justify-center gap-2 relative overflow-hidden group transition-all duration-300';
    const primaryBtn = `${ctaBtn} bg-gradient-to-b from-[#22d3ee] via-[#0ea5e9] to-[#0284c7] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-4px_8px_rgba(0,0,0,0.2),0_8px_24px_rgba(34,211,238,0.4)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(0,0,0,0.2),0_12px_32px_rgba(34,211,238,0.6)] hover:brightness-110`;

    return (
        <div className="flex flex-col gap-4 w-full bg-sports-main rounded-sports-card p-4">

            {/* ════════════════════════════════════════
                3-COLUMN GRID
            ════════════════════════════════════════ */}
            <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-4">

                {/* ══ COL 1: Öne Çıkan Maçlar ══ */}
                <div className="flex flex-col gap-2.5">
                    {/* Section header */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-cyan-400/20 to-blue-500/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                            <Target className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                        </div>
                        <h2 className="text-white/95 text-[14px] font-black tracking-wide drop-shadow-md">Öne Çıkan Maçlar</h2>
                    </div>

                    <div className={`${card} flex flex-col overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex-1`}>
                        {!topEventMatch ? (
                            <div className="flex flex-col items-center justify-center h-48 text-slate-600 text-sm font-semibold">
                                Öne çıkan maç yok
                            </div>
                        ) : (
                            <>
                                {/* ─ League / Timer bar ─ */}
                                <div className="flex items-center justify-between px-4 pt-3.5 pb-0">
                                    <div className="flex items-center gap-1.5 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-full px-2.5 py-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.9)] shrink-0"></span>
                                        <span className="text-[9px] font-black text-emerald-400 tracking-widest uppercase truncate max-w-[110px]">
                                            {topEventMatch.league}
                                        </span>
                                    </div>
                                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-black tracking-wide ${topEventMatch.isLive ? 'bg-red-500/[0.12] border-red-400/30 text-red-400' : 'bg-white/[0.03] border-white/[0.07] text-white/30'}`}>
                                        {topEventMatch.isLive && <Activity className="w-2.5 h-2.5 animate-pulse" />}
                                        <span>{topEventMatch.isLive ? (topEventMatch.minute ? `${topEventMatch.minute}'` : 'CANLI') : (topEventMatch.startTime || 'YAKLAŞAN')}</span>
                                    </div>
                                </div>

                                {/* ─ Centered Content Wrapper ─ */}
                                <div className="flex flex-col justify-center flex-1">
                                    {/* ─ Teams + Score ─ */}
                                    <div className="flex items-center justify-between px-4 py-3 relative">
                                        {/* Ambient glow */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-28 h-28 bg-cyan-500/[0.04] rounded-full blur-2xl"></div>
                                        </div>

                                        {/* Home */}
                                        <div className="flex flex-col items-center flex-1 relative z-10">
                                            <TeamAvatar name={topEventMatch.home} url={topEventMatch.homeLogo} size={64} />
                                            <span className="text-slate-300 font-semibold text-[11px] text-center leading-tight line-clamp-2 max-w-[80px] drop-shadow-sm mt-1.5">
                                                {topEventMatch.home}
                                            </span>
                                        </div>

                                        {/* Score / VS */}
                                        <div className="flex flex-col items-center px-5 py-2.5 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent backdrop-blur-2xl border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_16px_rgba(255,255,255,0.02),0_8px_24px_rgba(0,0,0,0.4)] relative z-10 mx-2">
                                            {topEventMatch.isLive && topEventMatch.score ? (
                                                <span className="text-[38px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-white/70 leading-none tracking-tighter drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">
                                                    {String(topEventMatch.score).replace(' - ', '-')}
                                                </span>
                                            ) : (
                                                <span className="text-[32px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/50 to-white/10 leading-none tracking-tighter drop-shadow-[0_0_16px_rgba(255,255,255,0.15)]">0-0</span>
                                            )}
                                        </div>

                                        {/* Away */}
                                        <div className="flex flex-col items-center flex-1 relative z-10">
                                            <TeamAvatar name={topEventMatch.away} url={topEventMatch.awayLogo} size={64} />
                                            <span className="text-slate-300 font-semibold text-[11px] text-center leading-tight line-clamp-2 max-w-[80px] drop-shadow-sm mt-1.5">
                                                {topEventMatch.away}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ─ 1 X 2 ─ */}
                                    <div className={`${innerBox} mx-3 mb-2 mt-2 flex overflow-hidden shrink-0`}>
                                        {[
                                            { label: '1', odd: topEventMatch.homeOdd, id: topEventMatch.homeId },
                                            { label: 'X', odd: topEventMatch.drawOdd, id: topEventMatch.drawId },
                                            { label: '2', odd: topEventMatch.awayOdd, id: topEventMatch.awayId },
                                        ].map((btn, i) => (
                                            <button
                                                key={btn.label}
                                                disabled={!btn.odd || btn.odd === '-'}
                                                onClick={() => addSelection({
                                                    id: btn.id || `${topEventMatch.id}_${btn.label}`,
                                                    matchId: topEventMatch.id,
                                                    matchName: `${topEventMatch.home} vs ${topEventMatch.away}`,
                                                    selectionName: `Maç Sonucu: ${btn.label}`,
                                                    odd: parseFloat(btn.odd),
                                                })}
                                                className={`flex-1 flex flex-col items-center py-2 transition-all duration-300 ${i < 2 ? 'border-r border-white/[0.06]' : ''} enabled:hover:bg-gradient-to-b enabled:hover:from-cyan-400/[0.15] enabled:hover:to-cyan-600/[0.02] enabled:hover:shadow-[inset_0_1px_0_rgba(34,211,238,0.4)] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed group`}
                                            >
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-cyan-400 transition-colors">{btn.label}</span>
                                                <span className="text-[16px] font-black text-white/90 group-hover:text-cyan-300 transition-colors">
                                                    {btn.odd && btn.odd !== '-' ? btn.odd : '–'}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ─ Amount + CTA (grid keeps them perfectly aligned) ─ */}
                                <div className="grid grid-cols-[88px_1fr] gap-2 px-3 pb-3.5">
                                    <div className={`${innerBox} flex items-center h-10 px-2.5 gap-1`}>
                                        <input
                                            type="number"
                                            value={eventAmount || ''}
                                            onChange={e => setEventAmount(Number(e.target.value))}
                                            className="w-full bg-transparent text-white font-black text-[14px] outline-none text-center placeholder-slate-700 focus:text-cyan-400 transition-colors"
                                            placeholder="10"
                                        />
                                        <span className="text-slate-600 font-semibold text-[13px] shrink-0">₺</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            addSelection({ id: topEventMatch.homeId || `${topEventMatch.id}_1`, matchId: topEventMatch.id, matchName: `${topEventMatch.home} vs ${topEventMatch.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(topEventMatch.homeOdd) || 1 });
                                            window.dispatchEvent(new CustomEvent('open-betslip'));
                                        }}
                                        className={primaryBtn}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 skew-x-12" />
                                        <span className="relative z-10">BAHİS YAP</span>
                                        <ChevronRight className="w-4 h-4 relative z-10 shrink-0" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* ══ COL 2: Popüler Kombineler ══ */}
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-cyan-400/20 to-blue-500/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                            <Flame className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" fill="currentColor" />
                        </div>
                        <h2 className="text-white/95 text-[14px] font-black tracking-wide drop-shadow-md">Popüler Kombineler</h2>
                    </div>

                    <div className={`${card} flex flex-col gap-2.5 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex-1`}>

                        {/* ─ Match list ─ */}
                        <div className={`${innerBox} flex flex-col divide-y divide-white/[0.05] overflow-hidden`}>
                            {hotComboMatches.length === 0 ? (
                                <div className="flex items-center justify-center h-[72px] text-slate-600 text-sm font-semibold">
                                    Uygun kombine bulunamadı
                                </div>
                            ) : hotComboMatches.map((m, idx) => (
                                <div
                                    key={m.id || idx}
                                    onClick={() => onSelectMatch?.(m)}
                                    className="flex items-center justify-between px-3 py-2 hover:bg-gradient-to-r hover:from-white/[0.08] hover:via-white/[0.02] hover:to-transparent hover:shadow-[inset_3px_0_0_rgba(34,211,238,0.8)] cursor-pointer transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                        <TeamAvatar name={m.home} url={m.homeLogo} size={28} />
                                        <span className="text-[12px] font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                                            {m.home} – {m.away}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2 shrink-0">
                                        <span className="bg-slate-800/80 text-slate-500 text-[8px] font-black tracking-wider uppercase border border-white/[0.07] rounded px-1.5 py-0.5">
                                            MS: 1
                                        </span>
                                        <span className="text-white font-black text-[14px] group-hover:text-cyan-300 transition-colors min-w-[32px] text-right">
                                            {m.homeOdd}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ─ ComboBoost badge ─ */}
                        <div className="flex items-center justify-between bg-gradient-to-b from-[#0e1726] to-[#0a0f1a] border border-cyan-500/[0.3] rounded-xl px-3.5 py-2 relative overflow-hidden group shadow-[inset_0_1px_0_rgba(34,211,238,0.2),0_4px_12px_rgba(0,0,0,0.4)]">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="flex items-center gap-2 relative z-10">
                                <Zap className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" fill="currentColor" />
                                <span className="text-cyan-100 font-black text-[11px] uppercase tracking-[0.14em] drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]">Ekstra Oran</span>
                            </div>
                            <div className="relative z-10 bg-gradient-to-b from-[#00E5FF] to-[#0055FF] border border-white/20 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide shadow-[0_2px_8px_rgba(0,229,255,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)]">
                                COMBOBOOST ×1.15
                            </div>
                        </div>

                        {/* ─ Amount + quick amounts ─ */}
                        <div className="flex gap-2">
                            <div className={`${innerBox} flex items-center h-10 px-2.5 gap-1 flex-1`}>
                                <span className="text-slate-600 font-semibold text-[13px] shrink-0">₺</span>
                                <input
                                    type="number"
                                    value={comboAmount || ''}
                                    onChange={e => setComboAmount(Number(e.target.value))}
                                    className="w-full bg-transparent text-white font-black text-[15px] outline-none text-center placeholder-slate-700 focus:text-cyan-400 transition-colors"
                                    placeholder="10"
                                />
                            </div>
                            {amounts.map(amt => (
                                <button
                                    key={amt}
                                    onClick={() => setComboAmount(amt)}
                                    className={`h-10 min-w-[44px] px-3 rounded-xl font-black text-[13px] border transition-all duration-300 ${
                                        comboAmount === amt
                                        ? 'bg-gradient-to-b from-[#22d3ee] to-[#0284c7] text-white border-cyan-300/50 shadow-[0_0_24px_rgba(34,211,238,0.5),inset_0_1px_2px_rgba(255,255,255,0.8)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]'
                                        : 'bg-[#0a0f1a] text-slate-500 border-white/[0.06] hover:text-white hover:border-white/[0.12] hover:bg-white/[0.04]'
                                    }`}
                                >
                                    {amt}
                                </button>
                            ))}
                        </div>

                        {/* ─ Stats box ─ */}
                        <div className={`${innerBox} overflow-hidden mt-auto`}>
                            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.05]">
                                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.12em]">Toplam Oran</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-700 line-through text-[11px]">{rawOdd.toFixed(2)}</span>
                                    <span className="text-cyan-400 font-black text-[15px] drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">{boostedOdd.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between px-4 py-2">
                                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.12em]">Olası Kazanç</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-700 line-through text-[11px]">{(comboAmount * rawOdd).toFixed(2)} ₺</span>
                                    <span className="text-white font-black text-[16px]">
                                        {(comboAmount * boostedOdd).toFixed(2)}<span className="text-cyan-400 text-[12px] ml-0.5">₺</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ─ CTA ─ */}
                        <button onClick={handlePlayHotCombo} className={primaryBtn}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 skew-x-12" />
                            <span className="relative z-10">KOMBİNEYİ OYNA</span>
                            <Zap className="w-4 h-4 relative z-10 shrink-0" fill="currentColor" />
                        </button>
                    </div>
                </div>

                {/* ══ COL 3: Uzun Vadeli Bahisler ══ */}
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-indigo-400/20 to-purple-500/10 border border-indigo-400/30 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                            <CalendarDays className="w-3.5 h-3.5 text-indigo-400 drop-shadow-[0_0_4px_rgba(99,102,241,0.8)]" />
                        </div>
                        <h2 className="text-white/95 text-[14px] font-black tracking-wide drop-shadow-md">Uzun Vadeli Bahisler</h2>
                    </div>

                    <div className={`${card} flex flex-col p-3 gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex-1`}>
                        {/* ─ Sport tabs ─ */}
                        <div className="relative">
                            <div className="flex gap-1.5 overflow-x-auto custom-scrollbar pb-0.5 relative z-10 pr-6">
                                {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.10em] whitespace-nowrap transition-all border shrink-0 ${
                                        activeTab === tab
                                        ? 'bg-gradient-to-b from-cyan-400 to-blue-600 text-white drop-shadow-sm border-cyan-400/40 shadow-[0_0_24px_rgba(34,211,238,0.50),inset_0_1px_0_rgba(255,255,255,0.6)]'
                                        : 'bg-[#0a0f1a]/80 backdrop-blur-sm text-slate-400 border-white/[0.06] hover:text-white hover:border-white/[0.12] hover:bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#111827] to-transparent z-20 pointer-events-none rounded-r-2xl"></div>
                        </div>

                        {currentOutright ? (
                            <div className="flex flex-col gap-2 flex-1">
                                {/* League nav */}
                                <div className="flex items-center gap-2">
                                    <button onClick={prevOutright} className="w-7 h-7 bg-[#0a0f1a] border border-white/[0.07] rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors shrink-0">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="flex-1 text-center overflow-hidden">
                                        <div className="text-white font-bold text-[12px] truncate">{currentOutright.competition}</div>
                                        <div className="text-slate-500 text-[10px] mt-0.5">{currentOutright.market_name}</div>
                                    </div>
                                    <button onClick={nextOutright} className="w-7 h-7 bg-[#0a0f1a] border border-white/[0.07] rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors shrink-0">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Participants */}
                                <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar max-h-[280px]">
                                    {currentOutright.participants?.slice(0, 12).map((item: any, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => addSelection({ id: item.id, matchId: currentOutright.id, matchName: `${currentOutright.competition} – ${currentOutright.market_name}`, selectionName: item.name, odd: item.price })}
                                            className="flex items-center justify-between bg-[#0a0f1a] hover:bg-white/[0.04] border border-white/[0.06] hover:border-cyan-400/[0.15] rounded-lg px-3 py-2 cursor-pointer transition-all group text-left"
                                        >
                                            <span className="text-slate-300 text-[12px] font-semibold group-hover:text-white transition-colors truncate">{item.name}</span>
                                            <span className="text-white font-black text-[13px] group-hover:text-cyan-300 transition-colors ml-2 shrink-0">{item.price}</span>
                                        </button>
                                    ))}
                                </div>

                                <button className="flex items-center justify-center gap-1 text-slate-500 hover:text-white text-[11px] font-bold transition-colors mt-auto pt-1">
                                    Tüm Bahisleri Gör <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-1 py-8 gap-3">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0f172a] to-[#0a0f1a] border border-white/[0.07] flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.08),inset_0_1px_2px_rgba(255,255,255,0.03)]">
                                    <CalendarDays className="w-6 h-6 text-indigo-400/40 drop-shadow-sm" />
                                </div>
                                <span className="text-slate-500 text-[12px] font-medium max-w-[160px] text-center leading-snug">
                                    Şu an aktif uzun vadeli bahis bulunamadı.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════
                TRIPLE COMBO SECTION
            ════════════════════════════════════════ */}
            <div className={`${card} w-full flex flex-col md:flex-row overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}>
                {/* Left panel */}
                <div className="md:w-[30%] bg-gradient-to-br from-[#1a263d] via-[#111827] to-[#090d16] p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/[0.07] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(34,211,238,0.08),transparent_70%)] pointer-events-none" />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 mb-3 bg-orange-500/[0.08] border border-orange-500/20 px-2.5 py-1 rounded-full">
                            <Flame className="w-3 h-3 text-orange-400" />
                            <span className="text-orange-400 font-black text-[9px] tracking-[0.14em] uppercase">Günün Bankosu</span>
                        </div>
                        <h3 className="font-black uppercase leading-[1.05] text-[30px] md:text-[36px] tracking-tight mb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#94a3b8] to-[#f8fafc] block drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">ÜÇLÜ</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-500 block drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">KOMBİNE</span>
                        </h3>
                    </div>
                    <div className="relative z-10">
                        <div className="mb-3">
                            <span className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.14em]">Toplam Oran</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-cyan-400 font-black text-[17px]">×</span>
                                <span className="text-white font-black text-[30px] leading-none">{tripleOdd.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handlePlayTriple}
                            className="w-full h-10 rounded-xl border border-[#0ea5e9]/40 bg-gradient-to-b from-[#0ea5e9]/10 to-[#0284c7]/10 text-white font-black text-[11px] uppercase tracking-[0.12em] flex items-center justify-center gap-2 hover:from-[#0ea5e9]/20 hover:to-[#0284c7]/20 hover:border-[#38bdf8]/60 hover:shadow-[0_0_24px_rgba(56,189,248,0.3)] transition-all duration-300 group"
                        >
                            KUPONU OYNA <Zap className="w-3.5 h-3.5 text-[#38bdf8] group-hover:scale-110 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] transition-transform" fill="currentColor" />
                        </button>
                    </div>
                </div>

                {/* Right panel */}
                <div className="flex-1 p-4 flex flex-col gap-2">
                    {tripleComboMatches.length === 0 ? (
                        <div className="flex items-center justify-center flex-1 text-slate-600 text-sm font-semibold py-6">
                            Şu an kombine için uygun maç bulunamadı.
                        </div>
                    ) : tripleComboMatches.map((m, idx) => (
                        <div
                            key={m.id || idx}
                            className="flex items-center justify-between bg-[#060a12]/60 backdrop-blur-md border border-white/[0.06] hover:border-cyan-500/40 hover:shadow-[0_0_16px_rgba(34,211,238,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-xl px-4 py-3 cursor-pointer transition-all group"
                        >
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5 mb-1 min-w-0">
                                    <span className="text-white font-bold text-[13px] truncate">{m.home}</span>
                                    <span className="text-slate-700 text-[10px] shrink-0">vs</span>
                                    <span className="text-white font-bold text-[13px] truncate">{m.away}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-slate-600 text-[10px] uppercase tracking-wide truncate">{m.league}</span>
                                    {m.startTime && <>
                                        <span className="text-slate-700 text-[10px]">•</span>
                                        <span className="text-slate-600 text-[10px]">{m.startTime}</span>
                                    </>}
                                </div>
                            </div>
                            <div className="bg-gradient-to-b from-[#182235] to-[#0d131f] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-xl px-3.5 py-2 flex flex-col items-center min-w-[60px] ml-3 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all shrink-0">
                                <span className="text-slate-500 text-[8px] font-black uppercase tracking-wide mb-0.5 group-hover:text-cyan-400 transition-colors">MS 1</span>
                                <span className="text-white font-black text-[14px]">{m.homeOdd}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
