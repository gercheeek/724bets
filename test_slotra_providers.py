import time
from playwright.sync_api import sync_playwright

def test_providers():
    urls = [
        "https://slotra.com/casino/provider/egt-digital",
        "https://slotra.com/casino/provider/amusnet"
    ]
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        for url in urls:
            try:
                print(f"Testing {url}...")
                page.goto(url, wait_until="commit", timeout=30000)
                time.sleep(4)
                
                # count games
                cards = page.query_selector_all("a[href^='/game/']")
                print(f"Found {len(cards)} games on {url}")
            except Exception as e:
                print(f"Error on {url}: {e}")
                
        browser.close()

if __name__ == "__main__":
    test_providers()
