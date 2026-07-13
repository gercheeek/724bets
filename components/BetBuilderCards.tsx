import React, { useState } from 'react';
import { Flame, ChevronsUp, Activity } from 'lucide-react';

const BetBuilderCards: React.FC = () => {
  const [activeTab, setActiveTab] = useState('betbuilder');

  const cards = [
    {
      id: 1,
      title: 'Fransa - İspanya',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      borderClass: 'border-l-blue-500/50 border-b-green-500/50',
      bets: [
        '1. Yarı: Doğru Skor: 1:1',
        'Kornerler: Kornerler Sonuç: 1',
        'Sarı Kartlar: Kartlar Sonuç: 2',
        'Ofsaytlar: Toplam: Üst (3.5)'
      ],
      odds: '55',
      isSuper: false
    },
    {
      id: 2,
      title: 'Fransa - İspanya',
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/20',
      borderClass: 'border-orange-500/80 shadow-[0_0_15px_rgba(249,115,22,0.1)]',
      bets: [
        'Maç Sonucu: 1',
        'İki Takım da Gol Atar: Evet',
        'Gol atmak: Kylian Mbappe'
      ],
      oldOdds: '5.3',
      odds: '5.62',
      isSuper: true
    },
    {
      id: 3,
      title: 'İngiltere - Arjantin',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      borderClass: 'border-blue-500/50',
      bets: [
        'Doğru Skor: 2:2',
        'Gol atmak: Lionel Andres Messi'
      ],
      odds: '18',
      isSuper: false
    }
  ];

  return (
    <div className="w-full bg-[#12161E] border-y border-[#202532] flex flex-col mb-4">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-6 bg-[#161A23] border-b border-[#202532]">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('betbuilder')}
            className={`py-3 text-[13px] font-bold tracking-wide relative ${activeTab === 'betbuilder' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            BetBuilder Özel
            {activeTab === 'betbuilder' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00FFA3] shadow-[0_0_8px_rgba(0,255,163,0.6)]"></div>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('gunun_bahsi')}
            className={`py-3 text-[13px] font-bold tracking-wide relative ${activeTab === 'gunun_bahsi' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Günün çoklu bahsi
            {activeTab === 'gunun_bahsi' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00FFA3] shadow-[0_0_8px_rgba(0,255,163,0.6)]"></div>
            )}
          </button>
        </div>
        
        <div className="bg-[#202532] p-1.5 rounded text-zinc-300 hover:text-white cursor-pointer hover:bg-[#2A303D] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 12l3-3"></path>
            <path d="M12 12l-3-3"></path>
            <path d="M12 12v4"></path>
            <path d="M10 16l-2 2"></path>
            <path d="M14 16l2 2"></path>
            <path d="M7 10h10"></path>
          </svg>
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex overflow-x-auto gap-4 p-4 px-6 custom-scrollbar">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className={`relative min-w-[300px] max-w-[320px] bg-[#1A1D24] rounded-xl border border-transparent p-4 flex flex-col hover:bg-[#1E222A] cursor-pointer transition-all ${card.borderClass}`}
            style={{ 
              borderWidth: card.isSuper ? '2px' : '1px', 
              borderColor: card.isSuper ? '#f97316' : '#2A303D',
              borderLeftColor: card.id === 1 ? '#3b82f6' : undefined,
              borderBottomColor: card.id === 1 ? '#22c55e' : undefined,
            }}
          >
            {card.isSuper && (
              <div className="absolute -top-3 right-4 bg-[#FF004D] px-2 py-0.5 rounded text-white text-[10px] font-black tracking-wider flex items-center gap-1 shadow-lg z-10 border border-[#FF004D]/50">
                <Flame className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                SUPER
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-6 h-6 rounded-md ${card.iconBg} flex items-center justify-center`}>
                <Activity className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <h3 className="text-white font-bold text-[14px]">{card.title}</h3>
            </div>

            <div className="relative flex-1 mb-4">
              <div className="absolute left-1.5 top-2 bottom-2 w-px bg-[#2A303D]"></div>
              <ul className="flex flex-col gap-3 relative z-10 pl-5">
                {card.bets.map((bet, i) => {
                  const parts = bet.split(':');
                  const prefix = parts.slice(0, -1).join(':');
                  const boldPart = parts[parts.length - 1];
                  
                  return (
                    <li key={i} className="text-[12px] text-zinc-300 relative flex items-center">
                      <div className={`absolute -left-[23px] w-1.5 h-1.5 rounded-full ${card.isSuper ? 'bg-orange-500 shadow-[0_0_5px_#f97316]' : 'bg-blue-500 shadow-[0_0_5px_#3b82f6]'}`}></div>
                      <span>
                        {prefix ? prefix + ': ' : ''}
                        <strong className="text-white font-bold">{boldPart}</strong>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <button className="w-full mt-auto bg-[#202532] hover:bg-[#2A303D] text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-[#3A404D]">
              {card.isSuper && (
                <>
                  <ChevronsUp className="w-4 h-4 text-orange-400" />
                  <span className="text-zinc-500 line-through text-xs mr-1">{card.oldOdds}</span>
                </>
              )}
              {card.odds}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BetBuilderCards;
