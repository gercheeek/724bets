const WebSocket = require('ws');
const ws = new WebSocket('wss://eu-swarm-newm.atekbet273.com/ws?language=tur');
ws.on('open', () => {
    ws.send(JSON.stringify({ command: 'request_session', params: { site_id: 1, language: 'tur' }, rid: 'req' }));
});
ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.rid === 'req') {
        ws.send(JSON.stringify({
            command: 'get',
            params: {
                source: 'betting',
                what: {
                    game: ['id', 'team1_name', 'team2_name'],
                    market: ['id', 'name', 'type_name'],
                    event: ['id', 'name', 'price']
                },
                where: { game: { type: 1 } }
            },
            rid: 'live_data'
        }));
    } else if (msg.rid === 'live_data') {
        const sports = msg.data?.data?.sport || {};
        for (const sId in sports) {
            const sport = sports[sId];
            for (const rId in sport.region || {}) {
                for (const cId in sport.region[rId].competition || {}) {
                    for (const gId in sport.region[rId].competition[cId].game || {}) {
                        const game = sport.region[rId].competition[cId].game[gId];
                        console.log(`\n\n--- Game: ${game.team1_name} vs ${game.team2_name} ---`);
                        for (const mId in game.market || {}) {
                            const m = game.market[mId];
                            const evs = Object.values(m.event || {}).map(e => `${e.name}: ${e.price}`).join(', ');
                            console.log(`Market [${m.type_name}]: ${m.name} -> ${evs}`);
                        }
                        ws.close();
                        process.exit(0);
                    }
                }
            }
        }
    }
});
