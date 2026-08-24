import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Increase max-width to let the design breathe
content = content.replace('max-w-[600px]', 'max-w-[680px]')

# Increase horizontal padding so the extra width becomes "breathing room" (negative space) rather than just stretching elements
content = content.replace('className="flex-1 min-h-0 p-4 sm:p-5 flex flex-col relative z-10"', 'className="flex-1 min-h-0 p-5 sm:px-8 sm:py-6 flex flex-col relative z-10"')

# Also let's give the footer the same horizontal breathing room
content = content.replace('px-4 sm:px-6 py-2.5 flex flex-col', 'px-5 sm:px-8 py-3 flex flex-col')
content = content.replace('px-4 sm:px-6 py-4 flex flex-col sm:flex-row', 'px-5 sm:px-8 py-4 flex flex-col sm:flex-row')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)

