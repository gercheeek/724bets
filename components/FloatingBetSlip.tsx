import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronUp, ChevronDown, FileText, Zap, X, Share2, User } from 'lucide-react';
import { useBetting } from '../contexts/BettingContext';

const COMBO_MILESTONES = [
  { count: 3, multiplier: 1.05 },
  { count: 5, multiplier: 1.15 },
  { count: 7, multiplier: 1.25 },
  { count: 10, multiplier: 1.50 }
];

export const FloatingBetSlip = () => {
  const { betSelections, removeBetSelection } = useBetting();
  const [isOpen, setIsOpen] = useState(false);
  const [betTab, setBetTab] = useState('Kombine');
  const [fastBet, setFastBet] = useState(false);
  const [amount, setAmount] = useState('1');

  // betSelections replaces the dummy bets
  const bets = betSelections;

  const totalOdds = bets.length > 0 ? bets.reduce((acc, bet) => acc * bet.odd, 1) : 0;
  const totalBet = parseFloat(amount || '0');

  const validComboBets = bets.filter(bet => bet.odd >= 1.50).length;
  let currentMultiplier = 1;
  let nextMilestone = COMBO_MILESTONES[0];
  
  for (let i = COMBO_MILESTONES.length - 1; i >= 0; i--) {
    if (validComboBets >= COMBO_MILESTONES[i].count) {
      currentMultiplier = COMBO_MILESTONES[i].multiplier;
      nextMilestone = COMBO_MILESTONES[i + 1] || null;
      break;
    }
  }

  const activeMultiplier = betTab === 'Kombine' ? currentMultiplier : 1;
  const potentialWin = totalOdds * totalBet * activeMultiplier;

  return createPortal(
    <div className="floating-bet-slip fixed bottom-0 z-[60] flex flex-col items-end shadow-2xl font-sans w-full md:w-[350px] right-0 transition-all duration-300 border-l border-[#111111]">
      
      {/* EXPANDED CONTENT */}
      {isOpen && (
        <div className="w-full h-[calc(100vh-70px)] bg-[#050505]/95 backdrop-blur-xl flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.5)]">
          {/* TABS */}
          <div className="flex bg-[#0F121A] border-b border-[#111111]">
            {['Tekli', 'Kombine', 'Sistem'].map(t => (
              <button 
                key={t}
                onClick={() => setBetTab(t)}
                className={`flex-1 py-4 text-[13px] font-bold transition-all relative uppercase tracking-wider ${
                  betTab === t ? 'text-[#10b981]' : 'text-[#848B9D] hover:text-white'
                }`}
              >
                {t}
                {betTab === t && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                )}
              </button>
            ))}
          </div>

          {/* COMBINE BONUS BOX (Moved under tabs) */}
          {betTab === 'Kombine' && bets.length >= 3 && (
            <div className="px-3 py-4 bg-[#050505] border-b border-[#111111]">
              <div className="border border-[#10b981]/20 rounded-lg p-4 relative bg-[#0F121A] overflow-hidden">
                <div className="absolute top-0 right-0 flex -mt-0 mr-0 text-[9px] font-bold rounded-bl-lg overflow-hidden">
                  <span className="bg-[#111111] text-white px-2 py-1">MİN ORAN: 1.50</span>
                  <span className="bg-[#10b981] text-black px-2 py-1">KOMBİNE ÖZEL</span>
                </div>
                <p className="text-[#848B9D] text-xs font-semibold mt-4 mb-4">
                  {nextMilestone 
                    ? <>Kazançlarınızı <span className="text-[#10b981]">x{nextMilestone.multiplier}</span> oranında arttırmak için <span className="text-white">{Math.max(0, nextMilestone.count - validComboBets)}</span> bahis kaldı.</>
                    : <span className="text-[#10b981]">Maksimum kombine bonusuna ulaştınız! (x1.50)</span>}
                </p>
                
                <div className="relative h-4 text-[10px] text-[#848B9D] font-bold w-full">
                   <span className="absolute" style={{ left: '25%', transform: 'translateX(-50%)' }}>x1.05</span>
                   <span className="absolute" style={{ left: '45%', transform: 'translateX(-50%)' }}>x1.15</span>
                   <span className="absolute" style={{ left: '65%', transform: 'translateX(-50%)' }}>x1.25</span>
                   <span className="absolute" style={{ left: '95%', transform: 'translateX(-50%)' }}>x1.5</span>
                </div>
                <div className="flex gap-1 h-1.5 mt-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`flex-1 rounded-full transition-colors ${
                      i < validComboBets ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-[#111111]'
                    }`}></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="p-3 space-y-3 bg-[#0F121A] flex-1 overflow-y-auto">
            {bets.map(bet => (
              <div key={bet.id} className="flex bg-[#111111] rounded-xl overflow-hidden border border-[#2A2E3D] hover:border-[#10b981]/50 transition-all relative animate-[slideIn_0.3s_ease-out] opacity-0 group" style={{animationFillMode: 'forwards'}}>
                {/* Remove button (Left side in screenshot it's on left) */}
                <button 
                  onClick={() => removeBetSelection(bet.id)}
                  className="w-10 flex items-center justify-center border-r border-[#2A2E3D] text-[#848B9D] hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex-1 p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px]">{'⚽'}</span>
                    <span className="text-white font-bold text-sm leading-none">{bet.selectionName}</span>
                  </div>
                  <div className="text-[#848B9D] text-xs mb-1">{bet.homeTeam} vs {bet.awayTeam}</div>
                  <div className="text-[#848B9D] text-xs mb-3">{bet.marketName}</div>
                  <div className="text-white font-black text-lg leading-none">{bet.odd.toFixed(2)}</div>
                </div>
                
                {/* Green vertical bar on the right */}
                <div className={`w-1 transition-colors ${bet.odd >= 1.50 ? 'bg-[#10b981] group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-[#2A2E3D]'}`}></div>
              </div>
            ))}
          </div>

          {/* STAKE INPUT */}
          <div className="px-4 py-5 bg-[#050505] border-t border-[#111111]">
            <div className="bg-[#0F121A] border border-[#2A2E3D] rounded-xl flex justify-end items-center px-4 py-3.5 mb-4 focus-within:border-[#10b981] transition-colors">
              <input 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-right text-white text-xl font-black outline-none w-full mr-2"
              />
              <span className="text-[#10b981] font-bold text-lg">$</span>
            </div>

            <div className="flex gap-2 mb-6">
              {[1, 10, 25, 100].map(val => (
                <button 
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                    amount === val.toString() 
                      ? 'bg-[#10b981] text-black shadow-[0_4px_15px_rgba(16,185,129,0.4)] translate-y-[-2px]' 
                      : 'bg-[#111111] border border-[#2A2E3D] text-[#848B9D] hover:text-[#10b981] hover:border-[#10b981]/30'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-[#848B9D] font-medium">Toplam Oran</span>
              <span className="text-white font-bold">{totalOdds.toFixed(3)}</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-5">
              <span className="text-[#848B9D] font-medium">Toplam Bahis</span>
              <span className="text-white font-bold">{totalBet.toFixed(2)} $</span>
            </div>
            {betTab === 'Kombine' && currentMultiplier > 1 && bets.length >= 3 && (
              <div className="flex justify-between items-center text-sm mb-5 text-[#10b981] bg-[#10b981]/10 px-3 py-2 rounded-lg">
                <span className="font-bold">Kombine Ekstra Kazanç</span>
                <span className="font-black">x{currentMultiplier.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-6 pt-5 border-t border-[#111111]">
              <span className="text-[#848B9D] font-bold text-xs uppercase tracking-widest">Muhtemel Kazanç</span>
              <span className="text-[#10b981] font-black text-2xl drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">{potentialWin.toFixed(2)} $</span>
            </div>

            {typeof window !== 'undefined' && !localStorage.getItem('siteUser') ? (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openLoginModal'))}
                className="w-full py-4 bg-zinc-800 text-zinc-500 cursor-not-allowed font-black text-lg tracking-widest rounded-xl transition-all relative overflow-hidden group"
              >
                BAHİS YAP
                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center backdrop-blur-sm text-white text-sm">
                  Giriş Yapmalısınız
                </div>
              </button>
            ) : (
              <button className="w-full py-4 bg-[#10b981] hover:bg-[#0ea371] text-black font-black text-lg tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-[0.98]">
                BAHİS YAP
              </button>
            )}
          </div>
        </div>
      )}

      {/* HEADER TABS (Always visible) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full transition-colors cursor-pointer flex items-center justify-between px-5 py-4 border-t-2 border-[#10b981] ${
          isOpen ? 'bg-[#0F121A]' : 'bg-[#0F121A] shadow-[0_-5px_20px_rgba(0,0,0,0.5)]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="bg-[#10b981]/10 text-[#10b981] p-2 rounded-lg flex items-center justify-center border border-[#10b981]/20">
            <FileText className="w-5 h-5" />
          </div>
          <span className="font-black text-lg flex items-center gap-2 text-white">
            KUPON
            {bets.length > 0 && (
              <span className="bg-[#10b981] text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                {bets.length}
              </span>
            )}
            {isOpen ? <ChevronDown className="w-5 h-5 text-[#848B9D]" /> : <ChevronUp className="w-5 h-5 text-[#848B9D]" />}
          </span>
        </div>
        
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <span className="font-bold text-xs uppercase tracking-wider text-[#848B9D]">Hızlı Bahis</span>
          <button 
            onClick={() => setFastBet(!fastBet)}
            className={`w-[48px] h-[26px] rounded-full p-[3px] transition-colors flex items-center ${
              fastBet ? 'bg-[#10b981]' : 'bg-[#111111] border border-[#2A2E3D]'
            }`}
          >
            <div className={`w-[20px] h-[20px] rounded-full flex items-center justify-center transition-transform shadow-md ${
              fastBet ? 'translate-x-[22px] bg-black' : 'translate-x-0 bg-[#848B9D]'
            }`}>
              <Zap className={`w-3 h-3 ${fastBet ? 'text-[#10b981] fill-current' : 'text-[#111111]'}`} />
            </div>
          </button>
        </div>
      </div>
      
    </div>,
    document.body
  );
};
