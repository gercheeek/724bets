import React, { useState } from 'react';
import { Coupon } from '../types';
import { demoCoupons } from '../demoData';
import { Zap, Shield, Flame, ChevronRight } from 'lucide-react';

interface PortalCouponsTeaserProps {
    coupons?: Coupon[];
    onViewChange: (view: string) => void;
}

const PortalCouponsTeaser: React.FC<PortalCouponsTeaserProps> = ({ coupons, onViewChange }) => {
    const baseCoupons = (coupons && coupons.length > 0) ? coupons : demoCoupons;
    
    // Sort logic or just grab the top 2
    const displayCoupons = baseCoupons.slice(0, 2);

    if (displayCoupons.length === 0) return null;

    return (
        <div className="mt-8 mb-6 px-4 md:px-0 animate-fade-in-up animate-delay-1">
            <div className="portal-section-heading" style={{ marginBottom: '16px' }}>
                <span className="text-xl">🎫</span> BİZE GÜVEN, KAZAN!
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayCoupons.map((coupon, idx) => {
                    const isLow = coupon.riskLevel === 'LOW';
                    const isHigh = coupon.riskLevel === 'HIGH';

                    return (
                        <div
                            key={coupon.id}
                            onClick={() => onViewChange('coupons')}
                            className="group relative rounded-2xl p-4 transition-all duration-500 hover:border-[#FFC107]/50 hover:scale-[1.02] cursor-pointer"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)', animationDelay: `${idx * 0.1}s` }}
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isLow ? 'bg-emerald-500/10 text-emerald-500' :
                                        isHigh ? 'bg-rose-500/10 text-rose-500' :
                                            'bg-[#f0b90b]/10 text-[#f0b90b]'
                                        }`}>
                                        {isLow ? <Shield className="w-3 h-3" /> :
                                            isHigh ? <Flame className="w-3 h-3" /> :
                                                <Zap className="w-3 h-3" />}
                                        {isLow ? 'BANKO' : isHigh ? 'RİSKLİ' : 'ÖNERİ'}
                                    </div>
                                    {coupon.category && (
                                        <div className="px-2 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/50 text-[9px] font-black uppercase text-zinc-300">
                                            {coupon.category}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#f0b90b] animate-pulse" />
                                    <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-widest">AI ONAYLI</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-3 mb-4">
                                {coupon.matches.slice(0, 2).map((match, midx) => (
                                    <div key={midx} className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-black text-xs uppercase italic tracking-tight truncate max-w-[80%]" style={{ color: 'var(--text-primary)' }}>
                                                {match.homeTeam} - {match.awayTeam}
                                            </span>
                                            <span className="text-[#FFC107] font-black text-sm">{match.odd}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-[2px] w-5 bg-[#FFC107]/30 rounded-full" />
                                            <span className="font-bold text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                                {match.prediction}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total Odd Bar */}
                            <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-black text-[9px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>TOPLAM ORAN</span>
                                    <div className="text-2xl font-black italic leading-none" style={{ color: 'var(--text-primary)' }}>
                                        {coupon.totalOdd}<span className="text-[#FFC107] text-base ml-1">x</span>
                                    </div>
                                </div>

                                <button className="px-4 py-2 bg-[#FFC107]/10 text-[#FFC107] group-hover:bg-[#FFC107] group-hover:text-black font-black text-[10px] uppercase rounded flex items-center gap-1 transition-all">
                                    KUPONU GÖR <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PortalCouponsTeaser;
