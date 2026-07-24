import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# Remove first instance
content = content.replace('            {/* POPULAR LIVE WIDGET */}\n            <PopularLiveWidget onNavigate={onViewChange} />', '')

# Remove second instance
content = content.replace('''                {/* POPULAR LIVE WIDGET */}
                <div className="mt-8">
                    <PopularLiveWidget onNavigate={onViewChange} />
                </div>''', '')

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)
