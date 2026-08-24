import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Change grid-cols-3 to grid-cols-6 for the quick amounts
content = content.replace(
    '<div className="grid grid-cols-3 gap-2.5 mt-3">',
    '<div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">'
)

# Optional: ensure text fits by making it a bit smaller on smaller screens if needed.
content = content.replace(
    'className="py-1.5 rounded-lg text-white/70 font-bold text-[11px] transition-all hover:text-white hover:scale-105 active:scale-95"',
    'className="py-1.5 rounded-lg text-white/70 font-bold text-[10px] sm:text-[11px] transition-all hover:text-white hover:scale-105 active:scale-95"'
)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
