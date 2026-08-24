import re

filename = 'socket_server.cjs'
with open(filename, 'r') as f:
    content = f.read()

# 1. Require mgcapi
if "const mgcapi =" not in content:
    content = content.replace("const oroplay = require('./oroplay.cjs');", "const oroplay = require('./oroplay.cjs');\nconst mgcapi = require('./mgcapi.cjs');")

# 2. Update PROVIDERS
content = content.replace(
    "mgcapi: false // (For future integration)",
    "mgcapi: true"
)

# 3. Add MGCAPI to /api/casino/games
old_games_block = """        if (PROVIDERS.oroplay) {
            const oroplayGames = await oroplay.getAllGames();
            allGames = allGames.concat(oroplayGames || []);
        }"""
new_games_block = """        if (PROVIDERS.oroplay) {
            const oroplayGames = await oroplay.getAllGames();
            allGames = allGames.concat(oroplayGames || []);
        }
        if (PROVIDERS.mgcapi) {
            const mgcGames = await mgcapi.getAllGames();
            allGames = allGames.concat(mgcGames || []);
        }"""
if "const mgcGames =" not in content:
    content = content.replace(old_games_block, new_games_block)

# 4. Add MGCAPI unified callback logger endpoint
callback_endpoint = """
// --- MGCAPI Callback Handler ---
app.post('/api/casino/callback/api', express.json(), async (req, res) => {
    console.log('[MGCAPI Callback] Received payload:', req.body);
    // Şimdilik test panelinden atılan isteklerin yapısını görmek için logluyoruz ve başarılı dönüyoruz.
    res.json({ status: 200, balance: 10000, currency: "TRY" }); // Geçici dummy yanıt
});
"""
if "MGCAPI Callback Handler" not in content:
    content = content + "\n" + callback_endpoint

with open(filename, 'w') as f:
    f.write(content)

print("socket_server.cjs patched for MGCAPI")
