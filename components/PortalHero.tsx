import React from 'react';
import { MatchAnalysis } from '../types';
import { PlayCircle, Target } from 'lucide-react';

interface PortalHeroProps {
  analyses: MatchAnalysis[];
  onNavigate: (view: string) => void;
}

const PortalHero: React.FC<PortalHeroProps> = ({ analyses, onNavigate }) => {
  const maxConf = analyses.length > 0 ? Math.max(...analyses.map(a => a.confidence)) : 96;
  const totalAnalyses = analyses.length || 0;

  return (
    <section className="portal-hero">
      <h1>
        Kazanç tesadüf değil,<br />
        <span className="accent">strateji işidir.</span>
      </h1>
      <p className="sub">
        Yapay zeka destekli istatistik, anlık takım formu ve xG verileriyle profesyonel maç analizleri üretiyoruz.
      </p>
      <div className="portal-hero-stats">
        <div className="portal-hs">
          <div className="portal-hs-v">%{maxConf}</div>
          <div className="portal-hs-k">En Yüksek Güven</div>
        </div>
        <div className="portal-hs">
          <div className="portal-hs-v">{totalAnalyses > 0 ? `${totalAnalyses}+` : '1200+'}</div>
          <div className="portal-hs-k">Aktif Analiz</div>
        </div>
        <div className="portal-hs">
          <div className="portal-hs-v">%78</div>
          <div className="portal-hs-k">Başarı Oranı</div>
        </div>
      </div>
      <br />
      <button className="portal-hero-btn" onClick={() => onNavigate('analysis')}>
        <PlayCircle style={{ width: 18, height: 18 }} />
        Analizleri Görüntüle
      </button>
    </section>
  );
};

export default PortalHero;
