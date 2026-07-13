import os
import json
from playwright.sync_api import sync_playwright
from supabase import create_client, Client

# Supabase Ayarları
SUPABASE_URL = "https://eaxtuvjcanakaqetuqlc.supabase.co"
SUPABASE_KEY = "sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0"

def init_supabase():
    try:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except:
        return None

def guess_sport(lines):
    text = " ".join(lines).lower()
    if "set" in text or "oyun" in text or "tie-break" in text or "servis" in text or "atp" in text or "wta" in text:
        return "tenis"
    if "çeyrek" in text or "periyot" in text or "nba" in text or "basket" in text:
        return "basketbol"
    if "voleybol" in text or "setler" in text:
        return "voleybol"
    try:
        if lines[0].isdigit() and lines[2].isdigit():
            if int(lines[0]) > 20 or int(lines[2]) > 20:
                return "basketbol"
    except:
        pass
    return "futbol"

def parse_match_text(text):
    """
    Digitain altyapısından dönen çok satırlı (newline) metni parse eder.
    Örnek Canlı Maç:
    0\nViktoria Plzen\n0\nYoung Boys\nBaşlamadı\n61\n-\n-\n-\n+282
    Örnek Bülten Maç:
    İspanya\nBelçika\n10.07\n22:00\n61\n1.66\n4\n5.9\n+5189
    """
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if len(lines) < 8:
        return None
    
    match_data = {
        "home_team": "",
        "away_team": "",
        "match_time": "",
        "home_odd": 0,
        "draw_odd": 0,
        "away_odd": 0,
        "status": "Live"
    }

    try:
        # Check if first line is a score (number)
        if lines[0].isdigit() and lines[2].isdigit():
            # Canlı Maç Formatı
            sport = guess_sport(lines)
            match_data["home_team"] = lines[1]
            match_data["away_team"] = lines[3]
            match_data["status"] = f"{sport.upper()}|Canlı: {lines[0]}-{lines[2]} ({lines[4]})"
            match_data["match_time"] = lines[4]
            # Oranlar sondan bir öncekilerdedir
            try:
                match_data["away_odd"] = float(lines[-2]) if lines[-2] != '-' else 0
                match_data["draw_odd"] = float(lines[-3]) if lines[-3] != '-' else 0
                match_data["home_odd"] = float(lines[-4]) if lines[-4] != '-' else 0
            except ValueError:
                pass
        else:
            # Maç Öncesi Formatı
            sport = guess_sport(lines)
            match_data["home_team"] = lines[0]
            match_data["away_team"] = lines[1]
            match_data["match_time"] = f"{lines[2]} {lines[3]}"
            match_data["status"] = f"{sport.upper()}|Yakında"
            try:
                match_data["away_odd"] = float(lines[-2]) if lines[-2] != '-' else 0
                match_data["draw_odd"] = float(lines[-3]) if lines[-3] != '-' else 0
                match_data["home_odd"] = float(lines[-4]) if lines[-4] != '-' else 0
            except ValueError:
                pass

        return match_data
    except Exception as e:
        print(f"Parse error for lines: {lines}")
        return None


def bul_ve_oku_iframe_icerigi(page, supabase):
    print("[*] Sitedeki tüm iframe'ler taranıyor...")
    all_frames = page.frames
    
    for frame in all_frames:
        try:
            frame.wait_for_load_state("domcontentloaded", timeout=5000)
            body_text = frame.locator("body").inner_text(timeout=2000)
            
            if "Maç Sonucu" in body_text or "Canlı" in body_text or "Bahis Miktarı" in body_text:
                print(f"[+] BİNGO! Hedef İframe Bulundu: {frame.url}")
                print("[*] Maç verilerinin (Digitain altyapısından) DOM'a inmesi bekleniyor...")
                
                frame.wait_for_selector(".oneGame", timeout=45000)
                print("[+] Harika! Maçlar ekrana çizildi. Şimdi okuma yapıyoruz...\n")
                
                maclar = frame.locator(".oneGame").all_inner_texts()
                print(f"[+] Ekranda toplam {len(maclar)} adet maç bulundu!\n")
                
                parsed_matches = []
                for mac_text in maclar:
                    data = parse_match_text(mac_text)
                    if data:
                        parsed_matches.append(data)
                
                print(f"[+] {len(parsed_matches)} maç başarıyla JSON'a dönüştürüldü.")
                
                if supabase and len(parsed_matches) > 0:
                    print("[*] Supabase'e gönderiliyor...")
                    for match in parsed_matches:
                        try:
                            supabase.table('live_matches').upsert(
                                match, 
                                on_conflict='home_team,away_team'
                            ).execute()
                        except Exception as db_err:
                            print(f"DB HATA: {db_err}")
                    print("[+] Veritabanı güncellendi!")
                else:
                    print("[-] Supabase bağlantısı kurulamadı. Veriler public/live_matches.json dosyasına kaydediliyor...")
                    with open("public/live_matches.json", "w", encoding="utf-8") as f:
                        json.dump(parsed_matches, f, ensure_ascii=False, indent=2)
                
                return True
                
        except Exception as e:
            continue
            
    print("\n[-] Üzgünüm, maç içeren bir iframe bulunamadı veya süre doldu.")
    return False

if __name__ == "__main__":
    print("[*] Supabase Başlatılıyor...")
    supabase_client = init_supabase()

    with sync_playwright() as p:
        print("[*] Tarayıcı Profili yükleniyor...")
        context = p.chromium.launch_persistent_context(
            user_data_dir="./bot_profile",
            headless=False,
            args=["--disable-blink-features=AutomationControlled"]
        )
        
        page = context.pages[0] if context.pages else context.new_page()
        print("[*] Hedef siteye gidiliyor...")
        page.goto("https://sport.7yrrerfcet.com/SportsBook/Home", wait_until="networkidle")
        
        while True:
            print("\n=============================================")
            print("[*] Yeni Tarama Döngüsü Başlıyor...")
            page.wait_for_timeout(3000) 
            bul_ve_oku_iframe_icerigi(page, supabase_client)
            
            print("\n[*] Döngü bitti. 15 saniye bekleniyor... (Kapatmak için CTRL+C)")
            page.wait_for_timeout(15000)
