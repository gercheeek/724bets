import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LoyaltyConfig, UserLoyalty, SiteUser, RaffleConfig } from '../types';
import { Ticket, Trophy, Clock, Coins, Info, Users, ChevronDown, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[
                { label: 'GÜN', val: timeLeft.d },
                { label: 'SAAT', val: timeLeft.h },
                { label: 'DAK', val: timeLeft.m },
                { label: 'SAN', val: timeLeft.s }
            ].map((t, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        width: '100%', height: 48,
                        background: '#0d0d0d',
                        border: '1px solid rgba(212,175,55,0.2)',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, fontWeight: 800, color: '#fff',
                        marginBottom: 4,
                        position: 'relative'
                    }}>
                        {String(t.val).padStart(2, '0')}
                        <div style={{
                            position: 'absolute', bottom: 6, left: '25%', right: '25%',
                            height: 1, background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                            opacity: 0.5
                        }} />
                    </div>
                    <span style={{ fontSize: 7, color: '#666', fontWeight: 800, letterSpacing: '0.15em' }}>{t.label}</span>
                </div>
            ))}
        </div>
    );
});

// --------------------------------------------------------------------------------
// OPTIMIZATION 2: Memoize individual Ticket Slots to stop re-rendering 200 elements
// --------------------------------------------------------------------------------
const TicketSlot = React.memo(({ index, isSold, isMe, username, onSelect }: { index: number, isSold: boolean, isMe: boolean, username: string, onSelect: (idx: number) => void }) => {
    return (
        <div
            title={isSold ? (isMe ? 'Sizin' : username) : `Bilet ${index + 1} (Boş)`}
            onClick={() => !isSold && onSelect(index)}
            className={`raffle-slot ${isSold ? '' : 'raffle-slot-empty'}`}
            style={{
                height: 24, borderRadius: 3,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                cursor: isSold ? 'default' : 'pointer',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s, border-color 0.3s',
                ...(isSold
                    ? (isMe
                        ? {
                            background: 'rgba(59,130,246,0.25)',
                            border: '1px solid #3b82f6',
                            color: '#3b82f6'
                        }
                        : {
                            background: '#D4AF37',
                            border: '1px solid #D4AF37',
                            color: '#000',
                            boxShadow: '0 0 8px rgba(212,175,55,0.3)'
                        })
                    : {
                        background: '#151515',
                        border: '1px solid #252525',
                        color: '#444'
                    })
            }}
        >
            <span style={{
                fontSize: 7, fontWeight: isSold && !isMe ? 800 : 600,
                lineHeight: 1
            }}>
                #{String(index + 1).padStart(3, '0')}
            </span>
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

    // Form states
    const [depositUsername, setDepositUsername] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [depositDate, setDepositDate] = useState('');
    const [depositTicket, setDepositTicket] = useState('');

    const targetDate = useMemo(() => new Date(config.drawDate), [config.drawDate]);

    const renderRuleIcon = (icon: string) => {
        switch (icon) {
            case 'Shield': return <Shield size={14} />;
            case 'AlertTriangle': return <AlertTriangle size={14} />;
            case 'CheckCircle': return <CheckCircle size={14} />;
            case 'Users': return <Users size={14} />;
            case 'Trophy': return <Trophy size={14} />;
            case 'Info': return <Info size={14} />;
            default: return <Info size={14} />;
        }
    };

    useEffect(() => { setLoyalty(loadUserLoyalty(userId)); }, [userId]);

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 3000);
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

    // --------------------------------------------------------------------------------
    // OPTIMIZATION 3: Stable Select Handler using Functional Updates
    // --------------------------------------------------------------------------------
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
        <div style={{ minHeight: '100vh', background: '#0d0d0d', padding: '0 0 80px', fontFamily: "'Inter', sans-serif", color: '#fff' }}>
            {successMsg && (
                <div style={{
                    position: 'fixed', top: 80, left: '50%', transform: 'translate3d(-50%, 0, 0)', zIndex: 50,
                    padding: '12px 24px', borderRadius: 12, background: 'rgba(13,13,13,0.95)',
                    backdropFilter: 'blur(20px)', fontSize: 13, color: '#D4AF37',
                    border: '1px solid rgba(212,175,55,0.4)', boxShadow: '0 8px 32px rgba(212,175,55,0.15)',
                    animation: 'slideDown 0.3s ease', willChange: 'transform, opacity'
                }}>
                    {successMsg}
                </div>
            )}
            
            <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 16px' }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'stretch' }}>
                    {/* ═══ LEFT SIDEBAR ═══ */}
                    <div style={{ width: '33.333%', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
                        
                        {/* 1. Countdown & VIP Cards Component */}
                        <div style={{
                            background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.25)',
                            borderRadius: 16, padding: 20, overflow: 'hidden', position: 'relative',
                            flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 16
                        }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, padding: 16, opacity: 0.05, pointerEvents: 'none' }}>
                                <Clock size={120} strokeWidth={1} style={{ transform: 'translate(20%, -20%)' }} />
                            </div>

                            {/* UI ADJUSTMENT: Shrunk VIP Stats embedded directly here (40% smaller) */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, position: 'relative', zIndex: 10 }}>
                                {/* Biletleriniz Small */}
                                <div style={{
                                    borderRadius: 12,
                                    background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(13,13,13,0.95) 50%, rgba(212,175,55,0.05) 100%)',
                                    border: '1px solid rgba(212,175,55,0.3)',
                                    padding: '14px 16px',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                        <Ticket size={12} style={{ color: '#D4AF37' }} />
                                        <span style={{ color: '#999', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            MEVCUT BİLETLER
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                        <span style={{ fontSize: 24, fontWeight: 900, color: '#fff', textShadow: '0 0 20px rgba(212,175,55,0.3)', lineHeight: 1 }}>
                                            {loyalty.tickets}
                                        </span>
                                        <span style={{ fontSize: 10, fontWeight: 600, color: '#D4AF37', opacity: 0.8 }}>Adet</span>
                                    </div>
                                </div>

                                {/* Mevcut Coin Small */}
                                <div style={{
                                    borderRadius: 12,
                                    background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(13,13,13,0.95) 50%, rgba(212,175,55,0.05) 100%)',
                                    border: '1px solid rgba(212,175,55,0.3)',
                                    padding: '14px 16px',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                        <Coins size={12} style={{ color: '#D4AF37' }} />
                                        <span style={{ color: '#999', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            MEVCUT COİN
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                        <span style={{ fontSize: 24, fontWeight: 900, color: '#fff', textShadow: '0 0 20px rgba(212,175,55,0.3)', lineHeight: 1 }}>
                                            {loyalty.coins.toLocaleString('tr')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Buy Button inside Sidebar */}
                            <div style={{ position: 'relative', zIndex: 10 }}>
                                {buyMsg && (
                                    <div style={{ fontSize: 10, fontWeight: 600, color: buyMsg.includes('✅') ? '#D4AF37' : '#ef4444', textAlign: 'center', marginBottom: 8 }}>
                                        {buyMsg}
                                    </div>
                                )}
                                <button
                                    onClick={handleBuyTicket}
                                    disabled={loyalty.coins < TICKET_PRICE}
                                    style={{
                                        width: '100%', padding: '12px 0', borderRadius: 10, fontSize: 11, fontWeight: 800,
                                        border: 'none', cursor: loyalty.coins >= TICKET_PRICE ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.3s ease', letterSpacing: '0.05em',
                                        ...(loyalty.coins >= TICKET_PRICE
                                            ? {
                                                background: 'linear-gradient(180deg, #D4AF37 0%, #996515 100%)',
                                                color: '#0d0d0d',
                                                boxShadow: '0 4px 20px rgba(212,175,55,0.3)'
                                            }
                                            : {
                                                background: '#1a1a1a', color: '#555',
                                                border: '1px solid #2a2a2a'
                                            })
                                    }}
                                >
                                    YENİ BİLET SATIN AL (500)
                                </button>
                            </div>

                            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)', margin: '4px 0', position: 'relative', zIndex: 10 }} />

                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <div style={{
                                    color: '#D4AF37', fontSize: 10, fontWeight: 800,
                                    textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16,
                                    display: 'flex', alignItems: 'center', gap: 8
                                }}>
                                    <Clock size={12} style={{ color: '#D4AF37' }} />
                                    SONRAKİ ÇEKİLİŞ
                                </div>
                                <div style={{
                                    fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20,
                                    padding: '8px 14px', borderRadius: 8,
                                    border: '1px solid rgba(212,175,55,0.3)',
                                    background: 'rgba(212,175,55,0.05)',
                                    display: 'inline-block'
                                }}>
                                    {new Date(config.drawDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                                
                                <CountdownDisplay targetDate={targetDate} />
                            </div>
                        </div>

                        {/* 2. Bilet Talep Formu */}
                        <div style={{
                            background: '#1a1a1a', border: '1px solid #2a2a2a',
                            borderRadius: 16, padding: 20, flex: '1 1 auto',
                            display: 'flex', flexDirection: 'column'
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                marginBottom: 16, borderBottom: '1px solid #2a2a2a', paddingBottom: 12
                            }}>
                                <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                    TALEP OLUŞTUR
                                </span>
                                <span style={{
                                    color: '#D4AF37', fontSize: 9, fontWeight: 700,
                                    border: '1px solid rgba(212,175,55,0.3)', padding: '3px 8px',
                                    borderRadius: 6, letterSpacing: '0.05em'
                                }}>
                                    500 TL = 1 Bilet
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                                <input type="text" placeholder="724BAHİS Kullanıcı Adı" value={depositUsername}
                                    onChange={e => setDepositUsername(e.target.value)}
                                    style={{
                                        width: '100%', padding: '10px 12px', background: '#0d0d0d',
                                        border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff',
                                        fontSize: 12, outline: 'none', transition: 'border-color 0.3s'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#D4AF37'}
                                    onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    <input type="number" placeholder="Yatırım Tutarı" value={depositAmount}
                                        onChange={e => setDepositAmount(e.target.value)}
                                        style={{
                                            width: '100%', padding: '10px 12px', background: '#0d0d0d',
                                            border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff',
                                            fontSize: 12, outline: 'none', transition: 'border-color 0.3s'
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#D4AF37'}
                                        onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                                    />
                                    <input type="number" placeholder="Bilet No (1-200)" value={depositTicket}
                                        onChange={e => setDepositTicket(e.target.value)}
                                        style={{
                                            width: '100%', padding: '10px 12px', background: '#0d0d0d',
                                            border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff',
                                            fontSize: 12, outline: 'none', transition: 'border-color 0.3s'
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#D4AF37'}
                                        onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                                    />
                                </div>
                                <input type="datetime-local" value={depositDate}
                                    onChange={e => setDepositDate(e.target.value)}
                                    style={{
                                        width: '100%', padding: '10px 12px', background: '#0d0d0d',
                                        border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff',
                                        fontSize: 12, outline: 'none', colorScheme: 'dark',
                                        transition: 'border-color 0.3s'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#D4AF37'}
                                    onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                                />
                                <button onClick={handleDepositRequest}
                                    style={{
                                        width: '100%', marginTop: 8, padding: '14px 0', borderRadius: 10,
                                        fontWeight: 900, fontSize: 13, letterSpacing: '0.08em',
                                        color: '#0d0d0d', border: 'none', cursor: 'pointer',
                                        background: 'linear-gradient(180deg, #D4AF37 0%, #B8860B 50%, #996515 100%)',
                                        boxShadow: '0 4px 20px rgba(212,175,55,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
                                        transition: 'all 0.3s ease', textTransform: 'uppercase'
                                    }}
                                >
                                    TALEP GÖNDER
                                </button>
                            </div>
                        </div>

                        {/* 3. Legend */}
                        <div style={{
                            background: '#1a1a1a', border: '1px solid #2a2a2a',
                            borderRadius: 16, padding: '16px 20px',
                            flex: '0 0 auto'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 14, height: 14, background: '#D4AF37', borderRadius: 3, boxShadow: '0 0 8px rgba(212,175,55,0.4)'
                                    }} />
                                    <span style={{ color: '#999', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                        DOLU BİLET
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 14, height: 14, background: 'rgba(59,130,246,0.3)', border: '1.5px solid #3b82f6', borderRadius: 3
                                    }} />
                                    <span style={{ color: '#999', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                        SİZİN BİLETLERİNİZ
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 14, height: 14, background: '#1a1a1a', border: '1.5px solid #333', borderRadius: 3, boxShadow: '0 0 6px rgba(212,175,55,0.1)'
                                    }} />
                                    <span style={{ color: '#999', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                        BOŞ SLOT
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══ RIGHT: Bilet Havuzu WITH VIRTUALIZATION-LIKE MEMO ═══ */}
                    <div style={{
                        width: '66.667%', minWidth: 0,
                        background: '#1a1a1a', border: '1px solid #2a2a2a',
                        borderRadius: 16, overflow: 'hidden',
                        display: 'flex', flexDirection: 'column'
                    }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: 20, borderBottom: '1px solid #2a2a2a', background: '#1a1a1a'
                        }}>
                            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', margin: 0 }}>
                                BİLET HAVUZU (200 SLOT)
                            </h3>
                            <div style={{
                                color: '#999', fontSize: 12, fontWeight: 600,
                                border: '1px solid #2a2a2a', background: '#111', padding: '4px 10px',
                                borderRadius: 8
                            }}>
                                {totalSold} / {TOTAL_POOL_SIZE}
                            </div>
                        </div>
                        
                        <div style={{
                            padding: '16px 20px', flex: 1,
                            background: 'rgba(17,17,17,0.3)'
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(10, 1fr)',
                                gap: 2, width: '100%',
                                maxWidth: '100%'
                            }}>
                                {/* Optimal rendering loop using useMemo wrapping React.memo slots for high performance */}
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
                    background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)',
                    borderRadius: 16, padding: 24, marginBottom: 16
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <Shield size={16} style={{ color: '#D4AF37' }} />
                        <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: '0.05em' }}>
                            BİLET HAVUZU KURALLARI
                        </h3>
                        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(212,175,55,0.3), transparent)' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                        {config.rules.map((rule, idx) => (
                            <div key={idx} style={{
                                display: 'flex', alignItems: 'flex-start', gap: 12,
                                padding: '14px 16px', background: 'rgba(13,13,13,0.6)',
                                borderRadius: 12, border: '1px solid #222'
                            }}>
                                <div style={{
                                    flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)'
                                }}>
                                    {renderRuleIcon(rule.icon)}
                                </div>
                                <span style={{ color: '#ccc', fontSize: 12, fontWeight: 500, lineHeight: 1.5, paddingTop: 4 }}>
                                    {rule.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══ NASIL ÇALIŞIR ═══ */}
                <div style={{
                    background: '#1a1a1a', border: '1px solid #2a2a2a',
                    borderRadius: 16, padding: 20, marginBottom: 16
                }}>
                    <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 16, margin: '0 0 16px' }}>
                        NASIL ÇALIŞIR?
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {[
                            { emoji: '💰', step: 'Adım 1', label: 'Yatırım Yap' },
                            { emoji: '🎫', step: 'Adım 2', label: 'Talep Oluştur' },
                            { emoji: '✅', step: 'Adım 3', label: 'Onay Bekle' },
                            { emoji: '🎁', step: 'Adım 4', label: 'Çekilişe Katıl' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', padding: 16, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
                                <span style={{ fontSize: 24 }}>{item.emoji}</span>
                                <div>
                                    <div style={{ fontSize: 10, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.step}</div>
                                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{item.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══ SSS (FAQ) ═══ */}
                <div style={{
                    background: '#1a1a1a', border: '1px solid #2a2a2a',
                    borderRadius: 16, padding: 20, marginBottom: 32
                }}>
                    <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 16, margin: '0 0 16px' }}>
                        S.S.S.
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {config.faqs.map((faq, idx) => (
                            <div key={idx} style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: 12, overflow: 'hidden' }}>
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    style={{
                                        width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff'
                                    }}
                                >
                                    <span style={{ fontSize: 12, fontWeight: 600 }}>{faq.q}</span>
                                    <ChevronDown style={{
                                        width: 16, height: 16, color: '#888', transition: 'transform 0.3s',
                                        transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }} />
                                </button>
                                {openFaq === idx && (
                                    <div style={{ padding: '12px 20px 16px', color: '#888', fontSize: 12, fontWeight: 500, borderTop: '1px solid #2a2a2a' }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
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
                    border-radius: 3px;
                    box-shadow: 0 0 6px rgba(212,175,55,0.08);
                    opacity: 1;
                    pointer-events: none;
                    will-change: opacity;
                    animation: slotGlowGpu 3s ease-in-out infinite;
                }
                .raffle-slot-empty:hover {
                    background-color: #1e1e1e !important;
                    border-color: rgba(212,175,55,0.4) !important;
                    color: #D4AF37 !important;
                    box-shadow: 0 0 14px rgba(212,175,55,0.25) !important;
                    transform: scale(1.08) translate3d(0, 0, 0) !important;
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
                    .raffle-slot { height: 26px !important; }
                }
            `}</style>
        </div>
    );
};

export default RaffleView;
