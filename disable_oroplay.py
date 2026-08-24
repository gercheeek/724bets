import re

filename = 'socket_server.cjs'
with open(filename, 'r') as f:
    content = f.read()

# Add config object at the top after requires
config_str = """
// --- PROVIDER CONFIGURATION ---
// Set to false to instantly hide games from frontend
const PROVIDERS = {
    oroplay: false,
    mgcapi: false // (For future integration)
};
// ------------------------------
"""

# Inject before the /api/casino/games route definition if not already there
if "const PROVIDERS" not in content:
    content = content.replace("app.get('/api/casino/games'", config_str + "\napp.get('/api/casino/games'")

# Modify /api/casino/games route
old_route = """app.get('/api/casino/games', async (req, res) => {
    try {
        const games = await oroplay.getAllGames();
        res.json({ success: true, games: games || [] });
    } catch (err) {
        logError('Error fetching casino games from OroPlay', err);
        res.json({ success: true, games: [] });
    }
});"""

new_route = """app.get('/api/casino/games', async (req, res) => {
    try {
        let allGames = [];
        
        // Sadece açık olan API'lerden oyunları çek
        if (PROVIDERS.oroplay) {
            const oroplayGames = await oroplay.getAllGames();
            allGames = allGames.concat(oroplayGames || []);
        }
        
        res.json({ success: true, games: allGames });
    } catch (err) {
        logError('Error fetching casino games', err);
        res.json({ success: true, games: [] });
    }
});"""

if old_route in content:
    content = content.replace(old_route, new_route)

with open(filename, 'w') as f:
    f.write(content)

print("Updated socket_server.cjs")
