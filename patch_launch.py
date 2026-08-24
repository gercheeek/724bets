import re

filename = 'socket_server.cjs'
with open(filename, 'r') as f:
    content = f.read()

old_launch = """        const url = await oroplay.getLaunchUrl(vendorCode, gameCode, code);
        logInfo(`[Casino Launch] Success for ${code}: vendor=${vendorCode}, game=${gameCode}`);
        res.json({ success: true, launchUrl: url });"""

new_launch = """        let url = "";
        if (PROVIDERS.mgcapi) {
            url = await mgcapi.getLaunchUrl(vendorCode, gameCode, code);
        } else if (PROVIDERS.oroplay) {
            url = await oroplay.getLaunchUrl(vendorCode, gameCode, code);
        }
        logInfo(`[Casino Launch] Success for ${code}: vendor=${vendorCode}, game=${gameCode}`);
        res.json({ success: true, launchUrl: url });"""

if old_launch in content:
    content = content.replace(old_launch, new_launch)
    with open(filename, 'w') as f:
        f.write(content)
    print("Launch logic patched")
else:
    print("Not found")
