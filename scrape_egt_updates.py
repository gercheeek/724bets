import os
import json
import time
import urllib.parse
from playwright.sync_api import sync_playwright

def scrape_egt_updates():
    json_path = os.path.join("public", "egt_current.json")
    with open(json_path, "r", encoding="utf-8") as f:
        games = json.load(f)
        
    print(f"Toplam {len(games)} EGT oyunu güncellenmek için taranacak...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        for i, game in enumerate(games):
            name = game["name"]
            # To speed up, we can clean up the name if it has "BL" at the end (Bell Link)
            search_name = name.replace(" BL", "")
            url = f"https://slotra.com/casino/search?q={urllib.parse.quote(search_name)}"
            
            print(f"[{i+1}/{len(games)}] Aranıyor: {name}...")
            
            try:
                page.goto(url, wait_until="commit", timeout=30000)
                time.sleep(2)
                
                card = page.query_selector("a[href^='/game/']")
                if card:
                    href = card.get_attribute("href")
                    img_elem = card.query_selector("img")
                    img_src = img_elem.get_attribute("src") if img_elem else None
                    
                    full_link = f"https://slotra.com{href}" if href.startswith("/") else href
                    
                    game["new_img"] = img_src
                    game["original_link"] = full_link
                    print(f"   -> Bulundu: {full_link}")
                else:
                    print("   -> BULUNAMADI")
            except Exception as e:
                print(f"   -> HATA: {e}")
                
        browser.close()

    output_path = os.path.join("public", "egt_updated.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(games, f, ensure_ascii=False, indent=2)
        
    print(f"\nİşlem bitti! Sonuçlar {output_path} dosyasına kaydedildi.")

if __name__ == "__main__":
    scrape_egt_updates()
