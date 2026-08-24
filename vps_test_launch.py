import subprocess
import time
import os

script = """
const crypto = require('crypto');

const API_URL = 'https://stage.mgcapi.com';
const APP_ID = 'cc49d408-decf-48c3-a75e-9ae61bc1cb59';
const APP_KEY = '9f5f538a-121c-4bf1-846d-9b6c048a263f';

function createSign(params, apiKey) {
  const values = Object.entries(params)
    .filter(([key]) => key !== 'sign' && key !== 'urls')
    .map(([, value]) => (value && typeof value === 'object' ? JSON.stringify(value) : value))
    .join('');
  const encoded = encodeURIComponent(values);
  return crypto.createHmac('md5', apiKey).update(encoded).digest('hex');
}

async function testLaunch() {
    const payload = {
        app_id: APP_ID,
        game_id: 117846,
        player_id: 'player_test',
        player_token: Buffer.from(JSON.stringify({ player_id: 'player_test' })).toString('base64'),
        currency: 'TRY',
        language: 'tr',
        request_time: Date.now(),
        exit: 'https://724bets.net/',
        urls: {
            base_url: 'https://724bets.net',
            wallet_url: 'https://724bets.net/api/casino/callback/api',
            other_url: 'https://724bets.net'
        }
    };

    payload.sign = createSign(payload, APP_KEY);
    
    try {
        const resObj = await fetch(`${API_URL}/api/v1/playGame`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await resObj.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err);
    }
}
testLaunch();
"""

with open('test_launch.cjs', 'w') as f:
    f.write(script)

# Copy to VPS
import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('85.121.178.80', username='root', password='kQkrGBYHtY76dIF0z1')

sftp = client.open_sftp()
sftp.put('test_launch.cjs', '/opt/724bets-backend/test_launch.cjs')
sftp.close()

stdin, stdout, stderr = client.exec_command('node /opt/724bets-backend/test_launch.cjs')
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())
client.close()
