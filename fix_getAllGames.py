import re

filename = 'mgcapi.cjs'
with open(filename, 'r') as f:
    content = f.read()

old_block = """        const resObj = await fetch(endpoint);
        const data = await resObj.json();
        const response = { data };
        
        if (response.data && response.data.status === 200 && response.data.data) {
            console.log(`[MGCAPI] Fetched ${response.data.data.length} games successfully.`);
            return response.data.data;
        } else {
            console.error('[MGCAPI] Failed to fetch games. API Response:', response.data);
            return [];
        }"""

new_block = """        const resObj = await fetch(endpoint);
        const data = await resObj.json();
        
        // MGCAPI returns an array directly on success, or an object with { error: true } on failure
        if (Array.isArray(data)) {
            console.log(`[MGCAPI] Fetched ${data.length} games successfully.`);
            return data;
        } else if (data && data.status === 200 && data.data) {
            console.log(`[MGCAPI] Fetched ${data.data.length} games successfully.`);
            return data.data;
        } else {
            console.error('[MGCAPI] Failed to fetch games. API Response:', data);
            return [];
        }"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open(filename, 'w') as f:
        f.write(content)
    print("Fixed getAllGames data extraction.")
else:
    print("Block not found!")
