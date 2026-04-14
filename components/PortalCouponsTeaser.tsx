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
                            className="group relative rounded-xl p-3 transition-all duration-500 hover:border-[#FFC107]/50 hover:scale-[1.01] cursor-pointer"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)', animationDelay: `${idx * 0.1}s` }}
                        >
                             {/* Card Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5">
                                    <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${isLow ? 'bg-emerald-500/10 text-emerald-500' :
                                        isHigh ? 'bg-rose-500/10 text-rose-500' :
                                            'bg-[#f0b90b]/10 text-[#f0b90b]'
                                        }`}>
                                        {isLow ? <Shield className="w-2.5 h-2.5" /> :
                                            isHigh ? <Flame className="w-2.5 h-2.5" /> :
                                                <Zap className="w-2.5 h-2.5" />}
                                        {isLow ? 'BANKO' : isHigh ? 'RİSKLİ' : 'ÖNERİ'}
                                    </div>
                                    {coupon.category && (
                                        <div className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50 text-[8px] font-black uppercase text-zinc-300">
                                            {coupon.category}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-[#f0b90b] animate-pulse" />
                                    <span className="text-zinc-500 font-bold text-[8px] uppercase tracking-widest">AI</span>
                                </div>
                            </div>

                             {/* Content */}
                            <div className="space-y-2 mb-3">
                                {coupon.matches.slice(0, 2).map((match, midx) => (
                                    <div key={midx} className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-black text-[10.5px] uppercase italic tracking-tight truncate max-w-[80%]" style={{ color: 'var(--text-primary)' }}>
                                                {match.homeTeam} - {match.awayTeam}
                                            </span>
                                            <span className="text-[#FFC107] font-black text-xs">{match.odd}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-[1.5px] w-4 bg-[#FFC107]/30 rounded-full" />
                                            <span className="font-bold text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                                {match.prediction}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                             {/* Total Odd Bar */}
                            <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-black text-[8px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>ORAN</span>
                                    <div className="text-xl font-black italic leading-none" style={{ color: 'var(--text-primary)' }}>
                                        {coupon.totalOdd}<span className="text-[#FFC107] text-xs ml-0.5">x</span>
                                    </div>
                                </div>

                                <button className="px-3 py-1.5 bg-[#FFC107]/10 text-[#FFC107] group-hover:bg-[#FFC107] group-hover:text-black font-black text-[9px] uppercase rounded flex items-center gap-1 transition-all">
                                    İNCELE <ChevronRight className="w-2.5 h-2.5" />
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
