import React from 'react';

interface AppLoaderProps {
  fadeOut?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ fadeOut = false }) => {
  return (
    <div id="pro-loader" className={fadeOut ? 'loader-hidden' : ''}>
      {/* 
        This div holds the cinematic 4K AI background with the ball and stadium lights.
        By separating it, we can scale or animate the background smoothly.
      */}
      <div className="pro-loader-bg"></div>

      <div className="loader-content">
        <div className="nostalgic-ball-wrapper">
          <div className="gold-glow"></div>
          
          <div className="football-top">
            {/* The ball is part of the background image, so we just overlay the text exactly in the center */}
            <span className="site-name">724bahis.net</span>
          </div>

          <div className="progress-container">
            <div className="progress-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
