import re

filename = 'components/sports/TopMatchesWidget.tsx'
with open(filename, 'r') as f:
    content = f.read()

# 1. Update the card wrapper
old_card_class = 'className="cursor-pointer min-w-[240px] w-[240px] shrink-0 bg-[#121825] rounded-xl border border-white/5 p-2.5 flex flex-col shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.3)] hover:border-[#00FF87]/30 hover:bg-[#161D2C] transition-all duration-300 relative group/card transform-gpu overflow-hidden"'
new_card_class = 'className="cursor-pointer min-w-[240px] w-[240px] shrink-0 bg-gradient-to-b from-[#161B26] to-[#0A0D14] rounded-xl p-2.5 flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_20px_rgba(0,229,255,0.15)] transition-all duration-500 relative group/card transform-gpu overflow-hidden border-none"'
content = content.replace(old_card_class, new_card_class)

# 2. Update CANLI badge
old_live_badge = 'className="flex items-center gap-1.5 bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded self-start"'
new_live_badge = 'className="flex items-center gap-1.5 bg-gradient-to-r from-red-500/20 to-red-500/5 text-red-400 px-2 py-0.5 rounded self-start shadow-[inset_0_0_10px_rgba(239,68,68,0.2)] border-none"'
content = content.replace(old_live_badge, new_live_badge)

# 3. Update Upcoming badge (if any)
old_upcoming_badge = 'className="bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 px-2 py-0.5 rounded text-[10px] font-bold self-start whitespace-nowrap tracking-wider"'
new_upcoming_badge = 'className="bg-gradient-to-r from-[#00E5FF]/20 to-[#00E5FF]/5 text-[#00E5FF] px-2 py-0.5 rounded text-[10px] font-bold self-start whitespace-nowrap tracking-wider shadow-[inset_0_0_10px_rgba(0,229,255,0.2)] border-none"'
content = content.replace(old_upcoming_badge, new_upcoming_badge)

# 4. Update the scores to glow
old_score = 'className="text-[20px] font-black text-white drop-shadow-md"'
new_score = 'className="text-[20px] font-black text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"'
content = content.replace(old_score, new_score)
content = content.replace('className="text-[20px] font-black text-white group-hover/card:text-[#00E5FF] transition-colors drop-shadow-md"', 'className="text-[20px] font-black text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"')
content = content.replace('className="text-[20px] font-black text-white group-hover/card:text-white transition-colors drop-shadow-md"', 'className="text-[20px] font-black text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"')

# 5. Update Odds Buttons (Page 1 - 1X2)
# These use: className="bg-[#0A0E17] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[#00FF87]/50 hover:bg-[#00FF87]/5 rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer active:scale-[0.96]"
old_btn_1 = 'className="bg-[#0A0E17] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[#00FF87]/50 hover:bg-[#00FF87]/5 rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer active:scale-[0.96]"'
new_btn_1 = 'className="bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_6px_rgba(0,0,0,0.2)] hover:bg-white/[0.06] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(0,229,255,0.15)] rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer active:scale-[0.96] border-none"'
content = content.replace(old_btn_1, new_btn_1)

# Also update the inner text for 1X2 to use cyan instead of green
content = content.replace('group-hover:text-[#00FF87]/80', 'group-hover:text-[#00E5FF]/80')
content = content.replace('group-hover:text-[#00FF87]', 'group-hover:text-[#00E5FF]')

# 6. Update Odds Buttons (Page 2 & 3 - Under/Over, GG/NG)
# These use: className="bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-[#00E5FF]/50 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.2)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"
old_btn_2 = 'className="bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-[#00E5FF]/50 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.2)] rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98]"'
new_btn_2 = 'className="bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_6px_rgba(0,0,0,0.2)] hover:bg-white/[0.06] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(0,229,255,0.15)] rounded-lg p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98] border-none"'
content = content.replace(old_btn_2, new_btn_2)

# Update locked buttons
old_btn_locked = 'className={`bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group ${isGgResolved ? \'opacity-40 cursor-not-allowed bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)]\' : \'hover:border-[#00E5FF]/50 hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.2)] cursor-pointer active:scale-[0.98]\'}`}'
new_btn_locked = 'className={`bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_6px_rgba(0,0,0,0.2)] rounded-lg p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group border-none ${isGgResolved ? \'opacity-40 cursor-not-allowed bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)]\' : \'hover:bg-white/[0.06] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(0,229,255,0.15)] cursor-pointer active:scale-[0.98]\'}`}'
content = content.replace(old_btn_locked, new_btn_locked)

with open(filename, 'w') as f:
    f.write(content)
print("Updated TopMatchesWidget styles")
