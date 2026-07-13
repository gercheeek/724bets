import time
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

def pro_bahis_botu():
    with Stealth().use_sync(sync_playwright()) as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto("https://sport.7yrrerfcet.com/SportsBook/Home", wait_until="domcontentloaded")
        
        print("[+] Sayfa yükleniyor, maçlar avlanıyor...")
        time.sleep(10) # Sayfanın tamamen yüklenmesi için bekleyelim
        
        # Siteyi "Maç Sonucu" başlığına göre parçalara ayır
        # Bu XPath, sayfanın genelindeki tüm maç bloklarını hedefler
        try:
            while True:
                mac_bloklari = page.locator("xpath=//div[contains(text(), 'Maç Sonucu')]/..").all()
                
                print("\033[H\033[J", end="")
                print(f"=== CANLI AV BAŞLADI (Toplam {len(mac_bloklari)} Maç Bloğu) ===\n")
                
                for blok in mac_bloklari:
                    # Blok içindeki metni çek
                    text = blok.inner_text()
                    if "vs" in text.lower() or "İspanya" in text:
                        print(f"MAÇ DETAYI: {text.replace('\n', ' | ')}")
                        print("-" * 50)
                
                time.sleep(2)
        except KeyboardInterrupt:
            print("Durduruldu.")
        finally:
            browser.close()

if __name__ == "__main__":
    pro_bahis_botu()