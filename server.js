import { WebSocketServer, WebSocket } from 'ws';
import express from 'express';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const targetWsUrl = 'wss://srv.tarafbet980.com/sport/?EIO=3&transport=websocket';
const targetHeaders = {
    'Origin': 'https://tarafbet980.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'tr,en-US;q=0.9,en;q=0.8'
};

let targetSocket = null;
let connectedClients = new Set();
let pingIntervalId = null;

function connectToTarget() {
    if (targetSocket) {
        return;
    }

    console.log('🔗 [PROXY] Connecting to Tarafbet...');
    targetSocket = new WebSocket(targetWsUrl, { headers: targetHeaders });

    targetSocket.on('open', () => {
        console.log('✅ [PROXY] Connected to Tarafbet target server!');
    });

    targetSocket.on('message', (data) => {
        const msg = data.toString();
        
        // Handle Engine.IO Ping/Pong
        // In Engine.IO v3, client sends ping ('2'), server sends pong ('3').
        // Sometimes server sends ping, client sends pong. We handle both just in case.
        if (msg === '2' || msg === 'ping') {
            targetSocket.send('3');
            return;
        }

        // Handle initial connection payload '0{...}' which contains pingInterval
        if (msg.startsWith('0{')) {
            try {
                const initData = JSON.parse(msg.substring(1));
                console.log('📡 [PROXY] Received init data:', initData);
                
                // Set up ping interval
                if (initData.pingInterval) {
                    if (pingIntervalId) clearInterval(pingIntervalId);
                    pingIntervalId = setInterval(() => {
                        if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
                            targetSocket.send('2'); // Send ping
                        }
                    }, initData.pingInterval);
                }
            } catch (e) {
                console.error('Failed to parse init data:', e);
            }
        }
        
        // Broadcast all other messages to connected frontend clients
        for (const client of connectedClients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        }
    });

    targetSocket.on('close', () => {
        console.log('⚠️ [PROXY] Disconnected from Tarafbet. Reconnecting in 5s...');
        targetSocket = null;
        if (pingIntervalId) {
            clearInterval(pingIntervalId);
            pingIntervalId = null;
        }
        setTimeout(connectToTarget, 5000);
    });

    targetSocket.on('error', (err) => {
        console.error('❌ [PROXY] Target WS Error:', err.message);
    });
}

// Start the target connection
connectToTarget();

// Handle local frontend clients connecting to this proxy
wss.on('connection', (ws) => {
    console.log('💻 [LOCAL] Frontend client connected to Proxy');
    connectedClients.add(ws);

    ws.on('message', (message) => {
        const msg = message.toString();
        // If frontend sends a message, forward it to the target
        if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
            console.log('⬆️ [LOCAL->TARGET] Forwarding:', msg.substring(0, 100));
            targetSocket.send(msg);
        } else {
            console.log('⚠️ [LOCAL] Target not connected, cannot forward message:', msg.substring(0, 100));
        }
    });

    ws.on('close', () => {
        console.log('💻 [LOCAL] Frontend client disconnected');
        connectedClients.delete(ws);
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`🚀 [PROXY] Server running on http://localhost:${PORT}`);
    console.log(`🚀 [PROXY] WebSocket listening on ws://localhost:${PORT}`);
});
