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
                    market: ['name', 'type_name'],
                    event: ['name', 'price']
                },
                where: { game: { type: 1 } }
            },
            rid: 'live'
        }));
    } else if (msg.rid === 'live') {
        const sports = msg.data?.data?.sport || {};
        for (const sId in sports) {
            for (const rId in sports[sId].region || {}) {
                for (const cId in sports[sId].region[rId].competition || {}) {
                    for (const gId in sports[sId].region[rId].competition[cId].game || {}) {
                        const game = sports[sId].region[rId].competition[cId].game[gId];
                        console.log(`\nGame: ${game.team1_name} vs ${game.team2_name}`);
                        const markets = Object.values(game.market || {});
                        console.log(`Found ${markets.length} markets!`);
                        markets.slice(0, 50).forEach(m => {
                            const evs = Object.values(m.event || {}).map(e => `${e.name}=${e.price}`).join(', ');
                            console.log(`  - [${m.type_name}] ${m.name}: ${evs}`);
                        });
                        ws.close();
                        process.exit(0);
                    }
                }
            }
        }
    }
});
