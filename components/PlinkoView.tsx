import React, { useState } from 'react';
import { ShieldCheck, Settings } from 'lucide-react';
import { usePlinkoEngine } from './usePlinkoEngine';
import { useUser } from '../contexts/UserContext';

const MULTIPLIERS = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16];
const WEIGHTS = [1, 16, 120, 560, 1820, 4368, 8008, 11440, 12870, 11440, 8008, 4368, 1820, 560, 120, 16, 1];
const TOTAL_WEIGHT = 65536;

export default function PlinkoView({ siteUser, onAuthRequired }: any) {
  const { playInstantGame } = useUser();
  const [betAmount, setBetAmount] = useState('2.00');
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('low');
  const [isBetting, setIsBetting] = useState(false);
  const [lastPayout, setLastPayout] = useState<{ amount: number; multiplier: number } | null>(null);
  const [demoBalance, setDemoBalance] = useState<number>(10000.00);

  const { canvasRef, dropBall } = usePlinkoEngine({
    rowCount: 16,
    width: 900,
    height: 700,
    onBucketLanded: () => {} 
  });

  const handleBet = async () => {
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    if (siteUser && siteUser.balance < amount) {
      alert("Yetersiz bakiye!");
      return;
    } else if (!siteUser && demoBalance < amount) {
      alert("Demo bakiyesi yetersiz!");
      return;
    }

    try {
      let targetBucket = 8;
      let winAmount = 0;
      let multiplier = 0.5;

      if (siteUser) {
          const data = await playInstantGame(amount, 'Plinko');
          targetBucket = data.result.bucket;
          winAmount = data.win_amount;
          multiplier = data.multiplier;
      } else {
          // Demo Mode
          let r = Math.random() * TOTAL_WEIGHT;
          let sum = 0;
          for (let i = 0; i < WEIGHTS.length; i++) {
              sum += WEIGHTS[i];
              if (r < sum) {
                  targetBucket = i;
                  multiplier = MULTIPLIERS[i];
                  break;
              }
          }
          winAmount = amount * multiplier;
          setDemoBalance(prev => prev - amount); // Deduct immediately
      }
      
      setIsBetting(true);
      dropBall(targetBucket, '#c6ff00');

      setTimeout(() => {
        setIsBetting(false);
        setLastPayout({ amount: winAmount, multiplier });
        if (!siteUser) {
            setDemoBalance(prev => prev + winAmount);
        }
      }, 2000);

    } catch (err: any) {
      alert(err.message || 'Hata oluştu!');
      return;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-72px)] lg:h-[calc(100vh-72px)] bg-[#0B0E14] text-white font-sans overflow-y-auto lg:overflow-hidden relative">
        
        {/* ── LEFT SIDEBAR (Controls) ── */}
        <div className="w-full lg:w-[320px] bg-[#131620] border-r border-[#1E2336] p-4 md:p-5 flex flex-col shrink-0 z-20 lg:h-full overflow-y-auto order-2 lg:order-1 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
            
            {/* Tabs */}
            <div className="flex bg-[#0B0E14] rounded-full p-1 mb-6 border border-[#1E2336]">
                <button className="flex-1 bg-[#1E2336] text-white rounded-full py-1.5 text-[13px] font-bold shadow-md">Manual</button>
                <button className="flex-1 text-zinc-500 rounded-full py-1.5 text-[13px] font-bold hover:text-white transition-colors">Auto</button>
            </div>

            <div className="px-1 flex flex-col gap-4 mb-4">
                {/* Bet Amount */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-[12px] text-zinc-400 font-bold block">Bet amount</label>
                        <span className="text-[10px] text-zinc-500 font-bold">{siteUser ? siteUser.balance.toFixed(2) : demoBalance.toFixed(2)} EUR</span>
                    </div>
                    <div className="flex bg-[#0B0E14] border border-[#1E2336] rounded-md overflow-hidden h-11 focus-within:border-[#00E5FF]/50 focus-within:shadow-[0_0_10px_rgba(0,229,255,0.1)] transition-all">
                        <input 
                            type="number" 
                            value={betAmount || ''}
                            onChange={(e) => setBetAmount(e.target.value)}
                            disabled={isBetting}
                            placeholder="0.00"
                            className="flex-1 bg-transparent px-3 text-sm text-white outline-none font-medium disabled:opacity-50"
                        />
                        <div className="flex items-center border-l border-[#1E2336]">
                            <span className="text-zinc-500 text-xs font-bold px-2">EUR</span>
                            <div className="flex h-full border-l border-[#1E2336]">
                                <button className="px-3 hover:bg-white/5 text-zinc-400 text-xs font-bold transition-colors" onClick={() => setBetAmount((parseFloat(betAmount) / 2).toFixed(2))}>½</button>
                                <div className="w-[1px] h-full bg-[#1E2336]"></div>
                                <button className="px-3 hover:bg-white/5 text-zinc-400 text-xs font-bold transition-colors" onClick={() => setBetAmount((parseFloat(betAmount) * 2).toFixed(2))}>2x</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Risk Level */}
                <div>
                    <label className="text-[12px] text-zinc-400 font-bold mb-1 block">Risk</label>
                    <div className="relative">
                        <select 
                            value={risk}
                            onChange={(e) => setRisk(e.target.value as any)}
                            disabled={isBetting}
                            className="w-full bg-[#0B0E14] border border-[#1E2336] rounded-md h-11 px-3 text-sm text-white outline-none font-medium appearance-none focus:border-[#00E5FF]/50 transition-all"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                </div>

                {/* Rows */}
                <div>
                    <label className="text-[12px] text-zinc-400 font-bold mb-1 block">Rows</label>
                    <div className="relative">
                        <select 
                            disabled={isBetting}
                            className="w-full bg-[#0B0E14] border border-[#1E2336] rounded-md h-11 px-3 text-sm text-white outline-none font-medium appearance-none focus:border-[#00E5FF]/50 transition-all"
                        >
                            <option value="16">16</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <button 
                    onClick={handleBet}
                    disabled={isBetting}
                    className={`w-full py-3.5 rounded-md font-black text-[14px] tracking-wide transition-all uppercase relative overflow-hidden mt-4 ${
                        isBetting ? 'bg-[#1E2336] text-zinc-500 cursor-not-allowed' : 'bg-[#c6ff00] hover:bg-[#a6d900] text-black shadow-[0_0_15px_rgba(198,255,0,0.3)]'
                    }`}
                >
                    {isBetting ? 'Dropping...' : 'Bet'}
                </button>
            </div>
        </div>

        {/* ── RIGHT MAIN AREA (Robust Absolute/Flex Layout) ── */}
        <div className="flex-1 flex flex-col relative bg-[#0B0E14] order-1 lg:order-2 min-h-[350px] lg:min-h-0 border-b lg:border-b-0 border-[#1E2336]">
            

            {/* Main Graph Area */}
            <div className="flex-1 relative w-full overflow-hidden bg-gradient-to-b from-[#131620] to-[#0b0e14]">
                {/* Decorative inner pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
                
                {/* Payout Notification */}
                {lastPayout && !isBetting && (
                    <div className="absolute top-6 right-6 z-50 animate-fade-in-up flex flex-col items-end">
                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-0.5">KAZANÇ</span>
                        <span className={`text-2xl font-black ${lastPayout.multiplier > 1 ? 'text-[#c6ff00]' : 'text-zinc-300'}`}>
                            {lastPayout.multiplier >= 1 ? '+' : ''}{lastPayout.amount.toFixed(2)} ₺
                        </span>
                    </div>
                )}

                {/* The Canvas Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <canvas 
                        ref={canvasRef}
                        width={900}
                        height={700}
                        className="w-full h-full max-w-full max-h-full object-contain [object-position:center] z-10"
                    />
                </div>
            </div>

            {/* Bottom Footer bar */}
            <div className="h-12 border-t border-[#1E2336] bg-[#0B0E14] flex items-center justify-between px-4 md:px-6 z-30 shrink-0">
                <button className="flex items-center justify-center w-8 h-8 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-colors group">
                    <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                </button>
                
                <div className="text-zinc-700 font-black text-lg md:text-xl tracking-tighter opacity-30 absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none" style={{ fontFamily: 'Arial, sans-serif' }}>
                    724<span className="font-light text-[10px] md:text-xs tracking-widest mt-0.5">ORIGINALS</span>
                </div>

                <div className="flex gap-2">
                    <span className="text-zinc-500 text-[10px] md:text-xs font-bold mr-4 self-center">Fairness</span>
                    <div className="w-8 h-8 rounded-full bg-[#00E5FF] text-black font-black flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.3)] text-[10px] cursor-pointer hover:bg-[#33edff] transition-colors">
                        CHAT
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
