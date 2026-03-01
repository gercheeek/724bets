import React, { useState, useEffect, useMemo } from 'react';
import { LoyaltyConfig, UserLoyalty, SiteUser } from '../types';
import { Ticket, Trophy, Clock, Star, ChevronRight, Coins, Info, Users, ChevronDown } from 'lucide-react';

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

interface RaffleViewProps {
    loyaltyConfig: LoyaltyConfig;
    userId: string;
    onNavigate: (view: string) => void;
}

const RaffleView: React.FC<RaffleViewProps> = ({ loyaltyConfig, userId, onNavigate }) => {
    const [loyalty, setLoyalty] = useState<UserLoyalty>(() => loadUserLoyalty(userId));
    const [buyMsg, setBuyMsg] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [ticketPool, setTicketPool] = useState<{ slot: number, userId: string, username: string }[]>(getTicketPool);

    const faqs = [
        { q: "Bilet nasıl kazanılır?", a: "Sponsor sitemiz Betlivo'ya yatırımlar yaparak veya Görevler sekmesindeki etkinlikleri tamamlayarak bilet kazanabilirsiniz." },
        { q: "Bilet talebi nasıl oluşturulur?", a: "Görevler sayfasındaki form aracılığıyla Betlivo kullanıcı adınızı, yatırım miktarınızı ve tarihini girerek talep oluşturabilirsiniz." },
        { q: "Yatırım tarihi ve saati neden isteniyor?", a: "Yatırımınızın sistem tarafından teyit edilebilmesi için talep edilmektedir." },
        { q: "Bilet talebim ne kadar sürede onaylanır?", a: "Talepleriniz uzman ekibimiz tarafından kontrol edilip en kısa sürede otomatik olarak onaylanır." },
        { q: "Bilet liderliği nasıl çalışır?", a: "Bilet havuzumuzdan, en fazla bilete sahip olan kullanıcıların biletleri sıralı olarak sergilenir." },
        { q: "Çekiliş nasıl yapılır?", a: "Çekiliş günlerinde bilet havuzundaki biletler arasından şeffaf bir bilgisayar algoritması ile kazananlar belirlenir." },
        { q: "Sponsor bilgisi neden isteniyor?", a: "Çekilişlerimiz partnerimiz Betlivo sponsorluğunda gerçekleştiği için oyuncu teyiti zorunludur." },
        { q: "Telefon doğrulaması neden gerekli?", a: "Sadece gerçek kişilerin ödül alabilmesi ve multi hesapların engellenmesi için istenmektedir." }
    ];

    // Refresh on mount
    useEffect(() => { setLoyalty(loadUserLoyalty(userId)); }, [userId]);

    const TICKET_PRICE = 500; // 500 coins = 1 ticket

    const ticketTransactions = loyalty.transactions.filter(tx => tx.tickets && tx.tickets > 0);
    const depositRule = loyaltyConfig.rules?.find(r => r.triggerType === 'deposit');

    // Mock raffle prizes (editable via admin in the future)
    const rafflePrizes = [
        { rank: '1.', prize: 'iPhone 16 Pro', emoji: '📱', color: '#3b82f6' },
        { rank: '2.', prize: '5,000 TL Nakit', emoji: '💵', color: '#10b981' },
        { rank: '3.', prize: '1,000 TL Bonus', emoji: '🎁', color: '#8b5cf6' },
        { rank: '4-10.', prize: '250 TL Freespin', emoji: '🎰', color: '#f59e0b' },
    ];

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

    const handleSelectSlot = (slotIndex: number) => {
        if (loyalty.pendingTickets <= 0) return;

        // check if taken
        if (ticketPool.find(t => t.slot === slotIndex)) return;

        const newPool = [...ticketPool, { slot: slotIndex, userId: userId, username: getAllMembers().find(m => m.id === userId)?.username || 'Siz' }];
        setTicketPool(newPool);
        localStorage.setItem('site_ticket_pool', JSON.stringify(newPool));

        const updated: UserLoyalty = {
            ...loyalty,
            pendingTickets: loyalty.pendingTickets - 1,
            tickets: loyalty.tickets + 1
        };
        setLoyalty(updated);
        localStorage.setItem(`loyalty_${userId}`, JSON.stringify(updated));
    };

    // Create the final array of 200 slots
    const poolSlots = Array.from({ length: TOTAL_POOL_SIZE }, (_, i) => {
        const found = ticketPool.find(t => t.slot === i);
        if (found) {
            return { username: found.username, isMe: found.userId === userId };
        }
        return { username: '', isMe: false };
    });

    const totalSold = ticketPool.length;

    return (
        <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at top, #08050f 0%, #060606 100%)' }}>
            <div className="max-w-2xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 text-4xl"
                        style={{ background: 'linear-gradient(135deg, #7c3aed22, #4f46e522)', border: '2px solid rgba(124,58,237,0.3)', boxShadow: '0 0 40px rgba(124,58,237,0.15)' }}>
                        🎟️
                    </div>
                    <h1 className="text-white font-black text-3xl mb-1 tracking-tight">Bilet <span style={{ color: '#a78bfa' }}>Etkinliği</span></h1>
                    <p className="text-zinc-500 text-sm font-bold">724bets.net × Betlivo Çekilişi</p>
                </div>

                {/* Ticket Balance */}
                <div className="p-5 rounded-3xl mb-5 text-center"
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(79,70,229,0.08))', border: '1.5px solid rgba(124,58,237,0.25)', boxShadow: '0 0 40px rgba(124,58,237,0.08)' }}>
                    <div className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Mevcut Bilet Sayınız</div>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Ticket className="w-8 h-8 text-purple-400" />
                        <span className="text-white font-black text-6xl tabular-nums">{loyalty.tickets}</span>
                    </div>
                    <div className="text-zinc-600 text-xs font-bold">
                        {loyalty.tickets === 0 ? 'Henüz bilet kazanmadınız' : `${loyalty.tickets} bilet çekilişe katılmaya hak kazandı`}
                    </div>
                    {loyalty.pendingTickets > 0 && (
                        <div className="mt-3 inline-block px-4 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/50 text-purple-400 font-black text-xs animate-pulse">
                            Aşağıdaki tablodan {loyalty.pendingTickets} adet bilet seçimi yapınız 👇
                        </div>
                    )}
                    <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-zinc-700 font-bold">
                        <Info className="w-3 h-3" />
                        Her bilet eşit şansla çekilişe girer
                    </div>
                </div>

                {/* Buy Ticket with Coins */}
                <div className="p-4 rounded-2xl mb-6 relative overflow-hidden" style={{ background: 'rgba(240,185,11,0.03)', border: '1px solid rgba(240,185,11,0.1)' }}>
                    {/* Background decor */}
                    <div className="absolute -right-10 -bottom-10 opacity-10 blur-xl">
                        <Coins className="w-40 h-40 text-[#f0b90b]" />
                    </div>

                    <h3 className="text-white font-black text-sm uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-[#f0b90b]" /> Coin ile Bilet Al
                    </h3>
                    <p className="text-zinc-500 text-[11px] mb-4">Birikmiş coinlerinizi kullanarak ekstra çekiliş şansı yakalayın.</p>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex-1 w-full bg-zinc-900/50 rounded-xl p-3 flex items-center justify-between border border-zinc-800">
                            <div>
                                <div className="text-zinc-500 text-[10px] font-black uppercase">1 Bilet Bedeli</div>
                                <div className="text-[#f0b90b] font-black text-lg">{TICKET_PRICE} Coin</div>
                            </div>
                            <div className="text-right">
                                <div className="text-zinc-500 text-[10px] font-black uppercase">Mevcut Bakiyeniz</div>
                                <div className="text-white font-black text-lg">{loyalty.coins.toLocaleString('tr')}</div>
                            </div>
                        </div>

                        <button
                            onClick={handleBuyTicket}
                            disabled={loyalty.coins < TICKET_PRICE}
                            className={`w-full sm:w-auto px-6 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex-shrink-0
                                ${loyalty.coins >= TICKET_PRICE
                                    ? 'bg-[#f0b90b] text-black hover:bg-[#f0b90b]/90 hover:scale-105 shadow-[0_0_20px_rgba(240,185,11,0.3)]'
                                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'}`}
                        >
                            SATIN AL
                        </button>
                    </div>

                    {buyMsg && (
                        <div className={`mt-3 p-2 rounded-lg text-center text-xs font-bold border ${buyMsg.startsWith('✅') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            {buyMsg}
                        </div>
                    )}
                </div>

                {/* How to earn tickets - NEW UI */}
                <div className="mb-8">
                    <h3 className="text-white font-black text-xl tracking-tight mb-4 text-center sm:text-left">
                        Bilet Sistemi Nasıl Çalışır?
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        {[
                            { step: 1, title: 'Yatırım Yap', desc: 'Sponsor sitede yatırımını gerçekleştir', color: '#06b6d4' },
                            { step: 2, title: 'Talep Oluştur', desc: 'Yatırım bilgilerini girerek bilet talep et', color: '#00bcd4' },
                            { step: 3, title: 'Onay Bekle', desc: 'Talebin incelenir ve biletlerin yansır', color: '#26c6da' },
                            { step: 4, title: 'Çekilişe Katıl', desc: 'Biletlerin ile çekilişe otomatik katıl', color: '#4dd0e1' },
                        ].map(item => (
                            <div key={item.step} className="p-4 rounded-2xl flex flex-col justify-center items-center text-center transition-all hover:-translate-y-1"
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-black font-black text-lg mb-3 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                    style={{ backgroundColor: item.color }}>
                                    {item.step}
                                </div>
                                <div className="text-white font-black text-xs uppercase tracking-wider mb-1 mt-1">{item.title}</div>
                                <div className="text-zinc-500 text-[10px] sm:text-xs leading-snug">{item.desc}</div>
                            </div>
                        ))}
                    </div>

                    {/* FAQs */}
                    <div className="mb-4">
                        <h3 className="text-white font-black text-lg mb-3">Sıkça Sorulan Sorular</h3>
                        <div className="space-y-2">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="rounded-xl overflow-hidden transition-all" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
                                    >
                                        <span className="text-zinc-300 font-bold text-xs sm:text-sm">{faq.q}</span>
                                        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openFaq === idx && (
                                        <div className="px-4 pb-4 pt-1 text-zinc-500 text-xs leading-relaxed animate-fade-in">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 200 Ticket Visual Pool */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-black text-lg uppercase tracking-tight flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-400" /> Bilet Havuzu
                        </h3>
                        <div className="text-zinc-500 text-xs font-bold bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                            {totalSold} / {TOTAL_POOL_SIZE} Satıldı
                        </div>
                    </div>

                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                        {poolSlots.map((slot, index) => {
                            const isSold = !!slot.username;
                            return (
                                <div key={index}
                                    onClick={() => !isSold && handleSelectSlot(index)}
                                    className={`relative aspect-[2/1] rounded flex items-center justify-center overflow-hidden transition-all duration-300
                                        ${isSold ? (slot.isMe ? 'bg-purple-500 border border-purple-400 z-10 scale-105 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-[#f0b90b]/20 border border-[#f0b90b]/30')
                                            : loyalty.pendingTickets > 0 ? 'bg-zinc-800 border border-purple-500/50 cursor-pointer hover:bg-purple-500/20 hover:border-purple-400 animate-pulse' : 'bg-zinc-900 border border-zinc-800/50'}
                                    `}
                                >
                                    {/* background texture */}
                                    {isSold && (
                                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }}></div>
                                    )}

                                    {/* perforation holes */}
                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#060606]"></div>
                                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#060606]"></div>

                                    {/* content */}
                                    <span className={`relative z-10 text-[8px] sm:text-[9px] font-black tracking-tighter w-full text-center truncate px-2
                                        ${isSold ? (slot.isMe ? 'text-white drop-shadow-md' : 'text-[#f0b90b]') : 'text-zinc-700'}`}>
                                        {isSold ? (
                                            slot.isMe ? 'SİZ' : slot.username.length > 5 ? slot.username.substring(0, 4) + '..' : slot.username
                                        ) : index + 1}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Raffle Prizes */}
                <div className="p-4 rounded-2xl mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 className="text-white font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-[#f0b90b]" /> Çekiliş Ödülleri
                    </h3>
                    <div className="space-y-2">
                        {rafflePrizes.map((p, i) => (
                            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                                style={{ background: i === 0 ? `${p.color}0c` : 'rgba(0,0,0,0.2)', border: `1px solid ${i === 0 ? `${p.color}22` : 'rgba(255,255,255,0.04)'}` }}>
                                <span className="text-2xl">{p.emoji}</span>
                                <div className="flex-1">
                                    <span className="text-white font-black text-sm">{p.prize}</span>
                                </div>
                                <span className="text-zinc-700 font-black text-xs">{p.rank}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ticket history */}
                {ticketTransactions.length > 0 && (
                    <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-zinc-500" /> Bilet Geçmişi
                        </h3>
                        <div className="space-y-2">
                            {ticketTransactions.slice(0, 10).map(tx => (
                                <div key={tx.id} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                    <Ticket className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white font-bold text-xs truncate">{tx.reason}</div>
                                        <div className="text-zinc-700 text-[10px]">{new Date(tx.timestamp).toLocaleString('tr-TR')}</div>
                                    </div>
                                    <span className="text-purple-400 font-black text-sm">+{tx.tickets} 🎟️</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Next draw countdown placeholder */}
                <div className="mt-4 p-4 rounded-2xl text-center" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                    <div className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Sonraki Çekiliş</div>
                    <div className="text-purple-400 font-black text-xl">Yakında Duyurulacak</div>
                    <div className="text-zinc-700 text-xs mt-1 font-bold">Biletlerinizi biriktirmeye devam edin!</div>
                </div>
            </div>
        </div>
    );
};

export default RaffleView;
