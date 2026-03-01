
import React, { useState, useRef, useEffect } from 'react';
import { UserStats, CaseReward } from '../types';
import { Box, Sparkles, Trophy } from 'lucide-react';

interface CaseOpeningViewProps {
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  onReward: (amount: number, reason: string) => void;
}

const DEFAULT_REWARDS: CaseReward[] = [
  { id: '1', value: 1, probability: 0.4, label: 'BRONZ ÖDÜL' },
  { id: '2', value: 5, probability: 0.3, label: 'GÜMÜŞ ÖDÜL' },
  { id: '3', value: 10, probability: 0.15, label: 'ALTIN ÖDÜL' },
  { id: '4', value: 50, probability: 0.1, label: 'ELMAS ÖDÜL' },
  { id: '5', value: 100, probability: 0.05, label: 'EFSANEVİ ÖDÜL' },
];

const CaseOpeningView: React.FC<CaseOpeningViewProps> = ({ userStats, setUserStats, onReward }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonReward, setWonReward] = useState<CaseReward | null>(null);
  const [casePool, setCasePool] = useState<CaseReward[]>([]);
  const reelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate pool for visual effect
    const pool = [];
    for (let i = 0; i < 50; i++) {
      pool.push(DEFAULT_REWARDS[Math.floor(Math.random() * DEFAULT_REWARDS.length)]);
    }
    setCasePool(pool);
  }, []);

  const openCase = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWonReward(null);

    // Random choice based on probability
    const rand = Math.random();
    let cumulative = 0;
    let selected: CaseReward = DEFAULT_REWARDS[0];
    for (const r of DEFAULT_REWARDS) {
      cumulative += r.probability;
      if (rand <= cumulative) {
        selected = r;
        break;
      }
    }

    // Prepare the final pool where index 45 is the winner
    const newPool = [...casePool];
    newPool[45] = selected;
    setCasePool(newPool);

    // Start animation
    if (reelRef.current) {
        reelRef.current.style.transition = 'none';
        reelRef.current.style.transform = 'translateX(0)';
        
        setTimeout(() => {
          if (reelRef.current) {
            reelRef.current.style.transition = 'transform 5s cubic-bezier(0.1, 0.7, 0.1, 1)';
            // Calculate exact position to center the 45th item (item width is 150px approx)
            const itemWidth = 160;
            const containerWidth = reelRef.current.parentElement?.clientWidth || 0;
            const offset = (45 * itemWidth) - (containerWidth / 2) + (itemWidth / 2);
            reelRef.current.style.transform = `translateX(-${offset}px)`;
          }
        }, 50);
    }

    setTimeout(() => {
      setWonReward(selected);
      setIsSpinning(false);
      onReward(selected.value, `Kasa Açılışı: ${selected.label}`);
      setUserStats(prev => ({
        ...prev,
        caseHistory: [{ rewardLabel: selected.label, timestamp: Date.now() }, ...prev.caseHistory].slice(0, 20)
      }));
    }, 5500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
      <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-4xl font-black text-white mb-2 tracking-tighter flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              PREMIUM KASA AÇILIŞI
          </h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Şansını dene, efsanevi bonusu yakala!</p>
      </div>

      {/* Roulette View */}
      <div className="relative w-full bg-zinc-950 border-2 border-primary/20 rounded-[40px] p-8 overflow-hidden mb-12 glow-primary">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 bg-primary z-20 shadow-[0_0_20px_var(--primary-color)]"></div>
          
          <div className="relative overflow-hidden h-40 flex items-center">
              <div ref={reelRef} className="case-reel flex gap-4">
                  {casePool.map((item, i) => (
                      <div key={i} className={`w-[144px] h-32 flex-shrink-0 rounded-2xl flex flex-col items-center justify-center border border-zinc-800 transition-all ${item.value >= 50 ? 'bg-primary/10 border-primary/50' : 'bg-zinc-900'}`}>
                          <div className={`w-12 h-12 rounded-xl mb-2 flex items-center justify-center ${item.value >= 50 ? 'bg-primary text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                              {item.value >= 50 ? <Trophy className="w-6 h-6" /> : <Box className="w-6 h-6" />}
                          </div>
                          <span className="font-black text-xs text-white">{item.label}</span>
                          <span className="text-[10px] font-bold text-zinc-500">{item.value} Bonus</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <div className="flex flex-col items-center gap-8">
          {wonReward && (
              <div className="bg-primary/20 border-2 border-primary p-6 rounded-3xl text-center animate-bounce">
                  <span className="text-zinc-400 font-bold uppercase text-xs block mb-1">Tebrikler!</span>
                  <h4 className="text-3xl font-black text-white">{wonReward.label} KAZANDIN!</h4>
                  <p className="text-primary font-black text-xl">+{wonReward.value} BONUS HESABINDA</p>
              </div>
          )}

          <button 
            disabled={isSpinning}
            onClick={openCase}
            className={`group relative overflow-hidden bg-primary text-black font-black py-6 px-16 rounded-full text-2xl shadow-2xl transition-all glow-button ${isSpinning ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105 active:scale-95'}`}
          >
              {isSpinning ? 'KASA AÇILIYOR...' : 'KASAYI AÇ!'}
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
      </div>

      <div className="mt-20 grid grid-cols-2 md:grid-cols-5 gap-4 w-full opacity-60">
          {DEFAULT_REWARDS.map(r => (
              <div key={r.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center">
                  <span className="text-zinc-500 font-bold text-[10px] uppercase mb-1">{r.label}</span>
                  <span className="text-white font-black text-sm">{r.value} Bonus</span>
                  <span className="text-primary font-bold text-[8px] mt-1">%{r.probability * 100} İHTİMAL</span>
              </div>
          ))}
      </div>
    </div>
  );
};

export default CaseOpeningView;
