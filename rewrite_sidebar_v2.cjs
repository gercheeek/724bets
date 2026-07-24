const fs = require('fs');

let content = fs.readFileSync('components/Sidebar.tsx', 'utf8');

// Ensure Menu, ChevronLeft are imported
if (!content.includes('ChevronLeft')) {
    content = content.replace("from 'lucide-react';", "ChevronLeft } from 'lucide-react';");
}

const startTag = "          {isOpen ? (";
const endTag = "        </div>\n      </div>\n    </>\n  );\n};\n\nexport default Sidebar;";

const startIdx = content.indexOf(startTag);
const endIdx = content.indexOf(endTag);

if (startIdx === -1 || endIdx === -1) {
    console.error("Could not find boundaries");
    process.exit(1);
}

const newMenu = `          {isOpen ? (
            <div className="flex flex-col h-full">
              {/* Toggle Button */}
              <div className="flex justify-end p-2 border-b border-white/5">
                <button onClick={onToggle} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="px-3 py-4 space-y-1 flex-1 overflow-y-auto">
                {/* SPOR GRUBU */}
                <div className="text-[10px] font-bold text-zinc-500 tracking-widest pl-2 mb-2 whitespace-nowrap">SPOR</div>
                
                <div className={\`nav-item \${activeView === 'home' ? 'active' : ''}\`} onClick={() => onViewChange('home')}>
                  <div className={\`w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner transition-colors \${activeView === 'home' ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-[#131313] border border-white/5 group-hover:bg-[#1a1a1a]'}\`}><LayoutDashboard className={\`w-4 h-4 \${activeView === 'home' ? 'text-emerald-400' : 'text-zinc-400'}\`} /></div>
                  Anasayfa
                </div>

                <div className="nav-item flex items-center justify-between" onClick={() => onViewChange('sports-live')}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-red-500/10 group-hover:border-red-500/30 transition-colors"><Radio className="w-4 h-4 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" /></div>
                    Canlı Bahis
                  </div>
                  <span className="text-[9px] font-bold bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse">CANLI</span>
                </div>

                <div className="nav-item" onClick={() => onViewChange('sports')}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-colors"><Calendar className="w-4 h-4 text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]" /></div>
                  Maç Bülteni
                </div>

                <div className="nav-item flex items-center justify-between" onClick={() => onViewChange('tv')}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-colors"><Tv className="w-4 h-4 text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" /></div>
                    724TV
                  </div>
                  <span className="text-[9px] font-bold bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/50">HD</span>
                </div>

                <div className="nav-item" onClick={() => onViewChange('mybets')}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-colors"><Ticket className="w-4 h-4 text-[#818cf8] drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" /></div>
                  Bahislerim
                </div>

                <div className="nav-item" onClick={() => onViewChange('favorites')}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-colors"><Star className="w-4 h-4 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" /></div>
                  Sık Kullanılanlar
                </div>

                <div className="h-px bg-white/5 w-full my-4" />

                {/* CASİNO GRUBU */}
                <div className="text-[10px] font-bold text-zinc-500 tracking-widest pl-2 mb-2 mt-4 whitespace-nowrap">CASİNO</div>

                <div className="nav-item" onClick={() => onViewChange('slots')}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-rose-500/10 group-hover:border-rose-500/30 transition-colors"><Cherry className="w-4 h-4 text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]" /></div>
                  Slotlar
                </div>

                <div className="nav-item" onClick={() => onViewChange('live-casino')}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors"><Dices className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" /></div>
                  Canlı Casino
                </div>

                <div className="nav-item" onClick={() => onViewChange('originals')}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-colors"><Zap className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" /></div>
                  724 Originals
                </div>
              </div>

              {/* HESAP & DESTEK GRUBU (STICKY BOTTOM) */}
              <div className="px-3 py-4 border-t border-white/5 bg-[#030303] mt-auto">
                <div className="text-[10px] font-bold text-zinc-500 tracking-widest pl-2 mb-2 whitespace-nowrap">HESAP & DESTEK</div>
                
                <div className="nav-item" onClick={() => onViewChange('rewards')}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-sky-500/10 group-hover:border-sky-500/30 transition-colors"><Gift className="w-4 h-4 text-[#0ea5e9] drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]" /></div>
                  Ödüller & Promosyonlar
                </div>

                <div className="nav-item" onClick={() => onViewChange('loyalty')}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-colors"><Diamond className="w-4 h-4 text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" /></div>
                  VIP Kulübü
                </div>

                <div className="nav-item mt-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)] rounded-xl" onClick={() => window.dispatchEvent(new Event('openSupportChat'))}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-emerald-500/20 border border-emerald-500/40"><Headphones className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" /></div>
                  Canlı Destek
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 gap-4 w-full h-full bg-[#050505] relative z-[100]">
              <button onClick={onToggle} className="text-zinc-300 hover:text-[#10b981] p-2 mb-2">
                <Menu size={24} />
              </button>
              
              <div className="flex-1 space-y-4 w-full flex flex-col items-center">
                <button onClick={() => onViewChange('home')} className={\`group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all \${activeView === 'home' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-[#131313] border border-white/5 text-zinc-400 hover:bg-[#1a1a1a] hover:text-white shadow-inner'}\`}>
                  <LayoutDashboard className="w-5 h-5" />
                  <div className="absolute left-full ml-4 px-2 py-1 bg-[#141722] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Anasayfa</div>
                </button>
                
                <div className="w-10 h-px bg-white/10 my-1"></div>
                
                <button onClick={() => {onToggle(); onViewChange('slots');}} className="group relative w-11 h-11 rounded-xl flex items-center justify-center text-[#94a3b8] hover:text-rose-400 hover:bg-[#131313] hover:border-rose-500/30 border border-transparent bg-transparent transition-all">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#131313] border border-white/5 shadow-inner group-hover:bg-rose-500/10 group-hover:border-rose-500/30 transition-all"><Cherry className="w-4 h-4 group-hover:drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]" /></div>
                  <div className="absolute left-full ml-4 px-2 py-1 bg-[#141722] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Slotlar</div>
                </button>
                <button onClick={() => {onToggle(); onViewChange('originals');}} className="group relative w-11 h-11 rounded-xl flex items-center justify-center text-[#94a3b8] hover:text-cyan-400 hover:bg-[#131313] hover:border-cyan-500/30 border border-transparent bg-transparent transition-all">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#131313] border border-white/5 shadow-inner group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all"><Zap className="w-4 h-4 group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" /></div>
                  <div className="absolute left-full ml-4 px-2 py-1 bg-[#141722] text-white text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">724 Originals</div>
                </button>
              </div>
              
              <div className="w-full flex flex-col items-center gap-4 mt-auto">
                <div className="w-10 h-px bg-white/10 my-1"></div>
                <button onClick={() => window.dispatchEvent(new Event('openSupportChat'))} className="group relative w-11 h-11 rounded-xl flex items-center justify-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center"><Headphones className="w-5 h-5 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" /></div>
                  <div className="absolute left-full ml-4 px-2 py-1 bg-emerald-500 text-black text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">Canlı Destek</div>
                </button>
              </div>
            </div>
          )}
`;

const newContent = content.substring(0, startIdx) + newMenu + endTag;
fs.writeFileSync('components/Sidebar.tsx', newContent);
console.log("Success");
