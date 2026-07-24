import re

def update_guest_landing():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
        content = f.read()

    # The text to find is: <span className="animate-pulse">▶</span> 
    content = content.replace('<span className="animate-pulse">▶</span> \n                           ', '')
    content = content.replace('<span className="animate-pulse">▶</span> ', '')

    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
        f.write(content)

update_guest_landing()
print("GuestLanding cursor removed")

