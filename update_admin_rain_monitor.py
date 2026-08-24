import re

filename = 'components/AdminRainControl.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Add useRainEvent import
content = content.replace("import { CloudRain, DollarSign", "import { useRainEvent } from '../hooks/useRainEvent';\nimport { CloudRain, DollarSign")

# Add hook call inside component
content = content.replace(
    "const [loading, setLoading] = useState(false);",
    "const [loading, setLoading] = useState(false);\n\n  const { activeEvent, participantsCount, timeLeft } = useRainEvent(adminId);"
)

# Add the Live Monitor Section right below the header
live_monitor = """
      {/* CANLI TAKIP (Eğer Aktif Yağmur Varsa) */}
      {activeEvent && (
        <div className="relative z-10 bg-[#06080C] border border-emerald-500/30 rounded-xl p-4 flex flex-col gap-3 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute"></span>
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">AKTİF YAĞMUR</span>
                </div>
                <span className="text-xs font-bold text-zinc-400">
                    Kalan: <span className="text-white">{timeLeft}sn</span>
                </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase">Havuz</div>
                    <div className="text-sm font-black text-emerald-400">₺{activeEvent.total_amount.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase">Katılım</div>
                    <div className="text-sm font-black text-emerald-400">{participantsCount} / {activeEvent.max_participants}</div>
                </div>
            </div>
        </div>
      )}
"""

content = content.replace('      <div className="flex flex-col gap-4 relative z-10">', live_monitor + '\n      <div className="flex flex-col gap-4 relative z-10">')

# Also, if an event is active, maybe disable the "Start" button or change the text.
old_start_btn = """        <button 
          onClick={handleStartRain} 
          disabled={loading}
          className="col-span-2 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#10B981] to-[#34D399] hover:from-[#059669] hover:to-[#10B981] text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-5 h-5" />
          {loading ? 'BAŞLATILIYOR...' : 'YAĞMURU BAŞLAT'}
        </button>"""

new_start_btn = """        <button 
          onClick={handleStartRain} 
          disabled={loading || !!activeEvent}
          className="col-span-2 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#10B981] to-[#34D399] hover:from-[#059669] hover:to-[#10B981] text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-5 h-5" />
          {loading ? 'BAŞLATILIYOR...' : activeEvent ? 'YAĞMUR DEVAM EDİYOR' : 'YAĞMURU BAŞLAT'}
        </button>"""
content = content.replace(old_start_btn, new_start_btn)


with open(filename, 'w') as f:
    f.write(content)

print("Added real-time monitoring to AdminRainControl")
