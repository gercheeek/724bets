import { useEffect, useRef, useCallback } from 'react';

interface PlinkoBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  path: boolean[]; // true = right, false = left
  currentRow: number;
  targetBucket: number;
  id: string;
  onFinish?: (bucketIndex: number) => void;
  color?: string;
}

interface PlinkoEngineConfig {
  rowCount: number;
  width: number;
  height: number;
  onBucketLanded: (bucketIndex: number) => void;
}

export function usePlinkoEngine(config: PlinkoEngineConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<PlinkoBall[]>([]);
  const animationRef = useRef<number>(null);
  
  const { rowCount, width, height, onBucketLanded } = config;
  
  // Physics constants
  const gravity = 0.6;
  const pegRadius = 4;
  const ballRadius = 8;
  const restitution = 0.5; // bounciness
  
  // Board dimensions
  const yStart = 60;
  const ySpacing = (height - yStart - 80) / rowCount;
  const bucketHeight = 40;

  // Draw loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Pegs
    ctx.fillStyle = '#ffffff';
    for (let row = 3; row < rowCount; row++) {
      const pegsInRow = row + 1;
      const rowWidth = pegsInRow * ySpacing; // approximate
      const startX = width / 2 - rowWidth / 2 + ySpacing / 2;
      
      for (let col = 0; col < pegsInRow; col++) {
        const x = startX + col * ySpacing;
        const y = yStart + row * ySpacing;
        
        ctx.beginPath();
        ctx.arc(x, y, pegRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Draw Balls
    for (const ball of ballsRef.current) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color || '#ff003b'; // Default red color like Stake
      ctx.fill();
      
      // Ball glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = ball.color || '#ff003b';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [width, height, rowCount, ySpacing]);

  // Update loop
  const update = useCallback(() => {
    const activeBalls: PlinkoBall[] = [];

    for (const ball of ballsRef.current) {
      ball.vy += gravity;
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Check collision with pegs
      let collided = false;
      const expectedRow = Math.floor((ball.y - yStart) / ySpacing);
      
      if (expectedRow >= 3 && expectedRow < rowCount && expectedRow > ball.currentRow) {
        // Find closest peg in this row
        const pegsInRow = expectedRow + 1;
        const rowWidth = pegsInRow * ySpacing;
        const startX = width / 2 - rowWidth / 2 + ySpacing / 2;
        
        let closestPegX = startX;
        let minDistance = Infinity;
        
        for (let col = 0; col < pegsInRow; col++) {
          const pegX = startX + col * ySpacing;
          const dist = Math.abs(ball.x - pegX);
          if (dist < minDistance) {
            minDistance = dist;
            closestPegX = pegX;
          }
        }
        
        const pegY = yStart + expectedRow * ySpacing;
        const distToPeg = Math.hypot(ball.x - closestPegX, ball.y - pegY);
        
        if (distToPeg < ball.radius + pegRadius + 5) { // +5 margin
          ball.currentRow = expectedRow;
          
          // Force outcome based on predefined path
          const goRight = ball.path[expectedRow];
          
          ball.vy = ball.vy * -restitution; // Bounce up slightly
          
          // Nudge velocity to ensure it goes the right way
          const horizontalPush = ySpacing * 0.15;
          if (goRight) {
            ball.vx = horizontalPush + (Math.random() * 1);
          } else {
            ball.vx = -horizontalPush - (Math.random() * 1);
          }
        }
      }

      // Check if reached bottom buckets
      if (ball.y > height - bucketHeight) {
        if (ball.onFinish) {
          ball.onFinish(ball.targetBucket);
        }
        onBucketLanded(ball.targetBucket);
      } else {
        activeBalls.push(ball);
      }
    }

    ballsRef.current = activeBalls;
  }, [gravity, height, width, ySpacing, restitution, onBucketLanded]);

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
    // targetBucket (0 to totalRows) determines how many 'right' turns
    const path: boolean[] = [];
    for (let i = 0; i < totalRows; i++) {
      if (i < targetBucket) path.push(true);
      else path.push(false);
    }
    // Shuffle path
    for (let i = path.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [path[i], path[j]] = [path[j], path[i]];
    }
    return path;
  };

  const dropBall = (targetBucket: number, color?: string) => {
    const path = generatePath(targetBucket, rowCount);
    
    // Slight random initial x to prevent stacking exactly
    const initialX = width / 2 + (Math.random() * 4 - 2);
    
    const newBall: PlinkoBall = {
      id: Math.random().toString(),
      x: initialX,
      y: 0,
      vx: (Math.random() - 0.5) * 2,
      vy: 2,
      radius: ballRadius,
      path,
      currentRow: -1,
      targetBucket,
      color
    };
    
    ballsRef.current.push(newBall);
  };

  return { canvasRef, dropBall };
}
