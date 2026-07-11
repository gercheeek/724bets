import React, { useState, useCallback } from 'react';
import HeroSlider from './HeroSlider';
import DailyKupon from './DailyKupon';
import { HeroSliderConfig, DailyKuponConfig } from '../types';

interface HeroSectionProps {
  heroSliderConfig: HeroSliderConfig;
  dailyKuponConfig: DailyKuponConfig;
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroSliderConfig, dailyKuponConfig }) => {
  const [syncKey, setSyncKey] = useState(0);

  const handleSlideChange = useCallback(() => {
    setSyncKey(prev => prev + 1);
  }, []);

  return (
    <div className="hero-section-wrapper">
      {/* Left: Image Slider (70%) */}
      <div className="hero-section-slider">
        <HeroSlider 
          config={heroSliderConfig} 
          onSlideChange={handleSlideChange}
          onInternalNavigate={(url) => {
            const event = new CustomEvent('internal-navigate', { detail: { url } });
            window.dispatchEvent(event);
          }}
        />
      </div>

      {/* Right: Daily Banko Kupon (30%) */}
      <div className="hero-section-kupon">
        <DailyKupon 
          config={dailyKuponConfig} 
          interval={heroSliderConfig.autoPlayInterval}
          resetKey={syncKey}
        />
      </div>
    </div>
  );
};

export default HeroSection;
