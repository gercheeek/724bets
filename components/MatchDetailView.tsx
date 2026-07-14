import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Star } from 'lucide-react';

interface MatchDetailViewProps {
  match: any;
  onBack: () => void;
}

export default function MatchDetailView({ match, onBack }: MatchDetailViewProps) {
  const [activeTab, setActiveTab] = useState('HEPSİ');
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    'Maç Sonucu': true,
    'Üst/Alt': true,
    'Asya Handikap': true,
  });

  const toggleAccordion = (name: string) => {
    setOpenAccordions(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const tabs = ['HEPSİ', 'Taraf', 'Alt/Üst', 'Korner', 'Goller', '1.Devre', '2.Devre', 'Handikap'];

  // Mock data to match the screenshot
  const mockMarkets = [
    {
      name: 'Maç Sonucu',
      type: '1x2',
      options: [
        { label: '1', value: '8.90', active: true },
        { label: 'X', value: '4.50' },
        { label: '2', value: '1.29' }
      ]
    },
    {
      name: 'Üst/Alt',
      type: 'over_under',
      rows: [
        { overLabel: 'Üst 1.5', overValue: '1.03', underLabel: 'Alt 1.5', underValue: '8.00', active: 'over' },
        { overLabel: 'Üst 2.5', overValue: '1.37', underLabel: 'Alt 2.5', underValue: '2.75', active: 'over' },
        { overLabel: 'Üst 3', overValue: '1.60', underLabel: 'Alt 3', underValue: '2.15', active: 'over' },
        { overLabel: 'Üst 3.5', overValue: '2.15', underLabel: 'Alt 3.5', underValue: '1.62', active: 'over' },
        { overLabel: 'Üst 4', overValue: '3.10', underLabel: 'Alt 4', underValue: '1.30', active: 'over' },
      ]
    },
    {
      name: 'Asya Handikap',
      type: 'empty'
    }
  ];

  return (
    <div className="flex flex-col w-full h-full bg-[#0a0c10] overflow-y-auto custom-scrollbar">
      
      {/* HEADER SECTION (Minimalist Dark) */}
      <div className="relative w-full py-6 bg-[#12141a] shrink-0 border-b border-[#1f232b] flex justify-center">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-1/2 -translate-y-1/2 left-4 xl:left-8 z-10 w-9 h-9 rounded bg-[#1a1d24] hover:bg-[#252a33] border border-[#2c313c] flex items-center justify-center transition-colors text-[#a0a5b5] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Header Content */}
        <div className="flex items-center justify-center z-10 w-full max-w-[600px] mx-auto px-12">
          
          <div className="flex items-center justify-between w-full">
            
            {/* Home Team */}
            <div className="flex items-center justify-end gap-3 flex-1">
              <span className="text-white font-bold text-[14px] text-right tracking-wide">{match.home}</span>
            </div>

            {/* Score & Time */}
            <div className="flex flex-col items-center justify-center px-6 shrink-0">
              <span className="text-[#00e676] font-bold text-[11px] mb-1.5 flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse"></div>
                 {match.minute ? `${match.minute}'` : "CANLI"}
              </span>
              
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-2xl">{match.score.split('-')[0]?.trim() || '0'}</span>
                <span className="text-[#5c677d] font-black text-xl">-</span>
                <span className="text-white font-black text-2xl">{match.score.split('-')[1]?.trim() || '0'}</span>
              </div>
              
              <span className="text-[#5c677d] font-bold text-[10px] mt-1 uppercase tracking-wider">
                 {match.halfScore || '1. Yarı'}
              </span>
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-start gap-3 flex-1">
              <span className="text-white font-bold text-[14px] text-left tracking-wide">{match.away}</span>
            </div>

          </div>
        </div>
      </div>

      {/* TABS MENU */}
      <div className="flex justify-center bg-[#12141a] border-b border-[#1f232b] relative z-20">
        <div className="flex items-center w-full max-w-[700px] h-12 px-2 overflow-x-auto scrollbar-hide">
           <button className="h-full px-3 text-[#5c677d] hover:text-white shrink-0 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4" />
           </button>
           
           {tabs.map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`relative h-full px-5 text-[12px] font-bold shrink-0 transition-all ${
                 activeTab === tab 
                   ? 'text-white' 
                   : 'text-[#a0a5b5] hover:text-white hover:bg-white/5'
               }`}
             >
               {tab}
               {activeTab === tab && (
                 <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00E676] rounded-t-md shadow-[0_-2px_10px_rgba(0,230,118,0.5)]"></div>
               )}
             </button>
           ))}
           <button className="h-full px-3 text-[#5c677d] hover:text-white shrink-0 flex items-center justify-center ml-auto transition-colors">
              <ArrowLeft className="w-4 h-4 rotate-180" />
           </button>
        </div>
      </div>

      {/* MARKETS CONTAINER */}
      <div className="flex-1 p-3 sm:p-4 pb-24 bg-[#0a0c10] flex justify-center">
        <div className="w-full max-w-[700px] flex flex-col gap-2">
          
          {mockMarkets.map((market, idx) => {
            const isOpen = openAccordions[market.name];
            
            return (
              <div key={idx} className="bg-[#12141a] rounded-[4px] border border-[#1f232b]">
                
                {/* Accordion Header */}
                <button 
                  onClick={() => toggleAccordion(market.name)}
                  className="w-full h-10 flex items-center justify-between px-4 bg-[#161922] hover:bg-[#1a1d24] transition-colors"
                >
                  <span className="text-[#a0a5b5] font-bold text-[12px]">{market.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#5c677d] text-[10px] font-bold">3 Bahis</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#5c677d]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#5c677d]" />
                    )}
                  </div>
                </button>

                {/* Accordion Content */}
                {isOpen && (
                  <div className="p-3 bg-[#0a0c10] border-t border-[#1f232b]">
                    
                    {market.type === '1x2' && market.options && (
                      <div className="flex items-center gap-1.5">
                        {market.options.map((opt, i) => (
                          <button 
                            key={i} 
                            className={`flex-1 h-9 rounded-[4px] flex items-center justify-between px-3 transition-all ${
                              opt.active 
                                ? 'bg-[#00E676]/10 border border-[#00E676] text-[#00E676]' 
                                : 'bg-[#1a1d24] border border-[#2c313c] hover:bg-[#2c313c] text-white'
                            }`}
                          >
                            <span className="font-bold text-[11px] text-[#a0a5b5]">{opt.label}</span>
                            <span className={`font-black text-[12px] ${opt.active ? 'text-[#00E676]' : 'text-[#f2a900]'}`}>
                              {opt.value}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {market.type === 'over_under' && market.rows && (
                      <div className="flex flex-col gap-1.5">
                        {market.rows.map((row, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <button 
                              className={`flex-1 h-9 rounded-[4px] flex items-center justify-between px-3 transition-all ${
                                row.active === 'over' 
                                  ? 'bg-[#00E676]/10 border border-[#00E676] text-[#00E676]' 
                                  : 'bg-[#1a1d24] border border-[#2c313c] hover:bg-[#2c313c] text-white'
                              }`}
                            >
                              <span className="font-bold text-[11px] text-[#a0a5b5]">{row.overLabel}</span>
                              <span className={`font-black text-[12px] ${row.active === 'over' ? 'text-[#00E676]' : 'text-[#f2a900]'}`}>
                                {row.overValue}
                              </span>
                            </button>
                            <button 
                              className={`flex-1 h-9 rounded-[4px] flex items-center justify-between px-3 transition-all ${
                                row.active === 'under' 
                                  ? 'bg-[#00E676]/10 border border-[#00E676] text-[#00E676]' 
                                  : 'bg-[#1a1d24] border border-[#2c313c] hover:bg-[#2c313c] text-white'
                              }`}
                            >
                              <span className="font-bold text-[11px] text-[#a0a5b5]">{row.underLabel}</span>
                              <span className={`font-black text-[12px] ${row.active === 'under' ? 'text-[#00E676]' : 'text-[#f2a900]'}`}>
                                {row.underValue}
                              </span>
                            </button>
                          </div>
                        ))}
                        
                        {/* Daha Fazla Button */}
                        <button className="w-full h-9 mt-1.5 rounded-[4px] bg-[#12141a] hover:bg-[#1a1d24] border border-[#1f232b] flex items-center justify-center gap-2 text-[#5c677d] hover:text-[#a0a5b5] font-bold text-[10px] transition-colors tracking-widest">
                          <ChevronDown className="w-3.5 h-3.5" />
                          TÜMÜNÜ GÖSTER
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {market.type === 'empty' && (
                      <div className="py-8 flex flex-col items-center justify-center gap-2">
                         <div className="w-6 h-6 rounded-full border-2 border-[#2c313c] border-t-[#5c677d] animate-spin"></div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
          
        </div>
      </div>
      
    </div>
  );
}
