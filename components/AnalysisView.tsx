
import React, { useState } from 'react';
import { MatchAnalysis, Coupon, SiteUser, SportCategory } from '../types';
import { ChevronDown, ChevronUp, Lock, Shield, Zap, Search, Target, Flame, User, AlertCircle, CheckCircle2, RotateCcw, Trophy, Calendar } from 'lucide-react';
import { demoAnalyses } from '../demoData';
import LiveMatches from './LiveMatches';

interface AnalysisViewProps {
    onNavigate?: (view: string) => void;
    analyses?: MatchAnalysis[];
    coupons?: Coupon[];
    siteUser?: SiteUser | null;
    isLoggedIn?: boolean;
    onLoginRequired?: () => void;
    initialExpandedId?: string | null;
}

const getLeagueFlag = (league: string): string => {
    const l = league.toLowerCase();
    if (l.includes('premier') || l.includes('championship') || l.includes('ingiltere')) return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
    if (l.includes('la liga') || l.includes('ispanya')) return '🇪🇸';
    if (l.includes('serie a') || l.includes('italya')) return '🇮🇹';
    if (l.includes('bundesliga') || l.includes('almanya')) return '🇩🇪';
    if (l.includes('ligue 1') || l.includes('fransa')) return '🇫🇷';
    if (l.includes('süper lig') || l.includes('türkiye') || l.includes('1. lig')) return '🇹🇷';
    if (l.includes('eredivisie') || l.includes('hollanda')) return '🇳🇱';
    if (l.includes('primeira') || l.includes('portekiz')) return '🇵🇹';
    if (l.includes('mls') || l.includes('nba') || l.includes('abd')) return '🇺🇸';
    if (l.includes('brasileirao') || l.includes('brezilya')) return '🇧🇷';
    if (l.includes('şampiyonlar') || l.includes('avrupa ligi') || l.includes('konferans') || l.includes('euroleague') || l.includes('uefa')) return '🇪🇺';
    if (l.includes('nba') || l.includes('basket') || l.includes('euroleague')) return '🏀';
    if (l.includes('formula') || l.includes('f1')) return '🏎️';
    if (l.includes('motogp') || l.includes('superbike')) return '🏍️';
    if (l.includes('wimbledon') || l.includes('roland') || l.includes('tenis')) return '🎾';
    return '🌍';
};

const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return { text: 'text-[#00E676]', bg: 'bg-[#00E676]/10', border: 'border-[#00E676]/30' };
    if (confidence >= 70) return { text: 'text-[#00FFA3]', bg: 'bg-[#00FFA3]/10', border: 'border-[#00FFA3]/30' };
    return { text: 'text-[#ff3d00]', bg: 'bg-[#ff3d00]/10', border: 'border-[#ff3d00]/30' };
};

const formatDateTR = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} - ${days[d.getDay()]}`;
};

// ─── Expanded Detail Drawer ────────────────────────────────────────────────────
const AnalysisDrawer: React.FC<{
    analysis: MatchAnalysis;
    isLoggedIn: boolean;
    selectedSport: SportCategory;
    onLoginRequired?: () => void;
}> = ({ analysis, isLoggedIn, selectedSport, onLoginRequired }) => {
    const highestOdds = analysis.bookieOdds.find(b => b.isHighest) || analysis.bookieOdds[0];

    return (
        <div
            className="overflow-hidden transition-all duration-500 relative bg-[#1A1D24]/50"
            style={{ background: 'rgba(14,18,26,0.7)' }}
        >
            {/* Stadium Background Blurred Layer */}
            <div
                className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none"
                style={{
                    backgroundImage: selectedSport === 'Futbol'
                        ? 'url("https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?q=80&w=2000&auto=format&fit=crop")'
                        : 'url("https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2000&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'contrast(1.1) brightness(0.6)',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e121a] via-transparent to-[#0e121a] opacity-95 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0e121a]/90 pointer-events-none" />
            {/* World Cup Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.04 }}>
                <svg viewBox="0 0 120 140" className="w-48 h-56" fill="none">
                    <path d="M60 10 L75 45 L110 50 L85 75 L92 110 L60 95 L28 110 L35 75 L10 50 L45 45 Z" fill="#00FFA3" />
                    <rect x="45" y="95" width="30" height="8" rx="2" fill="#00FFA3" />
                    <rect x="35" y="103" width="50" height="6" rx="2" fill="#00FFA3" />
                    <rect x="40" y="109" width="40" height="12" rx="3" fill="#00FFA3" />
                    <circle cx="60" cy="52" r="12" fill="none" stroke="#00FFA3" strokeWidth="2" />
                    <path d="M54 48 L54 56 L66 52 Z" fill="#00FFA3" />
                </svg>
            </div>

            <div className="relative z-10 p-5 grid grid-cols-1 lg:grid-cols-10 gap-6">
                {/* Left: Editorial Analysis (60%) */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <div className="w-0.5 h-5 bg-[#00FFA3] rounded-full" />
                            <h4 className="text-white font-black text-[11px] uppercase tracking-widest">EDİTÖR DETAYLI ANALİZİ</h4>
                        </div>
                        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#22262F] rounded">
                            <User className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-[10px] font-black text-[#00FFA3] tracking-widest uppercase">
                                {analysis.editorId === 'admin' ? 'YÖNETİCİ' : analysis.editorId || 'EDİTÖR'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Tactical Summary */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Search className="w-3.5 h-3.5 text-[#00FFA3]" />
                                <span className="text-gray-500 font-black text-[9px] uppercase tracking-widest">TAKTİK ÖZET</span>
                            </div>
                            <p className="text-gray-300 text-[13px] leading-relaxed italic pl-6 ml-1.5 bg-[#1A1D24]/40 p-3 rounded">
                                {analysis.tacticalSummary}
                            </p>
                        </div>

                        {/* Breaking Point */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5 text-[#00FFA3]" />
                                <span className="text-gray-500 font-black text-[9px] uppercase tracking-widest">MAÇIN KIRILMA ANI</span>
                            </div>
                            <p className="text-gray-300 text-[13px] leading-relaxed italic pl-6 ml-1.5 bg-[#1A1D24]/40 p-3 rounded">
                                {analysis.breakingPoint}
                            </p>
                        </div>

                        {/* Betting Scenario */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Target className="w-3.5 h-3.5 text-[#00FFA3]" />
                                <span className="text-gray-500 font-black text-[9px] uppercase tracking-widest">BAHİS SENARYOSU</span>
                            </div>
                            {isLoggedIn ? (
                                <p className="text-gray-300 text-[13px] leading-relaxed italic pl-6 ml-1.5 bg-[#1A1D24]/40 p-3 rounded">
                                    {analysis.bettingScenario}
                                </p>
                            ) : (
                                <div className="relative">
                                    <p className="text-gray-300 text-[13px] leading-relaxed italic pl-6 ml-1.5 bg-[#1A1D24]/40 p-3 rounded" style={{ filter: 'blur(5px)', userSelect: 'none' }}>
                                        {analysis.bettingScenario}
                                    </p>
                                    <div className="absolute inset-0 flex items-center pl-5">
                                        <button onClick={onLoginRequired} className="flex items-center gap-1.5 px-3 py-1 bg-[#00FFA3] text-[#000000] font-black text-[9px] rounded uppercase tracking-widest hover:bg-[#00cc82] transition shadow-[0_0_12px_rgba(0,255,163,0.3)]">
                                            <Lock className="w-3 h-3" /> Üye Ol, Gör
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tight pt-1">
                        ⏳ Oranlar maç saatine kadar değişebilir.
                    </p>
                </div>

                {/* Right: Best Odds (40%) */}
                <div className="lg:col-span-4 lg:pl-6">
                    {isLoggedIn ? (
                        <>
                            <div className="flex items-center gap-2 mb-3">
                                <Flame className="w-4 h-4 text-[#00FFA3]" />
                                <h5 className="text-white font-black text-[11px] uppercase tracking-widest">EN İYİ ORANLAR</h5>
                            </div>
                            <div className="space-y-2">
                                {analysis.bookieOdds.map((bookie, bidx) => (
                                    <div key={bidx} className={`p-4 rounded-lg transition-colors ${bookie.isHighest ? 'bg-[#22262F] shadow-[0_0_15px_rgba(0,255,163,0.05)]' : 'bg-[#1A1D24] hover:bg-[#22262F]'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-black text-[11px] uppercase">{bookie.name}</span>
                                                {bookie.isHighest && (
                                                    <span className="bg-[#00FFA3] text-[#000000] text-[7px] font-black px-1.5 py-0.5 rounded animate-pulse">EN YÜKSEK</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-600 text-[8px] font-black uppercase">
                                                        {selectedSport === 'Basketbol' ? 'ÜST' : selectedSport === 'Futbol' ? 'KG VAR' : 'SEÇİM 1'}
                                                    </span>
                                                    <span className="text-[#00FFA3] font-black text-sm">{bookie.odd1}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-600 text-[8px] font-black uppercase">
                                                        {selectedSport === 'Basketbol' ? 'ALT' : selectedSport === 'Futbol' ? '2.5 ÜST' : 'SEÇİM 2'}
                                                    </span>
                                                    <span className="text-[#00FFA3] font-black text-sm">{bookie.odd2}</span>
                                                </div>
                                            </div>
                                            <a href={bookie.link} target="_blank" rel="noopener noreferrer"
                                                className={`text-[10px] font-black px-3 py-1.5 rounded transition-all ${bookie.isHighest ? 'bg-[#00FFA3] text-[#000000] shadow-[0_0_10px_rgba(0,255,163,0.2)] hover:bg-[#00cc82]' : 'bg-[#1f2635] text-gray-300 hover:bg-[#2a3045] hover:text-white'}`}>
                                                {bookie.isHighest ? 'EN YÜKSEK ORAN' : 'ŞİMDİ OYNA'}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="relative h-full">
                            <div className="flex items-center gap-2 mb-3">
                                <Flame className="w-4 h-4 text-gray-600" />
                                <h5 className="text-gray-600 font-black text-[11px] uppercase tracking-widest">EN İYİ ORANLAR</h5>
                            </div>
                            <div className="space-y-2" style={{ filter: 'blur(6px)', userSelect: 'none', pointerEvents: 'none' }}>
                                {['REALBET', 'MARSBAHİS', 'BETS10'].map((name, i) => (
                                    <div key={i} className="p-4 rounded-lg bg-[#1A1D24]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-black text-[11px] uppercase">{name}</span>
                                            {i === 1 && <span className="bg-[#00FFA3] text-[#000000] text-[7px] font-black px-1.5 py-0.5 rounded">EN YÜKSEK</span>}
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-[#00FFA3] font-black text-sm">{(1.8 + i * 0.15).toFixed(2)}</span>
                                            <span className="text-[#00FFA3] font-black text-sm">{(2.1 + i * 0.1).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/30 backdrop-blur-[2px]">
                                <Lock className="w-6 h-6 text-[#00FFA3]" />
                                <button onClick={onLoginRequired}
                                    className="flex items-center gap-2 px-5 py-2 bg-[#00FFA3] text-[#000000] font-black text-xs rounded uppercase tracking-widest hover:bg-[#00cc82] transition shadow-[0_0_20px_rgba(0,255,163,0.3)]">
                                    Üye Ol, Oranları Gör
                                </button>
                                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Canlı oran karşılaştırması</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AnalysisView: React.FC<AnalysisViewProps> = ({ analyses = [], coupons = [], siteUser = null, isLoggedIn = false, onLoginRequired, initialExpandedId }) => {
    // 7-day Date Generation
    const dates: string[] = [];
    const startDate = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }

    const combinedAnalyses = React.useMemo(() => [
        ...analyses,
        ...demoAnalyses.filter(demo => !analyses.some(a => a.id === demo.id))
    ], [analyses]);

    const [expandedId, setExpandedId] = useState<string | null>(initialExpandedId || null);
    const [selectedSport, setSelectedSport] = useState<SportCategory>(() => {
        if (initialExpandedId) {
            const found = combinedAnalyses.find(a => a.id === initialExpandedId);
            if (found && found.sport) return found.sport;
        }
        return 'Futbol';
    });
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        if (initialExpandedId) {
            const found = combinedAnalyses.find(a => a.id === initialExpandedId);
            if (found) {
                if (dates.includes(found.matchDate)) {
                    return 'WEEKLY';
                }
                return found.matchDate;
            }
        }
        return 'WEEKLY';
    });

    React.useEffect(() => {
        if (initialExpandedId) {
            setExpandedId(initialExpandedId);
            const found = combinedAnalyses.find(a => a.id === initialExpandedId);
            if (found) {
                if (found.sport) {
                    setSelectedSport(found.sport);
                } else {
                    setSelectedSport('Futbol');
                }
                if (dates.includes(found.matchDate)) {
                    setSelectedDate('WEEKLY');
                } else {
                    setSelectedDate(found.matchDate);
                }
            }
        }
    }, [initialExpandedId, combinedAnalyses]);

    const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);

    const filteredAnalyses = combinedAnalyses.filter(a => {
        const matchesDate = selectedDate === 'WEEKLY' ? dates.includes(a.matchDate) : a.matchDate === selectedDate;

        let matchesSport = false;
        if (selectedSport === 'Basketbol') {
            matchesSport = a.sport === 'Basketbol' || a.league.toLowerCase().includes('nba') || a.league.toLowerCase().includes('basket') || a.league.toLowerCase().includes('euroleague');
        } else if (selectedSport === 'Futbol') {
            matchesSport = (!a.sport || a.sport === 'Futbol') && !(a.league.toLowerCase().includes('nba') || a.league.toLowerCase().includes('basket') || a.league.toLowerCase().includes('euroleague'));
        } else {
            matchesSport = a.sport === selectedSport;
        }

        return matchesSport && matchesDate;
    }).sort((a, b) => {
        if (a.matchDate !== b.matchDate) return a.matchDate.localeCompare(b.matchDate);
        return a.matchTime.localeCompare(b.matchTime);
    });

    // Group by date
    const groupedByDate = filteredAnalyses.reduce((acc, curr) => {
        if (!acc[curr.matchDate]) acc[curr.matchDate] = [];
        acc[curr.matchDate].push(curr);
        return acc;
    }, {} as Record<string, MatchAnalysis[]>);

    const totalCount = filteredAnalyses.length;

    const dayNames: Record<string, string> = {};
    dates.forEach(d => {
        const day = new Date(d);
        dayNames[d] = day.toLocaleDateString('tr-TR', { weekday: 'short' }).slice(0, 3);
    });

    return (
        <div className="w-full min-h-screen font-sans pb-24 relative" style={{ background: '#000000', color: '#e2e8f0' }}>
            {/* Background patterns removed for clean solid theme */}

            {/* ── COMPACT HORIZONTAL FILTER BAR ── */}
            <div
                className="sticky z-[99]"
                style={{
                    top: 'var(--header-height, 65px)',
                    background: 'rgba(0,0,0,0.97)',
                    backdropFilter: 'blur(20px)'
                }}
            >
                <div className="max-w-[900px] mx-auto px-4 py-3">
                    <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto scrollbar-none py-1">
                        {dates.map((date, idx) => {
                            const d = new Date(date);
                            const isSelected = selectedDate === date;
                            const isToday = idx === 0;
                            return (
                                <button
                                    key={date}
                                    onClick={() => setSelectedDate(selectedDate === date ? 'WEEKLY' : date)}
                                    className={`flex flex-col items-center justify-center min-w-[80px] sm:min-w-[90px] py-3 px-4 rounded-lg transition-all duration-300 relative ${
                                        isSelected
                                            ? 'bg-[#00FFA3] text-[#000000] shadow-[0_0_20px_rgba(0,255,163,0.35)] font-black scale-105 z-10'
                                            : 'bg-[#1A1D24] hover:bg-[#22262F] text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {isToday && (
                                        <span className={`absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#1A1D24]' : 'bg-[#00FFA3] animate-pulse'}`} />
                                    )}
                                    <span className="text-[9px] uppercase tracking-widest font-black opacity-80 mb-0.5">
                                        {isToday ? 'Bugün' : d.toLocaleDateString('tr-TR', { weekday: 'short' })}
                                    </span>
                                    <span className="text-xs sm:text-sm font-black tracking-tight">
                                        {d.getDate()} {d.toLocaleDateString('tr-TR', { month: 'short' })}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-[900px] mx-auto px-4 py-4 relative z-10">
                {/* ── LIVE BULLETIN ── */}
                <LiveMatches />

                {/* World Cup 2026 Branding Header */}
                <div className="mb-6 rounded-lg overflow-hidden relative shadow-[0_0_30px_rgba(0,255,163,0.05)]" style={{ background: 'linear-gradient(135deg, rgba(26,21,0,0.8) 0%, rgba(10,13,20,0.9) 100%)' }}>
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 bg-no-repeat bg-right-bottom" style={{ backgroundImage: 'radial-gradient(circle at right, #00FFA3 0%, transparent 70%)' }}></div>
                    <div className="p-4 sm:p-5 flex items-center justify-between relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Trophy className="w-4 h-4 text-[#00FFA3]" />
                                <p className="text-[10px] font-black text-[#00FFA3]/90 uppercase tracking-[0.2em]">ÖZEL ANALİZLER</p>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter" style={{ color: '#00FFA3', textShadow: '0 0 20px rgba(0,255,163,0.3)' }}>
                                WORLD CUP <span className="text-white">2026</span>
                            </h2>
                        </div>
                        <div className="hidden sm:block text-right">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">En Yüksek Kazanç Oranları</p>
                            <p className="text-xs font-black text-[#00E676]">%88 Başarı Oranı</p>
                        </div>
                    </div>
                </div>

                {/* Date-Grouped Match Rows */}
                {Object.keys(groupedByDate).length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-gray-700 mx-auto" />
                        <p className="text-gray-500 font-black text-xs uppercase tracking-widest">Seçili gün ve kategori için analiz bulunamadı.</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {(Object.entries(groupedByDate) as [string, MatchAnalysis[]][]).map(([date, matches]) => (
                            <div key={date}>
                                {/* Date Separator */}
                                <div className="flex items-center gap-2 text-[11px] font-bold text-[#00FFA3] tracking-wider uppercase mb-2 mt-5 px-1 first:mt-0">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDateTR(date)}
                                    <span className="text-gray-600 font-medium normal-case">({matches.length} analiz)</span>
                                </div>

                                <div className="space-y-2">
                                    {matches.map((analysis, idx) => {
                                        const isFree = isLoggedIn || idx < 2;
                                        const isExpanded = expandedId === analysis.id;
                                        const confColor = getConfidenceColor(analysis.confidence);
                                        const highestOdds = analysis.bookieOdds.find(b => b.isHighest) || analysis.bookieOdds[0];

                                        // LOCKED ROW
                                        if (!isFree) {
                                            return (
                                                <div
                                                    key={analysis.id}
                                                    className="relative rounded-lg overflow-hidden transition-all duration-150 shadow-[0_0_15px_rgba(0,255,163,0.02)]"
                                                    style={{ background: '#1A1D24' }}
                                                >
                                                    {/* Blurred preview */}
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4 select-none" style={{ filter: 'blur(4px)', userSelect: 'none' }}>
                                                        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
                                                            <span className="text-[11px] font-bold text-gray-400 px-3 py-1.5 rounded shrink-0" style={{ background: '#1A1D24' }}>
                                                                🕐 {analysis.matchTime}
                                                            </span>
                                                            <span className="text-[10px] font-black text-[#00FFA3] uppercase px-3 py-1 rounded shrink-0" style={{ background: 'rgba(0,255,163,0.1)' }}>
                                                                {getLeagueFlag(analysis.league)} {analysis.league}
                                                            </span>
                                                            <div className="text-sm font-black text-white flex items-center gap-2">
                                                                <span>{analysis.homeTeam}</span>
                                                                <span className="text-xs text-gray-500 font-medium">vs</span>
                                                                <span>{analysis.awayTeam}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <div className="px-4 py-2 rounded-lg text-center min-w-[60px]" style={{ background: '#1A1D24' }}>
                                                                <span className="block text-[8px] text-gray-500 uppercase font-bold">GÜVEN</span>
                                                                <span className="text-xs font-black text-[#00E676]">%{analysis.confidence}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Lock overlay */}
                                                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}>
                                                        <button
                                                            onClick={onLoginRequired}
                                                            className="flex items-center gap-2 px-4 py-2 font-black text-xs rounded-lg uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,255,163,0.3)] hover:shadow-[0_0_30px_rgba(0,255,163,0.5)]"
                                                            style={{ background: '#00FFA3', color: '#000000' }}
                                                        >
                                                            <Lock className="w-3.5 h-3.5" />
                                                            Üye Ol, Tüm Analizleri Gör
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        // FREE / UNLOCKED ROW
                                        return (
                                            <div
                                                key={analysis.id}
                                                className={`relative rounded-lg overflow-hidden transition-all duration-200 ${isExpanded ? 'bg-[#22262F] shadow-[0_0_25px_rgba(0,255,163,0.1)]' : 'bg-[#1A1D24] hover:bg-[#22262F] shadow-[0_0_15px_rgba(0,255,163,0.03)]'}`}
                                            >
                                                {/* Main Row */}
                                                <div
                                                    className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4 cursor-pointer group"
                                                    onClick={() => toggleExpand(analysis.id)}
                                                >
                                                    {/* Left: Time + League + Teams */}
                                                    <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
                                                        {/* Time badge */}
                                                        <span className="text-[11px] font-bold text-gray-400 px-3 py-1.5 rounded shrink-0 flex items-center gap-1" style={{ background: '#1A1D24' }}>
                                                            🕐 {analysis.matchTime}
                                                        </span>

                                                        {/* League badge */}
                                                        <span className="text-[10px] font-black text-[#00FFA3] uppercase px-3 py-1 rounded shrink-0" style={{ background: 'rgba(0,255,163,0.08)' }}>
                                                            {getLeagueFlag(analysis.league)} {analysis.league}
                                                        </span>

                                                        {/* Guarantee badge (high confidence) */}
                                                        {analysis.confidence >= 88 && (
                                                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0" style={{ background: '#00FFA3', color: '#000000' }}>
                                                                <Shield className="w-3 h-3" /> İADE GARANTİLİ
                                                            </span>
                                                        )}

                                                        {/* Team Names */}
                                                        <div className="text-sm font-black text-white flex items-center gap-2 truncate">
                                                            <span>{analysis.homeTeam}</span>
                                                            <span className="text-xs text-gray-500 font-medium shrink-0">vs</span>
                                                            <span>{analysis.awayTeam}</span>
                                                        </div>
                                                    </div>

                                                    {/* Middle: Prediction / Odds / Confidence */}
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <div className="px-4 py-2 rounded-lg text-center min-w-[70px]" style={{ background: '#1A1D24' }}>
                                                            <span className="block text-[8px] text-gray-500 uppercase font-bold mb-0.5">TAHMİN</span>
                                                            <span className="text-[11px] font-black text-[#00E676]">{analysis.prediction}</span>
                                                        </div>
                                                        <div className="px-4 py-2 rounded-lg text-center min-w-[55px]" style={{ background: '#1A1D24' }}>
                                                            <span className="block text-[8px] text-gray-500 uppercase font-bold mb-0.5">ORAN</span>
                                                            <span className="text-[11px] font-black text-[#00FFA3]">{highestOdds?.odd1 || '—'}</span>
                                                        </div>
                                                        <div className={`px-4 py-2 rounded-lg text-center min-w-[55px] ${confColor.bg}`}>
                                                            <span className="block text-[8px] text-gray-500 uppercase font-bold mb-0.5">GÜVEN</span>
                                                            <span className={`text-[11px] font-black ${confColor.text}`}>%{analysis.confidence}</span>
                                                        </div>
                                                    </div>

                                                    {/* Right: Status + Details Button */}
                                                    <div className="flex items-center gap-2.5 shrink-0">
                                                        <span className="flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg uppercase tracking-wider bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676]">
                                                            <CheckCircle2 className="w-3 h-3" /> ANALİZ AÇIK
                                                        </span>
                                                        <button
                                                            className={`text-xs font-black py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all duration-200 ${isExpanded ? 'bg-[#00FFA3] text-[#000000]' : 'text-gray-300 hover:bg-[#00FFA3] hover:text-[#000000]'}`}
                                                            style={!isExpanded ? { background: '#1f2635' } : {}}
                                                        >
                                                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                            DETAYLAR
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Expandable Drawer */}
                                                {isExpanded && (
                                                    <AnalysisDrawer
                                                        analysis={analysis}
                                                        isLoggedIn={isLoggedIn}
                                                        selectedSport={selectedSport}
                                                        onLoginRequired={onLoginRequired}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisView;
