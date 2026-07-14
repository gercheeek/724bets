const WebSocket = require('ws');

const ws = new WebSocket('wss://srv.tarafbet980.com/sport/?EIO=3&transport=websocket', {
    headers: {
        'Origin': 'https://tarafbet980.com',
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
            ws.send('42["subscribe-PreMatch",{"locale":"tr_TR"}]');
        }, 1000);
        setTimeout(() => {
            ws.send('42["subscribe-PreMatchEvents",{"locale":"tr_TR"}]');
        }, 2000);
    }
});

setTimeout(() => process.exit(0), 5000);
