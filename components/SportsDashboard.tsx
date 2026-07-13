import React, { useState, useEffect } from 'react';
import { 
  Search, Trophy, Activity, Clock, Flame, 
  ChevronRight, ChevronLeft, ChevronDown, 
  Lock, Settings, BarChart2, Star
} from 'lucide-react';
import { supabase } from '../utils/supabase';

interface SportsDashboardProps {
  onNavigate: () => void;
}

const SportsDashboard: React.FC<SportsDashboardProps> = ({ onNavigate }) => {
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [changedOdds, setChangedOdds] = useState<{[key: string]: 'up' | 'down'}>({});
  
  // Tabs: 0: Ana Sayfa, 1: Canlı Bahis, 2: Gündemdeki, 3: Bahislerim
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await supabase.from('sports_matches').select('*').in('status', ['active', 'suspended']).order('match_date', { ascending: false });
      if (data) setLiveMatches(data);
    };
    fetchMatches();

    const channel = supabase.channel('public:sports_matches')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sports_matches' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          const newMatch = payload.new;
          setLiveMatches(prev => {
            const idx = prev.findIndex(m => m.id === newMatch.id);
            if (idx === -1) return [...prev, newMatch];
            
            const oldMatch = prev[idx];
            const oddsKeys = ['1', 'X', '2', 'tU', 'tA', 'cs1X', 'cs12', 'csX2'];
            const newChangedOdds: {[key: string]: 'up' | 'down'} = {};
            
            oddsKeys.forEach(k => {
              const oldVal = oldMatch.odds?.[k];
              const newVal = newMatch.odds?.[k];
              if (oldVal !== undefined && newVal !== undefined && oldVal !== newVal) {
                newChangedOdds[`${newMatch.id}-${k}`] = newVal > oldVal ? 'up' : 'down';
              }
            });
            
            if (Object.keys(newChangedOdds).length > 0) {
              setChangedOdds(curr => ({ ...curr, ...newChangedOdds }));
              setTimeout(() => {
                 setChangedOdds(curr => {
                    const cleaned = { ...curr };
                    Object.keys(newChangedOdds).forEach(k => delete cleaned[k]);
                    return cleaned;
                 });
              }, 3000);
            }
            
            const next = [...prev];
            next[idx] = newMatch;
            return next;
          });
        } else if (payload.eventType === 'INSERT') {
          setLiveMatches(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setLiveMatches(prev => prev.filter(m => m.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Group matches by league for the Accordion
  const matchesByLeague = liveMatches.reduce((acc, match) => {
    if (!acc[match.league]) acc[match.league] = [];
    acc[match.league].push(match);
    return acc;
  }, {} as Record<string, any[]>);

  const formatOdds = (val: any) => typeof val === 'number' ? val.toFixed(2) : '-';

  return (
    <div className="w-full bg-[#09090b] font-sans text-gray-400 min-h-screen">
      
      <div className="max-w-[1400px] mx-auto px-4 py-6 flex flex-col gap-6">
        
        {/* ── TOP BANNERS (Promos) ── */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
          
          <div className="relative min-w-[320px] h-[160px] rounded-lg overflow-hidden shrink-0 group cursor-pointer bg-gradient-to-br from-amber-900/40 to-black border border-amber-500/20 snap-start">
            <div className="absolute right-0 top-0 bottom-0 w-[180px] pointer-events-none flex justify-end items-center pr-4">
               {/* Shield Image Simulation */}
               <div className="w-[120px] h-[120px] bg-amber-500 rounded-full blur-[40px] opacity-20 absolute right-6"></div>
               <img src="https://cdn.iconscout.com/icon/free/png-256/free-shield-2652933-2202848.png" className="w-[100px] h-[100px] object-contain relative z-10 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" style={{ filter: 'hue-rotate(30deg) sepia(1) saturate(5)'}} alt="Shield"/>
            </div>
            <div className="relative z-10 p-5 flex flex-col justify-between h-full w-[60%]">
              <div>
                <span className="text-[10px] font-black bg-white/10 text-amber-500 px-2 py-0.5 rounded-full mb-3 inline-block shadow-sm uppercase tracking-wider">Dünya Kupası</span>
                <h3 className="text-white font-black text-[18px] leading-tight group-hover:text-amber-500 transition-colors">İlk Golü At,<br/>Kazan</h3>
                <p className="text-[11px] mt-2 text-gray-400 leading-tight">Takımınız ilk golü mü<br/>attı? Ödemenizi alın.</p>
              </div>
              <button className="bg-transparent border border-amber-500/30 hover:bg-amber-500/20 text-amber-500 text-[12px] font-bold py-2 px-4 rounded w-max transition-all duration-300 mt-2">Şimdi Bahis Yap</button>
            </div>
          </div>

          <div className="relative min-w-[320px] h-[160px] rounded-lg overflow-hidden shrink-0 group cursor-pointer bg-gradient-to-br from-[#00FFA3]/20 to-black border border-[#00FFA3]/20 snap-start">
            <div className="absolute right-0 top-0 bottom-0 w-[180px] pointer-events-none flex justify-end items-center pr-4">
               <div className="w-[120px] h-[120px] bg-[#00FFA3] rounded-full blur-[40px] opacity-20 absolute right-6"></div>
               <img src="https://cdn-icons-png.flaticon.com/512/861/861512.png" className="w-[100px] h-[100px] object-contain relative z-10 filter drop-shadow-[0_0_15px_rgba(0,255,163,0.5)]" alt="Football"/>
            </div>
            <div className="relative z-10 p-5 flex flex-col justify-between h-full w-[60%]">
              <div>
                <span className="text-[10px] font-black bg-white/10 text-[#00FFA3] px-2 py-0.5 rounded-full mb-3 inline-block shadow-sm uppercase tracking-wider">Dünya Kupası</span>
                <h3 className="text-white font-black text-[18px] leading-tight group-hover:text-[#00FFA3] transition-colors">Futbol Oran<br/>Artışları</h3>
                <p className="text-[11px] mt-2 text-gray-400 leading-tight">Dünya Futbol Günlük<br/>Oran Artışları</p>
              </div>
              <button className="bg-transparent border border-[#00FFA3]/30 hover:bg-[#00FFA3]/20 text-[#00FFA3] text-[12px] font-bold py-2 px-4 rounded w-max transition-all duration-300 mt-2">Şimdi Bahis Yap</button>
            </div>
          </div>

          <div className="relative min-w-[320px] h-[160px] rounded-lg overflow-hidden shrink-0 group cursor-pointer bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/20 snap-start">
            <div className="absolute right-0 top-0 bottom-0 w-[180px] pointer-events-none flex justify-end items-center pr-4">
               <div className="w-[120px] h-[120px] bg-purple-500 rounded-full blur-[40px] opacity-20 absolute right-6"></div>
               <img src="https://cdn-icons-png.flaticon.com/512/61/61121.png" className="w-[80px] h-[80px] object-contain relative z-10 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] invert opacity-80" alt="Halftime"/>
            </div>
            <div className="relative z-10 p-5 flex flex-col justify-between h-full w-[60%]">
              <div>
                <span className="text-[10px] font-black bg-white/10 text-purple-400 px-2 py-0.5 rounded-full mb-3 inline-block shadow-sm uppercase tracking-wider">Dünya Kupası</span>
                <h3 className="text-white font-black text-[18px] leading-tight group-hover:text-purple-400 transition-colors">Devre Arası<br/>Heyecanı</h3>
                <p className="text-[11px] mt-2 text-gray-400 leading-tight">Dünya Futbolu - DA<br/>Oran Artışları</p>
              </div>
              <button className="bg-transparent border border-purple-500/30 hover:bg-purple-500/20 text-purple-400 text-[12px] font-bold py-2 px-4 rounded w-max transition-all duration-300 mt-2">Şimdi Bahis Yap</button>
            </div>
          </div>

        </div>

        {/* ── SEARCH BAR ── */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Arama 724Bets.com" 
            className="w-full bg-[#13151A] border border-[#2C2F3D] rounded py-2.5 pl-10 pr-4 text-[13px] font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#00FFA3] focus:ring-1 focus:ring-[#00FFA3]/50 transition-all shadow-inner"
          />
        </div>

        {/* ── NAV TABS ── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
          {[
            { id: 0, label: 'Spor Bahisleri Ana Sayfa', icon: <Trophy size={14} className={activeTab === 0 ? "text-[#09090b]" : "text-gray-400"}/> },
            { id: 1, label: 'Canlı Bahis', icon: <Activity size={14} className={activeTab === 1 ? "text-[#09090b]" : "text-gray-400"}/> },
            { id: 2, label: 'Gündemdeki', icon: <Flame size={14} className={activeTab === 2 ? "text-[#09090b]" : "text-gray-400"}/> },
            { id: 3, label: 'Bahislerim', icon: <Clock size={14} className={activeTab === 3 ? "text-[#09090b]" : "text-gray-400"}/> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-300 shrink-0 ${
                activeTab === tab.id 
                ? 'bg-gradient-to-r from-[#00FFA3] to-[#00CC82] text-[#09090b] shadow-[0_0_15px_rgba(0,255,163,0.4)]' 
                : 'bg-[#13151A] text-gray-400 hover:bg-[#1A1D24] hover:text-white border border-[#2C2F3D]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── EN İYİ MAÇLAR (Top Matches) Minimal Kartlar ── */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-white font-black flex items-center gap-2 text-[15px] uppercase tracking-wider">
              <Trophy size={16} className="text-amber-500"/> En İyi Maçlar
            </h2>
            <div className="flex gap-1">
              <button className="p-1.5 rounded border border-[#2C2F3D] bg-[#13151A] hover:bg-[#1A1D24] text-gray-400 hover:text-white transition-colors"><ChevronLeft size={14}/></button>
              <button className="p-1.5 rounded border border-[#2C2F3D] bg-[#13151A] hover:bg-[#1A1D24] text-gray-400 hover:text-white transition-colors"><ChevronRight size={14}/></button>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x pb-2">
            {liveMatches.slice(0, 5).map(match => (
              <div key={match.id} className="min-w-[280px] w-[280px] bg-[#13151A] rounded-xl flex flex-col shrink-0 snap-start overflow-hidden p-3 gap-3 border border-transparent hover:border-[#2C2F3D] transition-colors shadow-lg">
                <div className="flex justify-end w-full">
                  <span className="text-[11px] font-medium text-gray-500">
                    {new Date(match.match_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} {new Date(match.match_date).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <img src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${match.team_home.includes('Fransa') || match.team_home.includes('France') ? 'FR' : 'GB'}.svg`} className="w-5 h-5 rounded-full object-cover shadow-sm" />
                    <span className="text-white font-bold text-[13px]">{match.team_home}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${match.team_away.includes('İspanya') || match.team_away.includes('Spain') ? 'ES' : 'AR'}.svg`} className="w-5 h-5 rounded-full object-cover shadow-sm" />
                    <span className="text-white font-bold text-[13px]">{match.team_away}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-2">
                  <button className="flex-1 bg-[#09090b] border border-[#2C2F3D] hover:border-[#00FFA3]/50 hover:bg-[#0f1115] rounded-lg flex flex-col items-center justify-center py-2 transition-all group">
                     <span className="text-[10px] text-gray-500 mb-0.5 group-hover:text-gray-300">1</span>
                     <span className="text-[14px] font-black text-white group-hover:text-[#00FFA3]">{formatOdds(match.odds?.['1'])}</span>
                  </button>
                  <button className="flex-1 bg-[#09090b] border border-[#2C2F3D] hover:border-[#00FFA3]/50 hover:bg-[#0f1115] rounded-lg flex flex-col items-center justify-center py-2 transition-all group">
                     <span className="text-[10px] text-gray-500 mb-0.5 group-hover:text-gray-300">X</span>
                     <span className="text-[14px] font-black text-white group-hover:text-[#00FFA3]">{formatOdds(match.odds?.['X'])}</span>
                  </button>
                  <button className="flex-1 bg-[#09090b] border border-[#2C2F3D] hover:border-[#00FFA3]/50 hover:bg-[#0f1115] rounded-lg flex flex-col items-center justify-center py-2 transition-all group">
                     <span className="text-[10px] text-gray-500 mb-0.5 group-hover:text-gray-300">2</span>
                     <span className="text-[14px] font-black text-white group-hover:text-[#00FFA3]">{formatOdds(match.odds?.['2'])}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOP SGMS ── */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-white font-black flex items-center gap-2 text-[15px] uppercase tracking-wider">
              <div className="bg-[#00FFA3] text-[#09090b] text-[10px] font-black px-1.5 py-0.5 rounded-sm tracking-tighter mr-1">SGM</div>
              Top SGMs
            </h2>
            <div className="flex gap-1">
              <button className="p-1.5 rounded border border-[#2C2F3D] bg-[#13151A] hover:bg-[#1A1D24] text-gray-400 hover:text-white transition-colors"><ChevronLeft size={14}/></button>
              <button className="p-1.5 rounded border border-[#2C2F3D] bg-[#13151A] hover:bg-[#1A1D24] text-gray-400 hover:text-white transition-colors"><ChevronRight size={14}/></button>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x pb-2">
            {[1, 2, 3].map((item, i) => (
              <div key={i} className="min-w-[340px] w-[340px] bg-[#13151A] border border-[#2C2F3D] rounded-xl flex flex-col shrink-0 snap-start overflow-hidden shadow-lg">
                <div className="p-3 pb-2 flex justify-between items-center bg-[#09090b]/50">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                    <span>14 Tem Sal 22:00</span>
                    <BarChart2 size={12}/>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1"><img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" className="w-3 h-3 opacity-40 invert"/> {i === 0 ? '1.132' : i === 1 ? '877' : '127'}</span>
                    <Star size={14} className="text-amber-500 fill-current drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]"/>
                  </div>
                </div>
                
                <div className="px-3 py-2 flex items-center justify-between pb-4 border-b border-[#2C2F3D]">
                  <img src="https://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg" className="w-6 h-4 rounded-sm object-cover shadow" />
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-white font-bold text-[13px]">Fransa</span>
                    <span className="text-white font-bold text-[13px]">İspanya</span>
                  </div>
                  <img src="https://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg" className="w-6 h-4 rounded-sm object-cover shadow" />
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <span className="text-[#00FFA3] font-black text-[13px]">{i === 1 ? '6 Legs' : '3 Legs'}</span>
                  
                  {i === 1 ? (
                    <>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-white font-bold text-[13px]">
                          <img src="https://cdn-icons-png.flaticon.com/512/861/861512.png" className="w-4 h-4 invert opacity-70" /> üstü 3.5
                        </div>
                        <span className="text-gray-400 text-[11px]">Toplam gol (90' + Oynanmamış Süre)</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-white font-bold text-[13px]">
                          <img src="https://cdn-icons-png.flaticon.com/512/861/861512.png" className="w-4 h-4 invert opacity-70" /> Mbappe, Kylian 2+
                        </div>
                        <span className="text-gray-400 text-[11px]">Oyuncu gol olan şutları (uzatmalar dahil)</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-white font-bold text-[13px]">
                          <img src="https://cdn-icons-png.flaticon.com/512/861/861512.png" className="w-4 h-4 invert opacity-70" /> var
                        </div>
                        <span className="text-gray-400 text-[11px]">Karşılıklı gol (90' + Oynanmamış Süre)</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-white font-bold text-[13px]">
                          <img src="https://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg" className="w-4 h-3 rounded-sm object-cover" /> Fransa
                        </div>
                        <span className="text-gray-400 text-[11px]">1x2 (90' + Oynanmamış Süre)</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-white font-bold text-[13px]">
                          <img src="https://cdn-icons-png.flaticon.com/512/861/861512.png" className="w-4 h-4 invert opacity-70" /> var
                        </div>
                        <span className="text-gray-400 text-[11px]">Karşılıklı gol (90' + Oynanmamış Süre)</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-white font-bold text-[13px]">
                          <img src="https://cdn-icons-png.flaticon.com/512/861/861512.png" className="w-4 h-4 invert opacity-70" /> Mbappe, Kylian
                        </div>
                        <span className="text-gray-400 text-[11px]">Gol atar (90' + Oynanmamış Süre)</span>
                      </div>
                    </>
                  )}

                  <button className="text-gray-400 text-[12px] font-bold text-left hover:text-[#00FFA3] transition-colors mt-1">
                    Çoklu Bahisi Görüntüle &gt;
                  </button>
                </div>

                <div className="p-3 pt-0 mt-auto">
                  <button className="w-full bg-[#09090b] border border-[#2C2F3D] hover:border-[#00FFA3]/50 hover:bg-[#0f1115] rounded-lg py-3 px-4 flex justify-between items-center transition-all group">
                     <span className="text-[12px] text-gray-400 font-medium group-hover:text-white transition-colors">Bahis Kuponuna Ekle</span>
                     <span className="text-[14px] font-black text-[#00FFA3] drop-shadow-[0_0_5px_rgba(0,255,163,0.3)]">{i === 0 ? '4,81' : i === 1 ? '28,12' : '3,52'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── EN İYİ SPORLAR (Categories Grid) ── */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-white font-black flex items-center gap-2 uppercase tracking-wider">
              <Trophy size={18} className="text-amber-500"/> En İyi Sporlar
            </h2>
            <button className="text-[11px] font-bold hover:text-[#00FFA3] transition-colors text-gray-400">Tümünü Görüntüle</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { id: 'soccer', name: 'SOCCER', color: 'from-blue-600 to-blue-900', img: '1' },
              { id: 'cs2', name: 'CS2', color: 'from-yellow-500 to-yellow-700', img: '2' },
              { id: 'tennis', name: 'TENNIS', color: 'from-orange-500 to-orange-800', img: '3' },
              { id: 'basket', name: 'BASKETBALL', color: 'from-red-600 to-red-900', img: '4' },
              { id: 'horse', name: 'HORSE RACING', color: 'from-sky-500 to-sky-800', img: '5' },
              { id: 'fifa', name: 'FIFA', color: 'from-rose-600 to-rose-900', img: '6' },
              { id: 'valo', name: 'VALORANT', color: 'from-fuchsia-600 to-purple-900', img: '7' },
              { id: 'volley', name: 'VOLLEYBALL', color: 'from-amber-500 to-yellow-600', img: '8' }
            ].map(cat => (
              <div key={cat.id} className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer border border-[#2C2F3D] hover:border-white/20 transition-all shadow-lg hover:shadow-2xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                <img src={`https://picsum.photos/seed/${cat.name}/200/300`} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-end justify-center pb-4 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                  <span className="text-white font-black text-sm tracking-widest drop-shadow-md">{cat.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── POPÜLER ETKİNLİKLER (Accordion) ── */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-white font-black flex items-center gap-2 uppercase tracking-wider">
              <Activity size={18} className="text-amber-500"/> Popüler Etkinlikler
            </h2>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
              <button className="flex items-center gap-1 hover:text-white transition-colors">Standart <ChevronDown size={14}/></button>
              <button className="flex items-center gap-1 hover:text-white transition-colors">Kazanan <ChevronDown size={14}/></button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {Object.keys(matchesByLeague).length > 0 ? Object.entries(matchesByLeague).map(([league, matches]) => (
              <div key={league} className="bg-[#13151A] rounded-xl border border-[#2C2F3D] overflow-hidden shadow-lg">
                <div className="px-4 py-3 bg-[#1A1D24] border-b border-[#2C2F3D] flex justify-between items-center cursor-pointer hover:bg-[#1f222b] transition-colors">
                  <span className="text-white font-black text-sm tracking-wide">{league}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="bg-[#09090b] text-[#00FFA3] font-bold px-2 py-0.5 rounded border border-[#00FFA3]/20">{matches.length}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  {matches.map((match, idx) => {
                    const isDisabled = match.status === 'suspended';
                    return (
                      <div key={match.id} className="flex flex-col md:flex-row md:items-center px-4 py-3 border-b border-[#2C2F3D] hover:bg-[#1a1d24]/50 transition-colors gap-4">
                        
                        <div className="flex-1 flex flex-col gap-1 min-w-[200px]">
                          <span className="text-[10px] font-bold text-gray-500 mb-1 tracking-wide">
                            {new Date(match.match_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} {new Date(match.match_date).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}
                            {match.is_live && <span className="text-red-500 ml-2 animate-pulse font-black">CANLI</span>}
                            {match.status === 'suspended' && <span className="text-orange-500 ml-2">ASKIYA ALINDI</span>}
                          </span>
                          <div className="flex items-center gap-2">
                            <img src={`https://picsum.photos/seed/${match.team_home}/20/20`} className="w-4 h-4 rounded-full shadow-sm" />
                            <span className="text-white font-bold text-[13px]">{match.team_home}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <img src={`https://picsum.photos/seed/${match.team_away}/20/20`} className="w-4 h-4 rounded-full shadow-sm" />
                            <span className="text-white font-bold text-[13px]">{match.team_away}</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                          <button disabled={isDisabled} className={`flex-1 bg-[#09090b] hover:bg-[#1f222b] rounded-lg border border-[#2C2F3D] hover:border-[#00FFA3]/50 flex justify-between items-center px-3 py-2.5 transition-all group ${isDisabled ? 'opacity-50' : ''}`}>
                             <span className="text-[11px] text-gray-400 truncate w-16 text-left group-hover:text-white transition-colors">{match.team_home}</span>
                             <span className={`text-[13px] font-black ${changedOdds[`${match.id}-1`] === 'up' ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : changedOdds[`${match.id}-1`] === 'down' ? 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]' : 'text-[#00FFA3] drop-shadow-[0_0_5px_rgba(0,255,163,0.2)]'}`}>
                               {isDisabled ? <Lock size={12}/> : formatOdds(match.odds?.['1'])}
                             </span>
                          </button>
                          <button disabled={isDisabled} className={`flex-1 bg-[#09090b] hover:bg-[#1f222b] rounded-lg border border-[#2C2F3D] hover:border-[#00FFA3]/50 flex justify-between items-center px-3 py-2.5 transition-all group ${isDisabled ? 'opacity-50' : ''}`}>
                             <span className="text-[11px] text-gray-400 truncate w-16 text-left group-hover:text-white transition-colors">Beraberlik</span>
                             <span className={`text-[13px] font-black ${changedOdds[`${match.id}-X`] === 'up' ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : changedOdds[`${match.id}-X`] === 'down' ? 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]' : 'text-[#00FFA3] drop-shadow-[0_0_5px_rgba(0,255,163,0.2)]'}`}>
                               {isDisabled ? <Lock size={12}/> : formatOdds(match.odds?.['X'])}
                             </span>
                          </button>
                          <button disabled={isDisabled} className={`flex-1 bg-[#09090b] hover:bg-[#1f222b] rounded-lg border border-[#2C2F3D] hover:border-[#00FFA3]/50 flex justify-between items-center px-3 py-2.5 transition-all group ${isDisabled ? 'opacity-50' : ''}`}>
                             <span className="text-[11px] text-gray-400 truncate w-16 text-left group-hover:text-white transition-colors">{match.team_away}</span>
                             <span className={`text-[13px] font-black ${changedOdds[`${match.id}-2`] === 'up' ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : changedOdds[`${match.id}-2`] === 'down' ? 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]' : 'text-[#00FFA3] drop-shadow-[0_0_5px_rgba(0,255,163,0.2)]'}`}>
                               {isDisabled ? <Lock size={12}/> : formatOdds(match.odds?.['2'])}
                             </span>
                          </button>
                        </div>
                        
                      </div>
                    )
                  })}
                </div>
              </div>
            )) : (
              <div className="bg-[#13151A] border border-[#2C2F3D] rounded-xl p-8 text-center text-gray-500 font-medium">
                Şu anda gösterilecek aktif etkinlik bulunmuyor.
              </div>
            )}
          </div>
        </div>

        {/* ── BÜYÜK BAHİSLER & TABLO ── */}
        <div className="flex flex-col gap-4 pt-6 border-t border-[#1A1D24]">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-white font-black flex items-center gap-2 uppercase tracking-wider">
              <Trophy size={18} className="text-amber-500"/> Büyük Bahisler
            </h2>
            <div className="flex gap-1">
              <button className="p-1.5 rounded border border-[#2C2F3D] bg-[#13151A] hover:bg-[#1A1D24] text-gray-400 hover:text-white transition-colors"><ChevronLeft size={14}/></button>
              <button className="p-1.5 rounded border border-[#2C2F3D] bg-[#13151A] hover:bg-[#1A1D24] text-gray-400 hover:text-white transition-colors"><ChevronRight size={14}/></button>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
            {[1, 2, 3].map(i => (
              <div key={i} className="min-w-[280px] bg-[#13151A] rounded-xl border border-[#2C2F3D] p-3 flex flex-col gap-3 shrink-0 snap-start shadow-lg">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 bg-[#09090b] border border-[#2C2F3D] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Futbol</span>
                  <span className="text-[10px] text-gray-500 truncate w-32 text-right">Player vs Player</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-xl drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">💰</span>
                  <span className="text-white font-black text-xl tracking-tight">$19,819</span>
                  <span className="text-[10px] text-gray-500 ml-auto uppercase font-bold">Maç sonu</span>
                </div>
                <div className="bg-[#09090b] rounded-lg p-2.5 flex justify-between items-center border border-[#2C2F3D]">
                  <span className="text-xs text-gray-300 font-medium">Altı 16.5</span>
                  <span className="text-sm font-black text-[#00FFA3] drop-shadow-[0_0_5px_rgba(0,255,163,0.3)]">1.88</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-6 border-b border-[#2C2F3D]">
             <button className="text-white font-bold text-sm pb-3 border-b-2 border-[#00FFA3] uppercase tracking-wider">Tüm Bahisler</button>
             <button className="text-gray-400 hover:text-white font-bold text-sm pb-3 transition-colors uppercase tracking-wider">Yüksek Bahisçiler</button>
             <button className="text-gray-400 hover:text-white font-bold text-sm pb-3 transition-colors uppercase tracking-wider">Yarış Liderlik</button>
          </div>

          <div className="w-full overflow-x-auto scrollbar-hide bg-[#13151A] rounded-xl border border-[#2C2F3D] shadow-lg">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-[#09090b] text-gray-500 text-[11px] uppercase tracking-wider border-b border-[#2C2F3D]">
                <tr>
                  <th className="px-4 py-4 font-bold">Etkinlik</th>
                  <th className="px-4 py-4 font-bold">Kullanıcı</th>
                  <th className="px-4 py-4 font-bold">Zaman</th>
                  <th className="px-4 py-4 font-bold">Oranlar</th>
                  <th className="px-4 py-4 font-bold text-right">Bahis Tutarı</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { user: 'Hamudi888', time: '16:14', odds: '1.90', amt: '1,400.00' },
                  { user: 'Ferstapen', time: '16:14', odds: '2.50', amt: '1,047.39' },
                  { user: 'Ramon950', time: '16:13', odds: '1.45', amt: '1,161.15' },
                  { user: 'Gizlenmiş', time: '16:13', odds: '3.40', amt: '26.39' },
                  { user: 'pakapakaman', time: '16:13', odds: '1.08', amt: '1,080.07' }
                ].map((row, i) => (
                  <tr key={i} className="border-t border-[#2C2F3D] hover:bg-[#1A1D24] transition-colors group cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Activity size={14} className="text-amber-500" />
                        <span className="text-gray-300 font-medium text-xs group-hover:text-white transition-colors">Reyady Abaseya - Raci...</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white font-medium text-xs">{row.user}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs font-medium">{row.time}</td>
                    <td className="px-4 py-3 font-black text-xs text-[#00FFA3]">{row.odds}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-white font-bold text-xs tracking-wide">
                         ${row.amt} <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[9px] text-black font-black drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">T</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SportsDashboard;
