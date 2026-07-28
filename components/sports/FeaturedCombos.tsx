import React from 'react';
import { Layers, Users, ChevronRight } from 'lucide-react';
import { PlayerLogo } from './PlayerLogo';

interface ComboLeg {
  match: string;
  selection: string;
  market: string;
  teamName?: string;
}

interface Combo {
  id: string;
  timeElapsed: string;
  players: number;
  title: string;
  legsCount: number;
  totalOdds: string;
  legs: ComboLeg[];
}

const mockCombosFutbol: Combo[] = [
  {
    id: '1',
    timeElapsed: '1 Sa',
    players: 111,
    title: 'Friendly Season',
    legsCount: 3,
    totalOdds: '4,93',
    legs: [
      {
        match: 'Chelsea - Western Sydney Wanderers FC',
        selection: 'üstü 3.5',
        market: 'Toplam gol',
        teamName: 'Chelsea'
      },
      {
        match: 'Aston Villa - Real Sociedad',
        selection: 'Aston Villa',
        market: '1x2',
        teamName: 'Aston Villa'
      },
      {
        match: 'Al Ahli - Fulham FK',
        selection: 'Fulham FK',
        market: '1x2',
        teamName: 'Fulham'
      }
    ]
  },
  {
    id: '2',
    timeElapsed: '10s',
    players: 46,
    title: 'Eddie\'s Picks',
    legsCount: 3,
    totalOdds: '8,60',
    legs: [
      {
        match: 'Real Madrid - Barcelona',
        selection: 'Real Madrid',
        market: 'Kazanan',
        teamName: 'Real Madrid'
      },
      {
        match: 'Heart of Midlothian FC - Sturm Graz',
        selection: 'Heart of Midlothian FC',
        market: '1x2',
        teamName: 'Hearts'
      },
      {
        match: 'Union Magdalena - Independiente Santa Fe',
        selection: 'Independiente Santa Fe',
        market: '1x2',
        teamName: 'Independiente Santa Fe'
      }
    ]
  },
  {
    id: '3',
    timeElapsed: '11s',
    players: 50,
    title: 'Baseline Fever',
    legsCount: 3,
    totalOdds: '3,60',
    legs: [
      {
        match: 'Fenerbahçe - Galatasaray',
        selection: 'Fenerbahçe',
        market: 'Kazanan',
        teamName: 'Fenerbahçe'
      },
      {
        match: 'Arsenal - Chelsea',
        selection: 'Arsenal',
        market: 'Kazanan',
        teamName: 'Arsenal'
      },
      {
        match: 'Boca Juniors - River Plate',
        selection: 'Beraberlik',
        market: '1x2',
        teamName: 'Boca Juniors'
      }
    ]
  }
];

const mockCombosBasketbol: Combo[] = [
  {
    id: '1',
    timeElapsed: '5 Dk',
    players: 245,
    title: 'NBA Parlay',
    legsCount: 3,
    totalOdds: '5,20',
    legs: [
      {
        match: 'Los Angeles Lakers - Golden State Warriors',
        selection: 'Lakers',
        market: 'Kazanan (Uzatma Dahil)',
        teamName: 'Los Angeles Lakers'
      },
      {
        match: 'Boston Celtics - Miami Heat',
        selection: 'Boston -5.5',
        market: 'Handikap',
        teamName: 'Boston Celtics'
      },
      {
        match: 'Phoenix Suns - Denver Nuggets',
        selection: 'Üstü 220.5',
        market: 'Toplam Sayı',
        teamName: 'Phoenix Suns'
      }
    ]
  },
  {
    id: '2',
    timeElapsed: '12s',
    players: 88,
    title: 'Euroleague Özel',
    legsCount: 2,
    totalOdds: '3,10',
    legs: [
      {
        match: 'Fenerbahçe Beko - Real Madrid',
        selection: 'Fenerbahçe Beko',
        market: 'Maç Sonucu',
        teamName: 'Fenerbahçe'
      },
      {
        match: 'Olympiacos - Panathinaikos',
        selection: 'Panathinaikos +3.5',
        market: 'Handikap',
        teamName: 'Panathinaikos'
      }
    ]
  }
];

const mockCombosTenis: Combo[] = [
  {
    id: '1',
    timeElapsed: '2 Sa',
    players: 56,
    title: 'Grand Slam Combo',
    legsCount: 3,
    totalOdds: '4,15',
    legs: [
      {
        match: 'Djokovic, Novak - Alcaraz, Carlos',
        selection: 'Djokovic, Novak',
        market: 'Kazanan',
        teamName: 'Novak Djokovic'
      },
      {
        match: 'Sinner, Jannik - Medvedev, Daniil',
        selection: 'Sinner, Jannik',
        market: 'Kazanan',
        teamName: 'Jannik Sinner'
      },
      {
        match: 'Swiatek, Iga - Sabalenka, Aryna',
        selection: 'Üstü 21.5',
        market: 'Toplam Oyun',
        teamName: 'Iga Swiatek'
      }
    ]
  }
];

interface FeaturedCombosProps {
  activeSport?: string;
}

const FeaturedCombos: React.FC<FeaturedCombosProps> = ({ activeSport = 'Tüm Sporlar' }) => {
  let mockCombos = mockCombosFutbol;
  
  const sportLower = activeSport.toLowerCase();
  if (sportLower.includes('basketbol') || sportLower.includes('basketball')) {
    mockCombos = mockCombosBasketbol;
  } else if (sportLower.includes('tenis') || sportLower.includes('tennis')) {
    mockCombos = mockCombosTenis;
  }
  
  if (!mockCombos || mockCombos.length === 0) {
    mockCombos = mockCombosFutbol;
  }

  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Layers className="w-5 h-5 text-slate-300" />
        <h2 className="text-white text-lg font-bold">Günün Öne Çıkan Kombinesi</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockCombos.map((combo) => (
          <div 
            key={combo.id}
            className="rounded-xl overflow-hidden relative border border-white/5 bg-[#141b24] shadow-xl flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0a48a3]/40 to-transparent pointer-events-none"></div>

            <div className="p-4 relative z-10">
              <div className="flex justify-between items-center mb-3">
                <span className="bg-white/10 text-slate-300 text-[11px] font-bold px-2 py-0.5 rounded">
                  {combo.timeElapsed}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-slate-300">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-[12px] font-bold">{combo.players}</span>
                  </div>
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-bold text-[15px] mb-0.5">{combo.title}</h3>
                  <span className="text-slate-400 text-[12px]">{combo.legsCount} Legs</span>
                </div>
                <div className="text-[#3b82f6] font-bold text-lg">
                  {combo.totalOdds}
                </div>
              </div>
            </div>

            <div className="px-4 pb-2 relative z-10 flex-1">
              <div className="flex flex-col gap-3">
                {combo.legs.map((leg, index) => (
                  <div key={index} className="border-t border-white/5 pt-3">
                    <div className="text-slate-400 text-[11px] font-medium mb-1 truncate">
                      {leg.match}
                    </div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0">
                        {leg.teamName ? (
                           <div className="w-full h-full flex items-center justify-center">
                             <PlayerLogo name={leg.teamName} fallbackLogo={<span className="text-[14px]">🎯</span>} />
                           </div>
                        ) : (
                           <span className="text-[14px] opacity-50">🎯</span>
                        )}
                      </div>
                      <span className="text-white text-[15px] font-bold truncate">{leg.selection}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {leg.market}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 pb-4 pt-2 relative z-10 mt-auto">
              <button className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors mb-3 group">
                <span className="text-[12px] font-bold">Çoklu Bahisi Görüntüle</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button className="w-full bg-[#1b2331] hover:bg-[#222b3b] transition-colors border border-white/5 rounded-lg py-3 px-4 flex justify-between items-center group">
                <span className="text-slate-300 text-[13px] font-bold group-hover:text-white transition-colors">Bahis Kuponuna Ekle</span>
                <span className="text-[#3b82f6] font-bold text-[14px]">{combo.totalOdds}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCombos;
