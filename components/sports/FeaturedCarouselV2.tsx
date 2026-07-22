import React, { useRef } from 'react';
import { MatchInfo } from './types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface FeaturedCarouselV2Props {
    matches: MatchInfo[];
    onSelectMatch?: (match: MatchInfo) => void;
}

export const FeaturedCarouselV2 = ({ matches, onSelectMatch }: FeaturedCarouselV2Props) => {
    const { language } = useLanguage();
    const scrollRef = useRef<HTMLDivElement>(null);

    const featuredMatches = matches.slice(0, 5);

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
                    const formattedDate = match.isLive ? 'Canlı' : (match.startTime ? `Bugün, ${match.startTime}` : 'Bugün');

                    const ms1 = parseFloat(match.homeOdd || '0').toFixed(2) || '0.00';
                    const msx = parseFloat(match.drawOdd || '0').toFixed(2) || '0.00';
                    const ms2 = parseFloat(match.awayOdd || '0').toFixed(2) || '0.00';
                    
                    const fallbackLogo = 'https://www.tarafbet114.com/assets/images/sports/soccer.png';

                    return (
                        <div 
                            key={match.id} 
                            onClick={() => onSelectMatch?.(match)}
                            className="flex-shrink-0 w-[85vw] sm:w-[320px] bg-[#1a1d29] rounded-lg overflow-hidden snap-center cursor-pointer border border-[#23273a] hover:border-[#2f3448] transition-colors p-4 flex flex-col justify-between"
                        >
                            {/* Top Header */}
                            <div className="flex justify-between items-center text-[#8e939d] font-medium text-[11px] mb-4">
                                <div className="flex items-center gap-1.5 truncate">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span className="truncate uppercase tracking-wider">{match.country || 'Uluslararası'} • {match.league}</span>
                                </div>
                                <div className="flex-shrink-0 ml-2">
                                    {formattedDate}
                                </div>
                            </div>

                            {/* Teams */}
                            <div className="flex flex-col gap-3 mb-5">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={match.homeLogo || fallbackLogo} 
                                        alt="" 
                                        className="w-5 h-5 object-contain" 
                                        onError={(e) => { (e.target as HTMLImageElement).src = fallbackLogo; }} 
                                    />
                                    <span className="text-[#e2e8f0] font-bold text-[14px] truncate">{homeTeam}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={match.awayLogo || fallbackLogo} 
                                        alt="" 
                                        className="w-5 h-5 object-contain" 
                                        onError={(e) => { (e.target as HTMLImageElement).src = fallbackLogo; }} 
                                    />
                                    <span className="text-[#e2e8f0] font-bold text-[14px] truncate">{awayTeam}</span>
                                </div>
                            </div>

                            {/* Odds */}
                            <div>
                                <div className="text-[#8e939d] text-[11px] font-medium mb-2 uppercase tracking-wide">
                                    {language === 'tr' ? 'Kazanan (Uzatlamalar Dahil)' : 'Winner (Incl. Overtime)'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="flex-1 bg-[#23273a] hover:bg-[#2f3448] transition-colors py-2 px-3 rounded flex justify-between items-center">
                                        <span className="text-[#8e939d] text-[12px] font-bold">1</span>
                                        <span className="text-white text-[13px] font-bold">{ms1}</span>
                                    </button>
                                    {match.drawOdd && match.drawOdd !== '0.00' && (
                                        <button className="flex-1 bg-[#23273a] hover:bg-[#2f3448] transition-colors py-2 px-3 rounded flex justify-between items-center">
                                            <span className="text-[#8e939d] text-[12px] font-bold">X</span>
                                            <span className="text-white text-[13px] font-bold">{msx}</span>
                                        </button>
                                    )}
                                    <button className="flex-1 bg-[#23273a] hover:bg-[#2f3448] transition-colors py-2 px-3 rounded flex justify-between items-center">
                                        <span className="text-[#8e939d] text-[12px] font-bold">2</span>
                                        <span className="text-white text-[13px] font-bold">{ms2}</span>
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
