import React from 'react';
import { Settings, Lock } from 'lucide-react';

interface MaintenanceScreenProps {
  message?: string;
  onAdminLogin?: () => void;
}

const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ message, onAdminLogin }) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6"
      style={{
        background: 'radial-gradient(circle at center, #0a0a0a 0%, #000 100%)',
        fontFamily: "'Inter', sans-serif"
      }}>
      
      {/* Animated Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-md w-full text-center">
        {/* Branding */}
        <div className="mb-6 md:mb-8 flex flex-col items-center">
          <div className="w-12 h-12 mb-4 rounded-xl bg-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.25)]">
            <Settings className="w-6 h-6 text-black animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-1">
            724<span className="text-amber-500">BAHİS.NET</span>
          </h1>
          <p className="text-zinc-500 font-bold tracking-[0.3em] uppercase text-[9px]">Premium Gaming & Analysis</p>
        </div>

        {/* Content Box */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-5 md:p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl">
          <div className="flex justify-center gap-4 mb-5 md:mb-6">
             <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                <span className="text-amber-500 text-[9px] font-black uppercase tracking-widest">Bakım Modu Yayında</span>
             </div>
          </div>

          <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 leading-tight">
             Sizin İçin <span className="text-amber-500">Güçleniyoruz</span>
          </h2>

          <p className="text-zinc-400 text-[13px] md:text-sm leading-relaxed font-medium mb-6 md:mb-8 px-4">
            {message || "Daha iyi bir kullanıcı deneyimi ve yeni özellikler için sistemlerimizde kısa bir ara verdik. Lütfen biraz sonra tekrar kontrol ediniz."}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-1">
            {[
              { label: 'GÜVENLİK', sub: 'Güncel' },
              { label: 'PERFORMANS', sub: 'Optimize' },
              { label: 'YENİ SÜRÜM', sub: 'v2.4.0' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-[10px] font-bold text-zinc-300">{stat.sub}</div>
              </div>
            ))}
          </div>

          <button
            onClick={onAdminLogin}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800/50 hover:bg-amber-500/10 border border-zinc-700 hover:border-amber-500/30 text-[10px] font-black text-zinc-500 hover:text-amber-500 uppercase tracking-widest transition-all duration-300 group"
          >
            <Lock className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            YETKİLİ GİRİŞİ
          </button>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
           © 2026 724BAHİS.NET · Güven ve Hız Bir Arada
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
