import React, { useState } from 'react';
import { 
  PlayCircle, Clock, LayoutGrid, Receipt, 
  ChevronDown, Target, Gamepad2, Trophy, Flag,
  Crosshair, Dribbble
} from 'lucide-react';

interface SportsSidebarContentProps {
  isOpen: boolean;
  onViewChange: (view: string) => void;
}

// Reusable SVG icons for sports without direct lucide match
const SoccerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <polygon points="12 4 15 9 10 9" fill="currentColor" />
    <polygon points="12 20 9 15 14 15" fill="currentColor" />
    <polygon points="4 12 9 9 9 14" fill="currentColor" />
    <polygon points="20 12 15 15 15 10" fill="currentColor" />
  </svg>
);

const TennisIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M7 7c3 0 5-2 5-5M17 17c-3 0-5 2-5 5" />
  </svg>
);

const VolleyballIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" strokeDasharray="3 3"/>
    <path d="M12 2c0 6 4 10 10 10M2 12c6 0 10 4 10 10M12 22c0-6-4-10-10-10M22 12c-6 0-10-4-10-10"/>
  </svg>
);

const PingPongIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="10" width="16" height="4" rx="1" />
    <path d="M12 14v6M10 20h4" />
    <circle cx="12" cy="6" r="2" fill="currentColor" />
  </svg>
);

const MmaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 19 9 12 16 5 9 12 2" />
    <polygon points="12 10 17 15 12 22 7 15 12 10" fill="currentColor"/>
  </svg>
);

const SportsSidebarContent: React.FC<SportsSidebarContentProps> = ({ isOpen, onViewChange }) => {
  const [activeMenu, setActiveMenu] = useState<string>('');

  return (
    <div className="flex flex-col w-full h-full text-slate-300 bg-transparent">
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 pb-20">
        
        {/* TOP SECTION */}
        <div className="flex flex-col px-3 gap-1 mb-4">
          
          <button 
            onClick={() => { 
              setActiveMenu('canli'); 
              onViewChange('spor724'); 
              window.dispatchEvent(new CustomEvent('changeSportsTab', { detail: 'home' }));
            }}
            className={`flex items-center justify-between w-full p-2.5 rounded-lg transition-colors group ${activeMenu === 'canli' ? 'bg-[#233240] text-white' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <div className="flex items-center gap-3">
              <PlayCircle className={`w-[20px] h-[20px] shrink-0 ${activeMenu === 'canli' ? 'text-white' : 'group-hover:text-white'}`} fill={activeMenu === 'canli' ? 'currentColor' : 'none'} />
              {isOpen && <span className={`text-[14px] font-bold ${activeMenu === 'canli' ? 'text-white' : 'group-hover:text-white'}`}>Canlı Etkinlikler</span>}
            </div>
            {isOpen && (
              <div className="bg-[#0f62fe] px-2 py-0.5 rounded-full text-white text-[11px] font-bold">119</div>
            )}
            {!isOpen && (
               <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                 Canlı Etkinlikler
               </div>
            )}
          </button>

          <button 
            onClick={() => { 
              setActiveMenu('upcoming'); 
              onViewChange('upcomingMatches'); 
              window.dispatchEvent(new CustomEvent('changeSportsTab', { detail: 'upcoming' }));
            }}
            className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors group ${activeMenu === 'upcoming' ? 'bg-[#233240] text-white' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <Clock className={`w-[20px] h-[20px] shrink-0 ${activeMenu === 'upcoming' ? 'text-white' : 'group-hover:text-white'}`} />
            {isOpen && <span className={`text-[14px] font-bold truncate ${activeMenu === 'upcoming' ? 'text-white' : 'group-hover:text-white'}`}>Yakında Başlayacak ...</span>}
            {!isOpen && (
               <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                 Yakında Başlayacak...
               </div>
            )}
          </button>

          <button 
            onClick={() => { 
              setActiveMenu('hepsi'); 
              onViewChange('spor724'); 
              window.dispatchEvent(new CustomEvent('changeSportsTab', { detail: 'home' }));
            }}
            className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors group ${activeMenu === 'hepsi' ? 'bg-[#233240] text-white' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <LayoutGrid className={`w-[20px] h-[20px] shrink-0 ${activeMenu === 'hepsi' ? 'text-white' : 'group-hover:text-white'}`} />
            {isOpen && <span className={`text-[14px] font-bold ${activeMenu === 'hepsi' ? 'text-white' : 'group-hover:text-white'}`}>Hepsi</span>}
            {!isOpen && (
               <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                 Hepsi
               </div>
            )}
          </button>

          <button 
            onClick={() => { setActiveMenu('bahislerim'); }}
            className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors group ${activeMenu === 'bahislerim' ? 'bg-[#233240] text-white' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <Receipt className={`w-[20px] h-[20px] shrink-0 ${activeMenu === 'bahislerim' ? 'text-white' : 'group-hover:text-white'}`} />
            {isOpen && <span className={`text-[14px] font-bold ${activeMenu === 'bahislerim' ? 'text-white' : 'group-hover:text-white'}`}>Bahislerim</span>}
            {!isOpen && (
               <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                 Bahislerim
               </div>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-[calc(100%-24px)] mx-auto bg-white/5 mb-4"></div>

        {/* EN IYI SPORLAR */}
        {isOpen && (
           <div className="px-4 mb-2">
             <span className="text-[13px] font-bold text-slate-500">En İyi Sporlar</span>
           </div>
        )}

        <div className="flex flex-col px-3 gap-0.5 mb-4">
          {[
            { id: 'futbol', name: 'Futbol', Icon: SoccerIcon },
            { id: 'cs2', name: 'CS2', Icon: Crosshair },
            { id: 'tenis', name: 'Tenis', Icon: TennisIcon },
            { id: 'basketbol', name: 'Basketbol', Icon: Dribbble },
            { id: 'fifa', name: 'FIFA', Icon: Gamepad2 },
            { id: 'valorant', name: 'Valorant', Icon: Target },
            { id: 'voleybol', name: 'Voleybol', Icon: VolleyballIcon },
            { id: 'masatenisi', name: 'Masa Tenisi', Icon: PingPongIcon },
            { id: 'formula1', name: 'Formula 1', Icon: Trophy },
            { id: 'mma', name: 'MMA', Icon: MmaIcon },
          ].map((sport) => (
             <button
               key={sport.id}
               onClick={() => onViewChange('spor724')}
               className={`flex items-center justify-between w-full p-2.5 rounded-lg transition-colors hover:bg-white/5 group relative ${!isOpen ? 'justify-center' : ''}`}
             >
               <div className="flex items-center gap-3">
                 <sport.Icon className="w-[18px] h-[18px] shrink-0 text-slate-400 group-hover:text-white" />
                 {isOpen && <span className="text-[14px] font-medium text-slate-300 group-hover:text-white">{sport.name}</span>}
               </div>
               {isOpen && <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white" />}
               {!isOpen && (
                 <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                   {sport.name}
                 </div>
               )}
             </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[1px] w-[calc(100%-24px)] mx-auto bg-white/5 mb-4"></div>

        {/* BOTTOM SPORTS */}
        <div className="flex flex-col px-3 gap-0.5">
          {[
            { id: 'spor', name: 'Spor', Icon: Dribbble },
            { id: 'espor', name: 'Tüm Espor Oyunları', Icon: Gamepad2 },
            { id: 'yaris', name: 'Tüm Yarışlar', Icon: Flag },
          ].map((item) => (
             <button
               key={item.id}
               onClick={() => onViewChange('spor724')}
               className={`flex items-center justify-between w-full p-2.5 rounded-lg transition-colors hover:bg-white/5 group relative ${!isOpen ? 'justify-center' : ''}`}
             >
               <div className="flex items-center gap-3">
                 <item.Icon className="w-[18px] h-[18px] shrink-0 text-slate-400 group-hover:text-white" />
                 {isOpen && <span className="text-[14px] font-medium text-slate-300 group-hover:text-white">{item.name}</span>}
               </div>
               {isOpen && <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white" />}
               {!isOpen && (
                 <div className="absolute left-[calc(100%+12px)] top-auto bg-[#1a1d29] text-white px-2.5 py-1.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-[999] transition-all font-bold text-xs">
                   {item.name}
                 </div>
               )}
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportsSidebarContent;
