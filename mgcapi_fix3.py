import re

filename = 'mgcapi.cjs'
with open(filename, 'r') as f:
    content = f.read()

# Change Math.floor(Date.now() / 1000).toString() to Date.now().toString()
content = content.replace(
    "const request_time = Math.floor(Date.now() / 1000).toString();",
    "const request_time = Date.now().toString();"
)

with open(filename, 'w') as f:
    f.write(content)
print("Updated request_time to milliseconds in mgcapi.cjs")
