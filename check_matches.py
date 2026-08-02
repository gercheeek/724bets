import json

def check_matches():
    with open("public/egt_fixed.json", "r", encoding="utf-8") as f:
        games = json.load(f)
        
    matched = 0
    for g in games:
        if g.get("new_img") != g.get("img") and "zvrkntplm.com" not in g.get("new_img", ""):
            matched += 1
            
    print(f"Matched {matched} out of {len(games)} games.")

if __name__ == "__main__":
    check_matches()
