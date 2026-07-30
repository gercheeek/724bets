const WebSocket = require('ws');
const ws = new WebSocket('wss://eu-swarm-newm.atekbet273.com/ws?language=tur');
ws.on('open', () => {
    ws.send(JSON.stringify({ command: 'request_session', params: { site_id: 1, language: 'tur' }, rid: 'req' }));
});
ws.on('message', (d) => {
    const msg = JSON.parse(d.toString());
    if (msg.rid === 'req') {
        ws.send(JSON.stringify({
            command: 'get',
            params: {
                source: 'betting',
                what: {
                    game: ['team1_name', 'team2_name'],
                    market: ['name', 'type_name', 'base'],
                    event: ['name', 'price']
                },
                where: { game: { type: 1 }, region: { id: 70001 } } // usually World or UEFA
            },
            rid: 'live'
        }));
    } else if (msg.rid === 'live') {
        console.log(JSON.stringify(msg.data, null, 2).substring(0, 3000));
        ws.close();
        process.exit(0);
    }
});
