const WebSocket = require('ws');
const { performance } = require('perf_hooks');

function measureSpeed(name, url, siteId) {
    return new Promise((resolve) => {
        const start = performance.now();
        let ws;
        try {
            ws = new WebSocket(url, {
                headers: { 'Origin': 'https://example.com', 'User-Agent': 'Mozilla/5.0' }
            });
        } catch(e) {
            console.log(`[${name}] Error:`, e.message);
            resolve(false);
            return;
        }

        let connectionTime;

        ws.on('open', () => {
            connectionTime = performance.now() - start;
            console.log(`[${name}] WS Bağlantı Süresi: ${connectionTime.toFixed(2)}ms`);
            
            const reqTime = performance.now();
            ws.send(JSON.stringify({
                command: 'request_session',
                params: { language: 'tur', site_id: siteId },
                rid: 'req_session'
            }));

            ws.on('message', (data) => {
                const msg = JSON.parse(data.toString());
                if (msg.rid === 'req_session') {
                    const responseTime = performance.now() - reqTime;
                    console.log(`[${name}] Sunucu Yanıt Süresi (Ping): ${responseTime.toFixed(2)}ms`);
                    console.log(`[${name}] Sunucu Hostu: ${msg.data?.host || 'Bilinmiyor'}`);
                    ws.close();
                    resolve({
                        connection: connectionTime,
                        ping: responseTime
                    });
                }
            });
        });

        ws.on('error', (err) => {
            console.log(`[${name}] Connection Error:`, err.message);
            resolve(false);
        });
    });
}

async function runTest() {
    console.log('--- 🚀 HIZ VE PING TESTİ BAŞLIYOR ---\n');
    
    console.log('1. Atekbet (Yeni İstediğiniz Adres) Test Ediliyor...');
    const atekbet = await measureSpeed('Atekbet', 'wss://eu-swarm-newm.atekbet272.com/ws?language=tur', 1);
    
    console.log('\n2. NoraBahis (Şu Anki Mevcut Sistem) Test Ediliyor...');
    const norabahis = await measureSpeed('NoraBahis', 'wss://eu-swarm-newm.norabahis779.com/ws?organization_id=928d43dd-1219-4ab0-b33f-0e180215781e&x-region=us-south1', 55);

    console.log('\n--- 📊 KARŞILAŞTIRMA SONUÇLARI ---');
    if (atekbet && norabahis) {
        console.log(`Atekbet Toplam Ping: ${atekbet.ping.toFixed(2)}ms | İlk Bağlantı: ${atekbet.connection.toFixed(2)}ms`);
        console.log(`NoraBahis Toplam Ping: ${norabahis.ping.toFixed(2)}ms | İlk Bağlantı: ${norabahis.connection.toFixed(2)}ms`);
        
        if (atekbet.ping < norabahis.ping) {
            console.log(`\n🏆 SONUÇ: Atekbet sunucusu verileri çekmekte ${(norabahis.ping - atekbet.ping).toFixed(2)}ms DAHA HIZLI!`);
        } else {
            console.log(`\n🏆 SONUÇ: NoraBahis sunucusu verileri çekmekte ${(atekbet.ping - norabahis.ping).toFixed(2)}ms DAHA HIZLI!`);
        }
    }
}

runTest();
