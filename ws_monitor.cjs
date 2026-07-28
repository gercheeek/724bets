const WebSocket = require('ws');
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m"
};

const WS_URL = 'ws://localhost:4000/?lang=tr';

let messageCount = 0;
let lastMessageTime = Date.now();
let connectionStartTime = Date.now();
let disconnects = 0;
let isConnected = false;

function connect() {
  console.log(`${colors.cyan}[MONITOR] Bağlantı kuruluyor: ${WS_URL}${colors.reset}`);
  const ws = new WebSocket(WS_URL);

  ws.on('open', () => {
    isConnected = true;
    console.log(`${colors.green}[MONITOR] ✅ Canlı Bağlantı Başarılı!${colors.reset}`);
    ws.send('42["subscribe-LiveEvents",{"locale":"tur"}]');
  });

  ws.on('message', (data) => {
    messageCount++;
    lastMessageTime = Date.now();
    const msg = data.toString();
    
    // Yalnızca veri paketlerini ölç (ping pongları atla)
    if (msg.startsWith('42[')) {
      const sizeBytes = Buffer.byteLength(msg, 'utf8');
      const sizeKb = (sizeBytes / 1024).toFixed(2);
      // Ekrana sürekli log basmak yerine sadece çok büyük paketlerde uyarı verebiliriz, 
      // ancak anlık hızı göstermek için saniyelik interval kullanacağız.
    }
  });

  ws.on('close', () => {
    isConnected = false;
    disconnects++;
    console.log(`${colors.red}[MONITOR] ❌ Bağlantı Koptu! (Toplam Kopma: ${disconnects})${colors.reset}`);
    setTimeout(connect, 3000); // 3 saniye sonra tekrar dene
  });

  ws.on('error', (err) => {
    console.log(`${colors.red}[MONITOR] ⚠️ Hata: ${err.message}${colors.reset}`);
  });
}

connect();

// Her saniye ekrana istatistik bas
setInterval(() => {
  if (!isConnected) return;
  
  const now = Date.now();
  const uptimeSeconds = Math.floor((now - connectionStartTime) / 1000);
  const timeSinceLastMessage = now - lastMessageTime;
  
  let speedColor = colors.green;
  if (timeSinceLastMessage > 2000) speedColor = colors.yellow;
  if (timeSinceLastMessage > 5000) speedColor = colors.red;

  process.stdout.write(`\r${colors.blue}[İSTATİSTİK]${colors.reset} Uptime: ${uptimeSeconds}s | Gelen Paket/Sn: ${messageCount} | Son Paket Gecikmesi (Latency): ${speedColor}${timeSinceLastMessage}ms${colors.reset} | Kopmalar: ${disconnects}    `);
  
  // Saniyelik sayacı sıfırla
  messageCount = 0;
}, 1000);
