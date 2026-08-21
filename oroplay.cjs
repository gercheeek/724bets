const fs = require('fs');
const dotenv = require('dotenv');
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const API_URL = process.env.OROPLAY_API_URL || 'https://bs.sxvwlkohlv.com/api/v2';
const CLIENT_ID = process.env.OROPLAY_CLIENT_ID;
const CLIENT_SECRET = process.env.OROPLAY_CLIENT_SECRET;

let cachedToken = null;
let tokenExpiration = 0; // timestamp in ms

let cachedGames = null;
let gamesExpiration = 0; // timestamp in ms
const GAMES_CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const https = require('https');

function fetchV4(url, options) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const reqOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {},
            family: 4 // FORCE IPv4
        };

        const req = https.request(reqOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ json: async () => JSON.parse(data) });
                } catch (e) {
                    reject(e);
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

async function getAuthToken() {
    if (cachedToken && Date.now() < tokenExpiration) {
        return cachedToken;
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error('OroPlay credentials missing in .env');
    }

    console.log('[OroPlay] Fetching new auth token...');
    try {
        const response = await fetchV4(`${API_URL}/auth/createtoken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
            body: JSON.stringify({
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET
            })
        });

        const data = await response.json();
        
        if (data.token) {
            cachedToken = data.token;
            // API returns expiration in seconds (e.g. 1716257131). We subtract 60s as a safety buffer.
            tokenExpiration = (data.expiration * 1000) - 60000;
            console.log('[OroPlay] Token fetched successfully.');
            return cachedToken;
        } else {
            console.error('[OroPlay] Token fetch failed:', data);
            throw new Error('Failed to fetch OroPlay token');
        }
    } catch (err) {
        console.error('[OroPlay] Network error fetching token:', err);
        throw err;
    }
}

async function getVendors() {
    const token = await getAuthToken();
    const response = await fetchV4(`${API_URL}/vendors/list`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    if (data.success && data.message) {
        return data.message;
    }
    throw new Error('Failed to fetch vendors');
}

async function getGamesForVendor(vendorCode) {
    const token = await getAuthToken();
    const response = await fetchV4(`${API_URL}/games/list`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            vendorCode: vendorCode,
            language: "tr"
        })
    });

    const data = await response.json();
    if (data.success && data.message) {
        return data.message;
    }
    return [];
}

async function getAllGames() {
    // Return cached games if valid
    if (cachedGames && Date.now() < gamesExpiration) {
        return cachedGames;
    }

    console.log('[OroPlay] Fetching game list from API...');
    try {
        const vendors = await getVendors();
        let allGames = [];
        
        const gamdomDict = new Map();
        try {
            const mapPath = require('path').join(__dirname, 'gamdom_image_map.json');
            if (fs.existsSync(mapPath)) {
                const gamdomMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
                if (Array.isArray(gamdomMap)) {
                    gamdomMap.forEach(item => {
                        if (item && item.name && item.game_image) {
                            const normKey = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                            if (normKey && !gamdomDict.has(normKey)) {
                                gamdomDict.set(normKey, item.game_image);
                            }
                        }
                    });
                    console.log(`[OroPlay] Indexed ${gamdomDict.size} Gamdom images from ${gamdomMap.length} total entries.`);
                }
            }
        } catch (e) {
            console.error('[OroPlay] Error loading gamdom_image_map.json:', e);
        }
        
        // Loop sequentially to avoid rate limit (5 req / 30s for tokens, let's be safe for games too)
        for (const vendor of vendors) {
            try {
                console.log(`[OroPlay] Fetching games for vendor: ${vendor.name} (${vendor.vendorCode})`);
                const games = await getGamesForVendor(vendor.vendorCode);
                
                // Map OroPlay format to CasinoLobbyGame format
                const mappedGames = games.map((g, index) => {
                    const isLive = vendor.type === 1; // 1: live casino, 2: slot, 3: mini-game
                    const rawThumb = (g.thumbnail || g.image || g.img || '').trim();
                    const finalImage = rawThumb.length > 5 ? rawThumb : '';

                    return {
                        id: `${g.vendorCode}-${g.gameCode}`,
                        name: g.gameName,
                        provider: g.provider || vendor.name,
                        type: isLive ? 'live' : 'slot',
                        themeColor: isLive ? 'from-[#F50057] to-[#311B92]' : 'from-[#00E5FF] to-[#1A237E]',
                        image: finalImage,
                        isMapped: !!rawThumb,
                        isActive: !g.underMaintenance,
                        order: index,
                        vendorCode: g.vendorCode,
                        gameCode: g.gameCode
                    };
                });
                
                allGames = allGames.concat(mappedGames);
            } catch (err) {
                console.error(`[OroPlay] Error fetching games for vendor ${vendor.vendorCode}:`, err);
            }
        }
        
        cachedGames = allGames;
        gamesExpiration = Date.now() + GAMES_CACHE_DURATION;
        console.log(`[OroPlay] Fetched total ${allGames.length} games and cached.`);
        return allGames;
    } catch (err) {
        console.error('[OroPlay] Failed to aggregate games:', err);
        throw err;
    }
}

async function getLaunchUrl(vendorCode, gameCode, userCode = "demo-user") {
    const token = await getAuthToken();
    const response = await fetchV4(`${API_URL}/game/launch-url`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            vendorCode: vendorCode,
            gameCode: gameCode,
            userCode: userCode, // In a real app, this should be the logged-in user's ID
            language: "tr",
            theme: 1
        })
    });

    const data = await response.json();
    console.log('[OroPlay Launch Data]:', JSON.stringify(data));
    if (data.success && data.message) {
        return data.message;
    }
    throw new Error('Failed to fetch launch URL: ' + JSON.stringify(data));
}

async function getAgentBalance() {
    const token = await getAuthToken();
    const response = await fetchV4(`${API_URL}/agent/balance`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    if (data.success) {
        return data.message;
    }
    return 0;
}

async function createUser(userCode) {
    try {
        const token = await getAuthToken();
        const response = await fetchV4(`${API_URL}/user/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userCode })
        });
        return await response.json();
    } catch (e) {
        console.error('[OroPlay] createUser error:', e);
        return { success: false, error: e.message };
    }
}

async function depositUser(userCode, balance, orderNo = `DEP_${Date.now()}`) {
    try {
        const token = await getAuthToken();
        const response = await fetchV4(`${API_URL}/user/deposit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                userCode, 
                balance: parseFloat(balance || 0), 
                orderNo 
            })
        });
        return await response.json();
    } catch (e) {
        console.error('[OroPlay] depositUser error:', e);
        return { success: false, error: e.message };
    }
}

async function withdrawUser(userCode, balance, orderNo = `WTH_${Date.now()}`) {
    try {
        const token = await getAuthToken();
        const response = await fetchV4(`${API_URL}/user/withdraw`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                userCode, 
                balance: parseFloat(balance || 0), 
                orderNo 
            })
        });
        return await response.json();
    } catch (e) {
        console.error('[OroPlay] withdrawUser error:', e);
        return { success: false, error: e.message };
    }
}

module.exports = {
    getAuthToken,
    getVendors,
    getAllGames,
    getLaunchUrl,
    getAgentBalance,
    createUser,
    depositUser,
    withdrawUser
};
