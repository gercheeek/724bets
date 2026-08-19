(async () => {
  const url = 'https://1xframemxz.com/service-api/LiveFeed/Get1x2_VZip?count=50&lng=tr&mode=4&country=180&partner=85&noFilterBlockEvent=true&sports=1';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://1xframemxz.com/tr/live'
      }
    });
    console.log(res.status);
    const text = await res.text();
    console.log(text.substring(0, 100));
  } catch (e) {
    console.log(e);
  }
})();
