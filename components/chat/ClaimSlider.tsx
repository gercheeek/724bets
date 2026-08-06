import React, { useState, useRef, useEffect } from 'react';

interface ClaimSliderProps {
  onClaim: () => void;
}

const ClaimSlider: React.FC<ClaimSliderProps> = ({ onClaim }) => {
  const [dragValue, setDragValue] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const maxDrag = 100; // Percentage

  const handlePointerDown = (e: React.PointerEvent | React.TouchEvent) => {
    if (isClaiming) return;
    isDragging.current = true;
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current || isClaiming || !containerRef.current) return;
    
    // Calculate relative x position
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = containerRef.current.getBoundingClientRect();
    let newX = ((clientX - rect.left) / rect.width) * 100;

    newX = Math.max(0, Math.min(newX, maxDrag));
    setDragValue(newX);

    if (newX >= 95) {
      isDragging.current = false;
      setIsClaiming(true);
      setDragValue(100);
      onClaim();
    }
  };

  const handlePointerUp = () => {
    if (isDragging.current && !isClaiming) {
      isDragging.current = false;
      setDragValue(0); // Snap back if not completed
    }
  };

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);
    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isClaiming]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      style={{
        position: 'relative',
        width: '100%',
        height: '48px',
        background: 'var(--bg-main)', // Sitenin arka plan değişkeni
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        border: '1px solid var(--border-card)',
        touchAction: 'none',
        cursor: isClaiming ? 'default' : 'pointer'
      }}
    >
      {/* İlerleme Çubuğu */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, height: '100%',
        width: `${dragValue}%`,
        background: 'var(--primary)',
        transition: isDragging.current ? 'none' : 'width 0.3s ease',
        opacity: 0.3
      }} />

      {/* Sürükleme Butonu */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: `calc(${dragValue}% - ${dragValue === 100 ? 40 : 0}px)`,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'var(--primary)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: isDragging.current ? 'none' : 'left 0.3s ease',
        transform: `translateX(${dragValue === 0 ? '4px' : '0'})`,
        zIndex: 2
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>

      <div style={{
        position: 'absolute',
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        fontWeight: 600,
        pointerEvents: 'none',
        zIndex: 1,
        opacity: Math.max(0, 1 - (dragValue / 50)) // Kaydırdıkça yazı kaybolur
      }}>
        {isClaiming ? 'İşleniyor...' : 'Katılmak için kaydır >>'}
      </div>
    </div>
  );
};

export default ClaimSlider;
