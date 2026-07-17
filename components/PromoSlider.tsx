import React, { useRef } from 'react';
import { Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Logo21: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div 
    className="relative overflow-hidden" 
    style={{ 
      width: '125px', 
      height: '38px', 
      animation: 'logo-pulse-glow 4s ease-in-out infinite',
      ...style 
    }}
  >
    <img 
      src="/21com-logo.png" 
      alt="21.com" 
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'contain' 
      }} 
    />
    <div 
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent" 
      style={{
        maskImage: 'url(/21com-logo.png)',
        WebkitMaskImage: 'url(/21com-logo.png)',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        pointerEvents: 'none',
        width: '200%',
        height: '100%',
        animation: 'logo-shine 6s cubic-bezier(0.4, 0, 0.2, 1) infinite'
      }}
    />
  </div>
);

interface Promo {
  id: number;
  title1: string;
  title2: string;
  subtitle: string;
  buttonText: string;
  icon: string;
  title2Color?: string;
}



export const PromoSlider: React.FC = () => {
  const { t } = useLanguage();

  const PROMOS: Promo[] = [
    { id: 1, title1: t("p_30kadar"), title2: t("p_freespin"), subtitle: t("p_haftanin"), buttonText: t("p_hemen_oyna"), icon: "🦊" },
    { id: 2, title1: t("p_30"), title2: t("p_nakit_iade"), subtitle: t("p_ilk_hafta"), buttonText: t("p_yatirim_yap"), icon: "🤑" },
    { id: 3, title1: t("p_kazanma_sansi"), title2: t("p_10k_nakit"), subtitle: t("p_dk_sandiklari"), buttonText: t("p_hemen_oyna"), icon: "🎁" },
    { id: 4, title1: t("p_buyuk_basla"), title2: t("p_7k_kadar"), subtitle: t("p_130_fs"), buttonText: t("p_yatirim_yap"), icon: "💎" },
    { id: 5, title1: t("p_100_basla"), title2: t("p_spor_bonusu"), subtitle: t("p_500_kadar"), buttonText: t("p_yatirim_yap"), icon: "⚽" },
    { id: 6, title1: t("p_dunya_kupasi"), title2: t("p_mega_boost"), subtitle: t("p_daha_yuksek"), buttonText: t("p_bahis_yap"), icon: "🏆" },
    { id: 7, title1: t("p_500_varan"), title2: t("p_kazanc_boostu"), subtitle: t("p_acca"), buttonText: t("p_bahis_yap"), icon: "🚀" },
    { id: 8, title1: t("p_dunya_kupasi"), title2: t("p_20_ekstra"), subtitle: t("p_200_bonus"), buttonText: t("p_bahis_yap"), icon: "⚡" },
    { id: 9, title1: t("p_app_indir"), title2: t("p_40_fs"), subtitle: t("p_21_yaninda"), buttonText: t("p_simdi_indir"), icon: "📱" },
    { id: 10, title1: t("p_cevir_kazan"), title2: t("p_5k_nakit"), subtitle: t("p_4_fs_hergun"), buttonText: t("p_simdi_cevir"), icon: "🎡" },
    { id: 11, title1: t("p_21_elite"), title2: t("p_hos_geldiniz"), subtitle: t("p_yukseldikce"), buttonText: t("p_hemen_oyna"), icon: "🛡️" },
    { id: 12, title1: t("p_her_gun"), title2: t("p_10_bonus"), subtitle: t("p_yatir_oyna"), buttonText: t("p_yatirim_yap"), icon: "🎰" },
    { id: 13, title1: t("p_davet_et"), title2: t("p_20_nakit"), subtitle: t("p_kazancini_arttir"), buttonText: t("p_hemen_basla"), icon: "🤝" },
    { id: 14, title1: t("p_buyuk_oyna"), title2: t("p_bizle_kal"), subtitle: t("p_21_kanallari"), buttonText: t("p_hemen_katil"), icon: "💬" },
  ];
  const [isPaused, setIsPaused] = React.useState(false);

  const handleCardClick = () => {
    window.open('https://21.com', '_blank');
  };

  // Use distinct items without explicit duplication for infinite scroll
  const duplicatedPromos = [...PROMOS];

  return (
    <div 
      className="relative w-full overflow-hidden mb-6 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* CSS Styles for Seamless Marquee Loop */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(calc(-50% - 8px), 0, 0); /* Offset for half of the gap width */
          }
        }
        .animate-marquee-train {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: marquee-scroll 45s linear infinite;
        }
        .animate-marquee-train.paused {
          animation-play-state: paused;
        }
        @keyframes logo-shine {
          0% { transform: translateX(-150%) skewX(-25deg); }
          12% { transform: translateX(150%) skewX(-25deg); }
          18% { transform: translateX(-150%) skewX(-25deg); }
          28% { transform: translateX(150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
        @keyframes logo-pulse-glow {
          0%, 100% { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.65)) drop-shadow(0 0 4px rgba(118, 225, 59, 0.2)); }
          50% { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5)) drop-shadow(0 0 12px rgba(118, 225, 59, 0.6)); }
        }
      `}} />

      {/* Marquee Train Wrapper */}
      <div className={`animate-marquee-train ${isPaused ? 'paused' : ''}`}>
        {duplicatedPromos.map((promo, index) => (
          <div 
            key={`${promo.id}-${index}`}
            onClick={handleCardClick}
            className="shrink-0 relative bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden cursor-pointer group transition-all duration-300 hover:border-[#555] hover:-translate-y-1"
            style={{ width: '250px', height: '125px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#000000] pointer-events-none" />
            
            <div className="relative z-10 p-3 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-white font-black text-sm leading-tight uppercase" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {promo.title1}
                </h3>
                <h3 className="font-black text-[14px] leading-tight uppercase" style={{ color: promo.title2Color || '#76e13b', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {promo.title2}
                </h3>
                <p className="text-gray-300 text-[10px] mt-1 leading-snug whitespace-pre-line font-semibold">
                  {promo.subtitle}
                </p>
              </div>
              
              <div>
                <button className="px-3 py-1 border border-[#444] rounded-lg text-white text-[10px] font-bold bg-transparent group-hover:bg-[#333] transition-colors">
                  {promo.buttonText}
                </button>
              </div>
            </div>

            {/* 21.com Logo Representation */}
            <div 
              className="absolute right-2 bottom-2 select-none pointer-events-none transition-transform duration-500 transform scale-75 origin-bottom-right"
            >
              <Logo21 />
            </div>
            {/* Reflection on emoji */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};
