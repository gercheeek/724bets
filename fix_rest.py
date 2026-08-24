import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Info Box Visibility
content = content.replace('bg-black/20', 'bg-white/[0.03]')

# 2. Amount Input Black Hole
content = content.replace('className="relative flex items-center bg-black/20 overflow-hidden transition-all duration-300 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]"',
                          'className="relative flex items-center bg-white/[0.02] overflow-hidden transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"')

# 3. Quick Amounts (Make sure they are 3 columns on all screens)
# If it says `grid-cols-3 gap-2 mt-3` it's already fine. Let's make it 3 cols exactly.
# I will just replace any grid-cols-6 if it's there.
content = content.replace('sm:grid-cols-6', '')

# 4. CTA Button (Make it sleeker, no harsh Windows XP gradient)
old_cta_style = "background: `linear-gradient(180deg, ${selectedMethod?.theme?.color} 0%, rgba(0,0,0,0.2) 200%)`"
new_cta_style = "background: `linear-gradient(90deg, ${selectedMethod?.theme?.color}, ${selectedMethod?.theme?.color}dd)`"
content = content.replace(old_cta_style, new_cta_style)

# Remove the stark white inner shadow on the CTA button
content = content.replace('boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), 0 10px 30px -10px ${selectedMethod?.theme?.glow}`',
                          'boxShadow: `inset 0 1px 1px rgba(255,255,255,0.2), 0 8px 25px -8px ${selectedMethod?.theme?.glow}`')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
