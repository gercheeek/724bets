import React from 'react';

interface AppLoaderProps {
  fadeOut?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ fadeOut = false }) => {
  return (
    <div className={`preloader-white ${fadeOut ? 'preloader-hidden' : ''}`}>
      {/* 724bets Logo with Pulse Effect */}
      <img 
        src="/logo.png" 
        alt="724bets Logo" 
        className="preloader-logo-pulse"
        onError={(e) => {
          // Fallback if logo.png is not accessible
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            const textLogo = document.createElement('h1');
            textLogo.innerText = '724BETS';
            textLogo.className = 'text-4xl font-black text-black preloader-logo-pulse';
            parent.prepend(textLogo);
          }
        }}
      />
      
      {/* Loading Text with Fade Animation */}
      <p className="preloader-text">
        Analizler Yükleniyor...
      </p>
    </div>
  );
};

export default AppLoader;
