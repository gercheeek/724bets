import React, { useState, useEffect } from 'react';
import { Coupon } from '../types';
import { demoCoupons } from '../demoData';
import { Zap, Shield, Flame, ChevronRight, ArrowRight } from 'lucide-react';

interface PortalCouponsTeaserProps {
    coupons?: Coupon[];
    onViewChange: (view: string) => void;
}

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
    const [displayVal, setDisplayVal] = useState(1);

    useEffect(() => {
        let start = 1.00;
        const end = value;
        if (start === end) return;
        
        const duration = 1000;
        const steps = 60;
        const increment = (end - start) / steps;
        const stepTime = Math.abs(Math.floor(duration / steps));
        
        const timer = setInterval(() => {
            start += increment;
            if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
                setDisplayVal(end);
                clearInterval(timer);
            } else {
                setDisplayVal(Number(start.toFixed(2)));
            }
        }, stepTime);
        
        return () => clearInterval(timer);
    }, [value]);

    return <span>{displayVal.toFixed(2)}</span>;
};

const PortalCouponsTeaser: React.FC<PortalCouponsTeaserProps> = ({ coupons, onViewChange }) => {
    const baseCoupons = (coupons && coupons.length > 0) ? coupons : demoCoupons;
    const displayCoupons = baseCoupons.slice(0, 2);

    if (displayCoupons.length === 0) return null;

    return (
        <div style={{ margin: '8px 0 12px' }}>
            {/* Compact header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '3px', height: '14px', background: '#f0b90b', borderRadius: '2px' }} />
                    <span style={{ color: '#fff', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Günün Kuponları</span>
                </div>
                <button 
                    onClick={() => onViewChange('coupons')}
                    style={{ background: 'none', border: 'none', color: '#f0b90b', fontSize: '9px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                    TÜMÜ <ArrowRight style={{ width: 10, height: 10 }} />
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {displayCoupons.map((coupon, idx) => {
                    const isLow = coupon.riskLevel === 'LOW';
                    const isHigh = coupon.riskLevel === 'HIGH';
                    const riskColor = isLow ? '#22c55e' : isHigh ? '#ef4444' : '#f0b90b';
                    const riskBg = isLow ? 'rgba(34,197,94,0.08)' : isHigh ? 'rgba(239,68,68,0.08)' : 'rgba(240,185,11,0.08)';
                    const riskLabel = isLow ? 'BANKO' : isHigh ? 'RİSKLİ' : 'ÖNERİ';
                    const RiskIcon = isLow ? Shield : isHigh ? Flame : Zap;

                    return (
                        <div
                            key={coupon.id}
                            onClick={() => onViewChange('coupons')}
                            className="gold-beam-effect frosted-glass"
                            style={{ 
                                background: 'rgba(13, 13, 13, 0.6)', 
                                border: '1px solid #1a1a1a', 
                                borderRadius: '10px', 
                                padding: '10px 12px', 
                                cursor: 'pointer', 
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(240,185,11,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {/* Risk badge + Total odd */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 6px', borderRadius: '4px', background: riskBg, border: `1px solid ${riskColor}20` }}>
                                    <RiskIcon style={{ width: 9, height: 9, color: riskColor }} />
                                    <span style={{ fontSize: '8px', fontWeight: 900, color: riskColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{riskLabel}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#fff', fontStyle: 'italic' }}>
                                        <AnimatedNumber value={parseFloat(coupon.totalOdd)} />
                                    </span>
                                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#f0b90b', marginLeft: '2px' }}>x</span>
                                </div>
                            </div>

                            {/* Matches compact */}
                            {coupon.matches.slice(0, 2).map((match, midx) => (
                                <div key={midx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 0', borderTop: midx > 0 ? '1px solid #111' : 'none' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#ddd', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {match.homeTeam} - {match.awayTeam}
                                        </div>
                                        <div style={{ fontSize: '7px', fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '1px' }}>
                                            {match.prediction}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#f0b90b', marginLeft: '8px', flexShrink: 0 }}>{match.odd}</span>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PortalCouponsTeaser;
