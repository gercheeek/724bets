const crypto = require('crypto');

const API_KEY = '9f5f538a-121c-4bf1-846d-9b6c048a263f';
const APP_ID = 'cc49d408-decf-48c3-a75e-9ae61bc1cb59';

function createSign(params, apiKey) {
  const values = Object.entries(params)
    .filter(([key]) => key !== 'sign' && key !== 'urls')
    .map(([, value]) => (value && typeof value === 'object' ? JSON.stringify(value) : value))
    .join('');
  const encoded = encodeURIComponent(values);
  return crypto.createHmac('md5', apiKey).update(encoded).digest('hex');
}

async function run() {
  const payload = {
    exit: 'https://www.724bets.net/',
    game_id: 90044,
    player_id: 'player_42',
    player_token: '1f0a3fcb0d3c',
    app_id: APP_ID,
    language: 'tr',
    currency: 'TRY',
    request_time: Date.now(),
    urls: {
      base_url: 'https://www.724bets.net',
      wallet_url: 'https://www.724bets.net/api/casino/callback/api',
      other_url: 'https://www.724bets.net/support'
    }
  };
  payload.sign = createSign(payload, API_KEY);

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'service/1.0.0',
    'Accept': 'application/json'
  };

  console.log('Sending request with User-Agent: service/1.0.0 from VPS to stage.mgcapi.com...');
  try {
    const res = await fetch('https://stage.mgcapi.com/api/v1/playGame', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });
    console.log('HTTP Status:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (e) {
    console.error('Error:', e.message);
  }
}
run();
