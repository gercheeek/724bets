import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Zap, Flame, Target } from 'lucide-react';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { PlayerLogo, findBestLogoMatch } from './PlayerLogo';
import { AnimatedOdd } from '../AnimatedOdd';
import { LiveTimer } from './MatchCard';
import { getMatchPriorityScore } from '../../utils/eliteTeams';

const PREMIUM_LEAGUES = [
    'SUPER LIG', 'SÜPER LİG', 
    'CHAMPIONS LEAGUE', 'ŞAMPİYONLAR', 
    'EUROPA LEAGUE', 'AVRUPA LİGİ', 'CONFERENCE LEAGUE', 'KONFERANS LİGİ',
    'PREMIER LEAGUE', 'PREMIER LIG', 'PREMIER LİG', 
    'LA LIGA', 'SERIE A', 'BUNDESLIGA', 'LIGUE 1', 
    'NBA', 'EUROLEAGUE', 'LIGA PORTUGAL', 'EREDIVISIE', 
    'WORLD CUP', 'DÜNYA KUPASI', 'EURO 20'
];

function isPremium(league: string) {
    if (!league) return false;
    const l = league.toUpperCase();
    
    // Explicitly exclude amateur/lower leagues, qualifiers, and SECOND DIVISIONS that falsely match
    if (l.includes('QUEENSLAND') || l.includes('VICTORIA') || l.includes('NPL') || l.includes('RESERVE') || l.includes('YOUTH') || l.includes('U19') || l.includes('U21') || l.includes('WOMEN') || l.includes('KADIN') || l.includes('ELEMELER') || l.includes('QUALIFIERS') || l.includes('2.') || l.includes('SERIE B') || l.includes('SERIE C') || l.includes('PORTUGAL 2') || l.includes('CHAMPIONSHIP') || l.includes('LIGA 2') || l.includes('LIG 2')) {
        return false;
    }

    return PREMIUM_LEAGUES.some(p => l.includes(p));
}

function CouponSlide({ matches, compact }: { matches: any[], compact?: boolean }) {
    const { addSelection } = useBetSlip();
    if (!matches || matches.length < 3) return null;
    
    const m1 = matches[0];
    const m2 = matches[1];
    const m3 = matches[2];

    const cleanTeamName = (name: string) => {
        if (!name) return '';
        // Remove common long suffixes to make it cleaner (e.g. Gremio FB Porto Alegrense -> Gremio)
        return name.replace(/\s(FC|SAD|FB PORTO ALEGRENSE|ROTTERDAM|EAGLES|FK|SK|AS|US|UNITED)$/i, '').trim();
    };

    const cleanLeague = (league: string) => {
        if (!league) return '';
        return league.replace(/Uluslararası\s*-\s*/i, '').trim();
    };

    const totalOdd = (parseFloat(m1.homeOdd) * parseFloat(m2.homeOdd) * parseFloat(m3.homeOdd)).toFixed(2);

    const handlePlayCoupon = (e: any) => {
        e.stopPropagation();
        addSelection({ id: m1.homeId || m1.id+'_1', matchId: m1.id, matchName: `${m1.home} vs ${m1.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(m1.homeOdd) });
        addSelection({ id: m2.homeId || m2.id+'_1', matchId: m2.id, matchName: `${m2.home} vs ${m2.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(m2.homeOdd) });
        addSelection({ id: m3.homeId || m3.id+'_1', matchId: m3.id, matchName: `${m3.home} vs ${m3.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(m3.homeOdd) });
        
        // Dispatch custom event to open sidebar on mobile or desktop if closed
        window.dispatchEvent(new CustomEvent('open-betslip'));
    };

    return (
        <div className="w-full h-full flex-shrink-0 relative overflow-hidden bg-[#0D121C]/80 backdrop-blur-2xl cursor-pointer group/coupon flex flex-col md:flex-row border border-white/5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            {/* Ultra Premium Radial Mesh Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#00E5FF]/20 via-[#0D121C]/80 to-[#0D121C]/90 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-r from-[#00E5FF]/5 to-transparent pointer-events-none"></div>

            {/* Left Panel - Clean & Premium */}
            <div className="w-full md:w-[35%] p-5 md:p-6 flex flex-col justify-between relative z-10 border-b md:border-b-0 md:border-r border-white/5 bg-transparent">
                
                <div>
                    {/* Minimal Premium Badge */}
                    <div className="inline-flex items-center gap-1.5 mb-4 bg-gradient-to-r from-[#FF4500]/10 to-transparent border border-[#FF4500]/20 px-2.5 py-1 rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                        <Flame className="w-3.5 h-3.5 text-[#FF4500]" />
                        <span className="text-[#FF4500] font-bold text-[9px] md:text-[10px] tracking-widest uppercase opacity-90">Günün Bankosu</span>
                    </div>
                    
                    {/* Crisp Typography */}
                    <div className="mb-4">
                        <h3 className="font-black uppercase leading-[1.1] text-[28px] md:text-[34px] tracking-tight">
                            <span className="text-white block drop-shadow-sm">ÜÇLÜ</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00E5FF] block drop-shadow-sm">KOMBİNE</span>
                        </h3>
                    </div>
                </div>
                
                <div>
                    {/* Clean Odds Display */}
                    <div className="flex flex-col mb-4">
                        <span className="text-zinc-400 font-medium text-[10px] uppercase tracking-widest mb-1">Toplam Oran</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[#00E5FF] font-bold text-[18px]">x</span>
                            <span className="text-white font-black text-[36px] md:text-[42px] leading-none tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">{totalOdd}</span>
                        </div>
                    </div>
                    
                    {/* Premium Button */}
                    <button 
                        onClick={handlePlayCoupon}
                        className="w-full py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00E5FF] text-white font-black text-[12px] md:text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-[#00E5FF]/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:from-[#00E5FF] hover:to-[#00E5FF] transition-all active:scale-[0.98] relative overflow-hidden group/btn"
                    >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:animate-[shine-sweep_2s_ease-in-out_infinite]" />
                        <span className="relative z-10 flex items-center gap-2">
                            KUPONU OYNA <Zap className="w-4 h-4" />
                        </span>
                    </button>
                </div>
            </div>

            {/* Right Panel - Clean List */}
            <div className="w-full md:w-[65%] p-3 md:p-4 flex flex-col justify-center gap-1.5 relative z-10 bg-[#0D121C]">
                {[m1, m2, m3].map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[#121825] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[#00E5FF]/30 hover:bg-[#161D2C] transition-all duration-200 group shrink-0">
                        
                        {/* Match Info */}
                        <div className="flex flex-col pr-4">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-white font-bold text-[13px] md:text-[15px] tracking-wide">{cleanTeamName(m.home)}</span>
                                <span className="text-zinc-600 font-medium text-[10px]">vs</span>
                                <span className="text-zinc-300 font-bold text-[13px] md:text-[15px] tracking-wide group-hover:text-white transition-colors">{cleanTeamName(m.away)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-zinc-500 font-medium text-[9px] md:text-[10px] uppercase tracking-wider">{cleanLeague(m.league)}</span>
                                <span className="text-zinc-600 text-[9px]">•</span>
                                <span className="text-zinc-500 font-medium text-[9px] md:text-[10px]">{m.startTime}</span>
                            </div>
                        </div>
                        
                        {/* Clean Odds Box */}
                        <div className="flex items-center">
                            <div className="bg-[#0b0e14]/50 backdrop-blur-sm border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] group-hover:border-[#00E5FF]/50 group-hover:bg-[#00E5FF]/10 group-hover:shadow-[inset_0_0_15px_rgba(16,185,129,0.2)] rounded-md px-3 md:px-4 py-1.5 md:py-2 transition-all flex flex-col items-center justify-center min-w-[70px] md:min-w-[80px]">
                                <span className="text-zinc-500 font-medium text-[8px] md:text-[9px] mb-0.5 group-hover:text-[#00E5FF]/80 transition-colors">MS 1</span>
                                <span className="text-white font-bold text-[13px] md:text-[15px] group-hover:text-[#00E5FF] transition-colors">{m.homeOdd}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MatchSlide({ matchData, theme, leagueName, compact = false, onSelectMatch }: { matchData: any, theme: string, leagueName: string, compact?: boolean, onSelectMatch?: (match: any) => void }) {
    const { addSelection } = useBetSlip();
    const themes: any = {
        'fener': {
            bgFrom: 'from-[#060d1a]', bgVia: 'via-[#0b162c]', bgTo: 'to-[#040812]',
            blob1: 'bg-[#00E5FF]', blob2: 'bg-[#eab308]',
            badgeBg: 'bg-[#00E5FF]',
            leagueColor: 'text-[#eab308]',
            bgLogo: 'https://upload.wikimedia.org/wikipedia/tr/9/90/Trendyol_S%C3%BCper_Lig_Logo.png'
        },
        'cl': {
            bgFrom: 'from-[#020617]', bgVia: 'via-[#0f172a]', bgTo: 'to-[#020617]',
            blob1: 'bg-[#3b82f6]', blob2: 'bg-[#0ea5e9]',
            badgeBg: 'bg-[#3b82f6]',
            leagueColor: 'text-[#3b82f6]',
            bgLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/UEFA_Champions_League_logo_2.svg'
        },
        'el': {
            bgFrom: 'from-[#1a0f0a]', bgVia: 'via-[#2c1a0b]', bgTo: 'to-[#120804]',
            blob1: 'bg-[#f97316]', blob2: 'bg-[#ea580c]',
            badgeBg: 'bg-[#f97316]',
            leagueColor: 'text-[#f97316]',
            bgLogo: 'https://upload.wikimedia.org/wikipedia/commons/1/15/UEFA_Europa_League_logo.svg'
        },
        'tr': {
            bgFrom: 'from-[#1a0606]', bgVia: 'via-[#2c0b0b]', bgTo: 'to-[#120404]',
            blob1: 'bg-[#ef4444]', blob2: 'bg-[#dc2626]',
            badgeBg: 'bg-[#ef4444]',
            leagueColor: 'text-[#ef4444]',
            bgLogo: 'https://upload.wikimedia.org/wikipedia/tr/9/90/Trendyol_S%C3%BCper_Lig_Logo.png'
        },
        'premium': {
            bgFrom: 'from-[#0a0f1c]', bgVia: 'via-[#111827]', bgTo: 'to-[#030712]',
            blob1: 'bg-[#8b5cf6]', blob2: 'bg-[#d946ef]',
            badgeBg: 'bg-[#8b5cf6]',
            leagueColor: 'text-[#8b5cf6]',
            bgLogo: null
        }
    };
    
    const t = themes[theme] || themes['premium'];

    return (
        <div 
            className="w-full h-full flex-shrink-0 relative overflow-hidden bg-[#0a0f1c] cursor-pointer"
            onClick={() => {
                if (onSelectMatch) {
                    onSelectMatch(matchData.match);
                } else {
                    addSelection({ id: matchData.match.homeId || matchData.match.id+'_1', matchId: matchData.match.id, matchName: `${matchData.home} vs ${matchData.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(matchData.homeOdd) });
                    window.dispatchEvent(new CustomEvent('open-betslip'));
                }
            }}
        >
            {/* PREMIUM BACKGROUND WITH GRID & GLOW */}
            <div className="absolute inset-0 z-0">
                <div className={`absolute inset-0 bg-gradient-to-br ${t.bgFrom} ${t.bgVia} ${t.bgTo}`}></div>
                
                {t.bgLogo && (
                    <div className="absolute right-[-10%] md:right-[0%] top-1/2 -translate-y-1/2 w-[90%] h-[120%] opacity-[0.1] md:opacity-[0.25] flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                        <img src={t.bgLogo} alt="League Logo" className="w-[120%] h-[120%] md:w-[90%] md:h-[90%] object-contain blur-[3px] md:blur-[5px] drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] grayscale saturate-0 brightness-150" />
                    </div>
                )}

                <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[120%] ${t.blob1} opacity-[0.05] blur-[80px] rounded-full mix-blend-screen`}></div>
                <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] ${t.blob2} opacity-[0.05] blur-[100px] rounded-full mix-blend-screen z-10`}></div>
                <div className="absolute inset-0 opacity-[0.05] z-10" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none z-10"></div>
            </div>
            
            <div className="absolute inset-0 z-10 flex px-3 md:px-10 h-full pt-2 md:pt-4 pb-2 md:pb-6">
                <div className="w-full flex flex-col items-center justify-center relative h-full">
                    {/* Date Pill & League at the top */}
                    <div className="flex flex-col items-center mb-1 md:mb-4 z-40">
                        {leagueName && (
                            <span className={`${t.leagueColor} font-bold text-[8px] md:text-[10px] tracking-[0.4em] uppercase drop-shadow-md mb-1 md:mb-2 opacity-90`}>
                                {leagueName.replace(/Uluslararası\s*-\s*/i, '').trim()}
                            </span>
                        )}
                        {(matchData.isLive || matchData.match?.isLive) ? (
                            <div className="flex items-center gap-1.5 md:gap-3 bg-black/60 backdrop-blur-md border border-[#ef4444]/30 rounded-full px-3 md:px-5 py-1 md:py-1.5 shadow-[0_0_20px_rgba(239,68,68,0.3)] scale-90 md:scale-100">
                                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#ef4444] shadow-[0_0_10px_#ef4444] animate-pulse"></div>
                                <span className="text-white font-bold text-[10px] md:text-[14px] tracking-widest uppercase text-[#ef4444]">
                                    <LiveTimer minute={matchData.minute || matchData.match?.minute} />
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 md:gap-3 bg-[#030712]/80 backdrop-blur-xl border border-white/10 rounded-full px-3 md:px-5 py-1 md:py-1.5 shadow-[inset_0_1px_rgba(255,255,255,0.1),_0_8px_20px_rgba(0,0,0,0.8)] scale-90 md:scale-100">
                                <div className="relative flex items-center justify-center mr-0.5 md:mr-1">
                                    <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${t.badgeBg} animate-ping opacity-60 absolute`}></div>
                                    <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${t.badgeBg} shadow-[0_0_10px_${t.badgeBg}] relative z-10`}></div>
                                </div>
                                <span className="text-zinc-200 font-bold text-[9px] md:text-[13px] tracking-[0.2em] uppercase">{matchData.dateStr}</span>
                                <div className="w-[1px] h-3 md:h-4 bg-white/20 mx-0.5 md:mx-1"></div>
                                <span className={`${t.leagueColor} font-black text-[10px] md:text-[14px] tracking-[0.1em]`}>{matchData.timeStr}</span>
                            </div>
                        )}
                    </div>

                    {/* Logos and Odds Row */}
                    <div className="flex items-stretch justify-center w-full relative z-20 gap-3 md:gap-10 max-w-[800px] mx-auto mt-2 md:mt-4 h-[140px] md:h-[220px]">
                        {/* Home Team */}
                        <div className="flex flex-col items-center justify-end group cursor-pointer flex-1" onClick={(e) => { e.stopPropagation(); addSelection({ id: matchData.match.homeId || matchData.match.id+'_1', matchId: matchData.match.id, matchName: `${matchData.home} vs ${matchData.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(matchData.homeOdd) }); window.dispatchEvent(new CustomEvent('open-betslip')); }}>
                            <div className="flex-1 flex items-center justify-center w-full mb-2 md:mb-4">
                                <div className={`relative z-20 hover:scale-110 transition-transform duration-500 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] ${compact ? 'w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24' : 'w-14 h-14 md:w-24 md:h-24 lg:w-32 lg:h-32'}`}>
                                    <div className={`absolute inset-0 ${t.badgeBg} opacity-20 blur-[10px] md:blur-[20px] rounded-full mix-blend-screen`}></div>
                                    <PlayerLogo name={matchData.home} fallbackLogo="" sport={matchData.sport} />
                                </div>
                            </div>
                            <div className={`shrink-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-1 md:px-4 py-1.5 md:py-2.5 group-hover:bg-white/10 group-hover:border-[#00E5FF]/40 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-[100%] md:w-auto min-w-[70px] md:min-w-[140px] max-w-[110px] md:max-w-[180px]`}>
                                <span className={`text-white/70 font-bold uppercase tracking-wider mb-0.5 md:mb-1 group-hover:text-white transition-colors w-full text-center truncate ${compact ? 'text-[7px]' : 'text-[8px] md:text-[10px]'}`} title={matchData.home}>{matchData.home}</span>
                                <span className={`text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:text-[#00E5FF] transition-colors ${compact ? 'text-[14px] md:text-[18px]' : 'text-[16px] md:text-[24px]'}`}>
                                    {matchData.homeOdd === '-' ? '🔒' : <AnimatedOdd value={matchData.homeOdd} />}
                                </span>
                            </div>
                        </div>

                        {/* VS / Draw */}
                        <div className="flex flex-col items-center justify-end group cursor-pointer flex-1" onClick={(e) => { e.stopPropagation(); addSelection({ id: matchData.match.drawId || matchData.match.id+'_x', matchId: matchData.match.id, matchName: `${matchData.home} vs ${matchData.away}`, selectionName: 'Maç Sonucu: X', odd: parseFloat(matchData.drawOdd) }); window.dispatchEvent(new CustomEvent('open-betslip')); }}>
                            <div className="flex-1 flex flex-col items-center justify-center relative w-full mb-2 md:mb-4">
                                {(matchData.isLive || matchData.match?.isLive) ? (
                                    <div className={`text-white font-black tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] whitespace-nowrap ${compact ? 'text-[24px] md:text-[36px]' : 'text-[28px] md:text-[48px]'}`}>
                                        {matchData.score || matchData.match?.score || '0 - 0'}
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 md:w-16 md:h-16 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-lg md:rounded-2xl border border-white/30 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.8)] rotate-45 relative overflow-hidden">
                                        <div className={`absolute inset-0 bg-gradient-to-tr ${t.bgFrom} to-transparent opacity-60`}></div>
                                        <span className="text-white font-black text-[12px] md:text-[22px] italic -rotate-45 block transform drop-shadow-lg relative z-10">VS</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className={`shrink-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-2 md:px-6 py-1.5 md:py-2.5 group-hover:bg-white/10 group-hover:border-[#00E5FF]/40 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-[90%] md:w-auto min-w-[70px] md:min-w-[120px]`}>
                                <span className={`text-white/70 font-bold uppercase tracking-wider mb-0.5 md:mb-1 group-hover:text-white transition-colors ${compact ? 'text-[7px]' : 'text-[8px] md:text-[10px]'}`}>BERABERE</span>
                                <span className={`text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:text-[#00E5FF] transition-colors ${compact ? 'text-[14px] md:text-[18px]' : 'text-[16px] md:text-[24px]'}`}>
                                    {matchData.drawOdd === '-' ? '🔒' : <AnimatedOdd value={matchData.drawOdd} />}
                                </span>
                            </div>
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center justify-end group cursor-pointer flex-1" onClick={(e) => { e.stopPropagation(); addSelection({ id: matchData.match.awayId || matchData.match.id+'_2', matchId: matchData.match.id, matchName: `${matchData.home} vs ${matchData.away}`, selectionName: 'Maç Sonucu: 2', odd: parseFloat(matchData.awayOdd) }); window.dispatchEvent(new CustomEvent('open-betslip')); }}>
                            <div className="flex-1 flex items-center justify-center w-full mb-2 md:mb-4">
                                <div className={`relative z-20 hover:scale-110 transition-transform duration-500 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] ${compact ? 'w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24' : 'w-14 h-14 md:w-24 md:h-24 lg:w-32 lg:h-32'}`}>
                                    <div className={`absolute inset-0 ${t.badgeBg} opacity-20 blur-[10px] md:blur-[20px] rounded-full mix-blend-screen`}></div>
                                    <PlayerLogo name={matchData.away} fallbackLogo="" sport={matchData.sport} />
                                </div>
                            </div>
                            <div className={`shrink-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-1 md:px-4 py-1.5 md:py-2.5 group-hover:bg-white/10 group-hover:border-[#00E5FF]/40 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-[100%] md:w-auto min-w-[70px] md:min-w-[140px] max-w-[110px] md:max-w-[180px]`}>
                                <span className={`text-white/70 font-bold uppercase tracking-wider mb-0.5 md:mb-1 group-hover:text-white transition-colors w-full text-center truncate ${compact ? 'text-[7px]' : 'text-[8px] md:text-[10px]'}`} title={matchData.away}>{matchData.away}</span>
                                <span className={`text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:text-[#00E5FF] transition-colors ${compact ? 'text-[14px] md:text-[18px]' : 'text-[16px] md:text-[24px]'}`}>
                                    {matchData.awayOdd === '-' ? '🔒' : <AnimatedOdd value={matchData.awayOdd} />}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SportsPromoSlider({ matches = [], compact = false, onSelectMatch }: { matches?: any[], compact?: boolean, onSelectMatch?: (match: any) => void }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const dynamicSlides = useMemo(() => {
        const soccerMatches = Array.isArray(matches) ? matches.filter(m => m.sport?.toLowerCase().includes('futbol') || m.sport?.toLowerCase().includes('soccer')) : [];

        // Try to find API premium matches
        let premiumMatches = soccerMatches.filter(m => 
            isPremium(m.league) && 
            findBestLogoMatch(m.home) !== null && 
            findBestLogoMatch(m.away) !== null
        ).sort((a, b) => {
            const scoreA = getMatchPriorityScore(a.home, a.away) + (a.league.toUpperCase().includes('SÜPER LİG') ? 1000 : 0) + (a.league.toUpperCase().includes('CHAMPIONS') ? 500 : 0);
            const scoreB = getMatchPriorityScore(b.home, b.away) + (b.league.toUpperCase().includes('SÜPER LİG') ? 1000 : 0) + (b.league.toUpperCase().includes('CHAMPIONS') ? 500 : 0);
            return scoreB - scoreA;
        });

        const slides = [];

        // 1. Coupon Slide (Top 3 Matches)
        const couponMatches = premiumMatches.slice(0, 3);
        if (couponMatches.length === 3) {
            slides.push({
                type: 'coupon',
                matches: couponMatches,
                id: 'coupon_slide_1'
            });
        }

        // 2. Individual Premium Matches
        for (const m of premiumMatches) {
            if (slides.length >= 6) break;
            let theme = 'premium';
            const l = (m.league || '').toUpperCase();
            if (l.includes('CHAMPIONS') || l.includes('ŞAMPİYONLAR')) theme = 'cl';
            else if (l.includes('EUROPA') || l.includes('AVRUPA')) theme = 'el';
            else if (l.includes('SUPER LIG') || l.includes('SÜPER LİG')) theme = 'tr';
            else if (m.home?.includes('FENERBAH') || m.away?.includes('FENERBAH')) theme = 'fener';

            slides.push({
                type: 'match',
                data: { match: m, home: m.home, away: m.away, homeOdd: m.homeOdd, drawOdd: m.drawOdd, awayOdd: m.awayOdd, dateStr: m.matchDate || 'BUGÜN', timeStr: m.startTime || '20:00', isLive: m.isLive, score: m.score, minute: m.minute, sport: m.sport || 'soccer' },
                theme,
                name: m.league || 'GÜNÜN MAÇI',
                id: m.id
            });
        }

        return slides;
    }, [matches]);

    const staticSlideCount = 3;
    const totalSlides = dynamicSlides.length > 0 ? dynamicSlides.length + staticSlideCount : staticSlideCount;

    useEffect(() => {
        if (totalSlides === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 8000);
        return () => clearInterval(timer);
    }, [totalSlides]);

    if (totalSlides === 0) return null;

    const getTransform = () => {
        return `translateX(-${currentSlide * 100}%)`;
    };

    return (
        <div className="w-full relative group/slider mb-4">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;0,800;0,900;1,800;1,900&display=swap');
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                @keyframes slowPan { 0% { transform: scale(1.05) translate3d(0, 0, 0); } 100% { transform: scale(1.15) translate3d(-2%, -1%, 0); } }
                @keyframes pulseGlow { 0%, 100% { opacity: 0.6; filter: blur(30px) scale(1); } 50% { opacity: 1; filter: blur(45px) scale(1.1); } }
                @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                @keyframes shine { 0% { left: -150%; } 100% { left: 150%; } }
                .animate-slow-pan { animation: slowPan 20s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite alternate; will-change: transform; }
                .animate-pulse-glow { animation: pulseGlow 5s ease-in-out infinite; will-change: transform, opacity; }
                .animate-gradient-move { background-size: 200% 200%; animation: gradientMove 3s ease infinite; }
                .animate-shine-loop { animation: shine 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                .vertical-text { writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); }
                .premium-text-gradient { background: linear-gradient(135deg, #ffffff 0%, #d4d4d8 50%, #71717a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .title-gradient-white { background: linear-gradient(to bottom, #ffffff 0%, #d1d5db 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .title-gradient-cyan { background: linear-gradient(to bottom, [#00E5FF] 0%, #008899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .hud-stripes { background: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0, 255, 135, 0.03) 5px, rgba(0, 255, 135, 0.03) 10px); }
            `}</style>

            <div className={`overflow-hidden rounded-xl relative w-full ${compact ? 'h-[180px] sm:h-[200px] md:h-[220px]' : 'h-[220px] sm:h-[240px] md:h-[280px]'} bg-[#050505] shadow-2xl cursor-pointer font-montserrat`}>
                
                <div className="w-full h-full flex transition-transform duration-700 ease-in-out" style={{ transform: getTransform() }}>
                    
                    {/* DYNAMIC LEAGUE MATCHES & COUPONS */}
                    {dynamicSlides.map((slide, i) => {
                        if (slide.type === 'coupon') {
                            return null;
                        }
                        return <MatchSlide key={slide.id || i} matchData={slide.data} theme={slide.theme} leagueName={slide.name} compact={compact} onSelectMatch={onSelectMatch} />
                    })}

                    {/* ================= STATIC SLIDES ================= */}
                    <div className="w-full h-full flex-shrink-0 relative overflow-hidden bg-[#0a0f1d]">
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-cyan-900/10 flex items-center justify-center border-r border-white/5 z-20 backdrop-blur-sm">
                            <span className="vertical-text text-[10px] font-black text-cyan-400/30 tracking-[0.3em] uppercase">724BETS PARTNERS</span>
                        </div>
                        <div className="absolute top-0 right-0 w-[85%] md:w-[65%] h-full z-[2] overflow-hidden" style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)' }}>
                            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 mix-blend-screen animate-slow-pan" alt="Esports" />
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,15,29,0.8)_100%)] pointer-events-none"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1d] via-[#0a0f1d]/70 to-cyan-900/10 mix-blend-multiply"></div>
                        </div>
                        <div className="absolute inset-0 z-10 flex flex-col justify-center px-12 md:px-16">
                            <div>
                                <div className="inline-flex items-center gap-2 mb-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-2.5 py-1 rounded-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_[#00E5FF]]"></div>
                                    <span className="text-[#00E5FF] font-bold text-[9px] md:text-[10px] tracking-[0.25em] uppercase">GLOBAL PARTNERSHIP</span>
                                </div>
                                <h2 className={`font-black leading-[0.9] tracking-[-0.03em] italic uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] mb-2 ${compact ? 'text-[24px] sm:text-[30px] md:text-[36px]' : 'text-[28px] sm:text-[38px] md:text-[48px]'}`}>
                                    <span className="title-gradient-white">SYNAPSE</span> <br className="hidden sm:block"/>
                                    <span className="title-gradient-cyan">ESPORTS</span>
                                </h2>
                                <div className="border-l-[3px] border-[#00E5FF]/50 pl-3 md:pl-4 mt-2">
                                    <p className="text-gray-300 text-[11px] sm:text-[12px] md:text-[13px] max-w-[280px] sm:max-w-[350px] md:max-w-[420px] font-medium leading-snug tracking-wide">
                                        724bets is proud to be the official global betting partner of Synapse Esports. Bet on all major tournaments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-full flex-shrink-0 relative overflow-hidden bg-[#0b0e11]">
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#00E5FF]/5 flex items-center justify-center border-r border-white/5 z-20 backdrop-blur-sm">
                            <span className="vertical-text text-[10px] font-black text-[#00E5FF]/30 tracking-[0.3em] uppercase">YENİ ÖZELLİK</span>
                        </div>
                        <div className="absolute top-0 right-0 w-[85%] md:w-[65%] h-full z-[2] overflow-hidden" style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)' }}>
                            <img src="https://images.unsplash.com/photo-1508344928928-7137b29de218?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 mix-blend-screen animate-slow-pan" alt="Stadium Lights" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e11] via-[#0b0e11]/80 to-[#00E5FF]/10 mix-blend-multiply"></div>
                        </div>
                        <div className="absolute inset-0 z-10 flex items-center px-12 md:px-16">
                            <div className="w-full md:w-[60%] flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 mb-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-2.5 py-1 rounded-sm w-fit">
                                    <span className="text-[#00E5FF] font-bold text-[9px] md:text-[10px] tracking-[0.25em] uppercase">ANINDA NAKİT</span>
                                </div>
                                <h2 className={`font-black leading-[0.9] tracking-[-0.03em] italic uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] mb-2 ${compact ? 'text-[24px] sm:text-[30px] md:text-[36px]' : 'text-[28px] sm:text-[38px] md:text-[48px]'}`}>
                                    <span className="title-gradient-white">ERKEN</span> <br className="hidden sm:block"/>
                                    <span className="text-zinc-300">ÖDEME</span>
                                </h2>
                                <div className="border-l-[3px] border-white/20 pl-3 md:pl-4 mt-2">
                                    <p className="text-gray-300 text-[11px] sm:text-[12px] md:text-[13px] max-w-[280px] font-medium leading-snug tracking-wide">
                                        Takımınız <strong className="text-white font-bold">2 GOL</strong> öne geçtiği an kuponunuz kazanır.
                                    </p>
                                </div>
                            </div>
                            <div className="hidden md:flex w-[40%] h-full items-center justify-end pr-8">
                                <div className="relative flex items-center">
                                    <div className="text-[90px] leading-none font-black premium-text-gradient italic relative z-10 select-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">+2</div>
                                    <div className="ml-4 flex flex-col">
                                        <div className="w-8 h-[3px] bg-white/40 mb-1.5 shadow-[0_0_8px_rgba(255,255,255,0.2)]"></div>
                                        <div className="text-white font-black text-[14px] tracking-[0.4em] uppercase leading-none">GOL</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-full flex-shrink-0 relative overflow-hidden bg-[#050b14]">
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-cyan-900/10 flex items-center justify-center border-r border-[#00E5FF]/10 z-20 backdrop-blur-sm">
                            <span className="vertical-text text-[10px] font-black text-[#00E5FF]/30 tracking-[0.3em] uppercase">HAFTANIN PROMOSU</span>
                        </div>
                        <div className="absolute top-0 right-0 w-[85%] md:w-[65%] h-full z-[2] overflow-hidden" style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)' }}>
                            <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 mix-blend-screen animate-slow-pan" alt="Football pitch" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#050b14] via-[#050b14]/80 to-cyan-900/40 mix-blend-multiply"></div>
                        </div>
                        <div className="absolute inset-0 z-10 flex items-center px-12 md:px-16">
                            <div className="w-full md:w-[60%] flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 mb-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-2.5 py-1 rounded-sm w-fit">
                                    <span className="text-[#00E5FF] font-bold text-[9px] md:text-[10px] tracking-[0.25em] uppercase">VİP KAZANÇ</span>
                                </div>
                                <h2 className={`font-black leading-[0.9] tracking-[-0.03em] italic uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] mb-2 ${compact ? 'text-[24px] sm:text-[30px] md:text-[36px]' : 'text-[28px] sm:text-[38px] md:text-[48px]'}`}>
                                    <span className="title-gradient-white">KAZANCINI</span> <br className="hidden sm:block"/>
                                    <span className="title-gradient-cyan">İKİYE KATLA</span>
                                </h2>
                                <div className="border-l-[3px] border-[#00E5FF]/50 pl-3 md:pl-4 mt-2">
                                    <p className="text-gray-300 text-[11px] sm:text-[12px] md:text-[13px] max-w-[280px] sm:max-w-[350px] font-medium leading-snug tracking-wide">
                                        Favori takımınıza bahis yapın, maçı <strong className="text-[#00E5FF] font-bold">2 gol farkla</strong> kazanırsanız, net kazancınızı anında 2'ye katlayalım!
                                    </p>
                                </div>
                            </div>
                            <div className="hidden md:flex w-[40%] h-full items-center justify-end pr-8">
                                <div className="relative flex items-center">
                                    <div className="text-[90px] leading-none font-black premium-text-gradient italic relative z-10 select-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">2X</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                
                {/* Hover Arrows */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-[20]">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides); }}
                        className="w-8 h-8 rounded-full bg-black/60 border border-white/20 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setCurrentSlide((prev) => (prev + 1) % totalSlides); }}
                        className="w-8 h-8 rounded-full bg-black/60 border border-white/20 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
