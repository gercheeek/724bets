import json

try:
    with open('maclar.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print("Items:", len(data))
    for item in data[:5]:
        print(json.dumps(item)[:200])
except Exception as e:
    print(e)
