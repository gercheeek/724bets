import json

with open('maclar.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Total items:", len(data))
# Let's see if any item has EventName or Team info inside Metadata or anywhere
for item in data[:10]:
    markets = item.get('markets', [])
    if markets:
        m = markets[0]
        meta = m.get('Metadata', {})
        print(f"ID: {item.get('id')}, Metadata: {meta}, ParticipantMapping: {m.get('ParticipantMapping')}")
