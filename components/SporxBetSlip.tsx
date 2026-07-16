import React, { useState } from 'react';
import { Trophy, Trash2, Activity, Star } from 'lucide-react';
import { useBetting } from '../contexts/BettingContext';

export const SporxBetSlip = () => {
  const { betSelections, betTab, setBetTab, removeBetSelection, clearBetSelections } = useBetting();
  const [betAmount, setBetAmount] = useState<string>('100');

  const totalOdds = betSelections.reduce((acc, curr) => acc * curr.odd, 1);
  const potentialWin = (parseFloat(betAmount || '0') * totalOdds).toFixed(2);

  return (
    <div className="w-[320px] flex-shrink-0 bg-[#20252D] flex flex-col h-full border-l border-white/5">
      {/* Header & Tabs */}
      <div className="px-4 pt-4 pb-2 bg-[#1A1D24] border-b border-white/5">
        <div className="flex items-center gap-2 mb-4 justify-center text-[#10B981]">
          <Trophy className="w-5 h-5" />
          <span className="font-bold tracking-wide uppercase">Kuponum</span>
        </div>
        
        <div className="flex bg-[#161920] rounded-lg p-1">
          {['Tekil', 'Kombine', 'Sistem'].map(t => (
            <button 
              key={t}
              onClick={() => setBetTab(t)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                betTab === t ? 'bg-[#10B981] text-black shadow-md' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bet Slip Content */}
      {betSelections.length > 0 ? (
        <div className="flex-1 flex flex-col p-3 gap-2 overflow-y-auto custom-scrollbar bg-[#161920]">
          {betSelections.map(bet => (
            <div key={bet.id} className="bg-[#1A1D24] rounded-xl p-3 border border-white/5 relative group hover:border-white/10 transition-colors">
              <button 
                onClick={() => removeBetSelection(bet.id)}
                className="absolute top-2 right-2 p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="pr-6">
                <div className="text-[10px] text-zinc-500 mb-1 uppercase tracking-wider">{bet.marketName}</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{bet.selectionName}</span>
                  <span className="text-sm font-black text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                    {bet.odd.toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-zinc-400">{bet.homeTeam} - {bet.awayTeam}</div>
              </div>
            </div>
          ))}
          
          <div className="mt-auto pt-4 flex flex-col gap-3">
            <div className="bg-[#1A1D24] rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-400">Toplam Oran</span>
                <span className="text-lg font-black text-[#10B981]">{totalOdds.toFixed(2)}</span>
              </div>
              
              <div className="bg-[#161920] rounded-lg p-2 border border-white/5 flex items-center justify-between mb-3">
                <span className="text-xs text-zinc-500 pl-2">Miktar (₺)</span>
                <input 
                  type="number" 
                  value={betAmount} 
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-transparent text-right text-white font-bold text-lg outline-none w-24"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-xs font-bold text-zinc-400">Olası Kazanç</span>
                <span className="text-xl font-black text-white">{potentialWin} ₺</span>
              </div>
            </div>

            <button className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#00E75A] text-black font-black uppercase tracking-wider rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(0,255,163,0.2)]">
              BAHİS YAP
            </button>
            <button 
              onClick={clearBetSelections}
              className="w-full py-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
            >
              Kuponu Temizle
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-[#161920]">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 mb-4 border border-white/5">
            <Trophy className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="text-white font-bold mb-2">Bahis Kuponu Boş</h3>
          <p className="text-[11px] text-zinc-500 leading-relaxed mb-8 px-4">
            Seçim eklemek için bir orana tıklayın veya aşağıdaki akıllı önerilerimize göz atın.
          </p>
          
          <div className="w-full flex flex-col gap-2">
            <button className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-white/5 bg-[#1A1D24] border border-white/5 text-zinc-300 transition-colors group">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm font-bold">Spor bahisleri</span>
              </div>
              <span className="text-zinc-600 group-hover:text-[#10B981] transition-colors">→</span>
            </button>
            <button className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-white/5 bg-[#1A1D24] border border-white/5 text-zinc-300 transition-colors group">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm font-bold">Canlı Bahis</span>
              </div>
              <span className="text-zinc-600 group-hover:text-[#10B981] transition-colors">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
