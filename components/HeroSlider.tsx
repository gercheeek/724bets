import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroSliderConfig } from '../types';

interface HeroSliderProps {
  config: HeroSliderConfig;
  onSlideChange?: (index: number) => void;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ config, onSlideChange }) => {
  const activeSlides = config.slides
    .filter(s => s.isActive)
    .sort((a, b) => a.order - b.order);

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slideCount = activeSlides.length;

  const goTo = useCallback((index: number) => {
    if (isTransitioning || slideCount === 0) return;
    setIsTransitioning(true);
    const nextIndex = ((index % slideCount) + slideCount) % slideCount;
    setCurrent(nextIndex);
    if (onSlideChange) onSlideChange(nextIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slideCount, onSlideChange]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-play
  useEffect(() => {
    if (!config.isActive || slideCount <= 1 || isPaused) return;
    timerRef.current = setInterval(next, config.autoPlayInterval || 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [config.isActive, config.autoPlayInterval, slideCount, isPaused, next]);

  // Touch/swipe support
  const touchStart = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  if (!config.isActive) return null;
  
  if (slideCount === 0) {
    return (
      <div className="hero-slider hero-slider-skeleton">
        {/* Simple loader or skeleton box */}
      </div>
    );
  }

  return (
    <div
      className="hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div className="hero-slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {activeSlides.map((slide) => (
          <a
            key={slide.id}
            href={slide.link || '#'}
            target={slide.link ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="hero-slider-slide"
            onClick={(e) => { if (!slide.link) e.preventDefault(); }}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title || 'Banner'}
              className="hero-slider-img"
              draggable={false}
            />
            {/* Gradient overlay for readability */}
            <div className="hero-slider-overlay" />
          </a>
        ))}
      </div>

      {/* Navigation arrows */}
      {slideCount > 1 && (
        <>
          <button className="hero-slider-arrow hero-slider-arrow-left" onClick={prev} aria-label="Önceki">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="hero-slider-arrow hero-slider-arrow-right" onClick={next} aria-label="Sonraki">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slideCount > 1 && (
        <div className="hero-slider-dots">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              className={`hero-slider-dot ${i === current ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {slideCount > 1 && !isPaused && (
        <div className="hero-slider-progress">
          <div
            className="hero-slider-progress-fill"
            style={{
              animationDuration: `${config.autoPlayInterval || 5000}ms`,
            }}
            key={current}
          />
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
