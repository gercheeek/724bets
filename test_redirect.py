import time
from playwright.sync_api import sync_playwright

def test_redirect():
    # Inca Gold II payload link
    url = "https://launchgame2me.com/launch/demo/?payload=gAAAAABqb3X9MAWRFY4MWfyzrMrMR3bztBE25aTkZiaMT2GMlPB6MzkLhG5KEJgxrzQ3gmTJZKy7yLziixOY00yrV8HDbfaAOxtWMVcgD15FLBWnImcTGvMrMJVitkj31mq4Oa0mMM-HiQB8UeVg9EGPxjbUjX481ogsLyaE5KV0kcpEywwd_BHauQihnP0PtBGHedLvz3JW85x6wHP3ygoKfZhRENwo8o9cLnm0qpJmy14O7XGkSl_-2WnV2BdcbOoFbmmGYEB5tUu1ea6Ize9ODmpxjQ-cr20AP5nfnaX0mip43aPv4h2G6Zh4CeFmuD6LKpbn-F_xc9caexwBy5GGm9lwVbu3YZmLr-MVLGkF4sme0Q68_kYvVE8Z53OL57NHdiaWz0C6FXm7nvpL9ceKQKMa6QEMdATyCdaqGY3lPjIqkor72yrM98BtIkGNyVAqWOivb5-WTxlWEP4NtgJwiuLY0Uh_GnqIWmrMS4c95hBk09pr8u3lkByQLrr4MQXIKRRh88oGpGDVUjzU3NsK_6COrew3DdV3R9WXK2CeG13zoGCr_ERQ9RxLZIDW2YDj16xpmoW7MrM4wKjUrGZM0eKeM5bWO3WNCfdzRWkDzdPuNyghhGVskf4mLDKlMad0Fvkir595rK-kYFmirVC6xfLv1AFFDScyd9rKr9IlyWpKDGN5QXY9MPQcXK0pIJXToG1-VX6Y"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        def handle_request(req):
            print(f"Request: {req.url}")
            
        page.on("request", handle_request)
        
        try:
            page.goto(url, wait_until="networkidle", timeout=10000)
            time.sleep(3)
        except Exception as e:
            print(f"Error: {e}")
            
        browser.close()

if __name__ == "__main__":
    test_redirect()
