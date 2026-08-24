import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Tabs
content = content.replace('border border-white/[0.08] backdrop-blur-md shrink-0', 'backdrop-blur-md shrink-0')

# Info box
content = content.replace('border flex gap-4', 'flex gap-4')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
