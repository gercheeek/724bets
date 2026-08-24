import re

filename = 'components/chat/RainEventBanner.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Make the KATILDINIZ button ultra-premium
old_claimed = """          {hasClaimed ? (
            <div className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#10B981]/20 via-[#34D399]/20 to-[#10B981]/20 border border-[#10B981]/40 rounded-xl text-[#34D399] text-sm font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-5 h-5 animate-pulse" /> KATILDINIZ
            </div>
          ) : ("""

new_claimed = """          {hasClaimed ? (
            <div className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-[#10B981]/10 via-[#34D399]/20 to-[#10B981]/10 border border-[#10B981]/30 rounded-2xl shadow-[inset_0_0_15px_rgba(16,185,129,0.1),0_0_10px_rgba(16,185,129,0.2)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
              <Sparkles className="w-4 h-4 text-[#34D399] animate-pulse" />
              <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#10B981] tracking-widest drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                KATILDINIZ
              </span>
            </div>
          ) : ("""
content = content.replace(old_claimed, new_claimed)

with open(filename, 'w') as f:
    f.write(content)
print("Updated KATILDINIZ button design")
