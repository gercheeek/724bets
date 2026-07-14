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

  const parseMarkets = () => {
    if (!match.rawEvent?.group_markets) return { tabs: ['HEPSİ'], markets: [] };
    
    const groupMarkets = match.rawEvent.group_markets;
    const allTabs = new Set(['HEPSİ']);
    const parsedMarkets: any[] = [];
    
    Object.keys(groupMarkets).forEach(groupKey => {
      let tab = 'Taraf';
      if (groupKey.includes('first-half')) { tab = '1.Devre'; allTabs.add(tab); }
      else if (groupKey.includes('second-half')) { tab = '2.Devre'; allTabs.add(tab); }
      else if (groupKey.includes('corner')) { tab = 'Korner'; allTabs.add(tab); }
      else if (groupKey.includes('set|')) { tab = `${groupKey.split('|')[1]}.Set`; allTabs.add(tab); }
      else allTabs.add(tab);
      
      groupMarkets[groupKey].forEach((marketStr: string) => {
        const parts = marketStr.split('|');
        const marketId = parts[0];
        const type = parts[1];
        const arg = parts[2];
        const selectionsStr = parts.find(p => p.includes('~home~') || p.includes('~away~') || p.includes('~over~') || p.includes('~under~') || p.includes('~odd~') || p.includes('~even~'));
        
        if (!selectionsStr) return;
        
        let marketName = '';
        if (type === '1x2' || type === '12') marketName = 'Maç Sonucu';
        else if (type === 'ou') { marketName = 'Alt/Üst' + (arg ? ` (${arg})` : ''); allTabs.add('Alt/Üst'); }
        else if (type === 'ah') { marketName = 'Asya Handikap' + (arg ? ` (${arg})` : ''); allTabs.add('Handikap'); }
        else if (type === 'ou_home') marketName = 'Ev Sahibi Alt/Üst' + (arg ? ` (${arg})` : '');
        else if (type === 'ou_away') marketName = 'Deplasman Alt/Üst' + (arg ? ` (${arg})` : '');
        else if (type === 'oe') marketName = 'Tek/Çift';
        else marketName = type;
        
        if (tab !== 'Taraf' && tab !== 'HEPSİ') {
           marketName = `${tab} ${marketName}`;
        }

        const selections = selectionsStr.split('!');
        const parsedSelections: Record<string, string> = {};
        selections.forEach(s => {
           const sParts = s.split('~');
           if (sParts.length > 2) parsedSelections[sParts[1]] = parseFloat(sParts[2]).toFixed(2);
        });
        
        // Formatting specific market types
        if (type === '1x2') {
           parsedMarkets.push({
             tab, id: marketId, name: marketName, renderType: '1x2',
             options: [
               { label: '1', value: parsedSelections['home'] || '-' },
               { label: 'X', value: parsedSelections['draw'] || '-' },
               { label: '2', value: parsedSelections['away'] || '-' }
             ]
           });
        } else if (type === '12') {
           parsedMarkets.push({
             tab, id: marketId, name: marketName, renderType: '1x2',
             options: [
               { label: '1', value: parsedSelections['home'] || '-' },
               { label: '2', value: parsedSelections['away'] || '-' }
             ]
           });
        } else if (type === 'ou' || type === 'ou_home' || type === 'ou_away') {
           // We might have multiple 'ou' rows. We will group them later or just show them as individual accordions for now.
           parsedMarkets.push({
             tab: type === 'ou' ? 'Alt/Üst' : tab, id: marketId, name: marketName, renderType: 'over_under',
             rows: [{
               overLabel: 'Üst', overValue: parsedSelections['over'] || '-',
               underLabel: 'Alt', underValue: parsedSelections['under'] || '-'
             }]
           });
        } else if (type === 'ah') {
           parsedMarkets.push({
             tab: 'Handikap', id: marketId, name: marketName, renderType: 'over_under', // Use over_under 2-col layout for handicap
             rows: [{
               overLabel: '1', overValue: parsedSelections['home'] || '-',
               underLabel: '2', underValue: parsedSelections['away'] || '-'
             }]
           });
        } else {
           parsedMarkets.push({
             tab, id: marketId, name: marketName, renderType: '1x2',
             options: Object.keys(parsedSelections).map(k => ({ label: k.toUpperCase(), value: parsedSelections[k] }))
           });
        }
      });
    });
    
    // Sort tabs based on standard order
    const standardOrder = ['HEPSİ', 'Taraf', 'Alt/Üst', 'Korner', 'Goller', '1.Devre', '2.Devre', 'Handikap'];
    const sortedTabs = Array.from(allTabs).sort((a, b) => {
       const aIdx = standardOrder.indexOf(a);
       const bIdx = standardOrder.indexOf(b);
       if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
       if (aIdx !== -1) return -1;
       if (bIdx !== -1) return 1;
       return a.localeCompare(b);
    });

    return { tabs: sortedTabs, markets: parsedMarkets };
  };

  const { tabs, markets } = parseMarkets();
  
  // Filter markets by active tab
  const displayMarkets = activeTab === 'HEPSİ' 
    ? markets 
    : markets.filter(m => m.tab === activeTab || m.name.includes(activeTab));

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
          
          {displayMarkets.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
               <span className="text-[#5c677d] text-[12px] font-bold">Bu kategori için market bulunamadı.</span>
            </div>
          )}
          
          {displayMarkets.map((market, idx) => {
            const isOpen = openAccordions[market.name] !== false; // Default true
            
            return (
              <div key={idx} className="bg-[#12141a] rounded-[4px] border border-[#1f232b]">
                
                {/* Accordion Header */}
                <button 
                  onClick={() => toggleAccordion(market.name)}
                  className="w-full h-10 flex items-center justify-between px-4 bg-[#161922] hover:bg-[#1a1d24] transition-colors"
                >
                  <span className="text-[#a0a5b5] font-bold text-[12px]">{market.name}</span>
                  <div className="flex items-center gap-3">
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
                    
                    {market.renderType === '1x2' && market.options && (
                      <div className="flex items-center gap-1.5">
                        {market.options.map((opt: any, i: number) => (
                          <button 
                            key={i} 
                            className={`flex-1 h-9 rounded-[4px] flex items-center justify-between px-3 transition-all bg-[#1a1d24] border border-[#2c313c] hover:bg-[#2c313c] text-white`}
                          >
                            <span className="font-bold text-[11px] text-[#a0a5b5]">{opt.label}</span>
                            <span className={`font-black text-[12px] ${opt.value !== '-' ? 'text-[#00E676]' : 'text-[#f2a900]'}`}>
                              {opt.value}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {market.renderType === 'over_under' && market.rows && (
                      <div className="flex flex-col gap-1.5">
                        {market.rows.map((row: any, i: number) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <button 
                              className={`flex-1 h-9 rounded-[4px] flex items-center justify-between px-3 transition-all bg-[#1a1d24] border border-[#2c313c] hover:bg-[#2c313c] text-white`}
                            >
                              <span className="font-bold text-[11px] text-[#a0a5b5]">{row.overLabel}</span>
                              <span className={`font-black text-[12px] ${row.overValue !== '-' ? 'text-[#00E676]' : 'text-[#f2a900]'}`}>
                                {row.overValue}
                              </span>
                            </button>
                            <button 
                              className={`flex-1 h-9 rounded-[4px] flex items-center justify-between px-3 transition-all bg-[#1a1d24] border border-[#2c313c] hover:bg-[#2c313c] text-white`}
                            >
                              <span className="font-bold text-[11px] text-[#a0a5b5]">{row.underLabel}</span>
                              <span className={`font-black text-[12px] ${row.underValue !== '-' ? 'text-[#00E676]' : 'text-[#f2a900]'}`}>
                                {row.underValue}
                              </span>
                            </button>
                          </div>
                        ))}
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
