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
      <div className="relative w-full h-[220px] sm:h-[260px] bg-gradient-to-r from-[#0d1f18] via-[#153526] to-[#0d1f18] shrink-0">
        {/* Placeholder for actual stadium image */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1518605368461-1ee7e1612258?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e232b] to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4 z-10">
          
          <div className="flex items-center justify-between w-full max-w-[500px] px-8">
            
            {/* Home Team */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/95 border-2 border-white p-2 shadow-lg flex items-center justify-center relative overflow-hidden">
                 {/* Generate initials if no logo */}
                 <span className="text-xl font-black text-[#1e232b]">{match.home.substring(0, 3).toUpperCase()}</span>
                 {/* Generic home shield overlay */}
                 <div className="absolute inset-0 bg-[url('https://cdn-icons-png.flaticon.com/512/8061/8061266.png')] bg-contain bg-no-repeat bg-center opacity-10"></div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-[15px] text-center drop-shadow-md">{match.home}</span>
                <span className="text-[#a0a5b5] text-[11px] font-semibold mt-0.5">Ev Sahibi</span>
              </div>
            </div>

            {/* Score & Time */}
            <div className="flex items-center gap-3 px-4 pb-6">
              <div className="w-10 h-12 rounded bg-[#00e676] flex items-center justify-center shadow-[0_0_15px_rgba(0,230,118,0.3)]">
                <span className="text-[#0a0c10] font-black text-2xl">{match.score.split('-')[0]?.trim() || '0'}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center min-w-[70px]">
                <span className="text-white font-bold text-[13px] whitespace-nowrap mb-1 drop-shadow-md">
                   {match.halfScore || 'İlk Yarı'}
                </span>
                <span className="text-[#00e676] font-black text-xl drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]">
                   {match.minute ? `<${match.minute}'` : "Canlı"}
                </span>
              </div>
              
              <div className="w-10 h-12 rounded bg-[#00e676] flex items-center justify-center shadow-[0_0_15px_rgba(0,230,118,0.3)]">
                <span className="text-[#0a0c10] font-black text-2xl">{match.score.split('-')[1]?.trim() || '0'}</span>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/95 border-2 border-white p-2 shadow-lg flex items-center justify-center relative overflow-hidden">
                 <span className="text-xl font-black text-[#1e232b]">{match.away.substring(0, 3).toUpperCase()}</span>
                 <div className="absolute inset-0 bg-[url('https://cdn-icons-png.flaticon.com/512/8061/8061266.png')] bg-contain bg-no-repeat bg-center opacity-10"></div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-[15px] text-center drop-shadow-md">{match.away}</span>
                <span className="text-[#a0a5b5] text-[11px] font-semibold mt-0.5">Deplasman</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* TABS MENU */}
      <div className="flex items-center bg-[#242b35] h-[50px] shrink-0 border-y border-[#323945] px-2 overflow-x-auto scrollbar-hide sticky top-0 z-20">
         <button className="h-full px-4 text-[#a0a5b5] hover:text-white shrink-0 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
         </button>
         
         {tabs.map((tab) => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`h-full px-5 text-[13px] font-bold shrink-0 transition-colors border-r border-[#323945] ${
               activeTab === tab 
                 ? 'text-white bg-[#2d3542]' 
                 : 'text-[#a0a5b5] hover:text-[#d1d5db]'
             }`}
           >
             {tab}
           </button>
         ))}
         <button className="h-full px-4 text-[#a0a5b5] hover:text-white shrink-0 flex items-center justify-center border-l border-[#323945] ml-auto">
            <ArrowLeft className="w-4 h-4 rotate-180" />
         </button>
      </div>

      {/* MARKETS CONTAINER */}
      <div className="flex-1 p-3 sm:p-4 pb-24 bg-[#1e232b] space-y-4">
        
        {mockMarkets.map((market, idx) => {
          const isOpen = openAccordions[market.name];
          
          return (
            <div key={idx} className="bg-[#242b35] rounded-md overflow-hidden border border-[#323945] shadow-sm">
              
              {/* Accordion Header */}
              <button 
                onClick={() => toggleAccordion(market.name)}
                className="w-full h-11 flex items-center justify-between px-4 bg-[#2b3340] hover:bg-[#323945] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Green Soccer Ball Icon */}
                  <div className="w-5 h-5 rounded-full bg-[#00e676]/20 flex items-center justify-center">
                     <div className="w-2.5 h-2.5 rounded-full bg-[#00e676]"></div>
                  </div>
                  <span className="text-white font-bold text-[14px]">{market.name}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#a0a5b5]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#a0a5b5]" />
                )}
              </button>

              {/* Accordion Content */}
              {isOpen && market.type === '1x2' && market.options && (
                <div className="p-3 sm:p-4 bg-[#1e232b]">
                   <div className="flex items-center gap-2">
                     {market.options.map((opt, i) => (
                       <button 
                         key={i} 
                         className={`flex-1 h-11 rounded border px-4 flex items-center justify-between transition-colors ${
                           opt.active 
                             ? 'border-[#00e676] bg-[#00e676]/10' 
                             : 'border-[#323945] bg-[#242b35] hover:border-[#4b5563]'
                         }`}
                       >
                         <span className="text-[#a0a5b5] font-bold text-[13px]">{opt.label}</span>
                         <span className={`font-black text-[13px] ${opt.active ? 'text-[#00e676]' : 'text-[#f2a900]'}`}>
                           {opt.value}
                         </span>
                       </button>
                     ))}
                   </div>
                </div>
              )}

              {isOpen && market.type === 'over_under' && market.rows && (
                <div className="p-3 sm:p-4 bg-[#1e232b] flex flex-col gap-2">
                   {market.rows.map((row, i) => (
                     <div key={i} className="flex flex-col sm:flex-row items-center gap-2">
                       <button 
                         className={`flex-1 w-full h-11 rounded border px-4 flex items-center justify-between transition-colors ${
                           row.active === 'over' 
                             ? 'border-[#00e676] bg-[#00e676]/10' 
                             : 'border-[#323945] bg-[#242b35] hover:border-[#4b5563]'
                         }`}
                       >
                         <span className="text-[#a0a5b5] font-bold text-[13px]">{row.overLabel}</span>
                         <span className={`font-black text-[13px] ${row.active === 'over' ? 'text-[#00e676]' : 'text-[#f2a900]'}`}>
                           {row.overValue}
                         </span>
                       </button>
                       <button 
                         className={`flex-1 w-full h-11 rounded border px-4 flex items-center justify-between transition-colors ${
                           row.active === 'under' 
                             ? 'border-[#00e676] bg-[#00e676]/10' 
                             : 'border-[#323945] bg-[#242b35] hover:border-[#4b5563]'
                         }`}
                       >
                         <span className="text-[#a0a5b5] font-bold text-[13px]">{row.underLabel}</span>
                         <span className={`font-black text-[13px] ${row.active === 'under' ? 'text-[#00e676]' : 'text-[#f2a900]'}`}>
                           {row.underValue}
                         </span>
                       </button>
                     </div>
                   ))}
                   
                   {/* Daha Fazla Button */}
                   <button className="w-full max-w-[200px] mx-auto h-9 mt-3 rounded bg-[#2b3340] hover:bg-[#323945] border border-[#323945] flex items-center justify-center gap-2 text-[#a0a5b5] font-bold text-[12px] transition-colors">
                     <ChevronDown className="w-4 h-4" />
                     Daha Fazla
                     <ChevronDown className="w-4 h-4" />
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
