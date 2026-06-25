import React from 'react';
import DailyCoupons from './DailyCoupons';
import { Coupon, SiteUser, SiteStatusConfig } from '../types';

interface CouponsViewProps {
  coupons?: Coupon[];
  siteUser: SiteUser | null;
  userRole: string | null;
  setAuthModalMode: (mode: 'member' | 'admin' | null) => void;
  onNavigate: (view: string) => void;
  statusConfig: SiteStatusConfig;
}

const CouponsView: React.FC<CouponsViewProps> = ({ coupons, siteUser, userRole, setAuthModalMode, onNavigate, statusConfig }) => {
  return (
    <div className="w-full min-h-screen font-sans overflow-x-hidden pb-20 relative transition-all duration-700">
      {/* Sport-Themed Ambient Glow */}
      <div 
        className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(240, 185, 11, 0.1) 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-4xl mx-auto px-2 pt-6 relative z-10">
         <DailyCoupons 
            coupons={coupons}
            isLoggedIn={!!(siteUser || userRole)}
            onLoginRequired={() => setAuthModalMode('member')}
            hideHeading={false}
         />
      </div>
    </div>
  );
};

export default CouponsView;
