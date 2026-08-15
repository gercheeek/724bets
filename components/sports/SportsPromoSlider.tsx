import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBetting } from '../../contexts/BettingContext';
import { PlayerLogo, findBestLogoMatch } from './PlayerLogo';
import { AnimatedOdd } from '../AnimatedOdd';
import { LiveTimer } from './MatchCard';

function MatchSlide({ matchData, theme, leagueName, compact = false, onSelectMatch }: { matchData: any, theme: 'fener'|'cl'|'el'|'conf'|'tr', leagueName: string, compact?: boolean, onSelectMatch?: (match: any) => void }) {
    const { toggleBetSelection } = useBetting();
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
        'conf': {
            bgFrom: 'from-[#061a12]', bgVia: 'via-[#0b2c1f]', bgTo: 'to-[#04120a]',
            blob1: 'bg-[#10b981]', blob2: 'bg-[#059669]',
            badgeBg: 'bg-[#10b981]',
            leagueColor: 'text-[#10b981]',
            bgLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/UEFA_Europa_Conference_League_logo.svg'
        },
        'tr': {
            bgFrom: 'from-[#1a0606]', bgVia: 'via-[#2c0b0b]', bgTo: 'to-[#120404]',
            blob1: 'bg-[#ef4444]', blob2: 'bg-[#dc2626]',
            badgeBg: 'bg-[#ef4444]',
            leagueColor: 'text-[#ef4444]',
            bgLogo: 'https://upload.wikimedia.org/wikipedia/tr/9/90/Trendyol_S%C3%BCper_Lig_Logo.png'
        }
    };
    
    const t = themes[theme] || themes['fener'];

    return (
        <div 
            className="w-full h-full flex-shrink-0 relative overflow-hidden bg-[#0a0f1c] cursor-pointer"
            onClick={() => {
                if (onSelectMatch) {
                    onSelectMatch(matchData.match);
                } else {
                    toggleBetSelection(matchData.match, 'Maç Sonucu', matchData.home, parseFloat(matchData.homeOdd));
                }
            }}
        >
            {/* PREMIUM BACKGROUND WITH GRID & GLOW */}
            <div className="absolute inset-0 z-0">
                <div className={`absolute inset-0 bg-gradient-to-br ${t.bgFrom} ${t.bgVia} ${t.bgTo}`}></div>
                
                {/* GIANT BLURRED TOURNAMENT LOGO */}
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
            
            <div className="absolute inset-0 z-10 flex px-3 md:px-10 h-full pt-2 md:pt-4">
                {/* LEFT SIDE: Odds Typography */}
                <div className="w-[35%] md:w-[35%] flex flex-col justify-center gap-1.5 md:gap-3 h-full pb-2 md:pb-4">
                    {/* Home */}
                    <div className="flex flex-col cursor-pointer hover:opacity-80" onClick={(e) => { e.stopPropagation(); toggleBetSelection(matchData.match, 'Maç Sonucu', matchData.home, parseFloat(matchData.homeOdd)) }}>
                        <span className={`text-gray-300 font-bold uppercase tracking-widest leading-none mb-0.5 truncate max-w-[100px] md:max-w-[150px] drop-shadow-md ${compact ? 'text-[8px] md:text-[10px]' : 'text-[8px] md:text-[12px] md:mb-1'}`}>{matchData.home}</span>
                        <div className="flex items-center gap-1 md:gap-2">
                            <span className={`text-white font-black leading-none drop-shadow-md ${compact ? 'text-[16px] md:text-[24px]' : 'text-[18px] md:text-[38px]'}`}><AnimatedOdd value={matchData.homeOdd} /></span>
                        </div>
                    </div>
                    {/* Draw */}
                    <div className="flex flex-col cursor-pointer hover:opacity-80" onClick={(e) => { e.stopPropagation(); toggleBetSelection(matchData.match, 'Maç Sonucu', 'Beraberlik', parseFloat(matchData.drawOdd)) }}>
                        <span className={`text-gray-400 font-bold uppercase tracking-widest leading-none mb-0.5 drop-shadow-md ${compact ? 'text-[8px] md:text-[10px]' : 'text-[8px] md:text-[12px] md:mb-1'}`}>BERABERE</span>
                        <div className="flex items-center gap-1 md:gap-2">
                            <span className={`text-white font-black leading-none drop-shadow-md ${compact ? 'text-[16px] md:text-[24px]' : 'text-[18px] md:text-[38px]'}`}><AnimatedOdd value={matchData.drawOdd} /></span>
                        </div>
                    </div>
                    {/* Away */}
                    <div className="flex flex-col cursor-pointer hover:opacity-80" onClick={(e) => { e.stopPropagation(); toggleBetSelection(matchData.match, 'Maç Sonucu', matchData.away, parseFloat(matchData.awayOdd)) }}>
                        <span className={`text-gray-300 font-bold uppercase tracking-widest leading-none mb-0.5 truncate max-w-[100px] md:max-w-[150px] drop-shadow-md ${compact ? 'text-[8px] md:text-[10px]' : 'text-[8px] md:text-[12px] md:mb-1'}`}>{matchData.away}</span>
                        <div className="flex items-center gap-1 md:gap-2">
                            <span className={`text-white font-black leading-none drop-shadow-md ${compact ? 'text-[16px] md:text-[24px]' : 'text-[18px] md:text-[38px]'}`}><AnimatedOdd value={matchData.awayOdd} /></span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Premium Logos & Date Composition */}
                <div className="w-[65%] md:w-[65%] flex items-center justify-center relative h-full pr-2 md:pr-8">
                    <div className="w-full h-full flex flex-col items-center justify-center relative gap-1 md:gap-5">
                        {(matchData.isLive || matchData.match?.isLive) ? (
                            <div className="flex items-center gap-1.5 md:gap-3 bg-black/60 backdrop-blur-md border border-[#ef4444]/30 rounded-full px-3 md:px-5 py-1 md:py-1.5 shadow-[0_0_20px_rgba(239,68,68,0.3)] z-40 mt-1 md:mt-2 scale-90 md:scale-100">
                                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#ef4444] shadow-[0_0_10px_#ef4444] animate-pulse"></div>
                                <span className="text-white font-bold text-[10px] md:text-[14px] tracking-widest uppercase text-[#ef4444]">
                                    <LiveTimer minute={matchData.minute || matchData.match?.minute} />
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 md:gap-3 bg-[#030712]/80 backdrop-blur-xl border border-white/10 rounded-full px-3 md:px-5 py-1 md:py-1.5 shadow-[inset_0_1px_rgba(255,255,255,0.1),_0_8px_20px_rgba(0,0,0,0.8)] z-40 mt-1 md:mt-2 scale-90 md:scale-100">
                                <div className="relative flex items-center justify-center mr-0.5 md:mr-1">
                                    <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${t.badgeBg} animate-ping opacity-60 absolute`}></div>
                                    <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${t.badgeBg} shadow-[0_0_10px_${t.badgeBg}] relative z-10`}></div>
                                </div>
                                <span className="text-zinc-200 font-bold text-[9px] md:text-[13px] tracking-[0.2em] uppercase">{matchData.dateStr}</span>
                                <div className="w-[1px] h-3 md:h-4 bg-white/20 mx-0.5 md:mx-1"></div>
                                <span className={`${t.leagueColor} font-black text-[10px] md:text-[14px] tracking-[0.1em]`}>{matchData.timeStr}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-center w-full relative z-20">
                            <div className={`flex flex-col items-center ${compact ? 'w-[70px] md:w-[120px]' : 'w-[80px] md:w-[180px]'}`}>
                                <div className={`relative z-20 hover:scale-110 transition-transform duration-500 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] ${compact ? 'w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24' : 'w-14 h-14 md:w-28 md:h-28 lg:w-36 lg:h-36'}`}>
                                    <div className={`absolute inset-0 ${t.badgeBg} opacity-20 blur-[10px] md:blur-[20px] rounded-full mix-blend-screen`}></div>
                                    <PlayerLogo name={matchData.home} fallbackLogo="" sport={matchData.sport} />
                                </div>
                                <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-full px-2 md:px-4 py-0.5 md:py-1.5 mt-1 md:mt-3 shadow-lg w-[120%] md:w-auto">
                                    <span className="text-white font-bold text-[6px] md:text-[11px] uppercase tracking-widest text-center truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90 block">
                                        {matchData.home}
                                    </span>
                                </div>
                            </div>
                            <div className="mx-1 md:mx-6 z-30 flex flex-col items-center justify-center relative min-w-[40px] md:min-w-[80px]">
                                {(matchData.isLive || matchData.match?.isLive) ? (
                                    <div className={`text-white font-black tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] whitespace-nowrap ${compact ? 'text-[20px] md:text-[32px]' : 'text-[22px] md:text-[44px]'}`}>
                                        {matchData.score || matchData.match?.score || '0 - 0'}
                                    </div>
                                ) : (
                                    <div className="w-7 h-7 md:w-14 md:h-14 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-lg md:rounded-2xl border border-white/30 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.8)] rotate-45 relative overflow-hidden">
                                        <div className={`absolute inset-0 bg-gradient-to-tr ${t.bgFrom} to-transparent opacity-60`}></div>
                                        <span className="text-white font-black text-[10px] md:text-[20px] italic -rotate-45 block transform drop-shadow-lg relative z-10">VS</span>
                                    </div>
                                )}
                            </div>
                            <div className={`flex flex-col items-center ${compact ? 'w-[70px] md:w-[120px]' : 'w-[80px] md:w-[180px]'}`}>
                                <div className={`relative z-20 hover:scale-110 transition-transform duration-500 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] ${compact ? 'w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24' : 'w-14 h-14 md:w-28 md:h-28 lg:w-36 lg:h-36'}`}>
                                    <div className={`absolute inset-0 ${t.badgeBg} opacity-20 blur-[10px] md:blur-[20px] rounded-full mix-blend-screen`}></div>
                                    <PlayerLogo name={matchData.away} fallbackLogo="" sport={matchData.sport} />
                                </div>
                                <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-full px-2 md:px-4 py-0.5 md:py-1.5 mt-1 md:mt-3 shadow-lg w-[120%] md:w-auto">
                                    <span className="text-white font-bold text-[6px] md:text-[11px] uppercase tracking-widest text-center truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90 block">
                                        {matchData.away}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="z-40 mb-0 md:mb-2 mt-1 md:mt-0">
                            <span className={`${t.leagueColor} font-bold text-[8px] md:text-[13px] tracking-[0.4em] uppercase opacity-90 drop-shadow-md`}>{leagueName}</span>
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
        if (!matches || matches.length === 0) return [];
        const slides = [];

        const fenerMatch = matches.find((m: any) => {
            const h = (m.home || '').toUpperCase();
            const a = (m.away || '').toUpperCase();
            return (h.includes('FENERBAH') || a.includes('FENERBAH'));
        });
        if (fenerMatch) {
            slides.push({
                data: { match: fenerMatch, home: fenerMatch.home, away: fenerMatch.away, homeOdd: fenerMatch.homeOdd, drawOdd: fenerMatch.drawOdd, awayOdd: fenerMatch.awayOdd, dateStr: fenerMatch.matchDate || 'BUGÜN', timeStr: fenerMatch.startTime || '20:00', isLive: fenerMatch.isLive, score: fenerMatch.score, minute: fenerMatch.minute },
                theme: 'fener', name: 'TÜRK TAKIMLARI ÖZEL', id: fenerMatch.id
            });
        }

        const clMatch = matches.find((m: any) => {
            const l = (m.league || '').toUpperCase();
            return (l.includes('CHAMPIONS') || l.includes('ŞAMPİYONLAR') || l.includes('SAMPIYONLAR')) && m.id !== fenerMatch?.id;
        });
        if (clMatch) {
            slides.push({
                data: {
                    match: clMatch,
                    home: clMatch.home, away: clMatch.away,
                    homeOdd: clMatch.homeOdd, drawOdd: clMatch.drawOdd, awayOdd: clMatch.awayOdd,
                    dateStr: clMatch.matchDate || 'BUGÜN', timeStr: clMatch.startTime || '20:00',
                    isLive: clMatch.isLive, score: clMatch.score, minute: clMatch.minute
                },
                theme: 'cl', name: 'ŞAMPİYONLAR LİGİ', id: clMatch.id
            });
        }

        // 3. EUROPA LEAGUE
        const elMatch = matches.find((m: any) => {
            const l = (m.league || '').toUpperCase();
            return (l.includes('EUROPA') || l.includes('AVRUPA LİGİ') || l.includes('AVRUPA LIGI')) && !l.includes('KONFERANS') && !l.includes('CONFERENCE') && m.id !== fenerMatch?.id && m.id !== clMatch?.id;
        });
        if (elMatch) {
            slides.push({
                data: {
                    match: elMatch,
                    home: elMatch.home, away: elMatch.away,
                    homeOdd: elMatch.homeOdd, drawOdd: elMatch.drawOdd, awayOdd: elMatch.awayOdd,
                    dateStr: elMatch.matchDate || 'BUGÜN', timeStr: elMatch.startTime || '20:00',
                    isLive: elMatch.isLive, score: elMatch.score, minute: elMatch.minute
                },
                theme: 'el', name: 'AVRUPA LİGİ', id: elMatch.id
            });
        }

        // 4. SUPER LIG
        const trMatch = matches.find((m: any) => {
            const l = (m.league || '').toUpperCase();
            return (l.includes('SUPER LIG') || l.includes('SÜPER LİG')) && m.id !== fenerMatch?.id && m.id !== clMatch?.id && m.id !== elMatch?.id;
        });
        if (trMatch) {
            slides.push({
                data: {
                    match: trMatch,
                    home: trMatch.home, away: trMatch.away,
                    homeOdd: trMatch.homeOdd, drawOdd: trMatch.drawOdd, awayOdd: trMatch.awayOdd,
                    dateStr: trMatch.matchDate || 'BUGÜN', timeStr: trMatch.startTime || '20:00',
                    isLive: trMatch.isLive, score: trMatch.score, minute: trMatch.minute
                },
                theme: 'tr', name: 'SÜPER LİG', id: trMatch.id
            });
        }

        // 5. Fill remaining slots up to 5 with top matches
        const existingIds = new Set(slides.map(s => s.id));
        for (const m of matches) {
            if (slides.length >= 5) break;
            if (!existingIds.has(m.id)) {
                slides.push({
                    data: {
                        match: m,
                        home: m.home, away: m.away,
                        homeOdd: m.homeOdd, drawOdd: m.drawOdd, awayOdd: m.awayOdd,
                        dateStr: m.matchDate || 'BUGÜN', timeStr: m.startTime || '20:00',
                        isLive: m.isLive, score: m.score, minute: m.minute
                    },
                    theme: 'fener', // fallback theme
                    name: 'GÜNÜN ÖNE ÇIKAN MAÇI', 
                    id: m.id
                });
                existingIds.add(m.id);
            }
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
                .animate-slow-pan { animation: slowPan 20s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite alternate; will-change: transform; }
                .animate-pulse-glow { animation: pulseGlow 5s ease-in-out infinite; will-change: transform, opacity; }
                .vertical-text { writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); }
                .premium-text-gradient { background: linear-gradient(135deg, #ffffff 0%, #d4d4d8 50%, #71717a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .title-gradient-white { background: linear-gradient(to bottom, #ffffff 0%, #d1d5db 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .title-gradient-cyan { background: linear-gradient(to bottom, #00E5FF 0%, #008899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            `}</style>

            <div className={`overflow-hidden rounded-xl relative w-full ${compact ? 'h-[120px] sm:h-[135px] md:h-[150px]' : 'h-[190px] sm:h-[220px] md:h-[250px]'} bg-[#050505] shadow-2xl cursor-pointer font-montserrat`}>
                
                <div className="w-full h-full flex transition-transform duration-700 ease-in-out" style={{ transform: getTransform() }}>
                    
                    {/* DYNAMIC LEAGUE MATCHES */}
                    {dynamicSlides.map((slide, i) => (
                        <MatchSlide key={slide.id || i} matchData={slide.data} theme={slide.theme} leagueName={slide.name} compact={compact} onSelectMatch={onSelectMatch} />
                    ))}

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
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"></div>
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
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-emerald-500/5 flex items-center justify-center border-r border-white/5 z-20 backdrop-blur-sm">
                            <span className="vertical-text text-[10px] font-black text-emerald-500/30 tracking-[0.3em] uppercase">YENİ ÖZELLİK</span>
                        </div>
                        <div className="absolute top-0 right-0 w-[85%] md:w-[65%] h-full z-[2] overflow-hidden" style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)' }}>
                            <img src="https://images.unsplash.com/photo-1508344928928-7137b29de218?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 mix-blend-screen animate-slow-pan" alt="Stadium Lights" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e11] via-[#0b0e11]/80 to-emerald-900/10 mix-blend-multiply"></div>
                        </div>
                        <div className="absolute inset-0 z-10 flex items-center px-12 md:px-16">
                            <div className="w-full md:w-[60%] flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 mb-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-sm w-fit">
                                    <span className="text-emerald-400 font-bold text-[9px] md:text-[10px] tracking-[0.25em] uppercase">ANINDA NAKİT</span>
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
