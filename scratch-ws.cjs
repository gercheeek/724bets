const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
    console.log('Connected');
    ws.send('40');
});

ws.on('message', (msg) => {
    console.log('Msg:', msg.toString());
    if (msg.toString().startsWith('40')) {
        setTimeout(() => {
            console.log('Sending subscribe...');
            ws.send('42["subscribe-LiveEvents",{"locale":"tr_TR"}]');
        }, 100);
    }
});
