import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/LimboView.tsx', 'r') as f:
    content = f.read()

# Shrink the massive multiplier font
content = content.replace('text-7xl md:text-9xl', 'text-5xl md:text-8xl lg:text-9xl')
content = content.replace('text-4xl md:text-6xl text-gray-400 ml-2', 'text-2xl md:text-5xl lg:text-6xl text-gray-400 ml-1 md:ml-2')

# Shrink the game frame padding on mobile
content = content.replace('p-4 md:p-12', 'p-2 md:p-8 lg:p-12')

# Add min-h for the game container to ensure it doesn't get squished too much, but don't force it to be huge
content = content.replace('h-full max-h-[700px]', 'min-h-[250px] md:min-h-[400px] h-full max-h-[700px]')

with open('/Users/alex/Desktop/7_24bets-landing-page/components/LimboView.tsx', 'w') as f:
    f.write(content)
