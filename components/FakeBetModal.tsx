import React, { useState } from 'react';
import { Loader2, CheckCircle2, Wallet, X } from 'lucide-react';

interface FakeBetModalProps {
    isOpen: boolean;
    onClose: () => void;
    userBalance: number;
    onSubmit: (amount: number) => Promise<void>;
}

const FakeBetModal: React.FC<FakeBetModalProps> = ({ isOpen, onClose, userBalance, onSubmit }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) {
            setError('Lütfen geçerli bir tutar giriniz.');
            return;
        }

        if (val > userBalance) {
            setError('Bakiyeniz yetersiz.');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(val);
            setSuccess(`✅ Bahisiniz başarıyla yatırılmıştır! (-${val.toFixed(2)} ₺)`);
            setTimeout(() => {
                onClose();
                setAmount('');
                setSuccess('');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Bahis işlemi başarısız.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !loading && onClose()}></div>
            <div className="relative w-full max-w-sm bg-[#0F172A] border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                
                {/* Header */}
                <div className="bg-slate-900/50 px-5 py-4 border-b border-zinc-800/50 flex justify-between items-center">
                    <h3 className="text-white font-black uppercase tracking-wider text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Kuponu Onayla
                    </h3>
                    <button onClick={onClose} disabled={loading} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-400 bg-slate-900/50 px-3 py-2 rounded-xl">
                        <span>Mevcut Bakiye:</span>
                        <span className="text-emerald-400 font-mono">{userBalance.toFixed(2)} ₺</span>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400">Yatırmak İstediğiniz Tutar (₺)</label>
                        <div className="relative">
                            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                            <input 
                                type="number" 
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={loading || !!success}
                                className="w-full bg-slate-900 border border-zinc-700 text-white font-bold text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500/50 transition-all"
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-400 text-[11px] font-bold bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/20">{error}</div>}
                    {success && <div className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20 text-center">{success}</div>}

                    <button 
                        type="submit" 
                        disabled={loading || !!success}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'BAHİS YAP'}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default FakeBetModal;
