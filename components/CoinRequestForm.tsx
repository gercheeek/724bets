import React, { useState } from 'react';
import { CoinRequest } from '../types';
import { Coins, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const REQUESTS_KEY = 'site_coin_requests';

function loadRequests(): CoinRequest[] {
    try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]'); } catch { return []; }
}
function saveRequests(r: CoinRequest[]) { localStorage.setItem(REQUESTS_KEY, JSON.stringify(r)); }

interface CoinRequestFormProps {
    userId: string;
    username: string;
    onClose?: () => void;
}

const CoinRequestForm: React.FC<CoinRequestFormProps> = ({ userId, username, onClose }) => {
    const [siteName, setSiteName] = useState('');
    const [amount, setAmount] = useState(0);
    const [transactionId, setTransactionId] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [myRequests] = useState<CoinRequest[]>(() => loadRequests().filter(r => r.userId === userId));

    const handleSubmit = () => {
        if (!siteName || amount <= 0 || !transactionId) return;

        const request: CoinRequest = {
            id: `cr-${Date.now()}`,
            userId,
            username,
            siteName,
            amount,
            transactionId,
            coinAmount: amount, // 1 Coin = 1 TL
            status: 'pending',
            createdAt: Date.now(),
        };

        const all = loadRequests();
        all.unshift(request);
        saveRequests(all);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="bg-[#0e0e0e] rounded-2xl p-8 text-center max-w-md mx-auto">
                <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-black text-xl uppercase mb-2">Talebiniz Alındı!</h3>
                <p className="text-zinc-500 text-sm font-bold mb-6">Yönetici incelemesi sonrası Coin bakiyenize eklenecektir.</p>
                {onClose && <button onClick={onClose} className="px-6 py-3 bg-zinc-800 text-white rounded-xl font-bold text-sm hover:bg-zinc-700 transition-all">TAMAM</button>}
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div className="text-center mb-2">
                <Coins className="w-12 h-12 text-[#f0b90b] mx-auto mb-3" />
                <h3 className="text-white font-black text-2xl uppercase tracking-tight">Coin Talep Et</h3>
                <p className="text-zinc-500 text-sm font-bold mt-1">Harici siteye yaptığınız yatırımı bildirin. (1 Coin = 1 TL)</p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-yellow-400 text-xs font-bold">Yatırım bilgileriniz yönetici tarafından doğrulandıktan sonra Coin bakiyenize eklenecektir.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs text-zinc-500 font-black uppercase tracking-widest block mb-2">Site Adı</label>
                    <select value={siteName} onChange={e => setSiteName(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm font-bold">
                        <option value="">Site seçin...</option>
                        <option value="724BAHİS.NET">724BAHİS.NET</option>
                        <option value="Betkom">Betkom</option>
                        <option value="Marsbahis">Marsbahis</option>
                        <option value="Diğer">Diğer</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs text-zinc-500 font-black uppercase tracking-widest block mb-2">Yatırım Miktarı (TL)</label>
                    <input type="number" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} placeholder="500" className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm font-bold" />
                </div>
                <div>
                    <label className="text-xs text-zinc-500 font-black uppercase tracking-widest block mb-2">İşlem ID / Referans No</label>
                    <input value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="TX12345..." className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm font-bold" />
                </div>
            </div>

            {amount > 0 && (
                <div className="bg-[#f0b90b]/10 border border-[#f0b90b]/30 rounded-xl p-4 text-center">
                    <p className="text-zinc-400 text-xs font-bold">Kazanılacak Coin</p>
                    <p className="text-3xl font-black text-[#f0b90b]">{amount} Coin</p>
                </div>
            )}

            <button onClick={handleSubmit} disabled={!siteName || amount <= 0 || !transactionId} className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${siteName && amount > 0 && transactionId ? 'bg-[#f0b90b] text-black hover:shadow-[0_0_30px_rgba(240,185,11,0.4)]' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'}`}>
                <Send className="w-4 h-4" /> TALEP GÖNDER
            </button>

            {/* Past Requests */}
            {myRequests.length > 0 && (
                <div className="space-y-2 mt-8">
                    <h4 className="text-xs text-zinc-500 font-black uppercase tracking-widest">GEÇMİŞ TALEPLERİNİZ</h4>
                    {myRequests.map(r => (
                        <div key={r.id} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                            <div>
                                <p className="text-white text-xs font-bold">{r.siteName} — {r.amount} TL</p>
                                <p className="text-zinc-600 text-[10px]">{new Date(r.createdAt).toLocaleString('tr-TR')}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : r.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {r.status === 'pending' ? '⏳ Bekliyor' : r.status === 'approved' ? '✅ Onaylandı' : '❌ Reddedildi'}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoinRequestForm;
