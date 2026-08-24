const crypto = require('crypto');

const APP_KEY = '9f5f538a-121c-4bf1-846d-9b6c048a263f';
const APP_ID = 'cc49d408-decf-48c3-a75e-9ae61bc1cb59';
const HOSTS = ['https://mgcbot.mgcapi.com', 'https://stage.mgcapi.com'];

async function launch(game_id, player_id) {
  const exit = 'https://www.724bets.net';
  const shop_id = '1';
  const language = 'tr';
  const currency = 'TRY';
  const request_time = Date.now().toString();
  const player_token = Buffer.from(JSON.stringify({ player_id: player_id || 1 })).toString('base64');

  // Exact signature string formula from test-cases:
  // encodeURIComponent(exit) + game_id + player_id + shop_id + player_token + app_id + language + request_time + currency
  const str = `${encodeURIComponent(exit)}${game_id}${player_id}${shop_id}${player_token}${APP_ID}${language}${request_time}${currency}`;
  const sign = crypto.createHmac('md5', APP_KEY).update(str).digest('hex');

  const payload = {
    exit,
    game_id: Number(game_id),
    player_id: String(player_id),
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

  for (const host of HOSTS) {
    try {
      const res = await fetch(`${host}/api/v1/playGame`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log(`[${host}] game_id=${game_id}, player=${player_id}:`, data);
    } catch (e) {
      console.error(`[${host}] Error:`, e.message);
    }
  }
}

async function run() {
  console.log('Testing Bulky Fruits (90044)...');
  await launch(90044, '1');

  console.log('\nTesting Shining Crown (EGT)...');
  await launch(90055, '1'); // Burning Hot or 90044
}
run();
