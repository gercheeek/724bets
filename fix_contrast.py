import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Header Balance container
content = content.replace('bg-black/20 py-1.5 px-3 rounded-lg border border-white/[0.03]', 'bg-white/[0.05] py-1.5 px-3 rounded-[10px] border border-white/[0.08] shadow-sm')

# 2. Segmented Tabs container
content = content.replace('bg-black/40 p-1.5 rounded-[16px] mb-8 w-full border border-white/[0.04] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]', 'bg-white/[0.03] p-1.5 rounded-[16px] mb-8 w-full border border-white/[0.08] backdrop-blur-md')

# 3. Tab Buttons active state
content = content.replace('bg-gradient-to-b from-white/[0.12] to-white/[0.05] text-white shadow-[0_2px_10px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/[0.1]', 'bg-white/[0.1] text-white shadow-sm border border-white/[0.12]')
# 4. Tab Buttons inactive state
content = content.replace("text-white/40 hover:text-white/80 hover:bg-white/[0.02]", "text-white/60 hover:text-white/90 hover:bg-white/[0.04]")

# 5. Card Unselected Base BG
content = content.replace("bg-gradient-to-br from-white/[0.04] to-transparent", "bg-white/[0.03] hover:bg-white/[0.06]")

# 6. Card borders
content = content.replace("hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-10 border border-white/[0.05]", "hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] z-10 border border-white/[0.08]")

# 7. Card Unselected Icon Container
content = content.replace("rgba(255,255,255,0.05)", "rgba(255,255,255,0.08)")
content = content.replace("text-white/40 group-hover:text-white/70", "text-white/70 group-hover:text-white/90")

# 8. Card Badge
content = content.replace("bg-black/20 text-white/40 shadow-sm", "bg-white/[0.05] text-white/70 shadow-sm border-white/[0.1]")

# 9. Card Title
content = content.replace("text-white/70 group-hover:text-white/90", "text-white/90 group-hover:text-white")

# 10. Card Limit
content = content.replace("text-white/30 group-hover:text-white/50", "text-white/50 group-hover:text-white/70")

# 11. Amount Input Container
content = content.replace('bg-[#050810] border border-white/[0.08]', 'bg-black/20 border border-white/[0.12]')
content = content.replace('shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]', 'shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]')
content = content.replace('inset 0 2px 10px rgba(0,0,0,0.5)', 'inset 0 2px 8px rgba(0,0,0,0.3)')
content = content.replace('text-white/30 transition-colors', 'text-white/70 transition-colors')

# 12. Quick Amounts
content = content.replace("bg-white/[0.02] border-white/[0.05] text-white/50", "bg-white/[0.04] border-white/[0.08] text-white/70")

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)

print("Contrast fixed")
