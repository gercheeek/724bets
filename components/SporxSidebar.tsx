import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useBetting } from '../contexts/BettingContext';

export const SporxSidebar = () => {
  const { events, activeSport, activeLeague, setActiveLeague } = useBetting();
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});

  const toggleCountry = (country: string) => {
    setExpandedCountries(prev => ({ ...prev, [country]: !prev[country] }));
  };

  // Group events by country -> league
  const countryLeagues = useMemo(() => {
    const groups: Record<string, Set<string>> = {};
    events.forEach(ev => {
      const sName = ev.data?.sport?.name;
      if (!sName) return;
      // Exact match for simplicity, can extend to aliases if needed
      if (sName !== activeSport) return;

      const categoryName = ev.data?.tournament?.category?.name || 'Uluslararası';
      const leagueName = ev.data?.tournament?.name;

      if (leagueName) {
        if (!groups[categoryName]) {
          groups[categoryName] = new Set();
        }
        groups[categoryName].add(leagueName);
      }
    });

    return Object.entries(groups).map(([country, leagues]) => ({
      country,
      leagues: Array.from(leagues).sort()
    })).sort((a, b) => a.country.localeCompare(b.country));
  }, [events, activeSport]);

  return (
    <div className="w-[340px] flex flex-col bg-white/5 border border-white/5 rounded-xl p-4 flex-shrink-0 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <span className="text-xs font-black text-zinc-500 tracking-widest uppercase">
          TÜM LİGLER
        </span>
        {activeLeague && (
          <button 
            onClick={() => setActiveLeague(null)}
            className="text-[10px] text-[#10B981] hover:underline font-bold uppercase"
          >
            Temizle
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
        {countryLeagues.length === 0 ? (
          <div className="text-center p-4 text-zinc-500 text-sm">
            Bu spor dalında lig bulunamadı.
          </div>
        ) : (
          countryLeagues.map(group => {
            const isExpanded = expandedCountries[group.country];
            // Fetch flag if possible (or default generic flag)
            return (
              <div key={group.country} className="mb-2">
                <button
                  onClick={() => toggleCountry(group.country)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all ${
                    isExpanded ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🌍</span>
                    <span className="text-sm font-bold">{group.country}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#10B981]" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-1 flex flex-col gap-1 pl-4">
                    {group.leagues.map(league => {
                      const isActive = activeLeague === league;
                      return (
                        <button
                          key={league}
                          onClick={() => setActiveLeague(isActive ? null : league)}
                          className={`text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all border-l-2 ${
                            isActive 
                              ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]' 
                              : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'
                          }`}
                        >
                          {league}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
