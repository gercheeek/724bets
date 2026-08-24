import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# The main modal container is the second div (first is the backdrop)
old_modal_container = 'className="relative w-full max-w-[760px] bg-[#0F1423] rounded-2xl flex flex-col lg:flex-row overflow-hidden border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.8)]"'
new_modal_container = 'className="relative w-full max-w-[760px] h-[90vh] sm:h-[650px] bg-[#0F1423] rounded-2xl flex flex-col lg:flex-row overflow-hidden border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.8)]"'

content = content.replace(old_modal_container, new_modal_container)

# Ensure left panel takes full height
content = content.replace('className="p-4 sm:p-5 flex flex-col w-full min-w-0 bg-[#0F1423] relative z-20"', 'className="p-4 sm:p-5 flex flex-col h-full w-full min-w-0 bg-[#0F1423] relative z-20"')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
