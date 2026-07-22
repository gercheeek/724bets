const WebSocket = require('ws');

const ws = new WebSocket('wss://srv.tarafbet981.com/sport/?EIO=3&transport=websocket', {
    headers: {
        'Origin': 'https://tarafbet981.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'
    }
});

let liveMatches = [];

ws.on('open', () => {
    console.log('Connected to Tarafbet WS');
});

ws.on('message', (data) => {
    const msg = data.toString();
    if (msg === '2' || msg === 'ping') ws.send('3');
    if (msg.startsWith('0{')) {
        ws.send('40');
        setTimeout(() => {
            console.log('Sending subscriptions for Live matches...');
            ws.send('42["subscribe-Live",{"locale":"tr_TR"}]');
            ws.send('42["subscribe-LiveEvents",{"locale":"tr_TR"}]');
        }, 1000);
    }
    
    if (msg.startsWith('42[')) {
        try {
            const parsed = JSON.parse(msg.substring(2));
            const eventName = parsed[0];
            const payload = parsed[1];
            console.log('Received Event:', eventName);
            if (payload && (payload.events || payload.data?.events || Array.isArray(payload))) {
                const events = payload.events || payload.data?.events || (Array.isArray(payload) ? payload : []);
                if (events.length > 0) {
                    console.log(`FOUND ${events.length} REAL TARAFBET LIVE MATCHES!`);
                    events.forEach((ev, idx) => {
                        const d = ev.data || ev;
                        console.log(`${idx + 1}. ${d.team1 || d.participants?.home || 'Takım 1'} vs ${d.team2 || d.participants?.away || 'Takım 2'} | Skor: ${d.score1 || d.score?.home || 0}-${d.score2 || d.score?.away || 0} (${d.minute || d.match_time || 'Canlı'}) | Lig: ${d.league || d.tournament?.name || 'Lig'}`);
                    });
                    process.exit(0);
                }
            } else {
                console.log('Payload sample:', JSON.stringify(payload).substring(0, 300));
            }
        } catch (e) {
            console.error('Parse error:', e);
        }
    }
});

setTimeout(() => {
    console.log('Timeout waiting for Tarafbet live data.');
    process.exit(1);
}, 8000);
