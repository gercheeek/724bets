import re

filename = 'socket_server.cjs'
with open(filename, 'r') as f:
    content = f.read()

# Replace the dummy callback with the real MGCAPI callback logic
old_callback = """// --- MGCAPI Callback Handler ---
app.post('/api/casino/callback/api', express.json(), async (req, res) => {
    console.log('[MGCAPI Callback] Received payload:', req.body);
    // Şimdilik test panelinden atılan isteklerin yapısını görmek için logluyoruz ve başarılı dönüyoruz.
    res.json({ status: 200, balance: 10000, currency: "TRY" }); // Geçici dummy yanıt
});"""

new_callback = """// --- MGCAPI Callback Handler ---
app.post('/api/casino/callback/api', express.json(), async (req, res) => {
    console.log('[MGCAPI Callback] Received:', req.body);
    
    try {
        const { cmd, player_token, betAmount, winAmount } = req.body;
        
        // Decode player_id from player_token (usually base64 encoded JSON)
        let userId = "testUser123"; // Fallback
        if (player_token) {
            try {
                const decoded = JSON.parse(Buffer.from(player_token, 'base64').toString('utf-8'));
                if (decoded.player_id) userId = decoded.player_id.toString();
            } catch (e) {
                console.error("[MGCAPI] Token decode error:", e);
            }
        }

        const user = await getOrCreateUser(userId);
        
        // Handling commands based on MGCAPI documentation
        if (cmd === 'getPlayerInfo') {
            // Sadece bakiye sorgusu
            return res.json({ result: true, err_desc: "OK", err_code: 0, balance: user.balance });
        } 
        else if (cmd === 'withdraw') {
            // Bahis - Bakiyeden düş
            const amount = parseFloat(betAmount || 0);
            if (user.balance < amount) {
                return res.json({ result: false, err_desc: "Insufficient balance", err_code: 1, balance: user.balance });
            }
            user.balance -= amount;
            return res.json({ result: true, err_desc: "OK", err_code: 0, balance: user.balance });
        } 
        else if (cmd === 'deposit') {
            // Kazanç - Bakiyeye ekle
            const amount = parseFloat(winAmount || 0);
            user.balance += amount;
            return res.json({ result: true, err_desc: "OK", err_code: 0, balance: user.balance });
        }
        else if (cmd === 'rollback') {
            // İptal (Bakiye değişikliği gerekirse işlem id'sine göre yapılır, şimdilik sadece OK dönüyoruz)
            return res.json({ result: true, err_desc: "OK", err_code: 0, balance: user.balance });
        }
        
        // Bilinmeyen komut
        return res.json({ result: false, err_desc: "Unknown command", err_code: 99, balance: user.balance });
        
    } catch (err) {
        console.error('[MGCAPI Callback Error]', err);
        res.json({ result: false, err_desc: "Internal error", err_code: 500, balance: 0 });
    }
});"""

if old_callback in content:
    content = content.replace(old_callback, new_callback)
    with open(filename, 'w') as f:
        f.write(content)
    print("MGCAPI Real Callback Handler injected.")
else:
    print("Old callback not found, maybe already injected.")
