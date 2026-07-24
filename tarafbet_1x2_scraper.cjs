const WebSocket = require('ws');

const ws = new WebSocket('wss://srv.tarafbet981.com/sport/?EIO=3&transport=websocket', {
    headers: {
        'Origin': 'https://tarafbet981.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)'
    }
});

ws.on('open', () => {
    console.log('🔗 Tarafbet Canlı Veri Akışına Bağlanıldı...');
});

const matches = {};

ws.on('message', (data) => {
    const msg = data.toString();
    if (msg === '2' || msg === 'ping') ws.send('3');
    
    if (msg.startsWith('0{')) {
        ws.send('40'); // Upgrade
        setTimeout(() => {
            console.log('📡 Canlı Maçlara Abone Olunuyor (Subscribe-LiveEvents)...');
            ws.send('42["subscribe-LiveEvents",{"locale":"tr_TR"}]');
        }, 1000);
    }
    
    if (msg.startsWith('42[')) {
        try {
            const parsed = JSON.parse(msg.substring(2));
            const payload = parsed[1];
            
            let events = [];
            if (payload && payload.events) events = payload.events;
            else if (payload && payload.data && payload.data.events) events = payload.data.events;
            else if (Array.isArray(payload)) events = payload;

            events.forEach(ev => {
                const id = ev.id || (ev.data && ev.data.id);
                if (!id) return;
                
                if (!matches[id]) matches[id] = {};
                
                const d = ev.data || ev;
                
                // Match Info
                if (d.participants) {
                    matches[id].home = d.participants.home || 'Ev Sahibi';
                    matches[id].away = d.participants.away || 'Deplasman';
                }
                
                if (d.sport) matches[id].sport = d.sport.name;
                
                // Date, Time and Status
                if (d.time) matches[id].date = d.time;
                if (d.minute !== undefined) matches[id].minute = d.minute;
                if (d.extended_status) matches[id].extended_status = d.extended_status;
                
                // Score
                if (d.current_score || (d.scores && d.scores.length > 0)) {
                    matches[id].score = d.current_score || (d.scores && d.scores[0]);
                }

                // Parse 1X2 or 12 Odds from group_markets strings
                if (d.group_markets) {
                    for (const groupKey in d.group_markets) {
                        // We usually want full_event odds
                        const marketArray = d.group_markets[groupKey];
                        
                        marketArray.forEach(marketStr => {
                            const parts = marketStr.split('|');
                            const marketType = parts[1]; // e.g. '1x2', '12', 'ah', 'ou'
                            const selectionsStr = parts[7]; // e.g. 40810498391~home~1.750~...
                            
                            // We only care about Match Winner (1x2) or Moneyline (12 for tennis/volleyball)
                            if ((marketType === '1x2' || marketType === '12') && groupKey.includes('full_event')) {
                                const selections = selectionsStr.split('!');
                                let odds1x2 = {};
                                
                                selections.forEach(sel => {
                                    const props = sel.split('~');
                                    const type = props[1]; // home, draw, away
                                    const price = props[2]; // 1.750
                                    
                                    if (type === 'home') odds1x2['1'] = price;
                                    if (type === 'draw') odds1x2['X'] = price;
                                    if (type === 'away') odds1x2['2'] = price;
                                });
                                
                                // Only update if we successfully parsed at least Home and Away
                                if (odds1x2['1'] && odds1x2['2']) {
                                    matches[id].odds = odds1x2;
                                    matches[id].marketType = marketType;
                                }
                            }
                        });
                    }
                }
            });
        } catch (e) {
            // ignore
        }
    }
});

// Print results every 4 seconds
setInterval(() => {
    let printed = 0;
    console.log('\n--- GÜNCEL CANLI MAÇLAR VE 1X2 ORANLARI ---');
    for (const id in matches) {
        const m = matches[id];
        // Only print matches that have found 1X2 odds
        if (m.home && m.odds) {
            const timeInfo = m.minute ? `${m.minute}. Dakika` : (m.extended_status || 'Canlı');
            console.log(`[${m.sport || 'Spor'}] ⏱️ Süre: ${timeInfo} | 🗓️ Başlangıç: ${m.date || '-'}`);
            console.log(`⚽ ${m.home} vs ${m.away} | Skor: ${m.score || '0:0'}`);
            if (m.odds['X']) {
                console.log(`💵 [1x2] ORANLAR -> 1: [${m.odds['1']}] | X: [${m.odds['X']}] | 2: [${m.odds['2']}]`);
            } else {
                console.log(`💵 [1-2] ORANLAR -> 1: [${m.odds['1']}] | 2: [${m.odds['2']}] (Beraberlik Yok)`);
            }
            console.log('--------------------------------------------------');
            printed++;
        }
        if (printed >= 8) break; // Print max 8 to not flood console
    }
    if (printed === 0) console.log('⏳ Henüz oran verisi çözümlenemedi...');
}, 4000);

setTimeout(() => {
    console.log('Test başarıyla tamamlandı. Kapatılıyor.');
    process.exit(0);
}, 15000);
