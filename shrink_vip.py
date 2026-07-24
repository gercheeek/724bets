import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/VIPHeroBanner.tsx', 'r') as f:
    content = f.read()

# Container paddings
content = content.replace('p-4 md:p-8', 'p-2 md:p-4')
content = content.replace('gap-6 md:gap-10', 'gap-3 md:gap-5')

# Inner container paddings
content = content.replace('p-6 md:p-8', 'p-3 md:p-4')

# Margins and gaps
content = content.replace('mb-8', 'mb-4')
content = content.replace('gap-5', 'gap-2')
content = content.replace('mt-10', 'mt-4')
content = content.replace('pt-6', 'pt-3')
content = content.replace('mt-4', 'mt-2')
content = content.replace('mb-3', 'mb-1')
content = content.replace('pb-4', 'pb-2')

# Button paddings
content = content.replace('px-6 py-4', 'px-3 py-2')

# Progress bar height
content = content.replace('h-3 md:h-4', 'h-2')

with open('/Users/alex/Desktop/7_24bets-landing-page/components/VIPHeroBanner.tsx', 'w') as f:
    f.write(content)
