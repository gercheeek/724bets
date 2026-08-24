import re

filename = 'contexts/GameContext.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Remove import
content = content.replace("import rawCasinoData from '../data/slotra_casino.json';\n", "")

# Remove fallback in fetchGames
# old: 
"""
        if (isMounted) {
          if (data.success && Array.isArray(data.games) && data.games.length > 0) {
            setGames(mapGames(data.games));
            setError(null);
          } else {
            // Fallback if success false or empty array
            console.warn('API returned no games, falling back to local JSON data.');
            setGames(mapGames(rawCasinoData));
            setError('Using local fallback data');
          }
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('GameContext fetch error, falling back to local JSON data:', err);
          setGames(mapGames(rawCasinoData));
          setError(err.message || 'Using local fallback data due to fetch error');
        }
      }
"""

new_try_catch = """
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
"""
content = re.sub(r'if \(isMounted\) \{\s*if \(data\.success.*?\}\s*\}', new_try_catch.strip(), content, flags=re.DOTALL)

with open(filename, 'w') as f:
    f.write(content)
print("Updated GameContext.tsx")
