import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Plus, Save, Trash2, Activity, Play, Square, Pause, Clock, Target, Calendar } from 'lucide-react';

interface Match {
  id: string;
  sport_category: string;
  league: string;
  team_home: string;
  team_away: string;
  match_date: string;
  is_live: boolean;
  score_home: number;
  score_away: number;
  match_minute: string;
  odds: {
    "1": number;
    "X": number;
    "2": number;
    "tU": number;
    "tA": number;
    "cs1X": number;
    "cs12": number;
    "csX2": number;
  };
  status: 'active' | 'suspended' | 'finished';
}

const defaultOdds = {
  "1": 1.5, "X": 3.0, "2": 2.1, "tU": 1.8, "tA": 1.9, "cs1X": 1.1, "cs12": 1.2, "csX2": 1.5
};

const AdminSportsTab: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // New Match Form State
  const [showForm, setShowForm] = useState(false);
  const [newMatch, setNewMatch] = useState({
    sport_category: 'Futbol',
    league: 'Şampiyonlar Ligi',
    team_home: '',
    team_away: '',
    match_date: new Date().toISOString().slice(0, 16),
  });

  const fetchMatches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sports_matches')
      .select('*')
      .order('match_date', { ascending: false });
    
    if (data) setMatches(data as Match[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('sports_matches').insert([{
      ...newMatch,
      match_date: new Date(newMatch.match_date).toISOString(),
      odds: defaultOdds
    }]);

    if (!error) {
      setShowForm(false);
      setNewMatch({
        sport_category: 'Futbol',
        league: 'Şampiyonlar Ligi',
        team_home: '',
        team_away: '',
        match_date: new Date().toISOString().slice(0, 16),
      });
      fetchMatches();
    } else {
      alert("Hata: " + error.message);
    }
  };

  const updateMatch = async (id: string, updates: Partial<Match>) => {
    const { error } = await supabase
      .from('sports_matches')
      .update(updates)
      .eq('id', id);
    
    if (!error) {
      setMatches(matches.map(m => m.id === id ? { ...m, ...updates } : m));
    }
  };

  const updateOdds = async (id: string, currentOdds: any, key: string, val: number) => {
    const newOdds = { ...currentOdds, [key]: val };
    const { error } = await supabase
      .from('sports_matches')
      .update({ odds: newOdds })
      .eq('id', id);
    
    if (!error) {
      setMatches(matches.map(m => m.id === id ? { ...m, odds: newOdds } : m));
    }
  };

  const deleteMatch = async (id: string) => {
    if(!window.confirm('Bu maçı silmek istediğinize emin misiniz?')) return;
    const { error } = await supabase.from('sports_matches').delete().eq('id', id);
    if (!error) fetchMatches();
  };

  return (
    <div className="p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Target className="text-[#00FFA3]" /> Spor Bülteni Yönetimi
          </h2>
          <p className="text-zinc-400 mt-1">Sitedeki bahis oranlarını, canlı skorları ve maçları buradan anlık yönetin.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-[#00FFA3] hover:bg-[#00E676] text-black font-black px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Yeni Maç Ekle
        </button>
      </div>

      {showForm && (
        <div className="bg-[#12161E] border border-[#202532] rounded-xl p-6 mb-8 animate-fade-in">
          <h3 className="text-lg font-bold mb-4">Yeni Maç Oluştur</h3>
          <form onSubmit={handleAddMatch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-400">Spor Dalı</label>
              <select 
                value={newMatch.sport_category}
                onChange={e => setNewMatch({...newMatch, sport_category: e.target.value})}
                className="bg-[#0A0C10] border border-[#202532] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00FFA3]"
              >
                <option value="Futbol">Futbol</option>
                <option value="Basketbol">Basketbol</option>
                <option value="Tenis">Tenis</option>
                <option value="E-Spor">E-Spor</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-400">Lig</label>
              <input 
                type="text" required placeholder="Örn: Premier Lig"
                value={newMatch.league} onChange={e => setNewMatch({...newMatch, league: e.target.value})}
                className="bg-[#0A0C10] border border-[#202532] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00FFA3]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-400">Ev Sahibi</label>
              <input 
                type="text" required placeholder="Ev Sahibi"
                value={newMatch.team_home} onChange={e => setNewMatch({...newMatch, team_home: e.target.value})}
                className="bg-[#0A0C10] border border-[#202532] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00FFA3]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-400">Deplasman</label>
              <input 
                type="text" required placeholder="Deplasman"
                value={newMatch.team_away} onChange={e => setNewMatch({...newMatch, team_away: e.target.value})}
                className="bg-[#0A0C10] border border-[#202532] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00FFA3]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-400">Tarih & Saat</label>
              <input 
                type="datetime-local" required
                value={newMatch.match_date} onChange={e => setNewMatch({...newMatch, match_date: e.target.value})}
                className="bg-[#0A0C10] border border-[#202532] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00FFA3]"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-5 flex justify-end mt-2">
              <button type="submit" className="bg-[#00FFA3] text-black font-bold px-6 py-2 rounded-lg flex items-center gap-2">
                <Save size={16} /> Maçı Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MATCHES LIST */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-10 text-zinc-500">Yükleniyor...</div>
        ) : matches.map(match => (
          <div key={match.id} className={`bg-[#12161E] border ${match.is_live ? 'border-red-500/50' : 'border-[#202532]'} rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden`}>
            
            {/* Header & Live Toggle */}
            <div className="flex items-center justify-between border-b border-[#202532] pb-3">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{match.sport_category} • {match.league}</span>
                  <div className="flex items-center gap-2 text-lg font-black">
                    <span>{match.team_home}</span>
                    <span className="text-[#00FFA3] bg-[#0A0C10] px-2 py-0.5 rounded border border-[#202532]">{match.score_home} - {match.score_away}</span>
                    <span>{match.team_away}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateMatch(match.id, { is_live: !match.is_live })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${match.is_live ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}
                >
                  <Activity size={14} /> {match.is_live ? 'CANLI YAYINDA' : 'CANLI DEĞİL'}
                </button>
                <button 
                  onClick={() => updateMatch(match.id, { status: match.status === 'active' ? 'suspended' : 'active' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${match.status === 'suspended' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/50' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50'}`}
                >
                  {match.status === 'suspended' ? <Pause size={14} /> : <Play size={14} />} 
                  {match.status === 'suspended' ? 'ASKIYA ALINDI' : 'AKTİF'}
                </button>
                <button onClick={() => deleteMatch(match.id)} className="text-zinc-500 hover:text-red-500 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Editing Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Score & Time Control */}
              <div className="lg:col-span-3 bg-[#0A0C10] rounded-lg p-3 border border-[#202532] flex flex-col gap-3">
                <h4 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1"><Clock size={12}/> Skor & Dakika Yönetimi</h4>
                
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-400">Ev</label>
                    <input type="number" value={match.score_home} onChange={e => updateMatch(match.id, { score_home: Number(e.target.value) })} className="w-full bg-[#12161E] border border-[#202532] rounded px-2 py-1 text-sm font-bold text-center focus:border-[#00FFA3] outline-none" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-400">Dep</label>
                    <input type="number" value={match.score_away} onChange={e => updateMatch(match.id, { score_away: Number(e.target.value) })} className="w-full bg-[#12161E] border border-[#202532] rounded px-2 py-1 text-sm font-bold text-center focus:border-[#00FFA3] outline-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-400">Dakika / Durum (Örn: 45', Devre Arası)</label>
                  <input type="text" value={match.match_minute} onChange={e => updateMatch(match.id, { match_minute: e.target.value })} placeholder="Örn: 45', Devre Arası" className="w-full bg-[#12161E] border border-[#202532] rounded px-2 py-1 text-sm font-bold focus:border-[#00FFA3] outline-none" />
                </div>
              </div>

              {/* Odds Control */}
              <div className="lg:col-span-9 bg-[#0A0C10] rounded-lg p-3 border border-[#202532] flex flex-col gap-3">
                 <h4 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1"><Activity size={12}/> Oran Yönetimi</h4>
                 
                 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2">
                    {[
                      { key: '1', label: 'MS 1' }, { key: 'X', label: 'MS X' }, { key: '2', label: 'MS 2' },
                      { key: 'tU', label: 'ÜST' }, { key: 'tA', label: 'ALT' },
                      { key: 'cs1X', label: 'ÇŞ 1-X' }, { key: 'cs12', label: 'ÇŞ 1-2' }, { key: 'csX2', label: 'ÇŞ X-2' }
                    ].map(odd => (
                      <div key={odd.key} className="flex flex-col gap-1 bg-[#12161E] p-2 rounded border border-[#202532]">
                        <span className="text-[10px] text-zinc-500 font-bold text-center">{odd.label}</span>
                        <input 
                          type="number" step="0.01" 
                          value={match.odds[odd.key as keyof typeof match.odds] || ''} 
                          onChange={e => updateOdds(match.id, match.odds, odd.key, Number(e.target.value))}
                          className="w-full bg-transparent border-none text-center text-[#00FFA3] font-black outline-none"
                        />
                      </div>
                    ))}
                 </div>
              </div>

            </div>

          </div>
        ))}
        {matches.length === 0 && !loading && (
          <div className="text-center py-10 bg-[#12161E] border border-[#202532] rounded-xl text-zinc-500">
            Henüz hiç maç eklenmemiş. Yukarıdan "Yeni Maç Ekle" butonunu kullanın.
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminSportsTab;
