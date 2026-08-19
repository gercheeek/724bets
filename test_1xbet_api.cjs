async function testAPI() {
  try {
    const res = await fetch('https://1xbet.mobi/LiveFeed/Get1x2_VZip?sports=1&count=5&mode=4', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const data = await res.json();
    console.log('1xbet.mobi SUCCESS:', data.Value ? data.Value.length + ' events' : 'No data');
    if (data.Value && data.Value.length > 0) {
       console.log('Sample Match:', data.Value[0].O1, 'vs', data.Value[0].O2, 'ID:', data.Value[0].I);
    }
  } catch (err) {
    console.error('1xbet.mobi FAILED:', err.message);
  }
}

testAPI();
