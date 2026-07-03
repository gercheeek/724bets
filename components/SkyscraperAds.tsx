import React from 'react';

interface SkyscraperAdsProps {
  activeView?: string;
}

const SkyscraperAds: React.FC<SkyscraperAdsProps> = ({ activeView = 'home' }) => {
  const isAnalysisView = activeView === 'analysis';

  return (
    <>
      <style>
        {`
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
              border-radius: 0;
              overflow: hidden;
              will-change: transform;
              background: transparent;
              outline: none;
              border: none;
              box-shadow: none;
              /* Profesyonel kenar yumuşatma (Fade out edges) */
              -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%),
                                  linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
              -webkit-mask-composite: source-in;
              mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%),
                          linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
              mask-composite: intersect;
            }
            .side-column-promo:hover, .side-column-promo:focus {
              filter: brightness(1.15);
              outline: none;
              border: none;
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
        className="side-column-promo side-column-left"
      >
        <img 
          src="/promos/left-s.jpg" 
          alt="21.com %30 Günlük İade" 
          className="w-full h-auto object-contain"
          style={{ aspectRatio: '160/600', display: 'block', backgroundColor: 'transparent' }}
        />
      </a>

      {/* Sağ Kule */}
      <a 
        href={isAnalysisView ? "https://prod.trk21.com/click?domain=21.com" : "https://prod.trk21.com/click?domain=21.com&uid=KbpoTfsq"} 
        target="_blank" 
        rel="noopener noreferrer"
        className="side-column-promo side-column-right"
      >
        <img 
          src={isAnalysisView ? "/promos/left-s.jpg" : "/promos/yeni-dikey.jpg"} 
          alt={isAnalysisView ? "Hergün %30 İade" : "Tipobet Kombine"} 
          className="w-full h-auto object-contain"
          style={{ aspectRatio: '160/600', display: 'block', backgroundColor: 'transparent' }}
        />
      </a>
    </>
  );
};

export default SkyscraperAds;
