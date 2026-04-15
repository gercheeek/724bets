import React, { useState, useEffect, useCallback } from 'react';
import { NewsSliderConfig } from '../types';
import { ChevronLeft, ChevronRight, Clock, ExternalLink } from 'lucide-react';

interface NewsSliderProps {
    config: NewsSliderConfig;
}

const NewsSlider: React.FC<NewsSliderProps> = ({ config }) => {
    const activeSlides = config.slides.filter(s => s.isActive).sort((a, b) => a.order - b.order);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % activeSlides.length);
    }, [activeSlides.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
    }, [activeSlides.length]);

    useEffect(() => {
        if (!config.isActive || activeSlides.length <= 1) return;
        const timer = setInterval(nextSlide, config.autoPlayInterval || 5000);
        return () => clearInterval(timer);
    }, [config.isActive, activeSlides.length, config.autoPlayInterval, nextSlide]);

    if (!config.isActive || activeSlides.length === 0) return null;

    return (
        <div style={{ margin: '16px 0 24px' }} className="news-slider-container">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '18px', background: '#FFD700', borderRadius: '2px' }} />
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>GÜNDEM</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={prevSlide}
                        style={{ background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '6px', padding: '4px', cursor: 'pointer' }}
                    >
                        <ChevronLeft style={{ width: 14, height: 14 }} />
                    </button>
                    <button 
                        onClick={nextSlide}
                        style={{ background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '6px', padding: '4px', cursor: 'pointer' }}
                    >
                        <ChevronRight style={{ width: 14, height: 14 }} />
                    </button>
                </div>
            </div>

            {/* Slider Content */}
            <div style={{ 
                position: 'relative', 
                height: '240px', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                background: '#0a0a0a',
                border: '1px solid #1a1a1a',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                {activeSlides.map((slide, index) => (
                    <div
                        key={slide.id}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: index === currentIndex ? 1 : 0,
                            visibility: index === currentIndex ? 'visible' : 'hidden',
                            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: index === currentIndex ? 'scale(1)' : 'scale(1.05)',
                        }}
                    >
                        {/* Background Image */}
                        <img 
                            src={slide.imageUrl} 
                            alt={slide.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        
                        {/* Overlay Gradient */}
                        <div style={{ 
                            position: 'absolute', 
                            inset: 0, 
                            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' 
                        }} />

                        {/* Text Content */}
                        <div style={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            right: 0, 
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ 
                                    background: '#FFD700', 
                                    color: '#000', 
                                    fontSize: '9px', 
                                    fontWeight: 900, 
                                    padding: '2px 8px', 
                                    borderRadius: '4px',
                                    textTransform: 'uppercase'
                                }}>
                                    {slide.category}
                                </span>
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock style={{ width: 10, height: 10 }} /> {new Date().toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                            
                            <h2 style={{ 
                                color: '#fff', 
                                fontSize: '20px', 
                                md: '24px', 
                                fontWeight: 900, 
                                lineHeight: '1.2',
                                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                                margin: 0,
                                maxWidth: '85%'
                            }}>
                                {slide.title}
                            </h2>

                            <a 
                                href={slide.link} 
                                style={{ 
                                    alignSelf: 'flex-start',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: '#FFD700',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    textDecoration: 'none',
                                    marginTop: '8px',
                                    borderBottom: '1px solid transparent',
                                    transition: 'border-color 0.3s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#FFD700'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                DETAYLARI OKU <ExternalLink style={{ width: 12, height: 12 }} />
                            </a>
                        </div>
                    </div>
                ))}

                {/* Indicators */}
                <div style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    right: '20px', 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '6px' 
                }}>
                    {activeSlides.map((_, i) => (
                        <div 
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            style={{ 
                                width: '3px', 
                                height: i === currentIndex ? '24px' : '6px', 
                                background: i === currentIndex ? '#FFD700' : 'rgba(255,255,255,0.3)',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsSlider;
