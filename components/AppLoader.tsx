import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface AppLoaderProps {
  fadeOut?: boolean;
  onComplete?: () => void;
  isReady?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ fadeOut = false, onComplete, isReady = true }) => {
  useEffect(() => {
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  return null;
};

export default AppLoader;
