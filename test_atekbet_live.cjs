const WebSocket = require('ws');

const ws = new WebSocket('wss://eu-swarm-newm.atekbet273.com/ws?language=tur');

ws.on('open', () => {
    ws.send(JSON.stringify({
        command: 'request_session',
        params: { site_id: 1, language: 'tur' },
        rid: 'req_session'
    }));
});

ws.on('message', (d) => {
    const msg = JSON.parse(d.toString());
    if (msg.rid === 'req_session') {
        ws.send(JSON.stringify({
            command: 'get',
            params: {
                source: 'betting',
                what: {
                    sport: ['id', 'name'],
                    region: ['id', 'name'],
                    competition: ['id', 'name'],
                    game: ['id', 'team1_name', 'team2_name', 'info', 'start_ts'],
                    market: ['id', 'name', 'type_name'],
                    event: ['id', 'name', 'price']
                },
                where: {
                    game: { type: 1 } // LIVE
                }
            },
            rid: 'req_data'
        }));
    }
    
    if (msg.rid === 'req_data' && msg.data) {
        const fs = require('fs');
        fs.writeFileSync('live_payload.json', JSON.stringify(msg.data, null, 2));
        console.log('Saved live_payload.json. Exiting...');
        process.exit(0);
    }
});
