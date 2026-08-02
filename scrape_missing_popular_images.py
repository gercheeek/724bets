import os
import json
import time
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

SAVE_DIR = "public/assets/slots/popular"

def setup_directory():
    if not os.path.exists(SAVE_DIR):
        os.makedirs(SAVE_DIR)
        print(f"[{SAVE_DIR}] klasörü oluşturuldu.")

def scrape_missing_popular_images():
    json_path = os.path.join("public", "slots_popular_missing.json")
    if not os.path.exists(json_path):
        print(f"HATA: {json_path} bulunamadı.")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        games = json.load(f)

    print(f"Toplam {len(games)} eksik oyunun resimleri indirilecek...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        
        for i, game in enumerate(games):
            img_url = game.get("image_url")
            if not img_url:
                continue
                
            if img_url.startswith("/"):
                img_url = "https://slotra.com" + img_url
                
            parsed = urlparse(img_url)
            filename = os.path.basename(parsed.path)
            if not filename.endswith(".avif"):
                filename += ".avif"
                
            filepath = os.path.join(SAVE_DIR, filename)
            game["image"] = f"/assets/slots/popular/{filename}"
            
            if not os.path.exists(filepath):
                try:
                    print(f"[{i+1}/{len(games)}] İndiriliyor: {filename}")
                    res = context.request.get(img_url)
                    if res.ok:
                        body = res.body()
                        with open(filepath, "wb") as f:
                            f.write(body)
                except Exception as e:
                    print(f"[HATA] {img_url} indirilemedi: {e}")
            else:
                print(f"[{i+1}/{len(games)}] Zaten var, atlandı: {filename}")

        # Update JSON with local image paths
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(games, f, ensure_ascii=False, indent=2)
            
        print("Tüm resimler başarıyla tamamlandı.")
        browser.close()

if __name__ == "__main__":
    setup_directory()
    scrape_missing_popular_images()
