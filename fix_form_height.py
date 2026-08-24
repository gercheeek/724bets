import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Shrink all form inputs and selects
content = content.replace('py-2.5 px-3 rounded-xl', 'py-1.5 px-3 rounded-lg')
content = content.replace('py-2.5 px-3', 'py-1.5 px-3')
content = content.replace('rounded-xl', 'rounded-lg') # make everything a bit more compact

# Keep modal container rounded-2xl
content = content.replace('rounded-lg flex flex-col md:flex-row overflow-hidden', 'rounded-2xl flex flex-col md:flex-row overflow-hidden')
content = content.replace('rounded-lg flex flex-col overflow-hidden', 'rounded-2xl flex flex-col overflow-hidden')
# Keep the 3D cards rounded-[20px]
content = content.replace('p-4 rounded-[20px]', 'p-4 rounded-[16px]')

# Form labels
content = content.replace('text-[12px] font-bold tracking-widest mb-2', 'text-[10px] font-bold tracking-widest mb-1.5')

# Spacing between main sections
content = content.replace('space-y-5', 'space-y-3')

# Spacing inside withdrawal forms
content = content.replace('space-y-4', 'space-y-2.5')

# Bottom button
content = content.replace('py-3.5 transition-transform text-white font-black text-[15px]', 'py-2.5 transition-transform text-white font-black text-[14px]')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
