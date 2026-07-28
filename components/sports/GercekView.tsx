import React, { useState, useEffect, useRef } from 'react';
import { useBetting } from '../../contexts/BettingContext';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { UpcomingMatchesView } from '../UpcomingMatchesView';
import SportsPromoSlider from './SportsPromoSlider';
import LiveHighlightsFeed from './LiveHighlightsFeed';
import PremiumMatchFeed from './PremiumMatchFeed';
import LiveMatchGrid from './LiveMatchGrid';
import ErrorBoundary from './ErrorBoundary';
import FeaturedCombos from './FeaturedCombos';
import { parseMatchData } from '../Spor724View';
import { Clock, Play, Trophy, Gamepad2, ChevronDown } from 'lucide-react';

interface GercekViewProps {
  onNavigate?: (view: string) => void;
  initialTab?: string;
}

import SportsIconNav from './SportsIconNav';
import FavoritesEmptyState from './FavoritesEmptyState';
import MyBetsEmptyState from './MyBetsEmptyState';

const GercekView: React.FC<GercekViewProps> = ({ onNavigate, initialTab = 'home' }) => {
  const { events } = useBetting();
  const isParsing = false; // Add parsing state if needed later
  
  // Use parseMatchData for 100% compatibility with Spor724View UI components
  const matches = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    const parsedMatches: any[] = [];
    events.forEach((ev: any) => {
      const matchObj = parseMatchData(ev, 'tr');
      if (matchObj) parsedMatches.push(matchObj);
    });
    return parsedMatches;
  }, [events]);

  const activeSportName = 'Tüm Sporlar'; // Fallback for All Sports view
  const isAllSportsSelected = true;
  const visibleCount = 50;

  const liveCountsMap = React.useMemo(() => {
    const counts: Record<string, number> = {};
    matches.forEach(m => {
      if (m.isLive) {
         counts[m.sport] = (counts[m.sport] || 0) + 1;
      }
    });
    return counts;
  }, [matches]);

  const { betSlip, selectBet } = useBetSlip();
  const [navTab, setNavTab] = useState(initialTab);
  const [activeSport, setActiveSport] = useState('futbol');

  useEffect(() => {
    setNavTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      setNavTab(e.detail);
    };
    window.addEventListener('changeSportsTab', handleTabChange as EventListener);
    return () => window.removeEventListener('changeSportsTab', handleTabChange as EventListener);
  }, []);

  const mockLiveMatches: any[] = [];

  // Filter out finished matches (Original Logic)
  const realFilteredMatches = matches.filter(m => {
    if (m.period !== 'Canlı' && m.startTs && m.startTs > 0) {
      const now = Date.now();
      if (m.startTs < now - 15 * 60 * 1000) {
        return false;
      }
    }
    return true;
  });

  // Use real data instead of overriding with []
  const filteredMatches = realFilteredMatches;

  const isAuthenticated = !!localStorage.getItem('site_member');

  const [oddsOpen, setOddsOpen] = useState(false);
  const [selectedOdds, setSelectedOdds] = useState('Malezya');
  const oddsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (oddsRef.current && !oddsRef.current.contains(event.target as Node)) {
        setOddsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <ErrorBoundary>
      <div className="w-full min-h-full bg-transparent text-slate-100 p-4 md:p-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      
      {/* ── TOP HORIZONTAL SPORTS NAV ── */}
      <div className="w-full relative z-20 mb-6 pt-2">
        <SportsIconNav activeTab={navTab} onTabChange={setNavTab} liveCounts={liveCountsMap} />
      </div>

      {/* ── TOP HERO BANNER (SLIDER) ── */}
      {navTab !== 'favorites' && navTab !== 'mybets' && (
        <div className="mb-8">
          <SportsPromoSlider />
          
          {/* Featured Combos Widget */}
          {navTab !== 'canli' && (
            <div className="mt-8">
              <FeaturedCombos activeSport={activeSport} />
            </div>
          )}
        </div>
      )}

      {navTab === 'favorites' && !isAuthenticated ? (
        <FavoritesEmptyState />
      ) : navTab === 'mybets' && !isAuthenticated ? (
        <MyBetsEmptyState />
      ) : navTab === 'upcoming' ? (
        <div className="w-full h-[calc(100vh-200px)] min-h-[600px] bg-[#0a0d14] rounded-2xl overflow-hidden mt-4 border border-white/5 shadow-2xl relative z-10">
          <UpcomingMatchesView />
        </div>
      ) : (
        <div className="w-full">
          {isParsing ? (
            <div className="py-24 flex flex-col items-center justify-center text-center bg-[#0b0e11] rounded-xl border border-white/5">
              <div className="relative w-12 h-12 mb-4">
                <span className="animate-ping absolute inset-0 rounded-full bg-[#10b981] opacity-20"></span>
                <div className="w-12 h-12 rounded-full border-2 border-[#10b981]/20 border-t-[#10b981] animate-spin"></div>
              </div>
              <h3 className="text-white text-base font-bold tracking-wide mb-1 animate-pulse">MAÇ BÜLTENİ YÜKLENİYOR...</h3>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="py-24 text-center bg-[#0b0e11] rounded-xl border border-white/5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg">
                <Trophy className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-white font-medium mb-1">Karşılaşma Bulunamadı</p>
              <p className="text-slate-500 text-sm">Bu kategoride şu an aktif veya yaklaşan bir maç yok.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {navTab === 'canli' && <LiveMatchGrid matches={filteredMatches} />}
              {navTab !== 'canli' && <PremiumMatchFeed />}
            </div>
          )}
        </div>
      )}

      {/* ── GLOBAL ODDS FORMAT FOOTER ── */}
      <div className="w-full flex flex-col items-center mt-16 pt-8 border-t border-white/5 pb-8">
        <div className="flex items-center gap-3 mb-6 relative">
          <span className="text-[#8b95a5] text-[11px] font-bold tracking-[0.1em] uppercase">ORAN FORMATI</span>
          <div className="relative" ref={oddsRef}>
            <button 
              onClick={() => setOddsOpen(!oddsOpen)}
              className="bg-[#1b2030] text-white text-[13px] font-medium py-1.5 px-4 rounded-lg flex items-center gap-6 cursor-pointer border border-white/5 hover:bg-[#252a3a] transition-colors whitespace-nowrap min-w-[130px] justify-between"
            >
              <span>{selectedOdds}</span>
              {oddsOpen ? (
                <span className="text-[9px] text-white">▲</span>
              ) : (
                <span className="text-[9px] text-slate-400">▼</span>
              )}
            </button>

            {oddsOpen && (
              <div className="absolute left-0 bottom-full mb-1.5 w-[150px] bg-[#161925] border border-white/5 rounded-xl py-1.5 shadow-2xl z-50 text-left">
                {['Avrupa', 'Amerika', 'Hong Kong', 'Endonezya', 'Malezya'].map((odds) => {
                  const isActive = selectedOdds === odds;
                  return (
                    <button
                      key={odds}
                      onClick={() => {
                        setSelectedOdds(odds);
                        setOddsOpen(false);
                      }}
                      className={`w-full py-2 px-4 text-[13px] font-medium text-left transition-colors block ${
                        isActive 
                          ? 'bg-[#2b85fa] text-white' 
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {odds}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <p className="text-[#555d6e] text-[11px] leading-relaxed max-w-[600px] text-center">
          Sitemiz üzerindeki verilerin en doğru şekilde aktarılması için özen gösterilmesine rağmen bu veriler sadece bilgilendirme amaçlıdır ve herhangi bir yanlışlıkta sitemiz sorumluluk kabul etmez.
        </p>
      </div>

      </div>
    </ErrorBoundary>
  );
};

export default GercekView;
