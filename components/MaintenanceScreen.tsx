import React from 'react';
import { Settings, Tool, Clock, Lock } from 'lucide-react';

interface MaintenanceScreenProps {
  message?: string;
}

const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6"
      style={{
        background: 'radial-gradient(circle at center, #0a0a0a 0%, #000 100%)',
        fontFamily: "'Inter', sans-serif"
      }}>
      
      {/* Animated Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-2xl w-full text-center">
        {/* Branding */}
        <div className="mb-12 flex flex-col items-center">
          <div className="w-20 h-20 mb-6 rounded-2xl bg-amber-500 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)]">
            <Settings className="w-10 h-10 text-black animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2">
            724<span className="text-amber-500">BETS</span>
          </h1>
          <p className="text-zinc-500 font-bold tracking-[0.3em] uppercase text-xs">Premium Gaming & Analysis</p>
        </div>

        {/* Content Box */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
          <div className="flex justify-center gap-4 mb-8">
             <div className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Bakım Modu Yayında</span>
             </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
             Sizin İçin <span className="text-amber-500">Güçleniyoruz</span>
          </h2>

          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-medium mb-10">
            {message || "Daha iyi bir kullanıcı deneyimi ve yeni özellikler için sistemlerimizde kısa bir ara verdik. Lütfen biraz sonra tekrar kontrol ediniz."}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-2">
            {[
              { label: 'GÜVENLİK', sub: 'Güncelleniyor' },
              { label: 'PERFORMANS', sub: 'Optimize' },
              { label: 'YENİ SÜRÜM', sub: 'v2.4.0' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-[11px] font-bold text-zinc-300">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
           © 2026 724BETS · Güven ve Hız Bir Arada
        </p>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MaintenanceScreen;
