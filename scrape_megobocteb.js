import puppeteer from 'puppeteer';
import { WebSocketServer } from 'ws';

const TARGET_URL = 'https://sport.megobocteb.com/'; // Load the main page to get all live events in the background
const PORT = 4000;

// Setup local WebSocket Server
const wss = new WebSocketServer({ port: PORT });
console.log(`🚀 Local Proxy Server listening on ws://localhost:${PORT}`);
console.log(`⚠️ Make sure your old server.js is STOPPED before running this!`);

let latestMessages = new Set(); // Store the most recent messages to send to new clients immediately

wss.on('connection', (ws) => {
    console.log('💻 Frontend React client connected!');
    // Send cached initial data
    for (const msg of latestMessages) {
        ws.send(msg);
    }
    
    ws.on('close', () => {
        console.log('💻 Frontend React client disconnected.');
    });
});

async function run() {
    console.log('Starting Puppeteer...');
    
    // Launch browser (headless: false helps bypass Cloudflare)
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1280,720',
            '--disable-blink-features=AutomationControlled'
        ]
    });

    const page = await browser.newPage();
    
    // Attempt to mask webdriver
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    await page.setViewport({ width: 1280, height: 720 });
    
    const client = await page.target().createCDPSession();
    await client.send('Network.enable');

    console.log(`🌐 Navigating to ${TARGET_URL}...`);
    
    // Listen to all websocket traffic from the page
    client.on('Network.webSocketFrameReceived', ({ response }) => {
        if (response && response.payloadData) {
            const msg = response.payloadData;
            
            // Only care about Socket.IO messages that might contain data
            if (msg.startsWith('42[')) {
                
                // Keep the last 50 messages in cache for new connections
                latestMessages.add(msg);
                if (latestMessages.size > 50) {
                    const first = latestMessages.values().next().value;
                    latestMessages.delete(first);
                }

                // Broadcast to all connected React frontends
                wss.clients.forEach((client) => {
                    if (client.readyState === 1) { // WebSocket.OPEN
                        client.send(msg);
                    }
                });
            }
        }
    });

    try {
        await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        console.log('✅ Page loaded! You may need to manually solve a Cloudflare captcha in the browser if it appears.');
    } catch (err) {
        console.error('Error navigating to page:', err.message);
    }
    
    console.log('📡 Intercepting WebSocket traffic and broadcasting to React frontend...');
}

run();
