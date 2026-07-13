from playwright.sync_api import sync_playwright

def handle_websocket(web_socket):
    print(f"\n[+] BAĞLANTI YAKALANDI: {web_socket.url}")
    
    # Gelen tüm mesajları ekrana bas
    web_socket.on("framesent", lambda payload: print(f"[-> GÖNDERİLEN]: {payload}"))
    web_socket.on("framereceived", lambda payload: print(f"[<- ALINAN]: {payload}"))

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        
        # Soketleri daha navigasyon başlamadan dinlemeye başla
        page.on("websocket", handle_websocket)
        
        print("[+] Siteye giriliyor...")
        page.goto("https://sport.7yrrerfcet.com/SportsBook/Home")
        
        # 30 saniye boyunca soket trafiğini izle
        page.wait_for_timeout(30000)
        browser.close()

if __name__ == "__main__":
    main()