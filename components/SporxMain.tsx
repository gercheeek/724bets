import React, { useMemo } from 'react';
import { Activity, Star, Calendar } from 'lucide-react';
import { useBetting } from '../contexts/BettingContext';
import { MatchRow } from './MatchRow';

export const SporxMain = () => {
  const { events, activeSport, setActiveSport, activeLeague, activeTab, setActiveTab } = useBetting();

  const sportMapping: Record<string, string[]> = {
    'Futbol': ['Futbol', 'Football', 'SOCCER'],
    'Tenis': ['Tenis', 'Tennis', 'TENNIS'],
    'Basketbol': ['Basketbol', 'Basketball', 'BASKETBALL'],
    'Buz Hokeyi': ['Buz Hokeyi', 'Ice Hockey', 'ICE_HOCKEY'],
    'Masa Tenisi': ['Masa Tenisi', 'Table Tennis', 'TABLE_TENNIS'],
    'Voleybol': ['Voleybol', 'Volleyball', 'VOLLEYBALL'],
    'E-Spor': ['E-Spor', 'eSports', 'ESPORTS'],
    'Beyzbol': ['Beyzbol', 'Baseball', 'BASEBALL'],
    'Salon Futbolu': ['Salon Futbolu', 'Futsal', 'FUTSAL'],
  };

  const displayEvents = useMemo(() => {
    return events.filter(e => {
      const sName = e.data?.sport?.name;
      if (!sName) return false;
      const aliases = sportMapping[activeSport] || [activeSport];
      if (!aliases.includes(sName)) return false;

      if (activeLeague) {
        const lName = e.data?.tournament?.name;
        if (lName !== activeLeague) return false;
      }
      return true;
    }).sort((a, b) => {
      const m1 = parseInt(a.data?.minute || '0');
      const m2 = parseInt(b.data?.minute || '0');
      return m1 - m2;
    });
  }, [events, activeSport, activeLeague]);

  const groupEventsByTournament = useMemo(() => {
    const groups: Record<string, any[]> = {};
    displayEvents.forEach(ev => {
      const tName = ev.data?.tournament?.name || 'Diğer';
      if (!groups[tName]) groups[tName] = [];
      groups[tName].push(ev);
    });
    return Object.entries(groups).map(([name, evs]) => ({
      name,
      events: evs,
      country: evs[0].data?.tournament?.category?.name || 'Dünya'
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [displayEvents]);

  return (
    <div className="flex-1 flex flex-col bg-[#161920] overflow-hidden">
      {/* Top Tabs */}
      <div className="h-14 border-b border-white/5 flex items-center px-4 gap-2 shrink-0 bg-[#222831] overflow-x-auto custom-scrollbar">
        {['Tümü', 'Günün Maçları'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`h-10 px-4 text-sm font-medium flex flex-shrink-0 items-center gap-2 rounded-lg transition-colors ${
              activeTab === tab 
                ? 'bg-[#2C3440] text-white font-semibold border-b-2 border-[#10B981]' 
                : 'hover:bg-white/5 text-zinc-400'
            }`}
          >
            {tab === 'Tümü' && <Activity className="w-4 h-4 text-[#10B981]" />}
            {tab === 'Günün Maçları' && <Calendar className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {/* Header / Title Area */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
          <MenuIcon />
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">
            Tüm Karşılaşmalar
          </h1>
        </div>

        {/* Sport Categories */}
        <div className="flex gap-3 mb-8 overflow-x-auto custom-scrollbar pb-2">
          {Object.keys(sportMapping).map(sport => {
            const isActive = activeSport === sport;
            return (
              <button 
                key={sport}
                onClick={() => setActiveSport(sport)}
                className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-xl transition-all border ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#10B981] to-[#00E75A] text-black border-transparent shadow-[0_0_20px_rgba(0,255,163,0.3)]' 
                    : 'bg-[#1C2028] text-zinc-400 border-white/5 hover:border-white/10 hover:bg-[#232833]'
                }`}
              >
                <SportIcon name={sport} />
                <span className="font-bold text-sm">{sport}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Match Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-white font-bold mb-4">
            <div className="flex items-center gap-2">
              <SportIcon name={activeSport} />
              <span className="text-lg">{activeSport}</span>
            </div>
            <span className="text-sm text-zinc-500">{displayEvents.length}</span>
          </div>

          {groupEventsByTournament.length === 0 ? (
            <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/5 text-zinc-500">
              Şu an {activeLeague ? `${activeLeague} liginde` : `${activeSport} branşında`} uygun karşılaşma bulunmuyor.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {groupEventsByTournament.map(({ name, events, country }) => {
                const liveEvents = events.filter(e => e.data?.minute || e.data?.status === 'started' || e.data?.is_live);
                const upcomingEvents = events.filter(e => !(e.data?.minute || e.data?.status === 'started' || e.data?.is_live));

                return (
                  <div key={name} className="bg-[#1C2028] rounded-xl border border-white/5 overflow-hidden">
                    <div className="px-4 py-3 bg-[#232833] border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">🌍</span>
                        <div>
                          <div className="font-bold text-white text-sm">{name}</div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{activeSport}, {country}</div>
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-white/5">
                      {liveEvents.length > 0 && (
                        <div className="mb-2">
                          <div className="px-4 py-1.5 bg-[#2A1818] text-[10px] font-black text-red-400 uppercase tracking-widest border-l-2 border-red-500">
                            Canlı Karşılaşmalar
                          </div>
                          {liveEvents.map(event => <MatchRow key={event.id} event={event} />)}
                        </div>
                      )}

                      {upcomingEvents.length > 0 && (
                        <div>
                          <div className="px-4 py-1.5 bg-[#162A20] text-[10px] font-black text-[#10B981] uppercase tracking-widest border-l-2 border-[#10B981]">
                            Gelecek Karşılaşmalar
                          </div>
                          {upcomingEvents.map(event => <MatchRow key={event.id} event={event} />)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Extracted mini-components for cleanliness
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#10B981]">
    <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
  </svg>
);

const SportIcon = ({ name }: { name: string }) => {
  switch(name) {
    case 'Futbol': return <span>⚽</span>;
    case 'Tenis': return <span>🎾</span>;
    case 'Basketbol': return <span>🏀</span>;
    case 'Buz Hokeyi': return <span>🏒</span>;
    case 'Masa Tenisi': return <span>🏓</span>;
    case 'Voleybol': return <span>🏐</span>;
    case 'E-Spor': return <span>🎮</span>;
    case 'Beyzbol': return <span>⚾</span>;
    case 'Salon Futbolu': return <span>👟</span>;
    default: return <Activity className="w-4 h-4" />;
  }
};
