import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Increase Fixed Height slightly to give it room (650px -> 690px)
content = content.replace('sm:h-[650px]', 'sm:h-[690px]')

# 2. Tighten Header Spacing
content = content.replace('className="flex items-center justify-between mb-5 shrink-0"', 'className="flex items-center justify-between mb-3 shrink-0"')

# 3. Tighten Tabs Spacing
content = content.replace('className="w-full bg-[#1A1F2E] p-1 rounded-xl flex gap-1 mb-5 shrink-0"', 'className="w-full bg-[#1A1F2E] p-1 rounded-xl flex gap-1 mb-3 shrink-0"')

# 4. Tighten Section Spacing (space-y-3 -> space-y-2.5)
content = content.replace('className="animate-in fade-in duration-300 flex flex-col space-y-3"', 'className="animate-in fade-in duration-300 flex flex-col space-y-2"')

# 5. Tighten the Info Alert (Banka Havalesi Ile Guvenli Odeme)
content = content.replace('className="bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-xl p-4 flex gap-4 items-start"', 'className="bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-xl p-2.5 flex gap-3 items-center"')
# If it's items-center, it's more compact. Let's make text smaller too.
content = content.replace('text-[14px] font-bold mb-1', 'text-[12px] font-bold mb-0.5')
content = content.replace('text-[12px] leading-relaxed', 'text-[11px] leading-snug')

# 6. Tighten Footer
content = content.replace('py-4 flex flex-col', 'py-2.5 flex flex-col')

# 7. Make form labels even tighter margin
content = content.replace('mb-1.5 uppercase', 'mb-1 uppercase')
content = content.replace('mb-3 uppercase', 'mb-1.5 uppercase')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
