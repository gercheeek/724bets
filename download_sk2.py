import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    "https://wstatic-prod.s3.amazonaws.com/uploads/esport_teams/sk-gaming.png",
    "https://upload.wikimedia.org/wikipedia/commons/e/e0/SK_Gaming_logo.svg",
    "https://esportsjunkie.com/wp-content/uploads/2016/09/SK-Gaming-CSGO.jpg",
    "https://liquipedia.net/commons/images/thumb/8/87/SK_Gaming_Cologne_2016.jpg/600px-SK_Gaming_Cologne_2016.jpg"
]

for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        img = urllib.request.urlopen(req, context=ctx).read()
        with open('public/images/esports_team_sk.jpg', 'wb') as f:
            f.write(img)
        print("Success:", u)
        break
    except Exception as e:
        print("Failed:", u, str(e))
