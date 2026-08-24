import re

filename = 'contexts/GameContext.tsx'
with open(filename, 'r') as f:
    content = f.read()

# I will replace everything from 'const fetchGames = async () => {' to 'fetchGames();'
start = content.find('const fetchGames = async () => {')
end = content.find('fetchGames();')

if start != -1 and end != -1:
    before = content[:start]
    after = content[end:]
    
    new_fetch = """const fetchGames = async () => {
      try {
        const res = await fetch('/api/casino/games');
        if (!res.ok) throw new Error('Failed to fetch games');
        const data = await res.json();
        
        if (isMounted) {
          if (data.success && Array.isArray(data.games)) {
            setGames(mapGames(data.games));
            setError(null);
          } else {
            setGames([]);
            setError('API returned no games');
          }
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('GameContext fetch error:', err);
          setGames([]);
          setError(err.message || 'Fetch error');
          setIsLoading(false);
        }
      }
    };

    """
    with open(filename, 'w') as f:
        f.write(before + new_fetch + after)
    print("Fixed GameContext.tsx")
