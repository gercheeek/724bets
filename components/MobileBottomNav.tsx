import React from 'react';
import { Home, Spade, Target, Gift, MessageSquare } from 'lucide-react';
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
    { id: 'sports', label: 'Spor', icon: Target },
    { id: 'originals', label: 'Lobby', icon: Gift },
    { id: 'chat', label: 'Chat', icon: MessageSquare, action: () => window.dispatchEvent(new Event('openSupportChat')) }
  ];

  return (
    <div className="mobile-bottom-nav-container fixed bottom-0 left-0 right-0 z-[100] bg-[#0f1115] border-t border-white/5 pb-safe">
      <div className="flex items-center justify-between px-1 sm:px-2 h-16 w-full max-w-full">
        {items.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => item.action ? item.action() : onViewChange(item.id)}
              className="relative flex-1 flex flex-col items-center justify-center h-full gap-0.5 transition-all group"
            >
              <div className={`transition-all duration-300 ${isActive ? 'text-[#00FFA3] -translate-y-0.5' : 'text-gray-500'}`}>
                <Icon size={20} className={isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,255,163,0.5)]' : ''} />
              </div>
              <span className={`text-[9px] sm:text-[10px] font-bold tracking-wide transition-colors ${isActive ? 'text-[#00FFA3]' : 'text-gray-500'}`}>
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
