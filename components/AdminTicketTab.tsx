import React, { useState } from 'react';
import { TicketEventConfig, TicketSiteRequirement } from '../types';
import { Ticket, CheckCircle2, XCircle, Plus, Trash2, Trophy } from 'lucide-react';

const EVENT_KEY = 'site_ticket_event';

function loadEvent(): TicketEventConfig | null {
    try { const d = localStorage.getItem(EVENT_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}
function saveEvent(e: TicketEventConfig) { localStorage.setItem(EVENT_KEY, JSON.stringify(e)); }

const AdminTicketTab: React.FC = () => {
    const [event, setEvent] = useState<TicketEventConfig | null>(loadEvent());
    const [periodDays, setPeriodDays] = useState(event?.periodDays || 15);
    const [entryCost, setEntryCost] = useState(event?.entryCost || 200);
    const [requirements, setRequirements] = useState<TicketSiteRequirement[]>(event?.siteRequirements || []);
    const [winnerInput, setWinnerInput] = useState('');
    const [msg, setMsg] = useState('');

    const showMsg = (t: string) => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

    const addRequirement = () => {
        setRequirements([...requirements, { siteName: '', minVolume: 500 }]);
    };

    const updateRequirement = (idx: number, field: keyof TicketSiteRequirement, value: string | number) => {
        const updated = [...requirements];
        updated[idx] = { ...updated[idx], [field]: value };
        setRequirements(updated);
    };

    const removeRequirement = (idx: number) => setRequirements(requirements.filter((_, i) => i !== idx));

    const handleCreate = () => {
        const newEvent: TicketEventConfig = {
            id: `te-${Date.now()}`,
            periodDays,
            entryCost,
            siteRequirements: requirements,
            currentPeriodStart: Date.now(),
            status: 'active',
            requests: [],
            createdAt: Date.now(),
        };
        saveEvent(newEvent);
        setEvent(newEvent);
        showMsg('Bilet etkinliği başarıyla oluşturuldu!');
    };

    const handleApproveRequest = (reqId: string) => {
        if (!event) return;
        const updated = {
            ...event,
            requests: event.requests.map(r => r.id === reqId ? { ...r, status: 'approved' as const, processedAt: Date.now() } : r)
        };
        // Add ticket to user's loyalty data
        const req = updated.requests.find(r => r.id === reqId);
        if (req) {
            const key = `loyalty_${req.userId}`;
            const d = JSON.parse(localStorage.getItem(key) || '{"tickets":0}');
            d.tickets = (d.tickets || 0) + 1;
            localStorage.setItem(key, JSON.stringify(d));
        }
        saveEvent(updated);
        setEvent(updated);
        showMsg('Bilet başvurusu onaylandı!');
    };

    const handleRejectRequest = (reqId: string) => {
        if (!event) return;
        const updated = {
            ...event,
            requests: event.requests.map(r => r.id === reqId ? { ...r, status: 'rejected' as const, processedAt: Date.now(), adminNote: 'Reddedildi' } : r)
        };
        // Refund coins
        const req = updated.requests.find(r => r.id === reqId);
        if (req) {
            const key = `loyalty_${req.userId}`;
            const d = JSON.parse(localStorage.getItem(key) || '{"coins":0}');
            d.coins = (d.coins || 0) + entryCost;
            d.transactions = d.transactions || [];
            d.transactions.unshift({ id: `tx-${Date.now()}`, userId: req.userId, type: 'earn', amount: entryCost, reason: 'Bilet başvurusu reddedildi — iade', timestamp: Date.now() });
            localStorage.setItem(key, JSON.stringify(d));
        }
        saveEvent(updated);
        setEvent(updated);
        showMsg('Bilet başvurusu reddedildi, Coin iade edildi.');
    };

    const handleSetWinner = () => {
        if (!event || !winnerInput.trim()) return;
        const winners = winnerInput.split(',').map(w => {
            const parts = w.trim().split(':');
            return { userId: parts[0] || '', username: parts[0] || '', prize: parts[1] || 'Ödül' };
        });
        const updated = { ...event, status: 'completed' as const, winners };
        saveEvent(updated);
        setEvent(updated);
        setWinnerInput('');
        showMsg('Kazananlar belirlendi!');
    };

    const handleReset = () => {
        if (!confirm('Etkinliği sıfırlamak istediğinize emin misiniz?')) return;
        localStorage.removeItem(EVENT_KEY);
        setEvent(null);
        showMsg('Etkinlik sıfırlandı.');
    };

    const pendingReqs = event?.requests.filter(r => r.status === 'pending') || [];
    const approvedReqs = event?.requests.filter(r => r.status === 'approved') || [];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black flex items-center gap-3"><Ticket className="w-6 h-6 text-[#f0b90b]" /> BİLET ETKİNLİĞİ YÖNETİMİ</h2>
                {event && (
                    <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 rounded-xl text-xs font-bold border border-red-500/30 hover:bg-red-500/30 transition-all">
                        SIFIRLA
                    </button>
                )}
            </div>

            {msg && <div className="bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-sm p-4 rounded-xl">{msg}</div>}

            {/* Active Event Status */}
            {event && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                            <p className="text-xs text-zinc-500 font-bold">Durum</p>
                            <p className={`text-lg font-black uppercase ${event.status === 'active' ? 'text-green-400' : event.status === 'drawing' ? 'text-yellow-400' : 'text-blue-400'}`}>{event.status}</p>
                        </div>
                        <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                            <p className="text-xs text-zinc-500 font-bold">Periyot</p>
                            <p className="text-lg font-black text-white">{event.periodDays} Gün</p>
                        </div>
                        <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                            <p className="text-xs text-zinc-500 font-bold">Giriş Ücreti</p>
                            <p className="text-lg font-black text-[#f0b90b]">{event.entryCost} Coin</p>
                        </div>
                        <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                            <p className="text-xs text-zinc-500 font-bold">Başvuru</p>
                            <p className="text-lg font-black text-white">{event.requests.length}</p>
                        </div>
                    </div>

                    {/* Site Requirements */}
                    <div className="mt-6">
                        <h4 className="text-xs text-zinc-500 font-black uppercase tracking-widest mb-3">ÇEVRİM ŞARTLARI</h4>
                        {event.siteRequirements.map((req, i) => (
                            <div key={i} className="flex items-center gap-3 bg-zinc-950 rounded-lg p-2 mb-1 border border-zinc-800">
                                <span className="text-white text-sm font-bold flex-1">{req.siteName}</span>
                                <span className="text-[#f0b90b] text-sm font-bold">{req.minVolume} TL min çevrim</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pending Requests */}
            {event && pendingReqs.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-yellow-400 uppercase tracking-widest mb-4">⏳ ONAY BEKLEYEN BAŞVURULAR ({pendingReqs.length})</h3>
                    <div className="space-y-2">
                        {pendingReqs.map(req => (
                            <div key={req.id} className="flex items-center gap-4 bg-zinc-950 rounded-xl p-4 border border-zinc-800">
                                <div className="flex-1">
                                    <p className="text-white font-bold text-sm">{req.username}</p>
                                    <p className="text-zinc-600 text-[10px]">{new Date(req.createdAt).toLocaleString('tr-TR')}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleApproveRequest(req.id)} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold border border-green-500/30 hover:bg-green-500/30 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> ONAYLA
                                    </button>
                                    <button onClick={() => handleRejectRequest(req.id)} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/30 hover:bg-red-500/30 flex items-center gap-1.5">
                                        <XCircle className="w-3.5 h-3.5" /> REDDET
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Set Winners */}
            {event && event.status === 'active' && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">ÇEKİLİŞ SONUÇLARI</h3>
                    <p className="text-zinc-500 text-xs font-bold mb-3">Kazananları "kullanıcıAdı:ödül" formatında virgülle ayırarak girin.</p>
                    <div className="flex gap-3">
                        <input value={winnerInput} onChange={e => setWinnerInput(e.target.value)} placeholder="user1:iPhone 15, user2:1000 TL" className="flex-1 bg-black border border-zinc-800 rounded-xl p-3 text-sm" />
                        <button onClick={handleSetWinner} className="px-6 py-3 bg-[#f0b90b] text-black rounded-xl font-bold text-xs hover:bg-[#f0b90b]/90 transition-all flex items-center gap-2">
                            <Trophy className="w-4 h-4" /> KAZANANLARI BELİRLE
                        </button>
                    </div>
                </div>
            )}

            {/* Winners Display */}
            {event?.winners && event.winners.length > 0 && (
                <div className="bg-gradient-to-r from-[#0a0800] to-[#120d00] border border-[#f0b90b]/30 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-[#f0b90b] uppercase tracking-widest mb-4">🏆 KAZANANLAR</h3>
                    {event.winners.map((w, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                            <span className="text-white font-bold">{w.username}</span>
                            <span className="text-[#f0b90b] font-black">{w.prize}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Create New Event */}
            {!event && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">YENİ ETKİNLİK OLUŞTUR</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-zinc-500 font-bold block mb-1">Periyot (gün)</label>
                            <input type="number" value={periodDays} onChange={e => setPeriodDays(Number(e.target.value))} className="w-full bg-black border border-zinc-800 rounded-xl p-3 font-bold" />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500 font-bold block mb-1">Giriş Ücreti (Coin)</label>
                            <input type="number" value={entryCost} onChange={e => setEntryCost(Number(e.target.value))} className="w-full bg-black border border-zinc-800 rounded-xl p-3 font-bold" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs text-zinc-500 font-black uppercase tracking-widest">Site Çevrim Şartları</label>
                            <button onClick={addRequirement} className="flex items-center gap-1 px-3 py-1.5 bg-[#f0b90b] text-black rounded-lg text-xs font-bold">
                                <Plus className="w-3 h-3" /> EKLE
                            </button>
                        </div>
                        {requirements.map((req, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-2">
                                <input value={req.siteName} onChange={e => updateRequirement(idx, 'siteName', e.target.value)} placeholder="Site adı" className="flex-1 bg-black border border-zinc-800 rounded-lg p-2 text-sm" />
                                <input type="number" value={req.minVolume} onChange={e => updateRequirement(idx, 'minVolume', Number(e.target.value))} placeholder="Min TL" className="w-32 bg-black border border-zinc-800 rounded-lg p-2 text-sm" />
                                <button onClick={() => removeRequirement(idx)} className="text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleCreate} className="w-full py-4 bg-[#f0b90b] text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(240,185,11,0.4)] transition-all">
                        ETKİNLİĞİ BAŞLAT
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminTicketTab;
