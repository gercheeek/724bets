import React, { useState } from 'react';
import { Flame, Target, CalendarDays, ChevronLeft, ChevronRight, Activity, Zap, Star, Trophy } from 'lucide-react';
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

/* ─── TeamAvatar ─── */
function TeamAvatar({ name, url, size = 64 }: { name: string; url?: string; size?: number }) {
    const norm = (n: string) => n ? n.toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '') : '';
    const resolvedUrl = (url && url !== '') ? url : (teamLogos[norm(name)] || teamLogos[name?.toLowerCase() ?? '']);
    const [showInitials, setShowInitials] = useState(!resolvedUrl);

    const isBig = size >= 64;
    const textSz = isBig ? 'text-[19px]' : 'text-[9px]';

    return (
        <div className={`rounded-full flex items-center justify-center overflow-hidden relative shrink-0`}
            style={{
                width: size,
                height: size,
                background: 'rgba(255,255,255,0.03)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 10px rgba(0,0,0,0.5)'
            }}>
            {!showInitials && resolvedUrl ? (
                <img
                    src={resolvedUrl}
                    alt={name}
                    className="w-[85%] h-[85%] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    onError={() => setShowInitials(true)}
                />
            ) : (
                <span className={`${textSz} font-black text-white/60 select-none tracking-tight`}>{getInitials(name)}</span>
            )}
        </div>
    );
}

/* ─── Odds Pill (Bespoke 724Bets) ─── */
function OddPill({ label, odd, onClick, disabled }: { label: string; odd: string; onClick: () => void; disabled: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 relative overflow-hidden transition-colors duration-200 rounded-lg group
                ${disabled
                    ? 'opacity-30 cursor-not-allowed bg-transparent'
                    : 'cursor-pointer bg-white/[0.02] hover:bg-cyan-500/[0.08]'
                }`}
        >
            <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${!disabled ? 'text-zinc-500 group-hover:text-cyan-500' : 'text-zinc-600'}`}>
                {label}
            </span>
            <span className={`text-[14px] font-black transition-colors ${!disabled ? 'text-zinc-300 group-hover:text-cyan-400' : 'text-zinc-600'}`}>
                {odd && odd !== '-' ? odd : '–'}
            </span>
        </button>
    );
}

/* ─── Custom CTA Button (Bespoke 724Bets Design) ─── */
function CustomCTAButton({ onClick, text, icon: Icon }: { onClick: () => void, text: string, icon?: React.ElementType }) {
    return (
        <button
            onClick={onClick}
            className="w-full h-9 flex items-center justify-center gap-2 rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer group"
            style={{
                background: 'rgba(6,182,212,0.05)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(6,182,212,0.1)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(6,182,212,0.1)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(6,182,212,0.05)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <span className="font-bold text-[12px] tracking-wide text-cyan-500 group-hover:text-cyan-400 transition-colors">
                {text}
            </span>
            {Icon && <Icon className="w-3.5 h-3.5 text-cyan-500 group-hover:text-cyan-400 transition-colors" fill="currentColor" />}
        </button>
    );
}

/* ─── Custom Amount Button (Bespoke 724Bets Design) ─── */
function CustomAmountButton({ onClick, amount, active }: { onClick: () => void, amount: number, active: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`h-9 min-w-[42px] px-2 rounded-xl font-bold text-[12px] transition-all duration-200 
                ${active 
                    ? 'text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                    : 'text-zinc-500 hover:text-cyan-500'}`}
            style={active 
                ? { background: 'rgba(6,182,212,0.12)' }
                : { background: 'rgba(255,255,255,0.02)' }
            }
        >
            {amount}
        </button>
    );
}


/* ─── Section Header ─── */
function SectionHeader({ icon, title, accent = '#00E5FF' }: { icon: React.ReactNode; title: string; accent?: string }) {
    return (
        <div className="flex items-center gap-2.5 px-1">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center"
                style={{
                    background: `radial-gradient(circle at 30% 30%, ${accent}20, transparent)`,
                    boxShadow: `0 0 10px ${accent}30, inset 0 1px 1px rgba(255,255,255,0.1)`
                }}>
                {icon}
            </div>
            <h2 className="text-white text-[13px] font-black tracking-wider uppercase">{title}</h2>
        </div>
    );
}

function isBannedLeague(league: string) {
    return false;
}

function isYouthOrReserve(home: string, away: string, league: string) {
    return false;
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
        pool = pool.filter(m => !isYouthOrReserve(m.home || '', m.away || '', m.league || '') && !isBannedLeague(m.league || ''));
        
        let list = pool.filter(m => !m.isLive && m.homeOdd && m.homeOdd !== '-');
        if (!list.length) return [];
        const sorted = [...list].sort((a, b) => parseFloat(a.homeOdd) - parseFloat(b.homeOdd));
        const ideal = sorted.filter(m => parseFloat(m.homeOdd) >= 1.3 && parseFloat(m.homeOdd) <= 2.5);
        return (ideal.length >= 3 ? ideal : sorted).slice(0, 3);
    }, [allMatches, global1xBetMatches, global1xBetPreMatches]);

    /* ── Top Event ── */
    const topEventMatch = React.useMemo(() => {
        let pool = allMatches.length > 0 ? allMatches : [...global1xBetMatches, ...global1xBetPreMatches];
        pool = pool.filter(m => !isYouthOrReserve(m.home || '', m.away || '', m.league || '') && !isBannedLeague(m.league || ''));
        
        let valid = pool.filter(m => m.homeOdd && m.homeOdd !== '-' && m.drawOdd && m.drawOdd !== '-' && m.awayOdd && m.awayOdd !== '-');
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
        pool = pool.filter(m => !isYouthOrReserve(m.home || '', m.away || '', m.league || '') && !isBannedLeague(m.league || ''));
        
        let list = pool.filter(m => !m.isLive && m.homeOdd && m.homeOdd !== '-' && parseFloat(m.homeOdd) > 1.1 && parseFloat(m.homeOdd) <= 1.6);
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

    /* ─── shared styles ─── */
    const glassCard = {
        background: 'rgba(255,255,255,0.015)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.03)'
    };

    const innerGlass = {
        background: 'rgba(0,0,0,0.2)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.02)',
        borderRadius: '12px'
    };

    return (
        <div className="flex flex-col gap-4 w-full bg-sports-main rounded-sports-card p-4">

            {/* ════════════════════════════════════════
                3-COLUMN GRID
            ════════════════════════════════════════ */}
            <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-4">

                {/* ══ COL 1: Öne Çıkan Maçlar ══ */}
                <div className="flex flex-col gap-2.5">
                    <SectionHeader icon={<Target className="w-3 h-3" style={{ color: '#06B6D4' }} />} title="Öne Çıkan Maçlar" accent="#06B6D4" />

                    <div className="flex flex-col overflow-hidden rounded-2xl flex-1" style={glassCard}>
                        {!topEventMatch ? (
                            <div className="flex flex-col items-center justify-center h-48 text-zinc-700 text-sm font-semibold gap-2">
                                <Target className="w-8 h-8 text-zinc-800" />
                                Öne çıkan maç yok
                            </div>
                        ) : (
                            <>
                                {/* Unified League + Teams Container */}
                                <div className="flex flex-col relative mx-3 mt-3 mb-4 rounded-2xl overflow-hidden flex-1"
                                    style={{
                                        background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.5)'
                                    }}>
                                    
                                    {/* Ambient glow center */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-32 h-32 rounded-full blur-3xl opacity-30"
                                            style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
                                    </div>

                                    {/* League / Timer bar (Merged) */}
                                    <div className="flex items-center justify-between px-4 pt-3 pb-1 relative z-10 w-full">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-1 min-w-0"
                                            style={{ background: 'rgba(6,182,212,0.07)' }}>
                                            <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-cyan-400 animate-pulse"
                                                style={{ boxShadow: '0 0 6px rgba(6,182,212,0.9)' }} />
                                            <span className="text-[9px] font-black text-cyan-400 tracking-widest uppercase truncate min-w-0">
                                                {topEventMatch.league}
                                            </span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 ml-2 rounded-full text-[9px] font-black tracking-wide shrink-0 ${topEventMatch.isLive
                                            ? 'text-red-400'
                                            : 'text-zinc-600'}`}
                                            style={topEventMatch.isLive
                                                ? { background: 'rgba(239,68,68,0.1)' }
                                                : { background: 'rgba(255,255,255,0.02)' }
                                            }>
                                            {topEventMatch.isLive && <Activity className="w-2.5 h-2.5 animate-pulse" />}
                                            <span>{topEventMatch.isLive ? (topEventMatch.minute ? `${topEventMatch.minute}'` : 'CANLI') : (topEventMatch.startTime || 'YAKLAŞAN')}</span>
                                        </div>
                                    </div>

                                    {/* Teams + Score Row */}
                                    <div className="flex items-center justify-between px-2 sm:px-5 pb-3 pt-2 flex-1 relative z-10 w-full">
                                    <div className="flex flex-col items-center flex-1 relative z-10 gap-2">
                                        <TeamAvatar name={topEventMatch.home} url={topEventMatch.homeLogo} size={76} />
                                        <span className="text-zinc-300 font-bold text-[11px] text-center leading-tight line-clamp-2 max-w-[80px]">
                                            {topEventMatch.home}
                                        </span>
                                    </div>

                                    {/* Score / VS */}
                                    <div className="flex flex-col items-center relative z-10 mx-1">
                                        <div className="px-3 py-2 rounded-2xl"
                                            style={{
                                                background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)'
                                            }}>
                                            {topEventMatch.isLive && topEventMatch.score ? (
                                                <span className="text-[36px] font-black leading-none tracking-tighter"
                                                    style={{
                                                        background: 'linear-gradient(180deg, #fff, #06B6D4)',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.5))'
                                                    }}>
                                                    {String(topEventMatch.score).replace(' - ', '-')}
                                                </span>
                                            ) : (
                                                <span className="text-[30px] font-black leading-none tracking-tighter text-zinc-400 whitespace-nowrap">
                                                    0-0
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mt-1">Skor</span>
                                    </div>

                                    {/* Away */}
                                    <div className="flex flex-col items-center flex-1 relative z-10 gap-2">
                                        <TeamAvatar name={topEventMatch.away} url={topEventMatch.awayLogo} size={76} />
                                        <span className="text-zinc-300 font-bold text-[11px] text-center leading-tight line-clamp-2 max-w-[80px]">
                                            {topEventMatch.away}
                                        </span>
                                    </div>
                                </div>
                                </div>

                                {/* 1 X 2 */}
                                <div className="mx-3 mb-4 mt-0 rounded-xl overflow-hidden" style={innerGlass}>
                                    <div className="flex gap-1" style={{}}>
                                        {[
                                            { label: '1', odd: topEventMatch.homeOdd, id: topEventMatch.homeId },
                                            { label: 'X', odd: topEventMatch.drawOdd, id: topEventMatch.drawId },
                                            { label: '2', odd: topEventMatch.awayOdd, id: topEventMatch.awayId },
                                        ].map((btn) => (
                                            <OddPill
                                                key={btn.label}
                                                label={btn.label}
                                                odd={btn.odd}
                                                disabled={!btn.odd || btn.odd === '-'}
                                                onClick={() => addSelection({
                                                    id: btn.id || `${topEventMatch.id}_${btn.label}`,
                                                    matchId: topEventMatch.id,
                                                    matchName: `${topEventMatch.home} vs ${topEventMatch.away}`,
                                                    selectionName: `Maç Sonucu: ${btn.label}`,
                                                    odd: parseFloat(btn.odd),
                                                })}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Amount + quick amounts */}
                                <div className="flex gap-2 px-3 pb-3">
                                    <div className="flex items-center h-9 px-2.5 gap-1 flex-1 rounded-xl" style={innerGlass}>
                                        <span className="text-zinc-600 text-[13px] shrink-0">₺</span>
                                        <input
                                            type="number"
                                            value={eventAmount || ''}
                                            onChange={e => setEventAmount(Number(e.target.value))}
                                            className="w-full bg-transparent text-white font-black text-[15px] outline-none text-center placeholder-zinc-800"
                                            placeholder="10"
                                        />
                                    </div>
                                    {amounts.map(amt => (
                                        <CustomAmountButton 
                                            key={amt} 
                                            amount={amt} 
                                            active={eventAmount === amt} 
                                            onClick={() => setEventAmount(amt)} 
                                        />
                                    ))}
                                </div>
                                
                                <div className="px-3 pb-4">
                                    <CustomCTAButton 
                                        text="BAHİS YAP" 
                                        icon={Zap}
                                        onClick={() => {
                                            addSelection({ id: topEventMatch.homeId || `${topEventMatch.id}_1`, matchId: topEventMatch.id, matchName: `${topEventMatch.home} vs ${topEventMatch.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(topEventMatch.homeOdd) || 1 });
                                            window.dispatchEvent(new CustomEvent('open-betslip'));
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* ══ COL 2: Popüler Kombineler ══ */}
                <div className="flex flex-col gap-2.5">
                    <SectionHeader icon={<Flame className="w-3 h-3" style={{ color: '#06B6D4' }} fill="#06B6D4" />} title="Popüler Kombineler" accent="#06B6D4" />

                    <div className="flex flex-col gap-2.5 p-3 rounded-2xl flex-1" style={glassCard}>

                        {/* Match list */}
                        <div className="rounded-xl overflow-hidden flex flex-col" style={innerGlass}>
                            {hotComboMatches.length === 0 ? (
                                <div className="flex items-center justify-center h-[72px] text-zinc-700 text-sm font-semibold">
                                    Uygun kombine bulunamadı
                                </div>
                            ) : hotComboMatches.map((m, idx) => (
                                <div
                                    key={m.id || idx}
                                    onClick={() => onSelectMatch?.(m)}
                                    className="flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all duration-200 group rounded-lg"
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(6,182,212,0.05)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <div className="flex flex-col gap-0.5 min-w-0 flex-1 pr-2">
                                        <span className="text-[13px] font-bold text-zinc-200 group-hover:text-white transition-colors truncate">
                                            {m.home}
                                        </span>
                                        <span className="text-[13px] font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors truncate">
                                            {m.away}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2 shrink-0">
                                        <span className="text-[9px] font-black tracking-widest text-sky-400 px-2 py-0.5 rounded uppercase"
                                            style={{ background: 'rgba(14,165,233,0.08)' }}>
                                            MS: 1
                                        </span>
                                        <span className="text-white font-black text-[16px] group-hover:text-cyan-400 transition-colors min-w-[36px] text-right">
                                            {m.homeOdd}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ComboBoost badge */}
                        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl relative overflow-hidden group cursor-pointer"
                            style={{
                                background: 'linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(0,0,0,0) 100%)',
                                boxShadow: 'inset 0 1px 0 rgba(6,182,212,0.1)'
                            }}>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.07), transparent)' }} />
                            <div className="flex items-center gap-1.5 relative z-10">
                                <Zap className="w-3.5 h-3.5 text-cyan-400" fill="currentColor" />
                                <span className="text-cyan-200 font-black text-[10px] uppercase tracking-widest">Ekstra Oran</span>
                            </div>
                            <div className="relative z-10 text-black px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wide"
                                style={{
                                    background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                                    boxShadow: '0 2px 10px rgba(6,182,212,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                                }}>
                                COMBOBOOST ×1.15
                            </div>
                        </div>

                        {/* Amount + quick amounts */}
                        <div className="flex gap-2">
                            <div className="flex items-center h-9 px-2.5 gap-1 flex-1 rounded-xl" style={innerGlass}>
                                <span className="text-zinc-600 text-[13px] shrink-0">₺</span>
                                <input
                                    type="number"
                                    value={comboAmount || ''}
                                    onChange={e => setComboAmount(Number(e.target.value))}
                                    className="w-full bg-transparent text-white font-black text-[15px] outline-none text-center placeholder-zinc-800"
                                    placeholder="10"
                                />
                            </div>
                            {amounts.map(amt => (
                                <CustomAmountButton 
                                    key={amt} 
                                    amount={amt} 
                                    active={comboAmount === amt} 
                                    onClick={() => setComboAmount(amt)} 
                                />
                            ))}
                        </div>

                        {/* Stats box (Compact) */}
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={innerGlass}>
                            <div className="flex flex-col">
                                <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest">Toplam Oran</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-zinc-700 line-through text-[10px]">{rawOdd.toFixed(2)}</span>
                                    <span className="font-black text-[13px]" style={{ color: '#06B6D4' }}>
                                        {boostedOdd.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest">Kazanç</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-zinc-700 line-through text-[10px]">{(comboAmount * rawOdd).toFixed(2)}₺</span>
                                    <span className="text-white font-black text-[14px]">
                                        {(comboAmount * boostedOdd).toFixed(2)}<span className="text-cyan-400 text-[10px] ml-0.5">₺</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <CustomCTAButton 
                            text="KOMBİNEYİ OYNA" 
                            icon={Zap}
                            onClick={handlePlayHotCombo}
                        />
                    </div>
                </div>

                {/* ══ COL 3: Uzun Vadeli Bahisler ══ */}
                <div className="flex flex-col gap-2.5">
                    <SectionHeader icon={<Trophy className="w-3 h-3" style={{ color: '#06B6D4' }} />} title="Uzun Vadeli Bahisler" accent="#06B6D4" />

                    <div className="flex flex-col p-3 gap-3 rounded-2xl flex-1" style={glassCard}>
                        {/* Sport tabs */}
                        <div className="relative">
                            <div className="flex gap-1.5 overflow-x-auto pb-0.5 relative z-10 pr-6"
                                style={{ scrollbarWidth: 'none' }}>
                                {tabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all shrink-0"
                                        style={activeTab === tab
                                            ? {
                                                background: 'rgba(6,182,212,0.15)',
                                                color: '#06B6D4',
                                            }
                                            : {
                                                background: 'rgba(255,255,255,0.02)',
                                                color: 'rgba(255,255,255,0.3)',
                                            }
                                        }
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none rounded-r-2xl"
                                style={{ background: 'linear-gradient(to left, #080808, transparent)' }} />
                        </div>

                        {currentOutright ? (
                            <div className="flex flex-col gap-2 flex-1">
                                {/* League nav */}
                                <div className="flex items-center gap-2">
                                    <button onClick={prevOutright}
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors shrink-0"
                                        style={{ background: 'rgba(255,255,255,0.03)' }}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="flex-1 text-center overflow-hidden">
                                        <div className="text-white font-bold text-[12px] truncate">{currentOutright.competition}</div>
                                        <div className="text-zinc-600 text-[10px] mt-0.5">{currentOutright.market_name}</div>
                                    </div>
                                    <button onClick={nextOutright}
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors shrink-0"
                                        style={{ background: 'rgba(255,255,255,0.03)' }}>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Participants */}
                                <div className="flex flex-col gap-1 overflow-y-auto max-h-[280px]" style={{ scrollbarWidth: 'none' }}>
                                    {currentOutright.participants?.slice(0, 12).map((item: any, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => addSelection({ id: item.id, matchId: currentOutright.id, matchName: `${currentOutright.competition} – ${currentOutright.market_name}`, selectionName: item.name, odd: item.price })}
                                            className="flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-all group text-left"
                                            style={{
                                                background: 'rgba(255,255,255,0.02)',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = 'rgba(6,182,212,0.06)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                            }}
                                        >
                                            <span className="text-zinc-300 text-[12px] font-semibold group-hover:text-white transition-colors truncate">{item.name}</span>
                                            <span className="text-white font-black text-[13px] group-hover:text-cyan-400 transition-colors ml-2 shrink-0">{item.price}</span>
                                        </button>
                                    ))}
                                </div>

                                <button className="flex items-center justify-center gap-1 text-zinc-600 hover:text-white text-[11px] font-bold transition-colors mt-auto pt-1">
                                    Tüm Bahisleri Gör <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-1 py-8 gap-3">
                                <div className="mt-3 p-3 rounded-xl flex items-center justify-between"
                                    style={{ background: 'rgba(6,182,212,0.05)' }}>
                                    <CalendarDays className="w-6 h-6" style={{ color: 'rgba(6,182,212,0.3)' }} />
                                </div>
                                <span className="text-zinc-600 text-[12px] font-medium max-w-[160px] text-center leading-snug">
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
            <div className="w-full flex flex-col md:flex-row overflow-hidden rounded-2xl" style={{
                background: 'rgba(255,255,255,0.015)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.03)'
            }}>
                {/* Left panel */}
                <div className="md:w-[28%] p-6 flex flex-col justify-between relative overflow-hidden"
                    style={{ }}>
                    {/* Glow */}
                    <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none"
                        style={{ background: '#06B6D4', transform: 'translate(-30%, -30%)' }} />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 mb-4 px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(14,165,233,0.08)' }}>
                            <Flame className="w-3 h-3 text-sky-400" />
                            <span className="text-sky-400 font-black text-[9px] tracking-widest uppercase">Günün Bankosu</span>
                        </div>
                        <h3 className="font-black uppercase leading-[1] text-[34px] tracking-tight mb-5">
                            <span className="text-white block">ÜÇLÜ</span>
                            <span className="block"
                                style={{
                                    background: 'linear-gradient(135deg, #06B6D4, #22D3EE)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.4))'
                                }}>
                                KOMBİNE
                            </span>
                        </h3>
                    </div>

                    <div className="relative z-10">
                        <div className="mb-4">
                            <span className="text-zinc-700 text-[9px] font-bold uppercase tracking-widest">Toplam Oran</span>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-cyan-400 font-black text-[17px]">×</span>
                                <span className="text-white font-black text-[32px] leading-none"
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.3))' }}>
                                    {tripleOdd.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handlePlayTriple}
                            className="w-full h-10 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 group"
                            style={{
                                background: 'rgba(6,182,212,0.05)',
                                color: '#22D3EE'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(6,182,212,0.15)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(6,182,212,0.25)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(6,182,212,0.08)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            KUPONU OYNA <Zap className="w-3.5 h-3.5" fill="currentColor" />
                        </button>
                    </div>
                </div>

                {/* Right panel */}
                <div className="flex-1 p-4 flex flex-col gap-2">
                    {tripleComboMatches.length === 0 ? (
                        <div className="flex items-center justify-center flex-1 text-zinc-700 text-sm font-semibold py-6">
                            Şu an kombine için uygun maç bulunamadı.
                        </div>
                    ) : tripleComboMatches.map((m, idx) => (
                        <div
                            key={m.id || idx}
                            className="flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-all group"
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(6,182,212,0.05)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            }}
                        >
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5 mb-1 min-w-0">
                                    <span className="text-white font-bold text-[13px] truncate">{m.home}</span>
                                    <span className="text-zinc-700 text-[10px] shrink-0">vs</span>
                                    <span className="text-white font-bold text-[13px] truncate">{m.away}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-zinc-600 text-[10px] uppercase tracking-wide truncate">{m.league}</span>
                                    {m.startTime && <>
                                        <span className="text-zinc-800 text-[10px]">•</span>
                                        <span className="text-zinc-600 text-[10px]">{m.startTime}</span>
                                    </>}
                                </div>
                            </div>
                            <div className="rounded-xl px-3.5 py-2.5 flex flex-col items-center min-w-[64px] ml-3 shrink-0 transition-all"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <span className="text-zinc-600 text-[8px] font-black uppercase tracking-wide mb-0.5">MS 1</span>
                                <span className="text-white font-black text-[15px]">{m.homeOdd}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
