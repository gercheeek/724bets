import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# Scale down heights
content = content.replace('h-[320px] md:h-[380px]', 'h-[200px] md:h-[240px]')

# Scale down text sizes
content = content.replace("text-3xl md:text-4xl lg:text-5xl font-extrabold font-['Outfit'] uppercase tracking-[0.1em]", "text-xl md:text-2xl lg:text-3xl font-extrabold font-['Outfit'] uppercase tracking-[0.05em]")

# Scale down padding
content = content.replace('p-6 xl:p-8 flex flex-col justify-end', 'p-4 xl:p-5 flex flex-col justify-end')

# Scale down sub-text
content = content.replace('text-xs lg:text-sm font-medium', 'text-[10px] lg:text-xs font-medium')

# Scale down icons
content = content.replace('w-12 h-12 lg:w-14 lg:h-14 flex items-center', 'w-8 h-8 lg:w-10 lg:h-10 flex items-center')
content = content.replace('w-4 h-4 lg:w-5 lg:h-5 text-white', 'w-3 h-3 lg:w-4 lg:h-4 text-white')

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)
