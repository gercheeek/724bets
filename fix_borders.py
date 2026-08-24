import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Remove the ugly fake 3D border divs completely
pattern = re.compile(r'\{\/\* (PREMIUM METALLIC|PLATINUM\/PURPLE|SAPPHIRE) BORDER \*\/\}.*?</div>\s*</div>', re.DOTALL)
content = pattern.sub('', content)

# Add clean, modern 1px borders to the main button tags
# Gold
content = content.replace(
    "'scale-[1.02] shadow-[0_10px_30px_rgba(245,158,11,0.2)] z-20'",
    "'scale-[1.02] shadow-[0_10px_30px_rgba(245,158,11,0.2)] z-20 border border-[#F59E0B]/50'"
)
content = content.replace(
    "'hover:scale-[1.01] hover:shadow-[0_5px_20px_rgba(245,158,11,0.1)] z-10'",
    "'hover:scale-[1.01] hover:shadow-[0_5px_20px_rgba(245,158,11,0.1)] z-10 border border-white/5 hover:border-[#F59E0B]/30'"
)

# Platinum
content = content.replace(
    "'scale-[1.02] shadow-[0_10px_30px_rgba(139,92,246,0.2)] z-20'",
    "'scale-[1.02] shadow-[0_10px_30px_rgba(139,92,246,0.2)] z-20 border border-[#8B5CF6]/50'"
)
content = content.replace(
    "'hover:scale-[1.01] hover:shadow-[0_5px_20px_rgba(139,92,246,0.1)] z-10'",
    "'hover:scale-[1.01] hover:shadow-[0_5px_20px_rgba(139,92,246,0.1)] z-10 border border-white/5 hover:border-[#8B5CF6]/30'"
)

# Corporate
content = content.replace(
    "'scale-[1.02] shadow-[0_10px_30px_rgba(59,130,246,0.25)] z-20'",
    "'scale-[1.02] shadow-[0_10px_30px_rgba(59,130,246,0.25)] z-20 border border-[#3B82F6]/50'"
)
content = content.replace(
    "'hover:scale-[1.01] hover:shadow-[0_5px_20px_rgba(59,130,246,0.15)] z-10'",
    "'hover:scale-[1.01] hover:shadow-[0_5px_20px_rgba(59,130,246,0.15)] z-10 border border-white/5 hover:border-[#3B82F6]/30'"
)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)

print("Borders fixed")
