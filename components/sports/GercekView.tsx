import React, { useState, useEffect } from 'react';
import { useBetting } from '../../contexts/BettingContext';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { UpcomingMatchesView } from '../UpcomingMatchesView';
import SportsPromoSlider from './SportsPromoSlider';
import LiveHighlightsFeed from './LiveHighlightsFeed';
import PremiumMatchFeed from './PremiumMatchFeed';
import { parseMatchData } from '../Spor724View';
import { Clock, Play, Trophy, Gamepad2, ChevronDown } from 'lucide-react';

interface GercekViewProps {
  onNavigate?: (view: string) => void;
  initialTab?: string;
}

import SportsIconNav from './SportsIconNav';

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

  // Filter out finished matches
  const filteredMatches = matches.filter(m => {
    if (m.period !== 'Canlı' && m.startTs && m.startTs > 0) {
      const now = Date.now();
      if (m.startTs < now - 15 * 60 * 1000) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="w-full min-h-full bg-transparent text-slate-100 p-4 md:p-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      
      {/* ── TOP HORIZONTAL SPORTS NAV ── */}
      <div className="w-full relative z-20 mb-6 pt-2">
        <SportsIconNav />
      </div>

      {/* ── TOP HERO BANNER (SLIDER) ── */}
      <div className="mb-8">
        <SportsPromoSlider />
      </div>

      {navTab === 'upcoming' ? (
        <div className="w-full h-[calc(100vh-200px)] min-h-[600px] bg-[#0a0d14] rounded-2xl overflow-hidden mt-4 border border-white/5 shadow-2xl relative z-10">
          <UpcomingMatchesView />
        </div>
      ) : (
        <div className="w-full">
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="text-lg font-bold text-white tracking-wide">Canlı Maçlar</h2>
          </div>

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
              <LiveHighlightsFeed />
              <PremiumMatchFeed />
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default GercekView;
