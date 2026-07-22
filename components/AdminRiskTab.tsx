import React, { useState } from 'react';
import { AlertTriangle, Save, ShieldAlert, Lock, CheckCircle2, X, Activity } from 'lucide-react';

export default function AdminRiskTab() {
    const [rtp, setRtp] = useState(95);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSaveRequest = () => {
        setIsModalOpen(true);
        setPin('');
        setError('');
        setSuccess(false);
    };

    const handleConfirm = () => {
        if (pin === 'Sakarya155@') {
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
                            <input 
                                type="range" 
                                min="90" 
                                max="99" 
                                step="0.1"
                                value={rtp}
                                onChange={(e) => setRtp(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                                <span>%90.0 (Max Kar)</span>
                                <span>%99.0 (Max Oyuncu)</span>
                            </div>
                        </div>
                        <div className="w-24 bg-black/50 border border-gray-700 rounded-xl px-3 py-2 text-center">
                            <span className="text-2xl font-black text-red-400">%{rtp.toFixed(1)}</span>
                        </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-sm text-red-200">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <p><strong>Dikkat:</strong> Bu değeri değiştirmek sitenin tüm oyunlarındaki genel kazandırma algoritmasını anında etkiler. Kar marjınızı doğrudan belirler.</p>
                    </div>

                    <button 
                        onClick={handleSaveRequest}
                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Değişiklikleri Uygula
                    </button>
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
                                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                                    <h4 className="text-xl font-bold text-emerald-400">Başarılı!</h4>
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
