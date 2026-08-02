import requests

def test_headers():
    url = "https://slotra.com/game/inca-gold-ii"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    }
    res = requests.get(url, headers=headers)
    print("Headers for", url)
    for k, v in res.headers.items():
        if "frame" in k.lower() or "csp" in k.lower() or "content-security" in k.lower():
            print(f"{k}: {v}")
    print("Check complete.")
    
if __name__ == "__main__":
    test_headers()
