import React from 'react';
import { Trophy, TrendingUp, Zap } from 'lucide-react';
import { DailyKuponConfig } from '../types';

interface DailyKuponProps {
  config: DailyKuponConfig;
  interval?: number;
  resetKey?: number | string;
}

const DEFAULT_CONFIG: DailyKuponConfig = {
  isActive: true,
  title: "GÜNÜN BANKO KUPONU",
  matches: [
    { id: '1', homeTeam: 'Galatasaray', awayTeam: 'Fenerbahçe', prediction: 'M.S 1', odd: '1.85', league: 'Süper Lig' },
    { id: '2', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', prediction: 'KG VAR', odd: '1.55', league: 'La Liga' },
    { id: '3', homeTeam: 'Man City', awayTeam: 'Arsenal', prediction: '2.5 ÜST', odd: '1.65', league: 'Premier League' },
  ]
};

const DailyKupon: React.FC<DailyKuponProps> = ({ config, interval = 5000, resetKey }) => {
  const cfg = (config && config.matches && config.matches.length > 0) ? config : DEFAULT_CONFIG;

  if (!cfg.isActive) return null;

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
          <span className="daily-kupon-badge">
            <Zap className="w-3 h-3" /> AI ANALİZ
          </span>
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

      {/* Footer */}
      <div className="daily-kupon-footer">
        <div className="daily-kupon-footer-label">TOPLAM ORAN</div>
        <div className="daily-kupon-footer-odd">
          {totalOdd.toFixed(2)}
          <span className="daily-kupon-footer-x">x</span>
        </div>
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
