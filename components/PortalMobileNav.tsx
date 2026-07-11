import React from 'react';
import { 
  HomeOutlined, 
  BarChartOutlined, 
  SafetyOutlined, 
  PlayCircleOutlined 
} from '@ant-design/icons';

interface PortalMobileNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

interface NavItem {
  view: string;
  label: string;
  icon: React.ReactNode;
  scrollTo?: string;
}

const PortalMobileNav: React.FC<PortalMobileNavProps> = ({ activeView, onViewChange }) => {
  const items: NavItem[] = [
    { view: 'home', label: 'Ana Sayfa', icon: <HomeOutlined style={{ fontSize: '20px' }} /> },
    { view: 'trusted-sites', label: 'Siteler', icon: <SafetyOutlined style={{ fontSize: '20px' }} /> },
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
