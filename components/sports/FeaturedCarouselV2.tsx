import React, { useRef } from 'react';
import { MatchInfo } from './types';
import { TeamLogoPlaceholder } from './TeamLogoPlaceholder';
import { useLanguage } from '../../contexts/LanguageContext';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { Globe } from 'lucide-react';

interface FeaturedCarouselV2Props {
    matches: MatchInfo[];
    onSelectMatch?: (match: MatchInfo) => void;
}

export const FeaturedCarouselV2: React.FC<FeaturedCarouselV2Props> = ({ matches, onSelectMatch }) => {
    const { language } = useLanguage();
    const { addSelection, betSlip } = useBetSlip();
    const scrollRef = useRef<HTMLDivElement>(null);

    const cleanLeagueName = (league: string) => {
        if (!league) return '';
        const parts = league.split('-').map(p => p.trim());
        const uniqueParts = parts.filter((item, pos) => parts.indexOf(item) === pos);
        return uniqueParts.join(' • ');
    };

    const featuredMatches = matches.slice(0, 5);

    const handleOddClick = (e: React.MouseEvent, match: MatchInfo, selectionName: string, oddId: string, oddValue: string) => {
        e.stopPropagation();
        const oddNum = parseFloat(oddValue);
        if (isNaN(oddNum) || oddNum <= 0) return;
        
        addSelection({
            id: oddId,
            matchId: match.id,
            matchName: `${match.home || 'Ev Sahibi'} vs ${match.away || 'Deplasman'}`,
            selectionName: selectionName,
            odd: oddNum
        });
    };

    if (featuredMatches.length === 0) return null;

    return (
        <div className="w-full py-4 px-4 md:px-6">
            <div 
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            >
                {featuredMatches.map((match, idx) => {
                    const homeTeam = match.home || 'Ev Sahibi';
                    const awayTeam = match.away || 'Deplasman';

                    const ms1 = parseFloat(match.homeOdd || '0').toFixed(2) || '0.00';
                    const msx = parseFloat(match.drawOdd || '0').toFixed(2) || '0.00';
                    const ms2 = parseFloat(match.awayOdd || '0').toFixed(2) || '0.00';
                    
                    return (
                        <div 
                            key={match.id}
                            onClick={() => onSelectMatch?.(match)}
                            className="flex-shrink-0 w-[90vw] sm:w-[320px] bg-gradient-to-br from-[#1c2230] to-[#12141a] rounded-xl overflow-hidden snap-center cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-300 p-4 flex flex-col justify-between shadow-lg relative group"
                        >
                            {/* Subtle Background Glow for Live Matches */}
                            {match.isLive && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-16 bg-red-500/10 blur-[30px] pointer-events-none transition-opacity opacity-50 group-hover:opacity-100"></div>
                            )}

                            {/* Top Header */}
                            <div className="flex items-center gap-1.5 mb-4 text-[#8e939d] text-[10px] font-bold tracking-widest uppercase relative z-10">
                                <Globe className="w-3 h-3 text-[#3b82f6]" />
                                <span className="truncate flex-1">{cleanLeagueName(match.league)}</span>
                                {match.isLive ? (
                                    <div className="flex items-center gap-1.5 bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20 shadow-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                        <span>{match.liveTime || 'CANLI'}</span>
                                    </div>
                                ) : (
                                    <span className="text-[#e2e8f0] bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                                        {match.startTime}
                                    </span>
                                )}
                            </div>

                            {/* Teams and Score Area */}
                            <div className="flex items-center justify-between mb-5 relative z-10">
                                {/* Home Team */}
                                <div className="flex flex-col items-center w-[35%] gap-1.5">
                                    <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-1 shadow-md">
                                        {match.homeLogo ? (
                                            <img 
                                                src={match.homeLogo} 
                                                alt="" 
                                                className="w-7 h-7 object-contain"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                                            />
                                        ) : (
                                            <TeamLogoPlaceholder teamName={homeTeam} className="w-7 h-7" />
                                        )}
                                    </div>
                                    <span className="text-[#e2e8f0] font-bold text-[11px] text-center leading-tight line-clamp-2">{homeTeam}</span>
                                </div>

                                {/* Center Score / VS */}
                                <div className="flex flex-col items-center justify-center w-[30%]">
                                    {match.isLive ? (
                                        <div className="text-xl font-black text-white tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                                            {match.score || '0 - 0'}
                                        </div>
                                    ) : (
                                        <div className="text-xs font-black text-[#8e939d] italic bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                            VS
                                        </div>
                                    )}
                                </div>

                                {/* Away Team */}
                                <div className="flex flex-col items-center w-[35%] gap-1.5">
                                    <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-1 shadow-md">
                                        {match.awayLogo ? (
                                            <img 
                                                src={match.awayLogo} 
                                                alt="" 
                                                className="w-7 h-7 object-contain"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                                            />
                                        ) : (
                                            <TeamLogoPlaceholder teamName={awayTeam} className="w-7 h-7" />
                                        )}
                                    </div>
                                    <span className="text-[#e2e8f0] font-bold text-[11px] text-center leading-tight line-clamp-2">{awayTeam}</span>
                                </div>
                            </div>

                            {/* Odds */}
                            <div className="relative z-10">
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        onClick={(e) => handleOddClick(e, match, 'MS 1', match.homeId || `${match.id}_1`, ms1)}
                                        className={`flex-1 transition-all duration-200 py-1.5 rounded flex flex-col justify-center items-center gap-0.5 group/odd ${
                                            betSlip.some(s => s.id === (match.homeId || `${match.id}_1`))
                                                ? 'bg-[#10b981] text-black shadow-[0_0_10px_rgba(16,185,129,0.3)] scale-105'
                                                : 'bg-[#1a1f2c] hover:bg-[#252b3b] border border-transparent hover:border-white/5 text-white'
                                        }`}
                                    >
                                        <span className={`text-[9px] font-medium uppercase tracking-wider transition-colors ${betSlip.some(s => s.id === (match.homeId || `${match.id}_1`)) ? 'text-black/70' : 'text-[#8e939d]'}`}>1</span>
                                        <span className={`text-[13px] font-bold transition-colors ${betSlip.some(s => s.id === (match.homeId || `${match.id}_1`)) ? 'text-black' : 'text-white'}`}>{ms1 !== '0.00' ? ms1 : '-'}</span>
                                    </button>
                                    <button 
                                        onClick={(e) => handleOddClick(e, match, 'MS X', match.drawId || `${match.id}_X`, msx)}
                                        className={`flex-1 transition-all duration-200 py-1.5 rounded flex flex-col justify-center items-center gap-0.5 group/odd ${
                                            betSlip.some(s => s.id === (match.drawId || `${match.id}_X`))
                                                ? 'bg-[#10b981] text-black shadow-[0_0_10px_rgba(16,185,129,0.3)] scale-105'
                                                : 'bg-[#1a1f2c] hover:bg-[#252b3b] border border-transparent hover:border-white/5 text-white'
                                        }`}
                                    >
                                        <span className={`text-[9px] font-medium uppercase tracking-wider transition-colors ${betSlip.some(s => s.id === (match.drawId || `${match.id}_X`)) ? 'text-black/70' : 'text-[#8e939d]'}`}>X</span>
                                        <span className={`text-[13px] font-bold transition-colors ${betSlip.some(s => s.id === (match.drawId || `${match.id}_X`)) ? 'text-black' : 'text-white'}`}>{msx !== '0.00' ? msx : '-'}</span>
                                    </button>
                                    <button 
                                        onClick={(e) => handleOddClick(e, match, 'MS 2', match.awayId || `${match.id}_2`, ms2)}
                                        className={`flex-1 transition-all duration-200 py-1.5 rounded flex flex-col justify-center items-center gap-0.5 group/odd ${
                                            betSlip.some(s => s.id === (match.awayId || `${match.id}_2`))
                                                ? 'bg-[#10b981] text-black shadow-[0_0_10px_rgba(16,185,129,0.3)] scale-105'
                                                : 'bg-[#1a1f2c] hover:bg-[#252b3b] border border-transparent hover:border-white/5 text-white'
                                        }`}
                                    >
                                        <span className={`text-[9px] font-medium uppercase tracking-wider transition-colors ${betSlip.some(s => s.id === (match.awayId || `${match.id}_2`)) ? 'text-black/70' : 'text-[#8e939d]'}`}>2</span>
                                        <span className={`text-[13px] font-bold transition-colors ${betSlip.some(s => s.id === (match.awayId || `${match.id}_2`)) ? 'text-black' : 'text-white'}`}>{ms2 !== '0.00' ? ms2 : '-'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
