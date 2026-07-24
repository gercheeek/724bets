import re

def update_guest_landing():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
        content = f.read()

    # The block to remove is:
    # {/* Players count */}
    # <div className="block mt-1 font-mono font-bold text-[#ff00ff] text-[10px] sm:text-xs flex items-center gap-2 bg-black/40 px-2 py-1 border-l-2 border-[#ff00ff]">
    #    <ActivePlayersCounter type="casino" />
    # </div>
    # 
    # Or something similar. I'll just use a regex to match the Players count div inside GuestLanding.
    
    target_pattern = r'\{/\*\s*Players count\s*\*/\}.*?</ActivePlayersCounter>\s*</div>'
    content = re.sub(target_pattern, '', content, flags=re.DOTALL)
    
    # Also I need to check if there are other ActivePlayersCounter inside that specific block that I might have missed. 
    # Wait, earlier I might not have added {/* Players count */} if it was the older one, but in my premium script I did add:
    # {/* Players count */}
    # <div className="block mt-1 font-mono font-bold text-[#ff00ff] text-[10px] sm:text-xs flex items-center gap-2 bg-black/40 px-2 py-1 border-l-2 border-[#ff00ff]">
    #    <ActivePlayersCounter type="casino" />
    # </div>

    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
        f.write(content)

update_guest_landing()
print("Players count removed")

