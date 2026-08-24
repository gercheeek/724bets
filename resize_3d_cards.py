import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Card Container
content = content.replace('p-6 rounded-[24px]', 'p-4 rounded-[20px]')
content = content.replace('min-h-[220px]', 'min-h-[150px]')

# 2. Text (Titles & Subtitles)
content = content.replace('text-[16px] font-black', 'text-[13px] font-black')
content = content.replace('text-[10px] font-bold', 'text-[8.5px] font-bold')
content = content.replace('mt-2 relative z-10', 'mt-1 relative z-10')

# 3. Middle Section Spacing
content = content.replace('my-auto py-6 relative z-10', 'my-auto py-3 relative z-10')

# 4. Bank Icon
content = content.replace('w-14 h-14 text-white relative z-10', 'w-10 h-10 text-white relative z-10')

# 5. Crypto Coins
# Bitcoin (Center)
content = content.replace('w-14 h-14 rounded-full flex items-center justify-center border-2 border-[#FDE047]/50 shadow-[0_15px_30px_rgba(0,0,0,0.9)] relative z-20 bg-gradient-to-br from-[#FEF08A] to-[#D97706]', 
                          'w-11 h-11 rounded-full flex items-center justify-center border-2 border-[#FDE047]/50 shadow-[0_10px_20px_rgba(0,0,0,0.9)] relative z-20 bg-gradient-to-br from-[#FEF08A] to-[#D97706]')
content = content.replace('w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-gradient-to-br from-[#FDE047] to-[#B45309]',
                          'w-9 h-9 rounded-full border border-white/30 flex items-center justify-center bg-gradient-to-br from-[#FDE047] to-[#B45309]')
content = content.replace('text-3xl drop-shadow-md', 'text-2xl drop-shadow-md')

# Eth/Tether (Sides)
content = content.replace('w-12 h-12 rounded-full flex items-center justify-center border-2', 'w-9 h-9 rounded-full flex items-center justify-center border-2')
content = content.replace('w-10 h-10 rounded-full border border-white/20', 'w-7 h-7 rounded-full border border-white/20')
content = content.replace('text-xl drop-shadow-md', 'text-sm drop-shadow-md')
content = content.replace('translate-x-3', 'translate-x-2.5')
content = content.replace('-translate-x-3', '-translate-x-2.5')

# 6. Credit Card
content = content.replace('text-2xl drop-shadow', 'text-xl drop-shadow') # VISA
content = content.replace('w-7 h-7 rounded-full', 'w-5 h-5 rounded-full') # Circles
content = content.replace('-space-x-3', '-space-x-2') # Circle overlap
content = content.replace('gap-3', 'gap-2') # Gap between VISA and 7890
content = content.replace('text-[12px] font-mono', 'text-[10px] font-mono') # 7890

# 7. Bottom Button
content = content.replace('py-2.5 rounded-xl text-white font-black text-[13px]', 'py-1.5 rounded-lg text-white font-black text-[11px]')
content = content.replace('py-2.5 rounded-xl border text-[11px]', 'py-1.5 rounded-lg border text-[10px]')


with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
