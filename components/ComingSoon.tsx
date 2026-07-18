import React from 'react';
import { Hammer } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#06b6d4]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#06b6d4]/5 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 flex flex-col items-center max-w-2xl text-center">
        {/* Logo Container (Copied from Header with larger text) */}
        <div className="mb-12 relative group cursor-default">
          <div className="flex items-center group">
            <span className="text-[#06b6d4] font-extrabold text-6xl md:text-8xl tracking-tight lowercase" style={{
              animation: 'logoGlow 3s ease-in-out infinite',
              filter: 'drop-shadow(0 0 8px rgba(0,255,163,0.4))'
            }}>ahbapbet</span>
            <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full border-[4px] md:border-[6px] border-[#06b6d4] ml-3 -mt-16 md:-mt-20">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#06b6d4] w-4 h-4 md:w-6 md:h-6">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
               </svg>
            </div>
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#06b6d4] to-transparent"></div>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#06b6d4]/10 rounded-2xl flex items-center justify-center animate-pulse">
              <Hammer className="w-8 h-8 text-[#06b6d4]" />
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
              <div className="w-3 h-3 bg-[#06b6d4] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,163,0.8)]"></div>
              <span className="text-gray-300 font-bold text-sm uppercase tracking-widest">Çok Yakında</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
