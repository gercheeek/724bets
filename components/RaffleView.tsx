import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LoyaltyConfig, UserLoyalty, SiteUser, RaffleConfig } from '../types';
import { Ticket, Trophy, Clock, Coins, Info, Users, ChevronDown, ChevronUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

function loadUserLoyalty(userId: string): UserLoyalty {
    const stored = localStorage.getItem(`loyalty_${userId}`);
    if (stored) return JSON.parse(stored);
    return { userId, coins: 0, pendingTickets: 0, tickets: 0, totalEarned: 0, transactions: [], lastVolumeResetDate: new Date().toDateString(), dailyVolumeAccumulated: 0 };
}

function getAllMembers(): SiteUser[] {
    try { return JSON.parse(localStorage.getItem('site_members') || '[]'); } catch { return []; }
}

function getTicketPool(): { slot: number, userId: string, username: string }[] {
    try { return JSON.parse(localStorage.getItem('site_ticket_pool') || '[]'); } catch { return []; }
}

// --------------------------------------------------------------------------------
// OPTIMIZATION 1: Isolate CountdownTimer to prevent full page re-renders every 1s
// --------------------------------------------------------------------------------
const CountdownDisplay = React.memo(({ targetDate }: { targetDate: Date }) => {
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number }>({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();
            
            if (difference <= 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                d: Math.floor(difference / (1000 * 60 * 60 * 24)),
                h: Math.floor((difference / (1000 * 60 * 60)) % 24),
                m: Math.floor((difference / 1000 / 60) % 60),
                s: Math.floor((difference / 1000) % 60)
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {[
                { label: 'GÜN', val: timeLeft.d },
                { label: 'SAAT', val: timeLeft.h },
                { label: 'DAK', val: timeLeft.m },
                { label: 'SAN', val: timeLeft.s }
            ].map((t, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        width: '100%', height: 36,
                        background: '#141B25',
                        border: '1px solid rgba(245,166,35,0.2)',
                        borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 800, color: '#fff',
                        marginBottom: 2,
                        position: 'relative'
                    }}>
                        {String(t.val).padStart(2, '0')}
                    </div>
                    <span style={{ fontSize: 6, color: '#666', fontWeight: 800, letterSpacing: '0.1em' }}>{t.label}</span>
                </div>
            ))}
        </div>
    );
});

// --------------------------------------------------------------------------------
// OPTIMIZATION 2: Memoize individual Ticket Slots to stop re-rendering 200 elements
// --------------------------------------------------------------------------------
const TicketSlot = React.memo(({ index, isSold, isMe, username, onSelect }: { index: number, isSold: boolean, isMe: boolean, username: string, onSelect: (idx: number) => void }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div
            title={isSold ? (isMe ? 'Sizin' : username) : `Bilet ${index + 1} (Boş)`}
            onClick={() => !isSold && onSelect(index)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: isSold 
                  ? (isMe ? 'linear-gradient(135deg,rgba(100,180,255,0.1),rgba(100,180,255,0.05))' : 'linear-gradient(135deg,#1a1000,#0d0800)') 
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isSold ? (isMe ? 'rgba(100,180,255,0.5)' : 'rgba(245,166,35,0.4)') : isHovered ? 'rgba(245,166,35,0.3)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 8,
                padding: '8px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                cursor: isSold ? 'default' : 'pointer',
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.2s ease',
                transform: isHovered && !isSold ? 'translateY(-2px) scale(1.02)' : 'none',
                boxShadow: isSold ? (isMe ? '0 0 10px rgba(100,180,255,0.15)' : '0 0 10px rgba(245,166,35,0.15)') : isHovered ? '0 0 10px rgba(245,166,35,0.1)' : 'none',
                minHeight: 56,
                zIndex: isHovered ? 10 : 1,
            }}
        >
            {isHovered && !isSold && (
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 30%, rgba(245,166,35,0.04) 50%, transparent 70%)', animation: 'shimmerLine 1.5s ease-in-out infinite' }} />
            )}
            
            {isSold ? (
                <>
                    <div style={{ fontSize: 14 }}>🎫</div>
                    <div style={{ color: isMe ? '#64b4ff' : '#F5A623', fontWeight: 900, fontSize: 8, textAlign: 'center', letterSpacing: '0.05em' }}>
                        {isMe ? 'SİZİN' : username.substring(0,6)}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 7, fontFamily: 'monospace' }}>#{String(index + 1).padStart(3, '0')}</div>
                </>
            ) : (
                <>
                    <div style={{ fontSize: 14, filter: 'grayscale(0.5)', opacity: 0.6 }}>🎫</div>
                    <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 8, fontWeight: 700, textAlign: 'center' }}>
                        AL
                    </div>
                </>
            )}
        </div>
    );
});


interface RaffleViewProps {
    config: RaffleConfig;
    loyaltyConfig: LoyaltyConfig;
    userId: string;
    onNavigate: (view: string) => void;
}

const RaffleView: React.FC<RaffleViewProps> = ({ config, loyaltyConfig, userId, onNavigate }) => {
    const [loyalty, setLoyalty] = useState<UserLoyalty>(() => loadUserLoyalty(userId));
    const [buyMsg, setBuyMsg] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [ticketPool, setTicketPool] = useState<{ slot: number, userId: string, username: string }[]>(getTicketPool);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Collapsed sections state
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
        stats: false,
        form: false,
        legend: false,
        pool: false,
        rules: true,
        howItWorks: true,
        faq: true
    });

    // Form states
    const [depositUsername, setDepositUsername] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [depositDate, setDepositDate] = useState('');
    const [depositTicket, setDepositTicket] = useState('');

    const targetDate = useMemo(() => new Date(config.drawDate), [config.drawDate]);

    const renderRuleIcon = (icon: string) => {
        switch (icon) {
            case 'Shield': return <Shield size={12} />;
            case 'AlertTriangle': return <AlertTriangle size={12} />;
            case 'CheckCircle': return <CheckCircle size={12} />;
            case 'Users': return <Users size={12} />;
            case 'Trophy': return <Trophy size={12} />;
            case 'Info': return <Info size={12} />;
            default: return <Info size={12} />;
        }
    };

    useEffect(() => { setLoyalty(loadUserLoyalty(userId)); }, [userId]);

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    const toggleSection = (section: string) => {
        setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleDepositRequest = () => {
        if (!depositUsername.trim() || !depositAmount.trim() || !depositDate.trim() || !depositTicket.trim()) {
            showSuccess('❌ Lütfen tüm alanları doldurun.');
            return;
        }

        try {
            const messages = JSON.parse(localStorage.getItem('site_messages') || '[]');
            const newMessage = {
                id: Date.now().toString(),
                userId: userId,
                username: depositUsername,
                content: `Bilet Etkinliği Talebi:\nKullanıcı Adı: ${depositUsername}\nYatırım Tutarı: ${depositAmount} TL\nTarih: ${depositDate}\nİstenilen Bilet No: ${depositTicket}\n\nKullanıcı bilet etkinliği kapsamında bilet talebi oluşturdu.`,
                isRead: false,
                createdAt: Date.now()
            };

            localStorage.setItem('site_messages', JSON.stringify([...messages, newMessage]));

            showSuccess('✅ Talebiniz başarıyla alındı! İnceleme sonrası eklenecektir.');
            setDepositUsername('');
            setDepositAmount('');
            setDepositDate('');
            setDepositTicket('');
        } catch {
            showSuccess('❌ Bir hata oluştu.');
        }
    };

    const TICKET_PRICE = 500; // 500 coins = 1 ticket

    const handleBuyTicket = () => {
        if (loyalty.coins < TICKET_PRICE) {
            setBuyMsg('❌ Yetersiz Coin bakiyesi!');
            setTimeout(() => setBuyMsg(''), 2500);
            return;
        }

        const updated: UserLoyalty = {
            ...loyalty,
            coins: loyalty.coins - TICKET_PRICE,
            pendingTickets: (loyalty.pendingTickets || 0) + 1,
            transactions: [
                { id: String(Date.now()), userId, type: 'spend', amount: -TICKET_PRICE, tickets: 1, reason: 'Coin ile Bilet Satın Alımı', timestamp: Date.now() },
                ...loyalty.transactions
            ].slice(0, 50)
        };

        localStorage.setItem(`loyalty_${userId}`, JSON.stringify(updated));
        setLoyalty(updated);
        setBuyMsg('✅ Bilet başarıyla satın alındı! Aşağıdan yerinizi seçin.');
        setTimeout(() => setBuyMsg(''), 2500);
    };

    const TOTAL_POOL_SIZE = 200;

    const handleSelectSlot = useCallback((slotIndex: number) => {
        let success = false;
        
        setLoyalty(prevLoyalty => {
            if (prevLoyalty.pendingTickets <= 0) return prevLoyalty;
            let ticketAlreadyTaken = false;
            
            setTicketPool(prevPool => {
                if (prevPool.find(t => t.slot === slotIndex)) {
                     ticketAlreadyTaken = true;
                     return prevPool;
                }
                const newPool = [...prevPool, { slot: slotIndex, userId: userId, username: getAllMembers().find(m => m.id === userId)?.username || 'Siz' }];
                localStorage.setItem('site_ticket_pool', JSON.stringify(newPool));
                success = true;
                return newPool;
            });
            
            if (ticketAlreadyTaken) return prevLoyalty;
            
            const updated = {
                ...prevLoyalty,
                pendingTickets: prevLoyalty.pendingTickets - 1,
                tickets: prevLoyalty.tickets + 1
            };
            localStorage.setItem(`loyalty_${userId}`, JSON.stringify(updated));
            return updated;
        });
    }, [userId]);

    const totalSold = ticketPool.length;

    return (
        <div style={{ minHeight: '100vh', background: '#141B25', padding: '0 0 60px', fontFamily: "'Inter', sans-serif", color: '#fff' }}>
            {successMsg && (
                <div style={{
                    position: 'fixed', top: 80, left: '50%', transform: 'translate3d(-50%, 0, 0)', zIndex: 50,
                    padding: '8px 16px', borderRadius: 10, background: 'rgba(13,13,13,0.95)',
                    backdropFilter: 'blur(20px)', fontSize: 12, color: '#F5A623',
                    border: '1px solid rgba(245,166,35,0.4)', boxShadow: '0 6px 20px rgba(245,166,35,0.15)',
                    animation: 'slideDown 0.3s ease', willChange: 'transform, opacity'
                }}>
                    {successMsg}
                </div>
            )}
            
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'stretch' }}>
                    {/* ═══ LEFT SIDEBAR ═══ */}
                    <div style={{ width: '33.333%', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
                        
                        {/* 1. Countdown & VIP Cards Component */}
                        <div style={{
                            background: '#1E2530', border: '1px solid rgba(245,166,35,0.15)',
                            borderRadius: 12, padding: 12, overflow: 'hidden', position: 'relative',
                            flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 10
                        }}>
                            <div 
                                onClick={() => toggleSection('stats')}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', zIndex: 11 }}
                            >
                                <span style={{ color: '#fff', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    HESAP DURUMU & SÜRE
                                </span>
                                {collapsed.stats ? <ChevronDown size={14} color="#F5A623" /> : <ChevronUp size={14} color="#F5A623" />}
                            </div>

                            {!collapsed.stats && (
                                <>
                                    <div style={{ position: 'absolute', top: 0, right: 0, padding: 8, opacity: 0.03, pointerEvents: 'none' }}>
                                        <Clock size={80} strokeWidth={1} style={{ transform: 'translate(20%, -20%)' }} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, position: 'relative', zIndex: 10 }}>
                                        {/* Biletleriniz Small */}
                                        <div style={{
                                            borderRadius: 8,
                                            background: 'linear-gradient(135deg, rgba(245,166,35,0.05) 0%, rgba(13,13,13,0.95) 50%, rgba(245,166,35,0.03) 100%)',
                                            border: '1px solid rgba(245,166,35,0.2)',
                                            padding: '8px 10px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                                                <Ticket size={10} style={{ color: '#F5A623' }} />
                                                <span style={{ color: '#888', fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    BİLETLERİNİZ
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                                                <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                                                    {loyalty.tickets}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Mevcut Coin Small */}
                                        <div style={{
                                            borderRadius: 8,
                                            background: 'linear-gradient(135deg, rgba(245,166,35,0.05) 0%, rgba(13,13,13,0.95) 50%, rgba(245,166,35,0.03) 100%)',
                                            border: '1px solid rgba(245,166,35,0.2)',
                                            padding: '8px 10px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                                                <Coins size={10} style={{ color: '#F5A623' }} />
                                                <span style={{ color: '#888', fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    COIN
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                                                <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                                                    {loyalty.coins.toLocaleString('tr')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buy Button inside Sidebar */}
                                    <div style={{ position: 'relative', zIndex: 10 }}>
                                        {buyMsg && (
                                            <div style={{ fontSize: 9, fontWeight: 600, color: buyMsg.includes('✅') ? '#F5A623' : '#ef4444', textAlign: 'center', marginBottom: 4 }}>
                                                {buyMsg}
                                            </div>
                                        )}
                                        <button
                                            onClick={handleBuyTicket}
                                            disabled={loyalty.coins < TICKET_PRICE}
                                            style={{
                                                width: '100%', padding: '8px 0', borderRadius: 8, fontSize: 9, fontWeight: 800,
                                                border: 'none', cursor: loyalty.coins >= TICKET_PRICE ? 'pointer' : 'not-allowed',
                                                transition: 'all 0.2s ease', letterSpacing: '0.05em',
                                                ...(loyalty.coins >= TICKET_PRICE
                                                    ? {
                                                        background: 'linear-gradient(180deg, #F5A623 0%, #996515 100%)',
                                                        color: '#141B25',
                                                        boxShadow: '0 2px 10px rgba(245,166,35,0.2)'
                                                    }
                                                    : {
                                                        background: '#050C18', color: '#555',
                                                        border: '1px solid #0A1428'
                                                    })
                                            }}
                                        >
                                            BİLET SATIN AL (500)
                                        </button>
                                    </div>

                                    <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.15), transparent)', margin: '2px 0', position: 'relative', zIndex: 10 }} />

                                    <div style={{ position: 'relative', zIndex: 10 }}>
                                        <div style={{
                                            color: '#F5A623', fontSize: 8, fontWeight: 800,
                                            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6,
                                            display: 'flex', alignItems: 'center', gap: 4
                                        }}>
                                            <Clock size={10} style={{ color: '#F5A623' }} />
                                            SONRAKİ ÇEKİLİŞ
                                        </div>
                                        <div style={{
                                            fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 8,
                                            padding: '4px 8px', borderRadius: 6,
                                            border: '1px solid rgba(245,166,35,0.2)',
                                            background: 'rgba(245,166,35,0.03)',
                                            display: 'inline-block'
                                        }}>
                                            {new Date(config.drawDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        
                                        <CountdownDisplay targetDate={targetDate} />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 2. Bilet Talep Formu */}
                        <div style={{
                            background: '#1E2530', border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: 12, padding: 12, flex: '1 1 auto',
                            display: 'flex', flexDirection: 'column', gap: 10
                        }}>
                            <div 
                                onClick={() => toggleSection('form')}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: collapsed.form ? 'none' : '1px solid #222', paddingBottom: collapsed.form ? 0 : 8 }}
                            >
                                <span style={{ color: '#fff', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    TALEP OLUŞTUR
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{
                                        color: '#F5A623', fontSize: 7, fontWeight: 700,
                                        border: '1px solid rgba(245,166,35,0.2)', padding: '2px 6px',
                                        borderRadius: 4, letterSpacing: '0.05em'
                                    }}>
                                        500 TL = 1 B
                                    </span>
                                    {collapsed.form ? <ChevronDown size={14} color="#F5A623" /> : <ChevronUp size={14} color="#F5A623" />}
                                </div>
                            </div>
                            
                            {!collapsed.form && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                                    <input type="text" placeholder="Kullanıcı Adı" value={depositUsername}
                                        onChange={e => setDepositUsername(e.target.value)}
                                        style={{
                                            width: '100%', padding: '8px 10px', background: '#141B25',
                                            border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, color: '#fff',
                                            fontSize: 10, outline: 'none'
                                        }}
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                        <input type="number" placeholder="Tutar (TL)" value={depositAmount}
                                            onChange={e => setDepositAmount(e.target.value)}
                                            style={{
                                                width: '100%', padding: '8px 10px', background: '#141B25',
                                                border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, color: '#fff',
                                                fontSize: 10, outline: 'none'
                                            }}
                                        />
                                        <input type="number" placeholder="Bilet No" value={depositTicket}
                                            onChange={e => setDepositTicket(e.target.value)}
                                            style={{
                                                width: '100%', padding: '8px 10px', background: '#141B25',
                                                border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, color: '#fff',
                                                fontSize: 10, outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <input type="datetime-local" value={depositDate}
                                        onChange={e => setDepositDate(e.target.value)}
                                        style={{
                                            width: '100%', padding: '8px 10px', background: '#141B25',
                                            border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, color: '#fff',
                                            fontSize: 10, outline: 'none', colorScheme: 'dark'
                                        }}
                                    />
                                    <button onClick={handleDepositRequest}
                                        style={{
                                            width: '100%', marginTop: 4, padding: '10px 0', borderRadius: 8,
                                            fontWeight: 900, fontSize: 10, letterSpacing: '0.05em',
                                            color: '#141B25', border: 'none', cursor: 'pointer',
                                            background: 'linear-gradient(180deg, #F5A623 0%, #B8860B 50%, #996515 100%)',
                                            boxShadow: '0 2px 10px rgba(245,166,35,0.2)',
                                            transition: 'all 0.2s', textTransform: 'uppercase'
                                        }}
                                    >
                                        TALEP GÖNDER
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 3. Legend */}
                        <div style={{
                            background: '#1E2530', border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: 12, padding: 10,
                            flex: '0 0 auto'
                        }}>
                            <div 
                                onClick={() => toggleSection('legend')}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: collapsed.legend ? 'none' : '1px solid #222', paddingBottom: collapsed.legend ? 0 : 6, marginBottom: collapsed.legend ? 0 : 6 }}
                            >
                                <span style={{ color: '#fff', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    AÇIKLAMA (RENKLER)
                                </span>
                                {collapsed.legend ? <ChevronDown size={14} color="#F5A623" /> : <ChevronUp size={14} color="#F5A623" />}
                            </div>

                            {!collapsed.legend && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 10, height: 10, background: '#F5A623', borderRadius: 2, boxShadow: '0 0 4px rgba(245,166,35,0.3)'
                                        }} />
                                        <span style={{ color: '#888', fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            DOLU BİLET
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 10, height: 10, background: 'rgba(59,130,246,0.3)', border: '1px solid #3b82f6', borderRadius: 2
                                        }} />
                                        <span style={{ color: '#888', fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            SİZİN BİLETLERİNİZ
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 10, height: 10, background: '#050C18', border: '1px solid #333', borderRadius: 2
                                        }} />
                                        <span style={{ color: '#888', fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            BOŞ SLOT
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ═══ RIGHT: Bilet Havuzu WITH VIRTUALIZATION-LIKE MEMO ═══ */}
                    <div style={{
                        width: '66.667%', minWidth: 0,
                        background: '#1E2530', border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 12, overflow: 'hidden',
                        display: 'flex', flexDirection: 'column'
                    }}>
                        <div 
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: 12, borderBottom: '1px solid #222', background: '#1E2530'
                            }}
                        >
                            <h3 style={{ color: '#fff', fontSize: 11, fontWeight: 850, letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>
                                BİLET HAVUZU (200 SLOT)
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                    color: '#999', fontSize: 9, fontWeight: 700,
                                    border: '1px solid rgba(255,255,255,0.05)', background: '#141B25', padding: '2px 8px',
                                    borderRadius: 6
                                }}>
                                    {totalSold} / {TOTAL_POOL_SIZE}
                                </div>
                            </div>
                        </div>
                        
                        <div style={{
                            padding: 10, flex: 1,
                            background: 'rgba(17,17,17,0.3)'
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))',
                                gap: 6, width: '100%',
                                maxWidth: '100%'
                            }}>
                                {useMemo(() => {
                                    return Array.from({ length: TOTAL_POOL_SIZE }, (_, index) => {
                                        const found = ticketPool.find(t => t.slot === index);
                                        return (
                                            <TicketSlot 
                                                key={index} 
                                                index={index} 
                                                isSold={!!found} 
                                                isMe={found?.userId === userId} 
                                                username={found?.username || ''} 
                                                onSelect={handleSelectSlot} 
                                            />
                                        );
                                    });
                                }, [ticketPool, userId, handleSelectSlot])}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ POOL RULES ═══ */}
                <div style={{
                    background: '#1E2530', border: '1px solid rgba(245,166,35,0.15)',
                    borderRadius: 12, padding: 12, marginBottom: 12
                }}>
                    <div 
                        onClick={() => toggleSection('rules')}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', borderBottom: collapsed.rules ? 'none' : '1px solid #222', paddingBottom: collapsed.rules ? 0 : 8, marginBottom: collapsed.rules ? 0 : 8 }}
                    >
                        <Shield size={12} style={{ color: '#F5A623' }} />
                        <h3 style={{ color: '#fff', fontSize: 10, fontWeight: 900, margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            BİLET HAVUZU KURALLARI
                        </h3>
                        <div style={{ flex: 1 }} />
                        {collapsed.rules ? <ChevronDown size={14} color="#F5A623" /> : <ChevronUp size={14} color="#F5A623" />}
                    </div>

                    {!collapsed.rules && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
                            {config.rules.map((rule, idx) => (
                                <div key={idx} style={{
                                    display: 'flex', alignItems: 'flex-start', gap: 8,
                                    padding: '10px 12px', background: 'rgba(13,13,13,0.6)',
                                    borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{
                                        flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(245,166,35,0.1)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.15)'
                                    }}>
                                        {renderRuleIcon(rule.icon)}
                                    </div>
                                    <span style={{ color: '#ccc', fontSize: 10, fontWeight: 500, lineHeight: 1.4, paddingTop: 2 }}>
                                        {rule.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ═══ NASIL ÇALIŞIR ═══ */}
                <div style={{
                    background: '#1E2530', border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 12, padding: 12, marginBottom: 12
                }}>
                    <div 
                        onClick={() => toggleSection('howItWorks')}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: collapsed.howItWorks ? 'none' : '1px solid #222', paddingBottom: collapsed.howItWorks ? 0 : 8, marginBottom: collapsed.howItWorks ? 0 : 8 }}
                    >
                        <h3 style={{ color: '#fff', fontSize: 10, fontWeight: 900, letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>
                            NASIL ÇALIŞIR?
                        </h3>
                        {collapsed.howItWorks ? <ChevronDown size={14} color="#F5A623" /> : <ChevronUp size={14} color="#F5A623" />}
                    </div>

                    {!collapsed.howItWorks && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                            {[
                                { emoji: '💰', step: 'Adım 1', label: 'Yatırım Yap' },
                                { emoji: '🎫', step: 'Adım 2', label: 'Talep Oluştur' },
                                { emoji: '✅', step: 'Adım 3', label: 'Onay Bekle' },
                                { emoji: '🎁', step: 'Adım 4', label: 'Katıl' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ background: '#141B25', border: '1px solid rgba(255,255,255,0.05)', padding: 10, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: 18 }}>{item.emoji}</span>
                                    <div>
                                        <div style={{ fontSize: 7, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.step}</div>
                                        <div style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>{item.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ═══ SSS (FAQ) ═══ */}
                <div style={{
                    background: '#1E2530', border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 12, padding: 12, marginBottom: 20
                }}>
                    <div 
                        onClick={() => toggleSection('faq')}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: collapsed.faq ? 'none' : '1px solid #222', paddingBottom: collapsed.faq ? 0 : 8, marginBottom: collapsed.faq ? 0 : 8 }}
                    >
                        <h3 style={{ color: '#fff', fontSize: 10, fontWeight: 900, letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>
                            S.S.S. (SIKÇA SORULAN SORULAR)
                        </h3>
                        {collapsed.faq ? <ChevronDown size={14} color="#F5A623" /> : <ChevronUp size={14} color="#F5A623" />}
                    </div>

                    {!collapsed.faq && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {config.faqs.map((faq, idx) => (
                                <div key={idx} style={{ background: '#141B25', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, overflow: 'hidden' }}>
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        style={{
                                            width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff'
                                        }}
                                    >
                                        <span style={{ fontSize: 10, fontWeight: 600 }}>{faq.q}</span>
                                        <ChevronDown style={{
                                            width: 12, height: 12, color: '#888', transition: 'transform 0.3s',
                                            transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)'
                                        }} />
                                    </button>
                                    {openFaq === idx && (
                                        <div style={{ padding: '8px 14px 10px', color: '#888', fontSize: 9, fontWeight: 500, borderTop: '1px solid #222' }}>
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* PERFORMANCE OPTIMIZED GPU CSS */}
            <style>{`
                .raffle-slot {
                    will-change: transform, box-shadow, background-color, border-color;
                    transform: translate3d(0, 0, 0); 
                    backface-visibility: hidden;
                    perspective: 1000px;
                }
                .raffle-slot-empty {
                    position: relative;
                }
                .raffle-slot-empty::after {
                    content: '';
                    position: absolute;
                    inset: -1px;
                    border-radius: 2px;
                    box-shadow: 0 0 4px rgba(245,166,35,0.06);
                    opacity: 1;
                    pointer-events: none;
                    will-change: opacity;
                    animation: slotGlowGpu 3s ease-in-out infinite;
                }
                .raffle-slot-empty:hover {
                    background-color: #050C18 !important;
                    border-color: rgba(245,166,35,0.3) !important;
                    color: #F5A623 !important;
                    box-shadow: 0 0 10px rgba(245,166,35,0.2) !important;
                    transform: scale(1.06) translate3d(0, 0, 0) !important;
                    z-index: 10;
                }
                .raffle-slot-empty:hover::after {
                    display: none;
                    animation: none;
                }
                @keyframes slotGlowGpu {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
                @keyframes slideDown {
                    from { transform: translate3d(-50%, -20px, 0); opacity: 0; }
                    to { transform: translate3d(-50%, 0, 0); opacity: 1; }
                }
                @media (min-width: 640px) {
                    .raffle-slot { height: 22px !important; }
                }
            `}</style>
        </div>
    );
};

export default RaffleView;
