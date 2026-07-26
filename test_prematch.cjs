const WebSocket = require('ws');

const ws = new WebSocket('wss://eu-swarm-newm.atekbet272.com/ws?language=tur');
let sId = '';

ws.on('open', () => {
    ws.send(JSON.stringify({ command: 'request_session', params: { site_id: 1, language: 'tur' }, rid: 'req_session' }));
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
                    game: ['id', 'team1_name', 'team2_name', 'start_ts'],
                    market: ['id', 'name', 'type_name'],
                    event: ['id', 'name', 'price']
                },
                where: {
                    game: { type: 0 } // Prematch
                }
            },
            rid: 'req_data'
        }));
    }
    
    if (msg.rid === 'req_data' && msg.data) {
        const fs = require('fs');
        fs.writeFileSync('prematch_payload.json', JSON.stringify(msg.data, null, 2));
        console.log('Saved prematch_payload.json.');
        process.exit(0);
    }
});
