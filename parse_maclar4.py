import json

with open('maclar.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Group markets by LineTypeName
event = data[0]
markets = event.get('markets', [])
types = {}
for m in markets:
    m_type = m.get('MarketType', {}).get('LineTypeName', 'Other')
    if m_type not in types:
        types[m_type] = []
    types[m_type].append(m)

print(f"Total markets for event 1: {len(markets)}")
print("Categories:")
for k, v in types.items():
    print(f" - {k}: {len(v)} markets")
