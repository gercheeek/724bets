
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

let gamesCache = [];

// Helper to resolve accurate symbol for any game
function resolveSymbol(gameCode, vendorCode) {
    if (!gameCode) return 'vs20olympx';
    const found = gamesCache.find(g => 
        (g.id && g.id.toString() === gameCode.toString()) || 
        (g.game_code && g.game_code.toString() === gameCode.toString()) ||
        (g.code && g.code.toString() === gameCode.toString())
    );

    const imageUrl = (found && (found.image || found.imageUrl || found.img)) || '';
    if (imageUrl) {
        const match = imageUrl.match(/(vs[0-9a-z_]+)\.(?:jpg|png|webp|avif)/i);
        if (match && match[1]) return match[1].toLowerCase();
    }

    const name = ((found && (found.name || found.title)) || gameCode.toString()).toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Exact mapping matches
    if (name.includes('sweetbonanza1000')) return 'vs20fruitswx';
    if (name.includes('sweetbonanza')) return 'vs20fruitsw';
    if (name.includes('gatesofolympus1000')) return 'vs20olympx';
    if (name.includes('gatesofolympus') || name.includes('olympus')) return 'vs20olympgate';
    if (name.includes('sugarrush1000')) return 'vs20sugarrushx';
    if (name.includes('sugarrush')) return 'vs20sugarrush';
    if (name.includes('starlightprincess1000')) return 'vs20starlightx';
    if (name.includes('starlightprincess') || name.includes('starlight')) return 'vs20starlight';
    if (name.includes('bigbasssplash')) return 'vs10txbigbass';
    if (name.includes('bigbassbonanza') || name.includes('bigbass')) return 'vs10bbbonanza';
    if (name.includes('doghouse') || name.includes('dog')) return 'vs20doghouse';
    if (name.includes('fruitparty')) return 'vs20fruitparty';
    if (name.includes('zeus') || name.includes('hades')) return 'vs20zeushades';
    if (name.includes('wolfgold') || name.includes('wolf')) return 'vs25wolfgold';
    if (name.includes('wildwestgold') || name.includes('wildwest')) return 'vs40wildwest';
    if (name.includes('joker')) return 'vs5joker';
    if (name.includes('crown') || name.includes('king')) return 'vs10crownfire';
    if (name.includes('diamond') || name.includes('gem')) return 'vs20goldfever';
    if (name.includes('hot') || name.includes('fire') || name.includes('superhot') || name.includes('burning')) return 'vs20firehot';
    if (name.includes('buffalo') || name.includes('bison')) return 'vswaysbuffalo';
    if (name.includes('lion') || name.includes('tiger')) return 'vswayslions';
    if (name.includes('book') || name.includes('tut') || name.includes('ra')) return 'vs10bookoftut';
    if (name.includes('cleopatra') || name.includes('egypt')) return 'vs40cleopatra';
    if (name.includes('gold') || name.includes('pig') || name.includes('money')) return 'vs25goldparty';
    if (name.includes('kraken')) return 'vs20kraken';

    const POOL = [
        'vs20fruitsw', 'vs10txbigbass', 'vs20sugarrush', 'vs20starlight',
        'vs20doghouse', 'vs20fruitparty', 'vs20zeushades', 'vs25wolfgold',
        'vs40wildwest', 'vs10crownfire', 'vs5joker', 'vs20cleocatra',
        'vs20goldfever', 'vs20firehot', 'vs10bookoftut'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
    return POOL[Math.abs(hash) % POOL.length];
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
        
        let list = [];
        if (Array.isArray(data)) {
            list = data;
        } else if (data && data.status === 200 && data.data) {
            list = data.data;
        } else if (data && data.games && Array.isArray(data.games)) {
            list = data.games;
        }

        if (list.length > 0) {
            gamesCache = list;
            console.log(`[MGCAPI] Fetched and cached ${list.length} games successfully.`);
            return list;
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
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(3000)
        });
        const data = await resObj.json();
        
        if (data && data.result === true && data.url) {
            return data.url;
        } else if (data && data.status === 200 && data.data && data.data.url) {
            return data.data.url;
        } else {
            console.warn('[MGCAPI] playGame returned maintenance/error in test mode for game:', gameCode);
            const matchedSymbol = resolveSymbol(gameCode, vendorCode);
            return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${matchedSymbol}&websiteUrl=https%3A%2F%2F724bets.net&jurisdiction=99&enviroment=PREPROD&m=1`;
        }
    } catch (err) {
        console.warn('[MGCAPI] Launch game fast fallback:', err.message);
        const matchedSymbol = resolveSymbol(gameCode, vendorCode);
        return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${matchedSymbol}&websiteUrl=https%3A%2F%2F724bets.net&jurisdiction=99&enviroment=PREPROD&m=1`;
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
