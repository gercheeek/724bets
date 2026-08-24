import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Global Shrinking
content = content.replace('max-w-[800px]', 'max-w-[760px]')
content = content.replace('p-6 flex flex-col', 'p-4 sm:p-5 flex flex-col') # Less padding on mobile
content = content.replace('p-6 shrink-0', 'p-5 shrink-0') # Right panel
content = content.replace('mb-6 shrink-0', 'mb-5 shrink-0')
content = content.replace('mb-6 w-full', 'mb-5 w-full')
content = content.replace('space-y-6', 'space-y-5')
content = content.replace('py-2 rounded-lg text-[13px]', 'py-1.5 rounded-lg text-[13px]') # Tabs

# 2. Cards Container (MOBILE ADAPTATION)
# Replace the grid with a flex-scroll on mobile, grid on desktop
old_grid = "className={`grid gap-3 ${activeTab === 'deposit' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}"
new_grid = "className={`flex sm:grid gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x hide-scrollbar ${activeTab === 'deposit' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}"
content = content.replace(old_grid, new_grid)

# 3. Cards shrinking & Mobile Width
content = content.replace('min-h-[150px] w-full', 'min-h-[130px] shrink-0 w-[140px] sm:w-full snap-center sm:snap-align-none')
content = content.replace('p-4 rounded-[20px]', 'p-3 rounded-[16px]')

# Card internals shrinking
content = content.replace('my-auto py-3', 'my-auto py-2')
content = content.replace('w-10 h-10 text-white', 'w-8 h-8 text-white') # Bank icon
content = content.replace('text-[13px] font-black', 'text-[12px] font-black') # Title
content = content.replace('py-1.5 rounded-lg text-white font-black text-[11px]', 'py-1.5 rounded-md text-white font-black text-[10px]') # Selected Button
content = content.replace('py-1.5 rounded-lg border text-[10px]', 'py-1.5 rounded-md border text-[9px]') # Unselected Button

# Crypto Coins Shrink
content = content.replace('w-11 h-11 rounded-full', 'w-9 h-9 rounded-full')
content = content.replace('w-9 h-9 rounded-full', 'w-7 h-7 rounded-full')
content = content.replace('text-2xl drop-shadow-md', 'text-xl drop-shadow-md')
content = content.replace('w-7 h-7 rounded-full', 'w-6 h-6 rounded-full') # Sides inner
content = content.replace('text-sm drop-shadow-md', 'text-[10px] drop-shadow-md')

# Credit card shrink
content = content.replace('text-xl drop-shadow', 'text-lg drop-shadow')
content = content.replace('w-5 h-5 rounded-full', 'w-4 h-4 rounded-full')

# 4. Hide scrollbar utility class insertion (if not exists, just use inline styles or existing utilities)
# Actually, Tailwind doesn't have hide-scrollbar built-in usually, we can add inline style to the container
content = content.replace('hide-scrollbar', 'scrollbar-hide')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
