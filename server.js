import { WebSocketServer, WebSocket } from 'ws';
import express from 'express';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());

// Prevent proxy from crashing on unexpected errors
process.on('uncaughtException', (err) => {
    console.error('🔥 [CRITICAL] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 [CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Heartbeat & Stale Connection Cleaner Interval
const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

wss.on('close', () => {
    clearInterval(interval);
});

const targetWsUrlBase = 'wss://srv.tarafbet981.com/sport/?EIO=3&transport=websocket';
const targetHeaders = {
    'Origin': 'https://tarafbet981.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'tr,en-US;q=0.9,en;q=0.8'
};

function parseAndFilterMessage(msg) {
    if (!msg.startsWith('42[')) return msg;
    try {
        const parsed = JSON.parse(msg.substring(2));
        const eventName = parsed[0];
        let payload = parsed[1];

        if (payload && (payload.events || payload.data?.events || Array.isArray(payload))) {
            let events = payload.events || payload.data?.events || (Array.isArray(payload) ? payload : null);
            if (events && Array.isArray(events)) {
                const cleanedEvents = [];
                for (const ev of events) {
                    const sportName = (ev.sport?.name || ev.data?.sport?.name || '').toLowerCase();
                    const isSupportedSport = ['soccer', 'futbol', 'football', 'basketball', 'basketbol', 'tennis', 'tenis', 'volleyball', 'voleybol', 'handball', 'hentbol', 'ice hockey', 'buz hokeyi', 'table tennis', 'masa tenisi', 'esports', 'e-spor', 'counter-strike', 'dota', 'league of legends', 'valorant'].some(s => sportName.includes(s));
                    
                    if (!isSupportedSport && sportName !== '') continue;

                    const cleanedEv = {
                        id: ev.id,
                        group_markets: ev.group_markets,
                        removed_markets: ev.removed_markets,
                    };

                    if (ev.data) {
                        const d = ev.data;
                        cleanedEv.data = {
                            id: d.id,
                            status: d.status,
                            match_time: d.match_time,
                            score: d.score,
                            isLive: d.isLive,
                            start_time: d.start_time,
                            sport: d.sport ? { name: d.sport.name } : undefined,
                            tournament: d.tournament ? { name: d.tournament.name } : undefined,
                            country: d.country ? { name: d.country.name } : undefined,
                            participants: d.participants ? { home: d.participants.home, away: d.participants.away } : undefined,
                            group_markets: d.group_markets
                        };
                    }

                    cleanedEvents.push(cleanedEv);
                }

                if (payload.events) payload.events = cleanedEvents;
                else if (payload.data?.events) payload.data.events = cleanedEvents;
                else if (Array.isArray(payload)) payload = cleanedEvents;
            }
        }
        
        return `42${JSON.stringify([eventName, payload])}`;
    } catch (e) {
        return msg;
    }
}

wss.on('connection', (ws, req) => {
    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    // Extract language from client request url (e.g. /?lang=tr)
    let lang = 'tur'; // default
    if (req.url && req.url.includes('lang=')) {
        const params = new URLSearchParams(req.url.split('?')[1]);
        if (params.get('lang') === 'tr') lang = 'tur';
        else if (params.get('lang') === 'en') lang = 'en';
        else if (params.get('lang')) lang = params.get('lang');
    }
    
    const targetWsUrl = `${targetWsUrlBase}&language=${lang}&lang=${lang}`;
    
    console.log(`[${new Date().toISOString()}] New client connected with lang: ${lang}`);
    console.log('💻 [LOCAL] Frontend client connected. Opening new target connection...');
    
    const targetSocket = new WebSocket(targetWsUrl, { headers: targetHeaders });
    let pingIntervalId = null;
    let messageBuffer = [];
    let isTargetReady = false;

    targetSocket.on('open', () => {
        console.log('✅ [PROXY] Connected to Tarafbet for client!');
    });

    targetSocket.on('message', (data) => {
        const msg = data.toString();
        
        // Handle Engine.IO Ping/Pong
        if (msg === '2' || msg === 'ping') {
            targetSocket.send('3');
            // Do NOT return here. Let the proxy forward the '2' to the frontend 
            // so the frontend knows the connection is alive!
        }

        if (msg.startsWith('0{')) {
            try {
                const initData = JSON.parse(msg.substring(1));
                if (initData.pingInterval) {
                    pingIntervalId = setInterval(() => {
                        if (targetSocket.readyState === WebSocket.OPEN) {
                            targetSocket.send('2');
                        }
                    }, initData.pingInterval);
                }
                
                // Send Socket.IO connect
                if (targetSocket.readyState === WebSocket.OPEN) {
                    targetSocket.send('40');
                    isTargetReady = true;
                    if (messageBuffer.length > 0) {
                        for (const bmsg of messageBuffer) {
                            targetSocket.send(bmsg);
                        }
                        messageBuffer = [];
                    }
                }
            } catch (e) {
                console.error('Parse error:', e);
            }
        }

        if (ws.readyState === WebSocket.OPEN) {
            const filteredMsg = parseAndFilterMessage(msg);
            ws.send(filteredMsg);
        }
    });

    targetSocket.on('close', () => {
        console.log('⚠️ [PROXY] Target connection closed.');
        if (pingIntervalId) clearInterval(pingIntervalId);
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
    });

    targetSocket.on('error', (err) => {
        console.error('❌ [PROXY] Target error:', err.message);
    });

    ws.on('message', (message) => {
        const msg = message.toString();
        if (isTargetReady && targetSocket.readyState === WebSocket.OPEN) {
            targetSocket.send(msg);
        } else {
            messageBuffer.push(msg);
        }
    });

    ws.on('close', () => {
        console.log('💻 [LOCAL] Frontend disconnected. Closing target connection.');
        if (pingIntervalId) clearInterval(pingIntervalId);
        if (targetSocket.readyState === WebSocket.OPEN) {
            targetSocket.close();
        }
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`🚀 [PROXY] Server running on http://localhost:${PORT}`);
    console.log(`🚀 [PROXY] WebSocket listening on ws://localhost:${PORT}`);
});
