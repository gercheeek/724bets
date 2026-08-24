import re

filename = 'hooks/useRainEvent.ts'
with open(filename, 'r') as f:
    content = f.read()

# When fetching active event, check localStorage FIRST
old_fetch = """        setActiveEvent(data);
        setTimeLeft(diff);
        fetchParticipants(data.id);
        
        // Check if user already claimed
        if (currentUserId && currentUserId !== 'guest') {"""

new_fetch = """        setActiveEvent(data);
        setTimeLeft(diff);
        fetchParticipants(data.id);
        
        // Check local storage for instant frontend persistence
        if (localStorage.getItem('rain_claimed_' + data.id) === 'true') {
            setHasClaimed(true);
        } else if (currentUserId && currentUserId !== 'guest') {"""

content = content.replace(old_fetch, new_fetch)

# When claiming successfully, set localStorage
old_claim = """      if (error) throw error;
      setHasClaimed(true);"""

new_claim = """      if (error) throw error;
      setHasClaimed(true);
      localStorage.setItem('rain_claimed_' + activeEvent.id, 'true');"""

content = content.replace(old_claim, new_claim)

# Also fix the realtime handler so it doesn't reset hasClaimed if localStorage says true
old_realtime = """        if (newEvent.status === 'active') {
          setActiveEvent(prev => {
            if (!prev || prev.id !== newEvent.id) {
               setHasClaimed(false);
            }
            return newEvent;
          });"""

new_realtime = """        if (newEvent.status === 'active') {
          setActiveEvent(prev => {
            if (!prev || prev.id !== newEvent.id) {
               if (localStorage.getItem('rain_claimed_' + newEvent.id) === 'true') {
                   setHasClaimed(true);
               } else {
                   setHasClaimed(false);
               }
            }
            return newEvent;
          });"""

content = content.replace(old_realtime, new_realtime)

with open(filename, 'w') as f:
    f.write(content)
print("Updated useRainEvent with localStorage persistence")
