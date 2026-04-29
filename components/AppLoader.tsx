import React, { useRef, useEffect } from 'react';

interface AppLoaderProps {
  fadeOut?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ fadeOut = false }) => {
  return (
    <div id="pro-loader" className={fadeOut ? 'loader-hidden' : ''}>
      <div className="loader-content">
        <h1 className="loader-text">Analizler Yükleniyor...</h1>
      </div>
    </div>
  );
};

export default AppLoader;
