import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. MAKE AMOUNT SECTION SMALLER
# Input box
content = content.replace('py-3 px-4 text-white text-[24px]', 'py-2 px-3 text-white text-[20px]')
content = content.replace('pl-4 text-lg', 'pl-3 text-base')
# Quick amounts grid
content = content.replace('grid-cols-3 gap-3 mt-3', 'grid-cols-3 gap-2 mt-2')
# Quick amounts buttons
content = content.replace('py-2 rounded-lg text-[13px]', 'py-1.5 rounded-md text-[12px]')

# 2. MAKE PAYMENT CARDS BIGGER
# Min height & Padding
content = content.replace('min-h-[90px]', 'min-h-[115px]')
content = content.replace('p-3.5 rounded-[14px]', 'p-4 rounded-xl')
# Icon box
content = content.replace('w-8 h-8 rounded-lg', 'w-11 h-11 rounded-xl')
# Icon inside
content = content.replace('w-4 h-4" style={{ color: isSelected', 'w-5 h-5" style={{ color: isSelected')
# Checkmark badge
content = content.replace('w-5 h-5 rounded-full', 'w-6 h-6 rounded-full')
content = content.replace('w-3.5 h-3.5 text-white" strokeWidth={3}', 'w-4 h-4 text-white" strokeWidth={3.5}')
# Texts
content = content.replace('text-[14px] font-bold mb-0.5', 'text-[15px] font-bold mb-1') # Title
content = content.replace('text-[10px] font-bold uppercase tracking-widest', 'text-[11px] font-bold uppercase tracking-widest') # Limit

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
