import React from 'react';
import { MatchInfo } from './types';
import { Radio, Globe, Star, PlayCircle, Trophy, BarChart3, TrendingUp, MonitorPlay } from 'lucide-react';
import { TeamLogoPlaceholder } from './TeamLogoPlaceholder';
import { PlayerLogo } from './PlayerLogo';
import { useLanguage } from '../../contexts/LanguageContext';
import { useBetSlip } from '../../contexts/BetSlipContext';

interface RainbetMatchCardProps {
    match: MatchInfo;
    onSelect?: (match: MatchInfo) => void;
}

export const RainbetMatchCard: React.FC<RainbetMatchCardProps> = ({ match, onSelect }) => {
    const { language } = useLanguage();
    const { addSelection, betSlip } = useBetSlip();

    const cleanLeagueName = (league: string) => {
        if (!league) return '';
        const parts = league.split('-').map(p => p.trim());
        const uniqueParts = parts.filter((item, pos) => parts.indexOf(item) === pos);
        return uniqueParts.join(' • ');
    };
    
    // Format odds
    const ms1 = parseFloat(match.homeOdd || '0').toFixed(2) || '0.00';
    const msx = parseFloat(match.drawOdd || '0').toFixed(2) || '0.00';
    const ms2 = parseFloat(match.awayOdd || '0').toFixed(2) || '0.00';

    const handleOddClick = (e: React.MouseEvent, selectionName: string, oddId: string, oddValue: string) => {
        e.stopPropagation();
        const oddNum = parseFloat(oddValue);
        if (isNaN(oddNum) || oddNum <= 0) return;
        
        addSelection({
            id: oddId,
            matchId: match.id,
            matchName: `${match.home} vs ${match.away}`,
            selectionName: selectionName,
            odd: oddNum
        });
    };

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

    return (
        <div 
            onClick={() => onSelect && onSelect(match)}
            className="bg-[#18191c] rounded-xl border border-white/5 p-3 hover:border-purple-500/30 hover:bg-[#1c1d22] transition-colors duration-200 cursor-pointer flex flex-col relative overflow-hidden group"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-medium max-w-[70%]">
                    <Globe className="w-3 h-3 opacity-60 flex-shrink-0" />
                    <span className="truncate">{cleanLeagueName(match.league)}</span>
                </div>
                <Star className="w-3.5 h-3.5 text-[#42475e] hover:text-white transition-colors flex-shrink-0" />
            </div>

            {/* Status */}
            <div className="flex justify-between items-center mb-2.5">
                <div className="text-[#3b82f6] text-[12px] font-bold flex items-center gap-1.5">
                    {match.isLive ? `${match.minute || '1'}' 1. Devre` : (match.startTime || 'Bugün')}
                </div>
                {match.isLive && (
                    <Radio className="w-3.5 h-3.5 text-[#ef4444] animate-pulse" />
                )}
            </div>

            {/* Teams & Scores */}
            <div className="flex flex-col gap-2 mb-4 flex-1">
                <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
                    <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                        <PlayerLogo name={match.home} fallbackLogo={match.homeLogo} sport={match.sport} />
                    </div>
                    <span className="text-[#e2e8f0] font-medium text-[13px] truncate">{match.home}</span>
                    {match.isLive && <span className="text-[#e2e8f0] font-bold text-[13px] bg-white/5 text-white px-2 py-0.5 rounded min-w-[28px] text-center">{homeScore}</span>}
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
                    <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                        <PlayerLogo name={match.away} fallbackLogo={match.awayLogo} sport={match.sport} />
                    </div>
                    <span className="text-[#e2e8f0] font-medium text-[13px] truncate">{match.away}</span>
                    {match.isLive && <span className="text-[#e2e8f0] font-bold text-[13px] bg-white/5 text-white px-2 py-0.5 rounded min-w-[28px] text-center">{awayScore}</span>}
                </div>
            </div>

            {/* Odds */}
            <div className="flex gap-1.5 mt-auto pt-2">
                <button 
                    onClick={(e) => handleOddClick(e, 'MS 1', match.homeId || `${match.id}_1`, ms1)}
                    className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-md transition-colors duration-200 group/odd ${
                        betSlip.some(s => s.id === (match.homeId || `${match.id}_1`))
                            ? 'bg-[#10b981] text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            : 'bg-[#2a2e38] hover:bg-[#323642] text-white'
                    }`}
                >
                    <span className={`text-[10px] font-semibold mb-0.5 transition-colors ${betSlip.some(s => s.id === (match.homeId || `${match.id}_1`)) ? 'text-black/70' : 'text-[#8e939d]'}`}>1</span>
                    <span className={`text-[13px] font-bold transition-colors ${betSlip.some(s => s.id === (match.homeId || `${match.id}_1`)) ? 'text-black' : 'text-white'}`}>{ms1 !== '0.00' ? ms1 : '-'}</span>
                </button>
                <button 
                    onClick={(e) => handleOddClick(e, 'MS X', match.drawId || `${match.id}_X`, msx)}
                    className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-md transition-colors duration-200 group/odd ${
                        betSlip.some(s => s.id === (match.drawId || `${match.id}_X`))
                            ? 'bg-[#10b981] text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            : 'bg-[#2a2e38] hover:bg-[#323642] text-white'
                    }`}
                >
                    <span className={`text-[10px] font-semibold mb-0.5 transition-colors ${betSlip.some(s => s.id === (match.drawId || `${match.id}_X`)) ? 'text-black/70' : 'text-[#8e939d]'}`}>X</span>
                    <span className={`text-[13px] font-bold transition-colors ${betSlip.some(s => s.id === (match.drawId || `${match.id}_X`)) ? 'text-black' : 'text-white'}`}>{msx !== '0.00' ? msx : '-'}</span>
                </button>
                <button 
                    onClick={(e) => handleOddClick(e, 'MS 2', match.awayId || `${match.id}_2`, ms2)}
                    className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-md transition-colors duration-200 group/odd ${
                        betSlip.some(s => s.id === (match.awayId || `${match.id}_2`))
                            ? 'bg-[#10b981] text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            : 'bg-[#2a2e38] hover:bg-[#323642] text-white'
                    }`}
                >
                    <span className={`text-[10px] font-semibold mb-0.5 transition-colors ${betSlip.some(s => s.id === (match.awayId || `${match.id}_2`)) ? 'text-black/70' : 'text-[#8e939d]'}`}>2</span>
                    <span className={`text-[13px] font-bold transition-colors ${betSlip.some(s => s.id === (match.awayId || `${match.id}_2`)) ? 'text-black' : 'text-white'}`}>{ms2 !== '0.00' ? ms2 : '-'}</span>
                </button>
            </div>
        </div>
    );
};
