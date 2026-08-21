import React, { useState } from 'react';
import { Trophy, Trash2, Activity, Star } from 'lucide-react';
import { useBetting } from '../contexts/BettingContext';
import { useUser } from '../contexts/UserContext';

export const SporxBetSlip = () => {
  const { betSelections, betTab, setBetTab, removeBetSelection, clearBetSelections } = useBetting();
  const { siteUser, setSiteUser } = useUser();
  const [betAmount, setBetAmount] = useState<string>('100');

  const totalOdds = betSelections.reduce((acc, curr) => acc * curr.odd, 1);
  const potentialWin = (parseFloat(betAmount || '0') * totalOdds).toFixed(2);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const placeBet = async () => {
    if (betSelections.length === 0) return;
    if (!siteUser) {
        alert("Lütfen önce giriş yapın.");
        return;
    }
    
    setIsSubmitting(true);
    
    try {
        const getSelectionKey = (selectionName: string, marketName: string) => {
             const sLower = selectionName.toLowerCase();
             if (marketName === 'Maç Sonucu' || marketName === '1X2') {
                 if (sLower.includes('ev') || sLower === '1') return '1';
                 if (sLower.includes('berabere') || sLower === 'x') return 'X';
                 if (sLower.includes('deplasman') || sLower === '2') return '2';
             }
             if (marketName.includes('Alt/Üst') || marketName.includes('2.5')) {
                 if (sLower.includes('üst')) return 'tU';
                 if (sLower.includes('alt')) return 'tA';
             }
             if (marketName.includes('Çifte Şans')) {
                 if (sLower === '1x') return 'cs1X';
                 if (sLower === '12') return 'cs12';
                 if (sLower === 'x2') return 'csX2';
             }
             if (marketName.includes('Karşılıklı Gol') || marketName === 'GG') {
                 if (sLower === 'var') return 'gg';
                 if (sLower === 'yok') return 'ng';
             }
             return selectionName;
        };

        const items = betSelections.map(b => ({
            matchId: b.matchId,
            homeTeam: b.homeTeam,
            awayTeam: b.awayTeam,
            selectionName: getSelectionKey(b.selectionName, b.marketName),
            odds: b.odd
        }));

        const cost = parseFloat(betAmount);
        const currentBalance = Number(siteUser?.balance || 0);

        if (currentBalance < cost) {
            alert(`❌ Yetersiz Bakiye! Mevcut bakiyeniz: ${currentBalance.toFixed(2)} TL`);
            setIsSubmitting(false);
            return;
        }

        const newBalance = currentBalance - cost;
        const updatedUser = { ...siteUser, balance: newBalance };
        setSiteUser(updatedUser);
        localStorage.setItem('site_current_member', JSON.stringify(updatedUser));
        localStorage.setItem('site_member', JSON.stringify(updatedUser));

        alert(`✅ Kupon Başarıyla Oynandı!\n\nYatırılan Tutar: ${cost.toFixed(2)} TL\nOlası Kazanç: ${(cost * totalOdds).toFixed(2)} TL\nYeni Bakiye: ${newBalance.toFixed(2)} TL`);
        clearBetSelections();
    } catch (e: any) {
        alert(`❌ İşlem Hatası: ${e.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[320px] flex-shrink-0 bg-[#20252D] flex flex-col h-full border-l border-white/5">
      {/* Header & Tabs */}
      <div className="px-4 pt-4 pb-2 bg-[#0A0C10] border-b border-white/5">
        <div className="flex items-center gap-2 mb-4 justify-center text-[color:var(--theme-accent)]">
          <Trophy className="w-5 h-5" />
          <span className="font-bold tracking-wide uppercase">Kuponum</span>
        </div>
        
        <div className="flex bg-[#161920] rounded-lg p-1">
          {['Tekil', 'Kombine', 'Sistem'].map(t => (
            <button 
              key={t}
              onClick={() => setBetTab(t)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                betTab === t ? 'bg-[color:var(--theme-accent)] text-black shadow-md' : 'text-zinc-500 hover:text-white'
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
            <div key={bet.id} className="bg-[#0A0C10] rounded-xl p-3 border border-white/5 relative group hover:border-white/10 transition-colors">
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
                  <span className="text-sm font-black text-[color:var(--theme-accent)] bg-[color:var(--theme-accent)]/10 px-2 py-0.5 rounded">
                    {bet.odd.toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-zinc-400">{bet.homeTeam} - {bet.awayTeam}</div>
              </div>
            </div>
          ))}
          
          <div className="mt-auto pt-4 flex flex-col gap-3">
            <div className="bg-[#0A0C10] rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-400">Toplam Oran</span>
                <span className="text-lg font-black text-[color:var(--theme-accent)]">{totalOdds.toFixed(2)}</span>
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

            <button 
              onClick={placeBet}
              disabled={isSubmitting}
              className={`w-full py-4 bg-gradient-to-r from-[color:var(--theme-accent)] to-[#00E75A] text-black font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,163,0.2)] ${
                 isSubmitting ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? 'BEKLEYİN...' : 'BAHİS YAP'}
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
            <button className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-white/5 bg-[#0A0C10] border border-white/5 text-zinc-300 transition-colors group">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[color:var(--theme-accent)]" />
                <span className="text-sm font-bold">Spor bahisleri</span>
              </div>
              <span className="text-zinc-600 group-hover:text-[color:var(--theme-accent)] transition-colors">→</span>
            </button>
            <button className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-white/5 bg-[#0A0C10] border border-white/5 text-zinc-300 transition-colors group">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-[color:var(--theme-accent)]" />
                <span className="text-sm font-bold">Canlı Bahis</span>
              </div>
              <span className="text-zinc-600 group-hover:text-[color:var(--theme-accent)] transition-colors">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
