import React, { useState, useEffect } from 'react';
import { Dices, TrendingUp, RotateCcw, Shield, Target, Gamepad2 } from 'lucide-react';
import { triggerGlobalToast } from './GlobalToaster';

const MiniGamesSidebar = () => {
  const [activeGame, setActiveGame] = useState<'dice' | 'crash'>('dice');

  // Dice State
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [diceTarget, setDiceTarget] = useState(50);
  const [isRolling, setIsRolling] = useState(false);
  const [diceBet, setDiceBet] = useState(10);

  // Crash State
  const [crashMultiplier, setCrashMultiplier] = useState(1.0);
  const [crashStatus, setCrashStatus] = useState<'idle' | 'playing' | 'crashed'>('idle');
  const [crashBet, setCrashBet] = useState(10);
  const [crashTarget, setCrashTarget] = useState(2.0);

  // --- DICE LOGIC ---
  const handleRollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setDiceRoll(null);
    
    // Simulate rolling animation
    setTimeout(() => {
      const result = parseFloat((Math.random() * 100).toFixed(2));
      setDiceRoll(result);
      setIsRolling(false);
      
      if (result > diceTarget) {
        triggerGlobalToast(`Tebrikler! Zar ${result} geldi, kazandınız!`, 'success');
      } else {
        triggerGlobalToast(`Maalesef zar ${result} geldi, kaybettiniz.`, 'error');
      }
    }, 600);
  };

  // --- CRASH LOGIC ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (crashStatus === 'playing') {
      interval = setInterval(() => {
        setCrashMultiplier((prev) => {
          const newMult = prev + (prev * 0.05); // Exponential growth
          // Random crash condition
          if (Math.random() < 0.03 || newMult > 100) {
            setCrashStatus('crashed');
            triggerGlobalToast(`${newMult.toFixed(2)}x'de Patladı!`, 'error');
            return newMult;
          }
          return newMult;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [crashStatus]);

  const handleCrashAction = () => {
    if (crashStatus === 'idle' || crashStatus === 'crashed') {
      // Start Game
      setCrashMultiplier(1.0);
      setCrashStatus('playing');
    } else if (crashStatus === 'playing') {
      // Cashout
      setCrashStatus('idle');
      triggerGlobalToast(`Başarılı! ${crashMultiplier.toFixed(2)}x'de bozdurdunuz!`, 'success');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto">
      {/* Header */}
      <div className="p-3 bg-gradient-to-r from-purple-900/40 to-[#050505] border-b border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Gamepad2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-white font-black text-sm uppercase tracking-wider">Mini Oyunlar</h2>
            <p className="text-zinc-400 text-[10px]">Hızlı bahis, hızlı kazanç</p>
          </div>
        </div>
      </div>

      {/* Game Selector */}
      <div className="flex p-2 gap-2 bg-[#0a0a0a]">
        <button 
          onClick={() => setActiveGame('dice')}
          className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${activeGame === 'dice' ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'bg-[#111] border-white/5 hover:border-white/10'}`}
        >
          <Dices className={`w-5 h-5 ${activeGame === 'dice' ? 'text-purple-400' : 'text-zinc-500'}`} />
          <span className={`text-[10px] font-bold uppercase ${activeGame === 'dice' ? 'text-purple-400' : 'text-zinc-500'}`}>Dice (Zar)</span>
        </button>
        <button 
          onClick={() => setActiveGame('crash')}
          className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${activeGame === 'crash' ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'bg-[#111] border-white/5 hover:border-white/10'}`}
        >
          <TrendingUp className={`w-5 h-5 ${activeGame === 'crash' ? 'text-orange-400' : 'text-zinc-500'}`} />
          <span className={`text-[10px] font-bold uppercase ${activeGame === 'crash' ? 'text-orange-400' : 'text-zinc-500'}`}>Crash</span>
        </button>
      </div>

      {/* Game Area */}
      <div className="flex-1 p-3">
        {activeGame === 'dice' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Dice Display */}
            <div className="h-32 bg-gradient-to-br from-[#13111c] to-[#0a0a0a] rounded-2xl border border-purple-500/20 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-zinc-500 text-[10px] font-bold uppercase mb-2 tracking-widest">Sonuç</span>
                <div className={`text-4xl font-black ${isRolling ? 'text-white animate-bounce' : diceRoll === null ? 'text-zinc-700' : diceRoll > diceTarget ? 'text-[#00e701] drop-shadow-[0_0_15px_rgba(0,231,1,0.5)]' : 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}>
                  {isRolling ? '...' : diceRoll !== null ? diceRoll.toFixed(2) : '00.00'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-[#111] p-3 rounded-xl border border-white/5 flex flex-col gap-4">
              {/* Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-zinc-400">Hedef &gt; {diceTarget}</span>
                  <span className="text-purple-400">Kazanma Şansı: {(100 - diceTarget).toFixed(2)}%</span>
                </div>
                <input 
                  type="range" 
                  min="2" max="98" 
                  value={diceTarget}
                  onChange={(e) => setDiceTarget(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Bet Amount */}
              <div className="flex bg-[#050505] rounded-lg border border-white/10 p-1">
                <div className="flex-1 px-3 py-2 flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px] font-bold">Bahis:</span>
                  <input 
                    type="number" 
                    value={crashBet} 
                    onChange={(e) => setDiceBet(Number(e.target.value))}
                    className="bg-transparent text-right text-white font-bold w-20 outline-none"
                  />
                </div>
                <div className="flex gap-1 pl-2 border-l border-white/10">
                  <button onClick={() => setDiceBet(b => b / 2)} className="px-2 bg-[#1a1a1a] hover:bg-white/10 rounded text-xs font-bold text-zinc-400">/2</button>
                  <button onClick={() => setDiceBet(b => b * 2)} className="px-2 bg-[#1a1a1a] hover:bg-white/10 rounded text-xs font-bold text-zinc-400">x2</button>
                </div>
              </div>

              {/* Roll Button */}
              <button 
                onClick={handleRollDice}
                disabled={isRolling}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95 disabled:opacity-50"
              >
                {isRolling ? 'Sallanıyor...' : 'Zar At'}
              </button>
            </div>
          </div>
        )}

        {activeGame === 'crash' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Crash Display */}
            <div className={`h-40 rounded-2xl border flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${crashStatus === 'crashed' ? 'bg-red-950/30 border-red-500/50 shadow-[inset_0_0_50px_rgba(239,68,68,0.2)]' : 'bg-[#13111c] border-orange-500/20 shadow-inner'}`}>
              
              {crashStatus === 'playing' && (
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-orange-500/20 to-transparent animate-pulse"></div>
              )}

              <div className="relative z-10 flex flex-col items-center">
                <span className={`text-[10px] font-bold uppercase mb-1 tracking-widest ${crashStatus === 'crashed' ? 'text-red-500' : 'text-zinc-500'}`}>
                  {crashStatus === 'crashed' ? 'PATLADI' : crashStatus === 'playing' ? 'UÇUYOR' : 'HAZIR'}
                </span>
                <div className={`text-5xl font-black ${crashStatus === 'crashed' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]' : crashStatus === 'playing' ? 'text-orange-400 drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]' : 'text-white'}`}>
                  {crashMultiplier.toFixed(2)}x
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-[#111] p-3 rounded-xl border border-white/5 flex flex-col gap-3">
              {/* Bet Amount */}
              <div className="flex bg-[#050505] rounded-lg border border-white/10 p-1">
                <div className="flex-1 px-3 py-2 flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px] font-bold">Bahis:</span>
                  <input 
                    type="number" 
                    value={crashBet} 
                    onChange={(e) => setCrashBet(Number(e.target.value))}
                    className="bg-transparent text-right text-white font-bold w-20 outline-none"
                    disabled={crashStatus === 'playing'}
                  />
                </div>
                <div className="flex gap-1 pl-2 border-l border-white/10">
                  <button onClick={() => setCrashBet(b => b / 2)} disabled={crashStatus === 'playing'} className="px-2 bg-[#1a1a1a] hover:bg-white/10 rounded text-xs font-bold text-zinc-400">/2</button>
                  <button onClick={() => setCrashBet(b => b * 2)} disabled={crashStatus === 'playing'} className="px-2 bg-[#1a1a1a] hover:bg-white/10 rounded text-xs font-bold text-zinc-400">x2</button>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleCrashAction}
                className={`w-full py-4 text-white font-black text-lg uppercase tracking-widest rounded-lg transition-all active:scale-95 ${
                  crashStatus === 'playing' 
                    ? 'bg-gradient-to-r from-[#00e701] to-[#00c801] shadow-[0_0_20px_rgba(0,231,1,0.5)] animate-pulse' 
                    : crashStatus === 'crashed' 
                      ? 'bg-zinc-800 text-zinc-500' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                }`}
              >
                {crashStatus === 'playing' ? 'Bozdur' : crashStatus === 'crashed' ? 'Yeniden Oyna' : 'Bahis Yap'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Also export the Gamepad icon for the tab if needed
import { Gamepad2 as GamepadIcon } from 'lucide-react';
export { MiniGamesSidebar, GamepadIcon };
