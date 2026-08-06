import React from 'react';
import { ArrowRight, ChevronDown, Gamepad2, Trophy, Bitcoin, Wallet, Cherry, Dribbble } from 'lucide-react';

const CASINO_TILES = [
  '/images/clean-plinko-v2.webp',
  '/images/clean-dice-v2.webp',
  '/images/clean-mines-v2.webp',
  '/images/clean-roulette-v2.webp',
  '/images/slots_banner_purple.webp',
  '/images/clean-keno-v2.webp',
  '/images/clean-limbo-v2.webp',
  '/images/clean-blackjack-v2.webp'
];

const SPORTS_TILES = [
  '/images/sports_basketball.jpg',
  '/images/sports_football.jpg',
  '/images/sports_hockey.jpg',
  '/images/sports_nfl.jpg',
  '/images/sports_esports.jpg',
  '/images/sports_baseball.jpg',
  '/images/sports_badminton.jpg',
  '/images/gamdom_sports_card.jpg'
];
import { useTranslation } from 'react-i18next';

interface MainHeroProps {
  onRegisterClick: () => void;
  onNavigate: (view: string) => void;
}

export default function MainHero({ onRegisterClick, onNavigate }: MainHeroProps) {
  const { t } = useTranslation();
  return (
    <>
      <style>{`
        @keyframes iso-slide-up {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        @keyframes iso-slide-down {
          from { transform: translateY(-50%); }
          to { transform: translateY(0); }
        }
      `}</style>
      <div className="w-full max-w-[1300px] mx-auto flex flex-col xl:flex-row items-start xl:items-center justify-between pt-5 pb-5 xl:pt-8 xl:pb-8 relative z-20 px-5 xl:px-10 gap-6 xl:gap-10 bg-gradient-to-br from-[#161c28]/95 to-[#0b0e17]/95 backdrop-blur-3xl border border-white/[0.06] rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
      
      {/* Left Content Area (Text + Buttons) */}
      <div className="w-full xl:w-[43%] min-w-0 flex flex-col items-start text-left pr-0 xl:pr-6 relative z-10">
        {/* Ambient Orb Behind Text - Mixed Cyan/Gold */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] lg:w-[300px] lg:h-[300px] bg-[#00E5FF]/10 rounded-full blur-[60px] lg:blur-[80px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] lg:w-[250px] lg:h-[250px] bg-yellow-500/15 rounded-full blur-[60px] lg:blur-[80px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Crypto Badge */}
        <div className="flex items-center gap-2 mb-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 w-fit px-3 py-1.5 rounded-full opacity-0 animate-[fade-in-up_0.8s_ease-out_forwards]">
          <Bitcoin className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300" />
          <span className="text-zinc-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider drop-shadow-md">Kripto ile Anında İşlem</span>
        </div>

        {/* Title */}
        <h1 
          className="text-[32px] sm:text-5xl xl:text-[56px] 2xl:text-[64px] font-black leading-[1.05] xl:leading-[1.1] mb-3 xl:mb-5 tracking-tighter w-full drop-shadow-[0_0_30px_rgba(255,223,0,0.15)] relative z-10 bg-clip-text text-transparent bg-gradient-to-br from-white via-[#FFEAA7] to-[#FDCB6E] bg-[length:200%_auto] animate-[bg-gradient_5s_ease-in-out_infinite,fade-in-up_0.8s_ease-out_forwards] opacity-0"
        >
        {t('home.hero_title_1')} <br className="hidden md:block" /> {t('home.hero_title_2')}
      </h1>

        <p className="text-zinc-300/90 text-[15px] xl:text-[17px] mb-5 xl:mb-8 font-medium max-w-md leading-relaxed opacity-0 animate-[fade-in-up_0.8s_ease-out_0.1s_forwards] drop-shadow-sm">
          Kripto ile limitsiz bahis dünyasına adım atın ve anında kazanmaya başlayın.
        </p>
      {/* Action Row */}
      <div 
        className="flex flex-row items-center gap-3 sm:gap-6 mb-2 xl:mb-4 w-full opacity-0 animate-[fade-in-up_0.8s_ease-out_0.2s_forwards]"
      >
        {/* Register Button */}
        <button 
          onClick={onRegisterClick} 
          className="relative overflow-hidden bg-gradient-to-r from-[#00E5FF] via-[#00B4D8] to-[#00E5FF] bg-[length:200%_auto] hover:bg-right text-[#06080e] font-black text-[14px] xl:text-[16px] px-6 xl:px-8 py-3 xl:py-3.5 rounded-xl flex items-center gap-2 transition-all duration-500 shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] active:scale-95 group uppercase tracking-widest border border-white/20 z-10 shrink-0"
        >
          <div className="absolute inset-0 bg-white/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <span className="relative z-10 flex items-center gap-2">{t('home.register')} <ArrowRight className="w-4 h-4 xl:w-5 xl:h-5 group-hover:translate-x-1 transition-transform duration-300" /></span>
        </button>
        
        {/* Or Text */}
        <span className="text-zinc-500 font-bold text-[10px] lg:text-xs px-1 uppercase tracking-widest shrink-0">{t('home.or')}</span>
        
        {/* Google Login */}
        <button 
          className="bg-[#0f141e]/80 hover:bg-[#1a2333] rounded-lg px-4 py-2.5 xl:py-3 flex items-center gap-2.5 border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 active:scale-95 group justify-center shadow hover:shadow-md"
          title="Google ile Giriş Yap"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 lg:w-5 lg:h-5 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          <span className="text-zinc-300 group-hover:text-white font-bold text-[13px] xl:text-[14px] hidden sm:block tracking-wide">Google</span>
        </button>
      </div>
    </div>

      {/* Cards Grid (Right Side on Desktop) */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:gap-7 w-full xl:w-[57%] min-w-0 mt-2 xl:mt-0 opacity-0 animate-[fade-in-up_1s_ease-out_0.4s_forwards]">
        {/* Casino Card Wrapper for Floating */}
        <div className="relative animate-float-card" style={{ animationDelay: '0s' }}>
          {/* Ambient Glow Behind Casino Card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00E5FF]/20 to-blue-600/20 rounded-[28px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Casino Card */}
          <div 
            onClick={() => onNavigate('casino')} 
            className="group relative w-full aspect-[4/3] xl:aspect-[4/3] rounded-2xl xl:rounded-2xl overflow-hidden cursor-pointer shadow-[0_25px_60px_rgba(0,0,0,0.7)] border-2 border-transparent hover:border-[#4B85EA]/50 transition-all duration-500 hover:-translate-y-2 z-10 flex flex-col bg-[#1E3763]"
          >
            {/* Isometric Grid Background */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-[#1E3763] to-[#0F1E38] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
              <div 
                className="absolute top-1/2 left-1/2 flex gap-4 xl:gap-5 w-[140%] h-[160%] opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ transform: 'translate(-50%, -60%) perspective(1200px) rotateX(55deg) rotateZ(-40deg) scale(1.1)', transformStyle: 'preserve-3d' }}
              >
                {/* 3 Columns */}
                {[0, 1, 2].map((col) => (
                  <div 
                    key={col} 
                    className="flex flex-col gap-4 xl:gap-5 w-24 xl:w-32"
                    style={{ animation: col % 2 === 0 ? 'iso-slide-up 35s linear infinite' : 'iso-slide-down 40s linear infinite' }}
                  >
                    {[...CASINO_TILES, ...CASINO_TILES].map((src, j) => (
                      <div key={j} className="relative rounded-xl xl:rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-white/10 group-hover:shadow-[0_15px_40px_rgba(0,229,255,0.3)] transition-shadow">
                        <img src={src} className="w-full h-auto object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Crypto Themed Overlay floating */}
              <Bitcoin className="absolute top-[10%] right-[10%] w-16 h-16 text-white/5 opacity-50 blur-[2px] transform rotate-12" />
              <div className="absolute bottom-[20%] left-[10%] w-20 h-20 bg-blue-500/20 blur-[30px] rounded-full" />
              
              {/* Fade out gradient at bottom before the bar */}
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#1E3763] to-transparent opacity-80" />
            </div>

            {/* Bottom Bar - Rainbet Style */}
            <div className="h-14 xl:h-[72px] bg-[#2E589C] flex items-center justify-between px-4 xl:px-6 z-10 shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] relative overflow-hidden group-hover:bg-[#3866b0] transition-colors duration-300">
               {/* Internal crypto pattern faint */}
               <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/noise.png')] mix-blend-overlay" />
               <div className="flex items-center gap-3 relative z-10">
                  <Cherry className="w-5 h-5 xl:w-7 xl:h-7 text-[#AEC8F9] drop-shadow-md group-hover:text-white transition-colors" />
                  <span className="text-white font-bold text-[18px] xl:text-[24px] tracking-wide">{t('home.casino')}</span>
               </div>
               <ArrowRight className="w-5 h-5 xl:w-6 xl:h-6 text-white group-hover:translate-x-1 transition-transform relative z-10" />
            </div>
          </div>
        </div>

        {/* Sports Card Wrapper for Floating (Delayed) */}
        <div className="relative animate-float-card" style={{ animationDelay: '1.5s' }}>
          {/* Ambient Glow Behind Sports Card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#c6ff00]/20 to-emerald-600/20 rounded-[28px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Sports Card */}
          <div 
            onClick={() => onNavigate('sports')} 
            className="group relative w-full aspect-[4/3] xl:aspect-[4/3] rounded-2xl xl:rounded-2xl overflow-hidden cursor-pointer shadow-[0_25px_60px_rgba(0,0,0,0.7)] border-2 border-transparent hover:border-[#384257]/50 transition-all duration-500 hover:-translate-y-2 z-10 flex flex-col bg-[#1f2533]"
          >
            {/* Isometric Grid Background */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-[#1c2230] to-[#12161f] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
              <div 
                className="absolute top-1/2 left-1/2 flex gap-4 xl:gap-5 w-[140%] h-[160%] opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ transform: 'translate(-50%, -60%) perspective(1200px) rotateX(55deg) rotateZ(-40deg) scale(1.1)', transformStyle: 'preserve-3d' }}
              >
                {/* 3 Columns */}
                {[0, 1, 2].map((col) => (
                  <div 
                    key={col} 
                    className="flex flex-col gap-4 xl:gap-5 w-24 xl:w-32"
                    style={{ animation: col % 2 === 0 ? 'iso-slide-up 35s linear infinite' : 'iso-slide-down 40s linear infinite' }}
                  >
                    {[...SPORTS_TILES, ...SPORTS_TILES].map((src, j) => (
                      <div key={j} className="relative rounded-xl xl:rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-white/5 group-hover:shadow-[0_15px_40px_rgba(255,255,255,0.1)] transition-shadow">
                        <img src={src} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Crypto Themed Overlay floating */}
              <Bitcoin className="absolute top-[20%] left-[10%] w-16 h-16 text-white/5 opacity-50 blur-[2px] transform -rotate-12" />
              <div className="absolute bottom-[20%] right-[10%] w-24 h-24 bg-white/5 blur-[40px] rounded-full" />
              
              {/* Fade out gradient at bottom before the bar */}
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#1c2230] to-transparent opacity-90" />
            </div>

            {/* Bottom Bar - Rainbet Style */}
            <div className="h-14 xl:h-[72px] bg-[#30384a] flex items-center justify-between px-4 xl:px-6 z-10 shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] relative overflow-hidden group-hover:bg-[#3a4459] transition-colors duration-300">
               {/* Internal crypto pattern faint */}
               <div className="absolute inset-0 opacity-[0.02] bg-[url('/images/noise.png')] mix-blend-overlay" />
               <div className="flex items-center gap-3 relative z-10">
                  <Dribbble className="w-5 h-5 xl:w-7 xl:h-7 text-[#91a3c7] drop-shadow-md group-hover:text-white transition-colors" />
                  <span className="text-white font-bold text-[18px] xl:text-[24px] tracking-wide">{t('home.sportsbook')}</span>
               </div>
               <ArrowRight className="w-5 h-5 xl:w-6 xl:h-6 text-white group-hover:translate-x-1 transition-transform relative z-10" />
            </div>
          </div>
        </div>
      </div>

      </div>
    </>
  );
}
