import re

def update_guest_landing():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
        content = f.read()

    # The block to remove is:
    # {/* Players count */}
    # <div className="block mt-1 font-mono font-bold text-[#ff00ff] text-[10px] sm:text-xs flex items-center gap-2 bg-black/40 px-2 py-1 border-l-2 border-[#ff00ff]">
    #    <ActivePlayersCounter type="casino" />
    # </div>
    
    target_pattern = r'\{/\*\s*Players count\s*\*/\}\s*<div[^>]*>\s*<ActivePlayersCounter[^>]*/>\s*</div>'
    content = re.sub(target_pattern, '', content, flags=re.DOTALL)
    
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
        f.write(content)

update_guest_landing()
print("Players count removed")

