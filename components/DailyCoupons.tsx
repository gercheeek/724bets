import React, { useState } from 'react';
import { Coupon } from '../types';
import { Ticket, Zap, Flame, Shield, TrendingUp, ChevronRight, BarChart3, X, CheckCircle2, Lock, User } from 'lucide-react';

interface DailyCouponsProps {
    coupons?: Coupon[];
    isLoggedIn?: boolean;
    onLoginRequired?: () => void;
}

import { generateSafeAnalysis } from '../utils/helpers';

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

    const baseCoupons = coupons || [];
    const displayCoupons = baseCoupons.filter(c => selectedDate === 'WEEKLY' ? dates.includes(c.date) : c.date === selectedDate);

    return (
        <section id="daily-coupons" className="relative w-full bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-2xl p-4 md:p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-800/50">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <h3 className="text-white font-black uppercase tracking-widest text-sm">GÜNÜN KUPONLARI</h3>
                </div>
            </div>

            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 justify-start scrollbar-none animate-fade-in-up">
                <button
                    onClick={() => setSelectedDate('WEEKLY')}
                    className={`flex flex-col items-center justify-center min-w-[70px] h-[52px] rounded-xl border transition-all duration-300 ${selectedDate === 'WEEKLY'
                        ? 'bg-[#f0b90b] border-[#f0b90b] text-black shadow-[0_4px_20px_rgba(240,185,11,0.3)]'
                        : 'bg-zinc-800/20 border-zinc-700/50 text-zinc-500 hover:border-zinc-500 hover:text-white'
                        }`}
                >
                    <span className="text-[8px] font-black uppercase tracking-widest mb-0.5">HEPSİ</span>
                    <span className="text-xs font-bold italic">TÜMÜ</span>
                </button>

                {dates.slice(0, 5).map((date) => {
                    const d = new Date(date);
                    const isSelected = selectedDate === date;
                    const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' });
                    return (
                        <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`flex flex-col items-center justify-center min-w-[65px] h-[52px] rounded-xl border transition-all duration-300 ${isSelected
                                ? 'bg-[#f0b90b] border-[#f0b90b] text-black shadow-[0_4px_20px_rgba(240,185,11,0.3)]'
                                : 'bg-zinc-800/20 border-zinc-700/50 text-zinc-500 hover:border-zinc-500 hover:text-white'
                                }`}
                        >
                            <span className="text-[8px] font-black uppercase tracking-widest mb-0.5">{dayName}</span>
                            <span className="text-xs font-bold italic">{d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                        </button>
                    );
                })}
            </div>

            {displayCoupons.length === 0 && (
                <div className="text-center py-10 rounded-2xl animate-fade-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                    <Lock className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
                    <h3 className="text-sm font-black mb-1 uppercase" style={{ color: 'var(--text-primary)' }}>BULUNAMADI</h3>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Bu tarihte kupon yok.</p>
                </div>
            )}

            <div className="flex flex-col gap-4 flex-1">
                {displayCoupons.map((coupon: Coupon, index: number) => {
                    const isLow = coupon.riskLevel === 'LOW';
                    const isHigh = coupon.riskLevel === 'HIGH';
                    const isLocked = !isLoggedIn && index >= 2;

                    if (isLocked) {
                        return (
                                <div key={coupon.id} className="relative group" style={{ animationDelay: `${index * 0.1}s` }}>
                                    {/* Blurred Card Preview */}
                                    <div className="rounded-[16px] p-3 pointer-events-none" style={{ filter: 'blur(4px)', userSelect: 'none', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isLow ? 'bg-emerald-500/10 text-emerald-500' : isHigh ? 'bg-rose-500/10 text-rose-500' : 'bg-[#FFC107]/10 text-[#FFC107]'}`}>
                                                {isLow ? '🛡 BANKO' : isHigh ? '🔥 YÜKSEK RİSK' : '⚡ DEĞER ORAN'}
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-3">
                                            {coupon.matches.slice(0, 3).map((m, i) => (
                                                <div key={i} className="flex items-center justify-between rounded-lg p-2" style={{ background: 'var(--bg-elevated)' }}>
                                                    <span className="text-xs font-black truncate" style={{ color: 'var(--text-primary)' }}>{m.homeTeam} - {m.awayTeam}</span>
                                                    <span className="text-[#FFC107] text-xs font-black ml-2">{m.odd}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span style={{ color: 'var(--text-dim)', fontSize: '10px', fontWeight: 'bold' }}>TOPLAM ORAN</span>
                                            <span className="text-[#FFC107] text-sm font-black">{coupon.totalOdd}</span>
                                        </div>
                                    </div>
                                    {/* Lock Overlay */}
                                    <div className="absolute inset-0 rounded-[16px] flex flex-col items-center justify-center backdrop-blur-[2px]" style={{ background: 'color-mix(in srgb, var(--bg-card) 60%, transparent)' }}>
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
                                className="group relative rounded-[16px] p-3 transition-all duration-500 hover:border-[#FFC107]/50 hover:scale-[1.03] animate-fade-in-up cursor-pointer"
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)', animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Card Header / Badge */}
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isLow ? 'bg-emerald-500/10 text-emerald-500' :
                                        isHigh ? 'bg-rose-500/10 text-rose-500' :
                                            'bg-[#f0b90b]/10 text-[#f0b90b]'
                                        }`}>
                                        {isLow ? <Shield className="w-2.5 h-2.5" /> :
                                            isHigh ? <Flame className="w-2.5 h-2.5" /> :
                                                <Zap className="w-2.5 h-2.5" />}
                                        {isLow ? 'BANKO' : isHigh ? 'YÜKSEK RİSK' : 'ÖNERİ'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-[#f0b90b] animate-pulse" />
                                        <span className="text-zinc-500 font-bold text-[8px] uppercase tracking-widest">AI ANALİZ</span>
                                    </div>
                                </div>

                                {/* Matches List */}
                                <div className="space-y-2 mb-3">
                                    {coupon.matches.map((match, midx) => (
                                        <div key={midx} className="relative">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-black text-xs uppercase italic tracking-tight truncate max-w-[80%]" style={{ color: 'var(--text-primary)' }}>
                                                        {match.homeTeam} - {match.awayTeam}
                                                    </span>
                                                    <span className="text-[#FFC107] font-black text-xs">{match.odd}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-px w-4 bg-[#FFC107]/30 rounded-full" />
                                                     <span className="font-bold text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                                        {match.prediction}
                                                        {selectedDate === 'WEEKLY' && <span className="ml-1.5 pl-1.5 border-l border-[#D1D5DB] text-[#9CA3AF]">{new Date(coupon.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Risk Level Bar */}
                                <div className="mb-3 space-y-1.5">
                                    <div className="flex justify-between items-center text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest">
                                        <span>RİSK SEVİYESİ</span>
                                        <span className={isLow ? 'text-emerald-500' : isHigh ? 'text-rose-500' : 'text-[#FFC107]'}>
                                            {coupon.riskLevel}
                                        </span>
                                    </div>
                                    <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'w-[30%] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                            isHigh ? 'w-[100%] bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                                                'w-[65%] bg-[#FFC107] shadow-[0_0_10px_rgba(255,193,7,0.5)]'
                                            }`} />
                                    </div>
                                </div>

                                {/* Total Odd & CTA */}
                                <div className="pt-3 border-t border-black/5 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-black text-[9px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>TOPLAM ORAN</span>
                                            <div className="text-2xl font-black italic leading-none" style={{ color: 'var(--text-primary)' }}>
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
                                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                                                <User className="w-2.5 h-2.5 text-[#9CA3AF]" />
                                                <span className="text-[8px] font-black text-[#6B7280] tracking-widest uppercase">
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
                <div className="mt-6 flex flex-col gap-3 animate-fade-in-up animate-delay-3">
                    <button className="w-full py-3 bg-[#FFC107] text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-[0_8px_30px_rgba(255,193,7,0.3)] transition-all">
                        TÜM KUPONLARI GÖR
                    </button>
                    <button className="w-full py-3 border border-zinc-700/50 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-[#FFC107] hover:text-[#FFC107] transition-all text-zinc-400">
                        CANLI ANALİZLERE GİT
                    </button>
                </div>

            {/* AI Analysis Modal */}
            {selectedCoupon && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCoupon(null)} />
                    <div className="relative w-full max-w-xl rounded-xl overflow-hidden shadow-2xl animate-fade-in-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border-card)', background: 'var(--bg-elevated)' }}>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#FFC107]/10 flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-[#FFC107]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase" style={{ color: 'var(--text-primary)' }}>{selectedCoupon.title} - AI ANALİZİ</h3>
                                    <p className="text-[10px] font-bold uppercase flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> %92 İstatistiksel Güven Score'u
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedCoupon(null)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 max-h-[55vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                            <div className="space-y-3">
                                {selectedCoupon.matches.map((match, idx) => (
                                    <div key={idx} className="rounded-lg p-3 relative overflow-hidden group" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-card)' }}>
                                        {/* Background Glow */}
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFC107]/5 rounded-full blur-xl pointer-events-none" />

                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-card)' }}>
                                                    <span className="text-[9px] font-black" style={{ color: 'var(--text-dim)' }}>{idx + 1}</span>
                                                </div>
                                                <h4 className="text-xs font-black italic" style={{ color: 'var(--text-primary)' }}>
                                                    {match.homeTeam} <span className="text-zinc-600 mx-0.5">vs</span> {match.awayTeam}
                                                </h4>
                                            </div>
                                            <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black rounded">
                                                {match.prediction}
                                            </div>
                                        </div>

                                        <div className="rounded p-3 mb-2" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-card)' }}>
                                            <p className="text-xs leading-relaxed font-medium" style={{ color: 'var(--text-muted)' }}>
                                                {match.analysis || generateSafeAnalysis(match.homeTeam, match.awayTeam, match.prediction)}
                                            </p>
                                        </div>

                                        {/* Bookie Odds (Partner Sites) */}
                                        <div className="flex flex-col sm:flex-row items-center gap-1.5 pt-2" style={{ borderTop: '1px solid var(--border-card)' }}>
                                            <span className="text-[8px] font-black uppercase tracking-widest shrink-0" style={{ color: 'var(--text-dim)' }}>ANLAŞMALI SİTELER</span>
                                            <div className="flex flex-wrap gap-1.5 w-full">
                                                {[
                                                    { name: 'BETLİVO', odds: (parseFloat(match.odd) * 1.05).toFixed(2) },
                                                    { name: 'MARSBAHİS', odds: (parseFloat(match.odd) * 1.08).toFixed(2), isHighest: true }
                                                ].map((bookie, bidx) => (
                                                    <div key={bidx} className={`flex-1 min-w-[100px] flex items-center justify-between px-2 py-1.5 rounded border transition-all ${bookie.isHighest ? 'border-[#f0b90b]/40 shadow-[0_0_8px_rgba(240,185,11,0.15)] animate-pulse' : ''}`} style={{ background: 'var(--bg-elevated)', borderColor: bookie.isHighest ? undefined : 'var(--border-card)' }}>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-[9px] font-black" style={{ color: 'var(--text-primary)' }}>{bookie.name}</span>
                                                            {bookie.isHighest && <span className="text-[6px] bg-[#f0b90b] text-black px-0.5 rounded font-black">EN YÜKSEK</span>}
                                                        </div>
                                                        <span className={`text-[10px] font-black ${bookie.isHighest ? 'text-[#f0b90b]' : ''}`} style={bookie.isHighest ? {} : { color: 'var(--text-muted)' }}>{bookie.odds}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-card)' }}>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-bold" style={{ color: 'var(--text-dim)' }}>Editör & Yapay Zeka Onaylı</span>
                                </div>
                                <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)' }}>
                                    <User className="w-3 h-3" style={{ color: 'var(--text-dim)' }} />
                                    <span className="text-[9px] font-black text-[#f0b90b] tracking-widest uppercase">
                                        {selectedCoupon.editorId === 'admin' ? 'YÖNETİCİ' : selectedCoupon.editorId ? selectedCoupon.editorId : 'EDİTÖR'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-bold uppercase mb-0.5" style={{ color: 'var(--text-dim)' }}>Toplam Oran</p>
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
