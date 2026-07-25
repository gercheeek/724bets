import React from 'react';
import { MatchInfo } from './types';
import { Star, Radio, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface RainbetMatchCardProps {
    match: MatchInfo;
    onSelect?: (match: MatchInfo) => void;
}

export const RainbetMatchCard = ({ match, onSelect }: RainbetMatchCardProps) => {
    const { language } = useLanguage();
    
    // Parse score
    let homeScore = '0';
    let awayScore = '0';
    
    if (match.score && match.score.includes('-')) {
        const parts = match.score.split('-');
        homeScore = parts[0].trim();
        awayScore = parts[1].trim();
    } else if (match.score && match.score.includes(':')) {
        const parts = match.score.split(':');
        homeScore = parts[0].trim();
        awayScore = parts[1].trim();
    }

    const fallbackLogo = 'https://www.tarafbet114.com/assets/images/sports/soccer.png';

    return (
        <div 
            onClick={() => onSelect && onSelect(match)}
            className="bg-[#18191c] rounded-xl border border-white/5 p-3 hover:border-purple-500/30 hover:bg-[#1c1d22] transition-colors duration-200 cursor-pointer flex flex-col relative overflow-hidden group"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5 text-[#8e939d] text-[11px] font-medium tracking-wide truncate">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate">{match.country || 'Uluslararası'} • {match.league}</span>
                </div>
                <Star className="w-3.5 h-3.5 text-[#42475e] hover:text-white transition-colors flex-shrink-0" />
            </div>

            {/* Status */}
            <div className="flex justify-between items-center mb-2.5">
                <div className="text-[#3b82f6] text-[12px] font-bold flex items-center gap-1.5">
                    {match.isLive ? `${match.minute || '1'}' 1. Devre` : (match.startTime || 'Bugün')}
                </div>
                {match.isLive && (
                    <Radio className="w-3.5 h-3.5 text-[#ef4444]" />
                )}
            </div>

            {/* Teams & Scores */}
            <div className="space-y-2 mb-4 flex-1">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <img 
                            src={match.homeLogo || fallbackLogo} 
                            alt="" 
                            className="w-4 h-4 object-contain" 
                            onError={(e) => { (e.target as HTMLImageElement).src = fallbackLogo; }} 
                        />
                        <span className="text-[#e2e8f0] font-medium text-[13px] truncate">{match.home}</span>
                    </div>
                    {match.isLive && <span className="text-[#e2e8f0] font-bold text-[13px] bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)] px-2 py-0.5 rounded flex-shrink-0">{homeScore}</span>}
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <img 
                            src={match.awayLogo || fallbackLogo} 
                            alt="" 
                            className="w-4 h-4 object-contain" 
                            onError={(e) => { (e.target as HTMLImageElement).src = fallbackLogo; }} 
                        />
                        <span className="text-[#e2e8f0] font-medium text-[13px] truncate">{match.away}</span>
                    </div>
                    {match.isLive && <span className="text-[#e2e8f0] font-bold text-[13px] bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)] px-2 py-0.5 rounded flex-shrink-0">{awayScore}</span>}
                </div>
            </div>

            {/* Odds */}
            <div className="text-[10px] text-[#8e939d] font-semibold mb-1">
                1x2
            </div>
            <div className="flex gap-1.5 mt-auto">
                <div className="flex-1 flex justify-between items-center bg-[#25262b] border border-white/5 hover:border-[#10b981]/50 hover:bg-[#10b981]/10 px-2.5 py-1.5 rounded-lg transition-colors duration-200 text-white text-[12px] font-medium cursor-pointer group/odd">
                    <span className="text-[#8e939d] group-hover/odd:text-white transition-colors">1</span>
                    <span className="group-hover/odd:text-[#10b981] transition-colors font-bold">{match.homeOdd}</span>
                </div>
                {match.drawOdd && match.drawOdd !== '0.00' && (
                    <div className="flex-1 flex justify-between items-center bg-[#25262b] border border-white/5 hover:border-[#10b981]/50 hover:bg-[#10b981]/10 px-2.5 py-1.5 rounded-lg transition-colors duration-200 text-white text-[12px] font-medium cursor-pointer group/odd">
                        <span className="text-[#8e939d] group-hover/odd:text-white transition-colors">X</span>
                        <span className="group-hover/odd:text-[#10b981] transition-colors font-bold">{match.drawOdd}</span>
                    </div>
                )}
                <div className="flex-1 flex justify-between items-center bg-[#25262b] border border-white/5 hover:border-[#10b981]/50 hover:bg-[#10b981]/10 px-2.5 py-1.5 rounded-lg transition-colors duration-200 text-white text-[12px] font-medium cursor-pointer group/odd">
                    <span className="text-[#8e939d] group-hover/odd:text-white transition-colors">2</span>
                    <span className="group-hover/odd:text-[#10b981] transition-colors font-bold">{match.awayOdd}</span>
                </div>
            </div>
        </div>
    );
};
