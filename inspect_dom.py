from playwright.sync_api import sync_playwright

def inspect():
    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            user_data_dir="./chrome_data",
            headless=True,
            args=["--disable-blink-features=AutomationControlled"]
        )
        page = context.new_page()
        page.goto("https://sport.7yrrerfcet.com/SportsBook/Home", wait_until="domcontentloaded")
        
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
            target_frame.wait_for_selector(".oneGame", timeout=45000)
            
            html = target_frame.evaluate("""
                () => {
                    const games = Array.from(document.querySelectorAll('.oneGame'));
                    if (games.length === 0) return "No games";
                    
                    let data = "";
                    for(let i=0; i<Math.min(3, games.length); i++) {
                        let game = games[i];
                        let parent = game.parentElement;
                        let pparent = parent ? parent.parentElement : null;
                        
                        data += `\n--- GAME ${i} ---\n`;
                        if(pparent) {
                           data += "PPARENT CLASSES: " + pparent.className + "\n";
                           // Try to find the nearest previous sibling that looks like a header
                           let prev = pparent.previousElementSibling;
                           if(prev) {
                               data += "PREV SIBLING TEXT: " + prev.innerText.substring(0, 50) + "\n";
                               data += "PREV SIBLING HTML: " + prev.outerHTML.substring(0, 200) + "\n";
                           }
                           data += "PPARENT HTML (start): " + pparent.innerHTML.substring(0, 500) + "\n";
                        }
                    }
                    return data;
                }
            """)
            print(html)
        else:
            print("Frame not found")
        context.close()

if __name__ == "__main__":
    inspect()
