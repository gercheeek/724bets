const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
  console.log('Connected to proxy');
  ws.send('42["subscribe-LiveEvents",{"locale":"tr_TR"}]');
});

ws.on('message', (data) => {
  const msg = data.toString();
  if (msg.startsWith('42[')) {
    try {
      const parsed = JSON.parse(msg.substring(2));
      const payload = parsed[1];
      if (payload && payload.events && payload.events.length > 0) {
        fs.writeFileSync('dump.json', JSON.stringify(payload.events.slice(0, 5), null, 2));
        console.log('Dumped to dump.json');
        process.exit(0);
      }
    } catch(e) {}
  }
});
