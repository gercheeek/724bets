import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'r') as f:
    content = f.read()

# First, remove it from line 78
# Pattern:
#                {/* VIP Dashboard & Hero Banner */}
#                <div className="w-full my-4">
#                   <VIPHeroBanner />
#                   
#                   <div className="mt-8 relative z-[100] transition-all duration-500 animate-fade-in">
#
# Actually, I can just replace the specific text:
content = content.replace('                   <VIPHeroBanner />\n                   \n', '')

# Next, find where to insert it:
#                {/* 2-Column Grid: Terminal and Quests */}
#                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-4">
#
# Let's insert it before this.

insert_str = """
                {/* VIP Dashboard & Hero Banner (Moved here) */}
                <div className="w-full mt-8 mb-6">
                   <VIPHeroBanner />
                </div>

                {/* 2-Column Grid: Terminal and Quests */}
"""

content = content.replace('                {/* 2-Column Grid: Terminal and Quests */}', insert_str)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'w') as f:
    f.write(content)
