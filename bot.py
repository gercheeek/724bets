from playwright.sync_api import sync_playwright

def bul_ve_oku_iframe_icerigi(page):
    print("[*] Sitedeki tüm iframe'ler taranıyor...")
    all_frames = page.frames
    print(f"[*] Toplam {len(all_frames)} adet frame bulundu.\n")
    
    for frame in all_frames:
        try:
            # Önce iframe'in yüklenmesini biraz bekleyelim ki iskelet otursun
            frame.wait_for_load_state("domcontentloaded", timeout=5000)
            
            # İframe boş mu değil mi diye küçük bir kontrol yapıyoruz
            body_text = frame.locator("body").inner_text(timeout=2000)
            
            # Anahtar kelimelerden biri varsa doğru iframe'deyiz demektir
            if "Maç Sonucu" in body_text or "Canlı" in body_text or "Bahis Miktarı" in body_text:
                print(f"[+] BİNGO! Hedef İframe Bulundu: {frame.url}")
                print("[*] Maç verilerinin (Digitain altyapısından) DOM'a inmesi bekleniyor...")
                
                # İŞTE DÜZELTİLEN KISIM: page değil, FRAME üzerinde bekliyoruz!
                # İnternet yavaşsa diye süreyi 15 saniyeden 45 saniyeye çıkardım
                frame.wait_for_selector(".oneGame", timeout=45000)
                print("[+] Harika! Maçlar ekrana çizildi. Şimdi okuma yapıyoruz...\n")
                
                # Sadece maçları (.oneGame div'lerini) alıyoruz
                maclar = frame.locator(".oneGame").all_inner_texts()
                print(f"[+] Ekranda toplam {len(maclar)} adet maç bulundu!\n")
                
                for i, mac in enumerate(maclar):
                    print(f"=== MAÇ {i+1} ===")
                    print(mac.strip())
                    print("=================")
                
                return True # Başarıyla veriyi çektik, fonksiyondan çık
                
        except Exception as e:
            # Hata veren veya aradığımız class'ın yüklenmediği frame'leri atlıyoruz
            continue
            
    print("\n[-] Üzgünüm, maç içeren bir iframe bulunamadı veya süre doldu.")
    return False

# ----- KULLANIM -----
with sync_playwright() as p:
    print("[*] Tarayıcı Profili yükleniyor (Çerezler ve Cloudflare geçişleri hatırlanacak)...")
    
    # 'bot_profile' adında bir klasör oluşturup tüm çerezleri orada tutacağız
    context = p.chromium.launch_persistent_context(
        user_data_dir="./bot_profile",
        headless=False,
        args=["--disable-blink-features=AutomationControlled"] # Ekstra stealth (Bot gizleme) özelliği
    )
    
    # Persistent context (Kalıcı profil) açıldığında varsayılan olarak bir sayfa ile gelir
    page = context.pages[0] if context.pages else context.new_page()
    
    print("[*] Hedef siteye gidiliyor...")
    page.goto("https://sport.7yrrerfcet.com/SportsBook/Home", wait_until="networkidle")
    
    # Sayfanın tam oturması için kısa bir bekleme
    page.wait_for_timeout(3000) 
    
    bul_ve_oku_iframe_icerigi(page)
    
    # Sonucu gördükten sonra tarayıcıyı kapatmak için enter bekle
    input("\n[*] Kapatmak için ENTER'a basın...")
    context.close()