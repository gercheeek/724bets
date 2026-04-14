import React from 'react';
import { Home, BarChart3, Ticket, Shield, User } from 'lucide-react';

interface PortalMobileNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const PortalMobileNav: React.FC<PortalMobileNavProps> = ({ activeView, onViewChange }) => {
  const items = [
    { view: 'home', label: 'Ana Sayfa', icon: <Home style={{ width: 20, height: 20 }} /> },
    { view: 'analysis', label: 'Analizler', icon: <BarChart3 style={{ width: 20, height: 20 }} /> },
    { view: 'home', label: 'Kuponlar', icon: <Ticket style={{ width: 20, height: 20 }} />, scrollTo: 'daily-coupons' },
    { view: 'brands', label: 'Siteler', icon: <Shield style={{ width: 20, height: 20 }} /> },
    { view: 'loyalty', label: 'Profil', icon: <User style={{ width: 20, height: 20 }} /> },
  ];

  return (
    <nav className="portal-mobile-nav">
      <div className="portal-mobile-nav-inner">
        {items.map((item, idx) => (
          <button
            key={idx}
            className={`portal-mob-item ${activeView === item.view ? 'active' : ''}`}
            onClick={() => {
              onViewChange(item.view);
              if (item.scrollTo) {
                setTimeout(() => {
                  const el = document.getElementById(item.scrollTo!);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }
            }}
          >
            <div className="portal-mob-icon">{item.icon}</div>
            <div className="portal-mob-label">{item.label}</div>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default PortalMobileNav;
