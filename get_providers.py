import time
from playwright.sync_api import sync_playwright

def get_providers():
    url = "https://slotra.com/casino/providers"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        try:
            print(f"Going to {url}...")
            page.goto(url, wait_until="networkidle", timeout=30000)
            time.sleep(5)
            
            links = page.query_selector_all("a")
            providers = set()
            for link in links:
                href = link.get_attribute("href")
                if href and "/provider/" in href:
                    providers.add(href)
                    
            print(f"Found providers: {providers}")
        except Exception as e:
            print(f"Error: {e}")
            
        browser.close()

if __name__ == "__main__":
    get_providers()
