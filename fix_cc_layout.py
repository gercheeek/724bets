import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Increase modal height to fit content without scrolling
content = content.replace('sm:h-[680px]', 'sm:h-[720px]')

# 2. Compact 3D Cards slightly to save space
content = content.replace('minHeight: \'130px\'', 'minHeight: \'110px\'')
content = content.replace('className="grid grid-cols-3 gap-3 mb-6 shrink-0"', 'className="grid grid-cols-3 gap-3 mb-4 shrink-0"')
content = content.replace('h-[45px]', 'h-[36px]') # shrink icon wrappers slightly

# 3. Brighten inputs and reduce padding for compactness
old_input = 'py-3.5 px-4 rounded-xl text-white text-[13px] font-medium outline-none border border-white/5 focus:border-[#8B5CF6]/50 bg-[#131927] placeholder:text-white/20'
new_input = 'py-2.5 px-3 rounded-lg text-white text-[13px] font-medium outline-none border border-white/10 focus:border-[#8B5CF6]/50 bg-[#182030] placeholder:text-white/30 transition-all hover:bg-[#1C263A]'
content = content.replace(old_input, new_input)

# Same for mono inputs (Card number, Expiry, CVC)
old_mono = 'py-3.5 px-4 rounded-xl text-white text-[14px] font-mono outline-none border border-white/5 focus:border-[#8B5CF6]/50 bg-[#131927] tracking-widest placeholder:text-white/20'
new_mono = 'py-2.5 px-3 rounded-lg text-white text-[14px] font-mono outline-none border border-white/10 focus:border-[#8B5CF6]/50 bg-[#182030] tracking-widest placeholder:text-white/30 transition-all hover:bg-[#1C263A]'
content = content.replace(old_mono, new_mono)

# Also fix the general forms (crypto/bank)
generic_input = 'py-3.5 px-4 rounded-xl text-white text-[13px] font-medium outline-none border border-white/5 focus:border-[#10B981]/50 bg-[#131927]'
new_generic = 'py-2.5 px-3 rounded-lg text-white text-[13px] font-medium outline-none border border-white/10 focus:border-[#10B981]/50 bg-[#182030] transition-all hover:bg-[#1C263A]'
content = content.replace(generic_input, new_generic)

generic_mono = 'py-3.5 px-4 rounded-xl text-white text-[13px] font-mono outline-none border border-white/5 focus:border-[#10B981]/50 bg-[#131927]'
new_generic_mono = 'py-2.5 px-3 rounded-lg text-white text-[13px] font-mono outline-none border border-white/10 focus:border-[#10B981]/50 bg-[#182030] transition-all hover:bg-[#1C263A]'
content = content.replace(generic_mono, new_generic_mono)

# 4. Compact the Amount Section
old_amt_container = 'className="mt-2 bg-[#1A2436] p-4 rounded-2xl border border-white/5"'
new_amt_container = 'className="mt-3 bg-[#1A2436] p-3 rounded-xl border border-white/5 shadow-inner"'
content = content.replace(old_amt_container, new_amt_container)

old_amt_input = 'className="w-full bg-transparent py-3 px-2 text-white text-[18px] font-black outline-none"'
new_amt_input = 'className="w-full bg-transparent py-2.5 px-2 text-white text-[18px] font-black outline-none"'
content = content.replace(old_amt_input, new_amt_input)

# Quick amounts shrink
content = content.replace('py-2 rounded-lg text-[11px]', 'py-1.5 rounded-md text-[11px]')

# 5. Spacing between dynamic forms
content = content.replace('className="space-y-4 animate-in fade-in"', 'className="space-y-3 animate-in fade-in"')

# CustomSelect component padding
old_select = 'w-full py-3.5 px-4 rounded-xl text-white text-[13px] font-medium flex justify-between items-center cursor-pointer transition-all hover:ring-1 hover:ring-white/10'
new_select = 'w-full py-2.5 px-3 rounded-lg text-white text-[13px] font-medium flex justify-between items-center cursor-pointer transition-all border border-white/10 hover:border-[#10B981]/50 bg-[#182030] hover:bg-[#1C263A]'
content = content.replace(old_select, new_select)
content = content.replace("style={{ background: '#131927', border: '1px solid rgba(255,255,255,0.05)' }}", "") # Remove inline style to let classes work

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
