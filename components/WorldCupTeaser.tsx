import React from 'react';

interface WorldCupTeaserProps {
  onMatchClick?: (matchId: string) => void;
}

const WorldCupTeaser: React.FC<WorldCupTeaserProps> = ({ onMatchClick }) => {
  return (
    <div className="w-full flex flex-col gap-6 font-sans h-full">
      
      {/* HERO BANNER */}
      <div className="w-full rounded-2xl overflow-hidden relative flex flex-col md:flex-row items-center min-h-[200px] md:min-h-[160px] h-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group cursor-pointer">
        
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
          <div className="absolute top-0 left-0 w-1/2 h-full bg-[#00FFA3]/5 blur-[100px] pointer-events-none"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full p-6 md:p-8 lg:px-10 h-full gap-6 md:gap-0">
          
          {/* Title Area */}
          <div className="flex flex-col text-center md:text-left max-w-md transform group-hover:translate-x-2 transition-transform duration-500">
            <h2 className="text-white text-3xl md:text-4xl lg:text-[40px] font-black tracking-tight leading-none drop-shadow-lg mb-2 font-['Outfit']">
              En iyi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFA3] to-[#00B273]">Dünya Kupası</span> Oranları!
            </h2>
            <p className="text-[#848B9D] font-medium text-sm mt-2">Maçlara anında bahis yapın, en yüksek kazançları yakalayın.</p>
          </div>

          {/* Action Area */}
          <div className="flex flex-col items-center md:items-end gap-4 shrink-0 transform group-hover:-translate-x-2 transition-transform duration-500">
            {/* Action Row */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <button className="relative overflow-hidden group/btn bg-[#00FFA3] hover:bg-[#00E676] text-black font-black px-8 py-3.5 text-sm tracking-[0.15em] rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,255,163,0.3)] hover:shadow-[0_4px_25px_rgba(0,255,163,0.5)] hover:-translate-y-0.5 inline-flex items-center justify-center uppercase w-full md:w-auto">
                <span className="relative z-10">Şimdi Oyna</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              </button>
              
              <span className="text-[#848B9D] text-xs font-bold uppercase tracking-wider hidden md:block">veya</span>
              
              <div className="flex items-center gap-2 w-full md:w-auto justify-center">
                {/* Steam */}
                <button className="w-11 h-11 rounded-xl bg-[#151821] hover:bg-[#1A1D29] border border-white/5 hover:border-white/10 flex items-center justify-center transition-all shadow-lg hover:-translate-y-0.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M11.967 1.463c-5.803 0-10.505 4.704-10.505 10.505 0 3.393 1.621 6.398 4.133 8.326l3.32-4.789c-.066-.312-.1-.637-.1-.973 0-2.316 1.884-4.2 4.2-4.2s4.2 1.884 4.2 4.2-1.884 4.2-4.2 4.2c-.392 0-.769-.064-1.127-.168l-4.781 6.842c1.616.643 3.4.996 5.26.996 5.802 0 10.504-4.704 10.504-10.505S17.769 1.463 11.967 1.463zm3.016 10.505c0-1.664-1.353-3.016-3.016-3.016s-3.016 1.352-3.016 3.016 1.352 3.016 3.016 3.016 3.016-1.352 3.016-3.016zm-3.016 2.052c-1.134 0-2.052-.919-2.052-2.052s.918-2.053 2.052-2.053 2.052.919 2.052 2.053-.918 2.052-2.052 2.052zm-6.19 1.942l-2.074 2.99c1.472 1.542 3.468 2.531 5.688 2.686l-.974-3.568a4.17 4.17 0 01-2.64-2.108z"/></svg>
                </button>
                {/* Google */}
                <button className="w-11 h-11 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center transition-all shadow-lg hover:-translate-y-0.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </button>
                {/* Telegram */}
                <button className="w-11 h-11 rounded-xl bg-[#27A7E7] hover:bg-[#2092ce] flex items-center justify-center transition-all shadow-lg hover:-translate-y-0.5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.508-.163-.911-.25-8.875-.24-1.688.083-3.254-.72-3.275-1.442-.01-.322.253-.655.783-1.002 3.076-1.339 5.127-2.222 6.155-2.648 2.923-1.214 3.53-1.425 3.929-1.433zm0 0"/></svg>
                </button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="w-full bg-[#0B0E14]/80 backdrop-blur-md border border-white/5 rounded-xl px-4 py-2.5 flex items-center justify-between">
              <span className="text-[#848B9D] font-bold text-xs uppercase tracking-wider">Toplam Bahisler</span>
              <span className="text-white font-black text-[15px] tracking-wide text-right">
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
