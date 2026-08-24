import React, { useState, useRef, useEffect } from 'react';

interface ClaimSliderProps {
  onClaim: () => void;
}

const ClaimSlider: React.FC<ClaimSliderProps> = ({ onClaim }) => {
  const [dragValue, setDragValue] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const animationRef = useRef<number>();

  const maxDrag = 100;

  const handlePointerDown = (e: React.PointerEvent | React.TouchEvent) => {
    if (isClaiming) return;
    isDragging.current = true;
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current || isClaiming || !containerRef.current) return;
    
    // Use requestAnimationFrame for smoother performance
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    animationRef.current = requestAnimationFrame(() => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const rect = containerRef.current!.getBoundingClientRect();
        
        // Increase sensitivity by multiplying the movement ratio slightly (e.g. 1.1x)
        let newX = ((clientX - rect.left) / rect.width) * 110; 

        newX = Math.max(0, Math.min(newX, maxDrag));
        setDragValue(newX);

        if (newX >= 85) { // Lowered threshold for faster completion
          isDragging.current = false;
          setIsClaiming(true);
          setDragValue(100);
          onClaim();
        }
    });
  };

  const handlePointerUp = () => {
    if (isDragging.current && !isClaiming) {
      isDragging.current = false;
      setDragValue(0); 
    }
  };

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);
    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isClaiming]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      className="relative w-full h-12 rounded-2xl overflow-hidden bg-[#0B0E14] border border-white/5 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] touch-none select-none"
      style={{ cursor: isClaiming ? 'default' : 'grab' }}
    >
      {/* İlerleme Çubuğu (Glow Track) */}
      <div 
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#10B981]/10 to-[#10B981]/40"
        style={{
            width: `${dragValue}%`,
            transition: isDragging.current ? 'none' : 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }} 
      />

      {/* Sürükleme Butonu (Knob) */}
      <div 
        className="absolute top-1 bottom-1 w-10 rounded-xl bg-gradient-to-br from-[#34D399] to-[#10B981] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] z-10"
        style={{
            left: `calc(${dragValue}% - ${dragValue === 100 ? 40 : 0}px)`,
            transform: `translateX(${dragValue === 0 ? '4px' : '0'})`,
            transition: isDragging.current ? 'none' : 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>

      <div 
        className="absolute inset-0 flex items-center justify-center text-xs font-black tracking-widest text-[#10B981] z-0 pointer-events-none"
        style={{ opacity: Math.max(0, 1 - (dragValue / 40)) }}
      >
        {isClaiming ? 'İŞLENİYOR...' : 'KATILMAK İÇİN KAYDIR'}
      </div>
      
      {/* Başarılı olduğunda parlayan efekt */}
      <div 
        className={`absolute inset-0 bg-[#10B981]/20 transition-opacity duration-300 pointer-events-none ${isClaiming ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export default ClaimSlider;
