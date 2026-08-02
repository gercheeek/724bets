import os
import json
import time
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

def scrape_hold_and_win_games():
    url = "https://slotra.com/casino/hold-and-win"
    print(f"{url} adresindeki TÜM oyun bilgileri kazınıyor...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        try:
            page.goto(url, wait_until="commit", timeout=90000)
            time.sleep(5)
            print("Sayfa yüklendi, tüm oyunların yüklenmesi için sayfa sonuna kadar kaydırılıyor...")

            games_dict = {}

            while True:
                # DOM'daki oyun kartlarını topla
                cards = page.query_selector_all("a[href^='/game/']")
                for i, card in enumerate(cards):
                    href = card.get_attribute("href")
                    title_elem = card.query_selector("img")
                    if href and title_elem:
                        if href not in games_dict:
                            full_link = f"https://slotra.com{href}" if href.startswith("/") else href
                            title = title_elem.get_attribute("alt") or title_elem.get_attribute("title") or f"Oyun {len(games_dict)+1}"
                            img_src = title_elem.get_attribute("src")
                            
                            game_slug = href.split("/")[-1]
                            iframe_url = f"https://slotra.com/game-iframe/{game_slug}?gId0={game_slug}"
                            
                            local_img_path = ""
                            if img_src:
                                parsed = urlparse(img_src)
                                filename = os.path.basename(parsed.path)
                                if not filename.endswith(".avif"):
                                    filename += ".avif"
                                local_img_path = f"/assets/slots/hold_and_win/{filename}"
                            
                            games_dict[href] = {
                                "id": f"hold_win_{len(games_dict)}",
                                "title": title,
                                "provider": "Various",
                                "image": local_img_path,
                                "original_link": full_link,
                                "iframe_url": iframe_url
                            }

                page.evaluate("window.scrollBy(0, 800);")
                time.sleep(1.5)
                
                new_height = page.evaluate("document.body.scrollHeight")
                current_scroll = page.evaluate("window.scrollY + window.innerHeight")
                
                if current_scroll >= new_height:
                    time.sleep(3)
                    final_height = page.evaluate("document.body.scrollHeight")
                    if current_scroll >= final_height:
                        print(f"Sayfanın sonuna ulaşıldı. Toplam {len(games_dict)} oyun toplandı.")
                        break

            games_data = list(games_dict.values())

            print(f"Toplam {len(games_data)} adet oyun bilgisi başarıyla çekildi!")
            
            output_path = os.path.join("public", "slots_hold_and_win.json")
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(games_data, f, ensure_ascii=False, indent=2)
                
            print(f"Sonuçlar '{output_path}' dosyasına kaydedildi.")
            
        except Exception as e:
            print(f"[HATA] Sorun oluştu: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    scrape_hold_and_win_games()
