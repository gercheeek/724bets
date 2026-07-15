import React, { useState } from 'react';
import { Info, ShieldCheck, Settings, BarChart2, Volume2 } from 'lucide-react';

export default function PlinkoView() {
  const [betAmount, setBetAmount] = useState('0.00');
  const [risk, setRisk] = useState<'low' | 'medium' | 'high' | 'rain'>('low');

  // 16 rows of Plinko
  const rowCount = 16;
  const buckets = [
    { multiplier: '16x', color: 'bg-gradient-to-b from-[#ff3b3b] to-[#c70000] text-black' },
    { multiplier: '9x', color: 'bg-gradient-to-b from-[#ff543b] to-[#d62000] text-black' },
    { multiplier: '2x', color: 'bg-gradient-to-b from-[#ff713b] to-[#e64600] text-black' },
    { multiplier: '1.4x', color: 'bg-gradient-to-b from-[#ff8c3b] to-[#ea5f00] text-black' },
    { multiplier: '1.4x', color: 'bg-gradient-to-b from-[#ffa63b] to-[#f27a00] text-black' },
    { multiplier: '1.2x', color: 'bg-gradient-to-b from-[#ffbf3b] to-[#e89a00] text-black' },
    { multiplier: '1.1x', color: 'bg-gradient-to-b from-[#ffd53b] to-[#eeb000] text-black' },
    { multiplier: '1x', color: 'bg-gradient-to-b from-[#ffea3b] to-[#f2c600] text-black' },
    { multiplier: '0.5x', color: 'bg-gradient-to-b from-[#f3ff3b] to-[#d4e000] text-black' },
    { multiplier: '1x', color: 'bg-gradient-to-b from-[#ffea3b] to-[#f2c600] text-black' },
    { multiplier: '1.1x', color: 'bg-gradient-to-b from-[#ffd53b] to-[#eeb000] text-black' },
    { multiplier: '1.2x', color: 'bg-gradient-to-b from-[#ffbf3b] to-[#e89a00] text-black' },
    { multiplier: '1.4x', color: 'bg-gradient-to-b from-[#ffa63b] to-[#f27a00] text-black' },
    { multiplier: '1.4x', color: 'bg-gradient-to-b from-[#ff8c3b] to-[#ea5f00] text-black' },
    { multiplier: '2x', color: 'bg-gradient-to-b from-[#ff713b] to-[#e64600] text-black' },
    { multiplier: '9x', color: 'bg-gradient-to-b from-[#ff543b] to-[#d62000] text-black' },
    { multiplier: '16x', color: 'bg-gradient-to-b from-[#ff3b3b] to-[#c70000] text-black' },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-[#0F121A] text-gray-200">
      
      {/* Left Sidebar (Bet Controls) */}
      <div className="w-full lg:w-[320px] bg-[#1A1D29] border-r border-[#262A36] flex flex-col p-4 z-10 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-400 text-xs font-semibold">Bahis Miktarı</label>
            <span className="text-gray-500 text-[10px] font-bold">₹0.00</span>
          </div>
          <div className="flex bg-[#12141C] rounded-lg border border-[#262A36] overflow-hidden focus-within:border-gray-500 transition-colors">
            <div className="pl-3 pr-2 py-2.5 flex items-center justify-center border-r border-[#262A36]">
              <span className="text-gray-500 text-sm font-bold">$</span>
            </div>
            <input 
              type="text" 
              value={betAmount} 
              onChange={(e) => setBetAmount(e.target.value)}
              className="bg-transparent flex-1 text-white px-3 text-sm font-bold outline-none"
            />
            <button className="px-3 hover:bg-white/5 transition-colors text-gray-400 text-xs font-bold border-l border-[#262A36]">
              1/2
            </button>
            <button className="px-3 hover:bg-white/5 transition-colors text-gray-400 text-xs font-bold border-l border-[#262A36]">
              2x
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-400 text-xs font-semibold mb-2 block">Risk Seviyesi</label>
          <div className="bg-[#12141C] rounded-lg border border-[#262A36] p-1 flex">
            {['low', 'medium', 'high', 'rain'].map((level) => (
              <button 
                key={level}
                onClick={() => setRisk(level as any)}
                className={`flex-1 py-2 text-[10px] sm:text-xs font-bold rounded-md uppercase transition-all ${
                  risk === level 
                    ? 'bg-gradient-to-b from-[#2a8bf2] to-[#1258ef] text-white shadow-lg' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                {level === 'low' ? 'DÜŞÜK' : level === 'medium' ? 'ORTA' : level === 'high' ? 'YÜKSEK' : 'YAĞMUR'}
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
            <div className="flex-1 bg-[#12141C] border border-[#262A36] rounded-lg p-1.5 flex items-center">
              {/* Fake Slider visual matching the screenshot */}
              <div className="w-full flex items-center gap-1 bg-[#1C1F2B] rounded-full h-8 px-2 relative border border-[#2A2E3D]">
                 {/* Purple dashes */}
                 {Array.from({length: 8}).map((_, i) => (
                   <div key={i} className="flex-1 h-2 bg-[#8C52FF] rounded-full shadow-[0_0_5px_#8C52FF]" />
                 ))}
                 {/* Slider handle */}
                 <div className="absolute right-1 w-6 h-6 bg-white rounded-md flex items-center justify-center shadow-[0_2px_5px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-gray-100">
                   <div className="flex gap-0.5">
                     <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
                     <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
                     <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 mt-2">
          <div className="flex border-b border-[#262A36] mb-4">
             <button className="flex-1 text-gray-500 hover:text-gray-300 font-bold text-xs pb-2 transition-colors">Manuel</button>
             <button className="flex-1 text-[#27D26D] font-bold text-xs pb-2 border-b-2 border-[#27D26D]">Otomatik Bahis</button>
          </div>
          
          <div className="flex bg-[#12141C] rounded-lg border border-[#262A36] overflow-hidden focus-within:border-gray-500 transition-colors">
            <input 
              type="text" 
              value="0" 
              readOnly
              className="bg-transparent w-12 text-white px-3 text-sm font-bold outline-none text-center border-r border-[#262A36]"
            />
            <div className="flex-1 px-3 flex items-center">
              <div className="w-full h-1 bg-[#1C1F2B] rounded-full relative">
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-500 rounded-full cursor-pointer hover:bg-gray-400"></div>
              </div>
            </div>
            <button className="px-3 hover:bg-white/5 transition-colors text-gray-400 flex items-center justify-center border-l border-[#262A36]">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
            </button>
          </div>
        </div>

        <button className="w-full bg-[#27D26D] hover:bg-[#20b75a] text-white font-black py-4 rounded-lg shadow-[0_4px_15px_rgba(39,210,109,0.3)] transition-colors uppercase text-sm mb-4 mt-2">
          Giriş Yap
        </button>

        <div className="mt-auto pt-4 flex justify-between items-center text-gray-500 px-2">
           <div className="flex gap-4">
             <Settings className="w-4 h-4 hover:text-gray-300 cursor-pointer transition-colors" />
             <BarChart2 className="w-4 h-4 hover:text-gray-300 cursor-pointer transition-colors" />
             <Volume2 className="w-4 h-4 hover:text-gray-300 cursor-pointer transition-colors" />
           </div>
           <div className="flex gap-1">
             <div className="w-1.5 h-6 bg-gray-600 rounded-sm opacity-20"></div>
             <div className="w-1.5 h-4 bg-gray-600 rounded-sm opacity-20 self-end"></div>
             <div className="w-1.5 h-8 bg-gray-600 rounded-sm opacity-20 self-end"></div>
           </div>
        </div>
      </div>

      {/* Right Main Area (Plinko Board) */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-[#151921] to-[#0A0D12]">
        
        {/* Header Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 px-2">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-500 cursor-pointer hover:text-white transition-colors" />
            <div className="flex items-center gap-2">
              {/* Rainbet dots logo */}
              <div className="flex gap-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0090FF] shadow-[0_0_5px_#0090FF]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] shadow-[0_0_5px_#00FFA3]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#2a8bf2] shadow-[0_0_5px_#2a8bf2]"></div>
              </div>
              <span className="text-white font-bold text-sm tracking-wide">Plinko</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-gray-400 bg-white/5 px-3 py-1.5 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="text-xs font-semibold text-white">Adil Oyun</span>
          </div>
        </div>

        {/* Plinko Board Container */}
        <div className="w-full max-w-[700px] flex flex-col items-center mt-16 pb-12 pt-8 relative mx-auto">
          
          {/* Pegs */}
          <div className="flex flex-col gap-y-4 md:gap-y-6 w-full items-center relative z-10">
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex justify-center" style={{ gap: '22px' }}>
                {Array.from({ length: rowIndex + 3 }).map((_, colIndex) => (
                  <div 
                    key={colIndex} 
                    className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] relative"
                  >
                    {/* Inner shadow to make peg look 3D */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/80 to-transparent"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Buckets */}
          <div className="flex justify-center mt-6 w-full px-4 relative z-10" style={{ gap: '3px' }}>
            {buckets.map((bucket, i) => (
              <div 
                key={i} 
                className={`flex-1 flex items-center justify-center h-8 md:h-10 rounded-md shadow-[0_5px_15px_rgba(0,0,0,0.5)] border-b-4 border-black/30 hover:-translate-y-1 transition-transform cursor-pointer ${bucket.color}`}
              >
                <span className="font-black text-[9px] md:text-[11px] drop-shadow-sm tracking-tighter">{bucket.multiplier}</span>
              </div>
            ))}
          </div>

          {/* Subtle Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none flex items-center justify-center w-full">
             <span className="text-[150px] font-black italic tracking-tighter w-full text-center">Rainbet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
