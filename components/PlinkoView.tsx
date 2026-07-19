import React, { useState } from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { usePlinkoEngine } from './usePlinkoEngine';
import { supabase } from '../utils/supabase';

const MULTIPLIERS = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16];
const WEIGHTS = [1, 16, 120, 560, 1820, 4368, 8008, 11440, 12870, 11440, 8008, 4368, 1820, 560, 120, 16, 1];
const TOTAL_WEIGHT = 65536;

export default function PlinkoView({ siteUser, setSiteUser, onAuthRequired }: any) {
  const [betAmount, setBetAmount] = useState('1.00');
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('low');
  const [isBetting, setIsBetting] = useState(false);
  const [lastPayout, setLastPayout] = useState<{ amount: number; multiplier: number } | null>(null);

  const { canvasRef, dropBall } = usePlinkoEngine({
    rowCount: 16,
    width: 800,
    height: 600,
    onBucketLanded: () => {} 
  });

  const handleBet = async () => {
    if (!siteUser) {
      if (onAuthRequired) onAuthRequired();
      return;
    }
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (siteUser.balance < amount) {
      alert("Yetersiz bakiye!");
      return;
    }

    setIsBetting(true);

    let rand = Math.floor(Math.random() * TOTAL_WEIGHT);
    let targetBucket = 0;
    for (let i = 0; i < WEIGHTS.length; i++) {
      if (rand < WEIGHTS[i]) {
        targetBucket = i;
        break;
      }
      rand -= WEIGHTS[i];
    }

    const multiplier = MULTIPLIERS[targetBucket];
    const winAmount = amount * multiplier;
    
    const newBalance = siteUser.balance - amount + winAmount;
    setSiteUser({ ...siteUser, balance: newBalance });
    
    if (!siteUser.id.toString().startsWith('guest_')) {
      supabase.from('members').update({ balance: newBalance }).eq('id', siteUser.id).then();
    }

    dropBall(targetBucket);

    setTimeout(() => {
      setIsBetting(false);
      setLastPayout({ amount: winAmount, multiplier });
    }, 3000); 
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-[#10171E] text-white font-sans overflow-y-auto md:overflow-hidden">
        
        {/* ── LEFT SIDEBAR (Controls) ── */}
        <div className="w-full md:w-[320px] bg-[#222E3A] border-r border-[#151D24] p-4 flex flex-col shrink-0 z-20 shadow-2xl order-2 md:order-1 h-auto md:h-full overflow-y-auto">
            
            {/* Tabs */}
            <div className="flex bg-[#151D24] rounded-full p-1 mb-6">
                <button className="flex-1 bg-[#324555] text-white text-sm font-semibold rounded-full py-2 shadow-sm">Manuel</button>
                <button className="flex-1 text-gray-400 hover:text-white text-sm font-semibold rounded-full py-2 transition-colors">Oto</button>
            </div>

            {/* Bet Amount */}
            <div className="mb-4 relative">
                <div className="flex justify-between items-end mb-2">
                    <label className="text-xs text-gray-400 font-semibold">Bahis Tutarı</label>
                    <span className="text-xs text-gray-300 font-mono">₺{siteUser ? siteUser.balance.toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex bg-[#151D24] rounded-md border border-[#2A3744] overflow-hidden focus-within:border-[#3D82F6] transition-colors">
                    <div className="px-3 flex items-center justify-center text-gray-400">₺</div>
                    <input 
                        type="number" 
                        value={betAmount || ''}
                        onChange={(e) => setBetAmount(e.target.value)}
                        disabled={isBetting}
                        placeholder="0.00"
                        className="flex-1 bg-transparent text-white font-mono text-sm py-3 outline-none"
                    />
                    <div className="flex">
                        <button className="px-3 text-xs font-bold text-gray-300 hover:bg-[#2A3744] border-l border-[#2A3744] transition-colors" onClick={() => setBetAmount((parseFloat(betAmount) / 2).toFixed(2))}>½</button>
                        <button className="px-3 text-xs font-bold text-gray-300 hover:bg-[#2A3744] border-l border-[#2A3744] transition-colors" onClick={() => setBetAmount((parseFloat(betAmount) * 2).toFixed(2))}>2x</button>
                    </div>
                </div>
            </div>

            {/* Risk Level */}
            <div className="mb-6">
                <label className="block text-xs text-gray-400 font-semibold mb-2">Risk Seviyesi</label>
                <div className="relative">
                    <select 
                        value={risk}
                        onChange={(e) => setRisk(e.target.value as any)}
                        disabled={isBetting}
                        className="w-full bg-[#151D24] text-white text-sm font-semibold py-3 px-4 rounded-md appearance-none border border-[#2A3744] outline-none focus:border-[#3D82F6]"
                    >
                        <option value="low">Düşük</option>
                        <option value="medium">Orta</option>
                        <option value="high">Yüksek</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-auto">
                <button 
                    onClick={handleBet}
                    disabled={isBetting}
                    className={`w-full font-bold py-3.5 rounded-md transition-colors shadow-lg ${
                        isBetting ? 'bg-[#324555] text-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                >
                    {isBetting ? 'Düşüyor...' : 'Bahis'}
                </button>
            </div>
        </div>

        {/* ── RIGHT MAIN AREA (Centered Game Frame) ── */}
        <div className="flex-1 bg-[#10171E] relative overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-12 order-1 md:order-2 min-h-[400px] md:min-h-0">
            
            {/* ── CENTERED GAME CONTAINER ── */}
            <div className="w-full max-w-5xl h-full max-h-[700px] bg-[#151C23] relative rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center border-[6px] border-[#1C252D]">
                
                {/* Top Info Badges */}
                <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
                    <Info className="w-5 h-5 text-gray-500" />
                    <span className="text-white font-bold tracking-widest text-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#27D26D]"></div>
                        Plinko
                    </span>
                </div>
                
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#111111] px-3 py-1.5 rounded-full border border-white/5 z-20">
                    <ShieldCheck className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 font-semibold text-xs">Adil Oyun</span>
                </div>

                {/* Payout Notification */}
                {lastPayout && !isBetting && (
                    <div className="absolute top-20 right-6 bg-[#111111] border border-[#262A36] px-4 py-2 rounded-lg animate-fade-in-up z-50">
                        <span className="text-gray-400 text-xs block mb-1">Son Kazanç</span>
                        <span className={`text-lg font-black ${lastPayout.multiplier >= 1 ? 'text-[#27D26D]' : 'text-gray-300'}`}>
                            {lastPayout.multiplier >= 1 ? '+' : ''}{lastPayout.amount.toFixed(2)} ₺
                        </span>
                    </div>
                )}

                {/* Plinko Logo Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
                    <h1 className="text-[100px] md:text-[140px] font-black italic tracking-tighter select-none">PLINKO</h1>
                </div>
                
                {/* The Canvas */}
                <div className="relative w-full h-full max-w-[800px] aspect-[4/3] flex flex-col items-center justify-center mt-12 scale-90 md:scale-100 z-10">
                    <canvas 
                        ref={canvasRef}
                        width={800}
                        height={600}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        </div>
    </div>
  );
}
