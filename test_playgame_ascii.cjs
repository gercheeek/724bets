const crypto = require('crypto');

const APP_KEY = '9f5f538a-121c-4bf1-846d-9b6c048a263f';
const APP_ID = 'cc49d408-decf-48c3-a75e-9ae61bc1cb59';
const HOST = 'https://mgcbot.mgcapi.com';

async function test() {
  const request_time = Date.now().toString();
  const player_id = '1';
  const player_token = Buffer.from(JSON.stringify({ player_id: 1 })).toString('base64');
  const game_id = 90044;
  const exit = 'https://www.724bets.net';
  const currency = 'TRY';
  const language = 'tr';
  const shop_id = '1';

  // String concat for signature:
  const str = `${encodeURIComponent(exit)}${game_id}${player_id}${shop_id}${player_token}${APP_ID}${language}${request_time}${currency}`;
  const sign = crypto.createHmac('md5', APP_KEY).update(str).digest('hex');

  console.log('Testing with player_id = 1 (pure ASCII)...');
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

  const res = await fetch(`${HOST}/api/v1/playGame?${qs}`);
  console.log('GET Status:', res.status, await res.json());

  // Also POST
  const payload = {
    exit,
    game_id,
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

  const resPost = await fetch(`${HOST}/api/v1/playGame`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  console.log('POST Status:', resPost.status, await resPost.json());
}
test();
