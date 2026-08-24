with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Make the info box slightly brighter
content = content.replace('backgroundColor: `${selectedMethod?.theme?.color}10`', 'backgroundColor: `${selectedMethod?.theme?.color}15`')
content = content.replace('borderColor: `${selectedMethod?.theme?.color}30`', 'borderColor: `${selectedMethod?.theme?.color}40`')
content = content.replace('backgroundColor: `${selectedMethod?.theme?.color}20`', 'backgroundColor: `${selectedMethod?.theme?.color}30`')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
