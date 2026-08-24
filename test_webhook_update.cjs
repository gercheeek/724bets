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

async function testWebhookUpdate() {
    const params = {
      app_id: APP_ID,
      request_time: Date.now().toString(),
      webhook_url: 'https://724bets.net/api/casino/callback/api'
    };

    params.sign = createSign(params, APP_KEY);

    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/api/v1/webhook-url-update?${queryString}`;

    try {
        const response = await fetch(url, { method: 'POST' });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err);
    }
}
testWebhookUpdate();
