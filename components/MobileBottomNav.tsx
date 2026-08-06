import React from 'react';
import { Menu, Spade, Target, Gift, MessageSquare, UserPlus } from 'lucide-react';
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
    <div className="mobile-bottom-nav-container fixed bottom-2 left-2 right-2 z-[100] bg-[#0A0C10]/95 backdrop-blur-xl border border-white/10 rounded-2xl pb-safe shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between px-1 sm:px-2 h-14 w-full max-w-full">
        {items.map((item) => {
          if (item.isSpecial) {
             return (
               <button 
                 key={item.id}
                 onClick={item.action} 
                 className="relative flex-1 flex flex-col items-center justify-center h-full gap-0.5 transition-all group"
               >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#00b3cc] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.5)] animate-[pulse_2.5s_ease-in-out_infinite] group-hover:scale-105 transition-transform">
                    <UserPlus size={16} className="text-[#0A0D14]" strokeWidth={2.5} />
                  </div>
                  <span className="text-[9.5px] font-black tracking-wide text-[#00E5FF]">
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
              className="relative flex-1 flex flex-col items-center justify-center h-full gap-0.5 transition-all group"
            >
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.8)] rounded-full" />
              )}
              
              <div className={`transition-all duration-300 ${isActive ? 'text-[#00E5FF] -translate-y-0.5' : 'text-[#8e98a5] group-hover:text-white'}`}>
                <Icon size={20} className={isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'opacity-80'} />
              </div>
              <span className={`text-[9.5px] font-bold tracking-wide transition-colors ${isActive ? 'text-[#00E5FF]' : 'text-[#8e98a5] group-hover:text-white'}`}>
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
