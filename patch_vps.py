filename = 'update_vps.exp'
with open(filename, 'r') as f:
    content = f.read()

content = content.replace(
    "socket_server_vps.cjs socket_server.cjs oroplay.cjs",
    "socket_server_vps.cjs socket_server.cjs oroplay.cjs mgcapi.cjs"
)

with open(filename, 'w') as f:
    f.write(content)
print("update_vps.exp patched")
