import React, { useState, useEffect } from 'react';
import { Flame, Activity, ChevronRight } from 'lucide-react';
import { useBetting } from '../contexts/BettingContext';
import { useLanguage } from '../contexts/LanguageContext';

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
            
            if (data.scores && Array.isArray(data.scores)) {
                const currentScore = data.scores.find((s: string) => s.startsWith('current|'));
                if (currentScore) {
                    const parts = currentScore.split('|');
                    if (parts.length >= 4) {
                        score = `${parts[2]} - ${parts[3]}`;
                    }
                } else if (data.current_score) {
                    score = String(data.current_score || '').replace(':', ' - ');
                }
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
            
            const rawMarkets = data.group_markets?.['full_event|0'] || data.group_markets?.['game_full_event|0'] || data.group_markets?.['set|1'];
            const markets = Array.isArray(rawMarkets) ? rawMarkets : [];
            
            for (const market of markets) {
                const is1x2 = market.includes('|12|') || market.includes('|1x2|') || market.includes('|match_winner|');
                if (is1x2 && (market.includes('~home~') || market.includes('~away~'))) {
                    const parts = market.split('|');
                    const selectionsPart = parts.find((p: string) => p.includes('~home~') || p.includes('~away~'));
                    if (selectionsPart) {
                        const selections = selectionsPart.split('!');
                        selections.forEach((sel: string) => {
                            const sParts = sel.split('~');
                            if (sParts.length > 2) {
                                const type = sParts[1].toLowerCase();
                                const odd = parseFloat(sParts[2]);
                                if (!isNaN(odd)) {
                                    if (type === 'home' || type === '1') { homeOdd = odd.toFixed(2); }
                                    if (type === 'draw' || type === 'x') { drawOdd = odd.toFixed(2); }
                                    if (type === 'away' || type === '2') { awayOdd = odd.toFixed(2); }
                                }
                            }
                        });
                        if (homeOdd !== '-' || awayOdd !== '-') {
                            break; // Found valid odds
                        }
                    }
                }
            }

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
                awayOdd
            });
        });
        
        // Show only the top 6 most relevant matches (live ones first)
        const sorted = parsedMatches.sort((a, b) => (a.isUpcoming === b.isUpcoming ? 0 : a.isUpcoming ? 1 : -1));
        setMatches(sorted.slice(0, 6));

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
                        className="relative rounded-xl overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-300"
                        style={{ 
                            background: '#0a0f16', 
                            border: '1px solid rgba(255,255,255,0.03)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div className="relative z-10 p-4">
                            {/* Top row */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <Activity className="w-3.5 h-3.5" />
                                    <span className="text-[11px] font-bold truncate max-w-[140px]">{match.league}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-[11px] font-bold ${match.isUpcoming ? 'text-gray-400' : 'text-red-500'}`}>{match.time}</span>
                                    {!match.isUpcoming && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    )}
                                </div>
                            </div>
                            
                            {/* Teams & Score */}
                            <div className="flex items-center justify-between px-2 mb-4">
                                <div className="flex flex-col items-center gap-2 w-[80px]">
                                    <div 
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-lg"
                                        style={{ backgroundColor: match.home.color }}
                                    >
                                        {match.home.code}
                                    </div>
                                    <span className="text-[12px] font-bold text-white text-center leading-tight truncate w-full">{match.home.name}</span>
                                </div>
                                
                                <div className="flex flex-col items-center justify-center">
                                    <div className="text-[20px] font-black text-white tracking-widest">{match.score}</div>
                                    <div className="text-[10px] text-gray-500 font-bold mt-1">1X2</div>
                                </div>
                                
                                <div className="flex flex-col items-center gap-2 w-[80px]">
                                    <div 
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-lg"
                                        style={{ backgroundColor: match.away.color }}
                                    >
                                        {match.away.code}
                                    </div>
                                    <span className="text-[12px] font-bold text-white text-center leading-tight truncate w-full">{match.away.name}</span>
                                </div>
                            </div>
                            
                            {/* Odds Buttons */}
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <button className="bg-[#1a202c] hover:bg-[#2d3748] transition-colors border border-white/5 rounded-lg py-2 flex items-center justify-center gap-1.5 text-gray-400">
                                    <span className="text-[11px] font-bold text-gray-500">1</span>
                                    <span className="text-[12px] font-black">{match.homeOdd}</span>
                                </button>
                                <button className="bg-[#1a202c] hover:bg-[#2d3748] transition-colors border border-white/5 rounded-lg py-2 flex items-center justify-center gap-1.5 text-gray-400">
                                    <span className="text-[11px] font-bold text-gray-500">Draw</span>
                                    <span className="text-[12px] font-black">{match.drawOdd}</span>
                                </button>
                                <button className="bg-[#1a202c] hover:bg-[#2d3748] transition-colors border border-white/5 rounded-lg py-2 flex items-center justify-center gap-1.5 text-gray-400">
                                    <span className="text-[11px] font-bold text-gray-500">2</span>
                                    <span className="text-[12px] font-black">{match.awayOdd}</span>
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
