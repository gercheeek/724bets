import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# 1. Hero Section Scaling
content = content.replace(
    'min-h-[300px] md:min-h-[400px]',
    'min-h-[200px] md:min-h-[280px] lg:min-h-[320px]'
)
content = content.replace(
    'text-[32px] sm:text-[40px] lg:text-[56px]',
    'text-[24px] sm:text-[32px] lg:text-[44px]'
)
content = content.replace(
    'text-sm md:text-lg font-medium max-w-[600px]',
    'text-xs md:text-base font-medium max-w-[600px]'
)
content = content.replace(
    'px-10 py-4 bg-gradient-to-r',
    'px-8 py-3 bg-gradient-to-r'
)

# 2. Category Cards Scaling
content = content.replace(
    'h-[320px] md:h-[380px]',
    'h-[200px] md:h-[240px] lg:h-[260px]'
)
content = content.replace(
    'text-[26px] xl:text-[32px] 2xl:text-[36px]',
    'text-[20px] md:text-[24px] lg:text-[26px] xl:text-[28px]'
)
content = content.replace(
    'text-xs lg:text-sm font-medium',
    'text-[10px] md:text-xs font-medium'
)
content = content.replace(
    'w-10 h-10 xl:w-12 xl:h-12',
    'w-8 h-8 md:w-10 md:h-10'
)
content = content.replace(
    'px-4 py-2',
    'px-3 py-1.5'
)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)
