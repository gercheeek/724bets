import React, { useState } from 'react';
import { Play, Trophy, Swords, Crosshair, Flame, Dribbble, Gamepad2 } from 'lucide-react';

const mockHighlights = [
  {
    id: 1,
    sport: 'Boks',
    league: 'Uluslararası › Profesyonel Boks',
    time: '9 Ağu 03:00',
    isLive: false,
    team1: { name: 'Robinson, Desley', flag: 'au' },
    team2: { name: 'Thibeault, Tammara', flag: 'ca' },
    score1: null,
    score2: null,
    odds1: '-0.351',
    odds2: '0.22'
  },
  {
    id: 2,
    sport: 'MMA',
    league: 'MMA › UFC Kadın Efsaneleri (1 raunt)',
    time: 'Başladı',
    isLive: true,
    team1: { name: 'Cyborg, Cris (E)', flag: 'br' },
    team2: { name: 'Shevchenko, Valentina (E)', flag: 'kg' },
    score1: '0',
    score2: '0',
    odds1: '0.35',
    odds2: '-0.467'
  },
  {
    id: 3,
    sport: 'MMA',
    league: 'MMA › UFC Efsaneleri (1 raunt)',
    time: '',
    isLive: false,
    team1: { name: 'Gaethje, Justin (E)', flag: 'us' },
    team2: { name: 'McGregor, Conor (E)', flag: 'ie' },
    score1: '0',
    score2: '0',
    odds1: '0.89',
    odds2: '2.45'
  }
];

const categories = [
  { id: 'futbol', name: 'Futbol', icon: <div className="w-4 h-4 rounded-full border-[1.5px] border-current opacity-80" /> },
  { id: 'basketbol', name: 'Basketbol', icon: <Dribbble className="w-4 h-4 opacity-80" /> },
  { id: 'martial_arts', name: 'Martial arts', icon: <span className="font-bold text-[10px] bg-white/20 px-1 rounded opacity-80">MMA</span> },
  { id: 'boks', name: 'Boks', icon: <Flame className="w-4 h-4 opacity-80" /> },
  { id: 'cs', name: 'Counter-Strike', icon: <Crosshair className="w-4 h-4 opacity-80" /> },
  { id: 'buz_hokeyi', name: 'Buz Hokeyi', icon: <Trophy className="w-4 h-4 opacity-80" /> },
  { id: 'tenis', name: 'Tenis', icon: <div className="w-4 h-4 rounded-full border-[1.5px] border-current opacity-80" /> },
  { id: 'american', name: 'Amerikan futbolu', icon: <div className="w-4 h-4 rounded-[40%] border-[1.5px] border-current opacity-80" /> },
];

export default function LiveHighlightsFeed() {
  const [activeCategory, setActiveCategory] = useState('futbol');

  return (
    <div className="w-full mb-2">
      {/* Cards Scroll Container */}
      <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x hide-scrollbar-mobile">
        {mockHighlights.map((match) => (
          <div 
            key={match.id} 
            className="group min-w-[280px] sm:min-w-[320px] max-w-[360px] flex-1 bg-[#0f1522] hover:bg-[#131b2c] border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden snap-start shrink-0 shadow-lg hover:shadow-blue-500/10"
          >
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent group-hover:opacity-40 transition-opacity"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-medium tracking-wide">
                  {match.sport === 'Boks' ? <Flame className="w-3.5 h-3.5" /> : <span className="font-bold text-[9px] bg-white/10 px-1 rounded">MMA</span>}
                  <span className="truncate max-w-[150px]">{match.league}</span>
                </div>
                {match.isLive ? (
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="text-emerald-400 font-bold text-[10px] tracking-wider uppercase">Canlı</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                ) : (
                  <span className="text-zinc-400 font-medium text-[11px] bg-white/5 px-2 py-0.5 rounded-full">{match.time}</span>
                )}
              </div>

              {/* Teams & Score */}
              <div className="flex items-center justify-between mb-5">
                {/* Team 1 */}
                <div className="flex flex-col items-start w-[40%]">
                  <img src={`https://flagcdn.com/w40/${match.team1.flag}.png`} className="w-6 h-6 rounded-full object-cover mb-2 border border-white/10 shadow-sm" alt={match.team1.flag} />
                  <span className="text-white text-[12px] font-semibold leading-tight line-clamp-2">{match.team1.name}</span>
                </div>

                {/* Score / VS */}
                <div className="flex items-center justify-center gap-1.5 w-[20%]">
                  {match.score1 !== null && match.score2 !== null ? (
                    <>
                      <div className="w-7 h-8 bg-[#161f33] rounded flex items-center justify-center text-white font-black text-sm border border-white/10 shadow-inner">{match.score1}</div>
                      <div className="w-7 h-8 bg-[#161f33] rounded flex items-center justify-center text-white font-black text-sm border border-white/10 shadow-inner">{match.score2}</div>
                    </>
                  ) : (
                    <span className="text-zinc-600 font-bold text-xs">VS</span>
                  )}
                </div>

                {/* Team 2 */}
                <div className="flex flex-col items-end w-[40%] text-right">
                  <img src={`https://flagcdn.com/w40/${match.team2.flag}.png`} className="w-6 h-6 rounded-full object-cover mb-2 border border-white/10 shadow-sm" alt={match.team2.flag} />
                  <span className="text-white text-[12px] font-semibold leading-tight line-clamp-2">{match.team2.name}</span>
                </div>
              </div>

              {/* Odds */}
              <div className="w-full mt-auto pt-2">
                <div className="text-center text-zinc-500 text-[10px] font-medium mb-2 uppercase tracking-wider">Kazanan</div>
                <div className="flex items-center gap-2">
                  <button className="flex-1 bg-[#161f33] hover:bg-[#1075fc] text-white transition-all duration-300 rounded-lg py-2.5 px-3 flex justify-between items-center border border-white/5 hover:border-transparent group/btn">
                    <span className="text-zinc-400 group-hover/btn:text-white/90 text-[11px] font-bold transition-colors">1</span>
                    <span className="font-mono text-[13px] font-black">{match.odds1}</span>
                  </button>
                  <button className="flex-1 bg-[#161f33] hover:bg-[#1075fc] text-white transition-all duration-300 rounded-lg py-2.5 px-3 flex justify-between items-center border border-white/5 hover:border-transparent group/btn">
                    <span className="text-zinc-400 group-hover/btn:text-white/90 text-[11px] font-bold transition-colors">2</span>
                    <span className="font-mono text-[13px] font-black">{match.odds2}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Navigation Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 pt-2 custom-scrollbar hide-scrollbar-mobile mt-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full flex items-center gap-2 transition-all font-semibold text-[13px] shrink-0 border ${
              activeCategory === cat.id 
                ? 'bg-[#1075fc] text-white border-transparent shadow-lg shadow-blue-500/30' 
                : 'bg-[#15191f] text-zinc-400 border-white/5 hover:bg-[#161f33] hover:text-white'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
