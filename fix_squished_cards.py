import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Expand the modal slightly to give more breathing room
content = content.replace('max-w-[880px]', 'max-w-[950px]')

# 2. Reduce the gap between cards from gap-4 to gap-3
content = content.replace('grid gap-4', 'grid gap-3')

# 3. Reduce internal padding of the cards from p-3.5 to p-3 so content isn't hitting walls
content = content.replace('p-3.5 rounded-[14px]', 'p-3 rounded-[14px]')

# 4. Make the text slightly tighter so it doesn't wrap
content = content.replace('text-[14px] font-bold mb-1 tracking-wide', 'text-[13px] font-bold mb-1 tracking-normal')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
