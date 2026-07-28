import React from 'react';
import { ChevronLeft, ChevronRight, Flame, BarChart3, Users, Zap, Search, ShieldCheck } from 'lucide-react';
import { useBetSlip } from '../../contexts/BetSlipContext';

// FAKE DATA
const topMatches: any[] = [];
const sgmMatches: any[] = [];

export default function PremiumMatchFeed() {
  const { addSelection } = useBetSlip();

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      
      {/* ── EN İYİ MAÇLAR (Top Matches) ── */}
      <section className="flex flex-col gap-3">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#1075fc]/10 p-1.5 rounded-md flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#1075fc]" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-wide">
                Yaklaşan Maçlar
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded bg-[#1a1c24] hover:bg-[#252836] border border-white/5 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4 text-zinc-400" />
            </button>
            <button className="w-8 h-8 rounded bg-[#1a1c24] hover:bg-[#252836] border border-white/5 flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topMatches.map(match => (
            <div key={match.id} className="group bg-[#0f1522] border border-white/10 rounded-xl p-4 flex flex-col hover:bg-[#131b2c] hover:border-white/20 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/10 relative overflow-hidden">
              
              {/* Subtle Blue Gradient Background for Card */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent group-hover:opacity-40 transition-opacity pointer-events-none"></div>
              
              {/* Top Row: Time & Info */}
              <div className="flex items-center justify-between mb-3 text-xs text-zinc-400 font-semibold">
                <div className="flex items-center gap-2">
                  <span className="bg-[#1f2937] text-white px-1.5 py-0.5 rounded text-[10px]">{match.time}</span>
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">SGM</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {match.viewers}
                </div>
              </div>

              {/* Teams & Logos */}
              <div className="flex flex-col items-center justify-center mb-5 gap-2 relative z-10">
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-center w-[40%]">
                    <img src={match.team1Logo} alt="Team 1" className="w-8 h-8 rounded-full object-cover shadow-[0_0_10px_rgba(255,255,255,0.1)] mb-1.5" />
                    <span className="text-white font-semibold text-[12px] text-center line-clamp-2 leading-tight">{match.team1}</span>
                  </div>
                  
                  <div className="flex items-center justify-center w-[20%]">
                    <span className="text-zinc-600 font-bold text-xs">VS</span>
                  </div>

                  <div className="flex flex-col items-center w-[40%]">
                    <img src={match.team2Logo} alt="Team 2" className="w-8 h-8 rounded-full object-cover shadow-[0_0_10px_rgba(255,255,255,0.1)] mb-1.5" />
                    <span className="text-white font-semibold text-[12px] text-center line-clamp-2 leading-tight">{match.team2}</span>
                  </div>
                </div>
              </div>

              {/* Fire Info */}
              <div className="text-[11px] text-zinc-400 mb-2 font-medium">
                <span className="text-orange-500">🔥 %{match.firePercentage}</span> {match.fireTeam} galibiyetine oynadı
              </div>

              {/* Odds Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-auto relative z-10">
                <button 
                  onClick={() => addSelection({ id: `top-${match.id}_1`, matchId: `top-${match.id}`, matchName: `${match.team1} vs ${match.team2}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(match.odds.home.replace(',', '.')) })}
                  className="bg-[#161f33] hover:bg-[#1075fc] text-white transition-all duration-300 rounded-lg py-2 flex flex-col items-center justify-center border border-white/5 hover:border-transparent group/btn shadow-inner"
                >
                  <span className="text-[10px] text-zinc-400 group-hover/btn:text-white/90 font-medium mb-0.5 truncate w-full px-1 text-center transition-colors">1</span>
                  <span className="font-mono text-[13px] font-black">{match.odds.home}</span>
                </button>
                <button 
                  onClick={() => addSelection({ id: `top-${match.id}_X`, matchId: `top-${match.id}`, matchName: `${match.team1} vs ${match.team2}`, selectionName: 'Maç Sonucu: X', odd: parseFloat(match.odds.draw.replace(',', '.')) })}
                  className="bg-[#161f33] hover:bg-[#1075fc] text-white transition-all duration-300 rounded-lg py-2 flex flex-col items-center justify-center border border-white/5 hover:border-transparent group/btn shadow-inner"
                >
                  <span className="text-[10px] text-zinc-400 group-hover/btn:text-white/90 font-medium mb-0.5 truncate w-full px-1 text-center transition-colors">X</span>
                  <span className="font-mono text-[13px] font-black">{match.odds.draw}</span>
                </button>
                <button 
                  onClick={() => addSelection({ id: `top-${match.id}_2`, matchId: `top-${match.id}`, matchName: `${match.team1} vs ${match.team2}`, selectionName: 'Maç Sonucu: 2', odd: parseFloat(match.odds.away.replace(',', '.')) })}
                  className="bg-[#161f33] hover:bg-[#1075fc] text-white transition-all duration-300 rounded-lg py-2 flex flex-col items-center justify-center border border-white/5 hover:border-transparent group/btn shadow-inner"
                >
                  <span className="text-[10px] text-zinc-400 group-hover/btn:text-white/90 font-medium mb-0.5 truncate w-full px-1 text-center transition-colors">2</span>
                  <span className="font-mono text-[13px] font-black">{match.odds.away}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ── AYNI MAÇ ÇOKLU BAHİS (SGM) ── */}
      <section className="flex flex-col gap-3 mt-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#1f2937] p-1.5 rounded-md flex items-center justify-center">
              <span className="text-indigo-400 font-black text-[10px] uppercase tracking-wider">SGM</span>
            </span>
            <h3 className="text-[15px] font-bold text-white tracking-wide">Aynı Maç Çoklu Bahis</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded bg-[#1a1c24] hover:bg-[#252836] border border-white/5 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4 text-zinc-400" />
            </button>
            <button className="w-8 h-8 rounded bg-[#1a1c24] hover:bg-[#252836] border border-white/5 flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* SGM Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sgmMatches.map(match => (
            <div key={match.id} className="group bg-[#0f1522] border border-white/10 rounded-xl p-0 flex flex-col hover:bg-[#131b2c] hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-blue-500/10 relative">
              
              {/* Subtle Blue Gradient Background for Card */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent group-hover:opacity-40 transition-opacity pointer-events-none"></div>

              {/* Header Gradient Area */}
              <div className="p-4 bg-gradient-to-b from-blue-500/10 to-transparent relative z-10 border-b border-white/5">
                  {/* Top Row: Time & Info */}
                  <div className="flex items-center justify-between mb-3 text-xs text-zinc-300 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#1f2937] text-white px-1.5 py-0.5 rounded text-[10px]">{match.time}</span>
                      <BarChart3 className="w-3.5 h-3.5 opacity-70" />
                      <span className="bg-white/10 text-white px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">SGM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 opacity-70" /> {match.viewers}
                    </div>
                  </div>

                  {/* Teams & Logos */}
                  <div className="flex flex-col items-center justify-center mb-1 gap-2 relative z-10">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col items-center w-[40%]">
                        <img src={match.team1Logo} alt="Team 1" className="w-8 h-8 rounded-full object-cover shadow-[0_0_10px_rgba(255,255,255,0.1)] bg-white p-0.5 mb-1.5" />
                        <span className="text-white font-semibold text-[12px] text-center line-clamp-2 leading-tight">{match.team1}</span>
                      </div>
                      
                      <div className="flex items-center justify-center w-[20%]">
                        <span className="text-zinc-600 font-bold text-xs">VS</span>
                      </div>

                      <div className="flex flex-col items-center w-[40%]">
                        <img src={match.team2Logo} alt="Team 2" className="w-8 h-8 rounded-full object-cover shadow-[0_0_10px_rgba(255,255,255,0.1)] bg-white p-0.5 mb-1.5" />
                        <span className="text-white font-semibold text-[12px] text-center line-clamp-2 leading-tight">{match.team2}</span>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Legs Section */}
              <div className="p-4 pt-3 flex-1 flex flex-col relative z-10">
                  <div className="text-[12px] font-bold text-white mb-2 pt-2 border-t border-white/5">
                      {match.legsCount} Legs
                  </div>
                  
                  <div className="flex flex-col gap-2.5 mb-4">
                      {match.legs.map((leg, idx) => (
                          <div key={idx} className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                  <span className="text-[10px]">{leg.icon}</span>
                                  <span className="text-[12px] text-white font-bold">{leg.title}</span>
                              </div>
                              <div className="text-[11px] text-zinc-500 font-medium pl-4">{leg.subtitle}</div>
                          </div>
                      ))}
                  </div>

                  {/* Footer Button area */}
                  <div className="mt-auto">
                      <div className="text-[12px] text-zinc-400 font-medium flex items-center gap-1 mb-3 hover:text-white transition-colors cursor-pointer w-max">
                          Çoklu Bahisi Görüntüle <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      
                      <button className="w-full bg-[#161f33] hover:bg-[#1075fc] text-white border border-white/5 hover:border-transparent rounded-lg py-2.5 px-4 flex items-center justify-between transition-all duration-300 shadow-inner group/btn">
                          <span className="text-zinc-400 group-hover/btn:text-white/90 font-bold text-[12px] transition-colors">Oran</span>
                          <span className="text-white font-black text-[14px]">{match.totalOdds}</span>
                      </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
