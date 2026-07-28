import React from 'react';
import { Menu, Spade, Target, Gift, MessageSquare } from 'lucide-react';
import { SiteUser } from '../types';

interface MobileBottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
  siteUser?: SiteUser | null;
  onProfileClick: () => void;
  onMenuClick?: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  activeView, 
  onViewChange, 
  siteUser,
  onProfileClick,
  onMenuClick
}) => {
  const memberItems = [
    { id: 'menu', label: 'Menü', icon: Menu, action: () => onMenuClick && onMenuClick() },
    { id: 'blackjack', label: 'Slot', icon: Spade },
    { id: 'spor724', label: 'Spor', icon: Target },
    { id: 'originals', label: 'Lobby', icon: Gift },
    { id: 'chat', label: 'Chat', icon: MessageSquare, action: () => window.dispatchEvent(new Event('openSupportChat')) }
  ];

  const guestItems = [
    { id: 'menu', label: 'Menü', icon: Menu, action: () => onMenuClick && onMenuClick() },
    { id: 'blackjack', label: 'Slot', icon: Spade },
    { id: 'register', label: 'ÜYE OL', isSpecial: true, action: () => window.dispatchEvent(new CustomEvent('auth-modal', { detail: 'register' })) },
    { id: 'spor724', label: 'Spor', icon: Target },
    { id: 'promo', label: 'Bonuslar', icon: Gift, action: () => onViewChange('promo') }
  ];

  const items = siteUser ? memberItems : guestItems;

  return (
    <div className="mobile-bottom-nav-container fixed bottom-0 left-0 right-0 z-[100] bg-[#0A0D14] border-t border-white/5 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between px-1 sm:px-2 h-16 w-full max-w-full">
        {items.map((item) => {
          if (item.isSpecial) {
             return (
               <button 
                 key={item.id}
                 onClick={item.action} 
                 className="relative flex-1 flex flex-col items-center justify-center h-full gap-1 transition-all group"
               >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#00b3cc] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] animate-[pulse_3s_ease-in-out_infinite]">
                    <Gift size={18} className="text-[#0A0D14]" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black tracking-wide text-[#00E5FF]">
                    {item.label}
                  </span>
               </button>
             )
          }

          const isActive = activeView === item.id;
          const Icon = item.icon!;
          
          return (
            <button
              key={item.id}
              onClick={() => item.action ? item.action() : onViewChange(item.id)}
              className="relative flex-1 flex flex-col items-center justify-center h-full gap-1 transition-all group"
            >
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
              )}
              
              <div className={`transition-all duration-300 ${isActive ? 'text-[#00E5FF] -translate-y-1' : 'text-[#8e98a5] group-hover:text-white'}`}>
                <Icon size={22} className={isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'opacity-80'} />
              </div>
              <span className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? 'text-[#00E5FF]' : 'text-[#8e98a5] group-hover:text-white'}`}>
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
