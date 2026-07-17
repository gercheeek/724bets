import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

hedef_url = "https://rainbet.com/tr"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

print("Siteye bağlanılıyor ve linkler toplanıyor...\n")

try:
    response = requests.get(hedef_url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    resimler = soup.find_all('img')
    
    for resim in resimler:
        src = resim.get('src')
        if src:
            tam_link = urljoin(hedef_url, src)
            print(tam_link)

except Exception as e:
    print("Bir hata oluştu:", e)
