
import React, { useState, useEffect } from 'react';
import { MatchAnalysis, Coupon, SiteUser } from '../types';
import { Trophy, Clock, ChevronDown, ChevronUp, AlertCircle, Search, Zap, Target, Flame, TrendingUp, Filter, User, Lock } from 'lucide-react';
import { demoAnalyses } from '../demoData';
import DailyCoupons from './DailyCoupons';

interface AnalysisViewProps {
    onNavigate?: (view: string) => void;
    coupons?: Coupon[];
    siteUser?: SiteUser | null;
    isLoggedIn?: boolean;
    onLoginRequired?: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ coupons = [], siteUser = null, isLoggedIn = false, onLoginRequired }) => {
    const [analyses, setAnalyses] = useState<MatchAnalysis[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selectedSport, setSelectedSport] = useState<'Futbol' | 'Basketbol'>('Futbol');
    const [selectedLeague, setSelectedLeague] = useState<string>('TÜMÜ');

    useEffect(() => {
        const saved = localStorage.getItem('site_analyses');
        if (saved) {
            setAnalyses(JSON.parse(saved));
        } else {
            setAnalyses(demoAnalyses);
        }
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const isBasketballLeague = (analysis: MatchAnalysis) => {
        if (analysis.sport) return analysis.sport === 'Basketbol';
        const l = analysis.league.toLowerCase();
        return l.includes('nba') || l.includes('basket') || l.includes('euroleague');
    };

    // 7-day Date Generation starting from today (synced with computer time)
    const baseDateStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState<string>('WEEKLY'); // Default to Weekly

    const dates: string[] = [];
    const startDate = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }

    const filteredAnalyses = analyses.filter(a => {
        const isBasketball = isBasketballLeague(a);
        const matchesSport = selectedSport === 'Basketbol' ? isBasketball : !isBasketball;
        const matchesDate = selectedDate === 'WEEKLY' ? dates.includes(a.matchDate) : a.matchDate === selectedDate;
        const matchesLeague = selectedLeague === 'TÜMÜ' || a.league === selectedLeague;

        return matchesSport && matchesDate && matchesLeague;
    });

    const leagues = ['TÜMÜ', ...Array.from(new Set(analyses.filter(a => {
        const isBasketball = isBasketballLeague(a);
        const dateMatch = selectedDate === 'WEEKLY' ? dates.includes(a.matchDate) : a.matchDate === selectedDate;
        return dateMatch && (selectedSport === 'Basketbol' ? isBasketball : !isBasketball);
    }).map(a => a.league)))];

    // Grouping by League (Date is already filtered)
    const groupedAnalyses = filteredAnalyses.reduce((acc, curr) => {
        if (!acc[curr.league]) acc[curr.league] = [];
        acc[curr.league].push(curr);
        return acc;
    }, {} as Record<string, MatchAnalysis[]>);

    // Get highlight for sticky box (highest confidence match)
    const sortedForSticky = [...filteredAnalyses].sort((a, b) => b.confidence - a.confidence);
    const stickyMatch = sortedForSticky.length > 0 ? sortedForSticky[0] : null;
    const bestBookie = stickyMatch?.bookieOdds.find(b => b.isHighest) || stickyMatch?.bookieOdds[0];

    const sportGlow = selectedSport === 'Futbol'
        ? 'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 70%)'
        : 'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(228,81,11,0.08) 0%, transparent 70%)';

    return (
        <div
            className="w-full min-h-screen font-sans overflow-x-hidden pb-20 relative transition-all duration-700"
            style={{ background: selectedSport === 'Futbol' ? 'linear-gradient(180deg, #0a120a 0%, #0e0e0e 15%, #0e0e0e 100%)' : 'linear-gradient(180deg, #120a06 0%, #0e0e0e 15%, #0e0e0e 100%)' }}
        >
            {/* Sport-Themed Ambient Glow */}
            <div
                className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none transition-all duration-700 z-0"
                style={{ background: sportGlow }}
            />

            {/* Decorative Sport Pattern */}
            <div className="absolute top-4 right-8 opacity-[0.03] pointer-events-none z-0 select-none">
                <span className="text-[200px] font-black">{selectedSport === 'Futbol' ? '⚽' : '🏀'}</span>
            </div>

            {/* Header / Main Filters */}
            <div className="w-full max-w-6xl mx-auto px-4 pt-12 text-center mb-8 relative z-10">
                {/* Sport Toggle */}
                <div className="flex justify-center gap-4 mb-8 mt-4">
                    <button
                        onClick={() => { setSelectedSport('Futbol'); setSelectedLeague('TÜMÜ'); }}
                        className={`flex items-center gap-2 px-6 py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 ${selectedSport === 'Futbol'
                            ? 'bg-[#f0b90b] text-black shadow-[0_0_25px_rgba(240,185,11,0.3)] scale-105'
                            : 'bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800'
                            }`}
                    >
                        <span className="text-xl">⚽</span> Futbol
                    </button>
                    <button
                        onClick={() => { setSelectedSport('Basketbol'); setSelectedLeague('TÜMÜ'); }}
                        className={`flex items-center gap-2 px-6 py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 ${selectedSport === 'Basketbol'
                            ? 'bg-[#E4510B] text-white shadow-[0_0_25px_rgba(228,81,11,0.3)] scale-105'
                            : 'bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800'
                            }`}
                    >
                        <span className="text-xl">🏀</span> Basketbol
                    </button>
                </div>

                {/* Date Selection */}
                <div className="flex overflow-x-auto gap-2 mb-6 pb-3 justify-center scrollbar-none">
                    <button
                        onClick={() => {
                            setSelectedDate('WEEKLY');
                            setSelectedLeague('TÜMÜ');
                        }}
                        className={`flex flex-col items-center justify-center min-w-[80px] h-[52px] rounded-lg transition-all duration-300 ${selectedDate === 'WEEKLY'
                            ? 'bg-[#f0b90b] text-black shadow-[0_0_15px_rgba(240,185,11,0.2)] scale-105'
                            : 'bg-[#0a0a0a] border border-white/5 text-[#f0b90b] hover:border-[#f0b90b]/50'
                            }`}
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">TÜM</span>
                        <span className="text-[11px] font-black leading-none">HAFTA</span>
                    </button>

                    {dates.map((date, idx) => {
                        const d = new Date(date);
                        const isSelected = selectedDate === date;
                        const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' });
                        return (
                            <button
                                key={date}
                                onClick={() => {
                                    setSelectedDate(date);
                                    setSelectedLeague('TÜMÜ'); // Reset league filter on date change
                                }}
                                className={`flex flex-col items-center justify-center min-w-[80px] h-[52px] rounded-lg transition-all duration-300 ${isSelected
                                    ? 'bg-[#f0b90b] text-black shadow-[0_0_15px_rgba(240,185,11,0.2)] scale-105'
                                    : 'bg-[#0a0a0a] border border-white/5 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                    }`}
                            >
                                <span className={`text-[8px] font-black uppercase tracking-widest leading-none mb-1 ${isSelected ? 'text-black' : 'text-zinc-500'}`}>{dayName}</span>
                                <span className={`text-[11px] font-black leading-none ${isSelected ? 'text-black' : 'text-zinc-300'}`}>{d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Title Segment */}
                <div id="popular-leagues" className="text-center mb-10 animate-fade-in-up">
                    <h2 className="text-[36px] md:text-[42px] font-black italic uppercase tracking-[-0.03em] text-[#f0b90b] mb-1">
                        ANALİZLER
                    </h2>
                    <p className="text-zinc-600 font-bold uppercase text-[9px] tracking-[0.2em]">
                        YAPAY ZEKA VE EDİTÖR ONAYLI TÜM MAÇ ANALİZLERİ
                    </p>
                </div>

                {/* League Filter */}
                <div className="flex overflow-x-auto gap-2 mb-12 pb-3 justify-center scrollbar-none">
                    {leagues.map((league) => (
                        <button
                            key={league}
                            onClick={() => setSelectedLeague(league)}
                            className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-300 whitespace-nowrap ${selectedLeague === league
                                ? 'bg-[#f0b90b] border-[#f0b90b] text-black shadow-[0_0_15px_rgba(240,185,11,0.2)]'
                                : 'bg-transparent border-zinc-800/80 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                                }`}
                        >
                            {league}
                        </button>
                    ))}
                </div>
            </div>

            {/* Analysis List - Body */}
            <div className="w-full max-w-6xl mx-auto px-4 space-y-10">
                {Object.keys(groupedAnalyses).map(leagueName => {
                    const leagueMatches = groupedAnalyses[leagueName];
                    const freeCount = 2; // first 2 visible to everyone
                    const lockedCount = leagueMatches.length - freeCount;
                    return (
                        <div key={leagueName} className="space-y-4">
                            {/* League Section Header */}
                            <div className="flex items-center gap-3 px-2 border-b border-white/5 pb-2">
                                <div className={`w-1 h-3.5 ${selectedSport === 'Basketbol' ? 'bg-[#E4510B]' : 'bg-[#f0b90b]'}`}></div>
                                <h3 className="text-white font-black text-xs md:text-sm uppercase tracking-widest">{leagueName}</h3>
                            </div>

                            {/* Desktop Header */}
                            <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-1 text-[8px] font-black text-zinc-600 uppercase tracking-widest border-b border-transparent">
                                <div className="col-span-1">SAAT</div>
                                <div className="col-span-4 pl-8">MAÇ</div>
                                <div className="col-span-3 text-center">TAHMİN</div>
                                <div className="col-span-1 text-center">{selectedSport === 'Basketbol' ? 'ÜST' : 'KG VAR'}</div>
                                <div className="col-span-1 text-center">{selectedSport === 'Basketbol' ? 'ALT' : '2.5 ÜST'}</div>
                                <div className="col-span-1 text-center">GÜVEN</div>
                                <div className="col-span-1 text-right pr-2">AÇ</div>
                            </div>

                            {groupedAnalyses[leagueName].map((analysis, analysisIdx) => {
                                const isFree = isLoggedIn || analysisIdx < freeCount;
                                const isExpanded = expandedId === analysis.id;
                                const highestOdds = analysis.bookieOdds.find(b => b.isHighest) || analysis.bookieOdds[0];
                                const highlightColorClassName = selectedSport === 'Basketbol' ? 'text-[#E4510B]' : 'text-[#f0b90b]';
                                const borderGlowClassName = selectedSport === 'Basketbol' ? 'border-[#E4510B]/40 shadow-[0_0_15px_rgba(228,81,11,0.1)]' : 'border-[#f0b90b]/40 shadow-[0_0_15px_rgba(240,185,11,0.1)]';
                                const hoverBorderClassName = selectedSport === 'Basketbol' ? 'hover:border-[#E4510B]/20' : 'hover:border-[#f0b90b]/20';

                                // LOCKED: blur the match and show an overlay
                                if (!isFree) {
                                    return (
                                        <div key={analysis.id} className="relative">
                                            {/* Blurred preview */}
                                            <div className="bg-[#060606] border-b border-white/5 px-5 py-4 md:py-0 md:h-[60px] flex flex-col md:grid md:grid-cols-12 items-center gap-3 select-none" style={{ filter: 'blur(5px)', userSelect: 'none' }}>
                                                <div className="col-span-1 text-zinc-600 text-[11px] font-black">{analysis.matchTime}</div>
                                                <div className="col-span-4 flex items-center gap-2 pl-0 md:pl-8">
                                                    <div className="text-xs font-black text-white truncate">{analysis.homeTeam} - {analysis.awayTeam}</div>
                                                </div>
                                                <div className="col-span-3 text-center">
                                                    <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] font-black text-zinc-500">{analysis.prediction}</span>
                                                </div>
                                                <div className="col-span-1 text-center text-[11px] font-black text-zinc-600">{analysis.confidence}%</div>
                                            </div>
                                            {/* Lock overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                                                <button
                                                    onClick={onLoginRequired}
                                                    className="flex items-center gap-2 px-4 py-2 bg-[#f0b90b] text-black font-black text-xs rounded-full uppercase tracking-widest hover:bg-[#f0b90b]/90 transition-all shadow-[0_0_20px_rgba(240,185,11,0.3)] hover:shadow-[0_0_30px_rgba(240,185,11,0.5)]"
                                                >
                                                    <Lock className="w-3.5 h-3.5" />
                                                    Üye Ol, Tüm Analizleri Gör
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={analysis.id}
                                        className={`bg-[#060606] border-b border-white/5 transition-colors duration-200 ${isExpanded ? borderGlowClassName : `hover:bg-[#0a0a0a]`}`}
                                    >
                                        {/* Row (Compact Desktop) */}
                                        <div
                                            className="px-5 py-4 md:py-0 md:h-[60px] flex flex-col md:grid md:grid-cols-12 items-center gap-3 cursor-pointer group"
                                            onClick={() => toggleExpand(analysis.id)}
                                        >
                                            {/* Mobile Header / Desktop Time */}
                                            <div className="col-span-1 flex items-center justify-between w-full md:w-auto">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-zinc-600 md:hidden" />
                                                    <span className="text-[#f0b90b] font-black text-[11px] md:text-xs tracking-wide">
                                                        {selectedDate === 'WEEKLY' && <span className="text-[#f0b90b] mr-2">{new Date(analysis.matchDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>}
                                                        {analysis.matchTime}
                                                    </span>
                                                </div>
                                                <div className="md:hidden">
                                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#f0b90b]" /> : <ChevronDown className="w-4 h-4 text-zinc-600" />}
                                                </div>
                                            </div>

                                            {/* Match Name */}
                                            <div className="col-span-4 w-full md:w-auto pl-0 md:pl-8">
                                                <h3 className="text-white font-black text-[13px] tracking-tight uppercase italic truncate">
                                                    {analysis.homeTeam} <span className="text-zinc-600 font-medium mx-1 not-italic text-[10px] uppercase">VS</span> {analysis.awayTeam}
                                                </h3>
                                            </div>

                                            {/* Prediction Badge (Button Style) */}
                                            <div className="col-span-3 w-full md:w-auto flex justify-start md:justify-center">
                                                <div className="bg-transparent border border-[#f0b90b] px-4 py-1.5 rounded-[4px] text-center w-full max-w-[150px]">
                                                    <span className="text-[#f0b90b] font-black text-[10px] uppercase tracking-wider">{analysis.prediction}</span>
                                                </div>
                                            </div>

                                            {/* Odds Columns (Desktop Only) */}
                                            <div className="hidden md:flex col-span-1 justify-center border-l border-zinc-800/20 py-1">
                                                <span className="text-[#f0b90b] font-black text-[13px]">{highestOdds.odd1}</span>
                                            </div>
                                            <div className="hidden md:flex col-span-1 justify-center border-l border-zinc-800/20 py-1">
                                                <span className="text-[#f0b90b] font-black text-[13px]">{highestOdds.odd2}</span>
                                            </div>

                                            {/* Mobile Bottom Row */}
                                            <div className="flex md:hidden w-full items-center justify-between pt-3 border-t border-zinc-900/50 mt-1">
                                                <div className="flex gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">KG VAR</span>
                                                        <span className="text-[#f0b90b] font-black text-xs mt-0.5">{highestOdds.odd1}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">2.5 ÜST</span>
                                                        <span className="text-[#f0b90b] font-black text-xs mt-0.5">{highestOdds.odd2}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">GÜVEN</span>
                                                    <span className="text-white font-black text-xs mt-0.5">%{analysis.confidence}</span>
                                                </div>
                                            </div>

                                            {/* Confidence (Desktop Only) */}
                                            <div className="hidden md:flex col-span-1 items-center justify-center">
                                                <span className="text-white font-black text-[12px]">%{analysis.confidence}</span>
                                            </div>

                                            {/* Actions (Desktop Only) */}
                                            <div className="hidden md:flex col-span-1 justify-end pr-2">
                                                <div className={`p-1 transition-colors ${isExpanded ? 'text-[#f0b90b]' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Accordion Content */}
                                        {isExpanded && (
                                            <div className="border-t border-[#f0b90b]/20 bg-[#151515] p-6 animate-fade-in">
                                                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                                                    {/* Left: Editor Analysis (60%) */}
                                                    <div className="lg:col-span-6 space-y-6">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1 h-4 bg-[#f0b90b]"></div>
                                                                <h4 className="text-white font-black text-[11px] uppercase tracking-widest italic">EDİTÖR DETAYLI ANALİZİ</h4>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1a160b]/50 border border-[#f0b90b]/30 rounded-[4px] shadow-[inset_0_1px_4px_rgba(240,185,11,0.1)]">
                                                                <User className="w-3.5 h-3.5 text-zinc-500" />
                                                                <span className="text-[10px] font-black text-[#f0b90b] tracking-widest uppercase">
                                                                    {analysis.editorId === 'admin' ? 'YÖNETİCİ' : analysis.editorId ? analysis.editorId : 'EDİTÖR'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-5">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Search className="w-3.5 h-3.5 text-[#f0b90b]" />
                                                                    <span className="text-zinc-400 font-black text-[9px] uppercase tracking-widest">TAKTİK ÖZET</span>
                                                                </div>
                                                                <p className="text-white/80 text-[13px] leading-relaxed italic pl-5.5 border-l border-zinc-800 ml-1.5">{analysis.tacticalSummary}</p>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Zap className="w-3.5 h-3.5 text-[#f0b90b]" />
                                                                    <span className="text-zinc-400 font-black text-[9px] uppercase tracking-widest">MAÇIN KIRILMA ANI</span>
                                                                </div>
                                                                <p className="text-white/80 text-[13px] leading-relaxed italic pl-5.5 border-l border-zinc-800 ml-1.5">{analysis.breakingPoint}</p>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Target className="w-3.5 h-3.5 text-[#f0b90b]" />
                                                                    <span className="text-zinc-400 font-black text-[9px] uppercase tracking-widest">BAHİS SENARYOSU</span>
                                                                </div>
                                                                {isLoggedIn ? (
                                                                    <p className="text-white/80 text-[13px] leading-relaxed italic pl-5.5 border-l border-zinc-800 ml-1.5">{analysis.bettingScenario}</p>
                                                                ) : (
                                                                    <div className="relative">
                                                                        <p className="text-white/80 text-[13px] leading-relaxed italic pl-5.5 border-l border-zinc-800 ml-1.5" style={{ filter: 'blur(5px)', userSelect: 'none' }}>{analysis.bettingScenario}</p>
                                                                        <div className="absolute inset-0 flex items-center">
                                                                            <button onClick={onLoginRequired} className="flex items-center gap-1.5 px-3 py-1 bg-[#f0b90b] text-black font-black text-[9px] rounded-full uppercase tracking-widest hover:bg-[#f0b90b]/90 transition-all shadow-[0_0_12px_rgba(240,185,11,0.3)]">
                                                                                <Lock className="w-3 h-3" /> Üye Ol, Gör
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight pt-4">⏳ Oranlar maç saatine kadar değişebilir.</p>
                                                    </div>

                                                    {/* Right: Best Odds (40%) */}
                                                    {/* Right: Best Odds (40%) */}
                                                    <div className="lg:col-span-4 lg:border-l lg:border-zinc-900 lg:pl-8">
                                                        {isLoggedIn ? (
                                                            <>
                                                                <div className="flex items-center gap-2 mb-6">
                                                                    <Flame className="w-4 h-4 text-[#f0b90b]" />
                                                                    <h5 className="text-white font-black text-[11px] uppercase tracking-widest italic tracking-tight">EN İYİ ORANLAR</h5>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {analysis.bookieOdds.map((bookie, bidx) => (
                                                                        <div key={bidx} className={`p-4 rounded-lg bg-black border border-zinc-900 group/odd transition-all hover:border-[#f0b90b]/30 ${bookie.isHighest ? 'ring-1 ring-[#f0b90b]/30 shadow-[0_0_15px_rgba(240,185,11,0.05)]' : ''}`}>
                                                                            <div className="flex items-center justify-between mb-3">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-white font-black text-[12px] uppercase">{bookie.name}</span>
                                                                                    {bookie.isHighest && (
                                                                                        <span className="bg-[#f0b90b] text-black text-[7px] font-black px-1.5 py-0.5 rounded animate-pulse">EN YÜKSEK</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex gap-4">
                                                                                    <div className="flex flex-col">
                                                                                        <span className="text-zinc-600 text-[8px] font-black uppercase">KG VAR</span>
                                                                                        <span className="text-[#f0b90b] font-black text-sm">{bookie.odd1}</span>
                                                                                    </div>
                                                                                    <div className="flex flex-col">
                                                                                        <span className="text-zinc-600 text-[8px] font-black uppercase">2.5 ÜST</span>
                                                                                        <span className="text-[#f0b90b] font-black text-sm">{bookie.odd2}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <a
                                                                                    href={bookie.link}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${bookie.isHighest
                                                                                        ? 'bg-[#f0b90b] text-black hover:shadow-[0_0_15px_rgba(240,185,11,0.5)] active:scale-95'
                                                                                        : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                                                                                        }`}
                                                                                >
                                                                                    {bookie.isHighest ? 'EN YÜKSEK ORAN' : 'ŞİMDİ OYNA'}
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="relative">
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <Flame className="w-4 h-4 text-zinc-600" />
                                                                    <h5 className="text-zinc-500 font-black text-[11px] uppercase tracking-widest italic">EN İYİ ORANLAR</h5>
                                                                </div>
                                                                <div className="space-y-3" style={{ filter: 'blur(6px)', userSelect: 'none', pointerEvents: 'none' }}>
                                                                    {['REALBET', 'MARSBAHİS', 'BETS10'].map((name, i) => (
                                                                        <div key={i} className="p-4 rounded-lg bg-black border border-zinc-900">
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <span className="text-white font-black text-[12px] uppercase">{name}</span>
                                                                                {i === 1 && <span className="bg-[#f0b90b] text-black text-[7px] font-black px-1.5 py-0.5 rounded">EN YÜKSEK</span>}
                                                                            </div>
                                                                            <div className="flex gap-4">
                                                                                <span className="text-[#f0b90b] font-black text-sm">{(1.8 + i * 0.15).toFixed(2)}</span>
                                                                                <span className="text-[#f0b90b] font-black text-sm">{(2.1 + i * 0.1).toFixed(2)}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/50 backdrop-blur-[2px]">
                                                                    <Lock className="w-6 h-6 text-[#f0b90b]" />
                                                                    <button
                                                                        onClick={onLoginRequired}
                                                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#f0b90b] text-black font-black text-xs rounded-full uppercase tracking-widest hover:bg-[#f0b90b]/90 transition-all shadow-[0_0_20px_rgba(240,185,11,0.3)]"
                                                                    >
                                                                        Üye Ol, Oranları Gör
                                                                    </button>
                                                                    <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">Canlı oran karşılaştırması</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Footer Strip */}
                                                    <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-4">
                                                        <div className="flex items-center gap-4 text-zinc-500 text-[9px] font-black uppercase tracking-widest">
                                                            <div className="flex items-center gap-1.5">
                                                                <TrendingUp className="w-3 h-3 text-[#f0b90b]" />
                                                                <span>Model: <span className="text-white">{analysis.modelScore}/100</span></span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Trophy className="w-3 h-3 text-[#f0b90b]" />
                                                                <span>Son 10: <span className="text-white">{analysis.recentHistory}</span></span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Target className="w-3 h-3 text-[#f0b90b]" />
                                                                <span>xG: <span className="text-white">{analysis.expectedGoals}</span></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-[8px] text-zinc-700 font-bold uppercase">{new Date(analysis.createdAt).toLocaleDateString('tr-TR')} Güncellendi</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

                {Object.keys(groupedAnalyses).length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-zinc-800 mx-auto" />
                        <p className="text-zinc-600 font-black text-xs uppercase tracking-widest">Seçili gün ve kategori için analiz bulunamadı.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisView;
