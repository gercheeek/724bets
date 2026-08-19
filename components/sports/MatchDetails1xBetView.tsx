import React, { useEffect, useState } from 'react';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { MARKET_GROUP_NAMES, getMarketCategory, getSelectionLabel } from './1xbetDictionary';
import teamLogosData from '../../utils/team_logos.json';

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

  const getStat = (k: number, id: number, team: 'S1' | 'S2') => {
    if (!details) return 0;
    if (details.SC?.S) {
      const s = details.SC.S.find((x: any) => x.K === k);
      if (s && s[team] !== undefined) return s[team];
    }
    if (details.SC?.ST) {
      const stGroup = details.SC.ST.find((x: any) => x.Key === 0);
      if (stGroup && stGroup.Value) {
        const s = stGroup.Value.find((x: any) => x.ID === id);
        if (s && s[team] !== undefined) return s[team];
      }
    }
    return 0;
  };

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
    const isBlocked = eventObj?.B === true;

    React.useEffect(() => {
      if (isBlocked) return;
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
    }, [val, isBlocked]);

    if (val === '-' || val === undefined || val === null || isBlocked) {
      return (
        <div className="relative bg-[#131517] border border-[#1b2228] rounded-xl flex items-center justify-between px-4 py-3 min-h-[52px] opacity-50 cursor-not-allowed">
          <span className="text-[12px] md:text-[13px] leading-tight font-medium text-zinc-500 break-words text-left pr-2 flex items-center gap-2">
            {isBlocked && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            )}
            {label}
          </span>
          <span className="font-black text-[14px] md:text-[15px] text-zinc-600">
            {val !== '-' && val !== undefined && val !== null ? val : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </span>
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
        <div className="absolute top-0 left-0 w-[60%] h-[150%] bg-[#00E5FF]/10 blur-[120px] pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-screen"></div>
        <div className="absolute bottom-0 right-0 w-[60%] h-[150%] bg-[#0055FF]/10 blur-[120px] pointer-events-none rounded-full translate-x-1/2 translate-y-1/2 mix-blend-screen"></div>
        
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
            <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-b from-[#1c222b] to-[#0a0f1a] rounded-full flex items-center justify-center p-3 mb-3 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative group hover:scale-105 hover:border-[#00E5FF]/50 transition-all duration-300">
              <div className="absolute inset-0 rounded-full bg-[#00E5FF]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src={`http://localhost:3001/api/logo/${details.O1I}?name=${encodeURIComponent(details.O1)}`}
                alt={details.O1} 
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
                onError={(e) => {
                  const target = e.currentTarget;
                  const name = details.O1 || '';
                  const normName = name.toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '');
                  const localLogo = teamLogosData[normName as keyof typeof teamLogosData] || teamLogosData[name.toLowerCase() as keyof typeof teamLogosData];
                  
                  if (localLogo && target.src !== localLogo) {
                     target.src = localLogo;
                  } else {
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.fallback-initials')) {
                      const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                      const div = document.createElement('div');
                      div.className = 'fallback-initials absolute inset-0 flex items-center justify-center text-white font-black text-xl md:text-3xl tracking-tighter bg-gradient-to-br from-[#1c222b] to-[#0a0f1a] rounded-full border border-[#00E5FF]/30 shadow-[inset_0_0_20px_rgba(34,211,238,0.1),0_4px_15px_rgba(0,0,0,0.6)] z-20';
                      div.innerText = initials;
                      parent.appendChild(div);
                    }
                  }
                }}
              />
            </div>
            <span className="text-white font-bold text-center text-[13px] md:text-[15px] px-2 break-words max-w-[120px] md:max-w-[160px] leading-tight drop-shadow-md">
              {details.O1}
            </span>
          </div>

          {/* Score Area & Stats */}
          <div className="flex flex-col items-center px-2 md:px-4 flex-[1.5] z-20">
            {match.isLive || details.SC ? (
              <>
                <div className="flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                   {details.SC?.I !== 3 && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]"></span>}
                   <span className="text-cyan-400 font-black text-[12px] md:text-[13px] tracking-widest whitespace-nowrap drop-shadow-md">
                     {(() => {
                        if (details.SC?.I === 3) return "DEVRE ARASI";
                        if (details.SC?.TS !== undefined) {
                           const elapsed = Math.floor(details.SC.TS / 60);
                           const period = details.SC.CP || 1;
                           if (period === 1) return elapsed + "'";
                           if (period === 2) return (45 + elapsed) + "'";
                           if (period === 3) return (90 + elapsed) + "'";
                           return elapsed + "'";
                        }
                        return "CANLI";
                     })()}
                   </span>
                </div>
                
                <div className="bg-gradient-to-b from-[#0e1726] to-[#0a0f1a] backdrop-blur-xl px-8 py-3 rounded-2xl border border-cyan-500/30 shadow-[inset_0_1px_0_rgba(34,211,238,0.2),0_8px_32px_rgba(0,0,0,0.8)] text-4xl md:text-6xl font-black text-white flex items-center gap-6 relative overflow-hidden group min-w-[140px] md:min-w-[200px] justify-center tracking-tighter">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/[0.05] to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                  <span className="drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] text-cyan-50">{details.SC?.FS?.S1 || 0}</span>
                  <span className="text-cyan-500/50 text-2xl md:text-3xl font-light">-</span>
                  <span className="drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] text-cyan-50">{details.SC?.FS?.S2 || 0}</span>
                </div>

                {/* Match Stats Bar */}
                {(details.SC?.S || details.SC?.ST) && (
                  <div className="flex items-center justify-center gap-4 mt-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full shadow-inner text-[11px] md:text-xs font-bold w-full max-w-[220px]">
                    {/* Corners */}
                    <div className="flex items-center gap-1.5" title="Kornerler">
                       <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v16"/><path d="M4 4h16l-4 4 4 4H4"/></svg>
                       <span className="text-white">{getStat(2, 70, 'S1')}</span>
                       <span className="text-zinc-600">-</span>
                       <span className="text-white">{getStat(2, 70, 'S2')}</span>
                    </div>
                    {/* Yellow Cards */}
                    <div className="flex items-center gap-1.5" title="Sarı Kartlar">
                       <div className="w-2.5 h-3.5 bg-yellow-400 rounded-sm shadow-[0_0_5px_rgba(250,204,21,0.5)]"></div>
                       <span className="text-white">{getStat(7, 26, 'S1')}</span>
                       <span className="text-zinc-600">-</span>
                       <span className="text-white">{getStat(7, 26, 'S2')}</span>
                    </div>
                    {/* Red Cards */}
                    <div className="flex items-center gap-1.5" title="Kırmızı Kartlar">
                       <div className="w-2.5 h-3.5 bg-red-500 rounded-sm shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
                       <span className="text-white">{getStat(8, 27, 'S1')}</span>
                       <span className="text-zinc-600">-</span>
                       <span className="text-white">{getStat(8, 27, 'S2')}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mb-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner text-zinc-400 text-[11px] md:text-xs font-bold tracking-widest uppercase">
                  Başlamadı
                </div>
                <div className="bg-black/40 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/5 shadow-lg text-3xl md:text-5xl font-black text-zinc-600 flex items-center justify-center min-w-[120px] md:min-w-[160px]">
                  VS
                </div>
              </>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-b from-[#1c222b] to-[#0a0f1a] rounded-full flex items-center justify-center p-3 mb-3 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative group hover:scale-105 hover:border-[#0055FF]/50 transition-all duration-300">
              <div className="absolute inset-0 rounded-full bg-[#0055FF]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src={`http://localhost:3001/api/logo/${details.O2I}?name=${encodeURIComponent(details.O2)}`}
                alt={details.O2} 
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
                onError={(e) => {
                  const target = e.currentTarget;
                  const name = details.O2 || '';
                  const normName = name.toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '');
                  const localLogo = teamLogosData[normName as keyof typeof teamLogosData] || teamLogosData[name.toLowerCase() as keyof typeof teamLogosData];
                  
                  if (localLogo && target.src !== localLogo) {
                     target.src = localLogo;
                  } else {
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.fallback-initials')) {
                      const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                      const div = document.createElement('div');
                      div.className = 'fallback-initials absolute inset-0 flex items-center justify-center text-white font-black text-xl md:text-3xl tracking-tighter bg-gradient-to-br from-[#1c222b] to-[#0a0f1a] rounded-full border border-[#0055FF]/30 shadow-[inset_0_0_20px_rgba(0,85,255,0.1),0_4px_15px_rgba(0,0,0,0.6)] z-20';
                      div.innerText = initials;
                      parent.appendChild(div);
                    }
                  }
                }}
              />
            </div>
            <span className="text-white font-bold text-center text-[13px] md:text-[15px] px-2 break-words max-w-[120px] md:max-w-[160px] leading-tight drop-shadow-md">
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
                if (firstLabel.includes('Üst') || firstLabel.includes('Alt')) return `Toplam Alt/Üst (G:${group.G})`;
                if (firstLabel.includes('Evet') || firstLabel.includes('Hayır')) return `Özel Bahisler (G:${group.G})`;
                if (firstLabel.includes('Tek') || firstLabel.includes('Çift')) return `Tek/Çift Bahisleri (G:${group.G})`;
              }
              
              return `Ekstra Bahisler (ID: ${group.G})`;
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
                  {group.E.flat().map((eventObj: any, eIdx: number, arr: any[]) => {
                    const isLastItemAndOdd = arr.length % 2 !== 0 && eIdx === arr.length - 1;
                    return (
                      <div key={`${eIdx}_${eventObj.T}`} className={`${!isMatrix && isLastItemAndOdd ? 'col-span-2 md:col-span-1' : ''}`}>
                        {getOddsButton(group.G, marketTitle, eventObj)}
                      </div>
                    );
                  })}
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
