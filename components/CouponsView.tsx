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
    <div className="layout-container">
      <Header 
        siteUser={siteUser} 
        userRole={userRole} 
        onLoginClick={() => setAuthModalMode('member')}
        onNavigate={onNavigate}
        statusConfig={statusConfig}
      />
      <main className="main-content">
        <div className="w-full max-w-6xl mx-auto px-4 pt-24 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tight uppercase mb-4" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            GÜNÜN <span className="text-[#f0b90b]">KUPONLARI</span>
          </h2>
          <p className="text-zinc-400 font-bold max-w-2xl mx-auto mb-8">
            Uzman ekibimiz ve yapay zeka analizlerimizle oluşturulan günün en iyi kuponlarını incele, kazanmaya hemen başla!
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 pb-20 relative z-10">
           <DailyCoupons 
              coupons={coupons}
              isLoggedIn={!!(siteUser || userRole)}
              onLoginRequired={() => setAuthModalMode('member')}
           />
        </div>
      </main>
    </div>
  );
};

export default CouponsView;
