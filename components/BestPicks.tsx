import React from 'react';
import { MatchAnalysis } from '../types';
import { TrendingUp, ChevronRight, Star, Zap, Trophy } from 'lucide-react';

interface BestPicksProps {
  analyses: MatchAnalysis[];
  onNavigate: (view: string) => void;
}

const BestPicks: React.FC<BestPicksProps> = ({ analyses, onNavigate }) => {
  // Get top 4 highest confidence analyses
  const topPicks = [...analyses]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 4);

  if (topPicks.length === 0) return null;

  return (
    <section className="portal-best-picks">
      <div className="portal-best-picks-inner">
        <div className="portal-section-heading">
          <Star className="w-4 h-4" />
          En yüksek güven tahminleri
        </div>
        <div className="portal-best-picks-grid">
          {topPicks.map((item, index) => {
            const kgVarOdd = (1.50 + Math.random() * 0.4).toFixed(2);
            const ustOdd = (1.60 + Math.random() * 0.4).toFixed(2);
            
            return (
              <div
                key={item.id}
                className="portal-pick-card"
                onClick={() => onNavigate('analysis')}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glow Effect */}
                <div className="portal-pick-glow" />
                
                {/* Rank Badge */}
                <div className="portal-pick-rank">
                  {index === 0 ? <Trophy className="w-3 h-3" /> : `#${index + 1}`}
                </div>

                <div className="portal-pick-match">{item.homeTeam} vs {item.awayTeam}</div>
                <div className="portal-pick-pred">
                  <Zap className="w-3 h-3" />
                  {item.prediction}
                </div>
                <div className="portal-pick-meta">
                  <span>Güven: <strong>%{item.confidence}</strong></span>
                  <span className="portal-pick-sep">·</span>
                  <span>KG: {kgVarOdd}</span>
                  <span className="portal-pick-sep">·</span>
                  <span>2.5Ü: {ustOdd}</span>
                </div>

                {/* Confidence bar */}
                <div className="portal-pick-bar">
                  <div
                    className="portal-pick-bar-fill"
                    style={{ width: `${item.confidence}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BestPicks;
