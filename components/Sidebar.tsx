import React, { useState } from 'react';
import {
  Menu, Home, Ticket, BarChart3, Target, Trophy, Gift,
  TicketCheck, Shield, Spade, Tv, ChevronDown, MessageSquare, Send, HelpCircle,
  Globe, Users
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
}

const ICON_SIZE = 'w-5 h-5';

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeView,
  onViewChange,
  userRole,
  navVisibility,
}) => {
  const [casinoOpen, setCasinoOpen] = useState(false);
  const [sporOpen, setSporOpen] = useState(false);

  const mainCategories: CategoryItem[] = [
    { key: 'home', view: 'home', label: 'Ana Sayfa', icon: <Home className={ICON_SIZE} /> },
    { key: 'coupons', view: 'coupons', label: 'Kuponlar', icon: <Ticket className={ICON_SIZE} />, visKey: 'coupons' },
    { key: 'analysis', view: 'analysis', label: 'Analizler', icon: <BarChart3 className={ICON_SIZE} />, visKey: 'analysis' },
    { key: 'pool', view: 'pool', label: '724TOTO', icon: <Target className={ICON_SIZE} />, visKey: 'pool' },
    { key: 'loyalty', view: 'loyalty', label: 'Görevler', icon: <Trophy className={ICON_SIZE} />, visKey: 'loyalty' },
    { key: 'cekilis', view: 'cekilis', label: 'Çekiliş', icon: <Gift className={ICON_SIZE} />, visKey: 'cekilis' },
    { key: 'raffle', view: 'raffle', label: 'Bilet', icon: <TicketCheck className={ICON_SIZE} />, visKey: 'raffle' },
    { key: 'giveaway', view: 'giveaway', label: 'Çekiliş Yönetimi', icon: <Gift className={ICON_SIZE} />, visKey: 'giveaway', requireRole: true },
  ];

  const casinoCategories: CategoryItem[] = [
    { key: 'blackjack', view: 'blackjack', label: 'Casino', icon: <Spade className={ICON_SIZE} />, visKey: 'blackjack' },
  ];

  const sporCategories: CategoryItem[] = [
    { key: 'brands', view: 'brands', label: 'Siteler', icon: <Shield className={ICON_SIZE} />, visKey: 'brands' },
    { key: 'trusted-sites', view: 'trusted-sites', label: 'Güvenilir', icon: <Shield className={ICON_SIZE} />, visKey: 'trustedSites' },
    { key: '724tv', view: '724tv', label: '724TV', icon: <Tv className={ICON_SIZE} /> },
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
          background-color: #1a1a1c;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          left: 0;
          z-index: 999;
          overflow: hidden;
          white-space: nowrap;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
          background: #2a2a2c;
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
          background: #333336;
        }

        .sidebar-group {
          background: #222224;
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
          color: #c6ff00;
          background: rgba(198, 255, 0, 0.05);
          border-left: 3px solid #c6ff00;
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
          background: #2a2a2c;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.2s;
        }
        .sidebar-dropdown-btn:hover {
          background: #333336;
        }
        .sidebar-dropdown-icon {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sidebar-dropdown-arrow {
          transition: transform 0.3s;
          background: #333;
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
          color: #c6ff00 !important;
          background: rgba(198, 255, 0, 0.05) !important;
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

      <div className="sidebar-container">
        {/* Toggle Button */}
        <div style={{ display: 'flex', justifyContent: isOpen ? 'flex-start' : 'center', width: '100%' }}>
          <button className="sidebar-toggle-btn" onClick={onToggle}>
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Main Categories Group */}
        <div className="sidebar-group" style={{ marginTop: '4px' }}>
          {renderNavItems(mainCategories)}
        </div>

        {/* Casino Dropdown Group */}
        <div className="sidebar-group" style={{ padding: 0 }}>
          <button 
            className="sidebar-dropdown-btn"
            onClick={() => setCasinoOpen(!casinoOpen)}
            title={!isOpen ? "Casino" : undefined}
          >
            <div className="sidebar-dropdown-icon">
              <Spade className={ICON_SIZE} />
              {isOpen && <span>Casino</span>}
            </div>
            {isOpen && <ChevronDown className={`w-4 h-4 sidebar-dropdown-arrow ${casinoOpen ? 'open' : ''}`} />}
          </button>
          {casinoOpen && (
            <div style={{ background: '#1e1e20', padding: '4px 0' }}>
              {renderNavItems(casinoCategories)}
            </div>
          )}
        </div>

        {/* Spor Dropdown Group */}
        <div className="sidebar-group" style={{ padding: 0 }}>
          <button 
            className="sidebar-dropdown-btn"
            onClick={() => setSporOpen(!sporOpen)}
            title={!isOpen ? "Spor" : undefined}
          >
            <div className="sidebar-dropdown-icon">
              <Target className={ICON_SIZE} />
              {isOpen && <span>Spor</span>}
            </div>
            {isOpen && <ChevronDown className={`w-4 h-4 sidebar-dropdown-arrow ${sporOpen ? 'open' : ''}`} />}
          </button>
          {sporOpen && (
            <div style={{ background: '#1e1e20', padding: '4px 0' }}>
              {renderNavItems(sporCategories)}
            </div>
          )}
        </div>

        {/* Action Buttons Group */}
        <div className="sidebar-group" style={{ padding: 0 }}>
          <button className="sidebar-action-btn" title={!isOpen ? "Kodu Kullan" : undefined}>
            <span className="sidebar-nav-icon"><Gift className={ICON_SIZE} /></span>
            {isOpen && <span>Kodu Kullan</span>}
          </button>
          <button className="sidebar-action-btn sidebar-action-highlight" title={!isOpen ? "Arkadaşını Davet Et" : undefined}>
            <span className="sidebar-nav-icon"><Users className={ICON_SIZE} style={{ color: '#c6ff00' }} /></span>
            {isOpen && <span>Arkadaşını Davet Et</span>}
          </button>
          <button className="sidebar-action-btn" title={!isOpen ? "Telegram" : undefined}>
            <span className="sidebar-nav-icon"><Send className={ICON_SIZE} /></span>
            {isOpen && <span>Telegram</span>}
          </button>
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
