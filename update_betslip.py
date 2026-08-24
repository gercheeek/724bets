import re

filename = 'components/SporxBetSlip.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Replace main container bg
content = content.replace('bg-[#20252D]', 'bg-gradient-to-b from-[#1A2436] to-[#101623]')

# Replace header bg
content = content.replace('bg-[#0A0C10] border-b border-white/5', 'bg-[#131b2b] shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)] relative z-10')

# Replace accent color with Emerald
content = content.replace('text-[color:var(--theme-accent)]', 'text-[#10B981]')
content = content.replace('bg-[color:var(--theme-accent)]', 'bg-[#10B981]')
content = content.replace('bg-gradient-to-r from-[color:var(--theme-accent)] to-[#00E75A]', 'bg-gradient-to-r from-[#10B981] to-[#059669]')
content = content.replace('shadow-[0_0_20px_rgba(0,255,163,0.2)]', 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_0_20px_rgba(16,185,129,0.3)]')
content = content.replace('group-hover:text-[color:var(--theme-accent)]', 'group-hover:text-[#10B981]')

# Tab selected state
content = content.replace("betTab === t ? 'bg-[#10B981] text-black shadow-md' : 'text-zinc-500 hover:text-white'",
                          "betTab === t ? 'bg-[#10B981] text-white shadow-[0_0_10px_rgba(16,185,129,0.3)] font-black' : 'text-zinc-500 hover:text-white'")

# Empty state cards
content = content.replace("bg-[#0A0C10] border border-white/5", "bg-gradient-to-b from-[#1A2436] to-[#101623] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]")
content = content.replace("bg-[#161920]", "bg-transparent") # Let the main gradient show through

# Added active matches cards
content = content.replace("bg-[#0A0C10] rounded-xl p-3 border border-white/5 relative group hover:border-white/10 transition-colors",
                          "bg-gradient-to-br from-[#1A2436] to-[#131b2b] rounded-xl p-3 border border-white/5 relative group hover:border-white/20 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_4px_10px_rgba(0,0,0,0.3)] hover:-translate-y-0.5")

content = content.replace("bg-[#0A0C10] rounded-xl p-4 border border-white/5",
                          "bg-gradient-to-b from-[#1A2436] to-[#101623] rounded-xl p-4 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]")

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated {filename}")
