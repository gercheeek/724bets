import React, { useState, useEffect } from 'react';
import { Flame, Activity, ChevronRight } from 'lucide-react';
import { AnimatedOdd } from './AnimatedOdd';
import { useBetting } from '../contexts/BettingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PlayerLogo, hasKnownLogo } from './sports/PlayerLogo';

interface PopularLiveWidgetProps {
    onNavigate: (view: string) => void;
}

const mapCountryName = (name: string, lang: string) => {
  if (!name) return '';
  const norm = name.toLowerCase();
  if (norm.includes('turkey') || norm.includes('türkiye')) return lang === 'tr' ? 'Türkiye' : 'Turkey';
  if (norm.includes('germany') || norm.includes('almanya')) return lang === 'tr' ? 'Almanya' : 'Germany';
  if (norm.includes('england') || norm.includes('ingiltere')) return lang === 'tr' ? 'İngiltere' : 'England';
  if (norm.includes('spain') || norm.includes('ispanya')) return lang === 'tr' ? 'İspanya' : 'Spain';
  if (norm.includes('italy') || norm.includes('italya')) return lang === 'tr' ? 'İtalya' : 'Italy';
  if (norm.includes('france') || norm.includes('fransa')) return lang === 'tr' ? 'Fransa' : 'France';
  if (norm.includes('international') || norm.includes('uluslararası')) return lang === 'tr' ? 'Uluslararası' : 'International';
  return name;
};

const getTeamColor = (name: string) => {
    const colors = ["#3B82F6", "#10B981", "#F97316", "#8B5CF6", "#0EA5E9", "#EF4444", "#F59E0B"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

export const PopularLiveWidget: React.FC<PopularLiveWidgetProps> = ({ onNavigate }) => {
    const { events } = useBetting();
    const { language } = useLanguage();
    const [matches, setMatches] = useState<any[]>([]);

    useEffect(() => {
        if (!events || events.length === 0) return;

        const parsedMatches: any[] = [];
        events.forEach((ev: any) => {
            const data = ev.data;
            if (!data || !data.participants) return;
            
            const homeTeam = data.participants.home || 'Ev Sahibi';
            const awayTeam = data.participants.away || 'Deplasman';
            
            let score = '-';
            let minute = 'Yakında';
            let isFinished = data.status === 'finished' || data.status === 'ended' || data.status === 'closed';
            let isLive = data.status === 'in_progress' || data.is_live_betting === true || isFinished;
            
            if (data.score && typeof data.score === 'string') {
                score = data.score;
            }
            if (data.scores && Array.isArray(data.scores)) {
                const currentScore = data.scores.find((s: string) => s.startsWith('current|'));
                if (currentScore) {
                    const parts = currentScore.split('|');
                    if (parts.length >= 4) {
                        score = `${parts[2]} - ${parts[3]}`;
                    }
                }
            }
            
            if (score === '-' && data.current_score) {
                score = String(data.current_score || '').replace(':', ' - ');
            }
            if (isFinished) {
                minute = language === 'tr' ? 'Bitti' : 'FT';
            } else if (data.minute) {
                minute = `${data.minute}'`;
            } else if (data.extended_status) {
                minute = String(data.extended_status || '').replace('s', '. Set');
            }
            
            const countryName = mapCountryName(data.country?.name, language);
            const tournamentName = data.tournament?.name || 'Turnuva';
            const league = countryName ? `${countryName} - ${tournamentName}` : tournamentName;
            
            let homeOdd = '-';
            let drawOdd = '-';
            let awayOdd = '-';
            
            const rawGroupMarkets = data.group_markets || ev.group_markets;
            const rawMarkets = rawGroupMarkets?.['full_event|0'] || rawGroupMarkets?.['game_full_event|0'] || rawGroupMarkets?.['set|1'];
            const markets = Array.isArray(rawMarkets) ? rawMarkets : [];
            
            for (const market of markets) {
                if (!market || typeof market !== 'string') continue;
                const is1x2 = market.includes('|12|') || market.includes('|1x2|') || market.includes('|match_winner|');
                if (is1x2 && (market.includes('~home~') || market.includes('~away~') || market.includes('~1~') || market.includes('~2~'))) {
                    const parts = market.split('|');
                    const selectionsPart = parts.find((p: string) => p.includes('~home~') || p.includes('~away~') || p.includes('~1~') || p.includes('~2~'));
                    if (selectionsPart) {
                        const selections = selectionsPart.split('!');
                        selections.forEach((sel: string) => {
                            const sParts = sel.split('~');
                            if (sParts.length > 2) {
                                const type = sParts[1].toLowerCase();
                                let odd = parseFloat(sParts[2]);
                                if (!isNaN(odd)) {
                                    if (odd < 0) odd = Math.abs(odd);
                                    if (odd < 1) odd += 1;
                                    if (odd < 1.01) odd = 1.01;
                                    const oddStr = odd.toFixed(2);
                                    if (type === 'home' || type === '1') { homeOdd = oddStr; }
                                    if (type === 'draw' || type === 'x') { drawOdd = oddStr; }
                                    if (type === 'away' || type === '2') { awayOdd = oddStr; }
                                }
                            }
                        });
                        if (homeOdd !== '-' || awayOdd !== '-') {
                            break;
                        }
                    }
                }
            }

            let priority = 0;
            const hl = homeTeam.toLowerCase();
            const al = awayTeam.toLowerCase();
            const lg = league.toLowerCase();
            const isTurkish = hl.includes('galatasaray') || hl.includes('fenerbah') || hl.includes('beşiktaş') || hl.includes('besiktas') || hl.includes('trabzon') || lg.includes('türkiye') || lg.includes('turkey') || lg.includes('super lig') || lg.includes('süper');
            const isMajor = lg.includes('champions') || lg.includes('premier') || lg.includes('la liga') || lg.includes('serie a') || lg.includes('bundesliga') || hl.includes('real madrid') || hl.includes('barcelona') || hl.includes('bayern') || hl.includes('city') || hl.includes('arsenal') || hl.includes('liverpool') || hl.includes('milan') || hl.includes('inter') || hl.includes('chelsea');

            if (isTurkish) priority += 100;
            if (isMajor) priority += 50;
            if (isLive) priority += 1000;

            if (homeOdd !== '-' || awayOdd !== '-') {
                // Strictly require logos for the Popular Live Widget (Main Page)
                const hasLogos = hasKnownLogo(hl) && hasKnownLogo(al);
                
                if (hasLogos) {
                    parsedMatches.push({
                        id: ev.id,
                        league,
                        time: minute,
                        home: { name: homeTeam, code: homeTeam.substring(0, 2).toUpperCase(), color: getTeamColor(homeTeam) },
                        away: { name: awayTeam, code: awayTeam.substring(0, 2).toUpperCase(), color: getTeamColor(awayTeam) },
                        score,
                        isUpcoming: !isLive,
                        homeOdd,
                        drawOdd,
                        awayOdd,
                        priority,
                        sport: data.sport?.name || ev.sport_name || '',
                        info: data.info || {}
                    });
                }
            }
        });
        
        // Prioritize Turkish/Major teams and Live matches
        const sorted = parsedMatches.sort((a, b) => b.priority - a.priority);
        
        // Remove duplicates by ID (sometimes swarm sends multiple events for the same match)
        const uniqueMatches = Array.from(new Map(sorted.map(m => [m.id, m])).values());
        
        setMatches(uniqueMatches.slice(0, 6));

    }, [events, language]);

    if (matches.length === 0) return null;

    return (
        <div className="w-full mb-8">
            <div className="flex items-center gap-2 mb-4 px-1">
                <Flame className="w-5 h-5 text-emerald-400" />
                <h2 className="text-[17px] font-bold text-white tracking-wide">Popüler Canlı</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((match, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => onNavigate('sports')}
                        className="relative rounded-2xl overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-500 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 hover:shadow-[0_8px_32px_0_rgba(16,185,129,0.15)] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]"
                    >
                        {/* Shimmer/Reflection Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.05] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -translate-x-full group-hover:translate-x-full" style={{ transition: 'all 1.5s ease' }} />
                        
                        <div className="relative z-10 p-4">
                            {/* Top row */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-1.5 text-zinc-300">
                                    <Activity className="w-3.5 h-3.5 text-emerald-400/70" />
                                    <span className="text-[11px] font-bold truncate max-w-[140px] tracking-wide">{match.league}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-black/30 px-2 py-0.5 rounded-full border border-white/5 backdrop-blur-md">
                                    <span className={`text-[10px] font-bold ${match.isUpcoming ? 'text-zinc-400' : 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]'}`}>{match.time}</span>
                                    {!match.isUpcoming && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    )}
                                </div>
                            </div>
                            
                            {/* Teams & Score */}
                            <div className="flex items-center justify-between px-2 mb-4 relative">
                                {/* Soft glow behind score */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="flex flex-col items-center gap-2 w-[80px] z-10">
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
                                        <PlayerLogo name={match.home.name} fallbackLogo="" sport={match.sport} />
                                    </div>
                                    <span className="text-[12px] font-bold text-zinc-100 text-center leading-tight truncate w-full drop-shadow-sm">{match.home.name}</span>
                                </div>
                                
                                <div className="flex flex-col items-center justify-center z-10">
                                    <div className="text-[22px] font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">{match.score}</div>
                                    <div className="text-[9px] text-zinc-500 font-bold mt-0.5 tracking-[0.2em]">1X2</div>
                                </div>
                                
                                <div className="flex flex-col items-center gap-2 w-[80px] z-10">
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
                                        <PlayerLogo name={match.away.name} fallbackLogo="" sport={match.sport} />
                                    </div>
                                    <span className="text-[12px] font-bold text-zinc-100 text-center leading-tight truncate w-full drop-shadow-sm">{match.away.name}</span>
                                </div>
                            </div>
                            
                            {/* Odds Buttons */}
                            <div className="grid grid-cols-3 gap-2 mt-5">
                                <button className="bg-black/40 hover:bg-emerald-500/10 transition-colors duration-300 border border-white/10 hover:border-emerald-500/50 rounded-xl py-2 flex flex-col items-center justify-center gap-0.5 backdrop-blur-md group/btn">
                                    <span className="text-[10px] font-medium text-zinc-500 group-hover/btn:text-emerald-400/80 transition-colors">1</span>
                                    <div className="text-zinc-200 group-hover/btn:text-white font-bold"><AnimatedOdd value={match.homeOdd} /></div>
                                </button>
                                <button className="bg-black/40 hover:bg-emerald-500/10 transition-colors duration-300 border border-white/10 hover:border-emerald-500/50 rounded-xl py-2 flex flex-col items-center justify-center gap-0.5 backdrop-blur-md group/btn">
                                    <span className="text-[10px] font-medium text-zinc-500 group-hover/btn:text-emerald-400/80 transition-colors">X</span>
                                    <div className="text-zinc-200 group-hover/btn:text-white font-bold"><AnimatedOdd value={match.drawOdd} /></div>
                                </button>
                                <button className="bg-black/40 hover:bg-emerald-500/10 transition-colors duration-300 border border-white/10 hover:border-emerald-500/50 rounded-xl py-2 flex flex-col items-center justify-center gap-0.5 backdrop-blur-md group/btn">
                                    <span className="text-[10px] font-medium text-zinc-500 group-hover/btn:text-emerald-400/80 transition-colors">2</span>
                                    <div className="text-zinc-200 group-hover/btn:text-white font-bold"><AnimatedOdd value={match.awayOdd} /></div>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View More Button */}
            <div className="flex justify-center mt-6">
                <button 
                    onClick={() => onNavigate('sports')}
                    className="flex items-center gap-2 bg-[#1a202c] hover:bg-[#2d3748] border border-white/10 text-gray-300 hover:text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all group"
                >
                    Daha Fazlası
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};
