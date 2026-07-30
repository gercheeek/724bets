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
                    sport: ['id'], region: ['id']
                }
            },
            rid: 'regions'
        }));
    } else if (msg.rid === 'regions') {
        const sport = msg.data?.data?.sport || msg.data?.sport;
        const s1 = Object.values(sport)[0];
        const r1 = Object.values(s1.region)[0];
        ws.send(JSON.stringify({
            command: 'get',
            params: {
                source: 'betting',
                what: {
                    game: ['team1_name', 'team2_name', 'type'],
                    market: ['name', 'type_name', 'base'],
                    event: ['name', 'price']
                },
                where: { region: { id: r1.id }, game: { type: 1 } }
            },
            rid: 'live_games'
        }));
    } else if (msg.rid === 'live_games') {
        const comps = msg.data?.data?.competition || msg.data?.competition || {};
        Object.values(comps).forEach(comp => {
            Object.values(comp.game || {}).forEach(game => {
                console.log(`\n=== GAME: ${game.team1_name} vs ${game.team2_name} ===`);
                Object.values(game.market || {}).slice(0, 15).forEach(m => {
                    const evs = Object.values(m.event||{}).map(e=>`${e.name}:${e.price}`).join(' | ');
                    console.log(`Market [${m.type_name}] ${m.name} (base: ${m.base}): ${evs}`);
                });
                process.exit(0);
            });
        });
        // If we didn't exit, no live games in this region. Just exit anyway.
        process.exit(0);
    }
});
