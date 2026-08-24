import re

filename = 'components/AdminChatControl.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Fix layout of the tab buttons so they don't break/wrap
old_tabs = """      {/* Tabs */}
      <div className="flex bg-[#06080C] p-1 rounded-xl relative z-10 border border-white/5 shadow-inner">
        <button onClick={() => setActiveTab('rain')} className={`flex-1 py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'rain' ? 'bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <CloudRain className="w-3.5 h-3.5" /> Yağmur
        </button>
        <button onClick={() => setActiveTab('mod')} className={`flex-1 py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'mod' ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <ShieldAlert className="w-3.5 h-3.5" /> Moderasyon
        </button>
        <button onClick={() => setActiveTab('broadcast')} className={`flex-1 py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'broadcast' ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <MessageSquare className="w-3.5 h-3.5" /> Duyuru
        </button>
      </div>"""

new_tabs = """      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-[#06080C] p-1 rounded-xl relative z-10 border border-white/5 shadow-inner">
        <button onClick={() => setActiveTab('rain')} className={`w-full py-2 flex flex-col items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'rain' ? 'bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
          <CloudRain className="w-4 h-4" /> 
          <span className="text-[9px] font-black uppercase tracking-wider">Yağmur</span>
        </button>
        <button onClick={() => setActiveTab('mod')} className={`w-full py-2 flex flex-col items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'mod' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
          <ShieldAlert className="w-4 h-4" /> 
          <span className="text-[9px] font-black uppercase tracking-wider">Mod</span>
        </button>
        <button onClick={() => setActiveTab('broadcast')} className={`w-full py-2 flex flex-col items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'broadcast' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
          <MessageSquare className="w-4 h-4" /> 
          <span className="text-[9px] font-black uppercase tracking-wider">Duyuru</span>
        </button>
      </div>"""
content = content.replace(old_tabs, new_tabs)

with open(filename, 'w') as f:
    f.write(content)
print("Fixed tab layout")
