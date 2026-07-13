import React from 'react';
import { Flame, TrendingUp, ArrowRight } from 'lucide-react';
import { PopularBetsConfig } from '../types';

interface PopularBetsProps {
    config: PopularBetsConfig;
}

const PopularBets: React.FC<PopularBetsProps> = ({ config }) => {
    if (!config.isActive || !config.bets || config.bets.length === 0) return null;

    const sortedBets = [...config.bets].sort((a, b) => b.playCount - a.playCount);

    return (
        <div style={{ margin: '12px 0 16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '2px', height: '12px', background: '#F5A623', borderRadius: '1px' }} />
                    <Flame style={{ width: 12, height: 12, color: '#F5A623' }} />
                    <span style={{ color: '#fff', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Popüler Bahisler</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <TrendingUp style={{ width: 9, height: 9, color: '#F5A623' }} />
                    <span style={{ color: 'rgba(255,215,0,0.6)', fontSize: '7px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>CANLI</span>
                </div>
            </div>

            {/* Bets List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {sortedBets.map((bet) => (
                    <a
                        key={bet.id}
                        href={bet.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #141414 100%)',
                            border: '1px solid #222',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            transition: 'all 0.25s ease',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgba(255,215,0,0.35)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,215,0,0.08)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#222';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {/* Left: Teams + Match Info */}
                        <div style={{ flex: 1, minWidth: 0, marginRight: '10px' }}>
                            {/* Teams */}
                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#e5e5e5', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {bet.homeTeam} - {bet.awayTeam}
                            </div>

                            {/* Time + League Badge */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                {bet.isHot && (
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '2px',
                                        padding: '1px 5px',
                                        borderRadius: '4px',
                                        background: 'rgba(239,68,68,0.15)',
                                        border: '1px solid rgba(239,68,68,0.25)',
                                    }}>
                                        <span style={{ fontSize: '9px' }}>🔥</span>
                                        <span style={{ fontSize: '7px', fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>HOT</span>
                                    </div>
                                )}
                                <span style={{ fontSize: '9px', fontWeight: 700, color: '#666' }}>
                                    {bet.matchTime}
                                </span>
                            </div>

                            {/* Play count */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: '#F5A623' }}>
                                    {bet.playCount} kez oynandı
                                </span>
                                <span style={{ fontSize: '10px' }}>🔥</span>
                            </div>
                        </div>

                        {/* Right: Prediction + Odds Box */}
                        <div style={{
                            flexShrink: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            minWidth: '90px',
                            textAlign: 'center',
                        }}>
                            {/* Prediction Type */}
                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '4px', lineHeight: 1.3 }}>
                                {bet.prediction}
                            </div>
                            {/* Short Prediction + Odds */}
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 900, color: '#e5e5e5' }}>
                                    {bet.predictionShort}
                                </span>
                                <span style={{ fontSize: '15px', fontWeight: 900, color: '#F5A623' }}>
                                    {bet.odds.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Arrow indicator */}
                        <ArrowRight style={{ width: 12, height: 12, color: '#444', marginLeft: '8px', flexShrink: 0 }} />
                    </a>
                ))}
            </div>
        </div>
    );
};

export default PopularBets;
