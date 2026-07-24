import React from 'react';
import { MatchInfo } from './types';
import { MatchCardV2 } from './MatchCardV2';
import { ChevronUp } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface MatchListV2Props {
    leagueName: string;
    matches: MatchInfo[];
    onSelectMatch?: (match: MatchInfo) => void;
}

export const MatchListV2 = ({ leagueName, matches, onSelectMatch }: MatchListV2Props) => {
    const { language } = useLanguage();
    
    if (matches.length === 0) return null;

    return (
        <div className="mb-6 px-4 md:px-6">
            {/* League Header */}
            <div className="flex items-center gap-2 mb-3 cursor-pointer group w-max">
                <span className="text-lg">⚽</span>
                <h3 className="text-white font-bold text-lg">{leagueName}</h3>
                <ChevronUp className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors ml-1" />
            </div>
            
            {/* Matches Container */}
            <div className="bg-[#101114] rounded-xl overflow-hidden border border-[#23273a] shadow-lg">
                {matches.map(match => (
                    <MatchCardV2 
                        key={match.id} 
                        match={match} 
                        onSelect={onSelectMatch} 
                    />
                ))}
                
                {/* See All footer */}
                <div className="p-3 bg-[#18191c]/50 hover:bg-[#18191c] border-t border-[#23273a] text-center cursor-pointer transition-colors">
                    <span className="text-xs font-semibold text-zinc-400">
                        {language === 'tr' ? 'Tümünü Gör' : 'See All'}
                    </span>
                </div>
            </div>
        </div>
    );
};
