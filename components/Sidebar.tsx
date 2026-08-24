"use client";
import React from 'react';
import { 
  Crown, Cherry, Tv, Radio, Percent, Diamond, Users, Gift, FileText, Headphones, Target, Menu, Globe, Ticket, Play
} from 'lucide-react';
import SportsSidebarContent from './SportsSidebarContent';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { viewToPath } from '../utils/routes';

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, activeView, onViewChange }) => {
  const { t, i18n } = useTranslation();
  const { setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = React.useState(false);
  const langMenuRef = React.useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  const handleLanguageSelect = (code: string) => {
    i18n.changeLanguage(code);
    const legacyCode = code === 'pt-BR' ? 'pt' : code;
    setLanguage(legacyCode as any);
    setShowLangMenu(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSportsView = ['sports', 'spor724', 'gercek', 'upcomingMatches', 'bulten'].includes(activeView);
  const isPredictionsView = ['tahminler', 'tahminler'].includes(activeView);
  const isCasinoView = ['casino', 'slots', 'live-casino', 'originals'].includes(activeView);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, route: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (route === 'openChat') {
      window.dispatchEvent(new CustomEvent('openSupportChat'));
    } else if (route === 'openLang') {
      setShowLangMenu(!showLangMenu);
    } else {
      onViewChange(route);
    }
    
    if (window.innerWidth < 1024 && onToggle) {
      onToggle();
    }
  };

  const menuItems = [
    { id: 'home', label: t('sidebar.home', 'Anasayfa'), icon: Crown, route: 'home' },
    { type: 'spacer', height: 'h-3' },
    { id: 'live-casino', label: t('sidebar.live_casino', 'Canlı Casino'), icon: Tv, route: 'live-casino' },
    { id: 'originals', label: t('sidebar.originals', 'Originals'), icon: Radio, route: 'originals' },
    { id: 'promo', label: t('sidebar.promotions', 'Promosyonlar'), icon: Percent, route: 'promo' },
    { type: 'spacer', height: 'h-4' },
    { id: 'vip-club', label: t('sidebar.vip_club', 'VIP Kulübü'), icon: Diamond, route: 'vip-club' },
    { id: 'affiliate', label: t('sidebar.affiliate', 'İş Ortaklığı'), icon: Users, route: 'affiliate/overview' },
  ];

  const bottomItems = [
    // { id: 'tv', label: t('sidebar.724tv', '724TV'), icon: Tv, route: '724tv' },
    { id: 'docs', label: t('sidebar.terms', 'Kullanım Şartları'), icon: FileText, route: 'docs' },
    { id: 'support', label: t('sidebar.live_support', 'Canlı Destek'), icon: Headphones, route: 'openChat' },
    { id: 'lang', label: t('sidebar.language', 'Dil'), icon: Globe, route: 'openLang' }
  ];

  const renderLink = (item: any) => {
    if (item.type === 'spacer') {
      return <div key={Math.random()} className={`w-full ${item.height} relative z-[9999]`} />;
    }

    const isActive = activeView === item.route;
    
    // Build proper URL path
    let href = '#';
    if (!['openChat', 'openLang'].includes(item.route)) {
      const targetPath = viewToPath[item.route] || item.route;
      href = `/${targetPath}`;
    }

    return (
      <a
        key={item.id}
        href={href}
        title={!isOpen ? item.label : undefined}
        onClick={(e) => handleNavClick(e, item.route)}
        className={`mx-2 rounded-xl flex items-center h-[50px] mb-1 cursor-pointer transition-all duration-300 relative group/link text-left border-none outline-none z-[9999] pointer-events-auto
          ${isActive ? 'text-[color:var(--theme-accent)] bg-gradient-to-r from-[color:var(--theme-accent)]/15 to-transparent shadow-[0_4px_20px_rgba(0,0,0,0.2)]' : 'text-[#8b92a5] hover:text-white hover:bg-white/5'}
        `}
      >
        {/* Island UI Glowing Indicator */}
        <div className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-[4px] h-[50%] rounded-full transition-all duration-300 ${isActive ? 'bg-[color:var(--theme-accent)] shadow-[0_0_12px_var(--theme-accent-glow)]' : 'bg-transparent group-hover/link:bg-white/20'}`} />
        
        <div className="flex-shrink-0 w-12 flex items-center justify-center relative ml-1">
          <item.icon className={`w-[22px] h-[22px] transition-all duration-300 ${isActive ? 'text-[color:var(--theme-accent)] drop-shadow-[0_0_8px_var(--theme-accent-glow)] scale-110' : 'text-zinc-500 group-hover/link:text-white group-hover/link:scale-110'}`} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        
        <span className={`ml-3 font-bold text-[14px] tracking-wide whitespace-nowrap transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${!isOpen ? 'opacity-0 translate-x-[-10px]' : 'opacity-100 translate-x-0'}`}>
          {item.label}
        </span>

        {/* Language Popover Menu */}
        {item.route === 'openLang' && showLangMenu && (
          <div 
            ref={langMenuRef}
            className="absolute left-full bottom-0 ml-3 w-44 bg-[#05070a]/90 backdrop-blur-2xl border border-white/5 rounded-2xl shadow-[8px_0_40px_rgba(0,0,0,0.5)] z-[999999] animate-in fade-in slide-in-from-left-2 duration-200 p-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full flex items-center px-4 py-2.5 rounded-xl text-[14px] transition-all duration-300 ${i18n.language === lang.code ? 'bg-[#d4af37]/10 text-[#d4af37] font-bold' : 'text-[#8b92a5] hover:bg-white/5 hover:text-white hover:translate-x-1'}`}
              >
                <span className="mr-3 text-lg leading-none drop-shadow-sm">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </a>
    );
  };

  return (
    <div className={`relative z-[99999] h-full shrink-0 transition-[width] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'w-[280px]' : 'w-[78px]'}`} style={{ willChange: 'width' }}>
      <div className={`group absolute top-0 left-0 flex flex-col h-full bg-[#0a0c10] transition-[width] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-visible shadow-[8px_0_40px_rgba(0,0,0,0.6)] ${isOpen ? 'w-[280px]' : 'w-[78px]'}`} style={{ willChange: 'width' }}>
      
      {/* Top Header: Menu Toggle + Horizontal Nav Toggle */}
      <div className={`h-[72px] flex items-center px-4 shrink-0 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-[99999] pointer-events-auto gap-3 w-[280px]`}>
        <button 
          onClick={onToggle}
          className={`w-10 h-10 flex flex-shrink-0 items-center justify-center text-[#8b92a5] hover:text-white rounded-xl transition-all relative z-[99999] pointer-events-auto cursor-pointer`}
        >
          <Menu className="w-[26px] h-[26px]" strokeWidth={2} />
        </button>

        <div className={`flex-1 flex items-center bg-[#131823] p-1 rounded-xl h-[44px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-[99999] pointer-events-auto border-none shadow-inner ${!isOpen ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
          <button 
            onClick={() => { onViewChange('casino'); if (window.innerWidth < 1024) onToggle?.(); }}
            className={`flex-1 flex items-center justify-center h-full rounded-lg font-bold text-[12px] md:text-[14px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer pointer-events-auto z-[99999] ${isCasinoView ? 'bg-gradient-to-r from-purple-500/15 to-pink-500/15 border-none text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'text-[#8b92a5] hover:text-white border-none'}`}
          >
            Casino
          </button>
          <button 
            onClick={() => { 
                window.dispatchEvent(new CustomEvent('reset-sports-view'));
                onViewChange('spor724'); 
                if (window.innerWidth < 1024) onToggle?.(); 
            }}
            className={`flex-1 flex items-center justify-center h-full rounded-lg font-bold text-[12px] md:text-[14px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer pointer-events-auto z-[99999] ${isSportsView ? 'bg-gradient-to-r from-[#10B981]/15 to-[#10B981]/5 border-none text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'text-[#8b92a5] hover:text-white border-none'}`}
          >
            Spor
          </button>
          <button 
            onClick={() => { 
                onViewChange('tahminler'); 
                if (window.innerWidth < 1024) onToggle?.(); 
            }}
            className={`flex-1 flex items-center justify-center h-full rounded-lg font-bold text-[12px] md:text-[14px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer pointer-events-auto z-[99999] ${isPredictionsView ? 'bg-gradient-to-r from-yellow-500/15 to-orange-500/15 border-none text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]' : 'text-[#8b92a5] hover:text-white border-none'}`}
          >
            Tahmin
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pt-2 pb-4 relative z-[99999] pointer-events-auto">
        


        {/* Main Menu Items or Sports Content */}
        {isSportsView ? (
          <SportsSidebarContent isOpen={isOpen} onViewChange={onViewChange} onToggle={onToggle} />
        ) : isPredictionsView ? (
          <nav className="flex flex-col w-full relative z-[99999] pointer-events-auto">
            {[{ id: 'tahminler', label: 'Liderlik Tablosu', icon: Target, route: 'tahminler' }, { id: 'vip-tips', label: 'VIP Tahminler', icon: Diamond, route: 'vip-tips' }].map(item => renderLink(item))}
          </nav>
        ) : (
          <nav className="flex flex-col w-full relative z-[99999] pointer-events-auto">
            {menuItems.map(item => renderLink(item))}
          </nav>
        )}

      </div>

      {/* Bottom Sticky Section */}
      <div className="w-[280px] flex flex-col pt-4 pb-4 gap-1 border-t border-white/5 bg-transparent mt-auto relative z-[99999] pointer-events-auto">
        <nav className="flex flex-col w-full relative z-[99999] pointer-events-auto">
          {bottomItems.map(item => renderLink(item))}
        </nav>
      </div>

      </div>
    </div>
  );
};

export default Sidebar;