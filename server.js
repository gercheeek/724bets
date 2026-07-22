import { WebSocketServer, WebSocket } from 'ws';
import express from 'express';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());

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

const PRIMARY_WS_BASE = 'wss://srv.tarafbet981.com/sport/?EIO=3&transport=websocket';

const primaryHeaders = {
    'Origin': 'https://tarafbet981.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
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
                                current_score: d.current_score,
                                scores: d.scores,
                                minute: d.minute,
                                extended_status: d.extended_status,
                                isLive: d.isLive,
                                is_live_betting: d.is_live_betting,
                                start_time: d.start_time,
                                start_ts: d.start_ts,
                                sport: d.sport ? { name: d.sport.name } : undefined,
                                tournament: d.tournament ? { name: d.tournament.name } : undefined,
                                country: d.country ? { name: d.country.name } : undefined,
                                participants: d.participants,
                                group_markets: d.group_markets,
                                stats: d.stats,
                                markets_count: d.markets_count
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

    let lang = 'tur';
    if (req.url && req.url.includes('lang=')) {
        const params = new URLSearchParams(req.url.split('?')[1]);
        if (params.get('lang') === 'tr') lang = 'tur';
        else if (params.get('lang') === 'en') lang = 'en';
        else if (params.get('lang')) lang = params.get('lang');
    }

    console.log(`[${new Date().toISOString()}] New client connected with lang: ${lang}`);

    let activeTargetSocket = null;
    let isFallbackMode = false;
    let pingIntervalId = null;
    let messageBuffer = [];
    let isTargetReady = false;

    const connectToTarget = (url, headers) => {
        console.log(`💻 [LOCAL] Connecting to PRIMARY (NoraBet Swarm)...`);
        
        const socket = new WebSocket(url, { headers });

        socket.on('open', () => {
            console.log(`✅ [PROXY] Connected to PRIMARY (NoraBet Swarm)!`);
            activeTargetSocket = socket;
        });

        socket.on('message', (data) => {
            const msg = data.toString();
            
            if (msg === '2' || msg === 'ping') {
                socket.send('3');
            }

            if (msg.startsWith('0{')) {
                try {
                    const initData = JSON.parse(msg.substring(1));
                    if (initData.pingInterval) {
                        if (pingIntervalId) clearInterval(pingIntervalId);
                        pingIntervalId = setInterval(() => {
                            if (socket.readyState === WebSocket.OPEN) {
                                socket.send('2');
                            }
                        }, initData.pingInterval);
                    }
                    
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send('40');
                        isTargetReady = true;
                        if (messageBuffer.length > 0) {
                            for (const bmsg of messageBuffer) {
                                socket.send(bmsg);
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

        socket.on('error', (err) => {
            console.error(`❌ [PROXY] PRIMARY target error:`, err.message);
        });

        socket.on('close', () => {
            console.log(`⚠️ [PROXY] PRIMARY target connection closed.`);
            if (pingIntervalId) clearInterval(pingIntervalId);
            
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        });

        return socket;
    };

    const primaryUrl = `${PRIMARY_WS_BASE}&language=${lang}&lang=${lang}`;
    connectToTarget(primaryUrl, primaryHeaders);

    ws.on('message', (message) => {
        const msg = message.toString();
        if (isTargetReady && activeTargetSocket && activeTargetSocket.readyState === WebSocket.OPEN) {
            activeTargetSocket.send(msg);
        } else {
            messageBuffer.push(msg);
        }
    });

    ws.on('close', () => {
        console.log('💻 [LOCAL] Frontend disconnected.');
        if (pingIntervalId) clearInterval(pingIntervalId);
        if (activeTargetSocket && activeTargetSocket.readyState === WebSocket.OPEN) {
            activeTargetSocket.close();
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [PROXY] Server running on http://0.0.0.0:${PORT} (Accepting external connections)`);
    console.log(`🚀 [PROXY] WebSocket listening on ws://0.0.0.0:${PORT}`);
});
