import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { WheelParticipant, WheelPrize, WheelHistoryEntry, BetLivoWheelConfig } from '../types';

// ─── Constants ───────────────────────────────────────────────────────────────
const BETLIVO_GOLD = '#f0b90b';
const BETLIVO_GOLD_DARK = '#c49a09';
const WHEEL_COLORS = [
    '#1a1a2e', '#16213e', '#0f3460', '#1a1a3e',
    '#162140', '#0f2850', '#1a1a4e', '#162150',
];
const TICK_SOUND_FREQ = 800;
const TICK_SOUND_DURATION = 0.03;

interface BetLivoWheelProps {
    config: BetLivoWheelConfig;
    onConfigChange: (config: BetLivoWheelConfig) => void;
    isAdmin?: boolean;
}

// ─── Utility: Build segments with 2 fixed BETLİVO slices at opposite poles ──
function buildSegments(participants: WheelParticipant[]) {
    const names = participants.map(p => p.name);
    if (names.length === 0) {
        return [
            { label: 'BETLİVO', isBetlivo: true },
            { label: 'Katılımcı Yok', isBetlivo: false },
            { label: 'BETLİVO', isBetlivo: true },
            { label: 'Katılımcı Yok', isBetlivo: false },
        ];
    }
    const half = Math.ceil(names.length / 2);
    const firstHalf = names.slice(0, half);
    const secondHalf = names.slice(half);
    const segments: { label: string; isBetlivo: boolean }[] = [];
    // First half of participants
    firstHalf.forEach(n => segments.push({ label: n, isBetlivo: false }));
    // First BETLİVO segment
    segments.push({ label: 'BETLİVO', isBetlivo: true });
    // Second half
    secondHalf.forEach(n => segments.push({ label: n, isBetlivo: false }));
    // Second BETLİVO segment (opposite pole)
    segments.push({ label: 'BETLİVO', isBetlivo: true });
    return segments;
}

// ─── Tick Sound Generator ────────────────────────────────────────────────────
function playTick() {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = TICK_SOUND_FREQ;
        osc.type = 'square';
        gain.gain.value = 0.08;
        osc.start();
        osc.stop(ctx.currentTime + TICK_SOUND_DURATION);
    } catch { /* silent fallback */ }
}

// ─── Loot Box Component ──────────────────────────────────────────────────────
const LootBox: React.FC<{
    prize: WheelPrize | null;
    winner: string;
    onClose: () => void;
}> = ({ prize, winner, onClose }) => {
    const [phase, setPhase] = useState<'shake' | 'open' | 'reveal'>('shake');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('open'), 1500);
        const t2 = setTimeout(() => {
            setPhase('reveal');
            // Fire confetti
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.5 },
                colors: ['#f0b90b', '#ffd357', '#ffffff', '#ff6b6b', '#4ecdc4'],
            });
            confetti({
                particleCount: 80,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.6 },
                colors: ['#f0b90b', '#ffd357'],
            });
            confetti({
                particleCount: 80,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.6 },
                colors: ['#f0b90b', '#ffd357'],
            });
        }, 3000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
        }}>
            {/* Animated Crate */}
            <div style={{
                width: 220, height: 220, position: 'relative',
                animation: phase === 'shake' ? 'lootbox-shake 0.15s infinite alternate' : phase === 'open' ? 'lootbox-open 1.5s ease-out forwards' : 'none',
                transform: phase === 'reveal' ? 'scale(0.5)' : undefined,
                opacity: phase === 'reveal' ? 0.3 : 1,
                transition: phase === 'reveal' ? 'all 0.5s ease' : undefined,
            }}>
                <div style={{
                    width: '100%', height: '100%',
                    background: `linear-gradient(135deg, ${BETLIVO_GOLD}, ${BETLIVO_GOLD_DARK})`,
                    borderRadius: 24, border: '4px solid rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: 8,
                    boxShadow: `0 0 60px rgba(240,185,11,0.5), inset 0 2px 0 rgba(255,255,255,0.3)`,
                }}>
                    <span style={{ fontSize: 64 }}>📦</span>
                    <span style={{ color: '#000', fontWeight: 900, fontSize: 18, letterSpacing: 2 }}>BETLİVO</span>
                    <span style={{ color: 'rgba(0,0,0,0.5)', fontWeight: 700, fontSize: 11, letterSpacing: 3 }}>GANİMET KASASI</span>
                </div>
            </div>

            {/* Revealed Prize */}
            {phase === 'reveal' && (
                <div style={{
                    marginTop: -60,
                    animation: 'lootbox-reveal 0.6s ease-out forwards',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                }}>
                    <div style={{
                        fontSize: 80,
                        filter: 'drop-shadow(0 0 30px rgba(240,185,11,0.8))',
                    }}>
                        {prize?.emoji || '🎁'}
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, #f0b90b, #ffd357)',
                        padding: '16px 40px', borderRadius: 20,
                        boxShadow: '0 0 40px rgba(240,185,11,0.4)',
                    }}>
                        <span style={{ color: '#000', fontWeight: 900, fontSize: 22, letterSpacing: 1 }}>
                            {prize?.name || 'ÖDÜL'}
                        </span>
                    </div>
                    <p style={{ color: '#a1a1aa', fontWeight: 700, fontSize: 14, marginTop: 8 }}>
                        🎉 Tebrikler <span style={{ color: BETLIVO_GOLD }}>{winner}</span>!
                    </p>
                    <button onClick={onClose} style={{
                        marginTop: 20, padding: '14px 48px',
                        background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)',
                        borderRadius: 16, color: '#fff', fontWeight: 800, fontSize: 14,
                        cursor: 'pointer', letterSpacing: 1,
                        transition: 'all 0.3s ease',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(240,185,11,0.2)'; e.currentTarget.style.borderColor = BETLIVO_GOLD; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    >
                        KAPAT
                    </button>
                </div>
            )}
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// ██  MAIN COMPONENT  ████████████████████████████████████████████████████████
// ═════════════════════════════════════════════════════════════════════════════
const BetLivoWheel: React.FC<BetLivoWheelProps> = ({ config, onConfigChange, isAdmin }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [spinning, setSpinning] = useState(false);
    const [currentAngle, setCurrentAngle] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);
    const [showLootBox, setShowLootBox] = useState(false);
    const [lootPrize, setLootPrize] = useState<WheelPrize | null>(null);
    const [lootWinner, setLootWinner] = useState('');

    // Admin controls (local state mirrors)
    const [jsonInput, setJsonInput] = useState('');
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [selectedForceWinner, setSelectedForceWinner] = useState('');
    const [newPrizeName, setNewPrizeName] = useState('');
    const [newPrizeEmoji, setNewPrizeEmoji] = useState('🎁');
    const [newPrizeStock, setNewPrizeStock] = useState(10);

    const angleRef = useRef(0);
    const velocityRef = useRef(0);
    const animFrameRef = useRef(0);
    const lastSegRef = useRef(-1);

    const segments = buildSegments(config.participants);
    const segmentAngle = (2 * Math.PI) / segments.length;
    const CANVAS_SIZE = 500;
    const RADIUS = 220;
    const CENTER = CANVAS_SIZE / 2;

    // ─── Draw Wheel ──────────────────────────────────────────────────────────
    const drawWheel = useCallback((angle: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Outer ring glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(CENTER, CENTER, RADIUS + 12, 0, 2 * Math.PI);
        ctx.strokeStyle = BETLIVO_GOLD;
        ctx.lineWidth = 3;
        ctx.shadowColor = BETLIVO_GOLD;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.restore();

        // Draw segments
        segments.forEach((seg, i) => {
            const startAngle = angle + i * segmentAngle;
            const endAngle = startAngle + segmentAngle;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(CENTER, CENTER);
            ctx.arc(CENTER, CENTER, RADIUS, startAngle, endAngle);
            ctx.closePath();

            if (seg.isBetlivo) {
                const grad = ctx.createRadialGradient(CENTER, CENTER, 0, CENTER, CENTER, RADIUS);
                grad.addColorStop(0, '#3d2e00');
                grad.addColorStop(0.7, '#f0b90b');
                grad.addColorStop(1, '#ffd357');
                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
            }
            ctx.fill();

            // Segment border
            ctx.strokeStyle = seg.isBetlivo ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.08)';
            ctx.lineWidth = seg.isBetlivo ? 2 : 1;
            ctx.stroke();
            ctx.restore();

            // Text
            ctx.save();
            ctx.translate(CENTER, CENTER);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = 'right';
            ctx.font = seg.isBetlivo ? 'bold 16px "Inter", sans-serif' : '13px "Inter", sans-serif';
            ctx.fillStyle = seg.isBetlivo ? '#000' : '#fff';
            ctx.shadowColor = seg.isBetlivo ? 'transparent' : 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = seg.isBetlivo ? 0 : 4;
            const label = seg.label.length > 14 ? seg.label.substring(0, 13) + '…' : seg.label;
            ctx.fillText(label, RADIUS - 18, 5);
            ctx.restore();
        });

        // Inner circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(CENTER, CENTER, 40, 0, 2 * Math.PI);
        const innerGrad = ctx.createRadialGradient(CENTER, CENTER, 0, CENTER, CENTER, 40);
        innerGrad.addColorStop(0, '#222');
        innerGrad.addColorStop(1, '#111');
        ctx.fillStyle = innerGrad;
        ctx.fill();
        ctx.strokeStyle = BETLIVO_GOLD;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        // Inner logo
        ctx.save();
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.fillStyle = BETLIVO_GOLD;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BET', CENTER, CENTER - 7);
        ctx.fillText('LİVO', CENTER, CENTER + 7);
        ctx.restore();

        // ─── Pointer (top) ───────────────────────────────────────────────────
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(CENTER, 12);
        ctx.lineTo(CENTER - 18, 48);
        ctx.lineTo(CENTER + 18, 48);
        ctx.closePath();
        const pointerGrad = ctx.createLinearGradient(CENTER, 12, CENTER, 48);
        pointerGrad.addColorStop(0, '#ffd357');
        pointerGrad.addColorStop(1, BETLIVO_GOLD);
        ctx.fillStyle = pointerGrad;
        ctx.shadowColor = BETLIVO_GOLD;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Nub notches on the outer ring
        segments.forEach((_, i) => {
            const a = angle + i * segmentAngle;
            const nx = CENTER + Math.cos(a) * (RADIUS + 6);
            const ny = CENTER + Math.sin(a) * (RADIUS + 6);
            ctx.save();
            ctx.beginPath();
            ctx.arc(nx, ny, 4, 0, 2 * Math.PI);
            ctx.fillStyle = BETLIVO_GOLD;
            ctx.shadowColor = BETLIVO_GOLD;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.restore();
        });
    }, [segments, segmentAngle]);

    // ─── Initial Draw ────────────────────────────────────────────────────────
    useEffect(() => {
        drawWheel(currentAngle);
    }, [drawWheel, currentAngle, config.participants]);

    // ─── Determine winner from angle ─────────────────────────────────────────
    const getWinnerFromAngle = useCallback((angle: number) => {
        // Pointer is at top (3π/2 or -π/2)
        const pointerAngle = -Math.PI / 2;
        let normalizedAngle = (pointerAngle - angle) % (2 * Math.PI);
        if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
        const segIndex = Math.floor(normalizedAngle / segmentAngle) % segments.length;
        return segments[segIndex];
    }, [segments, segmentAngle]);

    // ─── Spin the wheel ──────────────────────────────────────────────────────
    const spinWheel = useCallback(() => {
        if (spinning || segments.length < 3) return;
        setSpinning(true);
        setWinner(null);

        let targetAngle = 0;
        const fullRotations = (6 + Math.random() * 4) * 2 * Math.PI; // 6-10 full spins

        if (config.riggedWinner) {
            // Force to a specific participant
            const idx = segments.findIndex(s => s.label === config.riggedWinner && !s.isBetlivo);
            if (idx >= 0) {
                const segCenter = idx * segmentAngle + segmentAngle / 2;
                // Pointer is at top (-π/2). The segment must align with the pointer.
                targetAngle = -Math.PI / 2 - segCenter + fullRotations;
            } else {
                targetAngle = fullRotations + Math.random() * 2 * Math.PI;
            }
        } else if (config.betlivoTrigger) {
            // Force to one of the BETLİVO segments
            const betlivoIndices = segments.map((s, i) => s.isBetlivo ? i : -1).filter(i => i >= 0);
            const chosen = betlivoIndices[Math.floor(Math.random() * betlivoIndices.length)];
            const segCenter = chosen * segmentAngle + segmentAngle / 2;
            targetAngle = -Math.PI / 2 - segCenter + fullRotations;
        } else {
            targetAngle = fullRotations + Math.random() * 2 * Math.PI;
        }

        const startAngle = angleRef.current;
        const totalDelta = targetAngle - startAngle;
        const duration = 5000 + Math.random() * 2000; // 5-7 seconds
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentA = startAngle + totalDelta * eased;

            angleRef.current = currentA;
            setCurrentAngle(currentA);
            drawWheel(currentA);

            // Tick sound on segment change
            const currentSeg = Math.floor(((-Math.PI / 2 - currentA) % (2 * Math.PI) + 4 * Math.PI) % (2 * Math.PI) / segmentAngle) % segments.length;
            if (currentSeg !== lastSegRef.current) {
                lastSegRef.current = currentSeg;
                if (progress < 0.95) playTick();
            }

            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(animate);
            } else {
                // Spin complete
                setSpinning(false);
                const winningSeg = getWinnerFromAngle(currentA);
                setWinner(winningSeg.label);

                if (winningSeg.isBetlivo) {
                    // BetLivo Kasa!
                    const availablePrizes = config.prizes.filter(p => p.stock > 0);
                    const prize = availablePrizes.length > 0
                        ? availablePrizes[Math.floor(Math.random() * availablePrizes.length)]
                        : null;
                    setLootPrize(prize);
                    setLootWinner('BETLİVO');
                    setTimeout(() => setShowLootBox(true), 800);
                    // Deduct stock
                    if (prize) {
                        const updatedPrizes = config.prizes.map(p =>
                            p.id === prize.id ? { ...p, stock: p.stock - 1 } : p
                        );
                        const entry: WheelHistoryEntry = { winner: 'BETLİVO KASA', prize: prize.name, timestamp: Date.now() };
                        onConfigChange({ ...config, prizes: updatedPrizes, history: [entry, ...config.history] });
                    }
                } else {
                    // Normal winner → assign random available prize
                    const availablePrizes = config.prizes.filter(p => p.stock > 0);
                    if (availablePrizes.length > 0) {
                        const prize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
                        const updatedPrizes = config.prizes.map(p =>
                            p.id === prize.id ? { ...p, stock: p.stock - 1 } : p
                        );
                        const entry: WheelHistoryEntry = {
                            winner: winningSeg.label,
                            prize: prize.name,
                            timestamp: Date.now(),
                        };
                        onConfigChange({ ...config, prizes: updatedPrizes, history: [entry, ...config.history] });

                        // Small confetti for normal winner
                        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ['#f0b90b', '#ffd357', '#fff'] });
                    }
                    // Clear rigged winner after use
                    if (config.riggedWinner) {
                        onConfigChange({ ...config, riggedWinner: null });
                    }
                }
                // Clear betlivo trigger after use
                if (config.betlivoTrigger) {
                    onConfigChange({ ...config, betlivoTrigger: false });
                }
            }
        };

        animFrameRef.current = requestAnimationFrame(animate);
    }, [spinning, segments, segmentAngle, config, drawWheel, getWinnerFromAngle, onConfigChange]);

    // Cleanup
    useEffect(() => () => cancelAnimationFrame(animFrameRef.current), []);

    // ─── Admin: Add participants from JSON ─────────────────────────────────
    const handleJsonPaste = () => {
        try {
            let names: string[] = [];
            const trimmed = jsonInput.trim();
            // Try JSON array
            if (trimmed.startsWith('[')) {
                const parsed = JSON.parse(trimmed);
                names = parsed.map((item: any) => typeof item === 'string' ? item : item.name || item.username || '');
            } else {
                // Treat as newline / comma separated
                names = trimmed.split(/[\n,]+/).map(n => n.trim().replace(/^@/, '')).filter(n => n);
            }
            const newParticipants: WheelParticipant[] = names
                .filter(n => n && !config.participants.some(p => p.name === n))
                .map(n => ({ id: Date.now().toString() + Math.random().toString(36).slice(2), name: n }));
            if (newParticipants.length > 0) {
                onConfigChange({ ...config, participants: [...config.participants, ...newParticipants] });
            }
            setJsonInput('');
            setShowJsonModal(false);
        } catch {
            alert('JSON formatı hatalı. Düz liste veya JSON dizisi yapıştırın.');
        }
    };

    // ─── Admin: Add a prize ────────────────────────────────────────────────
    const addPrize = () => {
        if (!newPrizeName.trim()) return;
        const newPrize: WheelPrize = {
            id: Date.now().toString(),
            name: newPrizeName.trim(),
            emoji: newPrizeEmoji || '🎁',
            stock: newPrizeStock,
        };
        onConfigChange({ ...config, prizes: [...config.prizes, newPrize] });
        setNewPrizeName('');
        setNewPrizeEmoji('🎁');
        setNewPrizeStock(10);
    };

    // ═════════════════════════════════════════════════════════════════════════
    // RENDER
    // ═════════════════════════════════════════════════════════════════════════
    return (
        <div style={{
            minHeight: '100vh',
            background: config.transparentBg ? 'transparent' : 'linear-gradient(180deg, #050510 0%, #0a0a1a 100%)',
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
        }}>
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <h1 style={{
                    fontSize: 42, fontWeight: 900, letterSpacing: -1,
                    background: `linear-gradient(135deg, ${BETLIVO_GOLD}, #ffd357)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    marginBottom: 8,
                }}>
                    🎡 BETLİVO ÇARKIFELEĞİ
                </h1>
                <p style={{ color: '#71717a', fontWeight: 700, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' }}>
                    Canlı Yayın Çekiliş Sistemi
                </p>
            </div>

            {/* Main Layout: Inventory | Wheel | Admin */}
            <div style={{
                display: 'flex', gap: 40, alignItems: 'flex-start',
                flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1400, width: '100%',
            }}>

                {/* ─── LEFT: Inventory Panel ──────────────────────────────────── */}
                <div style={{
                    width: 280, background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24,
                    padding: 24, flexShrink: 0,
                }}>
                    <h3 style={{
                        color: '#fff', fontWeight: 900, fontSize: 15, marginBottom: 20,
                        display: 'flex', alignItems: 'center', gap: 8,
                        letterSpacing: 1, textTransform: 'uppercase',
                    }}>
                        📦 Ödül Envanteri
                    </h3>
                    {config.prizes.length === 0 ? (
                        <p style={{ color: '#52525b', fontSize: 13, fontWeight: 600 }}>Henüz ödül eklenmedi.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {config.prizes.map(prize => {
                                const depleted = prize.stock <= 0;
                                return (
                                    <div key={prize.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: '12px 14px', borderRadius: 14,
                                        background: depleted ? 'rgba(255,0,0,0.08)' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${depleted ? 'rgba(255,0,0,0.3)' : 'rgba(255,255,255,0.06)'}`,
                                        opacity: depleted ? 0.5 : 1,
                                        position: 'relative', overflow: 'hidden',
                                    }}>
                                        <span style={{ fontSize: 24 }}>{prize.emoji}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                color: depleted ? '#ef4444' : '#fff',
                                                fontWeight: 800, fontSize: 13,
                                                textDecoration: depleted ? 'line-through' : 'none',
                                            }}>{prize.name}</div>
                                            <div style={{
                                                color: depleted ? '#ef4444' : '#71717a',
                                                fontWeight: 700, fontSize: 11, marginTop: 2,
                                            }}>
                                                Kalan: {prize.stock}
                                            </div>
                                        </div>
                                        {depleted && (
                                            <div style={{
                                                position: 'absolute', inset: 0,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: 'rgba(0,0,0,0.3)',
                                            }}>
                                                <span style={{
                                                    color: '#FF0000', fontWeight: 900, fontSize: 14,
                                                    letterSpacing: 3, textTransform: 'uppercase',
                                                    border: '2px solid #FF0000', padding: '4px 16px',
                                                    borderRadius: 8, transform: 'rotate(-15deg)',
                                                }}>TÜKENDİ</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* History */}
                    {config.history.length > 0 && (
                        <div style={{ marginTop: 24 }}>
                            <h4 style={{ color: '#a1a1aa', fontWeight: 800, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                                📜 Son Kazananlar
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
                                {config.history.slice(0, 10).map((h, i) => (
                                    <div key={i} style={{
                                        padding: '8px 12px', borderRadius: 10,
                                        background: 'rgba(255,255,255,0.03)', fontSize: 12,
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    }}>
                                        <span style={{ color: BETLIVO_GOLD, fontWeight: 800 }}>{h.winner}</span>
                                        <span style={{ color: '#71717a', fontWeight: 600 }}>{h.prize}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── CENTER: Wheel ──────────────────────────────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_SIZE}
                            height={CANVAS_SIZE}
                            style={{ width: 500, height: 500 }}
                        />

                        {/* Participant count badge */}
                        <div style={{
                            position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
                            background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(240,185,11,0.3)',
                            padding: '8px 20px', borderRadius: 20,
                            color: '#a1a1aa', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap',
                        }}>
                            👥 {config.participants.length} Katılımcı &nbsp;·&nbsp; 🎫 {segments.length} Dilim
                        </div>
                    </div>

                    {/* Spin Button */}
                    <button
                        onClick={spinWheel}
                        disabled={spinning || segments.length < 3}
                        style={{
                            marginTop: 32, padding: '18px 64px',
                            background: spinning ? '#333' : `linear-gradient(135deg, ${BETLIVO_GOLD}, #ffd357)`,
                            border: 'none', borderRadius: 20,
                            color: spinning ? '#666' : '#000',
                            fontWeight: 900, fontSize: 18, letterSpacing: 2,
                            cursor: spinning ? 'not-allowed' : 'pointer',
                            boxShadow: spinning ? 'none' : `0 0 40px rgba(240,185,11,0.4)`,
                            transition: 'all 0.3s ease', textTransform: 'uppercase',
                            transform: spinning ? 'scale(0.95)' : 'scale(1)',
                        }}
                    >
                        {spinning ? '🎡 DÖNÜYOR...' : '🚀 ÇARKI ÇEVİR'}
                    </button>

                    {/* Winner announcement */}
                    {winner && !spinning && (
                        <div style={{
                            marginTop: 20, padding: '16px 32px',
                            background: 'rgba(240,185,11,0.1)', border: '2px solid rgba(240,185,11,0.3)',
                            borderRadius: 20, textAlign: 'center',
                            animation: 'lootbox-reveal 0.5s ease-out',
                        }}>
                            <div style={{ color: '#a1a1aa', fontSize: 12, fontWeight: 700, marginBottom: 4, letterSpacing: 2 }}>
                                🎯 KAZANAN
                            </div>
                            <div style={{ color: BETLIVO_GOLD, fontSize: 24, fontWeight: 900, letterSpacing: 1 }}>
                                {winner}
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── RIGHT: Admin Controls (only if isAdmin) ────────────────── */}
                {isAdmin && (
                    <div style={{
                        width: 300, background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24,
                        padding: 24, flexShrink: 0,
                    }}>
                        <h3 style={{
                            color: '#ef4444', fontWeight: 900, fontSize: 14, marginBottom: 20,
                            display: 'flex', alignItems: 'center', gap: 8,
                            letterSpacing: 1, textTransform: 'uppercase',
                        }}>
                            🔒 Admin Kontrol
                        </h3>

                        {/* Winner Force */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ color: '#a1a1aa', fontSize: 11, fontWeight: 800, letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                                🎯 WINNER FORCE
                            </label>
                            <select
                                value={config.riggedWinner || ''}
                                onChange={e => onConfigChange({ ...config, riggedWinner: e.target.value || null })}
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 12,
                                    background: '#111', border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff', fontSize: 13, fontWeight: 700,
                                }}
                            >
                                <option value="">Rastgele (Normal)</option>
                                {config.participants.map(p => (
                                    <option key={p.id} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                            {config.riggedWinner && (
                                <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, marginTop: 6 }}>
                                    ⚠️ Çark "{config.riggedWinner}" isimde duracak!
                                </p>
                            )}
                        </div>

                        {/* BetLivo Trigger */}
                        <div style={{ marginBottom: 20 }}>
                            <button
                                onClick={() => onConfigChange({ ...config, betlivoTrigger: !config.betlivoTrigger })}
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: 14,
                                    background: config.betlivoTrigger ? 'rgba(240,185,11,0.2)' : 'rgba(255,255,255,0.05)',
                                    border: `2px solid ${config.betlivoTrigger ? BETLIVO_GOLD : 'rgba(255,255,255,0.1)'}`,
                                    color: config.betlivoTrigger ? BETLIVO_GOLD : '#71717a',
                                    fontWeight: 900, fontSize: 13, cursor: 'pointer',
                                    letterSpacing: 1, transition: 'all 0.3s ease',
                                }}
                            >
                                {config.betlivoTrigger ? '✅ BETLİVO TRİGGER AKTİF' : '💤 BETLİVO TRİGGER'}
                            </button>
                            {config.betlivoTrigger && (
                                <p style={{ color: BETLIVO_GOLD, fontSize: 11, fontWeight: 700, marginTop: 6 }}>
                                    Çark altın dilimde duracak → Kasa açılır!
                                </p>
                            )}
                        </div>

                        {/* Transparency Toggle */}
                        <div style={{ marginBottom: 20 }}>
                            <button
                                onClick={() => onConfigChange({ ...config, transparentBg: !config.transparentBg })}
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 12,
                                    background: config.transparentBg ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${config.transparentBg ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}`,
                                    color: config.transparentBg ? '#a78bfa' : '#71717a',
                                    fontWeight: 800, fontSize: 12, cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {config.transparentBg ? '🟢 ŞEFFAF ARKAPLAN' : '⚫ KOYU ARKAPLAN'}
                            </button>
                        </div>

                        {/* Participants Management */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ color: '#a1a1aa', fontSize: 11, fontWeight: 800, letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                                👥 KATILIMCILAR ({config.participants.length})
                            </label>
                            <button
                                onClick={() => setShowJsonModal(true)}
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 12,
                                    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                                    color: '#60a5fa', fontWeight: 800, fontSize: 12, cursor: 'pointer',
                                    marginBottom: 8,
                                }}
                            >
                                📋 JSON / LİSTE YAPIŞTIR
                            </button>
                            <button
                                onClick={() => onConfigChange({ ...config, participants: [] })}
                                style={{
                                    width: '100%', padding: '8px 14px', borderRadius: 10,
                                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                    color: '#ef4444', fontWeight: 700, fontSize: 11, cursor: 'pointer',
                                }}
                            >
                                🗑️ TÜM KATILIMCILARI TEMİZLE
                            </button>
                        </div>

                        {/* Add Prize */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ color: '#a1a1aa', fontSize: 11, fontWeight: 800, letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                                🎁 ÖDÜL EKLE
                            </label>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                                <input
                                    value={newPrizeEmoji}
                                    onChange={e => setNewPrizeEmoji(e.target.value)}
                                    placeholder="Emoji"
                                    style={{
                                        width: 50, padding: '8px', borderRadius: 10,
                                        background: '#111', border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff', fontSize: 20, textAlign: 'center',
                                    }}
                                />
                                <input
                                    value={newPrizeName}
                                    onChange={e => setNewPrizeName(e.target.value)}
                                    placeholder="Ödül adı"
                                    style={{
                                        flex: 1, padding: '8px 12px', borderRadius: 10,
                                        background: '#111', border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff', fontSize: 13, fontWeight: 700,
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <input
                                    type="number"
                                    value={newPrizeStock}
                                    onChange={e => setNewPrizeStock(parseInt(e.target.value) || 0)}
                                    placeholder="Stok"
                                    style={{
                                        width: 70, padding: '8px 12px', borderRadius: 10,
                                        background: '#111', border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff', fontSize: 13, fontWeight: 700,
                                    }}
                                />
                                <button
                                    onClick={addPrize}
                                    style={{
                                        flex: 1, padding: '8px 14px', borderRadius: 10,
                                        background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                                        color: '#22c55e', fontWeight: 800, fontSize: 12, cursor: 'pointer',
                                    }}
                                >
                                    ✅ EKLE
                                </button>
                            </div>
                        </div>

                        {/* History Clear */}
                        <button
                            onClick={() => onConfigChange({ ...config, history: [] })}
                            style={{
                                width: '100%', padding: '8px 14px', borderRadius: 10,
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                color: '#52525b', fontWeight: 700, fontSize: 11, cursor: 'pointer',
                            }}
                        >
                            🧹 GEÇMİŞİ TEMİZLE
                        </button>
                    </div>
                )}
            </div>

            {/* ─── JSON Paste Modal ─────────────────────────────────────────────── */}
            {showJsonModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9000,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
                }}>
                    <div style={{
                        background: '#111', border: '1px solid rgba(240,185,11,0.2)',
                        borderRadius: 32, padding: 32, maxWidth: 500, width: '100%',
                        boxShadow: '0 0 60px rgba(0,0,0,0.5)',
                    }}>
                        <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 18, marginBottom: 8 }}>
                            📋 Katılımcı Listesi Yapıştır
                        </h3>
                        <p style={{ color: '#71717a', fontSize: 12, fontWeight: 600, marginBottom: 16 }}>
                            JSON dizisi, virgülle ayrılmış veya her satıra bir isim yapıştırın.<br />
                            Örn: <code style={{ color: BETLIVO_GOLD }}>["ali", "veli", "ayse"]</code> veya düz liste
                        </p>
                        <textarea
                            value={jsonInput}
                            onChange={e => setJsonInput(e.target.value)}
                            placeholder={'["kullanıcı1", "kullanıcı2", "kullanıcı3"]\nveya\nkullanıcı1\nkullanıcı2\nkullanıcı3'}
                            rows={8}
                            style={{
                                width: '100%', padding: '14px 16px', borderRadius: 16,
                                background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'monospace',
                                resize: 'vertical',
                            }}
                        />
                        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                            <button
                                onClick={() => setShowJsonModal(false)}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: 14,
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#a1a1aa', fontWeight: 800, fontSize: 13, cursor: 'pointer',
                                }}
                            >
                                İPTAL
                            </button>
                            <button
                                onClick={handleJsonPaste}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: 14,
                                    background: `linear-gradient(135deg, ${BETLIVO_GOLD}, #ffd357)`,
                                    border: 'none', color: '#000', fontWeight: 900, fontSize: 13,
                                    cursor: 'pointer', boxShadow: '0 0 20px rgba(240,185,11,0.3)',
                                }}
                            >
                                ✅ EKLE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Loot Box Overlay ─────────────────────────────────────────────── */}
            {showLootBox && (
                <LootBox
                    prize={lootPrize}
                    winner={lootWinner}
                    onClose={() => setShowLootBox(false)}
                />
            )}

            {/* ─── CSS Keyframes ────────────────────────────────────────────────── */}
            <style>{`
        @keyframes lootbox-shake {
          0% { transform: translateX(-4px) rotate(-1deg); }
          100% { transform: translateX(4px) rotate(1deg); }
        }
        @keyframes lootbox-open {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
          100% { transform: scale(0.3) rotate(15deg); opacity: 0; }
        }
        @keyframes lootbox-reveal {
          0% { transform: scale(0) translateY(40px); opacity: 0; }
          60% { transform: scale(1.1) translateY(-10px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default BetLivoWheel;
