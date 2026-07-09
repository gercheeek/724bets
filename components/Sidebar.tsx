import React, { useState } from 'react';
import {
  Menu, Home, Ticket, BarChart3, Target, Trophy, Gift,
  TicketCheck, Shield, Spade, Tv, ChevronDown, MessageSquare, Send, HelpCircle,
  Globe, Users, Gamepad2
} from 'lucide-react';
import { NavVisibility } from './Header';

interface CategoryItem {
  key: string;
  view: string;
  label: string;
  icon: React.ReactNode;
  visKey?: keyof NavVisibility;
  requireRole?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
  userRole?: string | null;
  navVisibility?: NavVisibility;
  onStartTour?: () => void;
}

const ICON_SIZE = 'w-5 h-5';

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeView,
  onViewChange,
  userRole,
  navVisibility,
  onStartTour,
}) => {
  const [isCasinoDropdownOpen, setIsCasinoDropdownOpen] = useState(true);

  const mainCategories: CategoryItem[] = [
    { key: 'home', view: 'home', label: 'Ana Sayfa', icon: <Home className={ICON_SIZE} /> },
  ];

  const casinoCategories: CategoryItem[] = [
    { key: 'sports2', view: 'sports2', label: 'Spor', icon: <Trophy className={ICON_SIZE} /> },
    { key: 'blackjack', view: 'blackjack', label: 'Casino', icon: <Spade className={ICON_SIZE} />, visKey: 'blackjack' },
    { key: 'live-casino', view: 'live-casino', label: 'Canlı Casino', icon: <Target className={ICON_SIZE} /> },
    { key: 'esports', view: 'esports', label: 'E-spor', icon: <Gamepad2 className={ICON_SIZE} /> },
  ];

  const otherCategories: CategoryItem[] = [
    { key: '724tv', view: '724tv', label: '724TV', icon: <Tv className={ICON_SIZE} /> },
    { key: 'coupons', view: 'coupons', label: 'Kuponlar', icon: <Ticket className={ICON_SIZE} />, visKey: 'coupons' },
    { key: 'analysis', view: 'analysis', label: 'Analizler', icon: <BarChart3 className={ICON_SIZE} />, visKey: 'analysis' },
    { key: 'pool', view: 'pool', label: '724TOTO', icon: <Target className={ICON_SIZE} />, visKey: 'pool' },
    { key: 'loyalty', view: 'loyalty', label: 'Görevler', icon: <Trophy className={ICON_SIZE} />, visKey: 'loyalty' },
    { key: 'cekilis', view: 'cekilis', label: 'Çekiliş', icon: <Gift className={ICON_SIZE} />, visKey: 'cekilis' },
    { key: 'raffle', view: 'raffle', label: 'Bilet', icon: <TicketCheck className={ICON_SIZE} />, visKey: 'raffle' },
    { key: 'brands', view: 'brands', label: 'Siteler', icon: <Shield className={ICON_SIZE} />, visKey: 'brands' },
    { key: 'trusted-sites', view: 'trusted-sites', label: 'Güvenilir', icon: <Shield className={ICON_SIZE} />, visKey: 'trustedSites' },
    { key: 'giveaway', view: 'giveaway', label: 'Çekiliş Yönetimi', icon: <Gift className={ICON_SIZE} />, visKey: 'giveaway', requireRole: true },
  ];

  const renderNavItems = (items: CategoryItem[]) => {
    return items.map((cat) => {
      if (cat.visKey && navVisibility?.[cat.visKey] === false) return null;
      if (cat.requireRole && !userRole) return null;
      const active = activeView === cat.view;
      return (
        <button
          key={cat.key}
          className={`sidebar-nav-item ${active ? 'active' : ''}`}
          onClick={() => onViewChange(cat.view)}
          title={!isOpen ? cat.label : undefined}
        >
          <span className="sidebar-nav-icon">{cat.icon}</span>
          {isOpen && <span className="sidebar-nav-label">{cat.label}</span>}
        </button>
      );
    });
  };

  return (
    <>
      <style>{`
        .sidebar-container {
          width: 100%;
          background-color: transparent;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          z-index: 10;
          overflow: hidden;
          white-space: nowrap;
        }
        @media (max-width: 767px) {
          .sidebar-container {
            display: none !important;
          }
        }
        .sidebar-container:hover {
          overflow-y: auto;
        }
        .sidebar-container::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
        
        .sidebar-toggle-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #131C2C;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          color: #a0a0a0;
          cursor: pointer;
          margin: 16px;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .sidebar-toggle-btn:hover {
          color: #fff;
          background: rgba(255,255,255,0.08);
        }

        .sidebar-group {
          background: #131C2C;
          border-radius: 12px;
          margin: 0 12px 12px 12px;
          padding: 8px 0;
          border: 1px solid rgba(255, 255, 255, 0.03);
          overflow: hidden;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 10px 16px;
          color: #a0a0a0;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          min-height: 44px;
        }
        
        .sidebar-nav-item:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }
        
        .sidebar-nav-item.active {
          color: #F5A623;
          background: rgba(255, 255, 255, 0.1);
          border-left: 3px solid #F5A623;
          padding-left: 13px;
        }

        .sidebar-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          margin-right: ${isOpen ? '14px' : '0'};
          flex-shrink: 0;
        }
        
        .sidebar-nav-label {
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          opacity: ${isOpen ? 1 : 0};
          transition: opacity 0.2s;
        }

        /* Dropdown Button */
        .sidebar-dropdown-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 12px 16px;
          color: #fff;
          background: #131C2C;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.2s;
        }
        .sidebar-dropdown-btn:hover {
          background: rgba(255,255,255,0.08);
        }
        .sidebar-dropdown-icon {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sidebar-dropdown-arrow {
          transition: transform 0.3s;
          background: #334155;
          border-radius: 4px;
          padding: 2px;
        }
        .sidebar-dropdown-arrow.open {
          transform: rotate(180deg);
        }

        /* Action Buttons */
        .sidebar-action-btn {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 16px;
          color: #a0a0a0;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
          text-align: left;
        }
        .sidebar-action-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }
        .sidebar-action-highlight {
          color: #F5A623 !important;
          background: rgba(245, 166, 35, 0.08) !important;
        }

        /* Collapsed Sidebar CSS overrides to match Slotra design */
        .sidebar-collapsed .sidebar-group {
          padding: 6px 0 !important;
          margin: 0 12px 12px 12px !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          border-radius: 16px;
        }

        .sidebar-collapsed .sidebar-nav-item,
        .sidebar-collapsed .sidebar-dropdown-btn,
        .sidebar-collapsed .sidebar-action-btn {
          width: 44px;
          height: 44px;
          min-height: 44px;
          padding: 0 !important;
          margin: 0 auto !important;
          border-radius: 12px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }

        .sidebar-collapsed .sidebar-nav-item:hover,
        .sidebar-collapsed .sidebar-dropdown-btn:hover,
        .sidebar-collapsed .sidebar-action-btn:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }

        .sidebar-collapsed .sidebar-nav-item.active {
          background: rgba(255, 255, 255, 0.1) !important;
          border-left: none !important;
          padding-left: 0 !important;
          color: #F5A623 !important;
        }

        .sidebar-collapsed .sidebar-action-highlight {
          color: #F5A623 !important;
          background: rgba(245, 166, 35, 0.08) !important;
        }

        .sidebar-collapsed .sidebar-nav-icon,
        .sidebar-collapsed .sidebar-dropdown-icon {
          margin: 0 !important;
          padding: 0 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .sidebar-collapsed .sidebar-dropdown-arrow {
          display: none !important;
        }

        /* Mobile specific styles */
        @media (max-width: 767px) {
          .sidebar-container {
            display: none !important;
          }
          .sidebar-overlay {
            display: none !important;
          }
        }
      `}</style>

      {/* Overlay for mobile */}
      <div className="sidebar-overlay" onClick={onToggle} />

      <div id="tour-sidebar" className={`sidebar-container ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`} style={{ padding: '12px 0' }}>
        
        {/* Toggle Button / Header of Sidebar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'space-between' : 'center', padding: isOpen ? '0 16px' : '0', marginBottom: '16px' }}>
          <button onClick={onToggle} className="text-white hover:text-[#F5A623] transition-colors p-2 rounded-lg hover:bg-white/5 flex items-center justify-center">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Main Categories Group */}
        <div className="sidebar-group" style={{ marginTop: '4px' }}>
          {renderNavItems(mainCategories)}
          
          {/* 724Casino Group */}
          <div style={{ marginTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <button 
              className="sidebar-dropdown-btn" 
              onClick={() => isOpen && setIsCasinoDropdownOpen(!isCasinoDropdownOpen)}
              style={{ background: 'transparent', padding: '12px 16px' }}
              title={!isOpen ? "724Casino" : undefined}
            >
              <div className="sidebar-dropdown-icon" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Spade className={ICON_SIZE} style={{ color: '#F5A623' }} />
                {isOpen && <span style={{ fontWeight: '800', letterSpacing: '0.5px' }}>724Casino</span>}
              </div>
              {isOpen && <ChevronDown className={`w-4 h-4 sidebar-dropdown-arrow ${isCasinoDropdownOpen ? 'open' : ''}`} />}
            </button>
            
            {/* If open or if sidebar is collapsed, we render the sub-items */}
            {(!isOpen || isCasinoDropdownOpen) && (
              <div style={{ paddingLeft: isOpen ? '12px' : '0', display: 'flex', flexDirection: 'column' }}>
                {renderNavItems(casinoCategories)}
              </div>
            )}
          </div>
          
          {/* Other Categories */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)', paddingTop: '4px', marginTop: '4px' }}>
            {renderNavItems(otherCategories)}
          </div>
        </div>



        {/* Action Buttons Group */}
        <div className="sidebar-group" style={{ padding: 0 }}>
          <button className="sidebar-action-btn" title={!isOpen ? "Kodu Kullan" : undefined}>
            <span className="sidebar-nav-icon"><Gift className={ICON_SIZE} /></span>
            {isOpen && <span>Kodu Kullan</span>}
          </button>
          <button className="sidebar-action-btn sidebar-action-highlight" title={!isOpen ? "Arkadaşını Davet Et" : undefined}>
            <span className="sidebar-nav-icon"><Users className={ICON_SIZE} style={{ color: '#F5A623' }} /></span>
            {isOpen && <span>Arkadaşını Davet Et</span>}
          </button>
           <button className="sidebar-action-btn" title={!isOpen ? "Telegram" : undefined}>
            <span className="sidebar-nav-icon"><Send className={ICON_SIZE} /></span>
            {isOpen && <span>Telegram</span>}
          </button>
          {onStartTour && (
            <button onClick={onStartTour} className="sidebar-action-btn" title={!isOpen ? "Site Turu" : undefined}>
              <span className="sidebar-nav-icon"><HelpCircle className={ICON_SIZE} /></span>
              {isOpen && <span>Site Turu</span>}
            </button>
          )}
        </div>

        {/* Footer Support Group */}
        <div className="sidebar-group" style={{ padding: 0 }}>
          <button className="sidebar-action-btn" title={!isOpen ? "Canlı Destek" : undefined}>
            <span className="sidebar-nav-icon"><MessageSquare className={ICON_SIZE} /></span>
            {isOpen && <span>Canlı Destek</span>}
          </button>
          <button className="sidebar-dropdown-btn" style={{ background: 'transparent' }} title={!isOpen ? "Türkçe" : undefined}>
            <div className="sidebar-dropdown-icon" style={{ color: '#a0a0a0' }}>
              <Globe className={ICON_SIZE} />
              {isOpen && <span>Türkçe</span>}
            </div>
            {isOpen && <ChevronDown className="w-4 h-4 sidebar-dropdown-arrow" />}
          </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;
