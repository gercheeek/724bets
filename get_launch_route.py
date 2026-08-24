import re

filename = 'socket_server.cjs'
with open(filename, 'r') as f:
    content = f.read()

start = content.find("app.post('/api/casino/launch'")
end = content.find("app.get('/api/casino/providers'", start)
print(content[start:end])
