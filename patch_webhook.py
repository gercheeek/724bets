import re

filename = 'socket_server.cjs'
with open(filename, 'r') as f:
    content = f.read()

old_get_info = """        if (cmd === 'getPlayerInfo') {
            // Sadece bakiye sorgusu
            return res.json({ result: true, err_desc: "OK", err_code: 0, balance: user.balance });
        }"""

new_get_info = """        if (cmd === 'getPlayerInfo') {
            // Sadece bakiye sorgusu
            return res.json({ 
                result: true, 
                err_desc: "OK", 
                err_code: 0, 
                balance: user.balance,
                currency: "TRY",
                display_name: userId,
                gender: "male",
                country: "TR",
                player_id: userId
            });
        }"""

if old_get_info in content:
    content = content.replace(old_get_info, new_get_info)
    with open(filename, 'w') as f:
        f.write(content)
    print("Patched getPlayerInfo successfully!")
else:
    print("Could not find getPlayerInfo block to patch")
