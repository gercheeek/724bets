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

const targetWsUrl = 'wss://srv.tarafbet980.com/sport/?EIO=3&transport=websocket';
const targetHeaders = {
    'Origin': 'https://tarafbet980.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'tr,en-US;q=0.9,en;q=0.8'
};

wss.on('connection', (ws) => {
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
            ws.send(msg);
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
