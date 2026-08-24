import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Header Logo & Balance
content = content.replace('bg-white/[0.03] border border-white/[0.08] p-2', 'bg-transparent p-1')
content = content.replace('shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]', '')
content = content.replace('bg-white/[0.05] py-1.5 px-3 rounded-[10px] border border-white/[0.08] shadow-sm', 'bg-white/[0.03] py-2 px-3 rounded-[10px]')

# 2. Tabs
content = content.replace('bg-white/[0.03] p-1 rounded-[12px] mb-6 w-full border border-white/[0.08] backdrop-blur-md', 'bg-white/[0.03] p-1 rounded-[12px] mb-6 w-full backdrop-blur-md')
content = content.replace('bg-white/[0.1] text-white shadow-sm border border-white/[0.12]', 'bg-white/[0.08] text-white shadow-sm')

# 3. Cards (De-framing)
# Remove the inline border style completely
content = re.sub(r'border:\s*`1px solid [^`]+`,\n\s*', '', content)
# Make unselected bg slightly more visible since border is gone
content = content.replace("linear-gradient(145deg, ${theme.color}0A 0%, transparent 100%)", "linear-gradient(145deg, ${theme.color}10 0%, transparent 100%)")
# Remove top highlight line (can look like a border)
content = re.sub(r'\{\/\* Keskin Cam Yansıması \(Top Edge\) \*\/\}.*?</div>', '', content, flags=re.DOTALL)
# Icon box inside cards - remove border
content = re.sub(r"border:\s*isSelected \? 'none' : `1px solid \$\{theme\.color\}40`", "border: 'none'", content)
# Badges - remove border
content = re.sub(r'border:\s*`1px solid \$\{theme\.color\}40`', "border: 'none'", content)

# 4. Info Box (Deposit)
content = content.replace('p-3 rounded-[12px] border flex gap-4 items-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]', 'p-4 rounded-[12px] flex gap-4 items-center bg-black/20')
# We need to remove the inline border color from info box too
content = re.sub(r'borderColor:\s*`\$\{selectedMethod\?\.theme\?\.color\}40`', "borderColor: 'transparent'", content)

# 5. Amount Input
content = content.replace('bg-black/20 border border-white/[0.12]', 'bg-black/20')
# Remove the blue ring on focus
content = re.sub(r'boxShadow:\s*amount && isAmountValid \? `inset 0 2px 8px rgba\(0,0,0,0\.3\), 0 0 0 1px \$\{selectedMethod\?\.theme\?\.color\}50` : \'\'', "boxShadow: amount && isAmountValid ? `inset 0 2px 8px rgba(0,0,0,0.4)` : ''", content)
content = re.sub(r'borderColor:\s*amount && isAmountValid \? selectedMethod\?\.theme\?\.color : \'\'', "borderColor: 'transparent'", content)

# 6. Quick Amounts
# Unselected
content = content.replace('bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.1]', 'bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white border-transparent')
# Selected
content = re.sub(r'bg-\[\$\{selectedMethod\?\.theme\?\.color\}\]/20 border-\[\$\{selectedMethod\?\.theme\?\.color\}\]', 'bg-[${selectedMethod?.theme?.color}]/20 border-transparent', content)
content = content.replace('transition-all duration-300 border', 'transition-all duration-300')

# 7. CTA Button
content = content.replace('py-3.5', 'py-3')

# 8. Right Panel Security Box
content = content.replace('bg-gradient-to-br from-white/[0.1] to-transparent border border-white/[0.1]', 'bg-white/[0.03]')
content = content.replace('bg-white/[0.03] border border-white/[0.05]', 'bg-white/[0.02]')

# 9. Clean up right panel official partner border
content = content.replace('bg-white/[0.02] border border-white/[0.05]', 'bg-transparent')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
