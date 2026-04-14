import React, { useState } from 'react';
import { MatchAnalysis, Coupon } from '../types';
import { Trophy, ChevronRight, Shield, Flame, Zap, Star, TrendingUp, Target } from 'lucide-react';

interface PortalSidebarProps {
  analyses: MatchAnalysis[];
  coupons: Coupon[];
  selectedLeague: string;
  onLeagueSelect: (league: string) => void;
  onNavigate: (view: string) => void;
}

const PortalSidebar: React.FC<PortalSidebarProps> = ({
  analyses,
  coupons,
  selectedLeague,
  onLeagueSelect,
  onNavigate,
}) => {
  /* Build league counts from real data */
  const leagueCounts: Record<string, number> = {};
  analyses.forEach(a => {
    const lg = a.league || 'Diğer';
    leagueCounts[lg] = (leagueCounts[lg] || 0) + 1;
  });

  const leagueList = [
    { name: 'Tümü', count: analyses.length },
    ...Object.entries(leagueCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count })),
  ];

  /* Get icons for top leagues */
  const getLeagueEmoji = (name: string) => {
    const map: Record<string, string> = {
      'Süper Lig': '🇹🇷',
      'Premier League': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'La Liga': '🇪🇸',
      'Bundesliga': '🇩🇪',
      'Serie A': '🇮🇹',
      'Ligue 1': '🇫🇷',
      'Champions League': '⭐',
      'Europa League': '🏆',
      'Conference League': '🏅',
      'Tümü': '⚽',
    };
    return map[name] || '🏟️';
  };

  return (
    <aside className="portal-sidebar">
      {/* Logo Badge */}
      <div className="portal-sb-logo">
        <div className="portal-sb-logo-icon">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <div className="portal-sb-logo-title">724BAHİS</div>
          <div className="portal-sb-logo-sub">Premium Analiz</div>
        </div>
      </div>

      {/* Leagues */}
      <div className="portal-sb-section">
        <div className="portal-sb-title">
          <span className="portal-sb-title-dot" />
          LİGLER
        </div>
        <div className="portal-sb-leagues">
          {leagueList.map((lg) => (
            <button
              key={lg.name}
              className={`portal-sb-league ${selectedLeague === lg.name ? 'active' : ''}`}
              onClick={() => onLeagueSelect(lg.name)}
            >
              <span className="portal-sb-league-emoji">{getLeagueEmoji(lg.name)}</span>
              <span className="portal-sb-league-name">{lg.name}</span>
              <span className="portal-sb-league-cnt">{lg.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="portal-sb-section">
        <div className="portal-sb-title">
          <span className="portal-sb-title-dot" />
          HIZLI İSTATİSTİK
        </div>
        <div className="portal-sb-stats">
          <div className="portal-sb-stat">
            <div className="portal-sb-stat-val">
              {analyses.length > 0 ? `%${Math.max(...analyses.map(a => a.confidence))}` : '%0'}
            </div>
            <div className="portal-sb-stat-label">En Yüksek Güven</div>
          </div>
          <div className="portal-sb-stat">
            <div className="portal-sb-stat-val">{analyses.length}</div>
            <div className="portal-sb-stat-label">Aktif Analiz</div>
          </div>
          <div className="portal-sb-stat">
            <div className="portal-sb-stat-val">{coupons.length}</div>
            <div className="portal-sb-stat-label">Günlük Kupon</div>
          </div>
        </div>
      </div>



      {/* Coupon Summary */}
      {coupons.length > 0 && (
        <div className="portal-sb-section" style={{ marginTop: 8 }}>
          <div className="portal-sb-title">
            <span className="portal-sb-title-dot" style={{ background: '#22c55e' }} />
            SON KUPON
          </div>
          <div className="portal-sb-coupon-peek">
            <div className="portal-sb-coupon-header">
              <span className="portal-sb-coupon-risk" data-risk={coupons[0].riskLevel}>
                {coupons[0].riskLevel === 'LOW' ? '🛡️ BANKO' : coupons[0].riskLevel === 'HIGH' ? '🔥 RİSKLİ' : '⚡ ÖNERİ'}
              </span>
              <span className="portal-sb-coupon-odd">{coupons[0].totalOdd}x</span>
            </div>
            {coupons[0].matches.slice(0, 2).map((m, i) => (
              <div key={i} className="portal-sb-coupon-match">
                <span>{m.homeTeam} - {m.awayTeam}</span>
                <span className="portal-sb-coupon-pred">{m.prediction}</span>
              </div>
            ))}
            {coupons[0].matches.length > 2 && (
              <div className="portal-sb-coupon-more">+{coupons[0].matches.length - 2} daha...</div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default PortalSidebar;
