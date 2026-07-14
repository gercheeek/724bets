import React from 'react';
import { BettingProvider, useBetting } from '../contexts/BettingContext';
import { SporxSidebar } from './SporxSidebar';
import { SporxMain } from './SporxMain';
import { SporxBetSlip } from './SporxBetSlip';
import { MatchDetailModal } from './MatchDetailModal';

const SporxBulletinContent = ({ onBack, onNavigate }: any) => {
  const { selectedMatch, setSelectedMatch } = useBetting();

  return (
    <div className="flex h-[calc(100vh-100px)] w-full bg-[#0F1115] text-white font-sans overflow-hidden">
      {/* 1. LEFT SIDEBAR */}
      <SporxSidebar />

      {/* 2. MAIN CONTENT (Matches) */}
      <SporxMain />

      {/* 3. RIGHT SIDEBAR (Bet Slip) */}
      <SporxBetSlip />

      {/* Match Detail Modal */}
      {selectedMatch && (
        <MatchDetailModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatch(null)} 
        />
      )}
    </div>
  );
};

export const SporxBulletin = (props: any) => {
  return (
    <BettingProvider>
      <SporxBulletinContent {...props} />
    </BettingProvider>
  );
};
