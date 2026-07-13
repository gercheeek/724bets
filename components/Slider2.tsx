import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Slider2Config } from '../types';

interface Slider2Props {
  config: Slider2Config;
  onSlideChange?: (index: number) => void;
  onInternalNavigate?: (url: string) => void;
}

const Slider2: React.FC<Slider2Props> = ({ config, onSlideChange, onInternalNavigate }) => {
  const fallbackSlides = [
    {
      id: 'default-banner',
      imageUrl: '/banners/yeni-ince-banner.png',
      link: 'https://bahisbey7195.com/tr/lobby/casino',
      title: 'İki Gol Farkla Öne Geç KAZAN',
      isActive: true,
      order: 1
    }
  ];

  const activeSlides = config.slides && config.slides.filter(s => s.isActive).length > 0
    ? config.slides.filter(s => s.isActive).sort((a, b) => a.order - b.order)
    : fallbackSlides;

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loadedUrls, setLoadedUrls] = useState<Record<string, boolean>>({
    '/banners/yeni-ince-banner.png': true
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slideCount = activeSlides.length;

  useEffect(() => {
    // Preload default banner
    const defaultImg = new Image();
    defaultImg.src = '/banners/yeni-ince-banner.png';
    defaultImg.onload = () => {
      setLoadedUrls(prev => ({ ...prev, ['/banners/yeni-ince-banner.png']: true }));
    };

    activeSlides.forEach(slide => {
      if (slide.imageUrl) {
        const img = new Image();
        img.src = slide.imageUrl;
        img.onload = () => {
          setLoadedUrls(prev => ({ ...prev, [slide.imageUrl]: true }));
        };
      }
    });
  }, [config.slides]);

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

  useEffect(() => {
    if (!config.isActive || slideCount <= 1 || isPaused) return;
    timerRef.current = setInterval(next, config.autoPlayInterval || 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [config.isActive, config.autoPlayInterval, slideCount, isPaused, next]);

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

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ aspectRatio: '24 / 9', background: '#0F1219' }} // Match HeroSlider aspect ratio
    >
      <div 
        className="flex w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {activeSlides.map((slide) => {
          const isInternal = slide.link && slide.link.includes('bahisbey7195.com');
          return (
            <a
              key={slide.id}
              href={slide.link || '#'}
              target={slide.link && !isInternal ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="block w-full h-full flex-shrink-0 relative"
              onClick={(e) => { 
                if (!slide.link) {
                  e.preventDefault(); 
                } else if (isInternal && onInternalNavigate) {
                  e.preventDefault();
                  onInternalNavigate(slide.link);
                }
              }}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title || 'Banner'}
                draggable={false}
                className="block w-full h-full object-cover" // object-cover prevents stretching
                style={{
                  opacity: loadedUrls[slide.imageUrl] ? 1 : 0,
                  transition: 'opacity 0.4s ease-in-out',
                }}
              />
            </a>
          );
        })}
      </div>

      {/* Navigation arrows */}
      {slideCount > 1 && (
        <>
          <button 
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 rounded-full text-white/50 hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }} 
            aria-label="Önceki"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 rounded-full text-white/50 hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }} 
            aria-label="Sonraki"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slideCount > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(i); }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider2;
