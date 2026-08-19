const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

const API_URL = process.env.OROPLAY_API_URL || 'https://bs.sxvwlkohlv.com/api/v2';
const CLIENT_ID = process.env.OROPLAY_CLIENT_ID;
const CLIENT_SECRET = process.env.OROPLAY_CLIENT_SECRET;

function fetchV4(url, options) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const reqOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {},
            family: 4
        };

        const req = https.request(reqOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);
        if (options.body) {
            req.write(options.body);
        }
        req.end();
    });
}

async function run() {
    console.log("Fetching Token...");
    const authRes = await fetchV4(`${API_URL}/auth/createtoken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET })
    });
    console.log("Auth Response:", authRes);

    const token = authRes.data.token;
    if (!token) {
        console.error("No token!");
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    console.log("\n--- Testing Agent Balance Endpoints ---");
    const endpoints = [
        { path: '/agent/balance', method: 'GET' },
        { path: '/agent/balance', method: 'POST', body: JSON.stringify({}) },
        { path: '/agent/info', method: 'GET' },
        { path: '/user/balance', method: 'GET' },
        { path: '/game/launch-url', method: 'POST', body: JSON.stringify({ vendorCode: 'slot-pragmatic', gameCode: 'vs20olympgate', userCode: 'testuser', language: 'tr', theme: 1 }) }
    ];

    for (const ep of endpoints) {
        try {
            const res = await fetchV4(`${API_URL}${ep.path}`, {
                method: ep.method,
                headers: headers,
                body: ep.body
            });
            console.log(`\nEndpoint: ${ep.method} ${ep.path}`);
            console.log(`Status: ${res.status}`);
            console.log(`Response:`, JSON.stringify(res.data, null, 2));
        } catch (err) {
            console.error(`Error ${ep.path}:`, err.message);
        }
    }
}

run();
