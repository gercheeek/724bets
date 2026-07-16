import React from 'react';

interface WorldCupTeaserProps {
  onMatchClick?: (matchId: string) => void;
}

const WorldCupTeaser: React.FC<WorldCupTeaserProps> = ({ onMatchClick }) => {
  return (
    <div className="w-full flex flex-col gap-6 font-sans h-full">
      
      {/* HERO BANNER */}
      <div className="w-full rounded-2xl overflow-hidden relative flex flex-col md:flex-row items-center min-h-[140px] md:min-h-[160px] h-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group cursor-pointer">
        
        {/* Continuous Motion Style */}
        <style>{`
          @keyframes continuousPan {
            0% { transform: scale(1.15) translate(-2%, -1%); }
            50% { transform: scale(1.15) translate(2%, 1%); }
            100% { transform: scale(1.15) translate(-2%, -1%); }
          }
          .animate-pan {
            animation: continuousPan 20s linear infinite;
          }
        `}</style>

        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="w-full h-full transform group-hover:scale-[1.15] transition-transform duration-1000 ease-out">
            <img 
              src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop" 
              alt="World Cup Stadium" 
              className="w-full h-full object-cover object-center animate-pan"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/90 to-[#0B0E14]/20 group-hover:from-[#0B0E14] group-hover:via-[#0B0E14]/80 group-hover:to-transparent transition-colors duration-500"></div>
          {/* Neon Green Glow Effect */}
          <div className="absolute top-0 left-0 w-1/2 h-full bg-[#10B981]/5 blur-[100px] pointer-events-none"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full p-4 md:p-8 lg:px-10 h-full gap-4 md:gap-0">
          
          {/* Title Area */}
          <div className="flex flex-col text-center md:text-left max-w-md transform group-hover:translate-x-2 transition-transform duration-500 w-full md:w-auto">
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-black tracking-tight leading-tight md:leading-none drop-shadow-lg mb-1 md:mb-2 font-['Outfit']">
              En iyi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#00B273]">Dünya Kupası</span> Oranları!
            </h2>
            <p className="text-[#848B9D] font-medium text-xs sm:text-sm mt-1 md:mt-2">Maçlara anında bahis yapın, en yüksek kazançları yakalayın.</p>
          </div>

          {/* Action Area */}
          <div className="flex flex-col items-center md:items-end gap-3 md:gap-4 w-full md:w-auto shrink-0 transform group-hover:-translate-x-2 transition-transform duration-500">
            {/* Action Row */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              {/* Refined 'Şimdi Oyna' button: proper flex centering and border accent instead of solid block */}
              <button className="relative overflow-hidden group/btn bg-transparent border-2 border-[#10B981] hover:bg-[#10B981]/10 text-white font-black px-8 h-10 md:h-12 text-[11px] sm:text-xs tracking-[0.15em] rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,255,163,0.1)] hover:shadow-[0_0_25px_rgba(0,255,163,0.3)] hover:-translate-y-0.5 flex items-center justify-center uppercase w-full md:w-auto">
                <span className="relative z-10 flex items-center justify-center h-full pt-[2px]">ŞİMDİ OYNA</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#10B981]/20 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              </button>
            </div>
            
            {/* Stats (Fixed mobile overflow by adding max-w-full and text-xs) */}
            <div className="w-full max-w-full overflow-hidden bg-[#0B0E14]/80 backdrop-blur-md border border-white/5 rounded-xl px-3 md:px-4 py-2.5 flex items-center justify-between gap-2">
              <span className="text-[#848B9D] font-bold text-[10px] md:text-xs uppercase tracking-wider whitespace-nowrap">Toplam Bahisler</span>
              <span className="text-white font-black text-xs md:text-[15px] tracking-wide text-right truncate">
                12.414.981.632
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WorldCupTeaser;
