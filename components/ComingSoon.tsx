import React from 'react';
import { Hammer } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#10B981]/5 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 flex flex-col items-center max-w-2xl text-center">
        {/* Logo Container (Copied from Header with larger text) */}
        <div className="mb-12 relative group cursor-default">
          <div className="flex items-center">
            <span className="logo-num text-6xl md:text-8xl tracking-tighter" style={{
              background: 'linear-gradient(135deg, #10B981, #10B981, #10B981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'logoGlow 3s ease-in-out infinite',
              filter: 'drop-shadow(0 0 8px rgba(0,255,163,0.4))'
            }}>724</span>
            <span className="logo-dot text-6xl md:text-8xl mx-[4px] leading-none mb-4 font-black" style={{ color: '#10B981' }}>.</span>
            <span className="logo-ext text-6xl md:text-8xl tracking-tight font-bold" style={{
              background: 'linear-gradient(135deg, #ffffff, #cccccc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>BETS</span>
          </div>
          
          {/* Logo CSS Animations */}
          <style>{`
            @keyframes logoGlow {
              0%, 100% { text-shadow: 0 0 10px rgba(0,255,163,0.3), 0 0 20px rgba(0,255,163,0.1); }
              50% { text-shadow: 0 0 15px rgba(0,255,163,0.5), 0 0 30px rgba(0,255,163,0.2), 0 0 45px rgba(0,255,163,0.1); }
            }
          `}</style>
        </div>

        <div className="bg-[#151921] border border-[#2A2E3D] rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10B981] to-transparent"></div>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center animate-pulse">
              <Hammer className="w-8 h-8 text-[#10B981]" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight">
            Yapım Aşamasındayız
          </h1>
          
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-lg mx-auto">
            Sizlere en iyi bahis ve casino deneyimini sunmak için altyapımızı yeniliyoruz. Çok yakında efsanevi özellikler ve yepyeni yüzümüzle karşınızda olacağız!
          </p>

          <div className="mt-8 pt-8 border-t border-white/5">
            <div className="inline-flex items-center gap-3 bg-[#0f141c] px-6 py-3 rounded-full border border-white/5">
              <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,163,0.8)]"></div>
              <span className="text-gray-300 font-bold text-sm uppercase tracking-widest">Çok Yakında</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
