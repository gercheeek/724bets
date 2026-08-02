import { useEffect, useRef, useCallback } from 'react';

interface PlinkoBall {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  path: boolean[]; // true = right, false = left
  currentRow: number;
  targetBucket: number;
  color: string;
  trail: {x: number, y: number, alpha: number}[];
}

interface BucketAnimation {
  index: number;
  scale: number;
  alpha: number;
  textY: number;
  winAmount: number;
  time: number;
}

interface PlinkoEngineConfig {
  rowCount: number;
  width: number;
  height: number;
  onBucketLanded: (bucketIndex: number) => void;
}

const MULTIPLIERS = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16];
const BUCKET_COLORS = [
  '#F43F5E', '#F43F5E', '#a855f7', '#a855f7', '#00E5FF', '#00E5FF', '#00E5FF', '#c6ff00', '#2C3145', 
  '#c6ff00', '#00E5FF', '#00E5FF', '#00E5FF', '#a855f7', '#a855f7', '#F43F5E', '#F43F5E'
];

export function usePlinkoEngine(config: PlinkoEngineConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<PlinkoBall[]>([]);
  const bucketAnimsRef = useRef<BucketAnimation[]>([]);
  const animationRef = useRef<number>(null);
  
  const { rowCount, width, height, onBucketLanded } = config;
  
  // Physics constants
  const gravity = 0.4;
  const pegRadius = 4.5;
  const ballRadius = 8;
  const restitution = 0.5; // bounciness
  
  // Board dimensions
  const yStart = 40; // Higher top margin to fit giant pyramid
  const bucketHeight = 52; // Massive buckets for expanded layout
  const ySpacing = (height - yStart - bucketHeight - 20) / rowCount; 
  
  // X spacing expanded heavily to fill the entire horizontal space
  const xSpacing = width / (rowCount + 1.5); 
  
  // X calculation function
  const getPegX = (row: number, col: number) => {
    const pegsInRow = row + 3;
    const rowWidth = (pegsInRow - 1) * xSpacing; // Use xSpacing instead of ySpacing
    const startX = width / 2 - rowWidth / 2;
    return startX + col * xSpacing;
  };

  const getBucketX = (col: number) => {
    // 17 buckets (MULTIPLIERS.length) fit perfectly between the 18 pegs of the last row (rowCount - 1)
    const leftPegX = getPegX(rowCount - 1, col);
    const rightPegX = getPegX(rowCount - 1, col + 1);
    return (leftPegX + rightPegX) / 2;
  };

  // Draw loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with dark bg
    ctx.clearRect(0, 0, width, height);
    
    // Solid minimal background (usually handled by wrapper, so we can just leave it transparent or solid)
    // No flashy background effects


    // Draw Pegs (Pins)
    for (let row = 0; row < rowCount; row++) {
      const pegsInRow = row + 3;
      for (let col = 0; col < pegsInRow; col++) {
        const x = getPegX(row, col);
        const y = yStart + row * ySpacing;
        
        ctx.beginPath();
        ctx.arc(x, y, pegRadius * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#8C97A7'; // flat gray peg
        ctx.fill();
      }
    }

    // Draw Buckets (Multipliers)
    const bucketY = yStart + rowCount * ySpacing + 10;
    const bucketWidth = xSpacing - 4; // Width based on xSpacing with a gap
    
    for (let i = 0; i < MULTIPLIERS.length; i++) {
      const x = getBucketX(i);
      const isAnim = bucketAnimsRef.current.find(a => a.index === i);
      
      const scale = isAnim ? isAnim.scale : 1;
      const bWidth = bucketWidth * scale;
      const bHeight = bucketHeight * scale;
      const bX = x - bWidth / 2;
      const bY = bucketY + (bucketHeight - bHeight) / 2;

      const gap = 3; // slightly bigger gap
      const isDarkBucket = BUCKET_COLORS[i] === '#2C3145' || BUCKET_COLORS[i] === '#a855f7' || BUCKET_COLORS[i] === '#F43F5E';
      
      // Animation handling (Bounce Scale + Press)
      const popScale = isAnim ? 1 + (Math.sin(anim.time * 2) * 0.15 * Math.max(0, 1 - anim.time/3)) : 1; 
      const pressOffset = isAnim ? (Math.sin(anim.time * 1.5) * 4) : 0; // Subtle press down
      const glowAlpha = isAnim ? Math.max(0, 1 - (anim.time / 3)) : 0; // Fade out glow
      const currentY = bY + Math.max(0, pressOffset);
      
      const scaledWidth = (bWidth - gap) * popScale;
      const scaledHeight = bHeight * popScale;
      const scaledX = bX + gap/2 - (scaledWidth - (bWidth - gap)) / 2;
      const scaledY = currentY - (scaledHeight - bHeight) / 2;

      // Shadow / Base for 3D effect
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.roundRect(scaledX, scaledY + 4, scaledWidth, scaledHeight, 6);
      ctx.fill();

      // Main Block Gradient
      const bucketGrad = ctx.createLinearGradient(scaledX, scaledY, scaledX, scaledY + scaledHeight);
      bucketGrad.addColorStop(0, BUCKET_COLORS[i]); 
      bucketGrad.addColorStop(1, BUCKET_COLORS[i]); 
      
      ctx.fillStyle = bucketGrad;
      
      // Apply Glow if animated
      if (isAnim && glowAlpha > 0) {
          ctx.shadowBlur = 20 * glowAlpha;
          ctx.shadowColor = BUCKET_COLORS[i];
      } else {
          ctx.shadowBlur = 0;
      }
      
      ctx.beginPath();
      ctx.roundRect(scaledX, scaledY, scaledWidth, scaledHeight, 6);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset
      
      // Top Inner Highlight (Glassy 3D edge)
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      ctx.roundRect(scaledX, scaledY, scaledWidth, scaledHeight/2, { tl: 6, tr: 6, bl: 0, br: 0 });
      ctx.fill();

      // Bottom Inner Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.beginPath();
      ctx.roundRect(scaledX, scaledY + scaledHeight/2, scaledWidth, scaledHeight/2, { tl: 0, tr: 0, bl: 6, br: 6 });
      ctx.fill();

      // White flash overlay during animation hit
      if (isAnim && glowAlpha > 0.5) {
          ctx.fillStyle = `rgba(255,255,255,${(glowAlpha - 0.5) * 2})`;
          ctx.beginPath();
          ctx.roundRect(scaledX, scaledY, scaledWidth, scaledHeight, 6);
          ctx.fill();
      }

      // Text with drop shadow
      ctx.fillStyle = isDarkBucket ? '#FFFFFF' : '#000000';
      ctx.shadowBlur = 2;
      ctx.shadowColor = isDarkBucket ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.5)';
      
      // Dynamic large font size
      const fontSize = Math.max(14, (bWidth - gap) * 0.45); // Scale font to bucket width, minimum 14px
      ctx.font = `900 ${fontSize * popScale}px "Inter", sans-serif`; 
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${MULTIPLIERS[i]}x`, x, scaledY + scaledHeight / 2 + 1);
      ctx.shadowBlur = 0; // Reset

      // Draw shadow if animated
      if (isAnim && isAnim.alpha > 0) {
        ctx.shadowBlur = 20 * isAnim.alpha;
        ctx.shadowColor = BUCKET_COLORS[i];
        ctx.beginPath();
        ctx.roundRect(bX, bY, bWidth, bHeight, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Draw Floating Wins
    for (let i = bucketAnimsRef.current.length - 1; i >= 0; i--) {
      const anim = bucketAnimsRef.current[i];
      if (anim.alpha > 0) {
        const x = getBucketX(anim.index);
        ctx.fillStyle = `rgba(198, 255, 0, ${anim.alpha})`; // Neon green text
        ctx.font = '900 16px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`+${anim.winAmount.toFixed(2)}$`, x, anim.textY);
      }
    }

    // Draw Balls
    for (const ball of ballsRef.current) {
      // Draw Trail
      if (ball.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(ball.trail[0].x, ball.trail[0].y);
        for (let i = 1; i < ball.trail.length; i++) {
          ctx.lineTo(ball.trail[i].x, ball.trail[i].y);
        }
        ctx.strokeStyle = ball.color.replace(')', ', 0.3)').replace('rgb', 'rgba'); // semi transparent trail
        ctx.lineWidth = ball.radius * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Draw Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      
      // Ball 3D shine
      ctx.beginPath();
      ctx.arc(ball.x - 2, ball.y - 2, ball.radius / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fill();

      // Ball Glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = ball.color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [width, height, rowCount, ySpacing]);

  // Update loop
  const update = useCallback(() => {
    const activeBalls: PlinkoBall[] = [];

    // Update animations
    for (let i = bucketAnimsRef.current.length - 1; i >= 0; i--) {
      const anim = bucketAnimsRef.current[i];
      anim.time += 0.05;
      anim.textY -= 1; // float up
      anim.alpha -= 0.02; // fade out
      // pulse scale
      anim.scale = 1 + Math.sin(anim.time) * 0.1 * anim.alpha;
      
      if (anim.alpha <= 0) {
        bucketAnimsRef.current.splice(i, 1);
      }
    }

    for (const ball of ballsRef.current) {
      ball.vy += gravity;
      
      // Air friction
      ball.vx *= 0.99;
      ball.vy *= 0.99;
      
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Add to trail
      ball.trail.push({ x: ball.x, y: ball.y, alpha: 1 });
      if (ball.trail.length > 8) ball.trail.shift();

      // Check collision with pegs
      // We only care about rows we are passing through
      const expectedRow = Math.floor((ball.y - yStart) / ySpacing);
      
      if (expectedRow >= 0 && expectedRow < rowCount && expectedRow > ball.currentRow) {
        ball.currentRow = expectedRow;
        
        // Find closest peg in this row just to snap visual bounce
        const pegsInRow = expectedRow + 3;
        let closestCol = 0;
        let minDistance = Infinity;
        
        for (let col = 0; col < pegsInRow; col++) {
          const pegX = getPegX(expectedRow, col);
          const dist = Math.abs(ball.x - pegX);
          if (dist < minDistance) {
            minDistance = dist;
            closestCol = col;
          }
        }
        
        const pegY = yStart + expectedRow * ySpacing;
        
        // Snap X to the peg to prevent drift
        const actualPegX = getPegX(expectedRow, closestCol);
        
        // Smoothly adjust X towards peg instead of snapping instantly (looks better)
        ball.x = actualPegX + (Math.random() - 0.5); 

        // Bounce physics
        ball.y = pegY - ball.radius; // snap above peg
        
        // Clamp vy so it doesn't bounce too high or fall too fast
        const impactVy = Math.min(Math.max(ball.vy, 2), 8);
        ball.vy = impactVy * -restitution; 
        
        // Force outcome based on predefined path
        const goRight = ball.path[expectedRow];
        
        // Calculate next peg X
        const nextPegCol = goRight ? closestCol + 1 : closestCol;
        // Handle last row dropping into buckets
        let targetX;
        if (expectedRow + 1 < rowCount) {
             targetX = getPegX(expectedRow + 1, nextPegCol);
        } else {
             targetX = getBucketX(ball.targetBucket);
        }
        
        const distToTarget = targetX - ball.x;
        // Adjust horizontal velocity so it arcs beautifully to the target
        // Usually takes around 12-16 frames to fall to the next row
        ball.vx = (distToTarget / 14) + (Math.random() - 0.5) * 0.3;
      }

      // Check if reached bottom buckets
      const bucketY = yStart + rowCount * ySpacing;
      if (ball.y > bucketY) {
        // Landed!
        onBucketLanded(ball.targetBucket);
        
        // Add animation
        bucketAnimsRef.current.push({
          index: ball.targetBucket,
          scale: 1,
          alpha: 1,
          textY: bucketY - 10,
          winAmount: MULTIPLIERS[ball.targetBucket], // Will pass actual win visually later, or just base mult
          time: 0
        });

      } else {
        activeBalls.push(ball);
      }
    }

    ballsRef.current = activeBalls;
  }, [gravity, ySpacing, restitution, onBucketLanded]);

  const loop = useCallback(() => {
    update();
    draw();
    animationRef.current = requestAnimationFrame(loop);
  }, [update, draw]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [loop]);

  // Generates a path that guarantees landing in targetBucket
  const generatePath = (targetBucket: number, totalRows: number): boolean[] => {
    // A ball starts at the center. 
    // To land in targetBucket (0 to 16), it needs exactly `targetBucket` right turns.
    const path: boolean[] = [];
    for (let i = 0; i < totalRows; i++) {
      if (i < targetBucket) path.push(true);
      else path.push(false);
    }
    // Shuffle
    for (let i = path.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [path[i], path[j]] = [path[j], path[i]];
    }
    return path;
  };

  const dropBall = (targetBucket: number, color: string = 'rgb(255, 0, 59)') => {
    const path = generatePath(targetBucket, rowCount);
    
    // Start exactly at the top center
    const initialX = width / 2 + (Math.random() * 2 - 1);
    const initialY = yStart - ySpacing; // One row above the first row
    
    const newBall: PlinkoBall = {
      id: Math.random().toString(),
      x: initialX,
      y: initialY,
      vx: (Math.random() - 0.5) * 1,
      vy: 1,
      radius: ballRadius,
      path,
      currentRow: -1,
      targetBucket,
      color,
      trail: []
    };
    
    ballsRef.current.push(newBall);
  };

  return { canvasRef, dropBall };
}
