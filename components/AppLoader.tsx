import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface AppLoaderProps {
  fadeOut?: boolean;
  onComplete?: () => void;
  isReady?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ fadeOut = false, onComplete, isReady = true }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isReady && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500); // Give it a slight delay to ensure a smooth transition
      return () => clearTimeout(timer);
    }
  }, [isReady, onComplete]);

  if (!mounted) return null;

  return createPortal(
    <>
      <style>{`
        .loader-container-custom {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100vh;
        }

        .clover-loader {
          width: 90px; 
          height: 90px;
          fill: #10B981; 
          animation: pulseGlow 1.2s infinite ease-in-out;
        }

        @keyframes pulseGlow {
          0% {
            transform: scale(1);
            filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.4));
          }
          50% {
            transform: scale(1.15); 
            filter: drop-shadow(0 0 35px rgba(16, 185, 129, 1)); 
          }
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.4));
          }
        }
      `}</style>
      <div 
        className={`fixed inset-0 z-[999999] bg-[#050505] flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
      >
        <div className="loader-container-custom">
          <svg className="clover-loader" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50,48 C 30,30 35,10 50,20 C 65,10 70,30 50,48 Z" />
            <path d="M 46,52 C 30,35 10,40 20,55 C 10,70 30,75 46,52 Z" />
            <path d="M 54,52 C 70,35 90,40 80,55 C 90,70 70,75 54,52 Z" />
            <path d="M 50,52 Q 45,75 40,90 L 46,90 Q 51,75 50,52 Z" />
          </svg>
        </div>
      </div>
    </>,
    document.body
  );
};

export default AppLoader;
