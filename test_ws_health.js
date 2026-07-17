import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:4000');
let messageCount = 0;
let payloadCount = 0;
let lastMessageTime = Date.now();
const startTime = Date.now();
let isAlive = false;

ws.on('open', () => {
    console.log('[TEST] Bağlantı Kuruldu: ws://localhost:4000');
    isAlive = true;
    
    // Subscribe to Live Events (as TarafView does)
    ws.send('42["subscribe-LiveEvents",{"locale":"tr_TR"}]');
    console.log('--- Abonelik İsteği Gönderildi ---');
});

ws.on('message', (data) => {
    const msg = data.toString();
    messageCount++;
    lastMessageTime = Date.now();
    
    if (msg.startsWith('42[')) {
        payloadCount++;
        // Gelen veri paketinin boyutunu hesaplayalım (KB cinsinden)
        const kbSize = (Buffer.byteLength(msg, 'utf8') / 1024).toFixed(2);
        
        try {
            const parsed = JSON.parse(msg.substring(2));
            const payloadType = parsed[0];
            const eventData = parsed[1];
            
            let eventCount = 0;
            if (eventData && eventData.events) {
                eventCount = Object.keys(eventData.events).length;
            }
            
            console.log(`[VERİ ALINDI] +${Date.now() - startTime}ms | Tip: ${payloadType} | Boyut: ${kbSize} KB | İçerdiği Maç Güncellemesi: ${eventCount}`);
        } catch(e) {
            console.log(`[VERİ ALINDI] +${Date.now() - startTime}ms | Boyut: ${kbSize} KB | (Parse Edilemedi)`);
        }
        
    } else if (msg === '2' || msg === '3') {
        console.log(`[KALP ATIŞI] (Ping/Pong)`);
    } else {
        console.log(`[SİSTEM MESAJI]: ${msg}`);
    }
});

ws.on('close', () => {
    console.log('[TEST] ⚠️ Bağlantı Koptu!');
    isAlive = false;
});

ws.on('error', (err) => {
    console.log('[TEST] ❌ HATA:', err.message);
});

// 1 dakika (60 saniye) sonra testi bitir
setTimeout(() => {
    console.log('\\n--- DOKTOR RAPORU (TEST SONUCU) ---');
    console.log(`Gözlem Süresi: 60 saniye`);
    console.log(`Toplam Socket Mesajı: ${messageCount}`);
    console.log(`Maç Verisi (Payload) Sayısı: ${payloadCount}`);
    
    if (payloadCount > 0) {
        console.log(`Ortalama Veri Akışı: Saniyede ${(payloadCount / 60).toFixed(2)} paket`);
    }
    
    console.log(`Bağlantı Kopması Yaşandı mı?: ${isAlive ? 'HAYIR (Sağlıklı)' : 'EVET (Sorunlu)'}`);
    console.log(`Son Gelen Veriden Geçen Süre: ${Date.now() - lastMessageTime}ms`);
    
    if (Date.now() - lastMessageTime > 30000 && isAlive) {
        console.log('⚠️ UYARI: Bağlantı açık ancak son 30 saniyedir veri gelmiyor. WebSocket donmuş olabilir.');
    } else if (isAlive && payloadCount > 10) {
        console.log('✅ DURUM: MÜKEMMEL! Veri akışı saniye saniye kesintisiz ve çok hızlı sağlanıyor.');
    }
    
    ws.close();
    process.exit(0);
}, 60000);
