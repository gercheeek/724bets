import requests

def test_old_egt():
    url = "https://vegangsterslotra-gc-prod.fppcdn3.autos/?gameKey=FHEBLSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    }
    res = requests.get(url, headers=headers, verify=False)
    print("Status:", res.status_code)
    print("Content:", res.text[:500])
    
if __name__ == "__main__":
    test_old_egt()
