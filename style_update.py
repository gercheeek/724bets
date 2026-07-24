import re

def update_styles(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Update .glass-panel definition if it exists
    content = content.replace(
        'background: rgba(10, 10, 14, 0.7);',
        'background: rgba(5, 7, 12, 0.85);'
    )
    content = content.replace(
        'box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);',
        'box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.02);'
    )

    # 2. Update rounded-2xl to rounded-3xl for major panels
    content = content.replace('rounded-2xl', 'rounded-3xl')

    # 3. Increase padding for whitespace
    content = content.replace('p-6 lg:p-8', 'p-8 lg:p-10')
    content = content.replace('p-5 lg:p-6', 'p-6 lg:p-8')
    content = content.replace('gap-6', 'gap-8')
    content = content.replace('gap-4', 'gap-5')

    # 4. Hierarchy: Reduce neon on non-CTA. 
    # The "Şanslı Biletini Seç" grid wrapper
    content = content.replace('bg-[#050508] backdrop-blur-xl', 'bg-[#030407]/90 backdrop-blur-2xl')
    
    with open(filepath, 'w') as f:
        f.write(content)

update_styles('/Users/alex/Desktop/7_24bets-landing-page/components/VIPRafflePromo.tsx')
update_styles('/Users/alex/Desktop/7_24bets-landing-page/components/RaffleView.tsx')
print("Styles updated successfully!")

