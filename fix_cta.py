import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# CTA Button shrink
content = content.replace('className="w-full rounded-lg text-white font-bold text-[15px] py-3 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"', 'className="w-full rounded-lg text-white font-bold text-[14px] py-2 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"')
content = content.replace('<div className="pt-2 pb-2">', '<div className="pt-1 pb-1">')

# Amount Input Shrink
content = content.replace('py-2 px-3 text-white text-[20px]', 'py-1.5 px-3 text-white text-[18px]')
content = content.replace('pl-3 text-base', 'pl-2.5 text-sm')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
