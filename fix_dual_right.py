import re

filename = 'components/sports/DualRightPanel.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Change BetSlip background and style in DualRightPanel
old_bg = "className=\"flex-1 overflow-y-auto custom-scrollbar flex flex-col relative\""
new_bg = "className=\"flex-1 overflow-y-auto custom-scrollbar flex flex-col relative bg-gradient-to-b from-[#1A2436] to-[#101623]\""
content = content.replace(old_bg, new_bg)

old_card = "className=\"bg-[#161920] border border-white/5 rounded-xl p-3 relative group hover:border-[#00E5FF]/30 transition-all\""
new_card = "className=\"bg-gradient-to-br from-[#1A2436] to-[#131b2b] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_4px_10px_rgba(0,0,0,0.3)] rounded-xl p-3 relative group hover:border-[#10B981]/30 hover:-translate-y-0.5 transition-all\""
content = content.replace(old_card, new_card)

old_odd = "className=\"font-black text-[13px] text-[#00E5FF] px-2 py-0.5 bg-[#00E5FF]/10 rounded-md\""
new_odd = "className=\"font-black text-[13px] text-[#10B981] px-2 py-0.5 bg-[#10B981]/10 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.2)]\""
content = content.replace(old_odd, new_odd)

old_empty = "className=\"flex-1 flex flex-col items-center justify-center p-6 text-center\""
new_empty = "className=\"flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#1A2436] to-[#101623]\""
content = content.replace(old_empty, new_empty)

old_empty_icon = "className=\"w-16 h-16 bg-[#161920] rounded-full flex items-center justify-center border border-white/5 mb-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]\""
new_empty_icon = "className=\"w-16 h-16 bg-gradient-to-b from-[#1A2436] to-[#101623] rounded-full flex items-center justify-center border border-[#10B981]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_15px_rgba(16,185,129,0.2)] mb-4\""
content = content.replace(old_empty_icon, new_empty_icon)

old_empty_btn = "className=\"w-full flex items-center justify-between p-3 rounded-lg bg-[#161920] border border-white/5 hover:border-[#00E5FF]/30 group transition-all\""
new_empty_btn = "className=\"w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-[#1A2436] to-[#131b2b] border border-white/5 hover:border-[#10B981]/30 hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 group transition-all\""
content = content.replace(old_empty_btn, new_empty_btn)

old_button = "bg-gradient-to-r from-[#00E5FF] to-[#0099CC]"
new_button = "bg-gradient-to-r from-[#10B981] to-[#059669]"
content = content.replace(old_button, new_button)

old_shadow = "shadow-[0_0_20px_rgba(0,229,255,0.3)]"
new_shadow = "shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_0_20px_rgba(16,185,129,0.4)]"
content = content.replace(old_shadow, new_shadow)

old_hover_shadow = "hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]"
new_hover_shadow = "hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_0_30px_rgba(16,185,129,0.6)]"
content = content.replace(old_hover_shadow, new_hover_shadow)

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated {filename}")
