
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gift, Copy, Check, Trophy, Users, Ticket, Clock, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GiveawayConfig } from '../types';

interface GiveawayViewProps {
    config: GiveawayConfig;
    onConfigChange: (config: GiveawayConfig) => void;
    isAdmin?: boolean;
}

// ─── DEFAULT CONFIG ──────────────────────────────────────────────────────────
export const DEFAULT_GIVEAWAY_CONFIG: GiveawayConfig = {
    giveaways: [{
        id: 'gw1',
        title: 'Haftalık Büyük Çekiliş',
        description: 'Instagram gönderimizdeki şartları yerine getiren kullanıcılar arasından canlı çekiliş yapılacaktır.',
        instagramPostUrl: 'https://instagram.com/p/example',
        startDate: new Date().toISOString().split('T')[0],
        drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
    }],
    prizes: [
        { id: 'p1', giveawayId: 'gw1', prizeName: '100$ Bonus', quantity: 1, icon: '💰' },
        { id: 'p2', giveawayId: 'gw1', prizeName: '50$ Bonus', quantity: 2, icon: '🎁' },
        { id: 'p3', giveawayId: 'gw1', prizeName: '25$ Freebet', quantity: 5, icon: '⚡' },
    ],
    participants: [],
    winners: [],
    rules: [
        { id: 'r1', action: 'instagram_follow', label: 'Instagram sayfamızı takip et', entryValue: 1, icon: '📱' },
        { id: 'r2', action: 'post_like', label: 'Gönderiyi beğen', entryValue: 1, icon: '❤️' },
        { id: 'r3', action: 'tag_friends', label: '2 arkadaşını etiketle', entryValue: 2, icon: '👥' },
        { id: 'r4', action: 'story_share', label: 'Hikayede paylaş', entryValue: 1, icon: '📤' },
        { id: 'r5', action: 'telegram_join', label: 'Telegram grubumuza katıl', entryValue: 1, icon: '✈️' },
        { id: 'r6', action: 'referral', label: 'Arkadaş davet et', entryValue: 3, icon: '🔗' },
    ],
    activities: [],
};

// ────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ────────────────────────────────────────────────────────────────────────────────
const GiveawayView: React.FC<GiveawayViewProps> = ({ config, onConfigChange, isAdmin }) => {
    const activeGiveaway = config.giveaways.find(g => g.status === 'active') || config.giveaways[0];
    const prizes = config.prizes.filter(p => p.giveawayId === activeGiveaway?.id);
    const participants = config.participants.filter(p => p.giveawayId === activeGiveaway?.id);
    const winners = config.winners.filter(w => w.giveawayId === activeGiveaway?.id);
    const rules = config.rules;

    // ─── COUNTDOWN ──────────────────────────────────
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!activeGiveaway) return;
        const target = new Date(activeGiveaway.drawDate + 'T21:00:00').getTime();
        const tick = () => {
            const now = Date.now();
            const diff = Math.max(0, target - now);
            setCountdown({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [activeGiveaway?.drawDate]);

    // ─── REFERRAL LINK ──────────────────────────────
    const [copied, setCopied] = useState(false);
    const refCode = 'user_' + Math.random().toString(36).substring(2, 8);
    const refLink = `${window.location.origin}/giveaway?ref=${refCode}`;

    const copyRef = () => {
        navigator.clipboard.writeText(refLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ─── SOCIAL PROOF FEED ──────────────────────────
    const [feedItems, setFeedItems] = useState<{ text: string; time: string }[]>([]);
    const feedNames = ['Mehmet', 'Ayşe', 'Ali', 'Fatma', 'Emre', 'Zeynep', 'Can', 'Ela', 'Burak', 'Selin', 'Onur', 'Defne', 'Kaan', 'Elif', 'Cem'];
    const feedActions = ['çekilişe katıldı', 'arkadaş davet etti', 'yeni giriş yaptı', 'Instagram\'da paylaştı', 'Telegram\'a katıldı'];

    useEffect(() => {
        const interval = setInterval(() => {
            const name = feedNames[Math.floor(Math.random() * feedNames.length)];
            const action = feedActions[Math.floor(Math.random() * feedActions.length)];
            setFeedItems(prev => [
                { text: `🔥 ${name} ${action}`, time: 'Az önce' },
                ...prev.slice(0, 7),
            ]);
        }, 3000);

        // Initial items
        setFeedItems([
            { text: '🔥 Emre çekilişe katıldı', time: '2 dk önce' },
            { text: '🔥 Selin arkadaş davet etti', time: '5 dk önce' },
            { text: '🔥 Kaan yeni giriş yaptı', time: '8 dk önce' },
        ]);

        return () => clearInterval(interval);
    }, []);

    // ─── ANIMATED COUNTERS ──────────────────────────
    const [animatedParticipants, setAnimatedParticipants] = useState(0);
    const [animatedEntries, setAnimatedEntries] = useState(0);
    const totalParticipants = participants.length || 247;
    const totalEntries = participants.reduce((sum, p) => sum + p.entries, 0) || 1483;

    useEffect(() => {
        const dur = 2000;
        const steps = 60;
        const stepDur = dur / steps;
        let step = 0;
        const iv = setInterval(() => {
            step++;
            const progress = step / steps;
            const ease = 1 - Math.pow(1 - progress, 3);
            setAnimatedParticipants(Math.round(totalParticipants * ease));
            setAnimatedEntries(Math.round(totalEntries * ease));
            if (step >= steps) clearInterval(iv);
        }, stepDur);
        return () => clearInterval(iv);
    }, [totalParticipants, totalEntries]);

    // ─── 3D WHEEL ─────────────────────────────────────────────────────────────
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [wheelAngle, setWheelAngle] = useState(0);
    const [showWinnerPopup, setShowWinnerPopup] = useState(false);
    const [currentWinner, setCurrentWinner] = useState<{ name: string; prize: string } | null>(null);
    const [multiResults, setMultiResults] = useState<{ prize: string; winner: string }[]>([]);
    const spinAnimRef = useRef<number>(0);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Wheel segment names
    const wheelNames = participants.length > 0
        ? participants.map(p => p.name)
        : ['Ahmet Y.', 'Mehmet K.', 'Ayşe D.', 'Fatma B.', 'Ali R.', 'Zeynep T.', 'Can M.', 'Emre S.', 'Selin A.', 'Burak E.', 'Ela K.', 'Onur P.'];

    const segmentColors = [
        '#f0b90b', '#1a1a2e', '#e94560', '#1a1a2e', '#f0b90b', '#1a1a2e',
        '#16213e', '#1a1a2e', '#f0b90b', '#1a1a2e', '#e94560', '#1a1a2e',
    ];

    // Casino tick sound
    const playTick = useCallback(() => {
        try {
            if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800 + Math.random() * 400;
            osc.type = 'square';
            gain.gain.value = 0.05;
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.05);
        } catch (_) { /* silent */ }
    }, []);

    // Draw wheel on canvas
    const drawWheel = useCallback((angle: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = canvas.width;
        const center = size / 2;
        const radius = center - 20;
        const segments = wheelNames.length;
        const arcSize = (2 * Math.PI) / segments;

        ctx.clearRect(0, 0, size, size);

        // Outer glow
        const glowGrad = ctx.createRadialGradient(center, center, radius - 10, center, center, radius + 30);
        glowGrad.addColorStop(0, 'rgba(240, 185, 11, 0.3)');
        glowGrad.addColorStop(1, 'rgba(240, 185, 11, 0)');
        ctx.beginPath();
        ctx.arc(center, center, radius + 30, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Outer ring
        ctx.beginPath();
        ctx.arc(center, center, radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#f0b90b';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#f0b90b';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Segments
        for (let i = 0; i < segments; i++) {
            const startAngle = angle + i * arcSize;
            const endAngle = startAngle + arcSize;

            // Segment fill
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.closePath();

            const color = segmentColors[i % segmentColors.length];
            ctx.fillStyle = color;
            ctx.fill();

            // Segment border
            ctx.strokeStyle = 'rgba(240, 185, 11, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Text
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(startAngle + arcSize / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = color === '#f0b90b' ? '#000' : '#fff';
            ctx.font = `bold ${Math.max(10, Math.min(14, 180 / segments))}px Inter, sans-serif`;
            const name = wheelNames[i].length > 12 ? wheelNames[i].substring(0, 11) + '…' : wheelNames[i];
            ctx.fillText(name, radius - 15, 5);
            ctx.restore();
        }

        // Center hub
        const hubGrad = ctx.createRadialGradient(center, center, 0, center, center, 35);
        hubGrad.addColorStop(0, '#f0b90b');
        hubGrad.addColorStop(1, '#d4a017');
        ctx.beginPath();
        ctx.arc(center, center, 30, 0, Math.PI * 2);
        ctx.fillStyle = hubGrad;
        ctx.shadowColor = '#f0b90b';
        ctx.shadowBlur = 25;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Hub text
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ÇEKİLİŞ', center, center + 4);

        // Pointer (top)
        ctx.beginPath();
        ctx.moveTo(center - 15, 8);
        ctx.lineTo(center + 15, 8);
        ctx.lineTo(center, 35);
        ctx.closePath();
        ctx.fillStyle = '#f0b90b';
        ctx.shadowColor = '#f0b90b';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // LED dots around the edge
        for (let i = 0; i < 24; i++) {
            const ledAngle = (i / 24) * Math.PI * 2;
            const ledX = center + Math.cos(ledAngle) * (radius + 12);
            const ledY = center + Math.sin(ledAngle) * (radius + 12);
            ctx.beginPath();
            ctx.arc(ledX, ledY, 3, 0, Math.PI * 2);
            ctx.fillStyle = i % 2 === 0 ? '#f0b90b' : '#e94560';
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 8;
            ctx.fill();
        }
        ctx.shadowBlur = 0;
    }, [wheelNames]);

    useEffect(() => {
        drawWheel(wheelAngle);
    }, [wheelAngle, drawWheel]);

    // Spin the wheel
    const spinWheel = () => {
        if (isSpinning || wheelNames.length < 2) return;
        setIsSpinning(true);
        setShowWinnerPopup(false);
        setMultiResults([]);

        // Random winner selection
        const winnerIndex = Math.floor(Math.random() * wheelNames.length);
        const segments = wheelNames.length;
        const arcSize = (2 * Math.PI) / segments;

        // Calculate target angle: spin several full rotations + land on winner
        // Pointer is at top (3π/2 = 270°), so align to that
        const fullRotations = 5 + Math.floor(Math.random() * 3);
        const targetSegmentAngle = -(winnerIndex * arcSize + arcSize / 2) - Math.PI / 2;
        const targetAngle = fullRotations * 2 * Math.PI + targetSegmentAngle;

        const startAngle = wheelAngle;
        const totalRotation = targetAngle - startAngle;
        const duration = 6000;
        const startTime = performance.now();
        let lastTickAngle = startAngle;

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Cubic ease out
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentAngle = startAngle + totalRotation * ease;

            // Tick sound at segment boundaries
            const segmentsPassed = Math.floor(Math.abs(currentAngle - lastTickAngle) / arcSize);
            if (segmentsPassed > 0) {
                playTick();
                lastTickAngle = currentAngle;
            }

            setWheelAngle(currentAngle);

            if (progress < 1) {
                spinAnimRef.current = requestAnimationFrame(animate);
            } else {
                // Spin complete
                setIsSpinning(false);
                const winnerName = wheelNames[winnerIndex];
                const prize = prizes[0]?.prizeName || 'Ödül';

                setCurrentWinner({ name: winnerName, prize });
                setShowWinnerPopup(true);

                // Confetti
                confetti({ 
                    particleCount: 150, 
                    spread: 80, 
                    origin: { y: 0.6 }, 
                    colors: ['#f0b90b', '#e94560', '#fff'] 
                });
                setTimeout(() => confetti({ 
                    particleCount: 100, 
                    spread: 60, 
                    origin: { y: 0.5 } 
                }), 300);

                // Multi-prize mode
                if (prizes.length > 1) {
                    const results: { prize: string; winner: string }[] = [{ prize, winner: winnerName }];
                    const usedNames = new Set([winnerName]);
                    for (let i = 1; i < prizes.length; i++) {
                        const available = wheelNames.filter(n => !usedNames.has(n));
                        if (available.length === 0) break;
                        const next = available[Math.floor(Math.random() * available.length)];
                        usedNames.add(next);
                        results.push({ prize: prizes[i]?.prizeName || `Ödül ${i + 1}`, winner: next });
                    }
                    setMultiResults(results);
                }
            }
        };

        spinAnimRef.current = requestAnimationFrame(animate);
    };

    // Leaderboard (top inviters)
    const leaderboard = [...participants]
        .sort((a, b) => b.referralCount - a.referralCount)
        .slice(0, 10);

    // Demo leaderboard if no participants
    const showLeaderboard = leaderboard.length > 0 ? leaderboard : [
        { name: 'Ahmet Y.', referralCount: 12, entries: 18 },
        { name: 'Zeynep T.', referralCount: 9, entries: 15 },
        { name: 'Emre S.', referralCount: 7, entries: 13 },
        { name: 'Can M.', referralCount: 5, entries: 11 },
        { name: 'Selin A.', referralCount: 4, entries: 8 },
    ] as any[];

    if (!activeGiveaway) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-theme-main">
            <div className="text-7xl">🎁</div>
            <h2 className="text-theme-primary font-black text-3xl uppercase tracking-tight">Çekiliş Bulunamadı</h2>
            <p className="text-theme-muted font-bold text-sm">Şu anda aktif bir çekiliş bulunmuyor.</p>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', position: 'relative' }}>
            {/* ═══════════════ 1. HERO ═══════════════ */}
            <section style={{
                padding: '80px 24px 60px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background glow */}
                <div style={{
                    position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
                    width: '600px', height: '600px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(240,185,11,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '8px 20px', borderRadius: '9999px',
                        background: 'rgba(240,185,11,0.1)', border: '1px solid rgba(240,185,11,0.3)',
                        marginBottom: '24px',
                    }}>
                        <Gift style={{ width: '16px', height: '16px', color: '#f0b90b' }} />
                        <span style={{ color: '#f0b90b', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                            CANLI ÇEKİLİŞ
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.1,
                        letterSpacing: '-2px', marginBottom: '16px', textTransform: 'uppercase',
                    }}>
                        <span style={{ color: 'var(--text-primary)' }}>Haftalık </span>
                        <span style={{ color: '#f0b90b', textShadow: '0 0 40px rgba(240,185,11,0.4)' }}>Büyük Çekiliş</span>
                    </h1>

                    <p style={{
                        color: 'var(--text-secondary)', fontSize: '16px', fontWeight: 500, maxWidth: '550px',
                        margin: '0 auto 40px', lineHeight: 1.7,
                    }}>
                        {activeGiveaway.description}
                    </p>

                    {/* Countdown */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        {[
                            { val: countdown.days, label: 'GÜN' },
                            { val: countdown.hours, label: 'SAAT' },
                            { val: countdown.minutes, label: 'DAKİKA' },
                            { val: countdown.seconds, label: 'SANİYE' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                minWidth: '80px', padding: '16px 12px',
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '8px', textAlign: 'center',
                            }}>
                                <div style={{
                                    fontSize: '32px', fontWeight: 900, color: '#f0b90b',
                                    fontVariantNumeric: 'tabular-nums',
                                    textShadow: '0 0 20px rgba(240,185,11,0.3)',
                                }}>
                                    {String(item.val).padStart(2, '0')}
                                </div>
                                <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.2em', marginTop: '4px' }}>
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

                {/* ═══════════════ 2. PRIZES ═══════════════ */}
                <section style={{ marginBottom: '60px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-1px' }}>
                            🏆 <span style={{ color: '#f0b90b' }}>Ödüller</span>
                        </h2>
                        <div style={{ height: '3px', width: '60px', background: '#f0b90b', margin: '12px auto 0', borderRadius: '999px' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        {prizes.map((prize, i) => (
                            <div key={prize.id} style={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '8px', padding: '32px 24px', textAlign: 'center',
                                position: 'relative', overflow: 'hidden',
                                transition: 'all 0.4s ease',
                                boxShadow: 'var(--shadow-card)',
                            }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(240,185,11,0.4)';
                                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(240,185,11,0.1)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
                                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                                }}
                            >
                                {i === 0 && (
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                                        background: 'linear-gradient(90deg, transparent, #f0b90b, transparent)',
                                    }} />
                                )}
                                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{prize.icon}</div>
                                <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
                                    {prize.prizeName}
                                </div>
                                <div style={{
                                    display: 'inline-block', padding: '4px 16px',
                                    background: 'rgba(240,185,11,0.1)', border: '1px solid rgba(240,185,11,0.3)',
                                    borderRadius: '999px', fontSize: '13px', fontWeight: 900, color: '#f0b90b',
                                }}>
                                    x{prize.quantity}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══════════════ 3. PARTICIPATION RULES ═══════════════ */}
                <section style={{ marginBottom: '60px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-1px' }}>
                            📋 <span style={{ color: '#f0b90b' }}>Katılım Şartları</span>
                        </h2>
                        <div style={{ height: '3px', width: '60px', background: '#f0b90b', margin: '12px auto 0', borderRadius: '999px' }} />
                    </div>

                    <div style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                        borderRadius: '8px', padding: '32px', maxWidth: '600px', margin: '0 auto',
                        boxShadow: 'var(--shadow-card)',
                    }}>
                        {rules.map((rule, i) => (
                            <div key={rule.id} style={{
                                display: 'flex', alignItems: 'center', gap: '16px',
                                padding: '16px 0',
                                borderBottom: i < rules.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '8px',
                                    background: 'rgba(240,185,11,0.1)', border: '1px solid rgba(240,185,11,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '18px', flexShrink: 0,
                                }}>
                                    {rule.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{rule.label}</div>
                                </div>
                                <div style={{
                                    padding: '4px 12px', borderRadius: '999px',
                                    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                                    fontSize: '12px', fontWeight: 900, color: '#22c55e',
                                }}>
                                    +{rule.entryValue} giriş
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══════════════ 4 & 5. REFERRAL & LEADERBOARD ═══════════════ */}
                <section style={{ marginBottom: '60px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {/* Referral Link */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '8px', padding: '32px',
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
                                🔗 Referans Linkin
                            </h3>
                            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                                Arkadaşlarını davet et, her katılım için +3 giriş kazan!
                            </p>
                            <div style={{
                                display: 'flex', gap: '8px', alignItems: 'center',
                            }}>
                                <div style={{
                                    flex: 1, padding: '12px 16px',
                                    background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px', fontSize: '12px', color: '#999',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    fontFamily: 'monospace',
                                }}>
                                    {refLink}
                                </div>
                                <button
                                    onClick={copyRef}
                                    style={{
                                        padding: '12px 20px', borderRadius: '8px', border: 'none',
                                        background: copied ? '#22c55e' : '#f0b90b',
                                        color: '#000', fontWeight: 900, fontSize: '12px',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                        transition: 'all 0.3s ease', whiteSpace: 'nowrap',
                                    }}
                                >
                                    {copied ? <><Check style={{ width: 14, height: 14 }} /> Kopyalandı</> : <><Copy style={{ width: 14, height: 14 }} /> Kopyala</>}
                                </button>
                            </div>
                        </div>

                        {/* Leaderboard */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '8px', padding: '32px',
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>
                                🏅 En Çok Davet Edenler
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {showLeaderboard.map((p: any, i: number) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '10px 12px', borderRadius: '8px',
                                        background: i === 0 ? 'rgba(240,185,11,0.08)' : 'transparent',
                                        border: i === 0 ? '1px solid rgba(240,185,11,0.2)' : '1px solid transparent',
                                    }}>
                                        <span style={{
                                            width: '24px', height: '24px', borderRadius: '8px',
                                            background: i === 0 ? '#f0b90b' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7f32' : 'rgba(255,255,255,0.05)',
                                            color: i < 3 ? '#000' : '#666',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '11px', fontWeight: 900, flexShrink: 0,
                                        }}>
                                            {i + 1}
                                        </span>
                                        <span style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: '#fff' }}>{p.name}</span>
                                        <span style={{ fontSize: '12px', fontWeight: 900, color: '#f0b90b' }}>{p.referralCount} davet</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════ 6. LIVE STATISTICS ═══════════════ */}
                <section style={{ marginBottom: '60px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                        {[
                            { icon: <Users style={{ width: 20, height: 20, color: '#f0b90b' }} />, value: animatedParticipants, label: 'Katılımcı', color: '#f0b90b' },
                            { icon: <Ticket style={{ width: 20, height: 20, color: '#22c55e' }} />, value: animatedEntries, label: 'Toplam Giriş', color: '#22c55e' },
                            { icon: <Gift style={{ width: 20, height: 20, color: '#e94560' }} />, value: prizes.reduce((s, p) => s + p.quantity, 0), label: 'Ödül Kaldı', color: '#e94560' },
                            { icon: <Clock style={{ width: 20, height: 20, color: '#8b5cf6' }} />, value: `${countdown.days}g ${countdown.hours}s`, label: 'Kalan Süre', color: '#8b5cf6' },
                        ].map((stat, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '8px', padding: '24px', textAlign: 'center',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>{stat.icon}</div>
                                <div style={{ fontSize: '28px', fontWeight: 900, color: stat.color, fontVariantNumeric: 'tabular-nums' }}>
                                    {typeof stat.value === 'number' ? stat.value.toLocaleString('tr') : stat.value}
                                </div>
                                <div style={{ fontSize: '10px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '4px' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══════════════ 7. 3D CASINO WHEEL ═══════════════ */}
                <section style={{ marginBottom: '60px', textAlign: 'center' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-1px' }}>
                            🎰 <span style={{ color: '#f0b90b' }}>ÇEKİLİŞ ÇARKI</span>
                        </h2>
                        <div style={{ height: '3px', width: '60px', background: '#f0b90b', margin: '12px auto 0', borderRadius: '999px' }} />
                    </div>

                    <div style={{
                        display: 'inline-block', padding: '40px',
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '8px', position: 'relative',
                    }}>
                        {/* 3D perspective wrapper */}
                        <div style={{
                            perspective: '800px', perspectiveOrigin: '50% 50%',
                        }}>
                            <div style={{
                                transform: 'rotateX(5deg)',
                                transformStyle: 'preserve-3d',
                            }}>
                                <canvas
                                    ref={canvasRef}
                                    width={400}
                                    height={400}
                                    style={{
                                        width: '100%', maxWidth: '400px', height: 'auto',
                                        filter: isSpinning ? 'brightness(1.1)' : 'brightness(1)',
                                        transition: 'filter 0.3s ease',
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={spinWheel}
                            disabled={isSpinning}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                marginTop: '24px', padding: '16px 48px',
                                background: isSpinning ? '#333' : 'linear-gradient(135deg, #f0b90b, #d4a017)',
                                color: isSpinning ? '#999' : '#000',
                                fontWeight: 900, fontSize: '14px', textTransform: 'uppercase',
                                letterSpacing: '0.15em', border: 'none', borderRadius: '9999px',
                                cursor: isSpinning ? 'not-allowed' : 'pointer',
                                boxShadow: isSpinning ? 'none' : '0 0 30px rgba(240,185,11,0.4)',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {isSpinning ? (
                                <><div style={{ width: 16, height: 16, border: '2px solid #666', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> ÇEVRİLİYOR...</>
                            ) : (
                                <><Zap style={{ width: 18, height: 18 }} /> ÇEKİLİŞİ BAŞLAT</>
                            )}
                        </button>
                    </div>

                    {/* ═══ 8. MULTI-PRIZE RESULTS ═══ */}
                    {multiResults.length > 1 && (
                        <div style={{
                            marginTop: '32px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(240,185,11,0.2)',
                            borderRadius: '8px', padding: '24px', textAlign: 'left',
                        }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#f0b90b', marginBottom: '16px', textAlign: 'center' }}>
                                🏆 Çekiliş Sonuçları
                            </h3>
                            {multiResults.map((r, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px', borderRadius: '8px',
                                    background: i === 0 ? 'rgba(240,185,11,0.08)' : 'transparent',
                                    borderBottom: i < multiResults.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                }}>
                                    <span style={{
                                        width: '28px', height: '28px', borderRadius: '8px',
                                        background: '#f0b90b', color: '#000',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '12px', fontWeight: 900, flexShrink: 0,
                                    }}>
                                        {i + 1}
                                    </span>
                                    <span style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: '#fff' }}>{r.prize}</span>
                                    <span style={{ fontSize: '13px', fontWeight: 900, color: '#f0b90b' }}>@{r.winner}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ═══════════════ 9. WINNERS ═══════════════ */}
                {winners.length > 0 && (
                    <section style={{ marginBottom: '60px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-1px' }}>
                                🏆 <span style={{ color: '#f0b90b' }}>Kazananlar</span>
                            </h2>
                            <div style={{ height: '3px', width: '60px', background: '#f0b90b', margin: '12px auto 0', borderRadius: '999px' }} />
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '8px', padding: '24px', maxWidth: '600px', margin: '0 auto',
                        }}>
                            {winners.map((w, i) => (
                                <div key={w.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                    padding: '14px 0',
                                    borderBottom: i < winners.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                }}>
                                    <Trophy style={{ width: 18, height: 18, color: '#f0b90b', flexShrink: 0 }} />
                                    <span style={{ flex: 1, fontSize: '14px', fontWeight: 700, color: '#fff' }}>{w.prizeName}</span>
                                    <span style={{ fontSize: '14px', fontWeight: 900, color: '#f0b90b' }}>@{w.participantName}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ═══════════════ 10. SOCIAL PROOF ═══════════════ */}
                <section style={{ marginBottom: '80px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-1px' }}>
                            📡 <span style={{ color: '#f0b90b' }}>Canlı Aktivite</span>
                        </h2>
                        <div style={{ height: '3px', width: '60px', background: '#f0b90b', margin: '12px auto 0', borderRadius: '999px' }} />
                    </div>

                    <div style={{
                        maxWidth: '500px', margin: '0 auto',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px', padding: '24px', maxHeight: '300px', overflow: 'hidden',
                    }}>
                        {feedItems.map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 0',
                                borderBottom: i < feedItems.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                opacity: 1 - i * 0.1,
                                animation: i === 0 ? 'fadeInUp 0.5s ease-out' : 'none',
                            }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#ccc' }}>{item.text}</span>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: '#555', flexShrink: 0, marginLeft: '12px' }}>{item.time}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* ═══════════════ WINNER POPUP ═══════════════ */}
            {showWinnerPopup && currentWinner && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
                    animation: 'fadeIn 0.3s ease-out',
                }}
                    onClick={() => setShowWinnerPopup(false)}
                >
                    <div style={{
                        background: 'var(--bg-card)',
                        border: '2px solid rgba(240,185,11,0.4)',
                        borderRadius: '8px', padding: '48px 40px', textAlign: 'center',
                        maxWidth: '420px', width: '90%', position: 'relative',
                        boxShadow: 'var(--shadow-modal)',
                        animation: 'fadeInUp 0.5s ease-out',
                    }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Top glow line */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                            background: 'linear-gradient(90deg, transparent, #f0b90b, transparent)',
                        }} />

                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#f0b90b', marginBottom: '8px', textTransform: 'uppercase' }}>
                            TEBRİKLER!
                        </h2>
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px', fontWeight: 600 }}>
                            Çekiliş tamamlandı, kazanan belirlendi!
                        </p>

                        <div style={{
                            padding: '20px', background: 'rgba(240,185,11,0.05)',
                            border: '1px solid rgba(240,185,11,0.2)', borderRadius: '8px',
                            marginBottom: '20px',
                        }}>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}>
                                KAZANAN
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)' }}>
                                {currentWinner.name}
                            </div>
                        </div>

                        <div style={{
                            padding: '12px 20px', background: 'rgba(240,185,11,0.1)',
                            borderRadius: '8px', display: 'inline-block',
                        }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#999' }}>Ödül: </span>
                            <span style={{ fontSize: '14px', fontWeight: 900, color: '#f0b90b' }}>{currentWinner.prize}</span>
                        </div>

                        <button
                            onClick={() => setShowWinnerPopup(false)}
                            style={{
                                display: 'block', width: '100%', marginTop: '24px',
                                padding: '14px', background: '#f0b90b', color: '#000',
                                fontWeight: 900, fontSize: '13px', border: 'none',
                                borderRadius: '8px', cursor: 'pointer',
                                textTransform: 'uppercase', letterSpacing: '0.1em',
                            }}
                        >
                            TAMAM
                        </button>
                    </div>
                </div>
            )}

            {/* Spin animation keyframe injected inline */}
            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default GiveawayView;
