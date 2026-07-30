import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, ArrowRight } from 'lucide-react';
import { PopularBetsConfig } from '../types';

interface PopularBetsProps {
    config: PopularBetsConfig;
}

const PopularBets: React.FC<PopularBetsProps> = ({ config }) => {
    const [liveBets, setLiveBets] = useState<any[]>([]);

    useEffect(() => {
        if (config.bets) setLiveBets(config.bets);
    }, [config.bets]);

    useEffect(() => {
        if (!liveBets || liveBets.length === 0) return;
        const interval = setInterval(() => {
            setLiveBets(current => current.map(bet => {
                if (Math.random() > 0.3) return bet;
                
                let trend = 'none';
                let newOdds = bet.odds;
                
                if (Math.random() < 0.5) {
                    const change = (Math.random() * 0.1) + 0.01;
                    const isUp = Math.random() > 0.5;
                    newOdds = Math.max(1.01, isUp ? bet.odds + change : bet.odds - change);
                    trend = isUp ? 'up' : 'down';
                }
                
                if (trend !== 'none') {
                   setTimeout(() => {
                      setLiveBets(bets => bets.map(b => b.id === bet.id ? { ...b, trend: 'none' } : b));
                   }, 2000);
                }

                return { ...bet, odds: newOdds, trend };
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, [liveBets.length]);

    if (!config.isActive || !liveBets || liveBets.length === 0) return null;

    const sortedBets = [...liveBets].sort((a, b) => b.playCount - a.playCount);

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
                            background: bet.trend === 'up' ? 'rgba(16,185,129,0.1)' : bet.trend === 'down' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)',
                            border: '1px solid',
                            borderColor: bet.trend === 'up' ? 'rgba(16,185,129,0.3)' : bet.trend === 'down' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)',
                            boxShadow: bet.trend === 'up' ? '0 0 10px rgba(16,185,129,0.2)' : bet.trend === 'down' ? '0 0 10px rgba(239,68,68,0.2)' : 'none',
                            minWidth: '90px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    {bet.trend === 'up' && <TrendingUp style={{ width: 10, height: 10, color: '#4ade80' }} />}
                                    {bet.trend === 'down' && <TrendingUp style={{ width: 10, height: 10, color: '#f87171', transform: 'rotate(180deg)' }} />}
                                    <span style={{ fontSize: '15px', fontWeight: 900, color: bet.trend === 'up' ? '#4ade80' : bet.trend === 'down' ? '#f87171' : '#F5A623', transition: 'color 0.3s' }}>
                                        {bet.odds.toFixed(2)}
                                    </span>
                                </div>
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
