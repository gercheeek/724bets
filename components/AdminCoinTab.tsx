import React, { useState } from 'react';
import { CoinRequest } from '../types';
import { CheckCircle2, XCircle, Coins, TrendingUp, TrendingDown } from 'lucide-react';

const REQUESTS_KEY = 'site_coin_requests';

function loadRequests(): CoinRequest[] {
    try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]'); } catch { return []; }
}
function saveRequests(r: CoinRequest[]) { localStorage.setItem(REQUESTS_KEY, JSON.stringify(r)); }

function addCoinsToUser(userId: string, amount: number, reason: string) {
    const key = `loyalty_${userId}`;
    const d = JSON.parse(localStorage.getItem(key) || '{"coins":0,"tickets":0,"pendingTickets":0,"totalEarned":0,"transactions":[],"lastVolumeResetDate":"","dailyVolumeAccumulated":0}');
    d.coins = (d.coins || 0) + amount;
    d.totalEarned = (d.totalEarned || 0) + amount;
    d.transactions = d.transactions || [];
    d.transactions.unshift({ id: `tx-${Date.now()}`, userId, type: 'earn', amount, reason, timestamp: Date.now() });
    localStorage.setItem(key, JSON.stringify(d));
}

function removeCoinsFromUser(userId: string, amount: number, reason: string): boolean {
    const key = `loyalty_${userId}`;
    const d = JSON.parse(localStorage.getItem(key) || '{"coins":0}');
    if ((d.coins || 0) < amount) return false;
    d.coins = (d.coins || 0) - amount;
    d.transactions = d.transactions || [];
    d.transactions.unshift({ id: `tx-${Date.now()}`, userId, type: 'spend', amount, reason, timestamp: Date.now() });
    localStorage.setItem(key, JSON.stringify(d));
    return true;
}

const AdminCoinTab: React.FC = () => {
    const [requests, setRequests] = useState<CoinRequest[]>(loadRequests());
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [manualUserId, setManualUserId] = useState('');
    const [manualAmount, setManualAmount] = useState(0);
    const [manualReason, setManualReason] = useState('');
    const [manualMode, setManualMode] = useState<'add' | 'remove'>('add');
    const [msg, setMsg] = useState('');

    const showMsg = (t: string) => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

    const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

    const handleApprove = (id: string, note?: string) => {
        const updated = requests.map(r => {
            if (r.id !== id) return r;
            addCoinsToUser(r.userId, r.coinAmount, `Coin talebi onaylandı (${r.siteName} - ${r.amount} TL)`);
            return { ...r, status: 'approved' as const, processedAt: Date.now(), adminNote: note };
        });
        saveRequests(updated);
        setRequests(updated);
        showMsg('Talep onaylandı, Coin eklendi!');
    };

    const handleReject = (id: string, note?: string) => {
        const updated = requests.map(r => r.id === id ? { ...r, status: 'rejected' as const, processedAt: Date.now(), adminNote: note || 'Reddedildi' } : r);
        saveRequests(updated);
        setRequests(updated);
        showMsg('Talep reddedildi.');
    };

    const handleManual = () => {
        if (!manualUserId || manualAmount <= 0) { showMsg('Geçerli kullanıcı ID ve miktar girin.'); return; }
        if (manualMode === 'add') {
            addCoinsToUser(manualUserId, manualAmount, manualReason || 'Admin tarafından eklendi');
            showMsg(`${manualAmount} Coin eklendi!`);
        } else {
            const ok = removeCoinsFromUser(manualUserId, manualAmount, manualReason || 'Admin tarafından çıkarıldı');
            showMsg(ok ? `${manualAmount} Coin çıkarıldı!` : 'Yetersiz bakiye!');
        }
        setManualUserId('');
        setManualAmount(0);
        setManualReason('');
    };

    // Financial summary
    const totalApproved = requests.filter(r => r.status === 'approved').reduce((s, r) => s + r.coinAmount, 0);
    const totalPending = requests.filter(r => r.status === 'pending').reduce((s, r) => s + r.coinAmount, 0);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-black flex items-center gap-3"><Coins className="w-6 h-6 text-[#f0b90b]" /> COİN TALEPLERİ YÖNETİMİ</h2>

            {msg && <div className="bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-sm p-4 rounded-xl">{msg}</div>}

            {/* Financial Summary */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
                    <p className="text-xs text-zinc-500 font-black uppercase tracking-widest mb-1">Onaylanan Toplam</p>
                    <p className="text-2xl font-black text-green-400">{totalApproved.toLocaleString('tr-TR')} Coin</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
                    <p className="text-xs text-zinc-500 font-black uppercase tracking-widest mb-1">Bekleyen Toplam</p>
                    <p className="text-2xl font-black text-yellow-400">{totalPending.toLocaleString('tr-TR')} Coin</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
                    <p className="text-xs text-zinc-500 font-black uppercase tracking-widest mb-1">Toplam Talep</p>
                    <p className="text-2xl font-black text-white">{requests.length}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#f0b90b] text-black' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:bg-zinc-800'}`}>
                        {f === 'pending' ? '⏳ BEKLEYEN' : f === 'approved' ? '✅ ONAYLANAN' : f === 'rejected' ? '❌ REDDEDİLEN' : '📋 TÜMÜ'}
                    </button>
                ))}
            </div>

            {/* Request List */}
            <div className="space-y-2">
                {filtered.length === 0 ? (
                    <div className="text-center py-12"><p className="text-zinc-500 font-bold">Bu kategoride talep bulunamadı.</p></div>
                ) : (
                    filtered.map(req => (
                        <div key={req.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="flex-1">
                                <p className="text-white font-bold text-sm">{req.username}</p>
                                <p className="text-zinc-500 text-xs font-bold mt-1">
                                    Site: <span className="text-[#f0b90b]">{req.siteName}</span> · Miktar: <span className="text-white">{req.amount} TL</span> · İşlem ID: <span className="text-zinc-300">{req.transactionId}</span>
                                </p>
                                <p className="text-zinc-600 text-[10px] mt-1">{new Date(req.createdAt).toLocaleString('tr-TR')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {req.status === 'pending' ? (
                                    <>
                                        <button onClick={() => handleApprove(req.id)} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold border border-green-500/30 hover:bg-green-500/30 transition-all flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> ONAYLA
                                        </button>
                                        <button onClick={() => handleReject(req.id)} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/30 hover:bg-red-500/30 transition-all flex items-center gap-1.5">
                                            <XCircle className="w-3.5 h-3.5" /> REDDET
                                        </button>
                                    </>
                                ) : (
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${req.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {req.status === 'approved' ? '✅ Onaylandı' : '❌ Reddedildi'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Manual Coin Management */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">MANUEL COİN YÖNETİMİ</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input value={manualUserId} onChange={e => setManualUserId(e.target.value)} placeholder="Kullanıcı ID" className="bg-black border border-zinc-800 rounded-xl p-3 text-sm" />
                    <input type="number" value={manualAmount || ''} onChange={e => setManualAmount(Number(e.target.value))} placeholder="Miktar" className="bg-black border border-zinc-800 rounded-xl p-3 text-sm" />
                    <input value={manualReason} onChange={e => setManualReason(e.target.value)} placeholder="Sebep (opsiyonel)" className="bg-black border border-zinc-800 rounded-xl p-3 text-sm" />
                    <div className="flex gap-2">
                        <button onClick={() => { setManualMode('add'); handleManual(); }} className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-xl text-xs font-bold border border-green-500/30 hover:bg-green-500/30 transition-all flex items-center justify-center gap-1.5">
                            <TrendingUp className="w-4 h-4" /> EKLE
                        </button>
                        <button onClick={() => { setManualMode('remove'); handleManual(); }} className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-xl text-xs font-bold border border-red-500/30 hover:bg-red-500/30 transition-all flex items-center justify-center gap-1.5">
                            <TrendingDown className="w-4 h-4" /> ÇIKAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCoinTab;
