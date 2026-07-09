import React from 'react';
import { Home, Spade, Target, Gift, User, Play } from 'lucide-react';
import { SiteUser } from '../types';

interface MobileBottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
  siteUser?: SiteUser | null;
  onProfileClick: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  activeView, 
  onViewChange, 
  siteUser,
  onProfileClick 
}) => {
  const items = [
    { id: 'home', label: 'Ana Sayfa', icon: Home },
    { id: 'demo', label: 'Demo', icon: Play },
    { id: 'sports2', label: 'Spor', icon: Target },
    { id: 'cekilis', label: 'Çekiliş', icon: Gift },
    { id: 'profile', label: siteUser ? 'Profil' : 'Giriş', icon: User, action: onProfileClick }
  ];

  return (
    <div className="mobile-bottom-nav-container fixed bottom-0 left-0 right-0 z-[100] bg-[#0D1320]/95 backdrop-blur-xl border-t border-[#00FFA3]/10 pb-safe shadow-[0_-5px_25px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around px-2 h-16">
        {items.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => item.action ? item.action() : onViewChange(item.id)}
              className="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all group"
            >
              <div className={`p-1.5 rounded-lg transition-all duration-300 ${isActive ? 'bg-[#00FFA3]/15 text-[#00FFA3] scale-110 shadow-[0_0_15px_rgba(0,255,163,0.2)]' : 'text-gray-400 group-hover:text-gray-200 group-hover:bg-white/5'}`}>
                <Icon size={20} className={isActive ? '' : ''} />
              </div>
              <span className={`text-[10px] font-black tracking-wide transition-colors ${isActive ? 'text-[#00FFA3]' : 'text-gray-500 group-hover:text-gray-300'}`}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-gradient-to-r from-transparent via-[#00FFA3] to-transparent rounded-b-full shadow-[0_0_8px_rgba(0,255,163,0.6)] opacity-100" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
