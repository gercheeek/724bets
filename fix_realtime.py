import re

filename = 'hooks/useRainEvent.ts'
with open(filename, 'r') as f:
    content = f.read()

# Fix the realtime subscription resetting hasClaimed
old_realtime = """        if (newEvent.status === 'active') {
          setActiveEvent(newEvent);
          setHasClaimed(false);
          calculateTimeLeft(newEvent.ends_at);
        } else {"""

new_realtime = """        if (newEvent.status === 'active') {
          setActiveEvent(prev => {
            if (!prev || prev.id !== newEvent.id) {
               setHasClaimed(false);
            }
            return newEvent;
          });
          calculateTimeLeft(newEvent.ends_at);
        } else {"""
content = content.replace(old_realtime, new_realtime)

with open(filename, 'w') as f:
    f.write(content)
print("Updated realtime logic")
