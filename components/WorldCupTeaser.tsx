import React from 'react';
import { Star, BarChart2, MessageCircle, ChevronLeft, ChevronRight, Globe, Dribbble } from 'lucide-react';

interface WorldCupTeaserProps {
  onMatchClick: (matchId: string) => void;
}

const WorldCupTeaser: React.FC<WorldCupTeaserProps> = ({ onMatchClick }) => {
  return (
    <div className="w-full bg-[#1A1C24] rounded-xl overflow-hidden shadow-xl group my-6 font-sans">
      {/* HEADER */}
      <div className="bg-[#242632] px-4 py-3 flex items-center justify-between text-[#A0A5BB] text-[13px] font-medium border-b border-[#2C2F3D]">
        <div className="flex items-center gap-2">
          <Dribbble size={16} className="text-[#A0A5BB]" />
          <span>Futbol</span>
          <span className="text-[#454A62]">/</span>
          <Globe size={16} className="text-blue-500" />
          <span>Dünya</span>
          <span className="text-[#454A62]">/</span>
          <span className="text-[#D1D5DB]">Dünya Kupası 2026</span>
        </div>
        <div className="flex items-center gap-3">
          <Star size={18} className="text-[#A0A5BB] hover:text-white" />
          <ChevronUpIcon />
        </div>
      </div>

      {/* TABS */}
      <div className="bg-[#1D1F2A] px-2 py-2 flex items-center gap-1 overflow-x-auto border-b border-[#2C2F3D] hide-scrollbar">
        <button className="bg-[#12141A] text-white px-4 py-1.5 rounded-md text-[13px] font-bold shrink-0">
          ÖNE ÇIKANLAR
        </button>
        <button className="text-[#A0A5BB] hover:text-white px-4 py-1.5 rounded-md text-[13px] font-medium shrink-0">Maçlar</button>
        <button className="text-[#A0A5BB] hover:text-white px-4 py-1.5 rounded-md text-[13px] font-medium shrink-0">Kazananlar</button>
        <button className="text-[#A0A5BB] hover:text-white px-4 py-1.5 rounded-md text-[13px] font-medium shrink-0">Takımlar</button>
        <button className="text-[#A0A5BB] hover:text-white px-4 py-1.5 rounded-md text-[13px] font-medium shrink-0">Sıralamalar</button>
        <button className="text-[#A0A5BB] hover:text-white px-4 py-1.5 rounded-md text-[13px] font-medium shrink-0">Playoff</button>
      </div>

      <div className="p-4 sm:p-6 bg-[#181A22]">
        
        {/* MATCHES SLIDER */}
        <div className="mb-8">
          <h3 className="text-white font-bold text-lg mb-4">Maçlar</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {/* GAMDOM STYLE MATCH CARDS */}
            {[
              { id: 'm1', date: '12 Tem 0:00', home: { name: 'Norway', flag: 'no' }, away: { name: 'England', flag: 'gb-eng' }, odds: { '1': '4.05', 'X': '3.75', '2': '1.95' } },
              { id: 'm2', date: '12 Tem 4:00', home: { name: 'Argentina', flag: 'ar' }, away: { name: 'Switzerland', flag: 'ch' }, odds: { '1': '1.70', 'X': '3.60', '2': '5.90' }, selectedIndex: 0 },
              { id: 'm3', date: '14 Tem 22:00', home: { name: 'France', flag: 'fr' }, away: { name: 'Spain', flag: 'es' }, odds: { '1': '2.35', 'X': '3.30', '2': '3.30' } },
            ].map((match) => (
              <div 
                key={match.id}
                onClick={() => onMatchClick(match.id)}
                className="bg-[#15171d] rounded-2xl p-4 min-w-[260px] sm:min-w-[280px] shrink-0 border border-white/5 cursor-pointer hover:bg-[#1a1c24] transition-colors relative"
              >
                {/* Date Top Right */}
                <div className="absolute top-4 right-4 text-zinc-400 text-[11px] font-semibold">
                  {match.date}
                </div>

                {/* Teams */}
                <div className="flex flex-col gap-3 mt-1 mb-5">
                  <div className="flex items-center gap-3">
                    <img src={`https://flagcdn.com/w40/${match.home.flag}.png`} alt={match.home.name} className="w-6 h-6 rounded-full object-cover shadow-sm" />
                    <span className="text-white font-bold text-sm">{match.home.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={`https://flagcdn.com/w40/${match.away.flag}.png`} alt={match.away.name} className="w-6 h-6 rounded-full object-cover shadow-sm" />
                    <span className="text-white font-bold text-sm">{match.away.name}</span>
                  </div>
                </div>

                {/* Odds Buttons */}
                <div className="flex items-center gap-2">
                  <div className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg ${match.selectedIndex === 0 ? 'bg-[#00FFA3] text-black' : 'bg-[#0F1219] hover:bg-white/5 text-white'}`}>
                    <span className={`text-[10px] font-bold ${match.selectedIndex === 0 ? 'text-black/70' : 'text-zinc-500'}`}>1</span>
                    <span className="font-bold text-[13px] sm:text-sm">{match.odds['1']}</span>
                  </div>
                  <div className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg ${match.selectedIndex === 1 ? 'bg-[#00FFA3] text-black' : 'bg-[#0F1219] hover:bg-white/5 text-white'}`}>
                    <span className={`text-[10px] font-bold ${match.selectedIndex === 1 ? 'text-black/70' : 'text-zinc-500'}`}>X</span>
                    <span className="font-bold text-[13px] sm:text-sm">{match.odds['X']}</span>
                  </div>
                  <div className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg ${match.selectedIndex === 2 ? 'bg-[#00FFA3] text-black' : 'bg-[#0F1219] hover:bg-white/5 text-white'}`}>
                    <span className={`text-[10px] font-bold ${match.selectedIndex === 2 ? 'text-black/70' : 'text-zinc-500'}`}>2</span>
                    <span className="font-bold text-[13px] sm:text-sm">{match.odds['2']}</span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

// Helper for the top right chevron
const ChevronUpIcon = () => (
  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 7L7 1L13 7" stroke="#A0A5BB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default WorldCupTeaser;
