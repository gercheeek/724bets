import urllib.request
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://html.duckduckgo.com/html/?q=sk+gaming+2016+csgo+team+roster+photo"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')

# Find first image
match = re.search(r'src="(https://tse[^"]+)"', html)
if match:
    img_url = match.group(1)
    print("Found image:", img_url)
    img_data = urllib.request.urlopen(img_url, context=ctx).read()
    with open('public/images/esports_team_sk.jpg', 'wb') as f:
        f.write(img_data)
    print("Downloaded successfully.")
else:
    print("Not found.")
