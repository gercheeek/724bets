
import React, { useState, useEffect } from 'react';
import { MatchAnalysis, Coupon, SiteUser, SportCategory } from '../types';
import { Trophy, Clock, ChevronDown, ChevronUp, AlertCircle, Search, Zap, Target, Flame, TrendingUp, Filter, User, Lock } from 'lucide-react';
import DailyCoupons from './DailyCoupons';

interface AnalysisViewProps {
    onNavigate?: (view: string) => void;
    analyses?: MatchAnalysis[];
    coupons?: Coupon[];
    siteUser?: SiteUser | null;
    isLoggedIn?: boolean;
    onLoginRequired?: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ analyses = [], coupons = [], siteUser = null, isLoggedIn = false, onLoginRequired }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selectedSport, setSelectedSport] = useState<SportCategory>('Futbol');
    const [selectedLeague, setSelectedLeague] = useState<string>('TÜMÜ');

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
        const matchesDate = selectedDate === 'WEEKLY' ? dates.includes(a.matchDate) : a.matchDate === selectedDate;
        const matchesLeague = selectedLeague === 'TÜMÜ' || a.league === selectedLeague;
        
        let matchesSport = false;
        if (selectedSport === 'Basketbol') {
            matchesSport = a.sport === 'Basketbol' || a.league.toLowerCase().includes('nba') || a.league.toLowerCase().includes('basket') || a.league.toLowerCase().includes('euroleague');
        } else if (selectedSport === 'Futbol') {
            matchesSport = (!a.sport || a.sport === 'Futbol') && !(a.league.toLowerCase().includes('nba') || a.league.toLowerCase().includes('basket') || a.league.toLowerCase().includes('euroleague'));
        } else {
            matchesSport = a.sport === selectedSport;
        }

        return matchesSport && matchesDate && matchesLeague;
    });

    const leagues = ['TÜMÜ', ...Array.from(new Set(analyses.filter(a => {
        const matchesDate = selectedDate === 'WEEKLY' ? dates.includes(a.matchDate) : a.matchDate === selectedDate;
        
        let matchesSport = false;
        if (selectedSport === 'Basketbol') {
            matchesSport = a.sport === 'Basketbol' || a.league.toLowerCase().includes('nba') || a.league.toLowerCase().includes('basket') || a.league.toLowerCase().includes('euroleague');
        } else if (selectedSport === 'Futbol') {
            matchesSport = (!a.sport || a.sport === 'Futbol') && !(a.league.toLowerCase().includes('nba') || a.league.toLowerCase().includes('basket') || a.league.toLowerCase().includes('euroleague'));
        } else {
            matchesSport = a.sport === selectedSport;
        }

        return matchesDate && matchesSport;
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
            <div className="w-full max-w-6xl mx-auto px-2 pt-20 text-center mb-0 relative z-10">
                {/* Sport Toggle */}
                <div className="flex overflow-x-auto justify-start md:justify-center gap-2 mb-3 mt-1 pb-1 scrollbar-none px-2">
                    <button
                        onClick={() => { setSelectedSport('Futbol'); setSelectedLeague('TÜMÜ'); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest shrink-0 transition-all duration-300 ${selectedSport === 'Futbol'
                            ? 'bg-[#f0b90b] text-black shadow-[0_0_15px_rgba(240,185,11,0.3)] scale-105'
                            : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                            }`}
                    >
                        <span className="text-sm">⚽</span> Futbol
                    </button>
                    <button
                        onClick={() => { setSelectedSport('Basketbol'); setSelectedLeague('TÜMÜ'); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest shrink-0 transition-all duration-300 ${selectedSport === 'Basketbol'
                            ? 'bg-[#E4510B] text-white shadow-[0_0_15px_rgba(228,81,11,0.3)] scale-105'
                            : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                            }`}
                    >
                        <span className="text-sm">🏀</span> Basketbol
                    </button>
                    <button
                        onClick={() => { setSelectedSport('Formula 1'); setSelectedLeague('TÜMÜ'); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest shrink-0 transition-all duration-300 ${selectedSport === 'Formula 1'
                            ? 'bg-[#f0b90b] text-black shadow-[0_0_15px_rgba(240,185,11,0.3)] scale-105'
                            : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                            }`}
                    >
                        <span className="text-sm">🏎️</span> Formula 1
                    </button>
                    <button
                        onClick={() => { setSelectedSport('MotoGP'); setSelectedLeague('TÜMÜ'); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest shrink-0 transition-all duration-300 ${selectedSport === 'MotoGP'
                            ? 'bg-[#f0b90b] text-black shadow-[0_0_15px_rgba(240,185,11,0.3)] scale-105'
                            : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                            }`}
                    >
                        <span className="text-sm">🏍️</span> MotoGP
                    </button>
                    <button
                        onClick={() => { setSelectedSport('Superbike'); setSelectedLeague('TÜMÜ'); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest shrink-0 transition-all duration-300 ${selectedSport === 'Superbike'
                            ? 'bg-[#f0b90b] text-black shadow-[0_0_15px_rgba(240,185,11,0.3)] scale-105'
                            : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                            }`}
                    >
                        <span className="text-sm">🏍️</span> Superbike
                    </button>
                    <button
                        onClick={() => { setSelectedSport('Tenis'); setSelectedLeague('TÜMÜ'); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest shrink-0 transition-all duration-300 ${selectedSport === 'Tenis'
                            ? 'bg-[#f0b90b] text-black shadow-[0_0_15px_rgba(240,185,11,0.3)] scale-105'
                            : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                            }`}
                    >
                        <span className="text-sm">🎾</span> Tenis
                    </button>
                </div>

                {/* Date Selection */}
                <div className="flex overflow-x-auto gap-2 mb-3 pb-1 justify-start md:justify-center scrollbar-none px-2">
                    <button
                        onClick={() => {
                            setSelectedDate('WEEKLY');
                            setSelectedLeague('TÜMÜ');
                        }}
                        className={`flex flex-col items-center justify-center min-w-[70px] h-[44px] rounded-lg transition-all duration-300 shrink-0 ${selectedDate === 'WEEKLY'
                            ? 'bg-[#f0b90b] text-black shadow-[0_0_10px_rgba(240,185,11,0.2)]'
                            : 'bg-[var(--bg-card)] border-[var(--border-subtle)] border text-[#f0b90b] hover:border-[#f0b90b]/50'
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
                                className={`flex flex-col items-center justify-center min-w-[70px] h-[44px] rounded-lg transition-all duration-300 shrink-0 ${isSelected
                                    ? 'bg-[#f0b90b] text-black shadow-[0_0_10px_rgba(240,185,11,0.2)]'
                                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--text-dim)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                <span className={`text-[8px] font-black uppercase tracking-widest leading-none mb-1 ${isSelected ? 'text-black' : 'text-[var(--text-muted)]'}`}>{dayName}</span>
                                <span className={`text-[11px] font-black leading-none ${isSelected ? 'text-black' : 'text-[var(--text-primary)]'}`}>{d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                            </button>
                        );
                    })}
                </div>


                {/* League Filter */}
                <div className="flex overflow-x-auto gap-2 mb-4 pb-2 justify-start md:justify-center scrollbar-none px-2">
                    {leagues.map((league) => (
                        <button
                            key={league}
                            title={league}
                            onClick={() => setSelectedLeague(league)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all duration-300 shrink-0 ${selectedLeague === league
                                ? 'bg-[#f0b90b] border-[#f0b90b] text-black shadow-[0_0_10px_rgba(240,185,11,0.2)]'
                                : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[#f0b90b]/50 hover:text-[var(--text-primary)]'
                                } max-w-[120px] md:max-w-[180px] truncate`}
                        >
                            {league}
                        </button>
                    ))}
                </div>
            </div>

            {/* Analysis List - Body */}
            <div className="w-full max-w-6xl mx-auto px-4 space-y-6">
                {Object.keys(groupedAnalyses).map(leagueName => {
                    const leagueMatches = groupedAnalyses[leagueName];
                    const freeCount = 2; // first 2 visible to everyone
                    const lockedCount = leagueMatches.length - freeCount;
                    return (
                        <div key={leagueName} className="space-y-4">
                            {/* League Section Header */}
                            <div className="flex items-start gap-4 px-4 pt-4 pb-3 mb-2 relative group-header">
                                <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${selectedSport === 'Basketbol' ? 'via-[#E4510B]/50' : 'via-[#f0b90b]/50'} to-transparent`} style={{ background: `linear-gradient(to right, transparent, ${selectedSport === 'Basketbol' ? 'rgba(228,81,11,0.5)' : 'rgba(240,185,11,0.5)'}, transparent)` }}></div>
                                <div className={`w-1.5 h-5 shrink-0 rounded-full mt-0.5 ${selectedSport === 'Basketbol' ? 'bg-[#E4510B]' : 'bg-[#f0b90b]'}`} style={{ boxShadow: selectedSport === 'Basketbol' ? '0 0 15px rgba(228,81,11,0.6)' : '0 0 15px rgba(240,185,11,0.6)' }}></div>
                                <h3 className="text-[var(--text-primary)] font-black text-[11px] md:text-[13px] uppercase tracking-[0.18em] leading-relaxed break-words" title={leagueName}>{leagueName}</h3>
                            </div>

                            {/* Desktop Header */}
                            <div className="hidden md:flex items-center gap-4 px-6 py-3 mb-2 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest relative">
                                <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-[var(--border-subtle)]/30"></div>
                                <div className="w-[100px] shrink-0">SAAT</div>
                                <div className="flex-1 pl-4">MAÇ</div>
                                <div className="w-[180px] shrink-0 text-center">TAHMİN</div>
                                <div className="w-[80px] shrink-0 text-center">{selectedSport === 'Basketbol' ? 'ÜST' : selectedSport === 'Futbol' ? 'KG VAR' : 'SEÇİM 1'}</div>
                                <div className="w-[80px] shrink-0 text-center">{selectedSport === 'Basketbol' ? 'ALT' : selectedSport === 'Futbol' ? '2.5 ÜST' : 'SEÇİM 2'}</div>
                                <div className="w-[80px] shrink-0 text-center">GÜVEN</div>
                                <div className="w-[40px] shrink-0 text-right">AÇ</div>
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
                                        <div key={analysis.id} className="relative mb-3">
                                            {/* Blurred preview */}
                                            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-5 py-4 md:py-0 md:h-[68px] flex flex-col md:grid md:grid-cols-12 items-center gap-3 select-none overflow-hidden" style={{ filter: 'blur(6px)', userSelect: 'none' }}>
                                                <div className="col-span-1 text-[var(--text-muted)] text-[11px] font-black shrink-0">{analysis.matchTime}</div>
                                                <div className="col-span-4 flex items-center gap-2 pl-0 md:pl-8 border-l border-transparent md:border-[var(--border-subtle)] h-full py-4 md:min-w-0 md:w-full">
                                                    <div className="text-xs font-black text-[var(--text-primary)] truncate w-full">{analysis.homeTeam} - {analysis.awayTeam}</div>
                                                </div>
                                                <div className="col-span-3 text-center shrink-0">
                                                    <span className="px-3 py-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded text-[10px] font-black text-[var(--text-muted)] truncate max-w-[120px] inline-block">{analysis.prediction}</span>
                                                </div>
                                                <div className="col-span-1 text-center text-[11px] font-black text-[var(--text-muted)]">{analysis.confidence}%</div>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-xl border border-[var(--border-subtle)] z-10 transition-all hover:bg-black/50 hover:border-[#f0b90b]/30">
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
                                        className={`bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[20px] mb-4 overflow-hidden transition-all duration-500 group ${isExpanded ? borderGlowClassName + ' ring-1 ' + (selectedSport === 'Basketbol' ? 'ring-[#E4510B]/30' : 'ring-[#f0b90b]/30') : hoverBorderClassName + ' hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:shadow-[#f0b90b10] hover:-translate-y-1 hover:border-[#f0b90b]/30'}`}
                                    >
                                        {/* Row (Flexible Desktop) */}
                                        <div
                                            className="px-6 py-5 md:py-0 md:h-[76px] flex flex-col md:flex-row items-center gap-4 cursor-pointer relative"
                                            onClick={() => toggleExpand(analysis.id)}
                                        >
                                            {/* Time Column */}
                                            <div className="w-full md:w-[100px] shrink-0 flex items-center justify-between md:justify-start">
                                                <div className="flex flex-col">
                                                    {selectedDate === 'WEEKLY' && <span className="text-[var(--text-muted)] text-[8px] font-black uppercase mb-0.5">{new Date(analysis.matchDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>}
                                                    <span className="text-[#f0b90b] font-black text-[11px] md:text-[13px] tracking-wide">
                                                        {analysis.matchTime}
                                                    </span>
                                                </div>
                                                <div className="md:hidden">
                                                    {isExpanded ? <ChevronUp className="w-5 h-5 text-[#f0b90b]" /> : <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />}
                                                </div>
                                            </div>

                                            {/* Match Name Column (Flex-1) */}
                                            <div className={`w-full md:flex-1 md:pl-6 border-l border-transparent md:border-[var(--border-subtle)]/40 h-full flex items-center transition-colors duration-300 md:min-w-0 ${selectedSport === 'Basketbol' ? 'group-hover:border-[#E4510B]/30' : 'group-hover:border-[#f0b90b]/30'}`}>
                                                <h3 className="text-[var(--text-primary)] font-black text-[14px] md:text-[16px] tracking-tight uppercase italic pt-2 md:pt-0 w-full flex items-center gap-2 flex-wrap" title={`${analysis.homeTeam} VS ${analysis.awayTeam}`}>
                                                    <span className="text-white group-hover:text-[#f0b90b] transition-colors duration-300">{analysis.homeTeam}</span>
                                                    <span className="text-[var(--text-muted)] font-medium not-italic text-[10px] uppercase shrink-0 px-2 opacity-50">VS</span> 
                                                    <span className="text-white group-hover:text-[#f0b90b] transition-colors duration-300">{analysis.awayTeam}</span>
                                                </h3>
                                            </div>

                                            {/* Prediction Badge */}
                                            <div className={`w-full md:w-[180px] shrink-0 flex justify-start md:justify-center border-l border-transparent md:border-[var(--border-subtle)]/40 h-full items-center transition-colors duration-300 pt-2 md:pt-0 ${selectedSport === 'Basketbol' ? 'group-hover:border-[#E4510B]/30' : 'group-hover:border-[#f0b90b]/30'}`}>
                                                <div className={`border px-5 py-2 rounded-xl text-center w-full transition-all duration-300 ${selectedSport === 'Basketbol' ? 'bg-[#E4510B]/5 border-[#E4510B]/20 group-hover:bg-[#E4510B]/10 group-hover:border-[#E4510B]/50' : 'bg-[#f0b90b]/5 border-[#f0b90b]/20 group-hover:bg-[#f0b90b]/10 group-hover:border-[#f0b90b]/50'}`}>
                                                    <span className={`${selectedSport === 'Basketbol' ? 'text-[#E4510B]' : 'text-[#f0b90b]'} font-black text-[11px] md:text-[12px] uppercase tracking-wider block`} title={analysis.prediction}>{analysis.prediction}</span>
                                                </div>
                                            </div>

                                            {/* Odds Columns (Desktop Only) */}
                                            <div className={`hidden md:flex w-[80px] shrink-0 justify-center border-l border-[var(--border-subtle)]/40 h-full items-center transition-colors duration-300 ${selectedSport === 'Basketbol' ? 'group-hover:border-[#E4510B]/30' : 'group-hover:border-[#f0b90b]/30'}`}>
                                                <span className={`${highlightColorClassName} font-black text-[15px] group-hover:scale-110 transition-transform`}>{highestOdds.odd1}</span>
                                            </div>
                                            <div className={`hidden md:flex w-[80px] shrink-0 justify-center border-l border-[var(--border-subtle)]/40 h-full items-center transition-colors duration-300 ${selectedSport === 'Basketbol' ? 'group-hover:border-[#E4510B]/30' : 'group-hover:border-[#f0b90b]/30'}`}>
                                                <span className={`${highlightColorClassName} font-black text-[15px] group-hover:scale-110 transition-transform`}>{highestOdds.odd2}</span>
                                            </div>

                                            {/* Mobile Bottom Row */}
                                            <div className="flex md:hidden w-full items-center justify-between pt-4 border-t border-zinc-800/50 mt-1">
                                                <div className="flex gap-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest">{selectedSport === 'Basketbol' ? 'ÜST' : selectedSport === 'Futbol' ? 'KG VAR' : 'SEÇİM 1'}</span>
                                                        <span className="text-[#f0b90b] font-black text-sm mt-0.5">{highestOdds.odd1}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest">{selectedSport === 'Basketbol' ? 'ALT' : selectedSport === 'Futbol' ? '2.5 ÜST' : 'SEÇİM 2'}</span>
                                                        <span className="text-[#f0b90b] font-black text-sm mt-0.5">{highestOdds.odd2}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest">GÜVEN</span>
                                                    <span className="text-[var(--text-primary)] font-black text-sm mt-0.5">%{analysis.confidence}</span>
                                                </div>
                                            </div>

                                            {/* Confidence Column (Desktop Only) */}
                                            <div className={`hidden md:flex w-[80px] shrink-0 items-center justify-center border-l border-[var(--border-subtle)]/40 h-full transition-colors duration-300 ${selectedSport === 'Basketbol' ? 'group-hover:border-[#E4510B]/30' : 'group-hover:border-[#f0b90b]/30'}`}>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[var(--text-primary)] font-black text-[14px]">%{analysis.confidence}</span>
                                                    <div className="w-8 h-1 bg-zinc-800 mt-1 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#f0b90b]" style={{ width: `${analysis.confidence}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions Box */}
                                            <div className={`hidden md:flex w-[40px] shrink-0 justify-center border-l border-[var(--border-subtle)]/40 h-full items-center transition-colors duration-300 ${selectedSport === 'Basketbol' ? 'group-hover:border-[#E4510B]/30' : 'group-hover:border-[#f0b90b]/30'}`}>
                                                <div className={`p-2 rounded-xl transition-all duration-300 ${isExpanded ? (selectedSport === 'Basketbol' ? 'bg-[#E4510B] text-white' : 'bg-[#f0b90b] text-black') : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700 group-hover:text-white'}`}>
                                                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Accordion Content */}
                                        {isExpanded && (
                                            <div className="border-t bg-[#050505] p-0 animate-fade-in relative overflow-hidden" style={{ borderColor: selectedSport === 'Basketbol' ? 'rgba(228,81,11,0.3)' : 'rgba(240,185,11,0.3)' }}>
                                                
                                                {/* PREMIUM STADIUM BACKGROUND LAYER */}
                                                <div className="absolute inset-0 z-0 overflow-hidden">
                                                    <div 
                                                        className="absolute inset-0 opacity-40 mix-blend-screen scale-110"
                                                        style={{
                                                            backgroundImage: selectedSport === 'Futbol' 
                                                                ? 'url("https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?q=80&w=2000&auto=format&fit=crop")' 
                                                                : 'url("https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2000&auto=format&fit=crop")',
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            filter: 'contrast(1.2) brightness(0.8) saturate(1.2)',
                                                        }}
                                                    />
                                                    {/* Pro Grade Overlays */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] opacity-90" />
                                                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
                                                    <div className="absolute inset-0 bg-black/50" />
                                                </div>
                                                
                                                <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-10 gap-8">
                                                    {/* Left: Editor Analysis (60%) */}
                                                    <div className="lg:col-span-6 space-y-6">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1 h-4 bg-[#f0b90b]"></div>
                                                                <h4 className="text-[var(--text-primary)] font-black text-[11px] uppercase tracking-widest italic">EDİTÖR DETAYLI ANALİZİ</h4>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-card)] border border-[#f0b90b]/30 rounded-[4px] shadow-[inset_0_1px_4px_rgba(240,185,11,0.1)]">
                                                                <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                                                <span className="text-[10px] font-black text-[#f0b90b] tracking-widest uppercase">
                                                                    {analysis.editorId === 'admin' ? 'YÖNETİCİ' : analysis.editorId ? analysis.editorId : 'EDİTÖR'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-5">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Search className="w-3.5 h-3.5 text-[#f0b90b]" />
                                                                    <span className="text-[var(--text-dim)] font-black text-[9px] uppercase tracking-widest">TAKTİK ÖZET</span>
                                                                </div>
                                                                <p className="text-[var(--text-secondary)] text-[13px] leading-relaxed italic pl-5.5 border-l border-[var(--border-subtle)] ml-1.5">{analysis.tacticalSummary}</p>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Zap className="w-3.5 h-3.5 text-[#f0b90b]" />
                                                                    <span className="text-[var(--text-dim)] font-black text-[9px] uppercase tracking-widest">MAÇIN KIRILMA ANI</span>
                                                                </div>
                                                                <p className="text-[var(--text-secondary)] text-[13px] leading-relaxed italic border-l border-[var(--border-subtle)]" style={{ paddingLeft: '22px', marginLeft: '6px' }}>{analysis.breakingPoint}</p>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Target className="w-3.5 h-3.5 text-[#f0b90b]" />
                                                                    <span className="text-[var(--text-dim)] font-black text-[9px] uppercase tracking-widest">BAHİS SENARYOSU</span>
                                                                </div>
                                                                {isLoggedIn ? (
                                                                    <p className="text-[var(--text-secondary)] text-[13px] leading-relaxed italic pl-5.5 border-l border-[var(--border-subtle)] ml-1.5">{analysis.bettingScenario}</p>
                                                                ) : (
                                                                    <div className="relative">
                                                                        <p className="text-[var(--text-secondary)] text-[13px] leading-relaxed italic pl-5.5 border-l border-[var(--border-subtle)] ml-1.5" style={{ filter: 'blur(5px)', userSelect: 'none' }}>{analysis.bettingScenario}</p>
                                                                        <div className="absolute inset-0 flex items-center">
                                                                            <button onClick={onLoginRequired} className="flex items-center gap-1.5 px-3 py-1 bg-[#f0b90b] text-black font-black text-[9px] rounded-full uppercase tracking-widest hover:bg-[#f0b90b]/90 transition-all shadow-[0_0_12px_rgba(240,185,11,0.3)]">
                                                                                <Lock className="w-3 h-3" /> Üye Ol, Gör
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tight pt-4">⏳ Oranlar maç saatine kadar değişebilir.</p>
                                                    </div>

                                                    {/* Right: Best Odds (40%) */}
                                                    {/* Right: Best Odds (40%) */}
                                                    <div className="lg:col-span-4 lg:border-l lg:border-[var(--border-subtle)] lg:pl-8">
                                                        {isLoggedIn ? (
                                                            <>
                                                                <div className="flex items-center gap-2 mb-6">
                                                                    <Flame className="w-4 h-4 text-[#f0b90b]" />
                                                                    <h5 className="text-[var(--text-primary)] font-black text-[11px] uppercase tracking-widest italic tracking-tight">EN İYİ ORANLAR</h5>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {analysis.bookieOdds.map((bookie, bidx) => (
                                                                        <div key={bidx} className={`p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] group/odd transition-all hover:border-[#f0b90b]/30 ${bookie.isHighest ? 'ring-1 ring-[#f0b90b]/30 shadow-[0_0_15px_rgba(240,185,11,0.05)]' : ''}`}>
                                                                            <div className="flex items-center justify-between mb-3">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-[var(--text-primary)] font-black text-[12px] uppercase">{bookie.name}</span>
                                                                                    {bookie.isHighest && (
                                                                                        <span className="bg-[#f0b90b] text-black text-[7px] font-black px-1.5 py-0.5 rounded animate-pulse">EN YÜKSEK</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex gap-4">
                                                                                    <div className="flex flex-col">
                                                                                        <span className="text-[var(--text-muted)] text-[8px] font-black uppercase">{selectedSport === 'Basketbol' ? 'ÜST' : selectedSport === 'Futbol' ? 'KG VAR' : 'SEÇİM 1'}</span>
                                                                                        <span className="text-[#f0b90b] font-black text-sm">{bookie.odd1}</span>
                                                                                    </div>
                                                                                    <div className="flex flex-col">
                                                                                        <span className="text-[var(--text-muted)] text-[8px] font-black uppercase">{selectedSport === 'Basketbol' ? 'ALT' : selectedSport === 'Futbol' ? '2.5 ÜST' : 'SEÇİM 2'}</span>
                                                                                        <span className="text-[#f0b90b] font-black text-sm">{bookie.odd2}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <a
                                                                                    href={bookie.link}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${bookie.isHighest
                                                                                        ? 'bg-[#f0b90b] text-black hover:shadow-[0_0_15px_rgba(240,185,11,0.5)] active:scale-95'
                                                                                        : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
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
                                                                    <Flame className="w-4 h-4 text-[var(--text-muted)]" />
                                                                    <h5 className="text-[var(--text-muted)] font-black text-[11px] uppercase tracking-widest italic">EN İYİ ORANLAR</h5>
                                                                </div>
                                                                <div className="space-y-3" style={{ filter: 'blur(6px)', userSelect: 'none', pointerEvents: 'none' }}>
                                                                    {['REALBET', 'MARSBAHİS', 'BETS10'].map((name, i) => (
                                                                        <div key={i} className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <span className="text-[var(--text-primary)] font-black text-[12px] uppercase">{name}</span>
                                                                                {i === 1 && <span className="bg-[#f0b90b] text-black text-[7px] font-black px-1.5 py-0.5 rounded">EN YÜKSEK</span>}
                                                                            </div>
                                                                            <div className="flex gap-4">
                                                                                <span className="text-[#f0b90b] font-black text-sm">{(1.8 + i * 0.15).toFixed(2)}</span>
                                                                                <span className="text-[#f0b90b] font-black text-sm">{(2.1 + i * 0.1).toFixed(2)}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-[var(--bg-overlay)] backdrop-blur-[2px]">
                                                                    <Lock className="w-6 h-6 text-[#f0b90b]" />
                                                                    <button
                                                                        onClick={onLoginRequired}
                                                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#f0b90b] text-black font-black text-xs rounded-full uppercase tracking-widest hover:bg-[#f0b90b]/90 transition-all shadow-[0_0_20px_rgba(240,185,11,0.3)]"
                                                                    >
                                                                        Üye Ol, Oranları Gör
                                                                    </button>
                                                                    <p className="text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-widest">Canlı oran karşılaştırması</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>


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
                        <AlertCircle className="w-12 h-12 text-[var(--text-dim)] mx-auto" />
                        <p className="text-[var(--text-muted)] font-black text-xs uppercase tracking-widest">Seçili gün ve kategori için analiz bulunamadı.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisView;
