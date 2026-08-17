import React from 'react';
import { MatchInfo } from './types';
import { useLanguage } from '../../contexts/LanguageContext';
import { PlaySquare } from 'lucide-react';
import { PlayerLogo } from './PlayerLogo';

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
            className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-transparent hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-b-0 cursor-pointer group"
        >
            {/* Left side: Date and Teams */}
            <div className="flex flex-col mb-4 md:mb-0 md:w-1/2">
                <div className="text-xs font-semibold mb-3">
                    {(match.isLive || (match.minute && match.minute !== "Live'" && match.minute !== "Bugün")) ? (
                        <span className="text-[#00E5FF] animate-pulse">{match.minute || 'Live'}</span>
                    ) : (
                        <span className="text-zinc-500">{formattedDate}</span>
                    )}
                </div>
                
                <div className="flex flex-col gap-2.5">
                    {/* Home Team */}
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 shrink-0 flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] transition-all">
                            <PlayerLogo name={homeTeam} fallbackLogo={match.homeLogo} sport={match.sport} />
                        </div>
                        <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{homeTeam}</span>
                        {match.score && <span className="ml-auto text-sm font-black text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]">{match.score.split('-')[0]?.trim()}</span>}
                    </div>
                    {/* Away Team */}
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 shrink-0 flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] transition-all">
                            <PlayerLogo name={awayTeam} fallbackLogo={match.awayLogo} sport={match.sport} />
                        </div>
                        <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{awayTeam}</span>
                        {match.score && <span className="ml-auto text-sm font-black text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]">{match.score.split('-')[1]?.trim()}</span>}
                    </div>
                </div>
            </div>

            {/* Right side: Odds */}
            <div className="flex flex-col md:w-1/2 relative">
                {/* 1x2 Header and Tracker Icon */}
                <div className="flex justify-between items-center mb-2 px-2 absolute -top-8 right-0 md:static md:mb-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-600 md:mx-auto">1x2</span>
                    <button className="text-zinc-500 hover:text-[#00E5FF] transition-colors md:absolute md:right-0">
                        <PlaySquare className="w-4 h-4" />
                    </button>
                </div>
                
                {/* Odds Buttons */}
                <div className="flex gap-2 w-full mt-1">
                    <button className="flex-1 flex flex-col items-center justify-center bg-[#050505] border border-white/5 hover:bg-[#0A0D14] hover:border-[#00E5FF]/30 hover:shadow-[inset_0_0_12px_rgba(0,229,255,0.1),0_0_10px_rgba(0,229,255,0.1)] rounded-md py-2 transition-all duration-300 group/btn overflow-hidden">
                        <span className="text-[10px] text-zinc-500 font-bold mb-0.5">1</span>
                        <span className="text-[13px] text-white font-black group-hover/btn:text-[#00E5FF] transition-colors">{ms1}</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center justify-center bg-[#050505] border border-white/5 hover:bg-[#0A0D14] hover:border-[#00E5FF]/30 hover:shadow-[inset_0_0_12px_rgba(0,229,255,0.1),0_0_10px_rgba(0,229,255,0.1)] rounded-md py-2 transition-all duration-300 group/btn overflow-hidden mx-1">
                        <span className="text-[10px] text-zinc-500 font-bold mb-0.5">X</span>
                        <span className="text-[13px] text-white font-black group-hover/btn:text-[#00E5FF] transition-colors">{msx}</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center justify-center bg-[#050505] border border-white/5 hover:bg-[#0A0D14] hover:border-[#00E5FF]/30 hover:shadow-[inset_0_0_12px_rgba(0,229,255,0.1),0_0_10px_rgba(0,229,255,0.1)] rounded-md py-2 transition-all duration-300 group/btn overflow-hidden">
                        <span className="text-[10px] text-zinc-500 font-bold mb-0.5">2</span>
                        <span className="text-[13px] text-white font-black group-hover/btn:text-[#00E5FF] transition-colors">{ms2}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
