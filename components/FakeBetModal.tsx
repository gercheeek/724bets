import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Wallet, X } from 'lucide-react';

interface FakeBetModalProps {
    isOpen: boolean;
    onClose: () => void;
    userBalance: number;
    onSubmit: (amount: number) => Promise<void>;
}

type BetMatch = {
  matchName: string;
  market: string;
  odds: number;
};

type BetSlipData = {
  matches: BetMatch[];
  totalOdds: number;
  potentialWin?: number;
};

const DEFAULT_MOCK_DATA: BetSlipData = {
  matches: [
    { matchName: 'İspanya vs Belçika', market: 'Maç Sonucu: 1', odds: 1.66 },
    { matchName: 'Fransa vs Fas', market: 'Maç Sonucu: 1', odds: 1.64 },
    { matchName: 'Norveç vs İngiltere', market: 'Turu Kim Geçer ?: Takım 1', odds: 2.70 }
  ],
  totalOdds: 7.35
};

const FakeBetModal: React.FC<FakeBetModalProps> = ({ isOpen, onClose, userBalance, onSubmit }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [betData, setBetData] = useState<BetSlipData | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        // Reset state on open
        setAmount('');
        setError('');
        setSuccess('');
        setBetData(DEFAULT_MOCK_DATA); // Start with mock data, override if message received

        const handleMessage = (event: MessageEvent) => {
            // Listen for postMessage from iframe
            try {
                if (event.data && event.data.type === 'BETSLIP_UPDATE') {
                    setBetData(event.data.payload);
                }
            } catch (e) {
                // Ignore parse errors
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [isOpen]);

    if (!isOpen) return null;

    const parsedAmount = parseFloat(amount) || 0;
    const potentialWin = betData ? (parsedAmount * betData.totalOdds) : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (parsedAmount <= 0) {
            setError('Lütfen geçerli bir tutar giriniz.');
            return;
        }

        if (parsedAmount > userBalance) {
            setError('Bakiyeniz yetersiz.');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(parsedAmount);
            setSuccess(`✅ Bahisiniz başarıyla yatırılmıştır! (-${parsedAmount.toFixed(2)} ₺)`);
            setTimeout(() => {
                onClose();
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
            <div className="relative w-full max-w-sm bg-[#0F172A] border border-zinc-800/50 rounded-lg shadow-2xl overflow-hidden animate-fade-in-up">
                
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
                <div className="p-5 space-y-4">
                    {/* Matches List */}
                    {betData && betData.matches.length > 0 && (
                        <div className="space-y-2 max-h-[220px] overflow-y-auto hide-scrollbar pr-1">
                            {betData.matches.map((match, idx) => (
                                <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-3 flex justify-between items-center group hover:bg-black/60 transition-colors">
                                    <div className="flex flex-col gap-1 w-[70%]">
                                        <span className="text-white text-xs font-bold truncate">{match.matchName}</span>
                                        <span className="text-zinc-400 text-[10px] truncate">{match.market}</span>
                                    </div>
                                    <div className="w-[30%] text-right">
                                        <span className="text-emerald-400 font-black text-sm">{match.odds.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Odds & Win Info */}
                    {betData && (
                        <div className="flex items-center justify-between text-xs font-bold bg-slate-900/50 px-3 py-2 rounded-lg border border-white/5">
                            <span className="text-zinc-400">Toplam Oran:</span>
                            <span className="text-emerald-400 font-mono text-sm">{betData.totalOdds.toFixed(2)}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="flex items-center justify-between text-xs font-bold text-zinc-400 bg-slate-900/50 px-3 py-2 rounded-lg">
                            <span>Mevcut Bakiye:</span>
                            <span className="text-emerald-400 font-mono">{userBalance.toFixed(2)} ₺</span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-zinc-400">Yatırmak İstediğiniz Tutar (₺)</label>
                                {parsedAmount > 0 && betData && (
                                    <span className="text-[10px] text-zinc-500 font-medium">Kazanç: <span className="text-emerald-400 font-bold">{potentialWin.toFixed(2)} ₺</span></span>
                                )}
                            </div>
                            <div className="relative">
                                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={loading || !!success}
                                    className="w-full bg-slate-900 border border-zinc-700 text-white font-bold text-sm rounded-lg pl-10 pr-4 py-3 outline-none focus:border-emerald-500/50 transition-all"
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && <div className="text-red-400 text-[11px] font-bold bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">{error}</div>}
                        {success && <div className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 text-center">{success}</div>}

                        <button 
                            type="submit" 
                            disabled={loading || !!success}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'BAHİS YAP'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default FakeBetModal;
