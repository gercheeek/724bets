import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'r') as f:
    content = f.read()

# I want to find the message mapping loop
# Usually it starts around "messages.map((msg"

start_idx = content.find('messages.map((msg')
if start_idx != -1:
    end_idx = content.find('<div className="p-4', start_idx)
    print(content[start_idx:start_idx+1500])

