import React, { useState } from 'react';
import { MatchAnalysis } from '../types';
import { BarChart3, ArrowRight } from 'lucide-react';

interface PortalMatchListProps {
  analyses: MatchAnalysis[];
  selectedLeague: string;
  onNavigate: (view: string) => void;
}

const PortalMatchList: React.FC<PortalMatchListProps> = ({ analyses, selectedLeague, onNavigate }) => {
  // Filter by league if a specific league is selected from sidebar
  let displayItems = analyses;
  if (selectedLeague !== 'Tümü' && selectedLeague !== 'Genel Maçlar') {
    displayItems = displayItems.filter(a => a.league === selectedLeague);
  }

  // Sort by confidence
  displayItems.sort((a, b) => b.confidence - a.confidence);

  // Show limited (Teaser)
  displayItems = displayItems.slice(0, 4);

  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="portal-content">


      {/* Section Heading */}
      <div className="portal-section-heading">
        <BarChart3 style={{ width: 16, height: 16 }} />
        Öne çıkan analizler
      </div>

      {/* Match Cards */}
      {displayItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#555',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#777', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
            Bu filtrede analiz bulunamadı
          </div>
          <div style={{ fontSize: 12, color: '#444' }}>
            Farklı bir tarih veya lig seçerek tekrar deneyin
          </div>
        </div>
      ) : (
        displayItems.map(item => {
          const kgVarOdd = (1.50 + Math.random() * 0.4).toFixed(2);
          const ustOdd = (1.60 + Math.random() * 0.4).toFixed(2);
          const isHome = item.prediction?.toLowerCase().includes('ev') || item.prediction?.includes('1');
          const confClass = item.confidence >= 90 ? 'portal-conf-green' : 'portal-conf-yellow';

          return (
            <div
              key={item.id}
              className="portal-match-card"
              style={{ padding: '12px 14px', minHeight: 'auto', marginBottom: '10px' }}
              onClick={() => onNavigate('analysis')}
            >
              {/* Time Column */}
              <div className="portal-mc-time">
                <div className="portal-mc-date">{formatDate(item.matchDate)}</div>
                <div className="portal-mc-hour">{item.matchTime || '21:00'}</div>
                <div className="portal-mc-comp">{item.league}</div>
              </div>

              {/* Teams Column */}
              <div>
                <div className="portal-mc-home">{item.homeTeam}</div>
                <div className="portal-mc-vs">vs</div>
                <div className="portal-mc-away">{item.awayTeam}</div>
              </div>

              {/* Right Column: Prediction + Stats */}
              <div className="portal-mc-right">
                <div className={`portal-pred-badge ${isHome ? 'portal-pred-home' : 'portal-pred-away'}`}>
                  {item.prediction}
                </div>
                <div className="portal-mc-stats">
                  <div className="portal-ms">
                    <div className="portal-ms-v">{kgVarOdd}</div>
                    <div className="portal-ms-k">KG Var</div>
                  </div>
                  <div className="portal-ms">
                    <div className="portal-ms-v">{ustOdd}</div>
                    <div className="portal-ms-k">2.5 Üst</div>
                  </div>
                  <div className="portal-ms">
                    <div className={`portal-ms-v portal-conf-v ${confClass}`}>%{item.confidence}</div>
                    <div className="portal-ms-k">Güven</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Go to Analyses Button */}
      <div className="portal-load-more">
        <button 
          className="portal-load-more-btn" 
          onClick={() => onNavigate('analysis')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          TÜM ANALİZLERE GİT <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PortalMatchList;
