import React, { useState, useEffect } from 'react';
import {
    LoyaltyConfig, UserLoyalty, MarketItem, CoinTransaction
} from '../types';
import {
    Coins, Ticket, Gift, ShoppingBag, TrendingUp, CheckCircle2,
    Clock, Zap, ArrowRight, Trophy, Star, X, RefreshCw, ChevronRight
} from 'lucide-react';

// ─── Default Config ────────────────────────────────────────────────────────
export const DEFAULT_LOYALTY_CONFIG: LoyaltyConfig = {
    programName: 'Betlivo Sadakat Programı',
    coinName: 'Coin',
    isActive: true,
    rules: [
        {
            id: 'deposit-trigger',
            name: 'Yatırım Tetikleyicisi',
            description: 'Her 500 TL yatırım için 250 Coin + 1 Çekiliş Bileti kazanın',
            triggerType: 'deposit',
            thresholdAmount: 500,
            coinsAwarded: 250,
            ticketsAwarded: 1,
            isActive: true,
        },
        {
            id: 'volume-task',
            name: 'Günlük Slot Hacim Görevi',
            description: 'Günlük 2,000 TL Slot turnover yaparak 100 Coin kazanın',
            triggerType: 'volume',
            thresholdAmount: 2000,
            coinsAwarded: 100,
            ticketsAwarded: 0,
            isActive: true,
        },
    ],
    marketItems: [
        {
            id: 'm1', name: '50 TL Nakit Bonus', description: 'Hesabınıza anında 50 TL nakit bonus',
            type: 'cash_bonus', coinCost: 500, emoji: '💵', color: '#10b981', isActive: true, stock: -1,
        },
        {
            id: 'm2', name: '100 TL Nakit Bonus', description: 'Hesabınıza anında 100 TL nakit bonus',
            type: 'cash_bonus', coinCost: 900, emoji: '💰', color: '#f0b90b', isActive: true, stock: -1,
        },
        {
            id: 'm3', name: '25 FreeSpin', description: '25 ücretsiz dönüş Slot oyunlarında',
            type: 'freespin', coinCost: 200, emoji: '🎰', color: '#3b82f6', isActive: true, stock: -1,
        },
        {
            id: 'm4', name: '100 FreeSpin', description: '100 ücretsiz dönüş Slot oyunlarında',
            type: 'freespin', coinCost: 700, emoji: '🎯', color: '#8b5cf6', isActive: true, stock: -1,
        },
        {
            id: 'm5', name: '250 TL Freebet', description: 'Spor bahislerinde kullanabileceğiniz freebet',
            type: 'freebet', coinCost: 1500, emoji: '⚽', color: '#f59e0b', isActive: true, stock: 10,
        },
    ],
};

function loadUserLoyalty(userId: string): UserLoyalty {
    const stored = localStorage.getItem(`loyalty_${userId}`);
    if (stored) return JSON.parse(stored);
    return {
        userId,
        coins: 0,
        tickets: 0,
        pendingTickets: 0,
        totalEarned: 0,
        transactions: [],
        lastVolumeResetDate: new Date().toDateString(),
        dailyVolumeAccumulated: 0,
    };
}

function saveUserLoyalty(loyalty: UserLoyalty) {
    localStorage.setItem(`loyalty_${loyalty.userId}`, JSON.stringify(loyalty));
}

// ─── Sub-components ────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string; sub?: string }> = ({ label, value, icon, color, sub }) => (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
            <div style={{ color }}>{icon}</div>
        </div>
        <div>
            <div className="text-[var(--text-primary)] font-black text-xl leading-none">{value}</div>
            <div className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest mt-0.5">{label}</div>
            {sub && <div className="text-[var(--text-dim)] text-[9px] mt-0.5">{sub}</div>}
        </div>
    </div>
);

// ─── Market Exchange Confirm ────────────────────────────────────────────────
const ConfirmModal: React.FC<{ item: MarketItem; onConfirm: () => void; onCancel: () => void; coinName: string }> = ({ item, onConfirm, onCancel, coinName }) => (
    <div className="fixed inset-0 z-[9600] flex items-center justify-center px-4 bg-[var(--bg-overlay)] backdrop-blur-md">
        <div className="w-full max-w-sm rounded-3xl p-6 text-center bg-[var(--bg-elevated)] border-[1.5px] border-[#f0b90b]/30 shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
            <div className="text-6xl mb-3 animate-bounce">{item.emoji}</div>
            <h3 className="text-[var(--text-primary)] font-black text-xl mb-1">{item.name}</h3>
            <p className="text-[var(--text-muted)] text-sm mb-4">{item.description}</p>
            <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-xl" style={{ background: 'rgba(240,185,11,0.08)', border: '1px solid rgba(240,185,11,0.2)' }}>
                <Coins className="w-4 h-4 text-[#f0b90b]" />
                <span className="text-[#f0b90b] font-black text-lg">{item.coinCost} {coinName}</span>
                <span className="text-[var(--text-muted)] text-sm">karşılığında</span>
            </div>
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-3 rounded-2xl font-black text-sm text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-all">İptal</button>
                <button onClick={onConfirm} className="flex-1 py-3 rounded-2xl font-black text-sm text-black transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)', boxShadow: '0 0 20px rgba(240,185,11,0.4)' }}>
                    Onayla & Al
                </button>
            </div>
        </div>
    </div>
);

// ─── Main LoyaltyPanel Component ─────────────────────────────────────────────
interface LoyaltyPanelProps {
    config: LoyaltyConfig;
    userId: string;
    onClose?: () => void;
}

const LoyaltyPanel: React.FC<LoyaltyPanelProps> = ({ config, userId, onClose }) => {
    const cfg = { ...DEFAULT_LOYALTY_CONFIG, ...config, rules: config.rules?.length ? config.rules : DEFAULT_LOYALTY_CONFIG.rules, marketItems: config.marketItems?.length ? config.marketItems : DEFAULT_LOYALTY_CONFIG.marketItems };
    const [loyalty, setLoyalty] = useState<UserLoyalty>(() => loadUserLoyalty(userId));
    const [activeTab, setActiveTab] = useState<'wallet' | 'tasks' | 'market' | 'history'>('wallet');
    const [confirmItem, setConfirmItem] = useState<MarketItem | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Deposit Request State
    // Deposit Request State
    const [depositUsername, setDepositUsername] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [depositDate, setDepositDate] = useState('');
    const [depositTicket, setDepositTicket] = useState('');

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    const addTransaction = (type: 'earn' | 'spend', amount: number, reason: string, tickets = 0) => {
        const tx: CoinTransaction = { id: String(Date.now()), userId, type, amount, tickets, reason, timestamp: Date.now() };
        const updated: UserLoyalty = {
            ...loyalty,
            coins: type === 'earn' ? loyalty.coins + amount : loyalty.coins - amount,
            tickets: type === 'earn' ? loyalty.tickets + tickets : loyalty.tickets,
            totalEarned: type === 'earn' ? loyalty.totalEarned + amount : loyalty.totalEarned,
            transactions: [tx, ...loyalty.transactions].slice(0, 50),
        };
        setLoyalty(updated);
        saveUserLoyalty(updated);
        return updated;
    };

    // Deposit Request Handler
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
                content: `Betlivo Bilet/Coin Talebi:\nKullanıcı Adı: ${depositUsername}\nYatırım Tutarı: ${depositAmount} TL\nTarih: ${depositDate}\nİstenilen Bilet No: ${depositTicket}\n\nKullanıcı hesabına sadakat puanı ve belirtilen bileti talep ediyor.`,
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

    // Simulate slot volume
    const handleVolume = () => {
        const rule = cfg.rules.find(r => r.triggerType === 'volume' && r.isActive);
        if (!rule) return;
        const todayStr = new Date().toDateString();
        const resetNeeded = loyalty.lastVolumeResetDate !== todayStr;
        const currentVolume = resetNeeded ? 0 : loyalty.dailyVolumeAccumulated;
        const newVolume = currentVolume + rule.thresholdAmount;
        const updated: UserLoyalty = { ...loyalty, dailyVolumeAccumulated: newVolume, lastVolumeResetDate: todayStr };
        if (newVolume >= rule.thresholdAmount) {
            const tx: CoinTransaction = { id: String(Date.now()), userId, type: 'earn', amount: rule.coinsAwarded, reason: `Günlük ${rule.thresholdAmount} TL Slot Hacim Görevi`, timestamp: Date.now() };
            const final: UserLoyalty = { ...updated, coins: loyalty.coins + rule.coinsAwarded, totalEarned: loyalty.totalEarned + rule.coinsAwarded, dailyVolumeAccumulated: 0, transactions: [tx, ...loyalty.transactions].slice(0, 50) };
            setLoyalty(final); saveUserLoyalty(final);
            showSuccess(`🎰 Günlük hacim görevi tamamlandı! +${rule.coinsAwarded} ${cfg.coinName}!`);
        } else {
            setLoyalty(updated); saveUserLoyalty(updated);
            showSuccess(`✅ ${newVolume.toLocaleString('tr')} / ${rule.thresholdAmount.toLocaleString('tr')} TL hacim birikiyor…`);
        }
    };

    // Buy from market
    const handleBuy = (item: MarketItem) => {
        if (loyalty.coins < item.coinCost) { showSuccess('❌ Yeterli Coin yok!'); return; }
        addTransaction('spend', item.coinCost, `Market: ${item.name} satın alındı`);
        setConfirmItem(null);
        showSuccess(`✅ ${item.name} başarıyla satın alındı! Destek ekibimiz 24 saat içinde tanımlayacaktır.`);
    };

    const depositRule = cfg.rules.find(r => r.triggerType === 'deposit');
    const volumeRule = cfg.rules.find(r => r.triggerType === 'volume');
    const todayStr = new Date().toDateString();
    const currentDailyVolume = loyalty.lastVolumeResetDate === todayStr ? loyalty.dailyVolumeAccumulated : 0;
    const volumePct = volumeRule ? Math.min(100, (currentDailyVolume / volumeRule.thresholdAmount) * 100) : 0;

    const tabs: { key: typeof activeTab; label: string; icon: React.ReactNode }[] = [
        { key: 'wallet', label: 'Cüzdan', icon: <Coins className="w-4 h-4" /> },
        { key: 'tasks', label: 'Görevler', icon: <Zap className="w-4 h-4" /> },
        { key: 'market', label: 'Market', icon: <ShoppingBag className="w-4 h-4" /> },
        { key: 'history', label: 'Geçmiş', icon: <TrendingUp className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen transition-colors duration-500 pb-20">
            {/* Success notification */}
            {successMsg && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9700] px-6 py-3 rounded-2xl font-black text-sm text-[var(--text-primary)] shadow-[var(--shadow-modal)] bg-[var(--bg-elevated)] border border-[#f0b90b]/40 transition-all"
                    style={{ animation: 'slideDown 0.3s ease' }}>
                    {successMsg}
                </div>
            )}

            {confirmItem && (
                <ConfirmModal item={confirmItem} coinName={cfg.coinName}
                    onConfirm={() => handleBuy(confirmItem)}
                    onCancel={() => setConfirmItem(null)} />
            )}

            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <Star className="w-5 h-5 text-[#f0b90b]" />
                            <h1 className="text-[var(--text-primary)] font-black text-xl tracking-tight">{cfg.programName}</h1>
                        </div>
                        <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">724bets.net × Betlivo Sadakat Sistemi</p>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Coin stats bar */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <StatCard label={cfg.coinName} value={loyalty.coins.toLocaleString('tr')} icon={<Coins className="w-5 h-5" />} color="#f0b90b" sub="Mevcut bakiye" />
                    <StatCard label="Çekiliş" value={loyalty.tickets} icon={<Ticket className="w-5 h-5" />} color="#3b82f6" sub="Bilet sayısı" />
                    <StatCard label="Toplam" value={loyalty.totalEarned.toLocaleString('tr')} icon={<Trophy className="w-5 h-5" />} color="#10b981" sub="Kazanılan coin" />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-2xl mb-5 bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all"
                            style={activeTab === t.key
                                ? { background: 'linear-gradient(135deg, #f0b90b, #d4a017)', color: '#000' }
                                : { color: 'var(--text-muted)' }}>
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {/* ── CÜZDAN ── */}
                {activeTab === 'wallet' && (
                    <div className="space-y-4">
                        {/* Deposit request form */}
                        {depositRule && depositRule.isActive && (
                            <div className="p-4 rounded-2xl space-y-3 bg-[#f0b90b]/5 border border-[#f0b90b]/15">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-[#f0b90b]/10 flex items-center justify-center"><Coins className="w-4 h-4 text-[#f0b90b]" /></div>
                                    <div>
                                        <div className="text-[var(--text-primary)] font-black text-sm">Talep Oluştur</div>
                                        <div className="text-[var(--text-muted)] text-[10px]">{depositRule.description}</div>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-2">
                                    <input type="text" placeholder="Betlivo Kullanıcı Adı" value={depositUsername}
                                        onChange={e => setDepositUsername(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-bold outline-none focus:border-[#f0b90b]/40 transition-colors"
                                    />
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="Yatırım" value={depositAmount}
                                            onChange={e => setDepositAmount(e.target.value)}
                                            className="w-1/3 px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-bold outline-none focus:border-[#f0b90b]/40 transition-colors"
                                        />
                                        <input type="datetime-local" placeholder="Tarih" value={depositDate}
                                            onChange={e => setDepositDate(e.target.value)}
                                            className="w-1/3 px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-[10px] font-bold outline-none focus:border-[#f0b90b]/40 transition-colors"
                                        />
                                        <input type="number" placeholder="Bilet No" value={depositTicket}
                                            onChange={e => setDepositTicket(e.target.value)}
                                            className="w-1/3 px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-bold outline-none focus:border-[#f0b90b]/40 transition-colors"
                                            min="1" max="200"
                                        />
                                    </div>
                                    <button onClick={handleDepositRequest}
                                        className="w-full py-2.5 rounded-xl font-black text-sm text-black transition-all hover:scale-105"
                                        style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)', boxShadow: '0 0 15px rgba(240,185,11,0.2)' }}>
                                        Talep Et
                                    </button>
                                </div>
                                <div className="text-[var(--text-dim)] text-[10px] text-center font-bold">Talebiniz incelendikten sonra biletleriniz yansır. Miktar: Her {depositRule.thresholdAmount} TL = {depositRule.coinsAwarded} {cfg.coinName} + {depositRule.ticketsAwarded} Bilet</div>
                            </div>
                        )}

                        {/* Volume progress */}
                        {volumeRule && volumeRule.isActive && (
                            <div className="p-4 rounded-2xl space-y-3 bg-indigo-500/5 border border-indigo-500/15">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center"><Zap className="w-4 h-4 text-indigo-400" /></div>
                                        <div>
                                            <div className="text-[var(--text-primary)] font-black text-sm">Günlük Slot Hacim</div>
                                            <div className="text-[var(--text-muted)] text-[10px]">Bugünkü ilerleme</div>
                                        </div>
                                    </div>
                                    <button onClick={handleVolume} title="Simüle Et"
                                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-indigo-500 font-black text-[10px] uppercase border border-indigo-500/20 hover:bg-indigo-500/10 transition-all">
                                        <RefreshCw className="w-3 h-3" /> Simüle
                                    </button>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-black">
                                        <span className="text-[var(--text-muted)]">{currentDailyVolume.toLocaleString('tr')} TL</span>
                                        <span className="text-indigo-400">{volumeRule.thresholdAmount.toLocaleString('tr')} TL hedef</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-[var(--bg-input)] overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${volumePct}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                                    </div>
                                    <div className="text-[var(--text-dim)] text-[10px] font-bold">Tamamlayınca +{volumeRule.coinsAwarded} {cfg.coinName}</div>
                                </div>
                            </div>
                        )}

                        {/* Quick market shortcut */}
                        <button onClick={() => setActiveTab('market')}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl group transition-all hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)]">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-[#f0b90b]" />
                                <div className="text-left">
                                    <div className="text-[var(--text-primary)] font-black text-sm">Bonus Market</div>
                                    <div className="text-[var(--text-muted)] text-[10px]">Coinleri nakit bonus veya freespin ile takas et</div>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[var(--text-dim)] group-hover:text-[var(--text-primary)] transition-colors" />
                        </button>
                    </div>
                )}

                {/* ── GÖREVLER ── */}
                {activeTab === 'tasks' && (
                    <div className="space-y-3">
                        {cfg.rules.map(rule => (
                            <div key={rule.id} className={`p-4 rounded-2xl bg-[var(--bg-card)] border ${rule.isActive ? 'border-[#f0b90b]/30' : 'border-[var(--border-subtle)]'}`}>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                                        style={{ background: rule.triggerType === 'deposit' ? 'rgba(240,185,11,0.1)' : 'rgba(99,102,241,0.1)' }}>
                                        {rule.triggerType === 'deposit' ? <Coins className="w-5 h-5 text-[#f0b90b]" /> : <Zap className="w-5 h-5 text-indigo-400" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[var(--text-primary)] font-black text-sm">{rule.name}</span>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${rule.isActive ? 'bg-green-500/10 text-green-500' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'}`}>
                                                {rule.isActive ? 'AKTİF' : 'DEVRE DIŞI'}
                                            </span>
                                        </div>
                                        <p className="text-[var(--text-muted)] text-xs font-bold">{rule.description}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[#f0b90b] text-[10px] font-black">+{rule.coinsAwarded} {cfg.coinName}</span>
                                            {rule.ticketsAwarded > 0 && <span className="text-blue-400 text-[10px] font-black">+{rule.ticketsAwarded} Bilet</span>}
                                            <span className="text-[var(--text-dim)] text-[10px]">Her {rule.thresholdAmount.toLocaleString('tr')} TL'de</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="px-4 py-3 rounded-xl text-center bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                            <p className="text-[var(--text-dim)] text-xs font-bold">Görevler otomatik olarak tetiklenir. "Cüzdan" sekmesinden simüle edebilirsiniz.</p>
                        </div>
                    </div>
                )}

                {/* ── MARKET ── */}
                {activeTab === 'market' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">Mevcut Bakiye</p>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0b90b]/10 border border-[#f0b90b]/20">
                                <Coins className="w-3.5 h-3.5 text-[#f0b90b]" />
                                <span className="text-[#f0b90b] font-black text-sm">{loyalty.coins.toLocaleString('tr')} {cfg.coinName}</span>
                            </div>
                        </div>
                        {cfg.marketItems.filter(i => i.isActive).map(item => {
                            const canAfford = loyalty.coins >= item.coinCost;
                            return (
                                <div key={item.id} className={`flex items-center gap-4 p-4 rounded-2xl transition-all bg-[var(--bg-card)] border ${canAfford ? 'border-[var(--border-hover)]' : 'border-[var(--border-subtle)]'}`} style={{ opacity: canAfford ? 1 : 0.6 }}>
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${item.color}15` }}>
                                        {item.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[var(--text-primary)] font-black text-sm">{item.name}</div>
                                        <div className="text-[var(--text-muted)] text-[10px] font-bold">{item.description}</div>
                                        {item.stock !== -1 && <div className="text-orange-500 text-[10px] font-black mt-0.5">Stok: {item.stock}</div>}
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <div className="flex items-center gap-1">
                                            <Coins className="w-3.5 h-3.5 text-[#f0b90b]" />
                                            <span className="text-[#f0b90b] font-black text-sm">{item.coinCost}</span>
                                        </div>
                                        <button
                                            onClick={() => canAfford ? setConfirmItem(item) : showSuccess('❌ Yeterli Coin yok!')}
                                            className={`px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all ${canAfford ? 'hover:scale-105' : 'cursor-not-allowed'}`}
                                            style={canAfford
                                                ? { background: 'linear-gradient(135deg, #f0b90b, #d4a017)', color: '#000' }
                                                : { background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                                            {canAfford ? 'Al' : 'Yetersiz'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── HISTORY ── */}
                {activeTab === 'history' && (
                    <div className="space-y-2">
                        {loyalty.transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <Clock className="w-10 h-10 text-[var(--text-dim)]" />
                                <p className="text-[var(--text-muted)] font-bold text-sm">Henüz işlem yok</p>
                            </div>
                        ) : loyalty.transactions.map(tx => (
                            <div key={tx.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: tx.type === 'earn' ? 'rgba(16,185,129,0.1)' : 'rgba(240,185,11,0.1)' }}>
                                    {tx.type === 'earn' ? <TrendingUp className="w-4 h-4 text-green-500" /> : <ShoppingBag className="w-4 h-4 text-[#f0b90b]" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[var(--text-primary)] font-bold text-xs truncate">{tx.reason}</div>
                                    <div className="text-[var(--text-dim)] text-[10px]">{new Date(tx.timestamp).toLocaleString('tr-TR')}</div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-black text-sm ${tx.type === 'earn' ? 'text-green-500' : 'text-orange-500'}`}>
                                        {tx.type === 'earn' ? '+' : '-'}{tx.amount} {cfg.coinName}
                                    </div>
                                    {tx.tickets && tx.tickets > 0 ? <div className="text-blue-500 text-[10px] font-black">+{tx.tickets} Bilet</div> : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes slideDown {
          from { transform: translate(-50%, -20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default LoyaltyPanel;
