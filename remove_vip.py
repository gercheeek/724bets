import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'r') as f:
    content = f.read()

# Replace the VIP Dashboard section we moved earlier
# The block looks like:
#                {/* VIP Dashboard & Hero Banner (Moved here) */}
#                <div className="w-full mt-8 mb-6">
#                   <VIPHeroBanner />
#                </div>
#
# Let's find and remove it using regex.

pattern = r'\s*\{/\* VIP Dashboard & Hero Banner \(Moved here\) \*/\}\s*<div className="w-full mt-8 mb-6">\s*<VIPHeroBanner />\s*</div>'
content = re.sub(pattern, '', content)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'w') as f:
    f.write(content)
