import React, { useState } from 'react';
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

  return (
    <div className="fixed bottom-0 right-4 z-50 flex flex-col items-end shadow-2xl rounded-t-xl overflow-hidden font-sans w-[340px]">
      
      {/* EXPANDED CONTENT */}
      {isOpen && (
        <div className="w-full bg-[#1e2330] border border-[#2b313f] border-b-0 rounded-t-xl flex flex-col">
          {/* TABS */}
          <div className="flex bg-[#1e2330] border-b border-[#2b313f]">
            {['Tekli', 'Kombine', 'Sistem'].map(t => (
              <button 
                key={t}
                onClick={() => setBetTab(t)}
                className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
                  betTab === t ? 'text-white' : 'text-[#8b95a5] hover:text-white'
                }`}
              >
                {t}
                {betTab === t && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#3b82f6]"></div>
                )}
              </button>
            ))}
          </div>

          {/* COMBINE BONUS BOX (Moved under tabs) */}
          {betTab === 'Kombine' && (
            <div className="px-2 py-3 bg-[#191d26] border-b border-[#2b313f]">
              <div className="border border-[#10b981] rounded-md p-3 relative bg-[#1e2330]">
                <div className="absolute top-0 right-0 flex -mt-[10px] mr-2 text-[9px] font-bold">
                  <span className="bg-[#3b82f6] text-white px-1.5 py-0.5 rounded-l-sm">MİN ORAN: 1.50</span>
                  <span className="bg-[#10b981] text-white px-1.5 py-0.5 rounded-r-sm">KOMBİNE ÖZEL</span>
                </div>
                <p className="text-white text-xs font-semibold mt-1 mb-3">
                  {nextMilestone 
                    ? `Kazançlarınızı x${nextMilestone.multiplier} oranında arttırmak için ${nextMilestone.count - validComboBets} bahis kaldı.` 
                    : `Maksimum kombine bonusuna ulaştınız! (x1.50)`}
                </p>
                
                <div className="relative h-4 text-[10px] text-[#8b95a5] font-bold w-full">
                   <span className="absolute" style={{ left: '25%', transform: 'translateX(-50%)' }}>x1.05</span>
                   <span className="absolute" style={{ left: '45%', transform: 'translateX(-50%)' }}>x1.15</span>
                   <span className="absolute" style={{ left: '65%', transform: 'translateX(-50%)' }}>x1.25</span>
                   <span className="absolute" style={{ left: '95%', transform: 'translateX(-50%)' }}>x1.5</span>
                </div>
                <div className="flex gap-1 h-2 mt-1">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`flex-1 rounded-sm transition-colors ${
                      i < validComboBets ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[#2b313f]'
                    }`}></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="p-2 space-y-2 bg-[#191d26] max-h-[40vh] overflow-y-auto">
            {bets.map(bet => (
              <div key={bet.id} className="bg-[#242938] rounded-md relative flex border border-[#2b313f]">
                {/* Remove button (Left side in screenshot it's on left) */}
                <button 
                  onClick={() => removeBetSelection(bet.id)}
                  className="w-10 flex items-center justify-center border-r border-[#2b313f] text-[#8b95a5] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex-1 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px]">{'⚽'}</span>
                    <span className="text-white font-bold text-sm">{bet.selectionName}</span>
                  </div>
                  <div className="text-[#8b95a5] text-xs mb-0.5">{bet.homeTeam} vs {bet.awayTeam}</div>
                  <div className="text-[#8b95a5] text-xs mb-2">{bet.marketName}</div>
                  <div className="text-white font-bold text-lg">{bet.odd.toFixed(2)}</div>
                </div>
                
                {/* Green vertical bar on the right */}
                <div className={`w-1 rounded-r-md ${bet.odd >= 1.50 ? 'bg-[#10b981]' : 'bg-[#3b82f6]'}`}></div>
              </div>
            ))}
          </div>

          {/* STAKE INPUT */}
          <div className="px-3 py-2 bg-[#191d26]">
            <div className="bg-[#1e2330] border border-[#2b313f] rounded-md flex justify-end items-center px-3 py-2 mb-3">
              <input 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-right text-white text-lg outline-none w-full mr-1"
              />
              <span className="text-[#8b95a5] text-lg">$</span>
            </div>

            <div className="flex gap-2 mb-4">
              {[1, 10, 25, 100].map(val => (
                <button 
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className={`flex-1 py-2 rounded-full font-bold text-sm transition-colors ${
                    amount === val.toString() ? 'bg-[#3b82f6] text-white' : 'bg-[#242938] text-[#8b95a5] hover:text-white'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-[#8b95a5]">Toplam Oran</span>
              <span className="text-[#8b95a5]">{totalOdds.toFixed(3)}</span>
            </div>
            <div className="flex justify-between items-center text-xs mb-3">
              <span className="text-[#8b95a5]">Toplam Bahis</span>
              <span className="text-[#8b95a5]">{totalBet.toFixed(2)} $</span>
            </div>
            {betTab === 'Kombine' && currentMultiplier > 1 && (
              <div className="flex justify-between items-center text-xs mb-3 text-[#10b981]">
                <span className="font-bold">Kombine Ekstra Kazanç</span>
                <span className="font-bold">x{currentMultiplier.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-4 pt-3 border-t border-[#2b313f]">
              <span className="text-white font-bold text-sm uppercase">Muhtemel Kazanç</span>
              <span className="text-[#10b981] font-bold text-base">{potentialWin.toFixed(2)} $</span>
            </div>

            <div className="flex items-center gap-3 text-[#8b95a5] mb-4 bg-[#1e2330] p-3 rounded-md border border-[#2b313f]">
              <div className="w-8 h-8 rounded-full border border-[#8b95a5] flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm">Lütfen bahis almak için giriş yapınız</span>
            </div>

            <button className="w-full py-3 bg-[#2b313f] text-white font-bold rounded-full mb-2 hover:bg-[#3b4150] transition-colors">
              PAYLAŞ
            </button>
          </div>
        </div>
      )}

      {/* HEADER TABS (Always visible) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#229af0] hover:bg-[#1c84d4] transition-colors cursor-pointer text-white flex items-center justify-between px-4 py-3 rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white text-[#229af0] p-1.5 rounded flex items-center justify-center">
            <FileText className="w-5 h-5 fill-current" />
          </div>
          <span className="font-bold text-xl flex items-center gap-2">
            Kupon
            {bets.length > 0 && (
              <span className="bg-white text-[#229af0] w-6 h-6 rounded-full flex items-center justify-center text-sm">
                {bets.length}
              </span>
            )}
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </span>
        </div>
        
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <span className="font-bold text-xs uppercase tracking-wider">Hızlı Bahis</span>
          <button 
            onClick={() => setFastBet(!fastBet)}
            className={`w-[46px] h-[24px] rounded-full p-[2px] transition-colors border-2 border-white flex items-center ${
              fastBet ? 'bg-white' : 'bg-transparent'
            }`}
          >
            <div className={`w-[16px] h-[16px] rounded-full flex items-center justify-center transition-transform ${
              fastBet ? 'translate-x-[22px] bg-[#229af0]' : 'translate-x-0 bg-white'
            }`}>
              <Zap className={`w-3 h-3 ${fastBet ? 'text-white' : 'text-[#229af0] fill-current'}`} />
            </div>
          </button>
        </div>
      </div>
      
    </div>
  );
};
