import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Add overflow-hidden to the outer wrapper
old_wrapper = 'className="relative w-full rounded-[20px] p-[1px] group cursor-pointer shadow-[0_15px_40px_rgba(16,185,129,0.25)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)] transition-all duration-700 mt-2 mb-4"'
new_wrapper = 'className="relative w-full rounded-[20px] p-[1px] group cursor-pointer shadow-[0_15px_40px_rgba(16,185,129,0.25)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)] transition-all duration-700 mt-2 mb-4 overflow-hidden"'
content = content.replace(old_wrapper, new_wrapper)

# 2. Make the spinning divs larger and centered so they don't leave gaps at corners
old_spin1 = '<div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_270deg,#10B981_360deg)] animate-[spin_3s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity rounded-[20px]"></div>'
new_spin1 = '<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_270deg,#10B981_360deg)] animate-[spin_3s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity"></div>'
content = content.replace(old_spin1, new_spin1)

old_spin2 = '<div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0deg,transparent_270deg,#3B82F6_360deg)] animate-[spin_3s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity rounded-[20px]"></div>'
new_spin2 = '<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0deg,transparent_270deg,#3B82F6_360deg)] animate-[spin_3s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity"></div>'
content = content.replace(old_spin2, new_spin2)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)

print("Fixed the overflow glitch on the spinning border!")
