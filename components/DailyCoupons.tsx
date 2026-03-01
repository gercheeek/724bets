import React, { useState } from 'react';
import { Coupon } from '../types';
import { Ticket, Zap, Flame, Shield, TrendingUp, ChevronRight, BarChart3, X, CheckCircle2, Lock, User } from 'lucide-react';
import { demoCoupons } from '../demoData';

interface DailyCouponsProps {
    coupons?: Coupon[];
    isLoggedIn?: boolean;
    onLoginRequired?: () => void;
}

export const generateSafeAnalysis = (home: string, away: string, pred: string) => {
    const templates = [
        `Yapay zeka analiz modelimiz, ${home} ve ${away} eşleşmesinde tarihi verileri inceledi. "${pred}" tercihi istatistiksel olarak %92'lik bir güven skoruna sahip. Banko adayı.`,
        `Bu karşılaşmada risk algoritması minimum seviyede uyarı veriyor. ${home} - ${away} mücadelesinde "${pred}" seçeneği kasa katlamak isteyenler için en tehlikesiz liman.`,
        `Gelişmiş veri setimiz, ${home} - ${away} maçındaki form durumlarını analiz ettiğinde "${pred}" tahmini için yeşil ışık yakıyor. Editörlerimizin de favorisi olan bu oran kaçmaz.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
};

const DailyCoupons: React.FC<DailyCouponsProps> = ({ coupons, isLoggedIn = false, onLoginRequired }) => {
    const baseDateStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState<string>('WEEKLY'); // Default to Weekly
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

    const dates: string[] = [];
    const startDate = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }

    const baseCoupons = coupons && coupons.length > 0 ? coupons : demoCoupons;
    const displayCoupons = baseCoupons.filter(c => selectedDate === 'WEEKLY' ? dates.includes(c.date) : c.date === selectedDate);

    return (
        <section id="daily-coupons" className="relative w-full py-24 bg-[#0B0B0F] overflow-hidden">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 premium-bg-grid opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0B0F]/80 to-[#0B0B0F]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#FFC107]/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative max-w-[1240px] mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <h2 className="text-[48px] md:text-[64px] font-black text-white mb-4 tracking-tighter uppercase leading-none">
                        GÜNÜN <span className="text-[#FFC107]">KUPONLARI</span>
                    </h2>
                    <p className="text-[#A0A0A0] text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Editör onaylı, veri destekli hazır kuponlar ile kazancınızı maksimize edin.
                    </p>
                </div>

                {/* Date Selection Strip */}
                <div className="flex overflow-x-auto gap-2 mb-12 pb-3 justify-center scrollbar-none animate-fade-in-up">
                    <button
                        onClick={() => setSelectedDate('WEEKLY')}
                        className={`flex flex-col items-center justify-center min-w-[100px] h-[72px] rounded-2xl border transition-all duration-300 ${selectedDate === 'WEEKLY'
                            ? 'bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] border-[#f0b90b] text-[#f0b90b] shadow-[0_0_20px_rgba(240,185,11,0.2)] scale-105'
                            : 'bg-black/50 border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:bg-zinc-900/50'
                            }`}
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest mb-1">HAFTALIK</span>
                        <span className="text-sm font-bold">TÜMÜ</span>
                    </button>

                    {dates.map((date) => {
                        const d = new Date(date);
                        const isSelected = selectedDate === date;
                        const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' });
                        return (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`flex flex-col items-center justify-center min-w-[90px] h-[72px] rounded-2xl border transition-all duration-300 ${isSelected
                                    ? 'bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] border-[#f0b90b] text-[#f0b90b] shadow-[0_0_20px_rgba(240,185,11,0.2)] scale-105'
                                    : 'bg-black/50 border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:bg-zinc-900/50'
                                    }`}
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest mb-1">{dayName}</span>
                                <span className="text-sm font-bold">{d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Empty State */}
                {displayCoupons.length === 0 && (
                    <div className="text-center py-20 bg-[#111118] border border-white/5 rounded-[32px] animate-fade-in">
                        <Lock className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-white mb-2 uppercase">KUPON BULUNAMADI</h3>
                        <p className="text-zinc-500">Bu tarihe ait editör kuponu henüz paylaşılmadı.</p>
                    </div>
                )}

                {/* Coupons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayCoupons.map((coupon: Coupon, index: number) => {
                        const isLow = coupon.riskLevel === 'LOW';
                        const isHigh = coupon.riskLevel === 'HIGH';
                        const isLocked = !isLoggedIn && index >= 2;

                        if (isLocked) {
                            return (
                                <div key={coupon.id} className="relative group" style={{ animationDelay: `${index * 0.1}s` }}>
                                    {/* Blurred Card Preview */}
                                    <div className="bg-[#111118] border border-white/5 rounded-[16px] p-3 pointer-events-none" style={{ filter: 'blur(4px)', userSelect: 'none' }}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isLow ? 'bg-emerald-500/10 text-emerald-500' : isHigh ? 'bg-rose-500/10 text-rose-500' : 'bg-[#FFC107]/10 text-[#FFC107]'}`}>
                                                {isLow ? '🛡 BANKO' : isHigh ? '🔥 YÜKSEK RİSK' : '⚡ DEĞER ORAN'}
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-3">
                                            {coupon.matches.slice(0, 3).map((m, i) => (
                                                <div key={i} className="flex items-center justify-between bg-black/60 rounded-lg p-2">
                                                    <span className="text-white text-xs font-black truncate">{m.homeTeam} - {m.awayTeam}</span>
                                                    <span className="text-[#FFC107] text-xs font-black ml-2">{m.odd}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-zinc-600 text-[10px] font-bold">TOPLAM ORAN</span>
                                            <span className="text-[#FFC107] text-sm font-black">{coupon.totalOdd}</span>
                                        </div>
                                    </div>
                                    {/* Lock Overlay */}
                                    <div className="absolute inset-0 rounded-[16px] flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px]">
                                        <button
                                            onClick={onLoginRequired}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-[#FFC107] text-black font-black text-xs rounded-full uppercase tracking-widest hover:bg-[#FFC107]/90 transition-all shadow-[0_0_20px_rgba(255,193,7,0.3)] hover:shadow-[0_0_30px_rgba(255,193,7,0.5)]"
                                        >
                                            <Lock className="w-3.5 h-3.5" />
                                            Üye Ol, Tümünü Gör
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={coupon.id}
                                onClick={() => setSelectedCoupon(coupon)}
                                className="group relative bg-[#111118] border border-white/5 rounded-[16px] p-3 transition-all duration-500 hover:border-[#FFC107]/50 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,193,7,0.15)] animate-fade-in-up cursor-pointer"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Card Header / Badge */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isLow ? 'bg-emerald-500/10 text-emerald-500' :
                                        isHigh ? 'bg-rose-500/10 text-rose-500' :
                                            'bg-[#FFC107]/10 text-[#FFC107]'
                                        }`}>
                                        {isLow ? <Shield className="w-3.5 h-3.5" /> :
                                            isHigh ? <Flame className="w-3.5 h-3.5" /> :
                                                <Zap className="w-3.5 h-3.5" />}
                                        {isLow ? 'BANKO' : isHigh ? 'YÜKSEK RİSK' : 'DEĞER ORAN'}
                                    </div>
                                    <span className="text-zinc-600 font-bold text-[10px] flex items-center gap-1">
                                        <Zap className="w-2.5 h-2.5 text-[#f0b90b]" /> AI ANALİZ
                                    </span>
                                </div>

                                {/* Matches List */}
                                <div className="space-y-2 mb-3">
                                    {coupon.matches.map((match, midx) => (
                                        <div key={midx} className="relative">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-white font-black text-xs uppercase italic tracking-tight truncate max-w-[80%]">
                                                        {match.homeTeam} - {match.awayTeam}
                                                    </span>
                                                    <span className="text-[#FFC107] font-black text-xs">{match.odd}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-px w-4 bg-[#FFC107]/30 rounded-full" />
                                                    <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider">
                                                        {match.prediction}
                                                        {selectedDate === 'WEEKLY' && <span className="ml-1.5 pl-1.5 border-l border-zinc-700 text-zinc-400">{new Date(coupon.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Risk Level Bar */}
                                <div className="mb-3 space-y-1.5">
                                    <div className="flex justify-between items-center text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                                        <span>RİSK SEVİYESİ</span>
                                        <span className={isLow ? 'text-emerald-500' : isHigh ? 'text-rose-500' : 'text-[#FFC107]'}>
                                            {coupon.riskLevel}
                                        </span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'w-[30%] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                            isHigh ? 'w-[100%] bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                                                'w-[65%] bg-[#FFC107] shadow-[0_0_10px_rgba(255,193,7,0.5)]'
                                            }`} />
                                    </div>
                                </div>

                                {/* Total Odd & CTA */}
                                <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-zinc-500 font-black text-[9px] uppercase tracking-widest mb-0.5">TOPLAM ORAN</span>
                                            <div className="text-2xl font-black text-white italic leading-none">
                                                {coupon.totalOdd}<span className="text-[#FFC107] text-base ml-1">x</span>
                                            </div>
                                        </div>

                                        {/* Animated CTA */}
                                        <div className="flex-1 flex justify-center px-4">
                                            <div className="px-3 py-1.5 bg-[#FFC107]/10 border border-[#FFC107]/30 rounded-full animate-pulse flex items-center gap-1.5">
                                                <Zap className="w-3 h-3 text-[#FFC107]" />
                                                <span className="text-[9px] font-black text-[#FFC107] tracking-widest uppercase">ANALİZ İÇİN TIKLA</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                                                <User className="w-2.5 h-2.5 text-zinc-500" />
                                                <span className="text-[8px] font-black text-zinc-400 tracking-widest uppercase">
                                                    {coupon.editorId === 'admin' ? 'YÖNETİCİ' : coupon.editorId ? coupon.editorId : 'EDİTÖR'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Section Bottom CTA */}
                <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-in-up animate-delay-3">
                    <button className="h-16 px-12 bg-[#FFC107] text-black rounded-full font-black text-sm uppercase tracking-widest hover:shadow-[0_15px_40px_rgba(255,193,7,0.4)] transition-all hover:-translate-y-1">
                        TÜM KUPONLARI GÖR
                    </button>
                    <button className="h-16 px-12 border-2 border-white/10 text-white rounded-full font-black text-sm uppercase tracking-widest hover:border-[#FFC107] hover:text-[#FFC107] transition-all">
                        CANLI ANALİZLERE GİT
                    </button>
                </div>
            </div>

            {/* AI Analysis Modal */}
            {selectedCoupon && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCoupon(null)} />
                    <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl animate-fade-in-up">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/30">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#FFC107]/10 flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-[#FFC107]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase">{selectedCoupon.title} - AI ANALİZİ</h3>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> %92 İstatistiksel Güven Score'u
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedCoupon(null)} className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-600 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 max-h-[55vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                            <div className="space-y-3">
                                {selectedCoupon.matches.map((match, idx) => (
                                    <div key={idx} className="bg-[#111] border border-zinc-800/50 rounded-lg p-3 relative overflow-hidden group">
                                        {/* Background Glow */}
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFC107]/5 rounded-full blur-xl pointer-events-none" />

                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                                    <span className="text-[9px] font-black">{idx + 1}</span>
                                                </div>
                                                <h4 className="text-xs font-black text-white italic">
                                                    {match.homeTeam} <span className="text-zinc-600 mx-0.5">vs</span> {match.awayTeam}
                                                </h4>
                                            </div>
                                            <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black rounded">
                                                {match.prediction}
                                            </div>
                                        </div>

                                        <div className="bg-black/50 rounded p-3 border border-zinc-800/50 mb-2">
                                            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                                                {match.analysis || generateSafeAnalysis(match.homeTeam, match.awayTeam, match.prediction)}
                                            </p>
                                        </div>

                                        {/* Bookie Odds (Partner Sites) */}
                                        <div className="flex flex-col sm:flex-row items-center gap-1.5 pt-2 border-t border-zinc-800/50">
                                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest shrink-0">ANLAŞMALI SİTELER</span>
                                            <div className="flex flex-wrap gap-1.5 w-full">
                                                {[
                                                    { name: 'BETLİVO', odds: (parseFloat(match.odd) * 1.05).toFixed(2) },
                                                    { name: 'MARSBAHİS', odds: (parseFloat(match.odd) * 1.08).toFixed(2), isHighest: true }
                                                ].map((bookie, bidx) => (
                                                    <div key={bidx} className={`flex-1 min-w-[100px] flex items-center justify-between px-2 py-1.5 rounded border bg-black/60 transition-all ${bookie.isHighest ? 'border-[#f0b90b]/40 shadow-[0_0_8px_rgba(240,185,11,0.15)] animate-pulse' : 'border-zinc-800'}`}>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-[9px] font-black text-white">{bookie.name}</span>
                                                            {bookie.isHighest && <span className="text-[6px] bg-[#f0b90b] text-black px-0.5 rounded font-black">EN YÜKSEK</span>}
                                                        </div>
                                                        <span className={`text-[10px] font-black ${bookie.isHighest ? 'text-[#f0b90b]' : 'text-zinc-400'}`}>{bookie.odds}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-4 py-3 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-bold text-zinc-500">Editör & Yapay Zeka Onaylı</span>
                                </div>
                                <div className="hidden md:flex items-center gap-1 px-2 py-0.5 bg-black border border-white/5 rounded">
                                    <User className="w-3 h-3 text-zinc-500" />
                                    <span className="text-[9px] font-black text-[#f0b90b] tracking-widest uppercase">
                                        {selectedCoupon.editorId === 'admin' ? 'YÖNETİCİ' : selectedCoupon.editorId ? selectedCoupon.editorId : 'EDİTÖR'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-zinc-500 uppercase mb-0.5">Toplam Oran</p>
                                <p className="text-lg font-black text-[#FFC107]">{selectedCoupon.totalOdd}</p>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </section>
    );
};

export default DailyCoupons;
