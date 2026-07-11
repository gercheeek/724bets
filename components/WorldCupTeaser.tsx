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
            
            {/* MATCH CARD 1 */}
            <div 
              onClick={() => onMatchClick('m1')}
              className="bg-[#1E202B] rounded-xl p-4 min-w-[280px] sm:min-w-[320px] shrink-0 border border-[#2C2F3D] cursor-pointer hover:border-[#00FFA3]/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white text-[13px] font-bold">12.07 0:00</span>
                <div className="flex items-center gap-3 text-[#A0A5BB]">
                  <div className="flex items-center gap-1 bg-[#00FFA3] text-black px-2 py-0.5 rounded-full text-[12px] font-bold">
                    <MessageCircle size={12} fill="currentColor" />
                    <span>64</span>
                  </div>
                  <BarChart2 size={16} />
                  <Star size={16} />
                </div>
              </div>
              <div className="flex items-center justify-between px-2 mb-6">
                <div className="flex flex-col items-center gap-2">
                  <img src="https://flagcdn.com/w40/no.png" alt="Norveç" className="w-8 h-6 rounded-sm object-cover" />
                  <span className="text-white font-medium text-[13px]">Norveç</span>
                </div>
                <div className="text-[#454A62] font-black italic text-lg">VS</div>
                <div className="flex flex-col items-center gap-2">
                  <img src="https://flagcdn.com/w40/gb-eng.png" alt="İngiltere" className="w-8 h-6 rounded-sm object-cover border border-[#2C2F3D]" />
                  <span className="text-white font-medium text-[13px]">İngiltere</span>
                </div>
              </div>
              <div className="mb-2 flex items-center gap-2 text-[#A0A5BB] text-[12px]">
                Maç Sonucu <span className="w-2 h-2 rounded-full bg-[#00FFA3]"></span>
              </div>
              <div className="flex items-center bg-[#181A22] rounded-lg border border-[#2C2F3D] overflow-hidden">
                <button className="px-2 py-2 text-[#454A62] hover:text-white hover:bg-white/5"><ChevronLeft size={16} /></button>
                <div className="flex-1 flex text-white text-[13px]">
                  <div className="flex-1 flex justify-between px-3 py-2 border-r border-[#2C2F3D] hover:bg-white/5">
                    <span className="text-[#A0A5BB]">1</span>
                    <span className="font-bold">4.05</span>
                  </div>
                  <div className="flex-1 flex justify-between px-3 py-2 border-r border-[#2C2F3D] hover:bg-white/5">
                    <span className="text-[#A0A5BB]">X</span>
                    <span className="font-bold">3.75</span>
                  </div>
                  <div className="flex-1 flex justify-between px-3 py-2 hover:bg-white/5">
                    <span className="text-[#A0A5BB]">2</span>
                    <span className="font-bold">1.95</span>
                  </div>
                </div>
                <button className="px-2 py-2 text-[#454A62] hover:text-white hover:bg-white/5"><ChevronRight size={16} /></button>
              </div>
            </div>

            {/* MATCH CARD 2 */}
            <div 
              onClick={() => onMatchClick('m2')}
              className="bg-[#1E202B] rounded-xl p-4 min-w-[280px] sm:min-w-[320px] shrink-0 border border-[#2C2F3D] cursor-pointer hover:border-[#00FFA3]/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white text-[13px] font-bold">12.07 4:00</span>
                <div className="flex items-center gap-3 text-[#A0A5BB]">
                  <div className="flex items-center gap-1 bg-[#00FFA3] text-black px-2 py-0.5 rounded-full text-[12px] font-bold">
                    <MessageCircle size={12} fill="currentColor" />
                    <span>64</span>
                  </div>
                  <BarChart2 size={16} />
                  <Star size={16} />
                </div>
              </div>
              <div className="flex items-center justify-between px-2 mb-6">
                <div className="flex flex-col items-center gap-2">
                  <img src="https://flagcdn.com/w40/ar.png" alt="Arjantin" className="w-8 h-6 rounded-sm object-cover" />
                  <span className="text-white font-medium text-[13px]">Arjantin</span>
                </div>
                <div className="text-[#454A62] font-black italic text-lg">VS</div>
                <div className="flex flex-col items-center gap-2">
                  <img src="https://flagcdn.com/w40/ch.png" alt="İsviçre" className="w-8 h-6 rounded-sm object-cover" />
                  <span className="text-white font-medium text-[13px]">İsviçre</span>
                </div>
              </div>
              <div className="mb-2 flex items-center gap-2 text-[#A0A5BB] text-[12px]">
                Maç Sonucu <span className="w-2 h-2 rounded-full bg-[#00FFA3]"></span>
              </div>
              <div className="flex items-center bg-[#181A22] rounded-lg border border-[#2C2F3D] overflow-hidden">
                <button className="px-2 py-2 text-[#454A62] hover:text-white hover:bg-white/5"><ChevronLeft size={16} /></button>
                <div className="flex-1 flex text-white text-[13px]">
                  <div className="flex-1 flex justify-between px-3 py-2 border-r border-[#2C2F3D] bg-[#00FFA3] text-black">
                    <span className="text-black/70">1</span>
                    <span className="font-bold">1.7</span>
                  </div>
                  <div className="flex-1 flex justify-between px-3 py-2 border-r border-[#2C2F3D] hover:bg-white/5">
                    <span className="text-[#A0A5BB]">X</span>
                    <span className="font-bold">3.6</span>
                  </div>
                  <div className="flex-1 flex justify-between px-3 py-2 hover:bg-white/5">
                    <span className="text-[#A0A5BB]">2</span>
                    <span className="font-bold">5.9</span>
                  </div>
                </div>
                <button className="px-2 py-2 text-[#454A62] hover:text-white hover:bg-white/5"><ChevronRight size={16} /></button>
              </div>
            </div>
            
            {/* MATCH CARD 3 (Fransa) */}
            <div 
              onClick={() => onMatchClick('m3')}
              className="bg-[#1E202B] rounded-xl p-4 min-w-[320px] shrink-0 border border-[#2C2F3D] cursor-pointer hover:border-[#00FFA3]/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white text-[13px] font-bold">14.07 22:00</span>
                <div className="flex items-center gap-3 text-[#A0A5BB]">
                  <BarChart2 size={16} />
                  <Star size={16} />
                </div>
              </div>
              <div className="flex items-center justify-between px-2 mb-6">
                <div className="flex flex-col items-center gap-2">
                  <img src="https://flagcdn.com/w40/fr.png" alt="Fransa" className="w-8 h-6 rounded-sm object-cover" />
                  <span className="text-white font-medium text-[13px]">Fransa</span>
                </div>
                <div className="text-[#454A62] font-black italic text-lg">VS</div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-6 rounded-sm bg-zinc-800 border border-[#2C2F3D] animate-pulse" />
                  <span className="text-[#A0A5BB] font-medium text-[13px]">TBD</span>
                </div>
              </div>
              <div className="mb-2 flex items-center gap-2 text-[#A0A5BB] text-[12px]">
                Maç Sonucu <span className="w-2 h-2 rounded-full bg-[#00FFA3]"></span>
              </div>
              <div className="flex items-center bg-[#181A22] rounded-lg border border-[#2C2F3D] overflow-hidden">
                <button className="px-2 py-2 text-[#454A62] hover:text-white hover:bg-white/5"><ChevronLeft size={16} /></button>
                <div className="flex-1 flex text-white text-[13px]">
                  <div className="flex-1 flex justify-between px-3 py-2 border-r border-[#2C2F3D] hover:bg-white/5">
                    <span className="text-[#A0A5BB]">1</span>
                    <span className="font-bold">2.44</span>
                  </div>
                  <div className="flex-1 flex justify-between px-3 py-2 hover:bg-white/5">
                    <span className="text-[#A0A5BB]">X</span>
                    <span className="font-bold">3.10</span>
                  </div>
                </div>
                <button className="px-2 py-2 text-[#454A62] hover:text-white hover:bg-white/5"><ChevronRight size={16} /></button>
              </div>
            </div>

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
