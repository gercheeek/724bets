import React, { useState } from 'react';
import { Settings, BarChart2, Volume2, ShieldCheck, Info } from 'lucide-react';
import { usePlinkoEngine } from './usePlinkoEngine';
import { supabase } from '../utils/supabase';

const MULTIPLIERS = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16];
const MULTIPLIER_COLORS = [
  'bg-gradient-to-b from-[#ff3b3b] to-[#c70000]', // 16x
  'bg-gradient-to-b from-[#ff543b] to-[#d62000]', // 9x
  'bg-gradient-to-b from-[#ff713b] to-[#e64600]', // 2x
  'bg-gradient-to-b from-[#ff8c3b] to-[#ea5f00]', // 1.4x
  'bg-gradient-to-b from-[#ffa63b] to-[#f27a00]', // 1.4x
  'bg-gradient-to-b from-[#ffbf3b] to-[#e89a00]', // 1.2x
  'bg-gradient-to-b from-[#ffd53b] to-[#eeb000]', // 1.1x
  'bg-gradient-to-b from-[#ffea3b] to-[#f2c600]', // 1x
  'bg-gradient-to-b from-[#f3ff3b] to-[#d4e000]', // 0.5x
  'bg-gradient-to-b from-[#ffea3b] to-[#f2c600]', // 1x
  'bg-gradient-to-b from-[#ffd53b] to-[#eeb000]', // 1.1x
  'bg-gradient-to-b from-[#ffbf3b] to-[#e89a00]', // 1.2x
  'bg-gradient-to-b from-[#ffa63b] to-[#f27a00]', // 1.4x
  'bg-gradient-to-b from-[#ff8c3b] to-[#ea5f00]', // 1.4x
  'bg-gradient-to-b from-[#ff713b] to-[#e64600]', // 2x
  'bg-gradient-to-b from-[#ff543b] to-[#d62000]', // 9x
  'bg-gradient-to-b from-[#ff3b3b] to-[#c70000]', // 16x
];

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
    onBucketLanded: () => {} // Win is calculated at drop time for sync reliability
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

    try {
      const logs = JSON.parse(localStorage.getItem('site_plinko_bets') || '[]');
      logs.push({
        id: Date.now().toString(),
        userId: siteUser.id,
        username: siteUser.username,
        betAmount: amount,
        multiplier,
        winAmount,
        profit: amount - winAmount,
        time: new Date().toISOString()
      });
      if (logs.length > 500) logs.shift();
      localStorage.setItem('site_plinko_bets', JSON.stringify(logs));
    } catch (e) { }

    dropBall(targetBucket);

    setTimeout(() => {
      setIsBetting(false);
      setLastPayout({ amount: winAmount, multiplier });
    }, 3000); // 3 seconds approx drop time
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-60px)] bg-[#0F121A] text-gray-200">
      
      {/* Left Sidebar (Bet Controls) */}
      <div className="w-full lg:w-[320px] bg-[#1A1D29] border-r border-[#262A36] flex flex-col p-4 z-10 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-400 text-xs font-semibold">Bahis Miktarı</label>
            <span className="text-gray-500 text-[10px] font-bold">
              {siteUser ? `$${siteUser.balance.toFixed(2)}` : '$0.00'}
            </span>
          </div>
          <div className="flex bg-[#12141C] rounded-lg border border-[#262A36] overflow-hidden focus-within:border-gray-500 transition-colors">
            <div className="pl-3 pr-2 py-2.5 flex items-center justify-center border-r border-[#262A36]">
              <span className="text-gray-500 text-sm font-bold">$</span>
            </div>
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(e.target.value)}
              step="0.1"
              min="0.1"
              className="bg-transparent flex-1 text-white px-3 text-sm font-bold outline-none"
            />
            <button 
              onClick={() => setBetAmount((parseFloat(betAmount)/2).toFixed(2))}
              className="px-3 hover:bg-white/5 transition-colors text-gray-400 text-xs font-bold border-l border-[#262A36]"
            >
              1/2
            </button>
            <button 
              onClick={() => setBetAmount((parseFloat(betAmount)*2).toFixed(2))}
              className="px-3 hover:bg-white/5 transition-colors text-gray-400 text-xs font-bold border-l border-[#262A36]"
            >
              2x
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-400 text-xs font-semibold mb-2 block">Risk Seviyesi</label>
          <div className="bg-[#12141C] rounded-lg border border-[#262A36] p-1 flex">
            {['low', 'medium', 'high'].map((level) => (
              <button 
                key={level}
                onClick={() => setRisk(level as any)}
                className={`flex-1 py-2 text-[10px] sm:text-xs font-bold rounded-md uppercase transition-all ${
                  risk === level 
                    ? 'bg-[#2A2E3D] text-white shadow-lg' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                {level === 'low' ? 'DÜŞÜK' : level === 'medium' ? 'ORTA' : 'YÜKSEK'}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-400 text-xs font-semibold mb-2 block">Satırlar</label>
          <div className="flex gap-2">
            <div className="w-12 bg-[#12141C] border border-[#262A36] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              16
            </div>
            <div className="flex-1 bg-[#12141C] border border-[#262A36] rounded-lg p-1.5 flex items-center opacity-50 cursor-not-allowed">
               <div className="w-full flex items-center gap-1 bg-[#1C1F2B] rounded-full h-8 px-2 relative border border-[#2A2E3D]">
                 {Array.from({length: 8}).map((_, i) => (
                   <div key={i} className="flex-1 h-2 bg-[#27D26D] rounded-full" />
                 ))}
               </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleBet}
          disabled={isBetting}
          className="w-full bg-[#27D26D] hover:bg-[#20b75a] disabled:opacity-50 disabled:cursor-not-allowed text-[#0F121A] font-black py-4 rounded-lg shadow-[0_4px_15px_rgba(39,210,109,0.3)] transition-colors uppercase text-sm mb-4 mt-2"
        >
          {isBetting ? 'BAHİS OYNANIYOR...' : 'GİRİŞ YAP (BAHİS)'}
        </button>

        <div className="mt-auto pt-4 flex justify-between items-center text-gray-500 px-2">
           <div className="flex gap-4">
             <Settings className="w-4 h-4 hover:text-gray-300 cursor-pointer transition-colors" />
             <BarChart2 className="w-4 h-4 hover:text-gray-300 cursor-pointer transition-colors" />
             <Volume2 className="w-4 h-4 hover:text-gray-300 cursor-pointer transition-colors" />
           </div>
        </div>
      </div>

      {/* Right Area (Canvas & Game) */}
      <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden bg-[#0F121A]">
        
        {/* Top Info */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <Info className="w-5 h-5 text-gray-500" />
          <span className="text-white font-bold tracking-widest text-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#27D26D]"></div>
            Plinko PRO
          </span>
        </div>
        
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#1A1D29] px-3 py-1.5 rounded-full border border-white/5">
          <ShieldCheck className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 font-semibold text-xs">Adil Oyun</span>
        </div>

        {/* Payout Notification */}
        {lastPayout && (
          <div className="absolute top-20 right-6 bg-[#1A1D29] border border-[#262A36] px-4 py-2 rounded-lg animate-fade-in-up z-50">
            <span className="text-gray-400 text-xs block mb-1">Son Kazanç</span>
            <span className={`text-lg font-black ${lastPayout.multiplier > 1 ? 'text-[#27D26D]' : 'text-gray-300'}`}>
              {lastPayout.multiplier > 1 ? '+' : ''}{lastPayout.amount.toFixed(2)} $
            </span>
          </div>
        )}

        {/* The Game Canvas Container */}
        <div className="relative w-full max-w-[800px] aspect-[4/3] flex flex-col items-center justify-center mt-12 scale-90 md:scale-100">
           {/* Plinko Logo Background */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
             <h1 className="text-[100px] md:text-[120px] font-black italic tracking-tighter select-none">PLINKO</h1>
           </div>
           
           <canvas 
             ref={canvasRef}
             width={800}
             height={600}
             className="z-10 w-full h-full object-contain absolute inset-0"
           />
        </div>
      </div>
    </div>
  );
}
