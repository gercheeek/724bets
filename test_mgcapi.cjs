const crypto = require('crypto');
async function test() {
    const APP_ID = 'cc49d408-decf-48c3-a75e-9ae61bc1cb59';
    const APP_KEY = '9f5f538a-121c-4bf1-846d-9b6c048a263f';
    const API_URL = 'https://stage.mgcapi.com';
    const request_time = Math.floor(Date.now() / 1000).toString();
    const str = `${APP_ID}${request_time}`;
    const sign = crypto.createHmac('md5', APP_KEY).update(encodeURIComponent(str)).digest('hex');
    const endpoint = `${API_URL}/api/v1/get-games?app_id=${APP_ID}&request_time=${request_time}&sign=${sign}`;
    const res = await fetch(endpoint);
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
}
test();
