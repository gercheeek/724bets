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
    <div className="flex flex-col w-full h-full bg-[#1e232b] overflow-y-auto">
      
      {/* HEADER SECTION (Stadium BG) */}
      <div className="relative w-full h-[140px] sm:h-[160px] bg-gradient-to-r from-[#0d1f18] via-[#153526] to-[#0d1f18] shrink-0 border-b border-[#1f232b]">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1518605368461-1ee7e1612258?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141a] to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#12141a]/60 to-transparent"></div>
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors text-[#a0a5b5] hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          
          <div className="flex items-center justify-between w-full max-w-[500px] px-8">
            
            {/* Home Team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#161922]/80 border border-white/10 p-2 shadow-lg flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                 <span className="text-sm font-black text-white/90 tracking-wider">{match.home.substring(0, 3).toUpperCase()}</span>
                 <div className="absolute inset-0 bg-[url('https://cdn-icons-png.flaticon.com/512/8061/8061266.png')] bg-contain bg-no-repeat bg-center opacity-5"></div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-[13px] text-center drop-shadow-md">{match.home}</span>
              </div>
            </div>

            {/* Score & Time */}
            <div className="flex items-center gap-3 px-2 pb-4">
              <div className="w-9 h-10 rounded bg-[#1a1d24]/80 border border-[#2c313c] flex items-center justify-center backdrop-blur-sm shadow-inner">
                <span className="text-white font-black text-xl">{match.score.split('-')[0]?.trim() || '0'}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center min-w-[70px]">
                <span className="text-[#a0a5b5] font-bold text-[11px] whitespace-nowrap mb-0.5 tracking-wider">
                   {match.halfScore || '1. Yarı'}
                </span>
                <span className="text-[#00E676] font-black text-lg drop-shadow-[0_0_8px_rgba(0,230,118,0.3)] tracking-tight">
                   {match.minute ? `<${match.minute}'` : "Canlı"}
                </span>
              </div>
              
              <div className="w-9 h-10 rounded bg-[#1a1d24]/80 border border-[#2c313c] flex items-center justify-center backdrop-blur-sm shadow-inner">
                <span className="text-white font-black text-xl">{match.score.split('-')[1]?.trim() || '0'}</span>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#161922]/80 border border-white/10 p-2 shadow-lg flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                 <span className="text-sm font-black text-white/90 tracking-wider">{match.away.substring(0, 3).toUpperCase()}</span>
                 <div className="absolute inset-0 bg-[url('https://cdn-icons-png.flaticon.com/512/8061/8061266.png')] bg-contain bg-no-repeat bg-center opacity-5"></div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-[13px] text-center drop-shadow-md">{match.away}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* TABS MENU */}
      <div className="flex items-center bg-[#12141a] h-12 shrink-0 border-b border-[#1f232b] px-2 overflow-x-auto scrollbar-hide sticky top-0 z-20 shadow-sm">
         <button className="h-full px-3 text-[#5c677d] hover:text-white shrink-0 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4" />
         </button>
         
         {tabs.map((tab) => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`relative h-full px-4 text-[12px] font-bold shrink-0 transition-colors ${
               activeTab === tab 
                 ? 'text-white' 
                 : 'text-[#a0a5b5] hover:text-[#d1d5db]'
             }`}
           >
             {tab}
             {activeTab === tab && (
               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f2a900]"></div>
             )}
           </button>
         ))}
         <button className="h-full px-3 text-[#5c677d] hover:text-white shrink-0 flex items-center justify-center ml-auto transition-colors">
            <ArrowLeft className="w-4 h-4 rotate-180" />
         </button>
      </div>

      {/* MARKETS CONTAINER */}
      <div className="flex-1 p-3 sm:p-4 pb-24 bg-[#0a0c10] space-y-3">
        
        {mockMarkets.map((market, idx) => {
          const isOpen = openAccordions[market.name];
          
          return (
            <div key={idx} className="bg-[#161922] rounded-md overflow-hidden border border-[#1f232b] shadow-sm">
              
              {/* Accordion Header */}
              <button 
                onClick={() => toggleAccordion(market.name)}
                className="w-full h-10 flex items-center justify-between px-4 bg-[#1c202a] hover:bg-[#252a33] border-b border-[#1f232b] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] shadow-[0_0_5px_rgba(0,230,118,0.5)]"></div>
                  <span className="text-white font-bold text-[13px] tracking-wide">{market.name}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#5c677d]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#5c677d]" />
                )}
              </button>

              {/* Accordion Content */}
              {isOpen && market.type === '1x2' && market.options && (
                <div className="p-3 bg-[#12141a]">
                   <div className="flex items-center gap-1.5">
                     {market.options.map((opt, i) => (
                       <button 
                         key={i} 
                         className={`flex-1 h-10 rounded-[4px] border px-3 flex items-center justify-between transition-all group ${
                           opt.active 
                             ? 'border-[#00E676] bg-[#00E676]/10' 
                             : 'border-[#2c313c] bg-[#1a1d24] hover:bg-[#252a33]'
                         }`}
                       >
                         <span className="text-[#a0a5b5] font-bold text-[11px]">{opt.label}</span>
                         <span className={`font-black text-[12.5px] ${opt.active ? 'text-[#00E676]' : 'text-[#f2a900]'}`}>
                           {opt.value}
                         </span>
                       </button>
                     ))}
                   </div>
                </div>
              )}

              {isOpen && market.type === 'over_under' && market.rows && (
                <div className="p-3 bg-[#12141a] flex flex-col gap-1.5">
                   {market.rows.map((row, i) => (
                     <div key={i} className="flex flex-col sm:flex-row items-center gap-1.5">
                       <button 
                         className={`flex-1 w-full h-10 rounded-[4px] border px-3 flex items-center justify-between transition-all group ${
                           row.active === 'over' 
                             ? 'border-[#00E676] bg-[#00E676]/10' 
                             : 'border-[#2c313c] bg-[#1a1d24] hover:bg-[#252a33]'
                         }`}
                       >
                         <span className="text-[#a0a5b5] font-bold text-[11px]">{row.overLabel}</span>
                         <span className={`font-black text-[12.5px] ${row.active === 'over' ? 'text-[#00E676]' : 'text-[#f2a900]'}`}>
                           {row.overValue}
                         </span>
                       </button>
                       <button 
                         className={`flex-1 w-full h-10 rounded-[4px] border px-3 flex items-center justify-between transition-all group ${
                           row.active === 'under' 
                             ? 'border-[#00E676] bg-[#00E676]/10' 
                             : 'border-[#2c313c] bg-[#1a1d24] hover:bg-[#252a33]'
                         }`}
                       >
                         <span className="text-[#a0a5b5] font-bold text-[11px]">{row.underLabel}</span>
                         <span className={`font-black text-[12.5px] ${row.active === 'under' ? 'text-[#00E676]' : 'text-[#f2a900]'}`}>
                           {row.underValue}
                         </span>
                       </button>
                     </div>
                   ))}
                   
                   {/* Daha Fazla Button */}
                   <button className="w-full h-8 mt-2 rounded bg-[#1a1d24] hover:bg-[#252a33] border border-[#2c313c] flex items-center justify-center gap-1.5 text-[#5c677d] hover:text-[#a0a5b5] font-bold text-[11px] transition-colors">
                     <ChevronDown className="w-3.5 h-3.5" />
                     DAHA FAZLA GÖSTER
                     <ChevronDown className="w-3.5 h-3.5" />
                   </button>
                </div>
              )}

              {isOpen && market.type === 'empty' && (
                <div className="p-8 bg-[#1e232b] flex items-center justify-center">
                   <span className="text-[#5c677d] text-[13px] font-bold">Veri Bekleniyor...</span>
                </div>
              )}

            </div>
          );
        })}
        
      </div>
      
    </div>
  );
}
