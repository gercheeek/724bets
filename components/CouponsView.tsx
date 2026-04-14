import React from 'react';
import Header from './Header';
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
    <div className="layout-container min-h-screen relative">
      {/* Sport-Themed Ambient Glow */}
      <div 
        className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(240, 185, 11, 0.1) 0%, transparent 70%)' }}
      />

      <Header 
        siteUser={siteUser} 
        userRole={userRole} 
        onMemberLoginClick={() => setAuthModalMode('member')}
        onNavigate={onNavigate}
        statusConfig={statusConfig}
      />
      <main className="main-content relative z-10">
        <div className="w-full max-w-6xl mx-auto px-4 pt-12 pb-6 text-center">
          <h2 className="text-2xl md:text-4xl font-black text-white italic tracking-tight uppercase mb-2" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            GÜNÜN <span className="text-[#f0b90b]">KUPONLARI</span>
          </h2>
          <p className="text-zinc-500 font-bold text-[10px] md:text-xs max-w-xl mx-auto uppercase tracking-wider">
            Yapay zeka onaylı günün en iyi kuponlarını incele
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto px-2 pb-20">
           <DailyCoupons 
              coupons={coupons}
              isLoggedIn={!!(siteUser || userRole)}
              onLoginRequired={() => setAuthModalMode('member')}
              hideHeading={true}
           />
        </div>
      </main>
    </div>
  );
};

export default CouponsView;
