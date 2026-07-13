from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("https://sport.7yrrerfcet.com/SportsBook/Home", wait_until="networkidle")
    
    # find iframe
    target_frame = None
    for frame in page.frames:
        try:
            body_text = frame.locator("body").inner_text(timeout=2000)
            if "Maç Sonucu" in body_text or "Canlı" in body_text:
                target_frame = frame
                break
        except:
            pass
            
    if target_frame:
        target_frame.wait_for_selector(".oneGame", timeout=10000)
        maclar = target_frame.locator(".oneGame").all_inner_texts()
        print(f"Initial: {len(maclar)}")
        
        # Try wheel scroll instead of PageDown
        target_frame.locator(".oneGame").first.hover()
        page.mouse.wheel(0, 10000)
        time.sleep(2)
        maclar2 = target_frame.locator(".oneGame").all_inner_texts()
        print(f"After Mouse Wheel: {len(maclar2)}")

        target_frame.locator("body").press("PageDown")
        time.sleep(2)
        maclar3 = target_frame.locator(".oneGame").all_inner_texts()
        print(f"After PageDown: {len(maclar3)}")

        # Try scrolling the specific container
        target_frame.evaluate("window.scrollBy(0, 5000);")
        time.sleep(2)
        maclar4 = target_frame.locator(".oneGame").all_inner_texts()
        print(f"After window.scrollBy: {len(maclar4)}")

        # Try finding the scrollable div
        scroll_divs = target_frame.evaluate("""
            Array.from(document.querySelectorAll('div')).filter(el => {
                const style = window.getComputedStyle(el);
                return style.overflowY === 'auto' || style.overflowY === 'scroll';
            }).map(el => el.className)
        """)
        print(f"Scrollable divs: {scroll_divs}")

    browser.close()
