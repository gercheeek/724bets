const crypto = require('crypto');

const APP_KEY = '9f5f538a-121c-4bf1-846d-9b6c048a263f';
const APP_ID = 'cc49d408-decf-48c3-a75e-9ae61bc1cb59';
const WEBHOOK_URL = 'https://www.724bets.net/api/casino/callback/api';

async function update() {
  const hosts = ['https://mgcbot.mgcapi.com', 'https://stage.mgcapi.com'];
  const request_time = Date.now().toString();

  // Signature calculation as specified in docs
  const params = {
    app_id: APP_ID,
    request_time: request_time,
    webhook_url: WEBHOOK_URL
  };
  const str = `${APP_ID}${request_time}${WEBHOOK_URL}`;
  const sign = crypto.createHmac('md5', APP_KEY).update(encodeURIComponent(str)).digest('hex');
  params.sign = sign;

  for (const host of hosts) {
    console.log(`Testing webhook update on ${host}...`);
    const qs = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`${host}/api/v1/webhook-url-update?${qs}`, { method: 'POST' });
      console.log('Query POST Status:', res.status, await res.text());
    } catch (e) {
      console.error('Query POST Error:', e.message);
    }

    try {
      const res2 = await fetch(`${host}/api/v1/webhook-url-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      console.log('JSON POST Status:', res2.status, await res2.text());
    } catch (e) {
      console.error('JSON POST Error:', e.message);
    }
  }
}
update();
