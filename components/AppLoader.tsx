import React, { useRef, useEffect } from 'react';

interface AppLoaderProps {
  fadeOut?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ fadeOut = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure autoplay on mobile by triggering play programmatically
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked — silent fail, splash will still fade out on timer
      });
    }
  }, []);

  return (
    <div id="pro-loader" className={fadeOut ? 'loader-hidden' : ''}>
      <video
        ref={videoRef}
        className="splash-video"
        src="/splash-video.mp4"
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
      />
    </div>
  );
};

export default AppLoader;
