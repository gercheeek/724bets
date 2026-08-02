import os
import json
import time
from playwright.sync_api import sync_playwright

def scrape_egt_list():
    urls = [
        "https://slotra.com/casino/provider/egt-digital",
        "https://slotra.com/casino/provider/amusnet"
    ]
    
    games_dict = {}
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        for url in urls:
            try:
                print(f"\n{url} kazınıyor...")
                page.goto(url, wait_until="commit", timeout=60000)
                time.sleep(4)
                
                initial_count = len(games_dict)
                
                while True:
                    cards = page.query_selector_all("a[href^='/game/']")
                    for card in cards:
                        href = card.get_attribute("href")
                        title_elem = card.query_selector("img")
                        if href and title_elem:
                            if href not in games_dict:
                                full_link = f"https://slotra.com{href}" if href.startswith("/") else href
                                title = title_elem.get_attribute("alt") or title_elem.get_attribute("title") or ""
                                img_src = title_elem.get_attribute("src") or ""
                                game_slug = href.split("/")[-1]
                                provider = "EGT Digital" if "egt-digital" in url else "Amusnet"
                                
                                games_dict[href] = {
                                    "title": title,
                                    "slug": game_slug,
                                    "provider": provider,
                                    "original_link": full_link,
                                    "img_src": img_src
                                }

                    if len(games_dict) - initial_count >= 100:
                        print(f"Bu sağlayıcı için yeterli sayıya ulaşıldı.")
                        break

                    # Scroll
                    page.evaluate("window.scrollBy(0, 800);")
                    time.sleep(1.5)
                    
                    new_height = page.evaluate("document.body.scrollHeight")
                    current_scroll = page.evaluate("window.scrollY + window.innerHeight")
                    
                    if current_scroll >= new_height:
                        time.sleep(3)
                        final_height = page.evaluate("document.body.scrollHeight")
                        if current_scroll >= final_height:
                            print(f"Sayfanın sonuna ulaşıldı.")
                            break

            except Exception as e:
                print(f"[HATA] {url} sayfasında hata: {e}")

        browser.close()

    games_data = list(games_dict.values())
    output_path = os.path.join("public", "egt_raw.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(games_data, f, ensure_ascii=False, indent=2)
        
    print(f"\nToplam {len(games_data)} EGT/Amusnet oyunu bulundu ve '{output_path}' dosyasına kaydedildi.")

if __name__ == "__main__":
    scrape_egt_list()
