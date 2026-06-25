import React from 'react';
import { ShoppingBag, ChevronRight, Sparkles, Trophy, Tv, Ticket } from 'lucide-react';

interface StoreTeaserProps {
  onViewChange: (view: any) => void;
}

const StoreTeaser: React.FC<StoreTeaserProps> = ({ onViewChange }) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* ══════════ HIGH-FIDELITY PREMIUM HERO BANNER ══════════ */}
      <div 
        onClick={() => {
          onViewChange('loyalty');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="group relative w-full min-h-[340px] md:h-[380px] rounded-[28px] overflow-hidden border border-zinc-800/60 hover:border-red-500/25 transition-all duration-500 cursor-pointer flex flex-col md:flex-row justify-between items-center"
        style={{
          background: 'radial-gradient(ellipse at top left, #120305 0%, #08080c 60%, #020203 100%)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 40px rgba(255,23,68,0.03)'
        }}
      >
        
        {/* Subtle Ambient Red Glow Effects */}
        <div className="absolute top-0 left-0 w-[40%] h-[100%] bg-gradient-to-tr from-red-650/5 to-transparent pointer-events-none blur-[60px]" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[80%] bg-gradient-to-bl from-red-900/10 to-transparent pointer-events-none blur-[80px]" />
        
        {/* Shimmer Sweep Animation on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[28px]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        </div>

        {/* ─── LEFT COLUMN: BANNER TEXT & CTA ─── */}
        <div className="flex-1 p-8 md:p-12 z-10 flex flex-col justify-center items-start text-left space-y-6">
          
          {/* Micro-badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(255,23,68,0.1)]">
            <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">YENİLENEN SADAKAT MARKETİ</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-[1.05]">
              Yenilenmiş <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">Store</span>
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm font-medium tracking-wide max-w-[420px] leading-relaxed">
              Yayınları izle, bilet al, büyük ödülleri kazanma şansı yakala! 7/24Bets Store ayrıcalıklarını hemen keşfet.
            </p>
          </div>

          {/* Interactive Feature Icons Grid */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[380px] pt-1">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
              <div className="w-5 h-5 rounded-lg bg-white/3 flex items-center justify-center border border-white/5 group-hover:border-red-500/20 group-hover:text-red-500 transition-colors">
                <Tv className="w-3 h-3 text-zinc-400 group-hover:text-red-500" />
              </div>
              Yayın İzle
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
              <div className="w-5 h-5 rounded-lg bg-white/3 flex items-center justify-center border border-white/5 group-hover:border-red-500/20 group-hover:text-red-500 transition-colors">
                <Ticket className="w-3 h-3 text-zinc-400 group-hover:text-red-500" />
              </div>
              Bilet Al
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
              <div className="w-5 h-5 rounded-lg bg-white/3 flex items-center justify-center border border-white/5 group-hover:border-red-500/20 group-hover:text-red-500 transition-colors">
                <Trophy className="w-3 h-3 text-zinc-400 group-hover:text-red-500" />
              </div>
              Ödül Kazan
            </div>
          </div>

          {/* Glowing Red CTA Button */}
          <button 
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl font-black text-xs text-white uppercase tracking-widest transition-all duration-300 transform group-hover:scale-[1.03] shadow-[0_8px_30px_rgba(239,68,68,0.2)] bg-[#FF1744] hover:bg-[#D50000] hover:shadow-[0_8px_30px_rgba(255,23,68,0.4)]"
            style={{ cursor: 'pointer' }}
          >
            <ShoppingBag className="w-4 h-4 text-white fill-current" />
            Store'a Git
            <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-[2px] transition-transform" />
          </button>
        </div>

        {/* ─── RIGHT COLUMN: EXQUISITE VEHICLES & PHONES ART ─── */}
        <div className="relative w-full md:w-[50%] h-[240px] md:h-full overflow-hidden flex items-end justify-center">
          
          {/* Subtle Backglow Circle behind vehicles */}
          <div className="absolute top-[20%] right-[10%] w-[260px] h-[260px] rounded-full bg-gradient-to-tr from-red-650/10 to-amber-500/5 blur-[50px] pointer-events-none animate-pulse" />

          {/* Generated High-Fidelity Banner Graphic */}
          <img 
            src="/store_banner.png" 
            alt="Yenilenmiş Store Banners" 
            className="w-full h-full object-cover md:object-contain object-bottom select-none pointer-events-none transform group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            style={{
              filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.6))'
            }}
          />
        </div>

      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        .animate-shimmer {
          animation: storeShimmer 3s linear infinite;
        }
        @keyframes storeShimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

    </div>
  );
};

export default StoreTeaser;
