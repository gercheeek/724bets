import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BarChart2, Star, MessageSquare, Lock } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface SportsDashboardProps {
  onNavigate: () => void;
}

const SportsDashboard: React.FC<SportsDashboardProps> = ({ onNavigate }) => {
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [changedOdds, setChangedOdds] = useState<{[key: string]: 'up' | 'down'}>({});

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

  return (
    <div className="w-full bg-[#12141A] font-sans text-white pb-10 mt-6 rounded-xl overflow-hidden shadow-2xl">
      
      {/* ── TOP FEATURED CARDS ── */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide p-4 lg:p-6">
        
        {/* Card 1: Football */}
        <div className="relative min-w-[320px] h-[180px] rounded-xl overflow-hidden shrink-0 group cursor-pointer border border-[#2C2F3D]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-transparent z-10" />
          <img src="https://picsum.photos/seed/fifa1/400/200" alt="Arjantin" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <span className="font-black text-[12px] bg-white/10 px-2 py-0.5 rounded uppercase backdrop-blur-sm">FIFA</span>
          </div>
          <div className="absolute top-3 right-3 z-20 font-bold text-[11px] bg-black/40 px-2 py-0.5 rounded">12.07.2026 04:00</div>
          
          <div className="absolute bottom-4 left-3 right-3 z-20">
            <div className="flex flex-col mb-2">
              <span className="font-bold text-[14px] leading-tight">Arjantin</span>
              <span className="font-bold text-[14px] leading-tight text-white/70">İsviçre</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-1">Turu Kim Geçer ?</div>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#1A1D24]/90 backdrop-blur-md border border-[#2C2F3D] hover:bg-white/10 rounded flex justify-between items-center px-3 py-1.5 transition-colors">
                <span className="text-[11px] text-gray-400">Takım 1</span>
                <span className="font-bold text-[13px]">1.32</span>
              </button>
              <button className="flex-1 bg-[#1A1D24]/90 backdrop-blur-md border border-[#2C2F3D] hover:bg-white/10 rounded flex justify-between items-center px-3 py-1.5 transition-colors">
                <span className="text-[11px] text-gray-400">Takım 2</span>
                <span className="font-bold text-[13px]">3.7</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Tennis */}
        <div className="relative min-w-[320px] h-[180px] rounded-xl overflow-hidden shrink-0 group cursor-pointer border border-[#2C2F3D]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-transparent z-10" />
          <img src="https://picsum.photos/seed/tennis1/400/200" alt="Tennis" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <span className="font-black text-[12px] bg-white/10 px-2 py-0.5 rounded uppercase backdrop-blur-sm">WTA</span>
          </div>
          <div className="absolute top-3 right-3 z-20 font-bold text-[11px] bg-black/40 px-2 py-0.5 rounded">11.07.2026 18:00</div>
          
          <div className="absolute bottom-4 left-3 right-3 z-20">
            <div className="flex flex-col mb-2">
              <span className="font-bold text-[14px] leading-tight">Karolina Muchova</span>
              <span className="font-bold text-[14px] leading-tight text-white/70">Linda Noskova</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-1">Kazanan.</div>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#1A1D24]/90 backdrop-blur-md border border-[#2C2F3D] hover:bg-white/10 rounded flex justify-between items-center px-3 py-1.5 transition-colors">
                <span className="text-[11px] text-gray-400">1</span>
                <span className="font-bold text-[13px]">1.78</span>
              </button>
              <button className="flex-1 bg-[#1A1D24]/90 backdrop-blur-md border border-[#2C2F3D] hover:bg-white/10 rounded flex justify-between items-center px-3 py-1.5 transition-colors">
                <span className="text-[11px] text-gray-400">2</span>
                <span className="font-bold text-[13px]">2.1</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Football */}
        <div className="relative min-w-[320px] h-[180px] rounded-xl overflow-hidden shrink-0 group cursor-pointer border border-[#2C2F3D]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-transparent z-10" />
          <img src="https://picsum.photos/seed/fifa2/400/200" alt="Benfica" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute top-3 right-3 z-20 font-bold text-[11px] bg-black/40 px-2 py-0.5 rounded">11.07.2026 21:30</div>
          
          <div className="absolute bottom-4 left-3 right-3 z-20">
            <div className="flex flex-col mb-2">
              <span className="font-bold text-[14px] leading-tight">Benfica</span>
              <span className="font-bold text-[14px] leading-tight text-white/70">Flamengo RJ</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-1">Maç Sonucu</div>
            <div className="flex gap-1">
              <button className="flex-1 bg-[#1A1D24]/90 backdrop-blur-md border border-[#2C2F3D] hover:bg-white/10 rounded flex justify-between items-center px-2 py-1.5 transition-colors">
                <span className="text-[11px] text-gray-400">1</span>
                <span className="font-bold text-[13px]">2.65</span>
              </button>
              <button className="flex-1 bg-[#1A1D24]/90 backdrop-blur-md border border-[#2C2F3D] hover:bg-white/10 rounded flex justify-between items-center px-2 py-1.5 transition-colors">
                <span className="text-[11px] text-gray-400">X</span>
                <span className="font-bold text-[13px]">3.4</span>
              </button>
              <button className="flex-1 bg-[#1A1D24]/90 backdrop-blur-md border border-[#2C2F3D] hover:bg-white/10 rounded flex justify-between items-center px-2 py-1.5 transition-colors">
                <span className="text-[11px] text-gray-400">2</span>
                <span className="font-bold text-[13px]">2.35</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 4: Bonus Ad */}
        <div className="relative min-w-[280px] h-[180px] rounded-xl overflow-hidden shrink-0 group cursor-pointer border border-[#00FFA3]/30">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-[#111317]" />
          <div className="absolute inset-0 flex flex-col justify-center px-6">
            <span className="font-black text-[#00FFA3] text-3xl italic leading-none">%15 SPOR</span>
            <span className="font-bold text-white text-[12px] mb-2 tracking-widest">YENİDEN YÜKLEME BONUSU</span>
            <div className="bg-white text-black font-black text-2xl italic px-3 py-1 rounded w-fit">15.000 TL</div>
          </div>
        </div>

      </div>

      {/* ── JACKPOTS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6 mb-8">
        <div className="bg-gradient-to-r from-[#181D2B] to-[#12141A] rounded-lg p-3 border border-[#2C2F3D] flex justify-between items-center cursor-pointer hover:border-blue-500/50 transition-colors relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-[13px]">MEGA</span>
              <span className="text-[9px] text-gray-400 font-medium tracking-wide">Minimum Bahis TRY 1 000</span>
            </div>
            <div className="font-black text-xl">TRY 30 504.80</div>
          </div>
          <img src="https://cdn-icons-png.flaticon.com/512/2850/2850974.png" alt="Gem" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(0,191,255,0.6)] z-10" />
        </div>

        <div className="bg-gradient-to-r from-[#2A171D] to-[#12141A] rounded-lg p-3 border border-[#2C2F3D] flex justify-between items-center cursor-pointer hover:border-red-500/50 transition-colors relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-[13px]">MAJOR</span>
              <span className="text-[9px] text-gray-400 font-medium tracking-wide">Minimum Bahis TRY 500</span>
            </div>
            <div className="font-black text-xl">TRY 9 349.01</div>
          </div>
          <img src="https://cdn-icons-png.flaticon.com/512/2850/2850989.png" alt="Gem" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(255,50,50,0.6)] z-10 filter hue-rotate-[140deg] brightness-150" />
        </div>

        <div className="bg-gradient-to-r from-[#152321] to-[#12141A] rounded-lg p-3 border border-[#2C2F3D] flex justify-between items-center cursor-pointer hover:border-emerald-500/50 transition-colors relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-[13px]">MINOR</span>
              <span className="text-[9px] text-gray-400 font-medium tracking-wide">Minimum Bahis TRY 150</span>
            </div>
            <div className="font-black text-xl">TRY 3 579.61</div>
          </div>
          <img src="https://cdn-icons-png.flaticon.com/512/2850/2850974.png" alt="Gem" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(0,255,163,0.6)] z-10 filter hue-rotate-[-50deg]" />
        </div>

        <div className="bg-gradient-to-r from-[#231E15] to-[#12141A] rounded-lg p-3 border border-[#2C2F3D] flex justify-between items-center cursor-pointer hover:border-amber-500/50 transition-colors relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-[13px]">MINI</span>
              <span className="text-[9px] text-gray-400 font-medium tracking-wide">Minimum Bahis TRY 30</span>
            </div>
            <div className="font-black text-xl">TRY 794.65</div>
          </div>
          <img src="https://cdn-icons-png.flaticon.com/512/2850/2850989.png" alt="Gem" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(255,180,0,0.6)] z-10 filter hue-rotate-[-20deg]" />
        </div>
      </div>

      {/* ── CANLI ETKINLIKLER (LIVE EVENTS TABLE) ── */}
      <div className="px-4 lg:px-6">
        
        {/* Header Tabs */}
        <div className="flex items-center gap-2 border-b border-[#2C2F3D] pb-2 mb-4 overflow-x-auto scrollbar-hide">
          <h2 className="font-bold text-[15px] tracking-wide shrink-0 mr-4">Canlı etkinlikler</h2>
          <div className="flex items-center gap-2 bg-[#1A1D24] rounded-lg px-2 py-1 shrink-0">
            <button className="text-gray-400 hover:text-white px-2"><ChevronLeft size={14} /></button>
            {['⚽','🏀','🎾','🏐','🏓','🎮','🎯'].map((icon, i) => (
              <button 
                key={i} 
                onClick={onNavigate}
                className={`p-1.5 rounded-md ${i === 0 ? 'bg-[#2C2F3D] text-white' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <span className="text-[13px]">{icon}</span>
              </button>
            ))}
            <button className="text-gray-400 hover:text-white px-2"><ChevronRight size={14} /></button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-[#16181F] rounded-lg border border-[#2C2F3D] overflow-hidden">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="min-w-[800px]">
          
          {/* Table Headers */}
          <div className="flex items-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider px-4 py-3 bg-[#1A1D24] border-b border-[#2C2F3D]">
            <div className="w-[30%] min-w-[200px]">Maçlar</div>
            <div className="flex-1 flex justify-center text-center">Sonuç</div>
            <div className="flex-1 flex justify-center text-center">Toplam</div>
            <div className="flex-1 flex justify-center text-center">Çifte Şans</div>
            <div className="w-[50px]"></div>
          </div>

          {/* TABLE ROWS */}
          <div className="flex flex-col">
            
            {liveMatches.map((match, idx) => (
              <div key={match.id} className="flex items-center px-4 py-3 border-b border-[#2C2F3D] hover:bg-[#1A1D24] transition-colors group">
                
                {/* Match Info */}
                <div className="w-[30%] min-w-[200px] flex items-center gap-3">
                  <div className="w-[50px] text-center text-[#A0A5BB] text-[10px] font-bold leading-tight flex flex-col items-center">
                    {match.match_minute || new Date(match.match_date).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}
                    {match.is_live && <span className="text-red-500 text-[9px] animate-pulse mt-0.5">CANLI</span>}
                    {match.status === 'suspended' && <span className="text-orange-500 text-[9px] mt-0.5">ASKIYA ALINDI</span>}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={`https://picsum.photos/seed/${match.team_home}/20/20`} className="w-3.5 h-3.5 rounded-full" />
                        <span className="font-bold text-[12px]">{match.team_home}</span>
                      </div>
                      <span className="text-[#00FFA3] font-black text-[12px]">{match.score_home}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={`https://picsum.photos/seed/${match.team_away}/20/20`} className="w-3.5 h-3.5 rounded-full" />
                        <span className="font-bold text-[12px]">{match.team_away}</span>
                      </div>
                      <span className="text-[#00FFA3] font-black text-[12px]">{match.score_away}</span>
                    </div>
                  </div>
                </div>

                {/* Sonuç (1X2) */}
                <div className="flex-1 flex justify-center px-2">
                  <div className="flex w-full max-w-[200px] bg-[#12141A] rounded overflow-hidden border border-[#2C2F3D]">
                    {(['1', 'X', '2'] as const).map((key, i) => {
                      const val = match.odds?.[key];
                      const status = changedOdds[`${match.id}-${key}`];
                      const isDisabled = match.status === 'suspended';
                      return (
                        <button key={i} disabled={isDisabled} onClick={onNavigate} className={`flex-1 flex justify-center items-center py-2 hover:bg-white/10 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${i < 2 ? 'border-r border-[#2C2F3D]' : ''} transition-colors duration-300 ${status === 'up' ? 'bg-green-500/20' : status === 'down' ? 'bg-red-500/20' : ''}`}>
                          <span className={`text-[12px] font-bold ${status === 'up' ? 'text-green-400' : status === 'down' ? 'text-red-400' : 'text-[#00FFA3]'}`}>
                            {isDisabled ? <Lock size={12}/> : (typeof val === 'number' ? val.toFixed(2) : '-')}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Toplam (Over/Under) */}
                <div className="flex-1 flex justify-center px-2">
                  <div className="flex w-full max-w-[200px] bg-[#12141A] rounded overflow-hidden border border-[#2C2F3D]">
                    <button disabled={match.status === 'suspended'} onClick={onNavigate} className={`flex-1 flex justify-between items-center px-2 py-2 hover:bg-white/10 ${match.status === 'suspended' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} border-r border-[#2C2F3D] transition-colors duration-300 ${changedOdds[`${match.id}-tU`] === 'up' ? 'bg-green-500/20' : changedOdds[`${match.id}-tU`] === 'down' ? 'bg-red-500/20' : ''}`}>
                      <span className="text-[10px] text-gray-500">Üst</span>
                      <span className={`text-[12px] font-bold ${changedOdds[`${match.id}-tU`] === 'up' ? 'text-green-400' : changedOdds[`${match.id}-tU`] === 'down' ? 'text-red-400' : 'text-[#00FFA3]'}`}>
                        {match.status === 'suspended' ? <Lock size={12}/> : match.odds?.tU?.toFixed(2) || '-'}
                      </span>
                    </button>
                    <button disabled={match.status === 'suspended'} onClick={onNavigate} className={`flex-1 flex justify-between items-center px-2 py-2 hover:bg-white/10 ${match.status === 'suspended' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} transition-colors duration-300 ${changedOdds[`${match.id}-tA`] === 'up' ? 'bg-green-500/20' : changedOdds[`${match.id}-tA`] === 'down' ? 'bg-red-500/20' : ''}`}>
                      <span className="text-[10px] text-gray-500">Alt</span>
                      <span className={`text-[12px] font-bold ${changedOdds[`${match.id}-tA`] === 'up' ? 'text-green-400' : changedOdds[`${match.id}-tA`] === 'down' ? 'text-red-400' : 'text-[#00FFA3]'}`}>
                        {match.status === 'suspended' ? <Lock size={12}/> : match.odds?.tA?.toFixed(2) || '-'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Çifte Şans */}
                <div className="flex-1 flex justify-center px-2">
                  <div className="flex w-full max-w-[200px] bg-[#12141A] rounded overflow-hidden border border-[#2C2F3D]">
                    {(['cs1X', 'cs12', 'csX2'] as const).map((key, i) => {
                      const val = match.odds?.[key];
                      const status = changedOdds[`${match.id}-${key}`];
                      const isDisabled = match.status === 'suspended';
                      return (
                        <button key={i} disabled={isDisabled} onClick={onNavigate} className={`flex-1 flex justify-center items-center py-2 hover:bg-white/10 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${i < 2 ? 'border-r border-[#2C2F3D]' : ''} transition-colors duration-300 ${status === 'up' ? 'bg-green-500/20' : status === 'down' ? 'bg-red-500/20' : ''}`}>
                          <span className={`text-[12px] font-bold ${status === 'up' ? 'text-green-400' : status === 'down' ? 'text-red-400' : 'text-[#00FFA3]'}`}>
                            {isDisabled ? <Lock size={12}/> : (typeof val === 'number' ? val.toFixed(2) : '-')}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Stats / Video Icon */}
                <div className="w-[50px] flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2">
                    <button onClick={onNavigate} className="text-gray-500 hover:text-white transition-colors"><BarChart2 size={14}/></button>
                    <button onClick={onNavigate} className="text-gray-500 hover:text-white transition-colors"><Star size={14}/></button>
                  </div>
                  <button onClick={onNavigate} className="text-gray-500 hover:text-white transition-colors"><MessageSquare size={14}/></button>
                </div>
                
              </div>
            ))}
            {liveMatches.length === 0 && (
              <div className="text-center py-10 text-zinc-500">Şu anda gösterilecek maç bulunmuyor.</div>
            )}
          </div>
          </div>
          </div>

          <div className="w-full bg-[#1A1D24] text-center py-3 border-t border-[#2C2F3D]">
            <button className="text-[11px] font-bold text-gray-400 hover:text-white uppercase tracking-widest flex items-center justify-center w-full gap-1">
              Hepsini Göster <ChevronRight size={12} />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SportsDashboard;
