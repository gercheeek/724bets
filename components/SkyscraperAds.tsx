import React from 'react';

interface SkyscraperAdsProps {
  activeView?: string;
}

const SkyscraperAds: React.FC<SkyscraperAdsProps> = ({ activeView = 'home' }) => {
  return null; // Temporarily disabled

  return (
    <>
      <style>
        {`
          @keyframes subtle-float {
            0%, 100% { transform: translateY(-50%); }
            50% { transform: translateY(calc(-50% - 15px)); }
          }
          .animate-subtle-float {
            animation: subtle-float 6s ease-in-out infinite;
          }
          .side-column-promo {
            display: none;
            transform: translateY(-50%);
          }
          
          /* 1400px ve üzeri ekranlar için başlangıç boyutu */
          @media (min-width: 1400px) {
            .side-column-promo {
              display: block;
              position: fixed;
              top: 50%;
              z-index: 5;
              width: 200px; /* Eski versiyonda 160px idi */
              transition: filter 0.3s ease, box-shadow 0.3s ease;
              border-radius: 16px;
              overflow: hidden;
              will-change: transform;
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
              transform-style: preserve-3d;
              background: transparent;
              outline: none;
              border: none;
              box-shadow: 0 0 25px rgba(10, 13, 20, 0.8), 0 0 15px rgba(163, 230, 53, 0.04);
            }
            
            /* Dört Kenarlı İç Gölgelendirme (İçe doğru yayılan yumuşak yeşilimsi/koyu gri parlama) */
            .side-column-promo::after {
              content: '';
              position: absolute;
              inset: 0;
              border-radius: 16px;
              box-shadow: inset 0 0 22px 10px #0a0d14, 
                          inset 0 0 15px 4px rgba(163, 230, 53, 0.12);
              pointer-events: none;
              z-index: 2;
              transition: box-shadow 0.3s ease;
            }
            
            .side-column-promo:hover, .side-column-promo:focus {
              filter: brightness(1.12);
              box-shadow: 0 0 35px rgba(163, 230, 53, 0.12);
              outline: none;
              border: none;
            }
            .side-column-promo:hover::after {
              box-shadow: inset 0 0 22px 10px #0a0d14, 
                          inset 0 0 20px 6px rgba(163, 230, 53, 0.18);
            }
            .side-column-promo.side-column-left {
              left: 20px;
            }
            .side-column-promo.side-column-right {
              right: 20px;
            }
          }
          
          /* 1600px ve üzeri ekranlar */
          @media (min-width: 1600px) {
            .side-column-promo {
              width: 260px; /* Eski versiyonda 180px idi */
            }
            .side-column-promo.side-column-left {
              left: 30px;
            }
            .side-column-promo.side-column-right {
              right: 30px;
            }
          }
          
          /* 1800px ve üzeri ekranlar */
          @media (min-width: 1800px) {
            .side-column-promo {
              width: 320px; /* Eski versiyonda 220px idi */
            }
            .side-column-promo.side-column-left {
              left: 40px;
            }
            .side-column-promo.side-column-right {
              right: 40px;
            }
          }

          /* 2000px ve üzeri ultra geniş ekranlar */
          @media (min-width: 2000px) {
            .side-column-promo {
              width: 380px; 
            }
            .side-column-promo.side-column-left {
              left: 60px;
            }
            .side-column-promo.side-column-right {
              right: 60px;
            }
          }
        `}
      </style>

      {/* Sol Kule (Tüm sayfalarda 21.com banner'ı) */}
      <a 
        href="https://prod.trk21.com/click?domain=21.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="side-column-promo side-column-left animate-subtle-float"
      >
        <img 
          src="/promos/left-s.jpg" 
          alt="21.com %30 Günlük İade" 
          className="w-full h-auto object-contain rounded-[16px]"
          style={{ aspectRatio: '160/600', display: 'block', backgroundColor: 'transparent' }}
        />
      </a>

      {/* Sağ Kule */}
      <a 
        href={isAnalysisView ? "https://prod.trk21.com/click?domain=21.com" : "https://prod.trk21.com/click?domain=21.com&uid=KbpoTfsq"} 
        target="_blank" 
        rel="noopener noreferrer"
        className="side-column-promo side-column-right animate-subtle-float"
        style={{ animationDelay: '3s' }}
      >
        <img 
          src={isAnalysisView ? "/promos/left-s.jpg" : "/promos/right-s.jpg"} 
          alt={isAnalysisView ? "Hergün %30 İade" : "21.com VIP Programı"} 
          className="w-full h-auto object-contain rounded-[16px]"
          style={{ aspectRatio: '160/600', display: 'block', backgroundColor: 'transparent' }}
        />
      </a>
    </>
  );
};

export default SkyscraperAds;
