import re

filename = 'components/chat/RainEventBanner.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Change BAŞARIYLA TOPLANDI to KATILDINIZ with a nicer design
old_claimed = """          {hasClaimed ? (
            <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-black uppercase tracking-widest shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
              <Sparkles className="w-4 h-4" /> Başarıyla Toplandı
            </div>
          ) : ("""

new_claimed = """          {hasClaimed ? (
            <div className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#10B981]/20 via-[#34D399]/20 to-[#10B981]/20 border border-[#10B981]/40 rounded-xl text-[#34D399] text-sm font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-5 h-5 animate-pulse" /> KATILDINIZ
            </div>
          ) : ("""
content = content.replace(old_claimed, new_claimed)

with open(filename, 'w') as f:
    f.write(content)
print("Updated RainEventBanner text")
