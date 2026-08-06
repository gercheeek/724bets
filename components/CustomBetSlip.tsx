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
          <DollarSign className="w-5 h-5 text-[#06b6d4]" />
          <h2 className="text-white font-black text-sm uppercase tracking-wide">Seçimlerim</h2>
        </div>
        {bets.length > 0 && (
          <span className="bg-[#06b6d4] text-black text-xs font-bold px-2 py-0.5 rounded-full">
            {bets.length} Maç
          </span>
        )}
      </div>

      {/* Bets List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {bets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-60 min-h-[300px]">
            <TrendingUp className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">Listenizde etkinlik bulunmuyor.</p>
            <p className="text-xs text-center mt-1">Oranlara tıklayarak listenize ekleyin.</p>
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
                  <div className="text-sm font-semibold text-[#06b6d4]">{bet.selection}</div>
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
            <span className="text-[#06b6d4] text-lg font-black">{totalOdds}</span>
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

          <div className="flex gap-2">
            <button className="flex-1 bg-[#06b6d4] hover:bg-[#06b6d4]/90 text-black font-black text-[15px] uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:-translate-y-0.5">
              KUPON YAP
            </button>
            <button 
              onClick={() => {
                const betId = Math.random().toString(36).substr(2, 6).toUpperCase();
                const chatInput = document.querySelector('input[placeholder="Bir mesaj yazın..."]') as HTMLInputElement;
                if (chatInput) {
                  // Simulate typing a bet share command into the chat
                  chatInput.value = `Spor: #${betId} Özel Oran: ${totalOdds} - Olası Kazanç: ${potentialWin}₺`;
                  chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                  // Highlight chat area to draw attention
                  const chatWrapper = document.getElementById('modern-chat-wrapper');
                  if (chatWrapper) {
                     chatWrapper.classList.add('ring-2', 'ring-[#06b6d4]', 'ring-offset-2', 'ring-offset-black');
                     setTimeout(() => chatWrapper.classList.remove('ring-2', 'ring-[#06b6d4]', 'ring-offset-2', 'ring-offset-black'), 2000);
                  }
                }
              }}
              className="w-14 bg-[#1A212D] border border-white/5 hover:border-[#06b6d4]/50 hover:bg-[#202836] text-white flex items-center justify-center rounded-xl transition-colors group"
              title="Kuponu Sohbette Paylaş"
            >
              <Share2 className="w-5 h-5 text-zinc-400 group-hover:text-[#06b6d4] transition-colors" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
