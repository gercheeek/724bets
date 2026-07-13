import json

with open('maclar.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data[:2]:
    markets = item.get('markets', [])
    for m in markets:
        print(f"Market: {m.get('Name')}, Selections: {len(m.get('Selections', []))}")
