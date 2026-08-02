import json
import os
import difflib

def merge_egt_data():
    with open("public/egt_current.json", "r", encoding="utf-8") as f:
        old_games = json.load(f)
        
    with open("public/jackpot_with_iframes.json", "r", encoding="utf-8") as f:
        new_games = json.load(f)
        
    # Create a mapping of simplified name to new image
    new_images = {}
    for ng in new_games:
        # e.g., "Game thumb - Inca Gold II" -> "inca gold ii"
        clean_title = ng["title"].replace("Game thumb - ", "").lower().strip()
        new_images[clean_title] = ng.get("image")
        
    fixed_games = []
    
    for game in old_games:
        # e.g., "Flaming Hot Extreme BL" -> "flaming hot extreme"
        name = game["name"].replace(" BL", "").lower().strip()
        
        # Try to find best match
        matches = difflib.get_close_matches(name, new_images.keys(), n=1, cutoff=0.8)
        
        if matches:
            game["new_img"] = new_images[matches[0]]
        else:
            game["new_img"] = game["img"] # Fallback to broken img
            
        # Fix the iframe URL
        if game.get("iframe"):
            game["new_iframe"] = game["iframe"].replace("fppcdn.courses", "fppcdn3.autos")
            
        fixed_games.append(game)
        
    with open("public/egt_fixed.json", "w", encoding="utf-8") as f:
        json.dump(fixed_games, f, ensure_ascii=False, indent=2)
        
    print(f"Fixed {len(fixed_games)} games.")

if __name__ == "__main__":
    merge_egt_data()
