import React, { useRef, useEffect, useCallback } from 'react';

interface CrashGraphProps {
  multiplier: number;
  elapsedSeconds: number;
  gameState: 'betting' | 'playing' | 'crashed';
}

const calcMultiplier = (seconds: number) => Math.max(1, Math.exp(seconds / 10));

export default function CrashGraph({ multiplier, elapsedSeconds, gameState }: CrashGraphProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef      = useRef<number | undefined>(undefined);

  // Frozen state for crash frame
  const frozenRawPts = useRef<{ t: number; m: number }[]>([]);

  // ─────────────────────────────────────────────────────
  // Core drawing function (reads current props via closure)
  // ─────────────────────────────────────────────────────
  const drawRef = useRef<() => void>(() => {});

  drawRef.current = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ensure canvas pixel size matches display size
    const rect = canvas.getBoundingClientRect();
    const dpr  = window.devicePixelRatio || 1;
    const W    = Math.floor(rect.width  * dpr) || canvas.width  || 600;
    const H    = Math.floor(rect.height * dpr) || canvas.height || 400;

    if (canvas.width !== W || canvas.height !== H) {
      canvas.width  = W;
      canvas.height = H;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale for DPR once (only on size change, but scaling is idempotent here)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const CW = rect.width  || W / dpr;
    const CH = rect.height || H / dpr;

    // ── Padding ──────────────────────────────────────────
    const PAD_L = 50, PAD_R = 16, PAD_T = 20, PAD_B = 30;
    const gW = CW - PAD_L - PAD_R;
    const gH = CH - PAD_T - PAD_B;

    // ── Clear ─────────────────────────────────────────────
    ctx.clearRect(0, 0, CW, CH);

    // ── Background gradient ────────────────────────────────
    const bg = ctx.createLinearGradient(0, 0, 0, CH);
    bg.addColorStop(0, '#12141f');
    bg.addColorStop(1, '#0a0c14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CW, CH);

    // ── Determine state variables ──────────────────────────
    const isCrashed = gameState === 'crashed';
    const isBetting = gameState === 'betting';
    const safeElapsed = isNaN(elapsedSeconds) ? 0 : Math.max(0, elapsedSeconds);
    const safeMulti   = isNaN(multiplier)     ? 1 : Math.max(1, multiplier);

    // ── Axis scales ────────────────────────────────────────
    const maxX = isBetting ? 3   : Math.max(3,    safeElapsed * 1.15);
    const maxY = isBetting ? 1.3 : Math.max(1.25, safeMulti   * 1.15);
    const minY = 1.0;

    const toX  = (t: number) => PAD_L + (t / maxX) * gW;
    const toY  = (m: number) => PAD_T + (1 - (m - minY) / (maxY - minY)) * gH;

    // ── Grid & labels ──────────────────────────────────────
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth   = 1;

    const Y_TICKS = 5;
    for (let i = 0; i <= Y_TICKS; i++) {
      const m  = minY + ((maxY - minY) * i) / Y_TICKS;
      const cy = toY(m);
      ctx.beginPath(); ctx.moveTo(PAD_L, cy); ctx.lineTo(CW - PAD_R, cy); ctx.stroke();
      ctx.fillStyle  = 'rgba(255,255,255,0.32)';
      ctx.font       = 'bold 10px monospace';
      ctx.textAlign  = 'right';
      ctx.fillText(m.toFixed(1) + 'x', PAD_L - 6, cy + 4);
    }

    const X_TICKS = 5;
    for (let i = 0; i <= X_TICKS; i++) {
      const t  = (maxX * i) / X_TICKS;
      const cx = toX(t);
      ctx.beginPath(); ctx.moveTo(cx, PAD_T); ctx.lineTo(cx, CH - PAD_B); ctx.stroke();
      ctx.fillStyle  = 'rgba(255,255,255,0.32)';
      ctx.font       = 'bold 10px monospace';
      ctx.textAlign  = 'center';
      ctx.fillText(Math.round(t) + 's', cx, CH - PAD_B + 18);
    }

    // Axis border
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(PAD_L, PAD_T);
    ctx.lineTo(PAD_L, CH - PAD_B);
    ctx.lineTo(CW - PAD_R, CH - PAD_B);
    ctx.stroke();

    // ── Build curve points ─────────────────────────────────
    type Pt = { cx: number; cy: number };
    let pts: Pt[];

    if (isBetting) {
      // Show a flat baseline at 1.00x
      pts = [{ cx: PAD_L, cy: toY(1.0) }];
    } else if (isCrashed && frozenRawPts.current.length > 0) {
      pts = frozenRawPts.current.map(p => ({ cx: toX(p.t), cy: toY(p.m) }));
    } else {
      const STEPS = 80;
      pts = [];
      for (let i = 0; i <= STEPS; i++) {
        const t = (safeElapsed * i) / STEPS;
        const m = calcMultiplier(t);
        pts.push({ cx: toX(t), cy: toY(m) });
      }
      // Save for crash freeze
      frozenRawPts.current = pts.map((_, i) => {
        const t = (safeElapsed * i) / STEPS;
        return { t, m: calcMultiplier(t) };
      });
    }

    if (pts.length < 2) return;

    const last       = pts[pts.length - 1];
    const lineColor  = isCrashed ? '#F87171' : '#00E5FF';
    const glowAlpha  = isCrashed ? 'rgba(248,113,113,' : 'rgba(0,229,255,';

    // ── Area fill ──────────────────────────────────────────
    const baseY = CH - PAD_B;
    const fillGrad = ctx.createLinearGradient(0, PAD_T, 0, baseY);
    fillGrad.addColorStop(0,   isCrashed ? 'rgba(248,113,113,0.28)' : 'rgba(0,229,255,0.22)');
    fillGrad.addColorStop(0.7, isCrashed ? 'rgba(248,113,113,0.04)' : 'rgba(0,229,255,0.04)');
    fillGrad.addColorStop(1,   'rgba(0,0,0,0)');

    ctx.beginPath();
    ctx.moveTo(PAD_L, baseY);
    ctx.lineTo(pts[0].cx, pts[0].cy);
    for (let i = 1; i < pts.length; i++) {
      const cpx = (pts[i - 1].cx + pts[i].cx) / 2;
      ctx.bezierCurveTo(cpx, pts[i - 1].cy, cpx, pts[i].cy, pts[i].cx, pts[i].cy);
    }
    ctx.lineTo(last.cx, baseY);
    ctx.closePath();
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // ── Glow pass (thick, blurred) ─────────────────────────
    ctx.save();
    ctx.shadowColor = lineColor;
    ctx.shadowBlur  = isCrashed ? 6 : 16;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth   = isCrashed ? 2 : 3;
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';

    ctx.beginPath();
    ctx.moveTo(pts[0].cx, pts[0].cy);
    for (let i = 1; i < pts.length; i++) {
      const cpx = (pts[i - 1].cx + pts[i].cx) / 2;
      ctx.bezierCurveTo(cpx, pts[i - 1].cy, cpx, pts[i].cy, pts[i].cx, pts[i].cy);
    }
    ctx.stroke();
    ctx.restore();

    // ── Animated head dot (playing only) ──────────────────
    if (gameState === 'playing') {
      const now   = Date.now();
      const pulse = 0.5 + 0.5 * Math.sin(now / 200); // 0..1

      // Outer ring
      ctx.beginPath();
      ctx.arc(last.cx, last.cy, 12 + pulse * 5, 0, Math.PI * 2);
      ctx.strokeStyle = glowAlpha + '0.12)';
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      // Middle ring
      ctx.beginPath();
      ctx.arc(last.cx, last.cy, 7, 0, Math.PI * 2);
      ctx.strokeStyle = glowAlpha + '0.4)';
      ctx.lineWidth   = 2;
      ctx.stroke();

      // Core
      ctx.save();
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur  = 20;
      ctx.beginPath();
      ctx.arc(last.cx, last.cy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      // Keep rAF loop running while playing
      animRef.current = requestAnimationFrame(() => drawRef.current());
    }

    // ── Crash dot ──────────────────────────────────────────
    if (isCrashed) {
      ctx.save();
      ctx.shadowColor = '#F87171';
      ctx.shadowBlur  = 20;
      ctx.beginPath();
      ctx.arc(last.cx, last.cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#F87171';
      ctx.fill();
      ctx.restore();
    }
  };

  // ─────────────────────────────────────────────────────
  // Reset frozen state when new round starts
  // ─────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState === 'betting') {
      frozenRawPts.current = [];
    }
  }, [gameState]);

  // ─────────────────────────────────────────────────────
  // Trigger draw on every prop change
  // ─────────────────────────────────────────────────────
  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    drawRef.current();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [multiplier, elapsedSeconds, gameState]);

  // ─────────────────────────────────────────────────────
  // ResizeObserver — redraw whenever container resizes
  // ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ro = new ResizeObserver(() => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      drawRef.current();
    });
    ro.observe(container);

    // Initial draw after first layout
    requestAnimationFrame(() => drawRef.current());

    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
