import os
import json
import time
from playwright.sync_api import sync_playwright

SAVE_FILE = "demo_links.json"

def scroll_and_collect_games(page, url):
    """
    Sayfaya gider, en aşağı kaydırır ve oyun linklerini toplar.
    """
    print(f"[{url}] adresine gidiliyor ve oyunlar toplanıyor...")
    page.goto(url, wait_until="domcontentloaded", timeout=60000)
    
    # Sayfayı yavaşça aşağı kaydırarak lazy-load içerikleri yükle
    while True:
        page.evaluate("window.scrollBy(0, 800);")
        time.sleep(1.5)
        
        new_height = page.evaluate("document.body.scrollHeight")
        current_scroll = page.evaluate("window.scrollY + window.innerHeight")
        
        if current_scroll >= new_height:
            time.sleep(3)
            final_height = page.evaluate("document.body.scrollHeight")
            if current_scroll >= final_height:
                print("Sayfanın sonuna ulaşıldı.")
                break

    # Sayfadaki oyun kartlarını bul
    games_data = []
    cards = page.query_selector_all("a[href^='/game/']")
    
    for i, card in enumerate(cards):
        href = card.get_attribute("href")
        title_elem = card.query_selector("img")
        
        if href and title_elem:
            title = title_elem.get_attribute("alt") or title_elem.get_attribute("title") or f"Oyun {i+1}"
            game_slug = href.split("/")[-1]
            
            # Arka plan iframe sayfası genellikle /game-iframe/ {slug} şeklindedir
            iframe_page_url = f"https://slotra.com/game-iframe/{game_slug}?gId0={game_slug}"
            
            games_data.append({
                "title": title.strip(),
                "iframe_page_url": iframe_page_url,
                "real_demo_url": None
            })

    # Aynı oyunun birden fazla kartı varsa filtrele
    unique_games = {g["iframe_page_url"]: g for g in games_data}.values()
    final_list = list(unique_games)
    
    print(f"Toplam {len(final_list)} benzersiz oyun bulundu.\n")
    return final_list

def extract_real_demo_urls(page, games_list):
    """
    Toplanan oyunların iframe sayfalarına girerek asıl demo linkini yakalar.
    """
    print("Oyunların asıl (sağlayıcı) demo linkleri Network üzerinden yakalanıyor...\n")
    
    for i, game in enumerate(games_list):
        iframe_page_url = game["iframe_page_url"]
        print(f"[{i+1}/{len(games_list)}] {game['title']} işleniyor...")
        
        real_url = None
        
        def handle_request(request):
            nonlocal real_url
            url = request.url
            # Sağlayıcı linkini yakalamak için yaygın anahtar kelimeler
            if ("entry?params" in url or "openGame.do" in url or "html5Game.do" in url or "ContainerLauncher" in url or "index.html?gameid=" in url):
                if "slotra.com" not in url:
                    real_url = url
                    
        page.on("request", handle_request)
        
        try:
            # Iframe sayfasına git
            page.goto(iframe_page_url, wait_until="domcontentloaded", timeout=45000)
            
            # Sayfanın tam yüklenmesi ve redirect (302) isteklerinin tamamlanması için bekle
            time.sleep(4)
            
            if real_url:
                print(f"  --> Başarılı (Network): {real_url[:80]}...")
                game["real_demo_url"] = real_url
            else:
                # Network'ten düşmediyse DOM'daki iframe src'sine bak
                iframes = page.query_selector_all("iframe")
                for iframe in iframes:
                    src = iframe.get_attribute("src")
                    if src and "slotra.com" not in src:
                        real_url = src
                        break
                
                if real_url:
                    print(f"  --> Başarılı (DOM): {real_url[:80]}...")
                    game["real_demo_url"] = real_url
                else:
                    print("  --> BULUNAMADI")
                    game["real_demo_url"] = "BULUNAMADI"
                    
        except Exception as e:
            print(f"  --> HATA: {e}")
            game["real_demo_url"] = "HATA"
            
        page.remove_listener("request", handle_request)
        
        # Bot korumasına takılmamak ve bağlantının yorulmaması için her oyundan sonra bekle
        time.sleep(2)

def save_to_json(data, filename):
    """
    Verileri JSON dosyasına kaydeder.
    """
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"\nVeriler başarıyla '{filename}' dosyasına kaydedildi!")
    except Exception as e:
        print(f"\n[HATA] Dosya kaydedilirken sorun oluştu: {e}")

def main():
    target_url = "https://slotra.com/casino/new"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        try:
            # İlk aşama: Tüm oyunları kaydırarak topla
            games_list = scroll_and_collect_games(page, target_url)
            
            if not games_list:
                print("Hiç oyun bulunamadı. İşlem sonlandırılıyor.")
                return
                
            # İkinci aşama: Iframe/Network linklerini çek
            extract_real_demo_urls(page, games_list)
            
            # Son aşama: Kaydet
            save_to_json(games_list, SAVE_FILE)
            
        except Exception as e:
            print(f"Ana işlem sırasında kritik hata oluştu: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    main()
