"use client";
import React from 'react';
import { 
  Crown, Cherry, Tv, Radio, Percent, Diamond, Users, Gift, FileText, Headphones, Target, Menu, Globe, Ticket
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

  const isSportsView = ['sports', 'spor724', 'gercek', 'upcomingMatches'].includes(activeView);
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
    { id: 'tv', label: t('sidebar.724tv', '724TV'), icon: Tv, route: '724tv' },
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
        onClick={(e) => handleNavClick(e, item.route)}
        className={`w-full flex items-center h-[52px] cursor-pointer transition-all duration-300 relative group/link text-left border-none bg-transparent outline-none z-[9999] pointer-events-auto
          ${isActive ? 'text-white bg-gradient-to-r from-white/10 to-transparent' : 'text-[#8b92a5] hover:text-white hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent'}
        `}
      >
        {/* Active Pill Indicator */}
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] bg-[#d4af37] shadow-[0_0_15px_#d4af37] rounded-r-md z-10" />}
        
        <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0 ml-[28px]">
          <item.icon className={`w-[22px] h-[22px] transition-colors ${isActive ? 'text-[#d4af37]' : 'text-[#8b92a5] group-hover/link:text-white'}`} strokeWidth={1.2} />
        </div>
        
        <span className={`ml-4 font-medium text-[14px] tracking-tight whitespace-nowrap transition-all duration-300 ${!isOpen ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
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
    <div className={`relative z-[99999] h-full shrink-0 transition-[width] duration-300 ${isOpen ? 'w-[280px]' : 'w-[78px]'}`}>
      <div className={`group absolute top-0 left-0 flex flex-col h-full bg-[#05070a]/60 backdrop-blur-xl border-r border-white/5 transition-[width] duration-300 overflow-visible shadow-[4px_0_30px_rgba(0,0,0,0.1)] ${isOpen ? 'w-[280px]' : 'w-[78px]'}`}>
      
      {/* Top Header: Menu Toggle + Horizontal Nav Toggle */}
      <div className={`h-[72px] flex items-center px-4 shrink-0 transition-all duration-300 relative z-[99999] pointer-events-auto gap-3 w-[280px]`}>
        <button 
          onClick={onToggle}
          className={`w-10 h-10 flex flex-shrink-0 items-center justify-center text-[#8b92a5] hover:text-white rounded-xl transition-all relative z-[99999] pointer-events-auto cursor-pointer`}
        >
          <Menu className="w-[26px] h-[26px]" strokeWidth={2} />
        </button>

        {/* Horizontal Toggle for Casino / Spor */}
        <div className={`flex-1 flex items-center bg-[#131823] p-1 rounded-xl h-[44px] transition-all duration-300 relative z-[99999] pointer-events-auto border border-white/5 ${!isOpen ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
          <button 
            onClick={() => { onViewChange('casino'); if (window.innerWidth < 1024) onToggle?.(); }}
            className={`flex-1 flex items-center justify-center h-full rounded-lg font-bold text-[14px] transition-all duration-300 cursor-pointer pointer-events-auto z-[99999] ${isCasinoView ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'text-[#8b92a5] hover:text-white border border-transparent'}`}
          >
            Casino
          </button>
          <button 
            onClick={() => { onViewChange('spor724'); if (window.innerWidth < 1024) onToggle?.(); }}
            className={`flex-1 flex items-center justify-center h-full rounded-lg font-bold text-[14px] transition-all duration-300 cursor-pointer pointer-events-auto z-[99999] ${isSportsView ? 'bg-gradient-to-r from-[#22c55e]/20 to-[#10b981]/20 border border-[#22c55e]/30 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'text-[#8b92a5] hover:text-white border border-transparent'}`}
          >
            Spor
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pt-2 pb-4 relative z-[99999] pointer-events-auto">
        
        {/* $20.000 HAFTALIK ÇEKİLİŞ Widget (Restored based on screenshot) */}
        {!isSportsView && (
          <div className={`px-4 py-2 transition-all duration-300 ${!isOpen ? 'opacity-0 h-0 hidden' : 'opacity-100'} mb-2`}>
            <div 
              className="bg-[#131823] rounded-xl p-3 border border-white/5 relative overflow-hidden group cursor-pointer hover:border-yellow-500/30 transition-colors shadow-sm"
              onClick={() => onViewChange('raffle')}
            >
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-yellow-500 shrink-0" />
                  <div>
                    <div className="text-white font-black text-[15px] leading-tight tracking-tight">$20.000</div>
                    <div className="text-gray-400 text-[9px] font-bold tracking-wider uppercase">HAFTALIK ÇEKİLİŞ</div>
                  </div>
                </div>
                <div className="bg-[#1b2230] text-gray-300 text-[11px] font-bold px-2 py-1 rounded-md shrink-0 border border-white/5">
                  6g
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 relative z-10 px-1">
                <div className="flex flex-col items-start">
                  <div className="text-gray-500 text-[8px] font-bold mb-0.5 tracking-wider">GÜNLÜK</div>
                  <div className="text-white text-[11px] font-bold">$25K</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-gray-500 text-[8px] font-bold mb-0.5 tracking-wider">HAFTALIK</div>
                  <div className="text-white text-[11px] font-bold">$100K</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-gray-500 text-[8px] font-bold mb-0.5 tracking-wider">AYLIK</div>
                  <div className="text-white text-[11px] font-bold">$500K</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Menu Items or Sports Content */}
        {isSportsView ? (
          <SportsSidebarContent isOpen={isOpen} onViewChange={onViewChange} onToggle={onToggle} />
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