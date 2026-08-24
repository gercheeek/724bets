import re

filename = 'socket_server.cjs'
with open(filename, 'r') as f:
    content = f.read()

content = content.replace("imageUrl: g.image || g.background || '',", "image: g.image || g.background || '',")

with open(filename, 'w') as f:
    f.write(content)
print("Fixed!")
