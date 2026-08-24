import re

filename = 'components/LiveWinsMarquee.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Fix size and animation
# Old size w-[110px] h-[146px] -> new size w-[90px] h-[120px]
# Main div flex animate-[marquee_200s_linear_infinite] -> style={{ animation: 'marquee 150s linear infinite' }}

content = content.replace(
    'className="flex animate-[marquee_200s_linear_infinite] hover:[animation-play-state:paused]"',
    'className="flex hover:[animation-play-state:paused]" style={{ animation: \'marquee 80s linear infinite\' }}'
)

# Shrink wrappers
content = content.replace('w-[110px] mx-1.5', 'w-[85px] mx-1')
content = content.replace('w-[110px] h-[146px]', 'w-[85px] h-[114px]')

# Shrink text
content = content.replace('text-lg tracking-wider', 'text-[14px] tracking-wide leading-tight')
content = content.replace('text-[11px] font-black', 'text-[10px] font-black')
content = content.replace('max-w-[70px]', 'max-w-[60px]')
content = content.replace('text-[10px] font-semibold', 'text-[9px] font-semibold')
content = content.replace('w-2 h-2', 'w-1.5 h-1.5')

# Make the wrapper slightly shorter in padding
content = content.replace('py-4', 'py-3')

with open(filename, 'w') as f:
    f.write(content)
print("Updated LiveWinsMarquee sizes and animation")
