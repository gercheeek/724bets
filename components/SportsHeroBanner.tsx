import React from 'react';

export const SportsHeroBanner: React.FC = () => {
  return (
    <div className="w-full relative px-4 pt-4 pb-2 group">
      <div className="w-full h-[200px] md:h-[240px] lg:h-[280px] rounded-2xl bg-[#050505] relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-white/[0.05] group/banner">
        
        {/* Background Stadium */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 scale-100 group-hover/banner:scale-105 transition-transform duration-[10s] ease-out"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518605368461-1e1e38ce8058?auto=format&fit=crop&q=80&w=2000')` }}
        ></div>
        
        {/* Dark Overlays for Cinematic Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]/95"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-transparent to-[#050505]/90"></div>
        
        {/* Green/Turquoise Glow behind Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#10b981] opacity-[0.15] blur-[100px] rounded-full pointer-events-none"></div>

        {/* Left Player - Cinematic Fade (Hidden on mobile) */}
        <div className="hidden md:block absolute bottom-0 left-0 w-[45%] h-full pointer-events-none z-10" >
           <div 
             className="absolute inset-0 bg-cover bg-top opacity-70 mix-blend-luminosity filter contrast-125"
             style={{
               backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Lamine_Yamal_France_v_Spain_7.24.26-142.jpg/960px-Lamine_Yamal_France_v_Spain_7.24.26-142.jpg')`,
               WebkitMaskImage: 'radial-gradient(circle at 40% 40%, black 20%, transparent 70%)',
               maskImage: 'radial-gradient(circle at 40% 40%, black 20%, transparent 70%)'
             }}
           ></div>
        </div>

        {/* Right Player - Cinematic Fade (Hidden on mobile) */}
        <div className="hidden md:block absolute bottom-0 right-0 w-[45%] h-full pointer-events-none z-10">
           <div 
             className="absolute inset-0 bg-cover bg-top opacity-70 mix-blend-luminosity filter contrast-125"
             style={{
               backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/960px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg')`,
               WebkitMaskImage: 'radial-gradient(circle at 60% 40%, black 20%, transparent 70%)',
               maskImage: 'radial-gradient(circle at 60% 40%, black 20%, transparent 70%)'
             }}
           ></div>
        </div>

        {/* Center Content Area */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-4 pb-4 px-4">
          
          {/* Top Tag & Event Name */}
          <div className="flex flex-col items-center gap-2 mb-3 md:mb-4 animate-fade-in-up">
            <div className="px-4 py-1 rounded-full bg-[#10b981]/20 border border-[#10b981]/30 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="text-[#10b981] font-black text-[9px] md:text-[11px] tracking-[0.3em] uppercase">Günün Dev Maçı</span>
            </div>
            <h2 className="text-gray-300 font-black text-[10px] md:text-xs tracking-[0.4em] uppercase drop-shadow-lg">
              Dünya Kupası Finali
            </h2>
          </div>

          {/* Aggressive Typography for Teams */}
          <div className="flex items-center justify-center gap-3 md:gap-5 mb-6 md:mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h1 className="text-white font-black text-3xl md:text-5xl lg:text-[56px] uppercase tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] text-right leading-none">
              İSPANYA
            </h1>
            <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg px-2 py-1 md:px-3 md:py-1.5 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="text-[#10b981] font-black italic text-lg md:text-2xl lg:text-[28px] drop-shadow-md leading-none">VS</span>
            </div>
            <h1 className="text-white font-black text-3xl md:text-5xl lg:text-[56px] uppercase tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] text-left leading-none">
              ARJANTİN
            </h1>
          </div>

          {/* Dynamic Odds Buttons (Glassmorphism) */}
          <div className="flex items-center justify-center gap-2 md:gap-3 w-full max-w-[550px] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
             {[
               { label: '1 İSPANYA', odd: '2.40' },
               { label: 'X BERABERLİK', odd: '3.10' },
               { label: '2 ARJANTİN', odd: '2.80' }
             ].map((btn, idx) => (
               <button 
                 key={idx} 
                 className="flex-1 h-[42px] md:h-[50px] rounded-xl bg-black/40 hover:bg-[#10b981]/10 border border-white/10 hover:border-[#10b981]/80 backdrop-blur-xl flex flex-col items-center justify-center gap-0.5 group/odd transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:-translate-y-1 relative overflow-hidden"
               >
                 {/* Inner Glow on Hover */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#10b981]/20 to-transparent opacity-0 group-hover/odd:opacity-100 transition-opacity duration-300"></div>
                 {/* Shine effect */}
                 <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover/odd:left-[200%] transition-all duration-700 ease-in-out"></div>
                 
                 <span className="text-gray-400 group-hover/odd:text-[#36ffc4] font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-colors relative z-10">{btn.label}</span>
                 <span className="text-white font-black text-sm md:text-base tracking-wide relative z-10">{btn.odd}</span>
               </button>
             ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};
