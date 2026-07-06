import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { DailyKuponConfig } from '../types';

interface DailyKuponProps {
  config: DailyKuponConfig;
  interval?: number;
  resetKey?: number | string;
}

const DEFAULT_CONFIG: DailyKuponConfig = {
  isActive: true,
  title: "GÜNÜN BANKO KUPONU",
  matches: []
};

const LOW_RISK_COUPON = {
  title: 'GÜNÜN AZ RİSK KUPONU',
  matches: [
    { id: 'l1', league: 'DÜNYA KUPASI 2026', homeTeam: 'Hollanda', awayTeam: 'İsveç', prediction: 'MS 1', odd: '1.65' },
    { id: 'l2', league: 'DÜNYA KUPASI 2026', homeTeam: 'İspanya', awayTeam: 'Suudi Arabistan', prediction: 'MS 1', odd: '1.30' },
  ],
  playLink: 'https://gamdom.com/r/724bahis',
  totalOdd: '2.15'
};

const MEDIUM_RISK_COUPON = {
  title: 'GÜNÜN BANKO KUPONU',
  matches: [
    { id: 'm1', league: 'UEFA AVRUPA LİGİ', homeTeam: 'Aston Villa', awayTeam: 'Bologna', prediction: 'M.S 1', odd: '1.54' },
    { id: 'm2', league: 'UEFA AVRUPA LİGİ', homeTeam: 'Nottingham Forest', awayTeam: 'Porto', prediction: '1.5 ÜST', odd: '1.43' },
  ],
  playLink: 'https://gamdom.com/r/724bahis',
  totalOdd: '2.20'
};

const HIGH_RISK_COUPON = {
  title: 'GÜNÜN YÜKSEK RİSK KUPONU',
  matches: [
    { id: 'h1', league: 'DÜNYA KUPASI 2026', homeTeam: 'Almanya', awayTeam: 'Fildişi Sahili', prediction: 'KG VAR', odd: '1.85' },
    { id: 'h2', league: 'DÜNYA KUPASI 2026', homeTeam: 'Ekvador', awayTeam: 'Curacao', prediction: 'HMS 1 (-1)', odd: '2.10' },
  ],
  playLink: 'https://gamdom.com/r/724bahis',
  totalOdd: '3.89'
};

const DailyKupon: React.FC<DailyKuponProps> = ({ config, interval = 5000, resetKey }) => {
  const cfg = config || DEFAULT_CONFIG;
  const [activeTab, setActiveTab] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    if (resetKey !== undefined && resetKey !== 0) {
      setActiveTab((prev) => {
        if (prev === 'low') return 'medium';
        if (prev === 'medium') return 'high';
        return 'low';
      });
    }
  }, [resetKey]);

  if (!cfg.isActive) return null;

  // Determine coupon data to render
  const getActiveCoupon = () => {
    switch (activeTab) {
      case 'low':
        return LOW_RISK_COUPON;
      case 'high':
        return HIGH_RISK_COUPON;
      case 'medium':
      default:
        // Use custom dashboard matches if present, otherwise fallback
        if (cfg.matches && cfg.matches.length > 0) {
          const totalCalculated = cfg.matches.reduce((acc, m) => acc * parseFloat(m.odd || '1'), 1);
          return {
            title: cfg.title || 'GÜNÜN BANKO KUPONU',
            matches: cfg.matches,
            playLink: cfg.playLink || 'https://gamdom.com/r/724bahis',
            totalOdd: totalCalculated.toFixed(2)
          };
        }
        return MEDIUM_RISK_COUPON;
    }
  };

  const coupon = getActiveCoupon();

  return (
    <div style={{
      background: 'linear-gradient(160deg, #060c06 0%, #08110a 50%, #060c06 100%)',
      border: '1px solid rgba(242, 169, 0, 0.2)',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 0 24px rgba(242, 169, 0, 0.05), inset 0 1px 0 rgba(242, 169, 0, 0.08)'
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', border: '1px solid rgba(242, 169, 0, 0.1)', boxShadow: '0 0 32px rgba(242, 169, 0, 0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 20%, rgba(242, 169, 0, 0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '16px', borderBottom: '1px solid rgba(242, 169, 0, 0.12)', position: 'relative', zIndex: 2 }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(242, 169, 0, 0.08)', border: '1px solid rgba(242, 169, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Trophy style={{ width: '16px', height: '16px', color: '#f2a900' }} />
        </div>
        <h3 style={{ margin: 0, fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: '#f2a900' }}>{coupon.title}</h3>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '3px', background: 'rgba(0,0,0,0.5)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', margin: '10px 0', position: 'relative', zIndex: 2 }}>
        {(['low', 'medium', 'high'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              background: activeTab === tab ? 'rgba(242, 169, 0, 0.12)' : 'transparent',
              border: activeTab === tab ? '1px solid rgba(242, 169, 0, 0.35)' : '1px solid transparent',
              color: activeTab === tab ? '#f2a900' : '#555',
              fontSize: '8px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '5px 2px',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: activeTab === tab ? '0 0 10px rgba(242, 169, 0, 0.15)' : 'none'
            }}
          >
            {tab === 'low' ? 'Az Risk' : tab === 'medium' ? 'Orta Risk' : 'Yüksek'}
          </button>
        ))}
      </div>

      {/* Matches */}
      <div style={{ minHeight: '130px', display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative', zIndex: 2 }}>
        {coupon.matches.map((match, idx) => (
          <div key={match.id || idx} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(242, 169, 0, 0.08)', borderRadius: '8px', padding: '8px 10px' }}>
            {match.league && (
              <span style={{ display: 'block', fontSize: '8px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>{match.league}</span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#e0e0e0' }}>
                <span style={{ fontWeight: 900 }}>{match.homeTeam}</span>
                <span style={{ color: '#444', fontSize: '10px', margin: '0 4px' }}>vs</span>
                <span style={{ fontWeight: 900 }}>{match.awayTeam}</span>
              </span>
              <span style={{ fontSize: '15px', fontWeight: 900, color: '#f2a900', textShadow: '0 0 10px rgba(242, 169, 0, 0.4)', flexShrink: 0, marginLeft: '8px' }}>{match.odd}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <TrendingUp style={{ width: '10px', height: '10px', color: '#f2a900' }} />
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#f2a900', opacity: 0.8 }}>{match.prediction}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(242, 169, 0, 0.1)', position: 'relative', zIndex: 2 }}>
        <div>
          <div style={{ fontSize: '8px', fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>TOPLAM ORAN</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#f2a900', lineHeight: 1, textShadow: '0 0 20px rgba(242, 169, 0, 0.4)', fontStyle: 'italic', letterSpacing: '-0.5px' }}>
            {parseFloat(coupon.totalOdd).toFixed(2)}
            <span style={{ fontSize: '13px', color: '#f2a900', marginLeft: '1px', fontStyle: 'normal', opacity: 0.7 }}>x</span>
          </div>
        </div>
        <a 
          href={coupon.playLink || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f2a900',
            color: '#000',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 900,
            fontSize: '12px',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 0 20px rgba(242, 169, 0, 0.35)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e0a800';
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(242, 169, 0, 0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f2a900';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(242, 169, 0, 0.35)';
          }}
        >
          HEMEN OYNA
        </a>
      </div>

      {/* Synchronized Progress bar */}
      {cfg.isActive && (
        <div className="daily-kupon-progress">
          <div 
            className="daily-kupon-progress-fill"
            style={{ animationDuration: `${interval}ms` }}
            key={resetKey}
          />
        </div>
      )}
    </div>
  );
};

export default DailyKupon;
