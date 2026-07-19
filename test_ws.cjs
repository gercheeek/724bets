const WebSocket = require('ws');

const ws = new WebSocket('wss://srv.tarafbet981.com/sport/?EIO=3&transport=websocket', {
    headers: {
        'Origin': 'https://tarafbet981.com',
        'User-Agent': 'Mozilla/5.0'
    }
});

ws.on('open', () => {
    console.log('Connected');
});

ws.on('message', (data) => {
    const msg = data.toString();
    console.log('MSG:', msg.substring(0, 100));
    if (msg === '2' || msg === 'ping') ws.send('3');
    if (msg.startsWith('0{')) {
        ws.send('40');
        setTimeout(() => {
            ws.send('42["subscribe-LiveEvents",{"locale":"tr_TR"}]');
        }, 1000);
    }
    if (msg.startsWith('42[')) {
        try {
            const parsed = JSON.parse(msg.substring(2));
            const payload = parsed[1];
            if (payload && payload.events) {
                console.log(`BINGO! Found ${payload.events.length} live events.`);
                process.exit(0);
            }
        } catch(e) {}
    }
});

setTimeout(() => process.exit(0), 5000);
