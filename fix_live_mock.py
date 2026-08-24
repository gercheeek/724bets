import re

with open('contexts/BettingContext.tsx', 'r') as f:
    content = f.read()

old_state = "const [globalLiveMatches, setGlobalLiveMatches] = useState<any[]>([]);"
new_state = "const [globalLiveMatches, setGlobalLiveMatches] = useState<any[]>(MOCK_MATCHES.filter(m => m.isLive));"
content = content.replace(old_state, new_state)

with open('contexts/BettingContext.tsx', 'w') as f:
    f.write(content)

print("Injected live mock data!")
