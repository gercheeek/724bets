import React, { useEffect, useState } from 'react';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { MARKET_GROUP_NAMES, getMarketCategory, getSelectionLabel } from './1xbetDictionary';

interface MatchDetailsProps {
  match: any;
  onBack: () => void;
}

const MatchDetails1xBetView: React.FC<MatchDetailsProps> = ({ match, onBack }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subGameTab, setSubGameTab] = React.useState('Ana Bahisler');
  const [activeTab, setActiveTab] = React.useState('Tümü');
  const [searchQuery, setSearchQuery] = React.useState('');
  const { betSlip, addSelection, removeSelection } = useBetSlip();

  useEffect(() => {
    let isMounted = true;
    let timer: any;

    const fetchDetails = async () => {
      try {
        const isLive = match.isLive !== false && (!match.time || match.time.includes("'"));
        const res = await fetch(`http://localhost:3001/api/1xbet/match/${match.id}?isLive=${isLive}`);
        const data = await res.json();
        if (isMounted) {
          if (data && data.Value) {
            setDetails(data.Value);
          } else if (!details) {
            // Only set to null if we don't have any existing details to show
            setDetails(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch match details', err);
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();
    timer = setInterval(fetchDetails, 5000); // refresh every 5s

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [match.id]);

  if (loading && !details) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-gray-400">
        <div className="animate-pulse">Maç detayları yükleniyor...</div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-gray-400 border border-white/5 bg-[#101418]/80 rounded-xl">
        <div className="flex flex-col items-center gap-4">
           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
           <span className="text-zinc-400 font-medium">Şu an bu maç için detay verisi alınamıyor veya maç bitti.</span>
           <button onClick={onBack} className="mt-2 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-md text-sm font-bold text-white transition-colors">Bültene Dön</button>
        </div>
      </div>
    );
  }

  const OddsButton = ({ eventObj, label, val, isSelected, handleToggle }: any) => {
    const prevValRef = React.useRef<number | null>(null);
    const [flashClass, setFlashClass] = React.useState<string>('');

    React.useEffect(() => {
      const numericVal = parseFloat(String(val).replace(',', '.'));
      if (!isNaN(numericVal) && prevValRef.current !== null) {
        if (numericVal > prevValRef.current) {
          setFlashClass('animate-flash-green');
        } else if (numericVal < prevValRef.current) {
          setFlashClass('animate-flash-red');
        }
        const timer = setTimeout(() => setFlashClass(''), 2000);
        return () => clearTimeout(timer);
      }
      prevValRef.current = isNaN(numericVal) ? null : numericVal;
    }, [val]);

    if (val === '-' || val === undefined || val === null) {
      return (
        <div className="relative bg-[#131517] border border-[#1b2228] rounded-md flex items-center justify-between px-4 py-2.5 min-h-[44px] opacity-50 cursor-not-allowed">
          <span className="text-[12px] font-medium text-zinc-500">{label}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      );
    }

    return (
      <button
        key={eventObj.T}
        onClick={handleToggle}
        className={`relative group overflow-hidden rounded-xl border flex items-center justify-between px-4 py-3 transition-all duration-300 min-h-[52px] ${isSelected ? 'border-[color:var(--theme-accent)] shadow-[0_0_20px_var(--theme-accent-glow)] bg-[color:var(--theme-accent)]/10' : 'bg-gradient-to-br from-[#1c222b] to-[#12161b] border-white/5 hover:border-white/15 shadow-lg hover:shadow-[0_8px_25px_rgba(0,0,0,0.5)]'} ${flashClass}`}
      >
        {!isSelected && <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-300"></div>}
        {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[color:var(--theme-accent)]/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>}
        <span className={`text-[12px] md:text-[13px] leading-tight font-medium ${isSelected ? 'text-white font-bold' : 'text-zinc-400 group-hover:text-zinc-200'} relative z-10 transition-colors break-words text-left pr-2`}>{label}</span>
        <span className={`font-black text-[14px] md:text-[15px] ${isSelected ? 'text-[color:var(--theme-accent)] drop-shadow-[0_0_8px_var(--theme-accent)]' : 'text-sports-accent group-hover:brightness-125 group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]'} relative z-10 transition-all shrink-0`}>
          {val}
        </span>
      </button>
    );
  };

  const getOddsButton = (marketId: number, marketName: string, eventObj: any) => {
    if (!eventObj) return null;
    
    const val = eventObj.C;
    const label = getSelectionLabel(eventObj.T, eventObj.P);

    const selectionName = `T${eventObj.T}_P${eventObj.P || 0}`;
    const selectionId = `${match.id}_${selectionName}`;
    const isSelected = betSlip.some(b => b.id === selectionId);

    const handleToggle = () => {
      if (isSelected) {
        removeSelection(selectionId);
      } else {
        addSelection({
          id: selectionId,
          matchId: match.id,
          matchName: `${match.homeTeam || match.O1 || 'Ev Sahibi'} vs ${match.awayTeam || match.O2 || 'Deplasman'}`,
          selectionName: `${marketName}: ${label}`,
          odd: parseFloat(String(val).replace(',', '.')) || 1.00
        });
        window.dispatchEvent(new CustomEvent('open-betslip'));
      }
    };

    return <OddsButton key={`${eventObj.T}_${eventObj.P || 0}`} eventObj={eventObj} label={label} val={val} isSelected={isSelected} handleToggle={handleToggle} />;
  };

  return (
    <div className="w-full text-white pb-20">
      
      <div className="bg-[#101418]/80 backdrop-blur-xl rounded-xl p-6 md:p-8 mb-6 flex flex-col items-center justify-center border border-white/10 relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        {/* Dynamic Premium Glow Background */}
        <div className="absolute top-0 left-0 w-[50%] h-[150%] bg-blue-500/10 blur-[100px] pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[50%] h-[150%] bg-red-500/10 blur-[100px] pointer-events-none rounded-full translate-x-1/2 translate-y-1/2"></div>
        
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {/* BREADCRUMBS */}
        <div className="w-full flex flex-col items-center justify-center mb-8 relative z-10 text-center">
          <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--theme-accent)]/80 font-black mb-2 flex items-center gap-3">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-[color:var(--theme-accent)]/50"></span>
            {details.SN || 'Futbol'} &bull; {details.L || 'Turnuva'}
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-[color:var(--theme-accent)]/50"></span>
          </div>
          <div className="text-[12px] text-white/60 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5 font-medium shadow-inner">
            {details.S ? new Date(details.S * 1000).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' }) : 'Bilinmiyor'}
          </div>
        </div>

        <div className="w-full flex items-center justify-between z-10 max-w-3xl mx-auto">
          {/* Home Team */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-black/50 rounded-full flex items-center justify-center p-3 mb-4 border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] relative group hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src={`http://localhost:3001/api/logo/${details.O1I}?name=${encodeURIComponent(details.O1)}`}
                alt={details.O1} 
                className="w-full h-full object-contain relative z-10 drop-shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.fallback-initials')) {
                    const initials = details.O1.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                    const div = document.createElement('div');
                    div.className = 'fallback-initials absolute inset-0 flex items-center justify-center text-white font-black text-2xl md:text-3xl tracking-tighter bg-gradient-to-br from-slate-800 to-black rounded-full border border-white/10 shadow-inner z-20';
                    div.innerText = initials;
                    parent.appendChild(div);
                  }
                }}
              />
            </div>
            <span className="text-white font-black text-center text-base md:text-xl px-2 break-words max-w-[140px] md:max-w-[200px] leading-tight drop-shadow-md">
              {details.O1}
            </span>
          </div>

          {/* Score Area */}
          <div className="flex flex-col items-center px-4 md:px-8 flex-1 z-20">
            <div className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.2)]">
               {details.SC?.I !== 3 && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]"></span>}
               <span className="text-red-500 font-bold text-[13px] tracking-widest whitespace-nowrap drop-shadow-md">
                 {details.SC?.I === 3 ? "DEVRE ARASI" : details.SC?.TS ? Math.floor(details.SC.TS/60) + "'" : "CANLI"}
               </span>
            </div>
            <div className="bg-black/60 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] text-4xl md:text-6xl font-black text-white flex items-center gap-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
              <span className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{details.SC?.FS?.S1 || 0}</span>
              <span className="text-zinc-600 text-3xl font-light">-</span>
              <span className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{details.SC?.FS?.S2 || 0}</span>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-black/50 rounded-full flex items-center justify-center p-3 mb-4 border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] relative group hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src={`http://localhost:3001/api/logo/${details.O2I}?name=${encodeURIComponent(details.O2)}`}
                alt={details.O2} 
                className="w-full h-full object-contain relative z-10 drop-shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.fallback-initials')) {
                    const initials = details.O2.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                    const div = document.createElement('div');
                    div.className = 'fallback-initials absolute inset-0 flex items-center justify-center text-white font-black text-2xl md:text-3xl tracking-tighter bg-gradient-to-br from-slate-800 to-black rounded-full border border-white/10 shadow-inner z-20';
                    div.innerText = initials;
                    parent.appendChild(div);
                  }
                }}
              />
            </div>
            <span className="text-white font-black text-center text-base md:text-xl px-2 break-words max-w-[140px] md:max-w-[200px] leading-tight drop-shadow-md">
              {details.O2}
            </span>
          </div>
        </div>
      </div>

      {/* SUBGAMES TABS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-4 border-b border-[#1b2228] pb-0.5">
        {['Ana Bahisler', ...(details.SG ? details.SG.map((sg: any) => sg.PN) : [])].map((tab: string) => (
          <button
            key={tab}
            onClick={() => { setSubGameTab(tab); setActiveTab('Tümü'); }}
            className={`whitespace-nowrap px-5 py-2.5 text-[14px] font-black transition-all border-b-2 ${
              subGameTab === tab 
                ? 'border-blue-500 text-white' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CATEGORY TABS & SEARCH */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {['Tümü', 'Ana Bahisler', 'Handikap', 'Toplam Alt/Üst', 'Gol Bahisleri', 'Korner', 'Kartlar', 'Diğer'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold transition-all border ${
                activeTab === tab 
                  ? 'bg-sports-accent border-sports-accent text-white shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative min-w-[200px] md:min-w-[250px]">
          <input
            type="text"
            placeholder="Bahis Ara... (Örn: Korner)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#101418]/80 border border-white/10 rounded-xl py-2 pl-4 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-sports-accent focus:ring-1 focus:ring-sports-accent"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* MARKETS LIST */}
      <div className="flex flex-col gap-4">
        {(() => {
          const activeGE = subGameTab === 'Ana Bahisler' 
            ? (details.GE || []) 
            : (details.SG?.find((sg: any) => sg.PN === subGameTab)?.GE || []);

          const filteredGroups = activeGE.filter((group: any) => {
            const fallbackTitle = (() => {
              const cat = getMarketCategory(group.G);
              if (cat !== 'Diğer') return `${cat} (Özel)`;
              
              if (group.E && group.E[0] && group.E[0][0]) {
                const firstLabel = getSelectionLabel(group.E[0][0].T, group.E[0][0].P);
                if (firstLabel.includes('Üst') || firstLabel.includes('Alt')) return 'Toplam Alt/Üst';
                if (firstLabel.includes('Evet') || firstLabel.includes('Hayır')) return 'Özel Bahisler';
                if (firstLabel.includes('Tek') || firstLabel.includes('Çift')) return 'Tek/Çift Bahisleri';
              }
              
              return 'Ekstra Bahisler';
            })();

            const marketTitle = MARKET_GROUP_NAMES[group.G] || fallbackTitle;
            
            // Add marketTitle temporarily to group object so we can use it in rendering without recalculating
            group._marketTitle = marketTitle;

            if (activeTab !== 'Tümü' && getMarketCategory(group.G) !== activeTab) return false;
            if (searchQuery && !marketTitle.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
          });

          if (filteredGroups.length === 0) {
            return (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-[#101418]/40 backdrop-blur-md rounded-xl border border-white/5 shadow-inner mt-2">
                <svg className="w-16 h-16 text-zinc-700 mb-4 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-zinc-400 font-medium text-sm md:text-base px-6">
                  Bu sekmede <span className="text-zinc-300 font-bold">{searchQuery ? `"${searchQuery}"` : "bu kategoriye"}</span> ait bahis bulunamadı.
                </span>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="mt-4 px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-[13px] font-medium transition-all">
                    Aramayı Temizle
                  </button>
                )}
              </div>
            );
          }

          return filteredGroups.map((group: any, idx: number) => {
            const marketTitle = group._marketTitle || `Bahis Grubu #${group.G}`;
            const isMatrix = group.G === 10 || group.E.flat().length > 15;

            return (
              <div key={`${group.G}_${idx}`} className="bg-[#101418]/80 backdrop-blur-xl rounded-xl flex flex-col w-full overflow-hidden transition-all duration-300 relative border border-white/5 shadow-lg">
                <div className="w-full flex items-center justify-between p-4 transition-all relative z-10 bg-transparent border-b border-white/5">
                  <div className="flex items-center gap-3 pl-1">
                     <div className="w-1 h-4 bg-[color:var(--theme-accent)] rounded-full shadow-[0_0_8px_var(--theme-accent-glow)]"></div>
                     <h3 className="text-white font-bold text-[14px] tracking-wide">{marketTitle}</h3>
                  </div>
                </div>
                <div className={`p-4 bg-transparent relative z-10 grid gap-2 ${isMatrix ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : 'grid-cols-2 md:grid-cols-3'}`}>
                  {group.E.flat().map((eventObj: any, eIdx: number) => (
                    <React.Fragment key={`${eIdx}_${eventObj.T}`}>
                      {getOddsButton(group.G, marketTitle, eventObj)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
};

export default MatchDetails1xBetView;
