import React, { useState } from 'react';
import { AlertTriangle, Save, ShieldAlert, Lock, CheckCircle2, X, Activity } from 'lucide-react';

export default function AdminRiskTab() {
    const [rtp, setRtp] = useState(95);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/admin/dashboard-stats');
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                }
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSaveRequest = () => {
        setIsModalOpen(true);
        setPin('');
        setError('');
        setSuccess(false);
    };

    const handleConfirm = () => {
        if (pin === '0000000000') {
            setSuccess(true);
            setTimeout(() => {
                setIsModalOpen(false);
                setSuccess(false);
                // In a real app, save to backend here
                console.log('Global RTP updated to:', rtp);
            }, 1500);
        } else {
            setError('Geçersiz Master PIN. İşlem reddedildi.');
        }
    };

    return (
        <div className="p-4 sm:p-6 text-white space-y-6 relative">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/50">
                    <ShieldAlert className="w-6 h-6 text-red-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-red-400 tracking-wide uppercase">Risk & Kar Yönetimi</h2>
                    <p className="text-sm text-gray-400">Sitenin genel kazandırma oranlarını (RTP) buradan ayarlayabilirsiniz.</p>
                </div>
            </div>

            {/* RTP Control Panel */}
            <div className="bg-[#1a1c24] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-red-500/10 transition-all"></div>
                
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-400" />
                    Global RTP (Return To Player) Oranı
                </h3>

                <div className="space-y-8">
                    <div className="flex items-center gap-6">
                        <div className="flex-1">
                            <div className="relative w-full">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-lg bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)] pointer-events-none" style={{ width: `${((rtp - 90) / 9) * 100}%` }}></div>
                                <input 
                                    type="range" 
                                    min="90" 
                                    max="99" 
                                    step="0.1"
                                    value={rtp}
                                    onChange={(e) => setRtp(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-[#111216] rounded-lg appearance-none cursor-pointer outline-none relative z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(239,68,68,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white transition-all bg-transparent"
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                                <span>%90.0 (Max Kar)</span>
                                <span>%99.0 (Max Oyuncu)</span>
                            </div>
                        </div>
                        <div className="w-24 bg-red-500/10 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] rounded-xl px-3 py-2 text-center flex items-center justify-center">
                            <span className="text-2xl font-black text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">%{rtp.toFixed(1)}</span>
                        </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-sm text-red-200">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                        <p><strong>Dikkat:</strong> Bu değeri değiştirmek sitenin tüm oyunlarındaki genel kazandırma algoritmasını anında etkiler. Kar marjınızı doğrudan belirler.</p>
                    </div>

                    <button 
                        onClick={handleSaveRequest}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-pulse hover:animate-none transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                        <Save className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Değişiklikleri Uygula</span>
                    </button>
                </div>
            </div>

            {/* Live Liability Radar */}
            <div className="bg-[#1a1c24] border border-red-500/20 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.05)]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
                        Aktif Risk Radarı (Canlı)
                    </h3>
                    <span className="text-xs font-mono bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20">
                        Oto-Limit: AKTİF
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="bg-[#111318] border border-red-500/30 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
                        <div>
                            <div className="text-sm font-bold text-white mb-1">Mevcut Toplam Bekleyen Risk (Tüm Bahisler)</div>
                            <div className="text-xs text-zinc-400">Piyasa: Genel Kasa Limiti</div>
                        </div>
                        <div className="text-right relative z-10">
                            <div className="text-xl font-black text-red-400 font-mono flex items-center gap-2 justify-end drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">
                                <Activity className="w-4 h-4 animate-bounce" /> ₺{stats ? stats.betLiability.toLocaleString('tr-TR') : '...'}
                            </div>
                            <div className="text-[10px] text-red-500 font-bold uppercase mt-1">
                                {stats && stats.betLiability > 500000 ? 'KRİTİK RİSK (LIMIT AŞIMI)' : 'GÜVENLİ BÖLGE'}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111318] border border-orange-500/30 rounded-xl p-4 flex items-center justify-between group hover:border-orange-500/50 transition-colors">
                        <div>
                            <div className="text-sm font-bold text-white mb-1">Bekleyen Ana Para (Stake)</div>
                            <div className="text-xs text-zinc-400">Oynanan Toplam Tutar</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-black text-orange-400 font-mono drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]">₺{stats ? stats.pendingStake.toLocaleString('tr-TR') : '...'}</div>
                            <div className="text-[10px] text-orange-500 font-bold uppercase mt-1">RİSKTEKİ ANA PARA</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Shadcn-like Dialog / Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0f1115] border border-red-500/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden shadow-red-500/10 animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#15171e]">
                            <div className="flex items-center gap-3">
                                <Lock className="w-5 h-5 text-red-400" />
                                <h3 className="text-lg font-bold text-white">Güvenlik Onayı</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {success ? (
                                <div className="py-8 text-center space-y-3 animate-in slide-in-from-bottom-4">
                                    <CheckCircle2 className="w-16 h-16 text-[#00E5FF] mx-auto" />
                                    <h4 className="text-xl font-bold text-[#00E5FF]">Başarılı!</h4>
                                    <p className="text-gray-400 text-sm">RTP oranı başarıyla güncellendi.</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        RTP oranını <strong>%{rtp.toFixed(1)}</strong> olarak değiştirmek üzeresiniz. Bu çok kritik bir işlemdir. Lütfen işlemi onaylamak için <span className="text-red-400 font-bold">6 haneli Master PIN</span> kodunu giriniz.
                                    </p>

                                    <div className="space-y-2">
                                        <input
                                            type="password"
                                            maxLength={6}
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                            placeholder="• • • • • •"
                                            className="w-full bg-black/50 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] text-white font-mono placeholder:text-gray-600 transition-all outline-none"
                                            autoFocus
                                        />
                                        {error && (
                                            <p className="text-red-400 text-xs font-semibold text-center animate-pulse">{error}</p>
                                        )}
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            İptal
                                        </button>
                                        <button 
                                            onClick={handleConfirm}
                                            className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2"
                                        >
                                            <ShieldAlert className="w-4 h-4" />
                                            Yetkiyi Doğrula
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
