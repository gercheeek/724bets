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
    <div className="mobile-bottom-nav-container fixed bottom-0 left-0 right-0 z-[100] bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around px-2 h-16">
        {items.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => item.action ? item.action() : onViewChange(item.id)}
              className="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all"
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-amber-500/20 text-amber-500 scale-110' : 'text-slate-400 hover:text-slate-200'}`}>
                <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
              </div>
              <span className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? 'text-amber-500' : 'text-slate-500'}`}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-b-full opacity-70" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
