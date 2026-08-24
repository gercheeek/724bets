import re

filename = 'mgcapi.cjs'
with open(filename, 'r') as f:
    content = f.read()

content = content.replace("const axios = require('axios');", "")

# Replace axios.get
content = content.replace(
    "const response = await axios.get(endpoint);",
    "const resObj = await fetch(endpoint);\n        const data = await resObj.json();\n        const response = { data };"
)

# Replace axios.post
content = content.replace(
    """const response = await axios.post(`${API_URL}/api/v1/playGame`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });""",
    """const resObj = await fetch(`${API_URL}/api/v1/playGame`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await resObj.json();
        const response = { data };"""
)

with open(filename, 'w') as f:
    f.write(content)
print("mgcapi.cjs updated to use native fetch")
