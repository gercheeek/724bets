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
      
      {/* HEADER SECTION (Stadium BG) */}
      <div className="relative w-full h-[180px] bg-[#0d1310] shrink-0 border-b border-[#1f232b] flex justify-center">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518605368461-1ee7e1612258?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-screen"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10] via-transparent to-[#0a0c10]"></div>
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 xl:left-8 z-10 w-10 h-10 rounded-full bg-[#12141a]/80 hover:bg-[#1a1d24] border border-[#2c313c] flex items-center justify-center transition-colors text-[#a0a5b5] hover:text-white shadow-lg backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 w-full max-w-[800px] mx-auto">
          
          <div className="flex items-center justify-between w-full px-4 sm:px-12 mt-4">
            
            {/* Home Team */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-16 h-16 rounded-full bg-[#12141a] border-2 border-[#2c313c] p-1 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden group-hover:border-[#00e676] transition-colors">
                 <span className="text-sm font-black text-white tracking-widest">{match.home.substring(0, 3).toUpperCase()}</span>
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              </div>
              <span className="text-white font-bold text-[14px] text-center drop-shadow-md tracking-wide">{match.home}</span>
            </div>

            {/* Score & Time */}
            <div className="flex flex-col items-center justify-center px-4 shrink-0 min-w-[140px]">
              <span className="text-[#a0a5b5] font-bold text-[11px] whitespace-nowrap mb-2 tracking-[0.2em] uppercase">
                 {match.halfScore || '1. Yarı'}
              </span>
              
              <div className="flex items-center gap-3">
                <div className="w-11 h-12 rounded-[6px] bg-[#12141a] border border-[#2c313c] flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 w-full h-[1px] bg-white/10"></div>
                  <span className="text-[#00e676] font-black text-2xl drop-shadow-[0_0_8px_rgba(0,230,118,0.4)]">{match.score.split('-')[0]?.trim() || '0'}</span>
                </div>
                
                <span className="text-[#5c677d] font-black text-xl">:</span>
                
                <div className="w-11 h-12 rounded-[6px] bg-[#12141a] border border-[#2c313c] flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 w-full h-[1px] bg-white/10"></div>
                  <span className="text-[#00e676] font-black text-2xl drop-shadow-[0_0_8px_rgba(0,230,118,0.4)]">{match.score.split('-')[1]?.trim() || '0'}</span>
                </div>
              </div>
              
              <div className="mt-3 bg-[#00E676]/10 border border-[#00E676]/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,230,118,0.1)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse"></div>
                <span className="text-[#00E676] font-bold text-[11px] tracking-wider">
                   {match.minute ? `${match.minute}'` : "CANLI"}
                </span>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-16 h-16 rounded-full bg-[#12141a] border-2 border-[#2c313c] p-1 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden group-hover:border-[#e62020] transition-colors">
                 <span className="text-sm font-black text-white tracking-widest">{match.away.substring(0, 3).toUpperCase()}</span>
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              </div>
              <span className="text-white font-bold text-[14px] text-center drop-shadow-md tracking-wide">{match.away}</span>
            </div>

          </div>
        </div>
      </div>

      {/* TABS MENU */}
      <div className="flex justify-center bg-[#12141a] border-b border-[#1f232b] shadow-md relative z-20">
        <div className="flex items-center w-full max-w-[800px] h-[52px] px-2 overflow-x-auto scrollbar-hide">
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
      <div className="flex-1 p-3 sm:p-6 pb-24 bg-[#0a0c10] flex justify-center">
        <div className="w-full max-w-[800px] flex flex-col gap-3">
          
          {mockMarkets.map((market, idx) => {
            const isOpen = openAccordions[market.name];
            
            return (
              <div key={idx} className="bg-[#12141a] rounded-[8px] overflow-hidden border border-[#1f232b] shadow-lg">
                
                {/* Accordion Header */}
                <button 
                  onClick={() => toggleAccordion(market.name)}
                  className="relative w-full h-[46px] flex items-center justify-between px-5 bg-[#161922] hover:bg-[#1a1d24] transition-colors overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00E676] to-[#00a354] opacity-80"></div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[#f1f5f9] font-bold text-[13px] tracking-wide">{market.name}</span>
                    <span className="text-[#5c677d] text-[11px] font-semibold border border-[#2c313c] px-2 py-0.5 rounded-full">3 Bahis</span>
                  </div>
                  
                  <div className="w-7 h-7 rounded-full bg-[#1a1d24] flex items-center justify-center border border-[#2c313c] group-hover:border-[#424b5c] transition-colors">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#a0a5b5]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#a0a5b5]" />
                    )}
                  </div>
                </button>

                {/* Accordion Content */}
                {isOpen && (
                  <div className="p-4 bg-[#0d0e12] border-t border-[#1f232b]">
                    
                    {market.type === '1x2' && market.options && (
                      <div className="flex items-center gap-2">
                        {market.options.map((opt, i) => (
                          <button 
                            key={i} 
                            className={`flex-1 h-11 rounded-[6px] flex items-center justify-between px-4 transition-all relative overflow-hidden group/btn ${
                              opt.active 
                                ? 'bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.3)]' 
                                : 'bg-[#1a1d24] border border-[#2c313c] hover:border-[#424b5c] hover:bg-[#252a33]'
                            }`}
                          >
                            <span className={`font-bold text-[12px] relative z-10 ${opt.active ? 'text-black' : 'text-[#a0a5b5]'}`}>{opt.label}</span>
                            <span className={`font-black text-[13px] relative z-10 ${opt.active ? 'text-black' : 'text-white'}`}>
                              {opt.value}
                            </span>
                            {opt.active && <div className="absolute inset-0 bg-white/20"></div>}
                          </button>
                        ))}
                      </div>
                    )}

                    {market.type === 'over_under' && market.rows && (
                      <div className="flex flex-col gap-2">
                        {market.rows.map((row, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <button 
                              className={`flex-1 h-11 rounded-[6px] flex items-center justify-between px-4 transition-all relative overflow-hidden group/btn ${
                                row.active === 'over' 
                                  ? 'bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.3)]' 
                                  : 'bg-[#1a1d24] border border-[#2c313c] hover:border-[#424b5c] hover:bg-[#252a33]'
                              }`}
                            >
                              <span className={`font-bold text-[12px] relative z-10 ${row.active === 'over' ? 'text-black' : 'text-[#a0a5b5]'}`}>{row.overLabel}</span>
                              <span className={`font-black text-[13px] relative z-10 ${row.active === 'over' ? 'text-black' : 'text-white'}`}>
                                {row.overValue}
                              </span>
                            </button>
                            <button 
                              className={`flex-1 h-11 rounded-[6px] flex items-center justify-between px-4 transition-all relative overflow-hidden group/btn ${
                                row.active === 'under' 
                                  ? 'bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.3)]' 
                                  : 'bg-[#1a1d24] border border-[#2c313c] hover:border-[#424b5c] hover:bg-[#252a33]'
                              }`}
                            >
                              <span className={`font-bold text-[12px] relative z-10 ${row.active === 'under' ? 'text-black' : 'text-[#a0a5b5]'}`}>{row.underLabel}</span>
                              <span className={`font-black text-[13px] relative z-10 ${row.active === 'under' ? 'text-black' : 'text-white'}`}>
                                {row.underValue}
                              </span>
                            </button>
                          </div>
                        ))}
                        
                        {/* Daha Fazla Button */}
                        <button className="w-full h-10 mt-3 rounded-[6px] bg-[#1a1d24] hover:bg-[#252a33] border border-[#2c313c] flex items-center justify-center gap-2 text-[#a0a5b5] hover:text-white font-bold text-[11px] transition-colors tracking-wide">
                          <ChevronDown className="w-4 h-4" />
                          TÜM LİMİTLERİ GÖSTER
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {market.type === 'empty' && (
                      <div className="py-12 flex flex-col items-center justify-center gap-3">
                         <div className="w-10 h-10 rounded-full border-2 border-[#2c313c] border-t-[#00e676] animate-spin"></div>
                         <span className="text-[#5c677d] text-[12px] font-bold">Market verileri yükleniyor...</span>
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
