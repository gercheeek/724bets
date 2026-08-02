import os
import time
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

SAVE_DIR = "public/assets/slots/hold_and_win"
collected_urls = set()

def setup_directory():
    if not os.path.exists(SAVE_DIR):
        os.makedirs(SAVE_DIR)
        print(f"[{SAVE_DIR}] klasörü oluşturuldu.")

def handle_response(response):
    url = response.url
    content_type = response.headers.get("content-type", "")
    
    if "/format/avif/" in url or "image/avif" in content_type:
        collected_urls.add(url)

def scrape_hold_and_win_images():
    url = "https://slotra.com/casino/hold-and-win"
    print(f"{url} adresi için kazıma başlatılıyor...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        page.on("response", handle_response)

        try:
            page.goto(url, wait_until="domcontentloaded", timeout=60000)
            print("Sayfa yüklendi, kaydırma (scroll) işlemi başlatılıyor...")

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

            print(f"Toplam {len(collected_urls)} benzersiz avif resmi bulundu. İndiriliyor...")
            
            for img_url in collected_urls:
                try:
                    res = context.request.get(img_url)
                    if res.ok:
                        body = res.body()
                        parsed = urlparse(img_url)
                        filename = os.path.basename(parsed.path)
                        if not filename.endswith(".avif"):
                            filename += ".avif"
                            
                        filepath = os.path.join(SAVE_DIR, filename)
                        
                        if not os.path.exists(filepath):
                            with open(filepath, "wb") as f:
                                f.write(body)
                            print(f"[İNDİRİLDİ] {filename}")
                except Exception as e:
                    print(f"[HATA] {img_url} indirilemedi: {e}")
                    
            print("Tüm resimler başarıyla tamamlandı.")
            
        except Exception as e:
            print(f"[HATA] Sorun oluştu: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    setup_directory()
    scrape_hold_and_win_images()
