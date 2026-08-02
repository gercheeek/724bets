import os
import json
import time
from playwright.sync_api import sync_playwright

def scrape_missing_slots_iframes():
    json_path = os.path.join("public", "slots_missing.json")
    if not os.path.exists(json_path):
        print(f"HATA: {json_path} bulunamadı.")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        games = json.load(f)

    print(f"Toplam {len(games)} eksik slot oyununun iframe linkleri aranacak. İşlem başlıyor...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        print("Ana sayfaya gidiliyor (Cloudflare kontrolü)...")
        page.goto("https://slotra.com", wait_until="domcontentloaded", timeout=60000)
        time.sleep(5) 

        for i, game in enumerate(games):
            original_link = game.get("iframe_url")
            if not original_link:
                continue
                
            print(f"[{i+1}/{len(games)}] İşleniyor: {game['title']}")
            
            real_url = None
            
            def handle_request(request):
                nonlocal real_url
                url = request.url
                if ("entry?params" in url or "openGame.do" in url or "html5Game.do" in url or "ContainerLauncher" in url or "index.html?gameid=" in url or "static-launcher" in url or "gameid=" in url):
                    if "slotra.com" not in url:
                        real_url = url
                        
            page.on("request", handle_request)
            
            try:
                page.goto(original_link, wait_until="domcontentloaded", timeout=30000)
                time.sleep(4)
                
                if real_url:
                    print(f"  --> Bulundu (Network): {real_url[:80]}...")
                    game["real_iframe_url"] = real_url
                else:
                    iframes = page.query_selector_all("iframe")
                    for iframe in iframes:
                        src = iframe.get_attribute("src")
                        if src and "slotra.com" not in src:
                            real_url = src
                            break
                    
                    if real_url:
                        print(f"  --> Bulundu (DOM): {real_url[:80]}...")
                        game["real_iframe_url"] = real_url
                    else:
                        print("  --> BULUNAMADI")
                        game["real_iframe_url"] = "BULUNAMADI"
                    
            except Exception as e:
                print(f"  --> HATA: Sayfa yüklenemedi: {e}")
                game["real_iframe_url"] = "HATA"
                
            page.remove_listener("request", handle_request)
            time.sleep(2)

        output_path = os.path.join("public", "slots_missing_with_iframes.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(games, f, ensure_ascii=False, indent=2)
            
        print(f"\nİşlem tamamlandı! Sonuçlar '{output_path}' dosyasına kaydedildi.")
        browser.close()

if __name__ == "__main__":
    scrape_missing_slots_iframes()
