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
    { id: 'blackjack', label: 'Slot', icon: Spade },
    { id: 'sports2', label: 'Spor', icon: Target },
    { id: 'cekilis', label: 'Çekiliş', icon: Gift },
    { id: 'profile', label: siteUser ? 'Profil' : 'Giriş', icon: User, action: onProfileClick }
  ];

  return (
    <div className="mobile-bottom-nav-container fixed bottom-0 left-0 right-0 z-[100] bg-[#0f1115] border-t border-white/5 pb-safe">
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
              <div className={`p-1.5 transition-all duration-300 ${isActive ? 'text-[#00FFA3]' : 'text-gray-500'}`}>
                <Icon size={22} className={isActive ? 'scale-110' : ''} />
              </div>
              <span className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? 'text-[#00FFA3]' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
