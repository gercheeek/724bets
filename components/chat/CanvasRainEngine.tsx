import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  type: 'gold' | 'emerald' | 'diamond';
}

const CanvasRainEngine: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Init Particles
    const types: ('gold' | 'emerald' | 'diamond')[] = ['gold', 'gold', 'gold', 'emerald', 'emerald', 'diamond'];
    const createParticle = (yOffset = -50): Particle => ({
      x: Math.random() * canvas.width,
      y: yOffset - Math.random() * 100,
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 8 + 8, // Bigger coins
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      flip: Math.random() * Math.PI * 2,
      flipSpeed: Math.random() * 0.1 + 0.05,
      type: types[Math.floor(Math.random() * types.length)],
    });

    // Initial burst
    for (let i = 0; i < 40; i++) {
        particlesRef.current.push(createParticle(canvas.height * Math.random() - canvas.height));
    }

    // Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        // Reset if out of bounds
        if (p.y > canvas.height + 20) {
          particlesRef.current[idx] = createParticle();
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        // 3D Flip effect (scaleY)
        const scaleY = Math.cos(p.flip);
        ctx.scale(1, Math.abs(scaleY));

        let mainColor = '';
        let borderColor = '';
        let innerColor = '';
        let symbol = '';
        
        if (p.type === 'gold') {
            mainColor = '#F59E0B';
            borderColor = '#D97706';
            innerColor = '#FBBF24';
            symbol = '₺';
        } else if (p.type === 'emerald') {
            mainColor = '#10B981';
            borderColor = '#059669';
            innerColor = '#34D399';
            symbol = '★';
        } else {
            mainColor = '#00E5FF';
            borderColor = '#00B8D4';
            innerColor = '#84FFFF';
            symbol = '♦';
        }

        // Draw outer coin edge (gives 3D thickness)
        if (scaleY < 0.9) {
            ctx.fillStyle = borderColor;
            ctx.beginPath();
            ctx.arc(0, 3, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw coin face
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle
        ctx.strokeStyle = innerColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.75, 0, Math.PI * 2);
        ctx.stroke();

        // Text symbol
        ctx.fillStyle = innerColor;
        ctx.font = `bold ${p.size * 0.9}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // If flipped, invert text so it doesn't look mirrored, or just draw it mirrored.
        // Actually, just drawing it mirrored gives a natural 3D coin spin look.
        ctx.fillText(symbol, 0, 0);

        ctx.restore();
      });

      animationFrameId.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50, // Higher z-index to fall OVER messages
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.5))'
      }}
    />
  );
};

export default CanvasRainEngine;
