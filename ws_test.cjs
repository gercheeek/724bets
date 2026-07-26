const WebSocket = require('ws');

const url = 'wss://ws.2001marsbahis.com/socket.io/?EIO=4&transport=websocket';
const startTime = Date.now();

console.log(`Bağlanıyor: ${url}...`);

const ws = new WebSocket(url, {
  handshakeTimeout: 5000,
  rejectUnauthorized: false
});

ws.on('open', () => {
  const timeTaken = Date.now() - startTime;
  console.log(`✅ Bağlantı başarılı!`);
  console.log(`🚀 Bağlantı süresi (Gecikme/Ping): ${timeTaken} ms`);
  
  // Engine.IO ping
  ws.send('2');
  
  setTimeout(() => {
    ws.close();
  }, 5000);
});

ws.on('message', (data) => {
  console.log(`📥 Gelen Mesaj: ${data.toString()}`);
});

ws.on('error', (err) => {
  console.error(`❌ Bağlantı hatası: ${err.message}`);
});

ws.on('close', (code, reason) => {
  console.log(`Bağlantı kapandı. Kod: ${code}`);
});
