import re

filename = 'mgcapi.cjs'
with open(filename, 'r') as f:
    content = f.read()

old_if = """        if (Array.isArray(data)) {
            console.log(`[MGCAPI] Fetched ${data.length} games successfully.`);
            return data;
        } else if (data && data.status === 200 && data.data) {
            console.log(`[MGCAPI] Fetched ${data.data.length} games successfully.`);
            return data.data;
        } else {"""

new_if = """        if (Array.isArray(data)) {
            console.log(`[MGCAPI] Fetched ${data.length} games successfully.`);
            return data;
        } else if (data && data.status === 200 && data.data) {
            console.log(`[MGCAPI] Fetched ${data.data.length} games successfully.`);
            return data.data;
        } else if (data && data.games && Array.isArray(data.games)) {
            console.log(`[MGCAPI] Fetched ${data.games.length} games successfully.`);
            return data.games;
        } else {"""

if old_if in content:
    content = content.replace(old_if, new_if)
    with open(filename, 'w') as f:
        f.write(content)
    print("Patched mgcapi.cjs successfully!")
else:
    print("Could not find block to patch in mgcapi.cjs")
