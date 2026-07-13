import React, { useState, useEffect } from 'react';
import { 
  Trophy, Globe, Target, Circle, Activity, Dribbble, MessageCircle, BarChart2, Info,
  ChevronDown, ChevronUp, Search, PlayCircle, Shield
} from 'lucide-react';

interface SportsDashboardV3Props {
  onNavigate: (view: string) => void;
}

const SportsDashboardV3: React.FC<SportsDashboardV3Props> = ({ onNavigate }) => {
  const [activeLeftTab, setActiveLeftTab] = useState<'spor' | 'canli'>('spor');
  const [activeRightTab, setActiveRightTab] = useState<'bilgi' | 'tv'>('bilgi');
  const [openSports, setOpenSports] = useState<Record<string, boolean>>({
    'futbol': true,
    'basketbol': true,
    'tenis': true
  });
  const [expandedMatches, setExpandedMatches] = useState<Record<string, boolean>>({});

  const toggleMatch = (matchId: string) => {
    setExpandedMatches(prev => ({ ...prev, [matchId]: !prev[matchId] }));
  };

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const apiUrl = isLocal ? 'http://localhost:3000/api/maclar' : '/api/maclar';
        
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Sunucuya bağlanılamadı. Lütfen sunucunun (server.js) çalıştığından emin olun.');
        const json = await res.json();
        if (json.success) {
          setMatches(json.data);
        } else {
          throw new Error(json.message || 'API Hatası');
        }
      } catch (err: any) {
        setError(err.message || 'Bilinmeyen bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const toggleSport = (sport: string) => {
    setOpenSports(prev => ({ ...prev, [sport]: !prev[sport] }));
  };

  const leagues = [
    { name: 'Türkiye, Süper Lig', icon: <img src="https://flagcdn.com/w20/tr.png" alt="TR" className="w-4 h-4 rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" /> },
    { name: 'UEFA Şampiyonlar Ligi', icon: <Globe className="w-4 h-4 text-zinc-500 group-hover:text-[#00FFA3] transition-colors" /> },
    { name: 'İngiltere Premier Ligi', icon: <img src="https://flagcdn.com/w20/gb-eng.png" alt="EN" className="w-4 h-4 rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" /> },
    { name: 'İngiltere Championship', icon: <img src="https://flagcdn.com/w20/gb-eng.png" alt="EN" className="w-4 h-4 rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" /> },
    { name: 'İspanya LaLiga', icon: <img src="https://flagcdn.com/w20/es.png" alt="ES" className="w-4 h-4 rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" /> },
    { name: 'İtalya Serie A', icon: <img src="https://flagcdn.com/w20/it.png" alt="IT" className="w-4 h-4 rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" /> },
    { name: 'Fransa Ligue 1', icon: <img src="https://flagcdn.com/w20/fr.png" alt="FR" className="w-4 h-4 rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" /> },
    { name: 'Hollanda Eredivisie', icon: <img src="https://flagcdn.com/w20/nl.png" alt="NL" className="w-4 h-4 rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" /> },
    { name: 'Almanya Bundesliga', icon: <img src="https://flagcdn.com/w20/de.png" alt="DE" className="w-4 h-4 rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" /> },
    { name: 'Portekiz Primeira Liga', icon: <img src="https://flagcdn.com/w20/pt.png" alt="PT" className="w-4 h-4 rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" /> },
    { name: 'Brezilya Serie A', icon: <img src="https://flagcdn.com/w20/br.png" alt="BR" className="w-4 h-4 rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" /> },
    { name: 'ABD, MLS', icon: <img src="https://flagcdn.com/w20/us.png" alt="US" className="w-4 h-4 rounded-full opacity-80 grayscale group-hover:grayscale-0 transition-all" /> },
    { name: 'Erkekler Avrupa Lig', icon: <Globe className="w-4 h-4 text-zinc-500 group-hover:text-[#00FFA3] transition-colors" /> },
    { name: 'NBA', icon: <Dribbble className="w-4 h-4 text-zinc-500 group-hover:text-[#00FFA3] transition-colors" /> },
  ];

  const filteredMatches = matches.filter(m => {
    if (activeLeftTab === 'canli') return m.isLive === true;
    if (activeLeftTab === 'spor') return m.isLive === false;
    return true;
  });

  const footballMatches = filteredMatches.filter(m => m.sport === 'futbol');
  const basketballMatches = filteredMatches.filter(m => m.sport === 'basketbol');
  const tennisMatches = filteredMatches.filter(m => m.sport === 'tenis');

  const renderExpandedMarkets = (match: any) => (
    <div className="bg-gradient-to-b from-[#0B0D12] to-[#09090b] border-b border-[#202532]/50 p-5 shadow-inner">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[#00FFA3] text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,255,163,0.3)]">
          <Target className="w-4 h-4" /> Seçili Maçın Bahisleri
        </span>
        <span className="text-zinc-500 text-[10px] uppercase font-bold bg-[#12161E] px-2 py-1 rounded border border-[#202532]">+ {match.marketsAvailable || 72} Ekstra Seçenek</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#12161E] border border-[#202532] rounded-lg p-2 hover:border-[#00FFA3]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,163,0.05)] group">
          <div className="text-zinc-400 text-[10px] uppercase font-bold mb-2 text-center group-hover:text-zinc-300 transition-colors">Çifte Şans</div>
          <div className="flex items-center gap-1">
            <button className="flex-1 h-9 bg-[#1A1D24] rounded text-xs text-zinc-300 font-bold hover:text-[#00FFA3] hover:bg-[#00FFA3]/10 hover:border hover:border-[#00FFA3]/30 transition-all">1.25</button>
            <button className="flex-1 h-9 bg-[#1A1D24] rounded text-xs text-zinc-300 font-bold hover:text-[#00FFA3] hover:bg-[#00FFA3]/10 hover:border hover:border-[#00FFA3]/30 transition-all">1.18</button>
            <button className="flex-1 h-9 bg-[#1A1D24] rounded text-xs text-zinc-300 font-bold hover:text-[#00FFA3] hover:bg-[#00FFA3]/10 hover:border hover:border-[#00FFA3]/30 transition-all">1.40</button>
          </div>
        </div>
        
        <div className="bg-[#12161E] border border-[#202532] rounded-lg p-2 hover:border-[#00FFA3]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,163,0.05)] group">
          <div className="text-zinc-400 text-[10px] uppercase font-bold mb-2 text-center group-hover:text-zinc-300 transition-colors">Karşılıklı Gol</div>
          <div className="flex items-center gap-1">
            <button className="flex-1 h-9 bg-[#1A1D24] rounded text-xs text-zinc-300 font-bold hover:text-[#00FFA3] hover:bg-[#00FFA3]/10 hover:border hover:border-[#00FFA3]/30 transition-all flex justify-between px-3 items-center"><span className="text-zinc-500 font-normal group-hover:text-zinc-400">Var</span> 1.85</button>
            <button className="flex-1 h-9 bg-[#1A1D24] rounded text-xs text-zinc-300 font-bold hover:text-[#00FFA3] hover:bg-[#00FFA3]/10 hover:border hover:border-[#00FFA3]/30 transition-all flex justify-between px-3 items-center"><span className="text-zinc-500 font-normal group-hover:text-zinc-400">Yok</span> 1.95</button>
          </div>
        </div>

        <div className="col-span-2 bg-[#12161E] border border-[#202532] rounded-lg p-2 hover:border-[#00FFA3]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,163,0.05)] group">
          <div className="text-zinc-400 text-[10px] uppercase font-bold mb-2 text-center group-hover:text-zinc-300 transition-colors">Toplam Alt/Üst (2.5)</div>
          <div className="flex items-center gap-1">
            <button className="flex-1 h-9 bg-[#1A1D24] rounded text-xs text-zinc-300 font-bold hover:text-[#00FFA3] hover:bg-[#00FFA3]/10 hover:border hover:border-[#00FFA3]/30 transition-all flex justify-between px-6 items-center"><span className="text-zinc-500 font-normal group-hover:text-zinc-400">Alt</span> 2.10</button>
            <button className="flex-1 h-9 bg-[#1A1D24] rounded text-xs text-zinc-300 font-bold hover:text-[#00FFA3] hover:bg-[#00FFA3]/10 hover:border hover:border-[#00FFA3]/30 transition-all flex justify-between px-6 items-center"><span className="text-zinc-500 font-normal group-hover:text-zinc-400">Üst</span> 1.65</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex w-full h-full bg-[#09090b] text-zinc-300 font-sans overflow-hidden">
      
      {/* ─── LEFT SIDEBAR (LEAGUES) ─── */}
      <div className="w-[260px] flex-shrink-0 bg-[#12161E] border-r border-[#202532] flex flex-col overflow-y-auto custom-scrollbar">
        
        {/* Banner */}
        <div className="p-3">
          <div className="bg-gradient-to-br from-[#1A1D24] to-[#0D1016] border border-[#202532] rounded-xl p-3 flex items-center gap-3 relative overflow-hidden group cursor-pointer hover:border-[#00FFA3]/30 transition-colors">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#00FFA3]/5 rounded-bl-[100px] pointer-events-none"></div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#00FFA3]/20 to-transparent rounded-lg flex items-center justify-center flex-shrink-0 border border-[#00FFA3]/20 shadow-[0_0_15px_rgba(0,255,163,0.1)]">
              <Trophy className="w-5 h-5 text-[#00FFA3]" />
            </div>
            <div className="flex flex-col relative z-10">
              <span className="text-white font-bold text-sm leading-tight group-hover:text-[#00FFA3] transition-colors">Dünya Kupası</span>
              <span className="text-white/60 text-xs font-medium">2026</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-3 mb-4">
          <button 
            onClick={() => setActiveLeftTab('spor')}
            className={`flex-1 py-2 text-[11px] font-bold tracking-wider uppercase border-b-2 transition-colors ${activeLeftTab === 'spor' ? 'border-[#00FFA3] text-[#00FFA3]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            SPOR BAHİSLERİ
          </button>
          <button 
            onClick={() => setActiveLeftTab('canli')}
            className={`flex-1 py-2 text-[11px] font-bold tracking-wider uppercase border-b-2 transition-colors ${activeLeftTab === 'canli' ? 'border-[#00FFA3] text-[#00FFA3]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            CANLI <span className="bg-[#1A1D24] text-zinc-300 px-1.5 py-0.5 rounded ml-1 text-[10px]">229</span>
          </button>
        </div>

        {/* Filter / Range */}
        <div className="px-4 mb-2 flex items-center justify-between text-xs">
          <div>
            <div className="text-[#00FFA3] font-bold mb-0.5">Tüm</div>
            <div className="text-zinc-500">Etkinlikler</div>
          </div>
          <div className="flex items-center gap-1 w-24">
            <div className="h-1 w-full bg-[#1A1D24] rounded-full relative">
              <div className="absolute top-0 right-0 h-full w-1/2 bg-[#00FFA3] rounded-full shadow-[0_0_8px_rgba(0,255,163,0.5)]"></div>
              <div className="absolute top-1/2 right-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"></div>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-[#202532] my-2"></div>

        {/* League List */}
        <div className="flex-1 flex flex-col px-2 pb-4">
          {leagues.map((league, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#1A1D24] group transition-colors">
              <div className="w-5 flex justify-center">{league.icon}</div>
              <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200">{league.name}</span>
            </div>
          ))}

          <div className="w-full h-px bg-[#202532] my-2"></div>
          
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-[#1A1D24] group transition-colors mt-auto">
            <Activity className="w-4 h-4 text-zinc-500 group-hover:text-[#00FFA3] transition-colors" />
            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200">Popüler Etkinlikler</span>
            <ChevronDown className="w-4 h-4 text-zinc-600 ml-auto" />
          </div>
        </div>
      </div>

      {/* ─── CENTER CONTENT (MATCHES) ─── */}
      <div className="flex-1 flex flex-col bg-[#09090b] overflow-y-auto custom-scrollbar relative">
        <div className="sticky top-0 z-20 bg-[#09090b]/90 backdrop-blur-md px-6 py-4 border-b border-[#202532]">
          <h1 className="text-[#00FFA3] text-xs font-bold tracking-widest uppercase">
            {activeLeftTab === 'canli' ? 'CANLI BAHİS' : 'MAÇ ÖNCESİ / YAKINDA'}
          </h1>
        </div>

        <div className="p-4 flex flex-col gap-4">
          
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-4 border-[#00FFA3] border-t-transparent rounded-full animate-spin"></div>
              <div className="text-[#00FFA3] font-bold text-sm tracking-widest animate-pulse">BÜLTEN YÜKLENİYOR...</div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4 bg-[#12161E] rounded-xl border border-red-500/20">
              <div className="text-red-400 font-bold">⚠️ BAĞLANTI HATASI</div>
              <div className="text-zinc-400 text-xs">{error}</div>
              <button onClick={() => window.location.reload()} className="mt-2 px-4 py-1.5 bg-[#1A1D24] rounded-md text-xs text-[#00FFA3] border border-[#00FFA3]/30 hover:bg-[#00FFA3]/10 transition-colors">Tekrar Dene</button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Football Group */}
              {footballMatches.length > 0 && (
                <div className="bg-[#12161E] rounded-xl overflow-hidden border border-[#202532]">
                  <div 
                    className="flex items-center justify-between px-4 py-3 bg-[#1A1D24] cursor-pointer hover:bg-[#202532] transition-colors"
                    onClick={() => toggleSport('futbol')}
                  >
                    <div className="flex items-center gap-2">
                      {openSports['futbol'] ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                      <span className="text-white text-sm font-bold tracking-wide">Futbol <span className="text-zinc-500 ml-1 font-normal">({footballMatches.length})</span></span>
                    </div>
                    <Activity className="w-4 h-4 text-zinc-400" />
                  </div>

            {openSports['futbol'] && (
              <div className="flex flex-col">
                <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-2 border-b border-[#202532] bg-[#0E1116] text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  <div>Etkinlik</div>
                  <div className="flex items-center gap-2 pr-2">
                    <div className="w-14 text-center">1</div>
                    <div className="w-14 text-center">X</div>
                    <div className="w-14 text-center">2</div>
                    <div className="w-16 text-center">Daha f...</div>
                  </div>
                </div>

                {footballMatches.map((match, i) => (
                  <div key={match.id} className="flex flex-col">
                    <div 
                      onClick={() => toggleMatch(match.id)}
                      className={`grid grid-cols-[1fr_auto] gap-4 px-4 py-3 items-center cursor-pointer hover:bg-gradient-to-r hover:from-[#161A23] hover:to-[#0E1116] transition-all group ${i !== footballMatches.length - 1 && !expandedMatches[match.id] ? 'border-b border-[#202532]/50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center min-w-[24px]">
                          <span className="text-[#00FFA3] font-bold text-[13px]">{match.scoreHome}</span>
                          <span className="text-[#00FFA3] font-bold text-[13px]">{match.scoreAway}</span>
                          <span className="text-zinc-600 text-[10px] mt-1 whitespace-nowrap">{match.time}</span>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <span className="text-zinc-200 text-xs font-medium group-hover:text-[#00FFA3] transition-colors">{match.home}</span>
                          <span className="text-zinc-200 text-xs font-medium group-hover:text-[#00FFA3] transition-colors">{match.away}</span>
                        </div>
                        <div className="flex items-center gap-2 ml-2 mt-1">
                          <div className="flex items-center gap-1 bg-[#1A1D24] px-1.5 py-0.5 rounded text-zinc-400 hover:text-[#00FFA3] hover:bg-[#00FFA3]/10 cursor-pointer transition-all border border-transparent hover:border-[#00FFA3]/20">
                            <MessageCircle className="w-3 h-3" />
                            <span className="text-[10px] font-bold">72</span>
                          </div>
                          <BarChart2 className="w-4 h-4 text-zinc-500 hover:text-[#00FFA3] cursor-pointer transition-colors" />
                          <Info className="w-4 h-4 text-zinc-500 hover:text-[#00FFA3] cursor-pointer transition-colors" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {match.odds.map((odd, idx) => (
                          <button 
                            key={idx}
                            onClick={(e) => e.stopPropagation()} // Prevent row expansion when clicking odds
                            className={`w-${idx === 3 ? '16' : '14'} h-8 rounded flex items-center justify-center text-xs font-bold transition-all
                              ${match.selected === idx 
                                ? 'bg-[#00FFA3]/10 border border-[#00FFA3] text-[#00FFA3] shadow-[0_0_10px_rgba(0,255,163,0.2)]' 
                                : 'bg-[#0E1116] border border-[#202532] text-zinc-300 hover:border-[#00FFA3]/50 hover:text-[#00FFA3] hover:shadow-[0_0_10px_rgba(0,255,163,0.1)]'
                              }
                            `}
                          >
                            {odd}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Expanded Markets */}
                    {expandedMatches[match.id] && renderExpandedMarkets(match)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

          {/* Basketball Group */}
          {basketballMatches.length > 0 && (
            <div className="bg-[#12161E] rounded-xl overflow-hidden border border-[#202532]">
              <div 
                className="flex items-center justify-between px-4 py-3 bg-[#1A1D24] cursor-pointer hover:bg-[#202532] transition-colors"
                onClick={() => toggleSport('basketbol')}
              >
                <div className="flex items-center gap-2">
                  {openSports['basketbol'] ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  <span className="text-white text-sm font-bold tracking-wide">Basketbol <span className="text-zinc-500 ml-1 font-normal">({basketballMatches.length})</span></span>
                </div>
                <Dribbble className="w-4 h-4 text-orange-500" />
              </div>

            {openSports['basketbol'] && (
              <div className="flex flex-col">
                <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-2 border-b border-[#202532] bg-[#0E1116] text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  <div>Etkinlik</div>
                  <div className="flex items-center gap-2 pr-2">
                    <div className="w-14 text-center">1</div>
                    <div className="w-14 text-center">2</div>
                    <div className="w-16 text-center">Daha f...</div>
                  </div>
                </div>

                {basketballMatches.map((match, i) => (
                  <div key={match.id} className="flex flex-col">
                    <div 
                      onClick={() => toggleMatch(match.id)}
                      className={`grid grid-cols-[1fr_auto] gap-4 px-4 py-3 items-center cursor-pointer hover:bg-gradient-to-r hover:from-[#161A23] hover:to-[#0E1116] transition-all group ${i !== basketballMatches.length - 1 && !expandedMatches[match.id] ? 'border-b border-[#202532]/50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center min-w-[24px]">
                          <span className="text-[#00FFA3] font-bold text-[13px]">{match.scoreHome}</span>
                          <span className="text-[#00FFA3] font-bold text-[13px]">{match.scoreAway}</span>
                          <span className="text-zinc-600 text-[10px] mt-1 whitespace-nowrap">{match.time}</span>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <span className="text-zinc-200 text-xs font-medium group-hover:text-[#00FFA3] transition-colors">{match.home}</span>
                          <span className="text-zinc-200 text-xs font-medium group-hover:text-[#00FFA3] transition-colors">{match.away}</span>
                        </div>
                        <div className="flex items-center gap-2 ml-2 mt-1">
                          <div className="flex items-center gap-1 bg-[#1A1D24] px-1.5 py-0.5 rounded text-zinc-400 hover:text-[#00FFA3] hover:bg-[#00FFA3]/10 cursor-pointer transition-all border border-transparent hover:border-[#00FFA3]/20">
                            <MessageCircle className="w-3 h-3" />
                            <span className="text-[10px] font-bold">72</span>
                          </div>
                          <BarChart2 className="w-4 h-4 text-zinc-500 hover:text-[#00FFA3] cursor-pointer transition-colors" />
                          <Info className="w-4 h-4 text-zinc-500 hover:text-[#00FFA3] cursor-pointer transition-colors" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {match.odds.map((odd, idx) => (
                          <button 
                            key={idx}
                            onClick={(e) => e.stopPropagation()} // Prevent row expansion when clicking odds
                            className={`w-${idx === 2 ? '16' : '14'} h-8 rounded flex items-center justify-center text-xs font-bold transition-all
                              ${match.selected === idx 
                                ? 'bg-[#00FFA3]/10 border border-[#00FFA3] text-[#00FFA3] shadow-[0_0_10px_rgba(0,255,163,0.2)]' 
                                : 'bg-[#0E1116] border border-[#202532] text-zinc-300 hover:border-[#00FFA3]/50 hover:text-[#00FFA3] hover:shadow-[0_0_10px_rgba(0,255,163,0.1)]'
                              }
                            `}
                          >
                            {odd}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Expanded Markets */}
                    {expandedMatches[match.id] && renderExpandedMarkets(match)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

          {/* Tennis Group */}
          {tennisMatches.length > 0 && (
            <div className="bg-[#12161E] rounded-xl overflow-hidden border border-[#202532] mb-10">
              <div 
                className="flex items-center justify-between px-4 py-3 bg-[#1A1D24] cursor-pointer hover:bg-[#202532] transition-colors"
                onClick={() => toggleSport('tenis')}
              >
                <div className="flex items-center gap-2">
                  {openSports['tenis'] ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  <span className="text-white text-sm font-bold tracking-wide">Tenis <span className="text-zinc-500 ml-1 font-normal">({tennisMatches.length})</span></span>
                </div>
                <Circle className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>

            {openSports['tenis'] && (
              <div className="flex flex-col">
                <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-2 border-b border-[#202532] bg-[#0E1116] text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  <div>Etkinlik</div>
                  <div className="flex items-center gap-2 pr-2">
                    <div className="w-14 text-center">1</div>
                    <div className="w-14 text-center">2</div>
                    <div className="w-16 text-center">Daha f...</div>
                  </div>
                </div>

                {tennisMatches.map((match, i) => (
                  <div key={match.id} className="flex flex-col">
                    <div 
                      onClick={() => toggleMatch(match.id)}
                      className={`grid grid-cols-[1fr_auto] gap-4 px-4 py-3 items-center cursor-pointer hover:bg-gradient-to-r hover:from-[#161A23] hover:to-[#0E1116] transition-all group ${i !== tennisMatches.length - 1 && !expandedMatches[match.id] ? 'border-b border-[#202532]/50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center min-w-[24px]">
                          <span className="text-[#00FFA3] font-bold text-[13px]">{match.scoreHome}</span>
                          <span className="text-[#00FFA3] font-bold text-[13px]">{match.scoreAway}</span>
                          <span className="text-zinc-600 text-[10px] mt-1 whitespace-nowrap">{match.time}</span>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <span className="text-zinc-200 text-xs font-medium group-hover:text-[#00FFA3] transition-colors">{match.home}</span>
                          <span className="text-zinc-200 text-xs font-medium group-hover:text-[#00FFA3] transition-colors">{match.away}</span>
                        </div>
                        <div className="flex items-center gap-2 ml-2 mt-1">
                          <div className="flex items-center gap-1 bg-[#1A1D24] px-1.5 py-0.5 rounded text-zinc-400 hover:text-[#00FFA3] hover:bg-[#00FFA3]/10 cursor-pointer transition-all border border-transparent hover:border-[#00FFA3]/20">
                            <MessageCircle className="w-3 h-3" />
                            <span className="text-[10px] font-bold">72</span>
                          </div>
                          <BarChart2 className="w-4 h-4 text-zinc-500 hover:text-[#00FFA3] cursor-pointer transition-colors" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {match.odds.map((odd, idx) => (
                          <button 
                            key={idx}
                            onClick={(e) => e.stopPropagation()} // Prevent row expansion when clicking odds
                            className={`w-${idx === 2 ? '16' : '14'} h-8 rounded flex items-center justify-center text-xs font-bold transition-all
                              ${match.selected === idx 
                                ? 'bg-[#00FFA3]/10 border border-[#00FFA3] text-[#00FFA3] shadow-[0_0_10px_rgba(0,255,163,0.2)]' 
                                : 'bg-[#0E1116] border border-[#202532] text-zinc-300 hover:border-[#00FFA3]/50 hover:text-[#00FFA3] hover:shadow-[0_0_10px_rgba(0,255,163,0.1)]'
                              }
                            `}
                          >
                            {odd}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Expanded Markets */}
                    {expandedMatches[match.id] && renderExpandedMarkets(match)}
                  </div>
                ))}
              </div>
            )}
          </div>
          )}
            </>
          )}

        </div>
      </div>

      {/* ─── RIGHT SIDEBAR (LIVE PITCH & SLIP) ─── */}
      <div className="w-[340px] flex-shrink-0 bg-[#12161E] border-l border-[#202532] flex flex-col overflow-y-auto custom-scrollbar">
        
        {/* Top Tabs */}
        <div className="flex bg-[#1A1D24] border-b border-[#202532]">
          <button 
            onClick={() => setActiveRightTab('bilgi')}
            className={`flex-1 py-3 text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-colors ${activeRightTab === 'bilgi' ? 'bg-[#252A36] text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            CANLI BİLGİ <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-black">54</span>
          </button>
          <button 
            onClick={() => setActiveRightTab('tv')}
            className={`flex-1 py-3 text-xs font-bold tracking-wider transition-colors ${activeRightTab === 'tv' ? 'bg-[#252A36] text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            CANLI TV
          </button>
        </div>

        {/* Match Selector */}
        <div className="p-3 bg-[#161A23]">
          <div className="bg-[#1A1D24] border border-[#202532] rounded-lg p-2.5 flex items-center justify-between cursor-pointer hover:border-[#00FFA3]/30 transition-colors">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-medium text-zinc-300 truncate w-56">Wolfsberger AC - Hradec Kralove</span>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        </div>

        {/* Match Context Header */}
        <div className="text-center py-2 text-xs font-bold text-zinc-400 bg-[#12161E]">
          Kulüp Dostluk
        </div>

        {/* Scoreboard */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#12161E]">
          <span className="text-sm font-bold text-white flex-1 text-right">Wolfsberger AC</span>
          <div className="flex items-center gap-2 mx-4">
            <div className="bg-[#1A1D24] px-2 py-1 rounded text-[#00FFA3] font-bold border border-[#00FFA3]/20 shadow-[0_0_10px_rgba(0,255,163,0.1)]">0</div>
            <span className="text-zinc-500 font-bold">:</span>
            <div className="bg-[#1A1D24] px-2 py-1 rounded text-[#00FFA3] font-bold border border-[#00FFA3]/20 shadow-[0_0_10px_rgba(0,255,163,0.1)]">0</div>
          </div>
          <span className="text-sm font-bold text-white flex-1 text-left">Hradec Kralove</span>
        </div>

        {/* Live Pitch Graphic */}
        <div className="w-full px-3 py-2">
          <div className="w-full aspect-[2/1] bg-[#2E7D32] relative rounded overflow-hidden border-2 border-white/20">
            {/* Pitch Lines */}
            <div className="absolute inset-0 border-2 border-white/30 m-2"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30 transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-12 h-12 border-2 border-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Penalty Boxes */}
            <div className="absolute top-1/2 left-2 w-12 h-20 border-2 border-white/30 transform -translate-y-1/2 border-l-0"></div>
            <div className="absolute top-1/2 right-2 w-12 h-20 border-2 border-white/30 transform -translate-y-1/2 border-r-0"></div>
            
            {/* Six yard boxes */}
            <div className="absolute top-1/2 left-2 w-4 h-8 border-2 border-white/30 transform -translate-y-1/2 border-l-0"></div>
            <div className="absolute top-1/2 right-2 w-4 h-8 border-2 border-white/30 transform -translate-y-1/2 border-r-0"></div>

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2E7D32]/80 to-transparent w-1/2"></div>
            
            {/* Active Elements */}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-bold backdrop-blur-sm border border-white/10 z-10">
              Topa Sahip
            </div>
            <div className="absolute top-2 right-2 bg-black/80 text-[#00FFA3] text-[10px] px-2 py-1 rounded font-bold border border-[#00FFA3]/30 shadow-[0_0_10px_rgba(0,255,163,0.2)] z-10">
              03:50
            </div>

            {/* Ball */}
            <div className="absolute top-1/2 left-[30%] w-3 h-3 bg-white rounded-full border border-red-500 shadow-[0_0_10px_rgba(255,255,255,0.8)] transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="absolute inset-1 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Stats Table */}
        <div className="px-3 pb-4 border-b border-[#202532]">
          <div className="grid grid-cols-[1fr_auto] gap-2 mb-2 px-1">
            <span className="text-[11px] font-bold text-zinc-400">Takımlar</span>
            <div className="flex items-center gap-3">
              <Target className="w-3 h-3 text-zinc-500" />
              <Activity className="w-3 h-3 text-red-500" />
              <div className="w-2.5 h-3.5 bg-yellow-400 rounded-sm"></div>
              <div className="w-2.5 h-3.5 bg-red-500 rounded-sm"></div>
              <Shield className="w-3 h-3 text-zinc-500" />
              <Circle className="w-3 h-3 text-zinc-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-[1fr_auto] gap-2 py-1.5 px-1 hover:bg-[#1A1D24] rounded transition-colors">
            <span className="text-[11px] text-zinc-300 truncate w-32">Wolfsberger AC</span>
            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400 w-[120px] justify-between">
              <span>4</span><span>2</span><span>0</span><span>0</span><span>0</span><span>0</span><span>1</span><span>0</span><span>0</span>
            </div>
          </div>
          
          <div className="grid grid-cols-[1fr_auto] gap-2 py-1.5 px-1 hover:bg-[#1A1D24] rounded transition-colors">
            <span className="text-[11px] text-zinc-300 truncate w-32">Hradec Kralove</span>
            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400 w-[120px] justify-between">
              <span>4</span><span>2</span><span>0</span><span>0</span><span>0</span><span>0</span><span>1</span><span>0</span><span>0</span>
            </div>
          </div>
        </div>

        {/* Coupon Check Section */}
        <div className="p-4 bg-[#161A23]">
          <div className="flex items-center justify-between mb-4 cursor-pointer group">
            <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-wider">KUPON SORGULAMA</span>
            <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="w-4 h-4 rounded-full border-2 border-[#00FFA3] flex items-center justify-center bg-[#09090b]">
                <div className="w-2 h-2 bg-[#00FFA3] rounded-full shadow-[0_0_5px_rgba(0,255,163,0.5)]"></div>
              </div>
              <span className="text-xs font-bold text-white">Diğer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="w-4 h-4 rounded-full border-2 border-zinc-600 flex items-center justify-center group-hover:border-zinc-400 transition-colors"></div>
              <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">Spor Turnuvası</span>
            </label>
          </div>

          <div className="bg-[#1A1D24] border border-[#202532] rounded-lg p-3 mb-3 focus-within:border-[#00FFA3]/50 transition-colors">
            <input 
              type="text" 
              placeholder="Kupon Numarasını Girin" 
              className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-zinc-600"
            />
          </div>

          <button className="w-full bg-[#00FFA3] hover:bg-[#00E676] text-black font-black py-3 rounded-lg text-[11px] tracking-widest uppercase transition-colors shadow-[0_0_15px_rgba(0,255,163,0.2)]">
            KONTROL EDİN
          </button>
        </div>

        {/* Bet Builder Section */}
        <div className="p-4 border-t border-[#202532]">
          <div className="flex items-center justify-between cursor-pointer group">
            <span className="text-xs font-bold text-zinc-500 group-hover:text-white transition-colors uppercase tracking-wider">BAHİS OLUŞTURUCU</span>
            <ChevronDown className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
          </div>
        </div>

      </div>

    </div>
  );
};

export default SportsDashboardV3;
