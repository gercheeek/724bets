import React, { useState } from 'react';
import { ArrowLeft, Info, ChevronDown } from 'lucide-react';
import { useBetting } from '../contexts/BettingContext';

interface MatchDetailViewProps {
  match: any;
  onBack: () => void;
}

export default function MatchDetailView({ match, onBack }: MatchDetailViewProps) {
  const [activeTab, setActiveTab] = useState('Ana Seçenekler');

  const topTabs = [
    { name: 'Ana Seçenekler', count: 26 },
    { name: 'Bahis sihirbazı', count: 24 },
    { name: 'Yarılar', count: 33 },
    { name: 'Toplam', count: 30 },
    { name: 'İstatistikler', count: 18 },
    { name: 'Oyuncu Bahisleri', count: 9 },
    { name: 'Uzatma', count: 25 },
    { name: 'Handikaplar', count: 5 },
    { name: 'Hızlı', count: 2 }
  ];

  // Generic Button Component for the new layout
  const BetButton = ({ label, odd = 'x.xx', className = '' }: { label?: string, odd?: string, className?: string }) => (
    <button className={`h-11 rounded-md bg-[#252a33] hover:bg-[#313641] transition-colors flex flex-row items-center justify-between px-3 md:px-4 ${className}`}>
      {label && <span className="text-[#a0a5b5] font-semibold text-[13px]">{label}</span>}
      <span className="text-white font-bold text-[13px] tracking-wide ml-auto">{odd}</span>
    </button>
  );

  const Panel = ({ title, showInfo = false, children }: { title: string, showInfo?: boolean, children: React.ReactNode }) => (
    <div className="bg-[#1a1d24] rounded-lg border border-[#2c313c] p-4 flex flex-col mb-4 w-full">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-[#e2e8f0] font-bold text-[14px]">{title}</h3>
        {showInfo && (
          <div className="w-4 h-4 rounded-full bg-[#2c313c] flex items-center justify-center text-[#a0a5b5] cursor-pointer hover:bg-[#3b414f]">
            <Info size={10} strokeWidth={3} />
          </div>
        )}
      </div>
      {children}
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full bg-[#0f1116] overflow-y-auto custom-scrollbar">
      
      {/* HEADER SECTION (Minimalist Dark) */}
      <div className="relative w-full py-6 sm:py-8 bg-[#16191f] shrink-0 border-b border-[#2c313c] flex justify-center">
        <button 
          onClick={onBack}
          className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-10 w-10 h-10 rounded bg-[#252a33] hover:bg-[#313641] border border-[#2c313c] flex items-center justify-center transition-colors text-[#a0a5b5] hover:text-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center z-10 w-full max-w-[1400px] mx-auto px-16 md:px-24">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center justify-end gap-3 md:gap-4 flex-1">
              <span className="text-white font-bold text-[14px] md:text-[18px] text-right tracking-wide line-clamp-2">Takım A</span>
            </div>
            <div className="flex flex-col items-center justify-center px-8 md:px-12 shrink-0">
              <span className="text-[#00e676] font-bold text-[12px] mb-2 flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse shadow-[0_0_8px_rgba(0,230,118,0.6)]"></div>
                 CANLI
              </span>
              <div className="flex items-center gap-3">
                <span className="text-white font-black text-3xl md:text-4xl drop-shadow-md">0</span>
                <span className="text-[#5c677d] font-black text-2xl md:text-3xl mb-1">-</span>
                <span className="text-white font-black text-3xl md:text-4xl drop-shadow-md">0</span>
              </div>
            </div>
            <div className="flex items-center justify-start gap-3 md:gap-4 flex-1">
              <span className="text-white font-bold text-[14px] md:text-[18px] text-left tracking-wide line-clamp-2">Takım B</span>
            </div>
          </div>
        </div>
      </div>
 
      {/* SCROLLABLE CATEGORY TABS (Replicating the image header) */}
      <div className="flex justify-center bg-[#16191f] border-b border-[#2c313c] relative z-20">
        <div className="flex items-center w-full max-w-[1400px] h-14 px-4 overflow-x-auto scrollbar-hide gap-6">
           {topTabs.map((tab) => (
             <button 
               key={tab.name}
               onClick={() => setActiveTab(tab.name)}
               className={`relative h-full flex items-center gap-2 text-[13px] font-bold shrink-0 transition-all ${
                 activeTab === tab.name 
                   ? 'text-white' 
                   : 'text-[#a0a5b5] hover:text-white'
               }`}
             >
               {tab.name}
               <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeTab === tab.name ? 'bg-[#2c313c] text-[#a0a5b5]' : 'bg-[#1a1d24] text-[#5c677d]'}`}>
                 {tab.count}
               </span>
               {activeTab === tab.name && (
                 <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00E5FF] rounded-t-md"></div>
               )}
             </button>
           ))}
        </div>
      </div>
 
      {/* MARKETS GRID CONTAINER */}
      <div className="flex-1 p-4 sm:p-6 bg-[#0f1116] flex justify-center">
        <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col w-full">
            
            {/* 1x2 Panel */}
            <Panel title="1x2" showInfo={true}>
              <div className="grid grid-cols-3 gap-2">
                <BetButton label="1" odd="x.xx" />
                <BetButton label="beraberlik" odd="x.xx" />
                <BetButton label="2" odd="x.xx" />
              </div>
            </Panel>

            {/* Tur atlayacak takım Panel */}
            <Panel title="Tur atlayacak takım" showInfo={true}>
              <div className="grid grid-cols-2 gap-2">
                <BetButton label="1" odd="x.xx" />
                <BetButton label="2" odd="x.xx" />
              </div>
            </Panel>

            {/* Toplam (Asya) Panel */}
            <Panel title="Toplam (Asya)">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <span className="text-center text-[#a0a5b5] text-[12px] font-bold">Üstü</span>
                <span className="text-center text-[#a0a5b5] text-[12px] font-bold">Altı</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {/* Row 1 */}
                <BetButton label="---" odd="x.xx" />
                <BetButton label="---" odd="x.xx" />
                {/* Row 2 */}
                <BetButton label="---" odd="x.xx" />
                <BetButton label="---" odd="x.xx" />
              </div>
            </Panel>

            {/* İki takım da gol atacak Panel */}
            <Panel title="İki takım da gol atacak">
              <div className="grid grid-cols-2 gap-2">
                <BetButton label="var" odd="x.xx" />
                <BetButton label="yok" odd="x.xx" />
              </div>
            </Panel>

            {/* Handikap Panel */}
            <Panel title="Handikap">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <span className="text-center text-[#a0a5b5] text-[12px] font-bold">Takım A</span>
                <span className="text-center text-[#a0a5b5] text-[12px] font-bold">Takım B</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {/* Row 1 */}
                <BetButton label="---" odd="x.xx" />
                <BetButton label="---" odd="x.xx" />
                {/* Row 2 */}
                <BetButton label="---" odd="x.xx" />
                <BetButton label="---" odd="x.xx" />
              </div>
            </Panel>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col w-full">
            
            {/* Çifte şans Panel */}
            <Panel title="Çifte şans">
              <div className="grid grid-cols-3 gap-2">
                <BetButton label="1 veya beraberlik" odd="x.xx" />
                <BetButton label="1 veya 2" odd="x.xx" />
                <BetButton label="beraberlik veya 2" odd="x.xx" />
              </div>
            </Panel>

            {/* Toplam Panel */}
            <Panel title="Toplam">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <span className="text-center text-[#a0a5b5] text-[12px] font-bold">Üstü</span>
                <span className="text-center text-[#a0a5b5] text-[12px] font-bold">Altı</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                {/* Row 1 */}
                <BetButton label="---" odd="x.xx" />
                <BetButton label="---" odd="x.xx" />
                {/* Row 2 */}
                <BetButton label="---" odd="x.xx" />
                <BetButton label="---" odd="x.xx" />
                {/* Row 3 */}
                <BetButton label="---" odd="x.xx" />
                <BetButton label="---" odd="x.xx" />
              </div>
              <div className="flex justify-center w-full border-t border-[#2c313c] pt-3">
                <button className="flex items-center gap-1.5 text-[#a0a5b5] hover:text-white transition-colors text-[12px] font-bold">
                  Tümünü göster <ChevronDown size={14} />
                </button>
              </div>
            </Panel>

            {/* Gol Bahsi Panel */}
            <Panel title=". gol">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <span className="text-center text-[#a0a5b5] text-[12px] font-bold">Takım A</span>
                <span className="text-center text-[#a0a5b5] text-[12px] font-bold">Hiçbiri</span>
                <span className="text-center text-[#a0a5b5] text-[12px] font-bold">Takım B</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <BetButton label="1" odd="x.xx" />
                <BetButton odd="x.xx" />
                <BetButton odd="x.xx" />
              </div>
            </Panel>

            {/* Beraberlikte iade Panel */}
            <Panel title="Beraberlikte iade">
              <div className="grid grid-cols-2 gap-2">
                <BetButton label="1" odd="x.xx" />
                <BetButton label="2" odd="x.xx" />
              </div>
            </Panel>

            {/* Handikap (Asya) Panel */}
            <Panel title="Handikap (Asya)">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <span className="text-center text-[#a0a5b5] text-[12px] font-bold">Takım A</span>
                <span className="text-center text-[#a0a5b5] text-[12px] font-bold">Takım B</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <BetButton label="---" odd="x.xx" />
                <BetButton label="---" odd="x.xx" />
              </div>
            </Panel>

          </div>
          
        </div>
      </div>
      
    </div>
  );
}
