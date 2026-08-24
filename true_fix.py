import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Main Modal Container (Set fixed height)
content = content.replace(
    'className="relative w-full max-w-[760px] flex flex-col md:flex-row rounded-2xl overflow-hidden z-10 bg-[#0F1423] shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/5"',
    'className="relative w-full max-w-[760px] h-[90vh] sm:h-[650px] flex flex-col md:flex-row rounded-2xl overflow-hidden z-10 bg-[#0F1423] shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/5"'
)

# 2. Left Panel (Force it to take remaining height, although flex-1 usually does it, let's be explicit if needed, actually flex-1 flex flex-col is enough if the parent has height)
content = content.replace(
    'className="flex-1 p-4 sm:p-5 flex flex-col relative z-10"',
    'className="flex-1 h-full p-4 sm:p-5 flex flex-col relative z-10"'
)

# 3. Right Panel (Make sure it stretches full height)
content = content.replace(
    'className="hidden lg:flex flex-col w-[230px] bg-[#121722] p-5 shrink-0"',
    'className="hidden lg:flex flex-col h-full w-[230px] bg-[#121722] p-5 shrink-0"'
)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
