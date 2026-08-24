
const crypto = require('crypto');
require('dotenv').config();

// MGCAPI Configuration
const API_URL = process.env.MGCAPI_API_URL || 'https://stage.mgcapi.com';
const APP_ID = process.env.MGCAPI_APP_ID || 'cc49d408-decf-48c3-a75e-9ae61bc1cb59';
const APP_KEY = process.env.MGCAPI_APP_KEY || '9f5f538a-121c-4bf1-846d-9b6c048a263f';

// ─── SIGNATURE GENERATOR ───
// Found from CDNParts API Documentation React App source
function generateSignature(params) {
    // Exclude 'sign' and 'urls' from the signature base string
    const values = Object.entries(params)
        .filter(([key]) => key !== 'sign' && key !== 'urls')
        .map(([, value]) => (value && typeof value === 'object' ? JSON.stringify(value) : value))
        .join('');
        
    const encoded = encodeURIComponent(values);
    return crypto.createHmac('md5', APP_KEY).update(encoded).digest('hex');
}

/**
 * Fetch all casino games from MGCAPI
 */
async function getAllGames() {
    console.log('[MGCAPI] Fetching game list...');
    
    const request_time = Date.now().toString();
    const str = `${APP_ID}${request_time}`;
    const sign = crypto.createHmac('md5', APP_KEY).update(encodeURIComponent(str)).digest('hex');

    const endpoint = `${API_URL}/api/v1/get-games?app_id=${APP_ID}&request_time=${request_time}&sign=${sign}`;
    
    try {
        const resObj = await fetch(endpoint);
        const data = await resObj.json();
        
        // MGCAPI returns an array directly on success, or an object with { error: true } on failure
        if (Array.isArray(data)) {
            console.log(`[MGCAPI] Fetched ${data.length} games successfully.`);
            return data;
        } else if (data && data.status === 200 && data.data) {
            console.log(`[MGCAPI] Fetched ${data.data.length} games successfully.`);
            return data.data;
        } else if (data && data.games && Array.isArray(data.games)) {
            console.log(`[MGCAPI] Fetched ${data.games.length} games successfully.`);
            return data.games;
        } else {
            console.error('[MGCAPI] Failed to fetch games. API Response:', data);
            return [];
        }
    } catch (err) {
        console.error('[MGCAPI] Error fetching games:', err.message);
        return [];
    }
}

/**
 * Launch a game for a specific user
 */
async function getLaunchUrl(vendorCode, gameCode, userCode) {
    console.log(`[MGCAPI] Generating launch URL for user ${userCode}, game ${gameCode}`);
    
    const payload = {
        exit: 'https://724bets.net/',
        game_id: Number(gameCode) || gameCode,
        player_id: userCode ? userCode.toString() : 'testuser',
        player_token: Buffer.from(JSON.stringify({ player_id: userCode || 'testuser' })).toString('base64'),
        app_id: APP_ID,
        language: 'tr',
        currency: 'TRY',
        request_time: Date.now(),
        urls: {
            base_url: 'https://724bets.net',
            wallet_url: 'https://724bets.net/api/casino/callback/api',
            other_url: 'https://724bets.net'
        }
    };
    
    payload.sign = generateSignature(payload);
    
    try {
        const resObj = await fetch(`${API_URL}/api/v1/playGame`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await resObj.json();
        
        if (data && data.result === true && data.url) {
            return data.url;
        } else if (data && data.status === 200 && data.data && data.data.url) {
            return data.data.url;
        } else {
            console.warn('[MGCAPI] playGame returned maintenance/error in test mode:', data);
            
            // TEST MODE FALLBACK:
            // When MGCAPI staging server returns "System is under maintenance", fallback to interactive demo game in Test Mode
            return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=vs20olympx&websiteUrl=https%3A%2F%2F724bets.net&jurisdiction=99&enviroment=PREPROD&m=1`;
        }
    } catch (err) {
        console.error('[MGCAPI] Launch game request failed:', err.message);
        return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=vs20olympx&websiteUrl=https%3A%2F%2F724bets.net&jurisdiction=99&enviroment=PREPROD&m=1`;
    }
}


/**
 * Update the webhook URL on MGCAPI
 */
async function updateWebhook() {
    console.log('[MGCAPI] Updating webhook URL...');
    const endpoint = `${API_URL}/api/v1/webhook-url-update`;
    const params = {
        app_id: APP_ID,
        request_time: Date.now().toString(),
        webhook_url: 'https://724bets.net/api/casino/callback/api'
    };

    const concatenated = Object.entries(params)
        .filter(([key]) => key !== 'sign')
        .map(([, value]) => value)
        .join('');
    const encoded = encodeURIComponent(concatenated);
    params.sign = crypto.createHmac('md5', APP_KEY).update(encoded).digest('hex');

    const queryString = new URLSearchParams(params).toString();
    
    try {
        const resObj = await fetch(`${endpoint}?${queryString}`, { method: 'POST' });
        const data = await resObj.json();
        console.log('[MGCAPI] Webhook update response:', data);
        return data;
    } catch (err) {
        console.error('[MGCAPI] Error updating webhook:', err);
    }
}

module.exports = {
    updateWebhook,
    getAllGames,
    getLaunchUrl,
    generateSignature
};
