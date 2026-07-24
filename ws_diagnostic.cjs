const WebSocket = require('ws');
const dns = require('dns');
const http = require('http');
const url = require('url');

const WS_URL = process.argv[2];
const IS_SIGNALR = process.argv[3] === '--signalr';

if (!WS_URL) {
    console.log("==========================================================");
    console.log("KULLANIM: node ws_diagnostic.cjs <WS_URL> [--signalr]");
    console.log("Örnek (Normal):   node ws_diagnostic.cjs wss://example.com/ws");
    console.log("Örnek (SignalR):  node ws_diagnostic.cjs wss://example.com/hub --signalr");
    console.log("==========================================================\n");
    process.exit(1);
}

let messageCount = 0;
let totalBytes = 0;
let lastPingTime = 0;
let latency = 0;
let isConnected = false;

function getServerInfo(wsUrl) {
    try {
        const parsedUrl = new url.URL(wsUrl);
        const hostname = parsedUrl.hostname;
        
        dns.lookup(hostname, (err, address) => {
            if (err) {
                console.log(`[Sunucu Bilgisi] DNS Çözümleme Hatası: ${err.message}`);
                return;
            }
            console.log(`[Sunucu Bilgisi] Hedef Host: ${hostname} -> IP: ${address}`);
            
            http.get(`http://ip-api.com/json/${address}`, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.status === 'success') {
                             console.log(`[Sunucu Bilgisi] Lokasyon: ${parsed.city}, ${parsed.country} | Sağlayıcı (ISP/Cloud): ${parsed.isp} / ${parsed.org}`);
                        } else {
                             console.log(`[Sunucu Bilgisi] Lokasyon alınamadı.`);
                        }
                    } catch(e) {}
                });
            }).on('error', () => {
                console.log(`[Sunucu Bilgisi] IP Lokasyon sorgusu başarısız.`);
            });
        });
    } catch (error) {
        console.log(`[Sunucu Bilgisi] Geçersiz URL formatı: ${error.message}`);
    }
}

setInterval(() => {
    if (!isConnected) return;
    
    const msgsPerSec = (messageCount / 5).toFixed(2);
    const avgSizeKB = messageCount > 0 ? ((totalBytes / messageCount) / 1024).toFixed(3) : 0;
    const totalFlowKBps = ((totalBytes / 5) / 1024).toFixed(2);
    
    console.log(`\n--- [CANLI RAPOR] ---`);
    console.log(`📡 Gecikme (Ping):    ${latency} ms`);
    console.log(`⚡ Veri Akış Hızı:    ${msgsPerSec} mesaj/sn | ${totalFlowKBps} KB/sn`);
    console.log(`📦 Ort. Mesaj Boyutu: ${avgSizeKB} KB`);
    console.log(`---------------------\n`);
    
    messageCount = 0;
    totalBytes = 0;
    
}, 5000);

function connect() {
    console.log(`[Bağlantı] ${WS_URL} adresine bağlanılıyor...`);
    const ws = new WebSocket(WS_URL);
    getServerInfo(WS_URL);

    ws.on('open', () => {
        isConnected = true;
        console.log(`[Bağlantı] Başarıyla bağlanıldı! Teşhis ve analiz başladı...\n`);
        
        if (IS_SIGNALR) {
            console.log(`[SignalR] SignalR handshake (el sıkışma) paketi gönderiliyor...`);
            ws.send(JSON.stringify({ protocol: "json", version: 1 }) + '\x1e');
        }
        
        setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                lastPingTime = Date.now();
                ws.ping();
            }
        }, 2000);
    });

    ws.on('pong', () => {
        latency = Date.now() - lastPingTime;
    });

    ws.on('message', (data) => {
        messageCount++;
        totalBytes += Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);
    });

    ws.on('close', (code, reason) => {
        isConnected = false;
        console.log(`\n❌ [Bağlantı] Koptu veya Kapatıldı. Kod: ${code}, Neden: ${reason.toString() || 'Bilinmiyor'}`);
    });

    ws.on('error', (error) => {
        isConnected = false;
        console.log(`\n⚠️ [HATA] WebSocket Hatası: ${error.message}`);
    });
}

connect();
