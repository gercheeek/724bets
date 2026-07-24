const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('wss://srv.tarafbet981.com/sport/?EIO=3&transport=websocket', {
    headers: {
        'Origin': 'https://tarafbet981.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
});

ws.on('open', () => {
    console.log('Connected to Tarafbet WS for Odds Analysis...');
});

ws.on('message', (data) => {
    const msg = data.toString();
    if (msg === '2' || msg === 'ping') ws.send('3');
    if (msg.startsWith('0{')) {
        ws.send('40');
        setTimeout(() => {
            console.log('Sending subscription for Live matches...');
            ws.send('42["subscribe-LiveEvents",{"locale":"tr_TR"}]');
        }, 500);
    }
    
    if (msg.startsWith('42[')) {
        try {
            const parsed = JSON.parse(msg.substring(2));
            const eventName = parsed[0];
            const payload = parsed[1];
            
            let events = [];
            if (payload && payload.events) events = payload.events;
            else if (payload && payload.data && payload.data.events) events = payload.data.events;
            else if (Array.isArray(payload)) events = payload;
            
            if (events && events.length > 0) {
                console.log(`Found ${events.length} events. Dumping to tarafbet_dump.json...`);
                fs.writeFileSync('tarafbet_dump.json', JSON.stringify(events, null, 2));
                process.exit(0);
            }

        } catch (e) {
            // Ignore parse errors
        }
    }
});

setTimeout(() => {
    console.log('Timeout waiting for data.');
    process.exit(1);
}, 10000);
