const WebSocket = require('ws');

const ws = new WebSocket('wss://eu-swarm-newm.atekbet272.com/ws?language=tur', {
    headers: { 'Origin': 'https://atekbet272.com', 'User-Agent': 'Mozilla/5.0' }
});

ws.on('open', () => {
    ws.send(JSON.stringify({
        command: 'request_session',
        params: { site_id: 1, language: 'tur' },
        rid: 'req'
    }));
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.rid === 'req') {
        ws.send(JSON.stringify({
            command: 'get',
            params: {
                source: 'betting',
                what: {
                    game: ['id', 'team1_name', 'team2_name', 'start_ts'],
                    competition: ['name'],
                    region: ['name']
                },
                where: {
                    game: { type: { '$in': [0, 1] } }
                }
            },
            rid: 'check_games'
        }));
    } else if (msg.rid === 'check_games') {
        const sports = msg.data?.data?.sport || {};
        let totalGames = 0;
        const sampleGames = [];

        for (const sId in sports) {
            const sport = sports[sId];
            for (const rId in sport.region || {}) {
                const region = sport.region[rId];
                for (const cId in region.competition || {}) {
                    const comp = region.competition[cId];
                    for (const gId in comp.game || {}) {
                        const game = comp.game[gId];
                        totalGames++;
                        if (sampleGames.length < 10) {
                            sampleGames.push(`[${region.name} - ${comp.name}] ${game.team1_name} vs ${game.team2_name}`);
                        }
                    }
                }
            }
        }

        console.log(`TOTAL OYUN SAYISI: ${totalGames}`);
        console.log('Örnek Oyunlar:\n', sampleGames.join('\n'));
        ws.close();
        process.exit(0);
    }
});

setTimeout(() => process.exit(0), 10000);
