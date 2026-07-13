import json

with open('maclar.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

item = data[0]
def print_keys(obj, prefix=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            print(f"{prefix}{k}")
            if isinstance(v, (dict, list)):
                if len(prefix) < 4: # limit depth
                    print_keys(v, prefix + "  ")
    elif isinstance(obj, list) and len(obj) > 0:
        print_keys(obj[0], prefix + "  ")

print_keys(item)
