async function test() {
  const url = 'https://1xframemxz.com/service-api/LiveFeed/Get1x2_VZip?count=40&lng=tr&gr=1110&mode=4&country=180&partner=85&virtualSports=true&noFilterBlockEvent=true';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://1xframemxz.com/tr/live'
      }
    });
    const data = await res.json();
    console.log('SUCCESS, fetched matches:', data.Value ? data.Value.length : 0);
    if (data.Value && data.Value.length > 0) {
      console.log('Sample Match:', data.Value[0].O1, 'vs', data.Value[0].O2, '| ID:', data.Value[0].I);
      console.log('Team 1 ID:', data.Value[0].O1I, '| Team 2 ID:', data.Value[0].O2I);
    }
  } catch (e) {
    console.error('Fetch error:', e);
  }
}
test();
