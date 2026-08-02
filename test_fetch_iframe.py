import requests
from bs4 import BeautifulSoup

def test_fetch_iframe():
    url = "https://slotra.com/game-iframe/inca-gold-ii?gId0=inca-gold-ii"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    res = requests.get(url, headers=headers)
    print("Status:", res.status_code)
    
    if res.status_code == 200:
        soup = BeautifulSoup(res.text, "html.parser")
        iframes = soup.find_all("iframe")
        for iframe in iframes:
            print("IFRAME:", iframe.get("src"))
            
        if "launchgame2me" in res.text:
            print("FOUND launchgame2me IN TEXT!")
        else:
            print("NOT FOUND in text.")
    
if __name__ == "__main__":
    test_fetch_iframe()
