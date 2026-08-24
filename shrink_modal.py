import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Container Size & Padding
content = content.replace('max-w-[900px]', 'max-w-[800px]')
content = content.replace('w-[260px]', 'w-[230px]')
content = content.replace('p-8 flex flex-col', 'p-6 flex flex-col') # left panel
content = content.replace('p-8 shrink-0', 'p-6 shrink-0') # right panel
content = content.replace('mb-8 shrink-0', 'mb-6 shrink-0') # header mb
content = content.replace('mb-8 w-full', 'mb-6 w-full') # tabs mb
content = content.replace('space-y-8', 'space-y-6') # main flex col

# 2. Header
content = content.replace('text-2xl font-black', 'text-xl font-black') # Logo text
content = content.replace('h-6 object-contain', 'h-5 object-contain') # Logo image
content = content.replace('text-lg font-bold', 'text-[15px] font-bold') # Balance
content = content.replace('h-6 w-[2px]', 'h-5 w-[2px]') # Separator
content = content.replace('py-2 px-3', 'py-1.5 px-3') # Balance box padding

# 3. Tabs
content = content.replace('py-2.5 rounded-lg text-[14px]', 'py-2 rounded-lg text-[13px]')

# 4. Cards
content = content.replace('min-h-[105px]', 'min-h-[90px]')
content = content.replace('p-4 rounded-xl', 'p-3.5 rounded-[14px]')
content = content.replace('w-10 h-10 rounded-lg', 'w-8 h-8 rounded-lg') # icon box
content = content.replace('w-5 h-5" style={{ color: isSelected', 'w-4 h-4" style={{ color: isSelected') # icon inside
content = content.replace('w-6 h-6 rounded-full', 'w-5 h-5 rounded-full') # checkmark box
content = content.replace('w-4 h-4 text-white" strokeWidth={3.5}', 'w-3.5 h-3.5 text-white" strokeWidth={3}') # checkmark icon inside
content = content.replace('text-[15px] font-bold mb-0.5', 'text-[14px] font-bold mb-0.5') # Card Title
content = content.replace('text-[11px] font-bold uppercase tracking-widest', 'text-[10px] font-bold uppercase tracking-widest') # Limit Text
content = content.replace('mb-4 uppercase', 'mb-3 uppercase') # Section Title margin

# 5. Amount Input
content = content.replace('py-4 px-4 text-[28px]', 'py-3 px-4 text-[24px]')
content = content.replace('pl-5 text-xl', 'pl-4 text-lg')

# 6. Quick Amounts
content = content.replace('py-3 rounded-xl text-[14px]', 'py-2 rounded-lg text-[13px]')

# 7. CTA Button
content = content.replace('py-4 transition-transform', 'py-3 transition-transform')
content = content.replace('text-[16px]', 'text-[15px]')

# 8. Right Panel contents
content = content.replace('mb-10', 'mb-8')
content = content.replace('w-12 h-12 rounded-xl flex items-center justify-center mb-5', 'w-10 h-10 rounded-[10px] flex items-center justify-center mb-4')
content = content.replace('w-6 h-6 text-white', 'w-5 h-5 text-white')
content = content.replace('text-[16px] font-bold mb-2', 'text-[15px] font-bold mb-1.5')
content = content.replace('text-[13px] leading-relaxed', 'text-[12px] leading-relaxed')
content = content.replace('text-[14px] font-bold mb-1', 'text-[13px] font-bold mb-1')

# 9. Forms (If any are active)
content = content.replace('py-3.5 px-4', 'py-2.5 px-3') # Form inputs
content = content.replace('p-4 rounded-xl flex gap-4', 'p-3 rounded-xl flex gap-3') # Info box

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
