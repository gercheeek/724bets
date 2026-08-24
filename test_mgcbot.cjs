const crypto = require('crypto');

const API_KEY = '9f5f538a-121c-4bf1-846d-9b6c048a263f';
const APP_ID = 'cc49d408-decf-48c3-a75e-9ae61bc1cb59';
const HOSTS = [
  'https://mgcbot.mgcapi.com',
  'https://stage.mgcapi.com',
  'https://mgcapi.com'
];

async function test() {
  for (const host of HOSTS) {
    console.log(`\n--- Testing ${host} ---`);
    const request_time = Date.now().toString();
    const str = `${APP_ID}${request_time}`;
    const sign = crypto.createHmac('md5', API_KEY).update(encodeURIComponent(str)).digest('hex');

    try {
      const res = await fetch(`${host}/api/v1/get-options?app_id=${APP_ID}&request_time=${request_time}&sign=${sign}`);
      console.log(`get-options status: ${res.status}`);
      if (res.status === 200) {
        const d = await res.json();
        console.log(`get-options providers:`, (d.providers || []).map(p => p.title));
      }
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
}
test();
