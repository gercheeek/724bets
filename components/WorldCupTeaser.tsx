import React from 'react';

interface WorldCupTeaserProps {
  onMatchClick?: (matchId: string) => void;
}

const WorldCupTeaser: React.FC<WorldCupTeaserProps> = ({ onMatchClick }) => {
  return (
    <div className="w-full flex flex-col gap-6 font-sans h-full">
      
      {/* HERO BANNER */}
      <div className="w-full rounded-2xl overflow-hidden relative flex flex-col md:flex-row items-center min-h-[160px] md:min-h-[100px] h-full transform-gpu will-change-transform" 
           style={{ background: 'linear-gradient(90deg, #360773 0%, #15022e 100%)', WebkitTransform: 'translateZ(0)' }}>
        
        {/* Background Decorations (Simulating the coins/space bg) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center md:justify-end transform-gpu" style={{ WebkitTransform: 'translateZ(0)' }}>
           {/* We can use CSS gradients and blurred circles to simulate the space aesthetic since we don't have the exact image */}
           <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[200%] bg-gradient-to-l from-purple-600/30 to-transparent blur-3xl transform rotate-12"></div>
           <div className="absolute bottom-0 right-[20%] w-[300px] h-[300px] bg-yellow-500/20 rounded-full blur-3xl"></div>
           <div className="absolute top-[20%] right-[40%] w-[150px] h-[150px] bg-[#00FFA3]/20 rounded-full blur-2xl"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full p-5 md:p-6 lg:px-8 h-full gap-5 md:gap-0">
          
          {/* Title Area */}
          <div className="flex flex-col text-center md:text-left">
            <h2 className="text-white text-2xl md:text-[28px] lg:text-3xl font-bold tracking-tight leading-tight drop-shadow-md">
              En iyi <span className="text-[#00FFA3]">Dünya Kupası Oranları!</span>
            </h2>
          </div>

          {/* Action Area */}
          <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
            {/* Action Row */}
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
              <button className="bg-[#00FFA3] hover:bg-[#00e693] text-black font-bold text-sm px-6 py-2.5 rounded-lg w-full md:w-auto transition-colors shadow-[0_0_15px_rgba(0,255,163,0.3)]">
                Şimdi Oyna
              </button>
              
              <span className="text-white/60 text-xs font-medium hidden md:block">veya</span>
              
              <div className="flex items-center gap-2 w-full md:w-auto justify-center">
                {/* Steam */}
                <button className="w-10 h-10 rounded-lg bg-[#11648C] hover:bg-[#1475A3] flex items-center justify-center transition-colors shadow-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M11.967 1.463c-5.803 0-10.505 4.704-10.505 10.505 0 3.393 1.621 6.398 4.133 8.326l3.32-4.789c-.066-.312-.1-.637-.1-.973 0-2.316 1.884-4.2 4.2-4.2s4.2 1.884 4.2 4.2-1.884 4.2-4.2 4.2c-.392 0-.769-.064-1.127-.168l-4.781 6.842c1.616.643 3.4.996 5.26.996 5.802 0 10.504-4.704 10.504-10.505S17.769 1.463 11.967 1.463zm3.016 10.505c0-1.664-1.353-3.016-3.016-3.016s-3.016 1.352-3.016 3.016 1.352 3.016 3.016 3.016 3.016-1.352 3.016-3.016zm-3.016 2.052c-1.134 0-2.052-.919-2.052-2.052s.918-2.053 2.052-2.053 2.052.919 2.052 2.053-.918 2.052-2.052 2.052zm-6.19 1.942l-2.074 2.99c1.472 1.542 3.468 2.531 5.688 2.686l-.974-3.568a4.17 4.17 0 01-2.64-2.108z"/></svg>
                </button>
                {/* Google */}
                <button className="w-10 h-10 rounded-lg bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </button>
                {/* Telegram */}
                <button className="w-10 h-10 rounded-lg bg-[#27A7E7] hover:bg-[#2092ce] flex items-center justify-center transition-colors shadow-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.508-.163-.911-.25-8.875-.24-1.688.083-3.254-.72-3.275-1.442-.01-.322.253-.655.783-1.002 3.076-1.339 5.127-2.222 6.155-2.648 2.923-1.214 3.53-1.425 3.929-1.433zm0 0"/></svg>
                </button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="w-full bg-[#181A24]/70 backdrop-blur-md border border-white/5 rounded-lg px-3 md:px-4 py-2 text-center">
              <span className="text-white font-medium text-xs md:text-[13px]">
                12.414.981.632 <span className="text-white/80">Toplam Bahisler</span>
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default WorldCupTeaser;
