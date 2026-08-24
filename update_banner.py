import re

filename = 'components/chat/RainEventBanner.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Change the background and borders to match the requested premium design
old_container = """      {/* Glassmorphism Container */}
      <div className="relative bg-[#06080C]/80 backdrop-blur-xl border border-[#00E5FF]/30 shadow-[0_8px_32px_rgba(0,229,255,0.15)] rounded-2xl overflow-hidden p-3 flex flex-col gap-3 animate-in slide-in-from-top-4 duration-500">"""
new_container = """      {/* Glassmorphism Container */}
      <div className="relative bg-gradient-to-br from-[#1A2436]/90 to-[#101623]/90 backdrop-blur-xl border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden p-4 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-500">"""
content = content.replace(old_container, new_container)

old_icon_bg = """            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-[#00E5FF]/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Sparkles className="w-4 h-4 text-[#00E5FF] animate-pulse" />
            </div>"""
new_icon_bg = """            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 flex items-center justify-center border border-[#10B981]/30 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-5 h-5 text-[#10B981] animate-pulse" />
            </div>"""
content = content.replace(old_icon_bg, new_icon_bg)

old_text = """              <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#00E5FF]">
                ₺{activeEvent.total_amount.toLocaleString()}
              </span>"""
new_text = """              <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                ₺{activeEvent.total_amount.toLocaleString()}
              </span>"""
content = content.replace(old_text, new_text)

# Also fix the outer glow
old_glow = """      {/* Glow Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-[#00E5FF]/20 to-emerald-500/20 blur-xl rounded-full"></div>"""
new_glow = """      {/* Glow Effect Background */}
      <div className="absolute inset-0 bg-[#10B981]/10 blur-2xl rounded-full pointer-events-none"></div>"""
content = content.replace(old_glow, new_glow)

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated {filename}")
