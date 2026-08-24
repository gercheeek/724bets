import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Tabs
content = content.replace('p-1.5 rounded-[16px]', 'p-1 rounded-[12px]')
content = content.replace('py-2.5 rounded-[12px]', 'py-1.5 rounded-[10px]')

# Cards
content = content.replace('min-h-[140px]', 'min-h-[90px]')
content = content.replace('p-5 rounded-[20px]', 'p-3.5 rounded-[14px]')
content = content.replace('w-9 h-9 rounded-xl', 'w-7 h-7 rounded-[10px]')
content = content.replace('w-4 h-4 transition-colors', 'w-3.5 h-3.5 transition-colors')
content = content.replace('mt-4', 'mt-2.5')
content = content.replace('text-[15px]', 'text-[13px]')
content = content.replace('text-[10.5px]', 'text-[9.5px]')
content = content.replace('px-2.5 py-1 rounded-full', 'px-2 py-0.5 rounded')

# Info box
content = content.replace('p-4 rounded-[16px]', 'p-3 rounded-[12px]')
content = content.replace('p-2.5 rounded-xl', 'p-2 rounded-lg')

# Amount Input
content = content.replace('rounded-[16px] overflow-hidden', 'rounded-[12px] overflow-hidden')
content = content.replace('py-4 px-4 text-[32px]', 'py-2.5 px-3 text-[22px]')
content = content.replace('pl-6 text-2xl', 'pl-4 text-lg')

# Quick Amounts
content = content.replace('grid-cols-3 sm:grid-cols-6 gap-2.5 mt-4', 'grid-cols-3 gap-2 mt-3')
content = content.replace('py-2.5 rounded-[12px] text-[13px]', 'py-2 rounded-lg text-[12px]')

# CTA Button
content = content.replace('rounded-[16px] text-white font-bold text-[16px] py-4.5', 'rounded-[12px] text-white font-bold text-[14px] py-3.5')
content = content.replace('pt-6 pb-2', 'pt-4 pb-1')

# Right Panel
content = content.replace('w-[280px] border-l border-white/[0.05] p-10', 'w-[240px] border-l border-white/[0.05] p-6')
content = content.replace('w-12 h-12 rounded-[14px] flex items-center justify-center mb-5', 'w-10 h-10 rounded-[10px] flex items-center justify-center mb-4')
content = content.replace('text-[17px] font-bold mb-2.5', 'text-[15px] font-bold mb-1.5')
content = content.replace('space-y-8', 'space-y-5') # from 8 to 5 for right panel items
content = content.replace('pt-10 text-center', 'pt-6 text-center')

# Vertical Rhythm
content = content.replace('mb-8 shrink-0', 'mb-5 shrink-0')
content = content.replace('flex flex-col space-y-8', 'flex flex-col space-y-5')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
