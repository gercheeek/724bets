const crypto = require('crypto');
const API_URL = 'https://stage.mgcapi.com';
const APP_ID = 'cc49d408-decf-48c3-a75e-9ae61bc1cb59';
const APP_KEY = '9f5f538a-121c-4bf1-846d-9b6c048a263f';

function createSign(values, apiKey) {
  const concatenated = Object.entries(values)
    .filter(([key]) => key !== 'sign')
    .map(([, value]) => value)
    .join('');
  const encoded = encodeURIComponent(concatenated);
  return crypto.createHmac('md5', apiKey).update(encoded).digest('hex');
}

async function run() {
  const request_time = Date.now().toString();
  const webhook_url = 'https://724bets.net/api/casino/callback/api';
  
  // 1. Test POST with Body
  const payload = {
    app_id: APP_ID,
    request_time: request_time,
    webhook_url: webhook_url
  };
  payload.sign = createSign(payload, APP_KEY);
  
  console.log('Testing POST JSON Body...');
  try {
    const res = await fetch(`${API_URL}/api/v1/webhook-url-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log('Status Body:', res.status, await res.text());
  } catch (e) {
    console.error('Body error:', e);
  }

  // 2. Test GET Options
  console.log('Testing GET get-options...');
  try {
    const time = Date.now().toString();
    const str = `${APP_ID}${time}`;
    const sign = crypto.createHmac('md5', APP_KEY).update(encodeURIComponent(str)).digest('hex');
    const optRes = await fetch(`${API_URL}/api/v1/get-options?app_id=${APP_ID}&request_time=${time}&sign=${sign}`);
    console.log('Status Options:', optRes.status, await optRes.text());
  } catch (e) {
    console.error('Options error:', e);
  }
}
run();
