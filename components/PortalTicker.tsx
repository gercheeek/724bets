import React from 'react';
import { LiveOddsConfig, LiveOddsMatch, MatchAnalysis } from '../types';

interface PortalTickerProps {
  analyses: MatchAnalysis[];
  liveOddsConfig?: LiveOddsConfig;
}

const PortalTicker: React.FC<PortalTickerProps> = ({ analyses, liveOddsConfig }) => {
  /* Build ticker items from real data */
  interface TickItem {
    homeTeam: string;
    awayTeam: string;
    league: string;
    isLive: boolean;
    odd1: string;
    oddX: string;
    odd2: string;
    featured?: number; // index of featured odd (0,1,2)
  }

  let tickItems: TickItem[] = [];

  // Use liveOddsConfig if available
  if (liveOddsConfig?.matches && liveOddsConfig.matches.length > 0) {
    tickItems = liveOddsConfig.matches.map(m => ({
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      league: m.league,
      isLive: m.isLive,
      odd1: m.odd1,
      oddX: m.oddX,
      odd2: m.odd2,
      featured: m.isLive ? 0 : undefined,
    }));
  } else {
    // Fallback: generate from analyses
    tickItems = analyses.slice(0, 6).map((a, i) => ({
      homeTeam: a.homeTeam,
      awayTeam: a.awayTeam,
      league: a.league || 'Genel',
      isLive: i < 2,
      odd1: (1.5 + Math.random() * 1.5).toFixed(2),
      oddX: (2.8 + Math.random() * 1.2).toFixed(2),
      odd2: (2.2 + Math.random() * 2).toFixed(2),
      featured: i % 3,
    }));
  }

  // Fallback demo data if nothing exists
  if (tickItems.length === 0) {
    tickItems = [
      { homeTeam: 'Galatasaray', awayTeam: 'Fenerbahçe', league: 'Süper Lig', isLive: true, odd1: '2.10', oddX: '3.40', odd2: '3.25', featured: 2 },
      { homeTeam: 'Real Madrid', awayTeam: 'Barcelona', league: 'La Liga', isLive: false, odd1: '2.45', oddX: '3.30', odd2: '2.80' },
      { homeTeam: 'Beşiktaş', awayTeam: 'Trabzonspor', league: 'Süper Lig', isLive: true, odd1: '1.85', oddX: '3.50', odd2: '4.10', featured: 0 },
      { homeTeam: 'Man City', awayTeam: 'Liverpool', league: 'Premier Lg', isLive: false, odd1: '1.95', oddX: '3.60', odd2: '3.50' },
      { homeTeam: 'Bayern', awayTeam: 'Dortmund', league: 'Bundesliga', isLive: false, odd1: '1.70', oddX: '3.90', odd2: '4.50' },
    ];
  }

  // Double the items for infinite scroll
  const displayItems = [...tickItems, ...tickItems];

  return (
    <div className="portal-ticker">
      <div className="portal-ticker-track">
        {displayItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <div className="portal-tick">
              {item.isLive && <span className="portal-tick-live">CANLI</span>}
              <span className="portal-tick-teams">
                <b>{item.homeTeam}</b> vs <b>{item.awayTeam}</b>
              </span>
              <span className="portal-tick-league">{item.league}</span>
              <div className="portal-tick-odds">
                <span className={`portal-odd-pill ${item.featured === 0 ? 'featured' : ''}`}>{item.odd1}</span>
                <span className={`portal-odd-pill ${item.featured === 1 ? 'featured' : ''}`}>{item.oddX}</span>
                <span className={`portal-odd-pill ${item.featured === 2 ? 'featured' : ''}`}>{item.odd2}</span>
              </div>
            </div>
            <div className="portal-tick-sep" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PortalTicker;
