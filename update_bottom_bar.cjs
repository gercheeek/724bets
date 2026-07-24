const fs = require('fs');

let content = fs.readFileSync('components/sports/DualRightPanel.tsx', 'utf8');

// Update imports
content = content.replace(
  "import { ChevronDown, X, MessageCircle, Trash2, RefreshCcw } from 'lucide-react';",
  "import { ChevronDown, X, MessageCircle, Trash2, RefreshCcw, Home, Gamepad2, Flag, FileText, Search } from 'lucide-react';"
);

// Replace the bottom toggle bar when activePanel is 'chat'
content = content.replace(
  /<div onClick=\{\(\) => setActivePanel\('coupon'\)\} className="flex items-center justify-center w-full h-full group">[\s\S]*?<\/div>\s*<\/div>/,
  `<div className="flex items-center justify-between w-full h-full px-2">
            <button className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white transition-colors flex-1">
              <Home className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-medium tracking-wide">Lobi</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white transition-colors flex-1">
              <Gamepad2 className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-medium tracking-wide">E-Sporlar</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white transition-colors flex-1">
              <Flag className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-medium tracking-wide">Bahislerim</span>
            </button>
            <button 
              onClick={() => setActivePanel('coupon')}
              className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white transition-colors flex-1 relative group"
            >
              <div className="relative">
                <FileText className="w-[18px] h-[18px] group-hover:text-[#00E676] transition-colors" />
                {betSlip.length > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-3.5 h-3.5 bg-[#00E676] text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(0,230,118,0.5)]">
                    {betSlip.length}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium tracking-wide group-hover:text-[#00E676] transition-colors">Bahis kuponu</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-white transition-colors flex-1">
              <Search className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-medium tracking-wide">Ara</span>
            </button>
          </div>`
);

fs.writeFileSync('components/sports/DualRightPanel.tsx', content);
