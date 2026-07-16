import React, { useState } from 'react';
import { Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const CustomBetSlip = () => {
  const [bets, setBets] = useState<any[]>([{ sport: 'Futbol', league: 'İngiltere Premier Lig', match: 'Arsenal - Chelsea', market: 'Maç Sonucu', selection: 'Arsenal', odds: '2.10' }]); // Demo data
  const [amount, setAmount] = useState('100');

  const totalOdds = bets.reduce((acc, bet) => acc * parseFloat(bet.odds), 1).toFixed(2);
  const potentialWin = (parseFloat(amount || '0') * parseFloat(totalOdds)).toFixed(2);

  return (
    <div className="bg-[#1C2028] border border-white/5 rounded-xl flex flex-col h-full overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-[#232833] p-4 flex items-center justify-between border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#10B981]" />
          <h2 className="text-white font-black text-sm uppercase tracking-wide">Bahis Kuponu</h2>
        </div>
        {bets.length > 0 && (
          <span className="bg-[#10B981] text-black text-xs font-bold px-2 py-0.5 rounded-full">
            {bets.length} Maç
          </span>
        )}
      </div>

      {/* Bets List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {bets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-60 min-h-[300px]">
            <TrendingUp className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">Kuponunuzda maç bulunmuyor.</p>
            <p className="text-xs text-center mt-1">Oranlara tıklayarak kuponunuza ekleyin.</p>
          </div>
        ) : (
          bets.map((bet, idx) => (
            <div key={idx} className="bg-[#15181E] rounded-lg p-3 border border-white/5 relative group">
              <button 
                onClick={() => setBets(bets.filter((_, i) => i !== idx))}
                className="absolute top-2 right-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="text-xs text-zinc-400 mb-1">{bet.sport} - {bet.league}</div>
              <div className="text-sm font-bold text-white mb-2 leading-tight pr-6">{bet.match}</div>
              
              <div className="flex items-end justify-between mt-2 pt-2 border-t border-white/5">
                <div>
                  <div className="text-xs text-zinc-400">{bet.market}</div>
                  <div className="text-sm font-semibold text-[#10B981]">{bet.selection}</div>
                </div>
                <div className="text-base font-black text-white">{bet.odds}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Summary */}
      {bets.length > 0 && (
        <div className="bg-[#15181E] p-4 border-t border-white/5 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <span className="text-zinc-400 text-sm">Toplam Oran:</span>
            <span className="text-[#10B981] text-lg font-black">{totalOdds}</span>
          </div>

          <div className="bg-[#1C2028] border border-white/5 rounded-lg p-3 mb-4 flex flex-col items-center">
            <div className="text-xs text-zinc-400 mb-1 w-full text-left">Bahis Miktarı (TRY)</div>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-white font-bold text-2xl outline-none text-center"
              placeholder="0"
            />
          </div>

          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-zinc-400 text-sm">Olası Kazanç:</span>
            <span className="text-white text-lg font-black">{potentialWin} ₺</span>
          </div>

          <button className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-black font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,163,0.2)]">
            Bahis Yap
          </button>
        </div>
      )}
    </div>
  );
};
