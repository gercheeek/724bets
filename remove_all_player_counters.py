import re

def update_guest_landing():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
        content = f.read()

    # Remove all <div className="block"><ActivePlayersCounter ... /></div> and similar
    content = re.sub(r'<div className="block.*?">\s*<ActivePlayersCounter[^>]*/>\s*</div>', '', content, flags=re.DOTALL)
    
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
        f.write(content)

update_guest_landing()
print("All player counters removed from guest landing")

