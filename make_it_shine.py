import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Selected Card Glow (Making it shine cleanly)
# Current card style: backgroundColor: isSelected ? `${theme.color}15` : '#1A1F2E',
new_card_style = """backgroundColor: isSelected ? `${theme.color}15` : '#1A1F2E',
                            boxShadow: isSelected ? `0 0 30px ${theme.color}25, inset 0 1px 0 ${theme.color}30` : 'none',
                            border: isSelected ? `1px solid ${theme.color}40` : '1px solid transparent',"""
content = re.sub(r"backgroundColor:\s*isSelected\s*\?\s*`\$\{theme\.color\}15`\s*:\s*'#1A1F2E',", new_card_style, content)

# 2. Icon Glow
# Current icon shadow: boxShadow: isSelected ? `0 4px 12px ${theme.color}60` : 'none'
new_icon_shadow = "boxShadow: isSelected ? `0 0 25px ${theme.color}90, 0 8px 20px ${theme.color}50` : 'none'"
content = content.replace("boxShadow: isSelected ? `0 4px 12px ${theme.color}60` : 'none'", new_icon_shadow)

# 3. CTA Button Glow
old_cta_style = "style={{ backgroundColor: selectedMethod?.theme?.color }}"
new_cta_style = "style={{ backgroundColor: selectedMethod?.theme?.color, boxShadow: `0 0 30px ${selectedMethod?.theme?.color}50, inset 0 1px 1px rgba(255,255,255,0.3)` }}"
content = content.replace(old_cta_style, new_cta_style)

# 4. Amount Input subtle highlight
content = content.replace('bg-[#1A1F2E] rounded-xl overflow-hidden transition-colors focus-within:bg-[#22283A]', 'bg-[#1A1F2E] rounded-xl overflow-hidden transition-all focus-within:bg-[#22283A] focus-within:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-transparent focus-within:border-white/10')

# 5. Modal Container subtle border to separate from background
content = content.replace('bg-[#0F1423] shadow-2xl"', 'bg-[#0F1423] shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/5"')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
