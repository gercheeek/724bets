const crypto = require('crypto');

const APP_KEY = '9f5f538a-121c-4bf1-846d-9b6c048a263f';
const APP_ID = 'cc49d408-decf-48c3-a75e-9ae61bc1cb59';
const HOSTS = ['https://mgcbot.mgcapi.com', 'https://stage.mgcapi.com'];

async function test() {
  const request_time = Date.now().toString();
  const player_id = 'Yönetici';
  const player_token = Buffer.from(JSON.stringify({ player_id })).toString('base64');
  const game_id = 90044; // Bulky fruits or Shining Crown
  const exit = 'https://www.724bets.net';
  const currency = 'TRY';
  const language = 'tr';
  const shop_id = '1';

  // Let's create signature as shown in test-cases:
  // encodeURIComponent(exit) + game_id + player_id + shop_id + player_token + app_id + language + request_time + currency
  const str = `${encodeURIComponent(exit)}${game_id}${player_id}${shop_id}${player_token}${APP_ID}${language}${request_time}${currency}`;
  const sign = crypto.createHmac('md5', APP_KEY).update(str).digest('hex');

  console.log('sign_str:', str);
  console.log('sign:', sign);

  for (const host of HOSTS) {
    console.log(`\n=== Testing ${host}/api/v1/playGame ===`);
    
    // GET test
    const qs = new URLSearchParams({
      exit,
      game_id: game_id.toString(),
      player_id,
      shop_id,
      player_token,
      app_id: APP_ID,
      language,
      request_time,
      currency,
      sign
    }).toString();

    try {
      const resGet = await fetch(`${host}/api/v1/playGame?${qs}`);
      console.log('GET Status:', resGet.status);
      const dataGet = await resGet.json();
      console.log('GET Data:', dataGet);
    } catch (e) {
      console.error('GET Error:', e.message);
    }

    // POST test
    const payload = {
      exit,
      game_id: Number(game_id),
      player_id,
      shop_id: 1,
      player_token,
      app_id: APP_ID,
      language,
      request_time: Number(request_time),
      currency,
      sign,
      urls: {
        base_url: 'https://www.724bets.net',
        wallet_url: 'https://www.724bets.net/api/casino/callback/api',
        other_url: 'https://www.724bets.net'
      }
    };

    try {
      const resPost = await fetch(`${host}/api/v1/playGame`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log('POST Status:', resPost.status);
      const dataPost = await resPost.json();
      console.log('POST Data:', dataPost);
    } catch (e) {
      console.error('POST Error:', e.message);
    }
  }
}
test();
