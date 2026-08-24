import re

filename = 'components/sports/TopMatchesWidget.tsx'
with open(filename, 'r') as f:
    content = f.read()

# 1. Update the Upcoming Badge
old_upcoming = 'className="bg-gradient-to-r from-[#00E5FF]/20 to-[#00E5FF]/5 text-[#00E5FF] px-2 py-0.5 rounded text-[10px] font-bold self-start whitespace-nowrap tracking-wider shadow-[inset_0_0_10px_rgba(0,229,255,0.2)] border-none"'
new_upcoming = 'className="bg-gradient-to-r from-[#00E5FF]/20 to-[#00E5FF]/5 text-[#00E5FF] px-2.5 py-0.5 rounded text-[11px] font-black self-start whitespace-nowrap tracking-wider shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_0_15px_rgba(0,229,255,0.2)] border-none"'
content = content.replace(old_upcoming, new_upcoming)

# 2. Update VS Text
old_vs = 'className="text-sm font-black text-white/30 italic tracking-widest mt-1">VS</div>'
new_vs = 'className="text-base font-black text-transparent bg-clip-text bg-gradient-to-b from-white/70 to-white/10 italic tracking-widest mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">VS</div>'
content = content.replace(old_vs, new_vs)

# 3. Update Odds Buttons (Page 1 - 1X2)
old_btn = 'className="bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_6px_rgba(0,0,0,0.2)] hover:bg-white/[0.06] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(0,229,255,0.15)] rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer active:scale-[0.96] border-none"'
new_btn = 'className="bg-gradient-to-b from-[#1E2333] to-[#121622] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_4px_8px_rgba(0,0,0,0.4)] hover:from-[#232A3D] hover:to-[#171C2B] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_0_15px_rgba(0,229,255,0.2)] rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer active:scale-[0.96] border-none relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent before:opacity-0 hover:before:opacity-100"'
content = content.replace(old_btn, new_btn)

# 4. Update Odds Buttons (Page 2 & 3 - Under/Over, GG/NG)
old_btn2 = 'className="bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_6px_rgba(0,0,0,0.2)] hover:bg-white/[0.06] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(0,229,255,0.15)] rounded-lg p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98] border-none"'
new_btn2 = 'className="bg-gradient-to-b from-[#1E2333] to-[#121622] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_4px_8px_rgba(0,0,0,0.4)] hover:from-[#232A3D] hover:to-[#171C2B] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_0_15px_rgba(0,229,255,0.2)] rounded-lg p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group cursor-pointer active:scale-[0.98] border-none relative overflow-hidden"'
content = content.replace(old_btn2, new_btn2)

# Update locked buttons
old_btn_locked = 'className={`bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_6px_rgba(0,0,0,0.2)] rounded-lg p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group border-none ${isGgResolved ? \'opacity-40 cursor-not-allowed bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)]\' : \'hover:bg-white/[0.06] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(0,229,255,0.15)] cursor-pointer active:scale-[0.98]\'}`}'
new_btn_locked = 'className={`bg-gradient-to-b from-[#1E2333] to-[#121622] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_4px_8px_rgba(0,0,0,0.4)] rounded-lg p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all group border-none relative overflow-hidden ${isGgResolved ? \'opacity-40 cursor-not-allowed bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)]\' : \'hover:from-[#232A3D] hover:to-[#171C2B] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_0_15px_rgba(0,229,255,0.2)] cursor-pointer active:scale-[0.98]\'}`}'
content = content.replace(old_btn_locked, new_btn_locked)

with open(filename, 'w') as f:
    f.write(content)
print("Updated match card styles")
