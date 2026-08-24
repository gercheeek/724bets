import re

filename = 'components/chat/RainEventBanner.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_call = "const { activeEvent, timeLeft, participantsCount, hasClaimed, claimRain } = useRainEvent();"
new_call = "const { activeEvent, timeLeft, participantsCount, hasClaimed, claimRain } = useRainEvent(currentUserId);"

content = content.replace(old_call, new_call)

with open(filename, 'w') as f:
    f.write(content)
print("Updated RainEventBanner hook call")
