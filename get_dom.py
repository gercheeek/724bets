from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            user_data_dir="./bot_profile",
            headless=True,
            args=["--disable-blink-features=AutomationControlled"]
        )
        page = context.new_page()
        print("Navigating...")
        # Ignore timeout, just wait for domcontentloaded
        try:
            page.goto("https://sport.7yrrerfcet.com/SportsBook/Home", wait_until="domcontentloaded", timeout=15000)
        except Exception as e:
            print("Goto timeout, but continuing anyway...")
            pass
            
        target_frame = None
        for frame in page.frames:
            try:
                frame.wait_for_load_state("domcontentloaded", timeout=5000)
                body_text = frame.locator("body").inner_text(timeout=2000)
                if "Maç Sonucu" in body_text or "Canlı" in body_text:
                    target_frame = frame
                    break
            except:
                pass
                
        if target_frame:
            print("Frame found. Waiting for .oneGame")
            try:
                target_frame.wait_for_selector(".oneGame", timeout=20000)
                print("Games loaded!")
                
                # Extract DOM around games
                dom = target_frame.evaluate("""
                    () => {
                        let el = document.querySelector('.oneGame');
                        if (!el) return 'No games';
                        let html = '';
                        // get the parent that likely contains multiple games and league headers
                        let container = el.parentElement;
                        if (container.parentElement) container = container.parentElement;
                        return container.innerHTML;
                    }
                """)
                with open("dom_dump.txt", "w", encoding="utf-8") as f:
                    f.write(dom)
                print("Saved DOM to dom_dump.txt")
            except Exception as e:
                print("Wait for selector failed:", e)
        else:
            print("Frame not found")
            
        context.close()

if __name__ == "__main__":
    run()
