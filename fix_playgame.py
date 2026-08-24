import re

filename = 'mgcapi.cjs'
with open(filename, 'r') as f:
    content = f.read()

old_if = """        if (response.data && response.data.status === 200 && response.data.data && response.data.data.url) {
            return response.data.data.url;
        } else {"""

new_if = """        if (response.data && response.data.result === true && response.data.url) {
            return response.data.url;
        } else if (response.data && response.data.status === 200 && response.data.data && response.data.data.url) {
            return response.data.data.url;
        } else {"""

if old_if in content:
    content = content.replace(old_if, new_if)
    with open(filename, 'w') as f:
        f.write(content)
    print("Patched playGame response check!")
else:
    print("Could not find block to patch in playGame")
