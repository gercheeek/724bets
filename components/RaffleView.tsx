import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LoyaltyConfig, UserLoyalty, SiteUser, RaffleConfig } from '../types';
import { Ticket, Trophy, Clock, Coins, Info, Users, ChevronDown, ChevronUp, Shield, AlertTriangle, CheckCircle, Lock, X, Search } from 'lucide-react';
import VIPRafflePromo from './VIPRafflePromo';
import { useTranslation } from 'react-i18next';

function loadUserLoyalty(userId: string): UserLoyalty {
    const stored = localStorage.getItem(`loyalty_${userId}`);
    if (stored) return JSON.parse(stored);
    return { userId, coins: 0, deposit: 0, pendingTickets: 0, tickets: 0, totalEarned: 0, transactions: [], lastVolumeResetDate: new Date().toDateString(), dailyVolumeAccumulated: 0 };
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
    const { t } = useTranslation();
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
                { label: t('raffle.day', 'GÜN'), val: timeLeft.d },
                { label: t('raffle.hour', 'SAAT'), val: timeLeft.h },
                { label: t('raffle.min', 'DAK'), val: timeLeft.m },
                { label: t('raffle.sec', 'SAN'), val: timeLeft.s }
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
    const { t } = useTranslation();
    return (
        <div
            title={isSold ? (isMe ? t('raffle.your_ticket', 'Sizin') : username) : t('raffle.empty_ticket', 'Bilet {0} (Boş)').replace('{0}', String(index + 1))}
            onClick={() => !isSold && onSelect(index)}
            className={`
                relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 group
                ${isSold 
                    ? (isMe 
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.6)] cursor-default transform scale-95' 
                        : 'bg-gradient-to-br from-zinc-900 to-black border-zinc-800 opacity-40 cursor-default'
                      ) 
                    : 'bg-[#101014] border-white/5 hover:bg-[#1a1a24] hover:border-amber-400 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] cursor-pointer hover:-translate-y-1'
                }
            `}
            style={{ minHeight: 64 }}
        >
            {isSold ? (
                <>
                    {isMe ? <Ticket className="w-5 h-5 mb-1 text-emerald-950" /> : <Lock className="w-4 h-4 mb-1 text-zinc-600" />}
                    <div className={`font-black text-[9px] text-center tracking-wider uppercase ${isMe ? 'text-emerald-950' : 'text-zinc-500'}`}>
                        {isMe ? t('raffle.yours', 'SİZİN') : t('raffle.taken', 'DOLU')}
                    </div>
                    <div className={`text-[8px] font-mono mt-0.5 ${isMe ? 'text-emerald-900/70 font-bold' : 'text-white/20'}`}>#{String(index + 1).padStart(3, '0')}</div>
                </>
            ) : (
                <>
                    <Ticket className="w-5 h-5 text-white/10 mb-1 group-hover:text-amber-400 transition-colors" />
                    <div className="text-white/30 text-[10px] font-bold text-center font-mono group-hover:text-amber-400 transition-colors">
                        {String(index + 1).padStart(3, '0')}
                    </div>
                </>
            )}
            
            {/* Hover Glare Effect */}
            {!isSold && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
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
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isArenaModalOpen, setIsArenaModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    const TOTAL_POOL_SIZE = 1000;

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
    const myTickets = ticketPool.filter(t => t.userId === userId).map(t => t.slot).sort((a, b) => a - b);

    const handleSelectRandom = () => {
        if (loyalty.pendingTickets <= 0) {
            showSuccess('❌ Bilet atama hakkınız bulunmuyor. Önce bilet kazanmalısınız.');
            return;
        }
        const availableSlots = Array.from({length: TOTAL_POOL_SIZE}, (_, i) => i)
            .filter(i => !ticketPool.some(t => t.slot === i));
            
        if (availableSlots.length > 0) {
            const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
            handleSelectSlot(randomSlot);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'transparent', padding: '0 0 60px', fontFamily: "'Inter', sans-serif", color: '#fff' }}>
            <style>{`
                @keyframes sweep {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(200%) skewX(-15deg); }
                }
                .animate-sweep::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
                    transform: translateX(-100%) skewX(-15deg);
                    animation: sweep 2.5s infinite;
                }
            `}</style>
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
            
            <div className="w-full max-w-full mx-auto m-0 p-0 flex flex-col flex-1">
                <VIPRafflePromo 
                    onOpenArenaModal={() => setIsArenaModalOpen(true)}
                    loyalty={loyalty}
                    onOpenDepositModal={() => setIsDepositModalOpen(true)}
                    onBuyTicket={handleBuyTicket}
                    buyMsg={buyMsg || ''}
                    totalSoldInMatrix={totalSold}
                    totalPoolSize={TOTAL_POOL_SIZE}
                    targetDateStr={config.drawDate}
                />

                {/* ═══ VERTICAL CONTAINER FOR VAULT & ARENA ═══ */}
                <div className="w-full max-w-[1000px] mx-auto px-6 md:px-8 flex flex-col gap-16 mb-20">
                    
                    {/* ═══ VIP Vault: My Tickets ═══ */}
                    {myTickets.length > 0 && (
                        <div className="w-full flex flex-col gap-8">
                        <div className="flex items-center justify-between px-6">
                            <h3 className="text-[#A0A0AB] text-[11px] font-semibold uppercase tracking-widest flex items-center gap-2">
                                <Shield className="w-4 h-4 text-amber-500/70" /> Lüks Bilet Kasam
                            </h3>
                            <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg text-amber-400 text-xs font-bold shadow-[0_0_10px_rgba(245,166,35,0.1)]">
                                {myTickets.length} BİLET
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-5 px-6">
                            {myTickets.map(slotIndex => (
                                <div key={slotIndex} className="relative group w-[220px] h-[120px] rounded-3xl overflow-hidden cursor-default transition-all duration-300 transform hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(251,191,36,0.2)] border border-amber-500/40">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1f] via-[#050505] to-[#1a1a1f] opacity-90" />
                                    {/* Holographic effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 mix-blend-overlay" />
                                    
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                        <div className="text-amber-500/80 text-[9px] font-black uppercase tracking-widest">VIP Bilet</div>
                                        <CheckCircle className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                                        <div>
                                            <div className="text-white/30 text-[8px] font-semibold uppercase tracking-widest mb-1">Seri No</div>
                                            <div className="font-mono text-lg font-bold text-amber-100 drop-shadow-md tracking-[0.2em]">
                                                {String(slotIndex + 1).padStart(4, '0')}
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/10 group-hover:scale-110 transition-transform">
                                            <Ticket className="w-4 h-4 text-amber-400" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                    {/* ═══ The Arena: Ticket Matrix ═══ */}
                    <div className="w-full flex flex-col gap-8">
                        <div className="w-full bg-[#050505]/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden">
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-white/5 bg-white/[0.02] gap-5 relative z-10">
                            <h3 className="text-white text-xl font-black uppercase tracking-wider flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,166,35,0.5)]" />
                                Bilet Arenası
                            </h3>
                            <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
                                {/* Legend */}
                                <div className="flex items-center gap-5 mr-0 sm:mr-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500/50" />
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider hidden sm:inline">Dolu</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500/50" />
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider hidden sm:inline">Sizin</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3.5 h-3.5 rounded bg-white/5 border border-white/10" />
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider hidden sm:inline">Boş</span>
                                    </div>
                                </div>
                                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-lg text-sm font-black tracking-widest shrink-0 shadow-[0_0_15px_rgba(245,166,35,0.1)]">
                                    {totalSold} / {TOTAL_POOL_SIZE}
                                </div>
                            </div>
                        </div>

                        {/* Animated Arena Background */}
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" />
                        </div>

                        <div className="p-6 sm:p-8 overflow-y-auto max-h-[800px] custom-scrollbar relative z-10">
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
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

                        {/* Random Selection Button */}
                        <div className="w-full p-6 sm:p-8 flex items-center justify-center border-t border-white/5 bg-gradient-to-t from-black/50 to-transparent relative z-10">
                            <button 
                                onClick={handleSelectRandom}
                                className="relative overflow-hidden group px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 border border-amber-300 text-amber-950 font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(245,166,35,0.4)] transition-all transform hover:-translate-y-1 animate-sweep"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Ticket className="w-5 h-5" />
                                    Rastgele Şanslı Bilet Seç
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                </div>

                {/* ═══ Deposit Form Modal ═══ */}
                {isDepositModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Overlay backdrop */}
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDepositModalOpen(false)} />
                        
                        {/* Modal Box */}
                        <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl relative z-10 animate-[slideDown_0.3s_ease]">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent" />
                            
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-white text-lg font-black uppercase tracking-wider flex items-center gap-2">
                                    <Ticket className="text-emerald-400 w-5 h-5" /> Bilet Talep Et
                                </h3>
                                <button onClick={() => setIsDepositModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors p-1">
                                    ✕
                                </button>
                            </div>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-6 flex items-start gap-3">
                                <Info className="text-emerald-400 w-5 h-5 shrink-0 mt-0.5" />
                                <span className="text-emerald-200 text-xs font-medium leading-relaxed">500 TL yatırım yaparak havuzdan bilet seçme hakkı (1 Bilet) kazanabilirsiniz.</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Kullanıcı Adı</label>
                                    <input type="text" value={depositUsername} onChange={e => setDepositUsername(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-colors"
                                        placeholder="Kullanıcı adınızı girin"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Tutar (TL)</label>
                                        <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-colors"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1.5">İstenilen Bilet No</label>
                                        <input type="number" value={depositTicket} onChange={e => setDepositTicket(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-colors"
                                            placeholder="Örn: 42"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Yatırım Tarihi</label>
                                    <input type="datetime-local" value={depositDate} onChange={e => setDepositDate(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-colors"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                            </div>

                            <button onClick={() => { handleDepositRequest(); setIsDepositModalOpen(false); }}
                                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-sm uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-0.5"
                            >
                                Talebi Gönder
                            </button>
                        </div>
                    </div>
                )}

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
        
            {/* ═══ ARENA MODAL ═══ */}
            {isArenaModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsArenaModalOpen(false)} />
                    
                    <div className="relative w-full max-w-5xl bg-[#0a0d14]/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh] overflow-hidden animate-[scaleIn_0.3s_ease-out]">
                        
                        {/* Header & Search */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-white/5 bg-white/[0.02] gap-4 shrink-0">
                            <h3 className="text-white text-xl font-black uppercase tracking-wider flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,166,35,0.5)]" />
                                Bilet Seçimi
                            </h3>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                <div className="relative w-full sm:w-48">
                                    <input 
                                        type="number"
                                        placeholder="Bilet Ara (1-1000)"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-amber-500/5 transition-all"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                </div>
                                <button 
                                    onClick={() => setIsArenaModalOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Ticket Grid */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
                            {/* Animated Background */}
                            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[100px]" />
                            </div>

                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 relative z-10">
                                {useMemo(() => {
                                    return Array.from({ length: TOTAL_POOL_SIZE }, (_, index) => {
                                        // filter logic
                                        if (searchQuery && !String(index + 1).includes(searchQuery)) {
                                            return null;
                                        }
                                        const found = ticketPool.find(t => t.slot === index);
                                        return (
                                            <TicketSlot 
                                                key={index} 
                                                index={index} 
                                                isSold={!!found} 
                                                isMe={found?.userId === userId} 
                                                username={found?.username || ''} 
                                                onSelect={(idx) => {
                                                    handleSelectSlot(idx);
                                                    setIsArenaModalOpen(false); // Close on select
                                                }} 
                                            />
                                        );
                                    });
                                }, [ticketPool, userId, handleSelectSlot, searchQuery])}
                            </div>
                        </div>

                        {/* Footer / Legend */}
                        <div className="p-4 border-t border-white/5 bg-black/50 shrink-0 flex items-center justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-zinc-900 border border-zinc-800" />
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Dolu</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" />
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Sizin</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-white/5 border border-white/10" />
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Boş</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}
</div>
    );
};

export default RaffleView;
