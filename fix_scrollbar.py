import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Add inline style to hide scrollbar reliably
old_div = "className={`flex sm:grid gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x scrollbar-hide ${activeTab === 'deposit' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}"
new_div = "className={`flex sm:grid gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x ${activeTab === 'deposit' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}\n                                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}"

content = content.replace(old_div, new_div)

# Also ensure webkit scrollbar is hidden via a global class if possible, but inline is safer for now.

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
