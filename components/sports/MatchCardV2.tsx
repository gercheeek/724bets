import React from 'react';
import { MatchInfo } from './types';
import { useLanguage } from '../../contexts/LanguageContext';
import { PlaySquare } from 'lucide-react';

interface MatchCardV2Props {
    match: MatchInfo;
    onSelect?: (match: MatchInfo) => void;
}

export const MatchCardV2 = ({ match, onSelect }: MatchCardV2Props) => {
    const { language } = useLanguage();
    const homeTeam = match.home || 'Ev Sahibi';
    const awayTeam = match.away || 'Deplasman';
    const formattedDate = `${match.matchDate || match.fullDate || ''} ${match.startTime || ''}`;

    const ms1 = parseFloat(match.homeOdd || '0').toFixed(2) || '0.00';
    const msx = parseFloat(match.drawOdd || '0').toFixed(2) || '0.00';
    const ms2 = parseFloat(match.awayOdd || '0').toFixed(2) || '0.00';

    return (
        <div 
            onClick={() => onSelect?.(match)}
            className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#101114] hover:bg-[#18191c] transition-colors border-b border-[#23273a] last:border-b-0 cursor-pointer group"
        >
            {/* Left side: Date and Teams */}
            <div className="flex flex-col mb-4 md:mb-0 md:w-1/2">
                <div className="text-xs font-semibold mb-3">
                    {(match.isLive || (match.minute && match.minute !== "Live'" && match.minute !== "Bugün")) ? (
                        <span className="text-[#10b981] animate-pulse">{match.minute || 'Live'}</span>
                    ) : (
                        <span className="text-zinc-500">{formattedDate}</span>
                    )}
                </div>
                
                <div className="flex flex-col gap-2.5">
                    {/* Home Team */}
                    <div className="flex items-center gap-3">
                        {match.homeLogo ? (
                            <img src={match.homeLogo} alt={homeTeam} className="w-5 h-5 object-contain" />
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-white/50 border border-zinc-700">
                                {homeTeam.substring(0, 1)}
                            </div>
                        )}
                        <span className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">{homeTeam}</span>
                        {match.score && <span className="ml-auto text-sm font-bold text-[#a981ff]">{match.score.split('-')[0]?.trim()}</span>}
                    </div>
                    {/* Away Team */}
                    <div className="flex items-center gap-3">
                        {match.awayLogo ? (
                            <img src={match.awayLogo} alt={awayTeam} className="w-5 h-5 object-contain" />
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-white/50 border border-zinc-700">
                                {awayTeam.substring(0, 1)}
                            </div>
                        )}
                        <span className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">{awayTeam}</span>
                        {match.score && <span className="ml-auto text-sm font-bold text-[#a981ff]">{match.score.split('-')[1]?.trim()}</span>}
                    </div>
                </div>
            </div>

            {/* Right side: Odds */}
            <div className="flex flex-col md:w-1/2 relative">
                {/* 1x2 Header and Tracker Icon */}
                <div className="flex justify-between items-center mb-2 px-2 absolute -top-8 right-0 md:static md:mb-2">
                    <span className="text-[11px] font-semibold text-zinc-500 md:mx-auto">1x2</span>
                    <button className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors md:absolute md:right-0">
                        <PlaySquare className="w-4 h-4" />
                    </button>
                </div>
                
                {/* Odds Buttons */}
                <div className="flex gap-2 w-full">
                    <button className="flex-1 flex flex-col items-center justify-center bg-[#18191c] hover:bg-[#25262b] border border-[#23273a] rounded-lg py-2 transition-colors">
                        <span className="text-[10px] text-zinc-400 font-semibold mb-0.5">1</span>
                        <span className="text-sm text-white font-bold">{ms1}</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center justify-center bg-[#18191c] hover:bg-[#25262b] border border-[#23273a] rounded-lg py-2 transition-colors mx-1">
                        <span className="text-[10px] text-zinc-400 font-semibold mb-0.5">X</span>
                        <span className="text-sm text-white font-bold">{msx}</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center justify-center bg-[#18191c] hover:bg-[#25262b] border border-[#23273a] rounded-lg py-2 transition-colors">
                        <span className="text-[10px] text-zinc-400 font-semibold mb-0.5">2</span>
                        <span className="text-sm text-white font-bold">{ms2}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
