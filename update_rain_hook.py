import re

filename = 'hooks/useRainEvent.ts'
with open(filename, 'r') as f:
    content = f.read()

# Add userId parameter to hook
old_hook_def = "export const useRainEvent = () => {"
new_hook_def = "export const useRainEvent = (currentUserId?: string) => {"
content = content.replace(old_hook_def, new_hook_def)

# Check if already claimed during fetch
old_fetch = """      if (data) {
        setActiveEvent(data);
        calculateTimeLeft(data.ends_at);
        fetchParticipants(data.id);
      }"""

new_fetch = """      if (data) {
        const diff = Math.floor((new Date(data.ends_at).getTime() - Date.now()) / 1000);
        if (diff <= 0) {
            setActiveEvent(null);
            return;
        }
        
        setActiveEvent(data);
        setTimeLeft(diff);
        fetchParticipants(data.id);
        
        // Check if user already claimed
        if (currentUserId) {
            const { data: claimData } = await supabase
                .from('rain_participants')
                .select('id')
                .eq('event_id', data.id)
                .eq('user_id', currentUserId)
                .single();
            if (claimData) setHasClaimed(true);
        }
      }"""
content = content.replace(old_fetch, new_fetch)

# Fix the interval bug
old_timer = """  // Zamanlayıcı
  useEffect(() => {
    if (!activeEvent || !timeLeft) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
      if (timeLeft <= 1) setActiveEvent(null); // Süre bitti
    }, 1000);
    return () => clearInterval(interval);
  }, [activeEvent, timeLeft]);"""

new_timer = """  // Zamanlayıcı
  useEffect(() => {
    if (!activeEvent) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
            setActiveEvent(null); // Auto-hide when time is up
            return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeEvent]);"""
content = content.replace(old_timer, new_timer)

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated {filename}")
