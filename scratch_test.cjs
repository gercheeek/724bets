fetch("https://1xframemxz.com/service-api/LiveFeed/Get1x2_Zip?count=5&lng=tr&mode=4&country=180&partner=85&sports=1", {
    headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
}).then(r => {
    console.log("Status:", r.status);
    return r.text();
}).then(t => console.log(t.substring(0, 100)))
.catch(console.error);
