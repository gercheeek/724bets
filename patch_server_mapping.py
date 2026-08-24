import re

filename = 'socket_server.cjs'
with open(filename, 'r') as f:
    content = f.read()

# Update the game mapping logic for MGCAPI
old_games_block = """        if (PROVIDERS.mgcapi) {
            const mgcGames = await mgcapi.getAllGames();
            allGames = allGames.concat(mgcGames || []);
        }"""

new_games_block = """        if (PROVIDERS.mgcapi) {
            const mgcGames = await mgcapi.getAllGames();
            if (mgcGames && Array.isArray(mgcGames)) {
                const mappedMgc = mgcGames.map(g => {
                    const isLive = g.game_type === 2 || g.provider_title.toLowerCase().includes('live'); // Tahmini type belirleme
                    return {
                        id: `${g.provider_code}-${g.id}`,
                        name: g.name,
                        provider: g.provider_title || g.uniq_provider,
                        type: isLive ? 'live' : 'slot',
                        imageUrl: g.image || g.background || '',
                        vendorCode: g.provider_code,
                        gameCode: g.id.toString(), // game_id for playGame
                        providerType: 'mgcapi'
                    };
                });
                allGames = allGames.concat(mappedMgc);
            }
        }"""

if old_games_block in content:
    content = content.replace(old_games_block, new_games_block)
    with open(filename, 'w') as f:
        f.write(content)
    print("MGCAPI mapping injected.")
else:
    print("Old block not found.")
