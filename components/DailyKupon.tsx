import React from 'react';
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

const DailyKupon: React.FC<DailyKuponProps> = ({ config, interval = 5000, resetKey }) => {
  const cfg = config || DEFAULT_CONFIG;

  if (!cfg.isActive) return null;

  // Render Skeleton if no match data is present yet
  if (!cfg.matches || cfg.matches.length === 0) {
    return (
      <div className="daily-kupon-card daily-kupon-skeleton">
        <div className="skeleton-box skeleton" style={{ height: '24px', width: '60%' }}></div>
        <div className="skeleton-box skeleton" style={{ height: '48px', marginTop: '16px' }}></div>
        <div className="skeleton-box skeleton" style={{ height: '48px' }}></div>
        <div className="skeleton-box skeleton" style={{ height: '48px' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <div className="skeleton-box skeleton" style={{ height: '36px', width: '30%' }}></div>
          <div className="skeleton-box skeleton" style={{ height: '36px', width: '40%' }}></div>
        </div>
      </div>
    );
  }

  const totalOdd = cfg.matches.reduce((acc, m) => acc * parseFloat(m.odd || '1'), 1);

  return (
    <div className="daily-kupon-card">
      {/* Header */}
      <div className="daily-kupon-header">
        <div className="daily-kupon-header-icon">
          <Trophy className="w-4 h-4" />
        </div>
        <div className="daily-kupon-header-text">
          <h3 className="daily-kupon-title">{cfg.title || 'GÜNÜN BANKO KUPONU'}</h3>
        </div>
      </div>

      {/* Matches */}
      <div className="daily-kupon-matches">
        {cfg.matches.map((match, idx) => (
          <div key={match.id || idx} className="daily-kupon-match">
            <div className="daily-kupon-match-info">
              {match.league && (
                <span className="daily-kupon-match-league">{match.league}</span>
              )}
              <span className="daily-kupon-match-teams">
                {match.homeTeam} <span className="daily-kupon-vs">vs</span> {match.awayTeam}
              </span>
              <span className="daily-kupon-match-prediction">
                <TrendingUp className="w-3 h-3" /> {match.prediction}
              </span>
            </div>
            <div className="daily-kupon-match-odd">
              {match.odd}
            </div>
          </div>
        ))}
      </div>

      {/* Footer & Play Button */}
      <div className="daily-kupon-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div className="daily-kupon-footer-label">TOPLAM ORAN</div>
          <div className="daily-kupon-footer-odd">
            {totalOdd.toFixed(2)}
            <span className="daily-kupon-footer-x">x</span>
          </div>
        </div>
        <a 
          href={cfg.playLink || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#00ff88',
            color: '#000',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 900,
            fontSize: '13px',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00e67a';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 136, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#00ff88';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.3)';
          }}
        >
          HEMEN OYNA
        </a>
      </div>

      {/* Glow accent */}
      <div className="daily-kupon-glow" />

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
