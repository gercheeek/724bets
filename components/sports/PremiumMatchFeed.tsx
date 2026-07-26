import React from 'react';
import { ChevronLeft, ChevronRight, Flame, BarChart3, Users, Zap, Search, ShieldCheck } from 'lucide-react';

// FAKE DATA
const topMatches = [
  {
    id: 1,
    time: "49d",
    viewers: "6.340",
    team1: "SK Brann",
    team2: "Valerenga IF",
    team1Logo: "https://flagcdn.com/w40/no.png", 
    team2Logo: "https://flagcdn.com/w40/se.png",
    firePercentage: 97,
    fireTeam: "SK Brann",
    odds: { home: "1,66", draw: "4,10", away: "4,30" }
  },
  {
    id: 2,
    time: "19d",
    viewers: "5.961",
    team1: "IK Sirius",
    team2: "Goteborg",
    team1Logo: "https://flagcdn.com/w40/se.png", 
    team2Logo: "https://flagcdn.com/w40/dk.png",
    firePercentage: 99,
    fireTeam: "IK Sirius",
    odds: { home: "1,44", draw: "4,80", away: "5,60" }
  },
  {
    id: 3,
    time: "5s",
    viewers: "5.736",
    team1: "Aalesunds FK",
    team2: "Viking FK",
    team1Logo: "https://flagcdn.com/w40/no.png", 
    team2Logo: "https://flagcdn.com/w40/is.png",
    firePercentage: 99,
    fireTeam: "Viking FK",
    odds: { home: "5,40", draw: "4,60", away: "1,48" }
  }
];

const sgmMatches = [
  {
    id: 1,
    time: "19d",
    viewers: "146",
    team1: "Zhejiang",
    team2: "Dalian Yingbo",
    team1Logo: "https://flagcdn.com/w40/cn.png",
    team2Logo: "https://flagcdn.com/w40/cn.png",
    legsCount: 5,
    legs: [
      { title: "Zhejiang", subtitle: "1x2", icon: "⚽" },
      { title: "var", subtitle: "Karşılıklı gol", icon: "⚽" },
      { title: "altı 10.5", subtitle: "Toplam korner sayısı", icon: "🎯" }
    ],
    totalOdds: "30,32"
  },
  {
    id: 2,
    time: "10s",
    viewers: "142",
    team1: "Deportivo Riestra",
    team2: "Boca Juniors",
    team1Logo: "https://flagcdn.com/w40/ar.png",
    team2Logo: "https://flagcdn.com/w40/br.png",
    legsCount: 5,
    legs: [
      { title: "1-3", subtitle: "Toplam gol", icon: "⚽" },
      { title: "Boca Juniors", subtitle: "1st gol", icon: "🏆" },
      { title: "tek", subtitle: "tek/çift", icon: "⚽" }
    ],
    totalOdds: "7,42"
  },
  {
    id: 3,
    time: "10s",
    viewers: "99",
    team1: "Deportivo Riestra",
    team2: "Boca Juniors",
    team1Logo: "https://flagcdn.com/w40/ar.png",
    team2Logo: "https://flagcdn.com/w40/br.png",
    legsCount: 4,
    legs: [
      { title: "var", subtitle: "Karşılıklı gol", icon: "⚽" },
      { title: "Boca Juniors", subtitle: "1x2", icon: "🏆" },
      { title: "Merentiel, Miguel", subtitle: "Gol atar", icon: "⚽" }
    ],
    totalOdds: "42,63"
  }
];

export default function PremiumMatchFeed() {
  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      
      {/* ── EN İYİ MAÇLAR (Top Matches) ── */}
      <section className="flex flex-col gap-3">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#1f2937] p-1.5 rounded-md flex items-center justify-center">
              <Flame className="w-5 h-5 text-emerald-500" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide uppercase italic">
                YAKLAŞAN MAÇLAR
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topMatches.map(match => (
            <div key={match.id} className="bg-[#16181f] border border-white/5 rounded-xl p-3 flex flex-col hover:bg-[#1a1c24] transition-colors cursor-pointer">
              
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
              <div className="flex items-center justify-between mb-4">
                <img src={match.team1Logo} alt="Team 1" className="w-8 h-8 rounded-full object-cover shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
                <div className="flex flex-col items-center flex-1">
                  <span className="text-white font-bold text-[13px]">{match.team1}</span>
                  <span className="text-white font-bold text-[13px]">{match.team2}</span>
                </div>
                <img src={match.team2Logo} alt="Team 2" className="w-8 h-8 rounded-full object-cover shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
              </div>

              {/* Fire Info */}
              <div className="text-[11px] text-zinc-400 mb-2 font-medium">
                <span className="text-orange-500">🔥 %{match.firePercentage}</span> {match.fireTeam} galibiyetine oynadı
              </div>

              {/* Odds Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-auto">
                <button className="bg-[#1a212a] hover:bg-[#252f3b] border border-white/5 rounded-lg py-1.5 flex flex-col items-center justify-center transition-colors">
                  <span className="text-[10px] text-zinc-400 font-medium mb-0.5 truncate w-full px-1 text-center">{match.team1}</span>
                  <span className="text-[#3b82f6] font-bold text-[12px]">{match.odds.home}</span>
                </button>
                <button className="bg-[#1a212a] hover:bg-[#252f3b] border border-white/5 rounded-lg py-1.5 flex flex-col items-center justify-center transition-colors">
                  <span className="text-[10px] text-zinc-400 font-medium mb-0.5 truncate w-full px-1 text-center">beraberlik</span>
                  <span className="text-[#3b82f6] font-bold text-[12px]">{match.odds.draw}</span>
                </button>
                <button className="bg-[#1a212a] hover:bg-[#252f3b] border border-white/5 rounded-lg py-1.5 flex flex-col items-center justify-center transition-colors">
                  <span className="text-[10px] text-zinc-400 font-medium mb-0.5 truncate w-full px-1 text-center">{match.team2}</span>
                  <span className="text-[#3b82f6] font-bold text-[12px]">{match.odds.away}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sgmMatches.map(match => (
            <div key={match.id} className="bg-[#16181f] border border-white/5 rounded-xl p-0 flex flex-col hover:bg-[#1a1c24] transition-colors cursor-pointer overflow-hidden">
              
              {/* Header Gradient Area */}
              <div className="p-3 bg-gradient-to-b from-[#1a2a3a] to-transparent">
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
                  <div className="flex items-center justify-between">
                    <img src={match.team1Logo} alt="Team 1" className="w-9 h-9 rounded-full object-cover shadow-[0_0_10px_rgba(255,255,255,0.1)] bg-white p-0.5" />
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-white font-bold text-[13px]">{match.team1}</span>
                      <span className="text-white font-bold text-[13px]">{match.team2}</span>
                    </div>
                    <img src={match.team2Logo} alt="Team 2" className="w-9 h-9 rounded-full object-cover shadow-[0_0_10px_rgba(255,255,255,0.1)] bg-white p-0.5" />
                  </div>
              </div>

              {/* Legs Section */}
              <div className="p-3 pt-0 flex-1 flex flex-col">
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
                      <div className="text-[12px] text-zinc-300 font-medium flex items-center gap-1 mb-2 hover:text-white transition-colors">
                          Çoklu Bahisi Görüntüle <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      
                      <button className="w-full bg-[#1a212a] hover:bg-[#252f3b] border border-white/5 rounded-lg py-2.5 px-3 flex items-center justify-between transition-colors">
                          <span className="text-[12px] text-zinc-300 font-medium">Bahis Kuponuna Ekle</span>
                          <span className="text-[#3b82f6] font-black text-[13px]">{match.totalOdds}</span>
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
