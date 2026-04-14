import React, { useState } from 'react';
import { MatchAnalysis } from '../types';
import { TrendingUp, ChevronRight, ArrowRight, BarChart3 } from 'lucide-react';

interface PortalMatchListProps {
  analyses: MatchAnalysis[];
  selectedLeague: string;
  onNavigate: (view: string) => void;
}

const PortalMatchList: React.FC<PortalMatchListProps> = ({ analyses, selectedLeague, onNavigate }) => {
  const [sportTab, setSportTab] = useState<'Futbol' | 'Basketbol'>('Futbol');
  const [filterTab, setFilterTab] = useState('Tümü');
  const [showAll, setShowAll] = useState(false);

  // Filter by sport
  let filtered = analyses.filter(a => {
    if (sportTab === 'Basketbol') return a.sport === 'Basketbol' || a.league?.toLowerCase().includes('nba');
    return a.sport !== 'Basketbol' && !a.league?.toLowerCase().includes('nba');
  });

  // Filter by league
  if (selectedLeague !== 'Tümü') {
    filtered = filtered.filter(a => a.league === selectedLeague);
  }

  // Sort by confidence
  filtered.sort((a, b) => b.confidence - a.confidence);

  // Show limited or all
  const displayItems = showAll ? filtered : filtered.slice(0, 6);

  // Day tabs
  const days: { label: string; date: string }[] = [];
  const today = new Date();
  days.push({ label: 'Tüm Hafta', date: 'all' });
  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    days.push({
      label: `${dayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]}`,
      date: d.toISOString().split('T')[0],
    });
  }

  const [selectedDay, setSelectedDay] = useState('all');

  // Filter by day
  let dayFiltered = displayItems;
  if (selectedDay !== 'all') {
    dayFiltered = dayFiltered.filter(a => a.matchDate === selectedDay);
  }

  // Get unique leagues for filter tabs
  const uniqueLeagues = Array.from(new Set(filtered.map(a => a.league))).slice(0, 3);

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="portal-content">
      {/* Sport Tabs */}
      <div className="portal-tab-group">
        <button
          className={`portal-tab-btn ${sportTab === 'Futbol' ? 'active' : 'inactive'}`}
          onClick={() => setSportTab('Futbol')}
        >
          ⚽ Futbol
        </button>
        <button
          className={`portal-tab-btn ${sportTab === 'Basketbol' ? 'active' : 'inactive'}`}
          onClick={() => setSportTab('Basketbol')}
        >
          🏀 Basketbol
        </button>
      </div>

      {/* Day Selector */}
      <div className="portal-day-group">
        {days.map(day => (
          <button
            key={day.date}
            className={`portal-day-btn ${selectedDay === day.date ? 'active' : 'inactive'}`}
            onClick={() => setSelectedDay(day.date)}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="portal-tab-group">
        <button
          className={`portal-tab-btn ${filterTab === 'Tümü' ? 'active' : 'inactive'}`}
          onClick={() => setFilterTab('Tümü')}
        >
          Tümü
        </button>
        {uniqueLeagues.map(lg => (
          <button
            key={lg}
            className={`portal-tab-btn ${filterTab === lg ? 'active' : 'inactive'}`}
            onClick={() => setFilterTab(lg)}
          >
            {lg}
          </button>
        ))}
      </div>

      {/* Section Heading */}
      <div className="portal-section-heading">
        <BarChart3 style={{ width: 16, height: 16 }} />
        Öne çıkan analizler
      </div>

      {/* Match Cards */}
      {dayFiltered.length === 0 ? (
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
        dayFiltered.map(item => {
          const kgVarOdd = (1.50 + Math.random() * 0.4).toFixed(2);
          const ustOdd = (1.60 + Math.random() * 0.4).toFixed(2);
          const isHome = item.prediction?.toLowerCase().includes('ev') || item.prediction?.includes('1');
          const confClass = item.confidence >= 90 ? 'portal-conf-green' : 'portal-conf-yellow';

          return (
            <div
              key={item.id}
              className="portal-match-card"
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

      {/* Load More */}
      {!showAll && filtered.length > 6 && (
        <div className="portal-load-more">
          <button className="portal-load-more-btn" onClick={() => setShowAll(true)}>
            Daha fazla analiz gör ({filtered.length - 6} maç daha)
          </button>
        </div>
      )}

      {showAll && filtered.length > 6 && (
        <div className="portal-load-more">
          <button className="portal-load-more-btn" onClick={() => setShowAll(false)}>
            Daha az göster
          </button>
        </div>
      )}
    </div>
  );
};

export default PortalMatchList;
