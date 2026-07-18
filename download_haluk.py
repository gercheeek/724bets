import urllib.request
import json
import re

url = "https://html.duckduckgo.com/html/?q=haluk+levent+gitar+siyah+beyaz"
req = urllib.request.Request(
    url, 
    data=None, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
    }
)

try:
    response = urllib.request.urlopen(req)
    html = response.read().decode('utf-8')
    # Find all image URLs
    img_urls = re.findall(r'img class="tile--img__img" src="([^"]+)"', html)
    if img_urls:
        print("Found images:", img_urls[0])
        # Download first image
        img_url = "https:" + img_urls[0] if img_urls[0].startswith('//') else img_urls[0]
        urllib.request.urlretrieve(img_url, "haluk_raw.jpg")
        print("Downloaded to haluk_raw.jpg")
    else:
        print("No images found.")
except Exception as e:
    print("Error:", e)
