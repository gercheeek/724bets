import json

with open('maclar.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    markets = item.get('markets', [])
    if len(markets) > 10:
        print(f"Event ID: {item.get('id')} has {len(markets)} markets")
